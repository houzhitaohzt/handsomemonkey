import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";

//引入select插件
import Select, { Option } from '../../../../components/Select';
import {createForm,FormWrapper} from "../../../../components/Form";
import {I18n} from '../../../../lib/i18n';

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
class PruchaseOrderFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		props.normalRef && props.normalRef(this);
		this.getForm = this.getForm.bind(this);
		this.clear = this.clear.bind(this);
		this.search = this.search.bind(this);
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
			providerArr:[]
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
		},()=>this.props.expandFilter(null, this.refs.pruchaseorderHarder.offsetHeight == 0?1:this.refs.pruchaseorderHarder.offsetHeight))
	}
	search_more = () => {//收缩条件的展开和收缩
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
		},()=>this.props.expandFilter(null, this.refs.pruchaseorderHarder.offsetHeight))
	}
	search(){
		this.props.getPages();
	}
	getForm(){
		return this.props.form.getFieldsValue();
	}
	clear(){
		if(this.props.form.getFieldsValue().mtlId){
			this.refs.productSelect.clear(this.props.getPage);
			this.props.form.resetFields();
		}else {
			this.props.form.resetFields();
			this.props.getPages();
		}
	}
	//点击供应商进行加载数据
	initProvider = () => {
		apiPost(API_FOODING_DS,'/object/getMiniList',{"obj":"com.fooding.fc.ds.entity.Vendor"}, response => {
			this.setState({providerArr:response.data})
		},error => console.log(error.message))
	}

	render(){
		let domFilter;
		const { getNFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400049/*业务状态*/)}</label>
						<Select
							animation='slide-up'
							placeholder={''}
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							{...getNFieldProps('status',{
							})}
						>
						{
							[{id:'',name:i18n.t(400051/*不限*/)},{id:1,name:i18n.t(300039/*草稿*/)},{id:5,name:i18n.t(200258/*已提交*/)},{id:10,name:i18n.t(400053/*已审批*/)}].map((e,i) => {
								return <Option key={i} value={String(e.id)} title={e.name}>{e.name}</Option>
							})
						}
						</Select>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400048/*单据编号*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder="" 
						{...getNFieldProps('no',{
							initialValue:''
						})}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400008/*销售单号*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder="" 
								{...getNFieldProps('sourceNo',{
									initialValue:''
								})}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100312/*供应商*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							
							optionLabelProp="children"
							{...getNFieldProps('vndBeId',{
							})}
							onClick={this.initProvider}
						>
						{
							this.state.providerArr.map((e,i) => {
								return <Option value={e.id} title={e.localName} key={i}>{e.localName}</Option> 
							})
						}
						</Select>
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(400037/*采购员*/)}</label>
						<input 
											    type="text"
												{...getNFieldProps('purStaffLcName',{
												
												initialValue:''})}
												style ={{float:'right',width:'200px'}}
												className={'text-input-filter-header'}
												onKeyDown={(e)=>{
                                                    if(e.keyCode == 13){this.search()}
                                                }}
						/>
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(500061/*产品名称*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder="" 
							{...getNFieldProps('mtlLcName',{
								initialValue:''
							})}
							onKeyDown={(e)=>{
                               if(e.keyCode == 13){this.search()}
                            }}
						/>
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(500320/*产品英文名称*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder="" 
							{...getNFieldProps('mtlEnName',{
								initialValue:''
							})}
							onKeyDown={(e)=>{
                               if(e.keyCode == 13){this.search()}
                            }}
						/>
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(100385/*海关编码*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder="" 
							{...getNFieldProps('hsCode',{
								initialValue:''
							})}
							onKeyDown={(e)=>{
                               if(e.keyCode == 13){this.search()}
                            }}
						/>
					</div>
					<div className={'filter-header-key'}>
						<span className="search"><i className="foddingicon fooding-search_icon" onClick = {this.search}></i></span>
						<span className="clean"><i className="foddingicon fooding-clean_icon" onClick={this.clear}></i></span>
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
		return(<div className={'clientcontact-list-header'} ref="pruchaseorderHarder">{domFilter}</div>)
	}
}
PruchaseOrderFilterHeader = createForm()(PruchaseOrderFilterHeader);
export default PruchaseOrderFilterHeader;
