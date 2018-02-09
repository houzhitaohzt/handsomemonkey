import React,{Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
//引入select插件
import Select, { Option, ConstMiniSelect } from '../../../../components/Select'; // 下拉
//引入时间插件
import DataTime from '../../../../components/Calendar/Calendar'
import {I18n} from '../../../../lib/i18n';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';

class ForwarderFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search_more=this.search_more.bind(this);
		this.serchClick=this.serchClick.bind(this);
		this.cleanClick=this.cleanClick.bind(this);
		// init onClick
		// this.countryClick = this.countryClick.bind(this); // 国家 click
		// this.stateClick = this.stateClick.bind(this);  // 省 click
		// this.cityClick = this.cityClick.bind(this);	 // 市 click		
		// this.districtClick = this.districtClick.bind(this);	 // 区县 click

		// this.countryChange = this.countryChange.bind(this);	 // 国家 change
		// this.stateChange = this.stateChange.bind(this);	 // 省 change
		// this.cityChange = this.cityChange.bind(this);	 // 市 change
	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',
			country: [{id:'1',name:''}], // 国家
			state: [{id:'1',name:''}], // 省州
			city: [{id:'1',name:''}], // 市
			district: [{id:'1',name:''}], // 区县

			countryNowID: '', // 国家 临时ID
			stateNowID: '', // 省 临时ID
			cityNowID: '', // 市 临时ID	
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
		},() => this.refs.servbeHeader.offsetHeight == 0?1:this.refs.servbeHeader.offsetHeight)
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
		},()=>this.props.expandFilter(null, this.refs.servbeHeader.offsetHeight))
	}
	serchClick(){
		const { form } = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.serchClick(this.props.form.getFieldsValue());
			}
		})
	}
	cleanClick(){
		const { form } = this.props;
		this.props.cleanClick(this.props.form.getFieldsValue());
		this.props.form.resetFields();
	}

	// // 国家 click
	// countryClick(){
	// 	var that = this;
	// 	apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Country'},
	// 		(response)=>{							
	// 			this.setState({	country: response.data });
	// 		},(errors)=>{
	// 			ServiceTips({text:errors.message,type: 'error'});
	// 	});
	// }

	// // 国家 onChange
	// countryChange(ID){
	// 	this.props.form.setFieldsValue({"provinceId": undefined,"cityId": undefined,"districtId": undefined});
	// 	this.setState({ countryNowID: ID});		
	// }

	// // 省州 click
	// stateClick(){
	// 	var that = this;
	// 	apiPost(API_FOODING_DS,'/object/getMiniList',
	// 	{
	// 		obj:'com.fooding.fc.ds.entity.Area',	
	// 		queryParams: [{
	// 			"attr":"parentId",
	// 			"expression":"=",
	// 			"value": this.state.countryNowID
	// 		}]
	// 	},
	// 	(response)=>{							
	// 		this.setState({	state: response.data });
	// 		//response.data.length==0 ? ServiceTips({text: '请先选择国家！',type: 'info'}) : function(){};
	// 	},(errors)=>{
	// 		ServiceTips({text: errors.message,type: 'error'});
	// 	});
	// }

	// // 省 onChange
	// stateChange(ID){
	// 	this.props.form.setFieldsValue({"cityId": undefined,"districtId": undefined});
	// 	this.setState({ stateNowID: ID });
	// }

	// // 市 click
	// cityClick(){
	// 	var that = this;
	// 	apiPost(API_FOODING_DS,'/object/getMiniList',
	// 	{
	// 		obj:'com.fooding.fc.ds.entity.Area',	
	// 		queryParams: [{
	// 			"attr":"parentId",
	// 			"expression":"=",
	// 			"value": this.state.stateNowID
	// 		}]
	// 	},
	// 	(response)=>{							
	// 		this.setState({	city: response.data });
	// 		//response.data.length==0 ? ServiceTips({text: '请先选择省/州！',type: 'info'}) : function(){};
	// 	},(errors)=>{
	// 		ServiceTips({text: errors.message,type: 'error'});
	// 	});
	// }

	// // 市 onChange
	// cityChange(ID){ 
	// 	this.props.form.setFieldsValue({"districtId": undefined});
	// 	this.setState({ cityNowID: ID });				
	// }

	// // 区县 click
	// districtClick(){
	// 	var that = this;
	// 	apiPost(API_FOODING_DS,'/object/getMiniList',
	// 	{
	// 		obj:'com.fooding.fc.ds.entity.Area',	
	// 		queryParams: [{
	// 			"attr":"parentId",
	// 			"expression":"=",
	// 			"value": this.state.cityNowID
	// 		}]
	// 	},
	// 	(response)=>{							
	// 		this.setState({	district: response.data });
	// 		//response.data.length==0 ? ServiceTips({text: '请先选择市！',type: 'info'}) : function(){};
	// 	},(errors)=>{
	// 		ServiceTips({text: errors.message,type: 'error'});
	// 	});
	// }
	render(){
		let domFilter;
		const { getFieldProps, getFieldError, getFieldValue } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(600214/*承运人*/)}</label>
						<input type="text" className={'text-input-filter-header'} 
							{...getFieldProps('name',{
								initialValue:''
							})}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.serchClick()}
                               }}
						/>
					</div>  
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100087/*国家*/)}</label>
						<ConstMiniSelect 
							form={this.props.form} 
							pbj="com.fooding.fc.ds.entity.Country"
							fieldName="cntryId"
							initValueOptions={[]}
							reles={false}
							allowClear={true}
							optionValue={(da, di) => <Option key={di} objValue={{
								cntryId: da.id,
								s_label: da.localName
							}}>{da.localName}</Option>}
							style={{width:'200px'}}
						/>
					</div>
					<div className={'filter-header-key'}>
						<span className="search" onClick={this.serchClick}><i className="foddingicon fooding-search_icon"></i></span>
						<span className="clean" onClick={this.cleanClick}><i className="foddingicon fooding-clean_icon"></i></span>
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
		return(<div className={'clientcontact-list-header'} ref="servbeHeader">{domFilter}</div>)
	}
}
ForwarderFilterHeader = createForm()(ForwarderFilterHeader);
export default ForwarderFilterHeader;

