import i18n from './../../../lib/i18n';
import React ,{Component,PropTypes} from 'react';
import {createForm} from '../../../components/Form';
import {I18n} from '../../../lib/i18n';

import { browserHistory } from 'react-router';


class RetrieveSetupTwo extends Component{
	constructor(props){
		super(props)
		this.confirmLoginClick=this.confirmLoginClick.bind(this);
		this.state=this.initState()
	}
	initState(){
		return {

		}
	}
  	confirmLoginClick(){
  		browserHistory.push('/');
  	}
	render(){
		return(<div className={'retrievepassword-content-main-find'}>
				<h3 className={'title'}>{i18n.t(201031/*找回密码*/)}</h3>
				<div className={'setup step03'}>
					<span>{i18n.t(201032/*输入邮箱/怒吼账号*/)}</span>
					<span>{i18n.t(201033/*重置密码*/)}</span>
					<span>{i18n.t(201034/*完成*/)}</span>
				</div>
				<div className={'success-email success-reset'}>
					<i className={'foddingicon fooding-dui-icon2'}></i>
					<span>{i18n.t(600170/*恭喜你,重置密码成功！*/)}</span>
				</div>
		    	<div className={'validate-confirm'}>
					<button onClick={this.confirmLoginClick}>{i18n.t(200667/*登录*/)}</button>
				</div>
		</div>)
	}
}
export default RetrieveSetupTwo;
