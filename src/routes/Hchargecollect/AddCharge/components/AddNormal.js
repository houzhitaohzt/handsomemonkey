import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import {createForm,FormWrapper} from '../../../../components/Form';
import Calendar from  '../../../../components/Calendar/Calendar';
import xt from '../../../../common/xt'; // 下拉
import  SelectChange from "../../../../components/SelectChange";
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { ConstVirtualSelect,Option,ConstMiniSelect } from '../../../../components/Select'; // 下拉
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,toDecimal} from '../../../../services/apiCall';
import {I18n} from "../../../../lib/i18n";
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import WebData from '../../../../common/WebData';
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
			ccidArray: [], // 付款企业
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
	// 收款企业	
	searchEnterprise(e){
		var that =this;
		apiGet(API_FOODING_ES,'/party/getLoginCompanies',{},(response)=>{
			that.setState({
				ccidArray:response.data
			});
		},(errors)=>{

		})
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

				apiPost(API_FOODING_ERP,'/chargecollect/save',Object.assign({},getOneData,value),
					(response)=>{	
						that.setState({ billId: response.data },function(){
							callBack(response);

							// 页面跳转
							if( type == 'object' ) {
								Confirm(i18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5,done:()=>{
									navReplaceTab({id:13,name:I18n.t(200410/*费用单详情*/),component:I18n.t(200410/*费用单详情*/),url:'/hchargecollect/detail'}); 
									router.push({ pathname: '/hchargecollect/detail',query:{id:location.query['id'] || that.state['billId'],billType:getOneData['billType']}});								
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
			this.props.navReplaceTab({name:I18n.t(500247/*费用归集详情*/),component:I18n.t(500247/*费用归集详情*/),url:'/hchargecollect/detail'});
			this.props.router.push({pathname: '/hchargecollect/detail', query: {id: billId,billType:getOneData['billType']}});
		} else {
			this.props.navReplaceTab({name:I18n.t(500248/*费用归集*/),component:I18n.t(500248/*费用归集*/),url:'/hchargecollect/list'});
			this.props.router.push({pathname: '/hchargecollect/list'});
		}
	}

	render(){
		let that = this;
		let {getNFieldProps,getFieldProps,getFieldError,getFieldValue} = this.props.form;
		let {getOneData} = this.props;
		let ccLocalName = WebData.user.data.staff.company.localName;
		let ccenName  =   WebData.user.data.staff.company.enName;
		let Cid = WebData.user.data.staff.company.id;
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
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400049/*业务状态*/)}</label>
							<input type="text"
								readOnly
								placeholder={getOneData.statusName} 																
								className ={'col-md-8 col-lg-8 text-input-nowidth'}															
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100284/*币种*/)}</label>
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
								className ={getFieldError('cnyId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
								onClick={this.handleCurrency}
							>
								{this.state.currency.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500083/*收款企业*/)}</label>						
							<ConstVirtualSelect
							                        placeholder=""
							                        form={this.props.form}
							                       fieldName='receiptCcId'
							                        apiHost={API_FOODING_ES}
							                        apiUri='/party/getLoginCompanies'
							                        apiParams={{}}
							                        	    
							                         initialValue={xt.initSelectValue(ccLocalName,{s_label:ccLocalName,receiptCcId:Cid,receiptCcLcName:ccLocalName,receiptCcEnName:ccenName},['receiptCcId','receiptCcLcName','receiptCcEnName'], 's_label', this.props.form)}
							                        valueKeys={ da => ({
												     
												        receiptCcId: da.id,
												        receiptCcLcName: da.localName,
												        receiptCcEnName: da.name,
												        s_label: da.localName
												    })}
												     rules
							                        className ={'currency-btn select-from-currency col-md-8 col-lg-8'}  
							                    />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500241/*付款单位*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								fieldName='payBusinessId'
								apiUri='/enterprise/search'
								async clearable 
								apiParams='keyword'
								errorTipsType={2}
								apiType={apiPost}
								initialValue={
                                                 	xt.initSelectValue(getOneData.payBusinessId , getOneData, ['payBusinessId', 'payBusinessLcName', 'payBusinessEnName'], "payBusiness"+language, this.props.form)
                                                 }								
								valueKeys={ da => ({
									payBusinessId: da.platformPartyId,
									payBusinessLcName: da.localName,
									payBusinessEnName: da.name,
									s_label: da.localName
								})}								
							/>							
							
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100370/*联系人*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean(getFieldValue('payBusinessId', {}).payBusinessId)}
                                                 refreshMark={getFieldValue('payBusinessId', {}).payBusinessId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_ES, uri: '/user/getUsersByPartyId',
                                                     params: {partyId:getFieldValue('payBusinessId', {}).payBusinessId,typeAttributeId:43}
                                                 }} fieldName="bizLinkId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOneData.bizLinkId && getFieldValue('payBusinessId', {}).payBusinessId === getOneData.payBusinessId, getOneData, ['bizLinkId', 'bizLinkLcName', 'bizLinkEnName'], "bizLink"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     bizLinkId: da.refId,
                                                     bizLinkLcName: da.staffLocalName,
                                                     bizLinkEnName: da.staffName,
                                                     s_label: da["staffLocalName"]
                                                 }}>{da.staffLocalName}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500242/*制单人*/)}</label>
							<input type="text"
								readOnly
								placeholder={getOneData['reStaff'+language]} 																
								className ={'col-md-8 col-lg-8 text-input-nowidth'}															
							/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500244/*纸质发票*/)}</label>
							<input type="text"
								type="text" {...getFieldProps('paperNo', {
						                initialValue:getOneData.paperNo?toDecimal(getOneData.paperNo):''
						            })}
								className ={'col-md-8 col-lg-8 text-input-nowidth'}															 
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500249/*合计费用*/)}</label>
							<input type="text"
								readOnly  
								className ={'col-md-8 col-lg-8 text-input-nowidth'}															
								placeholder={toDecimal(getOneData.totalAmt)} 
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100336/*备注*/)}</label>
							<input type="text"
								{...getNFieldProps('remark',{
									initialValue: getOneData['remark'] || '' 
								})}
								className ={'col-md-8 col-lg-8 text-input-nowidth'}															
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
