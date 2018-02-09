import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option,ConstMiniSelect } from '../../../../components/Select';
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
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100243/*集团*/)}</label>
							<Select 
									{...beField}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"							
									className ={'currency-btn select-from-currency col-md-9 col-lg-9'}							
									disabled
								>	
							</Select>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100486/*公司*/)}</label>
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
                                                 }}>{da.localName}</Option>} reles={true}
                                                 className ={getFieldError('ccId')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}							
                                />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Addnormal;
