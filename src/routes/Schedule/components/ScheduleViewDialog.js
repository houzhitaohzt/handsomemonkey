import React, {Component, PropTypes} from 'react';
import RightKey from '../../../components/RightKey/RightKey';
import {createForm, FormWrapper} from '../../../components/Form';
//引入select插件
import Select, {Option, ConstMiniSelect, ConstVirtualSelect} from '../../../components/Select';
//引入时间插件
import DataTime from '../../../components/Calendar/Calendar';
import Checkbox from '../../../components/CheckBox';

import {
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_ES,
    API_FOODING_DS,
    API_FOODING_OA,
    permissionsBtn
} from "../../../services/apiCall";
import ServiceTips from '../../../components/ServiceTips';

import WebData from "../../../common/WebData";
import xt from '../../../common/xt';

import {I18n} from '../../../lib/i18n';
import RepeatSchedule from "./RepeatSchedule"; //重复点击后出来的弹层
import {getExplain} from "./util";
const {Table} = require("../../../components/Table");
import i18n from "../../../lib/i18n";

const activeTypeName = {
    "20": "联络",
    "10": "约会",
    "30": "响应",
    "40": "日程"
};
const TitleTime = {
    "MINUTE": "分钟",
    "HOUR": "小时",
    "DAY": "天"
};

export class ScheduleViewDialog extends Component {
    constructor(props) {
        super(props);
        this.onCancel = this.onCancel.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onSaveAdd = this.onSaveAdd.bind(this);
        this.state = {
            id: "",
            getOne: props.data || {}
        }
    }

    //点击删除
    onSaveAdd = () => {
        let {getOne} = this.state;
        this.props.onSaveAdd && this.props.onSaveAdd(getOne);
    };

    //点击编辑
    onSaveAndClose = () => {
        let {getOne} = this.state;
        this.props.onSaveAndClose && this.props.onSaveAndClose(getOne);
    };

    //点击取消
    onCancel() {
        let {getOne} = this.state;
        this.props.onCancel && this.props.onCancel(getOne);
    }

    componentWillMount() {

    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillUnmount() {

    }

    onLinkClick = (data, e) => {
      e.stopPropagation && e.stopPropagation();

        let uri = "/activity/detail", name = i18n.t(100585/*市场活动响应*/) + i18n.t(100097/*详情*/);
        if(data.activityType == 10){
            uri = "/commondate/detail";
            name = i18n.t(100587/*约会*/) + i18n.t(100097/*详情*/);
        }else if(data.activityType == 20){
            uri = "/commoncontact/detail";
            name = i18n.t(100588/*联络*/) + i18n.t(100097/*详情*/);
        }else if(data.activityType == 30){
            uri = "/activity/detail";
            name = i18n.t(100585/*市场活动响应*/) + i18n.t(100097/*详情*/);
        }
        window.navTabs.open(name,uri, {
            scheduleId: data.id,
            salBeId: data.salBeId,
            activityType: data.activityType,
            originalId: data.originalId,
            originalType: data.originalType,
            salBeLC: encodeURIComponent(data.salBeLcName),
            salBeEN: encodeURIComponent(data.salBeEnName),
            typeNumber: 10,
            isDt: false
        });
        //window.navTabs.open(i18n.t(100311/*客户*/) + `(${data.salBeLcName})`, '/client/detail/' + data.salBeId, {id: data.salBeId, index: data.activityType == 10 ? "date":"contact"});
    };

    render() {
        let that = this;
        let {getOne = {}} = this.state;
        return (
            <FormWrapper showFooter={true} showSaveAdd={!!permissionsBtn('schedule.del')} saveAdd={I18n.t(100437/*删除*/)}
                         showSaveClose={!!permissionsBtn('schedule.edit')} buttonLeft={I18n.t(100439/*编辑*/)}
                         onSaveAndClose={this.onSaveAndClose} onSaveAdd={this.onSaveAdd} onCancel={this.onCancel}
                         width={976}>
                <div className={'girdlayout scroll'} style={{height: '300px', overflow: 'auto'}}>
                    <div className={'row'}>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(100304/*主题*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={''}>{getOne.title || ""}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-4 col-lg-4">
                            <label className={'col-md-6 col-lg-6'}>{I18n.t(500303/*日程类型*/)}</label>
                            <div className={'col-md-6 col-lg-6'}>
                                <p className={''}>{activeTypeName[(getOne.activityType || "40")]}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(100305/*开始时间*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={''}>{ new Date(getOne.starts).Format('yyyy-MM-dd hh:mm')}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(100306/*结束时间*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={''}>{ new Date(getOne.ends).Format('yyyy-MM-dd hh:mm')}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(400140/*重复*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={''}>{getExplain(getOne.ruleExp || {}, getOne.starts) || I18n.t(500302/*不重复*/)}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(100309/*提醒时间*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={''}>{getOne.reminderTime ? new Date(getOne.reminderTime).Format('yyyy-MM-dd hh:mm:ss'):(!!getOne.isRemind ? (getOne.number + TitleTime[getOne.unit]) : I18n.t(500305/*不提醒*/))}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'} style={{marginBottom: "5px"}}>
                        <div className="form-group col-md-12 col-lg-12">
                            <label className={'col-md-2 col-lg-2'}>{I18n.t(400141/*日程*/) + I18n.t(100097/*详情*/)}</label>
                            <div className={'col-md-10 col-lg-10'}>
                                <p className={''}>{getOne.content || ""}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-grup col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(400142/*地点*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={''}>{getOne.address || ""}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(400143/*参与人员*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={''}>{String(getOne.participantLcNames || "")}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-grup col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(100143/*创建人*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={''}>{String(getOne.staffLcName || "")}</p>
                            </div>
                        </div>
                    </div>
                    {
                        getOne.isCreateActivity ?
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
                                        data={getOne.activityDtos || []}
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
        );
    }
}

export default ScheduleViewDialog;