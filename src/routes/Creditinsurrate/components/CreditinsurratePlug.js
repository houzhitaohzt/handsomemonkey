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
import {I18n } from '../../../lib/i18n';
import i18n from '../../../lib/i18n';
import WebData from '../../../common/WebData';
import xt from '../../../common/xt'; // 下拉
export class CreditinsurratePlug extends Component{
constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.handleCorporationCompany = this.handleCorporationCompany.bind(this);
		this.handleCorporationType = this.handleCorporationType.bind(this);
		this.handleRiskType = this.handleRiskType.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this); 
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.onCancel = this.onCancel.bind(this)
		this.state = {
			corporationCompany: [{id:1,localName:''}],
			corporationType: [{id:1,localName:''}],
			riskType: [{id:1,localName:''}],
						
		};
	}

	getData(value,that){
		this.addSelect = that;
	}
	onSaveAdd(){
		this.onSaveAndClose(true);
	}

	// 信保公司
	handleCorporationCompany(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.corporationCompany,
			(response)=>{							
				this.setState({	corporationCompany:response.data });
			},(errors)=>{
				ServiceTips({ text:errors.message,type:'error' });
		});		
	}	
	
	// 信保分类
	handleCorporationType(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.corporationType,
			(response)=>{							
				this.setState({	corporationType:response.data });
			},(errors)=>{
				ServiceTips({ text:errors.message,type:'error' });
		});		
	}

	// 风险分类
	handleRiskType(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.riskType,
			(response)=>{							
				this.setState({	riskType:response.data });
			},(errors)=>{
				ServiceTips({ text:errors.message,type:'error' });
		});		
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

	// 取消
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}


	render(){
		let that = this;
		const { getNFieldProps,getFieldProps,getFieldError,getFieldValue} = this.props.form;
		let {checkedData} = this.props;
		let content = <div></div>;
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
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(200729/*信保公司*/)}</label>
							<Select
								
								{...getNFieldProps('creditBeId',{
									rules: [{required:true}],
									initialValue:undefined							
								})} 
								optionLabelProp="children"
								className ={getFieldError('creditBeId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
								onClick={this.handleCorporationCompany}
							>
							{this.state.corporationCompany.map((o,i)=><Option key={i} objValue={{s_label:o.localName, creditBeId: o.id, creditBeLcName:o.localName, creditBeEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select> 
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100189/*信保分类*/)}</label>
							<Select
								
								{...getNFieldProps('corpTyId',{
									rules: [{required:true}],
									initialValue:undefined
																				
								})} 
								optionLabelProp="children"
								className ={getFieldError('corpTyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
								onClick={this.handleCorporationType}
							>
							{this.state.corporationType.map((o,i)=><Option key={i} objValue={{s_label:o.name, corpTyId: o.id}} title={o.name}>{o.name}</Option>)}
							</Select> 
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(200160/*风险分类*/)}</label>
							<Select
								
								{...getNFieldProps('riskTyId',{
									rules: [{required:true}],
									initialValue: undefined							
								})} 
								optionLabelProp="children"
								className ={getFieldError('riskTyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
								onClick={this.handleRiskType}
							>
							{this.state.riskType.map((o,i)=><Option key={i} objValue={{s_label:o.name, riskTyId: o.id }} title={o.name}>{o.name}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(600017/*下限天数*/)}</label>
							<input  type='text' 
								{...getFieldProps('tmLow',{
									rules: [{required:true,pattern:xt.pattern.positiveInteger}],
									initialValue:''
								})}
								
								className ={getFieldError("tmLow") ?'col-md-9 col-lg-9 text-input-nowidth error-border' :'col-md-9 col-lg-9 text-input-nowidth'}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(600018/*上限天数*/)}</label>
							<input  type='text' 
								{...getFieldProps('tmUp',{
									rules: [{required:true,pattern:xt.pattern.positiveInteger}],
									initialValue:''
								})}
								
								className ={getFieldError("tmUp") ?'col-md-9 col-lg-9 text-input-nowidth error-border' :'col-md-9 col-lg-9 text-input-nowidth'}
							/>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(600019/*信保费率%*/)}</label>
							<input  type='text' 
								{...getFieldProps('creditRate',{
									rules: [{required:true,pattern:xt.pattern.positiveNonZero}],
									initialValue:''
								})}
								
								className ={getFieldError("creditRate") ?'col-md-9 col-lg-9 text-input-nowidth error-border' :'col-md-9 col-lg-9 text-input-nowidth'}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100286/*生效日期*/)}</label> 
							<div className={'col-md-9 col-lg-9 datetime'}>
								<Calendar width={'100%'}   
								showTime = {false} 
								isShowIcon={true} 
								form={this.props.form} 
								validate={true}						
								name={'sDate'}
								
								/>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(500120/*终止日期*/)}</label>
							<div className={'col-md-9 col-lg-9 datetime'}>
								<Calendar 
								width={'100%'}  
								showTime = {false} 
								isShowIcon={true} 
								form={this.props.form}
								validate={true}
								name={'eDate'}
																			
								/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100288/*发布日期*/)}</label>
							<div className={'col-md-9 col-lg-9 datetime'}>
								<Calendar width={'100%'} showTime = {false} 
								isShowIcon={true} form={this.props.form} 
								validate={true}
								name={'reDate'}
												
								/> 
							</div>
						</div>
					</div>
	           	</div>
           	</div>);
		}else if(this.props.DialogContent==3){
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
								                        placeholder=""
								                        form={this.props.form}
								                       fieldName='ccId'
								                        apiHost={API_FOODING_ES}
								                        apiUri='/party/getLoginCompanies'
								                        apiParams={{}}
								                         disabled={true}	    
								                         initialValue={xt.initSelectValue(LocalName&& getFieldValue("ccId",{}).ccId == Cid,{s_label:LocalName,reStaffId:Ccid,reStaffLcName:LocalName,reStaffEnName:LocalEname},['reStaffId','reStaffLcName','reStaffEnName'], 's_label', this.props.form)}
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
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(200729/*信保公司*/)}</label>
							<Select
								
								{...getNFieldProps('creditBeId',{
									rules: [{required:true}],
									initialValue: checkedData['creditBeId'] ? 
													{ s_label: checkedData['creditBe'+language], creditBeId: checkedData.creditBeId, creditBeLcName: checkedData.creditBeLcName, creditBeEnName: checkedData.creditBeEnName} 
													: 
													''								
								})} 
								optionLabelProp="children"
								className ={getFieldError('creditBeId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
								onClick={this.handleCorporationCompany}
							>
							{this.state.corporationCompany.map((o,i)=><Option key={i} objValue={{s_label:o.localName, creditBeId: o.id, creditBeLcName:o.localName, creditBeEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select> 
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100189/*信保分类*/)}</label>
							<Select
								
								{...getNFieldProps('corpTyId',{
									rules: [{required:true}],
									initialValue: checkedData['corpTyId'] ? 
													{ s_label: checkedData['corpTyName'], corpTyId: checkedData.corpTyId} 
													: 
													''								
								})} 
								optionLabelProp="children"
								className ={getFieldError('corpTyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
								onClick={this.handleCorporationType}
							>
							{this.state.corporationType.map((o,i)=><Option key={i} objValue={{s_label:o.name, corpTyId: o.id}} title={o.name}>{o.name}</Option>)}
							</Select> 
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(200160/*风险分类*/)}</label>
							<Select
								
								{...getNFieldProps('riskTyId',{
									rules: [{required:true}],
									initialValue: checkedData['riskTyId'] ? 
													{ s_label: checkedData['riskTyName'], riskTyId: checkedData.riskTyId} 
													: 
													''								
								})} 
								optionLabelProp="children"
								className ={getFieldError('riskTyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
								onClick={this.handleRiskType}
							>
							{this.state.riskType.map((o,i)=><Option key={i} objValue={{s_label:o.name, riskTyId: o.id }} title={o.name}>{o.name}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(600017/*下限天数*/)}</label>
							<input  type='text' 
								{...getFieldProps('tmLow',{
									rules: [{required:true,pattern:xt.pattern.positiveInteger}],
									initialValue: checkedData['tmLow'] ? checkedData['tmLow'] : ''
								})}
								
								className ={getFieldError("tmLow") ?'col-md-9 col-lg-9 text-input-nowidth error-border' :'col-md-9 col-lg-9 text-input-nowidth'}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(600018/*上限天数*/)}</label>
							<input  type='text' 
								{...getFieldProps('tmUp',{
									rules: [{required:true,pattern:xt.pattern.positiveInteger}],
									initialValue: checkedData['tmUp'] ? checkedData['tmUp'] : ''
								})}
								
								className ={getFieldError("tmUp") ?'col-md-9 col-lg-9 text-input-nowidth error-border' :'col-md-9 col-lg-9 text-input-nowidth'}
							/>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(600019/*信保费率%*/)}</label>
							<input  type='text' 
								{...getFieldProps('creditRate',{
									rules: [{required:true,pattern:xt.pattern.positiveNonZero}],
									initialValue: checkedData['creditRate'] ? checkedData['creditRate'] : ''
								})}
								
								className ={getFieldError("creditRate") ?'col-md-9 col-lg-9 text-input-nowidth error-border' :'col-md-9 col-lg-9 text-input-nowidth'}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100286/*生效日期*/)}</label> 
							<div className={'col-md-9 col-lg-9 datetime'}>
								<Calendar width={'100%'}  
								 showTime = {false} 
								 isShowIcon={true} 
								 form={this.props.form} 
								validate={true}						
								name={'sDate'}
								value={checkedData['sDate']}
								/>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(500120/*终止日期*/)}</label>
							<div className={'col-md-9 col-lg-9 datetime'}>
								<Calendar width={'100%'}  showTime = {false} isShowIcon={true} form={this.props.form}
								validate={true}
								name={'eDate'}
								value={checkedData['eDate']}												
								/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100288/*发布日期*/)}</label>
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
	           	</div>
           	</div>);
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} 
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
const ProductForm =createForm()(CreditinsurratePlug);
export default ProductForm;
