import React, {Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
import {ProductFind} from "../../../../components/FindGridSelect";
//引入select插件
import {ConstVirtualSelect} from "../../../../components/Select";
import Checkbox from "../../../../components/CheckBox";
import {API_FOODING_ERP, apiGet, apiPost, language} from "../../../../services/apiCall";
import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import xt from "./../../../../common/xt";
//引入table
const {Table} = require("../../../../components/Table");
import i18n from '../../../../lib/i18n';

class ProductEditDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            businessOne: {},
            productOne: {},
            productSelectData: []
        }
    }

    componentDidMount() {
        let {data} = this.props;
        if (data.number !== 1 && data.record) {
            this.getEditOne(data.record.billDtlId);
        }
    }

    getEditOne = billDtlId => {
        if (!billDtlId) return;
        this.setState({billDtlId});
        ///enquiry/mtl/getOne replace /inquiry/mtl/getOne
        apiGet(API_FOODING_ERP, '/inquiry/mtl/getOne', {id: billDtlId},
            response => {
                this.setState({businessOne: response.data, productOne: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    onSaveAndClose = () => {
        let {form, onSaveAndClose, otherData} = this.props;
        let {businessOne, productOne} = this.state;

        form.validateFields((error, values) => {
            if (!error) {
                let params = Object.assign({billId: otherData.id}, businessOne, values);
                ///enquiry/mtl/save replace /inquiry/mtl/save
                apiPost(API_FOODING_ERP, '/inquiry/mtl/save', params,
                    response => {
                        successTips(response.message);
                        this.props.onSaveAndClose(params);
                    }, error => {
                        errorTips(error.message)
                    })
            }
        });
    };

    render() {
        let that = this;
        const {getFieldProps, getFieldError, getNFieldProps, getFieldValue, getFieldErrorStyle} = this.props.form;
        const {data, otherData, form} = this.props;
        let {businessOne, productOne} = this.state;
        let prodField = xt.initSelectValue(businessOne.mtlId, businessOne,
            ['mtlId', 'mtlLcName', 'mtlEnName', 'basSpeci'], 'mtlLcName', form);
        let prodFieldDa = getFieldValue('mtlId');

        return (
            <div className="action-normal-buttons">
                <FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.props.onCancel} width={976}
                             showSaveAdd={false}>
                    <div className="girdlayout scroll">
                        <div className={'row'}>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100379/*产品*/)}</label>
                                <ProductFind
                                    form={this.props.form}
                                    fieldName='mtlId'
                                    apiUri='/platformMaterial/search'
                                    apiParams='keyword'
                                    initialValue={prodField}
                                    rules={true}
                                    width={'280%'}
                                    valueKeys={ da => ({
                                        mtlId: da.id,
                                        mtlLcName: da.localName,
                                        mtlEnName: da.name,
                                        basSpeci: da.specTxt,
                                        code: da.code,
                                        s_label: da.localName
                                    })}
                                />
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}>{i18n.t(100382/*产品规格*/)}</label>
                                <input type='text' placeholder={i18n.t(200035/*自动带出*/)} disabled className={'col-xs-8 col-md-8 text-input-nowidth'} {
                                    ...getFieldProps('basSpeci', {
                                            initialValue: String(prodFieldDa.basSpeci || '')
                                        }
                                    )
                                }/>
                            </div>
                            <div className={'row'}>
                                <div className="form-group col-xs-6 col-md-6">
                                    <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(400035/*产品单位*/)}</label>
                                    <ConstVirtualSelect
                                        form={this.props.form} disabled={!Boolean(prodFieldDa.mtlId)}
                                        refreshMark={prodFieldDa.mtlId} rules
                                        apiUri="/measum/getList"
                                        apiParams={{sourceId: prodFieldDa.mtlId}}
                                        fieldName="uomId"
                                        valueKeys={ da => ({
                                            uomId: da.unitofmea.id,
                                            uomLcName: da.unitofmea.localName,
                                            uomEnName: da.unitofmea.name,
                                            s_label: da.unitofmea.localName
                                        })}
                                        initialValue={xt.initSelectValue(productOne.uomId, productOne, ['uomId', 'uomLcName', 'uomEnName'], 'uomLcName', form) }
                                    />
                                </div>
                                <div className="form-group col-xs-6 col-md-6">
                                    <label className={'col-xs-3 col-md-3'}>{i18n.t(400012/*品牌*/)}</label>
                                    <ConstVirtualSelect
                                        form={this.props.form}
                                        apiType={apiPost}
                                        apiParams='com.fooding.fc.ds.entity.Brand' fieldName="brandId"
                                        valueKeys={ da => ({
                                            brandId: da.id,
                                            brandLcName: da.localName,
                                            brandEnName: da.name,
                                            s_label: da.localName
                                        })} 
                                        initialValue={xt.initSelectValue(productOne.brandId, productOne, ['brandId', 'brandLcName', 'brandEnName'], 'brandLcName', form) }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}>{i18n.t(500068/*托盘*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    apiType={apiPost}
                                    clearable
                                    apiParams='com.fooding.fc.ds.entity.SalvrType' fieldName="salvrId"
                                    initialValue={
                                        xt.initSelectValue(productOne.salvrId, productOne, ['salvrId', 'salvrLcName', 'salvrEnName'], "salvr" + language, form)
                                    }
                                    valueKeys={ da => ({
                                        salvrId: da.id,
                                        salvrLcName: da.localName,
                                        salvrEnName: da.name,
                                        s_label: da.localName
                                    })}
                                />
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500067/*包装*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form} disabled={!Boolean(prodFieldDa.mtlId)}
                                    refreshMark={prodFieldDa.mtlId}
                                    apiUri="/pack/getList"
                                    apiParams={{sourceId: prodFieldDa.mtlId}}
                                    fieldName="packagId"
                                    valueKeys={ da => ({
                                        packagId: da.packaging.id,
                                        packagLcName: da.packaging.localName,
                                        packagEnName: da.packaging.name,
                                        s_label: da.packaging.localName
                                    })} rules
                                    initialValue={xt.initSelectValue(productOne.packagId && prodFieldDa.mtlId === productOne.mtlId, productOne, ['packagId', 'packagLcName', 'packagEnName'], 'packagLcName', form) }
                                />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500065/*需求数量*/)}</label>
                                <input type="text" placeholder=""
                                       {...getFieldProps('requireQty', {
                                           validateFirst: true,
                                           rules: [{required: true, pattern: xt.pattern.positiveNonZero}],
                                           initialValue: String(businessOne.requireQty || ''),
                                       })}
                                       className={getFieldErrorStyle('requireQty', 'error-border', 'col-md-8 col-lg-8 text-input-nowidth')}
                                />
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(200036/*目标单价*/)}</label>
                                <input type="text" placeholder=""
                                       {...getFieldProps('aimPrc', {
                                           validateFirst: true,
                                           rules: [{required: true, pattern: xt.pattern.positiveNonZero}],
                                           initialValue: String(businessOne.aimPrc || ''),
                                       })}
                                       className={getFieldErrorStyle('aimPrc', 'error-border', 'col-md-8 col-lg-8 text-input-nowidth')}
                                />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}>{i18n.t(500069/*可否混装*/)}</label>
                                <div className={'col-xs-9 col-md-9'}>
                                    <Checkbox
                                        {...getFieldProps('isMixed', {
                                            initialValue: businessOne.isMixed ? businessOne.isMixed : false
                                        })}
                                        checked={form.getFieldValue("isMixed")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </FormWrapper>
            </div>
        );
    }
}
ProductEditDialog.propTypes = {
    onSaveAdd: PropTypes.func,
    onSaveAndClose: PropTypes.func,
    onCancel: PropTypes.func
};
ProductEditDialog.defaultProps = {
    onSaveAdd(){
    },
    onSaveAndClose(){
    },
    onCancel(){
    }
};

export default createForm()(ProductEditDialog);
