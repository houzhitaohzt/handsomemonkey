import React, { Component } from 'react';
import Tooltip from '../Tip';
import i18n from '../../lib/i18n';
import { Router, Route, IndexRoute, hashHistory ,Link, browserHistory} from 'react-router';
import Dialog  from '../Dialog';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS} from '../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../components/ServiceTips";//提示框
import WebData from '../../common/WebData';

export class Tip1 extends Component{
	constructor(props){
		super(props);
		this.onClickLoginOut=this.onClickLoginOut.bind(this);
		this.presonClick=this.presonClick.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.resetPassWord = this.resetPassWord.bind(this);
		this.state={
			showDilaog:false
		}
	}
	resetPassWord(){
		let content =require('./ResetPassWord').default;
		let element=React.createElement(content,{onCancel:this.onCancel});
    	this.setState({
    		showDilaog : true,
    		title:i18n.t(300059/*个人信息*/),
    		dialogContent : element
    	})
	}
	onClickLoginOut(){
		var that = this;
		//退出操作要保存下面
        this.props.saveInfo();
		apiGet(API_FOODING_ES, '/logout', {},
            response => {
                browserHistory.push('/user/login');
                WebData.logout();
            }, error => {
                browserHistory.push('/user/login');
                WebData.logout();
            })
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}
	presonClick(){
		let content =require('./PersonInformationDialog').default;
		let element=React.createElement(content,{onCancel:this.onCancel});
    	this.setState({
    		showDilaog : true,
    		title:i18n.t(300059/*个人信息*/),
    		dialogContent : element
    	})
	}
	render(){
		let {class1,class2,num} = this.props;
		let Tip1Components ;
		let content;

		if(num == 1){
			Tip1Components = <div className = "tip1">
			<Link><i className ="foddingicon fooding-activity"></i>活&nbsp;动</Link>
			<Link><i className ="foddingicon fooding-task"></i>任&nbsp;务</Link>
			<Link><i className ="foddingicon fooding-mail"></i>邮&nbsp;件</Link>
			<Link><i className ="foddingicon fooding-notice"></i>公&nbsp;告</Link>
			</div>;
			 content = <Tooltip
		        placement={class2}
		        overlay={Tip1Components}
		        arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
		      >
		       <i className ={class1}></i>
		      </Tooltip>

		}else if(num == 2){
			 content = <i className ={class1}/>
		}else if(num == 3){
			// console.log(WebData.user)
			Tip1Components = <div className = "tip2">
				<div className='left_tip'>
					<div className='conten'>
						<i></i>
						<span style={{color:'#333'}}>{WebData.user?WebData.user.data.staff.localName:''}</span>
						<p>{WebData.user?WebData.user.data.staff.cluster.localName:''}</p>
						<p>{WebData.user&&WebData.user.data.staff.positn?WebData.user.data.staff.positn.localName:''}</p>
					</div>
				</div>
				<div className='right_tip'>
					<ul>
						<li onClick={this.presonClick}><i className='foddingicon fooding-information2'></i><span>{i18n.t(300059/*个人信息*/)}</span></li>
						<li onClick={this.resetPassWord}><i className ='foddingicon fooding-change-password'></i><span>{i18n.t(300060/*修改密码*/)}</span></li>
						<li onClick={this.onClickLoginOut}><i className='foddingicon fooding-Sign-out'></i><span>{i18n.t(300061/*退出登录*/)}</span></li>
					</ul>
				</div>
			</div>;
			content = <Tooltip
		        placement={class2}
		        overlay={Tip1Components}
		        prefixCls ={'user rc-tooltip'}
		        arrowContent={<div></div>}
		      >
		       <i className ={class1}></i>
		      </Tooltip>;
		}
		return (
			<div>
			 	{content}
			 	<Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
						{this.state.dialogContent}
				</Dialog>
		    </div>
		);
	}
};
export default Tip1;
