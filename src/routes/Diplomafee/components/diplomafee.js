import i18n from '../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FunctionKeys from "./FuncKeys";
import FilterHeader from "./FilterHeader";
import DiplomafeePlug from './diplomafeePlug';
import Input from '../../../components/FormValidating/FormValidating';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP,toDecimal} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips'; // 提示
import WebData from "../../../common/WebData";
class Portfht extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.editClick=this.editClick.bind(this);
		this.baoxiaoClick = this.baoxiaoClick.bind(this);
		this.paymentClick = this.paymentClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.handleClick=this.handleClick.bind(this);
		var that = this;
			this.columns = [{
				title : i18n.t(400008/*销售单号*/),
				dataIndex : 'saleNo',
				key : "saleNo",
				width : '10%',
				render(data,row,index){
					return (<div title={data} className={'text-ellipsis'}>{data}</div>)
				}
		},{
				title : i18n.t(500188/*物流单号*/),
				dataIndex : 'sourceNo',
				key : "sourceNo",
				width : '10%',
				render(data,row,index){
					return (<div title={data} className={'text-ellipsis'}>{data}</div>)
				}
		},{
			title : i18n.t(500070/*证书名称*/),
			dataIndex : 'card'+language,
			key : "card"+language,
			width : '14%',
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		
		},{
			title : i18n.t(500072/*是否正本*/),
			dataIndex : "gentMark",
			key : "gentMark",
			width : "6%",
			className:'text-center',
			render(data,row,index){
				return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
				//return <div>{data?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</div>;
			}
		},{
			title : i18n.t(500071/*是否加急*/),
			dataIndex : "origMark",
			key : "origMark",
			width : "6%",
			className:'text-center',
			render(data,row,index){
				return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
				//return <div>{data?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</div>;
			}
		},{
			title : i18n.t(400084/*收款单位*/),
			dataIndex : "recBe"+language,
			key : "recBe"+language,
			width : "10%",
			render(data,row,index){
				return <div>{data}</div>;
			}
		
		},{
			title : i18n.t(200321/*实际金额*/),
			dataIndex : "charge",
			key : "charge",
			width : "10%",
			render(data,row,index){
				return <div>{data?toDecimal(data)+' '+row["cny"+language]:''}</div>;
			}
		},{
			title : i18n.t(200817/*申请人*/),
			dataIndex : "lsStaff"+language,
			key : "lsStaff"+language,
			width : "10%",
			render(data,row,index){
				return <div>{data?row["lsStaff"+language]:''}</div>;
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
			title : i18n.t(500196/*费用/报销单*/),
			dataIndex : "chargeNo",
			key : "chargeNo",
			width : "10%",
			render(data,row,index){
				return <div onClick={that.onClickLink.bind(that,row)} className='link-color'>{data}</div>;
			}
		}];
		this.state = {
			scrollHeight:0,
			filter:null,
			rodalShow:false,
			id:this.props.location.query.id,
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:{},
			data : [],
			pageSize:pageSize,
			currentPage:1
		}
		this.getPage= this.getPage.bind(this);

	}
	onClickLink(row){
		let {navAddTab} =this.props;
 		navAddTab({id:9,name:i18n.t(200410/*费用单详情*/),component:i18n.t(200410/*费用单详情*/),url:'/charge/detail'});
  		this.props.router.push({pathname:'/charge/detail',query:{id:row.chargeId}});
	}
	addClick(){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			title:i18n.t(500191/*新增证书费*/)
		})
	}
	baoxiaoClick(e,item){
		let numArr = this.refs.protfht.getSelectArr();
				let value=[];
				var that = this;
				if(numArr.length > 0){
					for (var i = 0; i < numArr.length; i++) {
						value.push(numArr[i].billId);	
					}
					Confirm(i18n.t(500193/*是否确定转报销单?*/), {
					  done: () => {
						      apiForm(API_FOODING_ERP,'/cardcost/expense',{billIds:value},(response)=>{
						      		that.getPage();
						    	window.navTabs.open(i18n.t(200407/*费用单编辑*/), '/charge/add', {id:response.data});
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
	paymentClick(e,item){
		let numArr = this.refs.protfht.getSelectArr();
				let value=[];
				var that = this;
				if(numArr.length > 0){
					for (var i = 0; i < numArr.length; i++) {
						value.push(numArr[i].billId);	
					}
					Confirm(i18n.t(500194/*是否确定转费用单?*/), {
					  done: () => {
						      apiForm(API_FOODING_ERP,'/cardcost/charge',{billIds:value},(response)=>{
						    	that.getPage();
						    	window.navTabs.open(i18n.t(200407/*费用单编辑*/), '/charge/add', {id:response.data});
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
	deleteClick(data,row,event){
		let numArr = this.refs.protfht.getSelectArr();
				let value=[];
				var that = this;
				if(numArr.length > 0){
					for (var i = 0; i < numArr.length; i++) {
						value.push(numArr[i].billId);	
					}
					Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
					  done: () => {
						      apiForm(API_FOODING_ERP,'/cardcost/delete',{ids:value},(response)=>{
						    	that.getPage();
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
	onSaveAndClose(value,data,isAdd){
		var that = this;
		let gentMark = value.gentMark == true?1:0;
		let origMark =value.origMark == true?1:0;
		value =Object.assign({},value,{gentMark:gentMark,origMark:origMark});
		apiPost(API_FOODING_ERP,'/cardcost/save',value,(response)=>{
				that.setState({
					rodalShow:!!isAdd
				})
				 ServiceTips({text:response.message,type:'success'});
				 this.getPage();
		},(errors)=>{
			ServiceTips({text:errors.message,type:'error'});
			that.setState({
					rodalShow:!!isAdd
			})
		})
	}
	onCancel(that){
		this.setState({
			rodalShow:false
		})
	}
	editClick(data){
		var that = this;
		apiGet(API_FOODING_ERP,'/cardcost/getOne',{billId:data.record.billId},(response)=>{
						that.setState({
							rodalShow:true,
							showHeader:true,
							DialogContent:3,
							showSaveAdd:false,
						    showSaveClose:true,
							title:i18n.t(500192/*编辑证书费*/),
							checkedData:response.data
						})
					},(error)=>{
						ServiceTips({text:error.message,type:'error'});
					})
	}
	handleClick(e,data){
		var that = this;
		//右键处理
		if(data.type ==1){
			this.deleteClick(data);
		}else if(data.type ==2){
			if(data.record.status == 10){
				ServiceTips({text:i18n.t(500195/*该状态不能编辑!*/),type:'error'});
				return;
				
			}else{
			  		this.editClick(data);
				}
			}

	}
	getPage(sID){
		    let that = this;
			let object=Object.assign({},{billId:this.state.id});
			apiGet(API_FOODING_ERP,'/cardcost/getPage',object,
				(response)=>{	
					that.setState({	
						data: response.data||[]
					});
				},(errors)=>{
			});
		
		
	}
	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = isNaN(currentPage)?currentPage:1;
		let object=Object.assign({},{isPlatform:true, pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
			apiGet(API_FOODING_ERP,'/cardcost/getPage',object,
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
	handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
       let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }
	componentDidMount(){
		var that = this;
		this.getPage();
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	render(){
		let  that = this;
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader normalRef={no => this.normalRef = no} getPage ={this.getPage} expandFilter= {this.handleResize}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} baoxiaoClick={this.baoxiaoClick} paymentClick={this.paymentClick} deleteClick={this.deleteClick}/>
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
					    ref ='protfht'
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{i18n.t(100437/*删除*/)}</div>,
									data:{type:1,title:i18n.t(100437/*删除*/)}
									},{
									    permissions:'diplomafee.edit',
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
										data:{type:2,title:i18n.t(100439/*编辑*/)}
									}]
						}}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						<DiplomafeePlug DialogContent={this.state.DialogContent}
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
export default NavConnect(Portfht);