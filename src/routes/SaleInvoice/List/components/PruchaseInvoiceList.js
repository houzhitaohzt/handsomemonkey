import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';

import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table from "../../../../components/Table";//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层

import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,
	pageSize,sizeList,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

class PruchaseInvoiceList extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);

		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.columns = [{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : 'statusName',
			key : "statusName",
			width : '8%',
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200590/*销售发票号*/),
			dataIndex : "no",
			key : "no",
			width : "12%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "14%",
			render(data,row,index){
				if(data){
					return new Date(data).Format('yyyy-MM-dd');
				}
			}
		},{
			title : i18n.t(200387/*销售订单号*/),
			dataIndex : "sourceNo",
			key : "sourceNo",
			width : "12%",
			render(data,row,index){
				return (<div className={'text-ellipsis'} >{data}</div>);
			}
		},{
			title : i18n.t(400055/*纸质发票号*/),
			dataIndex : "paperNo",
			key : "paperNo",
			width : "12%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100311/*客户*/),
			dataIndex : "salBe"+language,
			key : "salBe"+language,
			width : "15%",
			render(data,row,index){
				return data || "";
			}
		},{
			title : i18n.t(400058/*开票金额*/),
			dataIndex : "orderAmt",
			key : "orderAmt",
			width : "10%",
			render(data,row,index){
				if(data){
					return (<div className={'text-ellipsis'}>{toDecimal(data)}&nbsp;{row.cnyEnName}</div>);
				}else {
					return (<div className={'text-ellipsis'}>{0}&nbsp;{row.cnyEnName}</div>);
				}
			}
		},{
			title : i18n.t(400011/*销售员*/),
			dataIndex : "saleStaff"+language,
			key :"saleStaff"+language,
			width : "10%",
			className:'text-center',
			render(data,row,index){
				return data;
			}
		}
		,{
			title : i18n.t(400059/*核销状态*/),
			dataIndex : 'verifiStatusName',
			key : 'verifiStatusName',
			width : "5%",
			render(data,row,index){
				return data;
			}
		}
		];
	}

	initState(){
		return{
			scrollHeight:0,
			choised:false,

			checkedRows:[],
			choised:false,
			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
			data:[],
			filter:null,
		}
	}
	//过滤条件 点击搜索
	serchClick = (value) => {
		this.setState({filter:value},() => this.getPages(1,null,value));
	}
	//清空过滤条件 按钮清空
	cleanClick = () => {
		this.setState({filter:null},() => this.getPages(1))
	}
	//列表初始化
	getPages = (currentPage,size,filter,order) => {
		filter=filter||this.state.filter;
		order=order||{column:'billId',order:'desc'};
		let {page}=this.state;
		currentPage = currentPage||this.state.currentPage;
		size=size||this.state.pageSize;
		let params=Object.assign({},{currentPage:currentPage,pageSize:size,billType:446},filter,order)
		apiGet(API_FOODING_ERP,'/invoice/getPage',params,(response)=>{
			this.setState({
				data:response.data.data,
				pageSize:response.data.pageSize,
				totalPages:response.data.totalPages,
				currentPage:response.data.currentPage,
				totalRecords:response.data.totalRecords
			})
		},(error)=>{
			ServiceTips({text: error.message,type:'error'});
		});
	}

	deleteClick =() => {
		let numArr = this.refs.PruchaseInvoice.getSelectArr(),billId;
		if(!numArr.length){
			ServiceTips({text:i18n.t(100394/*请选择数据！*/),type:"info"});
			return false;
		}
		billId = numArr[0].billId;
		Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
		    done: () => {
			    this.deletedFunc(billId);
			},
			close:() => {
				console.log('no, close')
			}
		});
	}
	// 调用删除 ajax
	deletedFunc = (ID) => {
		let that = this;
		apiForm(API_FOODING_ERP,'/invoice/delete',{billId: ID},
			(response)=>{
				ServiceTips({text:response.message,type:'sucess'});
				that.getPages();
			},(error)=>{
				ServiceTips({text:error.message,type:'error'});
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
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({name:i18n.t(201044/*销售发票详情*/),component:i18n.t(201044/*销售发票详情*/),url:'/saleinvoice/detail'});
		this.props.router.push({pathname:'/saleinvoice/detail',query:{id:record.billId},state: {refresh: true}});
	}
	handleResize(e, height) {
		 this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        this.setState({scroll: scroll});
	}
	componentDidMount(){
		this.getPages();
		window.addEventListener('resize', this.handleResize(20));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(20));
	}

	render(){
		return(<div>
			<FilterHeader cleanClick={this.cleanClick}
			serchClick={this.serchClick}
			expandFilter={this.handleResize}
			/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				   <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys deleteClick={this.deleteClick}/>
						<Page
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages}
							sizeList={sizeList}
							totalRecords={this.state.totalRecords}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								if(this.state.currentPage == num) return;
								this.getPages(this.state.currentPage,num);
							}}
							backClick={(num)=>{
								if(this.state.currentPage == num) return;
								this.getPages(num);
							}}
							nextClick={(num)=>{
								if(this.state.currentPage == num) return;
								this.getPages(num);
							}}
							goChange={(num)=>{
								if(this.state.currentPage == num) return;
								this.getPages(num);
							}}
						/>
					</div>
					
					<Table
						ref = "PruchaseInvoice"
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onRowDoubleClick={this.onRowDoubleClick}
						singleSelect={true}
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
export default NavConnect(PruchaseInvoiceList);
