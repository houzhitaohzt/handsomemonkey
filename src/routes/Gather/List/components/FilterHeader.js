import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
import Select, { Option } from '../../../../components/Select'; // 下拉
import {createForm,FormWrapper} from "../../../../components/Form";
import {I18n} from '../../../../lib/i18n';
import ProductSelect, {CustomerFind} from "../../../../components/FindGridSelect";
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ES,API_FOODING_ERP,language,commonAjax} from '../../../../services/apiCall';
class ProductFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.getForm = this.getForm.bind(this);
		props.normalRef && props.normalRef(this);
		this.search = this.search.bind(this);
		this.clean=this.clean.bind(this);
		this.show_hide_filter=this.show_hide_filter.bind(this);
		
		this.kehuClick= this.kehuClick.bind(this);
		this.handleEnterprise = this.handleEnterprise.bind(this); //企业
	}
	static propTypes={
		expand:PropTypes.bool,
		expandFilter:PropTypes.func
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
			kehuArray:[],
			Enterprise:  [{id:1,name:''}], // 企业
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
	// 企业 click
	handleEnterprise(){
		var that = this;
		apiGet(API_FOODING_ES,'/party/getLoginCompanies',{},
			(response)=>{							
				this.setState({	Enterprise: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}
	
	kehuClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Customer'},
			(response)=>{							
				this.setState({	
					kehuArray: response.data 
				});
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
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
	render(){
		let domFilter;
		const {getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
					<div className={'filter-header'}>
						<div className={'filter-header-information-pre'}>
							<label>{i18n.t(400048/*单据编号*/)}</label>
							<input 
												    type="text"
												    style={{width:200}}
													{...getFieldProps('no',{
													validateFirst: true,
													rules: [{required:true}],
													initialValue:''})}
													className={'text-input-nowidth'}
													onKeyDown={(e)=>{
                                                        if(e.keyCode == 13){this.search()}
                                                    }}
								/>
						</div>
						<div className={'filter-header-information-pre'}>
							<label>{i18n.t(500129/*源单编号*/)}</label>
							<input 
												    type="text"
												    style={{width:200}}
													{...getFieldProps('sourceNo',{
													validateFirst: true,
													rules: [{required:true}],
													initialValue:''})}
													className={'text-input-nowidth'}
													onKeyDown={(e)=>{
                                                        if(e.keyCode == 13){this.search()}
                                                    }}
								/>
						</div>
						<div className={'filter-header-information-pre'}>
							<label>{i18n.t(100311/*客户*/)}</label>
							<div style ={{float:'right',width:'200px'}}>
                            <CustomerFind
                                form={this.props.form}
                                fieldName='salBeId'
                                style={{width: 200}}
                                apiUri='/customer/search'
                                async clearable
                                apiParams='keyword'
                            />
                        </div>
						</div>
						<div className={'filter-header-information-pre'}>
							<label>{i18n.t(400049/*业务状态*/)}</label>
							<Select
								{...getNFieldProps('status',{
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
								<Option key={1} value={'1'} title={i18n.t(200616/*未处理*/)}>{i18n.t(200616/*未处理*/)}</Option>
								<Option key={2} value={'5'} title={i18n.t(200485/*处理中*/)}>{i18n.t(200485/*处理中*/)}</Option>
								<Option key={3} value={'10'} title={i18n.t(200619/*已处理*/)}>{i18n.t(200619/*已处理*/)}</Option>
							</Select>
						</div>
						<div className={this.state.minor} style={{display:"none"}}>
							<label>{i18n.t(500083/*收款企业*/)}</label>
		                        <Select
									animation='slide-up'
									style={{width:200}}
									className ='currency-btn select-from-currency'
									prefixCls="rc-select-filter-header"
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
									placeholder=""
									{...getNFieldProps('receiptCcId',{
										initialValue: undefined
									})}
									onClick={this.handleEnterprise}
									>
									{this.state.Enterprise.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
								</Select>
					</div>	
						<div className={'filter-header-key'}>
							<span className="search"><i className="foddingicon fooding-search_icon" onClick={this.search}></i></span>
							<span className="clean"><i className="foddingicon fooding-clean_icon" onClick={this.clean}></i></span>
							
						</div>
						<div className={this.state.showFilter}>
							<span className="screen" onClick={this.show_hide_filter
							}><i className="foddingicon fooding-screen_icon"></i></span>
						</div>
					</div>
				)
		}else{
			domFilter=(<div className={this.state.showFilter}>
					<span className="screen" onClick={this.show_hide_filter
					}><i className="foddingicon fooding-screen_icon"></i></span>
				</div>)
		}
		return(<div className={'product-list-header'} ref="header">{domFilter}</div>)
	}
}
ProductFilterHeader = createForm()(ProductFilterHeader);
export default ProductFilterHeader;