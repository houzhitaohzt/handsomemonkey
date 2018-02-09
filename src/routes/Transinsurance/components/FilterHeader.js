import i18n from './../../../lib/i18n';
import React,{Component, PropTypes} from "react";
import {createForm,FormWrapper} from "../../../components/Form";
// common 
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../components/Select'; // 下拉
import DataTime from '../../../components/Calendar/Calendar';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';
import {I18n} from "../../../lib/i18n";
class ClientcontactFilterHeader extends Component{
	constructor(props){
		super(props)
		this.show_hide_filter=this.show_hide_filter.bind(this);

		// event func
		this.handleInsuranceAgainst = this.handleInsuranceAgainst.bind(this);
		this.search = this.search.bind(this);
		props.normalRef && props.normalRef(this);
		this.getForm = this.getForm.bind(this);
		this.clear = this.clear.bind(this);		

		// state init
		this.state=this.initState(); 


	}
	static propTypes={
		expand:PropTypes.bool,
		expandFilter:PropTypes.func,
		initData:PropTypes.object
	}
	getForm(){
		return this.props.form.getFieldsValue();
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

			insuranceAgainst: [{id:1,localName:''}],
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

	search(){
		this.props.getPage();
	}

	clear(){
		this.props.form.resetFields();
		this.props.getPage();
	}

	// 保险公司
	handleInsuranceAgainst(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.insuranceAgainst,
			(response)=>{							
				this.setState({	insuranceAgainst:response.data });
			},(errors)=>{
				ServiceTips({ text:errors.message,type:'error' });
		});		
	}


	render(){
		let that = this;
		let domFilter;
		const { getNFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(200731/*保险公司*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('insuranceBeId',{
								initialValue:undefined						
							})}
							optionLabelProp="children"
							style={{width:200}}
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							className ='currency-btn select-from-currency'
							onClick={this.handleInsuranceAgainst}
						>
						{this.state.insuranceAgainst.map((o,i)=><Option key={i} objValue={{s_label:o.localName, insuranceBeId: o.id, insuranceBeLcName:o.localName, insuranceBeEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
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
						<span onClick = {this.search} className="search"><i className="foddingicon fooding-search_icon"></i></span>
						<span onClick={this.clear} className="clean"><i className="foddingicon fooding-clean_icon"></i></span>
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
