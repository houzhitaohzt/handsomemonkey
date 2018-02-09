import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";

import {createForm,FormWrapper} from "../../../../components/Form";
import {I18n} from '../../../../lib/i18n';


// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { Option,ConstVirtualSelect } from '../../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../../services/apiCall';



class ClientcontactFilterHeader extends Component{

	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);

		// even func
		this.handleTransportationCompany = this.handleTransportationCompany.bind(this);

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

			transportationCompany: [{id:1,name:''}], // 货代公司
								
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


	// 货运公司
	handleTransportationCompany(e){
		apiPost(API_FOODING_DS,'/enterprise/search',{keyword: e},
			(response)=>{							
				this.setState({	transportationCompany:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	// 查找
	searchFunc(){
		let that = this;		
		const {form} = this.props;
		let sID = form.getFieldsValue();

		this.props.getPage(Object.assign({},sID));	// 刷新 列表
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
						<label>{i18n.t(500129/*源单编号*/)}</label>
						<input  type='text' 
							{...getFieldProps('sourceNo',{
								initialValue: ''
							})}
							placeholder=''
							style={{width:200}}
							className ={'text-input'}
								onKeyDown={(e)=>{
                                    if(e.keyCode == 13){this.searchFunc()}
                                }}
						/>						
					</div>					
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400048/*单据编号*/)}</label>
						<input  type='text' 
							{...getFieldProps('no',{
								initialValue: ''
							})}
							placeholder=''
							style={{width:200}}
							className ={'text-input'}
								onKeyDown={(e)=>{
                                    if(e.keyCode == 13){this.searchFunc()}
                                }}
						/>						
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(500146/*源单类型*/)}</label>
						<Select
							{...getNFieldProps('sourceType',{
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
							<Option key={0} value={'323'} title={i18n.t(100332/*市场活动*/)}>{i18n.t(100332/*市场活动*/)}</Option>
							<Option key={0} value={'301'} title={i18n.t(100321/*商机*/)}>{i18n.t(100321/*商机*/)}</Option>
							<Option key={0} value={'318'} title={i18n.t(200400/*销售单*/)}>{i18n.t(200400/*销售单*/)}</Option>
							<Option key={0} value={'338'} title={i18n.t(200401/*采购单*/)}>{i18n.t(200401/*采购单*/)}</Option>
							<Option key={0} value={'350'} title={i18n.t(200373/*物流订单*/)}>{i18n.t(200373/*物流订单*/)}</Option>
						
						</Select>						
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400084/*收款单位*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							fieldName='receiptBeId'
							apiType={apiPost}
							apiUri='/enterprise/search'
							async={true}
							apiParams='keyword'
							clearable
						/>						
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
