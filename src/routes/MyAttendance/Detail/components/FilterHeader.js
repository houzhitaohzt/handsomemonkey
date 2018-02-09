import React,{Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
import Calendar from  '../../../../components/Calendar/Calendar';

import {I18n} from '../../../../lib/i18n';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_HR,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList,commonAjax} from '../../../../services/apiCall';
import Select, { Option,ConstVirtualSelect,ConstMiniSelect } from '../../../../components/Select';
import WebData from '../../../../common/WebData';
import ServiceTips from "../../../../components/ServiceTips";//提示框


class ForwarderFilterHeader extends Component{
	constructor(props){
		super(props)
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search = this.search.bind(this);
		this.clean=this.clean.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
		let groupData = WebData.user.data.staff.cluster || {};

		this.state = {
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',
			groupData:groupData, // 集团

		}

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



	// 企业验证
	partyVerify = ()=> {
		!this.props.form.getFieldValue('ccid') && ServiceTips({text:I18n.t(600320/*未选择所属企业*/),type:'info'});
	}



	render(){
		let domFilter;
		let {form} = this.props;
		let {groupData} = this.state;
		const { getFieldValue,getFieldProps, getFieldError } = this.props.form;
		let {info} = this.props;
		info = info || {};
		info.inSvrTypes = info.inSvrTypes || [];
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
                        <label>{I18n.t(600258/*考勤日期范围*/)}</label>
                        <Calendar
                            showTime={false}
                            width={200}
                            isShowIcon={true}
                            form={this.props.form}
                            padding={"3px 10px 4px"}
                            name={'beginDate'}
                        />
                        &nbsp;&nbsp;{I18n.t(500103/*至*/)}&nbsp;&nbsp;
                        <Calendar
                            showTime={false}
                            width={200}
                            form={this.props.form}
                            isShowIcon={true}
                            padding={"3px 10px 4px"}
                            name={'endDate'}
                        />
					</div>
                    <div className={'filter-header-information-pre'}>
                        <label>异常</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            fieldName='valid'
                            style={{width: 200}}
                            clearable
                            isRequest={false}
                            initValueOptions={[{name: "是"},{name: '否'}]}
                        />
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
		return(<div className={'clientcontact-list-header'} ref="header" >{domFilter}</div>)
	}
}
ForwarderFilterHeader = createForm()(ForwarderFilterHeader);
export default ForwarderFilterHeader;
