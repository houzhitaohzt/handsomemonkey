import i18n from './../../../lib/i18n';
import React,{Component, PropTypes} from "react";

import {createForm,FormWrapper} from "../../../components/Form";
import {I18n} from '../../../lib/i18n';
import Calendar from  '../../../components/Calendar/Calendar';


// common 
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option,ConstMiniSelect } from '../../../components/Select'; // 下拉
import WebData from '../../../common/WebData';


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';



class ClientcontactFilterHeader extends Component{

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
			minor:'filter-header-information-pre hidden',

			company: [{id:1,localName:''}], // 收款企业
								
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

	

	// 查找
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


	render(){
		let domFilter;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400049/*业务状态*/)}</label>
						<Select
							{...getNFieldProps('status',{
								initialValue: ''								
							})} 
							animation='slide-up'
							placeholder=''
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"							
						>
							<Option key={0} value={''} title={i18n.t(400051/*不限*/)}>{i18n.t(400051/*不限*/)}</Option>						
							<Option key={1} value={'1'} title={i18n.t(200604/*未核销*/)}>{i18n.t(200604/*未核销*/)}</Option>
							<Option key={2} value={'5'} title={i18n.t(201103/*核销中*/)}>{i18n.t(201103/*核销中*/)}</Option>
							<Option key={3} value={'10'} title={i18n.t(201104/*核销已完成*/)}>{i18n.t(201104/*核销已完成*/)}</Option>
						</Select>						
					</div>					
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(500083/*收款企业*/)}</label>
						<ConstMiniSelect 
									form={this.props.form}
									style={{width:200}}
									pbj={{
                                                     apiType: apiGet, host: API_FOODING_ES, uri:'/party/getLoginCompanies',
                                                     params: {clusId:WebData.user.data.staff.clusId}
                                    }} fieldName="receiptCcId"
                                                 initValueOptions={[]}
                                                
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     receiptCcId: da.id,
                                                     receiptCcLcName: da.localName,
                                                     receiptCcEnName: da.name,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>}
                                                 						
                            />												
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(201099/*源单号*/)}</label>
						<input
							type="text"
                            {...getFieldProps('sourceNo',{

                                initialValue:''})}
							style={{width:200}}
							className={'text-input-nowidth'}
							onKeyDown={(e)=>{
                                if(e.keyCode == 13){this.search()}
                            }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(500197/*收汇编号*/)}</label>
						<input 
											    type="text"
												{...getFieldProps('no',{
												
												initialValue:''})}
												style={{width:200}}
												className={'text-input-nowidth'}
												onKeyDown={(e)=>{
                                                    if(e.keyCode == 13){this.search()}
                                                }}
							/>
                    </div>
					<div className={this.state.minor}>
						<label>{i18n.t(200612/*收款日期*/)}</label>
						<Calendar
							width={200}
							showTime = {false}
							isShowIcon={true}
							form={this.props.form}
							validate={false}
							name={'receiptsDate'}
						/>
						&nbsp;&nbsp;至&nbsp;&nbsp;
						<Calendar
							width={200}
							showTime = {false}
							isShowIcon={true}
							form={this.props.form}
							validate={false}
							name={'receipteDate'}
						/>
					</div>
					<div className={'filter-header-key'}>
						<span className="search"><i className="foddingicon fooding-search_icon" onClick={this.search}></i></span>
						<span className="clean"><i className="foddingicon fooding-clean_icon" onClick={this.clean}></i></span>
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
		return(<div className={'clientcontact-list-header'} ref="header">{domFilter}</div>)
	}
}


ClientcontactFilterHeader = createForm()(ClientcontactFilterHeader);
export default ClientcontactFilterHeader;