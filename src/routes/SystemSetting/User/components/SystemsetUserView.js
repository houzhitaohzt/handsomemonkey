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
        const {form, record} = this.props;
        const {getFieldProps, getFieldError} = this.props.form;
        const disabled = form.isFieldsValidating() || form.isSubmitting();
        let {staffIds} = this.state;
        staffIds = staffIds || [];
        let dom = (<div className={'  girdlayout'} style={{height: "344px"}}>
            <div className={'row'}>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-3 col-md-3'}>{i18n.t(201216/*用户账号*/)}</label>
                    <div className={'col-xs-9 col-md-9'}>
                        <p>{record.username}</p>
                    </div>
                </div>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-3 col-md-3'}>{i18n.t(201217/*用户类型*/)}</label>
                    <div className={'col-xs-9 col-md-9'}>
                        <p>{record.userType.name}</p>
                    </div>
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-3 col-md-3'}>{i18n.t(201218/*用户姓名*/)}</label>
                    <div className={'col-xs-9 col-md-9'}>
                        <p>{record.staffLocalName}</p>
                    </div>
                </div>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-3 col-md-3'}>{i18n.t(201219/*所属组织*/)}</label>
                    <div className={'col-xs-9 col-md-9'}>
                        <p>{record.partyNames ? record.partyNames[0] : ''}</p>
                    </div>
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-3 col-md-3'}>{i18n.t(201220/*生效时间*/)}</label>
                    <div className={'col-xs-9 col-md-9'}>
                        <p>{new Date(record.startDate).Format("yyyy-MM-dd hh:mm:ss")}</p>
                    </div>
                </div>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-3 col-md-3'}>{i18n.t(201221/*失效时间*/)}</label>
                    <div className={'col-xs-9 col-md-9'}>
                        <p>{new Date(record.endDate).Format("yyyy-MM-dd hh:mm:ss")}</p>
                    </div>
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-3 col-md-3'}>{i18n.t(201222/*创建用户*/)}</label>
                    <div className={'col-xs-9 col-md-9'}>
                        <p>{record.createUserName}</p>
                    </div>
                </div>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-3 col-md-3'}>{i18n.t(100145/*创建时间*/)}</label>
                    <div className={'col-xs-9 col-md-9'}>
                        <p>{new Date(record.createDate).Format("yyyy-MM-dd hh:mm:ss")}</p>
                    </div>
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-3 col-md-3'}>{i18n.t(201223/*修改用户*/)}</label>
                    <div className={'col-xs-9 col-md-9'}>
                        <p>{record.updateUserName}</p>
                    </div>
                </div>
                <div className="form-group col-xs-6 col-md-6">
                    <label className={'col-xs-3 col-md-3'}>{i18n.t(100146/*修改时间*/)}</label>
                    <div className={'col-xs-9 col-md-9'}>
                        <p>{new Date(record.updateDate).Format("yyyy-MM-dd hh:mm:ss")}</p>
                    </div>
                </div>
            </div>
        </div>)
        return (<FormWrapper showFooter={true} onCancel={this.onCancel} showSaveClose={false}>
            {dom}
        </FormWrapper>);
    }
}

CommonForm = createForm()(CommonForm);

export default CommonForm;

