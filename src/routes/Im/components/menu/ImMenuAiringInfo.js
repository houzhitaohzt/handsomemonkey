import i18n from './../../../../lib/i18n';
/**
 *
 * @flow
 * @author tangzehua
 * @sine 2017-10-13 15:18
 */
import React from 'react';
import ImMenuConcat from './ImMenuConcat';
import ImMenuReply from "./ImMenuReply";
import xt from '../../../../common/xt'

let defaultAvatar = require('../../assets/default.png');
let dataFmt = {
    sameDay: 'LT',
    nextDay: '[明天] LT',
    lastDay: '[昨天] LT',
    month: 'MM-DD LT',
    year: 'YYYY-MM-DD LT',
    week: 'dddd LT'
};
import {
    API_FOODING_ES,
    API_FOODING_DS,
    API_FOODING_MESSAGE,
    API_FOODING_OA,
    apiGet,
    apiPost,
    apiForm
} from "../../../../services/apiCall";
import ServiceTips, {errorTips} from "../../../../components/ServiceTips";
import {emitter} from '../../../../common/EventEmitter';

import {BUSINESSTYPE} from "./ImMenuNewRadio";

export default class extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            content: {},
            fileList: [],
            replyRadioList:[]
        }
    }

    componentDidUpdate() {
        if (this.detail) {
            let children = this.detail.children;
            children && Array.from(children).forEach(child => {
                if(child.tagName === "A"){
                    child.onclick = ()=> emitter.emit("IM-VisibleEmit", false)
                }else{
                    let ahref = child.querySelector("a");
                    ahref && (ahref.onclick = ()=> emitter.emit("IM-VisibleEmit", false))
                }
            });
        }
    }

    getDetailContent = broadcastId => {
        if (!broadcastId) return;
        let that = this;
        apiForm(API_FOODING_MESSAGE, '/broadcast/updateUserStatus', {broadcastId: broadcastId}, response => {
            let content = response.data || {};
            that.setState({content});
        }, error => ServiceTips({text: error.message, type: 'error'}), {isLoading: false})
    };

    /**
     * 拉取上传文件列表
     * */
    getFileRadioList = broadcastId => {
        let that = this;
        apiGet(API_FOODING_OA, '/fastdfs/getList', {businessId: broadcastId, businessType: BUSINESSTYPE}, response => {
            let fileList = response.data.data || [];
            that.setState({fileList})
        }, error => ServiceTips({text: error.message, type: 'error'}))
    };

    /**
     * 拉取 回复列表
     * */
    getReplyRadioList = broadcastId => {
        let that = this;
        apiGet(API_FOODING_MESSAGE, '/reply/getReplyByBoradcastId', {broadcastId}, response => {
            let replyRadioList = response.data || [];
            that.setState({replyRadioList})
        }, error => ServiceTips({text: error.message, type: 'error'}))
    };

    componentWillReceiveProps(nextProps) {
        let {singleItem, drawerOpen} = nextProps;
        if (drawerOpen && singleItem.id !== this.props.singleItem.id) {
            drawerOpen && this.getDetailContent(singleItem.id);
            drawerOpen && this.getFileRadioList(singleItem.id);
            drawerOpen && this.getReplyRadioList(singleItem.id);
        }
    }

    renderFileDown = () => {
        return (<div className="file-down">
            {
                this.state.fileList.map((e, i) => {
                    return (
                        <div className="file-down-own" key={i}>
                            <div className="word">
                                <h4>{e.fileName}</h4>
                                <h5>{e.length || "0KB"}</h5>
                            </div>
                            <a href={API_FOODING_OA + "/fastdfs/download?fileName=" + e.fileName + "&fullPath=" + e.fullPath}><i
                                className='foddingicon fooding-download2'></i></a>
                        </div>
                    )
                })
            }
        </div>)
    };

    renderContainer = () => {
        let {item, singleItem} = this.props;
        let {content} = this.state;
        // let msg = "销售订单(<a href=\"javascript:navTabs.open('采购需求', '/pruchaseneed/list?sourceNo=SC1710240005');\">SC1710240005</a>) 产品(蔗糖脂肪酸酯) 采购数量(330MT)";
        let msg = `${singleItem.content}`;
        return (
            <div className='im-menu-drawer-container'>
                <span dangerouslySetInnerHTML={{__html: msg}} ref={rf => this.detail = rf}/>
                {this.renderFileDown()}
                <div>
                    <img className='im-avatar' src={defaultAvatar}/>
                    <span
                        className='noLineFeed'>{singleItem.receivers && singleItem.member.staffLocalName ? singleItem.member.staffLocalName : ""}</span>
                    <span>{xt.date.formatCalendarNow(singleItem.sendDate, dataFmt)}</span>
                </div>
            </div>
        )
    };

    /**
     * onSave 广播回复
     * */
    onSend = content => {
        let that = this;
        let {singleItem, drawerOpen} = this.props;
        apiForm(API_FOODING_MESSAGE, '/reply/save', {broadcastId: singleItem.id, content}, response => {
           ServiceTips({text:response.message, type:'success'});
           that.getReplyRadioList(singleItem.id);
        }, error => ServiceTips({text: error.message, type: 'error'}), {isLoading: false})
    };

    render() {
        let {item, visible, openMessage} = this.props;
        return (
            <div className='scroll im-menu-drawer im-menu-drawer-system-info'>
                <div className='im-menu-drawer-title'>
                    <i className='foddingicon fooding-broadcast'/>
                    <span style={{color: '#2095F2'}}>{i18n.t(200767/*广播*/)}</span>
                </div>
                {this.renderContainer()}
                <ImMenuConcat openMessage={openMessage} content={this.state.content}/>
                <ImMenuReply replyRadioList={this.state.replyRadioList}/>
                <div/>
            </div>
        );
    }
}
