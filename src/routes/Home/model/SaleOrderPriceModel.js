import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';

import NavConnect from "../../../components/NavigateTabs/containers/AddContainer";
import Table from "../../../components/Table"; //Table表格
import Tooltip from 'antd/lib/tooltip';
//引入提示
import ServiceTips, {errorTips, successTips} from "../../../components/ServiceTips"; //提示框
import {apiGet, apiPost, apiForm, API_FOODING_ES,
    API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,toDecimal,language} from "../../../services/apiCall";
import xt from "../../../common/xt";
import WebData from '../../../common/WebData';
import SpecTextCard from "../../Product/List/SpecText/SpecText";

export class SaleOrderpriceModel extends Component{
    constructor(props) {
        super(props);
        this.getPage=this.getPage.bind(this);
        this.columnSort = {column: 'billId', order: 'desc'};
        this.filterData = {};
        var that = this;
        this.columns = [{
            title : i18n.t(100379/*产品*/),
            dataIndex : 'mtl'+language,
            key : "mtl"+language,
            width : "10%",
            sort:'mtlId',
            render(data,row,index){
                return <div onClick={that.onClickLink.bind(that,row)} className='link-color'>{data}</div>;
            }
        },{
            title : i18n.t(100382/*产品规格*/),
            dataIndex : 'basSpeci',
            key : 'basSpeci',
            width : "15%",
            tooltip: false,
            render(data,row,index){
                if(data){
                    return (<Tooltip
                        placement="bottomLeft"
                        mouseEnterDelay={0.5}
                        arrowPointAtCenter={true}
                        mouseLeaveDelay={0.2}
                        prefixCls="spctext-toolip"
                        trigger="click"
                        overlay={<SpecTextCard id={row&&row.mtlId}/>}
                    >
                        <div className="text-ellipsis mail-hover">{data}</div>
                    </Tooltip>)
                }
            }
        },{
            title : i18n.t(500067/*包装*/),
            dataIndex : 'packag'+language,
            key : "packag"+language,
            width : "15%",
            render(data,row,index){
                return (<div title={data} className={'text-ellipsis'}>{data}</div>)
            }
        },{
            title : i18n.t(400012/*品牌*/),
            dataIndex : 'brand'+language,
            key : "brand"+language,
            width : "15%",
            sort:'brandId',
            render(data,row,index){
                return (<div title={data} className={'text-ellipsis'}>{data}</div>)
            }
        },{
            title : i18n.t(100297/*起运港*/),
            dataIndex : 'sStatn'+language,
            key : "sStatn"+language,
            width : "15%",

            render(data,row,index){
                return (<div title={data} className={'text-ellipsis'}>{data}</div>)
            }
        },{
            title : "FOB成本价",
            dataIndex : 'fobPrice',
            key : "fobPrice",
            width : "20%",
            className:'text-right',

            render(data,row,index){
                return (<div title={data} className={'text-ellipsis'} >
                    {(data?toDecimal(data):0)+' '+'USD'+(row["uom"+language]?'/'+row["uom"+language]:'')+(row["contnrType"+language]?'/'+row["contnrType"+language]:'')}
                </div>)
            }
        },{
            title : i18n.t(100287/*失效日期*/),
            dataIndex : 'eDate',
            key : 'eDate',
            width : "15%",
            className:'text-center',
            render(data,row,index){
                return new Date(data).Format('yyyy-MM-dd');
            }
        },{
            title : i18n.t(400037/*采购员*/),
            dataIndex : 'purStaff'+language,
            key : "purStaff"+language,
            width : "10%",
            className:'text-center',
            render(data,row,index){
                return data;
            }
        }
        // ,{
        //     title : i18n.t(200098/*操作*/),
        //     dataIndex : 'caozuo',
        //     key : "caozuo",
        //     width : '10%',
        //     className:'text-center',
        //     render(data,row,index){
        //         return (<i className='foddingicon fooding-quote' style={{paddingRight:30,fontSize:18}} onClick={that.danbaojiaClick.bind(that,row)} title={i18n.t(200116/*报价*/)}></i>)
        //     }
        // }
        ];

        this.state = {
            data:[],
            currentPage:1,
            pageSize:20
        }
    }


    // 销售单号 查看详情
    danbaojiaClick = (record) => {
        this.props.danbaojiaClick && this.props.danbaojiaClick(record);
    };

    //点击 跳转到产品详情
    onClickLink = row => {
        window.navTabs.open(i18n.t(100402/*产品详情*/), '/product/detail', {id:row.mtlId});
    };

    //拉取数据
    getPage = (pageSize,order) => {
        let that = this;
        pageSize = pageSize || this.state.pageSize;
        let params = Object.assign({},{pageSize: pageSize, currentPage:1},order);
        apiGet(API_FOODING_ERP,'/purquotation/getSalePage',params,
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

    componentDidMount(){
        this.getPage();
    }
    componentWillUnmount(){

    }
    shouldComponentUpdate(props, state) {
        // return xt.equalsObject(state, this.state);
        return true;
    }

    //更多
    onMore = () => {
        window.navTabs.open(i18n.t(200070/*产品价格*/), '/saleorderprice');
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
            <div className="dragesingle">
                <div className={"dragetitle"}>
                    <span className={"drageshow"}>{i18n.t(200070/*产品价格*/)}</span>
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
                        ref = "product"
                        columns={this.columns}
                        data={this.state.data || []}
                        checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
                        colorFilterConfig={{show : false,dataIndex:'colorType'}}
                        followConfig={{show:false}}
                        scroll={{x:true,y:this.state.scroll}}
                        onHeaderSortClick={this.getPage.bind(this, null)}
                    />
                </div>
            </div>
        );
    }
};

export default SaleOrderpriceModel;
