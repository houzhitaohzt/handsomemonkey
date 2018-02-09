import React, {Component} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, {Option} from '../../../../../components/Select';
import Checkbox from '../../../../../components/CheckBox';
import {I18n} from "../../../../../lib/i18n";

export class  AccountDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.data = null;
	}
	onSaveAdd(){
		const {form, onSaveAdd} = this.props;
		 form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.onSaveAdd(this.props.form.getFieldsValue(),this.data);
				this.props.form.resetFields();
			}
		})
	}
	onSaveAndClose(){ 
		const {form, onSaveAndClose} = this.props;
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
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {data,initData} = this.props;
		const {currens,cstmSal} = initData;
		this.data = Object.assign({},cstmSal);
		let content;
		if(data.number == 0 || data.number == 1){
			content  = (
			<div className={'girdlayout'}>
				<div className={'row'}>
						<div className="form-group col-xs-1 col-md-1" style={{textAlign:'right',marginLeft:"140px"}}>
							<Checkbox
									{...getFieldProps('dfutMrk',{
										initialValue:cstmSal && cstmSal.dfutMrk? cstmSal.dfutMrk:false
								})}
								checked={this.props.form.getFieldValue("dfutMrk")}
							/>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100511/*结算币种*/)}</label>
							<Select
								animation='slide-up'
								className ={getFieldError('ordCurcyId')?"currency-btn select-from-currency col-md-9 col-lg-9 error-border":'currency-btn select-from-currency col-md-9 col-lg-9'}
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('ordCurcyId',{
									validateFirst: true,
									rules: [{required: true,}],
									valuedateTrigger: 'onBlur',
									initialValue:cstmSal && cstmSal.ordCurcyId? cstmSal.ordCurcyId:undefined,
								})}
							>
								{
									currens.map((e,i) =>{
										return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
									})
								}
							</Select>
						</div>
					</div>
			</div>)
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} showSaveAdd={!data.number ==0} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} onSaveAdd={this.onSaveAdd} width={976}>
						{content}
				</FormWrapper> 
			</div>
			);
	}
}
const DialogFrom =createForm()(AccountDialog);
export default DialogFrom;


/*
	content =(
		<div className="contact-add scroll">
			<Checkbox
					{...getFieldProps('dfutMrk',{
						initialValue:cstmSal && cstmSal.dfutMrk? cstmSal.dfutMrk:false
				})}
				checked={this.props.form.getFieldValue("dfutMrk")}
			/>
			<label><span>*</span>{I18n.t(100511*//*结算币种*//*)}</label>
			<Select
				animation='slide-up'
				style={{marginLeft:10,marginRight:10,width:300}}
				className ={getFieldError('ordCurcyId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
				choiceTransitionName="rc-select-selection__choice-zoom"
				optionLabelProp="children"
				{...getFieldProps('ordCurcyId',{
					validateFirst: true,
					rules: [{required:true}],
					initialValue:cstmSal && cstmSal.ordCurcyId? cstmSal.ordCurcyId:'',
				})}
			>
				{
					currens.map((e,i) =>{
						return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
					})
				}
			</Select>	
		</div>
	);
*/
