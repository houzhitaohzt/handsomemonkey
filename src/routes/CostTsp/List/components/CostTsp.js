import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table  from "../../../../components/Table";//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import CostTspPlug from './CostTspPlug';
import {I18n } from '../../../../lib/i18n';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,copy,permissionsBtn} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

class Forwarderlist extends Component{
	constructor(props){
		super(props)
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.handleClick=this.handleClick.bind(this);
		this.addClick=this.addClick.bind(this);
		this.deleteBtnClick=this.deleteBtnClick.bind(this);
		this.editClick=this.editClick.bind(this);
		this.copyClick=this.copyClick.bind(this);
		var that = this;
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.getPage = this.getPage.bind(this);
		this.columns = [{
			title : i18n.t(200343/*货运公司*/),
			dataIndex : "forBe"+language,
			key : "forBe"+language,
			width : "15%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100155/*港口*/),
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
				return data;
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
			title :i18n.t(100286/*生效日期*/),
			dataIndex : "sDate",
			key : "sDate",
			width : "15%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title :i18n.t(100287/*失效日期*/),
			dataIndex : 'eDate',
			key : 'eDate',
			width : "15%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title :I18n.t(100288/*发布日期*/),
			dataIndex : 'reDate',
			key : 'reDate',
			width : "15%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title :i18n.t(200098/*操作*/),
			dataIndex : 'handle',
			key : 'handle',
			width : "10%",
			render(data,row,index){
				return <div>
									 
										{permissionsBtn('costtsp.edit')?<i className='foddingicon fooding-alter_icon2' title={'100439'} onClick={that.editClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>:''}
										
										
									  
										{permissionsBtn('costtsp.del')?<i className='foddingicon fooding-delete-icon4' title={'100437'} onClick={that.deleteBtnClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>:''}
										
									
									
										{permissionsBtn('costtsp.copy')?<i className='foddingicon fooding-copy' title={i18n.t(100452/*复制*/)} onClick={that.copyClick.bind(this,data,row)} style={{marginRight:'20px'}} ></i>:''}
										
																							
						</div>;
			}
		}];
	}

	initState(){
		return {
			scrollHeight:0,
			selectArr:[],
			rodalShow:false,
			checkedRows:[],
			choised:false,
			showSaveAdd:false,
			showSaveClose:true,
			data:[],
			checkedData:'',
			obj:{},
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条
		}
	}
	addClick(){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			showSaveAdd:true,
			showSaveClose:true,
			title:i18n.t(200534/*货运港杂新增*/)
		})
		// let {navAddTab} =this.props;
		// navAddTab({id:7,name:i18n.t(200534/*货运港杂新增*/),component:i18n.t(200534/*货运港杂新增*/),url:'/costtsp/add'});
		// this.props.router.push('/costtsp/add');
	}
	// 删除
	deleteBtnClick(e,data,event){
		var that = this;
		event.stopPropagation();
		that.refs.costTray.setSelectRow(data,true);
		Confirm("您确定要删除吗？", {
		  done: () => {
			    apiForm(API_FOODING_ERP,'/termslsbeport/cc/delete',{id:data.id},(response)=>{
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
					rodalShow : true,
					showHeader:true,
					DialogContent:3,
					title:i18n.t(200531/*货运港杂编辑*/),
					checkedData:response.data
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
				rodalShow : true,
				showHeader:true,
				DialogContent:3,
				title:i18n.t(200531/*货运港杂编辑*/),
				checkedData:response.data
			})
		},(error)=>{

		});
	}
	onSaveAndClose(value,checkedData,isAdd,call){
		var that = this;
		
		if(this.state.DialogContent == 3){
			value=Object.assign({},checkedData,value);
		}else {
			
		}
		apiPost(API_FOODING_ERP,'/termslsbeport/cc/save',value,(response)=>{
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
	onCancel(){
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
	componentDidMount(){
		this.getPage();
		window.addEventListener('resize', this.handleResize(47));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}
	// ajax list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{isPlatform:true,beType:10, pageSize: this.state.pageSize, currentPage: currentP,
		},that.normalRef.getForm());
			apiGet(API_FOODING_ERP,'/termslsbeport/cc/getPage',object,
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
	render(){
		const data = this.state.data || [];
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader getPage = {this.getPage} expandFilter={this.handleResize} normalRef={no => this.normalRef = no}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight,marginTop:'10px'}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick}  deleteClick={this.deleteClick}  copyClick={this.copyClick}  />
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
						<CostTspPlug DialogContent={this.state.DialogContent}
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
