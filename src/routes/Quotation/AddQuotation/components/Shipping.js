import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Checkbox from "../../../../components/CheckBox";
import Select, {Option,ConstMiniSelect} from '../../../../components/Select';
import {createForm,FormWrapper} from '../../../../components/Form';
import  SelectChange from "../../../../components/SelectChange";
import DataTime from '../../../../components/Calendar/Calendar';
import xt from '../../../../common/xt';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP} from '../../../../services/apiCall';
class Addnormal extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState()
	}
	initState(){
		return {
			radioState:'',
			radioAddress:''
		}
	}
	StateChange(e){
		let tex;
		tex = e.target.value;
		this.setState({
			radioState:tex
		})
	}
	AddressChange(e){
		let addres;
		addres = e.target.value;
		this.setState({
			radioAddress:addres
		})
	}
	render(){
		const {radioAddress, radioState} = this.state;
		let {getOne} =this.props;
		let {getNFieldProps,getFieldError,getFieldProps,getFieldValue} = this.props.form;
		// let beField = getNFieldProps('transId',{
		// 								rules: [{required:true}],
		// 								initialValue:getOne["trans"+language]?{s_label:getOne["trans"+language],transId:getOne.transId,transLcName:getOne.transLcName,transEnName:getOne.transEnName}:undefined
		// 							 });
		// let beFieldValue = getFieldValue("transId") || {};
		return(
			<div className={'addnormal'} style={{marginTop:'10px',marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(500087/*装运要求*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100224/*运输方式*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.enumeration.TransportType'}
                                                 }} fieldName="transId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 		xt.initSelectValue(getOne["trans"+language], getOne, ['transId', 'transLcName', 'transEnName'], "trans"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     transId: da.id,
                                                     transLcName: da.name,
                                                     transEnName: da.name,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>} reles ={true}
                                                 className ={getFieldError('transId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500088/*装箱类型*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.enumeration.PackType'}
                                                 }} fieldName="packType"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["packTypeName"], getOne, ['packType', 'packTypeName'], 'packTypeName', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     packType: da.id,
                                                     packTypeName: da.name,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>}
                                                 className ={getFieldError('packType')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100297/*起运港*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue('transId', {}).transId)}
                                                 refreshMark={getFieldValue('transId', {}).transId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Statn',queryParams:[{attr:"statnTyId",expression:"=",value:getFieldValue("transId",getOne).transId}]}
                                                 }} fieldName="sStatnId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["sStatn"+language] && getFieldValue('transId', getOne).transId === getOne.transId, getOne, ['sStatnId', 'sStatnLcName', 'sStatnEnName'], "sStatn"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     sStatnId: da.id,
                                                     sStatnLcName: da.localName,
                                                     sStatnEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles ={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100298/*目的港*/)}</label>	
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue('transId', {}).transId)}
                                                 refreshMark={getFieldValue('transId', {}).transId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Statn',queryParams:[{attr:"statnTyId",expression:"=",value:getFieldValue("transId",getOne).transId}]}
                                                 }} fieldName="eStatnId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["eStatn"+language]&&getFieldValue('transId', {}).transId === getOne.transId, getOne, ['eStatnId', 'eStatnLcName','eStatnEnName'],"eStatn"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     eStatnId: da.id,
                                                     eStatnLcName: da.localName,
                                                     eStatnEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}  reles ={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>	
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500090/*可否转运*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								 <Checkbox
								        style={{lineHeight:'32px'}}
										{...getFieldProps('canTransportMark',{
											initialValue:getOne.canTransportMark?getOne.canTransportMark:false
										})}
										checked={this.props.form.getFieldValue("canTransportMark")}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default createForm()(Addnormal);
