import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, {Option, ConstMiniSelect} from '../../../../../components/Select';
import Checkbox from '../../../../../components/CheckBox';
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
} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';

import {I18n} from '../../../../../lib/i18n';

export class ProPackDialog extends Component {
    constructor(props) {
        super(props);
        this.onCancel = this.onCancel.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.state = this.initState();
        this.data = {};
    }

    onSaveAndClose() {
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if (errors) {

            } else {
                this.props.onSaveAndClose(this.props.form.getFieldsValue(), this.data);
                this.props.form.resetFields();
            }
        })
    }

    onCancel() {
        const {onCancel} = this.props;
        if (onCancel) {
            onCancel();
            this.props.form.resetFields();
        }

    }

    initState() {
        return {
            getOne: {}
        }
    }

    //选择某一个产品包装
    onPackNameSelect = data => {
        if (!data) return;
        apiGet(API_FOODING_DS, "/packaging/getOne", {id: data}, response => {
            let getOne = response.data || {};
            // this.setState({getOne})
            this.props.form.setFieldsValue({
                "wtUomId": getOne.weight && getOne.weight.id || "",
                volUomId: getOne.volume && getOne.volume.id || '',
                netWtNum: getOne.lodWtNum || "",
                grosWtNum: parseInt(getOne.netWtNum + getOne.lodWtNum) || '',
                volNum: getOne.volNum || '',
                wrapgWtnum: getOne.netWtNum || ''
            });
        }, error => ServiceTips({text: error.message, type: error}))
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextPorps) {

    }

    render() {
        let content;
        const {getFieldProps, getFieldError, getNFieldProps} = this.props.form;
        let {data, id} = this.props;
        let initData = this.props.initData || {};

        //产品包装
        let {pack = {}} = initData;
        let packagingsPack = initData.packagings;
        let unitofmeasPack = initData.unitofmeas;
        this.data = Object.assign({}, pack);
        if (data.number == 0 || data.number == 1) {
            content = (<div className={'  girdlayout'}>
                <div className={'row'}>
                    <div className="form-group col-md-4 col-lg-4">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100596/*包装名称*/)}</label>
                        <Select
                            animation='slide-up'
                            placeholder={""}
                            className={getFieldError('packId') ? 'currency-btn select-from-currency col-md-8 col-lg-8 error-border' : 'currency-btn select-from-currency col-md-8 col-lg-8'}
                            choiceTransitionName="rc-select-selection__choice-zoom"
                            optionLabelProp="children"
                            allowClear={false}
                            {...getNFieldProps('packId', {
                                validateFirst: true,
                                rules: [{required: true,}],
                                initialValue: pack && pack.packaging ? pack.packaging.id : undefined
                            })}
                            onSelect={this.onPackNameSelect}
                        >
                            {
                                packagingsPack.map((e, i) => {
                                    return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
                                })
                            }
                        </Select>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-5 col-lg-5'}><span>*</span>{I18n.t(100040/*重量单位*/)}</label>
                        <Select
                            animation='slide-up'
                            placeholder={""}
                            className={getFieldError('wtUomId') ? 'currency-btn select-from-currency col-md-7 col-lg-7 error-border' : 'currency-btn select-from-currency col-md-7 col-lg-7'}
                            choiceTransitionName="rc-select-selection__choice-zoom"
                            optionLabelProp="children"
                            allowClear={false}
                            {...getNFieldProps('wtUomId', {
                                rules: [{required: true,}],
                                valuedateTrigger: "onBlur",
                                initialValue: pack && pack.wtUomId ? pack.wtUomId : undefined
                            })}
                        >
                            {
                                unitofmeasPack.map((e, i) => {
                                    return (<Option key={i} value={e.id} title={e.name}>{e.name}</Option>)
                                })
                            }
                        </Select>
                    </div>
                    <div className="form-group col-md-2 col-lg-2">
                        <label className={'col-md-6 col-lg-6'}><span>*</span>{I18n.t(100551/*净重量*/)}</label>
                        <input type="text" {...getNFieldProps('netWtNum', {
                            rules: [{required: true,}],
                            valuedateTrigger: "onBlur",
                            initialValue: String(pack.netWtNum || "")
                        })}
                               className={getFieldError('netWtNum') ? 'col-md-6 col-lg-6 text-input-nowidth error-border' : 'col-md-6 col-lg-6 text-input-nowidth'}
                               placeholder={""}/>
                    </div>
                    <div className="form-group col-md-2 col-lg-2">
                        <label className={'col-md-6 col-lg-6'}><span>*</span>{I18n.t(100553/*毛重量*/)}</label>
                        <input type="text" {...getNFieldProps('grosWtNum', {
                            rules: [{required: true,}],
                            valuedateTrigger: "onBlur",
                            initialValue: String(pack.grosWtNum || "")
                        })}
                               className={getFieldError('grosWtNum') ? 'col-md-6 col-lg-6 text-input-nowidth error-border' : 'col-md-6 col-lg-6 text-input-nowidth'}
                               placeholder={''}/>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-4 col-lg-4">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100039/*自重*/)}</label>
                        <input type="text" {...getNFieldProps('wrapgWtnum', {
                            rules: [{required: true,}],
                            valuedateTrigger: "onBlur",
                            initialValue: String(pack.wrapgWtnum || '')
                        })}
                               className={getFieldError('wrapgWtnum') ? 'col-md-8 col-lg-8 text-input-nowidth error-border' : 'col-md-8 col-lg-8 text-input-nowidth'}
                               placeholder={""}/>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-5 col-lg-5'}><span>*</span>{I18n.t(100426/*体积单位*/)}</label>
                        <Select
                            animation='slide-up'
                            placeholder={""}
                            className={getFieldError('volUomId') ? 'currency-btn select-from-currency col-md-7 col-lg-7 error-border' : 'currency-btn select-from-currency col-md-7 col-lg-7'}
                            choiceTransitionName="rc-select-selection__choice-zoom"
                            optionLabelProp="children"
                            allowClear={false}
                            {...getNFieldProps('volUomId', {
                                rules: [{required: true,}],
                                valuedateTrigger: "onBlur",
                                initialValue: pack && pack.volUomId || undefined
                            })}
                        >
                            {
                                unitofmeasPack.map((e, i) => {
                                    return (<Option key={i} value={String(e.id)} title={e.name}>{e.name}</Option>)
                                })
                            }
                        </Select>
                    </div>
                    <div className="form-group col-md-2 col-lg-2">
                        <label className={'col-md-6 col-lg-6'}><span>*</span>{I18n.t(100223/*体积量*/)}</label>
                        <input type="text" {...getNFieldProps('volNum', {
                            rules: [{required: true,}],
                            valuedateTrigger: "onBlur",
                            initialValue: String(pack.volNum || '')
                        })}
                               className={getFieldError('volNum') ? 'col-md-6 col-lg-6 text-input-nowidth error-border' : 'col-md-6 col-lg-6 text-input-nowidth'}
                               placeholder={""}/>
                    </div>
                    <div className="form-group col-md-2 col-lg-2">
                        <label className={'col-md-8 col-lg-8'}><span>*</span>{I18n.t(100557/*基础包装*/)}</label>
                        <Checkbox
                            {...getNFieldProps('basPackMrk', {
                                initialValue: pack && pack.basPackMrk ? pack.basPackMrk : false
                            })}
                            checked={this.props.form.getFieldValue("basPackMrk")}
                        />
                    </div>
                </div>
            </div>)
        }

        return (
            <FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
                {content}
            </FormWrapper>
        );
    }
}

const ProPackForm = createForm()(ProPackDialog);
export default ProPackForm;

