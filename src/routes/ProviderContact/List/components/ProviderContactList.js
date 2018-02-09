import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table from "../../../../components/Table";//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层

import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import {I18n} from "../../../../lib/i18n";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
class ProviderContactList extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.addClick=this.addClick.bind(this);
		this.partyClick=this.partyClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.copyClick=this.copyClick.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.handleClick=this.handleClick.bind(this);
		this.columns = [{
			title : I18n.t(100001/*名称*/),
			dataIndex : 'localName',
			key : "localName",
			width : '8%',
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : I18n.t(100238/*部门*/),
			dataIndex : "depmnt",
			key : "depmnt",
			width : "10%",
			render(data,row,index){
				return <div>{data?data.localName:''}</div>;
			}
		},{
			title : I18n.t(100227/*职务*/),
			dataIndex : "positn",
			key : "positn",
			width : "10%",
			render(data,row,index){
				return <div>{data?data.localName:''}</div>;
			}
		},{
			title :I18n.t(100312/*供应商*/),
			dataIndex : "enterprise",
			key : "enterprise",
			width : "20%",
			render(data,row,index){
				return (<div title={data.localName || ''} className={'text-ellipsis'}>{data.localName || ''}</div>)
			}
		},{
			title :I18n.t(100229/*邮箱*/),
			dataIndex : "defaultEmail",
			key : "defaultEmail",
			width : "18%",
			render(data,row,index){
				return <div>{data?data.localName:''}</div>;
			}
		},{
			title : I18n.t(300000/*固定电话*/),
			dataIndex : "defaultPhone",
			key : "defaultPhone",
			width : "10%",
			render(data,row,index){
				return <div>{data?data.localName:''}</div>;
			}
		},{
			title :I18n.t(300001/*移动电话*/),
			dataIndex : "defaultMobile",
			key : "defaultMobile",
			width : "10%",
			render(data,row,index){
				return <div>{data?data.localName:''}</div>;
			}
		},{
			title : I18n.t(300002/*Skype*/),
			dataIndex : "defaultSkype",
			key : "defaultSkype",
			width : "9%",
			render(data,row,index){
				return <div>{data?data.localName:''}</div>;
			}
		},{
			title : I18n.t(300003/*QQ*/),
			dataIndex : "defaultQQ",
			key : "defaultQQ",
			width : "9%",
			render(data,row,index){
				return <div>{data?data.localName:''}</div>;
			}
		}];

		// even func
		this.getPage =this.getPage.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
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
			data:[], // 列表数据
			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
			billId: '',
			ccId: '',
			type:0,

			searchVal:{}, // 查询条件
		}
	}
	addClick(){
		let content=require('./ProviderContactListEdit').default;
					let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,info:{},checkedData:{},data:null});
			    	this.setState({
			    		dialogContent: element,
			    		showDilaog : true,
			    		title: I18n.t(300004/*新增 - 直接新增*/),
			    	})


	}
	partyClick(){
		let content=require('./ProviderContactParty').default;
		let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel});
    	this.setState({
    		showDilaog : true,
    		title: I18n.t(300005/*新增 - 平台引入*/),
    		dialogContent: element
    	})
	}

	copyClick(){
		console.log('copyClick')
	}
	onSaveAndClose(value){
    	var that = this;
    	if(that.state.type  == 3){
    		//失效
    	}else  {
	    	this.onCancel();
	    	this.getPage();
	    }
	}
	onCancel(that){
		this.setState({
			showDilaog:false
		});
	}
	handleClick(e,data){
		let that = this;
		if(data.action==I18n.t(100439/*编辑*/)){
	    	apiGet(API_FOODING_DS,'/entContact/getOne',{id:data.record.id,sourceId:data.record.enterprise.id},(response)=>{
				let content=require('./ProviderContactListEdit').default;
			let element=React.createElement(content,
				{
					onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,info:this.state.info,data:{record:response.data||{},type:2}
			})
				that.setState({
					showDilaog:true,
					title:I18n.t(300006/*编辑联系人*/),
					title_1:data.record.name,
					dialogContent:element
				})
			},(error)=>{

			})

		}else if(data.action==I18n.t(100437/*删除*/)){
			this.deleteClick();
		}else if(data.action==I18n.t(100441/*失效*/)){
			let content=require('../../../Product/List/components/Failure').default;
			let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel})
	    	this.setState({
	    		showDilaog : true,
	    		title: I18n.t(300007/*编辑失效原因*/),
	    		dialogContent: element
	    	})
		}
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:'providercontact-detail',name:I18n.t(300021/*供应商联系人详情*/),component:I18n.t(300021/*供应商联系人详情*/),url:'/providercontact/detail'});
		this.props.router.push({pathname:'/providercontact/detail',query:{id:record.id,sourceId:record.enterprise.id}});
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
	// 删除
	deleteClick(){

		let select = this.refs.provider.getSelectArr();
		let IDAll = select.map( (o)=>o.id );
		let that = this;
		if( select.length == 0 ){
			ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'error'});
		} else{
			Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				done: () => {
					apiForm(API_FOODING_DS,'/entContact/delete',{id: IDAll},
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

	// 页面 刷新
	getPage(currentPage,pageS){
		let that = this;
		let currentP = !isNaN(currentPage)?currentPage:1;
		let pageSize = pageS||this.state.pageSize;
		let page = {pageSize:pageSize,
			currentPage:currentP,
			 colorType:this.state.colorType,
			 followMark:this.state.followMark};
		let value = Object.assign(page,this.state.searchVal,{dataTyId:120},that.normalRef.getForm());
		apiGet(API_FOODING_DS,'/entContact/getPage',value,
			(response)=>{
				that.setState({
					data: response.data.data,
					totalPages: response.data.totalPages,
					currentPage: response.data.currentPage,
					totalRecords:response.data.totalRecords
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}
	render(){
		let that = this;
		let {record,currentPage} = this.state;
				let meun;

			meun = [{
					permissions:'providercontact.edit',
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-alter'}></i><span>{I18n.t(100439/*编辑*/)}</span></div>,
					data:{action:I18n.t(100439/*编辑*/),type:1}
				},{
					permissions:'providercontact.del',
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{I18n.t(100437/*删除*/)}</div>,
					data:{action:I18n.t(100437/*删除*/),type:2}
				}
			]
		return(<div>
			<FilterHeader
				normalRef={no => this.normalRef = no}
			 	getPage ={this.getPage}
			 	expandFilter={this.handleResize}
			 />
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} partyClick={this.partyClick} deleteClick={this.deleteClick}  copyClick={this.copyClick} />
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
						ref = "provider"
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						onRowDoubleClick={this.onRowDoubleClick}
						contextMenuConfig={{
							enable:true,
							contextMenuId:'SIMPLE_TABLE_MENU',
							menuItems:meun
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
export default NavConnect(ProviderContactList);
