import React,{Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
import Calendar from  '../../../../components/Calendar/Calendar';

import {I18n} from '../../../../lib/i18n';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_HR,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList,commonAjax} from '../../../../services/apiCall';
import Select, { Option,ConstVirtualSelect,ConstMiniSelect } from '../../../../components/Select';
import ServiceTips from "../../../../components/ServiceTips";//提示框


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

	search_more = ()=> {
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


	// 部门验证  
	departmentVerify = ()=>{
		console.log( this.props.form.getFieldValue('ccid') );
	}

	// 企业验证  
	partyVerify = ()=> {
		!this.props.form.getFieldValue('ccid') && ServiceTips({text:I18n.t(600326/*未选择企业*/),type:'info'});
	}


	render(){
		let domFilter;
		let {form} = this.props;
		const { getFieldValue,getFieldProps, getFieldError } = this.props.form;
		let {info} = this.props;
		info = info || {};
		info.inSvrTypes = info.inSvrTypes || [];
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100244/*企业*/)}</label>
						<ConstVirtualSelect
                            form={form}
                            style={{width: 200}}
                            apiType={apiGet}
							apiHost={API_FOODING_ES}
							apiUri={'/party/getLoginCompanies'}
                            fieldName="ccid"
                            labelKey='localName'
                            clearable
                        />
					</div>					
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(400232/*年度*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							apiType={apiGet}
							apiHost={API_FOODING_HR}
							apiUri={'/calendar/getYear'}
							fieldName="year"
							apiParams={{obj:'com.fooding.fc.enumeration.AttendanceCycleType'}}
							style={{width: 200}}
							valueKeys={da => String(da)}

						/>
					</div>										
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(600244/*考勤周期*/)}</label>
						<span onClick={this.partyVerify}>
						<ConstVirtualSelect 
							form={this.props.form}
							refreshMark={getFieldValue('ccid',{}).ccid||getFieldValue('ccid')}
							isRequest={getFieldValue('ccid') ? true:false}

							apiHost={API_FOODING_HR}
							apiUri={'/attendanceCycleDetail/getList'}
							apiParams={{ccid:getFieldValue('ccid',{}).ccid||getFieldValue('ccid')}}
							fieldName="id"
							initValueOptions={[]}
							optionValue={da => <Option key={da.id} objValue={{
								depmntId: da.id,
								s_label: da.localName
							}}>{da.localName}</Option>} reles={true}
							style={{width: 200}}
							reles={true}
							
						/>
						</span>
					</div>		
                    <div className={'filter-header-information-pre'}>
                        <label>{I18n.t(700074/*状态*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            fieldName='cycleState'
                            apiType = {apiPost}
                            style={{width:200}}
                            apiHost={API_FOODING_DS}
                            apiUri='/object/getMiniList'
                            apiParams={{
                                obj:'com.fooding.fc.enumeration.CycleState'

                            }}
                            clearable

                        />
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
		return(<div className={'clientcontact-list-header'} ref="header" >{domFilter}</div>)
	}
}
ForwarderFilterHeader = createForm()(ForwarderFilterHeader);
export default ForwarderFilterHeader;
