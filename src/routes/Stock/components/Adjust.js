import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';

import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';



// common 
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';
import {I18n} from "../../../lib/i18n";


export class StockPlug extends Component{
	constructor(props){
		super(props);

		// init func 
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.handleCurrency = this.handleCurrency.bind(this);
		

		
		// stata init 
		this.state = {
			currency: [{id:1,name:''}], // 币种
		};
		
	}
	
	// 调整方法 ajax 
	handleCurrency(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.currency,
			(response)=>{							
				this.setState({	currency:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}	

	// 保存
	onSaveAndClose(){

		let that = this;
		apiForm(API_FOODING_ERP,'/stockadjust/adjust',Object.assign({billId:that.props.checkedData.id},value),
			(response)=>{	
					ServiceTips({text:response.message,type:'success'});
					that.props.form.resetFields(); // 清除表单
					that.props.onSaveAndClose(); // 关闭弹框
					that.props.getPage();	// 刷新页面
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	// 取消
	onCancel(){
		this.props.form.resetFields(); // 清除表单
		this.props.onCancel(); // 关闭弹框
	}


	render(){
		let that = this;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		let {checkedData} = this.props;

		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} 
						showSaveClose={this.props.showSaveClose}
						buttonLeft = {this.props.buttonLeft} 
						onSaveAndClose={this.onSaveAndClose}
					 	onCancel={this.onCancel}
					>
						<div className="packageplug-add scroll">
							<div className="package-add-line1">
								<div>
									<label><span>*</span>{I18n.t(100284/*币种*/)}</label>
									<Select
										placeholder=''
										{...getNFieldProps('cnyId',{
											rules: [{required:true}],
											initialValue:''								
										})}
										optionLabelProp="children"
										style={{width:300,marginRight:15}}
										className ={'currency-btn select-from-currency'}
										onClick={this.handleCurrency}
									>
										{this.state.currency.map((o,i)=><Option key={o.id} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
									</Select>
								</div>
							</div>				
						</div>	
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(StockPlug);
export default ProductForm;
