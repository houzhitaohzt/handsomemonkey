import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option,ConstMiniSelect } from '../../../../components/Select';
import  SelectChange from "../../../../components/SelectChange";
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP,API_FOODING_ES} from '../../../../services/apiCall';
import xt from '../../../../common/xt'; // 下拉
class Addnormal extends Component{
	constructor(props){
		super(props);
		this.state=this.initState();
	}
	initState(){
		return {
			radioState:'',
			radioAddress:''
		}
	}
	render(){
		const {radioAddress, radioState} = this.state;
		let {getOne} = this.props;
		let {getNFieldProps,getFieldProps,getFieldError,getFieldValue }= this.props.form;
		let beField = getNFieldProps('clusterId',{
										initialValue:getOne["cluster"+language]?{s_label:getOne["cluster"+language],clusterId:getOne.clusterId,clusterLcName:getOne.clusterLcName,clusterEnName:getOne.clusterEnName}:undefined
									 });
		let beFieldValue = getFieldValue("clusterId") || {};
		let ccField = getNFieldProps('ccId',{
										initialValue:getOne["cc"+language]?{s_label:getOne["cc"+language],ccId:getOne.ccId,ccLcName:getOne.ccLcName,ccEnName:getOne.ccEnName}:undefined
									 });
		let ccIdValue = getFieldValue("ccId") || {};
		let sorIdValue = getNFieldProps('sorId',{
										initialValue:getOne["sor"+language]?{s_label:getOne["sor"+language],sorId:getOne.sorId,sorLcName:getOne.sorLcName,sorEnName:getOne.sorEnName}:undefined
									 });
		let sorIdFild = getFieldValue("sorId") || {};
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
									{...getNFieldProps('clusterId',{
										rules: [{required:true}],
										initialValue:getOne["cluster"+language]?{s_label:getOne["cluster"+language], clusterId:getOne.clusterId, clusterLcName:getOne.clusterLcName, clusterEnName:getOne.clusterEnName}:undefined
									 })}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"							
									className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
									disabled
									allowClear={false}
								>	
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( beFieldValue.clusterId) }
                                                 refreshMark={beFieldValue.clusterId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_ES, uri: '/party/getLoginCompanies',
                                                     params: {clusId: beFieldValue.clusterId}
                                                 }} fieldName="ccId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["cc"+language], getOne, ['ccId', 'ccLcName', 'ccEnName'], "cc"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     ccId: da.id,
                                                     ccLcName: da.localName,
                                                     ccEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200937/*发布人*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean(getFieldValue("ccId",{}).ccId || getOne.ccId)}
                                                 refreshMark={getFieldValue("ccId", {}).ccId}
                                                 pbj={{
                                                      apiType: apiGet, host: API_FOODING_ES, uri: '/user/getListForPermissionsInParty',
                                                     params: {partyId:getFieldValue("ccId",{}).ccId}
                                                 }} fieldName="purStaffId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne.purStaffId, getOne, ['purStaffId', 'purStaffLcName', 'purStaffEnName'], 'purStaff'+language, this.props.form)}
				                                 optionValue={da => <Option key={da.refId} objValue={{
					                                 purStaffId: da.refId,
					                                 purStaffLcName: da.staffLocalName,
					                                 purStaffEnName: da.staffEnName,
					                                 s_label: da.staffLocalName
					                             }}>{da.staffLocalName}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8 '}							
                            />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Addnormal;
