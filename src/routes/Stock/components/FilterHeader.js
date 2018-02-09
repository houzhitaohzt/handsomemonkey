import React,{Component, PropTypes} from "react";

//引入select插件
import {createForm,FormWrapper} from "../../../components/Form";

//引入时间插件
import DataTime from '../../../components/Calendar/Calendar'




// common 
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax} from '../../../services/apiCall';
import ProductSelect, {CustomerFind} from "../../../components/FindGridSelect";
import {I18n} from "../../../lib/i18n";





class ProviderFilterHeader extends Component{

	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search_more=this.search_more.bind(this);

		// init onClick
		this.handleWarehouse = this.handleWarehouse.bind(this);	 // 地区 click
		this.handleReservoir = this.handleReservoir.bind(this);	 // 
		this.handleWaterLevel = this.handleWaterLevel.bind(this);	 // 
		this.handleSupplierSource = this.handleSupplierSource.bind(this);	 // 
		this.handleMaterialStatus = this.handleMaterialStatus.bind(this);	 //
		this.handleProduct = this.handleProduct.bind(this);	 //
		this.handleBrand = this.handleBrand.bind(this);	 //
		
		  

	
	

		this.searchFunc = this.searchFunc.bind(this);	 // 头部 查询	
		this.resetFunc = this.resetFunc.bind(this);	 // 头部 清空		
			


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
			expandClassName:classN,minor:classMinor
		}, ()=>this.props.expandFilter(null, this.refs.header.offsetHeight))
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
	searchFunc(){
		let that = this;		
		const {form} = this.props;
		let sID = form.getFieldsValue();	
		
		this.props.getPage(Object.assign({},sID));	// 刷新 列表
	}

	// 清空 
	resetFunc(){
		if(this.props.form.getFieldsValue().mtlId){
			this.props.form.resetFields(); // 清除表单
			this.refs.productSelect.clear(this.props.getPage,{});
		}else { 
			this.props.form.resetFields();
			this.props.getPage({});	// 刷新 列表
		}
	}


	render(){
		let domFilter;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(400025/*仓库*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							placeholder=""														
							{...getNFieldProps('slId',{
								initialValue: undefined
							})}
							onClick={this.handleWarehouse}
							>
							{this.state.warehouse.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(500332/*剩余库存*/)}</label>
						<Select
							{...getNFieldProps('surplusStock',{
								initialValue: undefined								
							})} 
							animation='slide-up'
							placeholder=''
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"							
						>
							<Option key={0} value={''} title={I18n.t(100142/*否*/)}>{I18n.t(100142/*否*/)}</Option>
							<Option key={1} value={'1'} title={I18n.t(100141/*是*/)}>{I18n.t(100141/*是*/)}</Option>
						</Select>
					</div>	
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(400026/*库区*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							placeholder=""														
							{...getNFieldProps('stId',{
								initialValue:undefined
							})}
							onClick={this.handleReservoir}
							>
							{this.state.reservoir.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{I18n.t(400027/*储位*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							placeholder=""														
							{...getNFieldProps('slspId',{
								initialValue:undefined
							})}
							onClick={this.handleWaterLevel}
							>
							{this.state.waterLevel.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>
					</div>	
					<div className={this.state.minor}>
						<label>{I18n.t(600057/*有库存*/)}</label>
						<Select
							{...getNFieldProps('inventory',{
								initialValue: undefined								
							})} 
							animation='slide-up'
							placeholder=''
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"							
						>
							<Option key={0} value={''} title={I18n.t(400051/*不限*/)}>{I18n.t(400051/*不限*/)}</Option>						
							<Option key={1} value={'1'} title={I18n.t(100141/*是*/)}>{I18n.t(100141/*是*/)}</Option>
						</Select>
					</div>
					<div className={this.state.minor}>
						<label>{I18n.t(100379/*产品*/)}</label>
						<div style ={{float:'right',width:'200px'}}>
							<ProductSelect 
							    ref ="productSelect"
								form={this.props.form}
								width={'379%'}
								className={getFieldError("mtlId")?"currency-btn select-from-currency text-input-nowidth error-border":'currency-btn select-from-currency text-input-nowidth'}
								titleClass={"col-md-12 col-lg-12"}
								url='/material/search'
							/>
						</div>
					</div>	
					<div className={this.state.minor}>
						<label>{I18n.t(400012/*品牌*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							placeholder=""														
							{...getNFieldProps('brandId',{
								initialValue: undefined
							})}
							onClick={this.handleBrand}
							>
							{this.state.brand.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>
					</div>									
					<div className={this.state.minor}>
						<label>{I18n.t(400028/*原供应商*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							placeholder=""														
							{...getNFieldProps('vndBeId',{
								initialValue: undefined
							})}
							onClick={this.handleSupplierSource}
							>
							{this.state.supplierSource.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>
					</div>
					<div className={this.state.minor}>
						<label>{I18n.t(400030/*物料状态*/)}</label>
						<Select
							animation='slide-up'
							style={{width:200}}
							className ='currency-btn select-from-currency'
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"
							placeholder=""														
							{...getNFieldProps('mStatsIds',{
								initialValue:undefined
							})}
							onClick={this.handleMaterialStatus}
							>
							{this.state.materialStatus.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>
					</div>																									
					<div className={this.state.minor}>
						<label>{I18n.t(600059/*锁库编号*/)}</label>
						<input 
											    type="text"
												{...getFieldProps('lockingNo',{
												
												initialValue:''})}
												style={{width:200}}
												className={'text-input-nowidth'}
												onKeyDown={(e)=>{
                                                    if(e.keyCode == 13){this.searchFunc()}
                                                }}
							/>
                    </div>													
					<div className={'filter-header-key'}>
						<span onClick={this.searchFunc} className="search"><i className="foddingicon fooding-search_icon"></i></span>
						<span onClick={this.resetFunc} className="clean"><i className="foddingicon fooding-clean_icon"></i></span>
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
		return(<div className={'product-list-header'} ref={'header'}>{domFilter}</div>)
	}
}
ProviderFilterHeader = createForm()(ProviderFilterHeader);
export default ProviderFilterHeader;

