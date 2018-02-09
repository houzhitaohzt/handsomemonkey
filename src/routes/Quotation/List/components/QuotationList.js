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

import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,
	API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
class SalesOrderList extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
        props.salePrices && props.salePrices(this);
		this.state=this.initState();
		this.addClick=this.addClick.bind(this);
		this.partyClick=this.partyClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.priceClick=this.priceClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.copyClick=this.copyClick.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.handleClick=this.handleClick.bind(this);
		this.columns = [{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : 'statusName',
			key : "statusName",
			width : '5%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "7%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(400048/*单据编号*/),
			dataIndex : "no",
			key : "no",
			width : "8%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400011/*销售员*/),
			dataIndex : "saleStaff"+language,
			key : "saleStaff"+language,
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100311/*客户*/),
			dataIndex : 'salBe'+language,
			key : "salBe"+language,
			width : "12%",
			render(data,row ,index){
				return data;
			}
		},{
			title : i18n.t(100376/*交易条款*/),
			dataIndex : "incotm"+language,
			key : "incotm"+language,
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(100224/*运输方式*/),
			dataIndex : 'trans'+language,
			key : 'trans'+language,
			width : "5%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100297/*起运港*/),
			dataIndex : 'sStatn'+language,
			key : "sStatn"+language,
			width : "5%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100298/*目的港*/),
			dataIndex : 'eStatn'+language,
			key : "eStatn"+language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200165/*销售总额*/),
			dataIndex : 'saleTaxAmt',
			key : "saleTaxAmt",
			width : "12%",
			render(data,row,index){
				return <div>{data?(toDecimal(data)+' '+row["cny"+language]):''}</div>;
			}
		},{
			title : i18n.t(201027/*订单利润率*/),
			dataIndex : 'orderRate',
			key : "orderRate",
			width : "5%",
			render(data,row,index){
				return data;
			}
		}];
		this.getPage = this.getPage.bind(this);
	}

	initState(){
		return{
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:[],
			MeunState:true,
			pageSize:pageSize,
			currentPage:1
		}
	}
	addClick(){

	}
    addClick(){
        let irowSts=this.props.customer?this.props.customer.irowSts.id:'';
        if(!irowSts){
            let {navAddTab} =this.props;
            navAddTab({name:i18n.t(201025/*销售报价新增*/),component:i18n.t(201025/*销售报价新增*/),url:'/quotation/addedit'});
            this.props.router.push({pathname:'/quotation/addedit',query:{salBeId:this.props.id}});
        }else if(irowSts==10){
            let {navAddTab} =this.props;
            navAddTab({name:i18n.t(201025/*销售报价新增*/),component:i18n.t(201025/*销售报价新增*/),url:'/quotation/addedit'});
            this.props.router.push({pathname:'/quotation/addedit',query:{salBeId:this.props.id}});
        }else{
            ServiceTips({text:'请先激活此客户!',type:'error'});
        }

    }
	partyClick(){
	}
	deleteClick(){
		let numArr = this.refs.mainTab.getSelectArr();
        if(numArr.length > 0){
        	Confirm("您确定要删除这条数据吗？", {
			  done: () => {
				    apiForm(API_FOODING_ERP,'/saleoffer/delete',{billId:numArr[0].billId},(response)=>{
		    				this.getPage();
		    				ServiceTips({text:response.message,type:'sucess'});
		    		},(error)=>{
		    				ServiceTips({text:error.message,type:'error'});
		    		})
				},
				close:() => {
					console.log('no, close')
				}
			});
        }else{
            ServiceTips({text:i18n.t(100434/*请选择一条数据！*/),type:'error'});
		}
	}
	priceClick(){

	}
	// ajax list
	getPage(currentPage,size){
		    let that = this;
		    let object;
		    let currentP = !isNaN(currentPage)?currentPage:1;
			if(this.normalRef.getForm().salBeId){
		    	object=Object.assign({},{pageSize: this.state.pageSize, currentPage:currentP,
		    		salBeId:this.props.id,businessNo:this.props.businessNo},this.normalRef.getForm());
		    }else{
		    	let a = this.normalRef.getForm();
		    	delete a.salBeId;
		    	object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP,
		    		salBeId:this.props.id,businessNo:this.props.businessNo},a);
		    }
			apiGet(API_FOODING_ERP,'/saleoffer/getPage',object,
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
	copyClick(){
		console.log('copyClick')
	}
	handleClick(e,data){
		let numArr = this.refs.mainTab.getSelectArr();
		Confirm(i18n.t(300066/*您确定要生成订单吗？*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/saleoffer/createOrder",{billId:numArr[0].billId},response => {
				    	//刷新当前页面
				    	this.props.navRemoveTab({name: i18n.t(200239/*销售订单编辑*/), component: i18n.t(200239/*销售订单编辑*/), url: '/salesorder/addEidt'});
	        			this.props.navAddTab({name:i18n.t(200239/*销售订单编辑*/),component:i18n.t(200239/*销售订单编辑*/),url:'/salesorder/addEidt'});
	        			this.props.router.push({ pathname: '/salesorder/addEidt',query:{id:response.data}});
				    	ServiceTips({text:response.message,type:"success"})
				    },error => {
				    	ServiceTips({text:error.message,type:'error'})
				    })
				},
				close:() => {
					console.log('no, close')
				}
		});
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({name:i18n.t(201019/*销售报价详情*/),component:i18n.t(201019/*销售报价详情*/),url:'/quotation/detail'});
		this.props.router.push({pathname:'/quotation/detail',query:{id:record.billId}});
	}
	handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 272 - this.filterHeight;
        this.setState({scroll: scroll});
    }
	componentDidMount(){
        var that = this;
        if(!this.props.isDetail){
            this.getPage();
		}
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    };
    componentWillUnmount() {
    	console.log('componentWillUnmount')
        window.removeEventListener('resize', this.handleResize);
    }

	render(){
		let {data,page,currentPage} = this.state;
		let meun;
		let that = this;

			meun = [{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-yuehui'}></i>{i18n.t(201028/*转订单*/)}</div>,
					data:{action:i18n.t(201028/*转订单*/)}
				}]

		return(<div>
			<FilterHeader id={this.props.id||this.props.businessNo}
			getPage = {this.getPage}
			normalRef={no => this.normalRef = no}
			expandFilter={this.handleResize}
			/>
			<div className={'client-body'} style={{height: '100%', position: 'absolute'}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} businessNo = {this.props.businessNo} deleteClick={this.deleteClick}/>
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
						columns={this.columns}
						ref = "mainTab"
						data={data}
                        singleSelect={true}
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
export default NavConnect(SalesOrderList);
