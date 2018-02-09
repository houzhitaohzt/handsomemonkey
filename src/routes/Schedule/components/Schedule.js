import React,{Component,PropTypes} from 'react';
import BigCalendar from 'react-big-calendar';
require('react-big-calendar/lib/css/react-big-calendar.css');
import moment from 'moment';

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

import Dialog from '../../../components/Dialog/Dialog';//弹层
// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_OA,language} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import Filter from "./Filter";
import Confirm from '../../../components/Dialog/Confirm';//删除弹层

import { I18n } from '../../../lib/i18n';
import ToLunarCalender from "../../../common/ToLunarCalender";
//议程的内容显示
const EventAgenda = ({event}) => {
	return <span>
		<span style={{ color: 'pink'}}>{I18n.t(100304/*主题*/)}: </span><em style={{ color: 'magenta'}}>{event.title}</em>
		<p><span style={{ color: 'pink'}}>{I18n.t(400141/*日程*/) + ": "}</span><span style={{ color: 'orange'}}>{ event.content }</span></p>
	</span>
};
//取某个月的第一天和最后一天
const getFirstAndLastMonthDay = (year, month) => {
   var   firstdate = year + '-' + month + '-01';
   var  day = new Date(year,month,0);
   var lastdate = year + '-' + month + '-' + day.getDate();//获取当月最后一天日期
	//给文本控件赋值。同下
   return {firstdate:new Date(firstdate).Format('yyyy-MM-dd'),lastdate:new Date(lastdate).Format('yyyy-MM-dd')};
}

class MyCalendar extends Component{
	constructor(props){
		super(props);
		this.searchForm = {};
		this.handleResize = this.handleResize.bind(this);
		this.state = {
			height:0,
			scheduleList:[],
			showDilaog:false,
			clickCount:1,
			view:this.props.location.query.view?this.props.location.query.view:'month',
			currentDate:this.props.location.query.id?new Date(decodeURIComponent(this.props.location.query.id)):new Date().Format("yyyy-MM-dd hh:mm:ss")
		}
	}
	//删除日程
	onDeleteClick = (data) => {
        let that = this;
		if(!!data.rule){//表示重复
            Confirm(I18n.t(400146/*删除后将无法恢复,你确定要删除该日程？*/),{
                showConfirmClose:true,
                confirmLabel:I18n.t(500310/*删除整个重复事件*/),
                abortLabel:I18n.t(500311/*仅删除今天*/),
                done: () => { //删除全部重复日程
                	let pid = data.pid? data.pid : data.id;
                    apiForm(API_FOODING_OA,"/routine/delete",{isDelete:true,id:pid,businessDate:new Date(data.businessDate).Format("yyyy-MM-dd hh:mm:ss")},response => {
                        //刷新页面
                        that.initList();
                        that.setState({showDilaog:false},() => ServiceTips({text:response.message,type:'success'}));
                    },error => ServiceTips({text:error.message,type:'error'}))
                },
				close: () => {//删除当天日程
                    let pid = data.pid? data.pid : data.id;
                    apiForm(API_FOODING_OA,"/routine/pid/delete",{isDelete:false,pid:pid,businessDate:new Date(data.businessDate).Format("yyyy-MM-dd hh:mm:ss")},response => {
                        //刷新页面
                        that.initList();
                        that.setState({showDilaog:false},() => ServiceTips({text:response.message,type:'success'}));
                    },error => ServiceTips({text:error.message,type:'error'}))
                }
            })
		}else{//表示不重复
            Confirm(I18n.t(400146/*删除后将无法恢复,你确定要删除该日程？*/),{
                done: () => {
                    apiForm(API_FOODING_OA,"/routine/pid/delete",{isDelete:true,id:data.id},response => {
                        //刷新页面
                        that.initList();
                        that.setState({showDilaog:false},() => ServiceTips({text:response.message,type:'success'}));
                    },error => ServiceTips({text:error.message,type:'error'}))
                }
            })
		}
	};

