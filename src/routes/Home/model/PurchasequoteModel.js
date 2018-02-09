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
            width : "8%",
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(100379/*产品*/),
            dataIndex : 'mtl'+language,
            key : "mtl"+language,
            width : "8%",
            render(data,row,index){
                return <div onClick={that.onClickLink.bind(that,row)} className='link-color'>{data}</div>;
            }
        },{
            title : i18n.t(100382/*产品规格*/),
            dataIndex : 'basSpeci',
            key : 'basSpeci',
            width : "12%",
            render(data,row,index){
                return (<div title={data} className={'text-ellipsis'}>{data}</div>)
            }
        },{
            title : i18n.t(100312/*供应商*/),
            dataIndex : 'vndBe'+language,
            key : "vndBe"+language,
            width : "11%",
            render(data,row,index){
                return (<div title={data} className={'text-ellipsis'}>{data}</div>)
            }
        },{
            title : i18n.t(100297/*起运港*/),
            dataIndex : 'sStatn'+language,
            key : "sStatn"+language,
            width : "7%",
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(500067/*包装*/),
            dataIndex : 'packag'+language,
            key : "packag"+language,
            width : "12%",
            render(data,row,index){
                return (<div title={data} className={'text-ellipsis'}>{data}</div>)
            }
        },{
            title : i18n.t(200951/*整柜价*/),
            dataIndex : 'fclPrice',
            key : "fclPrice",
            width : "7%",
            className:'text-right',
            render(data,row,index){
                return (<div>{data?toDecimal(data)+' '+row["cny"+language]:''}</div>)
            }
        },{
            title : i18n.t(400037/*采购员*/),
            dataIndex : 'purStaff'+language,
            key : "purStaff"+language,
            width : "7%",
            className:'text-center',
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(100286/*生效日期*/),
            dataIndex : 'sDate',
            key : 'sDate',
            width : "10%",
            className:'text-center',
            render(data,row,index){
                return new Date(data).Format('yy/MM/dd')+' ~ '+new Date(row.eDate).Format('MM/dd');;
            }
        },{
            title : i18n.t(400049/*业务状态*/),
            dataIndex : 'statusName',
            key : "statusName",
            width : '7%',
            className:'text-center',
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        }];

        this.state = {
            data: [],
            currentPage: 1,
            pageSize: 20
        }
    }
    //
    onClickLink = (row) => {
        let {navAddTab} =this.props;
        navAddTab({id:7,name:i18n.t(100402/*产品详情*/),component:i18n.t(100402/*产品详情*/),url:'/product/detail'});
        this.props.router.push({pathname:'/product/detail',query:{id:row.mtlId}});
    };


    //双击点击进入详情
    onRowDoubleClick(record,index,checked){
        let {navAddTab} =this.props;
        navAddTab({id:6,name:i18n.t(201010/*供应商报价详情*/),component:i18n.t(201010/*供应商报价详情*/),url:'/purchasequote/detail'});
        this.props.router.push({ pathname: '/purchasequote/detail',query:{id:record.billId}});
    }

    //拉取数据
    getPage = (currentPage, order) => {
        let that = this;
        this.columnSort = order = order || this.columnSort;
        let isManageObj = {};
        isManageObj = permissionsBtn('purquotation.isManager') ? Object.assign({}, isManageObj, {isManager: 1}) : {};
        let params = Object.assign({}, {
            pageSize: this.state.pageSize,
            currentPage: 1,
            isPlatform: true,
        }, isManageObj, order)
        apiGet(API_FOODING_ERP, '/purquotation/getPage', params, (response) => {
            this.setState({
                data: response.data.data,
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                totalRecords: response.data.totalRecords
            })
        }, (error) => {
            ServiceTips({text: error.message, type: 'error'});
        });
    };

    componentDidMount() {
        this.getPage();
    }

    componentWillUnmount() {

    }

    shouldComponentUpdate(props, state) {
        // return xt.equalsObject(state, this.state);
        return true;
    }

    //更多
    onMore = () => {
        let {navAddTab} = this.props;
        navAddTab({name: i18n.t(200022/*供应商报价*/), component: i18n.t(200022/*供应商报价*/), url: '/Purchasequote/list'});
        this.props.router.push({pathname: '/Purchasequote/list', state: {refresh: true}});
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
                    <span className={"drageshow"}>{i18n.t(200022/*供应商报价*/)}</span>
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
                        checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
                        colorFilterConfig={{show : false,dataIndex:'colorType'}}
                        followConfig={{show:false}}
                        scroll={{x:true,y:this.state.scroll}}
                        onRowDoubleClick={this.onRowDoubleClick}
                    />
                </div>
            </div>
        );
    }
};

export default NavConnect(PruchaseNeedModel);
