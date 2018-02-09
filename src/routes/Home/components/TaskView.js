import i18n from './../../../lib/i18n';
/***任务模块**/
import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, hashHistory, Link, withRouter} from 'react-router';
import TabsCommon from './TabsCommon'
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_WORK} from '../../../services/apiCall';
const {Table} = require("../../../components/Table");//Table表格
import Dialog from '../../../components/Dialog/Dialog';//弹层
import ServiceTips from "../../../components/ServiceTips";//提示框
import Wanchen from '../../ActiveTask/components/Wanchen';
import TaskDialog from '../../ActiveTask/components/TaskDialog';
import Location from '../../../components/location/Container';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import {emitter} from '../../../common/EventEmitter';
class TaskComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.initState();
    }
    initState() {
        let that = this;
        return {
            person_column: [{
                title: i18n.t(200094/*任务名称*/),
                dataIndex: 'name',
                key: "name",
                width: '14%',
                render(data, row, index) {
                    return (<div className="text-ellipsis" title={data}>{data}</div>);
                }
            }, {
                title: i18n.t(200095/*业务编号*/),
                dataIndex: "no",
                key: "no",
                width: "18%",
                render(data, row, index) {
                    return data;
                }
            }, {
                title: i18n.t(200096/*任务发起人*/),
                dataIndex: "starter",
                key: "starter",
                width: "12%",
                render(data, row, index) {
                    return data;
                }
            }, {
                title: i18n.t(200098/*操作*/),
                dataIndex: 'operate-person',
                key: 'operate-person',
                width: "10%",
                render(data, row, index) {
                    return (<div className={'operate'}>
                        <span title={i18n.t(200099/*办理任务*/)} onClick={that.props.handleClick.bind(that, row)} className={'operate-span'}><i
                            className={'foddingicon fooding-taskmgr'}></i></span>

                    </div>);
                }
            }],
            group_column: [{
                title: i18n.t(200094/*任务名称*/),
                dataIndex: 'name',
                key: "name",
                width: '15%',
                render(data, row, index) {
                    return (<div className="text-ellipsis" title={data}>{data}</div>);
                }
            }, {
                title: i18n.t(200095/*业务编号*/),
                dataIndex: "no",
                key: "no",
                width: "18%",
                render(data, row, index) {
                    return data;
                }
            }, {
                title: i18n.t(200096/*任务发起人*/),
                dataIndex: "starter",
                key: "starter",
                width: "12%",
                render(data, row, index) {
                    return data;
                }
            }, {
                title: i18n.t(200098/*操作*/),
                dataIndex: 'operate-group',
                key: 'operate-group',
                width: "10%",
                render(data, row, index) {
                    return (<div className={'operate'}>

                        <span title={i18n.t(200640/*拾取任务*/)} onClick={that.props.pickupClick.bind(that, row)} className={'operate-span'}><i
                            className={'foddingicon fooding-taskmgr'}></i></span>
                    </div>);
                }
            }],
            person_data: [],
            group_data: [],
            start: 0,
            position: {},
            isrepose: false
        }
    }
    // handleClick(data) {
    //     var that = this;
    //     let src = API_FOODING_WORK + "/service/form/form-view/default-form?taskId=" + data.id;
    //
    //     let {navAddTab} = this.props;
    //     navAddTab({name: i18n.t(200091/*任务处理*/), component: i18n.t(200091/*任务处理*/), url: '/third/activetask'});
    //     this.props.router.push({pathname: '/third/activetask', query: {uri: encodeURIComponent(src)}});
    // }
    componentWillReceiveProps() {
    }

    render() {
        const start = this.state.start;
        const {person_column, group_column} = this.state;
        const {person_data, group_data} = this.props;
        let that = this;
        let common1 = <div></div>;
        if (this.props.id == start + 1) {
            common1 = (<div className='box i-news'>
                <div className={'active-task-group'} id={start}>
                    <Table
                        columns={group_column}
                        data={group_data}
                        checkboxConfig={{show: false}}
                        colorFilterConfig={{show: false}}
                        followConfig={{show: false}}
                        scroll={{x: true, y: 200}}
                    />
                </div>
            </div>);
        } else {
            common1 = (<div className='box i-news'>
                <div className={'active-task-person'} id={start + 1}>
                    <Table
                        columns={person_column}
                        data={person_data}
                        checkboxConfig={{show: false}}
                        colorFilterConfig={{show: false}}
                        followConfig={{show: false}}
                        scroll={{x: true, y: 200}}
                    />
                </div>

            </div>);
        }

        return (<div>
                {common1}
            </div>
        );
    }
}

