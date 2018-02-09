import i18n from './../../../lib/i18n';
import {I18n } from '../../../lib/i18n';
import WebData from '../../../common/WebData';
import xt from '../../../common/xt'; // 下拉
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../components/Select';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,getUser} from '../../../services/apiCall';
export class CostTrayPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.handleCertificate = this.handleCertificate.bind(this);
		this.state={
			info:[]
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
	onSaveAdd(){
		this.onSaveAndClose(true);
	}
	handleCertificate(){
		var that = this;
		apiGet(API_FOODING_ES,'/party/getLoginCompanies',{clusId:getUser().staff.clusId},(response)=>{
			that.setState({
				info:response.data
			})
		},(error)=>{

		})
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError,getNFieldProps,getFieldValue} = this.props.form;
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
													<label className={'col-md-3 col-lg-3'}><span>*</span>资金费率%</label>
													<input type="text" {...getFieldProps('rate', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,pattern:xt.pattern.positiveNonZero
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:''
						                            })} className={getFieldError('rate')?"col-md-9 col-lg-9 text-input-nowidth error-border":"col-md-9 col-lg-9 text-input-nowidth"} placeholder={i18n.t(500273/*请输入数字*/)}/>
													
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>罚息率%</label>
													<input type="text" {...getFieldProps('peltyRate', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,pattern:xt.pattern.positiveNonZero
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:''
						                            })} className={getFieldError("peltyRate")?"col-md-9 col-lg-9 text-input-nowidth error-border":"col-md-9 col-lg-9 text-input-nowidth"} placeholder={i18n.t(500273/*请输入数字*/)}/>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
														<Calendar width={'100%'}
														  form={this.props.form}
														  name = {'sDate'}
														 showTime = {false} 
														 validate ={true}
														 isShowIcon={true}/>
													</div>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500120/*终止日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
														<Calendar width={'100%'}
														  form={this.props.form}
														  name = {'eDate'}
														  validate ={true}
														 showTime = {false} 
														 isShowIcon={true}/>
													</div>
												</div>
											</div>
											<div className='row'>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100288/*发布日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
														<Calendar width={'100%'}
														  form={this.props.form}
														  validate ={true}
														  name = {'reDate'}
														 showTime = {false} 
														 isShowIcon={true}/>
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
													<label className={'col-md-3 col-lg-3'}><span>*</span>资金费率%</label>
													<input type="text" {...getFieldProps('rate', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,pattern:xt.pattern.positiveNonZero
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:checkedData?checkedData.rate :''
						                            })} className={getFieldError("rate")?"col-md-9 col-lg-9 text-input-nowidth error-border":"col-md-9 col-lg-9 text-input-nowidth"} placeholder={i18n.t(500273/*请输入数字*/)}/>
													
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>罚息率%</label>
													<input type="text" {...getFieldProps('peltyRate', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,pattern:xt.pattern.positiveNonZero
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:checkedData.peltyRate
						                            })} className={getFieldError("peltyRate")?"col-md-9 col-lg-9 text-input-nowidth error-border":"col-md-9 col-lg-9 text-input-nowidth"} placeholder={i18n.t(500273/*请输入数字*/)}/>
												</div>
												
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
														<Calendar width={'100%'}
														  form={this.props.form}
														  value={checkedData.sDate}
														  name = {'sDate'}
														 showTime = {false} 
														 isShowIcon={true}/>
													</div>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500120/*终止日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
														<Calendar width={'100%'}
														 form={this.props.form}
														 name = {'eDate'}
														 showTime = {false} 
														 value={checkedData.eDate}
														 isShowIcon={true}/>
													</div>
												</div>
												</div>
												<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100288/*发布日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
														<Calendar width={'100%'}
														  form={this.props.form}
														  name = {'reDate'}
														 showTime = {false} 
														 value={checkedData.reDate}
														 isShowIcon={true}/>
													</div>
												</div>
											</div>							
           		</div>
           	</div>);
		}else if(this.props.DialogContent==4){
			content = (
				<div className='scroll lose'>
							<span>
								<i>*</i>
								失效原因
							</span>
							<Select
								
								style={{width: 450}}
								getPopupContainer={this.getPopupContainer}
						    >
							   	<Option value={'111111'}>11</Option>
							</Select>
				</div>
			)
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
const ProductForm =createForm()(CostTrayPlug);
export default ProductForm;
