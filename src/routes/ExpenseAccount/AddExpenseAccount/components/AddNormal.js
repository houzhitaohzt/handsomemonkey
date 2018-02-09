import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import {createForm,FormWrapper} from '../../../../components/Form';
import Calendar from  '../../../../components/Calendar/Calendar';

import  SelectChange from "../../../../components/SelectChange";


// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { ConstVirtualSelect,Option } from '../../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,toDecimal} from '../../../../services/apiCall';
import {I18n} from "../../../../lib/i18n";
import i18n from './../../../../lib/i18n';

import Confirm from '../../../../components/Dialog/Confirm';//删除弹层


class Addnormal extends Component{

	constructor(props){
		super(props);
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		props.normalRef && props.normalRef(this);
		this.saveClick = this.saveClick.bind(this);

		// init func
		this.handleCurrency = this.handleCurrency.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onBack = this.onBack.bind(this);
		
		this.searchEnterprise = this.searchEnterprise.bind(this);
		this.searchUnit = this.searchUnit.bind(this);
		this.changeSourceType = this.changeSourceType.bind(this);
		

		// init state
		this.state=this.initState();		
		


	}
	initState(){
		return {
			radioState:'',
			radioAddress:'',
			chuangArray:[],
			qiyunArray:[],
			info:[],
			getOneData: {},//this.props.getOneData,
			currency: [{id:1,localName:''}], // 币种
			searchEnterprise: [{enterpriseId:1,['enterprise'+language]:''}], // 付款企业
			searchUnit: [{id:1,localName:''}], // 收款单位

		}
	}
	StateChange(e){
		let tex;
		tex = e.target.value;
		this.setState({
			radioState:tex
		})
	}
	AddressChange(e){
		let addres;
		addres = e.target.value;
		this.setState({
			radioAddress:addres
		})
	}

