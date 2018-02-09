import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option ,ConstMiniSelect} from '../../../components/Select';
import xt from './../../../common/xt';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import DataTime from  '../../../components/Calendar/Calendar';
import Input from '../../../components/FormValidating/FormValidating';
import WebData from '../../../common/WebData';
import AddMoreLanguage from "../../../components/AddMoreLanguage"; 
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,pageSize,sizeList} from '../../../services/apiCall';
import {I18n} from "../../../lib/i18n"; 
export class Productplug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.state=this.initState();
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.ccidClick = this.ccidClick.bind(this);
	}
	getData(value,that){
		this.addSelect = that;
	}
	initState(){
		return {
			ccidArray:[]
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
	ccidClick(){
		var that =this;
		apiGet(API_FOODING_ES,'/party/getLoginCompanies',{},(response)=>{
			that.setState({
				ccidArray:response.data
			});
		},(errors)=>{

		})
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps} = this.props.form;
		let {checkedData,ccid} = this.props;
		let content = <div></div>;
		let ccLocalName = WebData.user.data.staff.cluster.localName;
		let Cid = WebData.user.data.staff.ccid;
		if(this.props.DialogContent == 1){
			content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}>{I18n.t(100281/*汇率类型*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.ExRateType' 
                                             fieldName="exRateTypeId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 exRateTypeId: da.id,
                                                exRateTypeName: da.name,
                                                
                                                 s_label: da.name
                                             }}>{da.name}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              allowClear
				                 /> 
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}>{I18n.t(100282/*汇率精度*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.ExRatePrecision' 
                                             fieldName="exRatePrecisionId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 exRatePrecisionId: da.id,
                                                exRatePrecisionName: da.name,
                                                
                                                 s_label: da.name
                                             }}>{da.name}</Option>}
                                             reles={true}	
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              allowClear
				                 />
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100283/*原币*/)}</label>
									<ConstMiniSelect form={this.props.form}
					             				 pbj='com.fooding.fc.ds.entity.Curren' 
	                                             fieldName="basCnyId"
	                                             optionValue={da => <Option key={da.id} objValue={{
	                                                basCnyId: da.id,
	                                                basCnyName: da.name,
	                                                basCnyLCname:da.localName,
	                                                 s_label: da.localName
	                                             }}>{da.localName}</Option>}
	                                             	reles={true}
	                                             className ={'col-md-8 col-lg-8currency-btn select-from-currency'}
	                                              allowClear
					                 />
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100285/*目标币*/)}</label>
									
									<ConstMiniSelect form={this.props.form}
						             				 pbj='com.fooding.fc.ds.entity.Curren' 
		                                             fieldName="targetCnyId"
		                                             optionValue={da => <Option key={da.id} objValue={{
		                                                targetCnyId: da.id,
		                                                targetCnyName: da.name,
		                                                targetCnyLCname:da.localName,
		                                                s_label: da.localName
		                                             }}>{da.localName}</Option>}
		                                             	reles={true}
		                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
		                                              allowClear
						                 />
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}>{I18n.t(100279/*直接汇率*/)}</label>
								<input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
										{...getFieldProps('basRat',{
													initialValue:''
										})}
								/> 
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}>{I18n.t(100280/*间接汇率*/)}</label>
								<input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
										{...getFieldProps('indirectRat',{
													initialValue:''
										})}
								/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100286/*生效日期*/)}</label>
								<div className={'col-md-8 col-lg-8 datetime'}>
									<DataTime 
										showTime={false}
										isShowIcon={true}
										width={'100%'}
										form={this.props.form}
										validate={true} 
										value={new Date()}
										name={'effectiveDate'}
									/>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100287/*失效日期*/)}</label>
								<div className={'col-md-8 col-lg-8 datetime'}>
									<DataTime 
										showTime={false}
										isShowIcon={true}
										width={'100%'}
										form={this.props.form} 
										name={'expiryDate'}
										validate={true}
									/>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}>{I18n.t(100292/*使用企业*/)}</label>
								<Select
											animation='slide-up'
											onClick={this.ccidClick}
											className ={getFieldError("companyId") ?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
											optionLabelProp="children"
												{...getNFieldProps('companyId',{
													validateFirst: true,
													rules: [{required:true}],
													initialValue:ccLocalName?{s_label:ccLocalName,companyId:Cid}:undefined
												})}
												allowClear
										>
										{
											this.state.ccidArray.map((e,i)=>{
															return  <Option value={e.id+""} title={e.name} key={i}>{e.localName}</Option>
														})
										}
								</Select>
								
							</div>
						</div>
					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			checkedData = checkedData ||{};
			checkedData.exRateType = checkedData.exRateType || {};
			checkedData.exRatePrecision = checkedData.exRatePrecision || {};
			checkedData.basCurren = checkedData.basCurren || {};
			checkedData.curren = checkedData.curren || {};
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.id:''
			})
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.optlock:''
			})
			   content = (
			   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100281/*汇率类型*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.ExRateType' 
                                             fieldName="exRateTypeId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 exRateTypeId: da.id,
                                                exRateTypeName: da.name,
                                                
                                                 s_label: da.name
                                             }}>{da.name}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              initialValue={xt.initSelectValue(checkedData.exRateType,{exRateTypeId:checkedData.exRateType.id,...checkedData.exRateType},['exRateTypeId'], 'name', this.props.form)}
                                              allowClear
				                 />  
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100282/*汇率精度*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.ExRatePrecision' 
                                             fieldName="exRatePrecisionId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 exRatePrecisionId: da.id,
                                                exRatePrecisionName: da.name,
                                                
                                                 s_label: da.name
                                             }}>{da.name}</Option>}
                                             reles={true}	
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                               initialValue={xt.initSelectValue(checkedData.exRatePrecision,{exRatePrecisionId:checkedData.exRatePrecision.id,...checkedData.exRatePrecision},['exRatePrecisionId'], 'name', this.props.form)}
                                              allowClear
				                 />
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100283/*原币*/)}</label>
									<ConstMiniSelect form={this.props.form}
					             				 pbj='com.fooding.fc.ds.entity.Curren' 
	                                             fieldName="basCnyId"
	                                             optionValue={da => <Option key={da.id} objValue={{
	                                                basCnyId: da.id,
	                                                basCnyName: da.name,
	                                                basCnyLCname:da.localName,
	                                                 s_label: da.localName
	                                             }}>{da.localName}</Option>}
	                                             	reles={true}
	                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
	                                              initialValue={xt.initSelectValue(checkedData.basCurren,{basCnyId:checkedData.basCurren.id,...checkedData.basCurren},['basCnyId'], 'localName', this.props.form)}
	                                              allowClear
					                 />
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100285/*目标币*/)}</label>
									<ConstMiniSelect form={this.props.form}
						             				 pbj='com.fooding.fc.ds.entity.Curren' 
		                                             fieldName="targetCnyId"
		                                             optionValue={da => <Option key={da.id} objValue={{
		                                                targetCnyId: da.id,
		                                                targetCnyName: da.name,
		                                                targetCnyLCname:da.localName,
		                                                s_label: da.localName
		                                             }}>{da.localName}</Option>}
		                                             	reles={true}
		                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
		                                              initialValue={xt.initSelectValue(checkedData.curren,{targetCnyId:checkedData.curren.id,...checkedData.curren},['targetCnyId'], 'localName', this.props.form)}
		                                              allowClear
						                 />
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}>{I18n.t(100279/*直接汇率*/)}</label>
								<input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
										{...getFieldProps('basRat',{
													initialValue:checkedData.basRat
										})}
								/> 
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}>{I18n.t(100280/*间接汇率*/)}</label>
								<input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
										{...getFieldProps('indirectRat',{
													initialValue:checkedData.indirectRat
										})}
								/> 
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100286/*生效日期*/)}</label>
								<div className={'col-md-8 col-lg-8 datetime'}>
									<DataTime 
										showTime={false}
										isShowIcon={true}
										width={'100%'}
										form={this.props.form}
										validate={true} 
										name={'effectiveDate'}
										value={checkedData.effectiveDate || new Date()}
									/>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100287/*失效日期*/)}</label>
								<div className={'col-md-8 col-lg-8 datetime'}>
									<DataTime 
										showTime={false}
										isShowIcon={true}
										width={'100%'}
										form={this.props.form} 
										name={'expiryDate'}
										validate={true}
										value={checkedData.expiryDate}
									/>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}>{I18n.t(100292/*使用企业*/)}</label>
								<Select
											animation='slide-up'
											onClick={this.ccidClick}
											className ={getFieldError("companyId") ?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
											optionLabelProp="children"
												{...getNFieldProps('companyId',{
													validateFirst: true,
													rules: [{required:true}],
													initialValue:checkedData.company?{s_label:checkedData.company.localName,companyId:checkedData.company.id}:(ccLocalName?{s_label:ccLocalName,companyId:Cid}:undefined)
												})}
												allowClear
										>
										{
											this.state.ccidArray.map((e,i)=>{
															return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
														})
										}
								</Select>
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
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100281/*汇率类型*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.exRateType?checkedData.exRateType.name:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100282/*汇率精度*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.exRatePrecision?checkedData.exRatePrecision.name:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100283/*原币*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.basCurren?checkedData.basCurren.code:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100285/*目标币*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.curren?checkedData.curren.localName:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100279/*直接汇率*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.basRat || ''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100280/*间接汇率*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.indirectRat || ''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100286/*生效日期*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{new Date(checkedData.effectiveDate).Format("yyyy-MM-dd")}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100287/*失效日期*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{new Date(checkedData.expiryDate).Format("yyyy-MM-dd")}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100292/*使用企业*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.company.localName}</p>
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
