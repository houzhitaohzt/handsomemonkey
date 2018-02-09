import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, {Option} from '../../../../components/Select';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Checkbox from '../../../../components/CheckBox';
export class AccountDialog extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.data = null;
    }

    onSaveAndClose() {
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if (errors) {

            } else {
                this.props.onSaveAndClose(this.props.form.getFieldsValue(), this.data);
                this.props.form.resetFields();
            }
        })
    }

    onCancel() {
        const {onCancel} = this.props;
        if (onCancel) {
            onCancel();
            this.props.form.resetFields();
        }
    }

    render() {
        let that = this;
        const {getFieldProps, getFieldError} = this.props.form;
        let {data, initData} = this.props;
        this.data = Object.assign({}, data.number === 1 ? undefined: data.record);
        return (
            <div className="action-normal-buttons">
                <FormWrapper showFooter={true}  onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}
                             onSaveAdd={this.onSaveAdd} width={976}>
                    <div className="">
                        {/*<div className="row">*/}
                            {/*<label><span>*</span>{i18n.t(201200*//*黑名单*//*)}</label>*/}
                            {/*<Checkbox*/}
                                {/*{...getFieldProps('blackMark', {*/}
                                    {/*initialValue: !!this.data.blackMark*/}
                                {/*})}*/}
                                {/*checked={this.props.form.getFieldValue("blackMark")}*/}
                            {/*/>*/}
                        {/*</div>*/}
                        <div className="row">
                            <label className="col-md-2" style={{textAlign: 'right'}}><span>*</span>IP</label>
                            <input type='text' className={'text-input-nowidth col-md-8'}
                                   placeholder=""
                                   {...getFieldProps('name', {
                                       validateFirst: true,
                                       rules: [{required: true,}],
                                       valuedateTrigger: 'onBlur',
                                       initialValue:  this.data.name || ''
                                   })} />
                        </div>
                    </div>
                </FormWrapper>
            </div>
        );
    }
}
AccountDialog.propTypes = {
    onSaveAndClose: PropTypes.func,
    onCancel: PropTypes.func
};
AccountDialog.defaultProps = {
    onSaveAndClose(){
    },
    onCancel(){
    }
};
const DialogFrom = createForm()(AccountDialog);
export default DialogFrom;
