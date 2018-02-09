import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import DataTime from  '../../../../components/Calendar/Calendar';
import Input from '../../../../components/FormValidating/FormValidating';
import WebData from '../../../../common/WebData';

// common
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, {Option,ConstMiniSelect} from '../../../../components/Select'; // 下拉
import xt from '../../../../common/xt'; // 下拉
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax} from '../../../../services/apiCall';
export class Productplug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				let {getOne} = this.props;
				let obj = Object.assign({},getOne,value);
				apiPost(API_FOODING_ERP,'/shipping/complete',obj,(response)=>{
					    this.props.onCancel();
					    this.props.onPackUp();
						ServiceTips({text:response.message,type:'sucess'});
				},(error)=>{

				});

			}
		})
	}
	onCancel(){
		const {form, onCancel} = this.props;
		this.props.onCancel();
		this.props.form.resetFields();
	}
	onClick(){

	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps,getFieldValue} = this.props.form;
		let {getOne} = this.props;
		let content = <div></div>;
			content = (
           	<div className={'addnormal scroll'} style={{marginBottom:'10px',height:'300px',overflowY:'auto'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 '}>{i18n.t(200381/*订舱日期*/)}</label>
								<div className={'col-md-9  datetime'}>
									<DataTime
										showTime={false}
										isShowIcon={true}
										width={'100%'}
										form={this.props.form}
										className ={getFieldError('bookingDate')?'error-border':''}
										validate={false}
										value={getOne.bookingDate}
										name={'bookingDate'}
									/>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3'}>{i18n.t(200353/*截单日期*/)}</label>
								<div className={'col-md-9  datetime'}>
									<DataTime
										showTime={false}
										isShowIcon={true}
										width={'100%'}
										form={this.props.form}
										className ={getFieldError('cutoffDate')?'error-border':''}
										name={'cutoffDate'}
										validate={false}
										value={getOne.cutoffDate}
									/>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 '}>{i18n.t(200356/*报关日期*/)}</label>
								<div className={'col-md-9  datetime'}>
									<DataTime
										showTime={false}
										isShowIcon={true}
										width={'100%'}
										form={this.props.form}
										className ={getFieldError('declareDate')?'error-border':''}
										validate={false}
										name={'declareDate'}
										value={getOne.declareDate}
									/>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 '}>{i18n.t(200357/*截关/港日期*/)}</label>
								<div className={'col-md-9  datetime'}>
									<DataTime
										showTime={false}
										isShowIcon={true}
										width={'100%'}
										form={this.props.form}
										className ={getFieldError('closingDate')?'error-border':''}
										name={'closingDate'}
										validate={false}
										value={getOne.closingDate}
									/>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 '}>{i18n.t(200382/*预计开船日期*/)}</label>
								<div className={'col-md-9  datetime'}>
									<DataTime
										showTime={false}
										isShowIcon={true}
										width={'100%'}
										form={this.props.form}
										className ={getFieldError('predictSailingDate')?'error-border':''}
										validate={false}
										name={'predictSailingDate'}
										value={getOne.predictSailingDate}
									/>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 '}>{i18n.t(200360/*预计到港日*/)}</label>
								<div className={'col-md-9  datetime'}>
									<DataTime
										showTime={false}
										isShowIcon={true}
										width={'100%'}
										form={this.props.form}
										className ={getFieldError('predictArrivalDate')?'error-border':''}
										name={'predictArrivalDate'}
										validate={false}
										value={getOne.predictArrivalDate}
									/>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 '}>{i18n.t(200361/*实际开船日*/)}</label>
								<div className={'col-md-9  datetime'}>
									<DataTime
										showTime={false}
										isShowIcon={true}
										width={'100%'}
										form={this.props.form}
										className ={getFieldError('actSailingDate')?'error-border':''}
										validate={false}
										name={'actSailingDate'}
										value={getOne.actSailingDate}
									/>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 '}>{i18n.t(200362/*实际到港日*/)}</label>
								<div className={'col-md-9  datetime'}>
									<DataTime
										showTime={false}
										isShowIcon={true}
										width={'100%'}
										form={this.props.form}
										className ={getFieldError('actArrivalDate')?'error-border':''}
										name={'actArrivalDate'}
										validate={false}
										value={getOne.actArrivalDate}
									/>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 '}>{i18n.t(200383/*提单号*/)}</label>
								<input type='text' className={'col-xs-9 col-md-9 text-input-nowidth'}
														placeholder=""
														{...getFieldProps('ladingBillNo',{
															initialValue:getOne.ladingBillNo?getOne.ladingBillNo:''
														})}
								/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3'}>{i18n.t(200384/*船名航次*/)}</label>
								<input type='text' className={'col-xs-9 col-md-9 text-input-nowidth'}
														placeholder=""
														{...getFieldProps('voyageNum',{
															initialValue:getOne.voyageNum?getOne.voyageNum:''
														})}
								/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 '}>{i18n.t(200351/*集装箱号*/)}</label>
								<input type='text' className={'col-xs-9 col-md-9 text-input-nowidth'}
														placeholder=""
														{...getFieldProps('containerNo',{
															initialValue:getOne.containerNo?getOne.containerNo:''
														})}
								/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 '}>{i18n.t(200352/*集装箱数量*/)}</label>
								<input type='text' className={'col-xs-9 col-md-9 text-input-nowidth'}
														placeholder=""
														{...getFieldProps('containerNums',{
															initialValue:getOne.containerNums?getOne.containerNums:''
														})}
								/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 '}>{i18n.t(100299/*货代公司*/)}</label>
									<ConstMiniSelect form={this.props.form}
										refreshMark = {String( 1000)}
                                     	pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.AgnShipBe'}
                                          }} fieldName="forwarderBeId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["forwarderBe"+language], getOne, ['forwarderBeId', 'forwarderBeLcName', 'forwarderBeEnName'], "forwarderBe"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     forwarderBeId: da.id,
                                                     forwarderBeLcName: da.localName,
                                                     forwarderBeEnName: da.name,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={'currency-btn select-from-currency col-md-9 '}
                            />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 '}>{i18n.t(200343/*货运公司*/)}</label>
								<ConstMiniSelect form={this.props.form}
                                     pbj={{
													apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
													params: {
														"obj":"com.fooding.fc.ds.entity.Carrier",
														"prettyMark":true
													}
                                          }} fieldName="transportBeId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["transportBe"+language], getOne, ['transportBeId', 'transportBeLcName', 'transportBeEnName'], "transportBe"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     transportBeId: da.id,
                                                     transportBeLcName: da.localName,
                                                     transportBeEnName: da.enName,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={'currency-btn select-from-currency col-md-9 '}
                            />
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 '}>{i18n.t(200345/*货代联系人*/)}</label>
								<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue('forwarderBeId', {}).forwarderBeId)}
                                                 refreshMark={getFieldValue('forwarderBeId', {}).forwarderBeId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.EntprisContact',queryParams:[{attr:"enterprise.id",expression:"=",value:getFieldValue('forwarderBeId', {}).forwarderBeId}]}
                                                 }} fieldName="linkerId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["linker"+language]&& getFieldValue('forwarderBeId', getOne).forwarderBeId==getOne.forwarderBeId, getOne, ['linkerId', 'linkerLcName', 'linkerEnName'], "linker"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     linkerId: da.id,
                                                     linkerLcName: da.localName,
                                                     linkerEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={'currency-btn select-from-currency col-md-9'}
                                />
							</div>
						</div>
					</div>
			</div>
           	);

           	return (
					<div className="package-action-buttons">
							<FormWrapper showFooter={true}
							onSaveAndClose={this.onSaveAndClose.bind(this)} onCancel={this.onCancel}
							>
								{content}
							</FormWrapper>
					</div>
				)
		}
}
const ProductForm =createForm()(Productplug);
export default ProductForm;
