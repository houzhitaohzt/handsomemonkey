import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option } from '../../../../components/Select';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import DataTime from  '../../../../components/Calendar/Calendar';
import Input from '../../../../components/FormValidating/FormValidating';
import Checkbox from "../../../../components/CheckBox";
import AddMoreLanguage from "../../../../components/AddMoreLanguage";
import {apiGet, apiPost, apiForm, language, API_FOODING_ERP, API_FOODING_DS, API_FOODING_ES} from '../../../../services/apiCall';
import {I18n} from "../../../../lib/i18n"; 
export class Productplug extends Component{
	constructor(props){
		super(props);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.state=this.initState();
		this.zhifutiaokuanClick = this.zhifutiaokuanClick.bind(this);
		this.xinbaoClick = this.xinbaoClick.bind(this);
	}
	initState(){
		return {
			hangxianArray:[],
			zhifutiaokuanArray:[],
			xinbaoArray:[]
		}
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
	zhifutiaokuanClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.PayTagType'},
		
			(response)=>{
				that.setState({
					zhifutiaokuanArray:response.data
				})
		},(error)=>{

		});
	}
	xinbaoClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.CorpType'},
		
			(response)=>{
				that.setState({
					xinbaoArray:response.data
				})
		},(error)=>{

		});
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps} = this.props.form;
		let {checkedData,info} = this.props;
		info = info || {};
		info.payTagTypes = info.payTagTypes || [];
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6">
								<label className={'col-md-3'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text',
													initialValue:'',
													classn:'col-md-9 col-lg-9 text-input-nowidth'}}
								/> 
							</div>
							<div className="form-group col-md-6">
								<label className={'col-md-3'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'localName',type:'text',
													initialValue:'',
													classn:'col-md-9 col-lg-9 text-input-nowidth'}}
								/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6">
								<label className={'col-md-3'}><span>*</span>{I18n.t(100193/*支付条款分组*/)}</label>
								<Select
											animation='slide-up'
											onClick={this.zhifutiaokuanClick}
											className ={getFieldError("payTagTypeId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
											optionLabelProp="children"
												{...getFieldProps('payTagTypeId',{
													validateFirst: true,
													rules: [{required:true}],
													initialValue:undefined
												})}
												allowClear={false}
										>
										{
											this.state.zhifutiaokuanArray.map((e,i)=>{
															return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
														})
										}
								</Select> 
							</div>
							<div className="form-group col-md-6">
								<label className={'col-md-3'}>{I18n.t(100190/*信保标识*/)}</label>
								<Checkbox 
								
									{...getFieldProps('crdPrMark',{
										initialValue:false
									})}
									checked={this.props.form.getFieldValue("crdPrMark")}
								/>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6">
									<label className={'col-md-3'}><span>*</span>{I18n.t(100189/*信保分类*/)}</label>
									<Select
											animation='slide-up'
											onClick={this.xinbaoClick}
											className ={getFieldError("corpTyId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
											optionLabelProp="children"
												{...getFieldProps('corpTyId',{
													validateFirst: true,
													rules: [{required:true}],
													initialValue:undefined
												})}
												allowClear={false}
										>
										{
											this.state.xinbaoArray.map((e,i)=>{
															return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
														})
										}
								</Select>
								</div>
								<div className="form-group col-md-6">
									<label className={'col-md-3'}>{I18n.t(100191/*信保天数*/)}</label>
									<input type="text" className='col-md-9 col-lg-9 text-input-nowidth'
										{...getFieldProps('limtDays',{
													initialValue:''
										})}
								/>
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6">
								<label className={'col-md-3'}>{I18n.t(100192/*投保比例*/)}</label>
								<input type="text" className='col-md-9 col-lg-9 text-input-nowidth'
										{...getFieldProps('insurePercent',{
													initialValue:''
										})}
								/> 
							</div>
							<div className="form-group col-md-6">
								<label className={'col-md-3'}>{I18n.t(600237/*银行通知费*/)}</label>
								<Checkbox 
									{...getFieldProps('bankNoticeFee',{
										initialValue:false
									})}
									checked={this.props.form.getFieldValue("bankNoticeFee")}
								/>
							</div>							
						</div>
					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
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
							<div className="form-group col-md-6">
								<label className={'col-md-3'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text',
													initialValue:checkedData.code?checkedData.code:'',
													classn:'col-md-9 col-lg-9 text-input-nowidth'}}
								/> 
							</div>
							<div className="form-group col-md-6">
								<label className={'col-md-3'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'localName',type:'text',
													initialValue:checkedData.localName?checkedData.localName:'',
													classn:'col-md-9 col-lg-9 text-input-nowidth'}}
								/>
								<AddMoreLanguage 
								    menusetView={checkedData}
								    object = {'payTrm'}
								    upload={this.props.upload}
								    onCancel ={this.onCancel}
								     isShowId={true}
							    />
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6">
								<label className={'col-md-3'}><span>*</span>{I18n.t(100193/*支付条款分组*/)}</label>
								<Select
											animation='slide-up'
											onClick={this.zhifutiaokuanClick}
											className ={getFieldError("payTagTypeId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
											optionLabelProp="children"
												{...getNFieldProps('payTagTypeId',{
													validateFirst: true,
													rules: [{required:true}],
													initialValue:checkedData.payTagType?{s_label:checkedData.payTagType.name,payTagTypeId:checkedData.payTagType.id}:undefined
												})}
												allowClear={false}
										>
										{
											this.state.zhifutiaokuanArray.map((e,i)=>{
															return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
														})
										}
								</Select> 
							</div>
							<div className="form-group col-md-6">
								<label className={'col-md-3'}>{I18n.t(100190/*信保标识*/)}</label>
								<Checkbox 
									{...getFieldProps('crdPrMark',{
										initialValue:checkedData.crdPrMark
									})}
									checked={this.props.form.getFieldValue("crdPrMark")}
								/>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6">
									<label className={'col-md-3'}><span>*</span>{I18n.t(100189/*信保分类*/)}</label>
									<Select
											animation='slide-up'
											onClick={this.xinbaoClick}
											className ={getFieldError("corpTyId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
											optionLabelProp="children"
												{...getNFieldProps('corpTyId',{
													validateFirst: true,
													rules: [{required:true}],
													initialValue:checkedData.corpType?{s_label:checkedData.corpType.name,corpTyId:checkedData.corpType.id}:undefined
												})}
												allowClear={false}
										>
										{
											this.state.xinbaoArray.map((e,i)=>{
															return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
														})
										}
								</Select>
								</div>
								<div className="form-group col-md-6">
									<label className={'col-md-3'}>{I18n.t(100191/*信保天数*/)}</label>
									<input type="text" className='col-md-9 col-lg-9 text-input-nowidth'
										{...getFieldProps('limtDays',{
													initialValue:checkedData.limtDays?checkedData.limtDays:''
										})}
								/>
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6">
								<label className={'col-md-3'}>{I18n.t(100192/*投保比例*/)}</label>
								<input type="text" className='col-md-9 col-lg-9 text-input-nowidth'
										{...getFieldProps('insurePercent',{
													initialValue:checkedData.insurePercent?checkedData.insurePercent:''
										})}
								/> 
							</div>
							<div className="form-group col-md-6">
								<label className={'col-md-3'}>{I18n.t(600237/*银行通知费*/)}</label>
								<Checkbox 
									{...getFieldProps('bankNoticeFee',{
										initialValue:checkedData.bankNoticeFee
									})}
									checked={this.props.form.getFieldValue("bankNoticeFee")}
								/>
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
					showSaveAdd={this.props.showSaveAdd}
					onSaveAndClose={this.onSaveAndClose} 
					onCancel={this.onCancel}
					onSaveAdd={this.onSaveAdd}
					showSaveClose={this.props.showSaveClose}
					>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(Productplug);
export default ProductForm;

