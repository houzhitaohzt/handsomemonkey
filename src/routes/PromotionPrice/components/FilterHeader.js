import i18n from '../../../lib/i18n';
import React,{Component, PropTypes} from "react";
//引入select插件
import xt from '../../../common/xt';
import {createForm,FormWrapper} from "../../../components/Form";
import Select, {Option,ConstMiniSelect} from '../../../components/Select';
import ProductSelect from '../../../components/FindGridSelect';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP} from '../../../services/apiCall';
class ProductFilterHeader extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.show_hide_filter=this.show_hide_filter.bind(this);
		this.search_more=this.search_more.bind(this);
		props.normalRef && props.normalRef(this);
		this.getForm = this.getForm.bind(this);
		this.clear = this.clear.bind(this);
		this.search = this.search.bind(this);
	}
	search(){
		this.props.getPage(this.props.form.getFieldsValue());
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
			this.props.getPage({});
		}
	}

	initState(){
		return{
			expand:false,
			showFilter:'comb-panel',
			expandClassName:'unfold',
			minor:'filter-header-information-pre hidden',
			clientArray:[],
			qiyunArray:[], // 起运港|目的港
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

	// 起运港|目的港
	qiyunClick =()=>{
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Statn',
			queryParams:[{
			attr:"statnTyId",
			expression:"=",
			value:10
		}]
		},
			(response)=>{
				that.setState({
					qiyunArray:response.data
				})
		},(error)=>{

		});
	}

	render(){
		let domFilter;
		let {getNFieldProps,getFieldValue,getFieldProps}= this.props.form;

		if(this.state.showFilter==='comb-panel'){
			domFilter=(
				<div className={'filter-header'}>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100312/*供应商*/)}</label>
						<input placeholder=''
							type="text" {...getFieldProps('ccName', {
								initialValue: undefined
							})}
							className={'text-input-filter-header'}
							   onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.search()}
                               }}
						/>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100379/*产品*/)}</label>
						<div style ={{float:'right',width:'200px'}}>
							<ProductSelect
							    ref ="productSelect"
								form={this.props.form}
								width={'379%'}
								className={'currency-btn select-from-currency text-input-nowidth'}
								titleClass={"col-md-12 col-lg-12"}
								url='/material/search'
							/>
						</div>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100297/*起运港*/)}</label>
							<Select
								{...getNFieldProps('sStatnId',{
									//rules: [{required:true}],
									//initialValue:undefined
								})}
								placeholder=''
								optionLabelProp="children"
								style={{width:190}}
								className ={'currency-btn select-from-currency'}
								onClick={this.qiyunClick}
							>
								{this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, sStatnId: o.id}} title={o.localName}>{o.localName}</Option>)}
		
							 </Select>
					</div>
					<div className={'filter-header-information-pre'}>
						<label>{i18n.t(100298/*目的港*/)}</label>
						<Select
							{...getNFieldProps('eStatnId',{
								//rules: [{required:true}],
								//initialValue:undefined
							})}
							placeholder=''
							optionLabelProp="children"
							style={{width:190,marginRight:10}}
							className ={'currency-btn select-from-currency'}
							onClick={this.qiyunClick}
						>
							{this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, eStatnId: o.id}} title={o.localName}>{o.localName}</Option>)}
						</Select>
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
		return(<div className={this.props.id?'none':'product-list-header'} ref='header'>{domFilter}</div>)
	}
}
export default createForm()(ProductFilterHeader);
