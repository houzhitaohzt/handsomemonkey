import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
//引入select插件
import Select, {Option, ConstMiniSelect, ConstVirtualSelect} from '../../../components/Select';
//引入时间插件
import DataTime from '../../../components/Calendar/Calendar';
import Checkbox from '../../../components/CheckBox';

import {createForm, FormWrapper} from '../../../components/Form';

class RepeatSchedule extends Component {
    constructor(props) {
        super(props);
        this.onConfirm = this.onConfirm.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    //点击确定按钮
    onConfirm = () => {
        let that = this;
        let {onConfirm, form} = this.props;
        form.validateFields((err, value) => {
            if (err) return;
            let rule = that.getString(value);
            onConfirm && onConfirm(rule, value);
        })
    };

    //拿到对象,拼接成一个字符串
    getString = value => {
        let str = value.intervalsId + ";";
        let {starts} = this.props;
        let currentDate = new Date(starts);
        if (str === "WEEKLY;") {
            let a = (value.Monday ? "MO," : "") + (value.Tuesday ? "TU," : "") + (value.Wednesday ? "WE," : "") + (value.Thursday ? "TH," : "") + (value.Friday ? "FR," : "") + (value.Saturday ? "SA," : "") + (value.Sunday ? "SU;" : "");
            a = a.slice(0, -1) + ";";
            str += "BYDAY=" + a;
        } else if (str === "MONTHLY;") {
            let b = currentDate.getDate();
            str += "BYMONTHDAY=" + b + ";"
        } else if (str === "YEARLY;") {
            let c = currentDate.getMonth() + 1;
            let d = currentDate.getDate();
            str = str + "BYMONTH=" + c + ";" + "BYMONTHDAY=" + d + ";"
        }

        if (value.neverend) {//从不

        } else if (value.interrupt) {//发生多少次之后
            str += "COUNT=" + value.COUNT + ";"
        } else if (value.timeSlot) {//在某个时间点之前
            str += "UNTIL=" + new Date(value.UNTIL).Format('yyyyMMddThhmmssZ') + ";"
        }
        return str;
    };

    //每次点击后,拿到不同的说明
    getExplain = () => {
        let {form, starts} = this.props;
        let currentDate = new Date(starts);
        let value = form.getFieldsValue(), declare = "";
        if (value.intervalsId == "DAILY") {
            declare += i18n.t(500307/*每天*/);
        } else if (value.intervalsId == "WEEKLY") {
            declare += i18n.t(600189/*每周*/);
            let b = (value.Monday ? i18n.t(400172/*星期一*/) + "," : "") + (value.Tuesday ? i18n.t(400173/*星期二*/) + "," : "") + (value.Wednesday ? i18n.t(400174/*星期三*/) + "," : "") + (value.Thursday ? i18n.t(400175/*星期四*/) + "," : "") + (value.Friday ? i18n.t(400176/*星期五*/) + "," : "") + (value.Saturday ? i18n.t(400177/*星期六*/) + "," : "") + (value.Sunday ? i18n.t(400178/*星期日*/) + "," : "");
            b = b.slice(0, -1) + i18n.t(400140/*重复*/);
            declare += b;
        } else if (value.intervalsId == "MONTHLY") {
            let c = currentDate.getDate();
            declare += i18n.t(600190/*每月*/) + c + "号";
        } else if (value.intervalsId == "YEARLY") {
            let d = currentDate.getMonth() + 1;
            let e = currentDate.getDate();
            declare += i18n.t(500308/*每年*/) + d + "月" + e + "日";
        }

        if (value.neverend) {//从不

        } else if (value.interrupt) {//发生多少次之后
            declare += ",共执行" + value.COUNT + "次";
        } else if (value.timeSlot) {//在某个时间点之前
            declare += ",直到" + value.UNTIL + i18n.t(500309/*结束*/);
        }
        return declare;
    };

    //点击取消时候的函数
    onClose = () => {
        this.props.onClose && this.props.onClose();
    };

    //结束里面的数据的处理
    onEndChange = (name1, name2, e) => {
        this.props.form.setFieldsValue({[name1]: false, [name2]: false});
    };

    //重复的时候的切换下面的数据模板
    onInterSelect = (e, obj) => {
        console.log(e, obj, obj.props.objValue);
    };

    componentDidMount() {

    };

    componentWillUnmount() {

    };

    render() {
        const {form, valueone = {}, isShowRepeat, calculate, starts, ends} = this.props;
        const {getFieldProps, getFieldError, getFieldValue} = form;
        let intervalList = calculate();
        return (<div className={!isShowRepeat ? 'repeatschedule' : "repeatschedule show"}>
            <div className={'row'}>
                <div className="form-group col-md-12 col-lg-12">
                    <label className={'col-md-3 col-log-3'}>{i18n.t(400140/*重复*/)}</label>
                    <ConstVirtualSelect
                        refreshMark={starts && ends}
                        form={this.props.form}
                        isRequest={false}
                        fieldName="intervalsId"
                        initialValue={String(valueone.intervalsId || "DAILY")}
                        initValueOptions={intervalList}
                        clearable={true}
                        className={'col-md-4 col-lg-4'}
                        rules
                    />
                </div>
            </div>
            {
                this.props.form.getFieldValue("intervalsId", valueone.intervalsId) == "WEEKLY" ? <div className={'row'}>
                    <div className="form-group col-md-12 col-lg-12">
                        <label className={'col-md-3 col-lg-3'}>{i18n.t(400104/*时间*/)}</label>
                        <div className={'col-md-9 col-lg-9'}>
                            <Checkbox
                                {...getFieldProps("Monday", {
                                    initialValue: valueone.Monday || false
                                })}
                                checked={this.props.form.getFieldValue("Monday")}
                            />一&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Checkbox
                                {...getFieldProps("Tuesday", {
                                    initialValue: valueone.Tuesday || false
                                })}
                                checked={this.props.form.getFieldValue("Tuesday")}
                            />二&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Checkbox
                                {...getFieldProps("Wednesday", {
                                    initialValue: valueone.Wednesday || false
                                })}
                                checked={this.props.form.getFieldValue("Wednesday")}
                            />三&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Checkbox
                                {...getFieldProps("Thursday", {
                                    initialValue: valueone.Thursday || false
                                })}
                                checked={this.props.form.getFieldValue("Thursday")}
                            />四&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Checkbox
                                {...getFieldProps("Friday", {
                                    initialValue: valueone.Friday || false
                                })}
                                checked={this.props.form.getFieldValue("Friday")}
                            />五&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Checkbox
                                {...getFieldProps("Saturday", {
                                    initialValue: valueone.Saturday || false
                                })}
                                checked={this.props.form.getFieldValue("Saturday")}
                            />六&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Checkbox
                                {...getFieldProps("Sunday", {
                                    initialValue: valueone.Sunday || false
                                })}
                                checked={this.props.form.getFieldValue("Sunday")}
                            />日
                        </div>
                    </div>
                </div> : null
            }
            <div className={'row'}>
                <div className="form-group col-md-12 col-lg-12">
                    <label className={'col-md-3 col-lg-3'}>{i18n.t(500309/*结束*/)}</label>
                    <div className={'col-md-9 col-lg-9'}>
                        <div className={'col-md-12 col-lg-12'}>
                            <Checkbox
                                {...getFieldProps("neverend", {
                                    initialValue: valueone.neverend || false,
                                    onChange: this.onEndChange.bind(this, 'interrupt', 'timeSlot')
                                })}
                                checked={this.props.form.getFieldValue("neverend")}
                            /> 从不
                        </div>
                        <div className={'col-md-12 col-lg-12'}>
                            <Checkbox
                                {...getFieldProps("interrupt", {
                                    initialValue: valueone.interrupt || false,
                                    onChange: this.onEndChange.bind(this, 'neverend', 'timeSlot')
                                })}
                                checked={this.props.form.getFieldValue("interrupt")}
                            /> 发生&nbsp;&nbsp;
                            <input type="text"
                                   className={'text-input-nowidth'}
                                   style={{width: "80px"}}
                                   disabled={!this.props.form.getFieldValue("interrupt")}
                                   {...getFieldProps('COUNT', {
                                       rules: [{required: !!this.props.form.getFieldValue("interrupt")}],
                                       valuedateTrigger: "onBlur",
                                       initialValue: valueone.COUNT || "10",
                                   })} />
                            &nbsp;&nbsp;次后
                        </div>
                        <div className={'col-md-12 col-lg-12'}>
                            <div className={'col-md-3 col-lg-3'} style={{paddingRight: 0}}><Checkbox
                                {...getFieldProps("timeSlot", {
                                    initialValue: valueone.timeSlot || false,
                                    onChange: this.onEndChange.bind(this, 'neverend', 'interrupt')
                                })}
                                checked={this.props.form.getFieldValue("timeSlot")}
                            />&nbsp;在
                            </div>
                            <div className={'col-md-9 col-lg-9 datetime'}>
                                <DataTime
                                    name={'UNTIL'}
                                    showTime={false}
                                    width={'100%'}
                                    isShowIcon={true}
                                    form={this.props.form}
                                    disabled={!this.props.form.getFieldValue("timeSlot")}
                                    value={valueone.UNTIL ? new Date(valueone.UNTIL).Format('yyyy-MM-dd') : new Date()}
                                    rule={!!this.props.form.getFieldValue("timeSlot")}
                                /></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'row'}>
                <div className="form-group col-md-12 col-lg-12">
                    <label className={'col-md-3 col-lg-3'}>{i18n.t(201097/*摘要*/)}</label>
                    <div className={'col-md-9 col-lg-9'}>
                        {this.getExplain()}
                    </div>
                </div>
            </div>
            <div className={'repeatschedule-button'}>
                <button className={'repeatschedule-button-confirm'}
                        onClick={this.onConfirm}>{i18n.t(200043/*确定*/)}</button>

            </div>
        </div>)
    }
}

export default createForm()(RepeatSchedule);

//<button className={'repeatschedule-button-close'} onClick={this.onClose}>取消</button>