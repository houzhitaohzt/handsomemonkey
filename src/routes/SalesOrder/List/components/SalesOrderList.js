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
import {apiGet, apiPost, apiForm, API_FOODING_ES,
	API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,toDecimal,language} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
class SalesOrderList extends Component{
	constructor(props){
		super(props);
		let that = this;
        props.order && props.order(this);
		this.handleResize = this.handleResize.bind(this);
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
		this.getPage =this.getPage.bind(this);
		this.columns = [{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : 'statusName',
			key : "statusName",
			width : '5%',
			sort: 'status',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(400048/*单据编号*/),
			dataIndex : "no",
			key : "no",
			width : "8%",
			sort: 'no',
			render(data,row,index){
				return (<div onClick={that.numDetailHandle.bind(this,data)} className="text-ellipsis mail-hover" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(400011/*销售员*/),
			dataIndex : "saleStaff"+language,
			key : "saleStaff"+language,
			width : "5%",
			sort: "saleStaffId",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100311/*客户*/),
			dataIndex : 'salBe'+language,
			key : "salBe"+language,
			width : "20%",
			sort: "salBeId",
			render(data,row ,index){
				return data;  
			}
		},{
			title : i18n.t(100376/*交易条款*/),
			dataIndex : "incotm"+language,
			key : "incotm"+language,
			width : "5%",
			sort: "incotmId",
			className:'text-center',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(100224/*运输方式*/),
			dataIndex : 'trans'+language,
			key : 'trans'+language,
			width : "5%",
			className:'text-center',
			sort: "transId",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100297/*起运港*/),
			dataIndex : 'sStatn'+language,
			key : "sStatn"+language,
			width : "6%",
			sort: "sStatnId",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100298/*目的港*/),
			dataIndex : 'eStatn'+language,
			key : "eStatn"+language,
			width : "6%",
			sort: "eStatnId",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200165/*销售总额*/),
			dataIndex : 'saleTaxAmt',
			key : "saleTaxAmt",
			width : "6%",
			sort: "saleTaxAmt",
			render(data,row,index){
				return <div>{data?toDecimal(data)+ ' '+row["cny"+language]:''}</div>;
			}
		},{
			title : i18n.t(201027/*订单利润率*/),
			dataIndex : 'orderRate',
			key : "orderRate",
			width : "7%",
			sort: "orderRate",
			className:'text-center',
			render(data,row,index){
				return <div>{data?toDecimal(data):''}</div>;
			}
		},{
			title : i18n.t(300067/*审批日期*/),
			dataIndex : "activitiDate",
			key : "activitiDate",
			width : "7%",
			sort: "activitiDate",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		}];
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
			currentPage:1,
			pageSize:20
		}
	}
	addClick(){
        let irowSts=this.props.customer?this.props.customer.irowSts.id:'';
		if(!irowSts){
            let {navAddTab,navRemoveTab} =this.props;
            navRemoveTab({name:i18n.t(200239/*销售订单编辑*/),component:i18n.t(200239/*销售订单编辑*/),url:'/salesorder/addEidt'});
            navAddTab({id:7,name:i18n.t(201054/*销售订单新增*/),component:i18n.t(201054/*销售订单新增*/),url:'/salesorder/addEidt'});
            this.props.router.push({pathname:'/salesorder/addEidt',query:{salBeId:this.props.id}});
		}else if(irowSts==10){
            let {navAddTab,navRemoveTab} =this.props;
            navRemoveTab({name:i18n.t(200239/*销售订单编辑*/),component:i18n.t(200239/*销售订单编辑*/),url:'/salesorder/addEidt'});
            navAddTab({id:7,name:i18n.t(201054/*销售订单新增*/),component:i18n.t(201054/*销售订单新增*/),url:'/salesorder/addEidt'});
            this.props.router.push({pathname:'/salesorder/addEidt',query:{salBeId:this.props.id}});
		}else{
            ServiceTips({text:'请先激活此客户!',type:'error'});
		}

	}
	partyClick(){
		// let content=require('./ProductParty').default;
		// let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel});
		//   	this.setState({
		//   		showDilaog : true,
		//   		title: '新增 - 平台引入',
		//   		dialogContent: element
		//   	})
	}
	deleteClick(){
		let numArr = this.refs.mainTab.getSelectArr();
        if(numArr.length > 0){
        	Confirm("您确定要删除这条数据吗？", {
			  done: () => {
				    apiForm(API_FOODING_ERP,'/saleorder/delete',{billId:numArr[0].billId},(response)=>{
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
        }else {
        	ServiceTips({text:i18n.t(200328/*请选择一条数据进行操作*/),type:'error'});
        }
	}
	priceClick(){
		    //      let numArr = this.state.selectArr;
		    //   	let tempString;
		    //   	let num = numArr.length;
		    //   	if(numArr.length === 0) tempString = "自动报价";
		    //   	if(numArr.length === 1) tempString = "自动报价-"+ numArr;
		    //   	if(numArr.length > 1) tempString = "已选择"+numArr.length+"个客户";
		    // 	    let content=require('./Productprice').default;
			// 	    let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,num:num});
		    //   		this.setState({
		    //   			showDilaog : true,
		    //   			title: tempString,
		    //   			dialogContent: element
		    //   		})
	}
	// ajax list
	getPage(currentPage,order,value){
		    this.columnSort = order = order || this.columnSort;
		    let that = this;
		    let object;
		    let pageSize = value|| this.state.pageSize;
		    let currentP = !isNaN(currentPage) && currentPage? currentPage: 1;
		    if(this.normalRef.getForm().salBeId){
		    	object=Object.assign({},{pageSize: pageSize, currentPage:currentP,
		    		salBeId:this.props.id,businessNo:this.props.businessNo,offerId:this.props.offerId},this.normalRef.getForm(),order);
		    }else{
		    	let a = this.normalRef.getForm();
		    	delete a.salBeId;
		    	object=Object.assign({},{pageSize: pageSize, currentPage:currentP,
		    		salBeId:this.props.id,businessNo:this.props.businessNo,offerId:this.props.offerId},a,order);
		    }
			apiGet(API_FOODING_ERP,'/saleorder/getPage',object,
				(response)=>{
					that.setState({
						data: response.data.data,
						totalPages: response.data.totalPages,
						currentPage: response.data.currentPage,
						totalRecords:response.data.totalRecords
					});
				},(errors)=>{
			});


	}
	onSaveAndClose(){
		this.setState({
			showDilaog:!this.state.showDilaog,
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
	    if(data.type == 2){
			let {navAddTab, navRemoveTab} = this.props;
             navRemoveTab({name:i18n.t(200962/*销售订单详情*/),component:i18n.t(200962/*销售订单详情*/),url:'/SalesOrder/contact'});
             navAddTab({ name: i18n.t(200962/*销售订单详情*/), component: i18n.t(200962/*销售订单详情*/), url: '/SalesOrder/contact'});
             this.props.router.push({pathname: '/SalesOrder/contact',query:{id:data.record.billId}});
		}else if(data.type == 3){
			let {navAddTab, navRemoveTab} = this.props;
             navRemoveTab({name:i18n.t(200962/*销售订单详情*/),component:i18n.t(200962/*销售订单详情*/),url:'/SalesOrder/date'});
             navAddTab({ name: i18n.t(200962/*销售订单详情*/), component: i18n.t(200962/*销售订单详情*/), url: '/SalesOrder/date'});
             this.props.router.push({pathname: '/SalesOrder/date',query:{id:data.record.billId}});
		}else if(data.type == 4){

		}else if(data.type == 5){

		}else if(data.type == 6){

		}else if(data.type == 7){

		}else if(data.type == 8){
			Confirm(i18n.t(200369/*您确定要提交此订单吗*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/common/submitBill",{billId:numArr[0].billId,billType:numArr[0].billType},response => {
				    	//刷新当前页面
				    	this.getPage();
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
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:6,name:i18n.t(200962/*销售订单详情*/),
			component:i18n.t(200962/*销售订单详情*/),url:'/salesorder/detail'});
		this.props.router.push({pathname:'/salesorder/detail',query:{id:record.billId,no:record['no']}});
	}
	 handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 190 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
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
        window.removeEventListener('resize', this.handleResize);
    }
	// 销售单号 查看详情
	numDetailHandle = (num)=>{
		let that = this;
		this.setState({
			showDilaog: true,
			title: i18n.t(400008/*销售单号*/) + i18n.t(500281/*执行情况*/),
			dialogContent: React.createElement(require('./sourceNoDetail').default,{onCancel:that.onCancel,num:num})
		});
	}

	render(){
		let {data} = this.state;
		let meun;
		let that = this;
			meun = [{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-contact'}></i>{i18n.t(100588/*联络*/)}</div>,
					data:{action:i18n.t(100588/*联络*/),type:2}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-yuehui'}></i>{i18n.t(100587/*约会*/)}</div>,
					data:{action:i18n.t(100587/*约会*/),type:3}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-caigou-icon'}></i>{i18n.t(200743/*采购指令*/)}</div>,
					data:{action:i18n.t(200743/*采购指令*/),type:4}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-yuehui'}></i>{i18n.t(200744/*订舱指令*/)}</div>,
					data:{action:i18n.t(200744/*订舱指令*/),type:5}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-order'}></i>{i18n.t(100469/*订单调整*/)}</div>,
					data:{action:i18n.t(100469/*订单调整*/),type:6}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-approve'}></i>{i18n.t(100470/*查看审批*/)}</div>,
					data:{action:i18n.t(100470/*查看审批*/),type:7}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-submit'}></i>{i18n.t(100472/*提交*/)}</div>,
					data:{action:i18n.t(100472/*提交*/),type:8}
				}]

		return(<div>
			<FilterHeader
			id={this.props.id||this.props.businessNo||this.props.offerId}
			getPage = {this.getPage} normalRef={no => this.normalRef = no}
			expandFilter={this.handleResize}
			/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys businessNo={this.props.businessNo} offerId ={this.props.offerId} addClick={this.addClick} deleteClick={this.deleteClick}/>
						 <Page totalPages={this.state.totalPages}
                                      currentPage={this.state.currentPage}
                                      totalRecords={this.state.totalRecords}
                                      currentSize={this.state.size}
                                      pageSizeChange={(value) => {
                                          if (this.state.size == value) {
                                              return;
                                          }
                                          this.getPage(this.state.currentPage,null,value);
                                      }} backClick={(v) => {
                                    if (this.state.currentPage == v) {
                                        return;
                                    }
                                    this.getPage(v);
                                }} nextClick={(v) => {
                                    if (this.state.currentPage == v) {
                                        return;
                                    }
                                    this.getPage(v);
                                }}
                                      goChange={(v) => {
                                          if (this.state.currentPage == v) {
                                              return;
                                          }
                                          this.getPage(v);
                                      }}
                                />
					</div>
					<Table
						singleSelect ={true}
						columns={this.columns} ref = "mainTab"
						data={data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
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
export default NavConnect(SalesOrderList);
