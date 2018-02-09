import React, { Component,PropTypes } from 'react';
import RightKey from '../../../../../components/RightKey/RightKey';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option, ConstMiniSelect, ConstVirtualSelect } from '../../../../../components/Select';
//引入时间插件
import DataTime from '../../../../../components/Calendar/Calendar'
import Checkbox from '../../../../../components/CheckBox';
//引入弹层
import Dialog from '../../../../../components/Dialog/Dialog'; 

import {I18n} from '../../../../../lib/i18n';
import AddMoreLanguage from "../../../../../components/AddMoreLanguage";
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../../services/apiCall";
import NameCheck from "../../../../../components/InputBoxCheck/NameCheck";
export class  DialogProductNormal extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.data ={};
        this.state ={
        	showDilaogsecond:false,
        }
        this.upload = this.upload.bind(this);
	}
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose,initData} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				that.props.onSaveAndClose(that.props.form.getFieldsValue(),that.data);
				that.props.form.resetFields();
			}
		})
	}
	onCancel(){
		let that = this;
		const {onCancel} = this.props;
		if(onCancel){
            onCancel();
            that.props.form.resetFields();
        }
	}
	upload(){
		this.props.onCancel();
		this.props.upload();
	}
	nativeClick = () => {
		let content=require('../../../../MenuSetting/components/MoreLanguageSetDialog').default;
		let element=React.createElement(content,{onSaveAndClose:this.upload,
			menusetView:this.props.initData.material,
			apiHost:API_FOODING_DS,
			object:'material',
			onCancel:this.onCancelSecond})
    	this.setState({
    		showDilaogsecond : true,
    		title: I18n.t(100496/*多语言配置*/),
    		dialogContent: element
    	})
	}
	onSaveAndCloseSecond = () => {
		this.setState({
			showDilaogsecond:!this.state.showDilaogsecond
		})
	}
	onCancelSecond = () => {
		this.setState({
			showDilaogsecond:false
		})
	}
	render(){ 
		let that = this;
		const { getFieldProps, getFieldError, getFieldValue } = this.props.form;
		let {data,initData} = this.props;

        let customerSign = initData;
        let {customer} = initData;

		let content;
		
        if(data.name.id == 'product-detail-1'){
        	getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:initData? initData.optlock:''
			})
			getFieldProps('name', {
							            	validateFirst: true,
						                    initialValue:initData? initData.name:''
			})
			getFieldProps('nameValues', {
							            	validateFirst: true,
						                    initialValue:initData? initData.nameValues:''
			})
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:initData? initData.id:''
			})
			let	{mtlTypes,chargePeople,contnrTypes,dataDivs,loginStaff,pProcess,rptMtls,simProStands,material} = initData;
			this.data = Object.assign({},initData,{title:"product-detail-miaoshu"});
			content = (<div>
				<div className={'row'} >
							<div className="form-group col-md-12 col-lg-12" >
								<textarea placeholder={""} style={{height:'200px'}} className={'col-lg-12 col-md-12 textarea'} {...getFieldProps('description', {
		                                initialValue:initData&&initData.description?initData.description:''
		                            })}></textarea>	
							</div>
						</div>
					</div>
			)
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>						
					{content}	
					<Dialog width={976} visible={this.state.showDilaogsecond} title={this.state.title}>
						{this.state.dialogContent}
					</Dialog>					
				</FormWrapper>
			</div>
			);
	}
}
DialogProductNormal.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
DialogProductNormal.defaultProps ={
	onSaveAndClose(){},
    onCancel(){}
}
const DialogProductNForm =createForm()(DialogProductNormal);
export default DialogProductNForm;
