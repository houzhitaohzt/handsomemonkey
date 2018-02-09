import i18n from './../../../../lib/i18n';
import React, {PropTypes, Component} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
//引入select插件
import Select, {Option, ConstVirtualSelect} from './../../../../components/Select';
import Checkbox from '../../../../components/CheckBox';
import Radio from "../../../../components/Radio";
import DataTime from '../../../../components/Calendar/Calendar';
import Tree from '../../../../components/Tree';
import xt from '../../../../common/xt';

import {Translate, Localize, I18n} from '../../../../lib/i18n';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS} from '../../../../services/apiCall';
import * as RSA from './../../../../common/RSA';
import ServiceTips, {errorTips, successTips} from '../../../../components/ServiceTips';

class CommonForm extends Component {
    constructor(props) {
        super(props)
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = this.initState();
        this.rsaKeys = null;
        this.loginName = this.loginName.bind(this);
        this.initUserName = this.initUserName.bind(this);
    }

    static propTypes = {
        data: PropTypes.object,
        form: PropTypes.object,
        onSaveAndClose: PropTypes.func,
        onCancel: PropTypes.func,
    };

    initState() {
        return {
            checkedKeys: [],
            expandedKeys: [],
            checkedNames: [],
            gData: [],
            treeShow: false,
            updatePwd: false,
            password2: null,
            oneData: {},
            loginName:'',
            username:'',
            isValid:''
        }
    }

    static defaultProps = {
        onSaveAndClose(){
        },
        onCancel(){
        }
    };
    initUserName(){
        if(!this.props.record.id){
            apiGet(API_FOODING_ES,'/user/getLoginName',{},(response)=>{
                this.setState({
                    loginName:response.data||'',
                    username:response.data || ''
                });
            },(error)=>{

            })
        }
    }
    componentDidMount() {
        this.oneData();
        this.initRSAKeys();
        this.getLoginClusters();
        this.initCheckedKeys(this.props);
        this.initUserName();

    }

    oneData () {
        let that = this;
        if( !this.props.record.id) return;
        apiGet(API_FOODING_ES, '/user/getOne', {id: this.props.record.id}, ({data}) => {
            this.setState({
                oneData: data.user,
                checkedNames: data.user.partyNames || [],
                checkedKeys: data.user.partyIds || [],
                expandedKeys: data.user.partyIds || [],
                loginName:data.user.loginName,
                username:data.user.username

            });
        }, error => errorTips(error.message));
    }


    initRSAKeys () {
        apiGet(API_FOODING_ES, '/user/getPublicKey', {}, ({data}) => {
            RSA.setMaxDigits(130);
            this.rsaKeys= new RSA.RSAKeyPair(data.exponent, '', data.modulus);
        }, error => console.log(error));
    }

    initCheckedKeys (props) {
        this.setState({
            password2: null,
            updatePwd: false,
            treeShow: false
        });
    }

    getLoginClusters() {
        let that = this;
        apiGet(API_FOODING_ES, '/party/getPartySyncTreeByLoginUser', {}, (response) => {
            that.setState({ gData: response.data || [] });
        }, (error) => {

        })
    }

