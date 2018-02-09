import i18n from './../../../../lib/i18n';
import React, {PropTypes, Component} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
//引入select插件
import Select, {Option, ConstVirtualSelect} from '../../../../components/Select';
import xt from '../../../../common/xt';
import Radio from "../../../../components/Radio";
import Checkbox from '../../../../components/CheckBox';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_MAIL} from '../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框

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
        apiGet(API_FOODING_MAIL, '/emailconfig/getOne', {email: this.props.otherData.localName},
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
            if ( !errors) {
                apiPost(API_FOODING_MAIL, '/emailconfig/save', {
                    id: value.id,
                    email: value.email,
                    needReview: value.needReview,
                    serverConfig: {id:value.serverConfig}
                }, response => {
                    successTips('配置成功!');
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
        const {form, otherData} = this.props;
        const {data, oneData} = this.state;
        const {getFieldProps, getFieldError} = this.props.form;
        const disabled = form.isFieldsValidating() || form.isSubmitting();
        let {staffIds} = this.state;
        staffIds = staffIds || [];
        let dom;
        dom = (<div className={' girdlayout'} style={{height: "50px"}}>
            <div className={'row'}>
                <div className="form-group col-xs-5 col-md-5">
                    <label className={'col-xs-4 col-md-4'} {...getFieldProps('id', {initialValue: oneData.id})}>{i18n.t(100229/*邮箱*/)}</label>
                    <input disabled type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
                           placeholder="" {...getFieldProps('email', {initialValue: otherData.localName})}/>
                </div>
                <div className="form-group col-xs-5 col-md-5">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(201178/*服务器*/)}</label>
                    <ConstVirtualSelect
                        apiHost={API_FOODING_MAIL}
                        form={this.props.form}
                        fieldName='serverConfig'
                        apiUri='/serverconfig/getList'
                        initialValue={
  												oneData.serverConfig?{s_label:oneData.serverConfig.name,
  													serverConfig:oneData.serverConfig.id}:undefined
  										  }
                        rules={true}
                    />
                </div>
            </div>
                <div className="col-xs-5 col-md-5 none">
                    <label className={'col-xs-4 col-md-4'}/>
                    <label style={{textAlign: 'left'}}>
                        <Checkbox
                            {...getFieldProps('needReview', {
                                valuePropName: 'checked',
                                initialValue: Boolean(oneData.needReview)
                            })}
                        />&nbsp;&nbsp;审核控制</label>
                </div>
        </div>);
        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
            {dom}
        </FormWrapper>);
    }
}

const MailboxConfiguration = createForm()(CommonForm);

export default MailboxConfiguration;