	//年月日显示内容
	Event = ({event}) => {
		return <span>
			<strong>{event.title}</strong>
		</span>
	};
    //每一个日里面的cell
    dateCellWrapper = (date,obj,e) => {
        let week = date.value.getDay();
        let timearr = ToLunarCalender.toLunar(date.value.getFullYear(),date.value.getMonth() + 1,date.value.getDate());
        // 周六和周末
        let style = (week == 0 || week == 6)?{flex:"1 0 0",backgroundColor:"#f0f7fe"}:{flex:"1 0 0"};
        // 国内和国外节日
        let styleFestvl = timearr[8] || timearr[9]?{backgroundColor:"#fff0f0",color:'red',fontWeight:"bold"}:{};
        // 当天
        let ownStyle = (date.value.Format('yyyy-MM-dd') == new Date().Format('yyyy-MM-dd')?{backgroundColor:"#96f3a8"}:{});
        let sty = Object.assign({},style,styleFestvl,ownStyle);
        return (<div className={"rbc-day-bg"} style={sty}>
			<span style={{display:"inline-block",width:"100%",textAlign:"center"}}>{timearr[8] || timearr[9] ?(timearr[8] || timearr[9]) : (timearr[5] + timearr[6])}</span>
		</div>)
    };
	//月周日的切换
	onView = view  => {
		let currentYear = new Date(this.state.currentDate).getFullYear();
		let currentMonth = new Date(this.state.currentDate).getMonth() + 1;
		let obj = getFirstAndLastMonthDay(currentYear,currentMonth);
		let firstdate = obj.firstdate;
		let lastdate = obj.lastdate;
		this.setState({view},() => this.initList({fromDate:firstdate,toDate:lastdate}))
	};
	//拉取数据
	initList = (obj = {}) =>　{
		let currentYear = new Date(this.state.currentDate).getFullYear();
		let currentMonth = new Date(this.state.currentDate).getMonth() + 1;
		let dateObj = getFirstAndLastMonthDay(currentYear,currentMonth);
		let firstdate = dateObj.firstdate;
		let lastdate = dateObj.lastdate;
		if(JSON.stringify(obj) === "{}"){
			obj = Object.assign({},{fromDate:firstdate,toDate:lastdate});
		}
		obj =Object.assign({},obj,this.searchForm.getFieldsValue());
		apiGet(API_FOODING_OA,"/routine/rule/getList",obj,response =>　{
			let data = response.data || [];
			data.forEach((da,di) => {
				da.starts = new Date(da.starts);
				da.ends = new Date(da.ends);
			});
			this.setState({scheduleList:Array.from(data)})
		},error => ServiceTips({text:error.message,type:"error"}))
	};
	//选择日历事件时，触发(日历上有数据时触发)
	onSelectEvent = (obj,e) => {
        this.onViewSchedule(obj);
	};

	//显示日程详情
	onViewSchedule = (obj = {}) => {
        let content = require('./ScheduleViewDialog').default;
        let element = React.createElement(content, { onCancel: this.onCancel,onSaveAndClose:this.onEditSchedule, onSaveAdd:this.onDeleteClick, data:obj});
        this.setState({
            showDilaog: true,
            title: "查看详情",
            dialogContent: element,
        });
	};

	//编辑日程
	onEditSchedule = (obj = {}) => {
		let content = require('./ScheduleEditDialog').default;
		let element = React.createElement(content, {onSaveAndClose: this.onSaveAndClose, onCancel: this.onCancel, onSaveAdd: this.onSaveAndClose,valueone:obj});
		this.setState({
			showDilaog: true,
			title: "编辑日程",
			dialogContent: element,
		})

    };

	//进行日期选择时候触发（日历上没数据时，触发）
	onSelectSlot = slotInfo => {
		if(!permissionsBtn('schedule.add')) return false;
		let {view,clickCount} = this.state,start,end;
		clickCount++;
		if(clickCount !== 2) return false;
		if(view == 'month'){
			start = new Date(slotInfo.start).Format('yyyy-MM-dd 00:00:00');
			end = new Date(slotInfo.end).Format('yyyy-MM-dd 23:59:59')
		}else{
			start = new Date(slotInfo.start).Format('yyyy-MM-dd hh:mm:ss');
			end = new Date(slotInfo.end).Format('yyyy-MM-dd hh:mm:ss')
		}
		let content = require('./CreateScheduleDialog').default;
        let element = React.createElement(content, {onSaveAndClose: this.onSaveAndClose, onCancel: this.onCancel,start:start,end:end});
        this.setState({
            showDilaog: true,
            title: I18n.t(400147/*新建日程*/),
            dialogContent: element,
            clickCount:clickCount
        })
	};
	//进行前后点击的时候，进行数据请求
	onNavigate = (data,view) => {
		let currentYear = new Date(this.state.currentDate).getFullYear();
		let currentMonth = new Date(this.state.currentDate).getMonth() + 1;
		let year = new Date(data).getFullYear();
		let month = new Date(data).getMonth() + 1;
		if(currentYear != year || currentMonth != month){
			let obj = getFirstAndLastMonthDay(year,month);
			let firstdate = obj.firstdate;
			let lastdate = obj.lastdate;
			this.setState({currentDate:firstdate},() => this.initList({fromDate:firstdate,toDate:lastdate}))
		}
	};
	onSaveAndClose = () => {
		this.setState({showDilaog:false,clickCount:1},() =>this.initList())
	};
	onCancel = () => {
		this.setState({showDilaog:false,clickCount:1})
	};
	//搜索
	serchClick = data => {
		this.initList();
	};
	//新建日程
	addClick = () => {
		let {view,clickCount} = this.state,start,end;
		clickCount++;
		if(clickCount !== 2) return false;
		let currentTime = new Date();
		start = this.getStartTime();
		end = new Date(new Date(start).getTime() + 1000*60*60*1).Format('yyyy-MM-dd hh:mm:ss');
		let content = require('./CreateScheduleDialog').default;
        let element = React.createElement(content, {onSaveAndClose: this.onSaveAndClose, onCancel: this.onCancel,start:start,end:end});
        this.setState({
            showDilaog: true,
            title: I18n.t(400147/*新建日程*/),
            dialogContent: element,
            clickCount:clickCount
        })
	};

