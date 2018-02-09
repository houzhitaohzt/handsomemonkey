import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option ,ConstMiniSelect} from '../../../../components/Select';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import DataTime from  '../../../../components/Calendar/Calendar';
import Input from '../../../../components/FormValidating/FormValidating';
import Checkbox from "../../../../components/CheckBox";
import AddMoreLanguage from "../../../../components/AddMoreLanguage"; 
import {I18n} from "../../../../lib/i18n";
import xt from './../../../../common/xt';
export class CountryInformationPlug extends Component{
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
				if(this.props.DialogContent == 1){
					let params = this.props.form.getFieldsValue();
					delete params['id'];
					delete params['optlock'];
					delete params['nameValues'];
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				}
				this.props.form.resetFields();
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
	onClick(){
		
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps} = this.props.form;
		let {checkedData} = this.props;
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text',
													initialValue:'',
													classn:'col-md-8 col-lg-8 text-input-nowidth'}}
								/> 
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'localName',type:'text',
													initialValue:'',
													classn:'col-md-8 col-lg-8 text-input-nowidth'}}
								/>
							</div>
							
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100083/*三字码*/)}</label>
								<Input form={this.props.form} obj={{name:'stThWord',type:'text',
													initialValue:'',
													classn:'col-md-8 col-lg-8 text-input-nowidth'}}
								/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100086/*时区*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.TimZon' 
                                             fieldName="timZonId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 timZonId: da.id,
                                                 timZonLcName: da.localName,
                                                 timZonEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              allowClear
				                 />
							</div>
							</div>
							<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100085/*风险类型*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.RiskType' 
                                             fieldName="riskTyId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 riskTyId: da.id,
                                                 riskTyName: da.name,
                                                 s_label: da.name
                                             }}>{da.name}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              allowClear
				                 />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100091/*地区*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.BeAreaId' 
                                             fieldName="beAreaId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 beAreaId: da.id,
                                                 beAreaName: da.name,
                                                  beAreaLcName: da.localName,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              allowClear
				                 />
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100096/*美国制裁*/)}</label>
								<Checkbox 
								
									{...getFieldProps('sacInUsMark',{
										initialValue:false
									})}
									checked={this.props.form.getFieldValue("sacInUsMark")}
								/>
							</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{I18n.t(100084/*电话区号*/)}</label>
									<input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
										{...getFieldProps('cntrycode',{
													initialValue:''
										})}
									/>
								</div>
								
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{I18n.t(100095/*语言分类*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Locale' 
                                             fieldName="localeId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 localeId: da.id,
                                                 localeName: da.name,
                                                  localeLcName: da.localName,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              allowClear
				                 />
								</div>
						</div>
					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			checkedData =checkedData || {};
			checkedData.timZon = checkedData.timZon || {};
			checkedData.riskType = checkedData.riskType || {};
			checkedData.beArea = checkedData.beArea || {};
			checkedData.locale = checkedData.locale || {};
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.id:''
			})
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.optlock:''
			})
			getFieldProps('nameValues', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.nameValues:''
			})
			getFieldProps('name',{
						validateFirst: true,
						initialValue:checkedData? checkedData.name:''
			})
			   content = (
			   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text',
													initialValue:checkedData.code,
													classn:'col-md-8 col-lg-8 text-input-nowidth'}}
								/> 
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'localName',type:'text',
													initialValue:checkedData.localName,
													classn:'col-md-8 col-lg-8 text-input-nowidth'}}
								/>
								<AddMoreLanguage 
								    menusetView={checkedData}
								    object = {'country'}
								     isShowId={true}
								    upload={this.props.upload}
								    onCancel ={this.onCancel}
							    />
							</div>
							
						</div>
						<div className={'row'}>
						    <div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100083/*三字码*/)}</label>
								<input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
										{...getFieldProps('stThWord',{
													initialValue:checkedData.stThWord,
										})}
								/>  
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100086/*时区*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.TimZon' 
                                             fieldName="timZonId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 timZonId: da.id,
                                                 timZonLcName: da.localName,
                                                 timZonEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              initialValue={xt.initSelectValue(checkedData.timZon,{timZonId:checkedData.timZon.id,...checkedData.timZon},['timZonId'], 'localName', this.props.form)}
                                              allowClear
				                 />
							</div>
							</div>
							<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100085/*风险类型*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.RiskType' 
                                             fieldName="riskTyId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 riskTyId: da.id,
                                                 riskTyName: da.name,
                                                 s_label: da.name
                                             }}>{da.name}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              initialValue={ xt.initSelectValue(checkedData.riskType,{riskTyId:checkedData.riskType.id,...checkedData.riskType},['riskTyId'], 'name', this.props.form)}
                                              allowClear
				                 />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100091/*地区*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.BeAreaId' 
                                             fieldName="beAreaId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 beAreaId: da.id,
                                                 beAreaName: da.name,
                                                  beAreaLcName: da.localName,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                             initialValue={ xt.initSelectValue(checkedData.beArea,{beAreaId:checkedData.beArea.id,...checkedData.beArea},['beAreaId'], 'localName', this.props.form)}
                                              allowClear
				                 />
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{I18n.t(100096/*美国制裁*/)}</label>
									<Checkbox 
										{...getFieldProps('sacInUsMark',{
											initialValue:checkedData.sacInUsMark
										})}
										checked={this.props.form.getFieldValue("sacInUsMark")}
									/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{I18n.t(100084/*电话区号*/)}</label>
									<input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
										{...getFieldProps('cntrycode',{
													initialValue:checkedData.cntrycode
										})}
									/>
								</div>
								
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{I18n.t(100095/*语言分类*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Locale' 
                                             fieldName="localeId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 localeId: da.id,
                                                 localeName: da.name,
                                                  localeLcName: da.localName,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                             initialValue={xt.initSelectValue(checkedData.locale,{localeId:checkedData.locale.id,...checkedData.locale},['localeId'], 'localName', this.props.form)}
                                              allowClear
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
const ProductForm =createForm()(CountryInformationPlug);
export default ProductForm;

