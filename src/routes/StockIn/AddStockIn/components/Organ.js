import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option,ConstMiniSelect } from '../../../../components/Select';
import  SelectChange from "../../../../components/SelectChange";
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import {I18n} from '../../../../lib/i18n';
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
		let beField = getNFieldProps('clusterId',{
										rules: [{required:true}],
										initialValue:getOne["cluster"+language]?{s_label:getOne["cluster"+language], clusterId:getOne.clusterId, clusterLcName:getOne.clusterLcName, clusterEnName:getOne.clusterEnName}:undefined
									 });
		let beFieldValue = getFieldValue("clusterId") || {};
		let beFields = getNFieldProps('ccId',{
										rules: [{required:true}],
										initialValue:getOne["cc"+language]?{s_label:getOne["cc"+language], ccId:getOne.ccId, ccLcName:getOne.ccLcName, ccEnName:getOne.ccEnName}:undefined
									 });
		let ccIdValue = getFieldValue("ccId") || {};
		return(
			<div className={'addnormal'} style={{marginTop:'10px'}}>
				<div className={'addnormal-title'}>
					<span style={{width:45}}>{I18n.t(100140/*组织*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(500143/*集团组织*/)}</label>
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
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100244/*企业*/)}</label>
							<ConstMiniSelect form={this.props.form}
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
                                                 }}>{da.localName}</Option>}
                                                 className ={getFieldError('ccId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />

						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500144/*营运组织*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( ccIdValue.ccId)}
                                                 refreshMark={ccIdValue.ccId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_ES, uri: '/party/getPartysByType',
                                                     params: {partyId:ccIdValue.ccId,typeAttributeIds:["43"]}
                                                 }} fieldName="plantId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["plant"+language]?{s_label:getOne["plant"+language],plantId:getOne.plantId,plantLcName:getOne.plantLcName,plantEnName:getOne.plantEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     plantId: da.id,
                                                     plantLcName: da.localName,
                                                     plantEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />

						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400145/*职员*/)}</label>
							<Select 
								{...getNFieldProps('staffId',{
										                    rules: [{required:true}],
										                    initialValue:getOne["staff"+language]?{s_label:getOne["staff"+language], staffId: getOne.staffId, staffLcName:getOne.staffLcName,staffEnName:getOne.staffEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"							
										                className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
										                disabled={true}	
										                allowClear={false}							
							>	
										                
							</Select>
						</div>
				</div>
				</div>
			</div>
		)
	}
}

export default Addnormal;
