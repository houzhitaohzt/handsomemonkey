import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层

import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";

//引入提示
import Tooltip from 'antd/lib/tooltip';
import SpecTextCard from "../../../Product/List/SpecText/SpecText";

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips,{errorTips, successTips} from '../../../../components/ServiceTips';

import {I18n} from '../../../../lib/i18n';

class EnterprisePlatProductList extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();

		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);

		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);

		this.handleClick=this.handleClick.bind(this);

		this.getPages = this.getPages.bind(this);	// 刷新页面	
		this.columns = [{
			title : I18n.t(100377/*产品编码*/),
			dataIndex : 'code',
			key : "code",
			width : '12%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : I18n.t(100379/*产品*/),
			dataIndex : "localName",
			key : "localName",
			sort: "name",
			width : "14%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100226/*英文名称*/),
			dataIndex : "enName",
			key : "enName",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100382/*产品规格*/),
			dataIndex : "specTxt",
			key : "specTxt",
			width : "15%",
			tooltip: false,
			render(data,row,index){
				if(data){
					return (<Tooltip
	                    placement="bottomRight"
	                    mouseEnterDelay={0.5}
	                    arrowPointAtCenter={true}
	                    mouseLeaveDelay={0.2}
	                   prefixCls="spctext-toolip"
	                    overlay={<SpecTextCard id={row&&row.id}/>}
	                >
	                    <div className="text-ellipsis mail-hover">{data}</div>
	                </Tooltip>)
				}
			}
		}];
		this.filterData = {};//存储颜色值
		this.columnSort = {column: 'id', order: 'desc'};
		this.searchForm={};
	}

	initState(){
		return{
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
			data:[],
			filter:{},
			dataMulDiv2s:this.props.location.query.id,
			dataMulDivsLable:decodeURIComponent(this.props.location.query.name)
		}
	}
	serchClick = () => {//表格上面的搜索条件
		this.getPages(1)
	}
	cleanClick = () => {//表格上面的清空搜索条件
		this.getPages(1)
	}
	groupeClick = () => {
		let content=require('./GroupeProDailog').default;
		let element=React.createElement(content,{onSaveAndClose:this.onGroupeSaveClose,onCancel:this.onCancel});
        this.setState({
            showDilaog:true,
            title:i18n.t(100572/*产品分组*/),
            dialogContent:element
        }); 
	}
	//产品分组 保存并关闭
	onGroupeSaveClose = (Id,LocalName) => {
		if(!Id){
			Id = "";
			LocalName = ""
		}
		this.setState({
			dataMulDiv2s:Id,
			dataMulDivsLable:LocalName,
			showDilaog:false
		})
	}
	onSaveAndClose(){
		this.setState({
			showDilaog:!this.state.showDilaog
		},this.getPages())
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}
	inputClick = data => {
		let content=require('../../../Product/List/components/ProductParty').default;
		let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel});
    	this.setState({
    		showDilaog : true,
    		title: I18n.t(100392/*新增*/) + '-' + I18n.t(100393/*平台引入*/),
    		dialogContent: element
    	})
	}
	handleClick(e,data){
		if(data.type== 1){
			this.inputClick();
		}
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:6,name:i18n.t(200547/*企业平台产品列表*/),component:i18n.t(200547/*企业平台产品列表*/),url:'/enterprise/platproduct/supplie'});
		this.props.router.push({pathname:'/enterprise/platproduct/supplie',query:{id:record.id}});
	}

	handleResize(height){
		let sch=document.body.offsetHeight-72-height;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	getPages(currentPage,size,filter,order){
		filter=this.searchForm.getFieldsValue() || {};
		this.columnSort = order = order || this.columnSort;
		let {page}=this.state;
		currentPage = currentPage||this.state.currentPage;
		size=size||this.state.pageSize;
		let params=Object.assign({},{currentPage:currentPage,pageSize:size},filter,order,this.filterData);
		apiGet(API_FOODING_DS,'/platformMaterial/getPage',params,(response)=>{
			this.setState({
				data:response.data.data,
				pageSize:response.data.pageSize,
				totalPages:response.data.totalPages,
				currentPage:response.data.currentPage,
				totalRecords:response.data.totalRecords
			})
		},error =>{
			ServiceTips({text: error.message,type:'error'});
		});
	}

	componentDidMount(){
		this.handleResize(0)
		window.addEventListener('resize', this.handleResize);
		this.getPages();		
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}
	componentWillReceiveProps(nextProps){
		window.addEventListener('resize', this.handleResize);
		let dataMulDiv2s = nextProps.location.query?nextProps.location.query.id:"";
		if(dataMulDiv2s && this.props.location.query.id !== dataMulDiv2s){
			this.setState({dataMulDiv2s})
		}
	}
	render(){
		let that = this;
		return(<div>
			<FilterHeader serchClick={this.serchClick} cleanClick={this.cleanClick} id={this.props.location.query.id} groupeClick={this.groupeClick} dataMulDivsLable={this.state.dataMulDivsLable} dataMulDiv2s={this.state.dataMulDiv2s}  formCall={form => this.searchForm = form}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys inputClick={this.inputClick} />
						<Page 
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages} 
							sizeList={sizeList}
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
						ref = "product"
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onRowDoubleClick={this.onRowDoubleClick}
						onHeaderSortClick={this.getPages.bind(this, null, null, null)}
						contextMenuConfig={{
							enable:true,
							contextMenuId:'SIMPLE_TABLE_MENU',
							menuItems:[{
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-kucun'}/>{i18n.t(200549/*加入产品库*/)}</div>,
								data:{action:i18n.t(200549/*加入产品库*/),type:1}
							}]
						}}
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
export default NavConnect(EnterprisePlatProductList);