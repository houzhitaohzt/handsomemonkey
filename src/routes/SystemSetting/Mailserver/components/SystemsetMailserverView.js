import i18n from './../../../../lib/i18n';
import React, {PropTypes, Component} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
//引入select插件
import Select, {Option} from 'rc-select';
import Radio from "../../../../components/Radio";
import Checkbox from '../../../../components/CheckBox';

import {Translate, Localize, I18n} from '../../../../lib/i18n';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_MAIL} from '../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框

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
    }

    initState() {
        return {
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
        if (onSaveAndClose) {
            onSaveAndClose();
        }
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
        let {oneData} = this.state;
        let dom = (<div className={'girdlayout'} style={{height: "344px"}}>
            <div className={'row'}>
                <div className="form-group col-xs-5 col-md-5">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100528/*公司名称*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p>{oneData.ccName}</p>
                    </div>
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-5 col-md-5">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(201184/*邮件服务名*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p>{oneData.name}</p>
                    </div>
                </div>
                <div className="form-group col-xs-5 col-md-5">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(201185/*收件服务器类型*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p>{oneData.receiveType}</p>
                    </div>
                </div>
                <div className="form-group col-xs-2 col-md-2">
                    <label className={'col-xs-1 col-md-1'}/>
                    <label style={{textAlign: 'left'}}>
                        <Checkbox
                            disabled
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
                    <div className={'col-xs-8 col-md-8'}>
                        <p>{oneData.receiveServer}</p>
                    </div>
                </div>
                <div className="form-group col-xs-5 col-md-5">
                    <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(201187/*端口*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p>{oneData.receivePort}</p>
                    </div>
                </div>
                <div className="form-group col-xs-2 col-md-2">
                    <label className={'col-xs-1 col-md-1'}/>
                    <label style={{textAlign: 'left'}}>
                        <Checkbox
                            disabled
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
                    <div className={'col-xs-8 col-md-8'}>
                        <p>{oneData.sendServer}</p>
                    </div>
                </div>
                <div className="form-group col-xs-5 col-md-5">
                    <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(201187/*端口*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p>{oneData.sendPort}</p>                        
                    </div>
                </div>
                <div className="form-group col-xs-2 col-md-2">
                    <label className={'col-xs-1 col-md-1'}/>
                    <label style={{textAlign: 'left'}}>
                        <Checkbox
                            disabled
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