	//点击新建日程 获取时间
	getStartTime = () => {
		let time = new Date().getTime();
		let ThreeTime = new Date(time + 1000*60*30);
		let a = ThreeTime.getMinutes();
		if(a > 45 ){
			return new Date(time + 1000*60*45).Format('yyyy-MM-dd hh:00:00')
		}else if(a < 15){
            return ThreeTime.Format('yyyy-MM-dd hh:00:00')
		}else{
            return ThreeTime.Format('yyyy-MM-dd hh:30:00')
		}
	};

	//showViewDialog 消息直接调用 /schedule?viewDialog=true&viewId=16
    showViewDialog = () => {
    	let that = this;
    	let viewDialog = this.props.location.query && this.props.location.query.viewDialog;
    	if(!viewDialog) return false;
    	let viewId = this.props.location.query && this.props.location.query.viewId?this.props.location.query.viewId:"";
    	let pviewId = this.props.location.query && this.props.location.query.pviewId? this.props.location.query.pviewId:"";
    	if(viewId){
            apiGet(API_FOODING_OA,"/routine/getOne",{id:viewId},response => {
                let obj = response.data || {};
                that.onViewSchedule(obj);
            },error => console.log())
		}else{
    		let businessDate = this.props.location.query && this.props.location.query.businessDate? this.props.location.query.businessDate:new Date();
    		apiGet(API_FOODING_OA,"/routine/pid/getOne",{pid:pviewId,businessDate:new Date(businessDate).Format("yyyy-MM-dd hh:mm:ss")},response => {
                let obj = response.data || {};
                that.onViewSchedule(obj);
			},error => console.log())
		}

	};

	handleResize(e,height){
		this.filterHeight = height || this.filterHeight || 50;
		 let sch = document.body.offsetHeight - this.filterHeight - 92;
		 this.setState({height:sch+'px'});
	}
	componentWillMount(){
		window.addEventListener('resize', this.handleResize);
	}
	componentDidMount(){
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
		this.initList();

	}
	componentWillReceiveProps(nextProps){
		this.handleResize(0);
		let view = nextProps.location.query.view,id = nextProps.location.query.id;
		if(id && new Date(decodeURIComponent(id)).Format('yyyy-MM') !== new Date(decodeURIComponent(this.props.location.query.id)).Format('yyyy-MM')){
			this.setState({currentDate:new Date(id)});
		}
		if(view && view !== this.props.location.query.view){
			this.setState({view});
		}
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

    monthHeander = ({label, date}) => {
		return <span>{label}</span>
	};

	render(){
		return(<div>
			<Filter serchClick={this.serchClick} cleanClick={this.cleanClick} addClick={this.addClick} formCall={form=>this.searchForm=form} />
			<div style={{height:this.state.height,backgroundColor:"#fff"}}>
				<BigCalendar
			    	{...this.props}
			    	popup
			    	selectable
			      events={this.state.scheduleList}
			      startAccessor='starts'
			      endAccessor='ends'
			      allDayAccessor="isAllDay"
			      view={this.state.view}
			      views={['month','week','day']}
			      onView={this.onView}
				  messages={{today:I18n.t(400148/*今天*/),previous:"<",next:">",month:I18n.t(400149/*月*/),week:I18n.t(400150/*周*/),day:I18n.t(400151/*日*/)}}
			      defaultDate={this.props.location.query.id?new Date(decodeURI(this.props.location.query.id)):new Date()}
			      step={30}
	        	  timeslots={2}
			      onSelectEvent={this.onSelectEvent}
				  onSelectSlot={this.onSelectSlot}
				  onNavigate={this.onNavigate}
				  components={{
				  	event:this.Event,
                    dateCellWrapper:this.dateCellWrapper,
				  	agenda:{
				  		event:EventAgenda,
				  	},
                    month: {
                        header:this.monthHeander,
					}
				  }}
			    />
			</div>
		    <Dialog width={1000} visible={this.state.showDilaog} title={this.state.title}>
				{this.state.dialogContent}
			</Dialog>
		  </div>)
	}
}
export default MyCalendar;