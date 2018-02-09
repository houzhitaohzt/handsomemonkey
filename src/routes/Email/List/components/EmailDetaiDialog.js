import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
import Confirm from '../../../../components/Dialog/Confirm';
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_MAIL,language,commonAjax} from '../../../../services/apiCall';
export class CreditinsurratePlug extends Component{

	constructor(props){
		super(props);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAdd = this.onSaveAdd.bind(this);
		this.state = {
			content:<div></div>
		}
	}
	componentDidMount(){
		let {record} = this.props;
		let collectionName =record.collectName;
		apiGet(API_FOODING_MAIL,'/box/getOne',{mailId:record.id,collectionName:collectionName},(response)=>{
			this.setState({
				content:response.data.entity.context
			});
		},(error)=>{

		})
    }
	componentWillUnmount() {
	}
	// 保存
	onSaveAndClose(){
		let that = this;
		let {record, navAddTab} = this.props;
		let collectionName = record.collectName;
		let src ='/email/router/mail/write.html?type=forward&id='+record.id+'&receiveMail='+collectionName;
		let url = "/email/write/forward";

		navAddTab({name:"name",component:"name", url});
		this.props.router.push({pathname:url, query: {uri: encodeURIComponent(src)}});
	}

	// 取消
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	onSaveAdd(){
		let that = this;
		let {record,navAddTab} = this.props;
		let collectionName = record.collectName;
		let type = record.collectName == record.sendMail?'resend':'reply';
		let src ='/email/router/mail/write.html?type='+type+'&id='+record.id+'&receiveMail='+collectionName;
		let url = "/email/write/resend";
		navAddTab({name:"name",component:"name", url});
		this.props.router.push({pathname:url, query: {uri: encodeURIComponent(src)}});
	}
	// 币种 ajax
	render(){
		let that = this;
		const { getFieldProps, getNFieldProps, getFieldError } = this.props.form;
		let {record} = this.props;
		let {content} = this.state;
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} showSaveAdd={true} saveAdd={record.collectName == record.sendMail?i18n.t(200538/*重新发送*/):i18n.t(200271/*回复*/)} buttonLeft = {i18n.t(300042/*转发*/)} onSaveAndClose={this.onSaveAndClose}
					 onCancel={this.onCancel} onSaveAdd={this.onSaveAdd}>
						<div style={{height:'300px',overflowY:'auto'}} className='scroll' dangerouslySetInnerHTML={{__html: content}} >

						</div>
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(NavConnect(CreditinsurratePlug));
export default ProductForm;
