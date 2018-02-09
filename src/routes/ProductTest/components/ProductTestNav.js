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
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language} from '../../../services/apiCall';
import {I18n} from "../../../lib/i18n";


export class Productplug extends Component{

	constructor(props){
		super(props);
		this.addSelect;	
		this.getData = this.getData.bind(this);
		this.handleProductType = this.handleProductType.bind(this); // 产品类型
		this.handleItemTest = this.handleItemTest.bind(this); // 测试项目
		this.handleTestMethod = this.handleTestMethod.bind(this); // 测试方法		
		this.handleCurrency = this.handleCurrency.bind(this); // 币种
		this.onSaveAndClose = this.onSaveAndClose.bind(this); // 保存
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		var that = this;
		this.state = {
			productType: [{id:1,localName:''}],
			itemTest: [{id:1,localName:''}],
			testMethod: [{id:1,localName:''}],																																													
			currency: [{id:1,localName:''}],						
		}


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
				console.log(error, value);
			}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.props.checkedData,isAdd);
			}
		})
	}	
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	// 产品类型 ajax 
	handleProductType(){
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.MtlType'},
			(response)=>{							
				this.setState({	productType:response.data });
			},(errors)=>{
				ServiceTips({ text:errors,type:'error' });
		});
	}

	// 测试项目 ajax 
	handleItemTest(){
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.TestItem'},
			(response)=>{							
				this.setState({	itemTest:response.data });
			},(errors)=>{
				ServiceTips({ text:errors,type:'error' });
		});
	}

	// 测试方法 ajax 
	handleTestMethod(){
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.TestMeth'},
			(response)=>{							
				this.setState({	testMethod:response.data });
			},(errors)=>{
				ServiceTips({ text:errors,type:'error' });
		});
	}

	// 币种 ajax 
	handleCurrency(){
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Curren'},
			(response)=>{							
				this.setState({	currency:response.data });
			},(errors)=>{
				ServiceTips({ text:errors,type:'error' });
		});
	}


	render(){
		let that = this;
		const { getFieldProps, getNFieldProps, getFieldError } = this.props.form;
		let {checkedData} = this.props;
		let content = <div></div>;

		getNFieldProps('billId', {
			initialValue: checkedData ? checkedData['billId'] : '',
		});

		getNFieldProps('ccId', {
			initialValue: checkedData ? checkedData['ccId'] : '',
		});

		getNFieldProps('optlock', {
			initialValue: checkedData ? checkedData['optlock'] : '',
		});

		if(this.props.DialogContent == 1){
           content = (
           <div className={'addnormal'} style={{marginBottom:'10px'}}>
           	<div className={'  girdlayout'}>
				<div className="row">
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100403/*产品类型*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('mtltyId',{
								rules: [{required:true}],
								initialValue:undefined							
							})}
							optionLabelProp="children"
							className ={getFieldError('mtltyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
							onClick={this.handleProductType}
						>
							{this.state.productType.map((o,i)=><Option key={i} objValue={{s_label:o.localName, mtltyId: o.id, mtltyLcName:o.localName, mtltyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(500073/*测试项目*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('testPrId',{
								rules: [{required:true}],
								initialValue:undefined							
							})}
							optionLabelProp="children"
							className ={getFieldError('testPrId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
							onClick={this.handleItemTest}
						>
							{this.state.itemTest.map((o,i)=><Option key={i} objValue={{s_label:o.localName, testPrId: o.id, testPrLcName:o.localName, testPrEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
				</div>
				<div className="row">
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100606/*测试方法*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('testMethId',{
								rules: [{required:true}],
								initialValue:undefined								
							})}
							optionLabelProp="children"
							className ={getFieldError('testMethId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
							onClick={this.handleTestMethod}
						>
							{this.state.testMethod.map((o,i)=><Option key={i} objValue={{s_label:o.localName, testMethId: o.id, testMethLcName:o.localName, testMethEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(500122/*标准费用*/)}</label>
						<input  type='text' 
							{...getFieldProps('costAggs',{
								rules: [{required:true,pattern:xt.pattern.positiveNonZero}],
								initialValue:''
							})}
							placeholder=''
							className ={getFieldError("costAggs") ?'col-md-9 col-lg-9 text-input-nowidth error-border' :'col-md-9 col-lg-9 text-input-nowidth'}
						/>
					</div>
				</div>
				<div className="row">
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100284/*币种*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('cnyId',{
								rules: [{required:true}],
								initialValue:undefined
																			
							})}
							optionLabelProp="children"
							className ={getFieldError('cnyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
							onClick={this.handleCurrency}
						>
							{this.state.currency.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100286/*生效日期*/)}</label> 
						<div className={'col-md-9 col-lg-9 datetime'}>
								<Calendar 
									width={'100%'}   
									showTime = {false} 
									isShowIcon={true} 
									form={this.props.form} 
									validate={true}						
									name={'sDate'}
								/>
							</div>
					</div>
				</div>
				<div className="row">
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100288/*发布日期*/)}</label>
						<div className={'col-md-9 col-lg-9 datetime'}>
								<Calendar 
									width={'100%'} 
									showTime = {false} 
									isShowIcon={true} 
									form={this.props.form} 
									validate={true}
									name={'reDate'}					
								/> 
							</div>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(500120/*终止日期*/)}</label>
						<div className={'col-md-9 col-lg-9 datetime'}>
								<Calendar width={'100%'}  
									showTime = {false} 
									isShowIcon={true} 
									form={this.props.form}
									validate={true}
									name={'eDate'}											
								/>
							</div>
					</div>
				</div>
           		</div>
           	</div>
           	);
		}else if(this.props.DialogContent==3){
			  content=(
			  <div className={'addnormal'} style={{marginBottom:'10px'}}>
           	<div className={'  girdlayout'}>
				<div className="row">
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100403/*产品类型*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('mtltyId',{
								rules: [{required:true}],
								initialValue: checkedData['mtltyId'] ? 
												{ s_label: checkedData['mtlty'+language], mtltyId: checkedData.mtltyId, mtltyLcName: checkedData.mtltyLcName, mtltyEnName: checkedData.mtltyEnName } 
												: 
												''								
							})}
							optionLabelProp="children"
							className ={getFieldError('mtltyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
							onClick={this.handleProductType}
						>
							{this.state.productType.map((o,i)=><Option key={i} objValue={{s_label:o.localName, mtltyId: o.id, mtltyLcName:o.localName, mtltyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(500073/*测试项目*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('testPrId',{
								rules: [{required:true}],
								initialValue: checkedData['testPrId'] ? 
												{ s_label: checkedData['testPr'+language], testPrId : checkedData.testPrId , testPrLcName: checkedData.testPrLcName, testPrEnName: checkedData.testPrEnName } 
												: 
												''								
							})}
							optionLabelProp="children"
							className ={getFieldError('testPrId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
							onClick={this.handleItemTest}
						>
							{this.state.itemTest.map((o,i)=><Option key={i} objValue={{s_label:o.localName, testPrId: o.id, testPrLcName:o.localName, testPrEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
				</div>
				<div className="row">
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100606/*测试方法*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('testMethId',{
								rules: [{required:true}],
								initialValue: checkedData['testMethId'] ? 
												{ s_label: checkedData['testMeth'+language], testMethId: checkedData.testMethId, testMethLcName: checkedData.testMethLcName, testMethEnName: checkedData.testMethEnName } 
												: 
												''								
							})}
							optionLabelProp="children"
							className ={getFieldError('testMethId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
							onClick={this.handleTestMethod}
						>
							{this.state.testMethod.map((o,i)=><Option key={i} objValue={{s_label:o.localName, testMethId: o.id, testMethLcName:o.localName, testMethEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(500122/*标准费用*/)}</label>
						<input  type='text' 
							{...getFieldProps('costAggs',{
								rules: [{required:true}],
								initialValue: [{required:true,pattern:xt.pattern.positiveNonZero}],
							})}
							placeholder=''
							className ={getFieldError("costAggs") ?'col-md-9 col-lg-9 text-input-nowidth error-border' :'col-md-9 col-lg-9 text-input-nowidth'}
						/>
					</div>
				</div>
				<div className="row">
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100284/*币种*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('cnyId',{
								rules: [{required:true}],
								initialValue: checkedData['cnyId'] ? 
												{ s_label: checkedData['cny'+language], cnyId: checkedData.cnyId, cnyLcName: checkedData.cnyLcName, cnyEnName: checkedData.cnyEnName } 
												: 
												''								
							})}
							optionLabelProp="children"
							className ={getFieldError('cnyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
							onClick={this.handleCurrency}
						>
							{this.state.currency.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
					<div className="form-group col-md-6 col-lg-6">
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
					<div className="form-group col-md-6 col-lg-6">
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
					<div className="form-group col-md-6 col-lg-6">
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
				<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.props.onCancel}>
					{content}
				</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(Productplug);
export default ProductForm;
