import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
const {Table} = require("../../../components/Table");//Table表格
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import Confirm from '../../../components/Dialog/Confirm';
import Page from "../../../components/Page";//分页
import Plug from './Plug';
import Wanchen from './Wanchen'
import Dialog from '../../../components/Dialog/Dialog';//弹层
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_WORK} from '../../../services/apiCall';
import ServiceTips from "../../../components/ServiceTips";//提示框
import {I18n} from "../../../lib/i18n";
import {emitter} from '../../../common/EventEmitter';
import TaskDialog from './TaskDialog';
class ActiveTask extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.onCancel=this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.wcClick = this.wcClick.bind(this);
	}
	wcClick(){
		let that = this;
		this.onCancel();
		this.person();
		this.getRenwu();
	}
	handleClick(data){
		let that = this;
		this.setState({
			rodalShow:true,
			showHeader:true,
			width:600,
			DialogContent: <TaskDialog
				onSaveAndClose={that.wcClick}
				buttonLeft={i18n.t(200110/*完成任务*/)}
				onCancel={that.onCancel}
				taskId={data.id}
			/>,
			title:i18n.t(200099/*办理任务*/)
		})

        // var that = this;
        // let src = API_FOODING_WORK + "/service/form/form-view/default-form?taskId=" +data.id;
				//
        // let {navAddTab} = this.props;
        // navAddTab({name: i18n.t(200091/*任务处理*/), component: i18n.t(200091/*任务处理*/), url: '/third/activetask'});
        // this.props.router.push({pathname: '/third/activetask', query: {uri: encodeURIComponent(src)}});
	}
	viewClick(record){//查看流程&&查看任务
		var that = this;
		apiGet(API_FOODING_WORK,"/service/tasks/image/viewCurrent?taskId="+record.id,{},(response)=>{
  			this.setState({
				rodalShow : true,
				showHeader:true,
				DialogContent:	<Plug DialogContent={2}
					 checkedData = {{record:record}}
					 onSaveAndClose ={this.onSaveAndClose}
					 buttonLeft = {this.state.buttonLeft}
					 position = {response.data}
						pickupClick ={this.pickupClick}
						contentDate = {this.state.contentDate}
						onCancel = {this.onCancel}/>,
				showSaveClose:false,
				title:i18n.t(200093/*查看流程*/),
				checkedData:{record:record}
			})
  		},(error)=>{

	   })
  		
	}
	onSaveAndClose(value,data){//拾取任务的保存并关闭
		var that = this;
		value=Object.assign({},data,value);
    	apiPost(API_FOODING_WORK,"/service/runtime/tasks2/"+value.taskId,value,(response)=>{
    		that.setState({
					rodalShow:false
			})

    		ServiceTips({text:response.message,type:'success'});
    		this.person();
    		this.getRenwu();
    		},(error)=>{
				ServiceTips({text:error.message,type:'error'});
	        })
	}
	onCancel(that){  //拾取任务的取消
		this.setState({
			rodalShow:false
		})
	}
	//拾取任务
	pickupClick(record){
		this.setState({
				rodalShow : true,
				showHeader:false,
				DialogContent:	<Wanchen 
					 checkedData = {{record:record}}
					 onSaveAndClose ={this.onSaveAndClose}
					 buttonLeft = {this.state.buttonLeft}
					 position = {this.state.position}
						pickupClick ={this.pickupClick}
						contentDate = {this.state.contentDate}
						onCancel = {this.onCancel}/>,
				showSaveClose:true,
				checkedData:{record:record}
		})
	}
	initState(){
		let that = this;

		return{
			person_column:[{
				title : i18n.t(200094/*任务名称*/),
				dataIndex : 'name',
				key : "name",
				width : '14%',
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}
			},{
				title : i18n.t(200095/*业务编号*/),
				dataIndex : "no",
				key : "no",
				width : "18%",
				render(data,row,index){
					return data;
				}
			},{
				title : i18n.t(200096/*任务发起人*/),
				dataIndex : "starter",
				key : "starter",
				width : "12%",
				render(data,row,index){
					return data;
				}
			},{
				title : i18n.t(100145/*创建时间*/),
				dataIndex : "createTime",
				key : "createTime",
				width : "18%",
				render(data,row,index){
					return new Date(data).Format('yyyy-MM-dd hh:mm:ss');
				}
			},{
				title : i18n.t(200097/*办理员*/),
				dataIndex : "user",
				key : "user",
				width : "14%",
				render(data,row,index){
					return data;
				}
			},{
				title : i18n.t(200098/*操作*/),
				dataIndex:'operate-person',
				key : 'operate-person',
				width : "10%",
				render(data,row,index){
					return (<div className={'operate'}>

								{ permissionsBtn('tasks.handle') ? <span title={i18n.t(200099/*办理任务*/)} onClick={that.handleClick.bind(that,row)} className={'operate-span'}><i className={'foddingicon fooding-taskmgr'}></i></span> : '' }
								{ permissionsBtn('tasks.view') ? <span title={i18n.t(200093/*查看流程*/)} onClick={that.viewClick.bind(that,row)} className={'operate-span'}><i className={'foddingicon fooding-liucheng'}></i></span> : '' }

							</div>);
				}
			}],
			group_column:[{
				title : i18n.t(200094/*任务名称*/),
				dataIndex : 'name',
				key : "name",
				width : '14%',
				render(data,row,index){
					return (<div className="text-ellipsis" title={data}>{data}</div>);
				}
			},{
				title : i18n.t(200095/*业务编号*/),
				dataIndex : "no",
				key : "no",
				width : "18%",
				render(data,row,index){
					return data;
				}
			},{
				title : i18n.t(200096/*任务发起人*/),
				dataIndex : "starter",
				key : "starter",
				width : "12%",
				render(data,row,index){
					return data;
				}
			},{
				title : i18n.t(100145/*创建时间*/),
				dataIndex : "createTime",
				key : "createTime",
				width : "18%",
				render(data,row,index){
					return new Date(data).Format('yyyy-MM-dd hh:mm:ss');
				}
			},{
				title : i18n.t(200104/*候选人*/),
				dataIndex : "user",
				key : "user",
				width : "14%",
				render(data,row,index){
					return data;
				}

			},{
				title : i18n.t(200098/*操作*/),
				dataIndex:'operate-group',
				key : 'operate-group',
				width : "10%",
				render(data,row,index){
					return (<div className={'operate'}>

								{ permissionsBtn('tasks.pickup') ? <span title={i18n.t(200106/*领取*/)} onClick={that.pickupClick.bind(that,row)} className={'operate-span'}><i className={'foddingicon fooding-lingqu'}></i></span> : '' }
								{ permissionsBtn('tasks.view') ? <span title={i18n.t(200093/*查看流程*/)} onClick={that.viewClick.bind(that,row)} className={'operate-span'}><i className={'foddingicon fooding-liucheng'}></i></span> : '' }

							</div>);
				}
			}],
			person_data:[],
			group_data:[],
			rodalShow:false,
			position :{},
			showSaveClose:true
		}
		this.getRenwu = this.getRenwu.bind(this);
		this.person = this.person.bind(this);
		this.sortClick = this.sortClick.bind(this);
	}
    sortClick(order){
		let that = this;
		if(order.column == 'no'){
            var compare = function (obj1, obj2) {
                var val1 = obj1.no;
                var val2 = obj2.no;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            };
            var orderby = function (obj1, obj2) {
                var val1 = obj1.no;
                var val2 = obj2.no;
                if (val1 > val2) {
                    return -1;
                } else if (val1 < val2) {
                    return 1;
                } else {
                    return 0;
                }
            };
            let person_data =[];
            if(order.order == 'desc'){
                person_data = this.state.person_data.sort(compare);
			}else{
                person_data = this.state.person_data.sort(orderby);
			}
            this.setState({
                person_data:person_data
            });
		}else {
			return false;
		}
	}
	handleResize(height){
		let sch=document.body.offsetHeight-70-height;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
		console.log(scroll);
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(0));
		this.getRenwu();
		this.person();
        emitter.on("ActiveTaskListGetPage", () => {
            this.person();
        });
    };

    getRenwu(){
    	var that = this;
    	apiGet(API_FOODING_WORK,"/service/tasks/getGroupTasks",{},

			(response)=>{
				let person_data=[];
				let group_data=[];
				let data = response || [];
				for (var i=0;i<data.length;i++) {
							// if(data[i].assigned==true){
							// 	person_data.push(data[i]);
							// }else{
								group_data.push(data[i]);

				}
				that.setState({
					//person_data:person_data,
					group_data:group_data
				})
			},(error)=>{

		});
    }
    person(){
    	var that = this;

    	apiGet(API_FOODING_WORK,"/service/tasks/getPersonalTasks",{},

    	(response)=>{

    	       let person_data=[];
    	       let data = response || [];
    	       for (var i=0;i<data.length;i++) {
							// if(data[i].assigned==true){
							// 	person_data.push(data[i]);
							// }else{
								person_data.push(data[i]);

				}
    			that.setState({
    				person_data:person_data
    			})
    	},(error)=>{

		});
    }
	componentWillUnmount() {
        emitter.off('ActiveTaskListGetPage');
		window.removeEventListener('resize', this.handleResize(0));
	}
	render(){
		let that = this;
		const {person_column,group_column,person_data,group_data} = this.state;
		return(<div className={'active-task'} style={{height:this.state.scrollHeight}}>
			<div className={'active-task-person'}>
				<div className={'active-task-person-title'}>
					<span className={'task-title-left'}>{i18n.t(200108/*个人任务列表*/)}</span>

				</div>
				<Table
					columns={person_column}
					data={person_data}
					onHeaderSortClick={this.sortClick.bind(this)}
					checkboxConfig={{show:false}}
					colorFilterConfig={{show : false}}
					followConfig={{show:false}}
					scroll={{x:true,y:200}}
				/>
			</div>
			<div className={'active-task-group'}>
				<div className={'active-task-group-title'}>
					<span className={'task-title-left'}>{i18n.t(200109/*组任务列表*/)}</span>

				</div>
				<Table
					columns={group_column}
					data={group_data}
					checkboxConfig={{show:false}}
					colorFilterConfig={{show : false}}
					followConfig={{show:false}}
					scroll={{x:true,y:200}}
				/>
				<Dialog width={926} visible={this.state.rodalShow} title={this.state.title}>
						{that.state.DialogContent}
				</Dialog>
			</div>

		</div>)
	}
}
export default NavConnect(ActiveTask);
