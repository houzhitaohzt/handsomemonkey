import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import StockPlug from './StockPlug';
import Adjust from './Adjust';
// ajax
import {
    apiGet, apiPost, apiForm, API_FOODING_ERP, language, pageSize, sizeList, toDecimal,
    permissionsBtn
} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import {I18n} from "../../../lib/i18n";
class  Stock extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.onRowClick=this.onRowClick.bind(this);
		this.onHeaderCellClick=this.onHeaderCellClick.bind(this);
		this.handleClick=this.handleClick.bind(this);
		var that = this;
		this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
		// init func
		this.getPage = this.getPage.bind(this);
		this.updatePriceClick = this.updatePriceClick.bind(this);
		this.columns = [
			{
				title : I18n.t(400025/*仓库*/),
				dataIndex : 'sl'+language,
				key : "sl"+language,
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}
			},{
				title : I18n.t(400026/*库区*/),
				dataIndex : 'st'+language,
				key : "st"+language,
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}
			},{
				title : I18n.t(400027/*储位*/),
				dataIndex : 'slsp'+language,
				key : "slsp"+language,
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}
			},{
				title : I18n.t(100379/*产品*/),
				dataIndex : 'mtl'+language,
				key : "mtl"+language,
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}
			},		{
				title : I18n.t(400012/*品牌*/),
				dataIndex : 'brand'+language,
				key : "brand"+language,
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}
			},{
				title : I18n.t(400028/*原供应商*/),
				dataIndex : 'vndBe'+language,
				key : "vndBe"+language,
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}
			},{
				title : I18n.t(400029/*过期日期*/),
				dataIndex : "shelfEdate",
				key : "shelfEdate",
				width : "10%",
				render(data,row,index){
					return new Date(data).Format('yyyy-MM-dd');
				}
			},{
				title : I18n.t(400030/*物料状态*/),
				dataIndex : "mStats"+language,
				key : "mStats"+language,
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}

			},{
				title : I18n.t(200903/*基础数量*/),
				dataIndex : "baseQty",
				key : "baseQty",
				render(data,row,index){
					return (row['baseQty']/row['eqBasnum']) + ' ' + row['uom'+language];
				}
			},{
				title : I18n.t(600059/*锁库编号*/),
				dataIndex : "lockingNo",
				key : "lockingNo",
				width : "10%",
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}
			},{
				title : I18n.t(500151/*批次号*/),
				dataIndex : "batchNo",
				key : "batchNo",
				width : "8%",
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}
			},{
				title : I18n.t(500141/*采购单价*/),
				dataIndex : "purTaxPrc",
				key : "purTaxPrc",
				render(data,row,index){
					return data?toDecimal(data) + ' ' + row['purCny'+language]:'';
				}
			},{
				title : I18n.t(600060/*销售成本*/),
				dataIndex : "saleUnitPrc",
				key : "saleUnitPrc",
				render(data,row,index){
					return data ? toDecimal(data)+' USD' : '';
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
			buttonLeft:I18n.t(100429/*保存并关闭*/),
			showSaveClose:true,
			contentTemplate:<div></div>,
			checkedData:'',
			data : [],

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
		window.addEventListener('resize', this.handleResize);
		this.getPage();
        this.handleResize();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}


	addClick(){

		let that = this;
		let select = this.refs.product.getSelectArr();

		// 判断 情况
		if( select.length == 0 ){
			ServiceTips({text:I18n.t(500115/*请选中一条数据？*/),type:'error'});
		} else if( select.length > 1 ){
			ServiceTips({text:I18n.t(500220/*不支持批量操作!*/),type:'error'});
		} else if(select[0].lockingNo){
			ServiceTips({text:I18n.t(600061/*锁库库存不可进行调整！*/),type:'error'});
		} else{
			this.setState({
				rodalShow : true,
				showHeader:true,
				buttonLeft:I18n.t(100429/*保存并关闭*/),
				DialogContent:1,
				title:I18n.t(600062/*库存调整单*/),
				showSaveClose:true,
				checkedData: select[0]
			})
		}

	}
	onSaveAndClose(){
		this.setState({
			rodalShow:false
		})
	}
	onCancel(that){
		this.setState({
			rodalShow:false
		})
	}

	handleClick(e,data){
	}
	onHeaderCellClick(e,data){
		let {checkedRows, selectArr} = this.state;
		if(data.checkedAll){
			selectArr=selectArr.concat(this.state.data);
			selectArr = Array.from(new Set(selectArr));
			checkedRows= selectArr.map((value,index)=>index);
		}else{
			selectArr=[];
			checkedRows=[];
		}
	}
	onRowClick(record,index,checked){
		let {checkedRows, selectArr} = this.state;
		if(checked){
			selectArr.push(record);
			if(checkedRows.indexOf(index)<0){
				checkedRows.push(index);
			}
		}else{
			selectArr.remove(record);
			checkedRows.remove(index);
		}
	}
	onRowDoubleClick(record,index,checked){

		let that = this;
		apiGet(API_FOODING_ERP,'/stock/getDtlList',{id: record.id},
			(response)=>{
				let content=require('./Detail').default;
				let element=React.createElement(content,{unit:record['baseUom'+language],onCancel:that.onCancel,checkedData:response.data});
				that.setState({
					rodalShow : true,
					showHeader:true,
					title: I18n.t(600063/*出入库明细*/),
					dialogContent: element,
					dialogFile:'./Detail'
				})
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});

	}
    handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 180 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }
	// 价格调整
	updatePriceClick(){
		let that = this;
		let select = this.refs.product.getSelectArr();

		// 判断 锁定编号
		function num(arr){
			return (arr.length == arr.filter( (o)=>o.lockingNo).length ? true : false);
		}

		// 判断 产品
		function product(arr){
			return (arr.length == arr.filter( (o)=>o.mtlId == arr[0].mtlId ).length ? true : false);
		}

		// 判断 情况
		if( select.length == 0 ){
			ServiceTips({text:I18n.t(500115/*请选中一条数据？*/),type:'error'});
			return;
		}

		if( !num(select) ){
			ServiceTips({text:I18n.t(600064/*锁定编号必须存在！*/),type:'error'});
			return;
		}

		// if( !product(select) ){
		// 	ServiceTips({text:I18n.t(600065/*产品不一致*/),type:'error'});
		// 	return;
		// }

		// ajax 请求
		let ID = select.map( (o)=>o.id );
		apiForm(API_FOODING_ERP,'/stock/calculate',{ids:ID},
			(response)=>{
				ServiceTips({text:response.message,type:'success'});
				that.getPage();
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});






		// 后续  展开弹框
		// let that = this;
		// let content=require('./Adjust').default;
		// let element=React.createElement(content,{onCancel:that.onCancel});
		// that.setState({
		// 	rodalShow : true,
		// 	showHeader:true,
		// 	title: '库存价格调整',
		// 	dialogContent: element,
		// 	dialogFile:'./Adjust'
		// })
	}

	// 页面 刷新
	getPage(sData=null){

		let that = this;
        let manager = permissionsBtn("ismanger") ? {isManager:1} : {}; //查看全部产品的权限
		if(sData){
			this.setState({sData:sData,currentPage:1},function(){
				ajax();
			});
		} else{
			ajax();
		}

		// 保存 请求
		function ajax(){
			apiGet(API_FOODING_ERP,'/stock/getPage',Object.assign({},manager,{pageSize: that.state.pageSize,currentPage: that.state.currentPage},that.state.sData),
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
		let {record} = this.state;
		let com;
		if(this.state.title == I18n.t(600063/*出入库明细*/)){
			com = this.state.dialogContent;
		} else if(this.state.title == I18n.t(201126/*库存价格调整*/)){
			com = this.state.dialogContent;
		} else{
			com = <StockPlug
					DialogContent={this.state.DialogContent}
					checkedData = {this.state.checkedData}
					buttonLeft = {this.state.buttonLeft}
					onSaveAndClose ={this.onSaveAndClose}
					showSaveClose = {this.state.showSaveClose}
					contentDate = {this.state.contentDate}
					onCancel = {this.onCancel}
					getPage={this.getPage}
				 />
		}
		return(<div>
			<FilterHeader getPage={this.getPage}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} updatePriceClick={this.updatePriceClick}/>
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
						getPage={this.getPage}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						{com}
					</Dialog>
				</div>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(Stock);
