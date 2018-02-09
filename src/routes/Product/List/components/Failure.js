import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';

class Failure extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
	}
	static propTypes={
		onSaveAndClose:PropTypes.func,
		onCancel:PropTypes.func,
		form:PropTypes.object
	}
	onSaveAndClose(){
		const {onSaveAndClose,form} = this.props;
		form.validateFields((errors, value) => {
			if(null == errors){
				if(onSaveAndClose){
					onSaveAndClose(form.getFieldsValue())
				}
			}
		})
	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	render(){
		const {form} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		return(<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976} leftButn={i18n.t(200931/*确认并关闭*/)}>
				<div className='scroll failure'>
					<span>
						<i>*</i>
						失效原因
					</span>
					<input type="text" className={'text-input-nowidth'} style={{width:'600px'}}
					 {...getFieldProps('reason', {
					 validateFirst: true,
				     rules: [
				     {
				          required: true,
				     }
				     ],
				     validateTrigger: 'onBlur',
				     initialValue:''
				     })}
					/>
				</div>
			</FormWrapper>)
	}
}
Failure = createForm()(Failure);
export default Failure;
