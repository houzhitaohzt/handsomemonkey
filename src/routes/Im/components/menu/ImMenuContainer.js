/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-10-13 15:18
 */
import React from 'react';
import xt from '../../../../common/xt'
import Page from "../../../../components/Page";
import {API_FOODING_ES, API_FOODING_DS, API_FOODING_MESSAGE,apiGet, apiPost} from "../../../../services/apiCall";
import ServiceTips, {errorTips} from "../../../../components/ServiceTips";

import Message from '../../../../lib/message';
import {emitter} from '../../../../common/EventEmitter';
import i18n from '../../../../lib/i18n';

//引入session数据
import WebData from '../../../../common/WebData';

let dataFmt = {sameDay: 'LT', nextDay: '[明天] LT', lastDay: '[昨天] LT', month: 'MM-DD LT', year: 'YYYY-MM-DD LT', week: 'dddd LT'};
export default class extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
            list:[],
            uri:"/message/all/getPage"
        }
    }

    onKeyDown = (event) => {
        event.keyCode === 13 && this.onSearch();
    };

    onSearch = () => {
        this.getPages(1);
    };

    onSearchChange = (event) => {
        let value = event.target.value;
        this.setState({searchText: value});
    };

    onOpenDetail = (item, event)=> {
        let {item: menuItem, open} = this.props;
        if(this.props.item.type == 1){ //系统消息
            //将未读改为已读 要是已读,就不用发websock消息通道
            if(item.status != 3){
                item.status = 3;
                Message.markMessageReaded(item.id);
                item.messageStatus = {
                    id: 3, name: i18n.t(200769/*已读*/)
                };
            }
        }else if(this.props.item.type == 2){//收到的广播
            open(menuItem, item);
            event.stopPropagation();
            event.preventDefault();
            item.status = 3;
            item.messageStatus = {
                id: 3, name: i18n.t(200769/*已读*/)
            };
        }else{
            open(menuItem, item);
            event.stopPropagation();
            event.preventDefault();
        }
    };

    getPages = (currentPage, size) => {
        let that = this;
        let {page,uri} = this.state;
        currentPage = currentPage || page.currentPage;
        size = size || page.size;
        let params = Object.assign({},{currentPage,pageSize:size,content:this.state.searchText,column:'receivers.status',order:"asc"});
        apiGet(API_FOODING_MESSAGE,uri,params,response => {
            let list = response.data.data || [];
            let page = {
                size:response.data.pageSize,
                currentPage:response.data.currentPage,
                totalPages:response.data.totalPages || 0,
                totalRecords:response.data.totalRecords || 0
            };
            that.setState({page,list});
        },error => ServiceTips({text:error.message,type:'error'}),{isLoading:false})
    };

    renderTitle = () => {
        let {item} = this.props;
        let {searchText} = this.state;
        return (
            <div className='im-menu-container-title'>
                <div><span className='noLineFeed'>{item.name}</span></div>
                <div>
                    <div className='im-menu-container-input'>
                        <input type='text' onKeyDown={this.onKeyDown} onChange={this.onSearchChange} value={searchText}/>
                        <i className='foddingicon fooding-search_32 search' onClick={this.onSearch}/>
                    </div>
                    {item.type !== 1 && <div onClick={this.props.onCreateRadio}><i className={`foddingicon fooding-airing-edit`}/></div>}
                </div>
            </div>
        )
    };

    //系统消息
    renderItemTempSystem = (item, index) => {
        // let msg = "物流订单(<a href=\"javascript:navTabs.open('订舱单详情','/booking/detail?id=1838');\">LS1710090007销售单号SC1710090002</a>) 审批(APPROVE) ";
        let msg = `${item.text}`;
        return (
            <div className='im-menu-container-item-c0'>
                <div className='im-menu-container-item-c1'>
                    {item.status == 2?<span className='im-new-tags'/>:null}
                    <span className='noLineFeed' dangerouslySetInnerHTML={{__html: msg}} ref={this.itemRef}/>
                </div>
                <div className='im-menu-container-item-c3'>
                    <span>{xt.date.formatCalendarNow(item.scheduleSendTime, dataFmt)}</span>
                </div>
            </div>
        )
    };

    //我收到的广播
    renderItemTempAiring = (item, index) => {
        //let userID = item.member && item.member.userId ? item.member.userId:"";
        //let receUserID = item.receivers && item.receivers.userId ? item.receivers.userId:"";
        // let msg = "销售订单(<a href=\"javascript:navTabs.open('采购需求', '/pruchaseneed/list?sourceNo=SC1710240005');\">SC1710240005</a>) 产品(蔗糖脂肪酸酯) 采购数量(330MT)";
        let msg = `${item.content}`;
        return (
            <div className='im-menu-container-item-c0'>
                <div className="im-menu-container-item-c2">
                    <div className='im-menu-container-item-c1'>
                        {item.status == 2?<span className='im-new-tags'/>:null}
                        <span className='noLineFeed' dangerouslySetInnerHTML={{__html: msg}}/>
                    </div>
                    <div className='im-menu-container-item-row-line '/>
                    <div className='im-menu-container-item-cc'>
                        <i className='foddingicon fooding-airing-dynamic'/>
                        <span style={{paddingLeft: '4px', color: '#999'}}>共{item.replyCount}条动态</span>
                    </div>
                </div>
                <div className='im-menu-container-item-c4'>
                    <span>{item.receivers && item.member.staffLocalName ? item.member.staffLocalName :"" }</span>
                </div>
                <div className='im-menu-container-item-c3'>
                    <span>{xt.date.formatCalendarNow(item.sendDate, dataFmt)}</span>
                </div>
            </div>
        )
    };

    //我发出的 广播
    renderItemSendAiring = (item,index) => {
        let userID = item.member && item.member.userId ? item.member.userId:"";
        let msg = `${item.content}`;
        return (
            <div className='im-menu-container-item-c0'>
                <div className="im-menu-container-item-c2">
                    <div className='im-menu-container-item-c1'>
                        <span className='noLineFeed' dangerouslySetInnerHTML={{__html: msg}}/>
                    </div>
                    <div className='im-menu-container-item-row-line '/>
                    <div className='im-menu-container-item-cc'>
                        <i className='foddingicon fooding-airing-dynamic'/>
                        <span style={{paddingLeft: '4px', color: '#999'}}>共{item.replyCount}条动态</span>
                    </div>
                </div>
                <div className='im-menu-container-item-c4'>
                    <span>{item.receivers && item.member.staffLocalName ? item.member.staffLocalName :"" }</span>
                </div>
                <div className='im-menu-container-item-c3'>
                    <span>{xt.date.formatCalendarNow(item.sendDate, dataFmt)}</span>
                </div>
            </div>
        )
    };

    renderItem = (item, index) => {
        let {item: menuItem} = this.props;
        let component = null;
        switch (menuItem.type) {
            case 1:
               component = this.renderItemTempSystem(item, index);
                break;
            case 2:
                component = this.renderItemTempAiring(item, index);
                break;
            case 3:
                component = this.renderItemSendAiring(item, index);
        }
        return (
            <div className='im-menu-container-item' key={index} onClick={this.onOpenDetail.bind(this, item)}>
                <i className={`foddingicon ${menuItem.icon}`}/>
                {component}
            </div>
        )
    };

    renderList = () => {
        return (
            <div className='scroll im-menu-container-center'>
                {this.state.list.map(this.renderItem)}
            </div>
        )
    };

    componentDidMount(){
        this.getPages();
    }

    componentWillReceiveProps(nextProps){
        let {item,visible} = nextProps;
        if(visible && visible !== this.props.visible){
            let urii = "/message/all/getPage";
            if(item.type === 1){
                urii = "/message/all/getPage";
            }else if(item.type === 2){
                urii = "/broadcast/getPage";
            }else if(item.type === 3){
                urii = "/broadcast/getSendPage";
            }else{
                urii = "/message/all/getPage";
            }
            this.setState({uri:urii},() => this.getPages(1));
        }
    }

    itemRef = (ref)=> {
        if(!ref || !ref.children) return;
        let children = ref.children;
        children && Array.from(children).forEach(child => {
            if(child.tagName === "A"){
                child.onclick = ()=> emitter.emit("IM-VisibleEmit", false)
            }else{
                let ahref = child.querySelector("a");
                ahref && (ahref.onclick = ()=> emitter.emit("IM-VisibleEmit", false))
            }
        });
    };

    render() {
        let {item, visible} = this.props;
        let {page} = this.state;
        return (
            <div className='im-menu-container' style={{display: visible ? 'inherit' : 'none'}}>
                {this.renderTitle()}
                {this.renderList()}
                <div className='im-menu-container-page'>
                    <Page totalPages={page.totalPages}
                          currentPage={page.currentPage}
                          totalRecords={page.totalRecords}
                          currentSize={page.size}
                          pageSizeChange={(value) => {
                              this.state.page.size !== value && this.getPages(1, value);
                          }}
                          backClick={(v) => {
                              this.state.page.currentPage !== v && this.getPages(v);
                          }}
                          nextClick={(v) => {
                              this.state.page.currentPage !== v && this.getPages(v);
                          }}
                          goChange={(v) => {
                              this.state.page.currentPage !== v && this.getPages(v);
                          }}
                    />
                </div>
            </div>
        );
    }
}
