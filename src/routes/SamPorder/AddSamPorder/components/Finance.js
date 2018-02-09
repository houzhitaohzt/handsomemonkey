import i18n from './../../../../lib/i18n';
import React, {Component} from "react";
import {ConstVirtualSelect, Option} from '../../../../components/Select';
import {API_FOODING_DS, API_FOODING_ES, apiGet} from '../../../../services/apiCall';
import xt from '../../../../common/xt';

class Addnormal extends Component {
    constructor(props) {
        super(props)
        this.state = this.initState()
    }

    initState() {
        return {}
    }

    render() {
        const {form, businessOne = {}} = this.props;
        const {getFieldProps, getFieldError, getFieldValue, getNFieldProps} = form;
        return (
            <div className={'addnormal'} style={{marginTop: '10px'}}>
                <div className={'addnormal-title'}>
                    <span style={{width: 45}}>{i18n.t(200167/*财务*/)}</span>
                </div>
                <div className={'  girdlayout'}>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(500083/*收款企业*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                apiHost={API_FOODING_DS}
                                apiUri="/partner/getListBySourceId"
                                apiParams={{sourceId:businessOne.ccId,dataTyId:60,isAddSelf:true}}
                                fieldName="receiptCcId"
                                clearable
                                initialValue={xt.initSelectValue(true, businessOne, ['receiptCcId', 'receiptCcLcName', 'receiptCcEnName'], 'receiptCcLcName', form)}
                                valueKeys={da => ({
                                    receiptCcId: da.enterpriseId,
                                    receiptCcLcName: da.enterpriseLcName,
                                    receiptCcEnName: da.enterpriseEnName,
                                    s_label: da.enterpriseLcName
                                })}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200168/*收款银行账号*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                disabled={!Boolean(getFieldValue('receiptCcId', businessOne).receiptCcId && getFieldValue('cnyId', businessOne).cnyId)}
                                refreshMark={getFieldValue('receiptCcId', businessOne).receiptCcId + "," + getFieldValue('cnyId', businessOne).cnyId}
                                apiUri="/bankacct/getList"
                                apiParams={{
                                    sourceId: getFieldValue('receiptCcId', businessOne).receiptCcId,
                                    curcyId: getFieldValue('cnyId', businessOne).cnyId
                                }}
                                clearable
                                fieldName="receBankAccountId"
                                initialValue={xt.initSelectValue(
                                    businessOne.receBankAccountId && businessOne.receiptCcId === getFieldValue('receiptCcId', {}).receiptCcId,
                                    businessOne, ['receBankAccountId', 'receBankAccountLcName', 'receBankAccountEnName'], 'receBankAccountLcName', form
                                )}
                                valueKeys={da => ({
                                    receBankAccountId: da.id,
                                    receBankAccountLcName: da.bacctCode,
                                    receBankAccountEnName: da.bacctCode,
                                    s_label: da.bacctCode
                                })}
                            />
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Addnormal;
