import i18n from './../../../lib/i18n';
import React,{Component, PropTypes} from "react";

//引入select插件
import {createForm,FormWrapper} from "../../../components/Form";

//引入时间插件
// import DataTime from '../../../components/Calendar/Calendar'
import {I18n} from '../../../lib/i18n';

import Calendar from  '../../../components/Calendar/Calendar';



// common
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language} from '../../../services/apiCall';






class ProviderFilterHeader extends Component{

	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search_more=this.search_more.bind(this);

		// init onClick
		this.searchFunc = this.searchFunc.bind(this);	 // 头部 查询
		this.resetFunc = this.resetFunc.bind(this);	 // 头部 清空



	}

	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',


		}
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
		}, ()=>this.props.expandFilter(null, this.refs.header.offsetHeight))
	}

	// 查找
	searchFunc(){
		let that = this;
		const {form} = this.props;
		let sID = form.getFieldsValue();

		this.props.getPage(Object.assign({},sID));	// 刷新 列表
	}

	// 清空
	resetFunc(){
		this.props.form.resetFields(); // 清除表单
		this.props.getPage({});	// 刷新 列表
	}


	render(){
		let domFilter;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400008/*销售单号*/)}</label>
						<input  type='text'
							{...getFieldProps('saleNo',{
								initialValue: ''
							})}
							placeholder=''
							style={{width:200}}
							className ={'text-input'}
								onKeyDown={(e)=>{
                                    if(e.keyCode == 13){this.searchFunc()}
                                }}
						/>
					</div>

					<div className={'filter-header-information-pre'}>
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
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(201238/*起运日期*/)}</label>
						<Calendar
							width={200}
							showTime = {false}
							isShowIcon={true}
							form={this.props.form}
							validate={false}
							name={'shipsDate'}
						/>
						&nbsp;&nbsp;至&nbsp;&nbsp;
						<Calendar
							width={200}
							showTime = {false}
							isShowIcon={true}
							form={this.props.form}
							validate={false}
							name={'shipeDate'}
						/>
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(201237/*保险费发票*/)}</label>
						<input  type='text'
                                {...getFieldProps('premiumNo',{
                                    initialValue: ''
                                })}
								placeholder=''
								style={{width:200}}
								className ={'text-input'}
								onKeyDown={(e)=>{
                                    if(e.keyCode == 13){this.searchFunc()}
                                }}
						/>
					</div>
					<div className={'filter-header-key'}>
						<span onClick={this.searchFunc} className="search"><i className="foddingicon fooding-search_icon"></i></span>
						<span onClick={this.resetFunc} className="clean"><i className="foddingicon fooding-clean_icon"></i></span>
						<span className={this.state.expandClassName} onClick={this.search_more}><i className="foddingicon fooding-zk_icon"></i></span>
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
		return(<div className={'clientcontact-list-header'} ref='header'>{domFilter}</div>)
	}
}
ProviderFilterHeader = createForm()(ProviderFilterHeader);
export default ProviderFilterHeader;
