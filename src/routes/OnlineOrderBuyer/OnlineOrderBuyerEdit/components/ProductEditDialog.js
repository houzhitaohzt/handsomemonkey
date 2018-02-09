import React, {Component, PropTypes} from 'react';
import RightKey from '../../../../components/RightKey/RightKey';
import {createForm, FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, {Option, ConstMiniSelect} from '../../../../components/Select';
import Calendar from  '../../../../components/Calendar/Calendar';
import Checkbox from '../../../../components/CheckBox';
import Radio from "../../../../components/Radio";
import {apiGet, apiPost, apiForm, API_FOODING_ERP, API_FOODING_DS, language} from '../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
import {ProductFind} from '../../../../components/FindGridSelect';
//引入table
const {Table} = require("../../../../components/Table");
import xt from './../../../../common/xt';
import {I18n} from '../../../../lib/i18n';
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
        ///nooorder/mtl/getOne replace /inquiryorder/mtl/getOne
        apiGet(API_FOODING_ERP, '/inquiryorder/mtl/getOne', {id: billDtlId},
            response => {
                this.setState({businessOne: response.data, productOne: response.data});
            }, error => {
                errorTips({text:error.message,type:'error'});
            });
    };

     onProductSearch = data => {
        if(data.trim() === '') return;
        apiGet(API_FOODING_DS, '/platformMaterial/search', {keyword: data}, response => {
            this.setState({productSelectData: response.data || []});
        }, error => {
            errorTips({text:error.message,type:'error'});
        })
    };

    onSaveAndClose = () => {
        let {form, onSaveAndClose, otherData} = this.props;
        let {businessOne, productOne} = this.state;

        form.validateFields((error, values) => {
            if (!error) {
                let params = Object.assign({billId: otherData.billId}, businessOne, values);
                ///nooorder/mtl/save replace /inquiryorder/mtl/save
                apiPost(API_FOODING_ERP, '/inquiryorder/mtl/save', params,
                    response => {
                        successTips(response.message);
                        this.getEditOne()
                        this.props.onSaveAndClose(params);
                    }, error => {
                        errorTips(error.message)
                    })
            }
        });
    };

    render() {
        let that = this;
        const {getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;
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
                                <label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100379/*产品*/)}</label>
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
                                <label className={'col-xs-3 col-md-3'}>{I18n.t(100382/*产品规格*/)}</label>
                                <input type='text'  disabled className={'col-xs-8 col-md-8 text-input-nowidth'} {
                                    ...getFieldProps('basSpeci', {
                                            initialValue: String(prodFieldDa.basSpeci || '')
                                        }
                                    )
                                }/>
                                </div>
                        </div>
                        <div className={'row'}>
                                <div className="form-group col-xs-6 col-md-6">
                                    <label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(400035/*产品单位*/)}</label>
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
                                    <label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(400012/*品牌*/)}</label>
                                    <ConstMiniSelect form={this.props.form}
                                                     pbj='com.fooding.fc.ds.entity.Brand' fieldName="brandId"
                                                     optionValue={da => <Option key={da.id} objValue={{
                                                         brandId: da.id,
                                                         brandLcName: da.localName,
                                                         brandEnName: da.name,
                                                         s_label: da.localName
                                                     }}>{da.localName}</Option>}
                                                     reles={true}
                                                     initialValue={xt.initSelectValue(productOne.brandId, productOne, ['brandId', 'brandLcName', 'brandEnName'], 'brandLcName', form) }
                                    />
                                </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}>{I18n.t(500068/*托盘*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 pbj='com.fooding.fc.ds.entity.SalvrType' fieldName="salvrId"
                                                 initialValue={
                                                     xt.initSelectValue(productOne.salvrId, productOne, ['salvrId', 'salvrLcName', 'salvrEnName'], "salvr" + language, form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     salvrId: da.id,
                                                     salvrLcName: da.localName,
                                                     salvrEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.name}</Option>} 
                                                 allowClear
                                />
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(500067/*包装*/)}</label>
                                <ConstMiniSelect form={this.props.form} disabled={!Boolean(prodFieldDa.mtlId)}
                                                 refreshMark={prodFieldDa.mtlId}
                                                 pbj={{
                                                     apiType: apiGet, uri: '/pack/getList',
                                                     params: {sourceId: prodFieldDa.mtlId}
                                                 }} fieldName="packagId"
                                                 optionValue={da => <Option key={da.id} objValue={{
                                                     packagId: da.packaging.id,
                                                     packagLcName: da.packaging.localName,
                                                     packagEnName: da.packaging.name,
                                                     s_label: da.packaging.localName
                                                 }}>{da.packaging.localName}</Option>}
                                                 initialValue={xt.initSelectValue(productOne.packagId, productOne, ['packagId', 'packagLcName', 'packagEnName'], 'packagLcName', form) }
                                                 className='currency-btn select-from-currency col-md-8 col-lg-8'
                                                 reles={true}
                                />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(500065/*需求数量*/)}</label>
                                <input type="text" className ={getFieldError("requireQty") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
                                       {...getFieldProps('requireQty', {
                                           validateFirst: true,
                                           rules: [{required: true,}],
                                           initialValue: String(businessOne.requireQty || ''),
                                       })}
                                />
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(500066/*成交价*/)}</label>
                                <input type="text" className ={getFieldError("aimPrc") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
                                       {...getFieldProps('aimPrc', {
                                           validateFirst: true,
                                           rules: [{required: true,}],
                                           initialValue: String(businessOne.aimPrc || ''),
                                       })}
                                />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}>{I18n.t(500069/*可否混装*/)}</label>
                                <div className={'col-xs-9 col-md-9'}>
                                    <Checkbox
                                        {...getFieldProps('canMixedStowage',{
                                            initialValue:businessOne.canMixedStowage?businessOne.canMixedStowage:false
                                        })}
                                        checked={form.getFieldValue("canMixedStowage")}
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
