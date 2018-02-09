import React ,{Component,PropTypes} from 'react';
import i18n from '../../../lib/i18n';
import Select, { Option } from 'rc-select';
import Checkbox from '../../../components/CheckBox';
import Dialog from '../../../components/Dialog/Dialog'

import RegisterFooter from "../../RetrievePassword/components/RetrieveFooter";
import LanguageMore from "../../Login/components/LanguageMore";
// ajax
import {createForm,FormWrapper} from '../../../components/Form';


import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';

import "./index.less";


class RegisterMain extends Component{
	constructor(props){
		super(props)
		this.onLanguageChange=this.onLanguageChange.bind(this);
		this.onChangeCheck=this.onChangeCheck.bind(this);
		this.registerClick=this.registerClick.bind(this);
		this.serviceClick=this.serviceClick.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.state = this.initState()
	}
	initState(){
		return{
			scrollHeight:0,
			scroll:0,
			isLoginClick:true,
			showDilaog:false,
			countryList:[],
			languageList:[]
		}
	}
	handleResize(height){
		let sch=document.body.offsetHeight-100-height;
        let scroll = sch-100;
		this.setState({scrollHeight:sch+'px',scroll:scroll+'px'});
	}
	onLanguageChange(){//语言

	}
	onChangeCheck(e){//接受和拒绝checkbox
		let isLogin;
		if(e.target.checked){
			isLogin=true;
		}else{
			isLogin=false;
		}
		this.setState({
			isLoginClick:isLogin
		})
	}

	//注册
	registerClick(){

		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){
				//ServiceTips({text:'带‘*’号必填！',type:'info'});
			}else{

				// 验证 用户
				apiGet(API_FOODING_ES,'/fc/register/checkInfo',value,
					(response)=>{
						ajax();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
					}
				);

				// 注册账号
				function ajax(){
					apiPost(API_FOODING_ES,'/fc/register/create',Object.assign(value,{url:'/user/register' }),
						(response)=>{
							// ServiceTips({text:response.message,type:'success'});
							that.props.getPage({
								toggle:2,
								data:response.data
							});
						},(errors)=>{
							ServiceTips({text:errors.message,type:'error'});
						}
					);
				}
			}
		});
	}
	serviceClick(){//阅读服务条款
		let content=require('./ServiceHttp.js').default;
		let element=React.createElement(content,{onCancel:this.onCancel})
    	this.setState({
    		showDilaog : true,
    		dialogContent: element
    	})
	}
	onCancel(){
		this.setState({
    		showDilaog : false
    	})
	}
	componentDidMount(){
		var that = this;
		window.addEventListener('resize', this.handleResize(0));
		apiGet(API_FOODING_ES,'/fc/register/getCountrys',{},(response)=>{
				that.setState({
					countryList:response.data
				});
		},(errors)=>{
			ServiceTips({text:errors.message,type:'error'});
		})
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(0));
	}
	render(){
		const {isLoginClick} = this.state;
		const { getFieldProps, getFieldError } = this.props.form;
		return(<div className={'register'}>
				<div className={'register-content'} style={{height:this.state.scrollHeight}}>
					<div className={'register-content-single'}>
						<LanguageMore onLanguageChange={this.onLanguageChange} styleObj={{float: 'right'}}/>
						<a href={window.location.origin}><h1 className='register-content-single-title'>Noohle</h1></a>
						<p className={'register-content-single-second-title'}>{i18n.t(600143/*注册账号*/)}</p>
						<div className={'register-content-single-input'}>
							<span className={'must'} style={{color:'#990000'}}>*</span>
							<Select
								animation='slide-up'
								placeholder={i18n.t(600144/*请选择所在国家*/)}
								className ={getFieldError("countryId")?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								optionLabelProp="children"
								optionFilterProp="children"
								{...getFieldProps('countryId',{
									rules: [{required:true,}],
									initialValue:undefined
								})}
								style={{width:320}}
								>
								{
									this.state.countryList.map((value,i)=>{
										return <Option value={value.id} title={value.localName} key={i}>{value.localName}</Option>
									})
								}
							</Select>
						</div>
						<div className={'register-content-single-input'}>
							<span className={'must'} style={{color:'#990000'}}>*</span>
							<input type='text' 
								 placeholder={i18n.t(600145/*请输入企业名称*/)}
								{...getFieldProps('enterpriseName',{
										rules: [{required:true}],
										initialValue:''
								})}
								className ={getFieldError("enterpriseName")?'error-border':''}
							 />
						</div>
						<div className={'register-content-single-input'}>
							<span className={'must'} style={{color:'#990000'}}>*</span>
							<input type='text' name="address" placeholder={i18n.t(600146/*请输入企业邮箱地址*/)}
								{...getFieldProps('enterpriseEmail',{
										rules: [{pattern:(/^(.)+@(.)+$/g),required:true}],
										initialValue:''
								})}
								className ={getFieldError("enterpriseEmail")?'error-border':''}
							/>
						</div>						
						<div className={'register-content-single-input'}>
							<span className={'must'}></span>
							<input type='text' name="tax" placeholder={i18n.t(600159/*请输入企业税号*/)}
								{...getFieldProps('enterpriseTaxId',{
										//rules: [{required:true,}],
										initialValue:''
								})}
								className ={getFieldError("enterpriseTaxId")?'error-border':''}
							/>
						</div>
						<div className={'register-content-single-input'}>
							<span className={'must'}></span>
							<input type='text' name="net" placeholder={i18n.t(600147/*请输入企业网址*/)} 
								{...getFieldProps('enterpriseWeb',{
										//rules: [{required:true,}],
										initialValue:''
								})}
								className ={getFieldError("enterpriseWeb")?'error-border':''}
							/>
						</div>						
						<div className={'register-content-single-sign'}>
							<button disabled={!isLoginClick} onClick={this.registerClick} className={isLoginClick?'active':''}>{i18n.t(201029/*注册*/)}</button>
						</div>

						{/*<div className={'register-content-single-secrecy'}>
							<Checkbox
							    className='check-class'
								name="my-checkbox"
								onChange={this.onChangeCheck}
								defaultChecked={true}
   							/>
							<span className={'acciet'}>{i18n.t(600148*//*我已阅读并接受*//*)}</span>
							<span className={'screat'} onClick={this.serviceClick}>{i18n.t(200670*//*服务条款*//*)}&nbsp;&nbsp;{i18n.t(600149*//*保密协议*//*)}</span>
						</div>*/}
					</div>
				</div>
				<RegisterFooter footerClassName={'register-foot'} />
				<Dialog showHeader={false} width={'100%'} visible={this.state.showDilaog} >
					{this.state.dialogContent}
				</Dialog>
		</div>)
	}
}
export default createForm()(RegisterMain);
