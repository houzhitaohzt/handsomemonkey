import React,{Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../components/Form";
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../components/Select';
//引入时间插件
import DataTime from '../../../components/Calendar/Calendar'
import {I18n} from '../../../lib/i18n';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_HR,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList,commonAjax} from '../../../services/apiCall';
import WebData from '../../../common/WebData';


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
			groupData:groupData, // 集团
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden'
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
	render(){
		let domFilter;
		let {groupData} = this.state;
		let {form} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		let {info} = this.props;
		info = info || {};
		info.inSvrTypes = info.inSvrTypes || [];
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100244/*企业*/)}</label>
						<ConstVirtualSelect form={this.props.form}
							apiHost={API_FOODING_ES}
							apiUri={'/party/getLoginCompanies'}
							apiParams={{clusId:groupData['id']}}
							fieldName="ccid"
							style={{width: 200}}						
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
