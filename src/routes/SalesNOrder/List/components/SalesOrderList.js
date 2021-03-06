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

import {apiGet, apiPost, apiForm,
	API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,
	language,toDecimal} from "../../../../services/apiCall";
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
		this.copyClick=this.copyClick.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.handleClick=this.handleClick.bind(this);
		this.columns = [{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : 'statusName',
			key : "statusName",
			width : '7%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "10%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(200387/*销售订单号*/),
			dataIndex : "no",
			key : "no",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400011/*销售员*/),
			dataIndex : "saleStaff"+language,
			key : "saleStaff"+language,
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100311/*客户*/),
			dataIndex : 'salBe'+language,
			key : "salBe"+language,
			width : "15%",
			render(data,row ,index){
				return data;
			}
		},{
			title : i18n.t(100133/*支付条款*/),
			dataIndex : "payTrm"+language,
			key : "payTrm"+language,
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(200165/*销售总额*/),
			dataIndex : 'saleTaxAmt',
			key : "saleTaxAmt",
			width : "12%",
			render(data,row,index){
				return <div>{data?toDecimal(data)+ ' '+row["cny"+language]:''}</div>;
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
			pageSize:20
		}
	}
	addClick(){
		let {navAddTab,navRemoveTab} =this.props;
		navAddTab({name:i18n.t(201064/*国内销售订单新增*/),component:i18n.t(201064/*国内销售订单新增*/),url:'/salesn/addEidt/add'});
		this.props.router.push({pathname:'/salesn/addEidt/add',query:{salBeId:this.props.id}});
	}
	deleteClick(){
		let numArr = this.refs.mainTab.getSelectArr();
        if(numArr.length > 0){
        	Confirm("您确定要删除这条数据吗？", {
			  done: () => {
				    apiForm(API_FOODING_ERP,'/insale/delete',{billId:numArr[0].billId},(response)=>{
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
        }else {
        	ServiceTips({text:i18n.t(200528/*请选择一条数据进行删除*/),type:'error'});
        }
	}
	// ajax list
	getPage(currentPage,value){
		    console.log(this.props.id);
		    let that = this;
		    let object;
		    let pageSize = value|| this.state.pageSize;
		    let currentP = !isNaN(currentPage)? currentPage: 1;
		    if(this.normalRef.getForm().salBeId){
		    	object=Object.assign({},{pageSize: pageSize, currentPage:currentP,salBeId:this.props.id,businessNo:this.props.businessNo},this.normalRef.getForm());
		    }else{
		    	let a = this.normalRef.getForm();
		    	delete a.salBeId;
		    	object=Object.assign({},{pageSize: pageSize, currentPage:currentP,salBeId:this.props.id,businessNo:this.props.businessNo},a);
		    }
			apiGet(API_FOODING_ERP,'/insale/getPage',object,
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
	copyClick(){
		console.log('copyClick')
	}
	handleClick(e,data){
		let numArr = this.refs.mainTab.getSelectArr();
	    if(data.type == 2){
			let {navAddTab, navRemoveTab} = this.props;
             navRemoveTab({name:i18n.t(200962/*销售订单详情*/),component:i18n.t(200962/*销售订单详情*/),url:'/SalesOrder/contact'});
             navAddTab({ name: i18n.t(200962/*销售订单详情*/), component: i18n.t(200962/*销售订单详情*/), url: '/SalesOrder/contact'});
             this.props.router.push({pathname: '/SalesOrder/contact',query:{id:data.record.billId}});
		}else if(data.type == 3){
			let {navAddTab, navRemoveTab} = this.props;
             navRemoveTab({name:i18n.t(200962/*销售订单详情*/),component:i18n.t(200962/*销售订单详情*/),url:'/SalesOrder/date'});
             navAddTab({ name: i18n.t(200962/*销售订单详情*/), component: i18n.t(200962/*销售订单详情*/), url: '/SalesOrder/date'});
             this.props.router.push({pathname: '/SalesOrder/date',query:{id:data.record.billId}});
		}else if(data.type == 4){

		}else if(data.type == 5){

		}else if(data.type == 6){

		}else if(data.type == 7){

		}else if(data.type == 8){
			Confirm(i18n.t(200369/*您确定要提交此订单吗*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/common/submitBill",{billId:numArr[0].billId,billType:numArr[0].billType},response => {
				    	//刷新当前页面
				    	this.getPage();
				    	ServiceTips({text:response.message,type:"success"})
				    },error => {
				    	ServiceTips({text:error.message,type:'error'})
				    })
				},
				close:() => {
					console.log('no, close')
				}
			});
		}
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({name:i18n.t(201057/*国内销售订单详情*/),component:i18n.t(201057/*国内销售订单详情*/),url:'/salesn/detail'});
		this.props.router.push({pathname:'/salesn/detail',query:{id:record.billId}});
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
			meun = [{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-contact'}></i>{i18n.t(100588/*联络*/)}</div>,
					data:{action:i18n.t(100588/*联络*/),type:2}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-yuehui'}></i>{i18n.t(100587/*约会*/)}</div>,
					data:{action:i18n.t(100587/*约会*/),type:3}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-caigou-icon'}></i>{i18n.t(200743/*采购指令*/)}</div>,
					data:{action:i18n.t(200743/*采购指令*/),type:4}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-yuehui'}></i>{i18n.t(200744/*订舱指令*/)}</div>,
					data:{action:i18n.t(200744/*订舱指令*/),type:5}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-order'}></i>{i18n.t(100469/*订单调整*/)}</div>,
					data:{action:i18n.t(100469/*订单调整*/),type:6}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-approve'}></i>{i18n.t(100470/*查看审批*/)}</div>,
					data:{action:i18n.t(100470/*查看审批*/),type:7}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-submit'}></i>{i18n.t(100472/*提交*/)}</div>,
					data:{action:i18n.t(100472/*提交*/),type:8}
				}]

		return(<div>
			<FilterHeader id={this.props.id||this.props.businessNo}
			 getPage = {this.getPage} normalRef={no => this.normalRef = no}
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
