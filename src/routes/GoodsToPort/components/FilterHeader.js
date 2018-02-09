import React,{Component, PropTypes} from "react";

import {createForm,FormWrapper} from "../../../components/Form";
import {I18n} from '../../../lib/i18n';


// common 
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';




class ClientcontactFilterHeader extends Component{

	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
        props.normalRef && props.normalRef(this);
        this.getForm = this.getForm.bind(this);
		// even func
		this.searchFunc = this.searchFunc.bind(this);
		this.resetFunc = this.resetFunc.bind(this);
		

	}
	static propTypes={
		expand:PropTypes.bool,
		expandFilter:PropTypes.func,
		initData:PropTypes.object
	}
	static defaultProps={
		expand:false,
		expandFilter(){},
		showFilter:'comb-panel',
		expandClassName:'unfold',
		minor:'filter-header-information-pre hidden'
	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',


								
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
		})
	}

    getForm(){
        let obj ={};
        obj = Object.assign({},this.props.form.getFieldsValue())
        return obj;
    }

	// 查找
	searchFunc(){
        this.props.getPage();
	}

	// 清空 
	resetFunc(){
		this.props.form.resetFields(); // 清除表单
		this.props.getPage({});	// 刷新 列表
	}


	render(){
		let domFilter;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(400008/*销售单号*/)}</label>
						<input type="text" 
							{...getFieldProps('sourceNo', {
								initialValue: ''
							})} 
							placeholder={''}
							className="text-input" 
							style={{width:200,marginRight:15}}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.searchFunc()}
                               }}
						/>												
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(600029/*执行状态*/)}</label>
						<Select
							{...getNFieldProps('statusDtl',{
								initialValue: undefined
							})} 
							animation='slide-up'
							placeholder=''
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"							
						>
							<Option key={1} value={'10'} title={I18n.t(600188/*未完成*/)}>{I18n.t(600188/*未完成*/)}</Option>
							<Option key={2} value={'20'} title={I18n.t(201034/*完成*/)}>{I18n.t(201034/*完成*/)}</Option>
						</Select>						
					</div>						
					<div className={'filter-header-key'}>
						<span onClick={this.searchFunc} className="search"><i className="foddingicon fooding-search_icon"></i></span>
						<span onClick={this.resetFunc} className="clean"><i className="foddingicon fooding-clean_icon"></i></span>
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
		return(<div className={'clientcontact-list-header'}>{domFilter}</div>)
	}
}


ClientcontactFilterHeader = createForm()(ClientcontactFilterHeader);
export default ClientcontactFilterHeader;
