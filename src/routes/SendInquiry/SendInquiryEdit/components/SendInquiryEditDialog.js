import React, {Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
//引入select插件
import {ConstVirtualSelect,ConstMiniSelect} from "../../../../components/Select";
import Checkbox from "../../../../components/CheckBox";
import Radio from "../../../../components/Radio";
import {apiPost, language,apiGet,API_FOODING_ERP} from "../../../../services/apiCall";
import xt from "../../../../common/xt";
import WebData from "../../../../common/WebData";
//引入table
const {Table} = require("../../../../components/Table");
import i18n from '../../../../lib/i18n';

export class SendInquiryAddDialog extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let that = this;
        const {getFieldProps, getFieldError, getNFieldProps, getFieldValue, getFieldErrorStyle} = this.props.form;
        const {data, otherData, form} = this.props;
        let record = data.number === 1 ? {} : data.record;
        getFieldProps('update_data', {
            initialValue: xt.initLabelValue(record.billDtlId, record, ['billDtlId', 'optlock'])
        });

        let content;
        if (data.name.title == i18n.t(200023/*询价供应商*/) && data.number != 3) {
            content = (
                <div className="girdlayout">
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(200023/*询价供应商*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                disabled={!(otherData.products || []).length}
                                placeholder={!(otherData.products || []).length ? i18n.t(200037/*请先添加产品*/) : undefined}
                                apiUri="/material/getPMtlCompanies"
                                apiParams={{
                                    pMtlIds: (otherData.products || []).map(da => da.mtlId).join(','),
                                    ccId: WebData.user.data.staff.ccid,
                                    forSaleOrPurchase: 0
                                }}
                                fieldName="vndBeId"
                                initialValue={xt.initSelectValue(record.vndBeId, record, ['vndBeId', 'vndBeLcName', 'vndBeEnName'], 'vndBeLcName', form) }
                                valueKeys={da => ({
                                    vndBeId: da.id,
                                    vndBeLcName: da.localName,
                                    vndBeEnName: da.name,
                                    s_label: da.localName
                                })} rules
                            />
                        </div>
                        <div className={getFieldErrorStyle('spickType', 'error-border', 'form-group col-md-3 col-lg-3')}>
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200038/*指定*/)}</label>
                            <span hidden {...getFieldProps('spickType', {
                                initialValue: record.spickType || 10
                            })}/>
                            <div className={'col-md-8 col-lg-8'}>
                                <Radio {...getFieldProps('spickType.10', {
                                    exclusive: true,
                                    getValueFromEvent(e) {
                                        return e.target.checked ? 10 : '';
                                    },
                                    getValueProps(value) {
                                        return {
                                            checked: value === 10,
                                        };
                                    },
                                })}
                                />
                                <span className={'radio-text'}>{i18n.t(200038/*指定*/)}</span>
                                <Radio {...getFieldProps('spickType.20', {
                                    exclusive: true,
                                    getValueFromEvent(e) {
                                        return e.target.checked ? 20 : '';
                                    },
                                    getValueProps(value) {
                                        return {
                                            checked: value === 20,
                                        };
                                    },
                                })}
                                />
                                <span className={'radio-text'}>{i18n.t(100514/*禁止*/)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (data.name.title == i18n.t(500078/*证书要求*/) && data.number != 3) {
            content = (
                <div className="girdlayout">
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500078/*证书要求*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form} initRequest
                                apiUri="/certfct/getList"
                                fieldName="cardId"
                                initialValue={xt.initSelectValue(record.cardId, record, ['cardId', 'cardLcName', 'cardEnName'], 'cardLcName', form) }
                                valueKeys={da => ({
                                    cardId: da.id,
                                    cardLcName: da.localName,
                                    cardEnName: da.name,
                                    s_label: da.localName
                                })} rules
                            />
                        </div>
                        <div className="form-group col-md-6 col-lg-6">
                            <div className={'col-md-8 col-lg-8'}>
                                <Checkbox style={{marginRight: 10}}
                                          {...getFieldProps('gentMark', {
                                              initialValue: record.gentMark
                                          })}
                                          checked={form.getFieldValue("gentMark")}
                                />
                                <label>{i18n.t(500071/*是否加急*/)}</label>
                                <Checkbox style={{marginRight: 10}}
                                          {...getFieldProps('origMark', {
                                              initialValue: record.origMark
                                          })}
                                          checked={form.getFieldValue("origMark")}
                                />
                                <label>{i18n.t(500072/*是否正本*/)}</label>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (data.name.title == i18n.t(100512/*船公司要求*/) && data.number != 3) {
            content = (
                <div className="girdlayout">
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500076/*船公司*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form} initRequest
                                apiType={apiPost}
                                apiParams={{
                                    "obj":"com.fooding.fc.ds.entity.Carrier",
                                    "prettyMark":true
                                }}
                                fieldName="shipBeId"
                                initialValue={xt.initSelectValue(record.shipBeId, record, ['shipBeId', 'shipBeLcName', 'shipBeEnName'], 'shipBeLcName', form) }
                                valueKeys={da => ({
                                    shipBeId: da.id,
                                    shipBeLcName: da.localName,
                                    shipBeEnName: da.name,
                                    s_label: da.localName
                                })} rules
                            />
                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500075/*指定/禁止*/)}</label>
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
                    </div>
                </div>
            );
        } else if (data.name.title == i18n.t(500079/*检验要求*/) && data.number != 3) {
            content = (
                <div className="girdlayout">
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(500061/*产品名称*/)}</label>
                             <ConstMiniSelect form={this.props.form}
                                                             pbj={{
                                                                 apiType: apiGet, host: API_FOODING_ERP, uri:'/inquiry/mtl/getList',
                                                                 params: {billId:this.props.otherData.id}
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
                            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(500073/*测试项目*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                apiType={apiPost}
                                apiParams="com.fooding.fc.ds.entity.TestItem"
                                fieldName="testItmId"
                                initialValue={ xt.initSelectValue(record.testItmId, record, ['testItmId', 'testItmLcName', 'testItmEnName'], "testItm" + language, form)}
                                className={'col-md-8 col-lg-8'}
                                valueKeys={da => ({
                                    testItmId: da.id,
                                    testItmLcName: da.localName,
                                    testItmEnName: da.name,
                                    s_label: da.localName
                                })} rules
                            />
                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100606/*测试方法*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                apiType={apiPost}
                                pageSize={6}
                                apiParams="com.fooding.fc.ds.entity.TestMeth"
                                fieldName="testMethId"
                                initialValue={xt.initSelectValue(record.testMethId, record, ['testMethId', 'testMethLcName', 'testMethEnName'], "testMeth" + language, this.props.form)}
                                className={'col-md-8 col-lg-8'}
                                valueKeys={da => ({
                                    testMethId: da.id,
                                    testMethLcName: da.localName,
                                    testMethEnName: da.name,
                                    s_label: da.localName
                                })} rules
                            />
                        </div>
                    </div>
                </div>
            );
        } else if (data.number == 3) {
            content = (<div className='scroll lose scroll-style'>
							<span>
								<i>*</i>
								失效原因
							</span>
            </div>);
        }
        return (
            <div className="action-normal-buttons">
                <FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.props.onCancel} width={976}
                             showSaveAdd={false}>
                    {content}
                </FormWrapper>
            </div>
        );
    }

    onSaveAndClose = () => {
        this.props.onSaveAndClose(this.props.form);
    }
}
SendInquiryAddDialog.propTypes = {
    onSaveAdd: PropTypes.func,
    onSaveAndClose: PropTypes.func,
    onCancel: PropTypes.func
};
SendInquiryAddDialog.defaultProps = {
    onSaveAdd(){
    },
    onSaveAndClose(){
    },
    onCancel(){
    }
};

export default createForm()(SendInquiryAddDialog);