	componentDidMount(){

	}
	saveClick(isclose,initAjax){
		var that = this;
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
	      		if(that.state.data.billId){
	      			value = Object.assign({},this.state.data,value);
	      		}
	      		if(this.props.id){
	      			value=Object.assign({},value,{billId:this.props.id});
	      			that.props.saveClick(value,isclose,initAjax);
	      		}else {
	      			that.props.saveClick(value,isclose,initAjax);
	      		}
			}
	      	
    	});

	}

	// 币种 ajax 
	handleCurrency(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.currency,
			(response)=>{							
				this.setState({	currency:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 往来户 公共接口
	// 付款企业	
	searchEnterprise(){
		let {getOneData} = this.props;
		apiGet(API_FOODING_DS,'/partner/getListBySourceId',{sourceId: getOneData['ccId'],dataTyId:60,isAddSelf:true},
			(response)=>{							
				this.setState({	searchEnterprise: response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}	

	// 收款单位
	searchUnit(){
		apiGet(API_FOODING_ES,'/party/getLoginCompanies',{},
			(response)=>{	
				this.setState({	searchUnit: response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 源单类型 切换 
	changeSourceType(e){
		// if( this.props.getOneData['billId'] ){
		// 	this.props.onSaveAndClose();
		// }
	}


	// 保存
	onSaveAndClose(callBack,type){

		let that = this;
		const {location,router,navReplaceTab,form, onSaveAndClose,getOneData} = that.props;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_ERP,'/charge/save',Object.assign({},getOneData,value),
					(response)=>{	
						that.setState({ billId: response.data },function(){
							callBack(response);

							// 页面跳转
							if( type == 'object' ) {
								Confirm(i18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5,done:()=>{
									navReplaceTab({id:13,name:I18n.t(600073/*报销单详情*/),component:I18n.t(600073/*报销单详情*/),url:'/expenseaccount/detail'});
									router.push({ pathname: '/expenseaccount/detail',query:{id:location.query['id'] || that.state['billId'],billType:getOneData['billType']}});						
								}}); 
							} else{
								ServiceTips({text:response.message,type:'success'});
							}

					});
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});		
	}

	// 返回
	onBack() {
	
		let billId = this.props.location.query.id;
		let {getOneData} = this.props;
		if(billId){
			this.props.navReplaceTab({name:I18n.t(600073/*报销单详情*/),component:I18n.t(600073/*报销单详情*/),url:'/expenseaccount/detail'});
			this.props.router.push({pathname: '/expenseaccount/detail', query: {id: billId,billType:getOneData['billType']}});
		} else {
			this.props.navReplaceTab({name:I18n.t(600079/*报销单*/),component:I18n.t(600079/*报销单*/),url:'/expenseaccount/list'});
			this.props.router.push({pathname: '/expenseaccount/list'});
		}
	}


	render(){

		let that = this;
		let {getNFieldProps,getFieldProps,getFieldError} = this.props.form;
		let {getOneData} = this.props;
		
		const {radioAddress, radioState} = this.state;	
		let title = {title_1:I18n.t(100315/*约会目的*/),title_2:I18n.t(400005/*约会地址*/)};

						
		return(
			<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span></span>
					<span onClick={this.onBack}><i className={'foddingicon fooding-back'}></i></span>
					<span onClick={this.props.onSaveAndClose}><i className={'foddingicon fooding-save'}></i></span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400048/*单据编号*/)}</label>
							<input type="text"
								readOnly  
								className ={'col-md-8 col-lg-8 text-input-nowidth'}															
								placeholder={getOneData.no} 
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<Calendar 
									width={'100%'}  
									showTime = {false} 
									isShowIcon={true} 
									form={this.props.form}
									validate={true}
									className ={getFieldError('billDate')?'error-border':''}
									name={'billDate'}
									value={getOneData['billDate']}												
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400049/*业务状态*/)}</label>
							<input type="text"
								readOnly
								placeholder={getOneData.statusName} 																
								className ={'col-md-8 col-lg-8 text-input-nowidth'}															
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100284/*币种*/)}</label>
							<Select
								{...getNFieldProps('cnyId',{
									rules: [{required:true}],
									initialValue: getOneData['cnyId'] ? 
													{ s_label: getOneData['cny'+language], cnyId: getOneData.cnyId, cnyLcName: getOneData.cnyLcName, cnyEnName: getOneData.cnyEnName} 
													: 
													'',
								})}
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								disabled={(getOneData['billId']) ? true : false}
								className ={getFieldError('cnyId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
								onClick={this.handleCurrency}
							>
								{this.state.currency.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500146/*源单类型*/)}</label>
							<Select
								{...getNFieldProps('sourceType',{
									rules: [{required:true}], 
									initialValue: getOneData['sourceType'] ? String(getOneData['sourceType']) : '318'								
								})} 
								placeholder=''
								optionLabelProp="children"
								className ={getFieldError('sourceType')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
								disabled={(this.props.location.query['id'] || this.props['sourceResult']) ? true : false}
								onSelect={this.changeSourceType}
								allowClear={false}
							>
								<Option key={0} value={'318'} title={I18n.t(200400/*销售单*/)}>{I18n.t(200400/*销售单*/)}</Option>								
								<Option key={0} value={'323'} title={I18n.t(100332/*市场活动*/)}>{I18n.t(100332/*市场活动*/)}</Option>
								<Option key={0} value={'301'} title={I18n.t(100321/*商机*/)}>{I18n.t(100321/*商机*/)}</Option>
								<Option key={0} value={'939'} title={'销售样品单'}>{'销售样品单'}</Option>
								<Option key={0} value={'338'} title={I18n.t(200401/*采购单*/)}>{I18n.t(200401/*采购单*/)}</Option>
								<Option key={0} value={'350'} title={I18n.t(200373/*物流订单*/)}>{I18n.t(200373/*物流订单*/)}</Option>
								<Option key={0} value={'1015'} title={I18n.t(200535/*其他*/)}>{I18n.t(200535/*其他*/)}</Option>
							</Select>							
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500050/*付款企业*/)}</label>							
							<Select
								{...getNFieldProps('payCcId',{
									rules: [{required:true}],
									initialValue: getOneData['payCcId'] ? 
													{ s_label: getOneData['payCc'+language], payCcId: getOneData.payCcId, payCcLcName: getOneData.payCcLcName, payCcEnName: getOneData.payCcEnName} 
													: 
													'',
								})}
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								className ={getFieldError('payCcId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
								onClick={that.searchEnterprise}																									
							>
								{this.state.searchEnterprise.map((o,i)=><Option key={i} objValue={{s_label:o['enterprise'+language], payCcId:o.enterpriseId, payCcLcName:o['enterprise'+language], payCcEnName:o.name}} title={o['enterprise'+language]}>{o['enterprise'+language]}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400084/*收款单位*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								fieldName='receiptBeId'
								apiUri='/enterprise/search'
								async clearable 
								apiParams='keyword'
								apiType={apiPost}
								initialValue={{
									receiptBeId: getOneData['receiptBeId'],
									receiptBeLcName: getOneData['receiptBeLcName'],
									receiptBeEnName: getOneData['receiptBeEnName'],
									s_label: getOneData['receiptBe'+language],
								}}
								valueKeys={ da => ({
									receiptBeId: da.id,
									receiptBeLcName: da.localName,
									receiptBeEnName: da.name,
									basSpeci: da.specTxt,
									s_label: da.localName
								})}									
							/>							
							{/*<Select
								{...getNFieldProps('receiptBeId',{
									rules: [{required:true}],
									initialValue: getOneData['receiptBeId'] ? 
													{ s_label: getOneData['receiptBe'+language], receiptBeId: getOneData.receiptBeId, receiptBeLcName: getOneData.receiptBeLcName, receiptBeEnName: getOneData.receiptBeEnName} 
													: 
													'',
								})}
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								className ={getFieldError('receiptBeId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
								onClick={that.searchUnit}																								
							>
								{this.state.searchUnit.map((o,i)=><Option key={i} objValue={{s_label:o.localName, receiptBeId:o.id, receiptBeLcName:o.localName, receiptBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>*/}
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(200402/*报销人*/)}</label>
							<input type="text"
								readOnly
								placeholder={getOneData['payStaff'+language]} 																
								className ={'col-md-8 col-lg-8 text-input-nowidth'}															
							/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(600085/*报销合计*/)}</label>
							<input type="text"
								readOnly  
								className ={'col-md-8 col-lg-8 text-input-nowidth'}															
								placeholder={toDecimal(getOneData.costAmt) || I18n.t(100378/*自动生成*/)} 
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100336/*备注*/)}</label>
							<input type="text"
								{...getNFieldProps('remark',{
									initialValue: getOneData['remark'] || '' 
								})}
								className ={'col-md-8 col-lg-8 text-input-nowidth'}															
								placeholder={getOneData.remark || ''} 
							/>
						</div>						
					</div>
				</div>
			</div>
		)
	}
}
const ProductForm =createForm()(Addnormal);
export default ProductForm;
