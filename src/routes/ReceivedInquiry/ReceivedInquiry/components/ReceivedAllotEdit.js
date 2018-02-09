import i18n from './../../../../lib/i18n';
import React, {Component} from 'react';
import {createForm, FormWrapper} from '../../../../components/Form';
//引入select插件
import {ConstMiniSelect, Option} from '../../../../components/Select';
import xt from '../../../../common/xt';
import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, API_FOODING_ES, apiForm, apiGet} from '../../../../services/apiCall';

export class ReceivedAllotEdit extends Component {
    constructor(props) {
        super(props);
        this.onCancel = this.onCancel.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onSaveAdd = this.onSaveAdd.bind(this);
    }

    onSaveAndClose(isAdd) {
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if (errors) {

            } else {
                apiForm(API_FOODING_ERP, '/receiveenquiry/allotStaff', {
                    ...value,
                    billId: this.props.businessOne.billId
                }, response => {
                    successTips("分配成功!");
                    this.props.onSaveAndClose();
                }, error => {
                    errorTips(error.message);
                })
            }
        })
    }

    onSaveAdd() {
        this.onSaveAndClose(true);
    }

    onCancel() {
        const {form, onCancel} = this.props;
        this.props.onCancel();
        this.props.form.resetFields();
    }

    render() {
        let that = this;
        const {getFieldProps, getFieldError, getFieldValue, getNFieldProps} = this.props.form;
        let {businessOne, form} = this.props;

        return (
            <div className="package-action-buttons">
                <FormWrapper
                    showFooter={true}
                    buttonLeft={this.props.buttonLeft}
                    onSaveAndClose={this.onSaveAndClose}
                    onCancel={this.onCancel}
                    showSaveAdd={false}>
                    <div className={'addnormal'} style={{marginBottom: '10px'}}>
                        <div className={'  girdlayout'}>
                            <div className={'row'}>
                                <div className="form-group col-md-6 col-lg-6">
                                    <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
                                    <ConstMiniSelect form={this.props.form}
                                                     disabled={true}
                                                     pbj={{
                                                         apiType: apiGet, host: API_FOODING_ES, uri: '/party/getLoginCompanies',
                                                         params: {clusId: businessOne.clusterId}
                                                     }} fieldName="ccId"
                                                     initialValue={xt.initSelectValue(true, businessOne, ['ccId', 'ccLcName', 'ccEnName'], 'ccLcName', form)}
                                                     optionValue={da => <Option key={da.id} objValue={{
                                                         ccId: da.id,
                                                         ccLcName: da.localName,
                                                         ccEnName: da.name,
                                                         s_label: da.localName
                                                     }} title={da.localName}>{da.localName}</Option>} reles={true}
                                    />
                                </div>
                                <div className="form-group col-md-6 col-lg-6">
                                    <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200119/*销售组织*/)}</label>
                                    <ConstMiniSelect form={this.props.form} disabled={!Boolean(getFieldValue('ccId', {}).ccId)}
                                                     refreshMark={getFieldValue('ccId', {}).ccId}
                                                     pbj={{
                                                         apiType: apiGet, host: API_FOODING_ES, uri: '/party/getPartysByType',
                                                         params: {partyId: getFieldValue('ccId',  businessOne).ccId, typeAttributeIds:["44"]}
                                                     }} fieldName="sorId"
                                                     initialValue={ xt.initSelectValue(
                                                         businessOne.sorId, businessOne,
                                                         ['sorId', 'sorLcName', 'sorEnName'],
                                                         'sorLcName', form
                                                     )}
                                                     optionValue={da => <Option key={da.id} objValue={{
                                                         sorId: da.id,
                                                         sorLcName: da.localName,
                                                         sorEnName: da.name,
                                                         s_label: da.localName
                                                     }}>{da.localName}</Option>} reles={true}
                                    />
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className="form-group col-md-6 col-lg-6">
                                    <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(400011/*销售员*/)}</label>
                                    <ConstMiniSelect form={this.props.form} disabled={!Boolean(getFieldValue('sorId', {}).sorId)}
                                                     refreshMark={getFieldValue('sorId', {}).sorId}
                                                     pbj={{
                                                         apiType: apiGet, host: API_FOODING_ES, uri: '/user/getListForPermissionsInParty',
                                                         params: {partyId: getFieldValue('sorId', businessOne).sorId}
                                                     }} fieldName="saleId"
                                                     initialValue={xt.initSelectValue(
                                                         businessOne.saleId && businessOne.sorId === (getFieldValue('sorId', {}).sorId),
                                                         businessOne, ['saleId', 'saleLcName', 'saleEnName'], 'saleLcName'
                                                     )}
                                                     optionValue={(da, di) => <Option key={di} objValue={{
                                                         saleId: da.refId,
                                                         saleLcName: da.staffLocalName,
                                                         saleEnName: da.staffName,
                                                         s_label: da.staffLocalName
                                                     }}>{da.staffLocalName}</Option>} reles={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </FormWrapper>
            </div>
        )
    }
}

const ProductForm = createForm()(ReceivedAllotEdit);
export default ProductForm;
