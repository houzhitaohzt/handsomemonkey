import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";

//引入select插件
import Select, { Option } from '../../../../components/Select';
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
		},()=>this.props.expandFilter(null, this.refs.pruchaseNeedHarder.offsetHeight == 0?1:this.refs.pruchaseNeedHarder.offsetHeight))
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

	//点击企业进行加载数据
	initCompany = () => {
		apiGet(API_FOODING_ES,'/party/getLoginCompanies',{},(response)=>{
			this.setState({
				companyArr:response.data
			})
		},(error)=>{

		})
	}
	render(){
		let domFilter;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(400008/*销售单号*/)}</label>
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
						<label>{I18n.t(100379/*产品*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder=""
							{...getNFieldProps('mtlLcName',{
								initialValue:''
							})}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
						/>
					</div>					
					{/*<div className={'filter-header-information-pre'} style={{width:'300px'}}>
						<label>{*产品*}</label>
						<div style={{float:"right",width:"200px"}}>
							<ProductSelect 
								ref ="productSelect"
								form={this.props.form}
								width={'379%'}
								titleClass={" col-md-12 col-lg-12"}
								url='/material/search'
								rules={false}
							/>
						</div>
						<br className={'clear'} style={{claer:'both'}} />
					</div>*/}
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
					<div className={'filter-header-key'}>
						<span className="search"><i className="foddingicon fooding-search_icon" onClick = {this.search}></i></span>
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
		return(<div className={'clientcontact-list-header'} ref="pruchaseNeedHarder">{domFilter}</div>)
	}
}
PruchaseNeedFilterHeader = createForm()(PruchaseNeedFilterHeader);
export default PruchaseNeedFilterHeader;


/*
	<div className={'filter-header-information-pre'}>
		<label>{i18n.t(100244*//*企业*//*)}</label>
		<Select
			animation='slide-up'
			placeholder={i18n.t(200993*//*请选择企业*//*)}
			style={{width:200}}
			className ='currency-btn select-from-currency'
			prefixCls="rc-select-filter-header"
			choiceTransitionName="rc-select-selection__choice-zoom"
			optionLabelProp="children"
			{...getNFieldProps('ccId',{
			})}
			onClick={this.initCompany}
		>
		{
			this.state.companyArr.map((e,i) => {
				return <Option key={i} value={String(e.id)} title={e.localName}>{e.localName}</Option>
			})
		}
		</Select>
	</div>
*/
