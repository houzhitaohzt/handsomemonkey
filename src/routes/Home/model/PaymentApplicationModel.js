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
            title : i18n.t(100323/*业务日期*/),
            dataIndex : 'billDate',
            key : "billDate",
            width : '5%',
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{new Date(data).Format('yyyy-MM-dd')}</div>)
            }
        },{
            title : i18n.t(400048/*单据编号*/),
            dataIndex : 'no',
            key : 'no',
            width : "10%",
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(500129/*源单编号*/),
            dataIndex : 'sourceNo',
            key : "sourceNo",
            width : "8%",
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(200817/*申请人*/),
            dataIndex : "payStaff"+language,
            key : "payStaff"+language,
            width : "5%",
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(200841/*申请付款金额*/),
            dataIndex : "orderAmt",
            key : "orderAmt",
            width : "5%",
            className:'text-center',
            render(data,row,index){
                return <div>{data? toDecimal(data)+' '+row["cny"+language]:''}</div>;
            }
        },{
            title : i18n.t(400084/*收款单位*/),
            dataIndex : "receiptBe"+language,
            key : "receiptBe"+language,
            width : "10%",
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        },{
            title : i18n.t(500146/*源单类型*/),
            dataIndex : 'sourceTypeName',
            key : 'sourceTypeName',
            width : "5%",
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(400049/*业务状态*/),
            dataIndex : 'statusName',
            key : "statusName",
            width : "5%",
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
    onRowDoubleClick =(record) => {
        let {navAddTab} =this.props;
        navAddTab({name:i18n.t(200405/*付款申请详情*/),component:i18n.t(200405/*付款申请详情*/),url:'/paymentApplication/detail'});
        this.props.router.push({pathname:'/paymentApplication/detail',query:{id:record.billId}});
    }

    //拉取数据
    getPage = (currentPage, order) => {
        let that = this;
        let params = Object.assign({}, {
            pageSize: this.state.pageSize,
            currentPage: 1,
        });
        apiGet(API_FOODING_ERP, '/paymentapplcat/getPage', params, (response) => {
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
        navAddTab({name: i18n.t(400040/*付款申请*/), component: i18n.t(400040/*付款申请*/), url: '/paymentApplication/list'});
        this.props.router.push({pathname: '/paymentApplication/list', state: {refresh: true}});
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
                    <span className={"drageshow"}>{i18n.t(400040/*付款申请*/)}</span>
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
                        onRowDoubleClick={this.onRowDoubleClick}
                        checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
                        scroll={{x:true,y:this.state.scroll}}
                    />
                </div>
            </div>
        );
    }
};

export default NavConnect(PruchaseNeedModel);
