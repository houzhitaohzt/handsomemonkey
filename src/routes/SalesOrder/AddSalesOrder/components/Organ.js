import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option,ConstMiniSelect } from '../../../../components/Select';
import  SelectChange from "../../../../components/SelectChange";
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP,API_FOODING_ES} from '../../../../services/apiCall';
import xt from '../../../../common/xt'; // 下拉
class Addnormal extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState();
		this.xinbaoChange = this.xinbaoChange.bind(this);
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
	xinbaoChange(e){
		let that = this;
		let {getFieldValue}=this.props.form;
		let billDate = getFieldValue("billDate",{});
		let payTrmId = getFieldValue("payTrmId",{}).payTrmId;
		let insBeId = getFieldValue("insBeId",{}).insBeId;
		let corpTypeId = getFieldValue("corpTypeId",{}).corpTypeId;
		let riskTyId = getFieldValue("riskTyId",{}).riskTyId;
		let ccId = e.ccId;

		if(billDate && payTrmId  && insBeId &&
		 corpTypeId && riskTyId&& ccId){
			apiGet(API_FOODING_ERP,'/termscreditrate/getRate',{
				billDate:billDate,payTrmId:payTrmId,insBeId:insBeId,
				corpTypeId:corpTypeId,riskTyId:riskTyId,ccId:ccId
			},(response)=>{
				let getOne = this.props.getOne;
				getOne = Object.assign({},getOne,{corpRate:response.data});
        		that.props.setGetOne(getOne);
			},(error)=>{

			})
		}
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
		let {getNFieldProps,getFieldProps,getFieldError,getFieldValue }= this.props.form;
		// let beField = getNFieldProps('clusterId',{
		// 								initialValue:getOne["cluster"+language]?{s_label:getOne["cluster"+language],clusterId:getOne.clusterId,clusterLcName:getOne.clusterLcName,clusterEnName:getOne.clusterEnName}:undefined
		// 							 });
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
									{...getNFieldProps('clusterId',{
										initialValue:getOne["cluster"+language]?{s_label:getOne["cluster"+language],clusterId:getOne.clusterId,clusterLcName:getOne.clusterLcName,clusterEnName:getOne.clusterEnName}:undefined
									 })}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"
									className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
									disabled
								>
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean(getFieldValue("clusterId",getOne).clusterId)}
                                                 refreshMark={getFieldValue("clusterId",getOne).clusterId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_ES, uri: '/party/getLoginCompanies',
                                                     params: {clusId: getFieldValue("clusterId",getOne).clusterId}
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
                                                 onChange ={this.xinbaoChange}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200119/*销售组织*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue('ccId',{}).ccId)}
                                                 refreshMark={getFieldValue('ccId', {}).ccId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_ES, uri: '/party/getPartysByType',
                                                     params: {partyId:getFieldValue('ccId', {}).ccId,typeAttributeIds:["44"]}
                                                 }} fieldName="sorId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne.sorId && getFieldValue('ccId', {}).ccId === getOne.ccId, getOne, ['sorId', 'sorLcName', 'sorEnName'], "sor"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     sorId: da.id,
                                                     sorLcName: da.localName,
                                                     sorEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400011/*销售员*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean(getFieldValue('sorId', {}).sorId)}
                                                 refreshMark={getFieldValue('sorId', {}).sorId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_ES, uri: '/user/getListForPermissionsInParty',
                                                     params: {partyId:getFieldValue('sorId', {}).sorId}
                                                 }} fieldName="saleStaffId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne.saleStaffId && getFieldValue('sorId', {}).sorId === getOne.sorId, getOne, ['saleStaffId', 'saleStaffLcName', 'saleStaffEnName'], "saleStaff"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     saleStaffId: da.refId,
                                                     saleStaffLcName: da.staffLocalName,
                                                     saleStaffEnName: da.staffName,
                                                     s_label: da["staffLocalName"]
                                                 }}>{da.staffLocalName}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Addnormal;
