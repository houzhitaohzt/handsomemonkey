import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option , ConstVirtualSelect} from 'rc-select';
import Radio from '../../../../../components/Radio';
import AddSelect from '../../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../../components/Dialog/Confirm';
import Calendar from  '../../../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
import Input from '../../../../../components/FormValidating/FormValidating';
import Checkbox from '../../../../../components/CheckBox';
import ProductSelect from '../../../../../components/FindGridSelect';
export class Productplug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.getData = this.getData.bind(this);
		this.productClick = this.productClick.bind(this);
		this.state ={
			info:{},
			infos:[],
			productArray:[]
		}
	}
	getData(value,that){
		this.addSelect = that;
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				if(this.props.DialogContent == 1){
					let params = this.props.form.getFieldsValue();
					delete params['id'];
					delete params['optlock'];
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				}this.props.form.resetFields();

				
			}
		})
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	componentDidMount(){
		var that = this;
		that.productClick();
		let object=Object.assign({},{sourceId:this.props.sourceId,dataTyId:70});
		apiGet(API_FOODING_DS,'/beMtl/getInit',{sourceId:this.props.sourceId,dataTyId:70},(response)=>{
			that.setState({
				info:response.data
			});
		},(errors)=>{

		})
	}
	productClick(e){
		var that = this;
		apiGet(API_FOODING_DS,'/material/search',{keyword:''},
			(response)=>{
				that.setState({
					productArray:response.data
				})
		},(error)=>{

		});
	}
	
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps, getFieldErrorStyle } = this.props.form;
		let {checkedData} = this.props;
		let {info} = this.state;
		info.vendorContacts = info.vendorContacts ||[];
		let content = <div></div>;
		getFieldProps('dataTyId', {
		      initialValue: 70,
		 });
		 getFieldProps('sourceId', {
		      initialValue: info.sourceId,
		 	});
		if(this.props.DialogContent == 1){
			getFieldProps('sourceId',{
									initialValue:this.props.sourceId,
			});
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
           		<div className={'  girdlayout'}>
           									<div className={'row'}>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100379/*产品*/)}</label>
													<ProductSelect 
														form={this.props.form}
														className={'col-xs-8 col-md-8 text-input-nowidth'}
														
														
														url='/material/search'
														width={'233%'}
														titleClass={'col-xs-8 col-md-8'}
													/>
										            
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-xs-4 col-md-4'}>{i18n.t(200976/*供应商产品编码*/)}</label>
													
													<input type="text" className='col-xs-8 col-md-8 text-input-nowidth'
														{...getFieldProps('beMtlCode',{
																	initialValue:'',
														})}
														
													/>
												</div>
											</div>
											<div className={'row'}>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200977/*供方销售员*/)}</label>
													<Select
															animation='slide-up'
															onClick={this.onClick}
															placeholder=''
															className ={ getFieldError("saleContactorId") ?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
															optionLabelProp="children"
															{...getNFieldProps('saleContactorId',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue:''
															})}
															>
															{
																info.vendorContacts.map((e,i)=>{
																	return  <Option value={e.id+""} title={e.name} key={i}>{e.localName}</Option>
																})
															}
													</Select>
												</div>
												<div  className="form-group col-md-6 col-lg-6">
													<label  className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(400081/*产品操作员*/)}</label>
													<Select
															animation='slide-up'
															onClick={this.onClick}
															placeholder=''
															className ={ getFieldError("operContactorId") ?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
															optionLabelProp="children"
															{...getNFieldProps('operContactorId',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue:''
															})}
															>
															{
																info.vendorContacts.map((e,i)=>{
																	return  <Option value={e.id+""} title={e.name} key={i}>{e.localName}</Option>
																})
															}
													</Select>
												</div>
											</div>
											<div className={'row'}>
												<div  className="form-group col-md-6 col-lg-6">
													<label className="col-md-4 col-lg-4"><span>*</span>保质期(天)</label>
													<input type="text" placeholder={i18n.t(200978/*请填写整数*/)} className={getFieldErrorStyle('assurDay','error-border', 'col-xs-8 col-md-8 text-input-nowidth')}
						                                   {...getFieldProps('assurDay', {
						                                       validateFirst: true,
						                                       rules: [{required: true, pattern: xt.pattern.positiveInteger}],
						                                       initialValue:'',
						                                       
						                                   })}
						                                  


						                            />
												</div>
												<div  className="form-group col-md-6 col-lg-6">
													<label className="col-md-4 col-lg-4"><span>*</span>{i18n.t(400077/*境内货源地*/)}</label>
													<Input 
															form={this.props.form} 
															obj={{name:'domestic',type:'text',
															classn:'col-xs-8 col-md-8 text-input-nowidth',
															initialValue:''}}  
													/>
												</div>
												
											</div>

           		</div>
           	</div>
           	);
		}else if(this.props.DialogContent==3){
			getFieldProps('id', {
			      initialValue: checkedData.id,
			 });
			 getFieldProps('optlock', {
			      initialValue: checkedData.optlock,
			 });
			   content = (
			   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
           			<div className={'  girdlayout'}>
           									<div className={'row'}>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100379/*产品*/)}</label>
													<ProductSelect 
														form={this.props.form}
														className={'col-xs-8 col-md-8 text-input-nowidth'}
														value={checkedData.material?{s_label:checkedData.material.localName, mtlId:checkedData.material.id, mtlLcName:checkedData.material.localName, mtlEnName:checkedData.material.name}:undefined}
														
														url='/material/search'
														width={'233%'}
														titleClass={'col-xs-8 col-md-8'}
													/>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-xs-4 col-md-4'}>{i18n.t(200976/*供应商产品编码*/)}</label>
													<input type="text" className='col-xs-8 col-md-8 text-input-nowidth'
														{...getFieldProps('beMtlCode',{
																	initialValue:checkedData.beMtlCode
														})}
														
													/>
												</div>
											</div>
											<div className={'row'}>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200977/*供方销售员*/)}</label>
													<Select
															animation='slide-up'
															onClick={this.onClick}
															placeholder=''
															className ={ getFieldError("saleContactorId") ?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
															optionLabelProp="children"
															{...getNFieldProps('saleContactorId',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue:checkedData.saleContactor?{s_label:checkedData.saleContactor.localName,saleContactorId:checkedData.saleContactor.id}:undefined
															})}
															>
															{
																info.vendorContacts.map((e,i)=>{
																	return  <Option value={e.id+""} title={e.name} key={i}>{e.localName}</Option>
																})
															}
													</Select>
												</div>
												<div  className="form-group col-md-6 col-lg-6">
													<label  className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(400081/*产品操作员*/)}</label>
													<Select
															animation='slide-up'
															onClick={this.onClick}
															placeholder=''
															className ={ getFieldError("operContactorId") ?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
															optionLabelProp="children"
															{...getNFieldProps('operContactorId',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue:checkedData.operContactor?{s_label:checkedData.operContactor.localName,saleContactorId:checkedData.operContactor.id}:undefined
															})}
															>
															{
																info.vendorContacts.map((e,i)=>{
																	return  <Option value={e.id+""} title={e.name} key={i}>{e.localName}</Option>
																})
															}
													</Select>
												</div>
											</div>
											<div className={'row'}>
												<div  className="form-group col-md-6 col-lg-6">
													<label className="col-md-4 col-lg-4"><span>*</span>保质期(天)</label>
													
													<input type="text" placeholder={i18n.t(200978/*请填写整数*/)} className={getFieldErrorStyle('assurDay','error-border', 'col-xs-8 col-md-8 text-input-nowidth')}
						                                   {...getFieldProps('assurDay', {
						                                       validateFirst: true,
						                                       rules: [{required: true, pattern: xt.pattern.positiveInteger}],
						                                       initialValue:checkedData.assurDay || '',
						                                       
						                                   })}
						                                  


						                            />
												</div>
												<div  className="form-group col-md-6 col-lg-6">
													<label className="col-md-4 col-lg-4"><span>*</span>{i18n.t(400077/*境内货源地*/)}</label>
													<Input 
															form={this.props.form} 
															obj={{name:'domestic',type:'text',
															classn:'col-xs-8 col-md-8 text-input-nowidth',
															initialValue:checkedData.domestic || ''}}  
													/>
												</div>
											</div>
           			</div>
           		</div>
           	)
		}else if(this.props.DialogContent==4){
			content = <div className='scroll lose'>
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
const ProductForm =createForm()(Productplug);
export default ProductForm;
 