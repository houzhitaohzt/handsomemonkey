import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';

import NavConnect from "../../../components/NavigateTabs/containers/AddContainer";
import Table from "../../../components/Table"; //Table表格

//引入提示
import ServiceTips, {errorTips, successTips} from "../../../components/ServiceTips"; //提示框
import {apiGet, apiPost, apiForm, API_FOODING_ES,
    API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,toDecimal,language} from "../../../services/apiCall";
import xt from "../../../common/xt";
import WebData from '../../../common/WebData';
import Dialog from '../../../components/Dialog/Dialog';//弹层

export class BuinessModel extends Component{
    constructor(props) {
        super(props);
        this.columnSort = {column: 'billId', order: 'desc'};
        this.filterData = {};
        let that = this;
        this.columns = [{
            title : i18n.t(400049/*业务状态*/),
            dataIndex : 'statusName',
            key : "statusName",
            width : '5%',
            sort: 'status',
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        },{
            title : i18n.t(400048/*单据编号*/),
            dataIndex : "no",
            key : "no",
            width : "8%",
            sort: 'no',
            render(data,row,index){
                return (<div onClick={that.numDetailHandle.bind(this,data)} className="text-ellipsis mail-hover" title={data}>{data}</div>)
            }
        },{
            title : i18n.t(400011/*销售员*/),
            dataIndex : "saleStaff"+language,
            key : "saleStaff"+language,
            width : "5%",
            sort: "saleStaffId",
            render(data,row,index){
                return (<div className="text-ellipsis">{data}</div>);
            }
        },{
            title : i18n.t(100311/*客户*/),
            dataIndex : 'salBe'+language,
            key : "salBe"+language,
            width : "20%",
            sort: "salBeId",
            render(data,row ,index){
                return data;
            }
        },{
            title : i18n.t(100376/*交易条款*/),
            dataIndex : "incotm"+language,
            key : "incotm"+language,
            width : "5%",
            sort: "incotmId",
            className:'text-center',
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        },{
            title : i18n.t(100224/*运输方式*/),
            dataIndex : 'trans'+language,
            key : 'trans'+language,
            width : "5%",
            className:'text-center',
            sort: "transId",
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(100297/*起运港*/),
            dataIndex : 'sStatn'+language,
            key : "sStatn"+language,
            width : "6%",
            sort: "sStatnId",
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(100298/*目的港*/),
            dataIndex : 'eStatn'+language,
            key : "eStatn"+language,
            width : "6%",
            sort: "eStatnId",
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(200165/*销售总额*/),
            dataIndex : 'saleTaxAmt',
            key : "saleTaxAmt",
            width : "6%",
            sort: "saleTaxAmt",
            render(data,row,index){
                return <div>{data?toDecimal(data)+ ' '+row["cny"+language]:''}</div>;
            }
        },{
            title : i18n.t(201027/*订单利润率*/),
            dataIndex : 'orderRate',
            key : "orderRate",
            width : "7%",
            sort: "orderRate",
            className:'text-center',
            render(data,row,index){
                return <div>{data?toDecimal(data):''}</div>;
            }
        },{
            title : i18n.t(300067/*审批日期*/),
            dataIndex : "activitiDate",
            key : "activitiDate",
            width : "7%",
            sort: "activitiDate",
            render(data,row,index){
                return new Date(data).Format('yyyy-MM-dd');
            }
        }];

        this.state = {
            data:[],
            currentPage:1,
            pageSize:20
        }
    }


    // 销售单号 查看详情
    numDetailHandle = (num) => {
        this.props.numDetailHandle && this.props.numDetailHandle(num);
    };

    //拉取数据
    getPage(pageSize,order){
        let that = this;
        pageSize = pageSize || this.state.pageSize;
        let params = Object.assign({},{ccId:WebData.user.data.staff.ccid,pageSize: pageSize, currentPage:1},order);
        apiGet(API_FOODING_ERP,'/saleorder/getPage',params,
            (response)=>{
                that.setState({
                    data: response.data.data,
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage,
                    totalRecords:response.data.totalRecords
                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:"error"});
            });
    }

    //双击跳转
    onRowDoubleClick = (record,index,checked) =>{
        let {navAddTab} =this.props;
        navAddTab({id:6,name:i18n.t(200962/*销售订单详情*/),
            component:i18n.t(200962/*销售订单详情*/),url:'/salesorder/detail'});
        this.props.router.push({pathname:'/salesorder/detail',query:{id:record.billId}});
    }

    componentDidMount(){
        this.getPage();
    }
    componentWillUnmount(){

    }
    componentWillReceiveProps(nextProps){

    };
    shouldComponentUpdate(props, state) {
        // return xt.equalsObject(state, this.state);
        return true;
    }

    //更多
    onMore = () => {
        let {navAddTab} = this.props;
        navAddTab({name: i18n.t(200237/*销售订单*/), component: i18n.t(200237/*销售订单*/), url: '/businessOpportunity/list'});
        this.props.router.push({pathname:'/salesorder/list', state: {refresh: true}});
    };

    //onRefresh 拖拽单个模块刷新
    onRefresh = () => {
        this.getPage();
    };

    //onDrageEdit 拖拽编辑
    onDrageEdit = () => {
        let {onDrageEdit, laysingle} = this.props;
        onDrageEdit && onDrageEdit(laysingle)
    };

    //onDrageDelete 单个模块删除
    onDrageDelete = () => {
        let {onDrageDelete, laysingle} = this.props;
        onDrageDelete && onDrageDelete(laysingle)
    };

    render(){
        return (
            <div className="dragesingle" >
                <div className={"dragetitle"}>
                    <span className={"drageshow"}>{i18n.t(200237/*销售订单*/)}</span>
                    <span className="dragehandle"></span>
                    <span className={"dragemore"} onClick={this.onMore}>{i18n.t(200634/*更多*/)} &gt;</span>
                    <span className={"drageaction"}>
                        <i className={"foddingicon fooding-sd-icon2"}></i>
                        <span className="action">
                            <span onClick={this.onRefresh}><i className={"foddingicon fooding-update"}></i>&nbsp;&nbsp;{i18n.t(400046/*刷新*/)}</span>
                            <span onClick={this.onDrageEdit}><i className={"foddingicon fooding-alter_icon2"}></i>&nbsp;&nbsp;{i18n.t(100439/*编辑*/)}</span>
                            <span onClick={this.onDrageDelete}><i className={"foddingicon fooding-delete-icon4"}></i>&nbsp;&nbsp;{i18n.t(100437/*删除*/)}</span>
                        </span>
                    </span>
                </div>
                <div className={"dragecontent"} style={{height:Number(this.props.rowHeight + 10) * Number(this.props.laysingle.h) - 50 + "px"}}>
                    <Table
                        singleSelect ={true}
                        columns={this.columns} ref = "mainTab"
                        data={this.state.data || []}
                        scroll={{x: true, y: this.state.scroll}}
                        checkboxConfig={{show:true,position:'first'}}
                        onRowDoubleClick={this.onRowDoubleClick}
                        onHeaderSortClick={this.getPage.bind(this, null)}
                    />
                </div>
            </div>
        );
    }
};

export default NavConnect(BuinessModel);
