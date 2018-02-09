import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Checkbox from "../../../../components/CheckBox";
import Select, {Option,ConstMiniSelect} from '../../../../components/Select';
import {createForm,FormWrapper} from '../../../../components/Form';
import  SelectChange from "../../../../components/SelectChange";
import DataTime from '../../../../components/Calendar/Calendar';
import xt from '../../../../common/xt';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP} from '../../../../services/apiCall';
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
		let beField = getNFieldProps('transId',{
										rules: [{required:true}],
										initialValue:getOne["trans"+language]?{s_label:getOne["trans"+language],transId:getOne.transId,transLcName:getOne.transLcName,transEnName:getOne.transEnName}:undefined
									 });
		let beFieldValue = getFieldValue("transId") || {};
		return(
			<div className={'addnormal'} style={{marginTop:'10px',marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(500087/*装运要求*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100224/*运输方式*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.enumeration.TransportType'}
                                                 }} fieldName="transId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["trans"+language]?{s_label:getOne["trans"+language],transId:getOne.transId,transLcName:getOne.transLcName,transEnName:getOne.transEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     transId: da.id,
                                                     transLcName: da.name,
                                                     transEnName: da.name,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>} reles ={true}
                                                 className ={getFieldError('transId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500090/*可否转运*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								 <Checkbox
								        style={{lineHeight:'32px'}}
										{...getFieldProps('canTransportMark',{
											initialValue:getOne.canTransportMark?getOne.canTransportMark:false
										})}
										checked={this.props.form.getFieldValue("canTransportMark")}
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200725/*免舱期申请*/)}</label>
							<input type='text' 
								className={'col-md-8 col-lg-8 text-input-nowidth'}
								{...getFieldProps('frStorAgeApp',{
									initialValue:getOne.frStorAgeApp?getOne.frStorAgeApp:false
								})}
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500088/*装箱类型*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.enumeration.PackType'}
                                                 }} fieldName="packType"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["packTypeName"], getOne, ['packType', 'packTypeName'], 'packTypeName', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     packType: da.id,
                                                     packTypeName: da.name,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>}
                                                 className ={getFieldError('packType')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100297/*起运港*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( beFieldValue.transId)}
                                                 refreshMark={beFieldValue.transId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Statn',queryParams:[{attr:"statnTyId",expression:"=",value:beFieldValue.transId}]}
                                                 }} fieldName="sStatnId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["sStatn"+language]?{s_label:getOne["sStatn"+language],sStatnId:getOne.sStatnId,sStatnLcName:getOne.sStatnLcName,sStatnEnName:getOne.sStatnEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     sStatnId: da.id,
                                                     sStatnLcName: da.localName,
                                                     sStatnEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles ={true}
                                                 className ={getFieldError('sStatnId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200332/*紧急程度*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.enumeration.UrgencyType'}
                                                 }} fieldName="urgencyType"
                                                 initValueOptions={[]}
                                                 initialValue={getOne.urgencyType?{s_label:getOne.urgencyTypeName,urgencyType:getOne.urgencyType}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     urgencyType: da.id,
                                                     urgencyTypeName: da.name,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>}
                                                 className ={getFieldError('urgencyType')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500089/*要求装运日*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									showTime={false}
									isShowIcon={true}
									validate={true}
									width={'100%'}
									value={getOne.ariveDate}
									form={this.props.form} 
									name={'ariveDate'}
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100298/*目的港*/)}</label>	
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( beFieldValue.transId)}
                                                 refreshMark={beFieldValue.transId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Statn',queryParams:[{attr:"statnTyId",expression:"=",value:beFieldValue.transId}]}
                                                 }} fieldName="eStatnId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["eStatn"+language]?{s_label:getOne["eStatn"+language],eStatnId:getOne.eStatnId,eStatnLcName:getOne.eStatnLcName,eStatnEnName:getOne.eStatnEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     eStatnId: da.id,
                                                     eStatnLcName: da.localName,
                                                     eStatnEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}  reles ={true}
                                                 className ={getFieldError('eStatnId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500092/*提单方式*/)}</label>
							<Select 
									{...getNFieldProps('billLadType',{
										initialValue:getOne.billLadType?{s_label:(getOne.billLadType=='10'?i18n.t(200726/*正本*/):i18n.t(200727/*电放*/)),billLadType:getOne.billLadType}:undefined
									 })}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"							
									className ={'currency-btn select-from-currency col-md-8 col-lg-8 '}							
								>
								<Option value={'10'}>{i18n.t(200726/*正本*/)}</Option>	
								<Option value={'20'}>{i18n.t(200727/*电放*/)}</Option>	
							</Select>
						</div>
						<div className="form-group col-md-9 col-lg-9">
								<label className={'col-md-2 col-lg-2'}>{i18n.t(200363/*仓储装箱要求*/)}</label>
								<textarea
									{...getFieldProps('stPackReq',{
										initialValue:getOne.stPackReq?getOne.stPackReq:''
									 })}
									placeholder=""
									className={'col-md-10 col-lg-10 text-input-nowidth currency-btn select-from-currency'}
									style={{resize:'none'}}
								>
								</textarea>
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(200364/*拍照要求*/)}</label>
							<textarea
								placeholder=""
								{...getFieldProps('photoReq',{
										initialValue:getOne.photoReq?getOne.photoReq:''
							    })}
								className={'col-md-10 col-lg-10 text-input-nowidth'}
								style={{resize:'none',height:'65px'}}
							>
							</textarea>
						</div>
						<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-2 col-lg-2'}>{i18n.t(100336/*备注*/)}</label>
								<textarea
									placeholder=""
									{...getFieldProps('note',{
											initialValue:getOne.note?getOne.note:''
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
