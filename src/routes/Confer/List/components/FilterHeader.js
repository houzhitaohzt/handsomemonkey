import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";

//引入select插件
import {createForm,FormWrapper} from "../../../../components/Form";

//引入时间插件
import Calendar from  '../../../../components/Calendar/Calendar';
import {I18n} from '../../../../lib/i18n';

// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { ConstVirtualSelect,Option } from '../../../../components/Select'; // 下拉

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language} from '../../../../services/apiCall';




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
            expandClassName: classN, minor: classMinor
        }, ()=>this.props.expandFilter(null, this.refs.header.offsetHeight));
	}



	



	// 查找
	searchFunc(){
		let that = this;		
		const {form} = this.props;
		let sID = form.getFieldsValue();	
		
		sID['fromDate'] = sID['fromDate'] ? sID['fromDate'] + ' 00:00:00' : '';
		sID['toDate'] = sID['toDate'] ? sID['toDate'] + ' 23:59:59' : '';

		this.props.getPage(Object.assign({},sID));	// 刷新 列表
	}

	// 清空 
	resetFunc(){
		this.props.form.resetFields(); // 清除表单
		this.props.getPage({});	// 刷新 列表
	}


	render(){
		let domFilter;
		let {form} = this.props; 
		let formData = form.getFieldsValue();		
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100311/*客户*/)}</label>
						<input type="text" 
							className={'text-input-filter-header'} 
							style={{width:'150px'}}
							placeholder=""
							{...getFieldProps('salBeLcName',{
								initialValue:''
							})}
							onKeyDown={(e)=>{
								if(e.keyCode == 13){this.searchFunc()}
                            }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100361/*分管人*/)}</label>
						<input type="text" 
							className={'text-input-filter-header'}
							style={{width:'150px'}}
							placeholder=""
							{...getFieldProps('responsibleOfficerLcName',{
								initialValue: ''
							})}
							onKeyDown={(e)=>{
                               if(e.keyCode == 13){this.searchFunc()}
                            }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100304/*主题*/)}</label>
						<input type="text" 
							className={'text-input-filter-header'} 
							style={{width:'150px'}}
							placeholder=""
							{...getFieldProps('title',{
								initialValue: ''
							})}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.searchFunc()}
                               }}
						/>
					</div>
																				
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(600167/*实际时间*/)}</label>

						<Calendar 
                            showTime={false}
                            width={160}
                            isShowIcon={true}
                            form={this.props.form}
                            padding={"3px 10px 4px"}
							name={'fromDate'}
						/>						
						&nbsp;&nbsp;至&nbsp;&nbsp;	
						<Calendar 
                            showTime={false}
                            width={160}
                            form={this.props.form}
                            isShowIcon={true}
                            padding={"3px 10px 4px"}
							name={'toDate'}
						/>
					</div>

					<div className={this.state.minor}>
						<label>{i18n.t(100230/*状态*/)}</label>
						<Select
							className ='currency-btn select-from-currency'
							style={{width:160}}							
							{...getNFieldProps('state',{
								initialValue: ''								
							})} 
							optionLabelProp="children"	
							allowClear={false}				
						>
							<Option key={0} value={''} title={i18n.t(400051/*不限*/)}>{i18n.t(400051/*不限*/)}</Option>													
							<Option key={1} value={'0'} title={i18n.t(100329/*计划*/)}>{i18n.t(100329/*计划*/)}</Option>
							<Option key={2} value={'1'} title={i18n.t(400000/*已联络*/)}>{i18n.t(400000/*已联络*/)}</Option>
						</Select>						
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
		return(<div className={'clientcontact-list-header'} ref="header">{domFilter}</div>)
	}
}
ProviderFilterHeader = createForm()(ProviderFilterHeader);
export default ProviderFilterHeader;

