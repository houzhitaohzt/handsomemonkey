import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Checkbox from "../../../../components/CheckBox";
import Select, {Option,ConstMiniSelect} from '../../../../components/Select';
import {createForm,FormWrapper} from '../../../../components/Form';
import  SelectChange from "../../../../components/SelectChange";
import DataTime from '../../../../components/Calendar/Calendar';
import xt from '../../../../common/xt';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP}
from '../../../../services/apiCall';
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
		let beField = getNFieldProps('arrPlaceType',{
										initialValue:getOne["arrPlaceTypeName"]?{s_label:getOne["arrPlaceTypeName"],arrPlaceType:getOne.arrPlaceType,arrPlaceTypeName:getOne.arrPlaceTypeName}:undefined
									 });
		let beFieldValue = getFieldValue("arrPlaceType",{}).arrPlaceType || getFieldValue("arrPlaceType");
		let common =<div></div>;
		if(beFieldValue == 10){
			//港口
			common = <div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400014/*送达港口*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean(getFieldValue("arrPlaceType",{}).arrPlaceType)}
                                                 refreshMark={getFieldValue("arrPlaceType",{}).arrPlaceType}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Statn'}
                                                 }} fieldName="statnId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne.statnId, getOne, ['statnId', 'statnLcName','statnEnName'],"statn"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     statnId: da.id,
                                                     statnLcName: da.name,
                                                     statnEnName:da.name,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />
					</div>
		}else {
			//仓库
			common = <div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400038/*送达仓库*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.StorLocatn'}
                                                 }} fieldName="receSlId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne.receSlId, getOne, ['receSlId', 'receSlLcName','receSlEnName'],"receSl"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     receSlId: da.id,
                                                     receSlLcName: da.name,
                                                     receSlEnName:da.name,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />
					</div>
		}
		return(
			<div className={'addnormal'} style={{marginTop:'10px',marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(400110/*装运信息*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100297/*起运港*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Statn'}
                                                 }} fieldName="sStatnId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["sStatn"+language], getOne, ['sStatnId', 'sStatnLcName', 'sStatnEnName'], "sStatn"+language, this.props.form)
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
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Statn'}
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
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400071/*交货日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									showTime={false}
									isShowIcon={true}
									validate={true}
									width={'100%'}
									value={getOne.delDate}
									form={this.props.form} 
									name={'delDate'}
								/>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400111/*发货方式*/)}</label>
							<ConstMiniSelect form={this.props.form}  
							     props={{defaultActiveFirstOption:true}}
							 	 pbj='com.fooding.fc.enumeration.ShipType' fieldName="shipType"
	                             initValueOptions={getOne.shipType?[{id:String(getOne.shipType),name:getOne.shipTypeName,localName:getOne.shipTypeName}]:[{id:'0',name:i18n.t(400113/*送货*/),localName:i18n.t(400113/*送货*/)}]}
	                             reles={true}
	                             initialValue={getOne.shipType?String(getOne.shipType):'0'}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400112/*发货方*/)}</label>
	                        <ConstMiniSelect form={this.props.form} isRequest={Boolean(getFieldValue("salBeId", {}).salBeId)}
									refreshMark={getFieldValue("salBeId", getOne).salBeId}
										pbj={{apiType: apiGet, host: API_FOODING_DS, uri: '/partner/getListBySourceId',
			                                 params: {isAddSelf:true,sourceId:getFieldValue("salBeId", getOne).salBeId,dataTyId:40}
			                             }} fieldName="sendBeId"
			                             initValueOptions={[]}
			                             optionValue={da => <Option key={da.enterpriseId} objValue={{
			                                 sendBeId: da.enterpriseId,
			                                 sendBeLcName: da.enterpriseLcName,
			                                 sendBeEnName: da.enterpriseEnName,
			                                 s_label: da.enterpriseLcName
			                             }}>{da.enterpriseLcName}</Option>} reles={true}
			                             initialValue={xt.initSelectValue(getOne.sendBeId && getFieldValue("salBeId", {}).salBeId, getOne, ['sendBeId', 'sendBeLcName', 'sendBeEnName'], 'sendBeLcName', this.props.form)}
			                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100547/*地址类型*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.enumeration.ArrPlaceType'}
                                                 }} fieldName="arrPlaceType"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne.arrPlaceTypeName, getOne, ['arrPlaceType', 'arrPlaceTypeName'],"arrPlaceTypeName", this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     arrPlaceType: da.id,
                                                     arrPlaceTypeName: da.name,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />
						</div>
						{common}
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(500087/*装运要求*/)}</label>
							<textarea
								placeholder=""
								{...getFieldProps('shipmentReq',{
										initialValue:getOne.shipmentReq?getOne.shipmentReq:''
							    })}
								className={'col-md-10 col-lg-10 text-input-nowidth'}
								style={{resize:'none',height:'65px'}}
							>
							</textarea>
						</div>
						<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-2 col-lg-2'}>{i18n.t(200952/*送到地址*/)}</label>
								<textarea
									placeholder=""
									{...getFieldProps('receAdress',{
											initialValue:getOne.receAdress?getOne.receAdress:''
								    })}
									className={'col-md-10 col-lg-10 text-input-nowidth'}
									style={{resize:'none',height:'65px'}}
								>
								</textarea>
							</div>
					</div>
				</div>
			</div>
		)
	}
}

export default createForm()(Addnormal);
