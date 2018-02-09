import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option,ConstMiniSelect } from '../../../../components/Select';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import Calendar from  '../../../../components/Calendar/Calendar';
import Input from '../../../../components/FormValidating/FormValidating';
import Checkbox from "../../../../components/CheckBox";
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS} from '../../../../services/apiCall';
import Loading from "../../../../components/Loading";//加载动画
import ServiceTips from "../../../../components/ServiceTips";//提示框
import {I18n} from "../../../../lib/i18n"; 
import xt from '../../../../common/xt';
import NameCheck from "../../../../components/InputBoxCheck/NameCheck";
import WebData from "../../../../common/WebData";

export class Productplug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
	
		
	}
	getData(value,that){
		this.addSelect = that;
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				let params;
				if(this.props.DialogContent == 1){
					params = this.props.form.getFieldsValue();
					delete params['id'];
					delete params['optlock'];
					delete params['rowSts'];
					params = params;
				}else{
					params=this.props.form.getFieldsValue();
				}
				apiPost(API_FOODING_ES,'/staff/save',params,(response)=>{
						this.setState({
							rodalShow:!!isAdd
						})
						 ServiceTips({text:response.message,type:'success'});
						 this.props.onSaveAndClose();
						 this.props.form.resetFields();
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
					
				})
				

				
			}
		})
	}
	onSaveAdd(){
		this.onSaveAndClose(true);
	}
	onCancel(){
		const {form, onCancel} = this.props;
		this.props.onCancel();
		this.props.form.resetFields();
	}
	
	
	
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;
		let {checkedData} = this.props;
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
               <div className={'addnormal scroll'} style={{marginBottom:'10px',maxHeight:'300px',overflowY:'auto'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100225/*工号*/)}</label>
								<input type="text" className ={getFieldError("code") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
										{...getFieldProps('code',{
													initialValue:'',
													validateFirst: true,
													rules: [{required:true}]
										})}
								/> 
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100231/*姓名*/)}</label>
								<NameCheck
									form={this.props.form}
									fieldName='name'
									initialValue={''}
									rules={true}
									className={'col-md-8 col-lg-8'}
									
								/>		
							</div>
							
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100226/*英文名称*/)}</label>
								<NameCheck
									form={this.props.form}
									fieldName='enName'
									isEnName={true}
									initialValue={''}
									className={'col-md-8 col-lg-8'}
								/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100235/*语言*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Locale' 
                                             fieldName="localeId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                localeId: da.id,
                                                localeLcName: da.localName,
                                                localeEnName: da.name,
                                                s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	allowClear
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    /> 
							</div>
							</div>
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100087/*国家*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Country' 
                                             fieldName="cntryId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                cntryId: da.id,
                                                cntryLcName: da.localName,
                                                cntryEnName: da.name,
                                                s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    />
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{I18n.t(100236/*职称*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Title' 
                                             fieldName="titleId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                titleId: da.id,
                                                titleLcName: da.localName,
                                                titleEnName: da.name,
                                                s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	allowClear
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    /> 
								</div>
							</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100237/*职员类型*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.StfType' 
                                             fieldName="stfTyId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                stfTyId: da.id,
                                                stfTyName: da.name,
                                                s_label: da.name
                                             }}>{da.name}</Option>}
                                             allowClear
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    /> 
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100228/*在职状态*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.WorkingState' 
                                             fieldName="workingStateId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                workingStateId: da.id,
                                                workingStatename: da.name,
                                                s_label: da.name
                                             }}>{da.name}</Option>}
                                             	reles={true}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    /> 
							</div>
							
							
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100238/*部门*/)}</label>
								<ConstMiniSelect form={this.props.form}
												 pbj={{apiType: apiGet, host: API_FOODING_ES, uri: '/party/getLoginDepartments',
                                                     params: {ccId:WebData.user.data.staff.ccid}
                                                 }}
                                             fieldName="organizationId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 organizationId: da.id,
                                                organizationLcName: da.localName,
                                                 organizationEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    /> 
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100227/*职务*/)}</label>
								<ConstMiniSelect form={this.props.form}
								        isRequest={Boolean(getFieldValue("organizationId",{}).organizationId)}
                                                 			refreshMark={getFieldValue("organizationId", {}).organizationId}
				             				 pbj={{apiType: apiGet, host: API_FOODING_ES, uri: '/party/getPartysByTypeIdAndPartyId',
				             				 params: {partyId:getFieldValue("organizationId",{}).organizationId,typeId:50}
                                             }} fieldName="positnId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                positnId: da.id,
                                                positnLcName: da.localName,
                                                positnEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    />  
							</div>
							
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100239/*性别*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.Sex' 
                                             fieldName="sexId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                sexId: da.id,
                                                sexname: da.name,
                                                s_label: da.name
                                             }}>{da.name}</Option>}
                                             	allowClear
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100240/*学历*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.EduDegr' 
                                             fieldName="eduDegrId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                eduDegrId: da.id,
                                                eduDegrLcName: da.localName,
                                                eduDegrEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	allowClear
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    /> 
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100241/*身份证号*/)}</label>
								<input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
									{...getFieldProps('idcardSN',{
												initialValue:''
									})}
      							/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100242/*兴趣爱好*/)}</label>
								<input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
										{...getFieldProps('hobbys',{
													initialValue:''
										})}
								/> 
							</div>
							</div>
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100229/*邮箱*/)}</label>
									<input type="text"  className ={getFieldError("emailAddress") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
											{...getFieldProps('emailAddress',{
														initialValue:'',
														validateFirst: true,
														rules: [{required: true,pattern:(/[@]/g)}],
														
											})}
									/> 
								</div>
                                <div className="form-group col-md-6 col-lg-6">
                                    <label className={'col-md-4 col-lg-4'}>{I18n.t(500413/*入职日期*/)}</label>
                                    <div className={'col-md-8 col-lg-8 datetime'}>
                                        <Calendar
                                            width={'100%'}
                                            showTime = {false}
                                            isShowIcon={true}
                                            form={this.props.form}
                                            name={'entryDate'}
                                        />
                                    </div>
                                </div>
						</div>
                        <div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(500414/*入职时工龄*/)}</label>
                                <input type="text" className={getFieldError("entryWorkAge")?"col-md-8 col-lg-8 text-input-nowidth error-border":'col-md-8 col-lg-8 text-input-nowidth'}
                                       {...getNFieldProps('entryWorkAge',{
                                           rules: [{pattern: xt.pattern.positiveZero}],
                                           initialValue:''
                                       })}
                                />
                            </div>
                        </div>
					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			checkedData = checkedData || {};
			checkedData.positn = checkedData.positn || {};
			checkedData.locale = checkedData.locale || {};
			checkedData.country = checkedData.country || {};
			checkedData.organization = checkedData.organization || {};
			checkedData.stfType = checkedData.stfType || {};
			checkedData.title = checkedData.title || {};
			checkedData.workingState = checkedData.workingState || {};
			checkedData.organization = checkedData.organization || {};
			checkedData.positn = checkedData.positn || {};
			checkedData.eduDegr = checkedData.eduDegr || {};
			checkedData.sex  = checkedData.sex  || {};
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.id:''
			})
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.optlock:''
			})
			getFieldProps('rowSts', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.rowSts:''
			})
			   content = (
                   <div className={'addnormal scroll'} style={{marginBottom:'10px',maxHeight:'300px',overflowY:'auto'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100225/*工号*/)}</label>
								<input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
										{...getFieldProps('code',{
													initialValue:checkedData?checkedData.code:'',
										})}
								/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100231/*姓名*/)}</label>
								
								<NameCheck
									form={this.props.form}
									fieldName='name'
									rules={true}
									initialValue={checkedData?checkedData.name:''}
									className={'col-md-8 col-lg-8'}
								/>
							</div>							
							
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100226/*英文名称*/)}</label>
								 <NameCheck
									form={this.props.form}
									fieldName='enName'
									
									isEnName={true}
									initialValue={checkedData?checkedData.enName:''}
									className={'col-md-8 col-lg-8'}
								/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100235/*语言*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Locale' 
                                             fieldName="localeId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                localeId: da.id,
                                                localeLcName: da.localName,
                                                localeEnName: da.name,
                                                s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	allowClear
                                            initialValue={xt.initSelectValue(checkedData.locale,{localeId:checkedData.locale.id,...checkedData.locale},['localeId'], 'localName', this.props.form)}
                                            className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                />  
							</div>
							</div>
							<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100087/*国家*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Country' 
                                             fieldName="cntryId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                cntryId: da.id,
                                                cntryLcName: da.localName,
                                                cntryEnName: da.name,
                                                s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                            initialValue={xt.initSelectValue(checkedData.country,{cntryId:checkedData.country.id,...checkedData.country},['cntryId'], 'localName', this.props.form)}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100236/*职称*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Title' 
                                             fieldName="titleId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                titleId: da.id,
                                                titleLcName: da.localName,
                                                titleEnName: da.name,
                                                s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	allowClear
                                             	initialValue={xt.initSelectValue(checkedData.title,{titleId:checkedData.title.id,...checkedData.title},['titleId'], 'localName', this.props.form)}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    />  
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100237/*职员类型*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.StfType' 
                                             fieldName="stfTyId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                stfTyId: da.id,
                                                stfTyName: da.name,
                                                s_label: da.name
                                             }}>{da.name}</Option>}
                                             allowClear
                                             initialValue={xt.initSelectValue(checkedData.stfType,{stfTyId:checkedData.stfType.id,...checkedData.stfType},['stfTyId'], 'name', this.props.form)}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    /> 
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100228/*在职状态*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.WorkingState' 
                                             fieldName="workingStateId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                workingStateId: da.id,
                                                workingStatename: da.name,
                                                s_label: da.name
                                             }}>{da.name}</Option>}
                                             	reles={true}
                                             	initialValue={xt.initSelectValue(checkedData.workingState,{workingStateId:checkedData.workingState.id,...checkedData.workingState},['workingStateId'], 'name', this.props.form)}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    />  
							</div>
							
							
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100238/*部门*/)}</label>
									<ConstMiniSelect form={this.props.form}
												 pbj={{apiType: apiGet, host: API_FOODING_ES, uri: '/party/getLoginDepartments',
													 params: {ccId:WebData.user.data.staff.ccid}
												 }}
	                                             fieldName="organizationId"
	                                             optionValue={da => <Option key={da.id} objValue={{
	                                                 organizationId: da.id,
	                                                organizationLcName: da.localName,
	                                                 organizationEnName: da.name,
	                                                 s_label: da.localName
	                                             }}>{da.localName}</Option>}
	                                             	reles={true}
	                                             	initialValue={xt.initSelectValue(checkedData.organization,{organizationId:checkedData.organization.id,...checkedData.organization},['organizationId'], 'localName', this.props.form)}
	                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
	                                             
					                    /> 
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100227/*职务*/)}</label>
									<ConstMiniSelect form={this.props.form}
													 isRequest={Boolean(getFieldValue("organizationId",checkedData).organizationId)}
                                                 	 refreshMark={getFieldValue("organizationId", checkedData).organizationId}
													 pbj={{apiType: apiGet, host: API_FOODING_ES, uri: '/party/getPartysByTypeIdAndPartyId',
                                                         params: {partyId:getFieldValue("organizationId",checkedData).organizationId,typeId:50}
                                                     }}
													 fieldName="positnId"
	                                             optionValue={da => <Option key={da.id} objValue={{
	                                                positnId: da.id,
	                                                positnLcName: da.localName,
	                                                positnEnName: da.name,
	                                                 s_label: da.localName
	                                             }}>{da.localName}</Option>}
	                                             	reles={true}
	                                             	
	                                             	initialValue={xt.initSelectValue(checkedData.positnId&& getFieldValue("organizationId",checkedData).organizationId== checkedData.organizationId, {positnId:checkedData.positn.id,localName:checkedData.positn.localName}, ['positnId'], 'localName', this.props.form) }
	                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
	                                             
					                />
										 
								</div>
							</div>
							<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100239/*性别*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.Sex' 
                                             fieldName="sexId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                sexId: da.id,
                                                sexname: da.name,
                                                s_label: da.name
                                             }}>{da.name}</Option>}
                                             	allowClear
                                             	initialValue={xt.initSelectValue(checkedData.sex,{sexId:checkedData.sex.id,...checkedData.sex},['sexId'], 'name', this.props.form)}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100240/*学历*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.EduDegr' 
                                             fieldName="eduDegrId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                eduDegrId: da.id,
                                                eduDegrLcName: da.localName,
                                                eduDegrEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	allowClear
                                             	initialValue={xt.initSelectValue(checkedData.eduDegr,{eduDegrId:checkedData.eduDegr.id,...checkedData.eduDegr},['eduDegrId'], 'localName', this.props.form)}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    /> 
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100241/*身份证号*/)}</label>
								<input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
										{...getFieldProps('idcardSN',{
													initialValue:checkedData?checkedData.idcardSN:''
										})}
								/>  
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100242/*兴趣爱好*/)}</label>
								<input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
										{...getFieldProps('hobbys',{
													initialValue:checkedData?checkedData.hobbys:''
										})}
								/> 
							</div>
							</div>
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100229/*邮箱*/)}</label>
									<input type="text" className ={getFieldError("emailAddress") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
											{...getFieldProps('emailAddress',{

														validateFirst: true,
														rules: [{required: true,pattern:(/[@]/g)}],
														initialValue:checkedData?checkedData.emailAddress:''
											})}
									/>
								</div>
                                <div className="form-group col-md-6 col-lg-6">
                                    <label className={'col-md-4 col-lg-4'}>{I18n.t(500413/*入职日期*/)}</label>
                                    <div className={'col-md-8 col-lg-8 datetime'}>
                                        <Calendar
                                            width={'100%'}
                                            showTime = {false}
                                            isShowIcon={true}
                                            form={this.props.form}
                                            name={'entryDate'}
                                            value={checkedData['entryDate']}
                                        />
                                    </div>
                                </div>
						</div>
                        <div className={'row'}>

                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(500414/*入职时工龄*/)}</label>
                                <input type="text" className={getFieldError("entryWorkAge")?"col-md-8 col-lg-8 text-input-nowidth error-border":'col-md-8 col-lg-8 text-input-nowidth'}
                                       {...getNFieldProps('entryWorkAge',{
                                           rules: [{pattern: xt.pattern.positiveZero}],
                                           initialValue:checkedData.entryWorkAge?checkedData.entryWorkAge:''
                                       })}
                                />
                            </div>
                        </div>
					</div>
			</div>
			)
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper 
					showFooter={true} 
					buttonLeft = {this.props.buttonLeft} 
					showSaveAdd={this.props.showSaveAdd}
					onSaveAndClose={this.onSaveAndClose} 
					onCancel={this.onCancel}
					onSaveAdd={this.onSaveAdd}
					showSaveClose={this.props.showSaveClose}
					>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(Productplug);
export default ProductForm;

