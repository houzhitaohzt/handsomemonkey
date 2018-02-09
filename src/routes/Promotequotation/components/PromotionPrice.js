import i18n from '../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../services/apiCall";
import ServiceTips from '../../../components/ServiceTips';
class SalesOrderList extends Component{
	constructor(props){
		super(props);
		let that = this;
		this.getPage = this.getPage.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.state = this.initState();
		this.columns = [{
			title : i18n.t(100311/*客户*/),
			dataIndex : 'salbeName',
			key : "salbeName",
			width : '30%',
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(500299/*推送日期*/),
			dataIndex : "sendDate",
			key : "sendDate",
			width : "30%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(500300/*推送状态*/),
			dataIndex : "success",
			key : "success",
			width : "10%",
			render(data,row,index){
				return <div>{data?i18n.t(200675/*成功*/):'失败'}</div>;
			}
		},{
			title : i18n.t(100336/*备注*/),
			dataIndex : "remark",
			key : "remark",
			width : "20%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
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
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/promotesendlog/getPage',object,
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
	handleResize = (e, height)=> {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 190 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }

	componentDidMount(){
        this.getPage();
    };
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
	render(){
		const data = this.state.data || [];
		let {page,currentPage} =this.state;
		let that = this;
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
						singleSelect ={true}
						columns={this.columns} 
						ref = "mainTab"
						data={data}
						checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
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