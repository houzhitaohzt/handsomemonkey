import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
import Select, { Option } from '../../../components/Select';//引入select插件
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
export class FclPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
	}
	getData(value,that){
		this.addSelect = that;
	}
	render(){

		console.log(this.props);
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {checkedData} = this.props;
		getFieldProps('normal', {
		      initialValue: '0',
		 });
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
           	<div className="packageplug-add scroll">
           									<div className="package-add-line1">
												<div>
													<label><span>*</span>{i18n.t(500121/*费用名称*/)}</label>
													<Select
														{...getFieldProps('11',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:''
														})}
														style={{width:300,marginRight:15}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
												</div>
												<div>
													<label><span>*</span>{i18n.t(500125/*货币*/)}</label>
													<Select
														{...getFieldProps('11',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:''
														})}
														style={{width:300,marginRight:15}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
												</div>
											</div>
											<div className="package-add-line1">
												<div>
													<label><span>*</span>{i18n.t(500050/*付款企业*/)}</label>
													<Select
														{...getFieldProps('11',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:''
														})}
														style={{width:300,marginRight:15}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
												</div>
												<div>
													<label><span>*</span>{i18n.t(200319/*计算金额*/)}</label>
													<Select
														{...getFieldProps('11',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:''
														})}
														style={{width:300,marginRight:15}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
												</div>
											</div>
											<div className="package-add-line1">
												<div>
													<label><span>*</span>{i18n.t(200320/*收款机构*/)}</label>
													<Select
														{...getFieldProps('11',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:''
														})}
														style={{width:300,marginRight:15}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
												</div>
												<div>
													<label><span>*</span>{i18n.t(200321/*实际金额*/)}</label>
													<Select
														{...getFieldProps('11',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:''
														})}
														style={{width:300,marginRight:15}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
												</div>
											</div>
											
											<div className="package-add-line1">
												<div>
													<label><span>*</span>{i18n.t(100133/*支付条款*/)}</label>
													<Select
														{...getFieldProps('11',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:''
														})}
														style={{width:300,marginRight:15}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
												</div>
												<div>
													<label><span>*</span>{i18n.t(400008/*销售单号*/)}</label>
													<Select
														{...getFieldProps('11',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:''
														})}
														style={{width:300,marginRight:15}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
												</div>
											</div>
           	</div>
           	);
		}else if(this.props.DialogContent==3){
			   content = (
			   	<div className="packageplug-edit scroll">
			   								<div className="package-add-line1">
												<div>
													<label>{i18n.t(400008/*销售单号*/)}</label>
													<Select
														{...getFieldProps('11',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:checkedData.mtransport
														})}
														style={{width:300,marginRight:15}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
												</div>
											</div>
											<div className="package-add-line1">
												<div>
													<label>{i18n.t(500143/*集团组织*/)}</label>
													<Select
														{...getFieldProps('11',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:''
														})}
														style={{width:300,marginRight:15}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
												</div>
												<div>
													<label><span>*</span>{i18n.t(100244/*企业*/)}</label>
													<Select
														{...getFieldProps('11',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:''
														})}
														style={{width:300,marginRight:15}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
												</div>
											</div>
											<div className="package-add-line1">
												<div>
													<label><span>*</span>{i18n.t(500144/*营运组织*/)}</label>
													<Select
														{...getFieldProps('11',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:''
														})}
														style={{width:300,marginRight:15}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
												</div>
												<div>
													<label><span>*</span>{i18n.t(200312/*物流员*/)}</label>
													<Select
														{...getFieldProps('11',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:''
														})}
														style={{width:300,marginRight:15}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
												</div>
											</div>
				</div>
			)
		}else if(this.props.DialogContent==4){
			content = (
				<div className='scroll lose'>
							<span>
								<i>*</i>
								失效原因
							</span>
							<Select
								placeholder={''}
								style={{width: 450}}
								getPopupContainer={this.getPopupContainer}
						    >
							   	<Option value={'111111'}>11</Option>
							</Select>
				</div>
			)
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.props.onSaveAndClose} onCancel={this.props.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(FclPlug);
export default ProductForm;
