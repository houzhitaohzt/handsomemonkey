import React, {Component, PropTypes} from 'react'
import Calendar from './components';
import RangeCalendar from './components/RangeCalendar';
import DatePicker from './components/Picker';
import TimePickerPanel from '../TimePicker/components/Panel';
import moment from "moment";
import i18n from '../../lib/i18n';

import zhCN from './components/locale/zh_CN';
import enUS from './components/locale/en_US';

const format = 'YYYY-MM-DD HH:mm:ss';
const now = moment();

now.locale('zh-cn').utcOffset(8);

function getFormat(showTime,showMinute,showSecond) {
    if(!showTime){
        return 'YYYY-MM-DD';
    }else if(showTime && showSecond && showMinute){
        return "YYYY-MM-DD HH:mm:ss";
    }else if(showTime && showMinute && !showSecond){
        return 'YYYY-MM-DD HH:mm:00';
    }else if(showTime && !showSecond && !showMinute){
        return 'YYYY-MM-DD HH:00:00';
    }else{
        return 'YYYY-MM-DD';
    }
    //return time ? format : 'YYYY-MM-DD';
}
const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

//const timePickerElement = <TimePickerPanel showMinute={false} />;
const SHOW_TIME = true;

class Picker extends Component {

    constructor (props){
        super(props);
        this.locale = i18n.getLang() === 'zh-cn'? zhCN: enUS;
    }

    static defaultProps = {
        showTime: SHOW_TIME,
        width: 250,
        disabled: false,
        padding: '5px 10px 6px',
        value: null,
        validate: true,
        onChangeTime(){},
        showMinute:true,
        showSecond:true,
    };

    focus = ()=>{
        if( !this.input) return;
        this.input.focus();
    };

    render() {
        const props = this.props;
        let {getFieldError} = this.props.form;
        let that = this;
        let Comp = props.range === true ? RangeCalendar: Calendar;
        const calendar = (<Comp
            locale={this.locale}
            defaultValue={now}
            showDateInput={false}
            timePicker={props.showTime ? <TimePickerPanel showMinute={props.showMinute} showSecond={props.showSecond} /> : null}
            disabledDate={props.disabledDate}
        />);
        let value = props.value? (props.range === true? [
            props.value[0] ? moment(props.value[0]): null,
            props.value[1] ? moment(props.value[1]): null
        ]: moment(props.value) ) : null;


        return (<DatePicker
            animation="slide-up"
            disabled={props.disabled}
            calendar={calendar}
            value={value}
            onChange={props.onChange}
            getCalendarContainer={props.getCalendarContainer}
            onOpenChange={props.onOpenChange}

        >
            {
                ({value}) => {
                    return (
                        <span style={{position: 'relative', display: 'inline-block', width: '100%'}}
                              className={getFieldError(that.props.name) ? 'error-border' : ''}>
                <input
                    placeholder=""
                    style={{
                        width: props.width,
                        transition: 'border-color ease-in-out .15s, box-shadow ease-in-out .15s',
                        padding: props.padding,
                        lineHeight: '1.5',
                        borderRadius: '6px',
                        fontSize: '14px',
                        letterSpacing: 'normal',
                        wordSpacing: 'normal',
                        textTransform: 'none',
                        textShadow: 'none',
                        textAlign: 'start',
                        color: '#555',
                        backgroundColor: '#f5f5f5',
                        backgroundImage: 'none',
                        border: 'none',
                        outline: 'none'
                    }}
                    ref={rf => that.input = rf}
                    disabled={props.disabled}
                    readOnly
                    value={props.showValue}
                />
                  <i className={this.props.isShowIcon ? 'foddingicon fooding-calendar calader_icon' : 'none'}/>
                </span>
                    );
                }
            }
        </DatePicker>);
    }
}

export default class extends Component {

    static defaultProps = {
        onChangeTime (){},
        showTime: false,
        showSecond:true, //选择时间, 秒是否出来
        showMinute:true, //选择时间, 分钟是否出来
    };

