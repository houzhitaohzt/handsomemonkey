import React,{Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
//引入select插件
import Select, { Option, ConstVirtualSelect } from '../../../../components/Select';
import {I18n} from '../../../../lib/i18n';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
import WebData from '../../../../common/WebData';

class ProductFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search_more=this.search_more.bind(this);
		this.search = this.search.bind(this);
		this.clean=this.clean.bind(this);
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
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
		minor:'filter-header-information-pre hidden',
		initData: null
	}
	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',

			mtlTypes:[],//产品类型
			chargePeople:[],
			dataDivs:[], //产品等级
			simProStands:[], //生产标准
			staffData:[] //分管人

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
		},()=>this.props.expandFilter(null, this.refs.productHeader.offsetHeight == 0?1:this.refs.productHeader.offsetHeight)) 
	}
	search_more(){//收缩条件的展开和收缩
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
		},()=>this.props.expandFilter(null, this.refs.productHeader.offsetHeight))
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
	componentDidMount(){
	}
	render(){
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		let domFilter;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100377/*产品编码*/)}</label>
						<input type="text" className={'text-input-filter-header'} 
							{...getNFieldProps('code',{
									initialValue:''
								})}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search();}
                               }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100379/*产品*/)}</label>
						<input type="text" className={'text-input-filter-header'}
						{...getNFieldProps('name',{
								initialValue:''
							})}
							onKeyDown={(e)=>{
                                if(e.keyCode == 13){this.search();}
                            }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100226/*英文名称*/)}</label>
						<input type="text" className={'text-input-filter-header'}
						{...getNFieldProps('enName',{
								initialValue:''
							})}
							onKeyDown={(e)=>{
                               if(e.keyCode == 13){this.search();}
                            }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(100385/*海关编码*/)}</label>
						<input type="text" className={'text-input-filter-header'}
						{...getNFieldProps('hsCode',{
								initialValue:''
							})}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search();}
                               }}
						/>
					</div>
					<div className={this.state.minor}>
						<label>{I18n.t(100403/*产品类型*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							fieldName="mtlTypeId"
							apiType={apiPost}
							apiHost={API_FOODING_DS}
							apiParams="com.fooding.fc.ds.entity.MtlType"
							initialValue={''}
							style={{width:'200px'}}
							clearable={true}
						/>
					</div>
					<div className={this.state.minor}>
						<label>{I18n.t(100386/*生产标准*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							fieldName="pPStdId"
							apiType={apiPost}
							apiHost={API_FOODING_DS}
							apiParams="com.fooding.fc.ds.entity.SimProStand"
							initialValue={''}
							style={{width:'200px'}}
							clearable={true}
						/>
					</div>
					<div className={this.state.minor}>
						<label>{I18n.t(100384/*产品等级*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							fieldName="dataDivId"
							apiType={apiPost}
							apiHost={API_FOODING_DS}
							apiParams="com.fooding.fc.ds.entity.DataDivId3"
							initialValue={''}
							style={{width:'200px'}}
							clearable={true}
						/>
					</div>
					<div className={this.state.minor}>
						<label>{I18n.t(100361/*分管人*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							fieldName="staffId"
							initValueOptions={[]}
							valueKeys="refId"
							labelKey="staffLocalName"
							apiHost={API_FOODING_ES}
							apiParams={{typeAttributeIds:605,partyId:WebData.user.data.companies[0].id}}
							apiUri="/user/getListForPermissionsInParty"
							initialValue={''}
							style={{width:'200px'}}
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
		return(<div className={'product-list-header'} ref="productHeader">{domFilter}</div>)
	}
}
ProductFilterHeader = createForm()(ProductFilterHeader);
export default ProductFilterHeader;

/*
<Select
		animation='slide-up'
		placeholder={I18n.t(100403*//*产品类型*//*)}
		style={{width:200}}
		className ='currency-btn select-from-currency'
		prefixCls="rc-select-filter-header"
		choiceTransitionName="rc-select-selection__choice-zoom"
		optionLabelProp="children"
		{...getNFieldProps('mtlTypeId',{
			initialValue:'',
		})}
	>
		<Option value={''} title={''}>{""}</Option>
		{
			this.state.mtlTypes.map((e,i) =>{
				return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
			})
		}
	</Select>
	<Select
		animation='slide-up'
		placeholder={I18n.t(100386*//*生产标准*//*)}
		style={{width:200}}
		className ='currency-btn select-from-currency'
		prefixCls="rc-select-filter-header"
		choiceTransitionName="rc-select-selection__choice-zoom"
		optionLabelProp="children"
		{...getNFieldProps('pPStdId',{
			initialValue:'',
		})}
	>
		<Option value={''} title={''}>{""}</Option>
		{
			this.state.simProStands.map((e,i) =>{
				return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
			})
		}
	</Select>
	<Select
		animation='slide-up'
		placeholder={I18n.t(100384*//*产品等级*//*)}
		style={{width:200}}
		className ='currency-btn select-from-currency'
		prefixCls="rc-select-filter-header"
		choiceTransitionName="rc-select-selection__choice-zoom"
		optionLabelProp="children"
		{...getNFieldProps('dataDivId',{
			initialValue:'',
		})}
	>
		<Option value={''} title={''}>{""}</Option>
		{
			this.state.dataDivs.map((e,i) =>{
				return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
			})
		}
	</Select>
	<Select
		animation='slide-up'
		placeholder={I18n.t(100361*//*分管人*//*)}
		style={{width:200}}
		className ='currency-btn select-from-currency'
		prefixCls="rc-select-filter-header"
		choiceTransitionName="rc-select-selection__choice-zoom"
		optionLabelProp="children"
		{...getNFieldProps('staffId',{
			initialValue:'',
		})}
		onClick = {this.onStaffIdClick}
	>
		<Option value={''} title={''}>{""}</Option>
		{
			this.state.staffData.map((e,i) =>{
				return (<Option key={i} value={e.id || e.refId} title={e.staffLocalName || e.localName}>{e.staffLocalName || e.localName}</Option>)
			})
		}
	</Select>
*/
