import React,{Component, PropTypes} from "react";

import BigCalendar from 'react-big-calendar';
require('react-big-calendar/lib/css/react-big-calendar.css');
import moment from 'moment';
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

import {createForm, FormWrapper} from "../../../../components/Form";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES, API_FOODING_HR,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import i18n, { I18n } from '../../../../lib/i18n';
import Confirm from '../../../../components/Dialog/Confirm';
import Normal from "./Normal";
//计算公历和农历
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Checkbox from "../../../../components/CheckBox/Checkbox";
import {navRemoveTab} from "../../../../components/NavigateTabs/modules/tabs";


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

class WorkCalenderEditAdd extends Component{
    constructor(props){
        super(props);
        this.handleResize=this.handleResize.bind(this);
        this.dateCellWrapper = this.dateCellWrapper.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.getDialog = this.getDialog.bind(this);
        this.state = {
            showDilaog:false,
            dialogContent:<div></div>,
            getOne:{},
            calendarlist:[],
        }
    }

    //头 编辑
    monthHeander = ({label, date}) => {
        return <span>{label}</span>
    };

    //年月日显示内容
    Event = ({event}) => {
        return <div style={{textAlign:"right",height:"100%",padding:"0px 5px"}}>
            <strong style={{color:"#0066cc"}}>{event.memo || ""}</strong>
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
        if(calendarlist.length){
            singleArr = calendarlist.filter(e => e.workDate.Format('yyyy-MM-dd') == value.Format('yyyy-MM-dd'));
        }
        let singelOne = singleArr[0] || {};
        let allSty = {flex:"1 0 0"};
        if(singelOne.workState == 2 || singelOne.workState == 3 || singelOne.workState == 4){
            return (<div className={"rbc-day-bg"} style={allSty}>
            <span style={{display:"inline-block",width:"100%",position:'relative'}}>
                 <span style={xiuStyle}>休</span>
            </span>
            </div>);
        }
        return (<div className={"rbc-day-bg"} style={allSty}>
            <span style={{display:"inline-block",width:"100%"}}></span>
        </div>);
    };


    // //选择日历事件时，触发(日历上有数据时触发)
    // onSelectEvent = (obj,e) => {
    //     this.getDialog(obj);
    //     e.stopPropagation && e.stopPropagation();
    //     e.defaultPrevented && e.defaultPrevented()
    // };

    //进行日期选择时候触发（日历上没数据时，触发）
    onSelectSlot = slotInfo => {
        let {calendarlist = []} = this.state;
        let singleArr = [];
        if(calendarlist.length){
            singleArr = calendarlist.filter(e => e.workDate.Format('yyyy-MM-dd') == slotInfo.start.Format('yyyy-MM-dd'));
        }
        let singelOne = singleArr[0] || {};
        this.getDialog(singelOne);
    };

    //生成弹窗
    getDialog = (obj = {}) => {
        let content = require('./InstructionsDialog').default;
        let element = React.createElement(content, {onSaveAndClose: this.onSaveAndClose, onCancel: this.onCancel,getOne:obj});
        this.setState({
            showDilaog: true,
            dialogContent: element
        })
    };

    //保存并关闭
    onSaveAndClose = () => {
      this.setState({showDilaog:false}, () => {
          this.getCalenderData();
      })
    };

    //取消
    onCancel = () => {
      this.setState({showDilaog:false})
    };

    handleResize(height){
        let padding = 80;
        let sch=document.body.offsetHeight - height - 90;
        let bc = sch - 160;
        this.setState({scrollHeight:sch+'px',bc:bc + "px"});
    }

    //保存
    saveClick = () => {
        let { form ,navAddTab,  navReplaceTab} = this.props;
        let { getOne } = this.state;
        form.validateFields((errors, value) => {
            if ( !errors) {
                let params = Object.assign({}, form.getFieldsValue());
                let value = getOne && getOne.id ? Object.assign({},params, {id:getOne.id, optlock:getOne.optlock}):params;
                apiPost(API_FOODING_HR, "/calendar/save", value, response => {
                    ServiceTips({text:response.message, type:'success'});
                    navReplaceTab({name:i18n.t(400237/*工作日历详情*/),component:i18n.t(400237/*工作日历详情*/),url:'/workcalender/detail'});
                    this.props.router.push({pathname: '/workcalender/detail', query: {id: response.data}});
                }, error => ServiceTips({text:error.message, type: 'error'}))
            }
        });
    };

