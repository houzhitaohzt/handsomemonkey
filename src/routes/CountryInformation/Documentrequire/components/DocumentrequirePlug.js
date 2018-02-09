import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import Calendar from  '../../../../components/Calendar/Calendar';
import Checkbox from '../../../../components/CheckBox';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import xt from '../../../../common/xt'; // 下拉
import Select, { Option,ConstVirtualSelect,ConstMiniSelect } from '../../../../components/Select';
import Input from '../../../../components/FormValidating/FormValidating';
import {I18n} from "../../../../lib/i18n";
export class DocumentrequirePlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.getData = this.getData.bind(this);
		this.state ={
			info:{}
		}
	}
	getData(value,that){
		this.addSelect = that;
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				if(this.props.DialogContent == 1){
					let params = this.props.form.getFieldsValue();
					delete params['id'];
					delete params['optlock'];
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				}this.props.form.resetFields();

				
			}
		})
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps} = this.props.form;
		let {checkedData} = this.props;
		let content = <div></div>;
		getFieldProps('dataTyId',{
									initialValue:10,
								});
		if(this.props.DialogContent == 1){
			getFieldProps('sourceId',{
									initialValue:this.props.sourceId,
			});
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100128/*单据要求*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.BillRequ' 
                                             fieldName="billRequId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 billRequId: da.id,
                                                 billRequLcName: da.localName,
                                                 billRequEnName:da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              allowClear
				                 	/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100148/*注释*/)}</label>
								<Input form={this.props.form} obj={{name:'itemTxt',type:'text', 
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
						</div>
					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			checkedData = checkedData || {};
			checkedData.billRequ = checkedData.billRequ || {};
			getFieldProps('sourceId',{
									initialValue:this.props.sourceId,
			});
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.id:''
			});
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.optlock:''
			})
			   content = (
			   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100128/*单据要求*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.BillRequ' 
                                             fieldName="billRequId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 billRequId: da.id,
                                                 billRequLcName: da.localName,
                                                 billRequEnName:da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             	initialValue={xt.initSelectValue(checkedData.billRequ,{billRequId:checkedData.billRequ.id,...checkedData.billRequ},['billRequId'], 'localName', this.props.form)}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              allowClear
				                />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100148/*注释*/)}</label>
								<Input form={this.props.form} obj={{name:'itemTxt',type:'text', 
										initialValue:checkedData.itemTxt,
										classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
							</div>
						</div>
					</div>
				</div>
				)
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const DocumentrequireForm =createForm()(DocumentrequirePlug);
export default DocumentrequireForm;
