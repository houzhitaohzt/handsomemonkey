import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import {I18n} from '../../../../lib/i18n';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
class StockOut extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.getPage = this.getPage.bind(this);
		this.columns = [{
			title :I18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "10%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title :  I18n.t(400048/*单据编号*/),
			dataIndex : 'no',
			key : "no",
			width : "10%",
			render(data,row ,index){
				return <div>{data}</div>
			}
		},{
			title :  I18n.t(500129/*源单编号*/),
			dataIndex : 'sourceNo',
			key : "sourceNo",
			width : "10%",
			render(data,row ,index){
				return <div>{data}</div>
			}
		},{
			title : I18n.t(400145/*职员*/),
			dataIndex : "staff"+language,
			key :"staff"+language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(500131/*事物类型*/),
			dataIndex : 'stOpe'+language,
			key : 'stOpe'+language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(400025/*仓库*/),
			dataIndex : 'sl'+language,
			key : 'sl'+language,
			width : '10%',
			render(data,row,index){
				return data;
			}
		},{
			title :I18n.t(400049/*业务状态*/),
			dataIndex : "statusName",
			key : "statusName",
			width : "10%",
			render(data,row,index){
				return data;
			}

		
		}];
	}

	initState(){
		return {
			scrollHeight:0,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:[],
			obj:{},
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条
		}
	}
	// 新增
	addClick(){
		let {navAddTab} =this.props;
		navAddTab({id:7,name:i18n.t(201127/*出库通知单新增*/),component:i18n.t(201127/*出库通知单新增*/),url:'/stockout/add'});
		this.props.router.push('/stockout/add');
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
				this.deleteAjax(select[0].billId);  // 删除请求
			}
		} else{
			this.deleteAjax(row.billId);  // 右键
		}
	}

	// 删除 请求
	deleteAjax(ID){
		let that = this;
		Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			done: () => {
				apiForm(API_FOODING_ERP,'/noticestock/delete',{billId: ID},
					(response)=>{							
						ServiceTips({text:'成功！',type:'sucess'});
						that.getPage();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});
	}
	onSaveAndClose(){
		this.setState({
			showDilaog:!this.state.showDilaog
		})
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}
	// 双击到详情
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:9,name:I18n.t(500160/*出库通知单详情*/),component:I18n.t(500160/*出库通知单详情*/),url:'/stockout/detail'});
		this.props.router.push({ pathname: '/stockout/detail',query:{id:record.billId}});
	}
	
	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{isPlatform:true, billType:223, pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/noticestock/getPage',object,
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
		const data = this.state.data || [];
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
						ref = "product"
						data={data}
						columns={this.columns}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onRowDoubleClick={this.onRowDoubleClick}
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
export default NavConnect(StockOut);

