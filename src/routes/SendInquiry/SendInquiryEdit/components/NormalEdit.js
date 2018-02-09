import React, {Component} from "react";

import Select, {ConstVirtualSelect, Option} from "../../../../components/Select";
import DataTime from "../../../../components/Calendar/Calendar";
import xt from "./../../../../common/xt";
import WebData from "../../../../common/WebData";
import {API_FOODING_ES, apiPost, language} from "../../../../services/apiCall";
import i18n from '../../../../lib/i18n';
export default class NormlEdit extends Component {
    render() {
        const {backClick, releseClick, confirmClick, saveClick, form} = this.props;
        const {getFieldProps, getFieldError, getNFieldProps, getFieldValue, getFieldErrorStyle, getNFieldValue} = this.props.form;
        const {businessOne} = this.props;

        return (<div className={'addnormal'} style={{marginBottom: '10px'}}>
            <div className={'addnormal-title'}>
                <span>{i18n.t(100138/*常规*/)}</span>
                <span onClick={backClick} title={i18n.t(100431/*返回*/)}><i className={'foddingicon fooding-back'}/></span>
                <span onClick={saveClick} title={i18n.t(100430/*保存*/)}><i className={'foddingicon fooding-save'}/></span>
            </div>
            <div className={'  girdlayout'}>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(500096/*询单编号*/)}</label>
                        <input disabled type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                               {...getFieldProps('no', {
                                   initialValue: String(businessOne.no || ''),
                               })}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(100288/*发布日期*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph'}>{i18n.t(100378/*自动生成*/)}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(200033/*询盘状态*/)}</label>
                        <div className={'col-md-8 col-lg-8'}>
                            <p className={'paragraph shengyue'}>{businessOne.statusName}</p>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100224/*运输方式*/)}</label>
                        <ConstVirtualSelect
                            apiType={apiPost}
                            form={this.props.form} apiParams='com.fooding.fc.enumeration.TransportType' fieldName="transId"
                            initialValue={
                                xt.initSelectValue(businessOne.transId, businessOne, ['transId', 'transLcName', 'transEnName'], "trans" + language, form)
                            }
                            valueKeys={da => ({
                                transId: da.id,
                                transLcName: da.name,
                                transEnName: da.name,
                                s_label: da.name
                            })} rules
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500088/*装箱类型*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            apiType={apiPost}
                            apiParams='com.fooding.fc.enumeration.PackType' fieldName="packType"
                            initialValue={
                                xt.initSelectValue(businessOne.packType, businessOne, ['packType', 'packTypeName'], 'packTypeName', form)}
                            valueKeys={da => ({
                                packType: da.id,
                                packTypeName: da.name,
                                s_label: da.name
                            })} rules
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100297/*起运港*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            isRequest={Boolean(getFieldValue('transId', {}).transId)}
                            refreshMark={getFieldValue('transId', {}).transId}
                            apiType={apiPost}
                            apiParams={{
                                obj: 'com.fooding.fc.ds.entity.Statn',
                                queryParams: [{
                                    attr: "statnTyId",
                                    expression: "=",
                                    value: getFieldValue('transId', {}).transId
                                }]
                            }}
                            fieldName="sStatnId"
                            initialValue={
                                xt.initSelectValue(businessOne.sStatnId && getFieldValue('transId', {}).transId === businessOne.transId,
                                    businessOne, ['sStatnId', 'sStatnLcName', 'sStatnEnName'], "sStatn" + language, form)
                            }
                            valueKeys={da => ({
                                sStatnId: da.id,
                                sStatnLcName: da.localName,
                                sStatnEnName: da.name,
                                s_label: da.localName
                            })} rules
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100298/*目的港*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            isRequest={Boolean(getFieldValue('transId', {}).transId)}
                            refreshMark={getFieldValue('transId', {}).transId}
                            apiType={apiPost}
                            apiParams={{
                                obj: 'com.fooding.fc.ds.entity.Statn',
                                queryParams: [{
                                    attr: "statnTyId",
                                    expression: "=",
                                    value: getFieldValue('transId', {}).transId
                                }]
                            }}
                            fieldName="eStatnId"
                            initialValue={
                                xt.initSelectValue(businessOne.eStatnId && getFieldValue('transId', {}).transId === businessOne.transId, businessOne,
                                    ['eStatnId', 'eStatnLcName', 'eStatnEnName'], "eStatn" + language, form)
                            }
                            valueKeys={da => ({
                                eStatnId: da.id,
                                eStatnLcName: da.localName,
                                eStatnEnName: da.name,
                                s_label: da.localName
                            })} rules
                        />
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200017/*有效期至*/)}</label>
                        <div className={'col-md-8 col-lg-8 datetime'}>
                            <DataTime
                                beginData={new Date()}
                                showTime={false}
                                isShowIcon={true}
                                width={'100%'}
                                validate={true}
                                form={this.props.form}
                                name={'validityDate'}
                                value={businessOne.validityDate}
                            />
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100376/*交易条款*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            apiType={apiPost}
                            apiParams={{
                                obj: 'com.fooding.fc.ds.entity.Incotm', queryParams: [{
                                    attr: 'incotmTyId',
                                    expression: '=',
                                    value: 10
                                }]
                            } }
                            fieldName="incotmId"
                            initialValue={
                                xt.initSelectValue(businessOne.incotmId, businessOne,
                                    ['incotmId', 'incotmLcName', 'incotmEnName'], "incotm" + language, form)
                            }
                            valueKeys={da => ({
                                incotmId: da.id,
                                incotmLcName: da.localName,
                                incotmEnName: da.name,
                                s_label: da.localName
                            })} rules
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100133/*支付条款*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            apiUri="/object/getList"
                            apiType={apiPost}
                            apiParams={{
                                obj: 'com.fooding.fc.ds.entity.PayTrm', queryParams: [{
                                    attr: 'corpTyId',
                                    expression: '=',
                                    value: 10
                                }]

                            }} fieldName="payTrmId"
                            initialValue={
                                xt.initSelectValue(businessOne.payTrmId, businessOne,
                                    ['payTrmId', 'payTrmLcName', 'payTrmEnName'], "payTrm" + language, form)
                            }
                            valueKeys={da => ({
                                payTrmId: da.id,
                                payTrmLcName: da.localName,
                                payTrmEnName: da.name,
                                s_label: da.localName,
                            })} rules
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100284/*币种*/)}</label>
                        <ConstVirtualSelect
                            apiType={apiPost}
                            form={this.props.form} apiParams='com.fooding.fc.ds.entity.Curren' fieldName="cnyId"
                            valueKeys={da => ({
                                cnyId: da.id, cnyLcName: da.localName, cnyEnName: da.name, s_label: da.localName
                            })} rules
                            initialValue={xt.initSelectValue(businessOne.cnyId, businessOne, ['cnyId', 'cnyLcName', 'cnyEnName'], 'cnyLcName', form)}
                        />
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500090/*可否转运*/)}</label>
                        <ConstVirtualSelect
                            isRequest={false}
                            form={this.props.form}
                            fieldName="canTransportMark"
                            initialValue={String(businessOne.canTransportMark ? businessOne.canTransportMark : false)}
                            rules
                            initValueOptions={[
                                {id: true, name: i18n.t(100141/*是*/)},
                                {id: false, name: i18n.t(100142/*否*/)}
                            ]}
                            />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200018/*预计装运期*/)}</label>
                        <div className={'col-md-8 col-lg-8 datetime'}>
                            <DataTime
                                beginData={new Date()}
                                showTime={false}
                                isShowIcon={true}
                                width={'100%'}
                                validate={true}
                                form={this.props.form}
                                name={'preAriveDate'}
                                value={businessOne.preAriveDate}
                            />
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500045/*收货企业*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            apiUri="/partner/getListBySourceId"
                            apiParams={{sourceId: WebData.user.data.staff.ccid, dataTyId: 60, isAddSelf: true}}
                            fieldName="revBusinessId"
                            initialValue={xt.initSelectValue(businessOne.revBusinessId, businessOne,
                                ['revBusinessId', 'revBusinessLcName', 'revBusinessEnName', 's_reclinkId', 's_reclinkLcName',
                                    's_reclinkEnName', 's_recTel', 's_recFax', 's_recAddress'],
                                'revBusinessLcName', form)}
                            valueKeys={da => ({
                                revBusinessId: da.enterpriseId,
                                revBusinessLcName: da.enterpriseLcName,
                                revBusinessEnName: da.enterpriseEnName,
                                s_label: da.enterpriseLcName,
                                s_reclinkId: da.entContactorId,
                                s_reclinkLcName: da.entContactorLcName,
                                s_reclinkEnName: da.entContactorEnName,
                                s_recTel: da.phone,
                                s_recFax: da.fax,
                                s_recAddress: da.address,
                                s_phoneList: da.phoneList,
                                s_addressList: da.addressList,
                            })} rules
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500046/*收货联系人*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            isRequest={ Boolean(getFieldValue('revBusinessId', {}).revBusinessId)}
                            refreshMark={getFieldValue('revBusinessId', {}).revBusinessId }
                            apiUri="/user/getListForPermissionsInParty"
                            apiHost={API_FOODING_ES}
                            apiParams={{
                                partyId: getFieldValue('revBusinessId', {}).revBusinessId,
                                typeAttributeIds: [42, 601, 602, 603, 604]
                            }}
                            fieldName="reclinkId"
                            initialValue={xt.initSelectValue(businessOne.reclinkId, getNFieldValue('revBusinessId'),
                                ['reclinkId', 'reclinkLcName', 'reclinkEnName'], 'reclinkLcName', form)}
                            valueKeys={da => ({
                                reclinkId: da.refId,
                                reclinkLcName: da.staffLocalName,
                                reclinkEnName: da.staffName,
                                s_label: da.staffLocalName
                            })} rules
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(500047/*收货电话*/)}</label>
                        <ConstVirtualSelect
                            refreshMark={getFieldValue('revBusinessId', {}).revBusinessId }
                            className="col-xs-8 col-md-8"
                            form={this.props.form}
                            fieldName='recTel'
                            autoComplete
                            isRequest={false}
                            initValueOptions={Array.from(new Set(getFieldValue('revBusinessId', {}, false).s_phoneList || (businessOne.recTel ? [businessOne.recTel] : [])))}
                            onChange={this.onProductChange}
                            initialValue={getFieldValue('revBusinessId', {}, false).s_recTel || ''}
                            rules={true}
                            valueKeys={da => String(da)}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(500048/*收货传真*/)}</label>
                        <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
                               placeholder=""
                               {...getFieldProps('recFax', {
                                   valuedateTrigger: 'onBlur',
                                   initialValue: String(getFieldValue('revBusinessId', {}, false).s_recFax || '')
                               })} />
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-12 col-lg-12">
                        <label className={'col-md-1 col-lg-1'}><span>*</span>{i18n.t(500049/*收货地址*/)}</label>
                        <ConstVirtualSelect
                            refreshMark={getFieldValue('revBusinessId', {}).revBusinessId }
                            className="col-xs-11 col-md-11"
                            form={this.props.form}
                            fieldName='recAddress'
                            autoComplete
                            isRequest={false}
                            initValueOptions={Array.from(new Set(getFieldValue('revBusinessId', {}, false).s_addressList || (businessOne.recAddress ? [businessOne.recAddress] : [])))}
                            onChange={this.onProductChange}
                            initialValue={getFieldValue('revBusinessId', {}, false).s_recAddress || ''}
                            rules={true}
                            valueKeys={da => String(da)}
                        />
                    </div>
                </div>
            </div>
        </div>)
    }
}
