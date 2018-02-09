import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, {Option, ConstVirtualSelect} from '../../../../components/Select';
import Radio from '../../../../components/Radio';
import Calendar from '../../../../components/Calendar/Calendar';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS} from "../../../../services/apiCall";
import Input from '../../../../components/FormValidating/FormValidating';
//引入国际化
import {I18n} from '../../../../lib/i18n';
import WebData from "../../../../common/WebData";
import ServiceTips, {errorTips, successTips} from '../../../../components/ServiceTips'; // 提示
import xt from '../../../../common/xt';

export class OrgServerDialog extends Component {
    constructor(props) {
        super(props);
        let that = this;
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onSaveAdd = this.onSaveAdd.bind(this);
        this.state = {}
    }

    componentWillReceiveProps(nextProps) {
        //
    }

    onSaveAdd = () => {
        let {onSaveAdd, form, otherData, data, initData} = this.props;
        form.validateFields((errors, value) => {
            if (errors) {

            } else {
                let params = data.number == 0 ? Object.assign({}, form.getFieldsValue(), otherData, {
                    id: initData.id,
                    optlock: initData.optlock
                }) : Object.assign({}, form.getFieldsValue(), otherData)
                apiPost(API_FOODING_DS, "/defaultServBe/save", params, response => {
                    onSaveAdd && onSaveAdd();
                    ServiceTips({text: response.message, type: 'success'});
                    form.resetFields();
                }, error => ServiceTips({text: error.message, type: 'error'}));
            }
        })
    };

    onSaveAndClose = () => {
        let {onSaveAndClose, form, data, otherData, initData} = this.props;
        form.validateFields((errors, value) => {
            if (errors) {

            } else {
                let params = data.number == 0 ? Object.assign({}, form.getFieldsValue(), otherData, {
                    id: initData.id,
                    optlock: initData.optlock
                }) : Object.assign({}, form.getFieldsValue(), otherData);
                apiPost(API_FOODING_DS, "/defaultServBe/save", params, response => {
                    onSaveAndClose && onSaveAndClose();
                    ServiceTips({text: response.message, type: 'success'});
                    form.resetFields();
                }, error => ServiceTips({text: error.message, type: 'error'}));
            }
        })
    };

    onCancel = () => {
        this.props.onCancel && this.props.onCancel();
    };

    render() {
        let that = this;
        const {getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;
        let initData = this.props.initData || {};
        let sourceId = this.props.otherData.sourceId || undefined;
        let serbeId = initData.servBe && initData.servBe.id ? initData.servBe.id : undefined;
        let beDataMulDivId = initData.beDataMulDiv && initData.beDataMulDiv.id ? initData.beDataMulDiv.id : undefined;

        return (
            <FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}
                         onSaveAdd={this.onSaveAdd} showSaveAdd={true}>
                <div className="girdlayout">
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100530/*行业细分*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                fieldName="beDataMulDivId"
                                rules
                                apiType={apiPost}
                                initValueOptions={initData.beDataMulDiv ? [initData.beDataMulDiv] : []}
                                initialValue={beDataMulDivId}
                                // initialValue={xt.initSelectValue(, {beDataMulDivId, id:beDataMulDivId,localName:localName}, ['beDataMulDivId'], 'localName', this.props.form)}
                                className="col-md-9 col-lg-9"
                                apiParams="com.fooding.fc.enumeration.BeDataMulDiv"
                            />
                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(400274/*机构名称*/)}</label>
                            <ConstVirtualSelect
                                refreshMark={getFieldValue('beDataMulDivId',beDataMulDivId)}
                                isRequest={Boolean(getFieldValue('beDataMulDivId',beDataMulDivId))}
                                form={this.props.form}
                                fieldName="servBeId"
                                rules
                                apiType={apiPost}
                                initValueOptions={[]}
                                initialValue={xt.initSelectValue(serbeId && getFieldValue("beDataMulDivId", beDataMulDivId) === beDataMulDivId, {servBeId:initData.servBe && initData.servBe.id? initData.servBe.id:"", localName:initData.servBe && initData.servBe.id? initData.servBe.localName:""} , ['servBeId',"s_lable"], 'localName', this.props.form)}
                                className="col-md-9 col-lg-9"
                                apiParams={{
                                    dataTyId: 60,
                                    obj: "com.fooding.fc.ds.entity.ServBe",
                                    queryParams: [{
                                        attr: "beDataMulDivIds",
                                        expression: "oin",
                                        value: getFieldValue('beDataMulDivId', beDataMulDivId)
                                    }],
                                    sourceId: sourceId
                                }}
                            />
                        </div>
                    </div>
                </div>
            </FormWrapper>
        );
    }
}

OrgServerDialog.propTypes = {
    onSaveAdd: PropTypes.func,
    onSaveAndClose: PropTypes.func,
    onCancel: PropTypes.func
};
OrgServerDialog.defaultProps = {
    onSaveAdd() {
    },
    onSaveAndClose() {
    },
    onCancel() {
    }
};
const OrgServerForm = createForm()(OrgServerDialog);
export default OrgServerForm;

