import i18n from './../../../lib/i18n';
import React, {Component} from "react";
import {createForm} from "rc-form";
import {I18n} from "../../../lib/i18n";
import Input from "../../../components/FormValidating/FormValidating";
import WebData from "../../../common/WebData";
import xt from '../../../common/xt';
import * as RSA from "../../../common/RSA";
import {API_FOODING_ES, API_FOODING_DS, apiGet} from "../../../services/apiCall";
import {login as userLogin} from "../../../services/authorize/authorize";
import NavConnect from "../../../components/NavigateTabs/containers/AddContainer";
//引入提示
import Tooltip from "antd/lib/tooltip";
import "../assets/_logindialog.less";


class LoginDialog extends Component {
    constructor(props) {
        super(props);
        this.passwordV = WebData.getLastLoginUser().pwd;
        this.nameV  = WebData.getLastLoginUser().name;
        this.state = {
            errormessage: "",
            scrollHeight: 0,
            nameValue: '',
            passwordValue: '',
            passwordcloseShow: false,
            passwordType: 'password',
            rememberPwd: WebData.getLastLoginUser().pwd.length !== 0,
            switchClass: WebData.getLastLoginUser().pwd.length === 0?'switch-off':"switch-on",
            switchValue: WebData.getLastLoginUser().pwd.length === 0?'OFF':"ON",
        }
    }

    submit = () => {
        this.props.form.validateFields((error, value) => {
            if (error) {
                console.log(error, value);
            } else {
                let params = this.props.form.getFieldsValue();
                apiGet(API_FOODING_ES, '/fc/getExAndModForPublicKey', {}, ({data}) => {
                    RSA.setMaxDigits(130);
                    let rsaKeys = new RSA.RSAKeyPair(data.exponent, '', data.modulus);
                    let password = RSA.encryptedString(rsaKeys, value['password']);
                    let lang = i18n.getLang();
                    switch (lang) {
                        case 'zh-cn':
                            lang = 'zh_CN';
                            break;
                        case 'zh-tw':
                            lang = 'zh_TW';
                            break;
                        default:
                            break;
                    }
                    params = Object.assign({}, params, {password: password, language: lang});
                    userLogin(params, (response) => {
                        WebData.setUserAgent(value.name, this.state.rememberPwd ? value.password : null);
                        WebData.user = response;
                        this.setState({errormessage: ''},() => {
                            this.props.onCancel && this.props.onCancel();
                        });
                    }, (message) => {
                        this.setState({
                            errormessage: message.message
                        });
                    });
                }, error => console.log(error));
            }

        });
    };

    reset = () => {
        this.props.loginReset();
    };

    nameChange = (e) => {//邮箱输入框内容改变
        let nameShow;
        this.nameV = e.target.value;
        if (this.nameV.length != 0) {
            nameShow = true;
        } else {
            nameShow = false;
        }
        this.setState({
            namecloseShow: nameShow
        })
    };

    passwordChange = (e) => {//邮箱输入框内容改变
        let passwordShow;
        this.passwordV = e.target.value;
        if (this.passwordV.length != 0) {
            passwordShow = true;
        } else {
            passwordShow = false;
        }
        this.setState({
            passwordcloseShow: passwordShow
        })
    }

    closeValueClick = (e) => {//关闭按钮键
        let nameV, passwordV;
        passwordV = this.passwordV;
        nameV = this.nameV;
        let {namecloseShow, passwordcloseShow} = this.state;
        if (e.target.getAttribute("type") == "name") {
            nameV = "";
            this.nameV = "";
            namecloseShow = false;
        }
        if (e.target.getAttribute('type') == 'password') {
            passwordV = "";
            this.passwordV = "";
            passwordcloseShow = false;
        }
        this.props.form.setFieldsValue({name: this.nameV, password: this.passwordV});
        this.setState({
            namecloseShow: namecloseShow,
            passwordcloseShow: passwordcloseShow
        })
    }

