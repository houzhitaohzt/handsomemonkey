import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';

import TabSwitch from "../../../../components/TabSwitch";
import Select, {Option, ConstMiniSelect} from '../../../../components/Select';
import Checkbox from '../../../../components/CheckBox';
import DataTime from '../../../../components/Calendar/Calendar';
import {createForm, FormWrapper} from "../../../../components/Form";
// ajax
import {
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_ERP,
    API_FOODING_DS,
    language,
    pageSize,
    sizeList
} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import xt from '../../../../common/xt';
import {ProductFind} from '../../../../components/FindGridSelect';

import {I18n} from '../../../../lib/i18n';

class NewProductInfomationEditAdd extends Component {
    constructor(props) {
        super(props);
    }

    ProductClick = (index, callback) => {
        this.props.ProductClick(index, callback);
    }
    purTaxPrcChange = (index, e) => {
        this.props.form.setFieldsValue({
            ["products[" + index + "].ciPrice"]: e.target.value
        });
    }

    render() {
        let that = this;
        let {PurOrder = {}} = this.props;
        const {getFieldProps, getFieldValue, getFieldError, getNFieldProps} = this.props.form;
        let array = [{title: I18n.t(100379/*产品*/), content: 'loading...'}];
        if (PurOrder.products && PurOrder.products.length) {
            let productArr = PurOrder.products;
            let indexAry = PurOrder.indexAry;
            array = productArr.map((e, i) => {
                return ({
                    title: I18n.t(100379/*产品*/) + (i + 1), content: <div className={'  girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100379/*产品*/)}</label>
                                <ProductFind
                                    form={this.props.form}
                                    onChange={that.props.onProductSelect.bind(this, i)}
                                    productClick={that.ProductClick.bind(this, i)}
                                    apiUri='/material/search'
                                    apiParams='keyword'
                                    fieldName={"products[" + i + "].mtlId"}
                                    rules={true}
                                    width={'280%'}
                                    initialValue={xt.initLabelValue(e.mtlId, e, ['mtlId', 'mtlLcName', 'mtlEnName'], 'mtlLcName', this.props.form)}
                                    valueKeys={da => ({
                                        mtlId: da.id,
                                        mtlLcName: da.localName,
                                        mtlEnName: da.name,
                                        s_label: da.localName
                                    })}
                                    disabled={e.sourceNo !== null}
                                    titleClass={'col-md-8 col-lg-8'}
                                />
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100382/*产品规格*/)}</label>
                                <input type='text'
                                       className={getFieldError("products[" + i + "].basSpeci") ? 'col-md-8 col-lg-8 text-input-nowidth error-border' : 'text-input-nowidth col-md-8 col-lg-8'}
                                       readOnly disabled
                                       {...getFieldProps("products[" + i + "].basSpeci", {
                                           validateFirst: true,
                                           rules: [{required: true,}],
                                           initialValue: e.basSpeci ? e.basSpeci : ''
                                       })}/>
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500067/*包装*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 isRequest={Boolean(getFieldValue("products[" + i + "].mtlId", e).mtlId)}
                                                 refreshMark={getFieldValue("products[" + i + "].mtlId", e).mtlId}
                                                 disabled={e.sourceType && e.sourceType == 318}
                                                 pbj={{
                                                     apiType: apiGet,
                                                     host: API_FOODING_DS,
                                                     uri: '/pack/getList',
                                                     params: {sourceId: getFieldValue("products[" + i + "].mtlId", e).mtlId}
                                                 }}
                                                 fieldName={"products[" + i + "].packagId"}
                                                 initValueOptions={[]}
                                                 optionValue={da => <Option key={da.id} objValue={{
                                                     packagId: da.packaging ? da.packaging.id : '',
                                                     packagLcName: da.packaging ? da.packaging.localName : '',
                                                     packagEnName: da.packaging ? da.packaging.name : '',
                                                     s_label: da.packaging ? da.packaging.localName : '',
                                                 }}>{da.packaging ? da.packaging.localName : ''}</Option>} reles={true}
                                                 initialValue={xt.initSelectValue(e.packagId && getFieldValue("products[" + i + "].mtlId", e).mtlId === e.mtlId, e, ['packagId', 'packagLcName', 'packagEnName'], 'packagLcName', this.props.form)}
                                                 className={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(500068/*托盘*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 pbj='com.fooding.fc.ds.entity.SalvrType'
                                                 fieldName={"products[" + i + "].salvrId"}
                                                 initValueOptions={[]}
                                                 optionValue={da => <Option key={da.id} objValue={{
                                                     salvrId: da.id,
                                                     salvrLcName: da.localName,
                                                     salvrEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 initialValue={xt.initSelectValue(e.salvrId, e, ['salvrId', 'salvrLcName', 'salvrEnName'], 'salvrLcName', this.props.form)}
                                                 className={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100319/*采购数量*/)}</label>
                                <input type='text'
                                       className={getFieldError("products[" + i + "].purQty") ? 'col-md-8 col-lg-8 text-input-nowidth error-border' : 'col-md-8 col-lg-8 text-input-nowidth'}
                                       disabled={e.sourceNo !== null}
                                       {...getFieldProps("products[" + i + "].purQty", {
                                           validateFirst: true,
                                           rules: [{required: true, pattern: xt.pattern.positiveNonZero}],
                                           initialValue: e.purQty ? e.purQty : ''
                                       })} />
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400035/*产品单位*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 disabled={e.sourceNo !== null}
                                                 isRequest={Boolean(getFieldValue("products[" + i + "].mtlId", e).mtlId)}
                                                 refreshMark={getFieldValue("products[" + i + "].mtlId", e).mtlId}
                                                 pbj={{
                                                     apiType: apiGet,
                                                     host: API_FOODING_DS,
                                                     uri: '/measum/getList',
                                                     params: {sourceId: getFieldValue("products[" + i + "].mtlId", e).mtlId}
                                                 }}
                                                 fieldName={"products[" + i + "].uomId"}
                                                 initValueOptions={[]}
                                                 optionValue={da => <Option key={da.id} objValue={{
                                                     uomId: da.unitofmea ? da.unitofmea.id : '',
                                                     uomLcName: da.unitofmea ? da.unitofmea.localName : '',
                                                     uomEnName: da.unitofmea ? da.unitofmea.name : '',
                                                     s_label: da.unitofmea ? da.unitofmea.localName : '',
                                                 }}>{da.unitofmea ? da.unitofmea.localName : ''}</Option>} reles={true}
                                                 initialValue={xt.initSelectValue(e.uomId && getFieldValue("products[" + i + "].mtlId", e).mtlId === e.mtlId, e, ['uomId', 'uomLcName', 'uomEnName'], 'uomLcName', this.props.form)}
                                                 className={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400070/*含税价格*/)}</label>
                                <input type='text'
                                       className={getFieldError("products[" + i + "].purTaxPrc") ? 'col-md-8 col-lg-8 text-input-nowidth error-border' : 'col-md-8 col-lg-8 text-input-nowidth'}
                                       {...getFieldProps("products[" + i + "].purTaxPrc", {
                                           validateFirst: true,
                                           rules: [{required: true, pattern: xt.pattern.positiveNonZero}],
                                           onChange: this.purTaxPrcChange.bind(this, i),
                                           initialValue: e.purTaxPrc ? e.purTaxPrc : ''
                                       })}/>
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400071/*交货日期*/)}</label>
                                <div className={'col-md-8 col-lg-8 datetime'}>
                                    <DataTime
                                        showTime={false}
                                        isShowIcon={true}
                                        width={'100%'}
                                        form={this.props.form}
                                        name={"products[" + i + "].delDate"}
                                        className={getFieldError("products[" + i + "].delDate") ? 'error-border' : ''}
                                        validate={true}
                                        value={new Date(e.delDate ? e.delDate : '').Format('yyyy-MM-dd')}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400072/*装运日期*/)}</label>
                                <div className={'col-md-8 col-lg-8 datetime'}>
                                    <DataTime
                                        showTime={false}
                                        isShowIcon={true}
                                        width={'100%'}
                                        form={this.props.form}
                                        name={"products[" + i + "].ariveDate"}
                                        className={getFieldError("products[" + i + "].ariveDate") ? 'error-border' : ''}
                                        validate={true}
                                        value={new Date(e.ariveDate ? e.ariveDate : '').Format('yyyy-MM-dd')}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400073/*报关方式*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 pbj='com.fooding.fc.enumeration.ClearanceType'
                                                 fieldName={"products[" + i + "].cleaTyp"}
                                                 initValueOptions={e.cleaTyp ? [{
                                                     id: String(e.cleaTyp),
                                                     name: e.cleaTypName,
                                                     localName: e.cleaTypName
                                                 }] : [{
                                                     id: "10",
                                                     name: I18n.t(400074/*我方报关*/),
                                                     localName: I18n.t(400074/*我方报关*/)
                                                 }]}
                                                 reles={true}
                                                 initialValue={e.cleaTyp ? String(e.cleaTyp) : "10"} reles={true}
                                                 className={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}>HSCODE</label>
                                <input type='text' className={'col-md-8 col-lg-8 text-input-nowidth'}
                                       {...getFieldProps("products[" + i + "].hsCode", {
                                           initialValue: e.hsCode ? e.hsCode : ''
                                       })}/>
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(400075/*是否商检*/)}</label>
                                <lable className={'col-md-4 col-lg-4'} style={{marginTop: '6px'}}>
                                    <Checkbox {...getFieldProps("products[" + i + "].inspcMark", {
                                        initialValue: e.inspcMark ? e.inspcMark : false
                                    })}
                                              checked={!!getFieldValue("products[" + i + "].inspcMark")}
                                    />
                                </lable>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400076/*商检单价*/)}</label>
                                <input type='text'
                                       className={getFieldError("products[" + i + "].ciPrice") ? 'col-md-8 col-lg-8 text-input-nowidth error-border' : 'col-md-8 col-lg-8 text-input-nowidth'}
                                       {...getFieldProps("products[" + i + "].ciPrice", {
                                           validateFirst: true,
                                           rules: [{required: true, pattern: xt.pattern.positiveNonZero}],
                                           initialValue: e.ciPrice ? e.ciPrice : ''
                                       })} />
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(400077/*境内货源地*/)}</label>
                                <input type='text' className={'col-md-8 col-lg-8 text-input-nowidth'}
                                       {...getFieldProps("products[" + i + "].domcSupply", {
                                           initialValue: e.domcSupply ? e.domcSupply : ''
                                       })}/>
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(400012/*品牌*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 isRequest={Boolean(getFieldValue("products[" + i + "].mtlId", e).mtlId && getFieldValue("vndBeId", PurOrder).vndBeId)}
                                                 refreshMark={getFieldValue("products[" + i + "].mtlId", e).mtlId + getFieldValue("vndBeId", PurOrder).vndBeId}
                                                 pbj={{
                                                     apiType: apiGet,
                                                     host: API_FOODING_DS,
                                                     uri: '/manufty/getBrandsVndMtl',
                                                     params: {
                                                         mtlId: getFieldValue("products[" + i + "].mtlId", e).mtlId,
                                                         vndId: getFieldValue("vndBeId", PurOrder).vndBeId
                                                     }
                                                 }}
                                                 allowClear
                                                 fieldName={"products[" + i + "].brandId"}
                                                 initValueOptions={[]}
                                                 optionValue={da => <Option key={da.id} objValue={{
                                                     brandId: da.id,
                                                     brandLcName: da.localName,
                                                     brandEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 initialValue={{
                                                     brandId: e.brandId,
                                                     brandLcName: e.brandLcName,
                                                     brandEnName: e.brandEnName,
                                                     s_label: e.brandLcName
                                                 }}
                                                 className={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(400078/*清关*/) + 'HSCODE'}</label>
                                <input type='text' className={'col-md-8 col-lg-8 text-input-nowidth'}
                                       {...getFieldProps("products[" + i + "].chgHsCode", {
                                           initialValue: e.chgHsCode ? e.chgHsCode : ''
                                       })}/>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(400079/*清关品名*/)}</label>
                                <input type='text' className={'col-md-8 col-lg-8 text-input-nowidth'}
                                       {...getFieldProps("products[" + i + "].changeMtlName", {
                                           initialValue: e.changeMtlName ? e.changeMtlName : ''
                                       })}/>
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(400080/*产品销售员*/)}</label>
                                <input type='text' disabled {...getNFieldProps("products[" + i + "].vndSlinkerId", {
                                    initialValue: xt.initLabelValue(e.vndSlinkerId && getFieldValue("products[" + i + "].mtlId", e).mtlId === e.mtlId && PurOrder.vndBeId === getFieldValue('vndBeId', PurOrder).vndBeId, e, ['vndSlinkerId', 'vndSlinkerLcName', 'vndSlinkerEnName'], 'vndSlinkerLcName', this.props.form)
                                })}
                                       className="col-md-8 col-lg-8 text-input-nowidth"
                                />
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(400081/*产品操作员*/)}</label>
                                <input type='text' disabled {...getNFieldProps("products[" + i + "].vndOlinkerId", {
                                    initialValue: xt.initLabelValue(e.vndOlinkerId && getFieldValue("products[" + i + "].mtlId", e).mtlId === e.mtlId && PurOrder.vndBeId === getFieldValue('vndBeId', PurOrder).vndBeId, e, ['vndOlinkerId', 'vndOlinkerLcName', 'vndOlinkerEnName'], 'vndOlinkerLcName', this.props.form)
                                })}
                                       className="col-md-8 col-lg-8 text-input-nowidth"
                                />
                            </div>
                            <div className="form-group col-md-3 col-lg-3">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(600187/*不退税*/)}</label>
                                <lable className={'col-md-4 col-lg-4'} style={{marginTop: '6px'}}>
                                    <Checkbox {...getFieldProps("products[" + i + "].noTax", {
                                        initialValue: e.noTax ? e.noTax : false
                                    })}
                                              checked={getFieldValue("products[" + i + "].noTax")}
                                    />
                                </lable>
                            </div>
                        </div>
                    </div>
                })
            })
        }

        return (<div className={'addnormal'} style={{margin: '10px 0'}}>
            <div className={'addnormal-title'} style={{marginBottom: '10px'}}>
                <span>{I18n.t(400082/*产品信息*/)}</span>
            </div>
            <TabSwitch TabSwitchArray={array} onRequierAddClick={this.props.onRequierAddClick}
                       onCloseClick={this.props.onCloseClick}
                       requireAddIcon={!((PurOrder.products && PurOrder.products[0].sourceNo !== null) || (PurOrder.type && PurOrder.type === 1))}
                       requireCloseIcon={!((PurOrder.products && PurOrder.products[0].sourceNo !== null) || (PurOrder.type && PurOrder.type === 1))}
                       onTabClick={this.props.onTabClick}/>
        </div>)
    }
}

export default NewProductInfomationEditAdd;


/*<Select
	disabled = {e.sourceNo !== null}
	animation='slide-up'
	placeholder={i18n.t(200994*/
/*请选择*/
/*)}
	className ={getFieldError("products["+ i+ "].mtlId")?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
	choiceTransitionName="rc-select-selection__choice-zoom"
	optionLabelProp="children"
	optionFilterProp='children'
	onSearch={this.props.noId?that.props.onProductChange.bind(this,i):()=>{}}
	onSelect={that.props.onProductSelect.bind(this,i)}
	onClick={that.props.ProductClick.bind(this,i)}
	allowClear={false}
	{...getNFieldProps("products["+ i+ "].mtlId", {
		validateFirst: true,
		rules: [{required:true,}], 
		initialValue:e.mtlId?{mtlId:e.mtlId,mtlLcName:e.mtlLcName,mtlEnName:e.mtlEnName,s_label:e.mtlLcName}:undefined
	})}
>
	{this.props.productSelectData.map(
		da => <Option key={da.id} objValue={{
				mtlId: da.id,
				mtlLcName: da.localName,
				mtlEnName: da.name,
				s_label: da.localName
		}}>{da.localName}</Option>
	)}
</Select>*/

