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
    * len = 1 时, 表示当前是产品分类的最后一级,下一级是产品名称了
    * name = i18n.t(500289*/
    /*成品分组*/
    /*) 或 "All Category"
        * */
    let object = obj;
    let i = 0;
    for (; object.parent;) {
        NavList.unshift({name: object.localName, id: object.id, len: i});
        object = object.parent;
        i++;
    }
    if (object) {
        NavList.unshift({name: i18n.t(200172/*产品分类*/), id: object.id, len: -2});
    }
    NavList.unshift({name: I18n.t(300080/*首页*/), id: "", len: -1});
    return NavList;
};

class LoginTwoStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            navObj: {},
            visible: false,
            dialogContent: <div></div>,
        };
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
    getPages = (id) => {
        if (!id) return;
        apiGet(API_FOODING_DS, "/fc/portal/dataMulDiv2/getTree", {id: id}, (response) => {
            this.setState({
                data: response.data || [],
            })
        }, error => {});
    };
    getInitNav = (id) => {
        let that = this;
        apiGet(API_FOODING_DS, "/fc/portal/dataMulDiv2/getNav", {dataMulDiv2Id: id}, response => {
            let navObj = response.data || {};
            that.setState({navObj});
        }, error => {})
    };
    //列表点击时,列表或者再次开一个页面
    onLinkLinkClick = (obj, e) => {
        browserHistory.push({pathname: "/user/logintwostep", query: {id: obj.id, name: obj.localName}});
    };
    //导航栏页面链接
    onNavLink = (obj, e) => {
        if (obj.len == -1) {
            browserHistory.push("/user/login");
        } else if (obj.len == -2) {
            browserHistory.push({pathname: "/user/loginonestep", query: {id: obj.id, name: obj.name}});
        } else {
            if (obj.len == 0) {
                return false;
            }
            browserHistory.push({pathname: "/user/logintwostep", query: {id: obj.id, name: obj.name}});
        }
    };
    //点击跳转到列表页面
    onListClick = (obj, e) => {
        browserHistory.push({
            pathname: "/user/loginlist",
            query: {id: obj.id, name: obj.localName, dataMulDiv2Id: this.props.location.query.id,inputvalue:""}
        });
    };

    handleResize(height) {
        let sch = document.body.offsetHeight - height;
        let scroll = sch - 120;
        this.setState({scrollHeight: sch + 'px', scroll: scroll + 'px'});
    }

    componentDidMount() {
        let id = this.props.location.query.id ? this.props.location.query.id : "";
        this.getPages(id);
        this.getInitNav(id);
        window.addEventListener('resize', this.handleResize(120));
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(120));
    }

    componentWillReceiveProps(nextPorps) {
        this.handleResize(120);
        window.addEventListener('resize', this.handleResize(120));
        let {location} = nextPorps;
        if (location.query.id && location.query.id !== this.props.location.query.id) {
            this.getPages(location.query.id);
            this.getInitNav(location.query.id);
        }
    }

    render() {
        let {data = [], navObj} = this.state;
        data.dataMulDiv2s = data.dataMulDiv2s || [];
        data.mtlTypes = data.mtlTypes || [];
        let List = singleNav(navObj);
        let dom = List.map((e, i) => {
            return i === List.length - 1 ?
                (<span key={i} className={"loginadvice-index-navheader-single"}><a
                    className={"loginadvice-index-navheader-single-link"}
                    onClick={this.onNavLink.bind(this, e)}>{e.name}</a></span>)
                :
                (<span key={i}><a className={"loginadvice-index-navheader-single-link"}
                                  onClick={this.onNavLink.bind(this, e)}>{e.name}</a>&nbsp;&nbsp;
                    <span>{">"}</span>&nbsp;&nbsp;</span>)
        });
        return (
            <div className={'loginadvice-index'}>
                <HeaderIndex onLinkClick={this.onLinkClick}/>
                <div className={'loginadvice-index-twostep-large'}
                     style={{height: this.state.scrollHeight, overflowY: 'scroll'}}>
                    <div className={'loginadvice-index-twostep'}>
                        <div className={'loginadvice-index-navheader'}>
                            {dom}
                        </div>
                        <div className="loginadvice-index-twostep-title">{this.props.location.query.name}</div>
                        <ul className="loginadvice-index-twostep-content">
                            {
                                data.dataMulDiv2s && data.dataMulDiv2s.length > 0 ?
                                    data.dataMulDiv2s.map((e, i) => {
                                        return (<li className="loginadvice-index-twostep-content-single" key={i}
                                                    onClick={this.onLinkLinkClick.bind(this, e, data.mtlTypes)}>{e.localName}</li>)
                                    })
                                    :
                                    data.mtlTypes.map((e, i) => {
                                        return (<li className="loginadvice-index-twostep-content-single" key={i}
                                                    onClick={this.onListClick.bind(this, e, data.mtlTypes)}>{e.localName}</li>)
                                    })
                            }
                        </ul>
                    </div>
                </div>
                <Dialog visible={this.state.visible} showHeader={false} width={320} isShowPicture={true}>
                    {this.state.dialogContent}
                </Dialog>
            </div>
        );
    }
}

export default LoginTwoStep;




