import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option } from 'rc-select';
import Radio from '../../../components/Radio';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
export class LogPlug extends Component{
	constructor(props){
		super(props);
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {checkedData} = this.props;
		getFieldProps('normal', {
		      initialValue: '0',
		 });
		let content = <div></div>;
		if(this.props.DialogContent==1){
			content = (
			   	<div className={'addnormal'}>
					1231312414
				</div>
			)
		}else if(this.props.DialogContent==4){
			content = (
				<div className='scroll lose'>
							<span>
								<i>*</i>
								失效原因
							</span>
							<Select
								placeholder={''}
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
					<FormWrapper showFooter={true} 
					showSaveClose={this.props.showSaveClose}
					buttonLeft = {this.props.buttonLeft} 
					onSaveAndClose={this.props.onSaveAndClose}
					 onCancel={this.props.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(LogPlug);
export default ProductForm;
