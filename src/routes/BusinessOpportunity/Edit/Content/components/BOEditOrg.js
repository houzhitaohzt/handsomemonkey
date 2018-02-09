import i18n from './../../../../../lib/i18n';
import React, {Component} from "react";
import NavConnect from "../../../../../components/NavigateTabs/containers/AddContainer";
import {ConstVirtualSelect} from "../../../../../components/Select";
import {API_FOODING_ES} from "../../../../../services/apiCall";
import xt from "../../../../../common/xt";

class BOEditOrg extends Component {
    constructor(props) {
        super(props);
        this.state = this.initState();
    }

    initState() {
        return {
            clientSelectData: []
        }
    }

    saveClick = () => {

    };

    backClick = () => {

    };

    render() {
        const {form, businessOne = {}} = this.props;
        const {getFieldProps, getFieldError, getFieldValue, getNFieldProps} = form;
        xt.initLabelValue(businessOne.clusterId, businessOne, ['clusterId', 'clusterEnName', 'clusterLcName'], 'clusterLcName', form);
        return (
            <div className='addnormal'>
                <div>
                    <div className='addnormal-title'>
                        <span className='title'>{i18n.t(100140/*组织*/)}</span>
                    </div>
                </div>
                <div className={'  girdlayout'}>
                    <div className={'row'}>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(100243/*集团*/)}</label>
                            <input type="text" disabled className={'col-md-8 col-lg-8 text-input-nowidth'}
                                   value={businessOne.clusterLcName || ''}
                            />
                        </div>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100486/*公司*/)}</label>
                            <ConstVirtualSelect
                                apiHost={API_FOODING_ES}
                                form={this.props.form}
                                apiUri='/party/getLoginCompanies'
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
                    </div>
                    <div className={'row'}>

                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200119/*销售组织*/)}</label>
                            <ConstVirtualSelect
                                apiHost={API_FOODING_ES}
                                form={this.props.form} disabled={!Boolean(getFieldValue('ccId', {}).ccId)}
                                refreshMark={getFieldValue('ccId', {}).ccId}
                                apiUri="/party/getPartysByType"
                                apiParams={{partyId: getFieldValue('ccId', businessOne).ccId, typeAttributeIds:["44"]}}
                                fieldName="sorId"
                                initialValue={ xt.initSelectValue(
                                    businessOne.sorId && businessOne.ccId === getFieldValue('ccId', {}).ccId, businessOne,
                                    ['sorId', 'sorLcName', 'sorEnName'],
                                    'sorLcName', form
                                )}
                                valueKeys={da => ({
                                    sorId: da.id,
                                    sorLcName: da.localName,
                                    sorEnName: da.name,
                                    s_label: da.localName
                                })} rules
                            />

                        </div>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400011/*销售员*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form} disabled={!Boolean(getFieldValue('sorId', {}).sorId)}
                                refreshMark={getFieldValue('sorId', {}).sorId}
                                apiUri="/user/getListForPermissionsInParty"
                                apiHost={API_FOODING_ES}
                                apiParams={{partyId: getFieldValue('sorId', businessOne).sorId}}
                                fieldName="saleStaffId"
                                initialValue={xt.initSelectValue(
                                    businessOne.saleStaffId && businessOne.sorId === (getFieldValue('sorId', {}).sorId),
                                    businessOne, ['saleStaffId', 'saleStaffLcName', 'saleStaffEnName'], 'saleStaffLcName'
                                )}
                                valueKeys={ da => ({
                                    saleStaffId: da.refId,
                                    saleStaffLcName: da.staffLocalName,
                                    saleStaffEnName: da.staffName,
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

export default NavConnect(BOEditOrg);
