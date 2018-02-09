import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';

import NavConnect from "../../../components/NavigateTabs/containers/AddContainer";
import Table from "../../../components/Table"; //Table表格

//引入提示
import ServiceTips, {errorTips, successTips} from "../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiForm, apiGet, apiPost} from "../../../services/apiCall";
import xt from "../../../common/xt";

export class BuinessModel extends Component{
    constructor(props) {
       super(props);
        this.columnSort = {column: 'billId', order: 'desc'};
        this.filterData = {};
        this.columns = [{
            title: i18n.t(400048/*单据编号*/),
            dataIndex: 'no',
            key: "no",
            width: '10%',
            render(data, row, index){
                let value = data;
                return (<div className="text-ellipsis" title={value}>{value}</div>)
            }
        }, {
            title: i18n.t(100323/*业务日期*/),
            dataIndex: "billDate",
            key: "billDate",
            width: "10%",
            tooltip: false,
            render(data, row, index){
                return new Date(data).Format("yyyy-MM-dd");
            }
        }, {
            title: i18n.t(100311/*客户*/),
            dataIndex: 'salBeLcName',
            key: "salBeLcName",
            width: '20%',
            render(data, row, index){
                let value = data;

                return (<div className="text-ellipsis" title={value}>{value}</div>)
            }
        }, {
            title: i18n.t(100304/*主题*/),
            dataIndex: "theme",
            key: "theme",
            width: "14%",
            render(data, row, index){
                let value = data;
                return value;
            }
        }, {
            title: i18n.t(400011/*销售员*/),
            dataIndex: "saleStaffLcName",
            key: "saleStaffLcName",
            width: "7%",
            render(data, row, index){
                return data;
            }
        },{
            title: i18n.t(400049/*业务状态*/),
            dataIndex: 'statusName',
            key: "statusName",
            sort: 'status',
            width: "5%",
            tooltip: false,
            render(data, row, index){
                return data;
            }
        }, {
            title: i18n.t(200252/*实际截止日期*/),
            dataIndex: "actEDate",
            key: "actEDate",
            width: "10%",
            tooltip: false,
            render(data, row, index){
                return new Date(data).Format("yyyy-MM-dd");
            }
        },{
            title: i18n.t(200253/*关闭类型*/),
            dataIndex: "closeCauseLcName",
            key: "closeCauseLcName",
            width: "5%",
            render(data, row, index){
                return data;
            }
        }
        ];

        this.state = {
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
            record: []
        }
    }
    //拉取数据
    getPages(size, order) {
        this.columnSort = order = order || this.columnSort;
        size = size || 20;
        let params = Object.assign({}, {currentPage: 1, pageSize: size}, order, this.filterData);
        apiGet(API_FOODING_ERP, '/business/getPage', params, (response) => {
            let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
            this.setState({
                record: data || [],
                page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
            });
            this.getPreferList((data || []).map(da => da.billId));
        }, error => {
            ServiceTips({text:error.message,type:'error'});
        });
    }

    getPreferList = billIds => {
        apiGet(API_FOODING_ERP, '/userprefer/getList', {billIds: billIds.join(','), billType: 301},
            response => {
                let prefer = response.data || [], record = this.state.record;
                let newRecord = [];
                record.forEach( da => {
                    let nPre = prefer.find(pda => pda.billId === da.billId) || {};
                    newRecord.push(Object.assign({}, da, {color: nPre.color, followMark: nPre.followMark}));
                });
                this.setState({record: newRecord});
            }, error => {
                ServiceTips({text:error.message,type:'error'});
            });
    };

    searchCustomer = () => {
        this.getPages();
    };

    searchColor = color => {
        this.filterData['color'] = color;
        this.getPages(0);
    };

    searchFollow = follow => {
        this.filterData['followMark'] = follow;
        this.getPages(0);
    };

    saveColors = (color, rowData) => {
        let params = {billId: rowData.billId, billType: 301, color: color};
        apiForm(API_FOODING_ERP, '/userprefer/setcolor', params, response => {
            rowData.color = color;
            ServiceTips({text:response.message,type:'success'});
        }, error => {
            ServiceTips({text:error.message,type:'error'});
        });
    };

    saveStats = rowData => {
        let mark = !rowData.followMark;
        let params = {billId: rowData.billId, billType: 301, mark};
        apiForm(API_FOODING_ERP, '/userprefer/setmark', params, response => {
            rowData.followMark = mark;
            ServiceTips({text:response.message,type:'success'});
        }, error => {
            ServiceTips({text:error.message,type:'error'});
        });
    };

    //双击跳转
    onRowDoubleClick = (record, index, checked) => {
        let {navAddTab} = this.props;
        let name = i18n.t(100321/*商机*/) + '(' + record.no + ")";
        navAddTab({id: 11, name: name, component: name, url: '/businessOpportunity/detail/' + record.billId});
        this.props.router.push({pathname: '/businessOpportunity/detail/'  + record.billId, query: {id: record.billId}});
    }

    componentDidMount(){
        this.getPages();
    }
    componentWillUnmount(){

    }
    shouldComponentUpdate(props, state) {
        // return xt.equalsObject(state, this.state);
        return true;
    }

    //更多
    onMore = () => {
        let {navAddTab} = this.props;
        navAddTab({name: i18n.t(100321/*商机*/), component: i18n.t(100321/*商机*/), url: '/businessOpportunity/list'});
        this.props.router.push({pathname:'/businessOpportunity/list', state: {refresh: true}});
    };

    //onRefresh 拖拽单个模块刷新
    onRefresh = () => {
        this.getPages();
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
                    <span className={"drageshow"}>{i18n.t(100321/*商机*/)}</span>
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
                    <Table ref="mainTable"
                           columns={this.columns}
                           data={this.state.record}
                           singleSelect={true}
                           checkboxConfig={{show: true, position: 'first'}}
                           colorFilterConfig={{
                               show: true,
                               dataIndex: 'color',
                               onSelect: this.saveColors,
                               onHeaderSelect: this.searchColor
                           }}
                           followConfig={{
                               show: true,
                               onClick: this.saveStats,
                               dataIndex: 'followMark',
                               onHeaderClick: this.searchFollow
                           }}
                           scroll={{x: true, y: this.state.scroll}}
                           onRowDoubleClick={this.onRowDoubleClick}
                           onHeaderSortClick={this.getPages.bind(this, null)}
                    />
                </div>
            </div>
        );
    }
};

export default NavConnect(BuinessModel);
