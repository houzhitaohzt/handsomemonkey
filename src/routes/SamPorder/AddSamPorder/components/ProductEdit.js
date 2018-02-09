import i18n from './../../../../lib/i18n';
/**
 * Created by iyimu on 2017/5/3.
 */

import React, {Component} from 'react';
import {createForm, FormWrapper} from '../../../../components/Form';
import {ConstMiniSelect, Option} from '../../../../components/Select';
import {API_FOODING_DS, API_FOODING_ERP, apiGet, apiPost} from '../../../../services/apiCall';
import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import xt from './../../../../common/xt';

class ProductEdit extends Component {

    constructor(props) {
        super(props);

        this.state = this.initState();

    }

    initState() {
        return {
            billDtlId: null,
            businessOne: {},
            productOne: {},
        }
    }

    componentDidMount() {
        let {data} = this.props;
        if (data.number !== 1 && data.record) {
            this.getEditOne(data.record.billDtlId);
        }
    }

    componentWillReceiveProps(props) {
        let {data} = props;
        let {billDtlId} = this.state;
        let record = data.number === 1 ? null : data.record;
        if (record && record.billDtlId !== billDtlId) {
            this.getEditOne(record.billDtlId);
        }
    }

    getEditOne = billDtlId => {
        if (!billDtlId) return;
        this.setState({billDtlId});
        apiGet(API_FOODING_ERP, '/specimen/mtl/getOne', {id: billDtlId},
            response => {
                this.setState({businessOne: response.data, productOne: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    onProductChange = prod => {
        let salBeId = this.props.otherData.salBeId;
        apiGet(API_FOODING_DS, '/material/getProductInforErp', {
            id: prod.mtlId, mtlType: 'mtl', sourceId: salBeId
        }, response => {
            this.setState({productOne: response.data, businessOne: Object.assign(this.state.businessOne, this.props.form.getFieldValue('mtlId'))});
        }, (error) => {
            errorTips(error.message);
        })
    };

    onSaveAndClose = ()=>{
        let {form, onSaveAndClose, otherData} = this.props;
        let {businessOne, productOne} = this.state;

        form.validateFields((error, values) => {
            if( !error) {
                let params = Object.assign({billId: otherData.billId},  businessOne, values );
                apiPost(API_FOODING_ERP, '/specimen/mtl/save', params,
                    response => {
                        successTips(response.message);
                        form.resetFields();
                        this.setState({...this.initState()}, onSaveAndClose);
                    }, error => {
                        errorTips(error.message)
                    })
            }
        });
    };

    onCancel = () => {
        this.props.form.resetFields();
        this.setState({...this.initState()}, this.props.onCancel);
    };

    render () {
        const {form, otherData, data} = this.props;
        const {getFieldProps, getFieldErrorStyle, getFieldValue, getNFieldProps} = form;
        let record = data.number === 1 ? null : data.record;
        let {businessOne, productOne} = this.state;
        let prodField = xt.initSelectValue(businessOne.mtlId, businessOne, ['mtlId', 'mtlLcName', 'mtlEnName'], 'mtlLcName', form);
        let prodFieldDa = getFieldValue('mtlId');

        return (
            <FormWrapper showFooter={true} showSaveAdd={false} onSaveAndClose={this.onSaveAndClose}
                         onCancel={this.onCancel}>
            <div className={'  girdlayout'} style={{height:"344px"}}>
                <div className={'row'}>
                    <div className="form-group col-xs-6 col-md-6">
                        <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100379/*产品*/)}</label>
                        <ConstMiniSelect form={this.props.form}
                                         pbj={{
                                             apiType: apiGet, uri: '/beMtl/getMtlList',
                                             params: {sourceId: otherData.salBeId}
                                         }} fieldName="mtlId"
                                         initValueOptions={[]} reles={true}
                                         optionValue={da => <Option key={da.id} objValue={{
                                             mtlId: da.id,
                                             mtlLcName: da.localName,
                                             mtlEnName: da.name,
                                             s_label: da.localName
                                         }}>{da.localName}</Option>}
                                         onChange={this.onProductChange}
                                         initialValue={prodField}
                        />
                    </div>
                    <div className="form-group col-xs-6 col-md-6">
                        <label className={'col-xs-3 col-md-3'}>{i18n.t(200172/*产品分类*/)}</label>
                        <input type='text' disabled className={'col-xs-8 col-md-8 text-input-nowidth'} {
                            ...getNFieldProps('mtlTyId', {
                                    initialValue: xt.initLabelValue(productOne.mtlTyId, productOne, ['mtlTyId', 'mtlTyLcName', 'mtlTyEnName'], 'mtlTyLcName', form)
                                }
                            )
                        }/>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-xs-6 col-md-6">
                        <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(400035/*产品单位*/)}</label>
                        <ConstMiniSelect form={this.props.form} disabled={!Boolean(prodFieldDa.mtlId)}
                                     refreshMark={prodFieldDa.mtlId} reles={true}
                                     pbj={{
                                         apiType: apiGet, host: API_FOODING_DS, uri: '/measum/getList',
                                         params: {sourceId: prodFieldDa.mtlId}
                                     }} fieldName="uomId"
                                     optionValue={da => <Option key={da.id} objValue={{
                                         uomId: da.unitofmea.id,
                                         uomLcName: da.unitofmea.localName,
                                         uomEnName: da.unitofmea.name,
                                         s_label: da.unitofmea.localName
                                     }}>{da.unitofmea.localName}</Option>}
                                     initialValue={xt.initSelectValue(productOne.uomId, productOne, ['uomId', 'uomLcName', 'uomEnName'], 'uomLcName', form) }
                        />
                    </div>
                    <div className="form-group col-xs-6 col-md-6">
                        <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(200173/*样品数量*/)}</label>
                        <input type='text' className={getFieldErrorStyle('sendQty', 'error-border', 'col-xs-8 col-md-8 text-input-nowidth')} {
                            ...getFieldProps('sendQty', {
                                validateFirst: true,
                                rules: [{required: true, pattern: xt.pattern.positiveNonZero}],
                                    initialValue: !productOne.sendQty || isNaN(productOne.sendQty) ? "" : String(productOne.sendQty)
                                }
                            )
                        }/>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-xs-6 col-md-6">
                        <label className={'col-xs-3 col-md-3'}>{i18n.t(100382/*产品规格*/)}</label>
                        <input type='text' disabled className={'col-xs-8 col-md-8 text-input-nowidth'} {
                            ...getFieldProps('basSpeci', {
                                    initialValue: String(productOne.basSpeci || '')
                                }
                            )
                        }/>
                    </div>
                    <div className="form-group col-xs-6 col-md-6">
                        <label className={'col-xs-3 col-md-3'}><span>*</span>HSCODE</label>
                        <input type='text' disabled className={'col-xs-8 col-md-8 text-input-nowidth'} {
                            ...getFieldProps('hsCode', {
                                    initialValue: String(productOne.hsCode || '')
                                }
                            )
                        }/>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-xs-6 col-md-6">
                        <label className={'col-xs-3 col-md-3'}>{i18n.t(500129/*源单编号*/)}</label>
                        <input type='text' disabled className={'col-xs-8 col-md-8 text-input-nowidth'} value={String(businessOne.sourceNo || '')}/>
                    </div>
                    <div className="form-group col-xs-6 col-md-6">
                        <label className={'col-xs-3 col-md-3'}>{i18n.t(500146/*源单类型*/)}</label>
                        <input type='text' disabled className={'col-xs-8 col-md-8 text-input-nowidth'} value={String(businessOne.sourceTypeName || '')}/>
                    </div>

                </div>
            </div></FormWrapper>
        );
    }
}

export default createForm()(ProductEdit);