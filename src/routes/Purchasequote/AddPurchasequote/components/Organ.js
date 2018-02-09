import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option,ConstMiniSelect } from '../../../../components/Select';
import  SelectChange from "../../../../components/SelectChange";
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import xt from '../../../../common/xt'; // 下拉
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
			radioAddress:'',
			data:{},
			info:[],
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
		let {getNFieldProps,getFieldProps,getFieldError,getFieldValue }= this.props.form;
		let {getOne} = this.props;
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
                                                 }}>{da.localName}</Option>}
                                                 reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8 '}							
                                />

						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400036/*采购组织*/)}</label>
							<ConstMiniSelect form={this.props.form} refreshMark={getFieldValue("ccId", getOne).ccId}
							  isRequest={Boolean(getFieldValue("ccId", getOne).ccId)}
							 pbj={{
								apiType:apiGet,
								 host:API_FOODING_ES,
								 uri: '/party/getPartysByType',
								 params:{typeAttributeIds:["42"],partyId: getFieldValue("ccId",getOne).ccId}
							}} fieldName="porId"
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                 porId: da.id,
	                                 porLcName: da.localName,
	                                 porEnName: da.name,
	                                 s_label: da.localName
	                             }}>{da.localName}</Option>} reles={true}
	                             initialValue={xt.initSelectValue(getOne.porId && getOne.ccId === getFieldValue("ccId", getOne).ccId, getOne, ['porId', 'porLcName', 'porEnName'], 'porLcName', this.props.form)}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />

						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400037/*采购员*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean(getFieldValue("porId",getOne).porId || getOne.porId)}
                                                 refreshMark={getFieldValue("porId", {}).porId}
                                                 pbj={{
                                                      apiType: apiGet, host: API_FOODING_ES, uri: '/user/getListForPermissionsInParty',
                                                     params: {partyId:getFieldValue("porId",getOne).porId,typeAttributeIds:605}
                                                 }} fieldName="purStaffId"
                                                 initValueOptions={[]}
                                               	initialValue={
                                                 	xt.initSelectValue(getOne.purStaffId && getFieldValue('porId', {}).porId === getOne.porId, getOne, ['purStaffId', 'purStaffLcName', 'purStaffEnName'], "purStaff"+language, this.props.form)
                                                 }
				                                 optionValue={da => <Option key={da.refId} objValue={{
					                                 purStaffId: da.refId,
					                                 purStaffLcName: da.staffLocalName,
					                                 purStaffEnName: da.staffName,
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
