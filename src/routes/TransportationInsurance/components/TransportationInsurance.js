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
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import Transportation from './Transportation';
class TransportationInsurance extends Component{
	constructor(props){
		super(props);
		let that = this;
		this.handleResize = this.handleResize.bind(this);
		// init func
		this.getPage = this.getPage.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.state = {
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			checkedData:'',
			rodalShow:false,
			data : [],
			initData: [], // 初始化 数据
			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: 100, // 每页 多少条
			billId: '',
			ccId: '',
			sData:{},

		}
		this.deleteClick = this.deleteClick.bind(this);
		this.paymentClick = this.paymentClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.baoxiaoClick = this.baoxiaoClick.bind(this);
	}
	onSaveAndClose(data){
		this.getPage();
		let {navAddTab,navRemoveTab} = this.props;
		navRemoveTab({id:9,name:i18n.t(200410/*费用单详情*/),component:i18n.t(200410/*费用单详情*/),url:'/charge/detail'});
		navAddTab({id:9,name:i18n.t(200410/*费用单详情*/),component:i18n.t(200410/*费用单详情*/),url:'/charge/detail'});
		this.props.router.push({pathname:'/charge/detail',query:{id:data}});
	}
	baoxiaoClick(e,item){
		let numArr = this.refs.transition.getSelectArr();
				let value=[];
				let values=[];
				var that = this;
				if(numArr.length > 0){
					for (var i = 0; i < numArr.length; i++) {
						value.push(numArr[i].billId);
						values.push(numArr[i].saleNo);

					}
					for (var i = 0;i<values.length-1;i++) {
						for (var j = i+1;j<values.length;j++) {
							if (values[i]==values[j]) {
									
								Confirm(i18n.t(500321/*所选的数据有相同的销售单号,是否继续操作?*/), {
								done: () => {
									      Confirm(i18n.t(500193/*是否确定转报销单?*/), {
											  done: () => {
												      apiForm(API_FOODING_ERP,'/transportpremium/expense',{billIds:value},(response)=>{
												    	that.getPage();
															this.onSaveAndClose(response.data);
												    	ServiceTips({text:response.message,type:'success'});

												    },(errors)=>{
												    	ServiceTips({text:errors.message,type:'error'});
												    });
												},
												close:() => {
												}
											});
									},
									close:() => {
										
									}
								});
								return;
		                    }
					            
		                    
		           		}
					}
					Confirm(i18n.t(500193/*是否确定转报销单?*/), {
								  done: () => {
									      apiForm(API_FOODING_ERP,'/transportpremium/expense',{billIds:value},(response)=>{
									    	that.getPage();
												this.onSaveAndClose(response.data);
									    	ServiceTips({text:response.message,type:'success'});

									    },(errors)=>{
									    	ServiceTips({text:errors.message,type:'error'});
									    });
									},
									close:() => {
									}
					});
					
				}else{
						ServiceTips({text:i18n.t(100434/*请选择一条数据！*/),type:'error'});
				}
	}
	paymentClick(){
		let numArr = this.refs.transition.getSelectArr();
				let value=[];
				let values=[];
				var that = this;
				if(numArr.length > 0){
					for (var i = 0; i < numArr.length; i++) {
						value.push(numArr[i].billId);
						values.push(numArr[i].saleNo);

					}
					for (var i = 0;i<values.length-1;i++) {
						for (var j = i+1;j<values.length;j++) {
							if (values[i]==values[j]) {
									
								Confirm(i18n.t(500321/*所选的数据有相同的销售单号,是否继续操作?*/), {
								done: () => {
									      Confirm(i18n.t(500193/*是否确定转报销单?*/), {
											  done: () => {
												      apiForm(API_FOODING_ERP,'/transportpremium/charge',{billIds:value},(response)=>{
												    	that.getPage();
															this.onSaveAndClose(response.data);
												    	ServiceTips({text:response.message,type:'success'});

												    },(errors)=>{
												    	ServiceTips({text:errors.message,type:'error'});
												    });
												},
												close:() => {
												}
											});
									},
									close:() => {
										
									}
								});
								return;
		                    }
					            
		                    
		           		}
					}
					Confirm(i18n.t(500194/*是否确定转费用单?*/), {
								  done: () => {
									      apiForm(API_FOODING_ERP,'/transportpremium/charge',{billIds:value},(response)=>{
									    	that.getPage();
												this.onSaveAndClose(response.data);
									    	ServiceTips({text:response.message,type:'success'});

									    },(errors)=>{
									    	ServiceTips({text:errors.message,type:'error'});
									    });
									},
									close:() => {
									}
					});
					
				}else{
						ServiceTips({text:i18n.t(100434/*请选择一条数据！*/),type:'error'});
				}
	}
	onCancel(){
		this.setState({
			rodalShow:false
		})
	}
	handleResize(e, height) {
		 this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        this.setState({scroll: scroll});
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(47));
		this.getPage();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}
	// 页面 刷新
	getPage(sData=null){

		let that = this;
		if(sData){
			this.setState({sData:sData,currentPage:1},function(){
				ajax();
			});
		} else{
			ajax();
		}
		// 保存 请求
		function ajax(){
			apiGet(API_FOODING_ERP,'/transportpremium/getPage',Object.assign({pageSize: that.state.pageSize,currentPage: that.state.currentPage},that.state.sData),
				(response)=>{
					that.setState({
						data: response.data.data || [],
						totalPages: response.data.totalPages,
						currentPage: response.data.currentPage
					});
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
			});
		}
	}
	deleteClick(e){
		let select = this.refs.transition.getSelectArr();
		let IDAll = select.map( (o)=>o.billId );
		let that = this;
		if( select.length == 0 ){
			ServiceTips({text:i18n.t(200082/*请选中一条数据*/),type:'error'});
		} else{
			Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
				done: () => {
					apiForm(API_FOODING_ERP,'/transportpremium/delete',{ids: IDAll},
						(response)=>{
							ServiceTips({text:response.message,type:'sucess'});
							that.getPage();
						},(errors)=>{
							ServiceTips({text:errors.message,type:'error'});
					});
				}
			});
		}
	}
	render(){

		let that = this;
		return(<div>
			<FilterHeader getPage={this.getPage} expandFilter={this.handleResize}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
					<div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys paymentClick={this.paymentClick}
						deleteClick = {this.deleteClick}
						getPage={this.getPage} shangchuangClick={this.shangchuangClick} baoxiaoClick={this.baoxiaoClick}/>
						<Page
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages}
							sizeList={[100,500]}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								that.setState({ pageSize: Number.parseInt(num),currentPage:1 },()=>that.getPage());
							}}
							backClick={(num)=>{
								that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());
							}}
							nextClick={(num)=>{
								that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());
							}}
							goChange={(num)=>{
								that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());
							}}
						/>
					</div>

					<Table
						ref = "transition"
						columns={ [{
							title : i18n.t(201238/*起运日期*/),
							dataIndex : 'shipDate',
							key : "shipDate",
							width : '10%',
							render(data,row,index){
								return new Date(data).Format('yyyy-MM-dd')
							}
						},{
							title : i18n.t(201240/*出单保险公司*/),
							dataIndex : 'insurer',
							key : "insurer",
							width : '8%',
							render(data,row,index){
								return (<div title={data} className={'text-ellipsis'}>{data}</div>)
							}
						},{
							title : i18n.t(201241/*保单号次*/),
							dataIndex : " policyNo",
							key : "policyNo",
							width : "12%",
							render(data,row,index){
								return row.policyNo;
							}
						},{
							title : i18n.t(100284/*币种*/),
							dataIndex : "cny",
							key : "cny",
							width : "6%",
							render(data,row,index){
								return data;
							}
						},{
							title : i18n.t(201242/*保险金额*/),
							dataIndex : "amt",
							key : "amt",
							width : "8%",
							render(data,row,index){
								return toDecimal(data);
							}
						},{
							title : "费率%",
							dataIndex : "rate",
							key : "rate",
							width : "8%",
							render(data,row,index){
								return data;
							}
						},{
							title : i18n.t(201243/*保费*/),
							dataIndex : "charge",
							key : "charge",
							width : "6%",
							render(data,row,index){
								return toDecimal(data);
							}
						},{
							title : i18n.t(201244/*汇率*/),
							dataIndex : "exRate",
							key : "exRate",
							width : "8%",
							render(data,row,index){
								return data;
							}
						},{
							title : "保费(RMB)",
							dataIndex : "rmbCharge",
							key : "rmbCharge",
							width : "8%",
							render(data,row,index){
								return toDecimal(data);
							}
						},{
							title : i18n.t(400008/*销售单号*/),
							dataIndex : "saleNo",
							key : "saleNo",
							width : "10%",
							render(data,row,index){
								return data;
							}
						},{
							title : i18n.t(201237/*保险费发票*/),
							dataIndex : "premiumNo",
							key : "premiumNo",
							width : "8%",
							render(data,row,index){
								return data;
							}
						},{
							title : i18n.t(201245/*上传日期*/),
							dataIndex : "uploadDate",
							key : "uploadDate",
							width : "10%",
							render(data,row,index){
								return <div>{new Date(data).Format('yyyy-MM-dd')}</div>;
							}
						},{
							title : i18n.t(100230/*状态*/),
							dataIndex : "statusName",
							key : "statusName",
							width : "10%",
							render(data,row,index){
								return data;
							}
						},{
							title : i18n.t(200406/*费用单*/),
							dataIndex : "chargeNo",
							key : "chargeNo",
							width : "10%",
							render(data,row,index){
								return (<div onClick={that.onSaveAndClose.bind(that,row.chargeId)} className='link-color'>{data}</div>);
							}
						}]}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
					/>

			<Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						<Transportation DialogContent={this.state.DialogContent}
						 getTermModes = {this.state.getTermModes}
						 checkedData = {this.state.checkedData}
						 buttonLeft = {this.state.buttonLeft}
						  onSaveAndClose ={this.onSaveAndClose}
						  contentDate = {this.state.contentDate}
						  onCancel = {this.onCancel}/>
			</Dialog>
		</div>
		</div>
			</div>
		</div>
	)
	}
}
export default NavConnect(TransportationInsurance);
