import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../../../components/Select';
//引入复选框
import Checkbox from "../../../../../components/CheckBox";
import Radio from '../../../../../components/Radio';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../../services/apiCall";
import Input from '../../../../../components/FormValidating/FormValidating';
//引入国际化
import {I18n} from '../../../../../lib/i18n';
export class  DataextDivsnDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
	}
	initState(){
		return{
			
		}
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getFieldValue} = this.props.form;
		let {data,initData} = this.props;
		let content;
		if(data.number == 0 || data.number == 1){
           content =(
			   <div className={'girdlayout'}>
				<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100530/*行业细分*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								isRequest={false}
								fieldName="beDataMulDivId"
								rules
								initValueOptions={initData}
								initialValue={''}
								className="col-md-9 col-xs-9"
							/>
						</div>
					</div>
			</div>
           	);
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976} onSaveAdd={this.onSaveAdd} showSaveAdd={true}>
						{content}
				</FormWrapper>
			</div>
			);
	}
	onSaveAdd(){
		const {form, onSaveAdd} = this.props;
		 form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.onSaveAdd(this.props.form.getFieldsValue(),this.props.data);
				this.props.form.resetFields();
			}
		})
	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.props.data);
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
DataextDivsnDialog.propTypes ={
	onSaveAdd:PropTypes.func,
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
DataextDivsnDialog.defaultProps ={
	onSaveAdd(){},
	onSaveAndClose(){},
    onCancel(){}
}
const DataextDivsnForm =createForm()(DataextDivsnDialog);
export default DataextDivsnForm;


// WEBPACK FOOTER //
// ./src/routes/Client/Detail/Content/components/ContactDialog.js
