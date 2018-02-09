import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {ConstVirtualSelect,Option,ConstMiniSelect } from '../../../../components/Select';
import  SelectChange from "../../../../components/SelectChange";
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP,API_FOODING_ES} from '../../../../services/apiCall';
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
		let {getOne} = this.props;
		let {form,getNFieldProps,getFieldProps,getFieldError,getFieldValue }= this.props.form;
		xt.initLabelValue(getOne.clusterId, getOne, ['clusterId', 'clusterEnName', 'clusterLcName'], 'clusterLcName', form);

		let beField = getNFieldProps('clusterId',{
										initialValue:getOne["cluster"+language]?{s_label:getOne["cluster"+language],clusterId:getOne.clusterId,clusterLcName:getOne.clusterLcName,clusterEnName:getOne.clusterEnName}:undefined
									 });
		// let beFieldValue = getFieldValue("clusterId") || {};
		// let ccField = getNFieldProps('ccId',{
		// 								initialValue:getOne["cc"+language]?{s_label:getOne["cc"+language],ccId:getOne.ccId,ccLcName:getOne.ccLcName,ccEnName:getOne.ccEnName}:undefined
		// 							 });
		// let ccIdValue = getFieldValue("ccId") || {};
		// let sorIdValue = getNFieldProps('sorId',{
		// 								initialValue:getOne["sor"+language]?{s_label:getOne["sor"+language],sorId:getOne.sorId,sorLcName:getOne.sorLcName,sorEnName:getOne.sorEnName}:undefined
		// 							 });
		// let sorIdFild = getFieldValue("sorId") || {};
		return(
			<div className={'addnormal'} style={{marginTop:'10px'}}>
				<div className={'addnormal-title'}>
					<span style={{width:45}}>{i18n.t(100140/*组织*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500143/*集团组织*/)}</label>
							<Select 
									{...beField}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"	
									allowClear={false}
									className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
									disabled
								>	
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
							{/*<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( beFieldValue.clusterId)}
                                                 refreshMark={beFieldValue.clusterId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_ES, uri: '/party/getLoginCompanies',
                                                     params: {clusId: beFieldValue.clusterId}
                                                 }} fieldName="ccId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["cc"+language]?{s_label:getOne["cc"+language],ccId:getOne.ccId,ccLcName:getOne.ccLcName,ccEnName:getOne.ccEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     ccId: da.id,
                                                     ccLcName: da.localName,
                                                     ccEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles={true}
                                                 className ={getFieldError('ccId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
							/>*/} 
                            <ConstVirtualSelect
                                apiHost={API_FOODING_ES}
                                form={this.props.form}
                                apiUri='/party/getLoginCompanies'
                                apiParams={{clusId: getOne.clusterId}}
                                fieldName="ccId"
                                initialValue={xt.initSelectValue(true, getOne, ['ccId', 'ccLcName', 'ccEnName'], 'ccLcName', form)}
                                valueKeys={da => ({
                                    ccId: da.id,
                                    ccLcName: da.localName,
                                    ccEnName: da.name,
                                    s_label: da.localName
                                })} rules
                            />							
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200119/*销售组织*/)}</label>
							{/*<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( ccIdValue.ccId)}
                                                 refreshMark={ccIdValue.ccId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_ES, uri: '/party/getPartysByType',
                                                     params: {partyId:ccIdValue.ccId,typeId:44}
                                                 }} fieldName="sorId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["sor"+language]?{s_label:getOne["sor"+language],sorId:getOne.sorId,sorLcName:getOne.sorLcName,sorEnName:getOne.sorEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     sorId: da.id,
                                                     sorLcName: da.localName,
                                                     sorEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={getFieldError('sorId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />*/}
                            <ConstVirtualSelect 
                                apiHost={API_FOODING_ES}
                                form={this.props.form} disabled={!Boolean(getFieldValue('ccId', {}).ccId)}
                                refreshMark={getFieldValue('ccId', {}).ccId}
                                apiUri="/party/getPartysByType"
                                apiParams={{partyId: getFieldValue('ccId', getOne).ccId, typeAttributeIds:["44"]}}
                                fieldName="sorId"
                                initialValue={ xt.initSelectValue(
                                    getOne.sorId && getOne.ccId === getFieldValue('ccId', {}).ccId, getOne,
                                    ['sorId', 'sorLcName', 'sorEnName'],
                                    'sorLcName', form
                                )}
                                valueKeys={da => ({
                                    sorId: da.id,
                                    sorLcName: da.localName,
                                    sorEnName: da.name,
                                    s_label: da.localName
                                })} rules
                            />							
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400011/*销售员*/)}</label>
							{/*<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( sorIdFild.sorId)}
                                                 refreshMark={sorIdFild.sorId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_ES, uri: '/user/getListForPermissionsInParty',
                                                     params: {partyId:sorIdFild.sorId,partyTypeId:601}
                                                 }} fieldName="saleStaffId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["saleStaff"+language]?{s_label:getOne["saleStaff"+language],saleStaffId:getOne.saleStaffId,saleStaffLcName:getOne.saleStaffLcName,saleStaffEnName:getOne.saleStaffEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     saleStaffId: da.refId,
                                                     saleStaffLcName: da.staffLocalName,
                                                     saleStaffEnName: da.staffName,
                                                     s_label: da["staffLocalName"]
                                                 }}>{da.staffLocalName}</Option>} reles={true}
                                                 className ={getFieldError('saleStaffId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />*/}
                            <ConstVirtualSelect
                                form={this.props.form} disabled={!Boolean(getFieldValue('sorId', {}).sorId)}
                                refreshMark={getFieldValue('sorId', {}).sorId}
                                apiUri="/user/getListForPermissionsInParty"
                                apiHost={API_FOODING_ES}
                                apiParams={{partyId: getFieldValue('sorId', getOne).sorId}}
                                fieldName="saleStaffId"
                                initialValue={xt.initSelectValue(
                                    getOne.saleStaffId && getOne.sorId === (getFieldValue('sorId', {}).sorId),
                                    getOne, ['saleStaffId', 'saleStaffLcName', 'saleStaffEnName'], 'saleStaffLcName'
                                )}
                                valueKeys={ da => ({
                                    saleStaffId: da.refId,
                                    saleStaffLcName: da.staffLocalName,
                                    saleStaffEnName: da.staffName,
                                    s_label: da.staffLocalName
                                })} rules
                            />							
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Addnormal;
