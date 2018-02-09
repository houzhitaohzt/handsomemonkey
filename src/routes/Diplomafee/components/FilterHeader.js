import React,{Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../components/Form";
//引入select插件
import Select, { Option,ConstVirtualSelect,ConstMiniSelect } from '../../../components/Select';
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ES,language,pageSize,sizeList, API_FOODING_ERP} from '../../../services/apiCall';
import {I18n} from '../../../lib/i18n';
import i18n from '../../../lib/i18n';
import WebData from "../../../common/WebData";
class ForwarderFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search = this.search.bind(this);
		this.clean=this.clean.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
		this.search_more=this.search_more.bind(this);
	}
	static defaultProps={
		expand:false,
		expandFilter(){},
		showFilter:'comb-panel',
		expandClassName:'unfold',
		minor:'filter-header-information-pre hidden'
	}
	search(){
		this.props.getPage();
	}
	getForm(){
		let obj ={};
		obj = Object.assign({},this.props.form.getFieldsValue())
		return obj;
	}
	clean(){
		this.props.form.resetFields()
		this.props.getPage();
	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden'
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
            expandClassName: classN, minor: classMinor
        }, ()=>this.props.expandFilter(null, this.refs.header.offsetHeight));
	}
	render(){
		let domFilter;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(400008/*销售单号*/)}</label>
						<input type="text" {...getFieldProps('saleNo', {
						                                initialValue:''
						                    })} className={'text-input-filter-header'}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(200312/*物流员*/)}</label>
						<ConstVirtualSelect
                        placeholder=""
                        form={this.props.form}
                        style={{width:200}}
                        fieldName='lsStaffId'
                        apiHost={API_FOODING_ES}
                        apiUri='/staff/getListByCcId'
                        apiParams={{
                            ccid: WebData.user.data.staff.ccid
                            
                        }}
                        valueKeys={ da => ({
					         lsStaffId: da.id,
					         lsStaffLcName: da.localName,
					         lsStaffEnName: da.name,
					        s_label: da.localName
					    })}
                        
                    />

					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400084/*收款单位*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							fieldName='recBeId'
							apiType={apiPost}
							apiUri='/enterprise/search'
							async={true}
							apiParams='keyword'
							clearable
							style={{width:200}}
						/>						
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100284/*币种*/)}</label>
						<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Curren'}
                                                 }} fieldName="cnyId"
                                                 initValueOptions={[]}
                                                
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     cnyId: da.id,
                                                     cnyLcName: da.localName,
                                                     cnyEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 allowClear
                                                  
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
                            />					
					</div>
					<div className={this.state.minor}>
						<label>{I18n.t(400049/*业务状态*/)}</label>
						<Select
								{...getNFieldProps('status',{
									initialValue:undefined								
								})} 
								animation='slide-up'
								placeholder=''
								style={{width:200}}
								className ='currency-btn select-from-currency'
								prefixCls="rc-select-filter-header"
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"							
							>
													
								<Option key={1} value={'1'} title={I18n.t(200616/*未处理*/)}>{I18n.t(200616/*未处理*/)}</Option>
								<Option key={2} value={'10'} title={I18n.t(200619/*已处理*/)}>{I18n.t(200619/*已处理*/)}</Option>
								
							</Select>
					</div>
					<div className={'filter-header-key'}>
						<span className="search"><i className="foddingicon fooding-search_icon" onClick={this.search}></i></span>
						<span className="clean"><i className="foddingicon fooding-clean_icon" onClick={this.clean}></i></span>
						<span className={this.state.expandClassName} onClick={this.search_more}><i className="foddingicon fooding-zk_icon"></i></span>
					</div>
					<div className={this.state.showFilter}>
						<span className="screen" onClick={this.show_hide_filter}>
							<i className="foddingicon fooding-screen_icon"></i>
						</span>
					</div>
				</div>)
		}else{
			domFilter=(<div className={this.state.showFilter}>
					<span className="screen" onClick={this.show_hide_filter}>
						<i className="foddingicon fooding-screen_icon"></i>
					</span>
				</div>)
		}
		return(<div className={'clientcontact-list-header'} ref="header">{domFilter}</div>)
	}
}
ForwarderFilterHeader = createForm()(ForwarderFilterHeader);
export default ForwarderFilterHeader;
