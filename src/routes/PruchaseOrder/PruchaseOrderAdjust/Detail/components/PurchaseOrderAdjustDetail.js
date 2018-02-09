import React, { Component,PropTypes } from 'react';
import {createForm, FormWrapper} from "../../../../../components/Form";
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import Confirm from '../../../../../components/Dialog/Confirm';//删除弹层
import Dialog from '../../../../../components/Dialog/Dialog';

import NormalDetail from "./NormalDetail";
import OrderProDetail from "./OrderProDetail";
import OrganizationDetail from "./OrganizationDetail";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES ,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
import { I18n } from '../../../../../lib/i18n';
class PruchaseOAdjustDetail extends Component{
	constructor(props){
		super(props)
		this.state = {
			scrollHeight:0,
			scroll:0,
			billId:this.props.location.query.id?this.props.location.query.id:'',
			valueone:{},
			showDilaog:false,
			title:'',
			dialogContent:<div></div>
		}
	}
	editClick = () => {
		let { navReplaceTab } = this.props;
		navReplaceTab({name:I18n.t(400092/*采购调整*/),component:I18n.t(400092/*采购调整*/),url:'/pruchaseorderadjust/edit'});
		this.props.router.push({pathname:'/pruchaseorderadjust/edit',query:{id:this.state.billId}, state: {refresh: true}});
		//编辑
	}
	deleteClick = () => {
		//删除
		let { navReplaceTab, navRemoveTab } = this.props;
		Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			done:() => {
				apiForm(API_FOODING_ERP,'/puradjust/delete',{billId:this.state.billId},response => {
					navRemoveTab({name:I18n.t(400092/*采购调整*/) + I18n.t(100097/*详情*/),component:I18n.t(400092/*采购调整*/) + I18n.t(100097/*详情*/),url:'/pruchaseorderadjust/detail'});
					navRemoveTab({name:I18n.t(400092/*采购调整*/) + I18n.t(100097/*详情*/),component:I18n.t(400092/*采购调整*/) + I18n.t(100097/*详情*/),url:'/pruchaseorder/detail'});
					this.props.router.push({pathname:'/pruchaseorder/detail',query:{id:this.state.valueone.purId}, state: {refresh: true}});
				 },error => ServiceTips({text:error.message,type:'error'}))
			}
		})
	}
	submitClick = () => {
		//提交
		Confirm(I18n.t(400121/*您确定执行提交？*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/common/submitBill",{billId:this.state.billId,billType:this.state.valueone.billType},response => {
				    	ServiceTips({text:response.message,type:"success"})
				    	this.initObj(this.state.billId);
				    },error => {
				    	ServiceTips({text:error.message,type:'error'})
				    })
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
		let content = require('../../../Detail/Content/components/ApprovalDialog').default;
		let element = React.createElement(content, {onCancel: this.onCancel,billType:billType,billId:billId});
		this.setState({
			showDilaog: true,
			title: I18n.t(100470/*查看审批*/),
			dialogContent: element,
			showHeader:false
		})
	}
	//调整
	adjustClick = () => {
		//调整单
		let purId = this.state.valueone.purId;
		if(!purId) return;
		let content=require('./AdjustDialog').default;
		let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,purId:purId,router:this.props.router});
    	this.setState({
    		showDilaog : true,
    		title: I18n.t(100469/*订单调整*/),
    		dialogContent: element
    	})
	}
	//调整单的关闭并保存
	onSaveAndClose = () => {
		apiForm(API_FOODING_ERP,"/purorder/adjustOrder",{adjustId:this.state.billId},response => {
			ServiceTips({text:response.message,type:'success'});
			this.setState({showDilaog:false});
		},error => ServiceTips({text:error.message,type:'error'}))
	}
	onCancel = () => {
		this.setState({showDilaog:false});
	}
	//进行初始化数据
	initObj = billId => {
		if(!billId) return false;
		apiGet(API_FOODING_ERP,'/puradjust/getOne',{billId:billId,isView:true},response => {
			let valueone = response.data;
			this.setState({valueone});
		},error => ServiceTips({text:error.message,type:'error'}))
	}
	handleResize = height => {
  		let padding = 80;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
		this.initObj(this.state.billId);
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
		if(this.props.location.query.id && this.props.location.query.id !== nextProps.location.query.id){
			this.setState({billId:nextProps.location.query.id},() => this.initObj(nextProps.location.query.id))
		}
  	}
	render(){
		return(<div  style={{height:this.state.scrollHeight}} className='scroll activity-detail'>
			<NormalDetail editClick = {this.editClick} deleteClick = {this.deleteClick} submitClick={this.submitClick} adjustClick={this.adjustClick} valueone={this.state.valueone} onApproveClick={this.onApproveClick}/>
			<OrderProDetail valueone={this.state.valueone} />
			<OrganizationDetail valueone={this.state.valueone} />
			<Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
				{this.state.dialogContent}
			</Dialog>
		</div>)
	}
} 
export default NavConnect(PruchaseOAdjustDetail);