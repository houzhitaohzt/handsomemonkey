import i18n from './../../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../../components/Form";
//引入时间插件
import DataTime from '../../../../../components/Calendar/Calendar'
import {I18n} from '../../../../../lib/i18n';
import xt from '../../../../../common/xt';
import Select, { Option ,ConstMiniSelect ,ConstVirtualSelect} from '../../../../../components/Select/';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList,commonAjax} from '../../../../../services/apiCall';
class ForwarderFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search = this.search.bind(this);
		this.clean=this.clean.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
	}
	static defaultProps={
		expand:false,
		expandFilter(){},
		showFilter:'comb-panel',
		expandClassName:'unfold',
		minor:'filter-header-information-pre hidden'
	}
	search(){
		this.props.getPage();
	}
	getForm(){
		let obj ={};
		obj = Object.assign({},this.props.form.getFieldsValue())
		return obj;
	}
	clean(){
		this.props.form.resetFields()
		this.props.getPage();
	}
	onClick(){

	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden'
		}
	}
	show_hide_filter(){
		let classN;
		if(this.state.showFilter==="comb-panel"){
			classN="comb-panel-floating";
		}else{
			classN="comb-panel";	
		}
		this.setState({
			showFilter:classN
		},()=>this.props.expandFilter(null, this.refs.header.offsetHeight==0?1:this.refs.header.offsetHeight))
	}
	render(){
		let domFilter;
		const { getFieldProps, getFieldError } = this.props.form;
		
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div>
					<span className="search">
						<input type="text" onKeyUp={(e)=>{
							if(e.keyCode == 13){
								this.search();
							}
						}} {...getFieldProps('countryName', {
							                                initialValue:''
						})} placeholder={i18n.t(500296/*请输入国家名称*/)}/>
						
					<i className="foddingicon fooding-search_icon" onClick={this.search}></i>
					</span>
				</div>
			)
		}
		return(<div className={'clientcontact-list-header'}  ref="header">{domFilter}</div>)
	}
}
ForwarderFilterHeader = createForm()(ForwarderFilterHeader);
export default ForwarderFilterHeader;
