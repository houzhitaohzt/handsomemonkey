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
			case 'client' : // 客户
				var param = {beId:getOne['id']};
			break;
			case 'provider' : // 供应商
				var param = {beId:getOne['id']};
			break;	
			case 'servbe' : // 服务机构
				var param = {beId:getOne['id']};
			break;	
			case 'forwarder' : // 货代
				var param = {beId:getOne['id']};
			break;								
			
			default:
		}

		apiGet(API_FOODING_DS,'/emailContact/getEnterpriseContacts',Object.assign({},param),
			(response)=>{
				let list = (response['data']||[]).map(o=>({key:o['id'],title:o['entity'] ? `${o.entity['localName']}<${o['email']}>`:''}));
				that.setState({
					linkData: list
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	onSaveAndClose = ()=> {
		let that = this;
		let {linkKeys,linkData,loginMessage} = this.state;
		let {form,getPage,onSaveAndClose,onCancel} = this.props;

		// 未选择 收件人 
		if( !linkKeys['length'] ){
			ServiceTips({text:I18n.t(600314/*未选择收件人！*/),type:'success'});
			return;
		}

		
		let result = linkData.filter(o=>linkKeys.filter(j=>j==o['key'])['length']).map(o=>o['title']);
		console.log(result.join(';'));
		window.navTabs.open(I18n.t(700006/*写邮件*/),`/email/write`,{type:'compose',collectionName:loginMessage['defaultEmail'],toAddress:result.join(';')},{refresh: true});
		onCancel();
					
	}

	onCancel = ()=> {
		this.props.onCancel();
		this.props.form.resetFields();
	}

	render(){
		let that = this;
		let {loginMessage,linkData,linkKeys} = this.state;
		let {form} = this.props;
		let {getFieldProps,getFieldError,getNFieldProps} = this.props.form;

		// defaultEmail
		return (
			<div className="package-action-buttons">
				<FormWrapper buttonLeft={I18n.t(200043/*确定*/)} showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
					<div className={'addnormal'} style={{marginBottom:'10px'}}>
						<div className={'girdlayout scroll'} style={{height:'298px'}}>						
							<div className={'row'}>
								<div className="col-md-12">
									<div style={{paddingLeft:'100px'}}>
										<Transfer
											showSearch
											titles={[I18n.t(100370/*联系人*/), I18n.t(200540/*收件人*/)]}
											listStyle={{width:310,height:297,}}
											dataSource={linkData}
											targetKeys={linkKeys}
											onChange={this.linkHandleChange}
											render={item => item.title}
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







