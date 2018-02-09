import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from 'react';

//引入提示
import ServiceTips, {errorTips, successTips} from "../../../components/ServiceTips"; //提示框
import {
    apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_HR,hrefFunc,permissionsBtn,
    API_FOODING_ERP, API_FOODING_DS, pageSize, sizeList, toDecimal, language
} from "../../../services/apiCall";
import xt from "../../../common/xt";
import WebData from '../../../common/WebData';

export class TimeView extends Component {
    constructor(props) {
        super(props);
        var data = new Date();
        this.time = null;
        let str = data.getFullYear() + "/" + this.fromat(data.getMonth() + 1) + "/" + this.fromat(data.getDate());
        let house = this.fromat(data.getHours()) + ":" + this.fromat(data.getMinutes()) + ":" + this.fromat(data.getSeconds());
        this.state = {
            time_str: str,
            house: house,
            cardInfo: {}
        }
    }

    componentDidMount() {
        this.timeInterval();
        this.getInitData();
    }

    componentWillUnmount() {
        clearInterval(this.time);
    }

    timeInterval() {
        this.time = setInterval(() => {
            var data = new Date();
            let str = data.getFullYear() + "/" + this.fromat(data.getMonth() + 1) + "/" + this.fromat(data.getDate());
            let house = this.fromat(data.getHours()) + ":" + this.fromat(data.getMinutes()) + ":" + this.fromat(data.getSeconds());
            if (this.setState) {
                this.setState({
                    time_str: str,
                    house: house
                });
            } else {

            }

        }, 1000);
    }

    fromat(strDate) {
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        return strDate;
    }

    //onRefresh 拖拽单个模块刷新
    onRefresh = () => {
        this.initList();
    };

    //onDrageEdit 拖拽编辑
    onDrageEdit = () => {
        let {onDrageEdit, laysingle} = this.props;
        onDrageEdit && onDrageEdit(laysingle)
    };

    //onDrageDelete 单个模块删除
    onDrageDelete = () => {
        let {onDrageDelete, laysingle} = this.props;
        onDrageDelete && onDrageDelete(laysingle)
    };

    /**
     * 获取初始化数据
     * */
    getInitData = () => {
        let that = this;
        apiPost(API_FOODING_HR,"/attendCard/signdata", {}, response => {
            that.setState({cardInfo:response.data || {} })
        },error => {})
    };

    //签到按钮
    onSignInClick = () => {
        let that = this;
        apiPost(API_FOODING_HR,"/attendCard/signin", {}, response => {
            ServiceTips({text:response.message,type:'success'});
            that.getInitData();
        },error => ServiceTips({text:error.message,type:'error'}))
    };

    //签退 按钮
    onSignOutClick = () => {
        let that = this;
        let {cardInfo} = this.state;
        if(!cardInfo.attendId) return;
        apiPost(API_FOODING_HR,"/attendCard/signout/" + cardInfo.attendId, {}, response => {
            ServiceTips({text:response.message,type:'success'});
            that.getInitData();
        },error => ServiceTips({text:error.message,type:'error'}))
    };

    //申述 签到申述
    complaintClick = attendId => {
        apiGet(API_FOODING_HR,"/explainRegister/getAttendaceById", {attendanId: attendId}, response => {
            let data = response.data || {};
            this.props.complaintClick && this.props.complaintClick(data, this.state.cardInfo.attendId);
        });
    };

    //申述的保存并添加按钮
    onSaveAndClose = () => {
        this.getInitData();
    };

    //申诉详情
    comlaintViewClick = () => {
        this.props.comlaintViewClick && this.props.comlaintViewClick();
    };

    getWordTime = (Times) => {
        if(!Times) return null;
        let workHour = parseInt(Times / 60);
        let workMinte = parseInt(Times % 60);
        let workTime = workHour + "小时" + workMinte + "分钟";
        return workTime;
    };


    render() {
        let {cardInfo, house, time_str} = this.state;
        return (
            <div className="dragesingle">
                <div className={"dragetitle"}>
                    <span className={"drageshow"}>{i18n.t(200643/*打卡*/)}</span>
                    <span className="dragehandle"></span>
                    <span className={"drageaction"}>
                        <i className={"foddingicon fooding-sd-icon2"}></i>
                        <span className="action">
                            <span onClick={this.onDrageEdit}><i
                                className={"foddingicon fooding-alter_icon2"}></i>&nbsp;&nbsp;{i18n.t(100439/*编辑*/)}</span>
                            <span onClick={this.onDrageDelete}><i
                                className={"foddingicon fooding-delete-icon4"}></i>&nbsp;&nbsp;{i18n.t(100437/*删除*/)}</span>
                        </span>
                    </span>
                </div>
                <div className={"dragecontent card_home_bg"} style={{
                    height: Number(this.props.rowHeight + 10) * Number(this.props.laysingle.h) - 50 + "px"
                }}>
                    <div className="index-bd-box hh-radius hh-pd10 shadow">
                        <div className="Punch_l">
                            <h1 id="time">{house}</h1>
                            <span id="year"> {time_str}</span>
                            <p>{cardInfo.clientIp}</p>
                        </div>
                        <div className="Punch_r">
                            {cardInfo.showSignIn ?
                                <button type="button" className="dk-btn hh-btn-primary hh-radius"
                                        onClick={this.onSignInClick}>{i18n.t(400251/*签到*/)}</button> :
                                <button type="button" className="dk-btn hh-btn-primary hh-radius"
                                        onClick={this.onSignOutClick}>{i18n.t(400252/*签退*/)}</button>}

                        </div>
                    </div>
                    {
                        cardInfo.signInTime ? <div className="signing signing-in">
                            <h4 className="signing-title">{i18n.t(400253/*签到时间*/)}</h4>
                            <h4 className={cardInfo.signInTime ? "signing-time delay" : "signing-time"}>{new Date(cardInfo.signInTime).Format('yyyy-MM-dd hh:mm:ss')}&nbsp;&nbsp;{cardInfo.signInStatusName}</h4>
                            {(!cardInfo.signInIsExplain && cardInfo.signInStatus != 1 )? <h4>
                                <button type="button" className="signing-complaint" onClick={this.complaintClick.bind(this,cardInfo.attendId)}>{i18n.t(400255/*申述*/)}</button>
                            </h4> : null}
                        </div> : null
                    }
                    {
                        cardInfo.signOutTime ? <div className="signing signing-out">
                            <h4 className="signing-title">{i18n.t(400254/*签退时间*/)}</h4>
                            <h4 className={cardInfo.signOutTime ? "signing-time delay" : "signing-time"}>{new Date(cardInfo.signOutTime).Format('yyyy-MM-dd hh:mm:ss')}&nbsp;&nbsp;{cardInfo.signOutStatusName}</h4>
                            {(!cardInfo.signOutIsExplain && cardInfo.signOutStatus != 1) ? <h4>
                                <button type="button" className="signing-complaint" onClick={this.complaintClick.bind(this,cardInfo.attendId)}>申述</button>
                            </h4> : null}
                        </div> : null
                    }
                    {
                        cardInfo.workTime ? <div className="signing work-hours">
                            <h4 className="signing-title">工作时长</h4>
                            <h4 className="signing-time">{this.getWordTime(cardInfo.workTime)}</h4>
                        </div> : null
                    }
                </div>
            </div>
        );
    }
};

export default TimeView;
