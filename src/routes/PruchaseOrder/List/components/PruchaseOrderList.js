import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';

import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table from "../../../../components/Table";//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层

import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,
	language,pageSize,sizeList,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

class PruchaseOrderList extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.addClick=this.addClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.getPages=this.getPages.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.columns = [{
			title : i18n.t(400048/*单据编号*/),
			dataIndex : "no",
			key : "no",
			width : "6%",
			sort:'no',
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "6%",
			sort:'billDate',
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(100312/*供应商*/),
			dataIndex : "vndBe"+language,
			key : "vndBe"+language,
			width : "14%",
			sort:'vndBeId',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title : i18n.t(201001/*送达类型*/),
			dataIndex : "arrPlaceTypeName",
			key : "arrPlaceTypeName",
			width : "4%",
			sort:'arrPlaceType',
			render(data,row,index){
				return data || "";
			}
		},{
			title : i18n.t(100379/*产品*/),
			dataIndex : "mtl"+language,
			key : "mtl"+language,
			width : "8%",
			sort:'mtlId',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title : i18n.t(100382/*产品规格*/),
			dataIndex : "basSpeci",
			key : "basSpeci",
			width : "14%",
			sort:'basSpeci',
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title : i18n.t(100319/*采购数量*/),
			dataIndex : "purQty",
			key : "purQty",
			width : "5%",
			sort:'purQty',
			className:'text-center',
			render(data,row,index){
				if(data && !row.type){
					return (<div>{data}&nbsp;&nbsp;{row['uom'+language]}</div>)
				}
				return "";
			}
		},{
			title : i18n.t(200847/*含税单价*/),
			dataIndex : "purTaxPrc",
			key : "purTaxPrc",
			width : "5%",
			sort:'purTaxPrc',
			className:'text-center',
			render(data,row,index){
				if(data && !row.type){
					return (<div>{toDecimal(data)}&nbsp;&nbsp;{row.cnyEnName}</div>)
				}
				return "";
			}
		},{
			title : i18n.t(400098/*采购总额*/),
			dataIndex : "setTaxAgg",
			key : "setTaxAgg",
			width : "6%",
			sort:'setTaxAgg',
			className:'text-right',
			render(data,row,index){
				if(data){
					return (<div>{toDecimal(data)}&nbsp;&nbsp;{row.cnyEnName}</div>)
				}
				return "";
			}
		},{
			title : i18n.t(400037/*采购员*/),
			dataIndex : "purStaff"+language,
			key : "purStaff"+language,
			width : "8%",
			sort:'purStaffId',
			className:'text-center',
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : 'statusName',
			key : "statusName",
			width : '4%',
			sort:'status',
			render(data,row,index){
				return data;
			}
		}];
	}

	initState(){
		return{
			scrollHeight:0,
			choised:false,
			checkedRows:[],
			choised:false,
			pageSize:pageSize,
			currentPage:1,
			data:[],
			filter:null,
		}
	}
	//请求列表  list
	getPages(currentPage,order){
		let that = this;
		this.columnSort = order = order || this.columnSort;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP,orderType:20},that.normalRef.getForm(),order);
		apiGet(API_FOODING_ERP,'/purorder/getPage',object,
				(response)=>{	
					that.setState({	
						data: response.data.data,
						totalPages: response.data.totalPages,
						totalRecords:response.data.totalRecords,
						currentPage: response.data.currentPage 	
					});
				},(errors)=>{
		});
	}
	addClick(){
		let {navAddTab, navRemoveTab} = this.props;
	     navRemoveTab({name:i18n.t(200988/*采购订单编辑*/),component:i18n.t(200988/*采购订单编辑*/),url:'/pruchaseorder/add'});
	     navAddTab({ name: i18n.t(200989/*采购订单新增*/), component: i18n.t(200989/*采购订单新增*/), url: '/pruchaseorder/add'});
	     this.props.router.push({pathname: '/pruchaseorder/add'});
	}
	deleteClick =() => {
		let numArr = this.refs.pruchaseOrder.getSelectArr(),billId;
		if(!numArr.length){
			ServiceTips({text:i18n.t(100394/*请选择数据！*/),type:"info"});
			return false;
		}
		billId = numArr[0].billId;
		Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
		  done: () => {
			    this.deletedFunc(billId);
			},
			close:() => {
				//console.log('no, close')
			}
		});
	}
	// 调用删除 ajax
	deletedFunc = (ID) => {
		let that = this;
		apiForm(API_FOODING_ERP,'/purorder/delete',{billId: ID},
			(response)=>{
				ServiceTips({text:response.message,type:'sucess'});
				that.getPages();
			},(error)=>{
				ServiceTips({text:error.message,type:'error'});
		});
	}

	onSaveAndClose(){
		this.setState({
			showDilaog:!this.state.showDilaog
		})
	}
	//付款申请的保存
	onPaymentSaveAndClose = id => {
		this.setState({
			showDilaog:false
		},() => {
			let {navAddTab, navRemoveTab} = this.props;
		     navRemoveTab({name:i18n.t(201002/*新增付款申请*/),component:i18n.t(201002/*新增付款申请*/),url:'/paymentApplication/addEidt'});
		     navAddTab({ name: i18n.t(201003/*编辑付款申请*/), component: i18n.t(201003/*编辑付款申请*/), url: '/paymentApplication/addEidt'});
		     this.props.router.push({pathname: '/paymentApplication/addEidt',query:{id:id},state: {refresh: true}});
		})

	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}


	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({name:i18n.t(200990/*采购订单详情*/),component:i18n.t(200990/*采购订单详情*/),url:'/pruchaseorder/detail'});
		this.props.router.push({pathname:'/pruchaseorder/detail',query:{id:record.billId},state: {refresh: true}});
	}
	handleResize(e,height){
		this.filterHeight = height || this.filterHeight || 50;
		 let sch = document.body.offsetHeight - this.filterHeight - 92;
         let scroll = sch - 90;
		 this.setState({scrollHeight:sch+'px',scroll:scroll});
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
		let that = this;
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader normalRef={no => this.normalRef = no}  getPages ={this.getPages} expandFilter={this.handleResize}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}/>
						<Page 
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages} 
							totalRecords={this.state.totalRecords}
							sizeList={sizeList}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								this.setState({ pageSize: Number.parseInt(num) },()=>this.getPages(currentPage, num));
							}} 
							backClick={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPages(num));
							}} 
							nextClick={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPages(num));										
							}}
							goChange={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPages(num));																				
							}}								
						/>
					</div>
					
						<Table
							ref = "pruchaseOrder"
							columns={this.columns}
							data={this.state.data}
							checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
							colorFilterConfig={{show : false,dataIndex:'colorType'}}
							followConfig={{show:false}}
							scroll={{x:true,y:this.state.scroll}}
							onRowDoubleClick={this.onRowDoubleClick}
							singleSelect={true}
							onHeaderSortClick={this.getPages.bind(this, null)}
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
export default NavConnect(PruchaseOrderList);

