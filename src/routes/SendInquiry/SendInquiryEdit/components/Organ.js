import React, {Component} from "react";
import {ConstVirtualSelect} from "../../../../components/Select";
import {API_FOODING_ES} from "../../../../services/apiCall";
import xt from "../../../../common/xt";
import i18n from '../../../../lib/i18n';

export default class Organ extends Component {
    constructor(props) {
        super(props);
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
                    <span style={{width: 45}}>{i18n.t(100140/*组织*/)}</span>
                </div>
                <div className={'  girdlayout'}>
                    <div className={'row'}>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                apiUri="/party/getLoginCompanies"
                                apiHost={API_FOODING_ES}
                                apiParams={{clusId: businessOne.clusterId}}
                                fieldName="ccId"
                                initialValue={xt.initSelectValue(true, businessOne, ['ccId', 'ccLcName', 'ccEnName'], 'ccLcName', form)}
                                valueKeys={da => ({
                                    ccId: da.id,
                                    ccLcName: da.localName,
                                    ccEnName: da.name,
                                    s_label: da.localName
                                })} rules
                            />
                        </div>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400036/*采购组织*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form} disabled={!Boolean(getFieldValue('ccId', {}).ccId)}
                                refreshMark={getFieldValue('ccId', {}).ccId}
                                apiHost={API_FOODING_ES}
                                apiUri="/party/getPartysByType"
                                apiParams={{partyId: getFieldValue('ccId', businessOne).ccId, typeAttributeIds:["42"]}}
                                fieldName="porId"
                                initialValue={ xt.initSelectValue(
                                    businessOne.porId && businessOne.ccId === getFieldValue('ccId', {}).ccId, businessOne,
                                    ['porId', 'porLcName', 'porEnName'],
                                    'porLcName', form
                                )}
                                valueKeys={da => ({
                                    porId: da.id,
                                    porLcName: da.localName,
                                    porEnName: da.name,
                                    s_label: da.localName
                                })} rules
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200024/*询价人*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form} disabled={!Boolean(getFieldValue('porId', {}).porId)}
                                refreshMark={getFieldValue('porId', {}).porId}
                                apiHost={API_FOODING_ES}
                                apiUri="/user/getListForPermissionsInParty"
                                apiParams={{partyId: getFieldValue('porId', businessOne).porId}}
                                fieldName="staffId"
                                initialValue={xt.initSelectValue(
                                    businessOne.staffId && businessOne.porId === (getFieldValue('porId', {}).porId),
                                    businessOne, ['staffId', 'staffLcName', 'staffEnName'], 'staffLcName'
                                )}
                                valueKeys={da => ({
                                    staffId: da.refId,
                                    staffLcName: da.staffLocalName,
                                    staffEnName: da.staffName,
                                    s_label: da.staffLocalName
                                })} rules
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
