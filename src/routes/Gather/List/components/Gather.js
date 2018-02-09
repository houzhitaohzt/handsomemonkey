import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,
	language,pageSize,sizeList,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
class Gather extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		var that = this;
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.handleClick=this.handleClick.bind(this);
		this.guanbi = this.guanbi.bind(this);
		this.getPage = this.getPage.bind(this);
		//this.getOne= this.getOne.bind(this);
		this.columns = [{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : 'billDate',
			key : "billDate",
			width : '8%',
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
			title : i18n.t(500129/*源单编号*/),
			dataIndex : "sourceNo",
			key : "sourceNo",
			width : "8%",
            sort: "sourceNo",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(500083/*收款企业*/),
			dataIndex : "receiptCc"+language,
			key : "receiptCc"+language,
            sort: "receiptCcId",
			width : "10%",
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : i18n.t(100311/*客户*/),
			dataIndex : "salBe"+language,
			key : "salBe"+language,
            sort: "salBeId",
			width : "10%",
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : i18n.t(500038/*订单金额*/),
			dataIndex : "orderAmt",
			key : "orderAmt",
			width : "10%",
            sort: "orderAmt",
			render(data,row,index){
				return (<div>{data?(toDecimal(data)+' '+row.cnyLcName):''}</div>);
			}
		},{
			title : i18n.t(200621/*实收金额*/),
			dataIndex : "receAmt",
			key : "receAmt",
			width : "10%",
			render(data,row,index){
				return (<div>{data?(toDecimal(data)+' '+row.cnyLcName):''}</div>);
			}
		},{
			title : i18n.t(400115/*调整金额*/),
			dataIndex : "adjustAmt",
			key : "adjustAmt",
			width : "9%",
			render(data,row,index){
				return (<div>{data?(toDecimal(data)+' '+row.cnyLcName):''}</div>);
			}
		},{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : "status",
			key : "status",
			width : "9%",
			render(data,row,index){
				return <div>{row.statusName}</div>;
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "9%",
			render(data,row,index){
				return (<div>
					{ permissionsBtn('receipt.singlenode') ? <i className={row.status==10?'none':'foddingicon fooding-handle'} onClick={that.handleClick.bind(this,data,row)}></i> :''}
					{ permissionsBtn('receipt.singlenode') ? <i className={row.status==10?'foddingicon fooding-close-two':'none'} onClick={that.guanbi.bind(this,data,row)}></i> : ''}
					</div>)
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
			MeunState:true,
			data:[],
			info:[],
			obj:{},
			pageSize:pageSize,
			currentPage:1
		}
	}
	//请求列表  list
	getPage(currentPage,order){
		let that = this;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
        this.columnSort = order = order || this.columnSort;
		let object=Object.assign({},order,{isPlatform:true, pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/receipt/getPage',object,
				(response)=>{	
					this.setState({	
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
	handleClick(e,record){
		  Confirm("你确定要结账吗?", {
		              done: () => {
		                    apiForm(API_FOODING_ERP,"/receipt/settle",{billId:record.billId},response => {
		                        ServiceTips({text:response.message,type:"success"})
		                        this.getPage()
		                    },error => {
		                        ServiceTips({text:error.message,type:'error'})
		                    })
		                },
		                close:() => {
		                    console.log('no, close')
		                }
		   });
				
		
	}
	guanbi(e,record){
		Confirm("你确定要反结单吗?", {
		              done: () => {
		                    apiForm(API_FOODING_ERP,"/receipt/unSettle",{billId:record.billId},response => {
		                        ServiceTips({text:response.message,type:"success"})
		                        this.getPage()
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
		navAddTab({id:'33',name:i18n.t(200627/*收款单详情*/),component:i18n.t(200627/*收款单详情*/),url:'/gather/detail'});
		this.props.router.push({ pathname: '/gather/detail',query:{id:record.billId}});
	}
	handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight})
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
			<FilterHeader  normalRef={no => this.normalRef = no} getPage ={this.getPage} expandFilter= {this.handleResize}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
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
						columns={this.columns}
						data={data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						onRowDoubleClick={this.onRowDoubleClick}
						onHeaderSortClick={this.getPage.bind(this,this.state.currentPage)}
					/>
				</div>
				</div>
				
			</div>
		</div>)
	}
}
export default NavConnect(Gather);

