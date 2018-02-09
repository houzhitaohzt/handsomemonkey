import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, {Option,ConstVirtualSelect} from '../../../../../components/Select';
import Checkbox from "../../../../../components/CheckBox";
import Input from '../../../../../components/FormValidating/FormValidating';

import {I18n} from "../../../../../lib/i18n";

export class  BankTemplateDialog extends Component{
	constructor(props){
		super(props);
		let that = this;
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.data = null;
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {data,initData} = this.props;
		const {actsnTypes,countrys,currens,inExTypes,bankacct} = initData;
		this.data = Object.assign({},bankacct)
		let content;
		if(data.number == 0 || data.number == 1){
           content = (
           	<div className="girdlayout">
				<div className="row">
					<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100501/*账户名称*/)}</label>
							<input 
								type="text"
								className={getFieldError('name')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'}
								{...getFieldProps('name',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:bankacct && bankacct.name?bankacct.name:''
								})}
							/>
					</div>
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100502/*账户币种*/)}</label>
						 <ConstVirtualSelect
							form={this.props.form}
							isRequest={false}
							fieldName="curcyId"
							rules
							initValueOptions={currens}
							initialValue={bankacct && bankacct.curren? bankacct.curren.id:''}
							className="col-md-8 col-lg-8"
						/>
					</div>
					<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100500/*银行账号*/)}</label>
							<input 
								type="text"
								className={getFieldError('bacctCode')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'}
								{...getFieldProps('bacctCode',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:bankacct && bankacct.bacctCode?bankacct.bacctCode:''
								})}
							/>
					</div>
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100504/*收款人*/)}</label>
						<input 
							type="text"
							className={getFieldError('actStaff')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'}
							{...getFieldProps('actStaff',{
								validateFirst: true,
								rules: [{required:true,}],
								initialValue:bankacct && bankacct.actStaff?bankacct.actStaff:''
							})}
						/>
					</div>
					<div className="form-group col-xs-12 col-md-12">
						<label className={'col-xs-2 col-md-2'}>{I18n.t(100505/*收款人地址*/)}</label>
						<input type="text" {...getFieldProps('actAddres', {
                                initialValue:bankacct && bankacct.actAddres?bankacct.actAddres:''
                            })} className ={'col-md-10 col-lg-10 text-input-nowidth'} />
					</div>
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100087/*国家*/)}</label>
						 <ConstVirtualSelect
							form={this.props.form}
							isRequest={false}
							fieldName="cntryId"
							rules
							initValueOptions={countrys}
							initialValue={bankacct && bankacct.country?bankacct.country.id:''}
							className="col-md-8 col-lg-8"
						/>
					</div>
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100507/*开户行*/)}</label>
						<input 
							type="text"
							className={getFieldError('bankName')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'}
							{...getFieldProps('bankName',{
								validateFirst: true,
								rules: [{required:true,}],
								initialValue:bankacct && bankacct.bankName?bankacct.bankName:''
							})}
						/>
					</div>
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-4 col-md-4'}>CNAPSCODE</label>
						<input type="text" {...getFieldProps('cnapsCode', {
                                initialValue:bankacct && bankacct.cnapsCode?bankacct.cnapsCode:''
                            })} className ={'col-md-8 col-lg-8 text-input-nowidth'} placeholder={""}/>
					</div>
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-4 col-md-4'}>SWIFT CODE</label>
						<input type="text" {...getFieldProps('swiftCode', {
                                initialValue:bankacct && bankacct.swiftCode?bankacct.swiftCode:''
                            })} className ={'col-md-8 col-lg-8 text-input-nowidth'} placeholder={""}/>
					</div>
					<div className="form-group col-xs-12 col-md-12">
						<label className={'col-xs-2 col-md-2'}>{I18n.t(100508/*银行地址*/)}</label>
						<input type="text" {...getFieldProps('bankadres', {
                                initialValue:bankacct && bankacct.bankadres?bankacct.bankadres:''
                            })} className ={'col-md-10 col-lg-10 text-input-nowidth'} 
						placeholder={""}/>
					</div>
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-4 col-md-4'}>{I18n.t(100123/*默认*/)}</label>
						<Checkbox
							{...getFieldProps('dfutMrk',{
								initialValue:bankacct&&bankacct.dfutMrk?bankacct.dfutMrk:false
							})}
							checked={this.props.form.getFieldValue("dfutMrk")}
						/>
					</div>
				</div>
			</div>
           );
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
						{content}
				</FormWrapper>
			</div>
			);
	}
	onSaveAndClose(){
		const {form ,onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.data);
				this.props.form.resetFields();
			}
		})
	}
	onCancel(){
		const {onCancel}=this.props;
        if(onCancel){
            onCancel();
            this.props.form.resetFields();
        }
	}
}
BankTemplateDialog.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
BankTemplateDialog.defaultProps ={
	onSaveAndClose(){},
    onCancel(){}
}
const BankTemplateForm =createForm()(BankTemplateDialog);
export default BankTemplateForm;


/*
	<Select
		animation='slide-up'
		placeholder={" "}
		className ={ getFieldError("curcyId") ?'currency-btn select-from-currency col-xs-8 col-md-8 error-border':'currency-btn select-from-currency col-xs-8 col-md-8'}
		choiceTransitionName="rc-select-selection__choice-zoom"
		optionLabelProp="children"
		{...getFieldProps('curcyId',{
			validateFirst: true,
			rules: [{required:true,}],
			initialValue:bankacct && bankacct.curren? bankacct.curren.id:undefined,
		})}>
		{
			currens.map((e,i) =>{
				return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)							
			})
		}
	</Select>
	<Select
		animation='slide-up'
		placeholder={" "}
		className ={ getFieldError("cntryId") ?'currency-btn select-from-currency col-xs-8 col-md-8 error-border':'currency-btn select-from-currency col-xs-8 col-md-8'}
		choiceTransitionName="rc-select-selection__choice-zoom"
		optionLabelProp="children"
		{...getFieldProps('cntryId',{
			validateFirst: true,
			rules: [{required:true,}],
			initialValue:bankacct && bankacct.country?bankacct.country.id:undefined,
		})}>
		<Option value={''} title={''}>{""}</Option>
		{
			countrys.map((e,i) =>{
				return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
			})
		}
	</Select>
*/
