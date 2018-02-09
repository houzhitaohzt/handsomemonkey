/**
 * 历史记录
 * @flow
 * @author tangzehua
 * @sine 2017-10-13 15:18
 */
import i18n from './../../../../lib/i18n';
import React from 'react';
import Page from "../../../../components/Page";
import { DatePicker } from "antd";
import xt from '../../../../common/xt'

import moment from 'moment';

let defaultAvatar = require('../../assets/default.png');
import {API_FOODING_ES, API_FOODING_DS, API_FOODING_MESSAGE,apiGet, apiPost, apiForm} from "../../../../services/apiCall";
import ServiceTips, {errorTips} from "../../../../components/ServiceTips";
export default class extends React.PureComponent {

    constructor (props) {
        super(props);
        this.state = {
            content:{},
            list: [],
            selectUser: null,
            searchText: '',
            searchTime: moment().format('YYYY-MM-DD'),
            uri:"/singleChatLog/getPage",
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
        };
        this.lastTime = '';
    }

    componentDidMount(){
        this.getPages();
    }

    componentWillReceiveProps(nextProps){
        let that = this;
        that.lastTime = '';
        let {selectUser, drawerOpen} = nextProps;
        // if(drawerOpen && selectUser.id !== (this.state.selectUser || {}).id){
        if(drawerOpen && drawerOpen !== this.props.drawerOpen){
            this.setState({ selectUser, searchTime: moment().format('YYYY-MM-DD'), searchText: '', list: [] }, ()=> {
                that.getPages(1);
            });
        }
    }

    getPages = (currentPage, size) => {
        let that = this;
        that.lastTime = '';
        let { selectUser } = that.props;
        let {page,uri, searchTime} = that.state;
        currentPage = currentPage || page.currentPage;
        size = size || page.size;
        let params = Object.assign({},{
            currentPage,pageSize:size,title:this.state.searchText,
            startTime: searchTime + " 00:00:00",
            chatRoomId: selectUser.roomId
        });
        apiGet(API_FOODING_MESSAGE,uri,params, ({ data }) => {
            let list = data.data || [];
            let page = {
                size:data.pageSize,
                currentPage:data.currentPage,
                totalPages:data.totalPages || 0,
                totalRecords:data.totalRecords || 0
            };
            that.setState({page, list});
        },error => ServiceTips({text:error.message,type:'error'}),{isLoading:false})
    };

    onDatePicker = (a) => {
        this.setState({ searchTime: a.format('YYYY-MM-DD') }, ()=> {
            this.getPages(1);
        });
    };

    renderItem = (item, index)=> {
        let showTime = moment(item.createDate).format('YYYY-MM-DD');
        let st = showTime !== this.lastTime;
        this.lastTime = showTime;
        return (
            <div key={index}>
                {
                    st ? <div className='im-message-drawer-item-title'>
                            <span>{showTime}</span>
                        </div>: null
                }
                <div className='im-message-drawer-item-c'>
                    <div><img className='im-avatar' src={defaultAvatar}/></div>
                    <div>
                        <div className='im-message-drawer-item-ci'>
                            <span>{item.sender.staffLocalName}</span>
                            <span>{moment(item.createDate).format('LTS')}</span>
                        </div>
                        <span>{item.content}</span>
                    </div>
                </div>
            </div>
        )
    };

    render() {
        let { visible, selectUser } = this.props;
        let {page, list, searchTime} = this.state;
        return (
            <div className='scroll im-message-drawer'>
                <div className='scroll im-message-drawer-history'>
                    {list.map(this.renderItem)}
                </div>
                <div className='im-message-drawer-history-page'>
                    <div className='im-message-drawer-history-calendar'>
                        <i className="foddingicon fooding-calendar"/>
                        <span>{searchTime}</span>
                    </div>
                    <DatePicker onChange={this.onDatePicker} />
                    <Page totalPages={page.totalPages}
                          currentPage={page.currentPage}
                          totalRecords={page.totalRecords}
                          currentSize={page.size}
                          type={2}
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
