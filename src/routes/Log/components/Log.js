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
import LogPlug from './LogPlug';


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';




class Log extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.editClick=this.editClick.bind(this);
		this.handleClick=this.handleClick.bind(this);
		var that = this;
		this.onRowDoubleClick = this.onRowDoubleClick.bind(this);

		// init function
		this.getPage = this.getPage.bind(this);

		this.columns = [{
			title : i18n.t(400008/*销售单号*/),
			dataIndex : 'salNo',
			key : "salNo",
			width : '10%',
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : i18n.t(200647/*交单银行*/),
			dataIndex : "pBanker"+language,
			key : "pBanker"+language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200648/*交单日期*/),
			dataIndex : "sendDate",
			key : "sendDate",
			width : "10%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(200649/*交单金额*/),
			dataIndex : "pamts",
			key : "pamts",
			width : "15%",
			render(data,row,index){
				return <div>{data?(toDecimal(data) + ' ' + row['cny'+language]):''}</div>;
			}
		},{
			title : i18n.t(200650/*收汇金额*/),
			dataIndex : "receiptAgg",
			key : "receiptAgg",
			width : "15%",
			render(data,row,index){
				return toDecimal(Number(data)) + ' ' + row['cny'+language];
			}
		},{
			title : i18n.t(200663/*单证人员*/),
			dataIndex : "updateStaffName",
			key : "updateStaffName",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "10%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		}];

		this.state = {
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			MeunState:true,
			rodalShow:false,
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			showSaveClose:true,
			contentTemplate:<div></div>,
			checkedData:'',
			data: [],
			initData: [], // 初始化 数据
			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
			billId: '',	
			ccId: '',
			sData:{},

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
		let that = this;
		this.getOne(function(){
			that.setState({
				rodalShow : true,
				showHeader:true,
				buttonLeft:i18n.t(200267/*保存并且关闭*/),
				DialogContent:1,
				title:i18n.t(200652/*新增交单记录*/),
				showSaveClose:true,
				checkedData:that.state.checkedData,
				
			})
		});
	}
	editClick(record){
		var that = this;
		let ID = that.state.billId;
		apiGet(API_FOODING_ERP,'/presentrecord/getOne',{billId:ID},(response)=>{
			that.setState({
				rodalShow : true,
				showHeader:true,
				buttonLeft:i18n.t(200267/*保存并且关闭*/),
				DialogContent:1,
				title:i18n.t(200653/*编辑交单记录*/),
				checkedData:response.data,
				showSaveClose:true
			})
		},(error)=>{

		})
	}
	// 删除
	deleteClick(react,row){

		let that = this;
		let select = this.refs.product.getSelectArr();

		// 删除 条件判断
		if(react){
			if( select.length == 0 ){
				ServiceTips({text:i18n.t(500115/*请选中一条数据？*/),type:'error'});
			} else if( select.length > 1 ){
				ServiceTips({text:i18n.t(500220/*不支持批量操作!*/),type:'error'});
			} else{
				this.deleteAjax(select[0].billId); // 删除 请求
			}
		} else{
			this.deleteAjax(row.billId); // 右键
		}
	}

	// 删除 请求
	deleteAjax(ID){
		let that = this;
		Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
			done: () => {
				apiForm(API_FOODING_ERP,'/presentrecord/delete',{billId: ID},
					(response)=>{	
						ServiceTips({text:response.message,type:'success'});
						that.getPage();
						that.setState({billId: ''});
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});	
	}

	onSaveAndClose(){
		this.setState({
			rodalShow:false,
			billId: '',
		});			
	}
	onCancel(that){
		this.setState({
			rodalShow:false,
			billId: '',
		})
		if(that){
			that.props.form.resetFields();
			that.addradio.setState({
				array:[{radio:{type:i18n.t(300009/*手机*/),checked:true},select:i18n.t(300009/*手机*/),inputValue:''}]
			});
		}
	}

	// 右键处理
	handleClick(e,data){
		let ID = data.record.billId;
		if(data.type == 1){
			this.deleteClick(ID);
		}else if(data.type ==2){	
			this.setState({
				billId: ID
			},function(){
				this.editClick();
			});		
  		}
	}


	
	onRowDoubleClick(record,index,checked){
		let that = this;
		let ID = record.billId;
		
		this.setState({billId:ID},function(){
			this.getOne(function(){
				that.setState({
					rodalShow :true,
					showHeader:true,
					showSaveClose:false,
					buttonLeft:i18n.t(200267/*保存并且关闭*/),
					DialogContent:3,
					title:i18n.t(200654/*查看交单记录*/),
					checkedData:that.state.checkedData,
				})
			});
		});


	}
	handleResize(height){
		let sch=document.body.offsetHeight-72-height;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
		console.log(scroll);
	}


	// 新增 数据
	getOne(callBack){

		let that = this;
		apiGet(API_FOODING_ERP,'/presentrecord/getOne',{billId: this.state.billId},
			(response)=>{	
				that.setState({	
					checkedData: response.data,
				},function(){
					callBack && callBack();
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});	
	}

	// 页面 刷新
	getPage(sData=null){

		let that = this;
		if(sData){
			this.setState({sData:sData,currentPage:1},function(){
				ajax();
			});
		} else{
			ajax();		
		}
	
		// 保存 请求
		function ajax(){
			apiGet(API_FOODING_ERP,'/presentrecord/getPage',Object.assign({pageSize: that.state.pageSize,currentPage: that.state.currentPage},that.state.sData),
				(response)=>{				
					that.setState({	
						data: response.data.data || [],
						totalPages: response.data.totalPages,
						currentPage: response.data.currentPage 	
					});
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
			});	
		}
	}


	render(){

		let that = this;
		let  iconArray = [{type:'add',onClick:this.addClick},{type:'delete',onClick:this.deleteClick},{type:'copy',onClick:this.copyClick}];
		return(<div>
			<FilterHeader getPage={this.getPage} />
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}  copyClick={this.copyClick} />
						<Page 
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages} 
							sizeList={sizeList}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								that.setState({ pageSize: Number.parseInt(num),currentPage:1 },()=>that.getPage());
							}} 
							backClick={(num)=>{
								that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());
							}} 
							nextClick={(num)=>{
								that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());										
							}}
							goChange={(num)=>{
								that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());																				
							}}								
						/>
					</div>
					
					<Table
						ref = "product"
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						onRowDoubleClick={this.onRowDoubleClick}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{i18n.t(100437/*删除*/)}</div>,
									data:{type:1,title:i18n.t(100437/*删除*/)}
									},{
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
										data:{type:2,title:i18n.t(100439/*编辑*/)}
									}]
						}}
					/>
					<Dialog width={1000} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						<LogPlug DialogContent={this.state.DialogContent}
						 	checkedData = {this.state.checkedData}
						 	buttonLeft = {this.state.buttonLeft}
						 	onSaveAndClose ={this.onSaveAndClose}
						 	showSaveClose = {this.state.showSaveClose}
						 	contentDate = {this.state.contentDate}
						  	onCancel = {this.onCancel}
							getPage={this.getPage}
						  />
					</Dialog>
				</div>
			</div>
		</div>
		</div>
	)
	}
}

export default NavConnect(Log);

