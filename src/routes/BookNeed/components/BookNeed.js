import i18n from './../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FunctionKeys from "./FuncKeys";
import FilterHeader from "./FilterHeader";
import BookNeedPlug from './BookNeedPlug';
// ajax
import {hrefFunc,permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import xt from "../../../common/xt";
class BookNeed extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.spearteClick=this.spearteClick.bind(this);
		this.separteClick=this.separteClick.bind(this);
		this.placeClick=this.placeClick.bind(this);
		this.assignClick=this.assignClick.bind(this);
		this.anmoutClick=this.anmoutClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.handleClick=this.handleClick.bind(this);
        this.searchField = xt.getQuerySearch();
		// init func 
		this.getPage = this.getPage.bind(this);
		this.getOne = this.getOne.bind(this);
		var that = this;
		this.columns = [{
			title : i18n.t(400008/*销售单号*/),
			dataIndex : 'sourceNo',
			key : "sourceNo",
			width : '8%',
			sort:'sourceNo',
			render(data,row,index){
				if(row && row.saleAdjustOrderNo){
					return (<div onClick={that.numDetailHandle.bind(this,data)} className="text-ellipsis mail-hover"  style={{color:'red'}}>{data}</div>);
				}
				return (<div onClick={that.numDetailHandle.bind(this,data)} className="text-ellipsis"><a href="javaScript:;" className={'mail-hover'}>{data}</a></div>);
			}
		},{
			title : i18n.t(400011/*销售员*/),
			dataIndex : "saleStaff"+language,
			key : "saleStaff"+language,
			width : "4%",
			sort:"saleStaffId",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100297/*起运港*/),
			dataIndex : "sStatn"+language,
			key : "sStatn"+language,
			width : "8%",
			sort:"sStatnId",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100298/*目的港*/),
			dataIndex : "eStatn"+language,
			key : "eStatn"+language,
			width : "6%",
			sort:"eStatnId",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100376/*交易条款*/),
			dataIndex : "incotm"+language,
			key : "incotm"+language,
			width : "5%",
			sort:"incotmId",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100133/*支付条款*/),
			dataIndex : "payTrm"+language,
			key : "payTrm"+language,
			width : "10%",
			sort:"payTrmId",
			render(data,row,index){
				return <div className={'text-ellipsis'} title={data} style={{width:'95%'}}>{data}</div>
			}
		},{
			title : i18n.t(100224/*运输方式*/),
			dataIndex : "trans"+language,
			key : "trans"+language,
			width : "5%",
			sort:"transId",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200312/*物流员*/),
			dataIndex : "lsStaff"+language,
			key : "lsStaff"+language,
			width : "4%",
			sort:"lsStaffId",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100379/*产品*/),
			dataIndex : "mtl"+language,
			key : "mtl"+language,
			width : "8%",
			sort:"mtlId",
			render(data,row,index){
				return data;
			}
		// },{
		// 	title : "产品规格",
		// 	dataIndex : "basSpeci",
		// 	key : "basSpeci",
		// 	width : "8%",
		// 	render(data,row,index){
		// 		return <div>{data}</div>
		// 	}
		},{
			title : i18n.t(500065/*需求数量*/),
			dataIndex : "sOrderQty",
			key : "sOrderQty",
			width : "8%",
			sort:"sOrderQty",
			className:"text-right",
			render(data,row,index){
				if(data){
					return <div>{data}&nbsp;&nbsp;{row.uomEnName}</div>;
				}
			}
		},{
			title : i18n.t(200313/*体积*/),
			dataIndex : "vol",
			key : "vol",
			width : "7%",
			sort:"vol",
			className:"text-right",
			render(data,row,index){
				if(data){
					return (<div>{data}&nbsp;&nbsp;{row.vUomEnName}</div>);
				}
			}
		},{
			title : i18n.t(200314/*毛重*/),
			dataIndex : "grosWt",
			key : "grosWt",
			width : "8%",
			sort:"grosWt",
			className:"text-right",
			render(data,row,index){
				if(data){
					return (<div>{data}&nbsp;&nbsp;{row.wUomEnName}</div>)
				}
			}
			
		},{
			title : i18n.t(200315/*件数*/),
			dataIndex : "packQty",
			key : "packQty",
			width : "6%",
			sort:"packQty",
			className:"text-center",
			render(data,row,index){
				return (<div>{data}</div>);
			}
		},{
			title : i18n.t(500089/*要求装运日*/),
			dataIndex : "ariveDate",
			key : "ariveDate",
			width : "7%",
			sort:"ariveDate",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
        },{
            title : i18n.t(500423/*创建日期*/),
            dataIndex : "createDate",
            key : "createDate",
            width : "7%",
            sort:"createDate",
            render(data,row,index){
                return new Date(data).Format('yyyy-MM-dd');
            }
		},{
			title : i18n.t(600164/*出运信息*/),
			dataIndex : "sourceId",
			key : "sourceId",
			width : "5%",
			sort:"sourceId",
			render(data,row,index){
				return <div onClick={hrefFunc.bind(that,i18n.t(600164/*出运信息*/),`/print/single?single=messageFlow&billId=${row['sourceId']}`)} style={{textAlign:'center'}} className={'text-ellipsis'} title={i18n.t(600164/*出运信息*/)}><i className="foddingicon fooding-transport-message"></i></div>
			}
		}];


		this.state = {
			scrollHeight:0,
			filter:null,
			checkedRows:[],
			choised:false,
			checkedData:'',
			data : [],

			initData: [], // 初始化 数据
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条
			billId: '',	
			ccId: '',
			sData:{},
			showDilaog:false,
			sourceNo:this.props.location.query.sourceNo

		}

	}
	//合单操作
	spearteClick = () => {
		let that = this;
		let numArr = that.refs.product.getSelectArr();
		if(numArr.length < 2){
			ServiceTips({text:i18n.t(400015/*请选择至少两条及以上数据！*/),type:'error'})
			return false;
		}
		Confirm(i18n.t(400016/*您确定要执行合单操作？*/),{
			done:() =>{
				apiForm(API_FOODING_ERP,'/shipping/compound',{billIds:numArr.map(e => e.billId)},response => {
						ServiceTips({text:response.message,type:"success"});
						that.getPage();
					},error => ServiceTips({text:error.message,type:"error"}))
			},
			close:() =>{

			}
		})	
	}
	//拆单
	separteClick = () => {
		let numArr = this.refs.product.getSelectArr();
		//拆单数量,billId;
		let separteCount = Number(numArr[0] && numArr[0].baseQty) || 0;
		if(numArr.length  !== 1){
			ServiceTips({text:i18n.t(500115/*请选中一条数据？*/),type:"error"});
			return false;
		}else if(separteCount <= 0){
			ServiceTips({text:i18n.t(400017/*数据不大于零，不能进行拆单操作*/),type:"error"});
			return false;
		}
		let content =require('./BoodNeedSplitDialog').default;
		let element=React.createElement(content,{onSaveAndClose:this.separteSaveAndClose,onCancel:this.onCancel,numArr:numArr,separteCount:separteCount});
    	this.setState({
    		showDilaog : true,
    		title:i18n.t(200316/*订舱需求拆单*/),
    		dialogContent : element
    	})		
	}
	//拆单的保存并关闭
	separteSaveAndClose = () => {
		this.setState({
			showDilaog:!this.state.showDilaog
		},() => this.getPage())
	}
	//下单
	placeClick = () => {
		let that = this;
		//未完成
		let numArr = that.refs.product.getSelectArr();
		if(!numArr.length){
			ServiceTips({text:i18n.t(500115/*请选中一条数据？*/),type:"error"});
		}else{
			Confirm(i18n.t(100460/*确认*/)+i18n.t(100457/*下单*/),{
				done:() => {
					let {navReplaceTab, PurOrder, navRemoveTab,navAddTab} = that.props;
					apiForm(API_FOODING_ERP,"/shipping/booking",{billIds:numArr.map(e => e.billId)},response => {
						ServiceTips({text:response.message,type:"success"})
					   that.getPage();
						navAddTab({name:i18n.t(200317/*编辑物流订单*/),component:i18n.t(200317/*编辑物流订单*/),url:'/Booking/edit'});
	        			that.props.router.push({pathname:'/Booking/edit',query:{id:response.data}})
					},error => ServiceTips({text:error.message,type:"error"}))
				},
				close:() => {

				}
			})
		}     
	}
	//指派物流员
	assignClick(){
		let that = this;
		let select = this.refs.product.getSelectArr();
		// 判断 情况
		if( select.length == 0 ){
			ServiceTips({text:i18n.t(500115/*请选中一条数据？*/),type:'error'});
		} else if( select.length > 1 ){
			ServiceTips({text:i18n.t(500115/*请选中一条数据？*/),type:'error'});
		} else{
			this.setState({
				billId: select[0].billId
			},function(){
				that.getOne(function(){
					let content =require('./Personnel').default;
					let element=React.createElement(content,{onSaveAndClose:that.onSaveAndClose,onCancel:that.onCancel,getPage:that.getPage,getOne:that.state.checkedData}); 
					that.setState({
						showDilaog:true,
						title:i18n.t(100458/*指派物流员*/),
						dialogContent:element
					})				
				});
			});
		}		
	}

	// 数量调整
	anmoutClick(){
		let that = this;
		let select = this.refs.product.getSelectArr();

		// 判断 情况
		if( select.length !== 1 ){
			ServiceTips({text:i18n.t(500115/*请选中一条数据？*/),type:'error'});
		} else{
			this.setState({
				billId: select[0].billId
			},function(){
				that.getNumber(function(){
					let content =require('./Adjust').default;
					let element=React.createElement(content,{onSaveAndClose:that.onAnmoutSaveClose,onCancel:that.onCancel,getOne:that.state.checkedData,billId:that.state.billId}); 
					that.setState({
						showDilaog:true,
						title:i18n.t(100459/*数量调整*/),
						dialogContent:element
					})				
				});
			});
		}
	}
	//数量调整，保存和关闭
	onAnmoutSaveClose = billId => {
		if(!billId) return;
		apiForm(API_FOODING_ERP,'/shipping/adjustNeed',{billId:billId,needId:this.state.billId},response =>　{
			this.setState({showDilaog:false},() => this.getPage())
		},error => ServiceTips({text:error.message,type:'error'}))
	}

	// 销售单号 查看详情 
	numDetailHandle = (num)=>{
		let that = this;
		this.setState({
			showDilaog: true,
			title: i18n.t(500260/*销售订单执行情况*/),
			dialogContent: React.createElement(require('./sourceNoDetail').default,{onCancel:that.onCancel,num:num})
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
	handleClick(e,data){
		
	}
	handleResize(height){
		let sch=document.body.offsetHeight-72-height;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(47));
		this.getPage();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	// 调整数量 数据 
	getNumber(callBack){

		let that = this;
		apiGet(API_FOODING_ERP,'/shipping/getAdjust',{billId: that.state.billId},
			(response)=>{	
				that.setState({	
					checkedData: response.data,
				},function(){
					callBack && callBack();
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});	
	}	

	// 新增 数据
	getOne(callBack){

		let that = this;
		apiGet(API_FOODING_ERP,'/shipping/getOne',{billId: that.state.billId},
			(response)=>{	
				that.setState({	
					checkedData: response.data,
				},function(){
					callBack && callBack();
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});	
	}

	// 页面 刷新
	getPage(currentPage,order){
		let that = this;
		this.columnSort = order = order || this.columnSort;
		var sID = sID || '';
		let currentP = currentPage||1;
		let manager = permissionsBtn("shippingneed.distribution") ? {isManager:1} : {};  // 有指派员权限时
		let params= Object.assign({},manager,{pageSize: this.state.pageSize, currentPage: currentP,orderType:10,sourceNo:that.state.sourceNo},that.normalRef.getForm(),order,that.searchField)
		apiGet(API_FOODING_ERP,'/shipping/getPage',params,
				(response)=>{				
					that.setState({	
						data: response.data.data || [],
						totalPages: response.data.totalPages,
						totalRecords:response.data.totalRecords,
						currentPage: response.data.currentPage 	
					});
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
			});	
		
	}
    searchCustomer = ()=> {
        this.searchField = null;
        this.getPage();

    };

	render(){
		let that = this;
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader getPage={this.searchCustomer} normalRef={no => this.normalRef = no} expandFilter= {this.handleResize}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys 
							spearteClick={this.spearteClick} 
							separteClick={this.separteClick} 
							placeClick={this.placeClick} 
							assignClick={this.assignClick} 
							anmoutClick={this.anmoutClick}
						/>
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
						scroll={{x:true,y:this.state.scroll}}
						onHeaderSortClick={this.getPage.bind(this, null)}
					/>
					<Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
						{this.state.dialogContent}
					</Dialog>
				</div>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(BookNeed);

