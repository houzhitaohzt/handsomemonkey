import i18n from './../../../lib/i18n';
import React ,{Component,PropTypes} from 'react';
import {createForm} from '../../../components/Form';
import {I18n} from '../../../lib/i18n';

import * as RSA from '../../../common/RSA';


// ajax
import {getQueryString, buildUrl, apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../services/apiCall";
import ServiceTips from '../../../components/ServiceTips';




class RetrieveSetupTwo extends Component{
	constructor(props){
		super(props)
		this.passwordChange=this.passwordChange.bind(this);
		this.passwordagainChange=this.passwordagainChange.bind(this);
		this.confirmResetClick=this.confirmResetClick.bind(this);
		this.closeValueClick=this.closeValueClick.bind(this);
		this.state=this.initState();

		// init Func 
		this.getToken = this.getToken.bind(this);
		this.handleRSA = this.handleRSA.bind(this);
		


	}
	initState(){
		return {
			passwordcloseShow:false,
			passwordValue:'',
			passwordagainValue:'',
			passwordagaincloseShow:false,

			HTML: false, // 判断 链接 是否过期
			message: '', // 提示信息
			userName:'', // 用户名
		}
	}

	componentDidMount(){
		this.getToken();
		this.handleRSA();
		
    }
	componentWillUnmount() {
	}

	passwordChange(e){//邮箱输入框内容改变
  		let passwordShow,
  			passwordV;
  			passwordV = e.target.value;
  		if(passwordV.length != 0){
  			passwordShow=true;
  		}else{
  			passwordShow=false;
  		}
  		this.setState({
  			passwordValue:passwordV,
  			passwordcloseShow : passwordShow
  		})
  	}
  	passwordagainChange(e){
  		let passwordagainShow,
  			passwordagainV;
  			passwordagainV = e.target.value;
  		if(passwordagainV.length != 0){
  			passwordagainShow=true;
  		}else{
  			passwordagainShow=false;
  		}
  		this.setState({
  			passwordagainValue:passwordagainV,
  			passwordagaincloseShow : passwordagainShow
  		})
  	}
  	closeValueClick(e){//关闭按钮键
  		let passwordV,passwordagainV;
  		let { passwordcloseShow, passwordagaincloseShow } = this.state;
  		if(e.target.getAttribute("type")=="password"){
  			passwordV="";
  			passwordcloseShow=false;
  		}
  		if(e.target.getAttribute('type')=='passwordagain'){
  			passwordagainV="";
  			passwordagaincloseShow=false;
  		}
  		this.setState({
  			passwordValue:passwordV,
  			passwordcloseShow : passwordcloseShow,
  			passwordagainValue : passwordagainV,
  			passwordagaincloseShow : passwordagaincloseShow
  		})
  	}
  	confirmResetClick(){
  		this.props.confirmResetClick()
  	}

	// RSA 获取 密钥
	handleRSA(){
        apiGet(API_FOODING_ES, '/fc/getExAndModForPublicKey', {}, ({data}) => {
            RSA.setMaxDigits(130);
            this.rsaKeys= new RSA.RSAKeyPair(data.exponent, '', data.modulus);
        }, error => console.log(error));
	}

	// 验证 token 
	getToken(){
		let r = getQueryString('token');
		if( !r ) return;

		let that = this;
		apiGet(API_FOODING_ES,'/fc/retrieve/checkMail',{token:r},
			(response)=>{   
				switch(response['data']){
					case '0' :
						that.setState({ message:'链接已过期！' });
					break;
					case '1' :
						that.setState({ message:'链接已超时！' });						
					break;
					default:
						that.setState({ HTML:true, userName:response['data']});					
				}
			},(errors)=>{
				ServiceTips({text:errors['message'],type:'info'});
		});		
	}



	// 确认
  	confirmResetClick(){

        let that = this;
        const {form} = that.props;

        form.validateFields((errors, value) => {
            if(errors){
                ServiceTips({text:'请填写完整！',type:'info'});                
            }else{
				
				// 验证
				if( value['pwd'] != value['pwd2'] ){
                	ServiceTips({text:'两次密码不一致！',type:'info'});					
					return;
				}
				if( value['pwd'].length < 6 ){
                	ServiceTips({text:'密码长度必须大于或等于6！',type:'info'});					
					return;
				}


				let password = RSA.encryptedString(that.rsaKeys,value['pwd']);
                apiForm(API_FOODING_ES,'/fc/retrieve/resetPwd',Object.assign({emailOrAccount:that.state['userName'],pwd:password,token:getQueryString('token')}),
                    (response)=>{
						that.props.changeTab();
                    },(errors)=>{
                        ServiceTips({text:errors['message'],type:'info'});
                });
            }
        });
  	}


	render(){
		const {HTML,message,passwordValue,passwordcloseShow,passwordagainValue,passwordagaincloseShow} = this.state;
		let passwordIconDom, passwordagainIconDom;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;


		if(passwordcloseShow){
			passwordIconDom=(<span><i className={'foddingicon fooding-close'} onClick={this.closeValueClick} type='password' title={i18n.t(201040/*清空密码*/)}></i></span>);
		}else{
			passwordIconDom=(<span></span>);
		}
		if(passwordagaincloseShow){
			passwordagainIconDom=(<span><i className={'foddingicon fooding-close'} onClick={this.closeValueClick} type='passwordagain' title={i18n.t(201040/*清空密码*/)}></i></span>);
		}else{
			passwordagainIconDom=(<span></span>);
		}
		return(<div className={'retrievepassword-content-main-find'}>
				<h3 className={'title'}>{i18n.t(201031/*找回密码*/)}</h3>
				<div className={'setup step02'}>
					<span>{i18n.t(201032/*输入邮箱/怒吼账号*/)}</span>
					<span>{i18n.t(201033/*重置密码*/)}</span>
					<span>{i18n.t(201034/*完成*/)}</span>
				</div>
				{ HTML ? 
					<div>
						<div className={'input-email'}>
							<input type='password' 
								{...getNFieldProps('pwd',{
									rules: [{required:true}],									
									initialValue: ''
								})}
								className ={getFieldError('pwd')?'error-border':''}							
								
								//name='name'
								//onChange={this.passwordChange}
								//value={passwordValue}
							/>
							<i className={'foddingicon fooding-change-password user'}></i>
							{passwordIconDom}
						</div>
						<div className={'input-email'}>
							<input type='password' 
								{...getNFieldProps('pwd2',{
									rules: [{required:true}],									
									initialValue: ''
								})}
								className ={getFieldError('pwd2')?'error-border':''}							
								
								//name='name2'
								//onChange={this.passwordagainChange}
								//value={passwordagainValue}
							/>
							<i className={'foddingicon fooding-change-password user'}></i>
							{passwordagainIconDom}
						</div>
						<div className={'validate-confirm two'}>
							<button onClick={this.confirmResetClick}>{i18n.t(200043/*确定*/)}</button>
						</div>
					</div>
					:
					<div>
						<p>{message}</p>
					</div>
				}

		</div>)
	}
}

const RetrieveSetupTwoForm = createForm()(RetrieveSetupTwo);
export default RetrieveSetupTwoForm;

// export default RetrieveSetupTwo;
