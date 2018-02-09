import i18n from './../../../../lib/i18n';
import React, {Component} from "react";
import Dialog from "../../../../components/Dialog/Dialog";
import Confirm from "../../../../components/Dialog/Confirm"; //删除弹层
import BusinessKey from "./SampleListKeys";
import NavConnect from "../../../../components/NavigateTabs/containers/AddContainer";

import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiForm, apiGet,toDecimal} from "../../../../services/apiCall";

const {Table} = require("../../../../components/Table");

class SampleList extends Component{
    constructor(props){
        super(props);
        props.sample && props.sample(this);
        this.columns = [{
            title : i18n.t(200260/*样品编号*/),
            dataIndex : 'no',
            key : "no",
            width : '10%',
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        },{
            title : i18n.t(400011/*销售员*/),
            dataIndex : "saleStaffLcName",
            key : "saleStaffLcName",
            width : "10%",
            render(data,row,index){
                return data;
            }
        },{
            title : i18n.t(200165/*销售总额*/),
            dataIndex : "saleTaxAmt",
            key : "saleTaxAmt",
            width : "10%",
            render(data,row,index){
                return toDecimal(data);
            }
        },{
            title : i18n.t(500125/*货币*/),
            dataIndex : "cnyLcName",
            key : "cnyLcName",
            width : "10%",
            render(data,row,index){
                return (<div className="text-ellipsis" title={data}>{data}</div>)
            }
        },{
            title : i18n.t(400049/*业务状态*/),
            dataIndex : 'statusName',
            key : "statusName",
            width : "8%",
            render(data,row ,index){
                return data;
            }
        },{
            title : i18n.t(100323/*业务日期*/),
            dataIndex : "billDate",
            key : "billDate",
            width : "7%",
            render(data,row,index){
                return new Date(data).Format("yyyy-MM-dd");
            }
        }
        ];
        this.handleResize = this.handleResize.bind(this);
        this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
        this.state=this.initState();
        this.filterData = {};
    }
    initState(){
        return {
            showDilaog:false,
            showApproval:false,
            paddingTop:false,
            selectArr:[],
            checkedRows:[],
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
            businessSource : [],
        }
    }
    onRowDoubleClick(record,index,checked){
        let {navAddTab} =this.props;
        navAddTab({name:i18n.t(200170/*销售样品单详情*/),component:i18n.t(200170/*销售样品单详情*/),url:'/samporder/detail'});
        this.props.router.push({pathname: '/samporder/detail', query: {id: record.billId}});
    }

    handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = this.state.paddingTop ? 173:262;
        let sch=document.body.offsetHeight-height-padding;
        let scroll = sch - 135 ;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }

    getPages(currentPage, size, filter, order) {
        filter = filter || {};
        order = order || {column: 'billId', order: 'desc'};
        let {page} = this.state;
        currentPage = currentPage || 0;
        size = size || page.size;
        let params = Object.assign({businessId: this.props.businessOne.billId}, {currentPage: currentPage, pageSize: size}, filter, order, this.filterData);
        apiGet(API_FOODING_ERP, '/specimen/getPage', params, (response) => {
            let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
            this.setState({
                businessSource: data || [],
                page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
            });
        }, (message) => {
            errorTips(message.message)
        });
    }

    deleteClick = () =>{
        let numArr = this.refs.mainTable.getSelectArr();
        if( !numArr.length) return errorTips(i18n.t(100434/*请选择一条数据！*/));
        Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            done: () => {
                apiForm(API_FOODING_ERP, '/specimen/delete', {billId: numArr[0].billId}, response => {
                    successTips(response.message);
                    this.getPages();
                }, error=>{
                    errorTips(error.message)
                })
            }
        });
    };

    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize(0));
    };
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
        if((nextProps.businessOne || {}).billId !== (this.props.businessOne || {}).billId){
            this.filterData['businessId'] = nextProps.businessOne.billId;
            if(!this.props.isDetail){
                this.getPages();
            }
        }
    }
    render(){
        return (
            <div className={"client-business-list"}>
                <div className="content-margin"/>
                <div className={"client-business-list-content"} style={{height:this.state.scrollHeight}}>
                    <BusinessKey  deleteClick={this.deleteClick} page={this.state.page} getPages={this.getPages.bind(this)} />
                    <Table ref="mainTable"
                        columns={this.columns}
                        singleSelect={true}
                        data={this.state.businessSource}
                        checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
                        scroll={{x:true,y:this.state.scroll}}
                        onRowDoubleClick={this.onRowDoubleClick}
                    />
                    <Dialog width={926} visible={this.state.showDilaog} titleLeft={this.state.title}>
                        {this.state.dialogContent}
                    </Dialog>
                </div>
            </div>
        )
    }
}

export default NavConnect(SampleList);
