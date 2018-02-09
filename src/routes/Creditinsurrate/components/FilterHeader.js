import i18n from './../../../lib/i18n';
import React,{Component, PropTypes} from "react";
import {createForm,FormWrapper} from "../../../components/Form";
// common
import Select, { Option } from '../../../components/Select'; // 下拉
import ServiceTips from '../../../components/ServiceTips'; // 提示
import DataTime from '../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';
import {I18n} from "../../../lib/i18n";
class ClientcontactFilterHeader extends Component{
	constructor(props){
		super(props);
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);

		// even func  
		this.handleCorporationType = this.handleCorporationType.bind(this);
		this.handleRiskType = this.handleRiskType.bind(this);
		this.search = this.search.bind(this);
		this.clear = this.clear.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);			
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

			corporationCompany: [{id:1,localName:''}],
			corporationType: [{id:1,localName:''}],
			riskType: [{id:1,localName:''}],
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


	
	// 信保分类
	handleCorporationType(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.corporationType,
			(response)=>{							
				this.setState({	corporationType:response.data });
			},(errors)=>{
				ServiceTips({ text:errors.message,type:'error' });
		});		
	}

	// 风险分类
	handleRiskType(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.riskType,
			(response)=>{							
				this.setState({	riskType:response.data });
			},(errors)=>{
				ServiceTips({ text:errors.message,type:'error' });
		});		
	}


	getForm(){
		return this.props.form.getFieldsValue();
	}
	// 查找
	search(){
		this.props.getPage();
	}
	clear(){
		this.props.form.resetFields();
		this.props.getPage();
	}

	render(){
		let domFilter;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100189/*信保分类*/)}</label>
						<Select
							{...getNFieldProps('corpTyId',{
								initialValue:undefined								
							})} 
							animation='slide-up'
							placeholder=''
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							onClick={this.handleCorporationType}
						>
						{this.state.corporationType.map((o,i)=><Option key={i} objValue={{s_label:o.name, corpTyId: o.id}} title={o.name}>{o.name}</Option>)}
						</Select> 
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(200160/*风险分类*/)}</label>
						<Select
							{...getNFieldProps('riskTyId',{
								initialValue: undefined								
							})} 
							animation='slide-up'
							placeholder=''
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							onClick={this.handleRiskType}
						>
						{this.state.riskType.map((o,i)=><Option key={i} objValue={{s_label:o.name, riskTyId: o.id }} title={o.name}>{o.name}</Option>)}
						</Select>
					</div>
					<div className={'filter-header-information-pre'}>
						
						<label>{i18n.t(500229/*有效日期*/)}</label>
						<DataTime 
							width={200}  
							showTime = {false} 
							isShowIcon={true} 
							form={this.props.form}
							validate={false}
							name={'validityDate'}
						/>						
						
					
					</div>
					<div className={'filter-header-key'}>
						<span className="search" onClick={this.search}><i className="foddingicon fooding-search_icon"></i></span>
						<span className="clean"  onClick={this.clear}><i className="foddingicon fooding-clean_icon"></i></span>
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
