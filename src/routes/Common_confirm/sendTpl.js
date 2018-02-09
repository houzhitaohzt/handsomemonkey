import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../components/Form";
import I18n from './../../lib/i18n';

import ServiceTips from '../../components/ServiceTips'; // 提示
import {getUser,pageSize,sizeList,apiGet,apiPost,apiForm,API_NOOHLE_PTPM,API_FOODING_MAIL,API_FOODING_DS,API_FOODING_ERP,language,getQueryString} from '../../services/apiCall';
import Select, { Option,ConstVirtualSelect } from '../../components/Select'; // 下拉


import {Transfer,Radio } from 'antd';
const RadioGroup = Radio.Group;


class PageDIV extends Component{
	constructor(props){
		super(props);

		this.state = {
			linkmanData:{country:{}}, // get one
			loginMessage: getUser(), // 登录信息

			linkData:[], // 联系人
			linkKeys:[], // 选中联系人 

		}

	}

	componentDidMount(){
		this.getPage(); 
	}

	//选择地区 
	linkHandleChange = (nextTargetKeys, direction, moveKeys) => this.setState({linkKeys:nextTargetKeys});


	// get one 
	getPage = ()=> {
		let that = this;
		let {loginMessage} = this.state;
		let {active,getOne} = this.props;
		
		switch(active){
			case 'booking' : // 物流订单
				var param = {beId:getOne['forwarderBeId']};
			break;
			case 'purchase' : // 采购订单
				var param = {beId:getOne['recVndBeId']};
			break;	
			case 'salesorder' : // 销售订单
				var param = {beId:getOne['salBeId']};
			break;	
			case 'quotation' : // 销售报价
				var param = {beId:getOne['salBeId']};
			break;								
			
			default:
		}

		apiGet(API_FOODING_DS,'/emailContact/getEnterpriseContacts',Object.assign({},param),
			(response)=>{

				let list = (response['data']||[]).map(o=>({key:o['email'],title:o['entity'] ? `${o.entity['localName']}<${o['email']}>`:''}));
				that.setState({
					linkData: list
				});

			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	onSaveAndClose = ()=> {
		let that = this;
		let {linkKeys,linkmanData,loginMessage} = this.state;
		let {form,getPage,onSaveAndClose,onCancel} = this.props;

		// 未选择 收件人 
		if( !linkKeys['length'] ){
			ServiceTips({text:I18n.t(600299/*未选择发件人！*/),type:'success'});
			return;
		}

		form.validateFields((errors, value) => {
			if(errors){
			}else{
				let param = Object.assign({},{toAddress:linkKeys.join(','),billId:getQueryString('id'),sendMail:loginMessage['defaultEmail']},value);
				
				apiPost(API_FOODING_MAIL,'/sendTemplate',param,
					(response)=>{
						ServiceTips({text:response.message,type:'success'});
						onCancel();
						window.navTabs.open(I18n.t(700006/*写邮件*/),`/email/write`,{type:'rewrite',collectionName:loginMessage['defaultEmail'],mailId:response['data']},{refresh: true});
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});	
			}
		})
	}

	onCancel = ()=> {
		this.props.onCancel();
		this.props.form.resetFields();
	}

	render(){
		let that = this;
		let {linkmanData,loginMessage,linkData,linkKeys} = this.state;
		let {form} = this.props;
		let {getFieldProps,getFieldError,getNFieldProps} = this.props.form;

		// defaultEmail
		return (
			<div className="package-action-buttons">
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
					<div className={'addnormal'} style={{marginBottom:'10px'}}>
						<div className={'girdlayout scroll'} style={{height:'298px',maxHeight:'298px'}}>						
							<div className={'row'}>
								<div className="form-group col-md-12">
									<div className={'col-md-8 col-md-offset-2'}>
										<Transfer
											showSearch
											titles={[I18n.t(100370/*联系人*/), I18n.t(200539/*发件人*/)]}
											listStyle={{width:250,height:200,}}
											dataSource={linkData}
											targetKeys={linkKeys}
											onChange={this.linkHandleChange}
											render={item => item.title}
										/>
									</div>
								</div>							
							</div>	
							<div className={'row'}>
								<div className="form-group col-md-12">
									<label className={'col-md-2'}><span>*</span>{I18n.t(600294/*选择模板*/)}</label>
									<div className={'col-md-8'}>
										<ConstVirtualSelect
											style={{width:'100%'}}
											form={this.props.form}
											fieldName='billTemplateIds'
											apiType={apiGet}
											apiHost={API_NOOHLE_PTPM}
											apiUri={'/printTpm/getList?formIdentity=sales_order'}
											multi={true}
											rules
										/>
									</div>
								</div>							
							</div>							
							<div className={'row'}>
								<div className="form-group col-md-12">
									<label className={'col-md-2'}><span>*</span>{I18n.t(700122/*邮件模板*/)}</label>
									<div className={'col-md-8'}>
										<ConstVirtualSelect
											form={form}
											style={{width:'100%'}}
											apiType={apiGet}
											apiHost={API_FOODING_MAIL}
											apiUri={'/template/content/getAll'}
											fieldName="mailTemplateId"
											labelKey='localName'
											apiParams={{mail:loginMessage['defaultEmail']}}
											pageSize={6}
											rules={true}
											//clearable
											//initialValue={{s_label:checkedData['countryOriginTxt'],countryOriginId:checkedData['countryOrigin']?checkedData['countryOrigin']['id']:''}}									
										/>
									</div>
								</div>							
							</div>	

							<div className={'row'}>
								<div className="form-group col-md-12">
									<label className={'col-md-2'}><span>*</span>{I18n.t(600295/*发送方式*/)}</label>
									<div className={'col-md-8'}>
										<ConstVirtualSelect
											form={form}
											style={{width:'100%'}}
											apiType={apiPost}
											fieldName="type"
											labelKey='localName'
											apiParams="com.fooding.fc.enumeration.SendType"
											pageSize={6}
											rules={true}
										/>
									</div>
								</div>							
							</div>							
						</div>
					</div>
				</FormWrapper>
			</div>
		)
	}
}

export default createForm()(PageDIV);







