import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
import Select, { Option,ConstMiniSelect } from '../../../../../components/Select';
import Checkbox from '../../../../../components/CheckBox';
import shallowequal from 'shallowequal';
import Calendar from  '../../../../../components/Calendar/Calendar';
import AddSelect from '../../../../../components/AddRadio/components/AddSelect';
import Input from '../../../../../components/FormValidating/FormValidating';
import xt from '../../../../../common/xt';
import ServiceTips from '../../../../../components/ServiceTips';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,language,pageSize,sizeList} from '../../../../../services/apiCall';
export class TraderulesDetailDialog extends Component{
	constructor(props) {
		super(props);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onChange = this.onChange.bind(this);
		this.data = null;
	}
	onSaveAndClose(){
		const {form ,onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				let value = this.props.form.getFieldsValue();
				if(this.props.data.number == 0){
							if(this.props.id =='client-detail-baozhuang'){
								value = Object.assign({},value,{id:this.props.initData.id,optlock:this.props.initData.optlock})
							}else if(this.props.id =='client-detail-jifei'){
								value = Object.assign({},value,{id:this.props.initData.id,optlock:this.props.initData.optlock})
							}else if(this.props.id =='client-detail-zhuangzai'){
								value = Object.assign({},value,{id:this.props.initData.id,optlock:this.props.initData.optlock})
							}else if(this.props.id =='client-detail-pinpai'){
								value = Object.assign({},value,{id:this.props.initData.id,optlock:this.props.initData.optlock})
							}
					
				}
				this.props.onSaveAndClose(value,this.props.initData);
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
	onChange(e){

	}
	getData(){

	}
	//选择某一个产品包装
	onPackNameSelect = data => {
		if(!data) return;
		apiGet(API_FOODING_DS,"/packaging/getOne",{id:data.packId},response => {
			let getOne = response.data || {};
			// this.setState({getOne})
			this.props.form.setFieldsValue({"wtUomId":{wtUomId:getOne.weight&&getOne.weight.id || "",s_label:getOne.weight&&getOne.weight.name || ""},volUomId:{volUomId:getOne.volume && getOne.volume.id ||'',s_label:getOne.volume && getOne.volume.name ||''},netWtNum:getOne.lodWtNum || "",grosWtNum:parseInt(getOne.netWtNum + getOne.lodWtNum) ||'',volNum:getOne.volNum ||'',wrapgWtnum:getOne.netWtNum || ''});
		},error => ServiceTips({text:error.message,type:error}))
	}
	render(){
		let that = this;
		let content;
		 const {getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;
		let {data,initData,id,otherData} = this.props;
		if(id == 'client-detail-baozhuang'){
			initData =initData || {};
			initData.packaging = initData.packaging || {};
			initData.volume = initData.volume || {};
			initData.weight = initData.weight || {};
			//包装
			if(data.number == 0 || data.number == 1){
				content =(<div className="girdlayout">
						 	 <div className="row">
								<div className="form-group col-xs-6 col-md-6">
							            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100596/*包装名称*/)}</label>
										<ConstMiniSelect form={this.props.form} 
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                      params: {obj:'com.fooding.fc.ds.entity.Pack',
                                                      attrs:['packaging'],
                                                     queryParams:[{attr:'sourceId',expression:'=',value:otherData.ids}]}
                                                 }} fieldName="packId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(initData.packaging,{packId:initData.packaging.id,...initData.packaging},['packId'], 'localName', this.props.form)
                                                 }
                                                 onChange = {this.onPackNameSelect}
                                                 optionValue={(da, di) => <Option key={da.packaging.id} objValue={{
                                                     packId: da.packaging.id,
                                                     s_label: da.packaging.localName
                                                 }}>{da.localName}</Option>}
                                                 
                                                
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
                           				/>
								</div>
								<div className="form-group col-xs-6 col-md-6">
								            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100040/*重量单位*/)}</label>
											<ConstMiniSelect disabled form={this.props.form}
											refreshMark={getFieldValue('packId', {initData}).packId}
	                                                 pbj={{
	                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
	                                                     params: {obj:'com.fooding.fc.ds.entity.Unitofmea'}
	                                                 }} fieldName="wtUomId"
	                                                 initValueOptions={[]}
	                                                 initialValue={
	                                                    xt.initSelectValue(initData.weight,{wtUomId:initData.weight.id,...initData.weight},['wtUomId'], 'localName', this.props.form)
	                                                 }
	                                                 optionValue={(da, di) => <Option key={da.id} objValue={{
	                                                     wtUomId: da.id,
	                                                     s_label: da.localName
	                                                 }}>{da.localName}</Option>}
	                                                 
	                                                
	                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
	                           				/>
	                           				

								</div>
								</div>
								<div className="row">
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{i18n.t(100551/*净重量*/)}</label>
										<input type='text' className={getFieldError("netWtNum") ?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} 
													    {...getFieldProps('netWtNum',{
															validateFirst: true,
															rules: [{required:true}],
															initialValue:initData?initData.netWtNum:''
														})}
														
