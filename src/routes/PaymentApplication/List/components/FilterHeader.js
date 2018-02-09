import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";

//引入select插件
import {createForm,FormWrapper} from "../../../../components/Form";
//引入时间插件
import DataTime from '../../../../components/Calendar/Calendar'
import {I18n} from '../../../../lib/i18n';
import Select, {Option,ConstVirtualSelect } from '../../../../components/Select';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../services/apiCall";
import xt from '../../../../common/xt'; // 下拉
class PAHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search_more=this.search_more.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
		this.search = this.search.bind(this);
		this.clean = this.clean.bind(this);
		this.clientClick = this.clientClick.bind(this);
	}
	clean(){
		this.props.form.resetFields();
		this.props.getPage();
	}
	search(){
		this.props.getPage();
	}
	getForm(){
		return this.props.form.getFieldsValue();
	}
	clientClick(data){
		if (data.trim() === '') return;
        apiPost(API_FOODING_DS, '/enterprise/search', {keyword: data}, response => {
            this.props.form.resetFields(['salBeId']);
            this.setState({clientArray: response.data || []});
        }, error => {
        })
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
			clientArray:[]
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
			this.props.getPage();
		}
		this.setState({
			expandClassName:classN,minor:classMinor
		},()=>this.props.expandFilter(null, this.refs.header.offsetHeight))
	}
	render(){
		let domFilter;
        const { getFieldProps, getFieldError,getNFieldProps} = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400048/*单据编号*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder="" 
                            {...getFieldProps('no',{
                            	initialValue:''
							})}
							onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                            }}
                        />
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(500129/*源单编号*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder="" 
                            {...getFieldProps('sourceNo',{
								initialValue:''
							})}
							onKeyDown={(e)=>{
								if(e.keyCode == 13){this.search()}
							}}
                        />
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(200817/*申请人*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder="" 
                            {...getFieldProps('payStaffLcName',{
								initialValue:''
							})}
							onKeyDown={(e)=>{
								if(e.keyCode == 13){this.search()}
							}}
                        />
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400084/*收款单位*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							fieldName='receiptBeId'
							apiUri='/enterprise/search'
							async={true}
							apiParams='keyword'
							style={{width:200}}
							apiType={apiPost}
							valueKeys={ da => ({
                                receiptBeId: da.id,
                                receiptBeLcName: da.localName,
                                receiptBeEnName: da.name,
                                s_label: da.localName
                            })}
						/>
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(400049/*业务状态*/)}</label>
						<Select
							placeholder=""
							style={{width:194}}
                            {...getNFieldProps('status', {
                                initialValue:{s_label:i18n.t(400051/*不限*/),status:undefined}
                            })}
							optionLabelProp="children"
							optionFilterProp="children"
							allowClear
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
						>
							<Option key={0} objValue={{s_label:i18n.t(400051/*不限*/),status:undefined}} title={i18n.t(400051/*不限*/)}>{i18n.t(400051/*不限*/)}</Option>
							<Option key={1} objValue={{s_label:i18n.t(300039/*草稿*/),status:1}} title={i18n.t(300039/*草稿*/)}>{i18n.t(300039/*草稿*/)}</Option>
							<Option key={2} objValue={{s_label:i18n.t(200258/*已提交*/),status:5}} title={i18n.t(200258/*已提交*/)}>{i18n.t(200258/*已提交*/)}</Option>
							<Option key={3} objValue={{s_label:i18n.t(400053/*已审批*/),status:10}} title={i18n.t(400053/*已审批*/)}>{i18n.t(400053/*已审批*/)}</Option>
						</Select>

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
		return(<div className={'clientcontact-list-header'} ref='header'>{domFilter}</div>)
	}
}
PAHeader = createForm()(PAHeader);
export default PAHeader;