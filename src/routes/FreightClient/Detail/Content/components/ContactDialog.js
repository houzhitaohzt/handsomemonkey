import i18n from './../../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, {Option,ConstVirtualSelect} from '../../../../../components/Select';
//引入复选框
import Checkbox from "../../../../../components/CheckBox";
import Input from '../../../../../components/FormValidating/FormValidating';

import {I18n} from "../../../../../lib/i18n";
import ServiceTips from '../../../../../components/ServiceTips';

export class  ContactDialog extends Component{ 
	constructor(props){
		super(props);
		let that = this;
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
		this.linkTypeChange=this.linkTypeChange.bind(this);
        this.data = null;
		this.validateReg = {
			isEmail: new RegExp("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$"),
			isTel: new RegExp("(^1(3|4|5|7|8)\\d{9}\$)|(\^((\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1})|(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1}))\$)"),
			isQQ: new RegExp("^[1-9]\\d{4,11}$"),
			isPhone: new RegExp("(^1(3|4|5|7|8)\\d{9}\$)|(\^((\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1})|(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1}))\$)")
		}
		this.state = {
			linkTypeId:this.props.initData.contact && this.props.initData.contact.id?this.props.initData.contact.id:'80'
		}
	}

	linkTypeChange = data => {	
		let that = this;	
		that.props.form.setFieldsValue({'name':""});
		that.setState({linkTypeId:data})
	}
	validate = (rule, value, callback) => {
		 	let that = this;
			if(that.state.linkTypeId == 20){
				/*  
					1.如果存在'+'号，必须在第一位 
					2.如果存在 '(' ，必须存在 ')' 
					3.'-'可以存在任意位置，但不能是第一位和最后一位 
					4.可以存在空格 
					5.必须有数字 
					6.长度不限 
					7.出现其他符号不能通过验证
				*/
				//表示是固定电话
				let reg = /^\s*\+?\s*(\(\s*\d+\s*\)|\d+)(\s*-?\s*(\(\s*\d+\s*\)|\s*\d+\s*))*\s*$/g;
				let isBool = reg.test(value) 
				if(isBool) callback([]);
				callback([i18n.t(200431/*请输入正确的电话号码*/)])
			}else if(that.state.linkTypeId == 40){
				//表示 是QQ
				let isBool = that.validateReg.isQQ.test(value);
				if(!isBool) callback(['QQ'])
				callback([]);
			}else if(that.state.linkTypeId == 80){
				//let isEmailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.(com|cn|net|com\.cn|))+$/g;
				//表示 是邮箱
				let emal = /[@]/g;
				let isBool = emal.test(value);
				if(!isBool) callback([i18n.t(200432/*请输入正确的邮箱*/)])
				callback([]);				
			}else if(that.state.linkTypeId == 100){
				//表示是手机
				let initReg = /\d/g;
				let regCNPhone = /^1(3|4|5|7|8)\d{9}$/g;
				let reg = /^\s*\+?\s*(\(\s*\d+\s*\)|\d+)(\s*-?\s*(\(\s*\d+\s*\)|\s*\d+\s*))*\s*$/g;				
				let isBool = reg.test(value) 
				if(isBool) callback([]);
				callback([i18n.t(200433/*请输入正确的手机号码*/)])	
			}else{
				callback([])
			}
		};
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getFieldValue} = this.props.form;
		let {data,initData} = this.props;
		let {linkTypes,contact} = initData;
		this.data = Object.assign({},contact);
		
		let content;
		if(data.number == 0 || data.number == 1){
			content  = (
			<div className={'girdlayout'}>
				<div className={'row'}>
						<div className="form-group col-xs-1 col-md-1" style={{textAlign:'right',marginLeft:"140px"}}>
							<Checkbox
								{...getFieldProps('dfutMrk',{
									initialValue:contact&&('dfutMrk' in contact)?contact.dfutMrk:false
								})}
								checked={this.props.form.getFieldValue("dfutMrk")}
						/>
						</div>
						<div className="form-group col-xs-2 col-md-2">
							<label className={'col-xs-1 col-md-1'}></label>
							<ConstVirtualSelect
								form={this.props.form}
								isRequest={false}
								fieldName="linkTyId"
								rules
								initValueOptions={linkTypes}
								initialValue={contact&&contact.linkType?contact.linkType.id:'80'}
								className="col-md-10 col-lg-10"
								onChange={this.linkTypeChange}
							/>
						</div>
						<div className="form-group col-xs-4 col-md-4">
							<input 
								type="text"
								className={getFieldError('name')?'text-input-nowidth col-md-12 col-lg-12 error-border':'text-input-nowidth col-md-12 col-lg-12'}
								{...getFieldProps('name',{
									validateFirst: true,
									rules: [{required:true},this.validate],
									initialValue:String(contact&&contact.name?contact.name:''),
								})}
							/>
						</div>
					</div>
			</div>)
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} showSaveAdd={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} onSaveAdd={this.onSaveAdd} width={976} >
						{content}
				</FormWrapper>
			</div>
			);
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
	onSaveAdd = () => {
		const {form,onSaveAdd} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				onSaveAdd(this.props.form.getFieldsValue());
				this.props.form.resetFields();
			}
		})
	}
}
ContactDialog.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func,
	onSaveAdd:PropTypes.func
}
ContactDialog.defaultProps ={
	onSaveAndClose(){},
    onCancel(){},
	onSaveAdd(){}
}
const ContactDialogForm =createForm()(ContactDialog);
export default ContactDialogForm;


// WEBPACK FOOTER //
// ./src/routes/Client/Detail/Content/components/ContactDialog.js

/*
<Select
	animation='slide-up'
	placeholder={""}
	className ={getFieldError('linkTyId')?'currency-btn select-from-currency col-md-10 col-lg-10 error-border':'currency-btn select-from-currency col-md-10 col-lg-10'}
	choiceTransitionName="rc-select-selection__choice-zoom"
	optionLabelProp="children"
	{...getFieldProps('linkTyId',{
		validateFirst: true,
		rules: [{required:true,}],
		initialValue:String(contact&&contact.linkType?contact.linkType.id:'80'),
	})}
>
	{
		linkTypes.map((e,i) =>{
			return (<Option key={i} value={String(e.id)} title={e.name}>{e.name}</Option>)
		})
	}
</Select>
*/
