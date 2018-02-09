import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
import Select, { Option } from 'rc-select';
import Checkbox from '../../../../../components/CheckBox';
import shallowequal from 'shallowequal';
import Calendar from  '../../../../../components/Calendar/Calendar';
import AddSelect from '../../../../../components/AddRadio/components/AddSelect';
import Input from '../../../../../components/FormValidating/FormValidating';
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
		form.validateFields({force: true},(errors, value) => {
			if(errors){

			}else{
				let value = this.props.form.getFieldsValue();
				if(this.props.data.number == 0){//编辑
							if(this.props.id =='client-detail-fanqingxiao'){
								value = Object.assign({},value,{id:this.props.initData.tradruleAntidump.id,optlock:this.props.initData.tradruleAntidump.optlock})
							}else if(this.props.id =='client-detail-tuopan'){
								value = Object.assign({},value,{id:this.props.initData.tradrulePallet.id,optlock:this.props.initData.tradrulePallet.optlock})
							}else if(this.props.id =='client-detail-jinzhi'){
								value = Object.assign({},value,{id:this.props.initData.tradruleAntidump.id,optlock:this.props.initData.tradruleAntidump.optlock})
							}else if(this.props.id =='client-detail-maitou'){
								value = Object.assign({},value,{id:this.props.initData.tradruleShipmark.id,optlock:this.props.initData.tradruleShipmark.optlock})
							}else if(this.props.id =='client-detail-shuixiang'){
								value = Object.assign({},value,{id:this.props.initData.price.id,optlock:this.props.initData.price.optlock})
							}else if(this.props.id =='client-detail-teshu'){
								value = Object.assign({},value,{id:this.props.initData.tradrulePropty.id,optlock:this.props.initData.tradrulePropty.optlock})
							}else if(this.props.id =='client-detail-zhengshu'){
								value = Object.assign({},value,{id:this.props.initData.tradruleCertfct.id,optlock:this.props.initData.tradruleCertfct.optlock})
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
		if(e == 20){
			 this.props.form.setFieldsValue({sum:'', curcyId:'' ,unitofmeaId:''});
		}else {
			this.props.form.setFieldsValue({taxRate:''});
		}
	}
	getData(){

	}
	render(){
		let that = this;
		let content;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		let {data,initData,id} = this.props;
		const {certfcts,info,items,proptypes,countrys,salvrTypes,taxSubTypes,taxTypes,currens,priceType,unitofmeas} = initData;
		if(id == 'client-detail-zhengshu'){
			//证书
			if(data.number == 1){
				content =(<div className="girdlayout">
						  <div className="row">
								<div className="form-group col-xs-6 col-md-6">
							            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100098/*证书*/)}</label>
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
						</div>);
			}
		}else if(id == 'client-detail-jianzhuang'){
			//监装机构
			if(data.number == 1){
				content =(
						<div className="girdlayout">
						 	 <div className="row">
								<div className="form-group col-xs-6 col-md-6">
							            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100102/*监装机构*/)}</label>
										<Select
											animation='slide-up'
											allowClear={true}
											className ={ getFieldError("instBeId") ?'col-xs-8 col-lg-8 currency-btn select-from-currency error-border':'col-xs-8 col-lg-8 currency-btn select-from-currency'}
											choiceTransitionName="rc-select-selection__choice-zoom"
											optionLabelProp="children"
											{...getNFieldProps('instBeId',{
												validateFirst: true,
												rules: [{required:true,}],
												initialValue:undefined
											})}>
											{
												initData.map((e,i) =>{
													return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
												})
											}
										</Select>
								</div>
								 +
							</div>
						</div>);
			}
		}else if(id == 'client-detail-fanqingxiao'){
			//反倾销
			if(data.number == 1){
				content =(<div className="girdlayout">
						 	 <div className="row">
								<div className="form-group col-xs-6 col-md-6">
							            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200565/*国家/地区*/)}</label>
										<Select
											animation='slide-up'
											placeholder={''}
											className ={ getFieldError("cntryId") ?'col-xs-8 col-lg-8 currency-btn select-from-currency error-border':'col-xs-8 col-lg-8 currency-btn select-from-currency'}
											choiceTransitionName="rc-select-selection__choice-zoom"
											optionLabelProp="children"
											{...getNFieldProps('cntryId',{
												validateFirst: true,
												rules: [{required:true,}],
												initialValue:undefined,
											})}>
											{
												countrys.map((e,i) =>{
													return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
												})
											}
										</Select>

								</div>
								<div className="form-group col-xs-6 col-md-6">
								            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200876/*反倾销税率*/)}</label>
											<Input 
												form={this.props.form} 
												obj={{name:'antiDumpRuty',type:'text',
												classn:'col-xs-8 col-md-8 text-input-nowidth',
												initialValue:''}}
											/>
									</div>
								</div>
								<div className="row">
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

											/>
										</div>
									</div>
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100287/*失效日期*/)}</label>
										<div className={'col-md-8 col-lg-8 datetime'}>
											<Calendar 
												showTime={false}
												isShowIcon={true}
												form={this.props.form} 
												width={'100%'}
												name={'endDate'}
												validate={true}

											/>
										</div>
									</div>
								</div>

						</div>);
			}
		}else if(id == 'client-detail-shuixiang'){
			//税项
			if(data.number == 0 || data.number == 1){
				content =(
						<div className="girdlayout">
						  			<div className="row">
										<div className="form-group col-xs-3 col-md-3">
										
									 		<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200878/*税类别*/)}</label>
											<Select
											animation='slide-up'
											className ={ getFieldError("taxTyId") ?'col-xs-8 col-lg-8 currency-btn select-from-currency error-border':'col-xs-8 col-lg-8 currency-btn select-from-currency'}
											choiceTransitionName="rc-select-selection__choice-zoom"
											optionLabelProp="children"
											{...getNFieldProps('taxTyId',{
												validateFirst: true,
												rules: [{required:true,}],
												initialValue:initData.price?initData.price.taxTyId:undefined,
											})}>
											{
												taxTypes.map((e,i) =>{
													return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
												})
											}
												</Select>
									 	</div>
									 	<div className="form-group col-xs-3 col-md-3">
									 		<label  className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200879/*税小类*/)}</label>
											<Select
											animation='slide-up'
											className ={ getFieldError("taxSubTyId") ?'col-xs-8 col-lg-8 currency-btn select-from-currency error-border':'col-xs-8 col-lg-8 currency-btn select-from-currency'}
											choiceTransitionName="rc-select-selection__choice-zoom"
											optionLabelProp="children"
											{...getNFieldProps('taxSubTyId',{
												validateFirst: true,
												rules: [{required:true,}],
												initialValue:initData.price?initData.price.taxSubTyId:undefined,
											})}>
											{
												taxSubTypes.map((e,i) =>{
													return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
												})
											}
												</Select>
									 	</div>
									 	<div className="form-group col-xs-3 col-md-3">
									 		<label  className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200080/*类型*/)}</label>
											<Select
											animation='slide-up'
											className ={ getFieldError("priceTypeId") ?'col-xs-8 col-lg-8 currency-btn select-from-currency error-border':'col-xs-8 col-lg-8 currency-btn select-from-currency'}
											choiceTransitionName="rc-select-selection__choice-zoom"
											optionLabelProp="children"
											{...getNFieldProps('priceTypeId',{
												validateFirst: true,
												rules: [{required:true,}],
                                                onChange:this.onChange,
												initialValue:initData.price?String(initData.price.priceTypeId):undefined,
											})}>
											{
												priceType.map((e,i) =>{
													return (<Option key={i} value={String(e.id)} title={e.name}>{e.name}</Option>)							
												})
											}
												</Select>
									 	</div>
										<div className="form-group col-xs-3 col-md-3">
									 		<label  className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200880/*税率*/)}</label>
											<input 
											    type="text"
												{...getFieldProps('taxRate',{
												validateFirst: true,
												rules: [{required:this.props.form.getFieldValue("priceTypeId")!=10}],
												initialValue:initData.price?(initData.price.taxRate?initData.price.taxRate:''):''})}
												className={ getFieldError("taxRate") ?'col-xs-8 col-md-8 text-input-nowidth  error-border':'col-xs-8 col-md-8 text-input-nowidth'} 
												disabled = {this.props.form.getFieldValue("priceTypeId")==10}
											/>
									 	</div>
									</div>
									<div className="row">
										<div className="form-group col-xs-3 col-md-3">
									 		<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200246/*金额*/)}</label>
									 		<input 
											    type="text"
												{...getFieldProps('sum',{
												validateFirst: true,
												rules: [{required:this.props.form.getFieldValue("priceTypeId")!=20}],
												initialValue:initData.price?(initData.price.sum?initData.price.sum:''):''})}
												className={ getFieldError("sum") ?'col-xs-8 col-md-8 text-input-nowidth  error-border':'col-xs-8 col-md-8 text-input-nowidth'} 
												disabled = {this.props.form.getFieldValue("priceTypeId")==20}
											/>
									 	</div>
									 	<div className="form-group col-xs-3 col-md-3">
									 		<label  className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100284/*币种*/)}</label>
											<Select
											animation='slide-up'
											placeholder={''}
											className ={ getFieldError("curcyId") ?'col-xs-8 col-lg-8 currency-btn select-from-currency error-border':'col-xs-8 col-lg-8 currency-btn select-from-currency'}
											choiceTransitionName="rc-select-selection__choice-zoom"
											optionLabelProp="children"
											{...getNFieldProps('curcyId',{
												validateFirst: true,
												rules: [{required:this.props.form.getFieldValue("priceTypeId")!=20}],
												initialValue:initData.price?initData.price.curcyId:undefined,
											})}
											disabled = {this.props.form.getFieldValue("priceTypeId")==20}
											>
											{
												currens.map((e,i) =>{
													return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
												})
											}
											</Select>
									 	</div>
									 	<div className="form-group col-xs-3 col-md-3">
									 		<label  className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100169/*单位*/)}</label>
											<Select
											animation='slide-up'
											placeholder={''}
											className ={ getFieldError("unitofmeaId") ?'col-xs-8 col-lg-8 currency-btn select-from-currency error-border':'col-xs-8 col-lg-8 currency-btn select-from-currency'}
											choiceTransitionName="rc-select-selection__choice-zoom"
											optionLabelProp="children"
											{...getNFieldProps('unitofmeaId',{
												validateFirst: true,
												rules: [{required:this.props.form.getFieldValue("priceTypeId")!=20}],
												initialValue:initData.price?initData.price.unitofmeaId:undefined,
											})}
											disabled = {this.props.form.getFieldValue("priceTypeId")==20}
											>
											{
												unitofmeas.map((e,i) =>{
													return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
												})
											}
											</Select>
									 	</div>
									</div>
						</div>);
			
			}
		}else if(id == 'client-detail-maitou'){
			//唛头
			if(data.number == 0 || data.number == 1){
				content =(
						<div className="girdlayout">
						 	 <div className="row">
								<div className="form-group col-xs-6 col-md-6">
							            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100111/*标记项目*/)}</label>
										<Select
											animation='slide-up'
											placeholder={''}
											className ={ getFieldError("itemId") ?'col-xs-8 col-lg-8 currency-btn select-from-currency error-border':'col-xs-8 col-lg-8 currency-btn select-from-currency'}
											choiceTransitionName="rc-select-selection__choice-zoom"
											optionLabelProp="children"
											{...getNFieldProps('itemId',{
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
								<div className="form-group col-xs-6 col-md-6">
							            <label className={'col-xs-4 col-md-4'}>{i18n.t(100148/*注释*/)}</label>
										<input 
											type='text' 
											className={'col-md-8 text-input-nowidth'} 
											{...getNFieldProps('itemTxt',{
												initialValue:'',
											})}  
										/>										
										{/*<Input 
											form={this.props.form} 
											obj={{name:'itemTxt',type:'text',
											classn:'col-xs-8 col-md-8 text-input-nowidth',
											initialValue:''}}
										/>*/}
								</div>
							</div>
						</div>);
			}
		}else if(id == 'client-detail-teshu'){
			//特殊要求
			if(data.number == 1){
				content =(
						<div className="girdlayout">
						 	 <div className="row">
								<div className="form-group col-xs-6 col-md-6">
							            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100114/*要求类型*/)}</label>
										<Select
											animation='slide-up'
											placeholder={''}
											className ={ getFieldError("proptyId") ?'col-xs-8 col-lg-8 currency-btn select-from-currency error-border':'col-xs-8 col-lg-8 currency-btn select-from-currency'}
											choiceTransitionName="rc-select-selection__choice-zoom"
											optionLabelProp="children"
											{...getNFieldProps('proptyId',{
												validateFirst: true,
												rules: [{required:true,}],
												initialValue:initData.tradrulePropty?initData.tradrulePropty.proptyId:undefined,
											})}>
											{
												proptypes.map((e,i) =>{
													return (<Option key={i} value={e.id} title={e.name}>{e.name}</Option>)							
												})
											}
										</Select>
								</div>
								<div className="form-group col-xs-6 col-md-6">
							            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100148/*注释*/)}</label>
										<Input 
											form={this.props.form} 
											obj={{name:'infoTxt',type:'text',
											classn:'col-xs-8 col-md-8 text-input-nowidth',
											initialValue:initData.tradrulePropty?initData.tradrulePropty.infoTxt:''}}  
										/>
								</div>
							</div>
						</div>);
			}
		}else if( id== 'client-detail-tuopan'){
			//托盘要求
			if(data.number == 0 || data.number == 1){
				content =(
						<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100124/*托盘类型*/)}</label>
								<Select
										animation='slide-up'
										onClick={this.onClick}
										placeholder=''
										className ={ getFieldError("salvrId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										optionLabelProp="children"
										{...getFieldProps('salvrId',{
											validateFirst: true,
											rules: [{required:true}],
											initialValue:initData.tradrulePallet?initData.tradrulePallet.salvrId:undefined,
										})}
										>
										{
											salvrTypes.map((e,i)=>{
												return  <Option value={e.id+""} title={e.localName} key={i}>{e.localName}</Option>
											})
										}
								</Select>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100123/*默认*/)}</label>
								<Checkbox 
								
									{...getFieldProps('dfutMrk',{
										initialValue:initData.tradrulePallet?initData.tradrulePallet.dfutMrk:false
									})}
									checked={this.props.form.getFieldValue("dfutMrk")}
								/>
							</div>
						</div>
					</div>
			</div>
				);
				if(this.addRadio){
					this.addRadio.state.array =[{title:data.name.title,isMus:true,radio:{type:"USB",checked:false},select:"USB"}];
				}
			}
		}else if(id == 'client-detail-jinzhi'){
			//禁止销售
			if(data.number == 0 || data.number == 1){
				content =(
						<div className="girdlayout">
						 	 <div className="row">
								<div className="form-group col-xs-12 col-md-12">
							            <label className={'col-xs-2 col-md-2'}><span>*</span>{i18n.t(100002/*描述*/)}</label>
							            <Input 
											form={this.props.form} 
											obj={{name:'infoTxt',type:'text',
											classn:'col-xs-10 col-md-10 text-input-nowidth',
											initialValue:initData.tradruleAntidump?initData.tradruleAntidump.infoTxt:''}}
										/>
								</div>
							</div>
							<div className="row">
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200873/*禁止开始日期*/)}</label>
										<div className={'col-md-8 col-lg-8 datetime'}>
											<Calendar 
												showTime={false}
												isShowIcon={true}
												form={this.props.form} 
												name={'validDate'}
												width={'100%'}
												validate={true}
												value={initData.tradruleAntidump?initData.tradruleAntidump['validDate']:''}
											/>
										</div>
									</div>
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200874/*禁止结束日期*/)}</label>
										<div className={'col-md-8 col-lg-8 datetime'}>
											<Calendar 
												showTime={false}
												isShowIcon={true}
												form={this.props.form} 
												width={'100%'}
												name={'endDate'}
												validate={true}
												value={initData.tradruleAntidump?initData.tradruleAntidump['endDate']:''}
											/>
										</div>
									</div>
							</div>

						</div>)
			
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
