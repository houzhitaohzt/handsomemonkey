import i18n from './../../../../lib/i18n';
import React, {PropTypes, Component} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
//引入select插件
import Select, {Option} from 'rc-select';
import Radio from "../../../../components/Radio";
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
        const {data} = this.state;
        const {getFieldProps, getFieldError} = this.props.form;
        const disabled = form.isFieldsValidating() || form.isSubmitting();
        let {staffIds} = this.state;
        staffIds = staffIds || [];
        let dom = (<div className={'  girdlayout'} style={{height: "344px"}}>
            <div className={'row'}>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100225/*工号*/)}</label>
                    <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
                           placeholder=""
                           {...getFieldProps('staffworking', {
                               validateFirst: true,
                               rules: [{required: true,}],
                               valuedateTrigger: 'onBlur',
                               initialValue: data && ('name' in data) ? data.name : ''
                           })} />
                </div>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100231/*姓名*/)}</label>
                    <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
                           placeholder=""
                           {...getFieldProps('name', {
                               validateFirst: true,
                               rules: [{required: true,}],
                               valuedateTrigger: 'onBlur',
                               initialValue: data && ('name' in data) ? data.name : ''
                           })} />
                </div>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100235/*语言*/)}</label>
                    <Select
                        animation='slide-up'
                        placeholder=''
                        className='currency-btn select-from-currency col-xs-8 col-md-8'
                        choiceTransitionName="rc-select-selection__choice-zoom"
                        optionLabelProp="children"
                        {...getFieldProps('language', {
                            validateFirst: true,
                            rules: [{required: true,}]
                        })}
                    >
                        <Option value={i18n.t(200293/*中国*/)} title={i18n.t(200293/*中国*/)}>{i18n.t(200293/*中国*/)}</Option>
                        <Option value={i18n.t(200569/*美国*/)} title={i18n.t(200569/*美国*/)}>{i18n.t(200569/*美国*/)}</Option>
                    </Select>
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100087/*国家*/)}</label>
                    <Select
                        animation='slide-up'
                        placeholder=''
                        className='currency-btn select-from-currency col-xs-8 col-md-8'
                        choiceTransitionName="rc-select-selection__choice-zoom"
                        optionLabelProp="children"
                        {...getFieldProps('country', {
                            validateFirst: true,
                            rules: [{required: true,}]
                        })}
                    >
                        <Option value={i18n.t(200293/*中国*/)} title={i18n.t(200293/*中国*/)}>{i18n.t(200293/*中国*/)}</Option>
                        <Option value={i18n.t(200569/*美国*/)} title={i18n.t(200569/*美国*/)}>{i18n.t(200569/*美国*/)}</Option>
                    </Select>
                </div>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100236/*职称*/)}</label>
                    <Select
                        animation='slide-up'
                        placeholder=''
                        className='currency-btn select-from-currency col-xs-8 col-md-8'
                        choiceTransitionName="rc-select-selection__choice-zoom"
                        optionLabelProp="children"
                        {...getFieldProps('duty', {
                            validateFirst: true,
                            rules: [{required: true,}]
                        })}
                    >
                        <Option value={i18n.t(201179/*高风险*/)} title={i18n.t(201179/*高风险*/)}>{i18n.t(201179/*高风险*/)}</Option>
                        <Option value={i18n.t(201180/*低风险*/)} title={i18n.t(201180/*低风险*/)}>{i18n.t(201180/*低风险*/)}</Option>
                    </Select>
                </div>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100237/*职员类型*/)}</label>
                    <Select
                        animation='slide-up'
                        placeholder=''
                        className='currency-btn select-from-currency col-xs-8 col-md-8'
                        choiceTransitionName="rc-select-selection__choice-zoom"
                        optionLabelProp="children"
                        {...getFieldProps('type', {
                            validateFirst: true,
                            rules: [{required: true,}]
                        })}
                    >
                        <Option value={i18n.t(200310/*北京*/)} title={i18n.t(200310/*北京*/)}>{i18n.t(200310/*北京*/)}</Option>
                        <Option value={i18n.t(200294/*上海*/)} title={i18n.t(200294/*上海*/)}>{i18n.t(200294/*上海*/)}</Option>
                    </Select>
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100140/*组织*/)}</label>
                    <Select
                        animation='slide-up'
                        placeholder=''
                        className='currency-btn select-from-currency col-xs-8 col-md-8'
                        choiceTransitionName="rc-select-selection__choice-zoom"
                        optionLabelProp="children"
                        {...getFieldProps('organ', {
                            validateFirst: true,
                            rules: [{required: true,}]
                        })}
                    >
                        <Option value={i18n.t(200310/*北京*/)} title={i18n.t(200310/*北京*/)}>{i18n.t(200310/*北京*/)}</Option>
                        <Option value={i18n.t(200294/*上海*/)} title={i18n.t(200294/*上海*/)}>{i18n.t(200294/*上海*/)}</Option>
                    </Select>
                </div>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(201181/*岗位*/)}</label>
                    <Select
                        animation='slide-up'
                        placeholder=''
                        className='currency-btn select-from-currency col-xs-8 col-md-8'
                        choiceTransitionName="rc-select-selection__choice-zoom"
                        optionLabelProp="children"
                        {...getFieldProps('status', {
                            validateFirst: true,
                            rules: [{required: true,}]
                        })}
                    >
                        <Option value="Chinese" title="Chinese">Chinese</Option>
                        <Option value="English" title="English">English</Option>
                    </Select>
                </div>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100228/*在职状态*/)}</label>
                    <Select
                        animation='slide-up'
                        placeholder=''
                        className='currency-btn select-from-currency col-xs-8 col-md-8'
                        choiceTransitionName="rc-select-selection__choice-zoom"
                        optionLabelProp="children"
                        {...getFieldProps('status', {
                            validateFirst: true,
                            rules: [{required: true,}]
                        })}
                    >
                        <Option value="Chinese" title="Chinese">Chinese</Option>
                        <Option value="English" title="English">English</Option>
                    </Select>
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100239/*性别*/)}</label>
                    <Select
                        animation='slide-up'
                        placeholder=''
                        className='currency-btn select-from-currency col-xs-8 col-md-8'
                        choiceTransitionName="rc-select-selection__choice-zoom"
                        optionLabelProp="children"
                        {...getFieldProps('sex', {
                            validateFirst: true,
                            rules: [{required: true,}]
                        })}
                    >
                        <Option value={i18n.t(200310/*北京*/)} title={i18n.t(200310/*北京*/)}>{i18n.t(200310/*北京*/)}</Option>
                        <Option value={i18n.t(200294/*上海*/)} title={i18n.t(200294/*上海*/)}>{i18n.t(200294/*上海*/)}</Option>
                    </Select>
                </div>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100240/*学历*/)}</label>
                    <Select
                        animation='slide-up'
                        placeholder=''
                        className='currency-btn select-from-currency col-xs-8 col-md-8'
                        choiceTransitionName="rc-select-selection__choice-zoom"
                        optionLabelProp="children"
                        {...getFieldProps('person', {
                            validateFirst: true,
                            rules: [{required: true,}]
                        })}
                    >
                        <Option value="Chinese" title="Chinese">Chinese</Option>
                        <Option value="English" title="English">English</Option>
                    </Select>
                </div>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100241/*身份证号*/)}</label>
                    <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
                           placeholder=""
                           {...getFieldProps('person', {
                               validateFirst: true,
                               rules: [{required: true,}],
                               valuedateTrigger: 'onBlur',
                               initialValue: data && ('name' in data) ? data.name : ''
                           })} />
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100242/*兴趣爱好*/)}</label>
                    <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
                           placeholder=""
                           {...getFieldProps('love', {
                               validateFirst: true,
                               rules: [{required: true,}],
                               valuedateTrigger: 'onBlur',
                               initialValue: data && ('name' in data) ? data.name : ''
                           })} />
                </div>
                <div className="form-group col-xs-8 col-md-8">
                    <label className={'col-xs-2 col-md-2'}>{i18n.t(100229/*邮箱*/)}</label>
                    <input type='text' className={'col-xs-10 col-md-10 text-input-nowidth'}
                           placeholder=""
                           {...getFieldProps('work', {
                               validateFirst: true,
                               rules: [{required: true,}],
                               valuedateTrigger: 'onBlur',
                               initialValue: data && ('name' in data) ? data.name : ''
                           })} />
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

