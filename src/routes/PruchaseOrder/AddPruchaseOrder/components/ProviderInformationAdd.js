import i18n from './../../../../lib/i18n';
import React, { Component } from 'react';
import Select, {Option, ConstMiniSelect, ConstVirtualSelect } from '../../../../components/Select';
import Checkbox from '../../../../components/CheckBox';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import xt from '../../../../common/xt';

import { I18n } from '../../../../lib/i18n';
export class ProviderInformationAdd extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let that = this;
		let {PurOrder} = this.props,dom;
		const { getFieldProps, getFieldValue, getFieldError, getNFieldProps } = this.props.form;
		
		
		// console.log(PurOrder);
		if(JSON.stringify(PurOrder) === "{}"){
			dom =  (<div></div>);
		}else{
			dom = (<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{I18n.t(400083/*供应商信息*/)}</span>
				</div>
				<div className={'  girdlayout'} style={{marginBottom:'10px'}}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100312/*供应商*/)}</label>
	                        <Select
	                        	disabled={PurOrder.products&&PurOrder.products.length>1?true:false}
                                animation='slide-up'
                                placeholder=""
                                className ={getFieldError('vndBeId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
                                choiceTransitionName="rc-select-selection__choice-zoom"
                                optionLabelProp="children"
                                optionFilterProp='children' 
                                allowClear={false}                               
                                {...getNFieldProps('vndBeId', {
						            validateFirst: true,
						            rules: [{required:true,}],
						            valuedateTrigger:"onBlur",
						            initialValue:PurOrder.vndBeId?{vndBeId:PurOrder.vndBeId,vndBeEnName:PurOrder.vndBeEnName,vndBeLcName:PurOrder.vndBeLcName,s_label:PurOrder.vndBeLcName}:undefined
						        })}
								onClick={PurOrder.products&&PurOrder.products.length>1?()=>{}:that.props.onProviderClick}
                                onSelect={that.props.onProviderSelect}
                            >
                                {this.props.providerSelectData.map(
                                    da => <Option key={da.id} objValue={{
                                         vndBeId: da.id,
		                                 vndBeLcName: da.localName,
		                                 vndBeEnName: da.name,
		                                 s_label: da.localName
                                    }}>{da.localName}</Option>
                                )}
                            </Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100133/*支付条款*/)}</label>
							<ConstMiniSelect form={this.props.form} 
								 isRequest={Boolean( getFieldValue('vndBeId',{}).vndBeId)}
                                 refreshMark={getFieldValue('vndBeId', {}).vndBeId}
                                 pbj={{
                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getList',
                                     params: {obj:'com.fooding.fc.ds.entity.TradrulePayterm',attrs:['payTrm'],
									 queryParams:[{attr:'sourceId',expression:'=',value:getFieldValue('vndBeId', {}).vndBeId}]}
                                 }}
								 fieldName="payTrmId"
	                             initValueOptions={[]}
	                             reles={true}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                 payTrmId: da.payTrm.id,
	                                 payTrmLcName: da.payTrm.localName,
	                                 payTrmEnName: da.payTrm.name,
	                                 s_label: da.payTrm.localName
	                             }}>{da.payTrm.localName}</Option>} reles={true}
	                             //initialValue={{payTrmId:PurOrder.payTrmId,payTrmEnName:PurOrder.payTrmEnName,payTrmLcName:PurOrder.payTrmLcName,s_label:PurOrder.payTrmLcName}}
	                             initialValue={xt.initSelectValue(PurOrder.payTrmId && getFieldValue("vndBeId", {}).vndBeId === PurOrder.vndBeId, PurOrder, ['payTrmId', 'payTrmLcName', 'payTrmEnName'], 'payTrmLcName', this.props.form)}
	                             
								 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400084/*收款单位*/)}</label>
							<ConstMiniSelect form={this.props.form} isRequest={Boolean(getFieldValue("vndBeId", PurOrder).vndBeId)}
								refreshMark={getFieldValue("vndBeId", PurOrder).vndBeId}
								pbj={{apiType: apiGet, host: API_FOODING_DS, uri: '/partner/getListBySourceId',
	                                 params: {isAddSelf:true,sourceId:getFieldValue("vndBeId", PurOrder).vndBeId,dataTyId:40}
	                             }} fieldName="recVndBeId"
	                             initValueOptions={[]}
	                             reles={true}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                 recVndBeId: da.enterpriseId,
	                                 recVndBeLcName: da.enterpriseLcName,
	                                 recVndBeEnName: da.enterpriseEnName,
	                                 s_label: da.enterpriseLcName
	                             }}>{da.enterpriseLcName}</Option>} reles={true}
	                             initialValue={xt.initSelectValue(PurOrder.recVndBeId && getFieldValue("vndBeId", {}).vndBeId === PurOrder.vndBeId, PurOrder, ['recVndBeId', 'recVndBeLcName', 'recVndBeEnName'], 'recVndBeLcName', this.props.form)}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400085/*供应商订单号*/)}</label>
							<input type='text' className={'col-md-8 col-lg-8 text-input-nowidth'} {...getFieldProps('vndOrderNo', {
                                initialValue:PurOrder.vndOrderNo?PurOrder.vndOrderNo:''
                            })} />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100376/*交易条款*/)}</label>
							<ConstMiniSelect form={this.props.form}
							pbj={{
								 params:{"obj":"com.fooding.fc.ds.entity.Incotm",
								 "queryParams":[{"attr":"incotmTyId","expression":"=","value":"20"}]}
							}}
							 	fieldName="incotmId"
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                 incotmId: da.id,
	                                 incotmLcName: da.localName,
	                                 incotmEnName: da.name,
	                                 s_label: da.localName
	                             }}>{da.localName}</Option>} reles={true}
	                             initialValue={{incotmId:PurOrder.incotmId,incotmLcName:PurOrder.incotmLcName,incotmEnName:PurOrder.incotmEnName,s_label:PurOrder.incotmLcName}}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400086/*承担进仓费*/)}</label>
							<lable className={'col-md-4 col-lg-4'} style={{marginTop:'6px'}}>
								<Checkbox {...getFieldProps('inStoreFee',{
										    initialValue:PurOrder.inStoreFee?PurOrder.inStoreFee:false
									 })}
								checked={!!getFieldValue('inStoreFee')}
								/>
							</lable>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400087/*承担港杂*/)}</label>
							<lable className={'col-md-4 col-lg-4'} style={{marginTop:'6px'}}>
								<Checkbox {...getFieldProps('portFee',{
										    initialValue:PurOrder.portFee?PurOrder.portFee:false
									 })}
								checked={!!getFieldValue('portFee')}
								/>
							</lable>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400088/*是否开票*/)}</label>
							<lable className={'col-md-4 col-lg-4'} style={{marginTop:'6px'}}>
								<Checkbox {...getFieldProps('invMark',{
										    initialValue:PurOrder.invMark?PurOrder.invMark:false
									 })}
								checked={!!getFieldValue('invMark')}
								/>
							</lable>
						</div>
					</div>
				</div>

				<div className={'addnormal-title'}>
					<span  >{I18n.t(400110/*装运信息*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400111/*发货方式*/)}</label>
							<ConstMiniSelect form={this.props.form}  
							 props={{defaultActiveFirstOption:true}}
							 pbj='com.fooding.fc.enumeration.ShipType' fieldName="shipType"
								 initValueOptions={PurOrder.shipType?[{id:String(PurOrder.shipType),name:PurOrder.shipTypeName,localName:PurOrder.shipTypeName}]:[{id:'0',name:I18n.t(400113/*送货*/),localName:I18n.t(400113/*送货*/)}]}
	                             reles={true}
	                             initialValue={PurOrder.shipType?String(PurOrder.shipType):'0'}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400112/*发货方*/)}</label>
	                        <ConstMiniSelect form={this.props.form} isRequest={Boolean(getFieldValue("vndBeId", {}).vndBeId)}
							refreshMark={getFieldValue("vndBeId", PurOrder).vndBeId}
								pbj={{apiType: apiGet, host: API_FOODING_DS, uri: '/partner/getListBySourceId',
	                                 params: {isAddSelf:true,sourceId:getFieldValue("vndBeId", PurOrder).vndBeId,dataTyId:40}
	                             }} fieldName="sendBeId"
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.enterpriseId} objValue={{
	                                  sendBeId: da.enterpriseId,
	                                 sendBeLcName: da.enterpriseLcName,
	                                 sendBeEnName: da.enterpriseEnName,
	                                 s_label: da.enterpriseLcName
	                             }}>{da.enterpriseLcName}</Option>} reles={true}
	                             initialValue={xt.initSelectValue(PurOrder.sendBeId && getFieldValue("vndBeId", {}).vndBeId, PurOrder, ['sendBeId', 'sendBeLcName', 'sendBeEnName'], 'sendBeLcName', this.props.form)}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100547/*地址类型*/)}</label>
							<ConstMiniSelect form={this.props.form} pbj='com.fooding.fc.enumeration.ArrPlaceType' fieldName="arrPlaceType"
	                             initValueOptions={PurOrder.arrPlaceType?[{id:String(PurOrder.arrPlaceType),name:PurOrder.arrPlaceTypeName,localName:PurOrder.arrPlaceTypeName}]:[{id:'10',name:i18n.t(100155/*港口*/),localName:i18n.t(100155/*港口*/)}]}
	                             reles={true}
	                             initialValue={ String(PurOrder.arrPlaceType || 10)}
	                             props={{defaultActiveFirstOption:true}}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
                        {
                    		(getFieldValue('arrPlaceType', PurOrder.arrPlaceType) != 20)?                 
                    			<div className="form-group col-md-3 col-lg-3"  key={1}>
                    				<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400014/*送达港口*/)}</label>
                    				<ConstMiniSelect form={this.props.form}
                    					pbj='com.fooding.fc.ds.entity.Statn'
										 fieldName="statnId"
			                             initValueOptions={[]}
			                             optionValue={da => <Option key={da.id} objValue={{
			                                  statnId: da.id,
			                                 statnLcName: da.localName,
			                                 statnEnName: da.name,
			                                 s_label: da.localName
			                             }} >{da.localName}</Option>} reles={true}
			                             initialValue={xt.initSelectValue(PurOrder.statnId, PurOrder, ['statnId', 'statnLcName', 'statnEnName'], 'statnLcName', this.props.form)}
			                             props={{defaultActiveFirstOption:true}}
			                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
			                        />
			                    </div>
                    			:
                    			<div className="form-group col-md-3 col-lg-3" key={2}>
                    				<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400038/*送达仓库*/)}</label>
                    				<ConstMiniSelect form={this.props.form} 
                    					pbj='com.fooding.fc.ds.entity.StorLocatn'
										 fieldName="receSlId"
			                             initValueOptions={[]}
			                             optionValue={da => <Option key={da.id} objValue={{
			                                  receSlId: da.id,
			                                 receSlLcName: da.localName,
			                                 receSlEnName: da.name,
			                                 s_label: da.localName
			                             }} >{da.localName}</Option>} reles={true}
			                             initialValue={xt.initSelectValue(PurOrder.receSlId, PurOrder, ['receSlId', 'receSlLcName', 'receSlEnName'], 'receSlLcName', this.props.form)}
			                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
			                        />
			                    </div>	
                        }
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{I18n.t(500087/*装运要求*/)}</label>
							<textarea className={'textarea col-md-10 col-lg-10'} {...getFieldProps('shipmentReq', {
                                initialValue:PurOrder.shipmentReq?PurOrder.shipmentReq:''
                            })}></textarea>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{I18n.t(400114/*送达地址*/)}</label>
							<textarea className={'textarea col-md-10 col-lg-10'} {...getFieldProps('receAdress', {
                                initialValue:PurOrder.receAdress?PurOrder.receAdress:''
                            })}></textarea>
						</div>
					</div>
				</div>
			</div>)
		}
		return(<div>{dom}</div>);
	}
}

export default  ProviderInformationAdd;
