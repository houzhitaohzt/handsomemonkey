import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Table from "../../../../../components/Table";
import Page from "../../../../../components/Page"
import "../../../../Product/Traderules/List/assets/_traderules.less";
//引入按钮键
import  Confirm from  '../../../../../components/button/confirm'
import  DeleteDialog from '../../../../../components/Dialog/Confirm'
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
//引入弹层
import Dialog from '../../../../../components/Dialog/Dialog'
import Tooltip from "../../../../../components/Tip"
import Traderulesplug from './Traderulesplug';
import FilterHeader from "../../../../Product/Traderules/List/components/FilterHeader";
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
export class Traderules extends Component{
	constructor(props){
		super(props);
        props.traderules && props.traderules(this);
		this.columns = [{
			title : i18n.t(100087/*国家*/),
			dataIndex : 'country',
			key : "country",
			width : '32%',
			render(data,row,index){
				return (<div>{data?data.name:''}</div>)
			}
		},{
			title : i18n.t(100385/*海关编码*/),
			dataIndex : "hsCode",
			key : "hsCode",
			width : "35%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400075/*是否商检*/),
			dataIndex : "salImpMark",
			key : "salImpMark",
			width : "33%",
			render(data,row,index){
				return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
				//return <div>{data?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</div>;
			}
		}];
		this.state = {
			rodalShow:false ,
			title:'',
			scroll:0,
			paddingTop:0,
			selectArr:[],
			checkedRows:[],
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			data :[],
			DialogContent:0,
			sourceId:this.props.location.query.id,
			dataTyId:'',
			pageSize:pageSize,
			currentPage:1
		}
		this.addClick = this.addClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.getInfo= this.getInfo.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.editClick=this.editClick.bind(this);
		this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
		this.getPage = this.getPage.bind(this);
	}
	addClick(e){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			title:i18n.t(200881/*新增国家贸易规则*/)
		})
    }
    editClick(record){
		this.getInfo(record.record.id);
		this.setState({
				rodalShow : true
			})
	}
	getInfo(id){
		var that = this;
		let object=Object.assign({},{sourceId:this.props.location.query.id,dataTyId:25});
		if(id){
			apiGet(API_FOODING_DS,'/tradrule/getInit',{id:id,sourceId:this.props.location.query.id,dataTyId:25},(response)=>{
			that.setState({
				info:response.data,
				checkedData:response.data.tradrule,
				showHeader:true,
				DialogContent:3,
				showSaveAdd:false,
			    showSaveClose:true,
				title:i18n.t(200882/*包装计费编辑*/)
			});
		},(errors)=>{

		})
			return false;
		}
		apiGet(API_FOODING_DS,'/tradrule/getInit',{},(response)=>{
			that.setState({
				info:response.data
			});
		},(errors)=>{

		})
	}
    deleteClick(e){
    	var that = this;
    	 let array=this.refs.frexrat.getSelectArr();
    	 if(array.length == 0){
    	 		DeleteDialog(i18n.t(200528/*请选择一条数据进行删除*/), {
					done: () => {

					}
				});
	    	 }else{
	    	 	DeleteDialog(i18n.t(201287/*删除后将无法恢复，您确定删除%s条数据吗？*/, array.length), {
						done: () => {
							let id=[];
							array.map((e)=>{id.push(e.id)});
						    apiForm(API_FOODING_DS,'/tradrule/delete',{id:id},(response)=>{
						    		ServiceTips({text:response.message,type:'sucess'});
						    		that.getPage();
						    },(error)=>{
						    	ServiceTips({text:error.message,type:'error'});
						    })
						}
				});
	    	 }
    }
     onSaveAndClose(value,data,isAdd){
		var that = this;
		value=Object.assign({},data,value);
		apiPost(API_FOODING_DS,'/tradrule/save',value,(response)=>{
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
		});
	}
	// getPage(sID,objValue){
	// 	let that = this;
	// 	var sID = sID || '';
	// 	if(objValue){
	// 		this.setState({
	// 			obj:objValue
	// 		},function() {
	// 		// body...
	// 			let object=Object.assign({},{sourceId:this.state.sourceId,isPlatform:true,dataTyId:25, pageSize: this.state.pageSize, currentPage: this.state.currentPage },this.state.obj);
	// 			apiGet(API_FOODING_DS,'/tradrule/getPage',object,
	// 				(response)=>{
	// 					that.setState({
	// 						data: response.data.data,
	// 						totalRecords:response.data.totalRecords,
	// 						totalPages: response.data.totalPages,
	// 						currentPage: response.data.currentPage
	// 					});
	// 				},(errors)=>{
	// 			});
	// 		})
	// 	}else {
	// 		let object=Object.assign({},{sourceId:this.state.sourceId,isPlatform:true,dataTyId:25, pageSize: this.state.pageSize, currentPage: this.state.currentPage, mtltyId: sID },this.state.obj);
	// 		apiGet(API_FOODING_DS,'/tradrule/getPage',object,
	// 			(response)=>{
	// 				that.setState({
	// 					data: response.data.data,
	// 					totalRecords:response.data.totalRecords,
	// 					totalPages: response.data.totalPages,
	// 					currentPage: response.data.currentPage
	// 				});
	// 			},(errors)=>{
	// 		});
	// 	}

	// }
	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
		let object=Object.assign({},{sourceId:that.state.sourceId,isPlatform:true,dataTyId:25, pageSize: that.state.pageSize, currentPage: currentP},that.normalRef.getForm());
	        apiGet(API_FOODING_DS,'/tradrule/getPage',object,
						(response)=>{	
							that.setState({	
								data: response.data.data,
								totalRecords:response.data.totalRecords,
								totalPages: response.data.totalPages,
								currentPage: response.data.currentPage 	
							});
						},(errors)=>{
				});
	       
	      
			
	}
	handleClick(e,data,target){
		//右键处理
		if(data.type == 1){
			this.deleteClick(data);
		}else if(data.type ==2){
  			this.editClick(data);
  		}else if(data.type == 3){
  			this.setState({
  				title:i18n.t(300007/*编辑失效原因*/),
				rodalShow : true,
				showHeader:true,
				DialogContent:4
			});
  		}
	}
	handleResize(height){
		let sch=document.body.offsetHeight-height-200;
		let scroll = sch-135;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
         this.handleResize(0);
         if(this.props.isDetail){
             this.getPage();
		 }
        // this.getInfo();
		window.addEventListener('resize', this.handleResize(0));
    };
    componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}
  	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:3,name:i18n.t(200884/*产品规则详情*/),component:i18n.t(200884/*产品规则详情*/),url:'/platform/product/traderules/detail'});
		this.props.router.push({ pathname: '/platform/product/traderules/detail',query:{id:record.id,cntryId:record.cntryId,platformMtlId:record.sourceId}});
	}
	render(){
		let  iconArray = [{type:'add',onClick:this.addClick,permissions:'platform.mtl.dtl.add'},{type:'delete',onClick:this.deleteClick,permissions:'platform.mtl.dtl.del'}];
		let title = <span>{this.state.title}<i className="font">{this.state.title_1}</i></span>;
		let {page,currentPage} =this.state;
		return (
			    <div className="contact-body" style = {{height:this.state.scrollHeight}}>
			    	<FilterHeader normalRef={no => this.normalRef = no} getPage ={this.getPage}/>
					<Confirm iconArray ={iconArray}/>
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
				<div className="action-normal-buttons">
					<Table
							ref ="frexrat"
							columns={this.columns}
							scroll={{x:true,y:this.state.scroll}}
							data={this.state.data}
							checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
							colorFilterConfig={{show : false}}
							onRowDoubleClick={this.onRowDoubleClick}
							followConfig={{show:false}}
							style={{width:'100%'}}
							contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									permissions:'platform.mtl.dtl.del',
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{i18n.t(100437/*删除*/)}</div>,
									data:{type:1,title:i18n.t(100437/*删除*/)}
									},{
										permissions:'platform.mtl.edit',
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
										data:{type:2,title:i18n.t(100439/*编辑*/)}
									},{
										permissions:'platform.mtl.dtl.Invalid',
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-sx-icon2'}></i>{i18n.t(100441/*失效*/)}</div>,
										data:{type:3,title:i18n.t(100441/*失效*/)}
								}]
							}}
					/>
					<Dialog visible={this.state.rodalShow} showHeader ={this.state.showHeader}  title={this.state.title} width={926}>
					<Traderulesplug DialogContent={this.state.DialogContent}
							 checkedData = {this.state.checkedData}
							 buttonLeft = {this.state.buttonLeft}
							 showSaveAdd ={this.state.showSaveAdd}
							 showSaveClose={this.state.showSaveClose}
							  onSaveAndClose ={this.onSaveAndClose}
							  contentDate = {this.state.contentDate}
							  onCancel = {this.onCancel}
							  sourceId={this.state.sourceId}
							  dataTyId={this.state.dataTyId}/>
				</Dialog>
				</div>
				</div>

			
			);
	}

}
export default NavConnect(Traderules);
