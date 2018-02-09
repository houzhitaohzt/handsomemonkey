import React,{Component,PropTypes} from 'react';
const {Table} = require("../../components/Table");
import Page from "../../components/Page";//分页

// ajax
import Confirm from '../../components/Dialog/Confirm';//删除弹层
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../services/apiCall'; // ajax
import ServiceTips from '../../components/ServiceTips'; // 提示框
import {I18n} from '../../lib/i18n';//国际化



class PageDIV extends Component{ 
	
	constructor(props){
		super(props);
		this.columns = [];

		// this state 
		this.state = {
			scrollHeight:0,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:null,
			record:[],

			totalPages: 1, // 总页数			
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条 
			colorType: '',	// 颜色过滤
			followMark: false, // 过滤收藏
			searchVal:{}, // 查询条件
		}


		this.columns = [{
			title: I18n.t(600194/*采购商*/),
			dataIndex : 'purchaser',
			key : "purchaser",
			width : '8%',
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : I18n.t(100312/*供应商*/),
			dataIndex : "vendor",
			key : "vendor",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(100385/*海关编码*/),
			dataIndex : "hscode",
			key : "hscode",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);								
			}
		},{
			title: I18n.t(300077/*产品*/),
			dataIndex : "mtlName",
			key : "mtlName",
			width : "17%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(200557/*规格*/),
			dataIndex : "specTxt",
			key : "specTxt",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(600195/*原产国*/),
			dataIndex : "countryOriginTxt",
			key : "countryOriginTxt",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(100297/*起运港*/),
			dataIndex : "portFromTxt",
			key : "portFromTxt", 
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(100298/*目的港*/),
			dataIndex : "portToTxt",
			key : "portToTxt",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(600049/*FOB价*/),
			dataIndex : "fobPrice",
			key : "fobPrice",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(600050/*CIF价*/),
			dataIndex : "cifPrice",
			key : "cifPrice",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(600196/*重量*/),
			dataIndex : "weight",
			key : "weight",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(600197/*进关日期*/),
			dataIndex : "enterDate",
			key : "enterDate",
			width : "8%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title: I18n.t(600198/*出关日期*/),
			dataIndex : "leaveDate",
			key : "leaveDate",
			width : "8%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title: I18n.t(100230/*状态*/),
			dataIndex : "irowSts",
			key : "irowSts",
			width : "6%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data ? data['name'] : ''}</div>);
			}
		}];

		// even func 
		this.getPage = this.getPage.bind(this);

	}

	componentDidMount(){
		window.addEventListener('resize', this.handleResize(0));
		this.getPage();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(0));
	}

	handleResize(height){
		let sch=document.body.offsetHeight-height-72;
		let scroll=sch-160;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}

	// 页面刷新
	getPage(data = null){
		data ? 
			this.setState( {searchVal: data,currentPage:1}, function(){ this.getPageAjax() })
			:
			this.getPageAjax(); 
	}

	// 页面刷新 ajax
	getPageAjax(){
		let {customer,param} = this.props;
		let page = {pageSize:this.state.pageSize,currentPage:this.state.currentPage};
		let value = Object.assign(page,param,this.state.searchVal);
		let that = this;

		apiGet(API_FOODING_DS,'/customsData/getPage',value,
			(response)=>{
				that.setState({
					record: response.data.data||[],
					data: response.data.data||[],
					totalPages: response.data.totalPages,
					currentPage: response.data.currentPage 	
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}



	render(){
		let that = this;
		const {record} = this.state;


		return(<div>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className='action-buttons'>
					<div className={'key-page'}>
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
						ref = "provider"
						columns={this.columns}
						data={record}
						checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll-86}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
					/>
				</div>
				</div>
			</div>
		</div>
	)
	}
}
export default PageDIV;

