import {I18n } from '../../../lib/i18n';
import i18n from '../../../lib/i18n';
import WebData from '../../../common/WebData';
import xt from '../../../common/xt'; // 下拉
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
// common 
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option,ConstVirtualSelect } from '../../../components/Select'; // 下拉
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,API_FOODING_ES} from '../../../services/apiCall';
export class SploadcostPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		// state Func
		this.handleServbeType = this.handleServbeType.bind(this); //监装机构
		this.handleCurrency = this.handleCurrency.bind(this); // 币种
		this.onSaveAndClose = this.onSaveAndClose.bind(this); // 保存
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.onCancel = this.onCancel.bind(this)
		var that = this;
		this.state = {
			ServbeType: [{id:1,localName:''}],																																											
			currency: [{id:1,localName:''}],						
		}
	}
	getData(value,that){
		this.addSelect = that;
	}
	onSaveAdd(){
		this.onSaveAndClose(true);
	}
	// 保存
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				if(this.props.DialogContent == 1){
					let params = this.props.form.getFieldsValue();
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.props.checkedData,isAdd);
				}

				
			}
		})
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	// 监装机构 ajax 
	handleServbeType(){
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.ServBe',queryParams:[{attr:'beDataMulDivIds',expression:'oin',value:70}]},
			(response)=>{					
				this.setState({	ServbeType:response.data });
			},(errors)=>{
				ServiceTips({ text:errors.message,type:'error' });
		});
	}
	// 币种 ajax 
	handleCurrency(){
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Curren'},
			(response)=>{							
				this.setState({	currency:response.data });
			},(errors)=>{
				ServiceTips({ text:errors,type:'error' });
		});
	}
	render(){
		let that = this;
		const { getFieldProps, getNFieldProps, getFieldError,getFieldValue } = this.props.form;
		let {checkedData} = this.props;
		let content = <div></div>;

		// getNFieldProps('optlock', {
		// 	initialValue: checkedData ? checkedData['optlock'] : '',
		// });
		let ccLocalName = WebData.user.data.staff.company.localName;
		let ccenName  =   WebData.user.data.staff.company.enName;
		let Cid = WebData.user.data.staff.company.id;

		let LocalName = WebData.user.data.staff.localName;
		let LocalEname = WebData.user.data.staff.enName;
		let Ccid = WebData.user.data.staff.id;
		if(this.props.DialogContent == 1){
           content = (
           <div className={'addnormal'} style={{marginBottom:'10px'}}>
           	<div className={'girdlayout'}>
           									<div className="row">
           										<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500259/*发布企业*/)}</label>
														<ConstVirtualSelect
								                        placeholder=""
								                        form={this.props.form}
								                       fieldName='ccId'
								                        apiHost={API_FOODING_ES}
								                        apiUri='/party/getLoginCompanies'
								                        apiParams={{}}
								                         disabled={true}	    
								                         initialValue={xt.initSelectValue(ccLocalName,{s_label:ccLocalName,ccId:Cid,ccLcName:ccLocalName,ccEnName:ccenName},['ccId','ccLcName','ccEnName'], 's_label', this.props.form)}
								                        valueKeys={ da => ({
													     
													        ccId: da.id,
													         ccLcName: da.localName,
													         ccEnName: da.name,
													        s_label: da.localName
													    })}
													     rules
								                        className ={'currency-btn select-from-currency col-md-8 col-lg-8'}  
								                    />
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200937/*发布人*/)}</label>
													<ConstVirtualSelect
													refreshMark={getFieldValue('ccId',{}).ccId || getFieldValue('ccId')}
							                        placeholder=""
							                        form={this.props.form}
							                         disabled={true}	
							                       fieldName='reStaffId'
							                        apiHost={API_FOODING_ES}
							                        apiUri='/staff/getListByCcId'
							                        apiParams={{
							                            ccid: getFieldValue('ccId',{}).ccId || getFieldValue('ccId')
							                            
							                        }}
							                         initialValue={xt.initSelectValue(LocalName&& getFieldValue("ccId",{}).ccId == Cid,{s_label:LocalName,reStaffId:Ccid,reStaffLcName:LocalName,reStaffEnName:LocalEname},['reStaffId','reStaffLcName','reStaffEnName'], 's_label', this.props.form)}
							                        valueKeys={ da => ({
												         reStaffId: da.id,
												         reStaffLcName: da.localName,
												         reStaffEnName: da.name,
												        s_label: da.localName
												    })}
												     rules
							                        className ={'currency-btn select-from-currency col-md-8 col-lg-8'}  
							                    />
								</div>
           									</div>
           									<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100102/*监装机构*/)}</label>
													<Select
														placeholder=''
														{...getNFieldProps('spLoadBeId',{
															rules: [{required:true}],
															initialValue:undefined								
														})}
														optionLabelProp="children"
														className ={getFieldError('spLoadBeId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
														onClick={this.handleServbeType}
													>
														{this.state.ServbeType.map((o,i)=><Option key={i} objValue={{s_label:o.localName, spLoadBeId: o.id, spLoadBeLcName:o.name, spLoadBeEnName: o.enName}} title={o.localName}>{o.localName}</Option>)}
													</Select> 
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500122/*标准费用*/)}</label>
													<input  type='text' 
															{...getFieldProps('costAggs',{
																rules: [{required:true,pattern:xt.pattern.positiveNonZero}],
																initialValue:''
															})}
															placeholder=''							
															className ={getFieldError("costAggs") ?' col-md-9 col-lg-9 text-input-nowidth error-border' :'col-md-9 col-lg-9 text-input-nowidth'}
													/>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100284/*币种*/)}</label>
													<Select
														placeholder=''
														{...getNFieldProps('cnyId',{
															rules: [{required:true}],
															initialValue:undefined								
														})}
														optionLabelProp="children"
														className ={getFieldError('cnyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
														onClick={this.handleCurrency}
													>
													{this.state.currency.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
													</Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100288/*发布日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
														<Calendar width={'100%'} showTime = {false} 
														isShowIcon={true} form={this.props.form} 
														validate={true}
														name={'reDate'}
																			
														/> 
													</div>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
														<Calendar width={'100%'}   showTime = {false} isShowIcon={true} form={this.props.form} 
														validate={true}						
														name={'sDate'}
														
														/>
													</div>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500120/*终止日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
														<Calendar width={'100%'}  showTime = {false} isShowIcon={true} form={this.props.form}
														validate={true}
														name={'eDate'}
																										
														/>
													</div>
												</div>
											</div>
           	</div>
           	</div>);
		}else if(this.props.DialogContent==3){
			content = (
				<div className={'addnormal'} style={{marginBottom:'10px'}}>
           	<div className={'  girdlayout'}>
           									<div className="row">
           										<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500259/*发布企业*/)}</label>
														<ConstVirtualSelect
								                        placeholder=""
								                        form={this.props.form}
								                       fieldName='ccId'
								                        apiHost={API_FOODING_ES}
								                        apiUri='/party/getLoginCompanies'
								                        apiParams={{}}
								                         disabled={true}	    
								                         initialValue={xt.initSelectValue(checkedData,{s_label:checkedData.ccLcName,ccId:checkedData.ccId,ccEnName:checkedData.ccEnName,ccLcName:checkedData.ccLcName},['ccId','ccLcName','ccEnName'], 's_label', this.props.form)}
								                        valueKeys={ da => ({
													         
													        ccId: da.id,
													         ccLcName: da.localName,
													         ccEnName: da.name,
													        s_label: da.localName
													    })}
													     rules
								                        className ={'currency-btn select-from-currency col-md-8 col-lg-8'}  
								                    />
								</div>
								<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200937/*发布人*/)}</label>
													<ConstVirtualSelect
								                        placeholder=""
								                        form={this.props.form}
								                       fieldName='ccId'
								                        apiHost={API_FOODING_ES}
								                        apiUri='/party/getLoginCompanies'
								                        apiParams={{}}
								                         disabled={true}	    
								                         initialValue={xt.initSelectValue(checkedData,{s_label:checkedData.ccLcName,ccId:checkedData.ccId,ccEnName:checkedData.ccEnName,ccLcName:checkedData.ccLcName},['ccId','ccLcName','ccEnName'], 's_label', this.props.form)}
								                        valueKeys={ da => ({
													         
													        ccId: da.id,
													         ccLcName: da.localName,
													         ccEnName: da.name,
													        s_label: da.localName
													    })}
													     rules
								                        className ={'currency-btn select-from-currency col-md-8 col-lg-8'}  
								                    />
								</div>
           									</div>
           									<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100102/*监装机构*/)}</label>
													<Select
														placeholder=''
														{...getNFieldProps('spLoadBeId',{
															rules: [{required:true}],
															initialValue: checkedData['spLoadBe'+language]? 
																			{ s_label: checkedData['spLoadBe'+language], spLoadBeId: checkedData.spLoadBeId, spLoadBeLcName: checkedData.spLoadBeLcName, spLoadBeLcName: checkedData.spLoadBeLcName}:undefined								
														})}
														optionLabelProp="children"
														className ={getFieldError('spLoadBeId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
														onClick={this.handleServbeType}
													>
														{this.state.ServbeType.map((o,i)=><Option key={i} objValue={{s_label:o.localName, spLoadBeId: o.id, spLoadBeLcName:o.name, spLoadBeEnName: o.enName}} title={o.localName}>{o.localName}</Option>)}
													</Select> 
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500122/*标准费用*/)}</label>
													<input  type='text' 
															{...getFieldProps('costAggs',{
																rules: [{required:true,pattern:xt.pattern.positiveNonZero}],
																initialValue: checkedData['costAggs'] ? checkedData['costAggs'] : ''
															})}
															placeholder={i18n.t(500273/*请输入数字*/)}							
															className ={getFieldError("costAggs") ?' col-md-9 col-lg-9 text-input-nowidth error-border' :'col-md-9 col-lg-9 text-input-nowidth'}
													/>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100284/*币种*/)}</label>
													<Select
														placeholder=''
														{...getNFieldProps('cnyId',{
															rules: [{required:true}],
															initialValue: checkedData['cny'+language] ? 
																			{ s_label: checkedData['cny'+language], cnyId: checkedData.cnyId, cnyLcName: checkedData.cnyLcName, cnyEnName: checkedData.cnyEnName } 
																			: 
																			undefined								
														})}
														optionLabelProp="children"
														className ={getFieldError('cnyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
														onClick={this.handleCurrency}
													>
													{this.state.currency.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
													</Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100288/*发布日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
														<Calendar width={'100%'} showTime = {false} 
														isShowIcon={true} form={this.props.form} 
														validate={true}
														name={'reDate'}
														value={checkedData['reDate']}						
														/> 
													</div>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
														<Calendar width={'100%'}   showTime = {false} isShowIcon={true} form={this.props.form} 
														validate={true}						
														name={'sDate'}
														value={checkedData['sDate']}
														/>
													</div>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500120/*终止日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
														<Calendar width={'100%'}  showTime = {false} isShowIcon={true} form={this.props.form}
														validate={true}
														name={'eDate'}
														value={checkedData['eDate']}												
														/>
													</div>
												</div>
											</div>
           	</div>
           	</div>
			)
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} 
						buttonLeft = {this.props.buttonLeft} 
						onSaveAndClose={this.onSaveAndClose} 
						onSaveAdd={this.onSaveAdd}
					    showSaveAdd={this.props.showSaveAdd}
					    showSaveClose={this.props.showSaveClose}
						onCancel={this.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(SploadcostPlug);
export default ProductForm;
