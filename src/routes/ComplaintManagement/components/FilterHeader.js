import React,{Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../components/Form";
import xt from '../../../common/xt';
import Select, { Option ,ConstMiniSelect ,ConstVirtualSelect} from '../../../components/Select/';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList,commonAjax} from '../../../services/apiCall';
//引入时间插件
import DataTime from '../../../components/Calendar/Calendar'
import {I18n} from '../../../lib/i18n';
import i18n from './../../../lib/i18n';
import Calendar from  '../../../components/Calendar/Calendar';
class ForwarderFilterHeader extends Component{
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
	render(){
		let domFilter;
		const { getFieldProps, getFieldError,getNFieldProps } = this.props.form;
		let {info} = this.props;
		info = info || {};
		info.incotmTypes = info.incotmTypes || [];
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
                    <div className={'filter-header-information-pre'}>
                        <label>申请人名称</label>
                        <input type="text"
                               {...getFieldProps('name', {
                                   initialValue:''
                               })}
                               className={'text-input-filter-header'}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
                        />
                    </div>
                    <div className={'filter-header-information-pre'}>
                        <label>类型</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            apiType={apiPost}
                            apiParams='com.fooding.fc.enumeration.ExplainType'
                            fieldName="explainType"
                            style={{width:200}}

                        />
                    </div>
                    <div className={'filter-header-information-pre'}>
                        <label>状态</label>
                        <Select
                            placeholder=""
                            style={{width:200}}
                            {...getNFieldProps('status', {
                                initialValue:undefined
                            })}
                            allowClear
                            className ='currency-btn select-from-currency'
                            prefixCls="rc-select-filter-header"
                        >
                            <Option objValue = {{s_label:i18n.t(300039/*草稿*/),status:'0',statusName:i18n.t(300039/*草稿*/)}} key={'0'}>{i18n.t(300039/*草稿*/)}</Option>
                            <Option objValue = {{s_label:i18n.t(200258/*已提交*/),status:'1',statusName:i18n.t(200258/*已提交*/)}} key={'1'}>{i18n.t(200258/*已提交*/)}</Option>
                            <Option objValue = {{s_label:i18n.t(400053/*已审批*/),status:'5',statusName:i18n.t(400053/*已审批*/)}} key={'5'}>{i18n.t(400053/*已审批*/)}</Option>
                        </Select>
                    </div>


					<div className={'filter-header-key'}>
						<span className="search"><i className="foddingicon fooding-search_icon" onClick={this.search}></i></span>
						<span className="clean"><i className="foddingicon fooding-clean_icon" onClick={this.clean}></i></span>
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
