import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import RightKey from '../../../../../components/RightKey/RightKey';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option, ConstVirtualSelect } from '../../../../../components/Select';
import Calendar from  '../../../../../components/Calendar/Calendar';
import Checkbox from '../../../../../components/CheckBox';

import {I18n} from '../../../../../lib/i18n';
import fieldsFormat from '../../../../../common/FieldsFormat';

export class  NormalDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.data = null;
	}
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				that.props.onSaveAndClose(that.props.form.getFieldsValue(),that.data);
				that.props.form.resetFields();
			}
		})
	}
	onCancel(){
		let that = this;
		const {onCancel} = this.props;
		if(onCancel){
            onCancel();
            that.props.form.resetFields();
        }
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {data,initData} = this.props;
		const {countrys,authoGps,rival} = initData;
		this.data = Object.assign({},rival,{title:"competitors-detail-normal"});
		let content;
			content=(<div className={'  girdlayout'}>
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200470/*竞争对手代码*/)}</label>
									<input type="text" disabled {...getFieldProps('code', {
		                                initialValue:rival&&rival.code?rival.code:''
		                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder=""/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100001/*名称*/)}</label>
									 <input type="text" {...getFieldProps('name', {
										rules: [{required:true,}],
										valuedateTrigger:"onBlur",
		                                initialValue:rival&&rival.name?rival.name:''
		                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder=""/>
								</div>
							</div>
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{i18n.t(100087/*国家*/)}</label>				
									<ConstVirtualSelect
										form={this.props.form}
										isRequest={false}
										fieldName="cntryId"
										//rules
										initValueOptions={countrys}
										initialValue={rival&&rival.country?rival.country.id:''}
										className="col-md-9 col-lg-9"
									/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{i18n.t(100345/*纳税人识别号*/)}</label>
									<input type="text" {...getFieldProps('taxIdenSN', {
		                                initialValue:rival&&rival.taxIdenSN?rival.taxIdenSN:'',
										normalize: fieldsFormat.taxIdenSN
		                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder=""/>
								</div>
							</div>
							<div className={'row'}>								
								{/*<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{i18n.t(100358*//*税号*//*)}</label>
									 <input type="text" {...getFieldProps('registCode', {
										//rules: [{required:true,}],
										valuedateTrigger:"onBlur",
		                                initialValue:rival&&rival.registCode?rival.registCode:'',
										normalize: fieldsFormat.beMtlCode
		                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder=""/>
								</div>*/}
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{i18n.t(100561/*法人代表*/)}</label>				
									<input type="text" {...getFieldProps('leglpsn', {
										//rules: [{required:true,}],
										valuedateTrigger:"onBlur",
		                                initialValue:rival&&rival.leglpsn?rival.leglpsn:''
		                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder=""/>
								</div>
							</div>
							<div className={'row'}>								
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{i18n.t(100346/*优势*/)}</label>				
									<input type="text" {...getFieldProps('strength', {
										//rules: [{required:true,}],
										valuedateTrigger:"onBlur",
		                                initialValue:rival&&rival.strength?rival.strength:''
		                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder=""/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{i18n.t(100347/*劣势*/)}</label>
									<input type="text" {...getFieldProps('weakness', {
		                                initialValue:rival&&rival.weakness?rival.weakness:''
		                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder=""/>
								</div>
							</div>
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{i18n.t(100348/*威胁*/)}</label>
									 <input type="text" {...getFieldProps('threat', {
										//rules: [{required:true,}],
										valuedateTrigger:"onBlur",
		                                initialValue:rival&&rival.threat?rival.threat:''
		                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder=""/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{i18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('description', {
		                                initialValue:rival&&rival.description?rival.description:''
		                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder=""/>
								</div>
							</div>					
					</div>)
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
						{content}
				</FormWrapper>
			</div>
			);
	}
}
NormalDialog.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
NormalDialog.defaultProps ={
	onSaveAndClose(){},
    onCancel(){}
}
const DialogFrom =createForm()(NormalDialog);
export default DialogFrom;