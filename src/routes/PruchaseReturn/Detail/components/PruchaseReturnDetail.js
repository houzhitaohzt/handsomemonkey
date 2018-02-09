import React, { Component,PropTypes } from 'react';
import Normal from "./Normal"; //常规
import Organization from "./Organization";//组织
import ReturnPro from "./ReturnPro";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

import { I18n } from '../../../../lib/i18n';

export class PruchaseReturnDetail extends Component{    
	constructor(props){
		super(props)
		this.state=this.initState()
	}
	initState(){
		return{
			id:this.props.location.query.id,
			scrollHeight:0,
			retrunList:[],
			valueone:{},
			dialogContent:<div></div>,
			showDilaog:false
		}
	}
	//初始化数据
	getTableInitData = (billId) => {
		if( !billId) return;
		//单据要求初始化
		apiGet(API_FOODING_ERP,'/purorderreturn/mtl/getList',{billId:billId},response => {
			this.setState({retrunList:response.data || []})
		},error => ServiceTips({text:error.message,type:'error'}))
		apiGet(API_FOODING_ERP,'/purorderreturn/getOne',{billId:billId},response => {
			this.setState({valueone:response.data || {}})
		},error => ServiceTips({text:error.message,type:'error'}))
	}
	//红十字付款单
	paymentClick = () => {
		let billId = this.state.id;
		if(!billId) return;
		apiForm(API_FOODING_ERP,'/purorderreturn/pay',{billId:billId},response => {
			ServiceTips({text:response.message,type:'success'});
			//刷新当前页面
			this.getTableInitData(billId);
		},error => ServiceTips({text:error.message,type:'error'}))
	}
	//出库通知
	outputClick = () => {
		let billId = this.state.id;
		if(!billId) return;
		apiForm(API_FOODING_ERP,'/purorderreturn/noticeOut',{billId:billId},response => {
			ServiceTips({text:response.message,type:'success'});
			let {navAddTab, navRemoveTab} = this.props;
			 navRemoveTab({name:I18n.t(400042/*出库通知单*/) + I18n.t(100097/*详情*/),component:I18n.t(400042/*出库通知单*/) + I18n.t(100097/*详情*/),url:'/stockout/detail'});
		     navAddTab({ name: I18n.t(400042/*出库通知单*/) + I18n.t(100097/*详情*/), component: I18n.t(400042/*出库通知单*/) + I18n.t(100097/*详情*/), url: '/stockout/detail'});
	    	this.props.router.push({pathname:'/stockout/detail',query:{id:response.data},state:{refresh: true}})
		},error => ServiceTips({text:error.message,type:'error'}))
	}
	//提交
	submitClick = () => {
		let {valueone} = this.state;
		let billId = this.state.id;
		if(!valueone.billType) return;
		Confirm(I18n.t(400126/*您确定要提交此退货订单吗*/), {
		  done: () => {
			    apiForm(API_FOODING_ERP,"/common/submitBill",{billId:billId,billType:valueone.billType},response => {
			    	//刷新当前页面
			    	this.getTableInitData(billId);
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
	//草稿状态时，可以删除
	onDeleteClick = () => {
		let that = this;
		let {valueone = {}} = this.state;
		let billId = valueone.billId;
		if(!billId) return false;
		Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
		  done: () => {
			  let arr = [];
			  arr.push(billId);
			  apiForm(API_FOODING_ERP,'/purorderreturn/delete',{billId: arr},
					(response)=>{				
						ServiceTips({text:response.message,type:'sucess'});
						let {navAddTab, navRemoveTab} = this.props;
						navRemoveTab({name:I18n.t(400094/*采购退货*/) + I18n.t(100097/*详情*/),component:I18n.t(400094/*采购退货*/) + I18n.t(100097/*详情*/),url:'/purorderreturn/detail'});
						navRemoveTab({name:I18n.t(400094/*采购退货*/),component:I18n.t(400094/*采购退货*/),url:'/purorderreturn/list'});
						navAddTab({ name: I18n.t(400094/*采购退货*/), component: I18n.t(400094/*采购退货*/), url: '/purorderreturn/list'});
						this.props.router.push({pathname:'/purorderreturn/list',state:{refresh: true}})
					},(error)=>{
						ServiceTips({text:error.message,type:'error'});
				});
			},
			close:() => {
				console.log('no, close')
			}
		});
		
	}
	//查看审批
	onApproveClick = () => {
		let {valueone = {}} = this.state;
		let billId = valueone.billId,billType = valueone.billType;
		let content = require('../../../PruchaseOrder/Detail/Content/components/ApprovalDialog').default;
        let element = React.createElement(content, {onCancel: this.onCancel,billType:billType,billId:billId});
        this.setState({
            showDilaog: true,
            title: I18n.t(100470/*查看审批*/),
            dialogContent: element,
            showHeader:false
        })
	}
	onCancel = () => {
		this.setState({
			showDilaog:!this.state.showDilaog
		})
	}
	componentDidMount(){
	    this.handleResize();
		this.getTableInitData(this.props.location.query.id)
        window.addEventListener('resize', this.handleResize);
    }
    handleResize(height){
        let padding = 233;
        let sch=document.body.offsetHeight-20-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    componentWillReceiveProps(nextProps){
        if(this.props.location.query.id !== nextProps.location.query.id){
        	let billId = nextProps.location.query.id;
        	this.setState({id:billId},() =>this.getTableInitData(billId) )
        }
    }
	render(){
		let purorderData = this.props.PurOrder;
		return(<div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
			<Normal valueone={this.state.valueone} paymentClick={this.paymentClick} outputClick={this.outputClick} submitClick={this.submitClick} onApproveClick={this.onApproveClick} onDeleteClick={this.onDeleteClick}/>
			<ReturnPro  valueone={this.state.valueone} retrunList={this.state.retrunList}/>
			<Organization valueone={this.state.valueone} />
			<Dialog width={926} visible={this.state.showDilaog} title={this.state.title} showHeader={this.state.showHeader}>
							{this.state.dialogContent}
			</Dialog>
		</div>)
	}
}
export default NavConnect(PruchaseReturnDetail);