const Task = NavConnect(Location(withRouter(TaskComp)));

export class TaskView extends Component {
    constructor(props) {
        super(props);
        this.onCancel = this.onCancel.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.pickupClick = this.pickupClick.bind(this);
        this.state = {
            start: 0,
            isrepose: false,
            group_data: [],
            person_data: [],
            rodalShow: false,
            width:400
        }
        this.getRenwu = this.getRenwu.bind(this);
        this.person = this.person.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.wcClick = this.wcClick.bind(this);
    }
    //拾取任务
    handleClick(data){
        this.props.handleClick && this.props.handleClick(data);
    }
    wcClick(){
      let that = this;
      this.onCancel();
      this.getRenwu();
      this.person();
    }

    getRenwu() {
        var that = this;
        apiGet(API_FOODING_WORK, "/service/tasks/getGroupTasks", {},(response)=>{
                let person_data=[];
                let group_data=[];
                let data = response || [];
                for (var i=0;i<data.length;i++) {
                            group_data.push(data[i]);

                }
                that.setState({
                   group_data:group_data
                })
            },(error)=>{

        });
    }

    person(){
        var that = this;
        apiGet(API_FOODING_WORK,"/service/tasks/getPersonalTasks",{},(response)=>{
           let person_data=[];
           let data = response || [];
           for (var i=0;i<data.length;i++) {
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
    }

    componentDidMount() {
        emitter.on("ActiveTaskListGetPage", () => {

            this.person();
        });
        if (!this.state.isrepose) {
           this.getRenwu();
           this.person();
        }
    }

    onSaveAndClose(value, data) {//拾取任务的保存并关闭
        var that = this;
        value = Object.assign({}, data, value);
        apiPost(API_FOODING_WORK, "/service/runtime/tasks2/" + value.taskId, value, (response) => {
            that.props.onCancel && this.props.onCancel(); //关闭弹窗
            ServiceTips({text: response.message, type: 'success'});
            this.getRenwu();
             this.person();
        }, (error) => {
            ServiceTips({text: error.message, type: 'error'});
        })
    }

    onCancel(that) {  //拾取任务的取消
        this.setState({
            rodalShow: false
        })
    }

    //拾取任务
    pickupClick(record) {
        this.props.pickupClick && this.props.pickupClick(record);
    }

    onMore = () => {
        window.navTabs.open(i18n.t(500277/*任务*/), '/activetask');

        // let {navAddTab} = this.props;
        // navAddTab({name: i18n.t(500277/*任务*/), component: i18n.t(500277/*任务*/), url: '/activetask'});
        // this.props.router.push({pathname: '/activetask', state: {refresh: true}});
    };
    //onRefresh 拖拽单个模块刷新
    onRefresh = () => {
        emitter.on("ActiveTaskListGetPage", () => {

            this.person();
        });
        if (!this.state.isrepose) {
            this.getRenwu();
            this.person();
        }
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

    render() {
        const start = this.state.start;
        let that = this;
        let tabs = [{title: i18n.t(200641/*个人任务*/), content: <Task id={start}
          person_data={this.state.person_data}
           handleClick={this.handleClick} />},
            {title: i18n.t(200642/*组任务*/), content: <Task id={start + 1}
              group_data={this.state.group_data}
              handleClick={this.handleClick}
              pickupClick={this.pickupClick} />
            }];
        return (
            <div className="dragesingle" >
                <div className={"dragetitle"}>
                    <span className={"drageshow"}>{i18n.t(500277/*任务*/)}</span>
                    <span className="dragehandle"></span>
                    <span className={"dragemore"} onClick={this.onMore}>{i18n.t(200634/*更多*/)} &gt;</span>
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
                    <TabsCommon tabs={tabs}/>
                </div>
                <Dialog width={this.state.width} visible={this.state.rodalShow} title={this.state.title}>
                    {that.state.DialogContent}
                </Dialog>
            </div>
        )
    }

};

export default TaskView;
