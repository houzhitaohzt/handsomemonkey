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
        const {form} = this.props;
        const {getFieldProps, getFieldError} = this.props.form;
        const disabled = form.isFieldsValidating() || form.isSubmitting();
        let {staffIds} = this.state;
        staffIds = staffIds || [];
        let dom = (<div className={'  girdlayout'} style={{height: "344px"}}>
            <div className={'row'}>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100225/*工号*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p className={'paragraph'}>{i18n.t(100225/*工号*/)}</p>
                    </div>
                </div>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100231/*姓名*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p className={'paragraph'}>{i18n.t(100231/*姓名*/)}</p>
                    </div>
                </div>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100235/*语言*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p className={'paragraph'}>{i18n.t(100235/*语言*/)}</p>
                    </div>
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100087/*国家*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p className={'paragraph'}>{i18n.t(100087/*国家*/)}</p>
                    </div>
                </div>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100236/*职称*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p className={'paragraph'}>{i18n.t(100236/*职称*/)}</p>
                    </div>
                </div>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100237/*职员类型*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p className={'paragraph'}>{i18n.t(100237/*职员类型*/)}</p>
                    </div>
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100140/*组织*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p className={'paragraph'}>{i18n.t(100140/*组织*/)}</p>
                    </div>
                </div>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(201181/*岗位*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p className={'paragraph'}>{i18n.t(201181/*岗位*/)}</p>
                    </div>
                </div>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100228/*在职状态*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p className={'paragraph'}>{i18n.t(100228/*在职状态*/)}</p>
                    </div>
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100239/*性别*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p className={'paragraph'}>{i18n.t(100239/*性别*/)}</p>
                    </div>
                </div>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100240/*学历*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p className={'paragraph'}>{i18n.t(100240/*学历*/)}</p>
                    </div>
                </div>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100241/*身份证号*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p className={'paragraph'}>{i18n.t(100241/*身份证号*/)}</p>
                    </div>
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-xs-4 col-md-4">
                    <label className={'col-xs-4 col-md-4'}>{i18n.t(100242/*兴趣爱好*/)}</label>
                    <div className={'col-xs-8 col-md-8'}>
                        <p className={'paragraph'}>{i18n.t(100242/*兴趣爱好*/)}</p>
                    </div>
                </div>
                <div className="form-group col-xs-8 col-md-8">
                    <label className={'col-xs-2 col-md-2'}>{i18n.t(100229/*邮箱*/)}</label>
                    <div className={'col-xs-10 col-md-10'}>
                        <p className={'paragraph'}>{i18n.t(100229/*邮箱*/)}</p>
                    </div>
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