    clickParty = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let that = this;
        that.setState({treeShow: true});
    };

    onBlurParty = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let that = this;
        that.setState({treeShow: false});
    };

    secondonCheck = (keys, {checkedNodes}) => {
        let checkedNames = [];
        let checkedKeys = [];
        checkedNodes.forEach(node => {
            checkedKeys.push(node.key);
            checkedNames.push(node.props.title);
        });
        this.props.form.setFieldsValue({partyNames: checkedNames.join(",")});
        this.setState({checkedKeys, checkedNames});
    };

    onUpdatePwd = () => {
        let updatePwd = !this.state.updatePwd;
        if(updatePwd){
            this.props.form.setFieldsValue({"password": ''});
        } else {
            this.props.form.setFieldsValue({"password": this.state.oneData.password || ''});
        }
        this.setState({updatePwd});
    };

    onTreeExpand = (expandedKeys, {node}) =>{
        let expand = children =>{
            if( !children) return;
            children.forEach(da => {
               expand(da.props.children);

                let ix;
                if( ( ix = expandedKeys.indexOf(da.key)) !== -1){
                    expandedKeys.splice(ix, 1);
                }
            });
        };
        expand(node.props.children);
        this.setState({expandedKeys});
    };

    onSaveAndClose() {
        const {form, onSaveAndClose} = this.props;
        const {oneData} = this.state;
        const userId = oneData.id;

        form.validateFields((errors, value) => {
            if(this.state.isValid){
                errorTips("账号格式错误！");
                return false;
            }
            if ( !errors) {
                let params = Object.assign({}, form.getFieldsValue());
                params.partyNames = params.partyNames.split(",");
                params.partyIds = this.state.checkedKeys;

                let password = params.password;
                params.password = RSA.encryptedString(this.rsaKeys, params.password);
                if(userId){
                    if(this.state.updatePwd && password !== this.state.password2){
                        return errorTips("二次输入的密码不一致!");
                    }
                    params.id = userId;
                    apiPost(API_FOODING_ES, '/user/update', params, response => {
                        successTips(response.message);
                        onSaveAndClose && onSaveAndClose();
                    }, (error) => {
                        console.log(error);
                        errorTips(error.message);
                    })
                } else {
                    apiPost(API_FOODING_ES, '/user/create', params, response => {
                        successTips(response.message);
                        onSaveAndClose && onSaveAndClose();
                    }, ({message}) => errorTips(message))
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
    loginName(e){
        //验证登录名是否可以用
        var  repla = /^[0-9a-zA-Z]*$/g;
        if(e.target.value.length<=20&&e.target.value.length >=6 && repla.test(e.target.value)) {
            apiGet(API_FOODING_ES, '/user/getUserByUsername', {username: e.target.value,userId:this.state.oneData.id}, (response) => {
                this.setState({
                    isValid: response.data
                });
            }, (error) => {

            }, {isLoading: false});
        }else{
            this.setState({
                isValid: true
            });
        }

    }

    /**
     * 给组织树添加icon
     * */
    obtainIcon = ({label, title}) => {
        if(label.typeId == 10) return (<i className='foddingicon fooding-home_16' title={label.partyType && label.partyType.name ? label.partyType.name : "" }></i>);
        if(label.typeId == 20) return (<img src={require("../../../../styles/images/fd_clur.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
        if(label.typeId == 30) return (<img src={require("../../../../styles/images/fd_cp.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
        if(label.typeId == 40) return (<img src={require("../../../../styles/images/fd_party.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
        if(label.typeId == 50) return (<img src={require("../../../../styles/images/fd_jobs.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
        if(label.typeId == 60) return (<img src={require("../../../../styles/images/fd_role.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
        if(label.typeId == 70) return (<img src={require("../../../../styles/images/fd_role.png")} title={label.partyType && label.partyType.name ? label.partyType.name : "" } />);
    };

    render() {
        const {form} = this.props;
        const {oneData} = this.state;
        const {getFieldProps, getFieldErrorStyle, getNFieldProps,getFieldError, getFieldValue} = this.props.form;
        const {clusters = [], staffList = []} = this.props.initData;
        const disabled = form.isFieldsValidating() || form.isSubmitting();
        const userId = oneData.id;
        let dom = (<div className={'girdlayout'} style={{height: "344px", overflowY: 'auto'}} onClick={this.onBlurParty}>
            <div className={'row'}>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(201216/*用户账号*/)}</label>
                    <input type='text' className={getFieldErrorStyle('username', 'error-border', 'col-xs-8 col-md-8 text-input-nowidth')}
                           disabled={Boolean(true)}
                           placeholder=""
                           {...getFieldProps('username', {
                               validateFirst: true,
                               rules: [{required: true,}],
                               valuedateTrigger: 'onBlur',
                               initialValue: this.state.username
                           })} />
                </div>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(500317/*登录名*/)}</label>
                    <input type='text' className={ getFieldError('loginName') || this.state.isValid?'error-border col-xs-8 col-md-8 text-input-nowidth':'col-xs-8 col-md-8 text-input-nowidth'}
                           disabled={Boolean(false)}
                           placeholder=""
                           {...getFieldProps('loginName', {
                               validateFirst: true,
                               rules: [{required: true}],
                               valuedateTrigger: 'onBlur',
                               initialValue: this.state.loginName
                           })}
                        onBlur={this.loginName}
                    />
                    {this.state.isValid === false ? <i className="foddingicon fooding-tongguo valite" ></i>:''}
                    {this.state.isValid ? <i className="foddingicon fooding-chongfu valite" ></i> :''}
                    <label className={'col-xs-8 col-md-8'} style={{textAlign:'left'}}>支持字母与数字组合，6-20个字符</label>
                </div>
            </div>
            {
                !userId ?
                    <div>
                        <div className="row">
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(400145/*职员*/)}</label>
                                <ConstVirtualSelect
                                    disabled={Boolean(userId)}
                                    form={this.props.form}
                                    fieldName='staffName'
                                    className="col-xs-8 col-md-8"
                                    apiHost={API_FOODING_ES}
                                    apiUri='/staff/getUnAllotList'
                                    initialValue={
                                        xt.initSelectValue(userId, oneData, ['staffName', 'staffEnName', 'refId'], 'staffName', form)
                                    }
                                    rules
                                    valueKeys={ da => ({
                                        refId: da.id,
                                        staffName: da.localName,
                                        staffEnName: da.name,
                                        s_label: da.localName
                                    })}
                                />
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                    <label className={'col-xs-4 col-md-4'}>{i18n.t(400180/*禁止外网访问*/)}</label>
                                    <Checkbox
                                        {...getFieldProps('forbidOuterNet',{
                                            initialValue:oneData.forbidOuterNet || false
                                        })}
                                        checked={this.props.form.getFieldValue("forbidOuterNet")}
                                    />
                                </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(201224/*初始化密码*/)}</label>
                                <input type='password' className={getFieldErrorStyle('password', 'error-border', 'col-xs-8 col-md-8 text-input-nowidth')}
                                       placeholder=""
                                       {...getFieldProps('password', {
                                           validateFirst: true,
                                           rules: [{required: true,}],
                                           valuedateTrigger: 'onBlur',
                                           initialValue: oneData.password || ""
                                       })} autoComplete={"new-password"} />
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(201225/*确认密码*/)}</label>
                                <input type='password' className={'col-xs-8 col-md-8 text-input-nowidth'}
                                       value={this.state.password2 || ""}
                                       placeholder="" onChange={e=>this.setState({password2: e.target.value})} autoComplete={"new-password"}
                                />
                            </div>
                        </div>
                    </div>:
                    this.state.updatePwd?
                        <div>
                        <div className="row">
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(400145/*职员*/)}</label>
                                <ConstVirtualSelect
                                    disabled={Boolean(userId)}
                                    form={this.props.form}
                                    fieldName='staffName'
                                    className="col-xs-8 col-md-8"
                                    apiHost={API_FOODING_ES}
                                    apiUri='/staff/getUnAllotList'
                                    initialValue={
                                        xt.initSelectValue(userId, oneData, ['staffName', 'staffEnName', 'refId'], 'staffName', form)
                                    }
                                    rules
                                    valueKeys={ da => ({
                                        refId: da.id,
                                        staffName: da.localName,
                                        staffEnName: da.name,
                                        s_label: da.localName
                                    })}
                                />
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                    <label className={'col-xs-4 col-md-4'}>{i18n.t(400180/*禁止外网访问*/)}</label>
                                    <Checkbox
                                        {...getFieldProps('forbidOuterNet',{
                                            initialValue:oneData.forbidOuterNet || false
                                        })}
                                        checked={this.props.form.getFieldValue("forbidOuterNet")}
                                    />
                                </div>
                        </div>
                            <div className="row">
                                <div className="form-group col-xs-6 col-md-6">
                                    <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(201226/*用户密码*/)}</label>
                                    <input type='password' className={getFieldErrorStyle('password', 'error-border', 'col-xs-7 col-md-7 text-input-nowidth')}
                                           placeholder=""
                                           {...getFieldProps('password', {
                                               validateFirst: true,
                                               rules: [{required: true,}],
                                               valuedateTrigger: 'onBlur'
                                           })} autoComplete={"new-password"}/>
                                    <label className={'col-xs-2 col-md-2'} onClick={this.onUpdatePwd}>{i18n.t(201227/*取消修改*/)}</label>
                                </div>
                                <div className="form-group col-xs-6 col-md-6">
                                    <label className={'col-xs-4 col-md-4'}>{i18n.t(201225/*确认密码*/)}</label>
                                    <input type='password' className={'col-xs-8 col-md-8 text-input-nowidth'} value={this.state.password2 || ""}
                                           placeholder="" onChange={e=>this.setState({password2: e.target.value})} autoComplete={"new-password"}
                                    />
                                </div>
                            </div>
                        </div>:
                        <div>
                            <div className="row">
                                <div className="form-group col-xs-6 col-md-6">
                                    <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(400145/*职员*/)}</label>
                                    <ConstVirtualSelect
                                        disabled={Boolean(userId)}
                                        form={this.props.form}
                                        fieldName='staffName'
                                        className="col-xs-8 col-md-8"
                                        apiHost={API_FOODING_ES}
                                        apiUri='/staff/getUnAllotList'
                                        initialValue={
                                            xt.initSelectValue(userId, oneData, ['staffName', 'staffEnName', 'refId'], 'staffName', form)
                                        }
                                        rules
                                        valueKeys={ da => ({
                                            refId: da.id,
                                            staffName: da.localName,
                                            staffEnName: da.name,
                                            s_label: da.localName
                                        })}
                                    />
                                </div>
                                <div className="form-group col-xs-6 col-md-6">
                                    <label className={'col-xs-4 col-md-4'}>{i18n.t(400180/*禁止外网访问*/)}</label>
                                    <Checkbox
                                        {...getFieldProps('forbidOuterNet',{
                                            initialValue:oneData.forbidOuterNet || false
                                        })}
                                        checked={this.props.form.getFieldValue("forbidOuterNet")}
                                    />
                                </div>
                                
                            </div>
                            <div className="row">
                                <div className="form-group col-xs-6 col-md-6">
                                    <label className={'col-xs-4 col-md-4'}>{i18n.t(201226/*用户密码*/)}</label>
                                    <input type='password' className={'col-xs-7 col-md-7 text-input-nowidth'}
                                           placeholder=""
                                           {...getFieldProps('password', {
                                               validateFirst: true,
                                               rules: [{required: true,}],
                                               valuedateTrigger: 'onBlur',
                                               initialValue: oneData.password || ""
                                           })} autoComplete={"new-password"}/>
                                    <label className={'col-xs-2 col-md-2'} onClick={this.onUpdatePwd}>{i18n.t(201228/*修改密码*/)}</label>
                                </div>
                            </div>
                        </div>

            }
            <div className={'row'}>
                <div className="form-group col-xs-6 col-md-6">
                                    <label className={'col-xs-4 col-md-4'}>{i18n.t(201220/*生效时间*/)}</label>
                                    <div className={'col-xs-8 col-md-8 datetime'}>
                                        <DataTime
                                            beginData={new Date()}
                                            showTime={false}
                                            isShowIcon={true}
                                            width={'100%'}
                                            form={this.props.form}
                                            name={'startDate'}
                                            value={oneData.startDate}
                                        />
                                    </div>
                    </div>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(201221/*失效时间*/)}</label>
                    <div className={'col-xs-8 col-md-8 datetime'}>
                        <DataTime
                            beginData={new Date()}
                            showTime={false}
                            isShowIcon={true}
                            width={'100%'}
                            form={this.props.form}
                            name={'endDate'}
                            value={oneData.endDate}
                        />
                    </div>
                    </div>
                    
                
                
            </div>
            {
                userId ?
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-4 col-md-4'}>{i18n.t(201222/*创建用户*/)}</label>
                            <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
                                   placeholder=""
                                   disabled
                                   value={oneData.createUserName || ""} />
                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-4 col-md-4'}>{i18n.t(100145/*创建时间*/)}</label>
                            <div className={'col-xs-8 col-md-8 datetime'}>
                                <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
                                       disabled value={new Date(oneData.createDate).Format("yyyy-MM-dd hh:mm:ss")} />
                            </div>
                        </div>
                    </div>: null
            }
            {
                userId?
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-4 col-md-4'}>{i18n.t(201223/*修改用户*/)}</label>
                            <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
                                   disabled value={oneData.updateUserName || ""} />
                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-4 col-md-4'}>{i18n.t(100146/*修改时间*/)}</label>
                            <div className={'col-xs-8 col-md-8 datetime'}>
                                <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
                                       disabled value={new Date(oneData.updateDate).Format("yyyy-MM-dd hh:mm:ss")} />
                            </div>
                        </div>
                    </div>: null
            }

            <div className={'row'}>
                <div className="form-group col-xs-12 col-md-12">
                    <label className={'col-xs-2 col-md-2'}><span>*</span>{i18n.t(201219/*所属组织*/)}</label>
                    <input type='text' className={getFieldErrorStyle('partyNames', 'error-border', 'col-xs-10 col-md-10 text-input-nowidth')}
                           onClick={this.clickParty} readOnly
                           {...getFieldProps('partyNames', {
                               validateFirst: true,
                               rules: [{required: true,}],
                               initialValue: this.state.checkedNames.join(",")
                           })}
                    />
                </div>
            </div>
            {
                this.state.treeShow?
                    <div className="row" onClick={
                        event =>{
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }>
                        <div className="form-group col-xs-1 col-md-1"/>
                        <div className="form-group col-xs-8 col-md-8" onFocus={()=> console.log(2)}>
                            <Tree
                                checkStrictly={true}
                                checkable={true}
                                showSearch={false}
                                onCheck={this.secondonCheck}
                                showIcon={true}
                                selectable={true}
                                gData={this.state.gData}
                                checkedKeys={this.state.checkedKeys}
                                expandedKeys={this.state.expandedKeys}
                                onExpand={this.onTreeExpand}
                                obtainIcon={this.obtainIcon}
                            >
                            </Tree>
                        </div>
                    </div> : null
            }

        </div>);
        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
            {dom}
        </FormWrapper>);
    }
}

CommonForm = createForm()(CommonForm);

export default CommonForm;

