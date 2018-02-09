import React, {Component} from "react";

import {createForm} from "../../../../components/Form";
import {I18n} from "../../../../lib/i18n";
// common
import ServiceTips from "../../../../components/ServiceTips"; // 提示
import Select, {ConstVirtualSelect, Option} from "../../../../components/Select"; // 下拉
// ajax
import {API_FOODING_DS, apiPost, commonAjax} from "../../../../services/apiCall";





class ClientcontactFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);

		// event func
		this.countryClick = this.countryClick.bind(this);
		this.clientClick = this.clientClick.bind(this);
		this.searchFunc = this.searchFunc.bind(this);
		this.resetFunc = this.resetFunc.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);

	}
	getForm(){
		let obj ={};
		obj = Object.assign({},this.props.form.getFieldsValue())
		return obj;
	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',

			country: [{id:1,name:''}], // 国家
			client: [{id:1,name:''}], // 客户


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

	// 国家
	countryClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.country,
			(response)=>{
				this.setState({	country: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 客户
	clientClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{"obj":"com.fooding.fc.ds.entity.Vendor"},
			(response)=>{
				this.setState({	client: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 查找
	searchFunc(){
		let that = this;
		this.props.getPage();	// 刷新 列表
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
						<label>{I18n.t(300016/*联系人名称*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder=""
							{...getFieldProps('name',{
								initialValue:''
							})}
							onKeyDown={(e)=>{
                                if(e.keyCode == 13){this.searchFunc()}
                            }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100087/*国家*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							placeholder=""
							{...getNFieldProps('cntryId',{
								initialValue: undefined
							})}
							onClick={this.countryClick}
							>
							{this.state.country.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.localName}</Option>)}
						</Select>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100312/*供应商*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							apiType={apiPost}
							fieldName='beId'
							apiUri='/enterprise/search?dataTyId=40'
							async={true}
							apiParams='keyword'
							valueKeys={ da => ({
                                s_label:da.localName,
                                beId:da.id,
                            })} style={{width:"200px"}}
							className='currency-btn select-from-currency col-md-9 col-lg-9'
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100229/*邮箱*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder=""
							{...getFieldProps('email',{
								initialValue:''
							})}
							onKeyDown={(e)=>{
                                if(e.keyCode == 13){this.searchFunc()}
                            }}
						/>
					</div>
					<div className={'filter-header-key'}>
						<span onClick={this.searchFunc} className="search"><i className="foddingicon fooding-search_icon"></i></span>
						<span onClick={this.resetFunc} className="clean"><i className="foddingicon fooding-clean_icon"></i></span>
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
ClientcontactFilterHeader = createForm()(ClientcontactFilterHeader);
export default ClientcontactFilterHeader;
