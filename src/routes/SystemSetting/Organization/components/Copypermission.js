import i18n from './../../../../lib/i18n';
import React, {PropTypes, Component} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";
//引入select插件
import Select, {Option} from 'rc-select';

import {Translate, Localize, I18n} from '../../../../lib/i18n';

class CommonForm extends Component {
    constructor(props) {
        super(props)
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = this.initState();
    }

    initState() {
        return {
            cntryId: '',
            staffIds: [],
            initData: {},
        }
    }

    static defaultProps = {
        onSaveAndClose(){
        },
        onCancel(){
        }
    }

    componentDidMount() {

    }

    onSaveAndClose() {
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if (null == errors) {
                this.props.onSaveAndClose(value);
                //this.props.form.resetFields();
            }
        })
    }

    onCancel() {
        const {onCancel} = this.props;
        if (onCancel) {
            onCancel();
        }
    }

    onChange(e) {

    }

    render() {
        const {form, typeArray, parentId} = this.props;
        const {getFieldProps, getFieldError} = this.props.form;
        const disabled = form.isFieldsValidating() || form.isSubmitting();
        let {staffIds} = this.state;
        staffIds = staffIds || [];
        let dom = (<div className={'girdlayout'}>
            <div className={'row'}>
                
                <div className="form-group col-xs-12 col-md-12">
                    <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500223/*权限来源*/)}</label>
                    <Select
                        animation='slide-up'
                        placeholder=''
                        className ={getFieldError('sourceId')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}
                        choiceTransitionName="rc-select-selection__choice-zoom"
                        optionLabelProp="children"
                        {...getFieldProps('sourceId', {
                            validateFirst: true,
                            rules: [{required: true,}],
                            onChange: this.onChange,
                            initialValue: ''
                        })}
                    >
                        {
                            typeArray.map((e, i) => {
                                return <Option value={e.id + ''} key={i}>{e.name}</Option>
                            })
                        }
                    </Select>
                </div>
                
            </div>
        </div>)
        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
            {dom}
        </FormWrapper>);
    }
}

CommonForm = createForm()(CommonForm);

export default CommonForm;