								/> 
									</div>
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{i18n.t(100553/*毛重量*/)}</label>
										<input type='text' className={getFieldError("grosWtNum") ?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} 
													    {...getFieldProps('grosWtNum',{
															validateFirst: true,
															rules: [{required:true}],
															initialValue:initData?initData.grosWtNum:''
														})}
										/> 
									</div>
								</div>
								<div className="row">
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{i18n.t(100039/*自重*/)}</label>
										<input type='text' className={getFieldError("wrapgWtnum") ?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} 
													    {...getFieldProps('wrapgWtnum',{
															validateFirst: true,
															rules: [{required:true}],
															initialValue:initData?initData.wrapgWtnum:''
														})}
										/>
									</div>
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{i18n.t(100426/*体积单位*/)}</label>
										<ConstMiniSelect form={this.props.form}  disabled
										            refreshMark={getFieldValue('packId', {}).packId}
	                                                 pbj={{
	                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
	                                                     params: {obj:'com.fooding.fc.ds.entity.Unitofmea'}
	                                                 }} fieldName="volUomId"
	                                                 initValueOptions={[]}
	                                                 initialValue={
	                                                    xt.initSelectValue(initData.volume,{volUomId:initData.volume.id,...initData.volume},['volUomId'], 'localName', this.props.form)
	                                                 }
	                                                 optionValue={(da, di) => <Option key={da.id} objValue={{
	                                                     volUomId: da.id,
	                                                     s_label: da.localName
	                                                 }}>{da.localName}</Option>}
	                                                 
	                                                
	                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
	                           				/>
									</div>
								</div>
								<div className="row">
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{i18n.t(100223/*体积量*/)}</label>
										
										<input type='text' className={getFieldError("volNum") ?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} 
													    {...getFieldProps('volNum',{
															validateFirst: true,
															rules: [{required:true}],
															initialValue:initData?initData.volNum:''
														})}
										/>
									</div>
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{i18n.t(100557/*基础包装*/)}</label>
										<Checkbox 
											{...getFieldProps('basPackMrk',{
												initialValue:initData.basPackMrk?initData.basPackMrk:false
											})}
											checked={this.props.form.getFieldValue("basPackMrk")}
										/>
									</div>
								</div>

