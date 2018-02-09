import React,{Component,PropTypes} from 'react';
//引入提示
import Tooltip from 'antd/lib/tooltip';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层

import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";

import SpecTextCard from "../SpecText/SpecText";
import MailCard from "../../../Client/List/MailCard/MailCard";

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import Card from "../../../Common_confirm/Card.js";
import {I18n} from '../../../../lib/i18n';

class ProductList extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();

		this.addClick=this.addClick.bind(this);
		this.partyClick=this.partyClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.priceClick=this.priceClick.bind(this);
		this.copyClick=this.copyClick.bind(this);

		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);

		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);

		this.handleClick=this.handleClick.bind(this);

		this.getPage = this.getPage.bind(this);	// 刷新页面
		this.columnSort = {column: 'code', order: 'asc'};
		let that = this;
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
			width : "14%",
			sort:false,
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100226/*英文名称*/),
			dataIndex : "enName",
			key : "enName",
			width : "10%",
			sort:'nameValues.en',
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100382/*产品规格*/),
			dataIndex : "specTxt",
			key : "specTxt",
			width : "50%",
			tooltip: false,
			render(data,row,index){
				if(data){
					return (<Tooltip
	                    placement="bottomLeft"
	                    mouseEnterDelay={0.5}
	                    arrowPointAtCenter={true}
	                    mouseLeaveDelay={0.2}
	                    prefixCls="spctext-toolip"
						trigger="click"
	                    overlay={<SpecTextCard id={row&&row.id}/>}
	                >
	                    <div className="text-ellipsis mail-hover">{data}</div>
	                </Tooltip>)
				}
			}
		}, {
            title: I18n.t(100384/*产品等级*/),
            dataIndex: 'dataDiv',
            key: "dataDiv",
            width: "7%",
            className: "text-center",
            render(data, row, index) {
                return data;
            }
        },
		/*},{
			title : I18n.t(100385*//*海关编码*//*),
			dataIndex : "hsCode",
			key : "hsCode",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : I18n.t(100386*//*生产标准*//*),
			dataIndex : "pPStd",
			key : "pPStd",
			width : "12%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},*/{
			title : I18n.t(100361/*分管人*/),
			dataIndex : 'staffs_bs',
			key : "staffs_bs",
			width : "10%",
			tooltip: false,
			render(data,row,index){
				if(!data) return;
                return <Card type="admin" data={data[0]}/>;
			}
		},/*{
			title : I18n.t(100388*//*最新更新时间*//*),
			dataIndex : 'updateDate',
			key : "updateDate",
			width : "14%",
			render(data,row,index){
				if(data){
					return new Date(data).Format("yyyy-MM-dd hh:mm:ss");
				}
				return null;
			}
		},*/{
			title : I18n.t(100230/*状态*/),
			dataIndex : 'irowSts',
			key : "irowSts",
			width : "6%",
			render(data,row,index){
				return data.name || "";
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
		let {navAddTab,navRemoveTab} =this.props;
		navRemoveTab({name:I18n.t(100390/*产品编辑*/),component:I18n.t(100390/*产品编辑*/),url:'/product/add'});
		navAddTab({name:I18n.t(100391/*产品新增*/),component:I18n.t(100391/*产品新增*/),url:'/product/add'});
		this.props.router.push('/product/add');
	}
	partyClick(){
		let content=require('./ProductParty').default;
		let element=React.createElement(content,{onSaveAndClose:this.onPartySaveAndClose,onCancel:this.onCancel});
    	this.setState({
    		showDilaog : true,
    		title: I18n.t(100392/*新增*/) + '-' + I18n.t(100393/*平台引入*/),
    		dialogContent: element
    	})
	}
	deleteClick(){
		let numArr = this.refs.product.getSelectArr();
		let tempString = "",id=[];
		if(numArr.length==0){
			ServiceTips({text:I18n.t(100394/*请选择数据！*/),type:'error'});
			return false;
		}else if(numArr.length==1){
			tempString=I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
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
	priceClick(){
		let numArr = this.refs.product.getSelectArr();
    	let tempString;
    	let num = numArr.length;
    	if(numArr.length === 0){
    		ServiceTips({text:I18n.t(100397/*请选择产品！*/),type:'error'});
    		return false;
    	}
    	if(numArr.length === 1) tempString = I18n.t(100398/*自动报价*/) + "-"+ numArr[0].localName;
    	if(numArr.length > 1) tempString = I18n.t(100399/*已选择*/) + numArr.length + I18n.t(300077/*产品*/);
			let content=require('./ProductPrice').default;
			let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,num:num,proArr:numArr});
    	this.setState({
    		showDilaog : true,
    		title: tempString,
    		dialogContent: element

    	})
	}
    onPartySaveAndClose = ()=>{
	    this.getPage();
	    this.onSaveAndClose();
    };

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
	//分管人
	allotClick = () => {
		let numArr = this.refs.product.getSelectArr(),tempString;
		if(!numArr.length){
			ServiceTips({text:I18n.t(100394/*请选择数据！*/),type:'error'});
			return false;
		}
		tempString = I18n.t(100395/*已选中*/) + numArr.length + I18n.t(100401/*个产品*/);
		let content=require('./AlloteDailog').default;
		let element=React.createElement(content,{onSaveAndClose:this.onPartySaveAndClose,onCancel:this.onCancel,numArr:numArr});
    	this.setState({
    		showDilaog : true,
    		title: tempString,
    		dialogContent: element
    	})
	}
	//复制功能
	copyClick(){
		let numArr = this.refs.product.getSelectArr();
		if(numArr.length != 1){
			ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'info'});
			return false;
		}
		apiForm(API_FOODING_DS,"/material/copy",{id:numArr[0].id},response =>{
			let id = response.data && response.data.material&& response.data.material.id || undefined;
			if(!id) return;
			let {navAddTab,navRemoveTab} =this.props;
			navRemoveTab({name:I18n.t(100392/*新增*/),component:I18n.t(100392/*新增*/),url:'/product/add'});
			navAddTab({name:I18n.t(100390/*产品编辑*/),component:I18n.t(100390/*产品编辑*/),url:'/product/add'});
			this.props.router.push({pathname:'/product/add',query:{id:id}});
		},error => ServiceTips({text:error.message,type:'error'}))
	}
	handleClick(e,data){
		if(data.type == 0){
			this.deleteClick()
		}else if(data.type == 1 ){
			this.priceClick();
		}else if(data.type == 3){
			apiForm(API_FOODING_DS,'/material/enable',{id:data.record.id,optLock:data.record.optlock},(response)=>{
				ServiceTips({text:response.message,type:'sucess'})
				this.getPage();
			},(error)=>{

			})
		}else if(data.type == 2){
			Confirm(I18n.t(100435/*是否对该条数据失效？*/), {
			  done: () => {
			  		//表示是失效
					apiForm(API_FOODING_DS,'/material/disable',{id:data.record.id,optLock:data.record.optlock},(response)=>{
						ServiceTips({text:response.message,type:'sucess'})
						this.getPage();
					},(error)=>{
						ServiceTips({text:error.message,type:'error'})
					})
				},
				close:() => {
				}
			});
		}
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:6,name:I18n.t(100402/*产品详情*/),component:I18n.t(100402/*产品详情*/),url:'/product/detail'});
		this.props.router.push({pathname:'/product/detail',query:{id:record.id},state: {refresh: true}});
	}

	//颜色分类
	savePrefers = (color, rowData) => {
	    if( !rowData) return;
        let params = {id: rowData.id, colorType: color, optlock: rowData.optlock, followMark: rowData.followMark||false};
	    apiForm(API_FOODING_DS,'/material/savePrefers',params, response => {
	    	rowData.optlock += 1;
            ServiceTips({text: response.message,type:'success'});
            this.getPage();
        }, error => {
            ServiceTips({text:error.message,type:'error'});
        });
    };

	//table五角星 选中和不选中
	saveStats = rowData => {
        if( !rowData) return;
        let params = {id: rowData.id, colorType: rowData.colorType || "", optlock: rowData.optlock, followMark: !rowData.followMark};
        apiForm(API_FOODING_DS,'/material/savePrefers',params, response => {
        	rowData.optlock += 1;
            ServiceTips({text: response.message,type:'success'});
            this.getPage();
        }, error => {
            ServiceTips({text: error.message,type:'error'});
        });
    };

    searchColor = color => {
    	this.filterData['colorType'] = color;
    	this.getPage(1)
    }
    searchFollow = follow => {
    	this.filterData['followMark'] = follow;
    	this.getPage(1)
    }
	handleResize(e,height){
		 this.filterHeight = height || this.filterHeight || 50;
		 let sch = document.body.offsetHeight - this.filterHeight - 92;
         let scroll = sch - 90;
		 this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	//请求列表  list
	getPage(currentPage,order){
        this.columnSort = order = order || this.columnSort;
		let that = this;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm(),order);
		apiGet(API_FOODING_DS,'/material/getPage',object,
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
		apiForm(API_FOODING_DS,'/material/delete',{id: ID},
			(response)=>{
				ServiceTips({text:response.message,type:'sucess'});
				that.getPage();
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}
	componentDidMount(){
		this.handleResize()
		window.addEventListener('resize', this.handleResize);
		this.getPage();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	render(){
		let that = this;
		let {page,currentPage} =this.state;
		return(<div >
				<FilterHeader  getPage ={this.getPage} expandFilter= {this.handleResize}  normalRef={no => this.normalRef = no} />
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} partyClick={this.partyClick} deleteClick={this.deleteClick} priceClick={this.priceClick} copyClick={this.copyClick} allotClick={this.allotClick} />
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
						colorFilterConfig={{show : true, dataIndex:'colorType', onSelect: this.savePrefers,onHeaderSelect:this.searchColor}}
						followConfig={{show:true,onClick: this.saveStats,onHeaderClick:this.searchFollow, dataIndex: 'followMark',}}
						scroll={{x:true,y:this.state.scroll}}
						onRowDoubleClick={this.onRowDoubleClick}
						onHeaderSortClick={this.getPage.bind(this, null)}
						contextMenuConfig={{
							enable:true,
							contextMenuId:'SIMPLE_TABLE_MENU',
							menuItems:[{
								permissions:'mtl.del',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{I18n.t(100437/*删除*/)}</div>,
								data:{action:I18n.t(100437/*删除*/),type:0}
							},{
								permissions:'mtl.offer',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-zdbj-icon3'}></i><span>{I18n.t(100398/*自动报价*/)}</span></div>,
								data:{action:I18n.t(100398/*自动报价*/),type:1}
							},{
								permissions:'mtl.Invalid',
								onClick:this.handleClick,
								condition: [{key: 'irowSts.id', value: [5, 10], exp: '==='}],
								content:<div><i className={'foddingicon fooding-sx-icon2'}></i><span>{I18n.t(100441/*失效*/)}</span></div>,
								data:{action:I18n.t(100441/*失效*/),type:2}
							},{
								permissions:'mtl.activation',
								onClick:this.handleClick,
								 condition: [{key: 'irowSts.id', value: [5, 20], exp: '==='}],
								content:<div><i className={'foddingicon fooding-jh-icon2'}></i><span>{I18n.t(100442/*激活*/)}</span></div>,
								data:{action:I18n.t(100442/*激活*/),type:3}
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
