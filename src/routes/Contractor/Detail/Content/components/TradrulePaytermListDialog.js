import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option, ConstVirtualSelect } from '../../../../../components/Select';
//引入复选框
import Checkbox from "../../../../../components/CheckBox";
import Radio from '../../../../../components/Radio';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../../services/apiCall";
import Input from '../../../../../components/FormValidating/FormValidating';
import {I18n} from '../../../../../lib/i18n';
export class  TradrulePaytermListDialog extends Component{
	constructor(props){
		super(props);
		let that = this;
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.data = null;
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getFieldValue} = this.props.form;
		let {data,initData} = this.props;
		const {payTrms,tradrulePayterm} = initData;
		this.data = Object.assign({},tradrulePayterm);
		let content;
		if(data.number == 0 || data.number == 1){
           content =(
			   <div className={'girdlayout'}>
				<div className={'row'}>
						<div className="form-group col-xs-1 col-md-1" style={{textAlign:'right',marginLeft:"140px"}}>
							<Checkbox
								{...getFieldProps('dfutMrk',{
										initialValue:tradrulePayterm && ('dfutMrk' in tradrulePayterm)? tradrulePayterm.dfutMrk:false
								})}
								checked={this.props.form.getFieldValue("dfutMrk")}
							/>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100133/*支付条款*/)}</label>
							<ConstVirtualSelect
								form={this.props.form} 
								isRequest={false}
								fieldName="payTermID"
								rules
								initValueOptions={payTrms}
								initialValue={tradrulePayterm && tradrulePayterm.payTermID? tradrulePayterm.payTermID:''}
								className={'col-md-9 col-lg-9'}
								optionHeight={50}
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
}
TradrulePaytermListDialog.propTypes ={
	onSaveAdd:PropTypes.func,
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
TradrulePaytermListDialog.defaultProps ={
	onSaveAdd(){},
	onSaveAndClose(){},
    onCancel(){}
}
const TradrulePaytermListForm =createForm()(TradrulePaytermListDialog);
export default TradrulePaytermListForm;


// WEBPACK FOOTER //
// ./src/routes/Client/Detail/Content/components/ContactDialog.js
/*
	<Select
		animation='slide-up'
		placeholder={I18n.t(100133*//*支付条款*//*)}
		style={{marginLeft:10,marginRight:10,width:300}}
		className ={ getFieldError("payTermID") ?'select-from-currency error-border':'currency-btn select-from-currency'}
		choiceTransitionName="rc-select-selection__choice-zoom"
		optionLabelProp="children"
		
		{...getFieldProps('payTermID',{
			validateFirst: true,
			rules: [{required:true,}],
			initialValue:String(tradrulePayterm && tradrulePayterm.payTermID? tradrulePayterm.payTermID:''),
		})}
	>
		{
			payTrms.map((e,i) =>{
				return (<Option key={i} value={String(e.id)} title={e.name}>{e.name}</Option>)
			})
		}
	</Select>
*/
