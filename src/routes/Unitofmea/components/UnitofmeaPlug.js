import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option,ConstMiniSelect} from '../../../components/Select';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Input from '../../../components/FormValidating/FormValidating';
import {I18n} from "../../../lib/i18n";
import AddMoreLanguage from "../../../components/AddMoreLanguage"; 
import {apiGet, apiPost, apiForm, language, API_FOODING_ERP, API_FOODING_DS, API_FOODING_ES} from '../../../services/apiCall';
import xt from '../../../common/xt';
export class UnitofmeaPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.state=this.initState();
		this.getData = this.getData.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.danweiClick=this.danweiClick.bind(this);
	}
	initState(){
		return {
			danweiArray:[]
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
					delete params['nameValues'];
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				}
				this.props.form.resetFields();
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
	danweiClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.UnitofmeaType'},
		
			(response)=>{
				that.setState({
					danweiArray:response.data
				})
		},(error)=>{

		});
	}
	
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {checkedData} = this.props;
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<input  
											   				 type="text"
																{...getFieldProps('code',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue:''})}
																className={getFieldError("code") ?'col-xs-9 col-md-9 text-input-nowidth error-border':'col-xs-9 col-md-9 text-input-nowidth'} 
																
								/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<input  
											   				 type="text"
																{...getFieldProps('localName',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue:''})}
																className={getFieldError("localName") ?'col-xs-9 col-md-9 text-input-nowidth error-border':'col-xs-9 col-md-9 text-input-nowidth'} 
																
								/>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{I18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('description', {
						                                initialValue:''
						                    })} className={'col-md-9 col-lg-9 text-input-nowidth'}/>

								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100004/*单位类型*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.UnitofmeaType' 
                                             fieldName="typeId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                typeId: da.id,
                                               	name:da.name,
                                                s_label: da.name
                                             }}>{da.name}</Option>}
                                             	reles={true}
                                             className ={'col-md-9 col-lg-9 currency-btn select-from-currency'}
                                             
                                              
				                    /> 
								</div>
						</div>
					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			checkedData =checkedData || {};
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
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<input  
											   				 type="text"
																{...getFieldProps('code',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue:checkedData.code || ''})}
																className={getFieldError("localName") ?'col-xs-9 col-md-9 text-input-nowidth error-border':'col-xs-9 col-md-9 text-input-nowidth'} 
																
								/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<input  
											   				 type="text"
																{...getFieldProps('localName',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue:checkedData.localName?checkedData.localName:''})}
																className={getFieldError("localName") ?'col-xs-9 col-md-9 text-input-nowidth error-border':'col-xs-9 col-md-9 text-input-nowidth'} 
																
								/>
								<AddMoreLanguage 
								    menusetView={checkedData}
								    object = {'unitofmea'}
								    upload={this.props.upload}
								    onCancel ={this.onCancel}
								    isShowId={true}
							    />
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{I18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('description', {
						                                initialValue:checkedData.description?checkedData.description:'',
						                    })} className={'col-md-9 col-lg-9 text-input-nowidth'}/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100004/*单位类型*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.UnitofmeaType' 
                                             fieldName="typeId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                typeId: da.id,
                                               	name:da.name,
                                                s_label: da.name
                                             }}>{da.name}</Option>}
                                             	reles={true}
                                             className ={'col-md-9 col-lg-9 currency-btn select-from-currency'}
                                             initialValue={xt.initSelectValue(checkedData,{typeId:checkedData.typeId,...checkedData},['typeId'], 'unitofmeaType', this.props.form)}
                                             
				                    />
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
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100000/*代码*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.record.code}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100001/*名称*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.record.localName}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100002/*描述*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.record.description}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100004/*单位类型*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.record.unitofmeaType}</p>
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
const ProductForm =createForm()(UnitofmeaPlug);
export default ProductForm;