    constructor (props){
        super(props);
        this.state = {
            startValue: null,
            endValue: null,
        };
    }

    disabledEndDate = (endValue) => {
        if (!endValue) {
            return false;
        }
        const startValue = this.state.startValue;
        if (!startValue) {
            return false;
        }
        return SHOW_TIME ? endValue.isBefore(startValue) :
            endValue.diff(startValue, 'days') <= 0;
    };

    onChange = (field, value) => {
        console.log('onChange', field, value && value.format(getFormat(SHOW_TIME,this.props.showMinute,this.props.showSecond)));
        this.setState({
            [field]: value,
        });
    };

    onPickerChange = value => {
        const {showTime,showMinute, showSecond, type, form} = this.props;
        if(Array.isArray(value)){
            let beginTime = value[0] && value[0].format(getFormat(showTime,showMinute,showSecond))|| '';
            let endTime = value[1] && value[1].format(getFormat(showTime,showMinute,showSecond))|| '';
            form.setFieldsValue({ [this.props.startName]: beginTime, [this.props.endName]: endTime, });
            form.getFieldInstance(this.props.startName).props.onChangeTime(beginTime);
            form.getFieldInstance(this.props.endName).props.onChangeTime(endTime);
        } else {
            let time = value && value.format(getFormat(showTime,showMinute,showSecond))|| '';
            form.setFieldsValue({ [this.props.name]: time });
            form.getFieldInstance(this.props.name).props.onChangeTime(time);
        }
    };

    disabledStartDate = (current) => {
        if (!current || !this.props.beginData)  return false;

        const date = moment(this.props.beginData);
        return current <= date;  // can not select days before today
    };

    render(){
        let {getFieldProps, getFieldError} = this.props.form;
        let {showTime,showMinute, showSecond, range, type} = this.props;

        let value, fieldProps;
        if(range){
            let time = this.props.value? [
                this.props.value[0]?moment(this.props.value[0]).format(getFormat(showTime,showMinute,showSecond)):null,
                this.props.value[1]?moment(this.props.value[1]).format(getFormat(showTime,showMinute,showSecond)):null
            ]: null;
            let startField = getFieldProps(this.props.startName, {
                validateFirst: true,
                rules: [ { required: this.props.validate }],
                validateTrigger: 'onBlur',
                initialValue: time? time[0]: null
            });
            let endField = getFieldProps(this.props.endName, {
                validateFirst: true,
                rules: [ { required: this.props.validate }],
                validateTrigger: 'onBlur',
                initialValue: time? time[1]: null
            });

            fieldProps = type === 'start'? startField: endField;
            value = [startField.value, endField.value];
        } else {
            let time = this.props.value? moment(this.props.value): null;
            fieldProps = getFieldProps(this.props.name, {
                validateFirst: true,
                rules: [ { required: this.props.validate }],
                validateTrigger: 'onBlur',
                initialValue: time? time.format(getFormat(showTime,showMinute,showSecond)): null
            });
            value = fieldProps.value;
        }

        return (
            <div style={{display: "inline-block"}}>
                <Picker
                    onOpenChange={this.props.onOpenChange}
                    getCalendarContainer={this.props.getCalendarContainer}
                    type={this.props.type}
                    range={this.props.range}
                    showTime={this.props.showTime}
                    width={this.props.width}
                    disabledDate={this.disabledStartDate}
                    // value={this.state.endValue}
                    isShowIcon={this.props.isShowIcon}
                    padding={this.props.padding}
                    form={this.props.form}
                    name={this.props.name}
                    disabled={this.props.disabled}
                    ref={fieldProps.ref}
                    onChange={this.onPickerChange}
                    onChangeTime={this.props.onChangeTime}
                    value={value}
                    showValue={fieldProps.value || ''}
                    showMinute={this.props.showMinute}
                    showSecond={this.props.showSecond}
                />
            </div>
        )
    }
}

