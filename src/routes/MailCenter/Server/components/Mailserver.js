import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import {apiGet, apiPost, apiForm, API_FOODING_MAIL_SERVER, API_FOODING_ES, API_FOODING_DS, API_FOODING_MAIL} from '../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
class Mailserver extends Component {
    constructor(props) {
        super(props);
        this.getPage = this.getPage.bind(this);

        // this state
        this.state = {
            scrollHeight: 0,
            getOneData:{},
        }

    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize(0));
        this.getPage();           
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));      
    }

    handleResize(height) {
        let sch = document.body.offsetHeight - 162 - 68 - height;
        let scroll = sch - 80;
        this.setState({scrollHeight: sch + 'px', scroll: scroll});
        console.log(scroll);
    }  

    // 初始化 
    getPage() {
        let that = this;
		apiGet(API_FOODING_MAIL_SERVER,'/monitor/getServerState',{},
			(response)=>{
                that.setState({ getOneData: response['data'] });   
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
    }

    // 即时发送 启用 
    rightNOhandle = ()=>{
        let that = this;
		apiPost(API_FOODING_MAIL_SERVER,'/monitor/startSender',{},
			(response)=>{
                ServiceTips({text:response.message,type:'success'});
                that.getPage();   
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
    }

    // 即时发送 停止 
    rightOFFhandle = ()=>{
        let that = this;
		apiPost(API_FOODING_MAIL_SERVER,'/monitor/stopSender',{},
			(response)=>{
                ServiceTips({text:response.message,type:'success'});
                that.getPage();   
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});        
    }

    // 定时发送 启用 
    timingNOhandle = ()=>{
        let that = this;
		apiPost(API_FOODING_MAIL_SERVER,'/monitor/startRegular',{},
			(response)=>{
                ServiceTips({text:response.message,type:'success'});
                that.getPage();   
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
    }

    // 定时发送 停止 
    timingOFFhandle = ()=>{
        let that = this;
		apiPost(API_FOODING_MAIL_SERVER,'/monitor/stopRegular',{},
			(response)=>{
                ServiceTips({text:response.message,type:'success'});
                that.getPage();   
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});        
    }

    // 邮件群发 启用 
    mailNOhandle = ()=>{
        let that = this;
		// apiPost(API_FOODING_MAIL_SERVER,'/monitor/startMerge',{},
		// 	(response)=>{
        //         ServiceTips({text:response.message,type:'success'});
        //         that.getPage();   
		// 	},(errors)=>{
		// 		ServiceTips({text:errors.message,type:'error'});
		// });
    }

    // 邮件群发 停止 
    mailOFFhandle = ()=>{
        let that = this;
		apiPost(API_FOODING_MAIL_SERVER,'/monitor/stopMerge',{},
			(response)=>{
                ServiceTips({text:response.message,type:'success'});
                that.getPage();   
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});        
    }
  

    render() {
        let {getOneData} = this.state;
        return (<div className={'addnormal'} style={{marginBottom:'10px',background:'#fff'}}>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>                    
					<div className={'  girdlayout'}>
                        <div className={'row'}>
                            <div className="col-md-offset-3 col-md-6">
                                { getOneData['isRunningSender'] ?
                                    <h2 className="col-md-3">{i18n.t(600154/*即时发送*/)}：<span className="label label-info">{i18n.t(100453/*启用*/)}</span></h2>
                                    :
                                    <h2 className="col-md-3">{i18n.t(600154/*即时发送*/)}：<span className="label label-danger">{i18n.t(200682/*停止*/)}</span></h2>                                    
                                }
                                <span className="label label-warning">{i18n.t(600155/*单次发送数量*/)}：{getOneData['limit']}</span>
                                <span className="col-md-offset-1 label label-warning">{i18n.t(600156/*单线程发送量*/)}：{getOneData['oneSize']}</span>                                
                            </div>                           
                            <div className="col-md-1">
                                { !getOneData['isRunningSender'] ?
                                    <button onClick={this.rightNOhandle} type="button" className="btn btn-success btn-sm">{i18n.t(100453/*启用*/)}</button>                                    
                                    :
                                    <button onClick={this.rightOFFhandle} type="button" className="btn btn-danger btn-sm">{i18n.t(200682/*停止*/)}</button>
                                }                                 
                            </div>

                        </div>
                        <br/>
                        <div className={'row'}>
                            <div className="col-md-offset-3 col-md-6">
                                { getOneData['isRunningRegular'] ?
                                    <h2 className="col-md-3">{i18n.t(600157/*定时发送*/)}：<span className="label label-info">{i18n.t(100453/*启用*/)}</span></h2>
                                    :
                                    <h2 className="col-md-3">{i18n.t(600157/*定时发送*/)}：<span className="label label-danger">{i18n.t(200682/*停止*/)}</span></h2>                                    
                                }                                
                            </div>
                            <div className="col-md-1">
                                { !getOneData['isRunningRegular'] ?
                                    <button onClick={this.timingNOhandle} type="button" className="btn btn-success btn-sm">{i18n.t(100453/*启用*/)}</button>                                    
                                    :
                                    <button onClick={this.timingOFFhandle} type="button" className="btn btn-danger btn-sm">{i18n.t(200682/*停止*/)}</button>
                                }                                
                            </div>
                        </div> 
                        <br/>   
                        <div className={'row'}>
                            <div className="col-md-offset-3 col-md-6">
                                { getOneData['isRunningMerge'] ?
                                    <h2 className="col-md-3">{i18n.t(200677/*邮件群发*/)}：<span className="label label-info">{i18n.t(100453/*启用*/)}</span></h2>
                                    :
                                    <h2 className="col-md-3">{i18n.t(200677/*邮件群发*/)}：<span className="label label-danger">{i18n.t(200682/*停止*/)}</span></h2>                                    
                                }                                
                            </div>
                            <div className="col-md-1">
                                { !getOneData['isRunningMerge'] ?
                                    <button onClick={this.mailNOhandle} type="button" className="btn btn-success btn-sm">{i18n.t(100453/*启用*/)}</button>                                    
                                    :
                                    <button onClick={this.mailOFFhandle} type="button" className="btn btn-danger btn-sm">{i18n.t(200682/*停止*/)}</button>
                                }                                 
                            </div>
                        </div>   
                        <br/>
                        <br/>
                        <br/>                                                                                                               
                    </div> 
                </div>)
    }
}
export default Mailserver;
