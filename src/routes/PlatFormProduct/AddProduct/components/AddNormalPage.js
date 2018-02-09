import React, {Component} from "react";
// import {createForm,FormWrapper} from '../../../../components/Form';
import {ConstVirtualSelect} from "../../../../components/Select";
import xt from "../../../../common/xt";
import AddMoreLanguage from "../../../../components/AddMoreLanguage";
import {I18n} from "../../../../lib/i18n";
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ProductSelect, {ProductName} from "../../../../components/FindGridSelect";
class AddNormal extends Component{
	constructor(props){
		super(props)
		this.state=this.initState()
	}
	initState(){
		return {
		}
	}
	//选择产品类型时,带出以下字段
	mtlTypeChange = row => {

		let valueone = row || {}; 
		this.props.form.setFieldsValue({
			'localName':valueone.localName || "",
			'casNumber':valueone.casNumber || "",
			'eNumber':valueone.eNumber || "",
			'nuNumber':valueone.unNumber || "",
			'ecNumber':valueone.ecNumber || "",
			'ins':valueone.ins || "",
			'cns':valueone.cns || ""
		})

		// let {id} = row;
		// let that = this;
		// apiGet(API_FOODING_DS,'/mtlType/getOne',{id:id},response => {
		// 	let valueone = response.data || {};
		// 	that.props.form.setFieldsValue({
		// 		'localName':valueone.localName || "",
		// 		'casNumber':valueone.casNumber || "",
		// 		'eNumber':valueone.eNumber || "",
		// 		'nuNumber':valueone.unNumber || "",
		// 		'ecNumber':valueone.ecNumber || "",
		// 		'ins':valueone.ins || "",
		// 		'cns':valueone.cns || ""
		// 	})
		// },error => console.log(error.message))
	}
	render(){
		const { getFieldProps, getFieldError, getFieldValue, getNFieldProps } = this.props.form;
		let {businessOne = {}} = this.props;
		businessOne.pPStd = businessOne.pPStd || [];
		let obj = Object.assign({},businessOne,{id:businessOne.id,localName:businessOne.localName,name:businessOne.name});
		let array =[];
		businessOne.pPStd.map((e)=>{array.push(xt.initSelectValue(e, e, ['id'],"localName", this.props.form))});
		let countriesValue= array; 
        let common = <div></div>;
        if(businessOne&&businessOne.id){
        	common = <AddMoreLanguage 
								    menusetView={businessOne}
								    object = {'platformMaterial'}
								    upload={this.props.getPage}
								    onCancel ={this.onCancel}
							/>
        }
		return(
			<div className={'addnormal'} style={{marginBottom:"10px"}}>
				<div className={'addnormal-title'}>
					<span>{I18n.t(100138/*常规*/)}</span>
					<span onClick={this.props.backClick} title={I18n.t(100430/*保存*/)}><i className={'foddingicon fooding-back'}/></span>
					<span onClick={this.props.saveClick} title={I18n.t(100431/*返回*/)}><i className={'foddingicon fooding-save'}/></span>
				</div>
				<div className={'girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100377/*产品编码*/)}</label>
								<input type="text" {...getFieldProps('code', {
                                initialValue: String(businessOne.code || '')
                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={I18n.t(100378/*自动生成*/)}/>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100403/*产品类型*/)}</label>
							<ProductName
								ref ="productSelect"
								form={this.props.form}
								width={'379%'}
								initialValue={String(xt.getItemValue(businessOne, 'mtlType.id', '')) || undefined}
								fieldName ='mtlTyId'
								className={'currency-btn select-from-currency text-input-nowidth'}
								titleClass={"col-md-9 col-lg-9"}
								apiUri='/mtlType/search'
								value ={businessOne.mtlType}
								onChange={this.mtlTypeChange}
							/>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
							<input type="text" {...getFieldProps('localName', {
								rules: [{required:true,}],
								valuedateTrigger:"onBlur",
                                initialValue: String(businessOne.localName||'')
                            })} className={getFieldError('localName')?"col-md-9 col-lg-9 text-input-nowidth error-border":"col-md-9 col-lg-9 text-input-nowidth"} placeholder={""}/>
							{common}
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100412/*基本型号*/)}</label>
							<input type="text" {...getFieldProps('basModel', {
                                initialValue: String(businessOne.basModel || '')
                            })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100382/*产品规格*/)}</label>
							<input disabled type="text" value={String(businessOne.specTxt || '')} className="col-md-9 col-lg-9 text-input-nowidth"  placeholder={""}/>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100419/*默认箱型*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                fieldName="contnrTyId"
								apiType={apiPost}
								apiHost={API_FOODING_DS}
								apiParams="com.fooding.fc.ds.entity.ContnrType"
                                rules
                                initValueOptions={businessOne && businessOne.contnrType?[businessOne.contnrType]:[]}
                                initialValue={String(xt.getItemValue(businessOne, 'contnrType.id', '')) || undefined}
                                className="col-md-9 col-lg-9"
                            />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>CAS&nbsp;&nbsp;Number</label>		
							<input type="text" {...getFieldProps('casNumber', {
								initialValue:businessOne&&businessOne.casNumber?businessOne.casNumber:''
							})} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>			                            
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>E&nbsp;&nbsp;Number</label>
							<input type="text" {...getFieldProps('eNumber', {
								initialValue:businessOne&&businessOne.eNumber?businessOne.eNumber:''
							})} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>		
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>UN&nbsp;&nbsp;Number</label>		
							<input type="text" {...getFieldProps('nuNumber', {
								initialValue:businessOne&&businessOne.nuNumber?businessOne.nuNumber:''
							})} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>			                            
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>EC&nbsp;&nbsp;Number</label>
							<input type="text" {...getFieldProps('ecNumber', {
								initialValue:businessOne&&businessOne.ecNumber?businessOne.ecNumber:''
							})} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>		
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>CNS&nbsp;&nbsp;</label>
							<input type="text" {...getFieldProps('cns', {
								initialValue:businessOne&&businessOne.cns?businessOne.cns:''
							})} className="col-md-9 col-lg-9 text-input-nowidth" placeholder={""}/>		
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>INS&nbsp;&nbsp;</label>
							<input type="text" {...getFieldProps('ins', {
								initialValue:businessOne&&businessOne.ins?businessOne.ins:''
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
                                initValueOptions={businessOne&&businessOne.rptMtl?[businessOne.rptMtl]:[]}
                                initialValue={businessOne&&businessOne.rptMtl?businessOne.rptMtl.id:undefined}
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
								initValueOptions={businessOne&&businessOne.pProces?[businessOne.pProces]:[]}
                                initialValue={businessOne&&businessOne.pProces?businessOne.pProces.id:undefined}
                                className="col-md-9 col-lg-9"
                            />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
// const AddnormalForm =createForm()(Addnormal);
export default AddNormal;
