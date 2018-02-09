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
        this.columns = [{
            title : i18n.t(400048/*单据编号*/),
            dataIndex : "no",
            key : "no",
            width : "6%",
            sort:'no',
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(100323/*业务日期*/),
            dataIndex : "billDate",
            key : "billDate",
            width : "6%",
            sort:'billDate',
            render(data,row,index){
                return new Date(data).Format('yyyy-MM-dd');
            }
        },{
            title : i18n.t(100312/*供应商*/),
            dataIndex : "vndBe"+language,
            key : "vndBe"+language,
            width : "14%",
            sort:'vndBeId',
            render(data,row,index){
                return (<div className={'text-ellipsis'} title={data}>{data}</div>);
            }
        },{
            title : i18n.t(201001/*送达类型*/),
            dataIndex : "arrPlaceTypeName",
            key : "arrPlaceTypeName",
            width : "4%",
            sort:'arrPlaceType',
            render(data,row,index){
                return data || "";
            }
        },{
            title : i18n.t(100379/*产品*/),
            dataIndex : "mtl"+language,
            key : "mtl"+language,
            width : "8%",
            sort:'mtlId',
            render(data,row,index){
                return (<div className={'text-ellipsis'} title={data}>{data}</div>);
            }
        },{
            title : i18n.t(100382/*产品规格*/),
            dataIndex : "basSpeci",
            key : "basSpeci",
            width : "14%",
            sort:'basSpeci',
            render(data,row,index){
                return (<div className={'text-ellipsis'} title={data}>{data}</div>);
            }
        },{
            title : i18n.t(100319/*采购数量*/),
            dataIndex : "purQty",
            key : "purQty",
            width : "5%",
            sort:'purQty',
            className:'text-center',
            render(data,row,index){
                if(data && !row.type){
                    return (<div>{data}&nbsp;&nbsp;{row['uom'+language]}</div>)
                }
                return "";
            }
        },{
            title : i18n.t(200847/*含税单价*/),
            dataIndex : "purTaxPrc",
            key : "purTaxPrc",
            width : "5%",
            sort:'purTaxPrc',
            className:'text-center',
            render(data,row,index){
                if(data && !row.type){
                    return (<div>{toDecimal(data)}&nbsp;&nbsp;{row.cnyEnName}</div>)
                }
                return "";
            }
        },{
            title : i18n.t(400098/*采购总额*/),
            dataIndex : "setTaxAgg",
            key : "setTaxAgg",
            width : "6%",
            sort:'setTaxAgg',
            className:'text-right',
            render(data,row,index){
                if(data){
                    return (<div>{toDecimal(data)}&nbsp;&nbsp;{row.cnyEnName}</div>)
                }
                return "";
            }
        },{
            title : i18n.t(400037/*采购员*/),
            dataIndex : "purStaff"+language,
            key : "purStaff"+language,
            width : "8%",
            sort:'purStaffId',
            className:'text-center',
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(400049/*业务状态*/),
            dataIndex : 'statusName',
            key : "statusName",
            width : '4%',
            sort:'status',
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

    //双击点击进入详情
    onRowDoubleClick = (record,index,checked) => {
        let {navAddTab} =this.props;
        navAddTab({name:i18n.t(200990/*采购订单详情*/),component:i18n.t(200990/*采购订单详情*/),url:'/pruchaseorder/detail'});
        this.props.router.push({pathname:'/pruchaseorder/detail',query:{id:record.billId},state: {refresh: true}});
    }

    //请求列表  list
    getPage = (currentPage,order) => {
        let that = this;
        this.columnSort = order = order || this.columnSort;
        let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: 1,orderType:20},order);
        apiGet(API_FOODING_ERP,'/purorder/getPage',object,
            (response)=>{
                that.setState({
                    data: response.data.data,
                    totalPages: response.data.totalPages,
                    totalRecords:response.data.totalRecords,
                    currentPage: response.data.currentPage
                });
            },(errors)=>{

            });
    }

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
        navAddTab({name: i18n.t(400020/*采购订单*/), component: i18n.t(400020/*采购订单*/), url: '/pruchaseorder/list'});
        this.props.router.push({pathname: '/pruchaseorder/list', state: {refresh: true}});
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
                    <span className={"drageshow"}>{i18n.t(400020/*采购订单*/)}</span>
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
                        ref = "pruchaseOrder"
                        columns={this.columns}
                        data={this.state.data || []}
                        checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
                        colorFilterConfig={{show : false,dataIndex:'colorType'}}
                        followConfig={{show:false}}
                        scroll={{x:true,y:this.state.scroll}}
                        onRowDoubleClick={this.onRowDoubleClick}
                        singleSelect={true}
                        onHeaderSortClick={this.getPage.bind(this, null)}
                    />
                </div>
            </div>
        );
    }
};

export default NavConnect(PruchaseNeedModel);
