import i18n from './../../lib/i18n';
import React, {PureComponent} from "react";
import {connect} from "react-redux";
import {browserHistory, Link, withRouter} from "react-router";
import NavigateTabs from "../NavigateTabs/containers/Container";
import {mapDispatchToProps, mapStateToProps} from "../NavigateTabs/components/Dispatch";
import  Confirm from  '../Dialog/Confirm';
import "../NavigateTabs/components/tab-item.less";
import "../../styles/font.less";
import LogImage from "./assets/logo.png";
import moment from 'moment';
import DialogHome from "./DialogHome";
import Tip1 from "./TipHome";
import "./assets/index.less";
import NavigateControl from "./NavigateControl";
import FrameControl from '../IFrame/FrameControl';
import {emitter} from "../../common/EventEmitter";
import WebData from "../../common/WebData";
import Message from '../../lib/message';
import xt from '../../common/xt';
import {API_FOODING_MAIL_SERVER, API_FOODING_MESSAGE} from '../../services/apiCall';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_MAIL,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../services/apiCall";
import ServiceTips from '../ServiceTips';
import { notification } from 'antd';
import Notice from './../../lib/Notice';
import MessageTpl from './message.js'; // 消息提醒
export class Header extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0,
            left: 0,
            navVisible: false,
            msgCount: 0,
            searchBox: false,

            resultAjax: false,
            fastMenu:[], // 快速菜单
            fastMenuResult:[],
            fontSize: WebData.fontSize,
            emailCount:0,
        };
        moment.locale(i18n.getLang());
        this.onUnload = this.onUnload.bind(this);
        this.emaliClick = this.emaliClick.bind(this);
        this.messageClick = this.messageClick.bind(this);
        this.tabsDivRef = null;
        this.navControlWidth = 20;
        this.navRightWidth = 35;
        this.navNoUpdate = true;
        this.initFontSize();

        this.autoReceiveDt = null;
    }

    getAllTabsDom = ()=>{
        return Array.from(xt.getItemValue(this.tabsDivRef, 'firstChild.childNodes'));
    };


    leftItemClick = ()=>{
        this.tabsRight();
    };

    rightItemClick = ()=>{
        this.tabsLeft();
    };

    tabsPosState = offWidth => {
        let left = this.state.left - offWidth;
        if(left > 0) left = 0;
        if(left === this.state.left) return;
        this.setState({left});
    };

    messageClick = () => {
        // window.navTabs.open("消息", "/message/list/1", {}, {refresh: true})
        this.openIM(true);
    };

    emaliClick(){
        // window.navTabs.open(i18n.t(100586/*邮件*/), "/email");
        window.navTabs.open(i18n.t(100586/*邮件*/), "/mail");
    }

    tabsRight = () => {
        //是否在右边
        let divWidth = this.tabsDivRef.offsetWidth;
        let liRefAry = this.getAllTabsDom();
        for (let i = 0, j = liRefAry.length; i < j; i ++){
            let dom = liRefAry[i];
            if(dom){
                let ULWidth = dom.offsetLeft + dom.offsetWidth;
                let offWidth = ULWidth + this.state.left - divWidth + this.navRightWidth;
                if(offWidth > 0){
                    this.tabsPosState(offWidth);
                    return;
                }
            }
        }
    };

    tabsLeft = () => {
        //是否在左边
        let liRefAry = this.getAllTabsDom().reverse();
        for (let i = 0, j = liRefAry.length; i < j; i ++){
            let dom = liRefAry[i];
            if(dom){
                let ULWidth = dom.offsetLeft;
                let offWidth = this.state.left + ULWidth;
                if(offWidth < 0){
                    this.tabsPosState(offWidth);
                    return;
                }
            }
        }
    };

    currentTabsLeft = props => {
        let currentIndex = props.tabs.findIndex(da => da.id === props.currentTab);
        let currentRef = this.getAllTabsDom()[currentIndex];
        if( !currentRef) {
            this.navNoUpdate = true;
            return;
        }

        //先判断是否在左边
        let offWidth = currentRef.offsetLeft + this.state.left;
        if(offWidth < 0){
            // console.log("在左边", this.state.left - currentRef.offsetWidth);
            this.tabsPosState(offWidth);
        } else {
            let divWidth = this.tabsDivRef.offsetWidth;
            let ULWidth = currentRef.offsetLeft + currentRef.offsetWidth;
            offWidth = ULWidth + this.state.left - divWidth + this.navRightWidth;
            if(offWidth > 0){
                // console.log("在右边", this.state.left - offWidth);
                this.tabsPosState(offWidth);
            }
        }
        this.renderNavigate();
    };

    renderNavigate = ()=>{
        let navVisible = false;
        if(this.tabsDivRef){
            let allWidth = 0;
            this.getAllTabsDom().forEach(da => allWidth += da.offsetWidth);
            if (this.tabsDivRef.offsetWidth < allWidth){
                navVisible = true;
            }
        }
        if(navVisible !== this.state.navVisible){
            this.setState({navVisible, left: navVisible? this.state.left : 0});
        }
    };

    componentWillReceiveProps(props) {
        if(props.currentTab !== this.props.currentTab){
            emitter.emit("CURRENT_TAB_CHANGE", props.currentTab, this.props.currentTab);
        }
        this.currentTabsLeft(props);
    }

    saveInfo = ()=>{
        let {tabs, currentTab, tabsBak} = this.props, temp = {};
        if( !WebData.user) return;

        temp['tabs_' + WebData.user.data.id + "_" + i18n.getLang()] = tabs.map((tab, index) => {
            if (tab.component !== tab.name) {
                tab.component = tab.name;
            }
            return tab;
        });
        temp.currentTab = currentTab === -1 ? 0: currentTab;
        temp.tabsBak = tabsBak;
        try {
            localStorage.setItem('tabs', JSON.stringify(temp));
        } catch (e) {
            localStorage.setItem('error', JSON.stringify(e));
        }
    };

    onUnload(event) {
        this.saveInfo();
        //界面刷新或者离开时弹出提示
        // event.returnValue = "vince";
        return "vince123";
    }

    componentDidUpdate() {
        let that = this;
        if (this.navNoUpdate) {
            this.navNoUpdate = false;
            this.currentTabsLeft(this.props);
        }
    }

    componentDidMount() {
        Notice.request();
        window.addEventListener("beforeunload", this.onUnload);
        this.currentTabsLeft(this.props);
        this.initMessage();
        emitter.on("storage-remove", this.onStorageRemove);
    }

    componentWillUnmount() {
        clearInterval(this.autoReceiveDt);
        window.removeEventListener("beforeunload", this.onUnload);
        this.saveInfo();
        Message.disconnect();

        emitter.off("storage-remove", this.onStorageRemove);

        emitter.off("fetchMessageCountStream", this.fetchMessageCountStream);
        emitter.off("fetchChatMessageStream", this.fetchChatMessageStream);
        emitter.off("fetchBroadCastStream", this.fetchBroadCastStream);

        emitter.off("WD-totalChatCount", this.messageCount);
        emitter.off("WD-sysMsgCount", this.messageCount);
        emitter.off("WD-broadcastCount", this.messageCount);
        emitter.off('fetchUserLogoutStream', this.fetchUserLogoutStream);
    }

    initMessage = ()=> {
        let that = this;
        if(WebData.user){
            Message.connect(API_FOODING_MESSAGE + '/ws').then(()=> {
                Message.init();
                Message.getUnReadSysMessages().then(that.fetchMessageCountStream).catch(e => console.log(e));
                Message.getUnReadBroadcastMessages().then(count => WebData.broadcastCount = count);
                Message.getUnReadChatMessages().then(count => WebData.totalChatCount = count);
            }  );
            that.autoReceiveEmail();
            that.autoReceiveDt = setInterval(that.autoReceiveEmail, 10*60*1000);
        }

        //系统消息数量
        emitter.on("fetchMessageCountStream", this.fetchMessageCountStream);
        //聊天消息数量
        emitter.on("fetchChatMessageCountStream", this.fetchChatMessageCountStream);
        //广播数量
        emitter.on("fetchBoradcastCountStream", this.fetchBoradcastCountStream);

        //聊天消息
        emitter.on("fetchChatMessageStream", this.fetchChatMessageStream);
        //登出-被踢
        emitter.on('fetchUserLogoutStream', this.fetchUserLogoutStream);

        //广播消息
        // emitter.on("fetchBroadCastStream", this.fetchBroadCastStream);

        emitter.on("WD-totalChatCount", this.messageCount);
        emitter.on("WD-sysMsgCount", this.messageCount);
        emitter.on("WD-broadcastCount", this.messageCount);

    };

    fetchUserLogoutStream = (data)=> {
        if(String(data.sessionId) === String(WebData.token)){
            WebData.logout();
            alert(data.content);
            location.href = '/user/login';
        }
    };

    messageCount = ()=> {
        let msgCount = WebData.totalChatCount + WebData.sysMsgCount + WebData.broadcastCount;
        this.setState({ msgCount});
    };

    //系统消息数量
    fetchMessageCountStream = (count)=> {
        WebData.sysMsgCount = count;
    };

    //聊天消息数量
    fetchChatMessageCountStream = (count)=> {
        WebData.totalChatCount = count;
    };

    //广播数量
    fetchBoradcastCountStream = (count)=> {
        WebData.broadcastCount = count;
    };


    //聊天消息
    fetchChatMessageStream = (data)=> {
        let that = this;
        // console.log("收到消息: ", data);
        Notice.open({
            title: data.sender.staffLocalName,
            message: data.content,
            icon: require('../../routes/Im/assets/default.png'),
            duration: 5, // 延时关闭
            onClick: ()=> that.openIM(true)
        });
        // Message.getUnReadChatMessages().then(count => WebData.totalChatCount = count);
    };

    openIM = (visible = true)=> {
        emitter.emit("IM-VisibleEmit", visible);
    };

    // 其他界面退出
    onStorageRemove = (key) => {
        if(key === 'CONST_USER'){
            location.href = '/user/login';
        }
    };

    //广播消息
    // fetchBroadCastStream = (data)=> {
    //     console.log("广播", data);
    //     Message.getUnReadBroadcastMessages().then( count => WebData.broadcastCount = count);
    // };

    autoReceiveEmail = ()=>{
        let emails = xt.getItemValue(WebData.user, 'data.staff.contacts', []);
        console.group("<<自动收邮件>>");
        emails.forEach(da => {
            if (da.linkTyId === 80){
                //邮箱

                // apiGet(API_FOODING_MAIL_SERVER, '/autoReceive', {email: da.name},
                //     response => {}, error=>{}, {isLoading: false});
                // console.log("email: " + da.name)
            }
        });
        console.groupEnd();
        apiGet(API_FOODING_MAIL,'/getUnreadCount',
            {email:xt.getItemValue(WebData.user, 'data.staff.emailAddress',null)},
            (response)=>{
               this.setState({emailCount:response.data || 0});
        },(error)=>{

        },{isLoading:false});
    };

    // 搜索框 获焦
    searchFocus = ()=>{
        this.setState({searchBox:true});
        let that = this;
        apiGet(API_FOODING_ES,'/menu/getRecentOftenMenu',{},
            (response)=>{
                that.setState({
                    fastMenu: response['data'].length ? response['data'] : [{name:"无记录"}],
                    // resultAjax: true
                });
            },(error)=>{
                ServiceTips({text:error.message,type:'error'});
            }, {isLoading: false}
        );
    };

    // 搜索框 失焦
    searchBlur = ()=>{
        let that = this;
        setTimeout(function() {
            that.setState({searchBox:false});
        },300);
    };

    // 搜索 输入
    searchKeyUp = (e)=>{
        let v = (e.target.value).replace(/(^\s*)|(\s*$)/g, "");
        let result = this.state['fastMenu'].filter(o=>Number.parseInt( o['name'].indexOf(String(v))  )+1)   ;
        this.setState({ fastMenuResult: result['length'] ? result : [{name:'无记录'}] });
    };

    mouseLeave = (e)=>{
        this.setState({searchBox: false});
    };

    // 跳转到 指定页面
    fastMenuhandle = (o)=>{
      if(!o['url']) return;
      this.props.actions.addTabs({name: o.localName, component: o.localName, url: o.url});
      browserHistory.push(o.url);
    };

    initFontSize = ()=>{
        let size = this.state.fontSize;
        let className = "fooding-font-a";
        if(size === 14){
            className = "fooding-font-b";
        }
        document.querySelector('html').className = className;
    };

    onChangeFontSize = ()=>{
        let size = this.state.fontSize;
        let className = "fooding-font-a";
        console.log(size)
        if(size === 12){
            WebData.fontSize = size = 14;
            className = "fooding-font-b";
        } else {
            WebData.fontSize = size = 12;
        }
        this.setState({fontSize: size});
        document.querySelector('html').className = className;
    };

    imgLinkClick = () => {
        window.open(window.location.origin + "/user/login")
    };

    render() {
        let that = this;
        let {tabs, actions, currentTab} = this.props;
        let {searchBox,fastMenu,fastMenuResult} = this.state;

        if (null == currentTab) {
            currentTab = this.state.currentTab;
        }
        return (
            <div className={'tab-header'}>
                <div className='head-bg'>
                    <MessageTpl />
                    <div>
                        <span className='logo fl' to='/user/login' onClick={this.imgLinkClick} style={{cursor:'pointer'}}>
                            <img src={LogImage} alt='logo'/>
                        </span>
                    </div>
                    {
                        //TODO dev
                        WebData.foodingHostName !== location.host ?
                            <div style={{display: 'inline-block', fontSize: 28, color: '#fff'}}>API => {WebData.foodingHostName}</div>
                            : null
                    }
                    <div className="fontSize noselect">
                        <label onClick={this.onChangeFontSize}>{this.state.fontSize === 14? "A-": "A"}</label>
                    </div>
                    <div className="user-link">
                        <ul>
                            <li><DialogHome actions={actions}/></li>
                            <li onClick={this.messageClick}>
                                <div className={'header-search'}><Tip1 class1={"fooding-message_32 foddingicon"} class2={"bottomRight"}
                                                                       num={2}/></div>
                                {this.state.msgCount?<sub style={{color: '#fff'}}>{Math.min(this.state.msgCount, 99)}</sub>: null}
                            </li>
                            <li onClick = {this.emaliClick}>
                                <div className={'header-search'}><i className="fooding-email_32 foddingicon"/></div>
                                {
                                    this.state.emailCount?<sub>{this.state.emailCount>99?'99+':this.state.emailCount}</sub>:''
                                }</li>
                            <li>
                                <div className={'header-search'}><Tip1 saveInfo={this.saveInfo} class1={"fooding-user_32 foddingicon"} class2={"bottomRight"}
                                                                       num={3}/></div>
                            </li>
                            <li className={'header-search'}><i className="fooding-help_32 foddingicon"/></li>
                        </ul>
                    </div>
                    <div className="searchBox" onMouseLeave={this.mouseLeave}>
                        {/*<input onKeyUp={this.searchKeyUp} onFocus={this.searchFocus} onBlur={this.searchBlur} type="text" placeholder="常用菜单..."/>*/}
                        <i onClick={this.searchFocus} className="foddingicon fooding-lishi"></i>
                        { (searchBox) ?
                            <div>
                                <ul>
                                    { (fastMenuResult.length ? fastMenuResult : fastMenu).map((o,i)=><li key={i} onClick={that.fastMenuhandle.bind(that,o)}>{o['name']}</li>) }
                                </ul>
                            </div>
                            :
                            ''
                        }
                    </div>
                </div>
                <div className='nav'>
                    <div style={{ left: '16px', right: '16px', position: 'absolute', display: 'block'}} ref={rf=>this.tabsDivRef = rf}>
                        <NavigateTabs tabs={tabs} currentTab={currentTab} left={this.state.left}/>
                    </div>

                    <NavigateControl rightItemClick={this.rightItemClick} leftItemClick={this.leftItemClick}
                                     tabs={tabs} currentTab={currentTab}
                                     visible={this.state.navVisible} navWidth={this.navControlWidth}/>
                    <FrameControl/>
                </div>
            </div>
        )
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))
