import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import AttendanceResultsqueryPlug from './AttendanceResultsqueryPlug';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,pageSize,sizeList,API_FOODING_HR} from '../../../services/apiCall';
import Loading from "../../../components/Loading";//加载动画
import ServiceTips from "../../../components/ServiceTips";//
import {I18n} from "../../../lib/i18n";
import WebData from "../../../common/WebData";
class AttendanceResultsquery extends Component{
	constructor(props){
		super(props)
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		var that = this;
		this.getPage =this.getPage.bind(this);

     /*获取当前日期*/
        const CurentTime=()=> {
            var now = new Date();
            var year = now.getFullYear();       //年
            var month = now.getMonth() + 1;     //月
            var day = now.getDate();            //日
            var clock = year+"-";        //加""的作用是转成字符串，不然会以整型计算

            if(month < 10)
                clock += ""+"0";
            clock += month;

            if(day < 10)
                clock += ""+"0";
            clock += day;
            return(clock);
        }
       // console.log(CurentTime());

        this.columns = [{
			title : '职员工号',
			dataIndex : 'code',
			key : "code",
			width : '20%',
			render(data,row,index){
				return data;
			}
		},{
			title : '职员名称',
			dataIndex : 'name',
			key : "name",
			width : '10%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title :'所属部门',
			dataIndex : "organization",
			key : "organization",
			width : "15%",
			render(data,row,index){
				return (<div>{data?data.localName:''}</div>);
			}
		},{
			title : '职位',
			dataIndex : "positn",
			key : "positn",
			width : "15%",
			render(data,row,index){
                return <div>{data?data.localName:''}</div>;
			}
		},{
            title :'在职状态',
            dataIndex : "workingState",
            key : "workingState",
            width : "10%",
            render(data,row,index){
                return <div>{data?data.name:''}</div>;
            }
		},{
			title : '排班内容',
			dataIndex : "description",
			key : "description",
			render(data,row,index){
				return <div className="text-ellipsis mail-hover" onClick={that.onDetailHandle.bind(that,row)} style={{color:'#0066cc'}}>排班明细</div>;
			}
		}];
		this.state = {
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			MeunState:true,
			rodalShow:false,
			showSaveAdd:false,
			showSaveClose:true,
			buttonLeft:I18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			data : [],
			pageSize:pageSize,
			currentPage:1,
			info:{}
		}
	}



	addClick(){
		this.setState({
				rodalShow : true,
				showHeader:true,
				DialogContent:1,
				showSaveAdd:true,
				showSaveClose:true,
				title:I18n.t(100260/*交易条款新增*/),

		})
	}
    onSaveAndClose(value,data,isAdd){
        var that = this;
        value=Object.assign({},data,value);
        apiPost(API_FOODING_DS,'/incotm/save',value,(response)=>{
            that.setState({
                rodalShow:!!isAdd
            })
            ServiceTips({text:response.message,type:'success'});
            this.getPage();
        },(errors)=>{
            ServiceTips({text:errors.message,type:'error'});
            that.setState({
                rodalShow:!!isAdd
            })
        })
    }
    /*获取本月的第一天*/
    BeginDate=()=>{
        const date_ = new Date();
        const year = date_.getFullYear();
        const month = date_.getMonth() + 1;
        let clock = year+"-";
        if(month < 10)
            clock += ""+"0";
        clock += month;
        return (clock+'-' +'01');//当月第一天
    };
    /*获取本月的最后一天*/
    EndDate=()=>{
        const date_ = new Date();
        const year = date_.getFullYear();
        const month = date_.getMonth() + 1;
        const day = new Date(year,month,0);
        let clock = year+"-";
        if(month < 10)
            clock += ""+"0";
        clock += month;
        return (clock+'-' + day.getDate());//当月最后一天
    };

    onDetailHandle (record, e){
        e.stopPropagation && e.stopPropagation();
        apiGet(API_FOODING_HR,'/scheduleWorking/getOne',{ccid:record.ccid,staffId:record.id,beginDate:this.BeginDate(),endDate:this.EndDate()},(response)=>{
            this.setState({
                DialogContent:5,
                checkedData:response.data || {},
                rodalShow : true,
                showSaveClose:false,
                showHeader:true,
                title:'考勤排班详情',
                showSaveAdd:false,
            })
        },(error)=>{

        })
    }
	deleteClick(data){
				let numArr = this.refs.TermsOfTrade.getSelectArr();
				let value=[];
				var that = this;
				if(numArr.length > 0){
					for (var i = 0; i < numArr.length; i++) {
						value.push(numArr[i].id);
					}
					Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
					  done: () => {
						    apiForm(API_FOODING_DS,'/incotm/delete',{id:value},(response)=>{
						    	that.getPage();
						    	ServiceTips({text:response.message,type:'success'});

						    },(errors)=>{
						    	ServiceTips({text:errors.message,type:'error'});
						    });
						},
						close:() => {
						}
					});
				}else{
						ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'error'});
				}

		}


	onCancel(that){
		this.setState({
			rodalShow:false
		})
	}


	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
		let object=Object.assign({},{isPlatform:true, pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ES,'/staff/getPage',object,
				(response)=>{
					that.setState({
						data: response.data.data,
						totalPages: response.data.totalPages,
						totalRecords:response.data.totalRecords,
						currentPage: response.data.currentPage
					});
				},(errors)=>{
		});
	}
	handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }
	componentDidMount(){
		var that = this;
		this.getPage();
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}
	render(){
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader normalRef={no => this.normalRef = no} getPage ={this.getPage} expandFilter= {this.handleResize} info = {this.state.info}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}/>
						<Page
							currentPage={this.state.currentPage}
							totalRecords={this.state.totalRecords}
							totalPages={this.state.totalPages}
							sizeList={sizeList}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								this.setState({ pageSize: Number.parseInt(num) },()=>this.getPage(currentPage, num));
							}}
							backClick={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
							}}
							nextClick={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
							}}
							goChange={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
							}}
						/>
					</div>

						<Table ref="TermsOfTrade"
							columns={this.columns}
							data={this.state.data}
							checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
							colorFilterConfig={{show : false,dataIndex:'colorType'}}
							followConfig={{show:false}}
							scroll={{x:true,y:this.state.scroll}}
							onHeaderCellClick={this.onHeaderCellClick}
							onRowClick={this.onRowClick}
                              // onRowDoubleClick={this.onRowDoubleClick}
						/>
						<Dialog width={926}  visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
							<AttendanceResultsqueryPlug DialogContent={this.state.DialogContent}
								 checkedData = {this.state.checkedData}
								 info = {this.state.info}
								  showSaveAdd ={this.state.showSaveAdd}
								 showSaveClose={this.state.showSaveClose}
								 buttonLeft = {this.state.buttonLeft}
								 upload ={this.getPage}
								  onSaveAndClose ={this.onSaveAndClose}
								  contentDate = {this.state.contentDate}
								  onCancel = {this.onCancel}/>
						</Dialog>
					</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(AttendanceResultsquery);
