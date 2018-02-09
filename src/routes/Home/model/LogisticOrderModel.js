import i18n, {I18n} from './../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import NavConnect from "../../../components/NavigateTabs/containers/AddContainer";
import Table from "../../../components/Table"; //Table表格

//引入提示
import ServiceTips, {errorTips, successTips} from "../../../components/ServiceTips"; //提示框
import {
    apiGet, apiPost, apiForm, API_FOODING_ES,hrefFunc,permissionsBtn,
    API_FOODING_ERP, API_FOODING_DS, pageSize, sizeList, toDecimal, language
} from "../../../services/apiCall";
import xt from "../../../common/xt";
import WebData from '../../../common/WebData';
import Dialog from '../../../components/Dialog/Dialog';//弹层

export class PruchaseNeedModel extends Component {
    constructor(props) {
        super(props);
        this.columnSort = {column: 'billId', order: 'desc'};
        this.filterData = {};
        let that = this;
        this.columns = [
            {
                title : i18n.t(400048/*单据编号*/),
                dataIndex : 'no',
                key : "no",
                width : "8%",
                sort:'no',
                render(data,row ,index){
                    return <div>{data}</div>
                }
            },
            {
                title : i18n.t(400008/*销售单号*/),
                dataIndex : "sourceNo",
                key : "sourceNo",
                width : "8%",
                sort:'sourceNo',
                render(data,row,index){
                    return (<div onClick={that.numDetailHandle.bind(this,data)} className="text-ellipsis mail-hover" title={data}>{data}</div>)
                }
            },
            {
                title : i18n.t(400011/*销售员*/),
                dataIndex : 'saleStaff'+language,
                key : "saleStaff"+language,
                width : "5%",
                sort:"saleStaffId",
                render(data,row,index){
                    return data;
                }
            },
            {
                title : i18n.t(200312/*物流员*/),
                dataIndex : 'lsStaff'+language,
                key : "lsStaff"+language,
                width : "5%",
                sort : "lsStaffId",
                render(data,row,index){
                    return data;
                }
            },{
                title : i18n.t(500203/*预计开船日期*/),
                dataIndex : 'predictSailingDate',
                key : "predictSailingDate",
                width : '8%',
                sort : "predictSailingDate",
                render(data,row,index){
                    return (<div className="text-ellipsis" title={data}>{new Date(data).Format('yyyy-MM-dd')}</div>)
                }
            },{
                title : i18n.t(200361/*实际开船日*/),
                dataIndex : 'actSailingDate',
                key : "actSailingDate",
                width : '8%',
                sort : "actSailingDate",
                render(data,row,index){
                    return (<div className="text-ellipsis" title={data}>{new Date(data).Format('yyyy-MM-dd')}</div>)
                }

            },{
                title : i18n.t(200383/*提单号*/),
                dataIndex : "ladingBillNo",
                key : "ladingBillNo",
                width : "5%",
                sort : "ladingBillNo",
                render(data,row,index){
                    return data;
                }
            },
            {
                title : i18n.t(100299/*货代公司*/),
                dataIndex : "forwarderBe"+language,
                key : "forwarderBe"+language,
                width : "20%",
                sort : "forwarderBeId",
                render(data,row,index){
                    return <div className="text-ellipsis" title={data}>{data}</div>;
                }
            },
            {
                title : i18n.t(100376/*交易条款*/),
                dataIndex : "incotm"+language,
                key : "incotm"+language,
                width : "5%",
                sort :  "incotmId",
                render(data,row,index){
                    return data;
                }
            },
            {
                title : i18n.t(100224/*运输方式*/),
                dataIndex : "trans"+language,
                key : "trans"+language,
                width : "5%",
                sort : "transId",
                render(data,row,index){
                    return data;
                }
            },
            {
                title : i18n.t(100297/*起运港*/),
                dataIndex : "sStatn"+language,
                key : "sStatn"+language,
                width : "7%",
                sort : "sStatnId",
                render(data,row,index){
                    return data;
                }
            },
            {
                title : i18n.t(100298/*目的港*/),
                dataIndex : "eStatn"+language,
                key : "eStatn"+language,
                width : "10%",
                sort : "eStatnId",
                render(data,row,index){
                    return data;
                }
            }
            ,{
                title : i18n.t(400049/*业务状态*/),
                dataIndex : "statusName",
                key : "statusName",
                width : "5%",
                sort : "status",
                render(data,row,index){
                    return data;
                }
            }];

        this.state = {
            data: [],
            currentPage: 1,
            pageSize: 20
        }
    }

    numDetailHandle = (num) => {
      this.props.numDetailHandle && this.props.numDetailHandle(num)
    };

    //双击点击进入详情
    onRowDoubleClick = (record,index,checked) => {
        let {navAddTab} =this.props;
        navAddTab({name:i18n.t(200370/*物流订单详情*/),component:i18n.t(200370/*物流订单详情*/),url:'/booking/detail'});
        this.props.router.push({pathname:'/booking/detail',query:{id:record.billId}});
    }

    //请求列表  list
    getPage = (currentPage,order) => {
        let that = this;
        this.columnSort = order = order || this.columnSort;
        let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: 1,orderType:20},order);
        apiGet(API_FOODING_ERP,'/shipping/getPage',object,
            (response)=>{
                that.setState({
                    data: response.data.data,
                    totalPages: response.data.totalPages,
                    totalRecords:response.data.totalRecords,
                    currentPage: response.data.currentPage
                });
            },(errors)=>{

            });
    };

    componentDidMount() {
        this.getPage();
    }

    componentWillUnmount() {

    }

    shouldComponentUpdate(props, state) {
        return true;
    }

    //更多
    onMore = () => {
        let {navAddTab} = this.props;
        navAddTab({name: i18n.t(200373/*物流订单*/), component: i18n.t(200373/*物流订单*/), url: '/Booking/list'});
        this.props.router.push({pathname: '/Booking/list', state: {refresh: true}});
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

    render() {
        return (
            <div className="dragesingle">
                <div className={"dragetitle"}>
                    <span className={"drageshow"}>{i18n.t(200373/*物流订单*/)}</span>
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
                        ref = 'booking'
                        singleSelect={true}
                        data={this.state.data || []}
                        columns={this.columns}
                        checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
                        colorFilterConfig={{show : false,dataIndex:'colorType'}}
                        followConfig={{show:false}}
                        scroll={{x:true,y:this.state.scroll}}
                        onRowDoubleClick={this.onRowDoubleClick}
                        onHeaderSortClick={this.getPage.bind(this, null)}
                    />
                </div>
            </div>
        );
    }
};

export default NavConnect(PruchaseNeedModel);
