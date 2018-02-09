import i18n from './../../../../lib/i18n';
import React, {Component} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
//引入select插件
import Select, {ConstVirtualSelect, Option} from "../../../../components/Select";
import xt from "../../../../common/xt"; // 下拉
import Checkbox from "../../../../components/CheckBox";
import Input from "../../../../components/FormValidating/FormValidating";
import {API_FOODING_ES, apiPost} from "../../../../services/apiCall";

export class NumberSPlug extends Component {
    constructor(props) {
        super(props);
        this.addSelect;
        this.getData = this.getData.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onSaveAdd = this.onSaveAdd.bind(this);
    }

    getData(value, that) {
        this.addSelect = that;
    }

    onSaveAndClose(isAdd) {
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if (!errors) {
                this.props.onSaveAndClose(this.props.form.getFieldsValue(), this.props.checkedData);
            }
        })
    }

    onSaveAdd() {
        this.onSaveAndClose();
    }

    onCancel() {
        const {form, onCancel} = this.props;
        this.props.onCancel();
        this.props.form.resetFields();
    }

    render() {
        let that = this;
        const {getFieldProps, getFieldError, getFieldErrorStyle, getNFieldProps, getFieldValue} = this.props.form;
        let {checkedData} = this.props;
        let content = <div/>;
        let beField = xt.initSelectValue(checkedData.cluster, {clusId: xt.getItemValue(checkedData, 'cluster.id'), ...checkedData.cluster}, ['clusId'], 'localName', this.props.form);
        let beFieldValue = getFieldValue("clusId") || {};

        if (this.props.DialogContent == 1) {
            content = (
                <div className={'addnormal'} style={{marginBottom: '10px'}}>
                    <div className={'  girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100243/*集团*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    apiHost={API_FOODING_ES}
                                    apiUri="/party/getLoginClusters"
                                    fieldName="clusId"
                                    initialValue={beField}
                                    valueKeys={da => ({
                                        clusId: da.id,
                                        s_label: da.localName
                                    })} rules
                                />
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    isRequest={Boolean(beFieldValue.clusId)}
                                    refreshMark={beFieldValue.clusId}
                                    apiHost={API_FOODING_ES}
                                    apiUri="/party/getLoginCompanies"
                                    apiParams={{clusId: beFieldValue.clusId}}
                                    fieldName="ccId"
                                    initialValue={ xt.initSelectValue(checkedData.company, {ccId: xt.getItemValue(checkedData, 'company.id'), ...checkedData.company}, ['ccId'], 'localName', this.props.form)}
                                    valueKeys={da => ({
                                        ccid: da.id,
                                        s_label: da.localName
                                    })} rules
                                />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100001/*名称*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    apiType={apiPost}
                                    apiParams={{
                                        obj: 'com.fooding.fc.ds.entity.BillNoTarget',
                                        attrs: ["id", "name", "code", "description"]
                                    }}
                                    fieldName="bnpBillKey"
                                    initialValue={  xt.initSelectValue(checkedData.bnpBillKey, (checkedData.billNoTarget ? {bnpBillKey:checkedData.billNoTarget['id'],description:checkedData.billNoTarget['description']} : {}), ['bnpBillKey'], 'description', this.props.form)}
                                    valueKeys={da => ({
                                        bnpBillKey: da.id,
                                        s_label: da.description
                                    })} rules
                                />
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(201192/*固定前缀*/)}</label>
                                <input type='text'
                                       className={getFieldErrorStyle('bnplPattern', 'error-border', 'col-xs-8 col-md-8 text-input-nowidth')}
                                       placeholder=""
                                       {...getFieldProps('bnplPattern', {
                                           rules: [{required: true,}],
                                           initialValue: checkedData.bnplPattern ? checkedData.bnplPattern : ''
                                       })}

                                />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(201193/*末尾数值长度*/)}</label>
                                <input type='text'
                                       className={getFieldErrorStyle('zeroCount', 'error-border', 'col-xs-8 col-md-8 text-input-nowidth')}
                                       placeholder=""
                                       {...getFieldProps('zeroCount', {
                                           validateFirst: true,
                                           rules: [{required: true,}],
                                           valuedateTrigger: 'onBlur',
                                           initialValue: checkedData.zeroCount ? checkedData.zeroCount : ''
                                       })}  />
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{i18n.t(201194/*是否包含日期*/)}</label>
                                <Checkbox
                                    style={{lineHeight: '32px'}}
                                    {...getFieldProps('hasDate', {
                                        valuePropName: 'checked',
                                        initialValue: checkedData.hasDate ? checkedData.hasDate : false
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (this.props.DialogContent == 5) {

            content = (
                <div className={'girdlayout scroll'} style={{overflow: 'auto'}}>
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100243/*集团*/)}</label>
                            <div className={'col-xs-8 col-md-8'}>
                                <p >{xt.getItemValue(checkedData, 'cluster.localName', '')}</p>
                            </div>
                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
                            <div className={'col-xs-8 col-md-8'}>
                                <p>{xt.getItemValue(checkedData, 'company.localName', '')}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100001/*名称*/)}</label>
                            <div className={'col-xs-8 col-md-8'}>
                                <p>{xt.getItemValue(checkedData, 'billNoTarget.description', '')}</p>
                            </div>
                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(201192/*固定前缀*/)}</label>
                            <div className={'col-xs-8 col-md-8'}>
                                <p>{xt.getItemValue(checkedData, 'bnplPattern', '')}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(201193/*末尾数值长度*/)}</label>
                            <div className={'col-xs-8 col-md-8'}>
                                <p>{xt.getItemValue(checkedData, 'zeroCount', '')}</p>
                            </div>
                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(201194/*是否包含日期*/)}</label>
                            <div className={'col-xs-8 col-md-8'}>
                                <p>{checkedData.hasDate ? i18n.t(100141/*是*/): i18n.t(100142/*否*/)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className="package-action-buttons">
                <FormWrapper
                    showFooter={true}
                    buttonLeft={this.props.buttonLeft}
                    onSaveAndClose={this.onSaveAndClose}
                    onCancel={this.onCancel}
                    onSaveAdd={this.onSaveAdd}
                    showSaveAdd={false}
                    showSaveClose={this.props.showSaveClose}>
                    {content}
                </FormWrapper>
            </div>
        )
    }
}

const ProductForm = createForm()(NumberSPlug);
export default ProductForm;
