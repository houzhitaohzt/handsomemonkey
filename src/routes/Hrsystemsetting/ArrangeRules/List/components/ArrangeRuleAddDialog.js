import React, {PropTypes, Component} from 'react';
import {createForm, FormWrapper} from "../../../../../components/Form";
//引入select插件
import Checkbox from '../../../../../components/CheckBox';
import xt from '../../../../../common/xt';
import Radio from "../../../../../components/Radio";
import Select, {Option, ConstMiniSelect, ConstVirtualSelect} from '../../../../../components/Select';

import {
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_ES,
    API_FOODING_DS,
    API_FOODING_HR
} from '../../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from '../../../../../components/ServiceTips';

import i18n, {I18n} from '../../../../../lib/i18n';
import WebData from '../../../../../common/WebData';

class ArrangeRuleAddDialog extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        let weeks = props.getOne.weeks;
        let rotates = props.getOne.rotates;
        this.state = {
            arrWeek: weeks && weeks.length > 0 ? weeks : [{}],
            arrRotate: rotates && rotates.length > 0 ? rotates : [{}],
        };
        this.one = null;
        this.two = null;
        this.three = null;
        this.four = null;
        this.five = null;
        this.six = null;
        this.seven = null;

    }

    static propTypes = {
        data: PropTypes.object,
        form: PropTypes.object,
        onSaveAndClose: PropTypes.func,
        onCancel: PropTypes.func,
    };

    componentDidMount() {

    }

    onSaveAndClose() {
        const {form, onSaveAndClose, getOne = {}} = this.props;
        form.validateFields((errors, value) => {
            if (!errors) {
                delete getOne['weeks'];
                delete getOne['rotates'];
                let params = Object.assign({}, getOne, form.getFieldsValue());

                apiPost(API_FOODING_HR, '/schedulerule/save', params, response => {
                    successTips(response.message);
                    onSaveAndClose && onSaveAndClose();
                }, ({message}) => errorTips(message))
            }
        })
    }

    onCancel() {
        this.props.onCancel && this.props.onCancel()
    }

    addWeekClick = () => {
        this.props.form.validateFields((error, value) => {
            if (error) {

            } else {
                let array = this.state.arrWeek;
                array.push({});
                this.setState({arrWeek: array})
            }
        })
    };
    deleteWeekClick = (i, da) => {
        let {arrWeek} = this.state;
        arrWeek.splice(i, 1, null);
        this.setState({arrWeek});
        //let arr = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'];
        // this.props.form.validateFields((errors, value) => {
        //     if (errors) {
        //
        //     } else {
        //         let weekDay = value.weeks[i].weekDay && value.weeks[i].weekDay.length > 0 ? value.weeks[i].weekDay : [];
        //         if(weekDay.length){
        //             for(let k = 0; k < weekDay.length; k ++){
        //                 if(weekDay[k]){
        //                     this[[arr[k]]] = null;
        //                 }
        //             }
        //         }
        //
        //     }
        // })
    };


    addRotateClick = () => {
        this.props.form.validateFields((error, value) => {
            if (error) {

            } else {
                let array = this.state.arrRotate;
                array.push({});
                this.setState({arrRotate: array})
            }
        })
    };
    deleteRotateClick = (j) => {
        let {arrRotate} = this.state;
        arrRotate.splice(j, 1);
        this.setState({arrRotate});
    };


    renderWeek = () => {
        let that = this;
        const {getFieldProps, getFieldErrorStyle, getNFieldProps, getFieldError, getFieldValue} = this.props.form;
        let {getOne = {}} = this.props;
        let {arrWeek} = this.state;
        return (
            <div className={'row'}>
                <div className={'row'}>
                    <div className="form-group col-xs-3 col-md-3">
                        <label className={'col-md-3 col-lg-3'}></label>
                        {i18n.t(600274/*班次名称*/)}
                    </div>
                    <div className="form-group col-xs-1 col-md-1" style={{textAlign:'left'}}>
                        {I18n.t(400172/*星期一*/)}
                    </div>
                    <div className="form-group col-xs-1 col-md-1" style={{textAlign:'left'}}>
                        {I18n.t(400173/*星期二*/)}
                    </div>
                    <div className="form-group col-xs-1 col-md-1" style={{textAlign:'left'}}>
                        {I18n.t(400174/*星期三*/)}
                    </div>
                    <div className="form-group col-xs-1 col-md-1" style={{textAlign:'left'}}>
                        {I18n.t(400175/*星期四*/)}
                    </div>
                    <div className="form-group col-xs-1 col-md-1" style={{textAlign:'left'}}>
                        {I18n.t(400176/*星期五*/)}
                    </div>
                    <div className="form-group col-xs-1 col-md-1" style={{textAlign:'left'}}>
                        {I18n.t(400177/*星期六*/)}
                    </div>
                    <div className="form-group col-xs-1 col-md-1" style={{textAlign:'left'}}>
                        {I18n.t(400178/*星期日*/)}
                    </div>
                </div>
                {
                    arrWeek.map((da, i) => {
                        if(da == null) return da;
                        that.one = that.one ? that.one : (da.weekDay && da.weekDay[0] ? `weeks[${i}].weekDay[0]` : null);
                        that.two = that.two ? that.two : (da.weekDay && da.weekDay[1] ? `weeks[${i}].weekDay[1]` : null);
                        that.three = that.three ? that.three : (da.weekDay && da.weekDay[2] ? `weeks[${i}].weekDay[2]` : null);
                        that.four = that.four ? that.four : (da.weekDay && da.weekDay[3] ? `weeks[${i}].weekDay[3]` : null);
                        that.five = that.five ? that.five : (da.weekDay && da.weekDay[4] ? `weeks[${i}].weekDay[4]` : null);
                        that.six = that.six ? that.six : (da.weekDay && da.weekDay[5] ? `weeks[${i}].weekDay[5]` : null);
                        that.seven = that.seven ? that.seven : (da.weekDay && da.weekDay[6] ? `weeks[${i}].weekDay[6]` : null);
                        return (<div className={'row'} key={i}>
                            <i {...getFieldProps('weeks[' + i + '].weekDtlId', {initialValue: da.weekDtlId || ""})}/>
                            <i {...getFieldProps('weeks[' + i + '].sort', {initialValue: i})}/>
                            <div className="form-group col-xs-3 col-md-3">
                                <label className={'col-md-3 col-lg-3'}></label>
                                <ConstVirtualSelect
                                    isRequest={Boolean(getFieldValue('company', getOne.company || {}).id)}
                                    form={this.props.form}
                                    fieldName={'weeks[' + i + '].schedule'}
                                    apiType={apiGet}
                                    apiHost={API_FOODING_HR}
                                    apiUri="/schedule/getList"
                                    apiParams={{
                                        clusterId: WebData.user.data.staff.cluster.id,
                                        companyId: getFieldValue('company', getOne.company || {}).id
                                    }}
                                    rules
                                    initValueOptions={da.schedule ? [da.schedule] : []}
                                    initialValue={xt.initSelectValue(da.schedule && da.schedule.id, da.schedule || {}, ['weeks[' + i + '].schedule'], 'localName', this.props.form, true)}
                                    valueKeys={da => ({
                                        code: da.code,
                                        enName: da.enName,
                                        id: da.id,
                                        localName: da.localName,
                                        name: da.name,
                                        s_ignore_label: true
                                    })}
                                    className={'col-md-8 col-lg-8'}
                                />
                            </div>
                            <div className="form-group col-xs-1 col-md-1">
                                <Checkbox
                                    {...getFieldProps(`weeks[${i}].weekDay[0]`,{
                                        initialValue: that.one === `weeks[${i}].weekDay[0]`,
                                        onChange: (e) => {
                                            return that.one = e.target.checked ? `weeks[${i}].weekDay[0]` : null;
                                        },
                                    })}
                                    checked={this.props.form.getFieldValue(`weeks[${i}].weekDay[0]`)}
                                />
                            </div>
                            <div className="form-group col-xs-1 col-md-1">
                                <Checkbox
                                    {...getFieldProps(`weeks[${i}].weekDay[1]`,{
                                        initialValue: that.two === `weeks[${i}].weekDay[1]`,
                                        //onChange: () => that.two = `weeks[${i}].weekDay[1]`,
                                        onChange: (e) => {
                                            return that.two = e.target.checked ? `weeks[${i}].weekDay[1]` : null;
                                        },
                                    })}
                                    checked={this.props.form.getFieldValue(`weeks[${i}].weekDay[1]`)}
                                />
                            </div>
                            <div className="form-group col-xs-1 col-md-1">
                                <Checkbox
                                    {...getFieldProps(`weeks[${i}].weekDay[2]`,{
                                        initialValue: that.three === `weeks[${i}].weekDay[2]`,
                                        //onChange: () => that.three = `weeks[${i}].weekDay[2]`,
                                        onChange: (e) => {
                                            return that.three = e.target.checked ? `weeks[${i}].weekDay[2]` : null;
                                        },
                                    })}
                                    checked={this.props.form.getFieldValue(`weeks[${i}].weekDay[2]`)}
                                />
                            </div>
                            <div className="form-group col-xs-1 col-md-1">
                                <Checkbox
                                    {...getFieldProps(`weeks[${i}].weekDay[3]`,{
                                        initialValue: that.four === `weeks[${i}].weekDay[3]`,
                                        //onChange: () => that.four = `weeks[${i}].weekDay[3]`,
                                        onChange: (e) => {
                                            return that.four = e.target.checked ? `weeks[${i}].weekDay[3]` : null;
                                        },
                                    })}
                                    checked={this.props.form.getFieldValue(`weeks[${i}].weekDay[3]`)}
                                />
                            </div>
                            <div className="form-group col-xs-1 col-md-1">
                                <Checkbox
                                    {...getFieldProps(`weeks[${i}].weekDay[4]`,{
                                        initialValue: that.five === `weeks[${i}].weekDay[4]`,
                                        //onChange: () => that.five = `weeks[${i}].weekDay[4]`,
                                        onChange: (e) => {
                                            return that.five = e.target.checked ? `weeks[${i}].weekDay[4]` : null;
                                        },
                                    })}
                                    checked={this.props.form.getFieldValue(`weeks[${i}].weekDay[4]`)}
                                />
                            </div>
                            <div className="form-group col-xs-1 col-md-1">
                                <Checkbox
                                    {...getFieldProps(`weeks[${i}].weekDay[5]`,{
                                        initialValue: that.six === `weeks[${i}].weekDay[5]`,
                                        //onChange: () => that.six = `weeks[${i}].weekDay[5]`,
                                        onChange: (e) => {
                                            return that.six = e.target.checked ? `weeks[${i}].weekDay[5]` : null;
                                        },
                                    })}
                                    checked={this.props.form.getFieldValue(`weeks[${i}].weekDay[5]`)}
                                />
                            </div>
                            <div className="form-group col-xs-1 col-md-1">
                                <Checkbox
                                    {...getFieldProps(`weeks[${i}].weekDay[6]`,{
                                        initialValue: that.seven === `weeks[${i}].weekDay[6]`,
                                        //onChange: () => that.seven = `weeks[${i}].weekDay[6]`,
                                        onChange: (e) => {
                                            return that.seven = e.target.checked ? `weeks[${i}].weekDay[6]` : null;
                                        },
                                    })}
                                    checked={this.props.form.getFieldValue(`weeks[${i}].weekDay[6]`)}
                                />
                            </div>
                            <div className="form-group col-xs-2 col-md-2">
                                <i className='foddingicon fooding-add-icon3'
                                   style={{paddingLeft: '20px'}}
                                   onClick={this.addWeekClick.bind(this, i)}></i>
                                {i == 0 ? '' :
                                    <i className='foddingicon fooding-delete-icon4'
                                       style={{paddingLeft: '20px'}} onClick={this.deleteWeekClick.bind(this, i, da)}></i>
                                }
                            </div>
                        </div>)
                    })
                }
            </div>
        )
    };

    renderRotate = () => {
        let that = this;
        const {getFieldProps, getFieldErrorStyle, getNFieldProps, getFieldError, getFieldValue} = this.props.form;
        let {getOne = {}} = this.props;
        let {arrRotate} = this.state;
        return (
            <div className={'row'}>
                <div className={'row'}>
                    <div className="form-group col-xs-4 col-md-4">
                        <label className={'col-md-5 col-lg-5'}></label>{i18n.t(400248/*班次选择*/)}
                    </div>
                    <div className="form-group col-xs-3 col-md-3">
                        <label className={'col-md-4 col-lg-4'}></label>{i18n.t(400249/*工作天数*/)}
                    </div>
                    <div className="form-group col-xs-3 col-md-3">
                        <label className={'col-md-4 col-lg-4'}></label>{i18n.t(400250/*休息天数*/)}
                    </div>
                </div>
                {
                    arrRotate.map((da, j) => {
                        return (
                            <div className={'row'} key={j}>
                                <i {...getFieldProps('rotates[' + j + '].rotateDtlId', {initialValue: da.rotateDtlId || ""})}/>
                                <i {...getFieldProps('rotates[' + j + '].sort', {initialValue: j})}/>
                                <div className="form-group col-xs-4 col-md-4">
                                    <label className={'col-md-5 col-lg-5'}></label>
                                    <ConstVirtualSelect
                                        isRequest={Boolean(getFieldValue('company', getOne.company || {}).id)}
                                        form={this.props.form}
                                        fieldName={'rotates[' + j + '].schedule'}
                                        apiType={apiGet}
                                        apiUri="/schedule/getList"
                                        apiHost={API_FOODING_HR}
                                        apiParams={{
                                            clusterId: WebData.user.data.staff.cluster.id,
                                            companyId: getFieldValue('company', getOne.company || {}).id
                                        }}
                                        rules
                                        initValueOptions={da.schedule ? [da.schedule] : []}
                                        initialValue={xt.initSelectValue(da.schedule && da.schedule.id, da.schedule || {}, ['weeks[' + j + '].schedule'], 'localName', this.props.form, true)}
                                        valueKeys={da => ({
                                            code: da.code,
                                            enName: da.enName,
                                            id: da.id,
                                            localName: da.localName,
                                            name: da.name,
                                            s_ignore_label: true
                                        })}
                                        className={'col-md-7 col-lg-7'}
                                    />
                                </div>
                                <div className="form-group col-xs-3 col-md-3">
                                    <label className={'col-md-4 col-lg-4'}></label>
                                    <input type="text"
                                           {...getNFieldProps('rotates[' + j + '].workingDay', {
                                               initialValue: da.workingDay || "",
                                               validateFirst: true,
                                               rules: [{required:true, pattern:xt.pattern.positiveInteger}],
                                               valuedateTrigger:"onBlur",
                                           })}
                                           className={getFieldError('rotates[' + j + '].workingDay') ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
                                    />
                                </div>
                                <div className="form-group col-xs-3 col-md-3">
                                    <label className={'col-md-4 col-lg-4'}></label>
                                    <input type="text"
                                           {...getNFieldProps('rotates[' + j + '].helfDay', {
                                               initialValue: da.helfDay || '',
                                               validateFirst: true,
                                               rules: [{required:true, pattern:xt.pattern.positiveInteger}],
                                               valuedateTrigger:"onBlur",
                                           })}
                                           className={getFieldError('rotates[' + j + '].helfDay') ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
                                    />
                                </div>
                                <div className="form-group col-xs-2 col-md-2">
                                    <i className='foddingicon fooding-add-icon3'
                                       style={{paddingLeft: '20px'}}
                                       onClick={this.addRotateClick.bind(this, j)}></i>
                                    {j == 0 ? '' :
                                        <i className='foddingicon fooding-delete-icon4'
                                           style={{paddingLeft: '20px'}}
                                           onClick={this.deleteRotateClick.bind(this, j)}></i>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    };


    render() {
        let that = this;
        const {form} = this.props;
        const {getFieldProps, getFieldErrorStyle, getNFieldProps, getFieldError, getFieldValue} = this.props.form;
        let {getOne = {}} = this.props;

        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
            <div className={'girdlayout'}>
                <div className={'row'}>
                    <div className="form-group col-md-6 col-lg-6">
                        <label className={'col-md-3 col-lg-3'}>{i18n.t(100243/*集团*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            apiHost={API_FOODING_ES}
                            apiUri="/party/getLoginClusters"
                            fieldName="cluster"
                            initialValue={xt.initSelectValue(true, getOne.cluster || WebData.user.data.staff.cluster, ['cluster'], 'localName', form, true)}
                            valueKeys={da => ({
                                ...da,
                                s_ignore_label: true
                            })} disabled
                            className={'col-md-9 col-lg-9'}
                        />
                    </div>
                    <div className="form-group col-md-6 col-lg-6">
                        <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            apiUri="/party/getLoginCompanies"
                            apiHost={API_FOODING_ES}
                            apiParams={{clusId: getOne.cluster && getOne.cluster.id ? getOne.cluster.id : WebData.user.data.staff.clusId}}
                            fieldName="company"
                            initialValue={xt.initSelectValue(getOne.company && getOne.company.id, getOne.company || {}, ['company'], 'localName', form, true)}
                            valueKeys={da => ({
                                ...da,
                                s_ignore_label: true
                            })} rules
                            className={'col-md-9 col-lg-9'}
                        />
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-6 col-lg-6">
                        <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(400240/*规则编号*/)}</label>
                        <input type="text" {...getFieldProps('code', {
                            validateFirst: true,
                            rules: [{required: true,}],
                            valuedateTrigger: 'onBlur',
                            initialValue: getOne.code || "",
                        })}
                               className={getFieldError('code') ? 'col-md-9 col-lg-9 text-input-nowidth error-border' : 'col-md-9 col-lg-9 text-input-nowidth'}
                               disabled={Boolean(!!getOne.id)}
                        />
                    </div>
                    <div className="form-group col-md-6 col-lg-6">
                        <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(400241/*规则名称*/)}</label>
                        <input type="text" {...getFieldProps('name', {
                            validateFirst: true,
                            rules: [{required: true,}],
                            valuedateTrigger: 'onBlur',
                            initialValue: getOne.name || "",
                        })}
                               className={getFieldError('name') ? 'col-md-9 col-lg-9 text-input-nowidth error-border' : 'col-md-9 col-lg-9 text-input-nowidth'}
                        />
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-6 col-lg-6">
                        <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(400242/*规则类型*/)}</label>
                        <ConstVirtualSelect
                            isRequest={true}
                            form={this.props.form}
                            apiType={apiPost}
                            apiParams="com.fooding.fc.enumeration.ScheduleRuleType"
                            fieldName="type"
                            initialValue={String(getOne.type || "")}
                            initValueOptions={getOne.type ?[{id: getOne.type, localName: getOne.typeName, name: getOne.typeName}]:[]}
                            className={'col-md-9 col-lg-9'}
                            rules
                        />
                    </div>
                    <div className="form-group col-md-6 col-lg-6">
                        <label className={'col-md-3 col-lg-3'}>{i18n.t(100002/*描述*/)}</label>
                        <input type="text" {...getFieldProps('memo', {
                            initialValue: getOne.memo || ""
                        })}
                               className={'col-md-9 col-lg-9 text-input-nowidth'}
                        />
                    </div>
                </div>
                {getFieldValue('type', getOne.type) == 1 ? this.renderWeek() : this.renderRotate()}
            </div>
        </FormWrapper>);
    }
}

const ArrangeRuleForm = createForm()(ArrangeRuleAddDialog);

export default ArrangeRuleForm;

