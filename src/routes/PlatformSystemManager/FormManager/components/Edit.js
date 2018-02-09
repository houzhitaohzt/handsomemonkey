import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, {Option, ConstMiniSelect} from '../../../../components/Select';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import Calendar from  '../../../../components/Calendar/Calendar';
import Input from '../../../../components/FormValidating/FormValidating';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS} from '../../../../services/apiCall';
import AddMoreLanguage from "../../../../components/AddMoreLanguage";
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
            if (errors) {

            }else{
                if(this.props.DialogContent == 1){
                    let params = this.props.form.getFieldsValue();
                    delete params['id'];
                    delete params['nameValues'];
                    this.props.onSaveAndClose(params,{},isAdd);
                }else{
                    this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
                }this.props.form.resetFields();

                
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
        const {getFieldProps, getFieldErrorStyle} = this.props.form;
        let {checkedData} = this.props;
        let content = <div></div>;
        if (this.props.DialogContent == 1) {
            content = (
                <div className={'addnormal'} style={{marginBottom: '10px'}}>
                    <div className={'  girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200885/*表单名*/)}</label>
                                <Input form={this.props.form} obj={{
                                    name: 'name', type: 'text',
                                    initialValue: '',
                                    classn: 'col-md-9 col-lg-9 text-input-nowidth'
                                }}/>
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200886/*表单标识*/)}</label>
                                <Input form={this.props.form} obj={{
                                    name: 'identity', type: 'text',
                                    initialValue: '',
                                    classn: 'col-md-9 col-lg-9 text-input-nowidth'
                                }}/>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200747/*所属系统*/)}</label>
                                <ConstMiniSelect form={this.props.form} reles={true} pbj='com.fooding.fc.enumeration.Module' fieldName="moduleId" initialValue=''
                                                 className = 'currency-btn select-from-currency col-xs-9 col-md-9'/>
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200887/*权限控制*/)}</label>
                                <ConstMiniSelect form={this.props.form} reles={true} pbj='com.fooding.fc.enumeration.AclType' fieldName="aclTypeId" initialValue=''
                                                 className = 'currency-btn select-from-currency col-xs-9 col-md-9'/>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }else if (this.props.DialogContent == 3) {
             getFieldProps('id', {
                                            validateFirst: true,
                                            initialValue:checkedData? checkedData.id:''
            })
            getFieldProps('nameValues', {
                                            validateFirst: true,
                                            initialValue:checkedData? checkedData.nameValues:''
            })
            getFieldProps('name',{
                        validateFirst: true,
                        initialValue:checkedData? checkedData.name:''
            })
            content = (
                <div className={'addnormal'} style={{marginBottom: '10px'}}>
                    <div className={'  girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200885/*表单名*/)}</label>
                                <Input form={this.props.form} obj={{
                                    name: 'localName', type: 'text',
                                    initialValue: checkedData.localName,
                                    classn: 'col-md-9 col-lg-9 text-input-nowidth'
                                }}/>
                                <AddMoreLanguage
                                    menusetView={checkedData}
                                    object = {'form'}
                                    upload={this.props.upload}
                                    onCancel ={this.onCancel}
                                    apiHost={API_FOODING_ES}
                                    isShowId={true}
                                />
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200886/*表单标识*/)}</label>
                                <input type="text" {...getFieldProps('identity', {
                                    initialValue: checkedData.identity
                                })} className={'col-md-9 col-lg-9 text-input-nowidth'}/>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200747/*所属系统*/)}</label>
                                <ConstMiniSelect form={this.props.form} pbj='com.fooding.fc.enumeration.Module' fieldName="moduleId"
                                                 initValueOptions={checkedData.module?[checkedData.module]: []}
                                                 initialValue={checkedData.moduleId || undefined} reles={true}
                                                 className = 'currency-btn select-from-currency col-xs-9 col-md-9'/>
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200887/*权限控制*/)}</label>
                                <ConstMiniSelect form={this.props.form} pbj='com.fooding.fc.enumeration.AclType' fieldName="aclTypeId"
                                                 initValueOptions={checkedData.aclType?[checkedData.aclType]: [{name: 'a', id: 30}]}
                                                 initialValue={checkedData.aclTypeId || undefined} reles={true}
                                                 className = 'currency-btn select-from-currency col-xs-9 col-md-9'/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if (this.props.DialogContent == 4) {
            content = (
                <div className='scroll lose'>
							<span>
								<i>*</i>
								失效原因
							</span>
                    <Select
                        placeholder={''}
                        style={{width: 450}}
                        getPopupContainer={this.getPopupContainer}
                    >
                        <Option value={'111111'}>11</Option>
                    </Select>
                </div>
            )
        } else if (this.props.DialogContent == 5) {

            content = (
                <div className={'girdlayout scroll'} style={{overflow: 'auto'}}>
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}>{i18n.t(200885/*表单名*/)}</label>
                            <div className={'col-xs-9 col-md-9'}>
                                <p>{checkedData.record.localName}</p>
                            </div>
                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}>{i18n.t(200886/*表单标识*/)}</label>
                            <div className={'col-xs-9 col-md-9'}>
                                <p>{checkedData.record.identity}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}>{i18n.t(200747/*所属系统*/)}</label>
                            <div className={'col-xs-9 col-md-9'}>
                                <p>{checkedData.record.module ? checkedData.record.module.name: ''}</p>
                            </div>
                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}>{i18n.t(200887/*权限控制*/)}</label>
                            <div className={'col-xs-9 col-md-9'}>
                                <p>{checkedData.record.aclType? checkedData.record.aclType.name: ''}</p>
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
                    showSaveAdd={this.props.showSaveAdd}
                    showSaveClose={this.props.showSaveClose}>
                    {content}
                </FormWrapper>
            </div>
        )
    }
}
const ProductForm = createForm()(NumberSPlug);
export default ProductForm;
