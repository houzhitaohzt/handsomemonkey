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


class ProductList extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();

		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.copyClick=this.copyClick.bind(this);

		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);

		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);

		this.handleClick=this.handleClick.bind(this);
        this.columnSort = {column: 'code', order: 'asc'};
		this.getPage = this.getPage.bind(this);	// 刷新页面	
		this.columns = [{
			title : I18n.t(100377/*产品编码*/),
			dataIndex : 'code',
			key : "code",
			width : '8%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : I18n.t(100379/*产品*/),
			dataIndex : "localName",
			key : "localName",
			width : "20%",
			sort:false,
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100226/*英文名称*/),
			dataIndex : "enName",
			key : "enName",
			width : "20%",
			sort:'nameValues.en',
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100382/*产品规格*/),
			dataIndex : "specTxt",
			key : "specTxt",
			width : "25%",
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
		},{
			title : I18n.t(100230/*状态*/),
			dataIndex : 'irowSts',
			key : "irowSts",
            sort: 'rowSts',
			width : "5%",
			render(data,row ,index){
				return data.name;
			}
		},{
			title : I18n.t(100388/*最新更新时间*/),
			dataIndex : 'updateDate',
			key : "updateDate",
			width : "13%",
			render(data,row,index){
				if(data){
					return new Date(data).Format("yyyy-MM-dd hh:mm:ss");
				}
				return null;
			}
		}];
		this.filterData = {};//存储颜色值
	}

	initState(){
		return{
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条
			data:[],
			filter:{}
		}
	}
	addClick(){
		let {navAddTab, navRemoveTab} =this.props;
        navRemoveTab({name:I18n.t(100439/*编辑*/) + I18n.t(100427/*平台产品*/),component:I18n.t(100439/*编辑*/) + I18n.t(100427/*平台产品*/),url:'/platform/product/edit'});
        navAddTab({name:I18n.t(100392/*新增*/) + I18n.t(100427/*平台产品*/),component:I18n.t(100392/*新增*/) + I18n.t(100427/*平台产品*/),url:'/platform/product/edit'});
        this.props.router.push('/platform/product/edit');
	}
	deleteClick(){
		let numArr = this.refs.product.getSelectArr();
		let tempString = "",id=[];
		if(numArr.length==0){
			ServiceTips({text:I18n.t(100397/*请选择产品！*/),type:'error'});
			return false;
		}else if(numArr.length==1){
			tempString= I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
		}else{
			tempString=I18n.t(100395/*已选中*/) + numArr.length + I18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
		}
		for(let j=0,len= numArr.length; j<len; j++){
			id.push(numArr[j].id)
		}
		Confirm(tempString, {
		  done: () => {
			    this.deletedFunc(id);
			},
			close:() => {
				console.log('no, close')
			}
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
		let numArr = this.refs.product.getSelectArr();
		if(numArr.length != 1){
			ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'info'});
			return false;
		}
		apiForm(API_FOODING_DS,"/platformMaterial/copy",{id:numArr[0].id},response =>{
			let id = response.data && response.data.material&& response.data.material.id || undefined;
			if(!id) return;
			let {navAddTab,navRemoveTab} =this.props;
			navRemoveTab({name:I18n.t(100392/*新增*/) + I18n.t(100427/*平台产品*/),component:I18n.t(100392/*新增*/) + I18n.t(100427/*平台产品*/),url:'/platform/product/edit'});
			navAddTab({name:I18n.t(100439/*编辑*/) + I18n.t(100427/*平台产品*/),component:I18n.t(100439/*编辑*/) + I18n.t(100427/*平台产品*/),url:'/platform/product/edit'});
	        this.props.router.push({pathname:'/platform/product/edit',query:{id:id}});
		},error => ServiceTips({text:error.message,type:'error'}))
	}
	handleClick(e,data){
		if(data.type== 1){
			this.deleteClick()
		}else if(data.type== 2){
            let {navAddTab, navRemoveTab} =this.props;
            navRemoveTab({name:I18n.t(100392/*新增*/) + I18n.t(100427/*平台产品*/),component:I18n.t(100392/*新增*/) + I18n.t(100427/*平台产品*/),url:'/platform/product/edit'});
            navAddTab({name:I18n.t(100439/*编辑*/) + I18n.t(100427/*平台产品*/),component:I18n.t(100439/*编辑*/) + I18n.t(100427/*平台产品*/),url:'/platform/product/edit'});
            this.props.router.push({pathname: '/platform/product/edit', query: {id: data.record.id}});

		}else if(data.type== 3){
			apiForm(API_FOODING_DS,'/platformMaterial/enable',{id:data.record.id,optLock:data.record.optlock},(response)=>{
				ServiceTips({text:response.message,type:'sucess'});
				this.getPage();
			},(error)=>{
                errorTips(error.message);
			})
		}else if(data.type== 4){
			Confirm(I18n.t(100435/*是否对该条数据失效？*/), {
			  done: () => {
			  		//表示是失效
					apiForm(API_FOODING_DS,'/platformMaterial/disable',{id:data.record.id,optLock:data.record.optlock},(response)=>{
						ServiceTips({text:response.message,type:'sucess'});
						this.getPage();
					},(error)=>{
						ServiceTips({text:error.message,type:'error'})
					})
				}
			});
		}
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:6,name:I18n.t(100427/*平台产品*/) + I18n.t(100097/*详情*/),component:I18n.t(100427/*平台产品*/) + I18n.t(100097/*详情*/),url:'/platform/product/detail'});
		this.props.router.push({pathname:'/platform/product/detail',query:{id:record.id}});
	}

	handleResize(e, height){
        this.filterHeight = height || this.filterHeight || 50;
        let sch = document.body.offsetHeight - this.filterHeight - 92;
		let scroll = sch - 90;
        this.setState({scrollHeight: sch+'px',scroll:scroll});
	}
	//请求列表  list
	getPage = (currentPage,order) => {
		let that = this;
        this.columnSort = order = order || this.columnSort;
		var sID = sID || '';
		let currentP = currentPage|| 1;
		let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm(),order);
		apiGet(API_FOODING_DS,'/platformMaterial/getPage',object,
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
	// 调用删除 ajax  传进来的id必须为一个数组
	deletedFunc(ID){	
		let that = this;
		apiForm(API_FOODING_DS,'/platformMaterial/delete',{id: ID},
			(response)=>{							
				ServiceTips({text:response.message,type:'sucess'});
				that.getPage();
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}
	componentDidMount(){
	    this.handleResize();
		this.getPage();
		window.addEventListener('resize', this.handleResize);
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	render(){
		let that = this;
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader  getPage ={this.getPage} expandFilter= {this.handleResize}  normalRef={no => this.normalRef = no} />
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick} copyClick={this.copyClick} />
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
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onRowDoubleClick={this.onRowDoubleClick}
                        onHeaderSortClick={this.getPage.bind(this, null)}
						contextMenuConfig={{
							enable:true,
							contextMenuId:'SIMPLE_TABLE_MENU',
							menuItems:[{
								permissions:'platform.mtl.del',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-delete-icon3'}/>{I18n.t(100437/*删除*/)}</div>,
								data:{action:I18n.t(100437/*删除*/),type:1}
							},{
                                onClick:this.handleClick,
                                content:<div><i className={'foddingicon fooding-alter'}/><span>{I18n.t(100439/*编辑*/)}</span></div>,
                                data:{action:I18n.t(100439/*编辑*/),type:2}
                            },{
								permissions:'platform.mtl.activation',
								onClick:this.handleClick,
                                condition: [{key: 'irowSts.id', value: [5, 20], exp: '==='}],
								content:<div><i className={'foddingicon fooding-jh-icon2'}/><span>{I18n.t(100442/*激活*/)}</span></div>,
								data:{action:I18n.t(100442/*激活*/),type:3}
							},{
								permissions:'platform.mtl.Invalid',
								onClick:this.handleClick,
                                condition: [{key: 'irowSts.id', value: [5, 10], exp: '==='}],
								content:<div><i className={'foddingicon fooding-sx-icon2'}/><span>{I18n.t(100441/*失效*/)}</span></div>,
								data:{action:I18n.t(100441/*失效*/),type:4}
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
export default NavConnect(ProductList);