import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
//引入select插件
import Select, { Option } from '../../../../components/Select'; // 下拉
import {createForm,FormWrapper} from "../../../../components/Form";
import {I18n} from '../../../../lib/i18n';
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax} from '../../../../services/apiCall';
class ClientcontactFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
		this.search = this.search.bind(this);
		this.clean=this.clean.bind(this);
		this.handleWarehouse = this.handleWarehouse.bind(this);	 // 仓库 click
		this.handleAdjustType = this.handleAdjustType.bind(this);	 // 类型 click
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
		minor:'filter-header-information-pre hidden',
		
	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',
			warehouse:[] // 仓库
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
	// 仓库 click
	handleWarehouse(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.warehouse,
			(response)=>{							
				this.setState({	warehouse: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}
	// 类型 click
	handleAdjustType(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.AdjustType,
			(response)=>{							
				this.setState({	AdjustType: response.data });
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
		const {getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre form-group col-md-3 col-lg-3'}>
						<label>{i18n.t(400048/*单据编号*/)}</label>
						<input 
											    type="text"
											    style={{width:200}}
												{...getFieldProps('no',{
												validateFirst: true,
												rules: [{required:true}],
												initialValue:''})}
												className={'text-input-nowidth'}
												onKeyDown={(e)=>{
                                                    if(e.keyCode == 13){this.search()}
                                                }}
							/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(200080/*类型*/)}</label>
						<Select
							{...getNFieldProps('type',{
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
							<Option key={1} value={'1'} title={i18n.t(201259/*增加*/)}>{i18n.t(201259/*增加*/)}</Option>
							<Option key={2} value={'2'} title={i18n.t(201260/*减少*/)}>{i18n.t(201260/*减少*/)}</Option>
						</Select>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400025/*仓库*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							placeholder=""														
							{...getNFieldProps('slId',{
								initialValue: ''
							})}
							onClick={this.handleWarehouse}
							>
							{this.state.warehouse.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400145/*职员*/)}</label>
						<input 
											    type="text"
											    style={{width:200}}
												{...getFieldProps('staffLcName',{
												validateFirst: true,
												rules: [{required:true}],
												initialValue:''})}
												className={'text-input-nowidth'}
												onKeyDown={(e)=>{
                                                    if(e.keyCode == 13){this.search()}
                                                }}
							/>
					</div>
					<div className={'filter-header-key'}>
						<span className="search"><i className="foddingicon fooding-search_icon" onClick={this.search}></i></span>
						<span className="clean"><i className="foddingicon fooding-clean_icon" onClick={this.clean}></i></span>
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
