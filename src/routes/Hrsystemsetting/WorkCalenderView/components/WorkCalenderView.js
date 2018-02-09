import React, {Component, PropTypes} from "react";

import BigCalendar from 'react-big-calendar';

require('react-big-calendar/lib/css/react-big-calendar.css');
import moment from 'moment';

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

import {createForm, FormWrapper} from "../../../../components/Form";
// ajax
import {
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_ERP,
    API_FOODING_DS,
    API_FOODING_ES,
    API_FOODING_HR,
    language,
    pageSize,
    sizeList,
    permissionsBtn
} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import i18n, {I18n} from '../../../../lib/i18n';
import Confirm from '../../../../components/Dialog/Confirm';
import Normal from "./Normal";
import Checkbox from "../../../../components/CheckBox/Checkbox";

const xiuStyle = {
    color: "#fff",
    position: "absolute",
    top: "-8px",
    left: "10px",
    background: "#e05c1e",
    display: "inline-block",
    width: "18px",
    height: "18px",
    textAlign: "center",
    lineHeight: "18px",
    borderRadius: "3px",
    fontWeight: 100
};

class WorkCalenderView extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
        this.state = {
            getOne: {},
            calendarlist: [],
            id: props.location.query.id || ""
        }
    }

    //年月日显示内容
    Event = ({event}) => {
        return <div style={{textAlign: "right", height: "100%", padding: "0px 5px"}}>
            <strong style={{color: "#0066cc"}}>{event.memo || ""}</strong>
        </div>
    };

    //每一个日里面的cell
    dateCellWrapper = ({value}) => {
        return this.renderBackground(value);
    };

    //拿到数据后找到当前一天
    renderBackground = value => {
        let {calendarlist = []} = this.state;
        let singleArr = [];
        if (calendarlist.length) {
            singleArr = calendarlist.filter(e => e.workDate.Format('yyyy-MM-dd') == value.Format('yyyy-MM-dd'));
        }
        let singelOne = singleArr[0] || {};
        let allSty = {flex: "1 0 0"};
        if (singelOne.workState == 2 || singelOne.workState == 3 || singelOne.workState == 4) {
            return (<div className={"rbc-day-bg"} style={allSty}>
                <span style={{display: "inline-block", width: "100%", position: 'relative'}}>
                     <span style={xiuStyle}>休</span>
                </span>
            </div>);
        }
        return (<div className={"rbc-day-bg"} style={allSty}>
            <span style={{display: "inline-block", width: "100%"}}></span>
        </div>);
    };

    handleResize(height) {
        let padding = 80;
        let sch = document.body.offsetHeight - height - 90;
        let bc = sch - 160;
        this.setState({scrollHeight: sch + 'px', bc: bc + "px"});
    }

    componentDidMount() {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize);
        this.getCalenderData();
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    componentWillReceiveProps(nextProps) {
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize);
    }

    /**
     * 拉取日历 数据
     * */
    getCalenderList = (beginDate = "2018-01-01", endDate = "2018-01-31") => {
        let id = this.props.location.query.id || "";
        if (!id) return false;
        apiGet(API_FOODING_HR, "/workingTepml/getList", {id, beginDate, endDate}, response => {
            let calendarlist = response.data || [];
            calendarlist.map(e => e.workDate = new Date(e.workDate));
            this.setState({calendarlist})
        }, error => ServiceTips({text: error.message, type: "error"}))
    };

    /**
     * 拉取主表 数据 getOne
     * */
    getCalenderData = () => {
        let id = this.props.location.query.id || "";
        if (!id) return false;
        let that = this;
        apiGet(API_FOODING_HR, "/calendar/getOne", {id}, response => {
            let getOne = response.data || {};
            that.setState({getOne: getOne}, () => {
                let {beginDate, endDate} = that.getCurrentMonth(getOne.dateBegin ? new Date(getOne.dateBegin) : new Date());
                that.getCalenderList(beginDate, endDate);
            });
        }, error => ServiceTips({text: error.message, type: 'error'}))
    };

    editClick = () => {
        let {navReplaceTab} = this.props;
        let id = this.props.location.query.id || "";
        navReplaceTab({
            name: i18n.t(400236/*工作日历编辑*/),
            component: i18n.t(400236/*工作日历编辑*/),
            url: '/workcalender/addedit'
        });
        this.props.router.push({pathname: '/workcalender/addedit', query: {id: id}, state: {refresh: true}});
    };

    delClick = () => {
        Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
            done: () => {
                let id = this.props.location.query.id || "";
                if (!id) return false;
                apiForm(API_FOODING_HR, '/calendar/delete', {id: [id]}, response => {
                    ServiceTips({text: response.message, type: 'success'});
                    let {navAddTab, navRemoveTab} = this.props;
                    navRemoveTab({
                        name: i18n.t(400237/*工作日历详情*/),
                        component: i18n.t(400237/*工作日历详情*/),
                        url: '/workcalender/detail'
                    });
                    navAddTab({name: i18n.t(400239/*工作日历*/), component: i18n.t(400239/*工作日历*/), url: '/hrsystem/workcalender'});
                    this.props.router.push({pathname: '/hrsystem/workcalender', state: {refresh: true}});
                }, error => ServiceTips({text: error.message, type: 'error'}))

            },
            close: () => {
                console.log('no, close')
            }
        });
    };

    /**
     * 前后点击 拉取数据
     * */
    onNavigate = (data, cb, type) => {
        let obj = {};
        if(type == "PREV"){
            obj = this.getCurrentMonth(new Date(data.getFullYear(), data.getMonth() - 1, 1));
        }else if(type == "NEXT"){
            obj = this.getCurrentMonth(new Date(data.getFullYear(), data.getMonth() + 1, 1));
        }
        let {beginDate, endDate} = obj;
        this.getCalenderList(beginDate, endDate);
        cb(type, data);
    };

    /**
     * 获取当前月并自动补全前后周一到周五
     * */
    getCurrentMonth = currentDate => {
        let y = currentDate.getFullYear(),
            m = currentDate.getMonth(),
            curB,
            curE,
            curBW,
            curEW,
            dayTimes = 1000 * 60 * 60 * 24,
            beginDate,
            endDate;
        curB = new Date(y, m, 1);
        curE = new Date(y, m + 1, 0);
        curBW = curB.getDay() == 0 ? 7 : curB.getDay();
        curEW = curE.getDay() == 0 ? 7 : curE.getDay();
        beginDate = new Date(curB.getTime() - (curBW - 1) * dayTimes).Format('yyyy-MM-dd');
        endDate = new Date(curE.getTime() + (7 - curEW) * dayTimes).Format('yyyy-MM-dd');
        return {beginDate, endDate};
    };

    //激活
    activaClick = () => {
        let id = this.props.location.query.id || getOne.id;
        apiForm(API_FOODING_HR, '/calendar/modifyWorkingCalendar', {id: id, state: true}, (response) => {
            ServiceTips({text: response.message, type: 'success'});
            this.getCalenderData();
        }, (error) => {
        })
    };

    //失效
    validClick = () => {
        Confirm(I18n.t(100435/*是否对该条数据失效？*/), {
            done: () => {
                //表示是失效
                let id = this.props.location.query.id || getOne.id;
                apiForm(API_FOODING_HR, '/calendar/modifyWorkingCalendar', {id: id, state: false}, (response) => {
                    ServiceTips({text: response.message, type: 'success'});
                    this.getCalenderData();
                }, (error) => {
                    ServiceTips({text: error.message, type: 'error'})
                })
            },
            close: () => {
            }
        });
    };

    //日历 toolbal 日历功能
    Toolbal = ({date, label, messages, onNavigate}) => {
        let getOne = this.state.getOne;
        let {beginDate, endDate} = this.getCurrentMonth(date);
        let isLeftClick = new Date(getOne.dateBegin).getTime() >= new Date(beginDate).getTime();
        let isRightClick = new Date(getOne.dateEnd).getTime() <= new Date(endDate).getTime();
        return (<div style={{display: 'flex', justifyContent: "center", alignItems: "center", marginBottom:"10px"}}>
            <button onClick={this.onNavigate.bind(this, date, onNavigate, "PREV")} className={'button'}
                    disabled={isLeftClick}
                    style={{
                        background: "#fff",
                        border: "1px solid #ccc",
                        color: "#888",
                        fontSize: "18px",
                        marginRight: "10px",
                        height: "28px",
                        lineHeight: "28px",
                        padding: "0 6px",
                        cursor: isLeftClick ? "not-allowed" : "pointer"
                    }}
            >{messages.previous}</button>
            <span style={{fontSize:"16px"}}>{label}</span>
            <button onClick={this.onNavigate.bind(this, date,onNavigate, "NEXT")} className={'button'}
                    disabled={isRightClick}
                    style={{
                        background: "#fff",
                        border: "1px solid #ccc",
                        color: "#888",
                        fontSize: "18px",
                        marginLeft: "10px",
                        height: "28px",
                        lineHeight: "28px",
                        padding: "0 6px",
                        cursor: isRightClick ? "not-allowed" : "pointer"
                    }}>{messages.next}</button>
        </div>)
    };

    render() {
        let {getOne = {}} = this.state;
        return (<div style={{height: this.state.scrollHeight}} className='scroll activity-detail'>
            <div className={'addnormal'}>
                <div className={'addnormal-title'}>
                    <span>{I18n.t(100138/*常规*/)}</span>
                    {
                        permissionsBtn("workcalender.del") ?

                            (this.state.getOne.rowSts == 5 ?
                                <span onClick={this.delClick} title={i18n.t(100437/*删除*/)}><i
                                    className={'foddingicon fooding-delete-icon3'}></i></span> : null ) : null
                    }
                    {
                        permissionsBtn("workcalender.edit") ?
                            <span onClick={this.editClick} title={i18n.t(100439/*编辑*/)}><i
                                className={'foddingicon fooding-alter_icon2'}></i></span> : null
                    }
                    {
                        permissionsBtn("workcalender.activation") ?
                            (this.state.getOne.rowSts == 20 || this.state.getOne.rowSts == 5 ? null :
                                <span onClick={this.activaClick} title={i18n.t(100442/*激活*/)}><i
                                    className={'foddingicon fooding-jh-icon2'}/></span>) : null
                    }
                    {
                        permissionsBtn("workcalender.Invalid") ?
                            (this.state.getOne.rowSts == 10 ? null :
                                <span onClick={this.validClick} title={i18n.t(100441/*失效*/)}><i
                                    className={'foddingicon fooding-sx-icon2'}/></span>) : null
                    }
                </div>
                <Normal getOne={this.state.getOne}/>
                {
                    Boolean(getOne.id) ? <div style={{height: this.state.bc, backgroundColor: "#fff", paddingBottom: "10px"}}>
                        <BigCalendar
                            events={this.state.calendarlist || []}
                            startAccessor='workDate'
                            endAccessor='workDate'
                            defaultView={"month"}
                            views={['month']}
                            messages={{today: 'Today', previous: "<", next: ">"}}
                            defaultDate={getOne.dateBegin ? new Date(getOne.dateBegin) : new Date()}
                            //onNavigate={this.onNavigate}
                            components={{
                                // event:this.Event,
                                dateCellWrapper: this.dateCellWrapper,
                                eventWrapper: this.Event,
                                toolbar: this.Toolbal
                            }}
                        />
                    </div> : null
                }

            </div>

        </div>)
    }
}

export default NavConnect(createForm()(WorkCalenderView));
