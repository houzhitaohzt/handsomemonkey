import i18n from './../../../lib/i18n';
import React, { Component } from 'react'
import './ScheduleView.less'
import { Router, Route, IndexRoute, hashHistory ,Link} from 'react-router';
import Dialog from '../../Dialog/Dialog';//弹层
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_OA} from '../../../services/apiCall';
import ServiceTips from '../../ServiceTips';

import NavConnect from "../../NavigateTabs/containers/AddContainer";
import WebData from '../../../common/WebData';
import {I18n} from '../../../lib/i18n';

//取某个月的第一天和最后一天
const getFirstAndLastMonthDay = (year, month) => {
    var   firstdate = year + '-' + month + '-01';
    var  day = new Date(year,month,0);
    var lastdate = year + '-' + month + '-' + day.getDate();//获取当月最后一天日期
    //给文本控件赋值。同下
    return {firstdate:new Date(firstdate).Format('yyyy-MM-dd'),lastdate:new Date(lastdate).Format('yyyy-MM-dd')};
}
export class ScheduleDragView extends Component{
    constructor(props) {
        super(props);
        var that = this;
        //this.addClick=this.addClick.bind(this);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        let array = [];
        let schedule = new Date();
        let data = schedule;
        let startDate = this.addDate(schedule,-(schedule.getDay()-1));
        for(var i = 0; i<35;i++){
            array.push(this.addDate(startDate,i));
        }
        this.state = {
            startDate:startDate,
            rodalShow:false,
            array:array,
            select:data,
            datas : [],
            scheduleList:[] //后台拉取的页面数据
        };
        this.isRewu = this.isRewu.bind(this);
        this.compareDate = this.compareDate.bind(this);
    }
    addDate(date,days){
        var d=new Date(date);
        d.setDate(d.getDate()+days);
        let y= d.getFullYear();
        var m=d.getMonth()+1;
        return d;
    }
    nextDate(){
        let array =[];
        let that = this;
        let startDate = this.addDate(this.state.startDate,35);
        for(var i = 0; i<35;i++){
            array.push(this.addDate(startDate,i));
        }
        let num = 0;
        if(this.state.select.getDay() == 0){
            num = 6;
        }else{
            num = this.state.select.getDay()-1;
        }
        let select = this.addDate(startDate,num);
        // let obj = getFirstAndLastMonthDay(new Date(array[0]).getFullYear(),new Date(array[0]).getMonth() + 1);
        let firstdate = new Date(array[0]).Format('yyyy-MM-dd');
        let lastdate =  new Date(array[34]).Format('yyyy-MM-dd');
        this.setState({
            startDate:startDate,
            array:array,
            select:select
        },this.initList({fromDate:firstdate,toDate:lastdate}));
    }
    //拉取数据
    initList = (obj = {}) =>　{
        let currentYear = new Date(this.state.currentDate).getFullYear();
        let currentMonth = new Date(this.state.currentDate).getMonth() + 1;
        let firstdate = new Date(this.state.array[0]).Format('yyyy-MM-dd');
        let lastdate =  new Date(this.state.array[34]).Format('yyyy-MM-dd');
        if(JSON.stringify(obj) === "{}"){
            obj = Object.assign({},{fromDate:firstdate,toDate:lastdate});
        }
        obj = Object.assign({},obj,{clusterId:WebData.user.data.staff.clusId,ccId:WebData.user.data.staff.ccid,username:WebData.user.data.loginName});
        apiGet(API_FOODING_OA,"/routine/getList",obj,response =>　{
            let data = response.data || [];
            this.setState({scheduleList:response.data || []})
        },error => ServiceTips({text:error.messages,type:"error"}))
    }
    backDate(){
        let array =[];
        let startDate = this.addDate(this.state.startDate,-35);
        for(var i = 0; i<35;i++){
            array.push(this.addDate(startDate,i));
        }
        let num = 0;
        if(this.state.select.getDay() == 0){
            num = 6;
        }else{
            num = this.state.select.getDay()-1;
        }
        let select = this.addDate(startDate,num);
        // let obj = getFirstAndLastMonthDay(new Date(startDate).getFullYear(),new Date(startDate).getMonth() + 1);
        let firstdate = new Date(array[0]).Format('yyyy-MM-dd');
        let lastdate =  new Date(array[34]).Format('yyyy-MM-dd');
        this.setState({
            startDate:startDate,
            array:array,
            select:select
        },this.initList({fromDate:firstdate,toDate:lastdate}));
    }
    subDate(date){
        let crrent = new Date();
        if(crrent.getFullYear() > date.getFullYear()){
            return false;
        }else if(crrent.getFullYear() == date.getFullYear()){
            if(crrent.getMonth() > date.getMonth()){
                return false;
            }else if(crrent.getMonth() == date.getMonth()){
                if(crrent.getDate() > date.getDate()){
                    return false;
                }else if(crrent.getDate() <= date.getDate()){
                    return true;
                }
            }else{
                return true;
            }

        }else{
            return true;
        }

    }
    onSaveAndClose(value,data,isAdd){

    }
    onCancel(that){
        this.setState({
            rodalShow:false
        })
        if(that){
            that.props.form.resetFields();
            that.addradio.setState({
                array:[{radio:{type:i18n.t(300009/*手机*/),checked:true},select:i18n.t(300009/*手机*/),inputValue:''}]
            });
        }
    }
    isRewu(c){
        let scheduleList = this.state.scheduleList;
        let cLenth = new Date(c).Format('yyyy-MM-dd');//当前时间的时间戳
        for(var i=0,length=scheduleList.length;i<length;i++){
            var stats = new Date(scheduleList[i].starts).Format('yyyy-MM-dd');
            var ends =  new Date(scheduleList[i].ends).Format('yyyy-MM-dd');
            if(this.compareDate(stats,ends,cLenth)){
                return true;
            }
        }
        return false;
    }
    compareDate(checkStartDate, checkEndDate,c){
        var arys1= new Array();
        var arys2= new Array();
        var arys3= new Array();
        arys1=checkStartDate.split('-');
        var sdate=new Date(arys1[0],parseInt(arys1[1]-1),arys1[2]);
        arys2=checkEndDate.split('-');
        var edate=new Date(arys2[0],parseInt(arys2[1]-1),arys2[2]);
        arys3=c.split('-');
        var current=new Date(arys3[0],parseInt(arys3[1]-1),arys3[2]);
        if(sdate<= current &&current <= edate) {
            return true;
        }  else {
            return false;
        }
    }
    componentDidMount(){
        // this.getricheng();
        this.initList();

    };
    clickItem(c,e){
        this.setState({
            select:c
        });
        var that = this;
        let time= new Date(c || '');
        let {navAddTab} = this.props;
        let id = encodeURI(time);
        navAddTab({name: I18n.t(400141/*日程*/), component: I18n.t(400141/*日程*/), url: '/schedule'});
        this.props.router.push({pathname:'/schedule',query:{id:id,view:'day'}, state: {refresh: true}});
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

    render(){
        let crrentY = new Date();
        let ulArray =[1,1,1,1,1];
        let liArray =[0,1,2,3,4,5,6];
        let that = this;
        const els = ulArray.map((e,j)=>{
            return <ul className="hh-avg-sm-7 hh-thumbnails p-b10" key ={j}>
                {
                    liArray.map((c, i) => {
                        let str ='';
                        let common=<span></span>;
                        if(that.isRewu(that.state.array[i+j*7])){
                            common =<span>●</span>;
                        }
                        if(that.state.array[i+j*7].getDate()==this.state.select.getDate()&&
                            that.state.array[i+j*7].getFullYear()==this.state.select.getFullYear()&&
                            that.state.array[i+j*7].getMonth()==this.state.select.getMonth()){  //当前天
                            str = "current";
                        }else if(!this.subDate(that.state.array[i+j*7])){
                            str ="Expired"; //过去的天数
                        }else{
                            str ="not-Expired"; //后面的天数
                        }
                        return  <li key={i+j*7} onClick={this.clickItem.bind(this,that.state.array[i+j*7])}>
                            <div className={str}>
                                {that.state.array[i+j*7].getDate()}
                                <br/>
                                {common}
                            </div>
                        </li>;
                    })
                }
            </ul>
        })
        return (
            <div className="dragesingle" >
                <div className={"dragetitle"}>
                    <span className={"drageshow"}>{i18n.t(400141/*日程*/)}</span>
                    <span className="dragehandle"></span>
                    <span className={"drageaction"}>
                        <i className={"foddingicon fooding-sd-icon2"}></i>
                        <span className="action">
                            <span onClick={this.onRefresh}><i className={"foddingicon fooding-update"}></i>&nbsp;&nbsp;{i18n.t(400046/*刷新*/)}</span>
                            <span onClick={this.onDrageEdit}><i className={"foddingicon fooding-alter_icon2"}></i>&nbsp;&nbsp;{i18n.t(100439/*编辑*/)}</span>
                            <span onClick={this.onDrageDelete}><i className={"foddingicon fooding-delete-icon4"}></i>&nbsp;&nbsp;{i18n.t(100437/*删除*/)}</span>
                        </span>
                    </span>
                </div>
                <div className={"dragecontent"} style={{height:Number(this.props.rowHeight + 10) * Number(this.props.laysingle.h) - 50 + "px"}}>
                    <div className ='index-bd-box hh-radius hh-pd0 mt10 shadow schedule' style={{marginTop:0}}>
                        <div className = 'i-schedule-bd'>
                            <div className="year">
                                <span className="a-lf" onClick = {this.backDate.bind(this,1)}><i className="foddingicon fooding-arrow_left_16"></i></span>
                                <span className="y-m">{this.state.select.getMonth()+1}月  { crrentY.getFullYear() != this.state.select.getFullYear() ? this.state.select.getFullYear(): ''}</span>
                                <span className="a-rg" onClick = {this.nextDate.bind(this,1)}><i className="foddingicon fooding-arrow-right_16"></i></span>
                            </div>

                            <div className="week">
                                <ul className="hh-avg-sm-7 hh-thumbnails hd">
                                    <li className = 'clearfix'></li>
                                    <li>{I18n.t(400172/*星期一*/)}</li>
                                    <li>{I18n.t(400173/*星期二*/)}</li>
                                    <li>{I18n.t(400174/*星期三*/)}</li>
                                    <li>{I18n.t(400175/*星期四*/)}</li>
                                    <li>{I18n.t(400176/*星期五*/)}</li>
                                    <li>{I18n.t(400177/*星期六*/)}</li>
                                    <li>{I18n.t(400178/*星期日*/)}</li>
                                </ul>
                                {els}
                            </div>


                            <div className="schedule-list-box">
                                {
                                    this.state.datas.map((value,i)=>{
                                        return <Link key={i}><span className="box_space lf" href="">●{value.title}</span><span className="rg">{value.starts}-{value.ends}</span></Link>
                                    })
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NavConnect(ScheduleDragView);
