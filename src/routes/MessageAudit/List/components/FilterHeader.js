import i18n from '../../../../lib/i18n';

import React,{Component, PropTypes} from "react";
// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { Option,ConstMiniSelect } from '../../../../components/Select'; // 下拉
//引入select插件
import {createForm,FormWrapper} from "../../../../components/Form";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax} from '../../../../services/apiCall';
import {I18n} from '../../../../lib/i18n';
import xt from '../../../../common/xt'; // 下拉
class ProviderFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search_more=this.search_more.bind(this);
		this.getForm = this.getForm.bind(this);
		this.search = this.search.bind(this);
		this.clean=this.clean.bind(this);
		props.normalRef && props.normalRef(this);
		// init onClick
		this.handleAudit = this.handleAudit.bind(this);	 // 供应商
		this.handleType = this.handleType.bind(this);	 // 产品
			
			


	}

	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',
			type:  [{id:1,name:''}], // 类型
			audit:  [{id:1,name:''}], // 审核状态

		}
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

	search_more(){
		let classN,classMinor;
		if(this.state.expandClassName==='unfold'){
			classN ='fold';
			classMinor="filter-header-information-pre";//显示的全部条件输入框
		}else{
			classN="unfold";
			classMinor="filter-header-information-pre hidden";//隐藏条件输入框
		}
		this.setState({
			expandClassName:classN,minor:classMinor
		})
	}


	// 审核状态 click
	handleAudit(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.AuditState'},
			(response)=>{							
				this.setState({	audit: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}


	// 类型 click
	handleType(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.AuditType'},
			(response)=>{							
				this.setState({	type: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 查找
	search(){
		this.props.getPage();
	}
	getForm(){
		return this.props.form.getFieldsValue();
	}
	clean(){
		this.props.form.resetFields()
		this.props.getPage({no:''});
	}


	render(){
		let domFilter;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(200080/*类型*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							placeholder=""
							{...getNFieldProps('type',{
								initialValue: undefined
							})}
							onClick={this.handleType}
							>
							{this.state.type.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>
					</div>					
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(200771/*企业名称*/)}</label>
						<input 
							type="text"
							{...getFieldProps('name',{
								initialValue:''
							})}
							className={'text-input-nowidth'}
							onKeyDown={(e)=>{
                                if(e.keyCode == 13){this.search()}
                            }}
						/>
					</div>	
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(200772/*企业税号*/)}</label>
						<input 
							type="text"
							{...getFieldProps('enterpriseTaxId',{
								initialValue:''
							})}
							className={'text-input-nowidth'}
							onKeyDown={(e)=>{
                                if(e.keyCode == 13){this.search()}
                            }}
						/>
					</div>					
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(200776/*审核状态*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							placeholder=""
							{...getNFieldProps('auditState',{
								initialValue: undefined
							})}
							onClick={this.handleAudit}
							>
							{this.state.audit.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>
					</div>	
					<div className={'filter-header-key'}>
						<span className="search"><i className="foddingicon fooding-search_icon" onClick={this.search}></i></span>
						<span className="clean"><i className="foddingicon fooding-clean_icon" onClick={this.clean}></i></span>
						{/*<span className={this.state.expandClassName} onClick={this.search_more}><i className="foddingicon fooding-zk_icon"></i></span>*/}
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
		return(<div className={'product-list-header'}>{domFilter}</div>)
	}
}
ProviderFilterHeader = createForm()(ProviderFilterHeader);
export default ProviderFilterHeader;
