import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
// common 
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../components/Select'; // 下拉
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax} from '../../../services/apiCall';
import {I18n} from "../../../lib/i18n";


export class CreditinsurratePlug extends Component{

	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		var that = this;

		// event func
		this.handleCertificate = this.handleCertificate.bind(this);
		this.handleCurrency = this.handleCurrency.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		// state init
		this.state = {
			certificate: [{id:1,localName:''}],
			currency: [{id:1,localName:''}]						
		}
	}

	componentDidMount(){
		console.log('sometimes ever sometines never'); 
		// this.handleCertificate();
    };
	componentWillUnmount() {
	}

	getData(value,that){
		this.addSelect = that;
	}
	onSaveAdd(){
		this.onSaveAndClose(true);
	}
	// 保存
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				if(this.props.DialogContent == 1){
					let params = this.props.form.getFieldsValue();
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.props.checkedData,isAdd);
				}

				
			}
		})
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}

	// 证书名称 ajax
	handleCertificate(e){

		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.certificate,
			(response)=>{							
				this.setState({	certificate:response.data });
			},(errors)=>{
				ServiceTips({text:errors,type:'error'});
		});
	}

	// 币种 ajax 
	handleCurrency(){
		
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.currency,
			(response)=>{							
				this.setState({	currency:response.data });
			},(errors)=>{
				ServiceTips({ text:errors.message,type:'error' });
		});
	}

	render(){
		let that = this;
		const { getFieldProps, getNFieldProps, getFieldError } = this.props.form;
		let {checkedData} = this.props;
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
           <div className={'addnormal'} style={{marginBottom:'10px'}}>
           	<div className={'  girdlayout'}>
				<div className="row">
					<div  className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(500070/*证书名称*/)}</label>
						<Select 
							{...getNFieldProps('certifctId',{
								rules: [{required:true}],
								initialValue:undefined
							})}
							placeholder=''
							optionLabelProp="children"
							className ={getFieldError('certifctId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}							
							onClick={this.handleCertificate}
						>	
							{this.state.certificate.map((o,i)=><Option key={i} objValue={{s_label:o.localName, certifctId: o.id, certifctLcName:o.localName, certifctEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
					<div  className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(200076/*证书费用*/)}</label>
						<input  type='text' 
							{...getFieldProps('cardAgg',{
								rules: [{required:true,pattern:xt.pattern.positiveNonZero}],
								initialValue:''
							})}
							placeholder=''
							className ={getFieldError("cardAgg") ?'col-md-9 col-lg-9 text-input-nowidth error-border' :'col-md-9 col-lg-9 text-input-nowidth'}
						/>
					</div>
				</div>
				<div className="row">
					<div  className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100284/*币种*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('cnyId',{
								rules: [{required:true}],
								initialValue:undefined								
							})}
							optionLabelProp="children"
							onClick={this.handleCurrency}
							className ={getFieldError('cnyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
						>
							{this.state.currency.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
					<div  className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100286/*生效日期*/)}</label> 
						<div className={'col-md-9 col-lg-9 datetime'}>
							<Calendar width={'100%'}   showTime = {false} isShowIcon={true} form={this.props.form} 
							validate={true}						
							name={'sDate'}
							
							/>
						</div>
					</div>
				</div>
				<div className="row">
					<div  className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100288/*发布日期*/)}</label>
						<div className={'col-md-9 col-lg-9 datetime'}>
							<Calendar width={'100%'} showTime = {false} 
							isShowIcon={true} form={this.props.form} 
							validate={true}
							name={'reDate'}
												
							/> 
						</div>
					</div>
					<div  className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(500120/*终止日期*/)}</label>
						<div className={'col-md-9 col-lg-9 datetime'}>
							<Calendar width={'100%'}  showTime = {false} isShowIcon={true} form={this.props.form}
							validate={true}
							name={'eDate'}
																		
							/>
						</div>
					</div>
				</div>
           	</div>
			
           	</div>);
		}else if(this.props.DialogContent==3){
			 content = (
           <div className={'addnormal'} style={{marginBottom:'10px'}}>
           	<div className={'  girdlayout'}>
				<div className="row">
					<div  className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(500070/*证书名称*/)}</label>
						<Select 
							{...getNFieldProps('certifctId',{
								rules: [{required:true}],
								initialValue: checkedData['certifctId'] ? 
												{ s_label: checkedData['certifct'+language], certifctId: checkedData.certifctId, certifctLcName: checkedData.certifctLcName, certifctEnName: checkedData.certifctEnName } 
												: 
												undefined
							})}
							placeholder=''
							optionLabelProp="children"
							className ={getFieldError('certifctId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}							
							onClick={this.handleCertificate}
						>	
							{this.state.certificate.map((o,i)=><Option key={i} objValue={{s_label:o.localName, certifctId: o.id, certifctLcName:o.localName, certifctEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
					<div  className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(200076/*证书费用*/)}</label>
						<input  type='text' 
							{...getFieldProps('cardAgg',{
								rules: [{required:true,pattern:xt.pattern.positiveNonZero}],
								initialValue: checkedData['cardAgg'] ? checkedData['cardAgg'] : ''
							})}
							placeholder=''
							className ={getFieldError("cardAgg") ?'col-md-9 col-lg-9 text-input-nowidth error-border' :'col-md-9 col-lg-9 text-input-nowidth'}
						/>
					</div>
				</div>
				<div className="row">
					<div  className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100284/*币种*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('cnyId',{
								rules: [{required:true}],
								initialValue: checkedData['cnyId'] ? 
												{ s_label: checkedData['cny'+language], cnyId: checkedData.cnyId, cnyLcName: checkedData.cnyLcName, cnyEnName: checkedData.cnyEnName } 
												: 
												undefined								
							})}
							optionLabelProp="children"
							onClick={this.handleCurrency}
							className ={getFieldError('cnyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
						>
							{this.state.currency.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
					<div  className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100286/*生效日期*/)}</label> 
						<div className={'col-md-9 col-lg-9 datetime'}>
							<Calendar width={'100%'}   showTime = {false} isShowIcon={true} form={this.props.form} 
							validate={true}						
							name={'sDate'}
							value={checkedData['sDate']}
							/>
						</div>
					</div>
				</div>
				<div className="row">
					<div  className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100288/*发布日期*/)}</label>
						<div className={'col-md-9 col-lg-9 datetime'}>
							<Calendar width={'100%'} showTime = {false} 
							isShowIcon={true} form={this.props.form} 
							validate={true}
							name={'reDate'}
							value={checkedData['reDate']}						
							/> 
						</div>
					</div>
					<div  className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(500120/*终止日期*/)}</label>
						<div className={'col-md-9 col-lg-9 datetime'}>
							<Calendar width={'100%'}  showTime = {false} isShowIcon={true} form={this.props.form}
							validate={true}
							name={'eDate'}
							value={checkedData['eDate']}												
							/>
						</div>
					</div>
				</div>
           	</div>
			
           	</div>);
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
								optionLabelProp={'childern'}
								getPopupContainer={this.getPopupContainer}
						    >
							   	<Option value={'111111'}>11</Option>
							</Select>
				</div>
			)
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} 
					buttonLeft = {this.props.buttonLeft} 
					onSaveAndClose={this.onSaveAndClose} 
						onSaveAdd={this.onSaveAdd}
					    showSaveAdd={this.props.showSaveAdd}
					    showSaveClose={this.props.showSaveClose}
					onCancel={this.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(CreditinsurratePlug);
export default ProductForm;
