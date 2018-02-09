import i18n from './../../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../../components/Form";
//引入select插件
import {ConstVirtualSelect, Option} from "../../../../../components/Select";
import {API_FOODING_DS, API_FOODING_ERP, apiGet, apiPost} from "../../../../../services/apiCall";
import {errorTips, successTips} from "../../../../../components/ServiceTips"; //提示框

export class BOEditContact extends Component {
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
                apiPost(API_FOODING_ERP, '/business/linker/save',
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

    onCancel() {
        const {form, onSaveAndClose} = this.props;
        this.props.onCancel();
        form.resetFields();
    }

    onChangeCheck() {

    }

    render() {
        let that = this;
        const {getFieldProps, getFieldError} = this.props.form;
        let {data, otherData} = this.props;
        let record = data.number === 1 ? null : data.record;
        return (
            <div className="action-normal-buttons">
                <FormWrapper showFooter={true} showSaveAdd={false} onSaveAndAdd={this.onSaveAndAdd} onSaveAndClose={this.onSaveAndClose}
                             onCancel={this.onCancel} width={976}>
                    <div className="contact-bianji scroll">
                        <label style={{float:'left'}}>
                            <span style={{paddingRight: 5}}>* </span>
                            {i18n.t(200232/*利益干系人*/)}
                        </label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            apiParams={{beId: otherData.salBeId, dataTyId: 100}}
                            apiUri="/entContact/getByBeIdDataTyId"
                            fieldName="linkId"
                            initialValue={record ? {
                                linkId: record.billDtlId,
                                linkLcName: record.linkLcName,
                                linkEnName: record.linkEnName,
                                s_label: record.linkLcName
                            } : undefined} style={{width: 500}}
                            valueKeys={da => ({
                                linkId: da.id,
                                linkLcName: da.localName,
                                linkEnName: da.name,
                                s_label: da.localName
                            })} rules
                        />
                    </div>
                </FormWrapper>
            </div>
        );
    }

    onSaveAndAdd() {

    }

    onCancel() {
        const {onCancel} = this.props;
        if (onCancel) {
            onCancel();
        }
    }
}
BOEditContact.propTypes = {
    onSaveAndClose: PropTypes.func,
    onCancel: PropTypes.func
};
BOEditContact.defaultProps = {
    onSaveAndClose(){
    },
    onCancel(){
    }
};
const DialogFrom = createForm()(BOEditContact);
export default DialogFrom;
