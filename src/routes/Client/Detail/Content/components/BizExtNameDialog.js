import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';

//引入ajax请求
export class  BizExtNameDialog extends Component{
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
		const { getFieldProps, getFieldError, getNFieldProps} = this.props.form;
		let {data,initData} = this.props;
		this.data = Object.assign({},initData);
		let content;
		if(data.number == 0 || data.number == 1){
           content =(
			   <div className="girdlayout">
				<div className="row">
					<div className="form-group col-xs-6 col-md-6" style={{marginLeft:"140px"}}>
							<label className={'col-xs-4 col-md-4'}><span>*</span>{data.name.title}</label>
							<input 
								type="text"
								className={getFieldError('extName')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'}
								{...getFieldProps('extName',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:String(initData && initData.extName?initData.extName:'')
								})}
							/>
					</div>
				</div>
			</div>
           	);
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} showSaveAdd={false} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} onSaveAdd={this.onSaveAdd} width={976}>
						{content}
				</FormWrapper> 
			</div>
			);
	}
}
BizExtNameDialog.propTypes ={
	onSaveAdd:PropTypes.func,
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
BizExtNameDialog.defaultProps ={
	onSaveAdd(){},
	onSaveAndClose(){},
    onCancel(){}
}
const BizExtNameDialogForm =createForm()(BizExtNameDialog);
export default BizExtNameDialogForm;

/*
	<div className="contact-add scroll">
		<label><span style={{color:'red'}}>&nbsp;&nbsp;*&nbsp;&nbsp;</span>{data.name.title}</label>
		<input type="text" className="text-input-nowidth" style={{width:350}} 
			className ={getFieldError('extName')?'text-input-nowidth error-border':'text-input-nowidth'}
			{...getNFieldProps('extName',{
				validateFirst: true,
				rules: [{required:true,}],
				initialValue:String(initData && initData.extName?initData.extName:'')
		})}/>
	</div>
*/
