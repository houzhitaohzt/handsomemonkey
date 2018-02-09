import i18n from './../../../lib/i18n';
import React,{Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../components/Form";
//引入select插件
import Select, { Option } from '../../../components/Select';
//引入时间插件
import DataTime from '../../../components/Calendar/Calendar'
import {I18n} from '../../../lib/i18n';
class ForwarderFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search_more=this.search_more.bind(this);
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
		})
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
						<label>{i18n.t(100001/*名称*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							{...getFieldProps('area',{
								validateFirst: true,
								rules: [{required:true,}]
							})}
							>
							<Option value={i18n.t(200294/*上海*/)} title={i18n.t(200294/*上海*/)}>{i18n.t(200294/*上海*/)}</Option>
							<Option value={i18n.t(200310/*北京*/)} title={i18n.t(200310/*北京*/)}>{i18n.t(200310/*北京*/)}</Option>
						</Select>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100341/*所属国家*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							{...getFieldProps('area',{
								validateFirst: true,
								rules: [{required:true,}]
							})}
							>
							<Option value={i18n.t(200294/*上海*/)} title={i18n.t(200294/*上海*/)}>{i18n.t(200294/*上海*/)}</Option>
							<Option value={i18n.t(200310/*北京*/)} title={i18n.t(200310/*北京*/)}>{i18n.t(200310/*北京*/)}</Option>
						</Select>
					</div>
					<div className={'filter-header-key'}>
						<span className="search"><i className="foddingicon fooding-search_icon"></i></span>
						<span className="clean"><i className="foddingicon fooding-clean_icon"></i></span>
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
ForwarderFilterHeader = createForm()(ForwarderFilterHeader);
export default ForwarderFilterHeader;
