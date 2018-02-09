import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';


 import {ConstVirtualSelect} from '../../../components/Select/';
import {getQueryString,apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';

export class  ContactDialog extends Component{
	constructor(props){
		super(props);
	}

	// 保存并新增
	onSaveAdd = (callBack)=>{
		let that = this;
		this.props.form.validateFields((error, value) => {
			if(error){
			}else{
				apiPost(API_FOODING_DS,'/tradruleCompetitor/save',Object.assign({},value,{sourceId:getQueryString('id')}),
				(response)=>{
					that.props.onSaveAndClose();
					ServiceTips({text:'成功！',type:'success'});
					callBack && callBack();
				},(error)=>{
					ServiceTips({text:error.message,type:'error'});
				})
			}
    	});
	}

	// 保存并关闭
	onSaveAndClose = ()=>{
		this.onSaveAdd(()=>{ this.props.onCancel() });
	}

	// 关闭
	onCancel = ()=>{
		this.props.onCancel();
	}


	render(){
		return(
			<div className="girdlayout">
				<FormWrapper showSaveAdd={true} showFooter={true} onSaveAdd={this.onSaveAdd} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
					<div className="row">
						<label className={'col-md-4'}><span>*</span>{i18n.t(100449/*竞争对手*/)}</label>
						<div className="col-md-7">
							<ConstVirtualSelect form={this.props.form}
								apiType={apiPost}
								apiParams="com.fooding.fc.ds.entity.Rival"
								fieldName="competitorId"
								rules={true}
							/>
						</div>


					</div>
					<br/>
				</FormWrapper>
			</div>
		);
	}
}
const DialogFrom =createForm()(ContactDialog);
export default DialogFrom;
