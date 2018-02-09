import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import RightKey from '../../../../components/RightKey/RightKey';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, {Option, ConstMiniSelect, ConstVirtualSelect} from '../../../../components/Select';
import Calendar from  '../../../../components/Calendar/Calendar';
import Checkbox from '../../../../components/CheckBox';
import Radio from "../../../../components/Radio";
import {apiGet, apiPost, apiForm, API_FOODING_ERP, API_FOODING_DS, language} from '../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
import xt from '../../../../common/xt';
import {I18n } from '../../../../lib/i18n';
//引入table
const {Table} = require("../../../../components/Table");	
export class  SendInquiryAddDialog extends Component{
	constructor(props){
		super(props); 
    }
	render(){

		let that = this;
        const {getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;
        const {data, otherData, form} = this.props;
        let record = data.number === 1 ? {} : data.record;
         getFieldProps('update_data', {
            initialValue: xt.initLabelValue(record.billDtlId, record, ['billDtlId', 'optlock'])
        });
		let content;
		if(data.name.title == i18n.t(500078/*证书要求*/) && data.number != 3){
				content = (
					<div className="girdlayout">
		       			<div className={'row'}>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(500078/*证书要求*/)}</label>
                                <ConstMiniSelect form={this.props.form} initRequest
                                                 pbj={{
                                                     apiType: apiGet, uri: '/certfct/getList',
                                                 }} fieldName="cardId"
                                                 initialValue={xt.initSelectValue(record.cardId, record, ['cardId', 'cardLcName','cardEnName'], 'cardLcName', form) }
                                                 optionValue={da => <Option key={da.id} objValue={{
                                                     cardId: da.id,
                                                     cardLcName: da.localName,
                                                     cardEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles={true}
                                />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<div className={'col-md-8 col-lg-8'}>
                                    <Checkbox style={{marginRight:10}}
                                        {...getFieldProps('gentMark',{
                                            initialValue:record.gentMark
                                        })}
                                        checked={form.getFieldValue("gentMark")}
                                    />
						            <label>{I18n.t(500071/*是否加急*/)}</label>
                                    <Checkbox style={{marginRight:10}}
                                              {...getFieldProps('origMark',{
                                                  initialValue: record.origMark
                                              })}
                                              checked={form.getFieldValue("origMark")}
                                    />
						             <label>{I18n.t(500072/*是否正本*/)}</label>
								</div>
							</div>
						</div>									
				   </div>
		        );
		}else if(data.name.title == i18n.t(100512/*船公司要求*/) && data.number != 3){
				content = (
					<div className="girdlayout">
		       			<div className={'row'}>
                            <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(500075/*指定/禁止*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form} initRequest
                                responseName="data.pickTypes"
                                apiUri="/tradruleTransbe/getInit"
                                fieldName="spickType"
                                initialValue={String(record.spickType || '')}
                                className='col-xs-3 col-md-3'
                                rules
                            />
                        </div>
							<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(500076/*船公司*/)}</label>
                                <ConstMiniSelect form={this.props.form} initRequest
                                                 pbj={{
                                                     params: {
                                                        "obj":"com.fooding.fc.ds.entity.Carrier",
                                                        "prettyMark":true
                                                    }
                                                 }} fieldName="shipBeId"
                                                 initialValue={xt.initSelectValue(record.shipBeId, record, ['shipBeId', 'shipBeLcName','shipBeEnName'], 'shipBeLcName', form) }
                                                 optionValue={da => <Option key={da.id} objValue={{
                                                     shipBeId: da.id,
                                                     shipBeLcName: da.localName,
                                                     shipBeEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles={true}
                                 className='col-xs-8 col-md-8'
                                />
							</div>
						</div>									
				   </div>
		        );
		}else if(data.name.title == i18n.t(500079/*检验要求*/) && data.number != 3){
			content = (
				<div className="girdlayout">
	       			<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(500061/*产品名称*/)}</label>
                            
                            <ConstMiniSelect form={this.props.form}
                                                             pbj={{// /nooorder/mtl/getList replace /inquiryorder/mtl/getList
                                                                 apiType: apiGet, host: API_FOODING_ERP, uri:'/inquiryorder/mtl/getList',
                                                                 params: {billId:this.props.otherData.billId}
                                                             }} fieldName="mtlId"
                                                             initValueOptions={[]}
                                                             initialValue={
                                                                xt.initSelectValue(record["mtl"+language], record, ['mtlId', 'mtlLcName ', 'mtlEnName'], "mtl"+language, this.props.form)}
                                                             optionValue={(da, di) => <Option key={di} objValue={{
                                                                 mtlId: da.mtlId,
                                                                 mtlLcName: da.mtlLcName,
                                                                 mtlEnName: da.mtlTyEnName,
                                                                 s_label: da["mtl"+language]
                                                             }}>{da["mtl"+language]}</Option>} reles ={true}
                                                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
                                                    />
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(500073/*测试项目*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                             pbj={{
                                                 apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                 params: {obj:'com.fooding.fc.ds.entity.TestItem'}
                                             }} fieldName="testItmId"
                                             initialValue={
                                                 xt.initSelectValue(record.testItmId, record, ['testItmId', 'testItmLcName', 'testItmEnName'], "testItm"+language, form)}
                                             optionValue={(da, di) => <Option key={di} objValue={{
                                                 testItmId: da.id,
                                                 testItmLcName: da.localName,
                                                 testItmEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>} reles ={true}
                                             className ={'col-md-8 col-lg-8'}
                            />
						</div>
                        </div>
                        <div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100606/*测试方法*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                             pbj={{
                                                 apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                 params: {obj:'com.fooding.fc.ds.entity.TestMeth'}
                                             }} fieldName="testMethId"
                                             initialValue={
                                                 xt.initSelectValue(record.testMethId, record, ['testMethId', 'testMethLcName', 'testMethEnName'], "testMeth"+language, this.props.form)}
                                             optionValue={(da, di) => <Option key={di} objValue={{
                                                 testMethId: da.id,
                                                 testMethLcName: da.localName,
                                                 testMethEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>} reles ={true}
                                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
						</div>
					</div>									
			   </div>
	        );
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.props.onCancel} width={976} showSaveAdd={false}>
						{content}		
				</FormWrapper>
			</div>
			);
	}
	onSaveAndClose = ()=> {
	    this.props.onSaveAndClose(this.props.form);
    }
}
SendInquiryAddDialog.propTypes ={
	onSaveAdd:PropTypes.func,
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
};
SendInquiryAddDialog.defaultProps ={
	onSaveAdd(){},
	onSaveAndClose(){},
    onCancel(){}
};

export default createForm()(SendInquiryAddDialog);
