import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option ,ConstMiniSelect} from '../../../components/Select';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Input from '../../../components/FormValidating/FormValidating';
import AddMoreLanguage from "../../../components/AddMoreLanguage"; 
import {I18n} from "../../../lib/i18n";
import xt from './../../../common/xt';
export class CostNamePlug extends Component{
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
					let params = this.props.form.getFieldsValue();
					delete params['id'];
					delete params['optlock'];
					delete params['nameValues'];
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
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
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text', 
										initialValue:'',
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'localName',type:'text', 
										initialValue:'',
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100278/*费用小类*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Costlvt' 
                                             fieldName="costlvtId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 costlvtId: da.id,
                                               costlvtLcName: da.localName,
                                                 costlvtEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                              allowClear
				                    />
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{I18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('description', {
						                                initialValue:''
						                    })} className={'col-xs-8 col-md-8 text-input-nowidth'}/>
								</div>
						</div>
					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			checkedData =checkedData || {};
			checkedData.costlvt = checkedData.costlvt || {};
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.id:''
			})
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.optlock:''
			})
			getFieldProps('nameValues', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.nameValues:''
			})
			getFieldProps('name',{
						validateFirst: true,
						initialValue:checkedData? checkedData.name:''
			})
			   content = (
			   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text', 
										initialValue:checkedData.code,
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input  form={this.props.form} obj={{name:'localName',type:'text', 
										initialValue:checkedData.localName,
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
								<AddMoreLanguage 
								    menusetView={checkedData}
								    object = {'costlvtr'}
								    upload={this.props.upload}
								    onCancel ={this.onCancel}
								     isShowId={true}
							    />
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
											<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100278/*费用小类*/)}</label>
											<ConstMiniSelect form={this.props.form}
					             				 pbj='com.fooding.fc.ds.entity.Costlvt' 
	                                             fieldName="costlvtId"
	                                             optionValue={da => <Option key={da.id} objValue={{
	                                                 costlvtId: da.id,
	                                                costlvtLcName: da.localName,
	                                                costlvtEnName: da.name,
	                                                 s_label: da.localName
	                                             }}>{da.localName}</Option>}
	                                               initialValue={xt.initSelectValue(checkedData.costlvt,{costlvtId:checkedData.costlvt.id,...checkedData.costlvt},['costlvtId'], 'localName', this.props.form)}		
	                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
	                                              allowClear
	                                              reles={true}
					                 		/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{I18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('description', {
						                                initialValue:checkedData.description,
						                    })} className={'col-xs-8 col-md-8 text-input-nowidth'}/>
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
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100000/*代码*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.code}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100001/*名称*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.localName}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100278/*费用小类*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.costlvt.localName}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100002/*描述*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.description}</p>
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
const ProductForm =createForm()(CostNamePlug); 
export default ProductForm;