						</div>);
			}
		}else if(id == 'client-detail-zhuangzai'){
			initData =initData || {};
			initData.contnrType = initData.contnrType || {};
			initData.packaging = initData.packaging || {};
			initData.salvrType = initData.salvrType || {};
			initData.unitofmea = initData.unitofmea || {};
			//箱型装载数据
			if(data.number == 0 || data.number == 1){
				content =(<div className="girdlayout">
						 	 <div className="row">
								<div className="form-group col-xs-6 col-md-6">
							            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100596/*包装名称*/)}</label>
										
										<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                      params: {obj:'com.fooding.fc.ds.entity.Pack',
                                                      attrs:['packaging'],
                                                     queryParams:[{attr:'sourceId',expression:'=',value:otherData.id}]}
                                                 }} fieldName="packId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(initData.packaging,{packId:initData.packaging.id,...initData.packaging},['packId'], 'localName', this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={da.packaging.id} objValue={{
                                                     packId: da.packaging.id,
                                                     s_label: da.packaging.localName
                                                 }}>{da.localName}</Option>}
                                                 
                                                
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
                           				/>
								</div>
								<div className="form-group col-xs-6 col-md-6">
								            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100214/*箱型*/)}</label>
											<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                      params: {obj:'com.fooding.fc.ds.entity.ContnrType'}
                                                      
                                                     
                                                 }} fieldName="contnrTyId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(initData.contnrType,{contnrTyId:initData.contnrType.id,...initData.contnrType},['contnrTyId'], 'localName', this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={da.id} objValue={{
                                                     contnrTyId: da.id,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 
                                                
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
                           					/>
									</div>
								</div>
								<div className="row">
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{i18n.t(100598/*箱型数量*/)}</label>
										<input type='text' className={getFieldError("mtlContNum") ?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} 
													    {...getFieldProps('mtlContNum',{
															validateFirst: true,
															rules: [{required:true}],
															initialValue:initData?initData.mtlContNum:''
														})}
										/>
									</div>
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{i18n.t(100589/*计量单位*/)}</label>
										<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                      params: {obj:'com.fooding.fc.ds.entity.Unitofmea'}
                                                      
                                                     
                                                 }} fieldName="mtlUomId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(initData.unitofmea,{mtlUomId:initData.unitofmea.id,...initData.unitofmea},['mtlUomId'], 'localName', this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={da.id} objValue={{
                                                     mtlUomId: da.id,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 
                                                
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
                           					/>
									</div>
								</div>
								<div className="row">
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{i18n.t(100124/*托盘类型*/)}</label>
										<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                      params: {obj:'com.fooding.fc.ds.entity.SalvrType'}
                                                      
                                                     
                                                 }} fieldName="salvrIdId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(initData.salvrType,{salvrIdId:initData.salvrType.id,...initData.salvrType},['salvrIdId'], 'localName', this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={da.id} objValue={{
                                                     salvrIdId: da.id,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 
                                                
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
                           					/>
									</div>
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{i18n.t(100600/*每托盘件数*/)}</label>
										
										<input type='text' className={getFieldError("salvrIdNum") ?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} 
													    {...getFieldProps('salvrIdNum',{
															validateFirst: true,
															rules: [{required:true}],
															initialValue:initData?initData.salvrIdNum:''
														})}
										/>
									</div>
								</div>

						</div>);
			}
		}else if(id == 'client-detail-jifei'){
			initData =initData || {};
			initData.curren = initData.curren || {};
			initData.packaging = initData.packaging || {};
			//包装计费
			if(data.number == 0 || data.number == 1){
				content =(<div className="girdlayout">
						 	 <div className="row">
								<div className="form-group col-xs-6 col-md-6">
							            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100596/*包装名称*/)}</label>
										<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                      params: {obj:'com.fooding.fc.ds.entity.Pack',
                                                      attrs:['packaging'],
                                                     queryParams:[{attr:'sourceId',expression:'=',value:otherData.id}]}
                                                 }} fieldName="packId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(initData.packaging,{packId:initData.packaging.id,...initData.packaging},['packId'], 'localName', this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={da.packaging.id} objValue={{
                                                     packId: da.packaging.id,
                                                     s_label: da.packaging.localName
                                                 }}>{da.localName}</Option>}
                                                 
                                                
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
                           				/>
								</div>
								<div className="form-group col-xs-6 col-md-6">
								            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200933/*包装单价*/)}</label>
											
											<input type='text' className={getFieldError("wrapPrice") ?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} 
													    {...getFieldProps('wrapPrice',{
															validateFirst: true,
															rules: [{required:true}],
															initialValue:initData?initData.wrapPrice:''
														})}
										/>
									</div>
								</div>
								<div className="row">
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100284/*币种*/)}</label>
										<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                      params: {obj:'com.fooding.fc.ds.entity.Curren'}
                                                      
                                                     
                                                 }} fieldName="curcyId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(initData.curren,{curcyId:initData.curren.id,...initData.curren},['curcyId'], 'localName', this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={da.id} objValue={{
                                                     curcyId: da.id,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 
                                                
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
                           					/>
									</div>
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
										<div className={'col-md-8 col-lg-8 datetime'}>
											<Calendar 
												showTime={false}
												isShowIcon={true}
												form={this.props.form} 
												name={'validDate'}
												width={'100%'}
												validate={true}
												value={initData?initData.validDate:''}
											/>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500120/*终止日期*/)}</label>
										<div className={'col-md-8 col-lg-8 datetime'}>
											<Calendar 
												showTime={false}
												isShowIcon={true}
												form={this.props.form} 
												width={'100%'}
												name={'endDate'}
												validate={true}
												value={initData?initData.endDate:''}
											/>
										</div>
									</div>
								</div>

						</div>);
			}
		}else if(id == 'client-detail-pinpai'){
			initData =initData || {};
			initData.brand = initData.brand || {};
			initData.vendor = initData.vendor || {};
			initData.country = initData.country || {};
			//品牌与原产地
			if(data.number == 0 || data.number == 1){
				content =(<div className="girdlayout">
						 	 <div className="row">
								<div className="form-group col-xs-6 col-md-6">
							            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200982/*主品牌*/)}</label>
										
										<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Brand'}
                                                 }} fieldName="brandID"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(initData.brand,{brandID:initData.brand.id,...initData.brand},['brandID'], 'localName', this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={da.id} objValue={{
                                                     brandID: da.id,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 
                                                
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
                           				/>
								</div>
								<div className="form-group col-xs-6 col-md-6">
								            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200983/*制造厂商*/)}</label>
											
											<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Vendor'}
                                                 }} fieldName="mfrBeID"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(initData.vendor,{mfrBeID:initData.vendor.id,...initData.vendor},['subrandID'], 'localName', this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={da.id} objValue={{
                                                     mfrBeID: da.id,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 
                                                
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
                           					/>
											
									</div>
								</div>
								<div className="row">
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200984/*原产国家/地区*/)}</label>
										<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Country'}
                                                 }} fieldName="cntryId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(initData.country,{cntryId:initData.country.id,...initData.country},['cntryId'], 'localName', this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={da.id} objValue={{
                                                     cntryId: da.id,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 
                                                
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
                           					/>
									</div>
								</div>
						</div>);
			}
		}
		return (
			<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
	           {content}
			</FormWrapper>
			);
	}
}
const TraderulesDetailForm =createForm()(TraderulesDetailDialog);
export default TraderulesDetailForm;
