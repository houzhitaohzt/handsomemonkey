import React, { Component } from 'react';
import Select, {Option, ConstMiniSelect } from '../../../../components/Select';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../services/apiCall";
import xt from '../../../../common/xt';
import { I18n } from '../../../../lib/i18n';
export class OrganizationAdd extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {PurOrder={}} = this.props;
		const { getFieldProps, getFieldValue, getFieldError } = this.props.form;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{I18n.t(100140/*组织*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100486/*公司*/)}</label>
							<ConstMiniSelect form={this.props.form}
							 pbj={{
								apiType:apiGet,
								 host:API_FOODING_ES,
								 uri: '/party/getLoginCompanies',
								 params:{id:PurOrder.clusterId}
							}} fieldName="ccId"
	                             initValueOptions={[]}
	                             reles={true}
	                             initialValue={xt.initSelectValue(true, PurOrder, ['ccId', 'ccEnName', 'ccLcName'], 'ccLcName', this.props.form)}
	                              optionValue={da => <Option key={da.id} objValue={{
	                                 ccId: da.id,
	                                 ccLcName: da.localName,
	                                 ccEnName: da.name,
	                                 s_label: da.localName
	                             }}>{da.localName}</Option>}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(400036/*采购组织*/)}</label>
							<ConstMiniSelect form={this.props.form} refreshMark={getFieldValue("ccId", PurOrder).ccId}
							  isRequest={Boolean(getFieldValue("ccId", PurOrder).ccId)}
							 pbj={{
								apiType:apiGet,
								 host:API_FOODING_ES,
								 uri: '/party/getPartysByType',
								 params:{typeAttributeIds:["42"],partyId: getFieldValue("ccId",PurOrder).ccId}
							}} fieldName="porId"
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                 porId: da.id,
	                                 porLcName: da.localName,
	                                 porEnName: da.name,
	                                 s_label: da.localName
	                             }}>{da.localName}</Option>} reles={true}
	                             initialValue={xt.initSelectValue(PurOrder.porId && PurOrder.ccId === getFieldValue("ccId", {}).ccId, PurOrder, ['porId', 'porLcName', 'porEnName'], 'porLcName', this.props.form)}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(400037/*采购员*/)}</label>
							<ConstMiniSelect form={this.props.form} isRequest={Boolean(getFieldValue("porId", {PurOrder}).porId)}
							refreshMark={getFieldValue("porId", {PurOrder}).porId} 
							 pbj={{
								apiType:apiGet,
								 host:API_FOODING_ES,
								 uri: '/user/getListForPermissionsInParty',
								 params:{partyId:getFieldValue("porId", PurOrder).porId}
							}} fieldName="purStaffId"
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.refId} objValue={{
	                                 purStaffId: da.refId,
	                                 purStaffLcName: da.staffLocalName,
	                                 purStaffEnName: da.staffEnName,
	                                 s_label: da.staffLocalName
	                             }}>{da.staffLocalName}</Option>} reles={true}
	                             initialValue={xt.initSelectValue(
	                             		PurOrder.purStaffId && PurOrder.porId === getFieldValue("porId", {}).porId, PurOrder,
	                             		['purStaffId', 'purStaffLcName', 'purStaffEnName'], 'purStaffLcName', this.props.form
	                             	)}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  OrganizationAdd;
