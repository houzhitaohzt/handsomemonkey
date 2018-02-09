import i18n from './../../../lib/i18n';
import React ,{Component,PropTypes} from 'react';
import { browserHistory } from 'react-router';//跳转

class RetrieveHead extends Component{
	constructor(props){
		super(props)
		this.LoginClick=this.LoginClick.bind(this);
		this.registerClick=this.registerClick.bind(this);
	}
	LoginClick(){
		browserHistory.push('/user/Login');
	}
	registerClick(){
		browserHistory.push('/user/register');
	}
	render(){
		return(<div className={'retrievepassword-head'}>
				<span className={'nooh'}>Noohle</span>
				<span className={'login-in'} onClick={this.LoginClick}>{i18n.t(200667/*登录*/)}</span>
				<span className={'sign-in'} onClick={this.registerClick}>{i18n.t(201029/*注册*/)}</span>					
		</div>)
	}
}
export default RetrieveHead;
