import i18n from './../../../lib/i18n';
import React, {Component} from "react";
import {I18n} from "../../../lib/i18n";
import {Link, browserHistory} from 'react-router';
import WebData from "../../../common/WebData";
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, pageSize, sizeList} from '../../../services/apiCall';
import NavConnect from "../../../components/NavigateTabs/containers/AddContainer";
import Dialog from '../../../components/Dialog';
import HeaderIndex from "../../LoginDetail/components/HeaderIndex";

import ServiceTips, {errorTips, successTips} from '../../../components/ServiceTips';

const singleNav = obj => {
    let NavList = []; //导航栏为空数组
    /*
    * len = 2 为一时,表示是产品名称,跳转页面是 user/loginList/
    *
    * len = 1 时, 表示当前是产品分类的最后一级,下一级是产品名称了
    * name = i18n.t(500289*/
    /*成品分组*/
    /*) 或 "All Category"
        *
        * */
    let digui = function (obj, localName, id, len) {
        NavList.unshift({
            name: obj.parentId ? localName : i18n.t(200172/*产品分类*/),
            id: id,
            len: obj.parentId ? len : -2
        });
        if (obj.parent) digui(obj.parent, obj.parent.localName, obj.parent.id, 0);
    };
    if (obj.mtlTypes && obj.mtlTypes.length) {
        let mtlTypeObj = obj.mtlTypes[0];
        NavList.unshift({name: mtlTypeObj.localName, id: mtlTypeObj.id, len: 2});
        NavList.unshift({name: obj.localName, id: obj.id, len: 1});
    } else {
        NavList.unshift({
            name: obj.parentId ? obj.localName : i18n.t(200172/*产品分类*/),
            id: obj.id,
            len: obj.parentId ? 0 : -2
        });
    }
    if (obj.parent) digui(obj.parent, obj.parent.localName, obj.parent.id, 0);
    NavList.unshift({name: I18n.t(300080/*首页*/), id: "", len: -1});
    return NavList;
};

class LoginOneStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            navObj: {}, //导航列表
            visible: false,
            dialogContent: <div></div>
        }
    }

    //点击更多和 查看价格 提示他们跳转到登录页面
    onLinkClick = () => {
        let LoginDialog = require("../../LoginDetail/components/LoginDialog").default;
        let content = React.createElement(LoginDialog, {onCancel: this.onCancel});
        this.setState({
            visible: true,
            dialogContent: content
        })
    };
    onCancel = () => {
        this.setState({visible: false});
    };
    getPages = () => {
        apiGet(API_FOODING_DS, '/fc/portal/dataMulDiv2/getAllDataTree', {}, (response) => {
            let data = response.data || [];
            this.setState({data})
        }, error => {
            // ServiceTips({text: error.message, type: 'error'});
        });
    };
    getInitNav = () => {
        let that = this;
        apiGet(API_FOODING_DS, "/fc/portal/dataMulDiv2/getNav", {dataMulDiv2Id: this.props.location.query.id}, response => {
            let navObj = response || {};
            that.setState({navObj});
        }, error => {
        })
    };
    //导航栏页面链接
    onNavLink = (obj, e) => {
        if (obj.len == -1) {
            browserHistory.push("/user/login");
        } else {
            browserHistory.push({pathname: "/user/loginonestep", query: {id: obj.id, name: obj.localName}});
        }
    };
    //点击链接跳转
    LinkClick = (obj) => {
        browserHistory.push({pathname: "/user/logintwostep", query: {id: obj.id, name: obj.localName}});
    };

    handleResize(height) {
        let sch = document.body.offsetHeight - height;
        let scroll = sch - 120;
        this.setState({scrollHeight: sch + 'px', scroll: scroll + 'px'});
    };

    componentDidMount() {
        this.getPages();
        this.getInitNav();
        window.addEventListener('resize', this.handleResize(120));
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(120));
    }

    componentWillReceiveProps(nextPorps) {
        this.handleResize(120);
        window.addEventListener('resize', this.handleResize(120));
    }

    render() {
        let {data, navObj} = this.state;
        let List = singleNav(navObj);
        let dom = List.map((e, i) => {
            return i === List.length - 1 ?
                (<span key={i} className={"loginadvice-index-navheader-single"}
                       onClick={this.onNavLink.bind(this, e)}><a
                    className={"loginadvice-index-navheader-single-link"}>{e.name}</a></span>)
                :
                (<span key={i}><a className={"loginadvice-index-navheader-single-link"}
                                  onClick={this.onNavLink.bind(this, e)}>{e.name}</a>&nbsp;&nbsp;
                    <span>{">"}</span>&nbsp;&nbsp;</span>)
        });
        return (
            <div className={'loginadvice-index'} style={{backgroundColor: '#fff', overflowY: 'auto'}}>
                <HeaderIndex onLinkClick={this.onLinkClick}/>
                <div className={'loginadvice-index-onestep'} style={{height: this.state.scrollHeight}}>
                    <div className={'loginadvice-index-navheader'}>
                        {dom}
                    </div>
                    <div className="loginadvice-index-onestep-title">{I18n.t(200172/*产品分类*/)}</div>
                    {
                        data.map((e, i) => {
                            return (<div className="loginadvice-index-onestep-single" key={i}>
                                <h2 className={"loginadvice-index-onestep-single-twotitle color0"}>
                                    <span></span>{e.localName}</h2>
                                {
                                    e.children && e.children.map((da, di) => {
                                        return (<h3 key={di} className={'loginadvice-index-onestep-single-linker'}><span
                                            className={"loginadvice-index-onestep-single-linker-click"}
                                            onClick={this.LinkClick.bind(this, da)}>{da.localName}</span></h3>)
                                    })
                                }
                            </div>)
                        })
                    }
                </div>
                <Dialog visible={this.state.visible} showHeader={false} width={320} isShowPicture={true}>
                    {this.state.dialogContent}
                </Dialog>
            </div>
        );
    }
}

export default LoginOneStep;