import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import CreditinsurratePlug from './CreditinsurratePlug';
// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import {I18n} from "../../../lib/i18n";
import i18n from './../../../lib/i18n';

class Creditinsurrate extends Component{

	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.editClick=this.editClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.copyClick=this.copyClick.bind(this);
		this.getPage = this.getPage.bind(this);
		var that = this;
		this.columns = [{
			title : i18n.t(100244/*企业*/),
			dataIndex : 'cc'+language,
			key : "cc"+language,
			width : '20%',
			render(data,row,Idindex){
					return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : I18n.t(200729/*信保公司*/),
			dataIndex : 'creditBeLcName',
			key : 'creditBeLcName',
			width : '20%',
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : I18n.t(100189/*信保分类*/),
			dataIndex : "corpTyName",
			key : "corpTyName",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(200160/*风险分类*/),
			dataIndex : "riskTyName",
			key : "riskTyName",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(600017/*下限天数*/),
			dataIndex : "tmLow",
			key : "tmLow",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(600018/*上限天数*/),
			dataIndex : "tmUp",
			key : "tmUp",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(600019/*信保费率%*/),
			dataIndex : "creditRate",
			key : "creditRate",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100286/*生效日期*/),
			dataIndex : "sDate",
			key : "sDate",
			width : "10%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : I18n.t(100287/*失效日期*/),
			dataIndex : "eDate",
			key : "eDate",
			width : "10%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : I18n.t(100288/*发布日期*/),
			dataIndex : "reDate",
			key : "reDate",
			width : "25%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : I18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "10%",
			render(data,row,index){
				return <div>
							{ permissionsBtn('creditinsurrate.edit') ? 
								<i className='foddingicon fooding-alter_icon2' onClick={that.editClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>
								:
								''
							}
							{ permissionsBtn('creditinsurrate.del') ? 
								<i className='foddingicon fooding-delete-icon4' onClick={that.deleteClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>
								:
								''
							}
							{ permissionsBtn('creditinsurrate.copy') ? 
								<i className='foddingicon fooding-copy' onClick={that.copyClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>
								:
								''
							}												
						</div>;
			}
		}];

		

		// init state
		this.state = {
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:null,
			MeunState:true,
			rodalShow:false,
			buttonLeft:I18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			showSaveAdd:false,
			showSaveClose:true,
			data:[], // 列表数据
			currentPage:1, // 当前页
			pageSize: pageSize // 每页 多少条
		}
	}
	
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(47));
		this.getPage();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}
	handleResize(height){
		let sch=document.body.offsetHeight-72-height;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
		console.log(scroll);
	}

	// 新增
	addClick(){
		this.setState({
			rodalShow :true,
			showHeader:true,
			buttonLeft:i18n.t(200267/*保存并且关闭*/),
			DialogContent:1,
			showSaveAdd:true,
			showSaveClose:true,
			title:I18n.t(500231/*信保费率新增*/),
		})
	}

	// 修改 click
	editClick(e,record,event){
		var that = this;
		if(event){
				event.stopPropagation();
		}
		that.refs.product.setSelectRow(record,true);
		apiGet(API_FOODING_ERP,'/termscreditrate/cc/getOne',{id:record.id},
			(response)=>{	
				that.setState({	
					rodalShow : true,
					showHeader:true,
					showSaveAdd:false,
					DialogContent:3,
					checkedData:response.data,
					title:i18n.t(500230/*信保费率编辑*/),
				});
			},(errors)=>{
		});
	}

	// 删除
	deleteClick(e,data,event){
		var that = this;
		event.stopPropagation();
		that.refs.product.setSelectRow(data,true);
		Confirm("您确定要删除吗？", {
		  done: () => {
			    apiForm(API_FOODING_ERP,'/termscreditrate/cc/delete',{id:data.id},(response)=>{
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
	// 复制
	copyClick(e,record,event){
		var that = this;
		if(event){
				event.stopPropagation();
		}
		that.refs.product.setSelectRow(record,true);
		apiGet(API_FOODING_ERP,'/termscreditrate/copy',{id:record.id},(response)=>{
			that.setState({
				rodalShow : true,
				showHeader:true,
				showSaveAdd:false,
				DialogContent:3,
				checkedData:response.data,
				title:i18n.t(500230/*信保费率编辑*/)
			})
		},(error)=>{

		});
	}
	onSaveAndClose(value,checkedData,isAdd){
		var that = this;
		
		if(this.state.DialogContent == 3){
			value=Object.assign({},checkedData,value);
		}else {
			
		}
		apiPost(API_FOODING_ERP,'/termscreditrate/cc/save',value,(response)=>{
				that.getPage();
				this.setState({
					rodalShow:!!isAdd
				})
				ServiceTips({text:response.message,type:'sucess'});
		},(message)=>{
				ServiceTips({text:message.message,type:'error'});
		});
	}
	onCancel(that){
		this.setState({
			rodalShow:false
		})
	}
	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/termscreditrate/cc/getPage',object,
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
			<FilterHeader getPage = {this.getPage} normalRef={no => this.normalRef = no} expandFilter={this.handleResize}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} />
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
						data={data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						onRowDoubleClick={this.onRowDoubleClick}
						scroll={{x:true,y:this.state.scroll}}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						<CreditinsurratePlug DialogContent={this.state.DialogContent}
						 checkedData = {this.state.checkedData}
						 buttonLeft = {this.state.buttonLeft}
						  onSaveAndClose ={this.onSaveAndClose}
						  contentDate = {this.state.contentDate}
						   showSaveAdd ={this.state.showSaveAdd}
						  showSaveClose={this.state.showSaveClose}
						  onCancel = {this.onCancel}
						  getPage = {this.getPage}
						  />
					</Dialog>
				</div>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(Creditinsurrate);

