import React, {Component, PropTypes} from 'react';
import RightKey from '../../../components/RightKey/RightKey';
import {createForm, FormWrapper} from '../../../components/Form';
//引入select插件
import Select, {Option, ConstMiniSelect, ConstVirtualSelect} from '../../../components/Select';
//引入时间插件
import DataTime from '../../../components/Calendar/Calendar';
import Checkbox from '../../../components/CheckBox';

import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_OA} from "../../../services/apiCall";
import ServiceTips from '../../../components/ServiceTips';

import WebData from "../../../common/WebData";
import xt from '../../../common/xt';

import {I18n} from '../../../lib/i18n';
import RepeatSchedule from "./RepeatSchedule"; //重复点击后出来的弹层
import {getExplain} from "./util";
const {Table} = require("../../../components/Table");

export class ScheduleEditDialog extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onSaveAdd = this.onSaveAdd.bind(this);
        this.state = {
            id: "",
            isShowRepeat: false, //控制显示和隐藏
            rule: this.props.valueone.rule || "",   //传到后台的解构规则
            ruleExp: this.props.valueone.ruleExp || {} //保存的对象
        }
    }

    ////修改当前以及以后日程  或者 没有重复之后的确认
    onSaveAndClose() {
        let that = this;
        const {form, onSaveAndClose, valueone} = this.props;

        form.validateFields((errors, value) => {
            if (errors) {

            } else {
                let param = that.props.form.getFieldsValue();
                param = Object.assign({}, valueone, param, {
                    participantIds: (param.participantIds || []).map(e => e.participantIds).toString(),
                    participantLcNames: (param.participantIds || []).map(e => e.participantLcNames).toString(),
                    isRemind: !param.isRemind,
                    id: valueone.id || valueone.pid,
                }, {rule: this.state.rule, ruleExp: this.state.ruleExp});
                delete param.pid;
                apiPost(API_FOODING_OA, "/routine/save", param, response => {
                    onSaveAndClose();
                    that.props.form.resetFields();
                    ServiceTips({text: response.message, type: 'success'})
                }, error => ServiceTips({text: error.message, type: "error"}))
            }
        })
    }

    //修改当前日程
    onSaveAdd() {
        let that = this;
        const {form, onSaveAndClose, valueone} = this.props;
        form.validateFields((errors, value) => {
            if (errors) {

            } else {
                let param = that.props.form.getFieldsValue();
                param = Object.assign({}, valueone, param, {
                    participantIds: (param.participantIds || []).map(e => e.participantIds).toString(),
                    participantLcNames: (param.participantIds || []).map(e => e.participantLcNames).toString(),
                    isRemind: !param.isRemind
                }, {rule: this.state.rule, ruleExp: this.state.ruleExp});
                delete param.rule;
                delete param.ruleExp;
                apiPost(API_FOODING_OA, "/routine/pid/save", param, response => {
                    onSaveAndClose();
                    that.props.form.resetFields();
                    ServiceTips({text: response.message, type: 'success'})
                }, error => ServiceTips({text: error.message, type: "error"}))
            }
        })
    }

    onCancel() {
        let that = this;
        const {onCancel} = this.props;
        if (onCancel) {
            onCancel();
            that.props.form.resetFields();
        }
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    //点击重复的时候,显示
    showRepeat = e => {
        let isShowRepeat = e.target.checked;
        let {ruleExp, rule} = this.state;
        let obj = isShowRepeat ? ruleExp : {};
        let ru = isShowRepeat ? rule : "";
        this.setState({isShowRepeat, ruleExp: obj, rule: ru});
    };

    //点击修改,出现的按钮
    onRepeatEdit = () => {
        this.props.form.setFieldsValue({"reading": true});
        this.setState({isShowRepeat: true})
    };

    //计算数据
    calculate = () => {
        let {form} = this.props;
        let startTime = new Date(form.getFieldValue('starts')).getTime();
        let endTime = new Date(form.getFieldValue('ends')).getTime();
        let isAllDay = !!form.getFieldValue('isAllDay');
        let interruptTime = parseInt((endTime - startTime) / (1000 * 60 * 60 * 24));
        if (isAllDay || interruptTime == 0) {
            this.intervalList = [{id: "DAILY", localName: '日'}, {id: 'WEEKLY', localName: '周'}, {
                id: 'MONTHLY',
                localName: '月'
            }, {id: 'YEARLY', localName: '年'}, {id: "", localName: '不重复'}];
        } else if (!isAllDay && interruptTime > 0 && interruptTime < 7) {
            this.intervalList = [{id: 'WEEKLY', localName: '周'}, {id: 'MONTHLY', localName: '月'}, {
                id: 'YEARLY',
                localName: '年'
            }, {id: "", localName: '不重复'}];
        } else if (!isAllDay && interruptTime >= 7 && interruptTime < 30) {
            this.intervalList = [{id: 'MONTHLY', localName: '月'}, {id: 'YEARLY', localName: '年'}, {
                id: "",
                localName: '不重复'
            }];
        } else if (!isAllDay && interruptTime >= 30 && interruptTime <= 365) {
            this.intervalList = [{id: 'YEARLY', localName: '年'}, {id: "", localName: '不重复'}];
        } else if (!isAllDay && interruptTime > 366) {
            this.intervalList = [{id: "", localName: '不重复'}];
        }
        return this.intervalList;
    };

    //出来弹窗,点击确认
    onConfirm = (rule, ruleExp) => {
        this.setState({isShowRepeat: false, rule, ruleExp});
    };

    //出来弹窗,点击取消
    onClose = () => {
        this.props.form.setFieldsValue({"reading": false});
        this.setState({isShowRepeat: false});
    };

    onLinkClick = (data, e) => {
        e.stopPropagation && e.stopPropagation();
        window.navTabs.open(i18n.t(100311/*客户*/) + `(${data.salBeLcName})`, '/client/detail/' + data.salBeId, {id: data.salBeId, index: data.activityType == 10 ? "date":"contact"});
    };

    render() {
        let that = this;
        let {isShowRepeat} = this.state;
        const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
        let {valueone = {}, start, end} = this.props;
        let aaa = getFieldProps("staffId", {
            initialValue: WebData.user.data.staff.id || ""
        });
        let bbb = getFieldProps("staffEnName", {
            initialValue: WebData.user.data.staff.name || ""
        });
        let xxx = valueone && valueone.participantIds && valueone.participantLcNames ? (valueone.participantIds.split(',') || []).map((o, i) => ({
            participantLcNames: valueone.participantLcNames.split(',')[i],
            staffLocalNames: valueone.participantLcNames.split(',')[i],
            id: o,
            participantIds: o,
            s_label: valueone.participantLcNames.split(',')[i]
        })) : [];
        return (
            <div className="action-normal-buttons">
                <FormWrapper showFooter={true} showSaveAdd={!!valueone.rule} saveAdd={I18n.t(500314/*修改当前日程*/)} showSaveClose={true}
                             buttonLeft={!!valueone.rule ? I18n.t(400200/*修改当前及重复日程*/) : I18n.t(100460/*确认*/)} onSaveAndClose={this.onSaveAndClose}
                             onSaveAdd={this.onSaveAdd} onCancel={this.onCancel}
                             width={976}>
                    <div className={'  girdlayout scroll'} style={{height: '300px', overflow: 'auto'}}>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100304/*主题*/)}</label>
                                <input type="text" {...getFieldProps('title', {
                                    rules: [{required: true,}],
                                    valuedateTrigger: "onBlur",
                                    initialValue: valueone.title || ""
                                })}
                                       className={getFieldError("title") ? 'col-md-8 col-lg-8 text-input-nowidth error-border' : 'col-md-8 col-lg-8 text-input-nowidth'}
                                       placeholder=""
                                />
                            </div>
                            <div className="form-group col-md-4 col-lg-4">
                                <label className={'col-md-6 col-lg-6'}><span>*</span>{I18n.t(500303/*日程类型*/)}</label>
                                <ConstVirtualSelect
                                    isRequest={false}
                                    form={this.props.form}
                                    className={'col-md-6 col-lg-6'}
                                    fieldName='activityType'
                                    initialValue={String(valueone.activityType || "40")}
                                    initValueOptions={[
                                        {id: 10, localName: "约会"},
                                        {id: 20, localName: "联络"},
                                        {id: 30, localName: "响应"},
                                        {id: 40, localName: "日程"}
                                    ]}
                                    rules={true}
                                    disabled={true}
                                />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100305/*开始时间*/)}</label>
                                <div className={'col-md-8 col-lg-8 datetime'}>
                                    <DataTime
                                        range={true}
                                        type="start"
                                        startName="starts"
                                        name={'starts'}
                                        endName="ends"
                                        showTime={true}
                                        showSecond={false}
                                        width={'100%'}
                                        isShowIcon={true}
                                        form={this.props.form}
                                        validate={true}
                                        value={valueone.starts && valueone.ends ? [new Date(valueone.starts).Format('yyyy-MM-dd hh:mm'), new Date(valueone.ends).Format('yyyy-MM-dd hh:mm')] : [undefined, undefined]}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100306/*结束时间*/)}</label>
                                <div className={'col-md-8 col-lg-8 datetime'}>
                                    <DataTime
                                        range={true}
                                        type="end"
                                        startName="starts"
                                        name={'ends'}
                                        endName="ends"
                                        showTime={true}
                                        showSecond={false}
                                        width={'100%'}
                                        isShowIcon={true}
                                        form={this.props.form}
                                        validate={true}
                                        value={valueone.starts && valueone.ends ? [new Date(valueone.starts).Format('yyyy-MM-dd hh:mm:ss'), new Date(valueone.ends).Format('yyyy-MM-dd hh:mm:ss')] : [undefined, undefined]}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={'row'} style={{position: 'relative'}}>
                            <div className="form-group col-md-12 col-lg-12">
                                <label className={'col-md-2 col-lg-2'}></label>
                                <div className={'col-md-1 col-lg-1'}>
                                    <label className={'col-md-9 col-lg-9'}>{"重复"}</label>
                                    <Checkbox
                                        {...getFieldProps('reading', {
                                            initialValue: !!this.props.valueone.rule,
                                            onChange: this.showRepeat
                                        })}
                                        checked={this.props.form.getFieldValue("reading")}
                                    />
                                </div>
                                <div className={'col-md-9 col-lg-9'}>
                                    <p>
                                        {getExplain(this.state.ruleExp,this.props.form.getFieldValue("starts",valueone.starts))}<span onClick={this.onRepeatEdit} style={{
                                        color: "#0066cc",
                                        marginLeft: "5px",
                                        cursor: "pointer"
                                    }}>修改</span>
                                    </p>
                                </div>
                            </div>
                            <RepeatSchedule valueone={this.state.ruleExp}
                                            isShowRepeat={isShowRepeat}
                                            calculate={this.calculate}
                                            starts={this.props.form.getFieldValue('starts')}
                                            ends={this.props.form.getFieldValue('ends')}
                                            onConfirm={this.onConfirm}
                                            onClose={this.onClose}
                            />
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-12 col-lg-12">
                                <label className={'col-md-2 col-lg-2'}>{I18n.t(100309/*提醒时间*/)}</label>
                                <div className={'col-md-1 col-lg-1'}>
                                    <Checkbox
                                        {...getFieldProps('isRemind', {
                                            initialValue: !valueone.isRemind || false
                                        })}
                                        checked={this.props.form.getFieldValue("isRemind")}
                                    />
                                    <label className={'col-md-9 col-lg-9'}>{"不提醒"}</label>
                                </div>
                                {
                                    !this.props.form.getFieldValue("isRemind", valueone.isRemind) ?
                                        <div className={'col-md-6 col-lg-6'}>
                                            <label className={'col-md-2 col-lg-2'}>{"开始前"}</label>
                                            <input type="text" {...getFieldProps('number', {
                                                rules: [{required: true, pattern: xt.pattern.positiveInteger}],
                                                valuedateTrigger: "onBlur",
                                                initialValue: valueone.number || ""
                                            })}
                                                   className={getFieldError("number") ? 'col-md-2 col-lg-2 text-input-nowidth error-border' : 'col-md-2 col-lg-2 text-input-nowidth'}
                                                   placeholder=""
                                                   style={{marginRight: "10px"}}
                                            />
                                            <ConstVirtualSelect
                                                form={this.props.form}
                                                className={'col-md-2 col-lg-2'}
                                                isRequest={false}
                                                pageSize={6}
                                                fieldName='unit'
                                                initialValue={valueone.unit || ""}
                                                initValueOptions={[{id: "MINUTE", localName: "分钟"}, {
                                                    id: "HOUR",
                                                    localName: "小时"
                                                }, {id: 'DAY', localName: '天'}]}
                                                rules={true}
                                            />
                                        </div> : null
                                }
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-12 col-lg-12">
                                <label
                                    className={'col-md-2 col-lg-2'}>{I18n.t(400141/*日程*/) + I18n.t(100097/*详情*/)}</label>
                                <textarea
                                    {...getFieldProps('content', {
                                        initialValue: valueone.content || ""
                                    })}
                                    className={'col-md-10 col-lg-10 text-input-nowidth'}
                                    style={{resize: 'none', height: '65px',marginBottom: "5px"}}
                                >
								</textarea>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-grup col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(400142/*地点*/)}</label>
                                <input type="text" {...getFieldProps('address', {
                                    initialValue: valueone.address || ""
                                })} className={'col-md-8 col-lg-8 text-input-nowidth'} placeholder=""/>
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(400143/*参与人员*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    className={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                    pageSize={6}
                                    fieldName='participantIds'
                                    apiHost={API_FOODING_ES}
                                    apiUri='/user/getListForPermissionsInParty'
                                    apiParams={{
                                        partyId: WebData.user.data.staff.ccid
                                    }}
                                    labelKey="staffLocalNames"
                                    valueKeys={da => ({
                                        participantLcNames: da.staffLocalName,
                                        participantIds: da.id,
                                        s_label: da.staffLocalName
                                    })}
                                    multi={true}
                                    initialValue={xxx}
                                    initValueOptions={xxx}
                                    rules={false}
                                />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-grup col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(100143/*创建人*/)}</label>
                                <input type="text" disabled {...getFieldProps('staffLcName', {
                                    initialValue: valueone.staffLcName || WebData.user.data.staff.localName
                                })} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
                            </div>
                        </div>
                        {
                            valueone.isCreateActivity ?
                                <div className={'row'}>
                                    <div className="form-grup col-md-12 col-lg-12">
                                        <label className={'col-md-1 col-lg-1'}></label>
                                        <div className={'col-md-10 col-lg-10'}>
                                            <Table
                                                columns={[{
                                                    title : "来源列表",
                                                    dataIndex : 'salBeLcName',
                                                    key : "salBeLcName",
                                                    width : "95%",
                                                    render(data,row,index){
                                                        return (<div className='link-color' style={{cursor:"pointer"}} onClick={that.onLinkClick.bind(that, row)}>{data}</div>)
                                                    }
                                                }]}
                                                data={valueone.activityDtos || []}
                                                checkboxConfig={{show:false}}
                                                colorFilterConfig={{show:false}}
                                                followConfig={{show:false}}
                                                prefixCls={"rc-confirm-table"}
                                                scroll={{x:false, y:210}}
                                            />
                                        </div>
                                    </div>
                                </div>:null
                        }
                    </div>
                </FormWrapper>
            </div>
        );
    }
}

ScheduleEditDialog.propTypes = {
    onSaveAndClose: PropTypes.func,
    onCancel: PropTypes.func,
    onSaveClose: PropTypes.func
}
ScheduleEditDialog.defaultProps = {
    onSaveAndClose() {
    },
    onCancel() {
    },
    onSaveClose() {
    }
}
export default createForm()(ScheduleEditDialog);