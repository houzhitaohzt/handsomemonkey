import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Input from '../../../components/FormValidating/FormValidating';
import xt from '../../../common/xt'; // 下拉
import Select, { Option,ConstVirtualSelect,ConstMiniSelect } from '../../../components/Select';
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';
import AddMoreLanguage from "../../../components/AddMoreLanguage";
import {I18n} from "../../../lib/i18n"; 
export class ShelftypePlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.state=this.initState()
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
	danweiClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Unitofmea'},
		
			(response)=>{
				that.setState({
					danweiArray:response.data
				})
		},(error)=>{

		});
	}
	componentDidMount(){
		var that = this;
		//this.danweiClick();
    };
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		let {checkedData,info,datas} = this.props;
		info = info || {};
		info.unitofmeas = info.unitofmeas || [];
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
								
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100207/*基本单位*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Unitofmea' 
                                             fieldName="buomId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 buomId: da.id,
                                                 buomLcName: da.localName,
                                                 buomEnName:da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              
                                              allowClear
				                 	/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100594/*基础单位数量*/)}</label>
									
									<input type='text' className={getFieldError("bqtys") ?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} 
													    {...getFieldProps('bqtys',{
															validateFirst: true,
															rules: [{required:true}],
															initialValue:'1'
														})}
														disabled
								/>
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100209/*目标单位*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Unitofmea' 
                                             fieldName="uomId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 uomId: da.id,
                                                uomLcName: da.localName,
                                                 uomEnName:da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              
                                              allowClear
				                 	/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100210/*目标数量*/)}</label>
									<Input form={this.props.form} obj={{name:'qtys',type:'text', 
											initialValue:'',
											classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
								</div>
						</div>
						
					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			
			datas = datas || {};
			datas.unitofmea = datas.unitofmea || {};
			datas.bunitofmea = datas.bunitofmea || {};
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:datas? datas.id:''
			})
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:datas? datas.optlock:''
			})
			getFieldProps('nameValues', {
							            	validateFirst: true,
						                    initialValue:datas? datas.nameValues:''
			})
			getFieldProps('name', {
							            	validateFirst: true,
						                    initialValue:datas? datas.name:''
			})
			   content = (
			   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
								
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100207/*基本单位*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Unitofmea' 
                                             fieldName="buomId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 buomId: da.id,
                                                 buomLcName: da.localName,
                                                 buomEnName:da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              initialValue={xt.initSelectValue(datas.bunitofmea,{buomId:datas.bunitofmea.id,...datas.bunitofmea},['buomId'], 'localName', this.props.form)}
                                              allowClear
				                 	/> 
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100594/*基础单位数量*/)}</label>
									
									<input type='text' className={getFieldError("bqtys") ?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} 
														
													    {...getFieldProps('bqtys',{
															validateFirst: true,
															rules: [{required:true}],
															initialValue:datas.bqtys || '',
														})}
	
								/>
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100209/*目标单位*/)}</label>
									 
				                 	<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Unitofmea' 
                                             fieldName="uomId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 uomId: da.id,
                                                uomLcName: da.localName,
                                                 uomEnName:da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              initialValue={xt.initSelectValue(datas.unitofmea,{uomId:datas.unitofmea.id,...datas.unitofmea},['uomId'], 'localName', this.props.form)}
                                              allowClear
				                 	/> 
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100210/*目标数量*/)}</label>
									<Input form={this.props.form} obj={{name:'qtys',type:'text', 
											initialValue:datas.qtys || '',
											classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
								</div>
						</div>
						
					</div>
			</div>
			)
		}else if(this.props.DialogContent==5){
			content = (
				<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{I18n.t(100207/*基本单位*/)}</label>
									<div className={'col-xs-8 col-md-8'}>
										<p>{datas.bunitofmea.localName || ''}</p>
									</div>
								</div>
							
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100594/*基础单位数量*/)}</label>
								<div className={'col-xs-8 col-md-8'}>
									<p>{datas.bqtys || ''}</p>
								</div>
							</div>
							
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100209/*目标单位*/)}</label>
								<div className={'col-xs-8 col-md-8'}>
									<p>{datas.unitofmea.localName || ''}</p>
							</div>
							</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{I18n.t(100210/*目标数量*/)}</label>
										<div className={'col-xs-8 col-md-8'}>
											<p>{datas.qtys|| ''}</p>
										</div> 
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
const ProductForm =createForm()(ShelftypePlug);
export default ProductForm;
