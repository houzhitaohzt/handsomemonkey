import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import ProductTestNav from './ProductTestNav';
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import {I18n} from "../../../lib/i18n";
import i18n from '../../../lib/i18n';

class ProductTest extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.editClick=this.editClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.copyClick=this.copyClick.bind(this);
		this.handleClick=this.handleClick.bind(this);	
		var that = this;
		this.getPage = this.getPage.bind(this);
		this.columns = [{
			title : I18n.t(100403/*产品类型*/),
			dataIndex : 'mtlty' + language,
			key : 'mtlty' + language,
			width : '10%',
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : I18n.t(500073/*测试项目*/),
			dataIndex : 'testPr' + language,
			key : 'testPr' + language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100606/*测试方法*/),
			dataIndex : 'testMeth' + language,
			key : 'testMeth' + language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(500122/*标准费用*/),
			dataIndex : "costAggs",
			key : "costAggs",
			width : "10%",
			render(data,row,index){
				return (<div title={data + ' ' + row['cny'+language]} className={'text-ellipsis'}>{data?toDecimal(data) + ' ' + row['cny'+language]:''}</div>)
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
			title : I18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "15%",
			render(data,row,index){
				return <div>
							{ permissionsBtn('producttest.edit') ? 
								<i className='foddingicon fooding-alter_icon2' onClick={that.editClick.bind(this,data,row)} style={{marginRight:'20px'}} title={i18n.t(100439/*编辑*/)}></i>
								:
								''
							}
							{ permissionsBtn('producttest.del') ? 
								<i className='foddingicon fooding-delete-icon4' onClick={that.deleteClick.bind(this,data,row)} style={{marginRight:'20px'}} title={i18n.t(100437/*删除*/)}></i>
								:
								''
							}
							{ permissionsBtn('producttest.copy') ? <i style={{marginRight:'20px'}} title={i18n.t(100452/*复制*/)} className='foddingicon fooding-copy' onClick={that.copyClick.bind(this,data,row)}></i> : ''}													
					</div>;
			}
		}];

		this.state = {
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:null,
			MeunState:true,
			rodalShow:false,
			showSaveAdd:false,
			showSaveClose:true,
			buttonLeft:I18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			data : [],
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条
		}
	}

	componentDidMount(){
		window.addEventListener('resize', this.handleResize(47));
		this.getPage();  
    };

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	};
	addClick(){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			showSaveAdd:true,
			showSaveClose:true,
			title:I18n.t(200394/*新增产品检测费用*/)
		})
	}

	// 删除 click
	deleteClick(e,data,event){
		var that = this;
		event.stopPropagation();
		that.refs.costTray.setSelectRow(data,true);
		Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
		  done: () => {
			    apiForm(API_FOODING_ERP,'/termsmtltestcost/platform/delete',{id:data.id},(response)=>{
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
		apiGet(API_FOODING_ERP,'/termsmtltestcost/getOne',{id:record.id},
			(response)=>{	
				that.setState({	
					DialogContent:3,
					checkedData:response.data,
					rodalShow : true,
					showHeader:true,
					title:I18n.t(200395/*编辑产品检测费用*/)
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
		apiGet(API_FOODING_ERP,'/termsmtltestcost/copy',{id:record.id},(response)=>{
			that.setState({
				rodalShow : true,
				showHeader:true,
				DialogContent:3,
				title:I18n.t(200395/*编辑产品检测费用*/),
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
		apiPost(API_FOODING_ERP,'/termsmtltestcost/platform/save',value,(response)=>{
				that.getPage();
				that.setState({
					rodalShow:!!isAdd
				})
				ServiceTips({text:response.message,type:'sucess'});
		},(message)=>{
				ServiceTips({text:message.message,type:'error'});
		});
	}

	// 取消
	onCancel(that){
		this.setState({
			rodalShow:false
		})
	}

	// 右键
	handleClick(e,data){

		let ID = data.record.billId;
		if(data.type == 1){
			this.deleteClick(ID);
		}else if(data.type ==2){
			this.getOne(ID);
  		}
	}
	handleResize(height){
		let sch=document.body.offsetHeight-72-height;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
		console.log(scroll);
	}
	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/termsmtltestcost/platform/getPage',object,
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
		const data = this.state.data || [];
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader getPage = {this.getPage} expandFilter={this.handleResize} normalRef={no => this.normalRef = no}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick}/>
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
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						<ProductTestNav 
							DialogContent={this.state.DialogContent}
						 	checkedData = {this.state.checkedData}
						 	buttonLeft = {this.state.buttonLeft}
						 	onSaveAndClose ={this.onSaveAndClose}
							showSaveAdd ={this.state.showSaveAdd}
							showSaveClose={this.state.showSaveClose}
						  	contentDate = {this.state.contentDate}
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
export default NavConnect(ProductTest);

