import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import RightKey from '../../../../components/RightKey/RightKey';
import {createForm, FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, {Option, ConstMiniSelect} from './../../../../components/Select';
import Calendar from  '../../../../components/Calendar/Calendar';
import Checkbox from '../../../../components/CheckBox';
import ServiceTips, {errorTips, successTips} from '../../../../components/ServiceTips'; // 提示
import {apiPost,API_FOODING_DS, API_FOODING_ES, apiGet} from '../../../../services/apiCall';

export class NormalDialog extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = {}
    }

    render() {
        let that = this;
        const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
        let {data} = this.props;
        let responseData = data.name.responseData;
        let iconArray = [{type: 'add', onClick: this.addClick}];
        let content;
        let typeId = getFieldValue('typeId', xt.getItemValue(responseData, 'party.typeId', ''));
        if (data.name.title == i18n.t(100138/*常规*/)) {
            content = (
                <div className="girdlayout">
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}><span>*</span>{data.name.data[0].key}</label>
                            <input type='text' className={getFieldError("name")?'col-xs-9 col-md-9 text-input-nowidth error-border':'col-xs-9 col-md-9 text-input-nowidth'}
                                   placeholder=""
                                   disabled
                                   {...getFieldProps('name', {
                                       validateFirst: true,
                                       rules: [{required: true,}],
                                       valuedateTrigger: 'onBlur',
                                       initialValue: '' + data.name.data[0].value
                                   })} />
                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}><span>*</span>{data.name.data[1].key}</label>
                            <ConstMiniSelect form={this.props.form} pbj={{
                                    apiType: apiGet,
                                    host: API_FOODING_ES,
                                    uri: '/party/getPartyTypes',
                                    params: {parentId: responseData.party.parentId}
                                }} fieldName="typeId" initValueOptions={[responseData.party.partyType]}
                                 className = 'currency-btn select-from-currency col-xs-9 col-md-9'
                                initialValue={responseData.party.typeId ? responseData.party.typeId : ''} reles={true}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}>{data.name.data[2].key}</label>
                            <input type='text' className={'col-xs-9 col-md-9 text-input-nowidth'}
                                   placeholder=""
                                   {...getFieldProps('enName', {
                                      initialValue: responseData.party.enName || ''
                                   })} />
                        </div>
                        {
                            typeId == 50 || typeId == 40 ? <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}><span>*</span>{typeId == 50 ? i18n.t(400269/*岗位属性*/) : i18n.t(400270/*部门属性*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 refreshMark={getFieldValue("typeId", typeId)}
                                                 pbj={{
                                                     apiType: apiPost,
                                                     host: API_FOODING_DS,
                                                     uri: "/object/getMiniList",
                                                     params:  typeId  == 50 ? "com.fooding.fc.ds.entity.Positn" : "com.fooding.fc.ds.entity.Depmnt"
                                                 }}
                                                 fieldName="typeAttributeId"
                                                 optionValue={'code'}
                                                 initValueOptions={typeId  == 50 ? (responseData.party.positn ? [responseData.party.positn] : []) : (responseData.party.depmnt ? [responseData.party.depmnt] : [])}
                                                 className='currency-btn select-from-currency col-xs-9 col-md-9'
                                                 initialValue={typeId == 50 ? xt.getItemValue(responseData, 'party.positn.code', '') : xt.getItemValue(responseData, 'party.depmnt.code', '')}
                                                 reles={true}/>
                            </div> : null
                        }
                    </div>
                </div>
            );
        }
        return (
            <div className="action-normal-buttons">
                <FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
                    {content}
                </FormWrapper>
            </div>
        );
    }

    onSaveAndClose() {
        let {form, onSaveAndClose, data} = this.props;
        form.validateFields((errors, value) => {
            if (errors) {

            } else {

                apiPost(API_FOODING_ES, '/party/save', Object.assign(
                    {},
                    data.name.responseData.party,
                    value
                ), response => {
                    successTips("保存成功!");
                    onSaveAndClose && onSaveAndClose();
                    form.resetFields();
                }, error => {
                    errorTips("保存失败!");
                })
            }
        })
    }

    onCancel() {
        const {onCancel} = this.props;
        if (onCancel) {
            onCancel();
        }
    }
}
NormalDialog.propTypes = {
    onSaveAndClose: PropTypes.func,
    onCancel: PropTypes.func
}
NormalDialog.defaultProps = {
    onSaveAndClose(){
    },
    onCancel(){
    }
}
const DialogFrom = createForm()(NormalDialog);
export default DialogFrom;
