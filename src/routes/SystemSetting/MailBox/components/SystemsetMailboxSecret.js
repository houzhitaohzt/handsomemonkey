import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
//引入弹层
//引入select插件
import {API_FOODING_MAIL,apiPost,apiForm, apiGet} from "../../../../services/apiCall";
import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框

class CommonForm extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = this.initState();
    }

    static propTypes = {
        form: PropTypes.object,
        onSaveAndClose: PropTypes.func,
        onCancel: PropTypes.func,
        initData: PropTypes.object
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
                if(value.mpass !== value.re_mpass) return errorTips('两次输入的密码不一致!');
                apiPost(API_FOODING_MAIL, '/emailconfig/encrypt', value,
                    response => {
                        successTips('密码重置成功!');
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
        const {oneData} = this.state;
        const {getFieldProps, getFieldErrorStyle} = this.props.form;
        const disabled = form.isFieldsValidating() || form.isSubmitting();
        let {staffIds} = this.state;
        staffIds = staffIds || [];
        let dom;
        dom = (<div className={'  girdlayout'} style={{height: "160px"}}>
            <div className={'row'}>
                <div className="form-group col-xs-12 col-md-12">
                    <label className={'col-xs-2 col-md-2 col-xs-offset-3 col-md-offset-3'}
                           {...getFieldProps('id', {initialValue: oneData.id})}>{i18n.t(100229/*邮箱*/)}</label>
                    <input type='text' disabled className={getFieldErrorStyle('email', 'error-border', 'col-xs-4 col-md-4 text-input-nowidth')}
                           placeholder=""
                           {...getFieldProps('email', {
                               validateFirst: true,
                               rules: [{required: true,}],
                               initialValue: oneData && ('email' in oneData) ? oneData.email : ''
                           })} />
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-12 col-md-12">
                    <label className={'col-xs-2 col-md-2 col-xs-offset-3 col-md-offset-3'}>{i18n.t(201182/*密码*/)}</label>
                    <input type='password' className={getFieldErrorStyle('mpass', 'error-border', 'col-xs-4 col-md-4 text-input-nowidth')}
                           placeholder=""
                           {...getFieldProps('mpass', {
                               validateFirst: true,
                               rules: [{required: true,}],
                               valuedateTrigger: 'onBlur',
                               initialValue: ''
                           })} />
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-12 col-md-12">
                    <label className={'col-xs-2 col-md-2 col-xs-offset-3 col-md-offset-3'}>{i18n.t(201183/*再次输入密码*/)}</label>
                    <input type='password' className={getFieldErrorStyle('re_mpass', 'error-border', 'col-xs-4 col-md-4 text-input-nowidth')}
                           placeholder=""
                           {...getFieldProps('re_mpass', {
                               validateFirst: true,
                               rules: [{required: true,}],
                               valuedateTrigger: 'onBlur',
                               initialValue: ''
                           })} />
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

/*dom=(<div className={'congration'}>
 <div>
 <i className={"fodding fooding-dui-icon2"}></i><br />
 <span>恭喜！密码重置成功！</span>
 </div>
 </div>)*/

