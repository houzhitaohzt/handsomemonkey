import i18n from './../../../../../lib/i18n';
import React, {Component} from "react";
import NavConnect from "../../../../../components/NavigateTabs/containers/AddContainer";
import {createForm, FormWrapper} from "../../../../../components/Form";
import DataTime from "../../../../../components/Calendar/Calendar";
import {ConstVirtualSelect,ConstMiniSelect} from "../../../../../components/Select";
import {API_FOODING_DS, API_FOODING_ERP, apiForm, apiGet, apiPost} from "../../../../../services/apiCall";
import {errorTips, successTips} from "../../../../../components/ServiceTips"; //提示框
import xt from "../../../../../common/xt";
import ProductSelect from "../../../../../components/FindGridSelect";

class BOEditOrg extends Component {
    constructor(props) {
        super(props);
        this.state = this.initState();
        this.onChange = this.onChange.bind(this);
    }

    initState() {
        return {
            billDtlId: null,
            businessOne: {},
            productOne: {},
        }
    }
    onChange(e){
            this.props.form.setFieldsValue({purchaseLaw:undefined});
            this.props.form.setFieldsValue({purchaseDate:undefined});
        
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
        apiGet(API_FOODING_ERP, '/business/mtl/getOne', {id: billDtlId},
            response => {
                this.setState({businessOne: response.data, productOne: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

    onProductChange = prod => {
        let salBeId = this.props.otherData.salBeId;
        apiGet(API_FOODING_DS, '/material/getProductInforErp', {
            id: prod.id, mtlType: 'mtl', sourceId: salBeId
        }, response => {
            let productOne = response.data;
            let businessOne = Object.assign(this.state.businessOne, this.props.form.getFieldValue('mtlId'), {
                profRate: productOne.profRate,
                ehProf: productOne.ehProf,
                profType: productOne.profTyp,
                profTypeName: productOne.profTypName
            });
            this.setState({productOne, businessOne});
            this.onCalculate({
                profRate: productOne.profRate,
                ehProf: productOne.ehProf,
                mtlId: prod.id,
                uomId: businessOne.uomId,
                packagId: businessOne.packagId,
                brandId: businessOne.brandId
            });
        }, (error) => {
            errorTips(error.message);
        })
    };

    /**
     * 利润率改变
     */
    onProfRateChange = e => {
        let value = e.target.value;
        this.onCalculate({profRate: value});
    };

    /**
     * 单位利润额
     */
    onEhProfChange = e => {
        let value = e.target.value;
        this.onCalculate({ehProf: value});
    };

    onProfTypeChange = profType => {
        let {form} = this.props;
        let {businessOne} = this.state;
        let fobCostPrc = parseInt(profType.profType) === businessOne.profType ? String(businessOne.fobCostPrc || '') : '';
        form.setFieldsValue({fobCostPrc, fobSalePrc: ''});
        if (parseInt(profType.profType) === 10) {
            this.onCalculate({profRate: businessOne.profType || '', ehProf: ''});
        } else {
            this.onCalculate({ehProf: businessOne.ehProf || '', profRate: ''});
        }
    };

    onPrcChange = (key, value) => {
          let {form} = this.props;
        if(value == undefined){
             form.setFieldsValue({fobSalePrc:'', agg: '',brandId:''});
             this.onCalculate({});
        }else{
            this.onCalculate({[key]: value[key]});
        }
        
    };

    /**
     * 计算价格
     */
    onCalculate = ({mtlId, uomId, packagId, brandId, ehProf, profRate}) => {
        let {getFieldValue, setFieldsValue} = this.props.form;
        mtlId = mtlId || getFieldValue('mtlId', {}).mtlId;
        uomId = uomId || getFieldValue('uomId', {}).uomId;
        packagId = packagId || getFieldValue('packagId', {}).packagId;
        brandId = brandId || getFieldValue('brandId', {}).brandId || '';

        profRate = xt.isEmpty(profRate) ? getFieldValue('profRate') : profRate;
        ehProf = xt.isEmpty(ehProf) ? getFieldValue('ehProf') : ehProf;

        if (!mtlId || !uomId || !packagId || (!profRate && !ehProf)) return;

        apiForm(API_FOODING_ERP, '/business/calculate', {
            mtlId, uomId, packagId, brandId,
            cnyId: this.props.otherData.cnyId,
            ehProf, profRate
        }, ({data}) => {
            let fobSalePrc = data.fobSalePrc || '';
            setFieldsValue({fobCostPrc: data.fobCostPrc || '', fobSalePrc});
            this.fobSalePrcChange(null, fobSalePrc);
        }, (error) => {
            errorTips(error.message);
        })
    };

    onSaveAndClose = () => {
        let {form, onSaveAndClose, otherData} = this.props;
        let {businessOne, productOne} = this.state;

        form.validateFields((error, values) => {
            if (!error) {
                let params = Object.assign({
                    basSpeci: productOne.basSpeci, billId: otherData.billId, hsCode: productOne.hsCode,
                    cnyId: otherData.cnyId, cnyLcName: otherData.cnyLcName, cnyEnName: otherData.cnyEnName
                }, businessOne, values);
                //delete params[params.purchaseType === 2 ? 'purchaseDate' : 'purchaseLaw'];
                apiPost(API_FOODING_ERP, '/business/mtl/save', params,
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

    fobSalePrcChange = (e, value) => {
        value = xt.isEmpty(value) ? e.target.value : value;
        let qty = this.props.form.getFieldValue('needQty');
        if (qty && value && !isNaN(qty) && !isNaN(value)) {
            this.props.form.setFieldsValue({agg: (parseFloat(qty) * parseFloat(value)).toFixed(6)});
        } else {
            this.props.form.setFieldsValue({agg: ''});
        }
    };

    needQtyChange = e => {
        let value = e.target.value;
        let fob = this.props.form.getFieldValue('fobSalePrc');
        if (fob && value && !isNaN(fob) && !isNaN(value)) {
            this.props.form.setFieldsValue({agg: (parseFloat(fob) * parseFloat(value)).toFixed(6)});
        } else {
            this.props.form.setFieldsValue({agg: ''});
        }
    };

    render() {
        const {otherData, data, mainForm} = this.props;
        const {getFieldProps, getFieldError, getFieldValue, getNFieldProps, getFieldErrorStyle} = this.props.form;
        let record = data.number === 1 ? null : data.record;
        let {businessOne, productOne} = this.state;

        //getFieldProps('purchaseType', {initialValue: xt.isEmpty(businessOne.purchaseType) ? 2 : businessOne.purchaseType});
        let prodField = xt.initSelectValue(businessOne.mtlId, businessOne, ['mtlId', 'mtlLcName', 'mtlEnName'], 'mtlLcName', this.props.form);
        let prodFieldDa = getFieldValue('mtlId', {});

        getNFieldProps('mtlTyId', {
            initialValue: xt.initLabelValue(productOne.mtlTyId, productOne, ['mtlTyId', 'mtlTyLcName', 'mtlTyEnName'], 'mtlTyLcName', this.props.form)
        });
        return (

            <FormWrapper showFooter={true} showSaveAdd={false} onSaveAndClose={this.onSaveAndClose}
                         onCancel={this.onCancel}>
                <div className={'  girdlayout'}>
                    <div className={'row'}>
                        <div className="form-group col-md-4 col-lg-4">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100379/*产品*/)}</label>
                            <ProductSelect
                                ref="productSelect"
                                form={this.props.form}
                                width={'379%'}
                                enName="enName"
                                value={prodField.mtlId ? {
                                    localName: prodField.mtlLcName,
                                    id: prodField.mtlId, enName: prodField.mtlEnName, s_label: prodField.s_label
                                } : undefined}
                                onSelect={this.onProductChange}
                                className={'currency-btn select-from-currency text-input-nowidth'}
                                titleClass={"col-md-8 col-lg-8"}
                                params={{sourceId: mainForm.getFieldValue('salBeId', {}).salBeId}}
                                url='/beMtl/getMtlList'
                            />
                        </div>
                        <div className="form-group col-md-8 col-lg-8">
                            <label className={'col-md-2 col-lg-2'}><span>*</span>{i18n.t(100382/*产品规格*/)}</label>
                            <input type="text" disabled
                                   {...getFieldProps('basSpeci', {
                                       validateFirst: true,
                                       rules: [{required: true}],
                                       initialValue: String(productOne.basSpeci || ''),
                                   })}
                                   className={getFieldErrorStyle('basSpeci', 'error-border', 'col-md-10 col-lg-10 text-input-nowidth')}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-4 col-lg-4">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(500067/*包装*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form} disabled={!Boolean(prodFieldDa.mtlId)}
                                refreshMark={prodFieldDa.mtlId}
                                apiParams={{sourceId: prodFieldDa.mtlId}}
                                rules={Boolean(prodFieldDa.mtlId)}
                                apiUri="/pack/getList"
                                fieldName="packagId"
                                onChange={this.onPrcChange.bind(this, 'packagId')}
                                valueKeys={da => ({
                                    packagId: da.packaging.id,
                                    packagLcName: da.packaging.localName,
                                    packagEnName: da.packaging.name,
                                    s_label: da.packaging.localName
                                })}
                                initialValue={xt.initSelectValue(productOne.packagId, productOne, ['packagId', 'packagLcName', 'packagEnName'], 'packagLcName', this.props.form) }
                            />
                        </div>
                        <div className="form-group col-md-4 col-lg-4">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(400012/*品牌*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form} disabled={!Boolean(prodFieldDa.mtlId)}
                                refreshMark={prodFieldDa.mtlId}
                                apiParams={{mtlId: prodFieldDa.mtlId}}
                                rules={false}
                                apiUri="/manufty/getBrandsVndMtl"
                                fieldName="brandId"
                                onChange={this.onPrcChange.bind(this, 'brandId')}
                                valueKeys={da => ({
                                    brandId: da.id,
                                    brandLcName: da.localName,
                                    brandEnName: da.name,
                                    s_label: da.localName
                                })}
                               initialValue={xt.initSelectValue(productOne.brandId, productOne, ['brandId', 'brandLcName', 'brandEnName'], 'brandLcName', this.props.form) }
                            />
                        </div>
                        <div className="form-group col-md-4 col-lg-4">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500065/*需求数量*/)}</label>
                            <input type="text"
                                   className={getFieldErrorStyle('needQty', 'error-border', 'col-md-3 col-lg-3 text-input-nowidth')}
                                   {...getFieldProps('needQty', {
                                       validateFirst: true,
                                       rules: [{required: true, pattern: xt.pattern.positiveNonZero}],
                                       initialValue: String(businessOne.needQty || ''),
                                       onChange: this.needQtyChange
                                   })}
                            />
                            <label className="col-md-1 col-lg-1"><span>*</span></label>
                            <ConstVirtualSelect
                                form={this.props.form} disabled={!Boolean(prodFieldDa.mtlId)}
                                refreshMark={prodFieldDa.mtlId} rules={true}
                                apiParams={{sourceId: prodFieldDa.mtlId}}
                                apiUri="/measum/getList"
                                fieldName="uomId"
                                onChange={this.onPrcChange.bind(this, 'uomId')}
                                valueKeys={da => ({
                                    uomId: da.unitofmea.id,
                                    uomLcName: da.unitofmea.localName,
                                    uomEnName: da.unitofmea.name,
                                    s_label: da.unitofmea.localName
                                })}
                                initialValue={xt.initSelectValue(productOne.uomId, productOne, ['uomId', 'uomLcName', 'uomEnName'], 'uomLcName', this.props.form) }
                                className='col-md-4 col-lg-4'
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-4 col-lg-4">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(100422/*利润类型*/)}</label>
                            <ConstVirtualSelect
                                apiType={apiPost}
                                form={this.props.form}
                                apiParams='com.fooding.fc.enumeration.ProfitType'
                                fieldName="profType"
                                initialValue={xt.initSelectValue(businessOne.profType, businessOne, ['profType', 'profTypeName'], 'profTypeName', this.props.form)}
                                valueKeys={da => ({
                                    profType: da.id,
                                    profTypeName: da.name,
                                    s_label: da.name
                                })}
                                rules={true}
                                onChange={this.onProfTypeChange}
                                className='col-md-8 col-lg-8'
                            />
                        </div>
                        {
                            parseInt(getFieldValue('profType').profType) === 10 ?
                                <div className="form-group col-md-4 col-lg-4">
                                    <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200244/*利润率*/)}</label>
                                    <input type="text"
                                           className={getFieldErrorStyle('profRate', 'error-border', 'col-md-8 col-lg-8 text-input-nowidth')}
                                           disabled={!getFieldValue('profType').profType}
                                           {...getFieldProps('profRate', {
                                               validateFirst: true,
                                               rules: [{required: true, pattern: xt.pattern.positiveNonZero}],
                                               initialValue: String(businessOne.profRate || ''),
                                               onChange: this.onProfRateChange
                                           })}
                                    />
                                </div> :
                                <div className="form-group col-md-4 col-lg-4">
                                    <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200245/*单位利润额*/)}</label>
                                    <input type="text"
                                           className={getFieldErrorStyle('ehProf', 'error-border', 'col-md-8 col-lg-8 text-input-nowidth')}
                                           disabled={!getFieldValue('profType').profType}
                                           {...getFieldProps('ehProf', {
                                               validateFirst: true,
                                               rules: [{required: true, pattern: xt.pattern.positiveNonZero}],
                                               initialValue: String(businessOne.ehProf || ''),
                                               onChange: this.onEhProfChange
                                           })}
                                    />
                                </div>
                        }
                        <div className="form-group col-md-4 col-lg-4">
                            <label className={'col-md-4 col-lg-4'}>FOB成本价</label>
                            <input type="text" disabled
                                   className={getFieldErrorStyle('fobCostPrc', 'error-border', 'col-md-5 col-lg-5 text-input-nowidth')}
                                   {...getFieldProps('fobCostPrc', {
                                       validateFirst: true,
                                       rules: [{required: false}],
                                       initialValue: String(businessOne.fobCostPrc || ''),
                                   })}
                            />
                            <label className={'col-md-3 col-lg-3'} style={{textAlign: 'left'}}>&nbsp;&nbsp;{otherData.cnyLcName}</label>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-4 col-lg-4">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200071/*销售价*/)}</label>
                            <input type="text"
                                   className={getFieldErrorStyle('fobSalePrc', 'error-border', 'col-md-8 col-lg-8 text-input-nowidth')}
                                   {...getFieldProps('fobSalePrc', {
                                       validateFirst: true,
                                       rules: [{required: true, pattern: xt.pattern.positiveNonZero}],
                                       initialValue: String(businessOne.fobSalePrc || ''),
                                       onChange: this.fobSalePrcChange
                                   })}
                            />
                        </div>
                        <div className="form-group col-md-4 col-lg-4">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200246/*金额*/)}</label>
                            <input type="text" disabled className={'col-md-8 col-lg-8 text-input-nowidth'}
                                   {...getFieldProps('agg', {
                                       initialValue: Number.isFinite(businessOne.agg) ? String(businessOne.agg.toFixed(6)) : '',
                                   })}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-8 col-lg-8">
                            <label className={'col-md-2 col-lg-2'}>{i18n.t(200230/*客户目标价*/)}</label>
                            <input type="text"
                                   className={getFieldErrorStyle('customerPrc', 'error-border', 'col-md-4 col-lg-4 text-input-nowidth')}
                                   style={{marginRight: 10}}
                                   {...getFieldProps('customerPrc', {
                                       validateFirst: true,
                                       rules: [{required: false, pattern: xt.pattern.positiveNonZero}],
                                       initialValue: String(businessOne.customerPrc || ''),
                                   })}
                            />
                            <ConstVirtualSelect
                                form={this.props.form}
                                disabled={!Boolean(prodFieldDa.mtlId)}
                                pageSize={6}
                                apiType={apiPost}
                                refreshMark={prodFieldDa.mtlId}
                                apiParams={{
                                    "obj": "com.fooding.fc.ds.entity.Incotm",
                                    "queryParams": [{"attr": "incotmTyId", "expression": "=", "value": "10"}]
                                }}
                                clearable
                                fieldName="incotmId"
                                valueKeys={da => ({
                                    incotmId: da.id,
                                    incotmLcName: da.localName,
                                    incotmEnName: da.name,
                                    s_label: da.localName
                                })}
                                initialValue={xt.initSelectValue(businessOne.incotmId, businessOne, ['incotmId', 'incotmLcName', 'incotmEnName'], 'incotmLcName', this.props.form) }
                                className=' col-md-3 col-lg-3'
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-4 col-lg-4">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200113/*采购类型*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                                                 pbj={{
                                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                                     params: {obj: 'com.fooding.fc.enumeration.CycleType'}
                                                                 }} fieldName="purchaseType"
                                                                 initValueOptions={[]}
                                                                 initialValue={
                                                                    xt.initSelectValue(businessOne.purchaseType, {purchaseType:businessOne.purchaseType, purchaseTypeName:businessOne.purchaseTypeName}, ['purchaseType'], 'purchaseTypeName', this.props.form)
                                                                 }
                                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                                     purchaseType: da.id,
                                                                     s_label: da.name
                                                                 }}>{da.name}</Option>} reles ={true}
                                                                 onChange = {this.onChange}
                                                                 className ={'currency-btn select-from-currency col-md-8 '}
                                                        />
                        </div>
                        <div className="form-group col-md-4 col-lg-4">
                                    <label className={'col-md-4 col-lg-4'}><span className={getFieldValue("purchaseType",businessOne).purchaseType == 10?'':'none'}>*</span>{i18n.t(200114/*采购规律*/)}</label>
                                    <ConstVirtualSelect
                                        form={this.props.form}
                                        apiType={apiPost}
                                        initRequest
                                        pageSize={5}
                                        clearable
                                        apiParams="com.fooding.fc.enumeration.CycleRule"
                                        fieldName="purchaseLaw"
                                        clearable={false}
                                        disabled ={getFieldValue("purchaseType",businessOne).purchaseType == 20}
                                        rules={getFieldValue("purchaseType",businessOne).purchaseType == 10}
                                        initialValue={businessOne.purchaseLaw}
                                    />
                        </div>
                        <div className="form-group col-md-4 col-lg-4">
                            <label className={'col-md-5 col-lg-5'}><span className={getFieldValue("purchaseType",businessOne).purchaseType == 20?'':'none'}>*</span>{i18n.t(200115/*下次采购时间*/)}</label>
                            <div className={'col-md-7 col-lg-7'}>
                                <DataTime
                                    beginData={new Date()}
                                    showTime={false}
                                    isShowIcon={true}
                                    width={'100%'}
                                    form={this.props.form}
                                    name={'purchaseDate'}
                                    value={businessOne.purchaseDate}
                                     validate={getFieldValue("purchaseType",businessOne).purchaseType == 20}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <label className={'col-md-2 col-lg-2'} style={{width: 100}}>{i18n.t(100112/*特殊要求*/)}</label>
                        <input type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
                               style={{marginRight: 0, width: 784}}
                               {...getFieldProps('specReq', {
                                   initialValue: String(businessOne.specReq || ''),
                               })}
                        />
                    </div>
                </div>
            </FormWrapper>

        )
    }
}

export default NavConnect(createForm()(BOEditOrg));
