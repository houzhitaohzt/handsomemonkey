import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";



// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import {I18n} from "../../../../lib/i18n";



class ExpenseAccount extends Component{

	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.getPage = this.getPage.bind(this);
		this.columns = [{
			title : I18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "6%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : I18n.t(400048/*单据编号*/),
			dataIndex : "no",
			key : "no",
			width : "7%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : I18n.t(500146/*源单类型*/),
			dataIndex : 'sourceTypeName',
			key : "sourceTypeName",
			width : "5%",
			render(data,row ,index){
				return <div>{data}</div>
			}
		},{
			title : I18n.t(500050/*付款企业*/),
			dataIndex : "payCcLcName",
			key : "payCcLcName",
			width : "20%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : I18n.t(400084/*收款单位*/),
			dataIndex : 'receiptBeLcName',
			key : "receiptBeLcName",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(200402/*报销人*/),
			dataIndex : 'payStaffLcName',
			key : "payStaffLcName",
			width : '5%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : I18n.t(100326/*总金额*/),
			dataIndex : "costAmt",
			key : "costAmt",
			width : "7%",
			render(data,row,index){
				//return (data || 0) + ' ' + row['cnyLcName'];
				return (<div>{data ? (toDecimal(data) + ' ' + row['cny'+language]) : ''}</div>);
			}
		},{
			title : I18n.t(100336/*备注*/),
			dataIndex : 'remark',
			key : "remark",
			width : '5%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : I18n.t(400049/*业务状态*/),
			dataIndex : "status",
			key : "status",
			width : "5%",
			render(data,row,index){
				if(data == 1){
					return I18n.t(300039/*草稿*/);
				} else if(data == 5){
					return I18n.t(200258/*已提交*/);
				} else if(data == 10){
					return I18n.t(400053/*已审批*/);
				}
			}
		
		}];

		// init state
		this.state = this.initState();
		
	}

	initState(){
		return{
			scrollHeight:0,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:[],
			obj:{},

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
		let {navAddTab} =this.props;
		navAddTab({id:13,name:I18n.t(600072/*报销单添加*/),component:I18n.t(600072/*报销单添加*/),url:'/expenseaccount/add'});
		this.props.router.push('/expenseaccount/add');
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
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:9,name:I18n.t(600073/*报销单详情*/),component:I18n.t(600073/*报销单详情*/),url:'/expenseaccount/detail'});
		this.props.router.push({ pathname: '/expenseaccount/detail',query:{id:record.billId,billType:record.billType}});
	}
	handleResize(height){
		let sch=document.body.offsetHeight-72-height;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}


	// 删除
	deleteClick(react,row){

		let that = this;
		let select = this.refs.product.getSelectArr();


		// 删除 条件判断
		if(react){
			if( select.length == 0 ){
				ServiceTips({text:I18n.t(500115/*请选中一条数据？*/),type:'error'});
			} else if( select.length > 1 ){
				ServiceTips({text:I18n.t(500220/*不支持批量操作!*/),type:'error'});
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
		Confirm(I18n.t(500174/*确认删除已选中的数据？*/), {
			done: () => {
				apiForm(API_FOODING_ERP,'/charge/delete',{billId: ID},
					(response)=>{	
						ServiceTips({text:response.message,type:'success'});
						that.getPage();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
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
			apiGet(API_FOODING_ERP,'/charge/getPage',Object.assign({pageSize: that.state.pageSize,currentPage: that.state.currentPage, billType: 499},that.state.sData),
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
		const data = this.state.data || [];
		return(<div>
			<FilterHeader getPage={this.getPage}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}/>
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
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
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
export default NavConnect(ExpenseAccount);

