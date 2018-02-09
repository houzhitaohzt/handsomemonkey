import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, {Option,ConstMiniSelect } from '../../../../components/Select';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import DataTime from '../../../../components/Calendar/Calendar';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../services/apiCall";
import xt from '../../../../common/xt'; // 下拉
export class HexiaoDialog extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
	}
	onSaveAndClose(){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				this.props.onSaveAndClose(value);
			}
	      	
    	});
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {getOne = {},valueone ={} } = this.props;
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.props.onCancel}>
						<div className={'addnormal'} style={{marginBottom:'10px'}}>
							<div className={'  girdlayout'}>
								<div className={'row'}>
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{i18n.t(100312/*供应商*/)}</label>
										<div className={'col-md-8 col-lg-8'}>
											<p className={'paragraph'}>FOODing</p>
										</div>
									</div>
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{i18n.t(200589/*付款单号*/)}</label>
										<div className={'col-md-8 col-lg-8'}>
											<p className={'paragraph'}>FOODing</p>
										</div>
									</div>
								</div>
								<div className={'row'}>
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{i18n.t(200819/*已付金额*/)}</label>
										<div className={'col-md-8 col-lg-8'}>
											<p className={'paragraph'}>FOODing</p>
										</div>
									</div>
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{i18n.t(200603/*已核销*/)}</label>
										<div className={'col-md-8 col-lg-8'}>
											<p className={'paragraph'}>FOODing</p>
										</div>
									</div>
								</div>
								<div className={'row'}>
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{i18n.t(500146/*源单类型*/)}</label>
										<ConstMiniSelect form={this.props.form}
			                                     pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri:'/bankacct/getList',
                                                     params: {sourceId:getOne.receiptBeId,curcyId:getOne.cnyId}
			                                          }} fieldName="bankId"
	                                                 initValueOptions={[]}
	                                                 initialValue={xt.initSelectValue(getOne["bank"+language], getOne, ['bankId', 'bankLcName', 'bankEnName','accountId','accountLcName','accountEnName'],()=>{
	                                                 	return ''
	                                                 }, this.props.form)}
	                                                 optionValue={(da, di) => <Option key={di} objValue={{
	                                                     bankLcName: da.bankName,
	                                                     bankEnName : da.bankName,
	                                                     accountId :da.bacctCode,
	                                                     accountEnName :da.bacctCode,
	                                                     accountLcName:da.bacctCode,
	                                                     s_label:da.bankName+'+'+da.bacctCode+'+'+da.actStaff+'+'+da.actAddres
	                                                 }}>{da.bankName+'+'+da.bacctCode+'+'+da.actStaff+'+'+da.actAddres}</Option>} reles={true}
	                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
			                            />
									</div>
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{i18n.t(400055/*纸质发票号*/)}</label>
										<ConstMiniSelect form={this.props.form}
			                                     pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri:'/bankacct/getList',
                                                     params: {sourceId:getOne.receiptBeId,curcyId:getOne.cnyId}
			                                          }} fieldName="bankId"
	                                                 initValueOptions={[]}
	                                                 initialValue={xt.initSelectValue(getOne["bank"+language], getOne, ['bankId', 'bankLcName', 'bankEnName','accountId','accountLcName','accountEnName'],()=>{
	                                                 	return ''
	                                                 }, this.props.form)}
	                                                 optionValue={(da, di) => <Option key={di} objValue={{
	                                                     bankLcName: da.bankName,
	                                                     bankEnName : da.bankName,
	                                                     accountId :da.bacctCode,
	                                                     accountEnName :da.bacctCode,
	                                                     accountLcName:da.bacctCode,
	                                                     s_label:da.bankName+'+'+da.bacctCode+'+'+da.actStaff+'+'+da.actAddres
	                                                 }}>{da.bankName+'+'+da.bacctCode+'+'+da.actStaff+'+'+da.actAddres}</Option>} reles={true}
	                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
			                            />
									</div>
								</div>
								<div className={'row'}>
										<div className="form-group col-md-6 col-lg-6">
											<label className={'col-md-3 col-lg-3'}>{i18n.t(200607/*发票金额*/)}</label>
											<div className={'col-md-8 col-lg-8'}>
												<p className={'paragraph'}>FOODing</p>
											</div>
										</div>
										<div className="form-group col-md-6 col-lg-6">
											<label className={'col-md-4 col-lg-4'}>{i18n.t(200608/*核销金额*/)}</label>
											<input placeholder=''
											   type="text" {...getFieldProps('applyAmt', {
									                initialValue:""
									            })} 
												className={'col-md-8 col-lg-8 text-input-nowidth'} 
											 />
										</div>
								</div>
								<div className={'row'}>
									<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-3 col-lg-3'}>{i18n.t(200609/*已核销金额*/)}</label>
										<div className={'col-md-8 col-lg-8'}>
											<p className={'paragraph'}>FOODing</p>
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
const HexiaoForm =createForm()(HexiaoDialog);
export default HexiaoForm;
