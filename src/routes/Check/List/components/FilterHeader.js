import i18n from './../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../../components/Select'; // 下拉
//引入select插件
import {createForm,FormWrapper} from "../../../../components/Form";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax} from '../../../../services/apiCall';
import {I18n} from '../../../../lib/i18n';
class ProviderFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search_more=this.search_more.bind(this);
		this.getForm = this.getForm.bind(this);
		this.search = this.search.bind(this);
		this.clean=this.clean.bind(this);
		props.normalRef && props.normalRef(this);
		// init onClick
		this.handleWarehouse = this.handleWarehouse.bind(this);	 // 地区 click
		this.handleReservoir = this.handleReservoir.bind(this);	 // 
		this.handleWaterLevel = this.handleWaterLevel.bind(this);	 // 
		this.handleSupplierSource = this.handleSupplierSource.bind(this);	 // 
		this.handleMaterialStatus = this.handleMaterialStatus.bind(this);	 //
		this.handleProduct = this.handleProduct.bind(this);	 //
		this.handleBrand = this.handleBrand.bind(this);	 //
			
			


	}

	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',

			warehouse:  [{id:1,name:''}], // 仓库
			reservoir:  [{id:1,name:''}], // 库区
			waterLevel:  [{id:1,name:''}], // 储位
			product:  [{id:1,name:''}], // 产品
			brand:  [{id:1,name:''}], // 品牌
			supplierSource:  [{id:1,name:''}], // 原供应商
			materialStatus:  [{id:1,name:''}], // 物料状态
			

		}
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
		}
		this.setState({
            expandClassName: classN, minor: classMinor
        }, ()=>this.props.expandFilter(null, this.refs.header.offsetHeight));
	}

	// 仓库 click
	handleWarehouse(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.warehouse,
			(response)=>{							
				this.setState({	warehouse: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 库区 click
	handleReservoir(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.reservoir,
			(response)=>{							
				this.setState({	reservoir: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 储位 click
	handleWaterLevel(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.waterLevel,
			(response)=>{							
				this.setState({	waterLevel: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 原供应商 click
	handleSupplierSource(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.supplierSource,
			(response)=>{							
				this.setState({	supplierSource: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 物料状态 click
	handleMaterialStatus(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.materialStatus,
			(response)=>{							
				this.setState({	materialStatus: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 产品 click
	handleProduct(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.product,
			(response)=>{							
				this.setState({	product: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 品牌 click
	handleBrand(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.brand,
			(response)=>{							
				this.setState({	brand: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 查找
	search(){
		this.props.getPage();
	}
	getForm(){
		return this.props.form.getFieldsValue();
	}
	clean(){
		this.props.form.resetFields()
		this.props.getPage({no:''});
	}


	render(){
		let domFilter;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400025/*仓库*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							{...getNFieldProps('slId',{
								initialValue:undefined
							})}
							onClick={this.handleWarehouse}
							>
							{this.state.warehouse.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>
					</div>	
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400026/*库区*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							{...getNFieldProps('stId',{
								initialValue:undefined
							})}
							onClick={this.handleReservoir}
							>
							{this.state.reservoir.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(400027/*储位*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							{...getNFieldProps('slspId',{
								initialValue:undefined
							})}
							onClick={this.handleWaterLevel}
							>
							{this.state.waterLevel.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>
					</div>	
					<div className={this.state.minor}>
						<label>{i18n.t(100379/*产品*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							{...getNFieldProps('mtlId',{
								initialValue:undefined
							})}
							onClick={this.handleProduct}
							>
							{this.state.product.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>
					</div>	
					<div className={this.state.minor}>
						<label>{i18n.t(400012/*品牌*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							{...getNFieldProps('brandId',{
								initialValue: undefined
							})}
							onClick={this.handleBrand}
							>
							{this.state.brand.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>
					</div>									
					<div className={this.state.minor}>
						<label>{i18n.t(400028/*原供应商*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							{...getNFieldProps('vndBeId',{
								initialValue: undefined
							})}
							onClick={this.handleSupplierSource}
							>
							{this.state.supplierSource.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>
					</div>
					<div className={this.state.minor}>
						<label>{i18n.t(400030/*物料状态*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							{...getNFieldProps('mStatsIds',{
								initialValue:undefined
							})}
							onClick={this.handleMaterialStatus}
							>
							{this.state.materialStatus.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
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
		return(<div className={'clientcontact-list-header'} ref="header">{domFilter}</div>)
	}
}
ProviderFilterHeader = createForm()(ProviderFilterHeader);
export default ProviderFilterHeader;
