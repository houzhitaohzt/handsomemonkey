import React ,{Component,PropTypes} from 'react';

import RegisterMain from "./RegisterMain";//注册主页面
import RegisterSuccess from "./RegisterSuccess";//注册成功
import RegisterFail from "./RegisterFail";//注册失败

import RegisterDetails from "./RegisterDetails";// 注册成功-完善信息



import {getQueryString,apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import i18n from '../../../lib/i18n';



class Register extends Component{
	constructor(props){
		super(props);
		this.getPage=this.getPage.bind(this);

		// init state 
		this.state = {
			HTML:1, // 页面切换
			getOneData:'', // 详细信息  getOne
		};
	}


	getPage(option={}){

		switch(option['toggle']){
			case 2 :	// 注册 成功	
				this.setState({ HTML:2, getOneData:option['data'] });
			break;
			default:
		}
	}
	render(){

		let {HTML,getOneData} = this.state;

		// 判断 页面
		switch(HTML){
			case 2 :	// 注册 成功	
				var Page = <RegisterSuccess getOneData={getOneData} />;
			break;
			default:
				var Page = <RegisterMain getPage={this.getPage} />;
		}

		console.log();
		return(
			<div>
				{ getQueryString('token') ? 
					<RegisterDetails />	
					:
					Page
				}
			</div>
		);
	}
}
export default Register;
