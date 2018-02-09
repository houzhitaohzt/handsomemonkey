import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../Form";
//引入select插件
import Select, { Option } from 'rc-select';
import {I18n} from '../../lib/i18n';
import WebData from '../../common/WebData';
import {apiGet, apiPost, apiForm, API_FOODING_ES} from '../../services/apiCall';
import ServiceTips from '../../components/ServiceTips';
import * as RSA from '../../common/RSA';
import {browserHistory} from 'react-router';
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
	}
	initState(){
		return {
			initData:{},
			bumen:'',
			gawei:'',
			isError:false
		}
	}
	componentDidMount(){
		
	}
	onSaveAndClose(){
		let that = this;
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				if(value.queren != value.newPwd){
					this.setState({
						isError:true
					});
				}else {
					this.setState({
						isError:false
					});
					delete value.queren ;
					let params = value;
					apiGet(API_FOODING_ES, '/fc/getExAndModForPublicKey', {}, ({data}) => {
		            		RSA.setMaxDigits(130);
		               		let rsaKeys= new RSA.RSAKeyPair(data.exponent, '', data.modulus);
		               		let oldPwd = RSA.encryptedString(rsaKeys,value['oldPwd']);
		               		let newPwd = RSA.encryptedString(rsaKeys,value['newPwd']);
		               		params = Object.assign({},params,{oldPwd:oldPwd ,
		               			newPwd:newPwd});
		               		apiForm(API_FOODING_ES,'/user/editPwd',params,(response)=>{
								ServiceTips({text:response.message,type:'success'});
									apiGet(API_FOODING_ES, '/logout', {},
							            response => {
							                browserHistory.push('/user/login');
							                WebData.logout();
							            }, error => {
									        errorTips(error.message);
							        })
							},(error)=>{
								ServiceTips({text:error.message,type:'error'});
							});
				               		
						},(message)=>{
							this.setState({
								errormessage:message.message
							});
						});

	        		
				}
			}
	      	
    	});
	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	render(){
		const {form,data} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		return (<FormWrapper showFooter={true}  onCancel={this.onCancel} onSaveAndClose={this.onSaveAndClose}>
				<div className={'girdlayout'} style={{position:'relative'}}>
					<span style={{color: 'red',display: 'block',textAlign: 'center',fontSize: '12px',
    				position: 'absolute',top: -30,width: '100%'}} className={this.state.isError?'':'none'}
    				>俩次密码输入不一致</span>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-2 col-md-2'}>原密码</label>
							<input type="password" {...getFieldProps('oldPwd', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:''
						   })}
						   className={getFieldError('oldPwd')?"text-input-nowidth col-xs-10 col-md-10 error-border":"text-input-nowidth col-xs-10 col-md-10"}/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-2 col-md-2'}>新密码</label>
							<input type="password" {...getFieldProps('newPwd', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:''
						   })} 
						   className= {getFieldError('newPwd')?"text-input-nowidth col-xs-10 col-md-10 error-border":"text-input-nowidth col-xs-10 col-md-10"}/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-2 col-md-2'}>确认新密码</label>
							<input type="password" {...getFieldProps('queren', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:''
						   })} 
						   className={getFieldError("queren")?"text-input-nowidth col-xs-10 col-md-10 error-border":"text-input-nowidth col-xs-10 col-md-10"}/>
						</div>
					</div>
				</div>
			</FormWrapper>);
	}
}

const PersonInformationView = createForm()(CommonForm);

export default PersonInformationView;