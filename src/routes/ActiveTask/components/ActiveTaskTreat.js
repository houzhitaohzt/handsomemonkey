import i18n from './../../../lib/i18n';
import React, {Component} from 'react';
import WebData from '../../../common/WebData';
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_WORK} from '../../../services/apiCall';

export class ActiveTaskTreat extends Component {

    constructor (porps){
        super(porps);
        this.state = {
            taskId: this.props.location.query.taskId,
            activeTaskHtml: null,
        };
    }

    _loadPages = async () => {
        try{
            let url = "http://192.168.1.75/activiti-explorer/service/form/form-view/default-form?taskId=" + this.state.taskId;
            let response = await window.fetch(url, {headers: {'x-auth-token': WebData.token}});
            let activeTaskHtml = await response.text();
            this.setState({activeTaskHtml});
        } catch (e){
            window.Tip.errorTips('请求数据失败!');
        }
    };

    _onComment = async (message)=>{
        let taskId = this.state.taskId;
        let params = {
            message: message.trim(),
            saveProcessInstanceId:true
        };
        try{
            let url = `${API_FOODING_WORK}/service/runtime/tasks/${taskId}/comments`;
            let response = await window.fetch(url,
                    {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                            'x-auth-token': WebData.token
                        },
                        body: JSON.stringify(params)
                    }
                );
            let jsonRep = await response.json();
            this._onTaskSubmit(2);
        } catch (e){
            window.Tip.errorTips('任务无法完成!');
        }
    };

    _onTaskSubmit = async (pass)=>{
        let taskId = this.state.taskId;
        let params = {
            action:"complete",
            assignee:"69",
            variables:[
                {name: "pass", value: pass},
                {name: "url", value: ""}
            ]
        };
        try{
            let url = `${API_FOODING_WORK}/service/runtime/tasks/${taskId}`;
            let response = await window.fetch(url,
                {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'x-auth-token': WebData.token
                    },
                    body: JSON.stringify(params)
                }
            );
            let jsonRep = await response.text();

            setTimeout(()=>{
                window.Tip.successTips(i18n.t(200110/*完成任务*/));
                window.emitter.emit('ActiveTaskListGetPage');
                window.navTabs.close();//关闭当前页签
            }, 500);
        } catch (e){
            window.Tip.errorTips('任务无法完成!');
        }
    };

    _onSubmit = (event, target)=>{
        event.stopPropagation();
        event.preventDefault();
        let form = new FormData(this._formRef);
        let pass = parseInt(form.get('pass'));
        if(pass === 1){
            this._onTaskSubmit(1);
        } else if(pass === 2){
            let message = form.get('message');
            if(message && message.trim() !== ''){
                this._onComment(message);
            } else {
                window.Tip.errorTips("请添加审批不同意的批准内容!");
            }
        } else {
            window.Tip.errorTips('请选择审批结果!');
        }
    };

    componentDidMount() {
        this._loadPages();
    }

    render (){
        return (
            <div>
                <main className="container-fluid" >
                    <div className="panel panel-warning">
                        <div className="panel-body">
                            {
                                this.state.activeTaskHtml?
                                    <form className="form-horizontal" onSubmit={this._onSubmit} ref={rf => this._formRef = rf}>
                                        <div dangerouslySetInnerHTML={{__html: this.state.activeTaskHtml}}/>
                                        <br/>
                                        <div className="form-group">
                                            <label className="col-sm-4 control-label">批注内容:</label>
                                            <div className="col-sm-8">
                                                <textarea className="form-control" name="message" cols={5} rows={5}/>
                                            </div>
                                        </div>
                                        <br/>
                                        <div className="form-group">
                                            <div className="col-sm-offset-4 col-sm-12">
                                                <button type="submit" className="btn btn-primary">{i18n.t(200110/*完成任务*/)}</button>
                                            </div>
                                        </div>
                                    </form>: null
                            }
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default (store) => ({
    path : 'activetask/view',
    getComponent (nextState, cb) {
        require.ensure([], (require) => {
            cb(null, ActiveTaskTreat);
        }, 'IFrame')
    }
});