import React, { Component,PropTypes } from 'react';
import i18n from './../../../../lib/i18n';
import {createForm,FormWrapper} from '../../../../components/Form';


//引入select插件
import Select, { ConstVirtualSelect,Option } from '../../../../components/Select';


import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_ERP} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips'; // 提示


import AreaCountry from '../../../Common_component/AreaCountry'; // 国家 地区 


export class Productplug extends Component{
	constructor(props){
		super(props);

	}

	onSaveAndClose =()=> {
		let that = this;
		const {form,getPage,checkedData,onSaveAndClose} = this.props;

		form.validateFields((errors, value) => {
			if(errors){
			}else{	
				apiPost(API_FOODING_ERP,'/purquotation/promote',Object.assign({},{billId:checkedData['billId']},value),
					(response)=>{
						ServiceTips({text:response.message,type:'success'});
						that.onCancel();
						getPage(); // 刷新列表
						window.navTabs.open(i18n.t(600242/*待报价列表*/), '/toQuote/list', {},{refresh: true});
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})
	}

	onCancel =()=> {
		const {form, onCancel} = this.props;
		this.props.onCancel();
		this.props.form.resetFields();
	}

	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps} = this.props.form;
		let {checkedData} = this.props;


		return (
			<div className="package-action-buttons">
				<FormWrapper onSaveAndClose={this.onSaveAndClose.bind(this)} onCancel={this.onCancel} showFooter={true}>				
					<div className={'girdlayout scroll'} style={{height:'298px',maxHeight:'298px'}}>						
						<div className={'row'}>
							<div className="form-group col-md-12">
								<label className={'col-md-3'}><span>*</span>{i18n.t(100087/*国家*/)}</label>
								<div className={'col-md-8'}>
									<AreaCountry 
										form={this.props.form}
										fieldName='countryIds'
										//defaultValue={checkedData['id'] ? [{id:dataOne.country['id'],localName:dataOne.country['localName']}] : []}
										rules={true}
										//disabled={ checkedData['id'] ? true : false}
									/>
								</div>
							</div>							
						</div>	
						<div className={'row'}>
							<div className="form-group col-md-12">
								<label className={'col-md-3'}><span>*</span>{i18n.t(100359/*客户等级*/)}&nbsp;&nbsp;</label>
								<div className={'col-md-8'}>
									<ConstVirtualSelect
										form={this.props.form}
										style={{width:'100%'}}
										fieldName='levels'
										apiType={apiPost}
										pageSize={6}
										apiParams={{
											obj:'com.fooding.fc.ds.entity.CstmLevel'
										}}
										valueKeys={da => ({
											s_label: da.localName,
											id: da.id,
											localName: da.localName
										})}										
										multi={true}
										rules
										//labelKey="staffLocalName"
										//valueKeys='refId'
										// initialValue={data && ('staff_bs' in data) ? (data.staff_bs || []).map(o => o.id): [staff.id]}
										// initValueOptions={data && ('staff_bs' in data) ? (data.staff_bs || []).map(o => ({staffLocalName: o.localName, refId: o.id})): [{staffLocalName: staff.localName, refId: staff.id}]}
										// rules={true}
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
const ProductForm =createForm()(Productplug);
export default ProductForm;
