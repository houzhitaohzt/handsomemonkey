import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option } from '../../../components/Select';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Input from '../../../components/FormValidating/FormValidating';
export class TranstypePlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
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
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.props.checkedData.record,isAdd);
				}this.props.form.resetFields();

				
			}
		})
	}
	onSaveAdd(){
		this.onSaveAndClose(true);
	}
	onCancel(){
		const {form, onCancel} = this.props;
		this.props.onCancel();
		this.props.form.resetFields();
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {checkedData,info} = this.props;
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-2 col-lg-2'}><span>*</span>id</label>
								<Input form={this.props.form} obj={{name:'id',type:'text', 
										initialValue:'',
										classn:'col-md-10 col-lg-10 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-2 col-lg-2'}><span>*</span>{i18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text', 
										initialValue:'',
										classn:'col-md-10 col-lg-10 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-2 col-lg-2'}><span>*</span>{i18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'localName',type:'text', 
										initialValue:'',
										classn:'col-md-10 col-lg-10 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-2 col-lg-2'}>{i18n.t(100214/*箱型*/)}</label>
										<Input form={this.props.form} obj={{name:'costlvtId',type:'select',classn:'col-md-10 col-lg-10 currency-btn select-from-currency',moduleIdArray:info.costlvts}}/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-2 col-lg-2'}>{i18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('description', {
						                                initialValue:''
						                    })} className={'col-md-10 col-lg-10 text-input-nowidth'}/>
								</div>
						</div>
					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			   content = (
			   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-2 col-lg-2'}>{i18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text', 
										initialValue:checkedData.record.code,
										classn:'col-md-10 col-lg-10 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-2 col-lg-2'}><span>*</span>{i18n.t(100001/*名称*/)}</label>
								<Input  form={this.props.form} obj={{name:'localName',type:'text', 
										initialValue:checkedData.record.localName,
										classn:'col-md-10 col-lg-10 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
											<label className={'col-md-2 col-lg-2'}>{i18n.t(100278/*费用小类*/)}</label>
											<Input form={this.props.form} obj={{name:'costlvtId',type:'select',initialValue:checkedData.record.costlvt.name, classn:'col-md-10 col-lg-10 currency-btn select-from-currency',moduleIdArray:info.costlvts}}/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-2 col-lg-2'}>{i18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('description', {
						                                initialValue:checkedData.record.description,
						                    })} className={'col-md-10 col-lg-10 text-input-nowidth'}/>
								</div>
						</div>
					</div>
			    </div>
			)
		}else if(this.props.DialogContent==5){
			content = (
				<div className={'girdlayout scroll'} style={{overflow:'auto'}}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-2 col-md-2'}>{i18n.t(100000/*代码*/)}</label>
							<div className={'col-xs-10 col-md-10'}>
								<p className={'paragraph'}>{checkedData.record.code}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-2 col-md-2'}>{i18n.t(100001/*名称*/)}</label>
							<div className={'col-xs-10 col-md-10'}>
								<p className={'paragraph'}>{checkedData.record.localName}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-2 col-md-2'}>{i18n.t(100214/*箱型*/)}</label>
							<div className={'col-xs-10 col-md-10'}>
								<p className={'paragraph'}>{checkedData.record.costlvtId}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-2 col-md-2'}>{i18n.t(100002/*描述*/)}</label>
							<div className={'col-xs-10 col-md-10'}>
								<p className={'paragraph'}>{checkedData.record.description}</p>
							</div>
						</div>
					</div>
				</div>
			)
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper 
					showFooter={true} 
					buttonLeft = {this.props.buttonLeft} 
					onSaveAndClose={this.onSaveAndClose} 
					onCancel={this.onCancel}
					onSaveAdd={this.onSaveAdd}
					showSaveAdd={this.props.showSaveAdd}
					showSaveClose={this.props.showSaveClose}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(TranstypePlug); 
export default ProductForm;
