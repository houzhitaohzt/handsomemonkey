import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../components/Form';
import {ConstVirtualSelect} from '../../../../components/Select';
//引入select插件
import xt from '../../../../common/xt';
import {errorTips, successTips} from '../../../../components/ServiceTips'; // 提示
import {API_FOODING_ES, apiPost} from '../../../../services/apiCall';

export class NormalDialog extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = {
            countryNowID: '',

        }
    }

    onSaveAndClose() {
        let {form, onSaveAndClose, data} = this.props;
        form.validateFields((errors, value) => {
            if (errors) {

            } else {
                apiPost(API_FOODING_ES, '/party/save', Object.assign({},data.name.responseData.party,value), response => {
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

    render() {
        let that = this;
        const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
        let {data} = this.props;
        let responseData = data.name.responseData;
        let iconArray = [{type: 'add', onClick: this.addClick}];
        let content;
        responseData.party=responseData.party||{};
        responseData.party.warehouse = responseData.party.warehouse ||{};
        responseData.party.exRateType = responseData.party.exRateType||{};
        if (data.name.title == i18n.t(100138/*常规*/)) {
            content = (
                <div className="girdlayout scroll">
                    <div className={'row'}>
                        <div className="form-group col-xs-4 col-md-4">
                            <label className={'col-xs-4 col-md-4'}>{data.name.data[0].key}</label>
                            <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'} disabled
                                   value={responseData.party.name ? responseData.party.name : ''}
                                   />
                        </div>
                        <div className="form-group col-xs-4 col-md-4">
                            <label className={'col-xs-4 col-md-4'}>{data.name.data[1].key}</label>
                            <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
                                  
                                   {...getFieldProps('enName', {
                                       validateFirst: true,
                                       rules: [{required: false,}],
                                       valuedateTrigger: 'onBlur',
                                       initialValue: responseData.party.enName ? responseData.party.enName : ''
                                   })} />
                        </div>
                        <div className="form-group col-xs-4 col-md-4">
                            <label className={'col-xs-4 col-md-4'}>{data.name.data[2].key}</label>
                            <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
                                   disabled value={responseData.party.country&&responseData.party.country.localName ?responseData.party.country.localName : ''}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-xs-4 col-md-4">
                            <label className={'col-xs-4 col-md-4'}>{data.name.data[4].key}</label>
                            <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'} disabled
                                   value={xt.getItemValue(responseData, 'party.business.name', '')}
                            />
                        </div>
                        <div className="form-group col-xs-3 col-md-3">
                            <label className={'col-xs-4 col-md-4'}>{data.name.data[5].key}</label>
                            <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
                                   placeholder=""
                                   {...getFieldProps('registeredCapital', {
                                       validateFirst: true,
                                       rules: [{required: true,}],
                                       valuedateTrigger: 'onBlur',
                                       initialValue: responseData.party.registeredCapital ? responseData.party.registeredCapital : ''
                                   })} />
                        </div>
                        <div className="form-group col-xs-1 col-md-1">
                            <div className="col-xs-2 col-md-2"></div>
                            <ConstVirtualSelect
                                    form={this.props.form}
                                    fieldName="currencyId"
                                    apiType={apiPost}
                                    apiParams='com.fooding.fc.ds.entity.Curren'
                                    initValueOptions={responseData.party.curren?[responseData.party.curren]:[]}
                                    initialValue={responseData.party.curren&&responseData.party.curren.id ? responseData.party.curren.id:""}
                                    className="col-xs-10 col-md-10"
                            />
                        </div>
                        <div className="form-group col-xs-4 col-md-4">
                            <label className={'col-xs-4 col-md-4'}>{data.name.data[6].key}</label>
                            <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'} 
                                        {...getFieldProps('leglpsn',{
                                                    initialValue:responseData.party.leglpsn ? responseData.party.leglpsn:''
                                                   
                                        })}
                                   />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-xs-4 col-md-4">
                            <label className={'col-xs-4 col-md-4'}>{data.name.data[7].key}</label>
                            <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
                                   disabled value={responseData.party.partyType ? responseData.party.partyType.name : ''}
                            />
                        </div>
                        <div className="form-group col-xs-4 col-md-4">
                            <label className={'col-xs-4 col-md-4'}>{data.name.data[8].key}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                fieldName="frExsRatType"
                                apiType={apiPost}
                                pageSize={6}
                                apiParams="com.fooding.fc.enumeration.ExRateType"
                                initialValue={{frExsRatType:responseData.party.exRateType.id,s_label:responseData.party.exRateType.name}}
                            />
                        </div>
                        <div className="form-group col-xs-4 col-md-4">
                            <label className={'col-xs-4 col-md-4'}>{data.name.data[9].key}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                fieldName="warehouseId"
                                apiType={apiPost}
                                pageSize={6}
                                apiParams="com.fooding.fc.ds.entity.StorLocatn"
                                initialValue={{warehouseId:responseData.party.warehouse.id,s_label:responseData.party.warehouse.name}}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-xs-4 col-md-4">
                            <label className={'col-xs-4 col-md-4'}>{data.name.data[3].key}</label>
                            <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
                                        {...getFieldProps('enterpriseTaxId',{
                                                    initialValue:responseData.party.enterpriseTaxId? responseData.party.enterpriseTaxId:''
                                                   
                                        })}
                                 
                            />
                        </div>
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
}
NormalDialog.propTypes = {
    onSaveAndClose: PropTypes.func,
    onCancel: PropTypes.func
};
NormalDialog.defaultProps = {
    onSaveAndClose(){
    },
    onCancel(){
    }
};
const DialogFrom = createForm()(NormalDialog);
export default DialogFrom;
