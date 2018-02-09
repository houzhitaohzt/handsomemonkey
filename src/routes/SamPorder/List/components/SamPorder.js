import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import Page from "../../../../components/Page"; //分页
import Dialog from '../../../../components/Dialog/Dialog'; //弹层
import Confirm from '../../../../components/Dialog/Confirm'; //删除弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";

import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiForm, apiGet,toDecimal} from '../../../../services/apiCall';
const {Table} = require("../../../../components/Table");//Table表格

class SalesOrderList extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.addClick=this.addClick.bind(this);
		this.partyClick=this.partyClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.priceClick=this.priceClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.copyClick=this.copyClick.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.handleClick=this.handleClick.bind(this);
        this.columnSort = {column: 'billId', order: 'desc'};
		this.columns = [{
			title : i18n.t(400048/*单据编号*/),
			dataIndex : "no",
			key : "no",
			width : "8%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400011/*销售员*/),
			dataIndex : "saleStaffLcName",
			key : "saleStaffLcName",
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100311/*客户*/),
			dataIndex : 'salBeLcName',
			key : "salBeLcName",
			width : "15%",
			render(data,row ,index){
				return <div>{data}</div>
			}
		},{
			title : i18n.t(500125/*货币*/),
			dataIndex : "cnyLcName",
			key : "cnyLcName",
			width : "5%",
            tooltip: false,
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(200165/*销售总额*/),
			dataIndex : 'saleTaxAmt',
			key : "saleTaxAmt",
			width : "15%",
			render(data,row,index){
				return toDecimal(data);
			}
		},{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : 'statusName',
			key : "statusName",
            sort: 'status',
			width : '5%',
            tooltip: false,
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "7%",
            tooltip: false,
			render(data,row,index){
				return data?new Date(data).Format('yyyy-MM-dd'): '';
			}
		
		}];
	}

	initState(){
		return{
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:null,
			MeunState:true,
			record:[],
            page: {size: 20, totalPages: 0, currentPage: 1, totalRecords: 0},
		}
	}

	addClick(){
        window.navTabs.open(i18n.t(200183/*新增销售样品单*/), '/samporder/edit/add');
	}

	partyClick(){
	}
	deleteClick(){
		let numArr = this.mainTable.getSelectArr();
		if( !numArr.length) return errorTips(i18n.t(200328/*请选择一条数据进行操作*/));

		Confirm(i18n.t(200372/*删除后将无法恢复，您确定要删除吗*/), {
		  done: () => {
              apiForm(API_FOODING_ERP, '/specimen/delete', {
                  billId: numArr[0].billId
              }, response => {
                  successTips(response.message);
                  this.getPages();
              }, error => {
                  errorTips(error.message);
              })
			}
		});
	}

    getPages(currentPage, size, filter, order) {
        filter = filter || (this.searchForm && this.searchForm.getFieldsValue()) || {};
        this.columnSort = order = order || this.columnSort;
        let {page} = this.state;
        currentPage = currentPage || 0;
        size = size || page.size;
        let params = Object.assign({}, {currentPage: currentPage, pageSize: size}, filter, order, this.filterData);
        apiGet(API_FOODING_ERP, '/specimen/getPage', params, (response) => {
            let {totalRecords, totalPages, currentPage, pageSize, data} = response.data;
            this.setState({
                record: data || [],
                page: {size: pageSize, totalPages: totalPages, currentPage: currentPage, totalRecords: totalRecords}
            });
        }, error => {
            errorTips(error.message)
        });
    }

    searchCustomer = () => {
        this.getPages();
    };

	priceClick(){
	}
	onSaveAndClose(){
		this.setState({
			showDilaog:!this.state.showDilaog
		})
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}
	copyClick(){
		console.log('copyClick')
	}
	handleClick(e,data){
	}

	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:9,name:i18n.t(200170/*销售样品单详情*/),component:i18n.t(200170/*销售样品单详情*/),url:'/samporder/detail'});
		this.props.router.push({pathname: '/samporder/detail', query: {id: record.billId}});

	}
	handleResize(e, height){
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        this.setState({scroll: scroll});
	}
	componentDidMount(){
	    this.handleResize();
		window.addEventListener('resize', this.handleResize);
        this.getPages();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	render(){
		let {record, page} = this.state;
		return(<div>
			<FilterHeader searchCustomer={ this.searchCustomer} formCall={form => this.searchForm = form}/>
			<div className={'client-body'} style={{height: '100%', position: 'absolute'}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}/>
                        <Page totalPages={page.totalPages}
                              currentPage={page.currentPage}
                              totalRecords={page.totalRecords}
                              sizeList={[20, 50, 200]}
                              currentSize={page.size}
                              pageSizeChange={(value) => {
                                  let {page} = this.state;
                                  if (page.size == value) {
                                      return;
                                  }
                                  this.getPages(page.currentPage, value);
                              }} backClick={(v) => {
                            let {page} = this.state;
                            if (page.currentPage == v) {
                                return;
                            }
                            this.getPages(v);
                        }} nextClick={(v) => {
                            let {page} = this.state;
                            if (page.currentPage == v) {
                                return;
                            }
                            this.getPages(v);
                        }}
                              goChange={(v) => {
                                  let {page} = this.state;
                                  if (page.currentPage == v) {
                                      return;
                                  }
                                  this.getPages(v);
                              }}
                        />
					</div>
					<Table ref={rf=>this.mainTable=rf}
						data={record}
                        singleSelect={true}
						columns={this.columns}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onRowDoubleClick={this.onRowDoubleClick}
                           onHeaderSortClick={this.getPages.bind(this, null, null, null)}
					/>
					<Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
						{this.state.dialogContent}
					</Dialog>
					</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(SalesOrderList);

