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
import Exrateplug from './Exrateplug';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,pageSize,sizeList} from '../../../services/apiCall';
import Loading from "../../../components/Loading";//加载动画
import ServiceTips from "../../../components/ServiceTips";//提示框
import {I18n} from "../../../lib/i18n"; 
class FrExRat extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.editClick=this.editClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.handleClick=this.handleClick.bind(this);
		var that = this;
		this.getPage =this.getPage.bind(this);
		this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
		this.columns = [{
			title : I18n.t(100279/*直接汇率*/),
			dataIndex : "basRat",
			key : "basRat",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100280/*间接汇率*/),
			dataIndex : "indirectRat",
			key : "indirectRat",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100281/*汇率类型*/),
			dataIndex : "exRateType",
			key : "exRateType",
			width : "10%",
			render(data,row,index){
				return <div>{data?data.name:''}</div>;
			}
		},{
			title :  I18n.t(100283/*原币*/),
			dataIndex : "basCurren",
			key : "basCurren",
			width : "10%",
			render(data,row,index){
				return <div>{data?data.name:''}</div>;
			}
			},{
			title :  I18n.t(100285/*目标币*/),
			dataIndex : "curren",
			key : "curren",
			width : "10%",
			render(data,row,index){
				return <div>{data?data.name:''}</div>;
			}
		},{
			title :  I18n.t(100286/*生效日期*/),
			dataIndex : "effectiveDate",
			key : "effectiveDate",
			width : "12%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : I18n.t(100287/*失效日期*/),
			dataIndex : "expiryDate",
			key : "expiryDate",
			width : "12%",
			render(data,row,index){
				
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : I18n.t(100230/*状态*/),
			dataIndex : "irowSts",
			key : "irowSts",
			width : "10%",
			render(data,row,index){
				return (<div  className={'text-ellipsis'}>{data?data.name:''}</div>)
			}
		}];
		this.state = {
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			data:null,
			MeunState:true,
			rodalShow:false,
			buttonLeft:I18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			showSaveAdd:false,
			showSaveClose:true,
			checkedData:'',
			data : [],
			pageSize:pageSize,
			currentPage:1,
			info:{}
		}
	}
	addClick(){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			title:i18n.t(200552/*实时汇率新增*/),
			showSaveAdd:true,
			showSaveClose:true
		})
	}
	editClick(record){
		var that = this;
		apiGet(API_FOODING_DS,'/frExRat/getOne',{id:record.record.id},(response)=>{
			this.setState({
				rodalShow : true,
				showHeader:true,
				DialogContent:3,
				checkedData:response.data,
				title:i18n.t(200553/*实时汇率编辑*/),
				showSaveAdd:false,
				showSaveClose:true
			})
		},(error)=>{

		})
		
	}
	deleteClick(data){
				let numArr = this.refs.frexrat.getSelectArr();
				let value=[];
				var that = this;
				if(numArr.length > 0){
					for (var i = 0; i < numArr.length; i++) {
						value.push(numArr[i].id);	
					}
					Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
					  done: () => {
						    apiForm(API_FOODING_DS,'/frExRat/delete',{id:value},(response)=>{
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
						ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'error'});
				}
		
	}
	onSaveAndClose(value,data,isAdd){
		var that = this;
		value=Object.assign({},data,value);
		apiPost(API_FOODING_DS,'/frExRat/save',value,(response)=>{
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
	handleClick(e,data){
		//右键处理
		if(data.type == 1){
			this.deleteClick(data);
		}else if(data.type ==2){
  			this.editClick(data);
  		}
	}
	onRowDoubleClick(record,index,checked){
		var that = this;
		apiGet(API_FOODING_DS,'/frExRat/getOne',{id:record.id},(response)=>{
			that.setState({
				checkedData:response.data,
				rodalShow : true,
				showHeader:true,
				showSaveAdd:false,
				showSaveClose:false,
				DialogContent:5,
				title:i18n.t(200554/*实时汇率详情*/)
			});
		},(errors)=>{

		})
	}
	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
		let object=Object.assign({},{isPlatform:true, pageSize: this.state.pageSize, currentPage: currentP,exRateTypeId:10},that.normalRef.getForm());
		apiGet(API_FOODING_DS,'/frExRat/getPage',object,
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
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader normalRef={no => this.normalRef = no} getPage ={this.getPage} expandFilter= {this.handleResize}/>
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
						ref ="frexrat"
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						onRowDoubleClick={this.onRowDoubleClick}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									permissions:'exrate.del',
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{I18n.t(100437/*删除*/)}</div>,
									data:{type:1,title:I18n.t(100437/*删除*/)}
									},{
										permissions:'exrate.edit',
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{I18n.t(100439/*编辑*/)}</div>,
										data:{type:2,title:I18n.t(100439/*编辑*/)}
									}]
						}}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						<Exrateplug DialogContent={this.state.DialogContent}
						 checkedData = {this.state.checkedData}
						 ccid={this.state.ccid}
						 showSaveAdd ={this.state.showSaveAdd}
						 showSaveClose={this.state.showSaveClose}
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
export default NavConnect(FrExRat);

