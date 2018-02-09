import React, { Component,PropTypes } from 'react';
import {createForm, FormWrapper} from "../../../../../components/Form";
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';

import NormalEdit from "./NormalEdit";
import OrderProduct from "./OrderProduct";
import Organization from "./Organization";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES ,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
import { I18n } from '../../../../../lib/i18n';
class PruchaseOAdjust extends Component{
	constructor(props){
		super(props)
		this.state = {
			scrollHeight:0,
			scroll:0,
			billId:this.props.location.query.id?this.props.location.query.id:'',
			valueone:{}
		}
	}
	saveClick = () => {
		let that = this;
		const { form } = that.props;
  		const { getFieldProps, getFieldValue, getFieldError, getNFieldProps} = form;
  		form.validateFields((error,value) => {
  			if(error){

  			}else{
  				let valueone = Object.assign({},value,{billId:this.state.billId})
  				apiPost(API_FOODING_ERP,'/puradjust/save',valueone,response => {
  					let {navAddTab, navRemoveTab,navReplaceTab } = that.props;
  					navReplaceTab({name:I18n.t(400092/*采购调整*/) + I18n.t(100097/*详情*/),component:I18n.t(400092/*采购调整*/) + I18n.t(100097/*详情*/),url:'/pruchaseorderadjust/detail'});
		       		that.props.router.push({pathname:'/pruchaseorderadjust/detail',query:{id:that.state.billId},state: {refresh: true}})
				},error => ServiceTips({text:error.message,type:'error'}))
  			}
  		})
	}
	//进行初始化数据
	initObj = billId => {
		if(!billId) return false;
		apiGet(API_FOODING_ERP,'/puradjust/getOne',{billId:billId,isView:false},response => {
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
			<NormalEdit form = {this.props.form} saveClick={this.saveClick} valueone={this.state.valueone} billId={this.state.billId} />
			<OrderProduct form = {this.props.form} billId = {this.state.billId} valueone={this.state.valueone} />
			<Organization form = {this.props.form} valueone={this.state.valueone} />
		</div>)
	}
} 
export default NavConnect(createForm()(PruchaseOAdjust));