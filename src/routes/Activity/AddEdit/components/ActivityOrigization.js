import React, {Component, PropTypes} from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
import Select, {Option, ConstMiniSelect } from '../../../../components/Select';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import xt from '../../../../common/xt';

import {I18n} from "../../../../lib/i18n";

class AddOrganization extends Component{
	constructor(props){
		super(props)
		this.state = this.initState();
	}
	initState(){
		return{
		}
	}
	componentWillReceiveProps(nextPorps){
	
	}
	render(){
		const { getNFieldProps, getFieldError, getFieldProps, getFieldValue } = this.props.form;
		const {commonData = {}} = this.props;
		return (<div className={'organization'}>
				<div className={'organization-title'}>
					<span className={'org'}>{I18n.t(100140/*组织*/)}</span>
				</div>
				<div className={'girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100243/*集团*/)}</label>
							<ConstMiniSelect form={this.props.form}
							 pbj={{
								apiType:apiGet,
								 host:API_FOODING_ES,
								 uri: '/party/getLoginClusters',
								 params:{}
							}} fieldName="clusterId"
							optionValue={da => <Option key={da.id} objValue={{
	                                 clusterId: da.id,
	                                 clusterEnName: da.name,
	                                 clusterLcName:da.localName,
	                                 s_label: da.localName
	                             }}>{da.localName}</Option>}
	                             initValueOptions={[]}
	                             initialValue={xt.initSelectValue(commonData.clusterId, commonData, ['clusterId', 'clusterLcName', 'clusterEnName'], 'clusterLcName', this.props.form)}
	                             className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
	                        />
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100486/*公司*/)}</label>
							<ConstMiniSelect form={this.props.form}
								isRequest={Boolean(getFieldValue("clusterId",{}).clusterId)}
								refreshMark={getFieldValue("clusterId",{}).clusterId}
								 pbj={{
									apiType:apiGet,
									 host:API_FOODING_ES,
									 uri: '/party/getLoginCompanies',
									 params:{id:getFieldValue('clusterId',commonData).clusterId}
								}} fieldName="ccId"
								optionValue={da => <Option key={da.id} objValue={{
	                                 ccId: da.id,
	                                 ccEnName: da.name,
	                                 ccLcName:da.localName,
	                                 s_label: da.localName
	                             }}>{da.localName}</Option>}
		                             initValueOptions={[]}
		                             initialValue={xt.initSelectValue(commonData.ccId && getFieldValue('clusterId',{}).clusterId == commonData.clusterId, commonData, ['ccId', 'ccLcName', 'ccEnName'], 'ccLcName', this.props.form)}
		                             className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
	                        />
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100361/*分管人*/)}</label>
							<ConstMiniSelect form={this.props.form} isRequest={Boolean(getFieldValue("ccId",{}).ccId)}
								refreshMark={getFieldValue("ccId",{}).ccId} 
								 pbj={{
									apiType:apiGet,
									 host:API_FOODING_ES,
									 uri: '/user/getListForPermissionsInParty',
									 params:{partyId:getFieldValue("ccId",commonData).ccId}
								}} fieldName="responsibleOfficerId"
								initValueOptions={[]}
								optionValue={da => <Option key={da.id} objValue={{
	                                 responsibleOfficerId: da.refId,
	                                 responsibleOfficerEnName: da.staffLocalName,
	                                 responsibleOfficerLcName:da.staffLocalName,
	                                 s_label: da.staffLocalName
	                             }}>{da.staffLocalName}</Option>}		                             
	                             initialValue={xt.initSelectValue(commonData.responsibleOfficerId && getFieldValue('ccId',{}).ccId === commonData.ccId, commonData, ['responsibleOfficerId', 'responsibleOfficerLcName', 'responsibleOfficerEnName'], 'responsibleOfficerLcName', this.props.form)}
	                             className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
	                        />	        
						</div>
					</div>
				</div>
			</div>)
	}
}

// const AddOrganizationForm = createForm()(AddOrganization);
export default AddOrganization;
