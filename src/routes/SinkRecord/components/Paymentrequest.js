import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';

import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';


// common 
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option ,ConstMiniSelect} from '../../../components/Select'; // 下拉
import xt from '../../../common/xt';


// ajax
import {getUser,apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';
export class Productplug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
	}
	getData(value,that){
		this.addSelect = that;
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
                apiPost(API_FOODING_ERP,'/foreexchange/payapply',value,
					(response)=>{
						this.setState({
							data:response.data
						});
						this.props.onCancel();
						window.navTabs.open(i18n.t(200842/*付款申请编辑*/), 'paymentApplication/addEidt', {id:response.data});
		               // window.location.href ='/purchasequote/add?'+'id='+value.billId
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});


			}
		})
	}

	onCancel(){
		const {form, onCancel} = this.props;
		this.props.onCancel();
		this.props.form.resetFields();
	}
	onClick(){

	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps} = this.props.form;
		let {checkedData} = this.props;
		let content = <div></div>;
		getFieldProps('billId',{
								initialValue:checkedData.billId
		})

			content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500200/*退款金额*/)}</label>
								<input  type="text" className={'col-md-8 col-lg-8 text-input-nowidth'}
		                               {...getFieldProps('refundAmt', {
		                                   validateFirst: true,
		                                   rules: [{required: true,}],
		                                   initialValue: '',
		                               })}
		                        />
							</div>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(500125/*货币*/)}</label>
								<ConstMiniSelect form={this.props.form}
													 pbj={{
                                                         apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                         params: {obj:'com.fooding.fc.ds.entity.Curren'}
                                                     }} fieldName="cnyId"
													 initValueOptions={[]}
													 optionValue={(da, di) => <Option key={di} objValue={{
                                                         cnyId: da.id,
                                                         cnyLcName: da.localName,
                                                         cnyEnName: da.name,
                                                         s_label: da.localName
                                                     }}>{da.localName}</Option>} reles={true}
													 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
									/>


							</div>
							
						</div>
						

					</div>
			</div>
           	);
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true}
							onSaveAndClose={this.onSaveAndClose.bind(this)} onCancel={this.onCancel}
							>
								{content}
							</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(Productplug);
export default ProductForm;

