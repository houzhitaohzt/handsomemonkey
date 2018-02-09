import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, {Option,ConstMiniSelect } from '../../../../../components/Select';
import Radio from '../../../../../components/Radio';
import Confirm from '../../../../../components/Dialog/Confirm';
import DataTime from '../../../../../components/Calendar/Calendar';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
import xt from '../../../../../common/xt'; // 下拉
export class HexiaoDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.state = {
			amount:"" //已核销金额
		}
	}
	onSaveAndClose(){
		let {form,onSaveAndClose} = this.props;
		form.validateFields((error, value) => {
			if(error){
				//console.log(error, value);
			}else{
				let {getOne = {}} = this.props;
				delete getOne['invoices'];
				delete value['vndBeLcName'];
				let valueone = Object.assign({},getOne,value);
				apiPost(API_FOODING_ERP,"/invoice/verifi",valueone,response => {
					onSaveAndClose();
					ServiceTips({text:response.message,type:'success'})
				},error => ServiceTips({text:error.message,type:'error'}))
			}
    	});
	}
	onSelect = (data,e) => {
		let paperNo = e.props.objValue.paperNo;
		if(!paperNo) return;
		apiGet(API_FOODING_ERP,'/invoice/getVerificedAmt',{paperNo:paperNo},response => {
			let amount = response.data || 0;
			this.setState({amount});
		},error => console.log(error.message))
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		let {getOne = {},valueone ={} ,form} = this.props;
		return (
			<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.props.onCancel}>
				<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'addnormal-title'}>
						<span>{i18n.t(200814/*付款信息*/)}</span>
					</div>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(100312/*供应商*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{valueone['vndBe' + language] || ""}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200589/*付款单号*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{valueone['no'] || ""}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200819/*已付金额*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{(valueone['applyAmt']?(toDecimal(valueone['applyAmt'])) : "0 ") + valueone['cnyEnName']}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200603/*已核销*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{(getOne['veriAmt']?toDecimal(getOne['veriAmt']) : "0 ") + valueone['cnyEnName']}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200604/*未核销*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{(getOne['nonVeriAmt']?toDecimal(getOne['nonVeriAmt']):"0 " ) + valueone['cnyEnName']}</p>
								</div>
							</div>
						</div>
					</div>
					<div className={'addnormal-title'}>
						<span>{i18n.t(200605/*核销信息*/)}</span>
					</div>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(500146/*源单类型*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{getOne.sourceType == 446?i18n.t(200606/*销售发票*/):i18n.t(400060/*采购发票*/)}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(400055/*纸质发票号*/)}</label>
								<Select
		                            animation='slide-up'
		                            className='currency-btn select-from-currency col-md-8 col-lg-8'
		                            choiceTransitionName="rc-select-selection__choice-zoom"
		                            prefixCls="rc-select-filter-header"
		                            optionLabelProp="children"
		                            allowClear
		                            {...getNFieldProps('invoiceId',{
		                            	validateFirst: true,
										rules: [{required:true}],
		                            	initialValue:""
		                            })}
		                            onSelect={this.onSelect}
		                        >
		                            {(getOne.invoices || []).map((o,i)=><Option key={i} objValue={{invoiceId:String(o.billId),vndBeLcName:o.vndBeLcName,orderAmt:o.orderAmt,paperNo:o.paperNo,s_label:o.paperNo}} title={o.paperNo}>{o.paperNo}</Option>)}
		                        </Select>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(100312/*供应商*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{form.getFieldValue('invoiceId',{}).vndBeLcName || ""}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200607/*发票金额*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{(toDecimal(form.getFieldValue('invoiceId',{}).orderAmt) || "0 ") + valueone['cnyEnName']}</p>
								</div>
							</div>	
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200608/*核销金额*/)}</label>
								<input placeholder=''
								   type="text" {...getFieldProps('verifiAmt', {
								   		validateFirst: true,
										rules: [{required:true,pattern:xt.pattern.positiveNonZero}],
						                initialValue:toDecimal(getOne['verifiAmt']) ||""
						            })} 
									className={'col-md-8 col-lg-8 text-input-nowidth'}
								 />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200609/*已核销金额*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{(toDecimal(this.state.amount) || "0 ")  + valueone['cnyEnName']}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</FormWrapper>
		)
	}
}
const HexiaoForm =createForm()(HexiaoDialog);
export default HexiaoForm;
