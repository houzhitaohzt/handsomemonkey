import i18n from './../../../lib/i18n';
import React, {Component} from "react";
import {createForm} from "rc-form";
import {I18n} from "../../../lib/i18n";
import { Router, Route, IndexRoute, hashHistory ,Link, browserHistory} from 'react-router';
import LanguageMore from "./LanguageMore";
import Slider from "../../../components/Slider";
import Input from "../../../components/FormValidating/FormValidating";
import DevModel from "./DevModel";
import {login as userLogin} from "../../../services/authorize/authorize";
import WebData from "../../../common/WebData";
import * as RSA from "../../../common/RSA";
import xt from '../../../common/xt';
import {API_FOODING_ES,API_FOODING_DS, apiGet} from "../../../services/apiCall";
import NavConnect from "../../../components/NavigateTabs/containers/AddContainer";
//引入提示
import Tooltip from "antd/lib/tooltip";

import "../assets/_newadvicelogin.less";
import HeaderIndex from "./HeaderIndex";
import NoImg from "../assets/no_img.png";
import DefaultImg from "../assets/default.png"

export class Login extends Component{
	constructor(props) {
		super(props);
		this.nameChange=this.nameChange.bind(this);
		this.passwordChange=this.passwordChange.bind(this);
		this.closeValueClick=this.closeValueClick.bind(this);
		this.onPreviewClick=this.onPreviewClick.bind(this);
		this.switchClick=this.switchClick.bind(this);
		this.onEntryStytem=this.onEntryStytem.bind(this);
		this.onLoginOut=this.onLoginOut.bind(this);
		this.state=this.initState();
		this.passwordV = this.props.password;
		this.nameV  = this.props.name;
	}
	initState(){
		return{
			scrollHeight:0,
			passwordValue:'',
			namecloseShow:false,
			passwordcloseShow:false,
			passwordType:'password',
            rememberPwd: false,
			switchClass:'switch-off',
			switchValue:'OFF',
			errormessage:'',
			hotSalePro:[], //热销产品
			hotCategries:[] //热销分类

		}
	}
	submit(){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				let params = this.props.form.getFieldsValue();
				apiGet(API_FOODING_ES, '/fc/getExAndModForPublicKey', {}, ({data}) => {
            	RSA.setMaxDigits(130);
               		let rsaKeys= new RSA.RSAKeyPair(data.exponent, '', data.modulus);
               		let password = RSA.encryptedString(rsaKeys,value['password']);
                    let lang = i18n.getLang();
                    switch(lang){
                        case 'zh-cn':
                            lang = 'zh_CN';break;
                        case 'zh-tw':
                            lang = 'zh_TW';break;
                        default: break;
                    }
               		params = Object.assign({},params,{password:password,language: lang});
               		userLogin(params,(response)=>{
               		    WebData.setUserAgent(value.name, this.state.rememberPwd? value.password: null);
		                WebData.user = response;
		                this.setState({errormessage:''});

		                // TODO 登录后还原之前打开的Tabs, 目前他们不需要.
                        // let temp = JSON.parse(localStorage.getItem('tabs')) || {};
                        // let tabs = temp['tabs_' + response.data.id] || [];
                        // this.props.navReplaceAllTabs(tabs, temp.currentTab);
                        // let tab = tabs.find(da => da.id === temp.currentTab) || {url: '/', search: ''};
						// this.props.router.push({pathname: tab.url, query: xt.parseQueryParameter(decodeURIComponent(tab.search))});

                        this.props.router.push("/");
					},(message)=>{
						this.setState({
							errormessage:message.message
						});
					});

        		}, error => console.log(error));

			}

    	});
  	}
  	reset = () => {
  		this.props.loginReset();
  	};

    //进入系统
    onEntryStytem = () => {
        this.props.router.push("/");
    };

    //退出登录
    onLoginOut = () => {
        apiGet(API_FOODING_ES, '/logout', {}, response => {
            WebData.logout();
            this.forceUpdate();
        }, error => {
            WebData.logout();
            this.forceUpdate();
        })
		console.log(WebData)
    };
  	nameChange(e){//邮箱输入框内容改变
  		let nameShow;
  			this.nameV = e.target.value;
  		// if(this.nameV.length != 0){
  		// 	nameShow=true;
  		// }else{
  		// 	nameShow=false;
  		// }
  		// this.setState({
  		// 	namecloseShow : nameShow
  		// })
  	}
  	passwordChange(e){//邮箱输入框内容改变
  		let passwordShow;
		this.passwordV = e.target.value;
  		// if(this.passwordV.length != 0){
  		// 	passwordShow=true;
  		// }else{
  		// 	passwordShow=false;
  		// }
  		// this.setState({
  		// 	passwordcloseShow : passwordShow
  		// })
  	}
  	closeValueClick(e){//关闭按钮键
  		let { namecloseShow, passwordcloseShow } = this.state;
  		if(e.target.getAttribute("type")=="name"){
			this.nameV ="";
  			namecloseShow=false;
  		}
  		if(e.target.getAttribute('type')=='password'){
			this.passwordV ="";
  			passwordcloseShow=false;
  		}
  		this.props.form.setFieldsValue({name:this.nameV,password:this.passwordV});
  		this.setState({
  			namecloseShow : namecloseShow,
  			passwordcloseShow : passwordcloseShow
  		})
  	}
  	onPreviewClick(){//显示隐藏密码
  		let type;
  		if(this.state.passwordType == 'password'){
  			type = 'text';
  		}else{
  			type = 'password';
  		}
  		this.setState({
  			passwordType : type
  		})
  	}
  	switchClick(){//记住密码开关
  		let classN,switchV, rememberPwd;
  		if(this.state.rememberPwd){
  			classN = 'switch-off';
  			switchV = "OFF";
            rememberPwd = false;
  		}else{
            rememberPwd = true;
  			classN='switch-on';
  			switchV="ON";
  		}
  		this.setState({
            rememberPwd,
  			switchClass : classN,
  			switchValue : switchV
  		})
  	}
  	handleResize(height){
		let sch=document.body.offsetHeight-height;
        let scroll = sch-136;
		this.setState({scrollHeight:sch+'px',scroll:scroll+'px',scroll:scroll + "px"});
	}
  	componentDidMount(){
  		this.initHotCategoies();
  		this.initHotProducts();
		window.addEventListener('resize', this.handleResize(0));
		if(this.props.password){
		    this.setState({rememberPwd: true, switchClass: 'switch-on', switchValue: 'ON'});
        }
    };
  	//键盘回车事件 当点击回车就点击登录页面
  	_onKeyUp = e => {
       if(e.keyCode === 13){
       		this.submit();
		}
	};
  	//点击热销售产品时候，跳转到列表页面
    onSalePorClick = obj => {
        let mtlType = obj.mtlType || {};
        window.open(window.location.origin + "/user/logindetail?id=" + obj.oldId +"&mtlTypeId=" + mtlType.id);
	};
	//点击热销分类 ，跳转页面
    onhotCategoriesClick = (obj,e) => {
        window.open(window.location.origin + "/user/logintwostep?id=" + obj.oldId + '&name=' + obj.localName );
	};
	//点击最后一级 跳转页面
    onALLCategoriesClick = () => {
        window.open(window.location.origin + "/user/loginonestep?id=57737953a672301cb5de734b" );
	};
	//热销分类 初始化数据
	initHotCategoies = () => {
  		let that = this;
  		apiGet(API_FOODING_DS,'/fc/portal/hotProductClassify/getListByNumber',{number:9},response => {
			let hotCategries = response.data || [];
			this.setState({hotCategries});
		},error => console.log(error.message))
	};
	//热销产品 初始化数据
	initHotProducts = () => {
  		let that = this;
  		apiGet(API_FOODING_DS,"/fc/portal/platformHotMaterial/getListByNumber",{number:6},response => {
			let hotSalePro = response.data || [];
			this.setState({hotSalePro})
		},error => console.log(error.message))
	};

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(0));
	}
	componentWillReceiveProps(nextPorps){
		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
	}
	render(){
		let {passwordcloseShow, namecloseShow,passwordValue,passwordType,switchClass,switchValue,hotSalePro,hotCategries} = this.state;
		let {loginSign,loginReset} = this.props;
		const{ getFieldProps, getFieldError} = this.props.form;
		let nameIconDom, passwordIconDom;
		if(true){//namecloseShow
			nameIconDom=(<span><i className={'foddingicon fooding-close'} onClick={this.closeValueClick} type='name' title={i18n.t(200665/*清空用户名*/)}></i></span>);
		}else{
			nameIconDom=(<span></span>);
		}
		if(true){//passwordcloseShow
			passwordIconDom=(<span><i className={'foddingicon fooding-close'} onClick={this.closeValueClick} type='password' title={i18n.t(200665/*清空用户名*/)}></i><i className={'foddingicon fooding-preview'} onClick={this.onPreviewClick} title="显示/隐藏密码"></i></span>);
		}else{
			passwordIconDom=(<span></span>);
		}
        return (
                <div className={'loginadvice-index'} style={{height:this.state.scrollHeight}}>
                    <HeaderIndex />
					<div className={'loginadvice-index-content'}>
						<div className="loginadvice-index-content-largemain">
							<div className={'loginadvice-index-content-main'}>
								<ul className={'loginadvice-index-content-main-text'}>
									<div className="loginadvice-index-content-main-text-title">{i18n.t(300075/*热门产品类别*/)}</div>
									{
                                        hotCategries.map((e,i) => {
											return (<li className="loginadvice-index-content-main-text-single" onClick = {this.onhotCategoriesClick.bind(this,e)} key={i}>{e.localName}</li>)
										})
									}
									<li className="loginadvice-index-content-main-text-single" onClick = {this.onALLCategoriesClick.bind(this)}>{I18n.t(300079/*所有分类*/)}</li>
								</ul>
								<div className="loginadvice-index-content-main-img">
									{localStorage.getItem('CONST_LANGUAGE') == 'zh-cn'?
										<Slider
											items={[
                                                {
                                                    src: require('../assets/bg_zh.png'),
                                                    alt: 'bg',
                                                },
                                                {
                                                    src: require('../assets/bg_zh.png'),
                                                    alt: 'images-2',
                                                }
                                            ]}
											speed={0.5}
											delay={4}
											pause={true}
											autoplay={true}
											dots={true}
											arrows={true}
										/>:<Slider
											items={[
                                                {
                                                    src: require('../assets/bg_en.png'),
                                                    alt: 'bg',
                                                },
                                                {
                                                    src: require('../assets/bg_en.png'),
                                                    alt: 'images-2',
                                                }
                                            ]}
											speed={0.5}
											delay={4}
											pause={true}
											autoplay={true}
											dots={true}
											arrows={true}
										/>
									}
								</div>
								{
                                    !WebData.user?<div className={'loginadvice-index-content-main-interface'}>
										<div className={'show-error-message'}>{this.state.errormessage}</div>
										<div className={'input-email'}>
											<Input form={this.props.form} obj={{name:'name',type:'text',
                                                classn:'width100',
                                                onChange:this.nameChange,initialValue:this.props.name
                                            }} onKeyUp={ this._onKeyUp }/>
											<i className={'foddingicon fooding-user_icon user'}/>
                                            {nameIconDom}
										</div>
										<Tooltip
											visible={false}
											placement="bottomLeft"
											animation="zoom"
											onVisibleChange={this.onVisibleChange}
											trigger="click"
											overlay={<span className='rc-tooltip-arrow-inner'
														   style={{color:'#fff',display:'block',
                                                               lineHeight:'34px',padding:'0 5px',
                                                               backgroundColor:'rgba(0,0,0,0.8)'}}>{i18n.t(200666/*大写锁定已打开*/)}</span>}
										>
											<div className={'input-secret'}>
												<Input form={this.props.form} obj={{name:'password',type:passwordType,
                                                    classn:'width100',
                                                    onChange:this.passwordChange,initialValue:this.props.password}} onKeyUp={ this._onKeyUp }
													vaildName={'必填'}

												/>
												<i className={'foddingicon fooding-change-password password'}/>
                                                {passwordIconDom}
											</div>
										</Tooltip>
										<div className={'rember-language'}>
											<div className="rember-language-more">
												<Link className={'route'} to={{pathname:'/user/retrieve'}}>{i18n.t(300025/*忘记密码?*/)}</Link>
											</div>
											<div className={'rember-language-fi'}>
												<span className={'word'}>{I18n.t(100524/*记住密码*/)}</span>
												<div className={switchClass} onClick={this.switchClick}>
													<span>{switchValue}</span>
													<span className={'ball'} />
												</div>
											</div>
										</div>
										<div className={'main-login'}>
											<button onClick={this.submit.bind(this)}>{i18n.t(200667/*登录*/)}</button>
										</div>
										<div className={'registered'}>
											<Link className={'route'} to={{pathname:'/user/register'}}>{i18n.t(200668/*免费注册*/)}</Link>
										</div>
									</div>
										:
										<div className={'loginadvice-index-content-main-havelogin'}>
											<h3>{i18n.t(400202/*欢迎回来!*/)}</h3>
											<div className={'loginadvice-index-content-main-havelogin-avgor'}><img src={DefaultImg} /></div>
											<h2>{xt.getItemValue(WebData.user, 'data.staff.localName', i18n.t(500270/*未知*/) )}</h2>
											<p>{xt.getItemValue(WebData.user, 'data.staff.company.localName', i18n.t(500270/*未知*/))}</p>
											<p>{xt.getItemValue(WebData.user, 'data.staff.positn.localName', i18n.t(500270/*未知*/))}</p>
											<button onClick={this.onEntryStytem}>{i18n.t(400201/*进入系统*/)}</button>
											<div className={'loginadvice-index-content-main-havelogin-morego'}>
												<span onClick={this.onLoginOut}>{i18n.t(300061/*退出登录*/)}</span>
											</div>
										</div>
								}
							</div>
						</div>
					</div>
					<div className={'loginadvice-index-hotsale'}>
						<div className={'loginadvice-index-hotsaleproduct'}>
							<div className="loginadvice-index-hotsaleproduct-title">{i18n.t(400189/*热销产品*/)}</div>
							<ul className="loginadvice-index-hotsaleproduct-picture">
								{
                                    hotSalePro.map((e,i) => {
										return(<li className="loginadvice-index-hotsaleproduct-picture-single" key={i} onClick={this.onSalePorClick.bind(this,e)}>
											<div className="loginadvice-index-hotsaleproduct-picture-single-img">
												<img src={e.imgUrls && e.imgUrls[0]?decodeURIComponent(e.imgUrls[0]):NoImg} />
											</div>
											<h4 className="loginadvice-index-hotsaleproduct-picture-single-say">{e.localName}</h4>
										</li>)
									})
								}
							</ul>
						</div>
					</div>
					<div className={'loginadvice-index-all-foot'}>
						<div className={'loginadvice-index-all-foot-help-about'}>
							<a href='#' className={'chained rightborder'}>{i18n.t(200669/*帮助中心*/)}</a>
							<a href='#' className={'chained rightborder'}>{i18n.t(200670/*服务条款*/)}</a>
							<a href='#' className={'chained rightborder'}>{i18n.t(200671/*隐私政策*/)}</a>
							<a href='#' className={'chained rightborder'}>{i18n.t(200672/*问题反馈*/)}</a>
							<a href='#' className={'chained'}>{i18n.t(200673/*关于我们*/)}</a>
						</div>
						<div className={'loginadvice-index-all-foot-describe'}>
							<span>{i18n.t(300026/*1993 - 2017 怒吼科技（中国）有限公司所有*/)}</span>
							<span className={'image'}></span>
							<span>{i18n.t(200674/*沪ICP备15058071号*/)}</span>
						</div>
					</div>
					<DevModel/>
                </div>
                );
        }
}
export default createForm({mapPropsToFields(props) {
    return {
      name:{value:props.name},
      password:{value:props.password}
    };
  },
  onFieldsChange(props, fields) {
    let{currentInfo}=props;
    currentInfo(fields);
  }
})(NavConnect(Login));


	{/*<div className={'show-error-message'}>{this.state.errormessage}</div>*/}
	{/*<h1>Noohle</h1>*/}
	{/*<div className={'input-email'}>*/}
		{/*<Input form={this.props.form} obj={{name:'name',type:'text',*/}
            {/*classn:'width100',*/}
            {/*onChange:this.nameChange,initialValue:this.props.name}}/>*/}
		{/*<i className={'foddingicon fooding-user_icon user'}/>*/}
        {/*{nameIconDom}*/}
	{/*</div>*/}
