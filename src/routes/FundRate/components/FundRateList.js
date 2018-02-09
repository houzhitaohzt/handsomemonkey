import i18n from './../../../lib/i18n';
import {I18n } from '../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
import Table  from "../../../components/Table";//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import FundRatePlug from './FundRatePlug';
import Loading from '../../../components/Loading';
import ServiceTips from '../../../components/ServiceTips';
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,getUser,copy,language,pageSize,sizeList} from '../../../services/apiCall';
class Creditinsurrate extends Component{
	constructor(props){
		super(props);
		this.handleResize=this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.editClick=this.editClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.copyClick=this.copyClick.bind(this);
		var that = this;
		this.getPage = this.getPage.bind(this);
		this.columns = [{
			title : i18n.t(100244/*企业*/),
			dataIndex : 'cc'+language,
			key : "cc"+language,
			width : '20%',
			render(data,row,Idindex){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : i18n.t(200584/*资金费率%月*/),
			dataIndex : "rate",
			key : "rate",
			width : "20%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200585/*罚款率%月*/),
			dataIndex : "peltyRate",
			key : "peltyRate",
			width : "20%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100286/*生效日期*/),
			dataIndex : "sDate",
			key : "sDate",
			width : "20%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(100287/*失效日期*/),
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
			title : i18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "10%",
			render(data,row,index){
				return <div>
							{ permissionsBtn('fundrate.edit') ? 
								<i className='foddingicon fooding-alter_icon2' onClick={that.editClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>
								:
								''
							}
							{ permissionsBtn('fundrate.del') ? 
								<i className='foddingicon fooding-delete-icon4' onClick={that.deleteClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>
								:
								''
							}
							{ permissionsBtn('fundrate.copy') ? 
								<i className='foddingicon fooding-copy' onClick={that.copyClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>
								:
								''
							}				
					 </div>;
			}
		}];

		this.state = {
			scrollHeight:0,
			filter:null,
			selectArr:[],
			MeunState:true,
			rodalShow:false,
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			showLoading:true,
			data : [],
			info:[],
			showSaveAdd:false,
			showSaveClose:true,
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条
		}
	}
	addClick(){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			title:i18n.t(200586/*新增资金费率*/),
			showSaveAdd:true,
			showSaveClose:true
		})
	}
	// 修改 click
	editClick(e,record,event){
		var that = this;
		if(event){
				event.stopPropagation();
		}
		that.refs.product.setSelectRow(record,true);
		apiGet(API_FOODING_ERP,'/termsfundsrate/cc/getOne',{id:record.id},
			(response)=>{	
				that.setState({	
					rodalShow : true,
					showHeader:true,
					DialogContent:3,
					showSaveAdd:false,
					checkedData:response.data,
					title:i18n.t(200587/*编辑资金费率*/)
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
			    apiForm(API_FOODING_ERP,'/termsfundsrate/cc/delete',{id:data.id},(response)=>{
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
		apiGet(API_FOODING_ERP,'/termsfundsrate/copy',{id:record.id},(response)=>{
			that.setState({
				rodalShow : true,
				showHeader:true,
				DialogContent:3,
				showSaveAdd:false,
				checkedData:response.data,
				title:i18n.t(200587/*编辑资金费率*/)
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
		apiPost(API_FOODING_ERP,'/termsfundsrate/cc/save',value,(response)=>{
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
	handleResize(e, height) {
		 this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        this.setState({scroll: scroll});
	}
	 //请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/termsfundsrate/cc/getPage',object,
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
		var that = this;
		window.addEventListener('resize', this.handleResize(47));
		this.getPage();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	render(){
		let {page,currentPage} =this.state;
		const data = this.state.data || [];
		return(<div>
			<FilterHeader getPage={this.getPage}
			normalRef={no => this.normalRef = no}
			expandFilter={this.handleResize}
			/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}  copyClick={this.copyClick} />
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
					    ref='product'
						columns={this.columns}
						data={data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						onRowDoubleClick={this.onRowDoubleClick}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						<FundRatePlug DialogContent={this.state.DialogContent}
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
export default Creditinsurrate;
