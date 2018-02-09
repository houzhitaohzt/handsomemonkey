import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";

//引入select插件
import Select, {Option,ConstVirtualSelect} from '../../../../components/Select';
import {createForm,FormWrapper} from "../../../../components/Form";
import {I18n} from '../../../../lib/i18n';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
class PruchaseReturnFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
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
		})
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
		},()=>this.props.expandFilter(null, this.refs.header.offsetHeight==0?1:this.refs.header.offsetHeight))
	}
	serchClick = () => {//过滤条件 点击搜索
		const { form } = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.serchClick(this.props.form.getFieldsValue());
			}
		}, ()=>this.props.expandFilter(null, this.refs.header.offsetHeight))
	}
	cleanClick = () => {//清空过滤条件 按钮清空
		const { form } = this.props;
		this.props.form.resetFields();
		this.props.cleanClick();
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
						<label>{i18n.t(400008/*销售单号*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder="" 
						{...getNFieldProps('sourceNo',{
							initialValue:''
						})}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.serchClick()}
                               }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400055/*纸质发票号*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder="" 
							{...getNFieldProps('paperNo',{
								initialValue:''
							})}

							onKeyDown={(e)=>{
                                if(e.keyCode == 13){this.serchClick()}
                            }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100311/*客户*/)}</label>
						<ConstVirtualSelect
                                    style={{width: 200}}
                                    form={this.props.form}
                                    fieldName='salBeId'
                                    apiUri='/customer/search'
                                    async clearable
                                    apiParams='keyword'
                                    valueKeys={ da => ({
                                        salBeId: da.id,
                                        salBeLcName: da.localName,
                                        salBeEnName: da.name,
                                        s_label: da.localName
                                    })}
                        />
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(400011/*销售员*/)}</label>
						<input type="text" className={'text-input-filter-header'} placeholder="" 
								{...getNFieldProps('saleStaffLcName',{
									initialValue:''
								})}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.serchClick()}
                               }}
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
		return(<div className={'clientcontact-list-header'} ref='header'>{domFilter}</div>)
	}
}
PruchaseReturnFilterHeader = createForm()(PruchaseReturnFilterHeader);
export default PruchaseReturnFilterHeader;
