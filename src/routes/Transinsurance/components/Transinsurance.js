import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import TransinsurancePlug from './TransinsurancePlug';
import i18n from './../../../lib/i18n';
import {I18n } from '../../../lib/i18n';
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
class Creditinsurrate extends Component{
constructor(props){
		super(props);
		this.handleResize=this.handleResize.bind(this);
		this.copyClick=this.copyClick.bind(this);
		this.addClick=this.addClick.bind(this);
		this.editClick=this.editClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.copyClick=this.copyClick.bind(this);
		var that = this;
		this.getPage = this.getPage.bind(this);
		this.columns = [{
			title :i18n.t(100244/*企业*/),
			dataIndex : "cc"+language,
			key : "cc"+language,
			width : "20%",
			render(data,row,index){
				return <div>{data?data:''}</div>
			}
		},{
			title : I18n.t(200731/*保险公司*/),
			dataIndex : 'insuranceBe' + language,
			key : 'insuranceBe' + language,
			width : '20%',
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : I18n.t(600168/*费率*/)+'%',
			dataIndex : "rate",
			key : "rate",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(600024/*固定比率*/),
			dataIndex : "fixRate",
			key : "fixRate",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(600025/*保险下限*/),
			dataIndex : "preLow",
			key : "preLow",
			width : "10%",
			render(data,row,index){
				return <div>{data?toDecimal(data):''}</div>;
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
			width : "10%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title :  I18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "15%",
			render(data,row,index){
				return <div>
					{ permissionsBtn('transinsurance.del') ? <i className='foddingicon fooding-delete-icon4' onClick={that.deleteClick.bind(this,data,row)} style={{marginRight:'20px'}}></i> : ''}				
					{ permissionsBtn('transinsurance.edit') ? <i className='foddingicon fooding-alter_icon2' onClick={that.editClick.bind(this,data,row)} style={{marginRight:'20px'}}></i> : ''}
					{ permissionsBtn('transinsurance.copy') ? <i className='foddingicon fooding-copy' onClick={that.copyClick.bind(this,data,row)} style={{marginRight:'20px'}}></i> : ''}								
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
			data:[], // 列表数据
			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
			showSaveAdd:false,
			showSaveClose:true
		}
	}

	componentDidMount(){
		window.addEventListener('resize', this.handleResize(47));
		this.getPage();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	addClick(){
		this.setState({
			rodalShow : true,
			showHeader:true,
			buttonLeft:I18n.t(100429/*保存并关闭*/),
			DialogContent:1,
			showSaveAdd:true,
			showSaveClose:true,
			title:i18n.t(500227/*运输费用新增*/)
		})
	}

	// 复制
	copyClick(e,record,event){
		var that = this;
		if(event){
				event.stopPropagation();
		}
		that.refs.product.setSelectRow(record,true);
		apiGet(API_FOODING_ERP,'/termscarrinsu/copy',{id:record.id},(response)=>{
			that.setState({
				rodalShow : true,
				showHeader:true,
				title:i18n.t(500228/*运输费用编辑*/),
				DialogContent:3,
				showSaveAdd:false,
				checkedData:response.data
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
		apiPost(API_FOODING_ERP,'/termscarrinsu/cc/save',value,(response)=>{
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
	
	handleResize(height){
		let sch=document.body.offsetHeight-72-height;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
		console.log(scroll);
	}

	// 删除
	deleteClick(e,data,event){
		var that = this;
		event.stopPropagation();
		that.refs.product.setSelectRow(data,true);
		Confirm("您确定要删除吗？", {
		  done: () => {
			    apiForm(API_FOODING_ERP,'/termscarrinsu/cc/delete',{id:data.id},(response)=>{
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

	// 修改 click
	editClick(e,record,event){
		var that = this;
		if(event){
				event.stopPropagation();
		}
		that.refs.product.setSelectRow(record,true);
		apiGet(API_FOODING_ERP,'/termscarrinsu/cc/getOne',{id:record.id},
			(response)=>{	
				that.setState({	
					rodalShow : true,
					showHeader:true,
					DialogContent:3,
					checkedData:response.data,
					showSaveAdd:false,
					title:i18n.t(500228/*运输费用编辑*/)
				});
			},(errors)=>{
		});
	}


	 //请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{topageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/termscarrinsu/cc/getPage',object,
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
		
		let that = this;
		let {page,currentPage} =this.state;
		const data = this.state.data || [];
		return(<div>
			<FilterHeader getPage={this.getPage}
			normalRef={no => this.normalRef = no}
			expandFilter={this.handleResize}/>
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
						<TransinsurancePlug DialogContent={this.state.DialogContent}
						 checkedData = {this.state.checkedData}
						 buttonLeft = {this.state.buttonLeft}
						  onSaveAndClose ={this.onSaveAndClose}
						  showSaveAdd ={this.state.showSaveAdd}
						  showSaveClose={this.state.showSaveClose}
						  contentDate = {this.state.contentDate}
						  onCancel = {this.onCancel}
						  getPage = {this.getPage}/>
						  
					</Dialog>
				</div>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(Creditinsurrate);

