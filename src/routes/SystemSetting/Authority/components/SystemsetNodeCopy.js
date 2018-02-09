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

    static propTypes = {
        data: PropTypes.object,
        form: PropTypes.object,
        onSaveAndClose: PropTypes.func,
        onCancel: PropTypes.func,
        initData: PropTypes.object
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
                if (onSaveAndClose) {
                    let record = form.getFieldsValue();
                    addUpdateRecord
                    /*addUpdateJson*/(record, (value) => {
                        onSaveAndClose(value);
                    }, (msg) => {
                        console.log(msg);
                    });
                }
            }
        })
    }

    onCancel() {
        const {onCancel} = this.props;
        if (onCancel) {
            onCancel();
        }
    }

    render() {
        const {form} = this.props;
        const {getFieldProps, getFieldError} = this.props.form;
        const disabled = form.isFieldsValidating() || form.isSubmitting();
        let {staffIds} = this.state;
        staffIds = staffIds || [];
        let dom = (<div className={'  girdlayout'} style={{height: "48px"}}>
            <div className={'row'}>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-3 col-md-3'}>{i18n.t(201135/*目标节点*/)}</label>
                    <Select
                        animation='slide-up'
                        placeholder=''
                        className='currency-btn select-from-currency col-xs-9 col-md-9'
                        choiceTransitionName="rc-select-selection__choice-zoom"
                        optionLabelProp="children"
                        {...getFieldProps('target', {
                            validateFirst: true,
                            rules: [{required: true,}]
                        })}
                    >
                        <Option value={i18n.t(201136/*西欧*/)} title={i18n.t(201136/*西欧*/)}>{i18n.t(201136/*西欧*/)}</Option>
                        <Option value={i18n.t(201137/*东南亚*/)} title={i18n.t(201137/*东南亚*/)}>{i18n.t(201137/*东南亚*/)}</Option>
                        <Option value={i18n.t(201138/*东欧*/)} title={i18n.t(201138/*东欧*/)}>{i18n.t(201138/*东欧*/)}</Option>
                        <Option value={i18n.t(201139/*中东*/)} title={i18n.t(201139/*中东*/)}>{i18n.t(201139/*中东*/)}</Option>
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

