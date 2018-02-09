import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
import Confirm from '../../../components/Dialog/Confirm';
import Input from '../../../components/FormValidating/FormValidating';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_WORK} from '../../../services/apiCall';
import Loading from "../../../components/Loading";//加载动画
import ServiceTips from "../../../components/ServiceTips";//提示框
export class Productplug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.state={
			common :<div></div>
		}
		
	}
	getData(value,that){
		this.addSelect = that;
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				this.props.form.resetFields();

				
			}
		})
	}
	onSaveAdd(){
		this.onSaveAndClose(true);
	}
	onCancel(){
		const {form, onCancel} = this.props;
		this.props.onCancel();
		this.props.form.resetFields();
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps} = this.props.form;
		let {checkedData} = this.props;
		let content = <div></div>;

		if(this.props.DialogContent == 1){
			getFieldProps('action', {
							            	validateFirst: true,
						                    initialValue:'claim'
			})
			getFieldProps('taskId', {
								            	validateFirst: true,
							                    initialValue:checkedData.record.id
			})
			getFieldProps('assignee', {
								            	validateFirst: true,
							                    initialValue:checkedData.record.userId
			})
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<p style={{marginLeft:'50px',fontSize:'20px'}}>
						是否确认领取任务?
					</p>
			</div>
           	);
		}else if(this.props.DialogContent == 2){
			let str = API_FOODING_WORK + "/service/tasks/image/viewHighLight?taskId=" +checkedData.record.id;
			var img = new Image();
  			// 改变图片的src
			img.src = str;
			img.onload = function(){
			 // 打印
				let pos = that.props.position.acs;
				let left = pos?((pos.x)-1)*866/img.width:0;
				let top  = pos?(pos.y-1)*866/img.width:0;
				let height = pos?(pos.height+3)*866/img.width:0;
				let width  = pos?(pos.width+3)*866/img.width:0;
			    that.setState({
			    	common :<div style = {{position:'absolute',top:top,left:left,height:height,width:width,border:'5px solid #11e411',borderRadius: '6px'}}>
							</div>
			    });
			}
			content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}} >
					<div className={'  girdlayout scroll'} style={{position:'relative',height:"40vh",overflowY:"auto"}}>
						<img src= {str} style={{width:'100%'}} id = "img-sr"/>
						{this.state.common}
					</div>
			</div>
           	);
		}
		
		return (
			<div className="package-action-buttons">
					<FormWrapper 
					showFooter={true} 
					buttonLeft = {this.props.buttonLeft} 
					onSaveAndClose={this.onSaveAndClose} 
					onCancel={this.onCancel}
					showSaveClose={false}
					>
						{content}
					</FormWrapper>
			</div>
		)

	}
}
const ProductForm =createForm()(Productplug);
export default ProductForm;

