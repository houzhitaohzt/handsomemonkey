import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";

//引入select插件
import {createForm,FormWrapper} from "../../../../components/Form";
import {I18n} from '../../../../lib/i18n';


import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
import Select, { Option,ConstVirtualSelect } from '../../../../components/Select'; // 下拉




class GoodsToPortFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);

		// init Func 
		this.searchFunc=this.searchFunc.bind(this);
		this.resetFunc=this.resetFunc.bind(this);
		this.clientClick=this.clientClick.bind(this);
		
		
		

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
			clientArray:[{id:1,localName:''}],


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
		})
	}

	// 客户名称 
	clientClick(data){
		if (data.trim() === '') return;
        apiGet(API_FOODING_DS, '/customer/search', {keyword: data}, response => {
            this.props.form.resetFields(['salBeId']);
            this.setState({clientArray: response.data || []});
        }, error => {
        })
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
		const { getNFieldProps,getFieldProps, getFieldError } = this.props.form;

		
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400008/*销售单号*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder=""
							{...getNFieldProps('salesOrderNo',{
								initialValue:''
							})}
							onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.searchFunc()}
                            }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100355/*客户名称*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							fieldName='salBeId'
							apiType={apiGet}
							apiUri='/customer/search'
							async={true}
							apiParams='keyword'
							clearable
						/>
						{/*<Select 
							style={{width:194}}
							{...getNFieldProps('salBeId',{
								initialValue: ''
							})}
							animation='slide-up'
							placeholder=''
							optionLabelProp="children"
							optionFilterProp="children"							
							className ={'currency-btn select-from-currency'}							
							onSearch={this.clientClick}
							onSelect ={this.clientSelect}
						>	
							{this.state.clientArray.map((o,i)=><Option key={String(o['id'])} objValue={{s_label:o.localName, salBeId:o.id, salBeLcName:o.localName, salBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>*/}
					</div>					
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(200518/*信保状态*/)}</label>
						<Select
							{...getNFieldProps('finStatus',{
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
							<Option key={1} value={'15'} title={i18n.t(200799/*已投*/)}>{i18n.t(200799/*已投*/)}</Option>
							<Option key={2} value={'10'} title={i18n.t(200494/*未投*/)}>{i18n.t(200494/*未投*/)}</Option>
							<Option key={2} value={'20'} title={i18n.t(200800/*报损*/)}>{i18n.t(200800/*报损*/)}</Option>
							<Option key={2} value={'25'} title={i18n.t(200801/*理赔*/)}>{i18n.t(200801/*理赔*/)}</Option>
							<Option key={2} value={'30'} title={i18n.t(200619/*已处理*/)}>{i18n.t(200619/*已处理*/)}</Option>
							
						</Select>						
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
		return(<div className={'clientcontact-list-header'}>{domFilter}</div>)
	}
}
GoodsToPortFilterHeader = createForm()(GoodsToPortFilterHeader);
export default GoodsToPortFilterHeader;
