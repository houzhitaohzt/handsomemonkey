import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
//引入弹层
//引入select插件
import Select, {ConstVirtualSelect, Option} from "../../../../components/Select";
import Checkbox from "../../../../components/CheckBox";
import xt from "../../../../common/xt";
import {API_FOODING_MAIL, apiForm, apiGet,apiPost} from "../../../../services/apiCall";
import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import WebData from '../../../../common/WebData';
class CommonForm extends Component {
    constructor(props) {
        super(props)
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = this.initState();
    }

    static propTypes = {
        form: PropTypes.object,
        onSaveAndClose: PropTypes.func,
        onCancel: PropTypes.func,
        oneData: PropTypes.object
    };

    initState() {
        return {
            cntryId: '',
            staffIds: [],
            oneData: {},
        }
    }

    static defaultProps = {
        onSaveAndClose(){
        },
        onCancel(){
        }
    };

    getOne = ()=>{
        if( !this.props.otherData) return;
        apiGet(API_FOODING_MAIL, '/serverconfig/getOne', {id: this.props.otherData.id},
            response => {
                this.setState({oneData: response.data});
            }, error => {
                errorTips(error.message);
            })
    };

    componentDidMount() {
        this.getOne();
    }

    onSaveAndClose() {
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if( !errors){
                apiPost(API_FOODING_MAIL, '/serverconfig/save', {
                    id: this.props.otherData? this.props.otherData.id: undefined,
                    ...value
                    },
                    response => {
                        successTips('保存成功!');
                        onSaveAndClose();
                    }, error => {
                        errorTips(error.message);
                    })
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
        const {getFieldProps, getFieldErrorStyle} = this.props.form;
        const disabled = form.isFieldsValidating() || form.isSubmitting();
        let list = WebData.user.data.companies;
        let {staffIds, oneData, initData} = this.state;
        staffIds = staffIds || [];
        let dom = (<div className={'girdlayout'} style={{height: "344px"}}>
            <div className={'row'}>
                <div className="form-group col-xs-5 col-md-5">
                    <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100528/*公司名称*/)}</label>
                    <ConstVirtualSelect
                        responseName="data.ccs"
                        isRequest={false}
                        initValueOptions={list}
                        form={this.props.form}
                        fieldName='ccId'
                        initialValue={xt.initSelectValue(oneData.ccId, oneData, ['ccId', 'ccName'], 'ccName', form)}
                        valueKeys={ da => ({
                            s_label:da.localName,
                            ccId:da.id,
                            ccName: da.name
                        })} rules={true}
                    />
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-5 col-md-5">
                    <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(201184/*邮件服务名*/)}</label>
                    <input type='text' className={getFieldErrorStyle('name','error-border', 'col-xs-8 col-md-8 text-input-nowidth')}
                           placeholder=""
                           {...getFieldProps('name', {
                               validateFirst: true,
                               rules: [{required: true,}],
                               valuedateTrigger: 'onBlur',
                               initialValue: String(oneData.name || '')
                           })} />
                </div>
                <div className="form-group col-xs-5 col-md-5">
                    <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(201185/*收件服务器类型*/)}</label>
                    <Select
                        animation='slide-up'
                        placeholder=''
                        className={getFieldErrorStyle('name','error-border', 'currency-btn select-from-currency col-xs-8 col-md-8')}
                        choiceTransitionName="rc-select-selection__choice-zoom"
                        optionLabelProp="children"
                        allowClear={false}
                        {...getFieldProps('receiveType', {
                            validateFirst: true,
                            rules: [{required: true,}],
                            initialValue: String(oneData.receiveType || '')
                        })}
                    >
                        <Option value="POP3" title="POP3">POP3</Option>
                        <Option value="IMAP" title="IMAP">IMAP</Option>
                    </Select>
                </div>
                <div className="form-group col-xs-2 col-md-2">
                    <label className={'col-xs-1 col-md-1'}/>
                    <label style={{textAlign: 'left'}}>
                        <Checkbox
                            style={{height: 'initial'}}
                            {...getFieldProps('status', {
                                valuePropName: 'checked',
                                initialValue: oneData.status
                            })}
                        />&nbsp;&nbsp;启用</label>
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-5 col-md-5">
                    <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(201186/*收件服务器地址*/)}</label>
                    <input type='text' className={getFieldErrorStyle('receiveServer','error-border', 'col-xs-8 col-md-8 text-input-nowidth')}
                           placeholder=""
                           {...getFieldProps('receiveServer', {
                               validateFirst: true,
                               rules: [{required: true,}],
                               valuedateTrigger: 'onBlur',
                               initialValue: String(oneData.receiveServer || '')
                           })} />
                </div>
                <div className="form-group col-xs-5 col-md-5">
                    <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(201187/*端口*/)}</label>
                    <input type='text' className={getFieldErrorStyle('receivePort','error-border', 'col-xs-8 col-md-8 text-input-nowidth')}
                           placeholder=""
                           {...getFieldProps('receivePort', {
                               validateFirst: true,
                               rules: [{required: true,}],
                               valuedateTrigger: 'onBlur',
                               initialValue: String(oneData.receivePort || '')
                           })} />
                </div>
                <div className="form-group col-xs-2 col-md-2">
                    <label className={'col-xs-1 col-md-1'}/>
                    <label style={{textAlign: 'left'}}>
                        <Checkbox
                            style={{height: 'initial'}}
                            {...getFieldProps('receiveSsl', {
                                valuePropName: 'checked',
                                initialValue: oneData.receiveSsl
                            })}
                        />&nbsp;&nbsp;开启收件SSL</label>
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-5 col-md-5">
                    <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(201188/*发件服务器地址*/)}</label>
                    <input type='text' className={getFieldErrorStyle('sendServer','error-border', 'col-xs-8 col-md-8 text-input-nowidth')}
                           placeholder=""
                           {...getFieldProps('sendServer', {
                               validateFirst: true,
                               rules: [{required: true,}],
                               valuedateTrigger: 'onBlur',
                               initialValue: String(oneData.sendServer || '')
                           })} />
                </div>
                <div className="form-group col-xs-5 col-md-5">
                    <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(201187/*端口*/)}</label>
                    <input type='text' className={getFieldErrorStyle('sendPort','error-border', 'col-xs-8 col-md-8 text-input-nowidth')}
                           placeholder=""
                           {...getFieldProps('sendPort', {
                               validateFirst: true,
                               rules: [{required: true,}],
                               valuedateTrigger: 'onBlur',
                               initialValue: String(oneData.sendPort || '')
                           })} />
                </div>
                <div className="form-group col-xs-2 col-md-2">
                    <label className={'col-xs-1 col-md-1'}/>
                    <label style={{textAlign: 'left'}}>
                        <Checkbox
                            style={{height: 'initial'}}
                            {...getFieldProps('sendSsl', {
                                valuePropName: 'checked',
                                initialValue: oneData.sendSsl
                            })}
                        />&nbsp;&nbsp;开启发件SSL</label>
                </div>
            </div>
        </div>);
        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
            {dom}
        </FormWrapper>);
    }
}

CommonForm = createForm()(CommonForm);

export default CommonForm;
