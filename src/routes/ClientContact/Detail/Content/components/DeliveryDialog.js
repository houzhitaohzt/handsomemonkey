import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import RightKey from '../../../../../components/RightKey/RightKey';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件 交货港弹出框
import Select, { Option } from 'rc-select';
import Checkbox from '../../../../../components/CheckBox';
export class  NormalDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.onChangeCheck = this.onChangeCheck.bind(this);
        this.state ={
        	checkeds:false,
        	checkedc:false
        }
	}
	onChangeCheck(num,e){
		this.setState({
			checkeds:e.target.checked
		});
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {data} = this.props;
		getFieldProps('normal', {
		      initialValue: '0',
		 });
		let content;
		{
			content = (   <div className="client-normal-add scroll">
						<div className="client-normal-add-line1">
							<div>
								 <Checkbox
								    className='check-class'
									name="my-checkbox"
									onChange={this.onChangeCheck.bind(this,1)}
								    checked = {true}
								    style={{marginBottom:5,marginRight:5}}
								/>
								<label><span>*</span>{i18n.t(100156/*港口类型*/)}</label>
								<Select
									placeholder=''
									optionLabelProp="children"
									{...getFieldProps('11',{
									validateFirst: true,
									rules: [{required:true,}],
									valuedateTrigger:"onBlur",
									initialValue:undefined
									})}
									style={{width:100}}
									className ='currency-btn select-from-currency'>
									<Option value ={'0'}>{'dd'}</Option>
								</Select>
								<span className='hui'><i className='red'>*</i>{i18n.t(100155/*港口*/)}</span>
								<Select
									placeholder=''
									optionLabelProp="children"
									{...getFieldProps('11',{
									validateFirst: true,
									rules: [{required:true,}],
									valuedateTrigger:"onBlur",
									initialValue:undefined
									})}
									style={{width:100}}
									className ='currency-btn select-from-currency'>
										<Option value ={'0'}>{'dd'}</Option>
								</Select>
								<span className='hui'><i className='red'>*</i></span>
								<Select
									placeholder={i18n.t(100589/*计量单位*/)}
									optionLabelProp="children"
									{...getFieldProps('11',{
									validateFirst: true,
									rules: [{required:true,}],
									valuedateTrigger:"onBlur",
									initialValue:undefined
									})}
									style={{width:100}}
									className ='currency-btn select-from-currency'>
										<Option value ={'0'}>{'dd'}</Option>
								</Select>
								<span className='hui'><i className='red'>*</i></span>
								<Select
									placeholder={i18n.t(200466/*加收费用*/)}
									optionLabelProp="children"
									{...getFieldProps('11',{
									validateFirst: true,
									rules: [{required:true,}],
									valuedateTrigger:"onBlur",
									initialValue:undefined
									})}
									style={{width:100}}
									className ='currency-btn select-from-currency'>
										<Option value ={'0'}>{'dd'}</Option>
								</Select>
								<span className='hui'><i className='red'>*</i></span>
								<Select
									placeholder={i18n.t(100284/*币种*/)}
									optionLabelProp="children"
									{...getFieldProps('11',{
									validateFirst: true,
									rules: [{required:true,}],
									valuedateTrigger:"onBlur",
									initialValue:undefined
									})}
									style={{width:100}}
									className ='currency-btn select-from-currency'>
										<Option value ={'0'}>{'dd'}</Option>
								</Select>
							</div>
						</div>
			</div>);

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

	}
	onCancel(){
		const {onCancel}=this.props;
        if(onCancel){
            onCancel();
        }
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
