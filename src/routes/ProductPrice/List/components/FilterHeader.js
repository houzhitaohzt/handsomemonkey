import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
//引入select插件
import xt from '../../../../common/xt';
import {createForm,FormWrapper} from "../../../../components/Form";
import DataTime from '../../../../components/Calendar/Calendar';
import Select, {Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select';
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ES,language,pageSize,sizeList, API_FOODING_ERP} from '../../../../services/apiCall';
import ProductSelect from '../../../../components/FindGridSelect';
class ProductFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search_more=this.search_more.bind(this);
		this.clientClick = this.clientClick.bind(this);
		props.normalRef && props.normalRef(this);
		this.getForm = this.getForm.bind(this);
		this.clear = this.clear.bind(this);
		this.search = this.search.bind(this);
	}
	search(){
		this.props.getPage();
	}
	getForm(){
		return this.props.form.getFieldsValue();
	}
	clear(){
		if(this.props.form.getFieldsValue().mtlId){
			this.refs.productSelect.clear(this.props.getPage);
			this.props.form.resetFields();
		}else {
			this.props.form.resetFields();
			this.props.getPage();
		}
	}
	clientClick(data){
		if (data.trim() === '') return;
        apiGet(API_FOODING_DS, '/customer/search', {keyword: data}, response => {
            this.props.form.resetFields(['salBeId']);
            this.setState({clientArray: response.data || []});
        }, error => {
        })
	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',
			clientArray:[],
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
		},()=>this.props.expandFilter(null, this.refs.header.offsetHeight))
	}
	render(){
		let domFilter;
		let {getNFieldProps,getFieldValue,getFieldProps}= this.props.form;
		let beField = getNFieldProps('salBeId',{
										initialValue:undefined
									 });
		let beFieldValue = getFieldValue("salBeId") || {};
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400048/*单据编号*/)}</label>
						<input placeholder=''
								   type="text" {...getFieldProps('no', {
						                initialValue:''
						            })} 
								className={'text-input-filter-header'}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
						/>
					</div>
					<div className={'filter-header-information-pre'} style={{width:'300px'}}>
						<label>{i18n.t(100379/*产品*/)}</label>
						<div style ={{float:'right',width:'200px'}}>
							<ProductSelect 
							    ref ="productSelect"
								form={this.props.form}
								width={'379%'}
								className={'currency-btn select-from-currency text-input-nowidth'}
								titleClass={"col-md-12 col-lg-12"}
								url='/material/search'
							/>
						</div>
					</div>
					
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100244/*企业*/)}</label>
			             <ConstMiniSelect form={this.props.form}
			                    pbj={{
			                                                     apiType: apiGet, host: API_FOODING_ES, uri:'/party/getLoginCompanies',
			                                                     params: {}
			                                                 }} fieldName="ccId"
			                                                 initValueOptions={[]}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     ccId: da.id,
			                                                     ccLcName: da.localName,
			                                                     ccEnName :da.name,
			                                                     s_label: da.localName
			                                                 }}>{da.localName}</Option>}
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
		return(<div className={this.props.id?'none':'product-list-header'} ref='header'>{domFilter}</div>)
	}
}
export default createForm()(ProductFilterHeader);