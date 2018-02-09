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
import {createForm, FormWrapper} from "../../../../components/Form";
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,
	language,toDecimal} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
class  KanTemplate extends  Component {
	constructor(props) {
		 super(props);

		 this.state={
		 	tableData:[]
		 }
		 this.distinct_columns = [
            {
                title: i18n.t(100181/*款项类型*/),
                dataIndex: "fundTy"+language,
                key: "fundTy"+language,
                width: "20%",
                render(data, row, index){
                    return (<div className="text-ellipsis" title={data}>{data}</div>);
                }
            }, {
                title: i18n.t(200841/*申请付款金额*/),
                dataIndex: 'applyAmt',
                key: "applyAmt",
                width: '30%',
                ignore_equals: true,
                render(data, row, index){
                    return (<div className="text-ellipsis" title={data}>{data?toDecimal(data)+row["cny"+language]:''}</div>)
                }
            }, {
                title: i18n.t(200829/*已付*/),
                dataIndex: "payAmt",
                key: "payAmt",
                width: "12%",
                render(data, row, index){
                    return <div>{data?toDecimal(data)+row["cny"+language]:''}</div>;
                }
            }
        ];
	}
	render(){
		return(<FormWrapper showFooter={true} style={{height: "344px"}} showSaveClose={false} className='scroll' onSaveAndClose={this.onSaveAndClose} onCancel={this.props.onCancel}>
					<div className="common-distinct-table">
	                    <Table
	                        columns={this.distinct_columns}
	                        data={this.props.tableData}
	                        checkboxConfig={{show: false}}
	                        colorFilterConfig={{show: false}}
	                        followConfig={{show: false}}
	                        prefixCls={"rc-confirm-table"}
	                        scroll={{x: false, y: 300}}
	                    />
	                </div>
				</FormWrapper>
            )
	}
}
const Kan = KanTemplate;
class SalesOrderList extends Component{
	constructor(props){
		super(props);
		let that = this;
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		// this.addClick=this.addClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);

		this.columns = [{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : 'billDate',
			key : "billDate",
			width : '5%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{new Date(data).Format('yyyy-MM-dd')}</div>)
			}
		},{
			title : i18n.t(400048/*单据编号*/),
			dataIndex : 'no',
			key : 'no',
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(500129/*源单编号*/),
			dataIndex : 'sourceNo',
			key : "sourceNo",
			width : "8%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200817/*申请人*/),
			dataIndex : "payStaff"+language,
			key : "payStaff"+language,
			width : "5%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200841/*申请付款金额*/),
			dataIndex : "orderAmt",
			key : "orderAmt",
			width : "5%",
			className:'text-center',
			render(data,row,index){
				 return <div>{data? toDecimal(data)+' '+row["cny"+language]:''}</div>;
			}
		},{
			title : i18n.t(400084/*收款单位*/),
			dataIndex : "receiptBe"+language,
			key : "receiptBe"+language,
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(500146/*源单类型*/),
			dataIndex : 'sourceTypeName',
			key : 'sourceTypeName',
			width : "5%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : 'statusName',
			key : "statusName",
			width : "5%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : 'createDate',
			key : "createDate",
			width : "5%",
			render(data,row,index){
				return <div onClick ={that.caozuoClick.bind(that,row)}><i className='foddingicon fooding-fukuanqk'></i></div>
			}
		}];
		this.getPage = this.getPage.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
		this.caozuoClick = this.caozuoClick.bind(this);
	}
	caozuoClick(row,e){
		e.stopPropagation();
		let that = this;
		apiGet(API_FOODING_ERP,'/payment/getPayList',{applyNo:row.no},(response)=>{
			that.setState({
				dialogContent:<Kan tableData={response.data} onCancel={that.onCancel}/>,
				showDilaog:true,
			   title:i18n.t(200831/*付款情况*/)
			});
		},(error)=>{
			ServiceTips({text:error.message,type:'error'});
		})

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
            pageSize:pageSize
		}
	}
	// addClick(){
 //        //付款申请
	// 	let {navAddTab} =this.props;
	// 	navAddTab({name:'付款申请新增',component:'付款申请新增',url:'/paymentApplication/addEidt'});
	// 	this.props.router.push('/paymentApplication/addEidt');
	// }

	deleteClick(){
		let numArr = this.refs.mainTab.getSelectArr();
        if(numArr.length > 0){
        	Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,'/paymentapplcat/delete',{billId:numArr[0].billId},(response)=>{
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
        	ServiceTips({text:i18n.t(200328/*请选择一条数据进行操作*/),type:'error'});
        }
	}
	// ajax list
	getPage(current,pageS){
			let that = this;
			let currentPage = current || 1;
			let pageSize = pageS || this.state.pageSize;
			let object=Object.assign({},{pageSize: pageSize, currentPage:currentPage},this.normalRef.getForm());
			apiGet(API_FOODING_ERP,'/paymentapplcat/getPage',object,
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
			showDilaog:!this.state.showDilaog
		})
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}
	handleResize(e, height) {
		 this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        this.setState({scroll: scroll});
	}
	componentDidMount(){
		this.getPage();
		window.addEventListener('resize', this.handleResize(47));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}
	onRowDoubleClick(record){
		let {navAddTab} =this.props;
		navAddTab({name:i18n.t(200405/*付款申请详情*/),component:i18n.t(200405/*付款申请详情*/),url:'/paymentApplication/detail'});
		this.props.router.push({pathname:'/paymentApplication/detail',query:{id:record.billId}});
	}

	render(){
		let {data} = this.state;
		let meun;
		let that = this;
		return(<div>
			<FilterHeader  getPage = {this.getPage} normalRef={no => this.normalRef = no} expandFilter={this.handleResize}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				<div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys
                        deleteClick = {this.deleteClick}/>
						 <Page totalPages={this.state.totalPages}
                                      currentPage={this.state.currentPage}
                                      totalRecords={this.state.totalRecords}
                                      currentSize={this.state.size}
                                      pageSizeChange={(value) => {
                                          if (this.state.size == value) {
                                              return;
                                          }
                                          this.getPage(null, value);
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
						onRowDoubleClick={this.onRowDoubleClick}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
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
