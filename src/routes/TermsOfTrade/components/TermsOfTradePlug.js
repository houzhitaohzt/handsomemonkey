import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
import xt from '../../../common/xt';
import Select, { Option ,ConstMiniSelect ,ConstVirtualSelect} from '../../../components/Select/';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList,commonAjax} from '../../../services/apiCall';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Input from '../../../components/FormValidating/FormValidating';
import Checkbox from "../../../components/CheckBox";
import AddMoreLanguage from "../../../components/AddMoreLanguage";
import {I18n} from "../../../lib/i18n";
export class TermsOfTradePlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.state ={
			info:{}
		}
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
					delete params['optlock'];
					delete params['nameValues'];
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				}this.props.form.resetFields();
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
		const { getFieldProps, getFieldError } = this.props.form;
		let {checkedData} = this.props;
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100003/*ID*/)}</label>
								<Input form={this.props.form} obj={{name:'id',type:'text',
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text',
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
										<Input form={this.props.form} obj={{name:'localName',type:'text',
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{I18n.t(100258/*交易条款类型*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.IncotmType'
                                             fieldName="incotmTyId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 incotmTyId: da.id,

                                                 timZonEnName: da.name,
                                                 s_label: da.name
                                             }}>{da.name}</Option>}
                                             className ={'col-md-9 col-lg-9 currency-btn select-from-currency'}
                                             allowClear
				                 />
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-md-6">
								<label className={'col-md-3 col-md-3'}>{I18n.t(100259/*海运保险*/)}</label>
								<Checkbox

									{...getFieldProps('pShipMark',{
										initialValue:false
									})}
								/>
							</div>
							<div className="form-group col-md-6 col-md-6">
								<label className={'col-md-3 col-md-3'}>{I18n.t(100002/*描述*/)}</label>
								<input type="text" className={'text-input-nowidth col-xs-9 col-md-9'}
									{...getFieldProps('description',{
										initialValue:''
									})} />
							</div>
						</div>
					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			checkedData = checkedData || {};
			checkedData.incotmType = checkedData.incotmType || {};
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:checkedData?checkedData.optlock:''
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
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100003/*ID*/)}</label>
								<Input form={this.props.form} obj={{name:'id',type:'text',
										initialValue:checkedData.id,
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text',
										initialValue:checkedData.code,
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
										<Input form={this.props.form} obj={{name:'localName',type:'text',
										initialValue:checkedData.localName,
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
										<AddMoreLanguage
										    menusetView={checkedData}
										    object = {'incotm'}
										    upload={this.props.upload}
										    onCancel ={this.onCancel}
										    isShowId={true}
									    />
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{I18n.t(100258/*交易条款类型*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.IncotmType'
                                             fieldName="incotmTyId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 incotmTyId: da.id,

                                                 timZonEnName: da.name,
                                                 s_label: da.name
                                             }}>{da.name}</Option>}
                                             className ={'col-md-9 col-lg-9 currency-btn select-from-currency'}
                                            initialValue={xt.initSelectValue(checkedData.incotmType,{incotmTyId:checkedData.incotmType.id,...checkedData.incotmType},['incotmTyId'], 'name', this.props.form)}
                                             allowClear
				                 />
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-md-3 col-md-3'}>{I18n.t(100259/*海运保险*/)}</label>
								<Checkbox

									{...getFieldProps('pShipMark',{
										initialValue:checkedData.pShipMark
									})}
									checked={this.props.form.getFieldValue("pShipMark")}
								/>
							</div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-md-3 col-md-3'}>{I18n.t(100002/*描述*/)}</label>
								<input type="text" className={'text-input-nowidth col-xs-9 col-md-9'}
									{...getFieldProps('description',{
										initialValue:checkedData.description||''
									})} />
							</div>
						</div>
					</div>
			    </div>
			)
		}else if(this.props.DialogContent==5){
			content = (
				<div className={'girdlayout scroll'} style={{overflow:'auto'}}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100003/*ID*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.record.id}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100000/*代码*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.record.code}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100001/*名称*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.record.localName}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100258/*交易条款类型*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.record.incotmType.name}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-4 col-md-4'}>{I18n.t(100259/*海运保险*/)}</label>
								<div className={'col-xs-8 col-md-8'}>
									<p>{checkedData.record.pShipMark?I18n.t(100141/*是*/) : I18n.t(100142/*否*/)}</p>
								</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100002/*描述*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.record.description}</p>
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
					onSaveAndClose={this.onSaveAndClose}
					onCancel={this.onCancel}
					onSaveAdd={this.onSaveAdd}
					showSaveAdd={this.props.showSaveAdd}
					showSaveClose={this.props.showSaveClose}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(TermsOfTradePlug);
export default ProductForm;
