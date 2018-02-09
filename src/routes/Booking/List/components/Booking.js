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
import Select, {Option,ConstMiniSelect} from '../../../../components/Select';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips'; // 提示
class StockIn extends Component{
	constructor(props){
		super(props);
		let that = this;
        props.shiporder && props.shiporder(this);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);


		this.columns = [
		{
			title : i18n.t(400048/*单据编号*/),
			dataIndex : 'no',
			key : "no",
			width : "8%",
			sort:'no',
			render(data,row ,index){
				return <div>{data}</div>
			}
		},
		{
			title : i18n.t(400008/*销售单号*/),
			dataIndex : "sourceNo",
			key : "sourceNo",
			width : "8%",
			sort:'sourceNo',
			render(data,row,index){
				return (<div onClick={that.numDetailHandle.bind(this,data)} className="text-ellipsis mail-hover" title={data}>{data}</div>)
			}
		},
		{
			title : i18n.t(400011/*销售员*/),
			dataIndex : 'saleStaff'+language,
			key : "saleStaff"+language,
			width : "5%",
			sort:"saleStaffId",
			render(data,row,index){
				return data;
			}
		},
		{
			title : i18n.t(200312/*物流员*/),
			dataIndex : 'lsStaff'+language,
			key : "lsStaff"+language,
			width : "5%",
			sort : "lsStaffId",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(500203/*预计开船日期*/),
			dataIndex : 'predictSailingDate',
			key : "predictSailingDate",
			width : '8%',
			sort : "predictSailingDate",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{new Date(data).Format('yyyy-MM-dd')}</div>)
			}
		},{
			title : i18n.t(200361/*实际开船日*/),
			dataIndex : 'actSailingDate',
			key : "actSailingDate",
			width : '8%',
			sort : "actSailingDate",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{new Date(data).Format('yyyy-MM-dd')}</div>)
			}

		},{
			title : i18n.t(200383/*提单号*/),
			dataIndex : "ladingBillNo",
			key : "ladingBillNo",
			width : "5%",
			sort : "ladingBillNo",
			render(data,row,index){
				return data;
			}
		},
		{
			title : i18n.t(100299/*货代公司*/),
			dataIndex : "forwarderBe"+language,
			key : "forwarderBe"+language,
			width : "20%",
			sort : "forwarderBeId",
			render(data,row,index){
				return <div className="text-ellipsis" title={data}>{data}</div>;
			}
		},
		{
			title : i18n.t(100376/*交易条款*/),
			dataIndex : "incotm"+language,
			key : "incotm"+language,
			width : "5%",
			sort :  "incotmId",
			render(data,row,index){
				return data;
			}
		},
		{
			title : i18n.t(100224/*运输方式*/),
			dataIndex : "trans"+language,
			key : "trans"+language,
			width : "5%",
			sort : "transId",
			render(data,row,index){
				return data;
			}
		},
		{
			title : i18n.t(100297/*起运港*/),
			dataIndex : "sStatn"+language,
			key : "sStatn"+language,
			width : "7%",
			sort : "sStatnId",
			render(data,row,index){
				return data;
			}
		},
		{
			title : i18n.t(100298/*目的港*/),
			dataIndex : "eStatn"+language,
			key : "eStatn"+language,
			width : "10%",
			sort : "eStatnId",
			render(data,row,index){
				return data;
			}
        },{
			title : i18n.t(200381/*订舱日期*/),
			dataIndex : 'bookingDate',
			key : "bookingDate",
			width : '8%',
			sort : "bookingDate",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{new Date(data).Format('yyyy-MM-dd')}</div>)
			}
		},{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : "statusName",
			key : "statusName",
			width : "5%",
			sort : "status",
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
			data:null,
			MeunState:true,
			pageSize:pageSize,
			currentPage:1,
			record:[]
		}
	}
	addClick(){
		let {navAddTab} =this.props;
		navAddTab({id:16,name:i18n.t(200371/*物流订单编辑*/),component:i18n.t(200371/*物流订单编辑*/),url:'/booking/edit'});
		this.props.router.push('/booking/edit');
	}
	onSaveAndClose(){
		this.setState({
			showDilaog:!this.state.showDilaog
		})
	}
	//请求列表  list
	getPage(currentPage,order){
		let that = this;
		this.columnSort = order = order || this.columnSort;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP,orderType:20,forwarderBeId:this.props.forwarderBeId},that.normalRef.getForm(),order);
		apiGet(API_FOODING_ERP,'/shipping/getPage',object,
				(response)=>{	
					that.setState({	
						record: response.data.data,
						totalPages: response.data.totalPages,
						totalRecords:response.data.totalRecords,
						currentPage: response.data.currentPage 	
					});
				},(errors)=>{
		});
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}
	deleteClick(){
		let numArr = this.refs.booking.getSelectArr();
		if(numArr.length==0){
			ServiceTips({text:i18n.t(200328/*请选择一条数据进行操作*/),type:'error'});
			return false;
		}else {
			Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,'/shipping/delete',{billId:this.refs.booking.getSelectArr()[0].billId},
				    	(response)=>{
				    		ServiceTips({text:response.message,type:'success'});
				    		this.getPage();
				    	},(error)=>{
				    		ServiceTips({text:error.message,type:'error'});
				    	})
				},
				close:() => {

				}
			});
		}
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({name:i18n.t(200370/*物流订单详情*/),component:i18n.t(200370/*物流订单详情*/),url:'/booking/detail'});
		this.props.router.push({pathname:'/booking/detail',query:{id:record.billId}});
	}
	handleResize(e, height) {
		 this.filterHeight = height || this.filterHeight || 50;
		 let hh = e||0;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight-e;
        this.setState({scroll: scroll});
	}
	componentDidMount(){
		if(!this.props.isDetail){
            this.getPage();
		}
		window.addEventListener('resize', this.handleResize(47));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	// 销售单号 查看详情
	numDetailHandle = (num)=>{
		let that = this;
		this.setState({
			showDilaog: true,
			title: i18n.t(500260/*销售订单执行情况*/),
			dialogContent: React.createElement(require('../../../BookNeed/components/sourceNoDetail').default,{onCancel:that.onCancel,num:num})
		});
	}

	render(){
		let {record} = this.state;
		let that = this;
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader  getPage = {this.getPage}
			expandFilter={this.handleResize}
			isShowHead ={this.props.isShowHead}
			normalRef={no => this.normalRef = no}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
					<div  className='action-buttons'>
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
					    ref = 'booking'
						singleSelect={true}
						data={record}
						columns={this.columns}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onRowDoubleClick={this.onRowDoubleClick}
						onHeaderSortClick={this.getPage.bind(this, null)}
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
export default NavConnect(StockIn);
