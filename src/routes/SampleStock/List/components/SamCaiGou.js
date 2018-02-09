import i18n from '../../../../lib/i18n';
import React, {Component} from 'react';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import {createForm, FormWrapper} from '../../../../components/Form';
import {ConstMiniSelect, Option} from '../../../../components/Select';
// ajax
import {API_FOODING_ERP, apiForm, apiPost} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

const {Table} = require("../../../../components/Table");

class SamCaiGou extends Component {
    constructor(props) {
        super(props);

        this.onSaveAndClose = this.onSaveAndClose.bind(this); // 保存
        this.onCancel = this.onCancel.bind(this);
        let that = this;

        this.state = {
            paddingTop: 0,
            scroll: 0,
            scrollHeight: 0
        }
    }

    // 保存
    onSaveAndClose() {
        let that = this;
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if (errors) {
            } else {
                apiForm(API_FOODING_ERP, '/specimen/purchase',
                    {id: this.props.productData.billDtlId},
                    (response) => {
                        ServiceTips({text: response.message, type: 'success'});
                        that.props.form.resetFields(); // 清除表单
                        that.props.onSaveAndClose(); // 关闭弹框
                    }, (errors) => {
                        ServiceTips({text: errors.message, type: 'error'});
                    });
            }
        })

    }

    // 取消
    onCancel() {
        this.props.form.resetFields(); // 清除表单
        this.props.onSaveAndClose(); // 关闭弹框
    }

    handleResize(height) {
        this.setState({
            paddingTop: !this.state.paddingTop
        });
        let padding = 80;
        let sch = document.body.offsetHeight - height - padding;
        let scroll = sch - 135;

        this.setState({scrollHeight: sch + 'px', scroll: scroll});
    }

    componentDidMount() {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }

    componentWillReceiveProps(nextProps) {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }

    render() {
        
        let {businessOne, productData} = this.props;
        let {getNFieldProps, getFieldProps, getFieldError, getFieldValue} = this.props.form;
        return (
            <div className="package-action-buttons">
                <FormWrapper showFooter={true} buttonLeft={this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose}
                             onCancel={this.onCancel}>
                    <div style={{height:150}}>
                        <div className={'girdlayout'} >
                            <div className={'row'}>
                                <div className="form-group col-md-4">
                                    <label className={'col-md-4'}>{i18n.t(100379/*产品*/)}</label>
                                    <input disabled type="text" className={'col-md-8 text-input-nowidth'} placeholder=""
                                           value={String(productData.mtlLcName || '')}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className={'col-md-4'}>{i18n.t(200173/*样品数量*/)}</label>
                                    <input disabled type="text" className={'col-md-8 text-input-nowidth'} placeholder=""
                                           value={String(productData.sendQty || '')}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className={'col-md-4'}>{i18n.t(400035/*产品单位*/)}</label>
                                    <input disabled type="text" className={'col-md-8 text-input-nowidth'} placeholder=""
                                           value={String(productData.uomLcName || '')}
                                    />
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className="form-group col-md-4">
                                    <label className={'col-md-4'}>HSCODE</label>
                                    <input disabled type="text" className={'col-md-8 text-input-nowidth'} placeholder=""
                                           value={String(productData.hsCode || '')}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className={'col-md-4'}>{i18n.t(100382/*产品规格*/)}</label>
                                    <input disabled type="text" className={'col-md-8 text-input-nowidth'} placeholder=""
                                           value={String(productData.basSpeci || '')}
                                    />
                                </div>
                                {false ? <div className="form-group col-md-4">
                                    <label className={'col-md-4'}><span>*</span>{i18n.t(200177/*样品库*/)}</label>
                                    <ConstMiniSelect form={this.props.form}
                                                     pbj={{
                                                         params: {
                                                             obj: 'com.fooding.fc.ds.entity.StorLocatn',
                                                             queryParams: [
                                                                 {
                                                                     attr: 'ccid',
                                                                     expression: '=',
                                                                     value: businessOne.ccId || ""
                                                                 },
                                                                 // { attr:'plntId',  expression:'=', value:businessOne.plantId || ""}
                                                             ]
                                                         }
                                                     }} fieldName="slId"
                                                     optionValue={(da, di) => <Option key={di} objValue={{
                                                         slId: da.id,
                                                         slLcName: da.localName,
                                                         slEnName: da.name,
                                                         s_label: da["localName"]
                                                     }}>{da.localName}</Option>}
                                    />
                                </div>:''
                                }
                            </div>
                        </div></div>
                </FormWrapper>
            </div>
        );

    }

}

export default NavConnect(createForm()(SamCaiGou));

