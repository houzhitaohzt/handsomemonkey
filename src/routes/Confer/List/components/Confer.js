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
import {apiGet,apiPost,apiForm,API_FOODING_OA,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
class Charge extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.getPage = this.getPage.bind(this);
		this.state = this.initState();
		this.columns = [{
			title : i18n.t(100311/*客户*/),
			dataIndex : "salBe"+language,
			key : "salBe"+language,
			width : "10%",
			render(data,row,index){
				return (<div className={"text-ellipsis"}>{data}</div>);
			}
		},{
			title : i18n.t(200303/*负责人员*/),
			dataIndex : "responsibleOfficerLcName",
			key : "responsibleOfficerLcName",
			width : "5%",
			render(data,row,index){
				return (<div className={"text-ellipsis"}>{data}</div>);
			}
		},{
			title : i18n.t(100145/*创建时间*/),
			dataIndex : 'businessDate',
			key : "businessDate",
			width : '5%',
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(100301/*方向*/),
			dataIndex : "directyp",
			key : "directyp",
			width : "3%",
			render(data,row,index){
				return data == 10?i18n.t(100302/*我方*/):i18n.t(100303/*对方*/);
			}
		},{
			title : i18n.t(100304/*主题*/),
			dataIndex : "title",
			key : "title",
			width : "11%",
			render(data,row,index){
				return (<div className={"text-ellipsis"}>{data}</div>);
			}
		},{
			title : i18n.t(600166/*预计时间*/),
			dataIndex : "expectedStartTime",
			key : "expectedStartTime",
			width : "13%",
			render(data,row,index){
				if(!row['expectedStartTime'] || !row['expectedEndTime']) return <b></b>;
				return new Date(data).Format('yyyy-MM-dd hh') + 'H ' + '- ' + new Date(row['expectedEndTime']).Format('yyyy-MM-dd hh') + 'H';
			}
		},{
			title : i18n.t(600167/*实际时间*/),
			dataIndex : 'starts',
			key : "starts",
			width : "13%",
			render(data,row ,index){
				if(!row['starts'] || !row['ends']) return <b></b>;
				return new Date(data).Format('yyyy-MM-dd hh') + 'H ' + '- ' + new Date(row['ends']).Format('yyyy-MM-dd hh') + 'H';
			}
		},{
			title : i18n.t(100230/*状态*/),
			dataIndex : 'state',
			key : "state",
			width : "3%",
			render(data,row ,index){
				if(data == '0') return i18n.t(100329/*计划*/);
				if(data == '1') return i18n.t(400000/*已联络*/);
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
		window.navTabs.open(i18n.t(200292/*约会新增*/),`/confer/add`,{},{refresh: true});
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
		window.navTabs.open(i18n.t(200279/*约会详情*/),`/confer/detail`,{scheduleId:record['id'],salBeId:'',originalId:'',originalType:''},{refresh: true});
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
		let ID = select.map(o=>o['id']);


		// 删除 条件判断
		if(react){
			if( ID['length'] == 0 ){
				Confirm(i18n.t(500115/*请选中一条数据？*/));
			} else{
				this.deleteAjax(ID); // 删除 请求
			}
		} else{
			this.deleteAjax(row.billId); // 右键
		}
	}

	// 删除 请求
	deleteAjax(ID){
		let that = this;
		Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			done: () => {
				apiForm(API_FOODING_OA,'/activity/deletes',{id:ID},
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
		let param = {
			activityType:10,
			originalId:'',
			originalType:'',
			salBeId:'',
			column:'id',
			order:'desc'
		}
	
		// 保存 请求
		function ajax(){
			apiGet(API_FOODING_OA,'/activity/getList',Object.assign({},param,{activityType:10,pageSize: that.state.pageSize,currentPage: that.state.currentPage},that.state.sData),
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

		if(sData){
			this.setState({sData:sData,currentPage:1},function(){
				ajax();
			});
		} else{
			ajax();		
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
export default NavConnect(Charge);

