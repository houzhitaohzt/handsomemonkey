import React, {Component, PropTypes} from "react";
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table  from "../../../../components/Table";//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FunctionKeys from "./FuncKeys";
import CostagcPlug from './CostagcPlug';
import FilterHeader from "./FilterHeader";

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,copy,permissionsBtn,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import {I18n } from '../../../../lib/i18n';
import i18n from './../../../../lib/i18n';
class Forwarderlist extends Component{
	constructor(props){
		super(props)
		this.handleResize = this.handleResize.bind(this);
		this.handleClick=this.handleClick.bind(this);
		this.addClick=this.addClick.bind(this);
		this.copyClick=this.copyClick.bind(this);
		this.editClick=this.editClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.getPage = this.getPage.bind(this);
		this.daochuClick = this.daochuClick.bind(this);
		this.daoruClick = this.daoruClick.bind(this);
		this.fabuClick = this.fabuClick.bind(this);
		this.allfabuClick = this.allfabuClick.bind(this);
		this.zuofeiClick = this.zuofeiClick.bind(this);
		var that = this;
		this.deleteBtnClick = this.deleteBtnClick.bind(this);
		this.zuofeiBtnClick=this.zuofeiBtnClick.bind(this); 
		this.state = {
			scrollHeight:0,
			filter:null,
			choised:false,
			MeunState:true,
			rodalShow:false,
			showSaveAdd:false,
			showSaveClose:true,
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条
			data : [],
			obj:{}
		}
		this.columns = [{
			title :I18n.t(100299/*货代公司*/),
			dataIndex : "reCc"+language,
			key : "reCc"+language,
			width : "15%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100155/*港口*/),
			dataIndex : "statn"+language,
			key : "statn"+language,
			width : "7%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(500122/*标准费用*/),
			dataIndex : "costAgg",
			key : "costAgg",
			width : "7%",
			render(data,row,index){
				return (<div>{data?toDecimal(data)+' '+row["cny"+language]:''}</div>)
			}
		},{
			title : I18n.t(500121/*费用名称*/),
			dataIndex : "costlvtr"+language,
			key : "costlvtr"+language,
			width : "7%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(500088/*装箱类型*/),
			dataIndex : "contnrTy"+language,
			key : "contnrTy"+language,
			width : "7%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100214/*箱型*/),
			dataIndex : "packTyName",
			key : "packTyName",
			width : "7%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(500123/*计算模式*/),
			dataIndex : "chargeTyName",
			key : "chargeTyName",
			width : "7%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100177/*航线*/),
			dataIndex : "route"+language,
			key : "route"+language,
			width : "7%",
			render(data,row,index){
				return data;
			}
		},{
			title :I18n.t(100286/*生效日期*/),
			dataIndex : "sDate",
			key : "sDate",
			width : "8%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title :I18n.t(100287/*失效日期*/),
			dataIndex : 'eDate',
			key : 'eDate',
			width : "8%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title :I18n.t(100288/*发布日期*/),
			dataIndex : 'reDate',
			key : 'reDate',
			width : "8%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title :i18n.t(100230/*状态*/),
			dataIndex : 'reStatusName',
			key : 'reStatusName',
			width : "6%",
			render(data,row,index){
				return data;
			}
		},{
			title :'',
			dataIndex : 'cause',
			key : 'cause',
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title :I18n.t(200098/*操作*/),
			dataIndex : 'handle',
			key : 'handle',
			width : "10%",
			render(data,row,index){
				return <div>
									{ row.reStatus == 1 && permissionsBtn('forwcostagc.edit')? 
										<i className='foddingicon fooding-alter_icon2' title={i18n.t(100439/*编辑*/)} onClick={that.editClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>
										:
										''
									}	
									{  
										 row.reStatus != 35 && row.reStatus != 0 && permissionsBtn('forwcostagc.delete')? 
										 <i className='foddingicon fooding-delete-icon4' title={i18n.t(100437/*删除*/)} onClick={that.deleteBtnClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>
										 :
										 ''
										
									}
									{ row.reStatus != 0 && permissionsBtn('forwcostagc.copy')? 
										<i className='foddingicon fooding-copy' title={i18n.t(100452/*复制*/)} onClick={that.copyClick.bind(this,data,row)} style={{marginRight:'20px'}} ></i>
										:
										''
									}
									{ row.reStatus != 38 && row.reStatus != 0 && row.reStatus != 1 && permissionsBtn('forwcostagc.void')? 
										<i className='foddingicon fooding-ivoid' title={i18n.t(100471/*作废*/)} onClick={that.zuofeiBtnClick.bind(this,data,row)} style={{marginRight:'20px'}} ></i>
										:
										''
									}														
						</div>;
			}
		}];
	}
	addClick(){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			showSaveAdd:true,
			showSaveClose:true,
			title:I18n.t(500114/*货代港杂新增*/)
		})
	}
	// 删除 click
	deleteBtnClick(e,data,event){
		var that = this;
		event.stopPropagation();
		that.refs.costTray.setSelectRow(data,true);
		Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
		  done: () => {
			    apiForm(API_FOODING_ERP,'/termslsbeport/be/delete',{id:data.id},(response)=>{
			    		that.getPage();
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
	editClick(e,record,event){
		var that = this;
		if(event){
				event.stopPropagation();
		}
		that.refs.costTray.setSelectRow(record,true);
		apiGet(API_FOODING_ERP,'/termslsbeport/getOne',{id:record.id},
			(response)=>{	
				that.setState({	
					DialogContent:3,
					checkedData:response.data,
					rodalShow : true,
					showHeader:true,
					showSaveAdd:false,
					title:i18n.t(500226/*货代港杂编辑*/)
				});
			},(errors)=>{
		});
	}
	// 复制
	copyClick(e,record,event){
		var that = this;
		if(event){
				event.stopPropagation();
		}
		that.refs.costTray.setSelectRow(record,true);
		apiGet(API_FOODING_ERP,'/termslsbeport/copy',{id:record.id},(response)=>{
			that.setState({
				DialogContent:3,
				checkedData:response.data
			})
		},(error)=>{

		});
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:0,
			showSaveAdd:false,
			title:i18n.t(500226/*货代港杂编辑*/),
			checkedData:record
		})
	}
	daochuClick(){
		console.log('1')
	}
	daoruClick(){
		console.log('2')
	}
	fabuClick(){
		let numArr = this.refs.costTray.getSelectArr();
		let value=[];
		var that = this;
		if(numArr.length > 0){
			for (var i = 0; i < numArr.length; i++) {
					value.push(numArr[i].id);	
			}
			Confirm(i18n.t(500179/*确定发布吗?*/), {
					  done: () => {
						    apiForm(API_FOODING_ERP,'/termslsbeport/forbe/release',{ids:value},(response)=>{
						    	that.getPage();
						    	

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
	allfabuClick(){
		let numArr = this.refs.costTray.getSelectArr();
		let value=[];
		var that = this;
		let object=Object.assign({beType:20},that.normalRef.getForm());
			Confirm(i18n.t(500238/*您确定全部发布吗?*/), {
					  done: () => {
						    apiForm(API_FOODING_ERP,'/termslsbeport/forbe/releaseall',object,(response)=>{
						    	that.getPage();
						    	

						    },(errors)=>{
						    	ServiceTips({text:errors.message,type:'error'});
						    });
						},
						close:() => {
						}
			});
	}
	zuofeiClick(){
		let numArr = this.refs.costTray.getSelectArr();
		let value=[];
		var that = this;
		if(numArr.length > 0){
			for (var i = 0; i < numArr.length; i++) {
					value.push(numArr[i].id);	
			}
			Confirm(i18n.t(500178/*你确定执行作废操作吗?*/), {
					  done: () => {
						    apiForm(API_FOODING_ERP,'/termslsbeport/forbe/drop',{ids:value},(response)=>{
						    	// that.props.navRefreshCurrentTab()
						    	// 	that.props.router.push({pathname: this.props.router.location.pathname, query: {}, state: {refresh: true}});
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
	zuofeiBtnClick(e,data,event){
		var that = this;
		event.stopPropagation();
		that.refs.costTray.setSelectRow(data,true);
		Confirm(i18n.t(500178/*你确定执行作废操作吗?*/), {
		  done: () => {
			    apiForm(API_FOODING_ERP,'/termslsbeport/forbe/drop',{ids:data.id},(response)=>{
			    		that.getPage();
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
	onSaveAndClose(value,checkedData,isAdd,call){
		var that = this;
		
		if(this.state.DialogContent == 3){
			value=Object.assign({},checkedData,value);
		}else {
			
		}
		apiPost(API_FOODING_ERP,'/termslsbeport/be/save',value,(response)=>{
				that.getPage();
				this.setState({
					rodalShow:!!isAdd
				})
				ServiceTips({text:response.message,type:'sucess'});
				if(isAdd){
					call();
				}
		},(message)=>{
				ServiceTips({text:message.message,type:'error'});
		});
	}
	onCancel(that){
		this.setState({
			rodalShow:false
		})
	}
	handleClick(e,data){
	}
	handleResize(e, height) {
		 this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 ;
        this.setState({scroll: scroll});
	}
	
	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{beType:20,pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/termslsbeport/be/getPage',object,
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
	componentDidMount(){
		this.getPage();
		window.addEventListener('resize', this.handleResize(47));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	render(){
		const data = this.state.data || [];
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader getPage = {this.getPage} expandFilter={this.handleResize} normalRef={no => this.normalRef = no}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight,marginTop:'10px'}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} 
						daochuClick={this.daochuClick}
						daoruClick={this.daoruClick}
						fabuClick={this.fabuClick}
						allfabuClick={this.allfabuClick}
						zuofeiClick={this.zuofeiClick} />
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
						ref = "costTray"
						columns={this.columns}
						data={data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title}>
						<CostagcPlug DialogContent={this.state.DialogContent}
						 checkedData = {this.state.checkedData}
						 buttonLeft = {this.state.buttonLeft}
						  onSaveAndClose ={this.onSaveAndClose}
						  showSaveAdd ={this.state.showSaveAdd}
						  showSaveClose={this.state.showSaveClose}
						  contentDate = {this.state.contentDate}
						  onCancel = {this.onCancel}/>
					</Dialog>
					 </div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(Forwarderlist);