/*
<div className={'filter-header-information-pre'}>
		<label>{I18n.t(100481*//*地址*//*)}</label>
		<ConstMiniSelect 
			form={this.props.form} 
			isRequest={Boolean(getFieldValue("cntryId",{}).cntryId)}
			refreshMark={getFieldValue("cntryId",{}).cntryId}
			pbj={{
				params:{"obj":'com.fooding.fc.ds.entity.Area',
					"queryParams":[{"attr":"parentId","expression":"=","value":getFieldValue("cntryId",{}).cntryId}]}
				}}
			fieldName="provinceId"
			initValueOptions={[]}
			reles={false}
			allowClear={true}
			optionValue={(da, di) => <Option key={di} objValue={{
				provinceId: da.id,
				s_label: da.localName
			}}>{da.localName}</Option>}
			style={{width:'200px'}}
		/>
	</div>
	<div className={'filter-header-information-pre'}>
		<label>{I18n.t(100481*//*地址*//*)}</label>
		<ConstMiniSelect 
			form={this.props.form} 
			isRequest={Boolean(getFieldValue('provinceId',{}).provinceId)}
			refreshMark={getFieldValue('provinceId',{}).provinceId}
			pbj={{
				params:{"obj":'com.fooding.fc.ds.entity.Area',
					"queryParams":[{"attr":"parentId","expression":"=","value":getFieldValue('provinceId',{}).provinceId}]}
				}}
			fieldName="cityId"
			initValueOptions={[]}
			reles={false}
			allowClear={true}
			optionValue={(da, di) => <Option key={di} objValue={{
				cityId: da.id,
				s_label: da.localName
			}}>{da.localName}</Option>}
			style={{width:'200px'}}
		/>
	</div>
	<div className={this.state.minor}>
		<label>{I18n.t(100249*//*区县*//*)}</label>
		<ConstMiniSelect 
			form={this.props.form} 
			isRequest={Boolean(getFieldValue("cityId",{}).cityId)}
			refreshMark={getFieldValue("cityId",{}).cityId}
			pbj={{
				params:{"obj":'com.fooding.fc.ds.entity.Area',
					"queryParams":[{"attr":"parentId","expression":"=","value":getFieldValue("cityId",{}).cityId}]}
				}}
			fieldName="districtId"
			initValueOptions={[]}
			reles={false}
			allowClear={true}
			optionValue={(da, di) => <Option key={di} objValue={{
				districtId: da.id,
				s_label: da.localName
			}}>{da.localName}</Option>}
			style={{width:'200px'}}
		/>
	</div>
*/
