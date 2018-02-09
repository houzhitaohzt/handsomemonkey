import i18n from './../../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../../components/Form";
//引入select插件
import {ConstVirtualSelect} from '../../../../../components/Select'
import {API_FOODING_ERP, API_FOODING_ES, apiPost} from "../../../../../services/apiCall";
import {errorTips, successTips} from "../../../../../components/ServiceTips"; //提示框

export class NewSalesTeam extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onSaveAndAdd = this.onSaveAndAdd.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = {
            checked: false
        };
    }

    onSaveAndClose() {
        const {form, otherData, onSaveAndClose, data} = this.props;
        let record = data.number === 1 ? {} : data.record;
        form.validateFields((error, value) => {
            if (!error) {
                apiPost(API_FOODING_ERP, '/business/team/save',
                    {
                        ...record,
                        ...value,
                        billId: otherData.billId,
                    },
                    response => {
                        onSaveAndClose();
                        form.resetFields();
                        successTips(response.message);
                    }, error => {
                        errorTips(error.message);
                    })
            }
        });
    }

    onChangeCheck() {

    }

    onSaveAndAdd() {

    }

    render() {
        let that = this;
        const {getFieldProps, getFieldError} = this.props.form;
        let {data, otherData} = this.props;
        let record = data.number === 1 ? null : data.record;
        getFieldProps('mainMark', {initialValue: record ? record.mainMark : false});
        let content = (
            <div className="contact-bianji scroll">
                <label style={{float:'left'}}>
                    <span style={{paddingRight: 5}}>*</span>
                    {i18n.t(400011/*销售员*/)}
                </label>
                <ConstVirtualSelect
                    form={this.props.form} initRequest
                    pageSize={7}
                    apiParams={{partyId: otherData.sorId}}
                    apiUri="/user/getListForPermissionsInParty"
                    apiHost={API_FOODING_ES}
                    fieldName="salSaffId"
                    initialValue={record ? {
                        salSaffId: record.salSaffId,
                        salSaffLcName: record.salSaffLcName,
                        salSaffEnName: record.salSaffEnName,
                        s_label: record.salSaffLcName
                    } : undefined}
                    style={{width: 200}}
                    valueKeys={da => ({
                        salSaffId: da.id,
                        salSaffLcName: da.staffLocalName,
                        salSaffEnName: da.staffName,
                        s_label: da.staffLocalName
                    })} rules
                />

                <label><span style={{paddingLeft: 10,paddingRight: 5}}>*</span>{i18n.t(200221/*是否主力*/)}</label>

                <label style={{paddingLeft: 10, color: "#1E1E1E"}}>
                    <input
                        style={{paddingLeft: 10}}
                        type="radio"
                        {...getFieldProps('mainMark.true', {
                            exclusive: true,
                            getValueFromEvent(e) {
                                return e.target.checked;
                            },
                            getValueProps(value) {
                                return {
                                    checked: value === true,
                                };
                            },
                        })}
                    />&nbsp;&nbsp;{i18n.t(100141/*是*/)}
                </label>

                <label style={{paddingLeft: 10, color: "#1E1E1E"}}>
                    <input
                        style={{marginLeft: 10}}
                        type="radio"
                        {...getFieldProps('mainMark.false', {
                            exclusive: true,
                            getValueFromEvent(e) {
                                return !e.target.checked;
                            },
                            getValueProps(value) {
                                return {
                                    checked: value === false,
                                };
                            },
                        })}
                    />&nbsp;&nbsp;{i18n.t(100142/*否*/)}
                </label>
            </div>
        );
        return (
            <div className="action-normal-buttons">
                <FormWrapper showFooter={true} showSaveAdd={false} onSaveAndAdd={this.onSaveAndAdd} onSaveAndClose={this.onSaveAndClose}
                             onCancel={this.onCancel} width={976}>
                    {content}
                </FormWrapper>
            </div>
        );
    }

    onCancel() {
        const {onCancel, form} = this.props;
        if (onCancel) {
            form.resetFields();
            onCancel();
        }
    }
}
NewSalesTeam.propTypes = {
    onSaveAndClose: PropTypes.func,
    onCancel: PropTypes.func
};
NewSalesTeam.defaultProps = {
    onSaveAndClose(){
    },
    onCancel(){
    }
};
const DialogFrom = createForm()(NewSalesTeam);
export default DialogFrom;
