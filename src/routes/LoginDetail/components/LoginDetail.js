import i18n from './../../../lib/i18n';
import React, {Component} from "react";
import {I18n} from "../../../lib/i18n";
import {Link, browserHistory} from 'react-router';
import WebData from "../../../common/WebData";
import Dialog  from '../../../components/Dialog';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, pageSize, sizeList} from '../../../services/apiCall';
import NavConnect from "../../../components/NavigateTabs/containers/AddContainer";
import Confirm from "../../../components/Dialog/Confirm";

import HeaderIndex from "./HeaderIndex";
//引入提示
import Tooltip from 'antd/lib/tooltip';
import SpecTextCard from "../../Product/List/SpecText/SpecText";

import ServiceTips, {errorTips, successTips} from '../../../components/ServiceTips';

import Normal from "./Normal";
import Measurement from '../../../components/RuleTemplate';

const nodata_img = require("../../LoginNew/assets/nodata.png");

const singleNav = obj => {
    let NavList = []; //导航栏为空数组
    /*
    * len = 2 为一时,表示是产品名称,跳转页面是 user/loginList/
    * len = 1 时, 表示当前是产品分类的最后一级,下一级是产品名称了
    * name = i18n.t(500289*//*成品分组*//*) 或 "All Category"
    *
    * */
    if(!obj.id){
        return NavList;
    }
    let object = obj;
    let i =1;
    if(obj.mtlType){
        NavList.unshift({name:object.mtlType.localName,id:object.mtlType.id,len:0});
    }
    for(;object.parent;){
        NavList.unshift({name:object.localName,id:object.id,len:i});
        object = object.parent;
        i++;
    }
    if(object){
        NavList.unshift({name:i18n.t(200172/*产品分类*/),id:object.id,len:-2});
    }
    NavList.unshift({name: I18n.t(300080/*首页*/), id: "", len: -1});
    return NavList;
};

