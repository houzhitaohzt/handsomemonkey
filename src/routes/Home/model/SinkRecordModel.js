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

export class CorporationApplyLimitModel extends Component {
    constructor(props) {
        super(props);
        this.columnSort = {column: 'billId', order: 'desc'};
        this.filterData = {};
        let that = this;
        this.columns = [{
            title : i18n.t(201098/*收汇记录*/),
            dataIndex : 'no',
            key : "no",
            width : '10%',
            render(data,row,index){
                return (<div className={'text-ellipsis'}>{data}</div>);
            }
        },{
            title : i18n.t(200612/*收款日期*/),
            dataIndex : "billDate",
            key : "billDate",
            width : "8%",
            render(data,row,index){
                return new Date(data).Format('yyyy-MM-dd');
            }
        },{
            title : i18n.t(500083/*收款企业*/),
            dataIndex : "receiptCc"+language,
            key : "receiptCc"+language,
            width : "15%",
            render(data,row,index){
                return <div className={'text-ellipsis'}>{data}</div>
            }
        },{
            title : i18n.t(200613/*收款银行*/),
            dataIndex : "receBank"+language,
            key : "receBank"+language,
            width : "15%",
            render(data,row,index){
                return <div className={'text-ellipsis'}>{data}</div>
            }
        },{
            title : i18n.t(100500/*银行账号*/),
            dataIndex : "receBankAccount",
            key : "receBankAccount",
            width : "15%",
            render(data,row,index){
                return <div className={'text-ellipsis'}>{data}</div>
            }
        },{
            title : i18n.t(201097/*摘要*/),
            dataIndex : "digest",
            key : "digest",
            width : "8%",
            render(data,row,index){
                return (<div className={'text-ellipsis'}>{data}</div>);
            }
        },{
            title : i18n.t(100284/*币种*/),
            dataIndex : "cny"+language,
            key : "cny"+language,
            width : "5%",
            render(data,row,index){
                return (<div className={'text-ellipsis'}>{data}</div>);
            }
        },{
            title : i18n.t(200591/*收款金额*/),
            dataIndex : "receiptAmt",
            key : "receiptAmt",
            width : "8%",
            render(data,row,index){
                return (<div className={'text-ellipsis'}>{toDecimal(data)}</div>);
            }
        },{
            title : i18n.t(500200/*退款金额*/),
            dataIndex : "refundAmt",
            key : "refundAmt",
            width : "8%",
            render(data,row,index){
                return (<div className={'text-ellipsis'}>{toDecimal(data)}</div>);
            }
        },{
            title : i18n.t(200609/*已核销金额*/),
            dataIndex : "haveVerificationAmt",
            key : "haveVerificationAmt",
            width : "8%",
            render(data,row,index){
                return (<div className={'text-ellipsis'}>{toDecimal(data)}</div>);
            }
        },{
            title : i18n.t(201106/*未核销金额*/),
            dataIndex : "notVerificationAmt",
            key : "notVerificationAmt",
            width : "8%",
            render(data,row,index){
                return (<div className={'text-ellipsis'}>{toDecimal(data)}</div>);
            }
        }];

        this.state = {
            data: [],
            currentPage: 1,
            pageSize: 20
        }
    }

    //拉取数据
    getPage = (currentPage) => {
        let that = this;
        let params = Object.assign({}, {
            pageSize: this.state.pageSize,
            currentPage: 1,
        });
        apiGet(API_FOODING_ERP,'/foreexchange/getPage',params,
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
        // return xt.equalsObject(state, this.state);
        return true;
    }

    //更多
    onMore = () => {
        let {navAddTab} = this.props;
        navAddTab({name: i18n.t(201098/*收汇记录*/), component: i18n.t(201098/*收汇记录*/), url: '/sinkrecord'});
        this.props.router.push({pathname: '/sinkrecord', state: {refresh: true}});
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
                    <span className={"drageshow"}>{i18n.t(201098/*收汇记录*/)}</span>
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
                        onHeaderCellClick={this.onHeaderCellClick}
                    />
                </div>
            </div>
        );
    }
};

export default NavConnect(CorporationApplyLimitModel);
