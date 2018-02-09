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
            title : i18n.t(100354/*客户代码*/),
            dataIndex : 'salBeCode',
            key : "salBeCode",
            width : '7%',
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        },{
            title : i18n.t(100355/*客户名称*/),
            dataIndex : "salBe"+language,
            key : "salBe"+language,
            width : "20%",
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        },{
            title : i18n.t(200491/*申请日期*/),
            dataIndex : "billDate",
            key : "billDate",
            width : "9%",
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{new Date(data).Format('yyyy-MM-dd')}</div>)
            }
        },{
            title : i18n.t(100230/*状态*/),
            dataIndex : "statusName",
            key : "statusName",
            width : "7%",
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        },{
            title : i18n.t(500207/*赔付比例*/),
            dataIndex : "compenScale",
            key : "compenScale",
            width : "7%",
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        },{
            title : i18n.t(200505/*合同支付方式*/),
            dataIndex : "payTrmCorpTyLcName",
            key : "payTrmCorpTyLcName",
            width : "9%",
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        },{
            title : i18n.t(200506/*信用期限*/),
            dataIndex : "creTerm",
            key : "creTerm",
            width : "9%",
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{(data?data:0)+' '+i18n.t(200519/*天*/)}</div>)
            }
        },{
            title : i18n.t(200492/*已批复限额*/),
            dataIndex : "replyAmt",
            key : "replyAmt",
            width : "9%",
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data?toDecimal(data)+' '+row['cny'+language]:0 +' '+(row['cny'+language]?row['cny'+language]:'')}</div>)
            }
        },{
            title : i18n.t(200525/*信保余额*/),
            dataIndex : 'creditBal',
            key : "creditBal",
            width : "8%",
            render(data,row ,index){
                return (toDecimal(data) || 0) + ' ' + (row['cny'+language]?row['cny'+language]:'');
            }
        },{
            title : i18n.t(100336/*备注*/),
            dataIndex : "remark",
            key : "remark",
            width : "15%",
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

    //拉取数据
    getPage = (currentPage) => {
        let that = this;
        let params = Object.assign({}, {
            pageSize: this.state.pageSize,
            currentPage: 1,
        });
        apiGet(API_FOODING_ERP, '/creditinslimit/getPage', params, (response) => {
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
    //双击进入详情
    onRowDoubleClick = (record,index,checked) => {
        let {navAddTab} =this.props;
        navAddTab({id:7,name:i18n.t(200516/*信保限额申请详情*/),component:i18n.t(200516/*信保限额申请详情*/),url:'/corporationapplylimit/detail'});
        this.props.router.push({
            pathname:'/corporationapplylimit/detail',
            query:{id:record['billId']},
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
        navAddTab({name: i18n.t(200517/*信保限额申请*/), component: i18n.t(200517/*信保限额申请*/), url: '/corporationapplylimit/list'});
        this.props.router.push({pathname: '/corporationapplylimit/list', state: {refresh: true}});
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
                    <span className={"drageshow"}>{i18n.t(200517/*信保限额申请*/)}</span>
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
                        singleSelect ={true}
                        columns={this.columns}
                        data={this.state.data || []}
                        checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
                        scroll={{x:true,y:this.state.scroll}}
                        onRowDoubleClick={this.onRowDoubleClick}
                    />
                </div>
            </div>
        );
    }
};

export default NavConnect(CorporationApplyLimitModel);