export class LoginDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            navObj: {},
            visible:false,
            dialogContent:<div></div>,
            mtleId:this.props.location.query.id
        }
    }

    //详情拉取接口
    getDetail = () => {
        let params = Object.assign({}, {id: this.props.location.query.id});
        apiGet(API_FOODING_DS, '/fc/portal/platformMaterial/getDetail', params, (response) => {
            this.setState({
                data: response.data
            })
        }, error => {
            // ServiceTips({text: error.message, type: 'error'});
        });
    };
    //拉取导航栏数据
    getInitNav = () => {
        let that = this;
        let mtlTypeId = this.props.location.query.mtlTypeId ? this.props.location.query.mtlTypeId : "";
        let dataMulDiv2Id = this.props.location.query.dataMulDiv2Id ? this.props.location.query.dataMulDiv2Id : "";
        apiGet(API_FOODING_DS, "/fc/portal/dataMulDiv2/getNav", {
            mtlTypeId: mtlTypeId,
            dataMulDiv2Id: dataMulDiv2Id
        }, response => {
            let navObj = response.data || {};
            that.setState({navObj});
        }, error => {})
    };
    //点击更多和 查看价格 提示他们跳转到登录页面
    onLinkClick = () => {
        let LoginDialog = require("./LoginDialog").default;
        let content = React.createElement(LoginDialog,{onCancel:this.onCancel});
        this.setState({
            visible:true,
            dialogContent:content
        })
    };
    onCancel = () => {
      this.setState({visible:false});
    };
    //导航栏页面链接
    onNavLink = (obj,e) => {
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
    LinkClick = (data,ve) => {
        let {navAddTab,navRemoveTab} =this.props;
        navRemoveTab({name:i18n.t(200545/*平台供应商*/),component:i18n.t(200545/*平台供应商*/),url:'/platform/provider/detail'});
        navAddTab({name:i18n.t(200545/*平台供应商*/),component:i18n.t(200545/*平台供应商*/),url:'/platform/provider/detail'});
        this.props.router.push({pathname:'/platform/provider/detail',query:{id:data.id,mtleId:this.state.mtleId}});
    }
    handleResize(height) {
        let sch = document.body.offsetHeight - height;
        let scroll = sch - 120;
        this.setState({scrollHeight: sch + 'px', scroll: scroll + 'px'});
    }

    componentDidMount() {
        this.getDetail();
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
        const {material = {}, customer = [], mtlQaitems = [], vendor = [], contnrLoadings = []} = data;
        let dataMulDiv1s = material && material.dataMulDiv1s ? material.dataMulDiv1s : [];
        let dataMulDiv2s = material && material.dataMulDiv2s ? material.dataMulDiv2s : [];
        let List = singleNav(navObj);
        let dom = List.map((e, i) => {
            return i === List.length - 1 ?
                (<span key={i} className={"loginadvice-index-navheader-single"}><a
                    className={"loginadvice-index-navheader-single-link"}
                    onClick={this.onNavLink.bind(this,e)}>{e.name}</a></span>)
                :
                (<span key={i}><a
                    className={"loginadvice-index-navheader-single-link"} onClick={this.onNavLink.bind(this,e)}>{e.name}</a>&nbsp;&nbsp;<span>{">"}</span>&nbsp;&nbsp;</span>)
        });
        return (
            <div className={'loginadvice-index'}>
                <HeaderIndex onLinkClick={this.onLinkClick} />
                <div className={'loginadvice-index-detail-out'}
                     style={{height: this.state.scrollHeight, overflowY: 'scroll'}}>
                    <div className={'loginadvice-index-navheader'} style={{width:"1366px",margin:"0 auto"}}>
                        {dom}
                    </div>
                    <div className={'loginadvice-index-detail'}>
                        <div style={{flex: 2, margin: "0 5px"}}>
                            <div className="loginadvice-index-detail-single">
                                <Normal material={material} onLinkClick={this.onLinkClick} />
                            </div>
                            <div className="loginadvice-index-detail-all">
                                <div style={{width: '100%'}}>
                                    <Measurement
                                        title={I18n.t(100601/*产品规格细分*/)}
                                        id={'24'}
                                        showHeader={true}
                                        columns={
                                            [{
                                                title: I18n.t(100001/*名称*/),
                                                dataIndex: "qaItem",
                                                key: "qaItem",
                                                width: "30%",
                                                className: "text-right",
                                                render(data, row, index) {
                                                    data = data !== null ? data : "";
                                                    if (data && ('localName' in data)) {
                                                        return <div className={'text-ellipsis'}
                                                                    title={data.localName}>{data.localName}</div>;
                                                    }
                                                    return <div className={'text-ellipsis'} title={data}>{data}</div>;
                                                }
                                            }, {
                                                //title: I18n.t(100604/*符号*/),
                                                title:"",
                                                dataIndex: "calSymBol",
                                                key: "calSymBol",
                                                width: "4%",
                                                className: "text-center",
                                                render(data, row, index) {
                                                    data = data !== null ? data : "";
                                                    if (data && data.name) {
                                                        return data.name;
                                                    }
                                                    return data;
                                                }
                                            }, {
                                                title: I18n.t(100605/*指标*/),
                                                dataIndex: "maxQaValue",
                                                key: "maxQaValue",
                                                width: "32.5%",
                                                className: "text-left",
                                                render(data, row, index) {
                                                    return (<div>{data}</div>)
                                                }
                                            }]
                                        }
                                        data={mtlQaitems || []}
                                    />
                                </div>
                                <div style={{width: '100%', marginLeft: "10px"}}>
                                    <Measurement
                                        title={I18n.t(100595/*箱型装载数据*/)}
                                        id={'24'}
                                        showHeader={true}
                                        columns={
                                            [{
                                                title: I18n.t(100596/*包装名称*/),
                                                dataIndex: 'packaging',
                                                key: "packaging",
                                                width: '60%',
                                                render(data, row, index) {
                                                    data = data !== null ? data : "";
                                                    if (data && ('localName' in data)) {
                                                        return data.localName
                                                    }
                                                    return data;
                                                }
                                            }, {
                                                title: I18n.t(100214/*箱型*/),
                                                dataIndex: "contnrType",
                                                key: "contnrType",
                                                width: "38%",
                                                render(data, row, index) {
                                                    let mtlCon = row.mtlContNum || "";
                                                    let unito = row.unitofmea && row.unitofmea.localName ? row.unitofmea.localName : "";
                                                    data = data !== null ? data : "";
                                                    if (data && ('localName' in data)) {
                                                        return (<div>{mtlCon + unito + '/' + data.localName}</div>)
                                                    }
                                                    return "";
                                                }
                                            }]
                                        }
                                        data={contnrLoadings || []}
                                    />
                                    <div className="loginadvice-index-detail-single">
                                        <div className="loginadvice-index-detail-single-header">
                                            <span>{i18n.t(400192/*用途*/)}</span>
                                        </div>
                                        <ul className="login-detail-usse">
                                            {
                                                dataMulDiv1s.length == 0 ?
                                                    <div style={{
                                                        width: "100%",
                                                        height: "120px"
                                                        , textAlign: 'center', lineHeight: "120px"
                                                    }}><img src={nodata_img}/></div> :
                                                    dataMulDiv1s.map((dsa, dsi) => {
                                                        return (<li key={dsi}>{dsa.localName}</li>)
                                                    })
                                            }
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div style={{flex: 1, margin: "0 10px"}}>
                            <div className="loginadvice-index-detail-single">
                                <div className="loginadvice-index-detail-single-header">
                                    <span>{I18n.t(100312/*供应商*/)}</span>
                                    <a href="#">{I18n.t(200634/*更多*/)} &gt;</a>
                                </div>
                                <ul className="loginadvice-index-detail-single-provider">
                                    {
                                        vendor.length == 0 ?
                                            <div style={{
                                                width: "100%",
                                                height: "120px"
                                                , textAlign: 'center', lineHeight: "120px"
                                            }}><img src={nodata_img}/></div> :
                                            vendor.map((ve, vi) => {
                                                return (<li key={vi} onClick={this.LinkClick.bind(this,ve)}>{ve.localName || ""}</li>)
                                            })
                                    }
                                </ul>
                            </div>
                            <div className="loginadvice-index-detail-single">
                                <div className="loginadvice-index-detail-single-header">
                                    <span>{I18n.t(100311/*客户*/)}</span>
                                    <a href="#" >{I18n.t(200634/*更多*/)} &gt;</a>
                                </div>
                                <ul className="loginadvice-index-detail-single-provider">
                                    {
                                        customer.length == 0 ? <div style={{
                                                width: "100%",
                                                height: "120px"
                                                , textAlign: 'center', lineHeight: "120px"
                                            }}><img src={nodata_img}/></div> :
                                            customer.map((ce, ci) => {
                                                return (<li key={ci}>{ce.localName || ""}</li>)
                                            })
                                    }
                                </ul>
                            </div>
                            <div className="loginadvice-index-detail-single">
                                <div className="loginadvice-index-detail-single-header">
                                    <span>{I18n.t(400193/*产品描述*/)}</span>
                                </div>
                                {
                                    material && material.description ?
                                        <div style={{
                                            padding: "10px",
                                            color: "black",
                                            lineHeight: "32px",
                                            fontSize: "14px",
                                            wordBreak:"break-word"
                                        }}>{material.description || ""}</div>:
                                        <div style={{
                                        width: "100%",
                                        height: "120px"
                                        , textAlign: 'center', lineHeight: "120px"
                                    }}><img src={nodata_img}/></div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Dialog visible={this.state.visible} showHeader={false} width={320} isShowPicture={true}>
                    {this.state.dialogContent}
                </Dialog>
            </div>
        );
    }
}


export default NavConnect(LoginDetail);


