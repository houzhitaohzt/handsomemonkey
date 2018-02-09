import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option } from 'rc-select';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import Calendar from  '../../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
export class FclPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
	}
	getData(value,that){
		this.addSelect = that;
	}
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_ERP,'/receipt/gathering',value,
					(response)=>{							
						ServiceTips({text:response.message,type:'success'});
						that.props.form.resetFields(); // 清除表单
						that.props.onSaveAndClose(); // 关闭弹框
						//this.props.getShou(); // 刷新列表
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})
	}
	onCancel(){
		this.props.onCancel();
		this.props.onSaveAndClose(); // 关闭弹框
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {info} = this.props;
		let content = <div></div>;
		getFieldProps('billId', {
							            	validateFirst: true,
						                    initialValue:info?info.billId:''
		})
		getFieldProps('billId', {
							            	validateFirst: true,
						                    initialValue:info?info.billId:''
		})
		getFieldProps('billId', {
							            	validateFirst: true,
						                    initialValue:info?info.billId:''
		})
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500083/*收款企业*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{info["receiptCc"+language]?info["receiptCc"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200600/*开户银行*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{info.optInfo["bank"+language]?info.optInfo["bank"+language]:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(100500/*银行账号*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{info.optInfo["account"+language]?info.optInfo["account"+language]:''}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(200628/*应收金额*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{info.toReceAmt || ''}</p>
								</div>
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200629/*已收金额*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{info.recedAmt}</p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200630/*余额*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{info.toReceAmt-info.recedAmt}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200631/*银行费用*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<input type="text" {...getFieldProps('receiptCostList[0].costagg', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:''
						         })} className="text-input" style={{marginRight:15}}/>
							</div>
						</div>
					</div>
					</div>
				</div>
           	);
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(FclPlug);
export default ProductForm;
