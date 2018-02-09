import i18n from './../../lib/i18n';
import React, {Component} from "react";
import {createForm,FormWrapper} from '../../components/Form';


import Message from '../../lib/message';
import WebData from "../../common/WebData";
import {emitter} from '../../common/EventEmitter';
import DataTime from '../../components/Calendar/Calendar';

import {apiGet, apiPost, apiForm, API_FOODING_OA,API_FOODING_MESSAGE, API_FOODING_ES,API_FOODING_MAIL,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../services/apiCall";
import ServiceTips from '../ServiceTips';

import { Checkbox, Button, Select, notification, Icon } from 'antd';
import "./assets/index.less";

class HTML extends Component {

    constructor(props) {
        super(props);

        this.state = {
            delayedBtn: false, // 延时
            deferTime: undefined, // 延迟时间
            count: 5000, // 倒计时

            checked: true, // 不再提醒
        };
    }
    componentDidMount() {

        let {keyValue,intervalHandle} = this.props;

        let t = document.querySelectorAll(`.message-${keyValue}`);

        // onmouseenter\onmouseleave;
        t[0].onmouseenter = function(){
            intervalHandle();
        }

        t[0].onmouseleave = function(){
            intervalHandle(keyValue);
        }
    }

    componentWillUnmount() {
    }

    // select change
    handleChange = (key)=> this.setState({deferTime: key != 'default' ? key : undefined });

    // 推迟
    delayedHandle = ()=> this.setState({delayedBtn:true,deferTime:'m',checked:false});

    // 不再提醒
    checkHandle = (o)=> this.setState({checked:o.target['checked'],deferTime:o.target['checked'] ? undefined : 'm'});


    // 解析时间
    resetTime = (s,time)=>{

        // 不定时
        if( s == undefined ) return s;

        // 定时
        let t = time || new Date();
        let [num,mark] = s.split('-');

        // 延迟 或者 提前
        if(time) {
            if( mark == 'm' ) t.setMinutes(t.getMinutes()-Number(num)); // 提前 -分钟
            if( mark == 'h' ) t.setHours(t.getHours()-Number(num)); // 提前 -小时
            if( mark == 'd' ) t.setDate(t.getDate()-Number(num)); // 提前 -天
        } else{
            if( mark == 'm' ) t.setMinutes(t.getMinutes()+Number(num)); // 延迟 +分钟
            if( mark == 'h' ) t.setHours(t.getHours()+Number(num)); // 延迟 +小时
            if( mark == 'd' ) t.setDate(t.getDate()+Number(num)); // 延迟 +天
        }

        return t;
    }

    // 延时提交
    confirmHandle = (key,data) => {

        let that = this;
        let {deferTime} = this.state;

        this.props.confirmHandle(key,Object.assign(data,{reminderTime:that.resetTime(deferTime)}));
    }

    // 推迟提交
    confirmDefineHandle = (key,data) => {

        let that = this;
        let {deferTime} = this.state;
        let {time,startDate,endDate} = this.props.form.getFieldsValue();


        // 不需要验证
        if( !deferTime ) {
                this.props.confirmDefineHandle(key,Object.assign(data,{reminderTime:that.resetTime(deferTime),startDate:new Date(startDate),endDate:new Date(endDate)}));
                return;
        }

        // 需要验证
		this.props.form.validateFields((errors, value) =>{
			if(errors){

			} else{
                this.props.confirmDefineHandle(key,Object.assign(data,{reminderTime:that.resetTime( time + '-' + deferTime,new Date(startDate) ),startDate:new Date(startDate),endDate:new Date(endDate)}));
            }
        });

    }

    render() {
        let {keyValue,data} = this.props;
        let {delayedBtn,checked} = this.state;
        let {getNFieldProps,getFieldProps,getFieldError} = this.props.form;

        let text = JSON.parse(data['json']);
        console.log(data);
        return <div id={keyValue} className="message-center">
            <div className={ delayedBtn ? 'mesbox' : 'mesbox on' }>
                <a href={'javascript:;'}>
                    <h2 title={text['theme']}>{text['theme']}</h2>
                    <h5>{new Date(text['startDate']).Format('yyyy-MM-dd hh:mm')} {' ~ '} {new Date(text['endDate']).Format('yyyy-MM-dd hh:mm')}</h5>
                </a>
                <br/><br/>
                <Select
                    defaultValue="default"
                    style={{width:120}}
                    onChange={this.handleChange}
                    getPopupContainer={() => document.getElementById(keyValue)}
                >
                    <Select.Option value="default">不再提醒</Select.Option>
                    <Select.Option value="5-m">5分钟后再提醒</Select.Option>
                    <Select.Option value="30-m">30分钟后再提醒</Select.Option>
                    <Select.Option value="2-h">2小时后再提醒</Select.Option>
                    <Select.Option value="1-d">1天后再提醒</Select.Option>
                </Select>
                <span onClick={this.confirmHandle.bind(this,keyValue,Object.assign({},data,text))} style={{float:'right',cursor:'pointer',fontSize:'13px',marginTop:'7px'}} className="label label-primary">确定</span>
            </div>
            <div className={ delayedBtn ? 'mesbox on' : 'mesbox' }>
                <a href={'javascript:;'}>
                    <h2 title={text['theme']}>{text['theme']}</h2>
                </a>
                <DataTime
                    getCalendarContainer={() => document.getElementById(keyValue)}
                    range={true}
                    type="start"
                    startName="startDate"
                    name="startDate"
                    endName="endDate"
                    showTime={true}
                    isShowIcon={true}
                    width={'170px'}
                    form={this.props.form}
                    value={[new Date(text['startDate']).Format('yyyy-MM-dd hh:mm:ss'),new Date(text['endDate']).Format('yyyy-MM-dd hh:mm:ss')]}
                    validate={true}
                />
                <span> - </span>
                <DataTime
                    getCalendarContainer={() => document.getElementById(keyValue)}
                    range={true}
                    type="end"
                    startName="startDate"
                    name='endDate'
                    endName="endDate"
                    showTime={true}
                    isShowIcon={true}
                    width={'170px'}
                    form={this.props.form}
                    value={[new Date(text['startDate']).Format('yyyy-MM-dd hh:mm:ss'),new Date(text['endDate']).Format('yyyy-MM-dd hh:mm:ss')]}
                    validate={true}
                />
                <br/><br/>
                <span style={{display:'inline-block',lineHeight:'30px'}}>提醒时间：</span>
                <Checkbox onChange={this.checkHandle}>不提醒</Checkbox>
                { checked ? '' :
                    <div style={{display:'inline-block'}}>
                        <span>开始前</span>
                        &nbsp;&nbsp;
                        <input type="text"
                            {...getNFieldProps('time',{
                                rules: [{pattern:(/^[1-9]([0-9]?)+$/g),required:true}],
                                initialValue: ''
                            })}
                            style={{width:'43px',marginRight:'6px',marginTop:'-5px',height:'26px'}}
                            className ={getFieldError('time')?'text-input error-border':'text-input'}
                        />
                        <Select
                            getPopupContainer={() => document.getElementById(keyValue)}
                            defaultValue="m"
                            style={{width:70}}
                            onChange={this.handleChange}
                        >
                            <Select.Option value="m">分钟</Select.Option>
                            <Select.Option value="h">小时</Select.Option>
                            <Select.Option value="d">天</Select.Option>
                        </Select>
                    </div>
                }
                <span onClick={this.confirmDefineHandle.bind(this,keyValue,Object.assign({},data,text))} style={{float:'right',marginTop:'7px'}} className="label label-primary">确定</span>
            </div>
            { (!delayedBtn && (data['templateName'] == 'schedule_remind.ftl')) ? <span onClick={this.delayedHandle} className="delayedBtn label label-primary">延时</span>  :''}
        </div>;
    }

}
let HTMLForm = createForm()(HTML);


export default class Page extends Component {

    constructor(props) {
        super(props);


        this.state = {
        };

    }

    componentDidMount() {

        let that = this;
        emitter.on("fetchMessageStream", this.fetchMessageStream);
    }

    componentWillUnmount() {
        emitter.off('fetchMessageStream', this.fetchMessageStream);
    }

    fetchMessageStream = (data)=>{
        if( !data['popUp'] ) return;
        this.openHandle(data);
    };

    // open message
    openHandle = (data)=>{
        let that = this;
        let key = String(new Date().getTime());

        //console.log(data);
        notification.open({
            message: data['title'],
            className: `message-${key}`,
            style: {
                width: 410,
                marginLeft: 335 - 410,
            },
            description: <HTMLForm keyValue={key} data={data} handleChange={this.handleChange} intervalHandle={this.intervalHandle} confirmHandle={this.confirmHandle} confirmDefineHandle={this.confirmDefineHandle}/>,
            placement:"bottomRight",
            duration: NaN, // 延时关闭
            key: key,
        });

        // 开启定时器
        this.intervalHandle(key);
    };

    // 定时器 控制
    intervalHandle = (key)=> {


        window.clearTimeout(window.inter);

        if(key) {
            window.inter = setTimeout(function(){
                notification.close(key);
            },5000);
        }

    };

    // 延时确认
    confirmHandle = (Key,data)=> {

        let that = this;
        let {businessId,reminderTime,title,startDate,endDate,receiver} = data;

        // 不延迟
        if(!reminderTime) {
            notification.close(Key);
            return;
        }

        // 延迟时间
        apiForm(API_FOODING_OA,'/routine/remindTime/update',Object.assign({},{remindTime:new Date(reminderTime).Format('yyyy-MM-dd hh:mm:ss'),scheduleId:businessId}),
            (response)=>{
                ServiceTips({text:response.message,type:'success'});
                notification.close(Key);
            },(error)=>{
                ServiceTips({text:error.message,type:'error'});
            }
        );

    }

    // 推迟确认
    confirmDefineHandle = (Key,data)=> {

        let that = this;
        let {reminderTime,title,startDate,endDate,receiver,businessId} = data;

        // 不延迟
        if(!reminderTime) {
            notification.close(Key);
            return;
        }

        // 延迟时间
        apiForm(API_FOODING_OA,'/routine/remindTime/update',Object.assign({},{remindTime:new Date(reminderTime).Format('yyyy-MM-dd hh:mm:ss'),businessId:businessId,starts:new Date(startDate).Format('yyyy-MM-dd hh:mm:ss'),ends:new Date(endDate).Format('yyyy-MM-dd hh:mm:ss')}),
        //apiPost(API_FOODING_OA,'/routine/save',Object.assign({},data,{receivers:receiver,startTime:reminderTime,Id:businessId,userId:receiver,reminderTime:reminderTime,title:title,starts:startDate,ends:endDate}),
            (response)=>{
                ServiceTips({text:response.message,type:'success'});
                notification.close(Key);
            },(error)=>{
                ServiceTips({text:error.message,type:'error'});
            }
        );

    }

    render() {
        let that = this;

        return <div className="massage-html"></div>
    }

}

