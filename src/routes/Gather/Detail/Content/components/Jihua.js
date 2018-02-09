import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option } from '../../../../../components/Select';
import DataTime from  '../../../../../components/Calendar/Calendar';
import Radio from '../../../../../components/Radio';
import AddSelect from '../../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../../components/Dialog/Confirm';
import ServiceTips from '../../../../../components/ServiceTips';
import Calendar from  '../../../../../components/Calendar/Calendar';
import Input from '../../../../../components/FormValidating/FormValidating';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
export class AirPricePlug extends Component{
	constructor(props){
		super(props);
		this.state= this.initState(props);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.fundTyClick = this.fundTyClick.bind(this);
	}

	initState = (props = {}) =>{
		return {
			data:{},
			fundTyArray:[]
		}
	};
	fundTyClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.FundType'},
		(response)=>{
				that.setState({
					fundTyArray:response.data
				})
		},(error)=>{

		});
	}
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_ERP,'/receipt/plan/save',value,
					(response)=>{							
						ServiceTips({text:response.message,type:'success'});
						that.props.form.resetFields(); // 清除表单
						that.props.onSaveAndClose(); // 关闭弹框
						this.props.getShou(); // 刷新列表
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})
	}
	onCancel(){
		this.setState({...this.initState()});
		this.props.form.resetFields();
		this.props.onCancel();
		this.props.onSaveAndClose(); // 关闭弹框
	}
	componentDidMount(){
		
	}

	render(){
		let that = this;
		const { getFieldProps, getFieldError ,getNFieldProps} = this.props.form;
		let {info} =this.props
		let element = <div></div>;
		getFieldProps('billId', {
							            	validateFirst: true,
						                    initialValue:info?info.billId:''
		})
		getFieldProps('billDtlId', {
							            	validateFirst: true,
						                    initialValue:info?info.billDtlId:''
		})
		getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:info?info.optlock:''
		})
		getFieldProps('periodNum', {
							            	validateFirst: true,
						                    initialValue:info?info.periodNum:''
		})
		getFieldProps('normalCostFunds', {
							            	validateFirst: true,
						                    initialValue:info?info.normalCostFunds:''
		})
		getFieldProps('overCostFunds', {
							            	validateFirst: true,
						                    initialValue:info?info.overCostFunds:''
		})
		getFieldProps('receAmt', {
							            	validateFirst: true,
						                    initialValue:info?info.receAmt:''
		})
		getFieldProps('lastReceDate', {
							            	validateFirst: true,
						                    initialValue:info?new Date(info.lastReceDate).Format('yyyy-MM-dd'):''
		})
		getFieldProps('sendShippingDate', {
							            	validateFirst: true,
						                    initialValue:info?new Date(info.sendShippingDate).Format('yyyy-MM-dd'):''
		})
		getFieldProps('receDate', {
							            	validateFirst: true,
						                    initialValue:info?new Date(info.receDate).Format('yyyy-MM-dd'):''
		})
		element =(
						<div className={'  girdlayout'}>
							<div className={'row'}>
								                <div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100181/*款项类型*/)}</label>
													<Select
														animation='slide-up'
														
														className ={ getFieldError("fundTyId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
														choiceTransitionName="rc-select-selection__choice-zoom"
														optionLabelProp="children"
														onSelect={this.onSelect}
														onClick={this.fundTyClick}
														{...getNFieldProps('fundTyId',{
															validateFirst: true,
															rules: [{required:true,}],
															initialValue:info["fundTy"+language]?{s_label:info["fundTy"+language], fundTyId:info.fundTyId, fundTyLcName:info.fundTyLcName, fundTyEnName:info.fundTyEnName}:undefined,

														})}
														>
														{this.state.fundTyArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, fundTyId: o.id, fundTyLcName:o.localName, fundTyEnName:o.enName}} title={o.name}>{o.name}</Option>)}
													</Select>
														
												</div>
							</div>
							<div className={'row'}>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}>{i18n.t(200610/*预计收款时间*/)}</label>
													<DataTime 
														isShowIcon={true}
														showTime={false}
														width={'100%'}
														name={'predictReceDate'}
														value={info.predictReceDate}
														form={this.props.form} 
													/>
							
												</div>
							</div>
							<div className={'row'}>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}>{i18n.t(200611/*预计收款金额*/)}</label>
													<Input 
														form={this.props.form} 
														obj={{
															name:'predictReceAmt',
															type:'text',
															initialValue:String(info.predictReceAmt || ''),
															classn:'col-md-9 col-lg-9 text-input-nowidth'}}
 													 />
							
												</div>
							</div>
						</div>
				);
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} 
					onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						{element}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(AirPricePlug);
export default ProductForm;