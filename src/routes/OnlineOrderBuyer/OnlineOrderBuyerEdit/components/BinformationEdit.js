import React, {Component} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";

import Select, {Option, ConstMiniSelect} from '../../../../components/Select';
import Radio from "../../../../components/Radio";
import DataTime from '../../../../components/Calendar/Calendar';
import xt from './../../../../common/xt';
import {apiGet, apiPost, apiForm, language, API_FOODING_ERP, API_FOODING_DS, API_FOODING_ES} from '../../../../services/apiCall';
import {I18n} from '../../../../lib/i18n';
export default class NormlEdit extends Component {
    constructor(props){
        super(props)
        this.shouhuoqyChange = this.shouhuoqyChange.bind(this);
        this.clientSelect = this.clientSelect.bind(this);
    }
    initState(){
        return {
            radioState:'',
            radioAddress:''
        }
    }
    clientSelect(e,item){
        let that = this;
        let businessOne = this.props.businessOne;
        businessOne = Object.assign({},businessOne,e);
        that.props.setGetOne(businessOne);
    }
    shouhuoqyChange(e,item){
        let that = this;
        let businessOne = this.props.businessOne;
        businessOne = Object.assign({},businessOne,e);
        that.props.setGetOne(businessOne);
    }
    render() {
        const {backClick, releseClick, confirmClick, saveClick, form} = this.props;
        const {getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;
        const {businessOne} = this.props;
        let adress = this.props.businessOne.addressList ||[];
        let phone = this.props.businessOne.phoneList || [];
            console.log(getFieldValue('revBusinessId', {}).revBusinessId)
        return (<div className={'addnormal'} style={{marginBottom: '10px'}}>
            <div className={'addnormal-title'}>
                <span>{I18n.t(500041/*买方信息*/)}</span>
            </div>
            <div className={'  girdlayout'}>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500035/*买方企业*/)}</label>
                        <ConstMiniSelect form={this.props.form}
                                         pbj={{
                                             apiType: apiGet, host: API_FOODING_ES, uri: '/party/getLoginCompanies',
                                            
                                         }} fieldName="salBeId"
                                         initialValue={xt.initSelectValue(businessOne.salBeId, businessOne,
                                             ['salBeId', 'salBeLcName', 'salBeEnName'], 'salBe'+language, form)}
                                         optionValue={(da, di) => <Option key={di} objValue={{
                                             salBeId: da.id,
                                             salBeLcName: da.localName,
                                             salBeEnName: da.name,
                                             s_label: da.localName
                                         }}>{da.localName}</Option>}
                                         reles={true}
                                         onSelect ={this.clientSelect}
                                          className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{I18n.t(500042/*买方部门*/)}</label>
                       <ConstMiniSelect form={this.props.form}
                                        isRequest={ Boolean(getFieldValue('salBeId', {}).salBeId)}
                                         refreshMark={getFieldValue('salBeId', {}).salBeId }
                                         pbj={{
                                             apiType: apiGet, host: API_FOODING_ES, uri: '/party/getLoginDepartments',
                                             params: {ccid: getFieldValue('salBeId', {}).salBeId}
                                            
                                         }} fieldName="buyerDepId"
                                         initialValue={xt.initSelectValue(businessOne.buyerDepId, businessOne ,
                                             ['buyerDepId', 'buyerDepLcName', 'buyerDepEnName'], 'buyerDep'+language, form)}
                                         optionValue={(da, di) => <Option key={di} objValue={{
                                             buyerDepId: da.id,
                                             buyerDepLcName: da.localName,
                                             buyerDepEnName: da.name,
                                             s_label: da.localName
                                         }}>{da.localName}</Option>}
                                          allowClear
                                           className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{I18n.t(500043/*买方联系人*/)}</label>
                         <ConstMiniSelect form={this.props.form}
                                        isRequest={ Boolean(getFieldValue('buyerDepId', {}).buyerDepId)}
                                         refreshMark={getFieldValue('buyerDepId', {}).buyerDepId}
                                         pbj={{
                                             apiType: apiGet, host: API_FOODING_ES, uri: '/user/getListForPermissionsInParty',
                                             params: {partyId: getFieldValue('buyerDepId', {}).buyerDepId}
                                            
                                         }} fieldName="buyerlinkId"
                                         initialValue={xt.initSelectValue(businessOne.buyerlinkId, businessOne ,
                                             ['buyerlinkId', 'buyerlinkLcName', 'buyerlinkEnName'], 'buyerlink'+language, form)}
                                         optionValue={(da, di) => <Option key={di} objValue={{
                                             buyerlinkId: da.id,
                                             buyerlinkLcName: da.staffLocalName,
                                             buyerlinkEnName: da.staffEnName,
                                             s_label: da.staffLocalName
                                         }}>{da.staffLocalName}</Option>}
                                          allowClear
                                           className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{I18n.t(500044/*联系电话*/)}</label>
                        <input  type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                               {...getFieldProps('buyerLinkTel', {
                                  initialValue: String(businessOne.buyerLinkTel || ''),
                               })}
                        />
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500045/*收货企业*/)}</label>
                        <ConstMiniSelect form={this.props.form} 
                                        isRequest={ Boolean(getFieldValue('salBeId', {}).salBeId)}
                                         refreshMark={getFieldValue('salBeId', {}).salBeId }
                                         pbj={{
                                             apiType: apiGet, host: API_FOODING_DS, uri: '/partner/getListBySourceId',
                                             params: {sourceId:getFieldValue('salBeId', {}).salBeId,dataTyId:[60],isAddSelf:true}
                                            
                                         }} fieldName="revBusinessId"
                                         initialValue={xt.initSelectValue(businessOne.revBusinessLcName, businessOne,
                                             ['revBusinessId', 'revBusinessLcName', 'revBusinessEnName'], 'revBusiness'+language, form)}
                                         optionValue={(da, di) => <Option key={di} objValue={{
                                             revBusinessId: da.enterpriseId,
                                             revBusinessLcName: da.enterpriseLcName,
                                             revBusinessEnName: da.enterpriseEnName,
                                             s_label: da.enterpriseLcName,
                                             reclinkId: da.entContactorId,
                                             reclinkLcName: da.entContactorLcName,
                                             reclinkEnName: da.entContactorEnName,
                                             recTel:da.phone,
                                             recFax:da.fax,
                                             recAddress:da.address,
                                             recAddressList:da.addressList,
                                             reclinkList:da.phoneList
                                         }}>{da.enterpriseLcName}</Option>}
                                         reles={true}
                                        onChange = {this.shouhuoqyChange}
                                         className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500046/*收货联系人*/)}</label>
                        <ConstMiniSelect form={this.props.form}
                                        isRequest={ Boolean(getFieldValue('revBusinessId', {}).revBusinessId)}
                                         refreshMark={getFieldValue('revBusinessId', {}).revBusinessId }
                                         pbj={{
                                             apiType: apiGet, host: API_FOODING_ES, uri: '/user/getListForPermissionsInParty',
                                             params: {partyId:getFieldValue('revBusinessId', {}).revBusinessId}
                                            
                                         }} fieldName="reclinkId"
                                         initialValue={xt.initSelectValue(businessOne.reclinkLcName, businessOne ,
                                             ['reclinkId', 'reclinkLcName', 'reclinkEnName'], 'reclink'+language, form)}
                                         optionValue={(da, di) => <Option key={di} objValue={{
                                             reclinkId: da.id,
                                             reclinkLcName: da.staffLocalName,
                                             reclinkEnName: da.staffName,
                                             s_label: da.staffName,

                                         }}>{da.staffLocalName}</Option>}
                                          className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{I18n.t(500047/*收货电话*/)}</label>
                        <input  type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                               {...getFieldProps('recTel', {
                                  initialValue: String(businessOne.recTel || ''),
                               })}
                        />
                    </div>
                     <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{I18n.t(500048/*收货传真*/)}</label>
                        <input  type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                               {...getFieldProps('recFax', {
                                  initialValue: String(businessOne.recFax || ''),
                               })}
                        />
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-6 col-lg-6">
                        <label className={'col-md-2 col-lg-2'}><span>*</span>{I18n.t(500049/*收货地址*/)}</label>
                        <Select
                                {...getFieldProps('recAddress', {
                                        rules: [{required:true}],
                                        initialValue:businessOne["recAddress"]?businessOne["recAddress"]:undefined
                                })} 
                                combobox
                               
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                notFoundContent=""
                                filterOption={false}
                                className={getFieldError('recAddress')?'col-md-10 col-lg-10 text-input-nowidth error-border':'col-md-10 col-lg-10 text-input-nowidth'}
                            >
                                {adress.map((e,i)=>{
                                    return <Option key={i} value ={e}>{e}</Option>
                                })}
                        </Select>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500050/*付款企业*/)}</label>
                        <ConstMiniSelect form={this.props.form}
                                                 isRequest={ Boolean(getFieldValue('salBeId', {}).salBeId)}
                                                 refreshMark={getFieldValue('salBeId', {}).salBeId }
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/partner/getListBySourceId',
                                                     params: {sourceId:getFieldValue('salBeId', {}).salBeId,dataTyId:[60]}
                                                 }} fieldName="payBusinessId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                    xt.initSelectValue(businessOne["payBusiness"+language], businessOne, ['payBusinessId', 'payBusinessLcName', 'payBusinessEnName'], "payBusiness"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     payBusinessId: da.enterpriseId,
                                                     payBusinessLcName: da.enterpriseLcName,
                                                     payBusinessEnName: da.enterpriseEnName,
                                                     s_label: da.enterpriseLcName
                                                 }}>{da.enterpriseLcName}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                           
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500095/*通知企业*/)}</label>
                        <ConstMiniSelect form={this.props.form} 
                                        isRequest={ Boolean(getFieldValue('salBeId', {}).salBeId)}
                                         refreshMark={getFieldValue('salBeId', {}).salBeId }
                                         pbj={{
                                             apiType: apiGet, host: API_FOODING_DS, uri: '/partner/getListBySourceId',
                                             params: {sourceId:getFieldValue('salBeId', {}).salBeId,dataTyId:[60]}
                                            
                                         }} fieldName="noticeBusinessId"
                                         initialValue={xt.initSelectValue(businessOne["noticeBusiness"+language], businessOne, ['noticeBusinessId', 'noticeBusinessLcName', 'noticeBusinessEnName'],"noticeBusiness"+language, this.props.form)}
                                         optionValue={(da, di) => <Option key={di} objValue={{
                                                     noticeBusinessId: da.enterpriseId,
                                                     noticeBusinessLcName: da.enterpriseLcName,
                                                     noticeBusinessEnName: da.enterpriseEnName,
                                                     s_label: da.enterpriseLcName,
                                                     noticeLinkId:da.entContactorId,
                                                     noticeLinkLcName:da.entContactorLcName,
                                                     noticeLinkEnName:da.entContactorEnName,
                                                     noticeTel:da.phone,
                                                     noticeFax:da.fax,
                                                     noticeAdd:da.address,
                                                     noticeAddressList:da.addressList,
                                                     noticeLinkList:da.phoneList
                                         }}>{da.enterpriseLcName}</Option>}
                                         reles={true}
                                        onChange = {this.shouhuoqyChange}
                                        className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                        />
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500054/*通知联系人*/)}</label>
                        <ConstMiniSelect form={this.props.form}
                                        isRequest={ Boolean(getFieldValue('revBusinessId', {}).revBusinessId)}
                                         refreshMark={getFieldValue('revBusinessId', {}).revBusinessId }
                                         pbj={{
                                             apiType: apiGet, host: API_FOODING_ES, uri: '/user/getListForPermissionsInParty',
                                             params: {partyId:getFieldValue('revBusinessId', {}).revBusinessId}
                                            
                                         }} fieldName="noticeLinkId"
                                         initialValue={xt.initSelectValue(businessOne.noticeLinkLcName, businessOne ,
                                             ['noticeLinkId', 'noticeLinkLcName', 'noticeLinkEnName'], 'noticeLink'+language, form)}
                                         optionValue={(da, di) => <Option key={di} objValue={{
                                             noticeLinkId: da.id,
                                             noticeLinkLcName: da.staffLocalName,
                                             noticeLinkEnName: da.staffName,
                                             s_label: da.staffName,

                                         }}>{da.staffLocalName}</Option>}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500055/*通知电话*/)}</label>
                         <Select
                                {...getFieldProps('noticeTel', {
                                        rules: [{required:true}],
                                        initialValue:businessOne["noticeTel"]?businessOne["noticeTel"]:undefined
                                })} 
                                combobox
                                
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                notFoundContent=""
                                filterOption={false}
                                className={getFieldError('noticeTel')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
                            >
                                {phone.map((e,i)=>{
                                    return <Option key={i} value={e}>{e}</Option>
                                })}
                            </Select>
                    </div>
                    <div className="form-group col-md-6 col-lg-6">
                        <label className={'col-md-2 col-lg-2'}><span>*</span>{I18n.t(500056/*通知地址*/)}</label>
                        <Select
                                {...getFieldProps('noticeAdd', {
                                        rules: [{required:true}],
                                        initialValue:businessOne["noticeAdd"]?businessOne["noticeAdd"]:undefined
                                })} 
                                combobox
                                
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                notFoundContent=""
                                filterOption={false}
                                className={getFieldError('noticeAdd')?'col-md-10 col-lg-10 text-input-nowidth error-border':'col-md-10 col-lg-10 text-input-nowidth'}
                            >
                                {adress.map((e,i)=>{
                                    return <Option key={i} value={e}>{e}</Option>
                                })}
                            </Select>
                    </div>
                </div>
                 <div className={'row'}>
                     <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-2 col-lg-2'}>{I18n.t(500051/*撤单原因*/)}</label>
                            <input  type="text" className={'col-md-10 col-lg-10 text-input-nowidth'}
                                   {...getFieldProps('cancelReason', {
                                      initialValue: String(businessOne.cancelReason || ''),
                                   })}
                            />
                     </div>
                     <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-2 col-lg-2'}>{I18n.t(100336/*备注*/)}</label>
                            <input  type="text" className={'col-md-10 col-lg-10 text-input-nowidth'}
                                   {...getFieldProps('buyerNote', {
                                      initialValue: String(businessOne.buyerNote || ''),
                                   })}
                            />
                     </div>
                 </div>
            </div>
        </div>)
    }
}
