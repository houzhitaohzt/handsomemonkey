import React,{Component, PropTypes} from "react";
import {createForm,FormWrapper} from "../../../../components/Form";
import Select, { Option ,ConstMiniSelect} from '../../../../components/Select';
import xt from './../../../../common/xt';
import {I18n} from '../../../../lib/i18n';
class ClientcontactFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search = this.search.bind(this);
		this.clean=this.clean.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
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
	onClick(){

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
			expandClassName:classN,minor:classMinor
		})
	}
	render(){
		let domFilter;
		const { getFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100001/*名称*/)}</label>
						<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Country' 
                                             fieldName="id"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 id: da.id,
                                                 name: da.name,
                                                 localName:da.localName,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	
                                             className ={'currency-btn select-from-currency'}
                                             style={{width:200}}
                                              allowClear
				        />
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100083/*三字码*/)}</label>
						<input type="text" {...getFieldProps('stThWord', {
						                                initialValue:''
						                    })} className={'text-input-filter-header'}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100085/*风险类型*/)}</label>
						<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.RiskType' 
                                             fieldName="riskTyId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 riskTyId: da.id,
                                                 riskTyName: da.name,
                                                 s_label: da.name
                                             }}>{da.name}</Option>}
                                             
                                             className ={'currency-btn select-from-currency'}
                                             style={{width:200}}
                                              allowClear
				        />
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100091/*地区*/)}</label>
						<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.BeAreaId' 
                                             fieldName="beAreaId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 beAreaId: da.id,
                                                 beAreaName: da.name,
                                                  beAreaLcName: da.localName,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             
                                             className ={'currency-btn select-from-currency'}
                                             style={{width:200}}
                                              allowClear
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
		return(<div className={'clientcontact-list-header'} ref="header">{domFilter}</div>)
	}
}
ClientcontactFilterHeader = createForm()(ClientcontactFilterHeader);
export default ClientcontactFilterHeader;
