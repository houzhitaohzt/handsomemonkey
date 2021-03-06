import React, { Component,PropTypes } from 'react';
import RightKey from '../../../../../components/RightKey/RightKey';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option, ConstMiniSelect, ConstVirtualSelect } from '../../../../../components/Select';
//引入时间插件
import DataTime from '../../../../../components/Calendar/Calendar'
import Checkbox from '../../../../../components/CheckBox';
//引入弹层
import Dialog from '../../../../../components/Dialog/Dialog';

import {I18n} from '../../../../../lib/i18n';
import AddMoreLanguage from "../../../../../components/AddMoreLanguage";
import NameCheck from "../../../../../components/InputBoxCheck/NameCheck";
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
import xt from "../../../../../common/xt";
import ProductSelect, {ProductName} from "../../../../../components/FindGridSelect";
export class  DialogProductNormal extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.data ={};
        this.state ={
        	showDilaogsecond:false,
        }
        this.upload = this.upload.bind(this);
	}
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				that.props.onSaveAndClose(that.props.form.getFieldsValue(),that.data);
				that.props.form.resetFields();
			}
		})
	}
	onCancel(){
		let that = this;
		const {onCancel} = this.props;
		if(onCancel){
            onCancel();
            that.props.form.resetFields();
        }
	}
	upload(){
		this.props.onCancel();
		this.props.upload();
	}
	nativeClick(){
		let content=require('../../../../MenuSetting/components/MoreLanguageSetDialog').default;
		let element=React.createElement(content,{onSaveAndClose:this.upload,
			menusetView:this.props.initData.initData,
			apiHost:API_FOODING_DS,
			object:'initData',
			onCancel:this.onCancelSecond})
    	this.setState({
    		showDilaogsecond : true,
    		title: I18n.t(100496/*多语言配置*/),
    		dialogContent: element
    	})
	}
	onSaveAndCloseSecond = () => {
		this.setState({
			showDilaogsecond:!this.state.showDilaogsecond
		})
	}
	onCancelSecond = () => {
		this.setState({
			showDilaogsecond:false
		})
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getFieldValue } = this.props.form;
		let {data,initData} = this.props;

        let customerSign = initData;
        let {customer} = initData;

		let content;
        if(data.name.id == 'product-detail-1'){
        	getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:initData? initData.optlock:''
			})
			getFieldProps('name', {
							            	validateFirst: true,
						                    initialValue:initData? initData.name:''
			})
			getFieldProps('nameValues', {
							            	validateFirst: true,
						                    initialValue:initData? initData.nameValues:''
			})
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:initData? initData.id:''
			})
			//产品详情的编辑常规
			/*
				mtltypes,chargePeople,contnrtypes,dataDivs,loginStaff,pProcess,rptMtls,simPorStands 是从详情页面传过来的
				meterial 同样是从父类传过来   点击编辑时，没有进行ajax请求
			*/
            initData.pPStd = initData.pPStd || [];
			let obj = Object.assign({},initData,{id:initData.id,localName:initData.localName,name:initData.name});
			let array =[];
            initData.pPStd.map((e)=>{array.push(xt.initSelectValue(e, e, ['id'],"localName", this.props.form))});
			let countriesValue= array;
			this.data = Object.assign({},initData,{title:"product-detail-normal"});
			content = (<div className={'  girdlayout scroll'} style={{height:'300px',overflow:'auto'}}>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{I18n.t(100377/*产品编码*/)}</label>
                        <input type="text" disabled {...getFieldProps('code', {
                            initialValue:initData&&initData.code?initData.code:''
                        })} className="col-md-9 col-lg-9 text-input-nowidth" />
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100403/*产品类型*/)}</label>
                        { initData.isPlatform?
                        	<ConstVirtualSelect
							form={this.props.form}
							fieldName="mtlTypeId"
							apiType={apiPost}
							apiHost={API_FOODING_DS}
							apiParams="com.fooding.fc.ds.entity.MtlType"
							rules
							initValueOptions={initData && initData.mtlType ? [initData && initData.mtlType] : []}
							initialValue={initData && initData.mtlType ? initData.mtlType.id : ''}
							className="col-md-9 col-lg-9"
							disabled={initData.isPlatform}
						/>:
                        < ProductName
                            ref ="productSelect"
                            form={this.props.form}
                            width={'379%'}
							initialValue={initData && initData.mtlType ? initData.mtlType.id : ''}
                            fieldName ='mtlTypeId'
							value={initData?initData.mtlType:undefined}
                            className={'currency-btn select-from-currency text-input-nowidth'}
                            titleClass={"col-md-9 col-lg-9"}
                            apiUri='/mtlType/search'
                            />
                        }
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6" style={{position:'relative'}}>
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100379/*产品*/)}</label>
						<NameCheck
							form={this.props.form}
							fieldName='localName'
							rules={true}
							initialValue={initData&&initData.localName?initData.localName:''}
							className={'col-md-9 col-lg-9'}
							style={{paddingRight:'30px'}}
							disabled={initData.isPlatform}
						/>
						{
							initData.isPlatform?"":
							<AddMoreLanguage
								menusetView={initData}
								object = {'material'}
								upload={this.props.upload}
								onCancel ={this.onCancel}
							/>
						}

					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{I18n.t(100412/*基本型号*/)}</label>
						<input type="text" {...getFieldProps('basModel', {
                            initialValue:initData&&initData.basModel?initData.basModel:''
                        })} className ={'col-md-9 col-lg-9 text-input-nowidth'} placeholder={""}/>
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{I18n.t(100382/*产品规格*/)}</label>
                        <input type="text" disabled {...getFieldProps('specTxt', {
                            initialValue:initData&&initData.specTxt?initData.specTxt:''
                        })} className="col-md-9 col-lg-9 text-input-nowidth" />
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100385/*海关编码*/)}</label>
						<input type="text" {...getFieldProps('hsCode', {
                        	rules: [{required:true,}],
							valuedateTrigger:"onBlur",
                            initialValue:initData&&initData.hsCode?initData.hsCode:''
                        })} className ={ getFieldError("hsCode") ?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'} placeholder={""}/>
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>CAS&nbsp;&nbsp;Number</label>
                        <input type="text" {...getFieldProps('casNumber', {
                            initialValue:initData&&initData.casNumber?initData.casNumber:''
                        })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>E&nbsp;&nbsp;Number</label>
						<input type="text" {...getFieldProps('eNumber', {
                            initialValue:initData&&initData.eNumber?initData.eNumber:''
                        })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>UN&nbsp;&nbsp;Number</label>
                        <input type="text" {...getFieldProps('nuNumber', {
                            initialValue:initData&&initData.nuNumber?initData.nuNumber:''
                        })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>EC&nbsp;&nbsp;Number</label>
						<input type="text" {...getFieldProps('ecNumber', {
                            initialValue:initData&&initData.ecNumber?initData.ecNumber:''
                        })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>CNS</label>
                        <input type="text" {...getFieldProps('cns', {
                            initialValue:initData&&initData.cns?initData.cns:''
                        })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>INS</label>
						<input type="text" {...getFieldProps('ins', {
                            initialValue:initData&&initData.ins?initData.ins:''
                        })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100413/*申报要素*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							fieldName="rptMtlId"
							apiType={apiPost}
							apiHost={API_FOODING_DS}
							apiParams="com.fooding.fc.ds.entity.RptMtl"
							rules
							initValueOptions={initData&&initData.rptMtl?[initData.rptMtl]:[]}
							initialValue={initData&&initData.rptMtl?initData.rptMtl.id:undefined}
							className="col-md-9 col-lg-9"
						/>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100386/*生产标准*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							fieldName="pPStdId"
							apiType={apiPost}
							apiHost={API_FOODING_DS}
							apiParams="com.fooding.fc.ds.entity.SimProStand"
							rules
							multi
							initialValue={countriesValue}
							valueKeys={da => ({
                                id: da.id,
                                s_label: da.localName
                            })}
							className="col-md-9 col-lg-9"
						/>
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100414/*生产工艺*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							fieldName="pProcesId"
							apiType={apiPost}
							apiHost={API_FOODING_DS}
							apiParams="com.fooding.fc.ds.entity.PProces"
							rules
							initValueOptions={initData&&initData.pProces?[initData.pProces]:[]}
							initialValue={initData&&initData.pProces?initData.pProces.id:undefined}
							className="col-md-9 col-lg-9"
						/>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100384/*产品等级*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							fieldName="dataDivId"
							apiType={apiPost}
							apiHost={API_FOODING_DS}
							apiParams="com.fooding.fc.ds.entity.DataDivId3"
							rules
							initValueOptions={initData && initData.dataDiv?[initData.dataDiv]:[]}
							initialValue={String(xt.getItemValue(initData, 'dataDiv.id', '')) || undefined}
							className="col-md-9 col-lg-9"
						/>
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-3 col-lg-3" style={{textAlign:'center'}}>
						<Checkbox
							{...getFieldProps('inspcMark',{
								initialValue:initData&&initData.inspcMark?initData.inspcMark:false
							})}
							checked={this.props.form.getFieldValue("inspcMark")}
					    />
						<span className={'radio-text'}>{I18n.t(100415/*商检*/)}</span>
					</div>
					<div className="form-group col-md-3 col-lg-3" style={{textAlign:'center'}}>
						<Checkbox
							{...getFieldProps('forPurchase',{
								initialValue:initData&&initData.forPurchase?initData.forPurchase:false
							})}
							checked={this.props.form.getFieldValue("forPurchase")}
					    />
						<span className={'radio-text'}>{I18n.t(100417/*采购*/)}</span>
					</div>
					<div className="form-group col-md-3 col-lg-3">
						<label className={'col-md-5 col-lg-5'}><span>*</span>{I18n.t(100419/*默认箱型*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							fieldName="contnrTypeId"
							apiType={apiPost}
							apiHost={API_FOODING_DS}
							apiParams="com.fooding.fc.ds.entity.ContnrType"
							rules
							initValueOptions={initData && initData.contnrType?[initData.contnrType]:[]}
							initialValue={String(xt.getItemValue(initData, 'contnrType.id', '')) || undefined}
							className="col-md-6 col-lg-6"
						/>
					</div>
					<div className="form-group col-md-3 col-lg-3">
						<label className={'col-md-5 col-lg-5'}>{I18n.t(100420/*利润率%*/)}</label>
						<input type="text" {...getFieldProps('profit', {
                            initialValue:initData&&initData.profit?initData.profit:''
                        })} className="col-md-7 col-lg-7 text-input-nowidth" placeholder={""}/>
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-3 col-lg-3" style={{textAlign:'center'}}>
						<Checkbox
							{...getFieldProps('selfProduced',{
								initialValue:initData&&initData.selfProduced?initData.selfProduced:false
							})}
							checked={this.props.form.getFieldValue("selfProduced")}
					    />
						<span className={'radio-text'}>{I18n.t(100416/*自产*/)}</span>
					</div>
					<div className="form-group col-md-3 col-lg-3" style={{textAlign:'center'}}>
						<Checkbox
							{...getFieldProps('forSale',{
								initialValue:initData&&initData.forSale?initData.forSale:false
							})}
							checked={this.props.form.getFieldValue("forSale")}
					    />
						<span className={'radio-text'}>{I18n.t(100418/*销售*/)}</span>
					</div>

				</div>
			</div>)
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
					{content}
					<Dialog width={976} visible={this.state.showDilaogsecond} title={this.state.title}>
						{this.state.dialogContent}
					</Dialog>
				</FormWrapper>
			</div>
			);
	}
}
DialogProductNormal.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
DialogProductNormal.defaultProps ={
	onSaveAndClose(){},
    onCancel(){}
}
const DialogProductNForm =createForm()(DialogProductNormal);
export default DialogProductNForm;
