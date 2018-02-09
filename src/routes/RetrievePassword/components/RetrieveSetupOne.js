import i18n from './../../../lib/i18n';
import React ,{Component,PropTypes} from 'react';
import {createForm} from '../../../components/Form';
import {I18n} from '../../../lib/i18n';
import { Router, Route, IndexRoute, hashHistory ,Link} from 'react-router';

// ajax
import {getQueryString, buildUrl, apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../services/apiCall";
import ServiceTips from '../../../components/ServiceTips';




class RetrieveSetupOne extends Component{
	constructor(props){
		super(props)
		this.nameChange=this.nameChange.bind(this);
		this.closeValueClick=this.closeValueClick.bind(this);
		this.validateChange=this.validateChange.bind(this);
		this.switchClick=this.switchClick.bind(this);
		this.confirmClick=this.confirmClick.bind(this);
		this.state=this.initState();

		

	}
	initState(){
		return {
			namecloseShow:false,
			nameValue:'',
			validateValue:'',
			validatecloseShow:false,

			imgURL:'', // 验证 img 
			verifyPass:false, //验证通过
			mailMessage:{}, // 验证通过信息
			
		}
	}
	componentDidMount(){
		this.switchClick();			
    };
	componentWillUnmount() {
	}

	nameChange(e){//邮箱输入框内容改变
  		let nameShow,
  			nameV;
  			nameV = e.target.value;
  		if(nameV.length != 0){
  			nameShow=true;
  		}else{
  			nameShow=false;
  		}
  		this.setState({
  			nameValue:nameV,
  			namecloseShow : nameShow
  		})
  	}
  	validateChange(e){
  		let validateShow,
  			validateV;
  			validateV = e.target.value;
  		if(validateV.length != 0){
  			validateShow=true;
  		}else{
  			validateShow=false;
  		}
  		this.setState({
  			validateValue:validateV,
  			validatecloseShow : validateShow
  		})
  	}
  	closeValueClick(e){//关闭按钮键
  		let nameV,validateV;
  		let { namecloseShow, validatecloseShow } = this.state;
  		if(e.target.getAttribute("type")=="name"){
  			nameV="";
  			namecloseShow=false;
  		}
  		if(e.target.getAttribute('type')=='validate'){
  			validateV="";
  			validatecloseShow=false;
  		}
  		this.setState({
  			nameValue:nameV,
  			namecloseShow : namecloseShow,
  			validateValue : validateV,
  			validatecloseShow : validatecloseShow
  		})
  	}
  	switchClick(){//点击换一张时，从后台获取数据

		let that = this;  
		apiGet(API_FOODING_ES,'/fc/getCaptcha1?'+ new Date().getTime(),{},
			(response)=>{				
					this.setState({ imgURL:'data:image/png;base64,' + response['data']});
			},(errors)=>{
		});

	}




	// 确认
  	confirmClick(){

        let that = this;
        const {form} = that.props;
        form.validateFields((errors, value) => {
            if(errors){
                ServiceTips({text:'请填写完整！',type:'info'});                
            }else{
                apiPost(API_FOODING_ES,'/fc/retrieve/sendMail',Object.assign(value,{url:'/user/retrieve'}),
                    (response)=>{   
                        ServiceTips({text:'成功！',type:'success'});
						that.setState({
							mailMessage:response['data'],
							verifyPass:true,
						});
                    },(errors)=>{
                        ServiceTips({text:errors['message'],type:'info'});
                });
            }
        });
  	}
	render(){


		const {namecloseShow,nameValue,validatecloseShow,validateValue,verifyPass,mailMessage} = this.state;
		let nameIconDom, validateIconDom,showDom;
		const {imgURL} = this.state;

		const {form} = this.props;
        const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;


		if(namecloseShow){
			nameIconDom=(<span><i className={'foddingicon fooding-close'} onClick={this.closeValueClick} type='name' title={i18n.t(200665/*清空用户名*/)}></i></span>);
		}else{
			nameIconDom=(<span></span>);
		}
		if(validatecloseShow){
			validateIconDom=(<span><i className={'foddingicon fooding-close'} onClick={this.closeValueClick} type='validate' title={i18n.t(201030/*清空验证码*/)}></i></span>);
		}else{
			validateIconDom=(<span></span>);
		}
		if( verifyPass || getQueryString('token') ){
			showDom=(<div >
					<h3 className={'title'}>{i18n.t(201031/*找回密码*/)}</h3>
					<div className={'setup step01'}>
						<span>{i18n.t(201032/*输入邮箱/怒吼账号*/)}</span>
						<span>{i18n.t(201033/*重置密码*/)}</span>
						<span>{i18n.t(201034/*完成*/)}</span>
					</div>
					<div className={'success-email'}>
							<i className={'foddingicon fooding-dui-icon2'}></i>
							<span>{i18n.t(201035/*密码找回邮件已经发送到您的邮箱*/)}<Link to={{ pathname: 'www.baidu.com', query: { name: 'aaaa' } }} className={'mail'}>{mailMessage['emailOrAccount']}</Link></span>
					</div>
					{/*<div>
						<a href={mailMessage['url']} target="_blank">{i18n.t(201036*//*邮件测试链接*//*)}</a>
					</div> */}
					<div className={'success-tip'}>
						{i18n.t(600169/*系统自动发送一封邮件到您的邮箱,请按照邮件说明进行激活。如果在十分钟之内没有收到该邮件，请确认是否被收取到垃圾邮件中。*/)}
					</div>

				</div>)
		}else{
			showDom=(<div>
					<h3 className={'title'}>{i18n.t(201031/*找回密码*/)}</h3>
					<div className={'setup step01'}>
						<span>{i18n.t(201032/*输入邮箱/怒吼账号*/)}</span>
						<span>{i18n.t(201033/*重置密码*/)}</span>
						<span>{i18n.t(201034/*完成*/)}</span>
					</div>
					<div className={'input-email'}>
				        <input type='text' 
							{...getNFieldProps('emailOrAccount',{
								rules: [{required:true}],									
								initialValue: ''
							})}
							className ={getFieldError('emailOrAccount')?'error-border':''}							
							placeholder={i18n.t(201037/*请输入邮箱/怒吼账号*/)}
				        	//name='emailOrAccount'
				        	//onChange={this.nameChange}
					    	//value={nameValue}
				        />
				        <i className={'foddingicon fooding-user_icon user'}></i>
				         	{nameIconDom}
				    </div>
			    	<div className={'input-validate-all'}>
			    		<div className={'input-validate'}>
							<input type='text' 
								{...getNFieldProps('code',{
									rules: [{required:true}],									
									initialValue: ''
								})}
								className ={getFieldError('code')?'error-border':''}
								//name="code"
					        	//onChange={this.validateChange}
					        	//value={validateValue}
					        />
					        <i className={'foddingicon fooding-change-password password'}></i>
					        {validateIconDom}
			    		</div>
						<div className={'validate-image'}>
							<img src={imgURL} />
						</div>
						<div className={'validate-get'} style={{width:'500px'}}><span onClick={this.switchClick}>{i18n.t(201039/*换一张*/)}</span></div>
				    </div>
			    	<div className={'validate-confirm'}>
						<button onClick={this.confirmClick}>{i18n.t(200043/*确定*/)}</button>
					</div>
				</div>)
		}
		return(<div className={'retrievepassword-content-main-find'}>
			{showDom}
		</div>)
	}
}

const RetrieveSetupOneForm = createForm()(RetrieveSetupOne);
export default RetrieveSetupOneForm;
// export default RetrieveSetupOne;
