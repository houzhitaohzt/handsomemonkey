import React, { Component } from 'react';
import Select, {Option, ConstMiniSelect } from '../../../../../components/Select';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../../services/apiCall";
import xt from '../../../../../common/xt';
import { I18n } from '../../../../../lib/i18n';
export class Organization extends Component{
	constructor(props){
		super(props)
	}
	render(){
		const { getFieldProps, getFieldError, getFieldValue } = this.props.form;
		let {valueone = {} } = this.props,tempObj ={};
		tempObj = Object.assign({},{orgId:valueone.porId,orgLcName:valueone.porLcName,orgEnName:valueone.porEnName,staffId:valueone.purStaffId,staffLcName:valueone.purStaffLcName,staffEnName:valueone.purStaffEnName})

		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{I18n.t(100140/*组织*/)}</span>
				</div>
				<div className={' '}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100243/*集团*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph shengyue'}>{valueone.clusterLcName || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100486/*公司*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph shengyue'}>{valueone.ccLcName || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(400036/*采购组织*/)}</label>
							<ConstMiniSelect form={this.props.form}
							 pbj={{
								apiType:apiGet,
								 host:API_FOODING_ES,
								 uri: '/party/getPartysByType',
								 params:{typeAttributeIds:["42"],partyId: valueone.ccId || ""}
							}} fieldName="orgId"
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                 orgId: da.id,
	                                 orgLcName: da.localName,
	                                 orgEnName: da.name,
	                                 s_label: da.localName
	                             }}>{da.localName}</Option>} reles={true}
	                             initialValue={xt.initSelectValue(tempObj.orgId && valueone.ccId, tempObj, ['orgId', 'orgLcName', 'orgEnName'], 'orgLcName', this.props.form)}
	                             className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
	                        />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(400037/*采购员*/)}</label>
							<ConstMiniSelect form={this.props.form} isRequest={Boolean(getFieldValue("orgId", {tempObj}).orgId)}
							refreshMark={getFieldValue("orgId", {tempObj}).orgId} 
							 pbj={{
								apiType:apiGet,
								 host:API_FOODING_ES,
								 uri: '/user/getListForPermissionsInParty',
								 params:{partyId:getFieldValue("orgId", tempObj).orgId}
							}} fieldName="staffId"
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.refId} objValue={{
	                                 staffId: da.refId,
	                                 staffLcName: da.staffLocalName,
	                                 staffEnName: da.staffEnName,
	                                 s_label: da.staffLocalName
	                             }}>{da.staffLocalName}</Option>} reles={true}
	                             initialValue={xt.initSelectValue(
	                             		tempObj.staffId && tempObj.orgId === getFieldValue("orgId", {}).orgId, tempObj,
	                             		['staffId', 'staffLcName', 'staffEnName'], 'staffLcName', this.props.form
	                             	)}
	                             className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
	                        />
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  Organization;
