import React,{Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../../components/Select';
//引入时间插件
import DataTime from '../../../../components/Calendar/Calendar'
import i18n, {I18n} from '../../../../lib/i18n';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList,commonAjax,API_FOODING_HR} from '../../../../services/apiCall';
class ForwarderFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search = this.search.bind(this);
		this.clean=this.clean.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
        let nowData = new Date();
        this.yearList = [nowData.getFullYear(), nowData.getFullYear() + 1].map(da => ({id:da, name: da}));
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
        let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {info} = this.props;
		info = info || {};
		info.inSvrTypes = info.inSvrTypes || [];
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
                    <div className={'filter-header-information-pre'}>
                        <label>国家</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            style={{width: 200}}
                            apiType={apiPost}
                            fieldName="countryId"
                            labelKey='localName'
                            apiParams="com.fooding.fc.ds.entity.Country"
                            clearable
                        />

                    </div>
                    <div className={'filter-header-information-pre'}>
                        <label>年度</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            isRequest={false}
                            fieldName="year"
                            initValueOptions={that.yearList}
                            className='col-md-8 col-lg-8'
                        />
                    </div>
					<div className={'filter-header-information-pre'}>
						<label>节假日名称</label>
						<input type="text" {...getFieldProps('name', {
						                                initialValue:''
						                    })} className={'text-input-filter-header'}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
						/>
					</div>

                    <div className={'filter-header-information-pre'}>
                        <label>状态</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            fieldName='rowSts'
                            style={{width: 200}}
                            clearable
                            isRequest={false}
                            initValueOptions={[{name: "草稿", id: 5},{name: i18n.t(400247/*有效*/), id: 10},{name: i18n.t(100441/*失效*/), id: 20}]}
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
