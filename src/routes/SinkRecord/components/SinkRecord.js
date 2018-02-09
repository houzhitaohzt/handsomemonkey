import i18n from './../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import SinkRecordPlug from "./SinkRecordPlug";
import Paymentrequest from './Paymentrequest';



// ajax
import {permissionsBtn,apiGet,apiPost,toDecimal,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';



class SinkRecord extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.charClick=this.charClick.bind(this);
		this.chargeClick=this.chargeClick.bind(this);
		var that = this;
		this.searchField = xt.getQuerySearch();
		this.onRowClick=this.onRowClick.bind(this);
		this.onHeaderCellClick=this.onHeaderCellClick.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);

		// init func 
		this.getPage = this.getPage.bind(this);
		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.fkapplayClick=this.fkapplayClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);

		this.handleClick=this.handleClick.bind(this);
		
		
		
	
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
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "5%", 
			render(data,row,index){
				return (
					<div>
						{ permissionsBtn('sinkrecord.writeoff') ? <i className='foddingicon fooding-charge' title={i18n.t(200597/*核销*/)} onClick={that.chargeClick.bind(this,data,row)}></i> : ''}
						&nbsp;&nbsp;&nbsp;
						{ permissionsBtn('business.tosample') ? <i className='foddingicon fooding-char-jilu' title={i18n.t(200598/*核销记录*/)} onClick={that.charClick.bind(this,data,row)}></i> : ''}
					</div> 
					);
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
			data: [],
			
			initData: [], // 初始化 数据
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条
			billId: '',	
			ccId: '',
			sData:{},
		}
	}

	componentDidMount(){
		window.addEventListener('resize', this.handleResize(47));
		this.getPage();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	onSaveAndClose(){
		this.setState({
			showDilaog:!this.state.showDilaog,
			billId: '',

		})
	}
	onCancel(){
		this.setState({
			showDilaog:false,
			billId: '',
		},function(){
			//this.getPage();
		});

	}

	// 核销记录
	charClick(e,data){
		

		let that = this;
		let content=require('./Record').default;
		let element=React.createElement(content,{getOne:data,onCancel:that.onCancel,onSaveAndClose:that.onSaveAndClose,checkedData:that.state.checkedData,getPage:that.getPage});
		that.setState({
			showDilaog : true,
			title: i18n.t(200598/*核销记录*/),
			dialogContent: element
		})		

    }

	// 收汇记录 
	chargeClick(...option){

		let that = this;
		let {currentPage} = this.state;

		this.setState({billId: option[1].billId},function(){
			that.getOne(function(){
				let content=require('./CurrencyRecord').default;
				let element=React.createElement(content,{currentPage:currentPage,billId:option[1].billId,onCancel:that.onCancel,onSaveAndClose:that.onSaveAndClose,checkedData:that.state.checkedData,getPage:that.getPage});
				that.setState({
					showDilaog : true,
					title: i18n.t(200597/*核销*/),
					dialogContent: element
				})
			});	
		});

	}

	addClick(ident){

		let title = ident == 'edit' ? i18n.t(201107/*编辑收汇记录*/) : i18n.t(500315/*新增收汇记录*/);
		let that = this;
		this.getOne(function(){
			let content=require('./SinkRecordPlug').default;
			let element=React.createElement(content,{onCancel:that.onCancel,onSaveAndClose:that.onSaveAndClose,checkedData:that.state.checkedData,getPage:that.getPage});
			that.setState({
				showDilaog : true,
				title: title,
				dialogContent: element
			})
		});		
	}
	// 删除
	deleteClick(react,row){

		let that = this;
		let select = this.refs.product.getSelectArr();

		// 删除 条件判断
		if(react){
			if( select.length == 0 ){
				ServiceTips({text:i18n.t(500115/*请选中一条数据？*/),type:'error'});
				
			} else if( select.length > 1 ){
				ServiceTips({text:i18n.t(500220/*不支持批量操作!*/),type:'error'});

			} else{
				this.deleteAjax(select[0].billId); // 删除 请求
			}
		} else{
			this.deleteAjax(row.billId); // 右键
		}
	}

	// 删除 请求
	deleteAjax(ID){
		let that = this;
		Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
			done: () => {
				apiForm(API_FOODING_ERP,'/foreexchange/delete',{billId: ID},
					(response)=>{	
						ServiceTips({text:response.message,type:'success'});
						that.getPage();
						that.setState({billId: ''});
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});	
	}
	fkapplayClick(react,row){
	let that = this;
		let select = this.refs.product.getSelectArr();
		let value=[];
		// 删除 条件判断
		if(react){
			if(select.length == 0 ){
				ServiceTips({text:i18n.t(500115/*请选中一条数据？*/),type:'error'});
				return
				}else if( select.length > 1 ){
					ServiceTips({text:i18n.t(500220/*不支持批量操作!*/),type:'error'});
					return
				}
				this.setState({
				showDilaog:true,
				showHeader:true,
				showSaveAdd:false,
			    showSaveClose:true,
				title:i18n.t(400040/*付款申请*/),
				dialogContent:
				        <Paymentrequest dialogContent={this.state.dialogContent}
						 checkedData = {select[0]}
						 buttonLeft = {this.state.buttonLeft}
						 onSaveAndClose ={this.onSaveAndClose}
						 onCancel = {this.onCancel}

						/>
				
			})

		}
		
	}
	onHeaderCellClick(e,data){
		let {checkedRows, selectArr} = this.state;
		if(data.checkedAll){
			selectArr=selectArr.concat(this.state.data);
			selectArr = Array.from(new Set(selectArr));
			checkedRows= selectArr.map((value,index)=>index);
		}else{
			selectArr=[];
			checkedRows=[];
		}
		this.setState({
			selectArr:selectArr,
			checkedRows:checkedRows,
			choised:data.checkedAll
		})
	}
	onRowClick(record,index,checked){
		let {checkedRows, selectArr} = this.state;
		if(checked){
			selectArr.push(record);
			if(checkedRows.indexOf(index)<0){
				checkedRows.push(index);
			}
		}else{
			selectArr.remove(record);
			checkedRows.remove(index);
		}
		this.setState({
			selectArr:selectArr,
			checkedRows:checkedRows
		})
	}
	onRowDoubleClick(record,index,checked){
	}

	// 右键处理
	handleClick(e,data){
		let ID = data.record.billId;
		if(data.type == 1){
			this.deleteClick(ID);
		}else if(data.type ==2){	
			this.setState({
				billId: ID
			},function(){
				this.addClick("edit");
			});		
  		}
	}

	handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }

	// 新增 数据
	getOne(callBack){

		let that = this;
		apiGet(API_FOODING_ERP,'/foreexchange/getOne',{billId: this.state.billId},
			(response)=>{	
				that.setState({	
					checkedData: response.data,
				},function(){
					callBack && callBack();
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});	
	}

	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},that.searchField,{pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/foreexchange/getPage',object,
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

    searchCustomer = ()=> {
        this.searchField = null;
        this.getPage();

    };
	render(){

		let that = this;
		let {record ,page,currentPage} = this.state;
		return(<div>
			<FilterHeader getPage={this.searchCustomer} expandFilter= {this.handleResize}  normalRef={no => this.normalRef = no} />
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				 <div className="action-buttons">
					<div className={'key-page'}>
					
						<FunctionKeys 
							addClick={this.addClick} 
							deleteClick={this.deleteClick}
							fkapplayClick={this.fkapplayClick}
						/>
						<Page 
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages}
							totalRecords={this.state.totalRecords} 
							sizeList={sizeList}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								this.setState({ pageSize: Number.parseInt(num) },()=>this.getPage(currentPage, num));
							}} 
							backClick={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
							}} 
							nextClick={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));										
							}}
							goChange={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));																				
							}}								
						/>
					</div>
					<Table
						ref = "product"
						columns={this.columns}
						data={this.state.data}					
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll-20}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						onRowDoubleClick={this.onRowDoubleClick}
						contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									permissions:'sinkrecord.del',
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{i18n.t(100437/*删除*/)}</div>,
									data:{type:1,title:i18n.t(100437/*删除*/)}
									},{
										permissions:'sinkrecord.edit',
										condition: [{key: 'status', value: [1], exp: '=='}],
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
										data:{type:2,title:i18n.t(100439/*编辑*/)}
									}]
						}}						
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
export default NavConnect(SinkRecord);

