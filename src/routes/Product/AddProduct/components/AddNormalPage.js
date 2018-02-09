import React, {Component,PropTypes} from "react";
// import {createForm,FormWrapper} from '../../../../components/Form';
import Radio from "../../../../components/Radio";
import Select, {Option ,ConstVirtualSelect } from '../../../../components/Select';
import  SelectChange from "../../../../components/SelectChange";
import Checkbox from "../../../../components/CheckBox";

import {I18n} from '../../../../lib/i18n';
import NameCheck from "../../../../components/InputBoxCheck/NameCheck";
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import xt from "../../../../common/xt";
import ProductSelect, {ProductName} from "../../../../components/FindGridSelect";
class Addnormal extends Component{
	constructor(props){
		super(props)
		this.state=this.initState()
	}
	initState(){
		return {
		}
	}
	
	render(){
		const { getFieldProps, getFieldError } = this.props.form;
		let {valueone = {},data} = this.props;
		let {mtlTypes,chargePeople,contnrTypes,dataDivs,pProcess,rptMtls,simProStands,specTxt} = data;
		valueone.pPStd = valueone.pPStd || [];
		let obj = Object.assign({},valueone,{id:valueone.id,localName:valueone.localName,name:valueone.name});
		let array =[];
		valueone.pPStd.map((e)=>{array.push(xt.initSelectValue(e, e, ['id'],"localName", this.props.form))});
		let countriesValue= array; 
		return(
			<div className={'addnormal'} style={{marginBottom:"10px"}}>
				<div className={'addnormal-title'}>
					<span>{I18n.t(100138/*常规*/)}</span>
					<span onClick={this.props.backClick} title={I18n.t(100430/*保存*/)}><i className={'foddingicon fooding-back'}></i></span>
					<span onClick={this.props.saveClick} title={I18n.t(100431/*返回*/)}><i className={'foddingicon fooding-save'}></i></span>
				</div>
				<div className={'girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100377/*产品编码*/)}</label>
								<input type="text" disabled {...getFieldProps('code', {
                                initialValue:String(valueone.code || '')
                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={I18n.t(100378/*自动生成*/)}/>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100403/*产品类型*/)}</label>
							<ProductName
								ref ="productSelect"
								form={this.props.form}
								width={'379%'}
								initialValue={String(xt.getItemValue(valueone, 'mtlType.id', '')) || undefined}
								fieldName ='mtlTypeId'
								className={'currency-btn select-from-currency text-input-nowidth'}
								titleClass={"col-md-9 col-lg-9"}
								apiUri='/mtlType/search'
							/>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100379/*产品*/)}</label>
							<NameCheck
								form={this.props.form}
								fieldName='name'
								rules={true}
								initialValue={String(valueone.name || "")}
								className={'col-md-9 col-lg-9'}
							/>	
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100412/*基本型号*/)}</label>
							<input type="text" {...getFieldProps('basModel', {
                                initialValue:String(valueone.basModel || "")
                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100382/*产品规格*/)}</label>
							<input type="text" disabled {...getFieldProps('specTxt', { 
                                initialValue:String(specTxt || "") 
                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100385/*海关编码*/)}</label>
							<input type="text" {...getFieldProps('hsCode', {
								rules: [{required:true,}],
								valuedateTrigger:"onBlur",
                                initialValue:String(valueone.hsCode|| "") 
                            })} className={getFieldError('hsCode')?"col-md-9 col-lg-9 text-input-nowidth error-border":"col-md-9 col-lg-9 text-input-nowidth"} placeholder={""}/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>CAS&nbsp;&nbsp;Number</label>
							<input type="text" {...getFieldProps('casNumber', {
                                initialValue:String(valueone.casNumber|| "") 
                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>E&nbsp;&nbsp;Number</label>
							<input type="text" {...getFieldProps('eNumber', {
                                initialValue:String(valueone.eNumber || "")
                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>UN&nbsp;&nbsp;Number</label>
							<input type="text" {...getFieldProps('nuNumber', {
                                initialValue:String(valueone.nuNumber || "") 
                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>EC&nbsp;&nbsp;Number</label>
							<input type="text" {...getFieldProps('ecNumber', {
                                initialValue:String(valueone.ecNumber || "")
                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>CNS&nbsp;&nbsp;</label>
							<input type="text" {...getFieldProps('cns', {
                                initialValue:String(valueone.cns || "")
                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>INS&nbsp;&nbsp;</label>
							<input type="text" {...getFieldProps('ins', {
                                initialValue:String(valueone.ins || "")
                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>
						</div>
						
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100413/*申报要素*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								fieldName="rptMtlId"
								apiType={apiPost}
								apiHost={API_FOODING_DS}
								apiParams="com.fooding.fc.ds.entity.RptMtl"
								rules
								initValueOptions={valueone&&valueone.rptMtl?[valueone.rptMtl]:[]}
								initialValue={valueone&&valueone.rptMtl?valueone.rptMtl.id:undefined}
								className="col-md-9 col-lg-9"
							/>
						</div>
						<div className="form-group col-md-4 col-lg-4">
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
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100414/*生产工艺*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								fieldName="pProcesId"
								apiType={apiPost}
								apiHost={API_FOODING_DS}
								apiParams="com.fooding.fc.ds.entity.PProces"
								rules
								initValueOptions={valueone&&valueone.pProces?[valueone.pProces]:[]}
								initialValue={valueone&&valueone.pProces?valueone.pProces.id:undefined}
								className="col-md-9 col-lg-9"
							/>
						</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100384/*产品等级*/)}</label>
								<ConstVirtualSelect
									form={this.props.form}
									fieldName="dataDivId3"
									apiType={apiPost}
									apiHost={API_FOODING_DS}
									apiParams="com.fooding.fc.ds.entity.DataDivId3"
									rules
									initValueOptions={valueone && valueone.dataDiv?[valueone.dataDiv]:[]}
									initialValue={String(xt.getItemValue(valueone, 'dataDiv.id', '')) || undefined}
									className="col-md-9 col-lg-9"
								/>
							</div>
							<div className="form-group col-md-2 col-lg-2" style={{textAlign:'center'}}>
								<Checkbox
									{...getFieldProps('inspcMark',{
										initialValue:valueone.inspcMark || false
									})}
									checked={!!this.props.form.getFieldValue("inspcMark")}
								/>
								<span className={'radio-text'}>{I18n.t(100415/*商检*/)}</span>
							</div>
							<div className="form-group col-md-2 col-lg-2" style={{textAlign:'center'}}>
								<Checkbox
									{...getFieldProps('forPurchase',{
										initialValue:valueone.forPurchase || false
									})}
									checked={!!this.props.form.getFieldValue("forPurchase")}
								/>
								<span className={'radio-text'}>{I18n.t(100417/*采购*/)}</span>
							</div>
							
							
						</div>
						<div className={'row'}>
							<div className="form-group col-md-2 col-lg-2">
								<label className={'col-md-6 col-lg-6'}><span>*</span>{I18n.t(100419/*默认箱型*/)}</label>
								<ConstVirtualSelect
									form={this.props.form}
									fieldName="contnrTyId"
									apiType={apiPost}
									apiHost={API_FOODING_DS}
									apiParams="com.fooding.fc.ds.entity.ContnrType"
									rules
									initValueOptions={valueone && valueone.contnrType?[valueone.contnrType]:[]}
									initialValue={String(xt.getItemValue(valueone, 'contnrType.id', '')) || undefined}
									className="col-md-6 col-lg-6"
								/>
							</div>
							<div className="form-group col-md-2 col-lg-2">
								<label className={'col-md-6 col-lg-6'}>{I18n.t(100420/*利润率%*/)}</label>
								<input type="text" {...getFieldProps('profit', {
	                                initialValue:''
	                            })} className="col-md-6 col-lg-6 text-input-nowidth" placeholder={""}/>
							</div>
							<div className="form-group col-md-2 col-lg-2" style={{textAlign:'center'}}>
								<Checkbox
									{...getFieldProps('selfProduced',{
										initialValue:valueone.selfProduced || false
									})}
									checked={!!this.props.form.getFieldValue("selfProduced")}
								/>
								<span className={'radio-text'}>{I18n.t(100416/*自产*/)}</span>
							</div>
						
						<div className="form-group col-md-2 col-lg-2" style={{textAlign:'center'}}>
							<Checkbox
								{...getFieldProps('forSale',{
									initialValue:valueone.forSale || false
								})}
								checked={!!this.props.form.getFieldValue("forSale")}
							/>
							<span className={'radio-text'}>{I18n.t(100418/*销售*/)}</span>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100002/*描述*/)}</label>
							<textarea placeholder={""} className={'col-lg-9 col-md-9 textarea'} {...getFieldProps('description', {
                                initialValue:String(valueone.description || "")
                            })}></textarea>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
// const AddnormalForm =createForm()(Addnormal);
export default Addnormal;
