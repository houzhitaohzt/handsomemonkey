import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option , ConstVirtualSelect} from '../../../../../components/Select';
export class  CertfctDialog extends Component{
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
		const { getFieldProps, getFieldError ,getNFieldProps } = this.props.form;
		let {data,initData} = this.props;
		const {certfcts,tradruleCertfct} = initData;
		this.data = Object.assign({},tradruleCertfct);
		let content;
		if(data.number == 0 || data.number == 1){
           content =(
           		<div className="girdlayout">
					<div className="row">
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(200963/*可提供证书*/)}</label>
							<Select
                                animation='slide-up'
                                className ={ getFieldError("certifctId") ?'col-xs-8 col-lg-8 currency-btn select-from-currency error-border':'col-xs-8 col-lg-8 currency-btn select-from-currency'}
                                choiceTransitionName="rc-select-selection__choice-zoom"
                                optionLabelProp="children"
                                {...getNFieldProps('certifctId',{
                                    validateFirst: true,
                                    rules: [{required:true,}],
                                    initialValue:undefined,
                                })}>
                                {
                                    initData.map((e,i) =>{
                                        return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
                                    })
                                }
                            </Select>
						</div>
					</div>
				</div>
           	);
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} showSaveAdd={!data.number==0} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} onSaveAdd={this.onSaveAdd} width={976}>
						{content}
				</FormWrapper> 
			</div>
			);
	}
}
CertfctDialog.propTypes ={
	onSaveAdd:PropTypes.func,
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
CertfctDialog.defaultProps ={
	onSaveAdd(){},
	onSaveAndClose(){},
    onCancel(){}
}
const CertfctDialogForm =createForm()(CertfctDialog);
export default CertfctDialogForm;

/*
<Select
	animation='slide-up'
	placeholder={''}
	className ={getFieldError('certifctId')?'currency-btn select-from-currency col-xs-9 col-md-9 text-input-nowidth error-border':'currency-btn select-from-currency col-xs-9 col-md-9 text-input-nowidth'}
	choiceTransitionName="rc-select-selection__choice-zoom"
	optionLabelProp="children"
	{...getFieldProps('certifctId',{
		validateFirst: true,
		rules: [{required:true,}],
		initialValue:String(tradruleCertfct && tradruleCertfct.certifctId? tradruleCertfct.certifctId:''),
	})}
	>
	{
		certfcts.map((e,i) =>{
			return (<Option key={i} value={String(e.id)} title={e.localName}>{e.localName}</Option>)							
		})
	}
</Select>
*/