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
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
class Charge extends Component{
constructor(props){
		super(props);
		this.getPage = this.getPage.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.state = this.initState();
		this.columns = [{
			title : i18n.t(400048/*单据编号*/),
			dataIndex : "no",
			key : "no",
			width : "7%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(500083/*收款企业*/),
			dataIndex :'receiptCc'+language,
			key : 'receiptCc'+language,
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(500241/*付款单位*/),
			dataIndex : 'payBusiness'+language,
			key : 'payBusiness'+language,
			width : "10%",
			render(data,row,index){
				return data;
			} 
		},{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "6%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title :i18n.t(100284/*币种*/),  
			dataIndex : 'cny'+language,
			key : 'cny'+language,
			width : '5%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(100326/*总金额*/),
			dataIndex : "totalAmt",
			key : "totalAmt",
			width : "7%",
			render(data,row,index){
				return (<div>{data ?toDecimal(data) : ''}</div>);
			}
		},{
			title : i18n.t(500244/*纸质发票*/),
			dataIndex : "paperNo",
			key : "paperNo",
			width : "7%",
			render(data,row,index){
				return (<div>{data}</div>);
			}
		},{
			title : i18n.t(100336/*备注*/),
			dataIndex : 'remark',
			key : "remark",
			width : '5%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title :i18n.t(100230/*状态*/),
			dataIndex : "isConfirmed",
			key : "isConfirmed",
			width : "5%",
			render(data,row,index){
				  return (<div>{data?i18n.t(201065/*已确认*/):i18n.t(300069/*未确认*/)}</div>)
			}
		
		}];
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
			pageSize: pageSize // 每页 多少条
			

		}
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:9,name:i18n.t(500247/*费用归集详情*/),component:i18n.t(500247/*费用归集详情*/),url:'/chargecollect/detail'});
		this.props.router.push({ pathname: '/chargecollect/detail',query:{id:record.billId,billType:record.billType}});
	}
	componentDidMount(){
		this.getPage();		
    };	
	handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }
	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{isConfirmed:false,pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/chargecollect/cc/getPage',object,
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
				<div className='action-buttons'>
					<div className={'key-page'}>
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
						colorConfig={[{key:'payMentUuId',color:'bg-green'}]}
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
export default NavConnect(Charge);