/*handleClick(e,data){
	if(data.type== 1){
		let content=require('./ProviderContactListEdit').default;
		let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel})
		this.setState({
			showDilaog : true,
			title: i18n.t(100439*//*编辑*//*),
			dialogContent: element
		})
	}else if(data.type == 2){
		let {navAddTab, navRemoveTab} = this.props;
			navRemoveTab({name:i18n.t(200990*//*采购订单详情*//*),component:i18n.t(200990*//*采购订单详情*//*),url:'/pruchaseorder/contact'});
			navAddTab({ name: i18n.t(200990*//*采购订单详情*//*), component: i18n.t(200990*//*采购订单详情*//*), url: '/pruchaseorder/contact'});
			this.props.router.push({pathname: '/pruchaseorder/contact',query:{id:data.record.billId}});
	}else if(data.type == 3){
		let {navAddTab, navRemoveTab} = this.props;
			navRemoveTab({name:i18n.t(200990*//*采购订单详情*//*),component:i18n.t(200990*//*采购订单详情*//*),url:'/pruchaseorder/date'});
			navAddTab({ name: i18n.t(200990*//*采购订单详情*//*), component: i18n.t(200990*//*采购订单详情*//*), url: '/pruchaseorder/date'});
			this.props.router.push({pathname: '/pruchaseorder/date',query:{id:data.record.billId}});
	}else if(data.type == 4){//付款申请
		apiGet(API_FOODING_ERP,"/paymentapplcat/getList",{sourceNo:data.record.no},response => {
			let initTableData = response.data;
			//订单金额
			let setTaxAgg = data.record.setTaxAgg;
			//金额币种
			let cnyLcName = data.record.cnyLcName;
			let billId = data.record.billId;
			let content = require('./PaymentRequest').default;
			let element = React.createElement(content, {onSaveAndClose: this.onPaymentSaveAndClose, onCancel: this.onCancel,setTaxAgg:setTaxAgg,billId:billId,initTableData:initTableData,cnyLcName:cnyLcName});
			this.setState({
				showDilaog: true,
				title: i18n.t(400040*//*付款申请*//*),
				dialogContent: element
			})
		},error => ServiceTips({text:error.message,type:"error"}))
	}else if(data.type == 5){//入库通知
		Confirm("你确定执行入库通知？", {
			done: () => {
				apiForm(API_FOODING_ERP,"/purorder/noticeIn",{billId:data.record.billId},response => {
					let {navAddTab, PurOrder, navRemoveTab} = this.props;
					navAddTab({name:i18n.t(201004*//*编辑入库通知单*//*),component:i18n.t(201004*//*编辑入库通知单*//*),url:'/stockin/add'});
					this.props.router.push({pathname:'/stockin/add',query:{id:response.data}})
				},error => {
					ServiceTips({text:error.message,type:'error'})
				})
			},
			close:() => {
				console.log('no, close')
			}
		});

	}else if(data.type == 6){//订单调整
		let billId = data.record.billId;
		apiForm(API_FOODING_ERP,'/purorder/adjust',{billId:billId},response => {
			let obj = response.data;
			let {navAddTab, navRemoveTab} = this.props;
			if(obj && obj.status == 1){
				//草稿状态 跳转到编辑页面
				navRemoveTab({name:i18n.t(400092*//*采购调整*//*),component:i18n.t(400092*//*采购调整*//*),url:'/pruchaseorderadjust/edit'});
				navAddTab({name:i18n.t(400092*//*采购调整*//*),component:i18n.t(400092*//*采购调整*//*),url:'/pruchaseorderadjust/edit'});
				this.props.router.push({pathname:'/pruchaseorderadjust/edit',query:{id:obj.billId,isView:false}})
			}else{
				//其他状态，跳转到详情页面
				navRemoveTab({name:i18n.t(201005*//*采购调整详情*//*),component:i18n.t(201005*//*采购调整详情*//*),url:'/pruchaseorderadjust/detail'});
				navAddTab({name:i18n.t(201005*//*采购调整详情*//*),component:i18n.t(201005*//*采购调整详情*//*),url:'/pruchaseorderadjust/detail'});
				this.props.router.push({pathname:'/pruchaseorderadjust/detail',query:{id:obj.billId,isView:true}})
			}
		},error => ServiceTips({text:error.message,type:'error'}))
	}else if(data.type == 7){//查看审批

	}else if(data.type == 8){//发送采购订单

	}
}*/
/*contextMenuConfig={{
	enable:true,
	contextMenuId:'SIMPLE_TABLE_MENU',
	menuItems:[{
		onClick:this.handleClick,
		content:<div><i className={'foddingicon fooding-email'}></i><span>{i18n.t(200256*//*发邮件*//*)}</span></div>,
		data:{action:i18n.t(200256*//*发邮件*//*),type:1}
	},{
		onClick:this.handleClick,
		content:<div><i className={'foddingicon fooding-contact'}></i>{i18n.t(100588*//*联络*//*)}</div>,
		data:{action:i18n.t(100588*//*联络*//*),type:2}
	},{
		onClick:this.handleClick,
		content:<div><i className={'foddingicon fooding-yuehui'}></i><span>{i18n.t(100587*//*约会*//*)}</span></div>,
		data:{action:i18n.t(100587*//*约会*//*),type:3}
	},{
		onClick:this.handleClick,
		condition: [{key: 'status', value: 10, exp: '=='}],
		content:<div><i className={'foddingicon fooding-payment-apply'}></i><span>{i18n.t(400040*//*付款申请*//*)}</span></div>,
		data:{action:i18n.t(400040*//*付款申请*//*),type:4}
	},{
		onClick:this.handleClick,
		condition: [{key: 'status', value: 10, exp: '=='}],
		content:<div><i className={'foddingicon fooding-put'}></i><span>{i18n.t(100468*//*入库通知*//*)}</span></div>,
		data:{action:i18n.t(100468*//*入库通知*//*),type:5}
	},{
		onClick:this.handleClick,
		condition: [{key: 'status', value: 10, exp: '=='}],
		content:<div><i className={'foddingicon fooding-order'}></i><span>{i18n.t(100469*//*订单调整*//*)}</span></div>,
		data:{action:i18n.t(100469*//*订单调整*//*),type:6}
	},{
		onClick:this.handleClick,
		content:<div><i className={'foddingicon fooding-approve'}></i><span>{i18n.t(100470*//*查看审批*//*)}</span></div>,
		data:{action:i18n.t(100470*//*查看审批*//*),type:7}
	},{
		onClick:this.handleClick,
		content:<div><i className={'foddingicon fooding-send'}></i><span>{i18n.t(201006*//*发送采购订单*//*)}</span></div>,
		data:{action:i18n.t(201006*//*发送采购订单*//*),type:8}
	}]
}}*/
