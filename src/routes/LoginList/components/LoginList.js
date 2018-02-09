import i18n from './../../../lib/i18n';
import React, {Component} from "react";
import {I18n} from "../../../lib/i18n";
import {Link, browserHistory} from 'react-router';
import WebData from "../../../common/WebData";
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, pageSize, sizeList} from '../../../services/apiCall';
import NavConnect from "../../../components/NavigateTabs/containers/AddContainer";

import HeaderIndex from ".//HeaderIndex";

const {Table} = require("../../../components/Table");//Table表格
import Page from "../../../components/Page";//分页
//引入提示
import Tooltip from 'antd/lib/tooltip';
import SpecTextCard from "../../Product/List/SpecText/SpecText";
import Dialog from '../../../components/Dialog';
import NoImg from "../../LoginNew/assets/listNO.png";

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
    if (!obj.id) {
        return NavList;
    }
    let object = obj;
    let i = 1;
    if (obj.mtlType) {
        NavList.unshift({name: object.mtlType.localName, id: object.mtlType.id, len: 0});
    }
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

class LoginList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollHeight: 0,
            currentPage: 1, // 当前页
            totalPages: 1, // 总页数
            pageSize: pageSize, // 每页 多少条
            data: [],
            navObj: {},
            visible: false,
            dialogContent: <div></div>
        };
        this.info = {};
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
    getPages = (currentPage, size, filter, order) => {
        let id = this.props.location.query.id ? this.props.location.query.id : "";
        let name = this.props.location.query.name ? this.props.location.query.name : this.info.state.inputValue;
        filter = filter || {};
        currentPage = currentPage || this.state.currentPage;
        size = size || this.state.pageSize;
        let params = Object.assign({}, {currentPage: currentPage, pageSize: size}, filter, order, {
            mtlTypeId: id,
            name: name
        });
        apiGet(API_FOODING_DS, '/fc/portal/platformMaterial/getPage', params, (response) => {
            this.setState({
                data: response.data.data,
                pageSize: response.data.pageSize,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                totalRecords: response.data.totalRecords
            })
        }, error => {
        });
    };
    //列表点击时,跳转到详情页面
    onLinkDetail = (record, e) => {
        let dataMulDiv2Id = this.props.location.query.dataMulDiv2Id ? this.props.location.query.dataMulDiv2Id : "";
        let mtlTypeId = this.props.location.query.id ? this.props.location.query.id : "";
        window.open(window.location.origin + "/user/logindetail?id=" + record.id + "&mtlTypeId=" + mtlTypeId + "&dataMulDiv2Id=" + dataMulDiv2Id);
    };

    handleResize(height) {
        let sch = document.body.offsetHeight - height;
        let scroll = sch;
        this.setState({scrollHeight: sch + 'px', scroll: scroll + 'px'});
    }

    componentDidMount() {
        this.getPages();
        this.getInitNav();
        window.addEventListener('resize', this.handleResize(0));
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }

    componentWillReceiveProps(nextPorps) {
        let name = nextPorps.location.query && nextPorps.location.query.name ? nextPorps.location.query.name : "";
        if (name && name !== this.props.location.query.name) {
            this.getPages()
        }
        this.handleResize(120);
        window.addEventListener('resize', this.handleResize(0));
    }

    getInitNav = () => {
        let that = this;
        let mtlTypeId = this.props.location.query.id ? this.props.location.query.id : "";
        let dataMulDiv2Id = this.props.location.query.dataMulDiv2Id ? this.props.location.query.dataMulDiv2Id : "";
        if (!mtlTypeId) return false;
        apiGet(API_FOODING_DS, "/fc/portal/dataMulDiv2/getNav", {
            mtlTypeId: mtlTypeId,
            dataMulDiv2Id: dataMulDiv2Id
        }, response => {
            let navObj = response.data || {};
            that.setState({navObj});
        }, error => {
        })
    };
    //导航栏页面链接
    onNavLink = (obj, e) => {
        if (obj.len == -1) {
            browserHistory.push('/user/login');
        } else if (obj.len == -2) {
            browserHistory.push({pathname: "/user/loginonestep", query: {id: obj.id}});
        } else {
            if (obj.len == 0) { return false; }
            browserHistory.push({pathname: "/user/logintwostep", query: {id: obj.id, name: obj.name}});
        }
    };

    renderList = (da,di) => {
        let reg = />=|<=|>|<|:|;/gim;
        let arr = reg.exec(da);
        if(!arr) return "";
        let s = arr[0], aa = da.split(s);
        return (<li className="loginadvice-index-list-single-spec-show" key={di}>
            <span>{aa[0]}</span>
            <span>{s}</span>
            <span>{aa[1]}</span>
            </li>)
    };

    render() {
        let {data, navObj} = this.state;
        let List = singleNav(navObj);
        let {currentPage} = this.props;
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
            <div className={'loginadvice-index'} style={{height: this.state.scrollHeight}}>
                <HeaderIndex localName={this.props.location.query.name ? this.props.location.query.name : ""}
                             onLinkClick={this.onLinkClick} getPage={this.getPages} info={no => this.info = no}
                            inputValue={this.props.location.query.inputvalue}
                />
                <div className={'loginadvice-index-list'}>
                    {
                        this.props.location.query.id ? <div className={'loginadvice-index-navheader'}>
                            {dom}
                        </div> : ""
                    }
                    {
                        data.map((e, i) => {
                            return (<div className="loginadvice-index-list-single" key={i}
                                         onClick={this.onLinkDetail.bind(this, e)}>
                                <h3>{e.code}</h3>
                                <div className="loginadvice-index-list-single-img">
                                    <img src={e.imgUrls && e.imgUrls[0] ? decodeURIComponent(e.imgUrls[0]) : NoImg}/>
                                </div>
                                <h4>{e.localName}</h4>
                                <h5>{e.enName}</h5>
                                <ul className="loginadvice-index-list-single-spec">
                                    <li className="loginadvice-index-list-single-spec-title">{I18n.t(400190/*主要规格*/)}</li>
                                    {
                                        e.specTxt && e.specTxt.split(';').map(this.renderList)
                                    }
                                </ul>
                            </div>)
                        })
                    }
                </div>
                <div style={{width: "1366px", height: "50px", margin: "0 auto"}}>
                    <Page
                        currentPage={this.state.currentPage}
                        totalPages={this.state.totalPages}
                        totalRecords={this.state.totalRecords}
                        sizeList={sizeList}
                        currentSize={this.state.pageSize}
                        prefixCls={"second-page"}
                        pageSizeChange={(num) => {
                            this.setState({pageSize: Number.parseInt(num)}, () => this.getPages(currentPage, num));
                        }}
                        backClick={(num) => {
                            this.setState({currentPage: Number.parseInt(num)}, () => this.getPages(num));
                        }}
                        nextClick={(num) => {
                            this.setState({currentPage: Number.parseInt(num)}, () => this.getPages(num));
                        }}
                        goChange={(num) => {
                            this.setState({currentPage: Number.parseInt(num)}, () => this.getPages(num));
                        }}
                    />
                </div>
                <Dialog visible={this.state.visible} showHeader={false} width={320} isShowPicture={true}>
                    {this.state.dialogContent}
                </Dialog>
            </div>
        );
    }
}

export default LoginList;




