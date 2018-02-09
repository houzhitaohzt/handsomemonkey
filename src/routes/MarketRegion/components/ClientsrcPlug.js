import React, { Component,PropTypes } from 'react';
import {I18n} from "../../../lib/i18n";
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { ConstVirtualSelect,Option } from '../../../components/Select';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Input from '../../../components/FormValidating/FormValidating';


//引入弹层
import Dialog from '../../../components/Dialog/Dialog';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../services/apiCall";
import ServiceTips from "../../../components/ServiceTips";//提示框


export class Clientsrcplug extends Component{
	constructor(props){
		super(props);

        this.state={
			dataOne:{}, // get One 
        }
	}

	componentDidMount(){
		this.getPage();
    }
	
	// save
	onSaveAndClose = ()=> {
		const {form,checkedData={},onSaveAndClose,onCancel} = this.props;

		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_DS,'/saleArea/save',Object.assign({},{id:checkedData['id'],optlock:checkedData['optlock']},value),
					(response)=>{
						 ServiceTips({text:response.message,type:'success'});
						 this.props.form.resetFields();
						 onSaveAndClose();
						 onCancel();						 
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				})							
			}
		})
	}

	// cancel
	onCancel = ()=> {
		this.props.onCancel();
		this.props.form.resetFields();
	}

	// get one 
	getPage = ()=> {
		let that = this;
		let {checkedData} = this.props;

		if(!checkedData) return; // 新增

		apiGet(API_FOODING_DS,'/saleArea/getOne',{id:checkedData['id']},
			(response)=>{
				that.setState({
					dataOne: response['data']
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	render(){
		let that = this;
		let {dataOne} = this.state;
		const { getFieldProps, getFieldError } = this.props.form;
		let {checkedData} = this.props;

		console.log( dataOne );
		return (
			<div className="package-action-buttons">
				<FormWrapper 
					showFooter={true} 
					buttonLeft = {this.props.buttonLeft} 
					onSaveAndClose={this.onSaveAndClose} 
					onCancel={this.onCancel}
					showSaveClose={this.props.showSaveClose}
				>
					<div className={'addnormal scroll'}>
							<div className={'girdlayout'}>
								<div className={'row'}>
									<div className="form-group col-md-12">
										<label className={'col-md-3'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
										<input  
											type="text"
											{...getFieldProps('name',{
												rules: [{required:true}],
												initialValue:dataOne['name'] || ''
											})}
											className={getFieldError("name") ?'col-md-8 text-input-nowidth error-border':'col-md-8 text-input-nowidth'} 
										/>
									</div>							
								</div>
								<div className={'row'}>
									<div className="form-group col-md-12">
										<label className={'col-md-3'}><span>*</span>{I18n.t(100087/*国家*/)}</label>
										<ConstVirtualSelect
											className={'col-md-8'} 
											form={this.props.form}
											apiType={apiPost}
											apiParams={{obj: 'com.fooding.fc.ds.entity.Country'}}
											fieldName='cntryId'
                        					initialValue={(dataOne.countries || []).map(o=>o['id'])}										
											initValueOptions={(dataOne.countries || []).map(o=>({name:o['localName'],id:o['id']}))}										
											pageSize={11}
											multi={true}
											rules={true}
										/>
									</div>
								</div>								
								<div className={'row'}>
									<div className="form-group col-md-12">
										<label className={'col-md-3'}>{I18n.t(100336/*备注*/)}</label>
										<input  
											type="text"
											{...getFieldProps('mark',{
												initialValue:dataOne['mark'] || ''
											})}
											className={'col-md-8 text-input-nowidth'} 
										/>
									</div>
								</div>	
							</div>
					</div>
				</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(Clientsrcplug);
export default ProductForm;
