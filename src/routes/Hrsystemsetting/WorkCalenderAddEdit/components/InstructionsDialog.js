import i18n from './../../../../lib/i18n';
import React, {PropTypes, Component} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";
//引入select插件
import Checkbox from '../../../../components/CheckBox';
import xt from '../../../../common/xt';

import {Translate, Localize, I18n} from '../../../../lib/i18n';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_HR} from '../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from '../../../../components/ServiceTips';

class InstructionsDialog extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        let getOne = props.getOne || {};
        this.state = {
            workState:getOne.workState == 1
        };
    }

    static propTypes = {
        data: PropTypes.object,
        form: PropTypes.object,
        onSaveAndClose: PropTypes.func,
        onCancel: PropTypes.func,
    };

    componentDidMount() {

    }

    onSaveAndClose() {
        const {form, onSaveAndClose, getOne} = this.props;

        form.validateFields((errors, value) => {
            if ( !errors) {
                let params = Object.assign({}, form.getFieldsValue(), {id:getOne.id, workState: value.workState ? 1 : 4});
                apiForm(API_FOODING_HR, '/calendar/modifyWorkingTempl', params, response => {
                    successTips(response.message);
                    onSaveAndClose && onSaveAndClose();
                }, ({message}) => errorTips(message))
            }
        })
    }

    onCancel() {
        this.props.onCancel && this.props.onCancel()
    }

    onChange = e => {
        this.setState({workState:e.target.checked});
    };

    render() {
        const {form} = this.props;
        const {getFieldProps, getFieldErrorStyle, getNFieldProps,getFieldError, getFieldValue} = this.props.form;
        let {getOne = {}} = this.props;
        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
            <div className={'girdlayout'}  >
                <div className={'row'}>
                    <div className="form-group col-xs-12 col-md-12">
                        <label className={'col-xs-1 col-md-1'}>工作日</label>
                        <div className={'col-xs-11 col-md-11'}>
                            <Checkbox
                                {...getFieldProps('workState', {
                                    initialValue: getOne.workState == 1,
                                    onChange:this.onChange
                                })}
                                checked={this.state.workState}
                            />
                        </div>
                    </div>
                    <div className="form-group col-xs-12 col-md-12">
                        <label className={'col-xs-1 col-md-1'}><span>*</span>{i18n.t(100336/*备注*/)}</label>
                        <textarea
                            placeholder=""
                            {...getFieldProps('memo',{
                                initialValue:getOne.memo?getOne.memo:''
                            })}
                            className={'col-md-11 col-lg-11 text-input-nowidth'}
                            style={{resize:'none',height:'65px'}}
                        >
                    </textarea>
                    </div>
                </div>
            </div>
        </FormWrapper>);
    }
}

InstructionsDialog = createForm()(InstructionsDialog);

export default InstructionsDialog;

