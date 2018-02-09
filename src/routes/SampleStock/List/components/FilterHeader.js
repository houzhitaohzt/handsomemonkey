import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";

//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../../components/Select';
import {createForm,FormWrapper} from "../../../../components/Form";
import {I18n} from '../../../../lib/i18n';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,language,pageSize,sizeList} from '../../../../services/apiCall';

import ProductSelect from '../../../../components/FindGridSelect';
import xt from "../../../../common/xt";

class PruchaseNeedFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		props.normalRef && props.normalRef(this);
		this.getForm = this.getForm.bind(this);
		this.clear = this.clear.bind(this);
		this.search = this.search.bind(this);
	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',
			companyArr:[],//企业
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
		},()=>this.props.expandFilter(null, this.refs.header.offsetHeight == 0?1:this.refs.header.offsetHeight))
	}
	search(){
		this.props.getPages();
	}
	getForm(){
		let obj ={};
		obj = Object.assign({},this.props.form.getFieldsValue())
		return obj;
	}
	clear(){
		if(this.props.form.getFieldsValue().mtlId){
			this.refs.productSelect.clear(this.props.getPages);
			this.props.form.resetFields();
		}else {
			this.props.form.resetFields();
			this.props.getPages();
		}
	}

	search_more = ()=> {
		let classN,classMinor;
		if(this.state.expandClassName==='unfold'){
			classN ='fold';
			classMinor="filter-header-information-pre";//显示的全部条件输入框
		}else{
			classN="unfold";
			classMinor="filter-header-information-pre hidden";//隐藏条件输入框
		}
		this.setState({
            expandClassName: classN, minor: classMinor
        }, ()=>this.props.expandFilter(null, this.refs.header.offsetHeight));
	}

	render(){
		let domFilter;
		let {form} = this.props;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(600216/*样品单号*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder=""
							{...getNFieldProps('no',{
								initialValue:''
							})}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(500061/*产品名称*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder=""
							{...getNFieldProps('mtlLcName',{
								initialValue:''
							})}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(400011/*销售员*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder=""
							{...getNFieldProps('saleStaffLcName',{
								initialValue:''
							})}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
						/>
					</div>						
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100230/*状态*/)}</label>
						<Select
							{...getNFieldProps('specOptStatus',{
								initialValue: ''								
							})} 
							animation='slide-up'
							placeholder=''
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"							
						>
							<Option key={0} value={''} title={i18n.t(400051/*不限*/)}>{i18n.t(400051/*不限*/)}</Option>													
							<Option key={1} value={'0'} title={i18n.t(600218/*未操作*/)}>{i18n.t(600218/*未操作*/)}</Option>
							<Option key={2} value={'1'} title={i18n.t(600219/*已出库*/)}>{i18n.t(600219/*已出库*/)}</Option>
							<Option key={2} value={'2'} title={i18n.t(600220/*已采购*/)}>{i18n.t(600220/*已采购*/)}</Option>
						</Select>						
					</div>													
					<div className={'filter-header-key'}>
						<span className="search"><i className="foddingicon fooding-search_icon" onClick = {this.search}></i></span>
						<span className="clean"><i className="foddingicon fooding-clean_icon" onClick={this.clear}></i></span>
						<span className={this.state.expandClassName} onClick={this.search_more}><i className="foddingicon fooding-zk_icon"></i></span>
						
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
		return(<div className={'clientcontact-list-header'} ref="header">{domFilter}</div>)
	}
}
PruchaseNeedFilterHeader = createForm()(PruchaseNeedFilterHeader);
export default PruchaseNeedFilterHeader;



