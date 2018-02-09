import i18n from './../../../../lib/i18n';
import React, {Component} from "react";
import {ConstVirtualSelect, Option} from '../../../../components/Select';
import {API_FOODING_ES, apiGet} from '../../../../services/apiCall';
import xt from '../../../../common/xt';

class Addnormal extends Component {
    constructor(props) {
        super(props)
        this.StateChange = this.StateChange.bind(this);
        this.AddressChange = this.AddressChange.bind(this);
        this.state = this.initState()
    }

    initState() {
        return {}
    }

    StateChange(e) {
        let tex;
        tex = e.target.value;
        this.setState({
            radioState: tex
        })
    }

    AddressChange(e) {
        let addres;
        addres = e.target.value;
        this.setState({
            radioAddress: addres
        })
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
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(100243/*集团*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={'paragraph shengyue'}>{businessOne.clusterLcName}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
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
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200119/*销售组织*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form} disabled={!Boolean(getFieldValue('ccId', {}).ccId)}
                                refreshMark={getFieldValue('ccId', {}).ccId} sendChange
                                apiUri="/party/getPartysByType"
                                apiHost={API_FOODING_ES}
                                apiParams={{partyId: getFieldValue('ccId', businessOne).ccId, typeAttributeIds:["44"]}}
                                fieldName="sorId"
                                initialValue={xt.initSelectValue(
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
                    </div>
                </div>
            </div>
        )
    }
}

export default Addnormal;