    onPreviewClick = () => {//显示隐藏密码
        let type;
        if (this.state.passwordType == 'password') {
            type = 'text';
        } else {
            type = 'password';
        }
        this.setState({
            passwordType: type
        })
    }

    switchClick = () => {//记住密码开关
        let classN, switchV, rememberPwd;
        if (this.state.rememberPwd) {
            classN = 'switch-off';
            switchV = "OFF";
            rememberPwd = false;
        } else {
            rememberPwd = true;
            classN = 'switch-on';
            switchV = "ON";
        }
        this.setState({
            rememberPwd,
            switchClass: classN,
            switchValue: switchV
        })
    };

    //关闭弹窗
    onCancel = () => {
        this.props.onCancel && this.props.onCancel();
    };

    //join free
    onJoinFree = () => {
        window.open(window.location.origin + "/user/register");
    };
    //forgetPassword
    onForgetPassword = () => {
        window.open(window.location.origin + "/user/retrieve");
    };

    render() {
        let {passwordValue, passwordType, switchClass, switchValue} = this.state;
        return (<div className={'logindialog-interface'}>
            <span className={"logindialog-interface-icon"} onClick={this.onCancel}><i className="foddingicon fooding-close"></i></span>
            <div className={'show-error-message'}>{this.state.errormessage}</div>
            <div className={'input-email'}>
                <Input form={this.props.form} obj={{
                    name: 'name', type: 'text',
                    classn: 'width100',
                    onChange: this.nameChange, initialValue: this.nameV
                }} onKeyUp={this._onKeyUp}/>
                <i className={'foddingicon fooding-user_icon user'}/>
                <span><i className={'foddingicon fooding-close'} onClick={this.closeValueClick} type='name'
                         title={i18n.t(200665/*清空用户名*/)}></i></span>
            </div>
            <Tooltip
                visible={false}
                placement="bottomLeft"
                animation="zoom"
                onVisibleChange={this.onVisibleChange}
                trigger="click"
                overlay={<span className='rc-tooltip-arrow-inner'
                               style={{
                                   color: '#fff', display: 'block',
                                   lineHeight: '34px', padding: '0 5px',
                                   backgroundColor: 'rgba(0,0,0,0.8)'
                               }}>{i18n.t(200666/*大写锁定已打开*/)}</span>}
            >
                <div className={'input-secret'}>
                    <Input form={this.props.form} obj={{
                        name: 'password', type: passwordType,
                        classn: 'width100',
                        onChange: this.passwordChange, initialValue: this.passwordV
                    }} onKeyUp={this._onKeyUp}

                    />
                    <i className={'foddingicon fooding-change-password password'}/>
                    <span><i className={'foddingicon fooding-close'} onClick={this.closeValueClick} type='password'
                             title={i18n.t(200665/*清空用户名*/)}></i>
                    <i className={'foddingicon fooding-preview'}
                                                                    onClick={this.onPreviewClick}
                                                                    title="显示/隐藏密码"></i></span>
                </div>
            </Tooltip>
            <div className={'rember-language'}>
                <div className="rember-language-more">
                    <a className={'route'} onClick={this.onForgetPassword}>{i18n.t(300025/*忘记密码?*/)}</a>
                </div>
                <div className={'rember-language-fi'}>
                    <span className={'word'}>{I18n.t(100524/*记住密码*/)}</span>
                    <div className={switchClass} onClick={this.switchClick}>
                        <span>{switchValue}</span>
                        <span className={'ball'}/>
                    </div>
                </div>
            </div>
            <div className={'main-login'}>
                <button onClick={this.submit.bind(this)}>{i18n.t(200667/*登录*/)}</button>
            </div>
            <div className={'registered'}>
                <a className={'route'} onClick={this.onJoinFree}>{i18n.t(200668/*免费注册*/)}</a>
            </div>
        </div>)
    }
}

export default createForm()(LoginDialog);