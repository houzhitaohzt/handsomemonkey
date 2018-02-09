import React,{Component, PropTypes} from "react";
// common 
import {createForm,FormWrapper} from "../../../components/Form"; // form 表单
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../components/Select'; // 下拉
import {I18n} from '../../../lib/i18n'; // 时间
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language} from '../../../services/apiCall';

class ClientcontactFilterHeader extends Component{
	constructor(props){
		super(props)
		this.show_hide_filter=this.show_hide_filter.bind(this);
		// ajax func
		this.handleProductType = this.handleProductType.bind(this);
		this.search = this.search.bind(this);
		this.clear = this.clear.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
		this.state = {
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',
			productType: [{id:1,localName:''}],
			productTypeV: ''			
		};

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

	// 产品类型 ajax 
	handleProductType(){
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.MtlType'},
			(response)=>{							
				this.setState({	productType:response.data });
			},(errors)=>{
				ServiceTips({ text:errors,type:'error' });
		});
	}

	search(){
		this.props.getPage();
	}
	clear(){
		this.props.form.resetFields();
		this.props.getPage();
	}
	getForm(){
		return this.props.form.getFieldsValue();
	}


	render(){
		let domFilter;
		const { getNFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100403/*产品类型*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('mtltyId',{
								rules: [{required:true}],
								initialValue: undefined							
							})}
							optionFilterProp="children"							
							optionLabelProp="children"
							style={{width:200,marginRight:15}}
							className ={getFieldError('mtltyId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
							onClick={this.handleProductType}
						>
							{this.state.productType.map((o,i)=><Option key={i} objValue={{s_label:o.localName, mtltyId: o.id, mtltyLcName:o.localName, mtltyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>
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
		return(<div className={'clientcontact-list-header'} ref="header">{domFilter}</div>)
	}
}
ClientcontactFilterHeader = createForm()(ClientcontactFilterHeader);
export default ClientcontactFilterHeader;
