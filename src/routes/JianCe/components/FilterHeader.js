import i18n from './../../../lib/i18n';
import React,{Component, PropTypes} from "react";
//引入select插件
import xt from '../../../common/xt';
import {createForm,FormWrapper} from "../../../components/Form";
import Select, {Option,ConstMiniSelect} from '../../../components/Select';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP} from '../../../services/apiCall';
class ProductFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		props.normalRef && props.normalRef(this);
		this.getForm = this.getForm.bind(this);
		this.clear = this.clear.bind(this);
	}
	getForm(){
		return this.props.form.getFieldsValue();
	}
	clear(){
		this.props.form.resetFields();
		this.props.getPage();
	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',
			clientArray:[],
		}
	}
	show_hide_filter(){
		let classN;
		if(this.state.showFilter==="comb-panel"){
			classN="comb-panel-floating";
		}else{
			this.props.getPage();
			classN="comb-panel";
		}
		this.setState({
			showFilter:classN
		},()=>this.props.expandFilter(null, this.refs.header.offsetHeight==0?1:this.refs.header.offsetHeight))
	}
	render(){
		let domFilter;
		let {getNFieldProps,getFieldValue,getFieldProps}= this.props.form;
		let beField = getNFieldProps('salBeId',{
										initialValue:undefined
									 });
		let beFieldValue = getFieldValue("salBeId") || {};
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400008/*销售单号*/)}</label>
						<input placeholder=''
								   type="text" {...getFieldProps('saleNo', {
						                initialValue:''
						            })} 
								className={'text-input-filter-header'}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.props.getPage()}
                               }}
							 />
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(200311/*订舱单号*/)}</label>
						<input type="text"
								{...getFieldProps('shippingOrderNo', {
						                initialValue:''
						            })} 
						 className={'text-input-filter-header'} placeholder=""
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.props.getPage()}
                               }}
						/>
					</div>
					<div className={'filter-header-key'}>
						<span className="search"><i className="foddingicon fooding-search_icon" onClick = {this.props.getPage}></i></span>
						<span className="clean"><i className="foddingicon fooding-clean_icon" onClick={this.clear}></i></span>
					</div>
					<div className={this.state.showFilter}>
						<span className="screen" onClick={this.show_hide_filter
						}><i className="foddingicon fooding-screen_icon"></i></span>
					</div>
				</div>)
		}else{
			domFilter=(<div className={this.state.showFilter}>
					<span className="screen" onClick={this.show_hide_filter
					}><i className="foddingicon fooding-screen_icon"></i></span>
				</div>)
		}
		return(<div className={'product-list-header'} ref='header'>{domFilter}</div>)
	}
}
export default createForm()(ProductFilterHeader);
