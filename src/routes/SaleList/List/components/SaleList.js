import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";

import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
class SalesOrderList extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.columns = [{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : 'statusName',
			key : "statusName",
			width : '5%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(400122/*退货单号*/),
			dataIndex : "no",
			key : "no",
			width : "7%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "8%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(400008/*销售单号*/),
			dataIndex : "sourceNo",
			key : "sourceNo",
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100311/*客户*/),
			dataIndex : 'salBe'+language,
			key : "salBe"+language,
			width : "12%",
			render(data,row ,index){
				return data;
			}
		},{
			title : i18n.t(400123/*退货金额*/),
			dataIndex : "orderAmt",
			key : "orderAmt",
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data?toDecimal(data)+' '+row["cny"+language]:0+' '+row["cny"+language]}</div>)
			}
		},{
			title : i18n.t(400011/*销售员*/),
			dataIndex : 'saleStaff'+language,
			key : 'saleStaff'+language,
			width : "5%",
			render(data,row,index){
				return data;
			}
		}];
		this.getPage = this.getPage.bind(this);
	}

	initState(){
		return{
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:[],
			MeunState:true,
			currentPage:1,
			pageSize:20,
			id:this.props.location.query.id
		}
	}
	addClick(){
		let {navAddTab,navRemoveTab} =this.props;
		navRemoveTab({name:i18n.t(200239/*销售订单编辑*/),component:i18n.t(200239/*销售订单编辑*/),url:'/salesorder/addEidt'});
		navAddTab({id:7,name:i18n.t(201054/*销售订单新增*/),component:i18n.t(201054/*销售订单新增*/),url:'/salesorder/addEidt'});
		this.props.router.push({pathname:'/salesorder/addEidt',query:{salBeId:this.props.id}});
	}
	deleteClick(){
		let numArr = this.refs.mainTab.getSelectArr();
        if(numArr.length > 0){
        	Confirm("您确定要删除这条数据吗？", {
			  done: () => {
				    apiForm(API_FOODING_ERP,'/saleorderreturn/delete',{billID:numArr[0].billId},(response)=>{
		    				this.getPage();
		    				ServiceTips({text:response.message,type:'sucess'});
		    		},(error)=>{
		    				ServiceTips({text:error.message,type:'error'});
		    		})
				},
				close:() => {
					console.log('no, close')
				}
			});
        }
	}
	// ajax list
	getPage(currentPage,value){
		    let that = this;
		    let object;
		    let pageSize = value|| this.state.pageSize;
		    let currentP = !isNaN(currentPage)? currentPage: 1;
		    if(this.normalRef.getForm().salBeId){
		    	object=Object.assign({},{pageSize: pageSize,
		    		currentPage:currentP,sourceNo:this.state.id
		    		},this.normalRef.getForm());
		    }else{
		    	let a = this.normalRef.getForm();
		    	delete a.salBeId;
		    	object=Object.assign({},{pageSize: pageSize,
		    		currentPage:currentP,sourceNo:this.state.id,
		    		},a);
		    }
			apiGet(API_FOODING_ERP,'/saleorderreturn/getPage',object,
				(response)=>{
					that.setState({
						data: response.data.data,
						totalPages: response.data.totalPages,
						currentPage: response.data.currentPage,
						totalRecords:response.data.totalRecords 	
					});
				},(errors)=>{
			});


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
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:6,name:i18n.t(201055/*销售退货详情*/),component:i18n.t(201055/*销售退货详情*/),url:'/salelist/detail'});
		this.props.router.push({pathname:'/salelist/detail',query:{id:record.billId}});
	}
	handleResize(e, height) {
		 this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        this.setState({scroll: scroll});
	}
	componentDidMount(){
		this.getPage();
		window.addEventListener('resize', this.handleResize(47));
    }
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	render(){
		let {data} = this.state;
		let meun;
		let that = this;
		return(<div>
			<FilterHeader id={this.props.id||this.props.businessNo}
			getPage = {this.getPage}
			normalRef={no => this.normalRef = no}
			expandFilter={this.handleResize}
			/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys businessNo={this.props.businessNo} addClick={this.addClick} deleteClick={this.deleteClick}/>
						 <Page totalPages={this.state.totalPages}
                                      currentPage={this.state.currentPage}
                                      totalRecords={this.state.totalRecords}
                                      currentSize={this.state.size}
                                      pageSizeChange={(value) => {
                                          if (this.state.size == value) {
                                              return;
                                          }
                                          this.getPage(this.state.currentPage, value);
                                      }} backClick={(v) => {
                                    if (this.state.currentPage == v) {
                                        return;
                                    }
                                    this.getPage(v);
                                }} nextClick={(v) => {
                                    if (this.state.currentPage == v) {
                                        return;
                                    }
                                    this.getPage(v);
                                }}
                                      goChange={(v) => {
                                          if (this.state.currentPage == v) {
                                              return;
                                          }
                                          this.getPage(v);
                                      }}
                                />
					</div>
					<Table
						singleSelect ={true}
						columns={this.columns} ref = "mainTab"
						data={data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						onRowDoubleClick={this.onRowDoubleClick}
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
