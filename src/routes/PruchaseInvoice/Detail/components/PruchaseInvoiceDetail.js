import React, { Component,PropTypes } from 'react';
import Normal from "./Normal"; //常规
import Organization from "./Organization";//组织
import InvoicePro from "./InvoicePro";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

import {I18n} from '../../../../lib/i18n';

export class PruchaseReturnDetail extends Component{
	constructor(props){
		super(props)
		this.state=this.initState()
	}
	initState(){
		return{
			id:this.props.location.query.id,
			scrollHeight:0,
			invoiceList:[],
			valueone:{},
			dialogContent:<div></div>,
			showDilaog:false
		}
	}
	//初始化数据
	getTableInitData = (billId) => {
		if( !billId) return;
		//单据要求初始化
		apiGet(API_FOODING_ERP,'/invoice/dtl/getList',{billId:billId},response => {
			this.setState({invoiceList:response.data || []})
		},error => ServiceTips({text:error.message,type:'error'}))
		apiGet(API_FOODING_ERP,'/invoice/getOne',{billId:billId,content:445},response => {
			this.setState({valueone:response.data || {}})
		},error => ServiceTips({text:error.message,type:'error'}))
	}
	//提交
	submitClick = () => {
		let {valueone} = this.state;
		let billId = this.state.id;
		if(!valueone.billType) return;
		Confirm(I18n.t(400066/*您确定要提交此采购发票吗？*/), {
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
	//草稿状态时，删除
	onDeleteClick = () => {
		let {valueone = {}} = this.state;
		let billId = valueone.billId;
		if(!billId) return false;
		Confirm(I18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/),{
			done:() => {
				let ID = [];
				ID.push(billId);
				apiForm(API_FOODING_ERP,'/invoice/delete',{billId: ID},
					(response)=>{							
						ServiceTips({text:response.message,type:'sucess'});
						let {navAddTab, navRemoveTab} = this.props;
						navRemoveTab({name:I18n.t(400060/*采购发票*/) + I18n.t(100097/*详情*/),component:I18n.t(400060/*采购发票*/) + I18n.t(100097/*详情*/),url:'/purinvoice/detail'});
						navAddTab({ name: I18n.t(400060/*采购发票*/), component: I18n.t(400060/*采购发票*/), url: '/purinvoice/list'});
						this.props.router.push({pathname:'/purinvoice/list',state:{refresh: true}})
					},(error)=>{
						ServiceTips({text:error.message,type:'error'});
				});
			}
		})
		
	}
	onCancel = () => {
		this.setState({
			showDilaog:!this.state.showDilaog
		})
	}
	componentDidMount(){
		this.getTableInitData(this.props.location.query.id)
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        let padding = 80;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(20));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(20));
        if(this.props.location.query.id !== nextProps.location.query.id){
        	let billId = nextProps.location.query.id;
        	this.setState({id:billId},() =>this.getTableInitData(billId) )
        }
    }
	render(){
		return(<div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
			<Normal valueone={this.state.valueone} submitClick={this.submitClick} onApproveClick={this.onApproveClick} onDeleteClick={this.onDeleteClick} />
			<InvoicePro  valueone={this.state.valueone} invoiceList={this.state.invoiceList}/>
			<Organization valueone={this.state.valueone} />
			<Dialog width={926} visible={this.state.showDilaog} title={this.state.title} showHeader={this.state.showHeader}>
							{this.state.dialogContent}
			</Dialog>
		</div>)
	}
}
export default NavConnect(PruchaseReturnDetail);
