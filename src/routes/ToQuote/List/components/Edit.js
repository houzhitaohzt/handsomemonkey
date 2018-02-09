import React, { Component,PropTypes } from 'react';
import i18n from './../../../../lib/i18n';
import {createForm,FormWrapper} from '../../../../components/Form';


//引入select插件
import Select, { ConstVirtualSelect,Option } from '../../../../components/Select';


import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_ERP} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips'; // 提示




export class Productplug extends Component{
	constructor(props){
		super(props);

	}

	onSaveAndClose =()=> {
		let that = this;
		const {form,checkedData,getPage,onSaveAndClose} = this.props;

		form.validateFields((errors,value) => {
			if(errors){
			}else{	

				apiPost(API_FOODING_ERP,'/promotequote/save',Object.assign({},{id:checkedData['id']},value),
					(response)=>{
						ServiceTips({text:response.message,type:'success'});
						that.onCancel();
						getPage(); // 刷新列表
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})
	}

	onCancel =()=> {
		const {form,onCancel} = this.props;
		this.props.onCancel();
		this.props.form.resetFields();
	}

	render(){
		let that = this;
		let {checkedData,active} = this.props;
		let {countries=[],levels=[]} = checkedData;
		const {getFieldProps, getFieldError, getNFieldProps} = this.props.form;

		
		return (
			<div className="package-action-buttons">
				<FormWrapper showSaveClose={active=='edit'} onSaveAndClose={this.onSaveAndClose.bind(this)} onCancel={this.onCancel} showFooter={true}>				
					<div className={'scroll'} style={{margin:0,overflowX:'hidden',height:'370px',overflowY:'auto'}}>
						<div className="row" style={{padding:0}}>
							<div className={'col-md-6'}>
								<label><span style={{color:'red'}}>*</span>{i18n.t(100087/*国家*/)}&nbsp;&nbsp;</label>
								<ConstVirtualSelect
									form={this.props.form}
									fieldName='countries'
									apiType={apiPost}
									apiParams={{
										obj:'com.fooding.fc.ds.entity.Country'
									}}
									valueKeys={da => ({
										s_label: da.localName,
										id: da.id,
										localName: da.localName
									})}		
									initialValue={countries.map(o=>({id:o['id'],localName:o['localName'],s_label:o['localName']}))}																
									disabled={active == 'detail'}
									multi={true}
									rules
								/>
							</div>
							<div className={'col-md-6'}>
								<label><span style={{color:'red'}}>*</span>{i18n.t(100359/*客户等级*/)}&nbsp;&nbsp;</label>
								<ConstVirtualSelect
									form={this.props.form}
									fieldName='levels'
									apiType={apiPost}
									apiParams={{
										obj:'com.fooding.fc.ds.entity.CstmLevel'
									}}
									valueKeys={da => ({
										s_label: da.localName,
										id: da.id,
										localName: da.localName
									})}										
									initialValue={levels.map(o=>({id:o['id'],localName:o['localName'],s_label:o['localName']}))}																
									disabled={active == 'detail'}
									multi={true}
									rules
								/>
							</div>							
						</div>
					</div>
				</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(Productplug);
export default ProductForm;