    //返回
    backClick = () => {
        let {navReplaceTab, navAddTab, navRemoveTab} = this.props;
        let id = this.props.location.query.id;
        if(id){
            navReplaceTab({name:i18n.t(400237/*工作日历详情*/),component:i18n.t(400237/*工作日历详情*/),url:'/workcalender/detail'});
            this.props.router.push({pathname: '/workcalender/detail', query: {id: id}});
        } else {
            navRemoveTab({name:i18n.t(400235/*工作日历新增*/),component:i18n.t(400235/*工作日历新增*/),url:'/workcalender/addedit'});
            navAddTab({name: i18n.t(400239/*工作日历*/), component: i18n.t(400239/*工作日历*/), url: '/hrsystem/workcalender'});
            this.props.router.push({pathname: '/hrsystem/workcalender'});
        }
    };

    /**
     * 拉取日历 数据
     * */
    getCalenderList = (beginDate = "2018-01-01", endDate = "2018-01-31") => {
        let id = this.props.location.query.id  || "";
        if(!id) return false;
        apiGet(API_FOODING_HR, "/workingTepml/getList", {id, beginDate, endDate}, response => {
            let calendarlist = response.data || [];
            calendarlist.map( e => e.workDate = new Date(e.workDate));
            this.setState({calendarlist})
        }, error => ServiceTips({text:error.message, type:"error"}))
    };

    /**
     * 拉取主表 数据 getOne
     * */
    getCalenderData = () => {
        let id = this.props.location.query.id  || "";
        if(!id) return false;
        let that = this;
        apiGet(API_FOODING_HR, "/calendar/getOne", {id}, response => {
            that.setState({getOne : response.data || {}}, () => {
                let {beginDate, endDate} = that.getCurrentMonth((response.data || {}).dateBegin ? new Date((response.data || {}).dateBegin) : new Date());
                that.getCalenderList(beginDate, endDate);
            })
        }, error => ServiceTips({text:error.message, type:'error'}))
    };


    componentDidMount(){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize);
        if(this.props.location.query.id){
            this.getCalenderData();
        }
    };
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize);
    }


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
            endDate ;
        curB = new Date(y, m, 1);
        curE = new Date(y, m + 1, 0);
        curBW = curB.getDay() == 0 ? 7:curB.getDay();
        curEW = curE.getDay() == 0 ? 7:curE.getDay();
        beginDate = new Date(curB.getTime() -  (curBW - 1) * dayTimes ).Format('yyyy-MM-dd');
        endDate = new Date(curE.getTime() + (7 - curEW) * dayTimes ).Format('yyyy-MM-dd');
        return {beginDate, endDate};
    };

    //日历 toolbal 日历功能
    Toolbal = ({date, label, messages, onNavigate}) => {
        let { getFieldValue } = this.props.form;
        let getOne = this.state.getOne;
        let {beginDate, endDate} = this.getCurrentMonth(date);
        let isLeftClick = new Date(getFieldValue('dateBegin', getOne.dateBegin)).getTime() >= new Date(beginDate).getTime();
        let isRightClick = new Date(getFieldValue('dateEnd', getOne.dateEnd)).getTime() <= new Date(endDate).getTime();
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

    render(){
        let {getOne = {}} = this.state;
        const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
        return (<div style={{height:this.state.scrollHeight}} className='scroll activity-detail'>
            <div className={'addnormal'} >
                <div className={'addnormal-title'}>
                    <span>{I18n.t(100138/*常规*/)}</span>
                    <span onClick={this.backClick} title={I18n.t(100431/*返回*/)}><i className={'foddingicon fooding-back'}></i></span>
                    <span onClick={this.saveClick} title={I18n.t(100430/*保存*/)}><i className={'foddingicon fooding-save'}></i></span>
                </div>
                <Normal getOne={getOne} form={this.props.form} />
                {
                   Boolean(getOne.id) ? <div style={{height:this.state.bc,backgroundColor:"#fff",paddingBottom:"10px"}}>
                           <BigCalendar
                               popup
                               selectable
                               events={this.state.calendarlist || []}
                               startAccessor='workDate'
                               endAccessor='workDate'
                               defaultView={"month"}
                               views={['month']}
                               messages={{today:'Today',previous:"<",next:">"}}
                               defaultDate={getOne.dateBegin ? new Date(getOne.dateBegin) : new Date()}
                               onSelectEvent={this.onSelectEvent}
                               onSelectSlot={this.onSelectSlot}
                               //onNavigate={this.onNavigate}
                               components={{
                                   //event:this.Event,
                                   toolbar: this.Toolbal,
                                   dateCellWrapper:this.dateCellWrapper,
                                   eventWrapper:this.Event,
                                   month: {
                                       header:this.monthHeander,
                                   }
                               }}
                           />
                       </div> : null
                }
            </div>
            <Dialog width={926} visible={this.state.showDilaog} showHeader={false}>
                {this.state.dialogContent}
            </Dialog>
        </div>)
    }
}
export default NavConnect(createForm()(WorkCalenderEditAdd));
