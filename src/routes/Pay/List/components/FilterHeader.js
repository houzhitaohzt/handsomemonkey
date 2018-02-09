import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
//引入select插件
import xt from '../../../../common/xt';
import {createForm,FormWrapper} from "../../../../components/Form";
import Select, {Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP} from '../../../../services/apiCall';
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
		this.props.form.resetFields();
		this.props.getPage();
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
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(500129/*源单编号*/)}</label>
						<input type="text" className={'text-input-filter-header'}
						 placeholder=""
                            {...getFieldProps('sourceNo',{
								initialValue:''
							})}
							onKeyDown={(e)=>{
                                if(e.keyCode == 13){this.search()}
                            }}
                        />
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400084/*收款单位*/)}</label>
						<ConstVirtualSelect
						    form={this.props.form}
						    fieldName='receiptBeId'
						    apiUri='/enterprise/search'
						    async={true}
						    apiType={apiPost}
						    apiParams='keyword'
						    style={{height:'250px'}}
						    valueKeys={ da => ({
						        receiptBeId: da.id,
						        receiptBeLcName: da.localName,
						        receiptBeEnName: da.name,
						        s_label: da.localName
						    })}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400049/*业务状态*/)}</label>
							<Select
								placeholder=""
								style={{width:194}}
								{...getNFieldProps('status', {
							                initialValue:{s_label:i18n.t(400051/*不限*/),status:undefined}
							    })} 
								optionLabelProp="children"
								optionFilterProp="children"	
								allowClear
								className ='currency-btn select-from-currency'
								prefixCls="rc-select-filter-header"
							>	
								<Option key={0} objValue={{s_label:i18n.t(400051/*不限*/),status:undefined}} title={i18n.t(400051/*不限*/)}>{i18n.t(400051/*不限*/)}</Option>						
								<Option key={1} objValue={{s_label:i18n.t(200616/*未处理*/),status:1}} title={i18n.t(200616/*未处理*/)}>{i18n.t(200616/*未处理*/)}</Option>
								<Option key={2} objValue={{s_label:i18n.t(200485/*处理中*/),status:5}} title={i18n.t(200485/*处理中*/)}>{i18n.t(200485/*处理中*/)}</Option>
								<Option key={3} objValue={{s_label:i18n.t(200619/*已处理*/),status:10}} title={i18n.t(200619/*已处理*/)}>{i18n.t(200619/*已处理*/)}</Option>
							</Select>
							
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
		return(<div className={'product-list-header'} ref='header'>{domFilter}</div>)
	}
}
export default createForm()(ProductFilterHeader);