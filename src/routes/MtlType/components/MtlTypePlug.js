import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option } from '../../../components/Select';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Input from '../../../components/FormValidating/FormValidating';
import AddMoreLanguage from "../../../components/AddMoreLanguage";
import {I18n} from "../../../lib/i18n";
import NameCheck from "../../../components/InputBoxCheck/NameCheck";
export class MtlTypePlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.state ={
			biemingArray:[{}]
		};
		this.addClick = this.addClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
	}
	deleteClick(i){
    	let biemingArray=this.state.biemingArray;
    	biemingArray.splice(i, 1, null);
    	this.setState({
    		biemingArray:biemingArray
    	});
	}
	addClick(){
				let that = this;
				let array = this.state.biemingArray;
				array.push({});
				this.setState({
					biemingArray:array
				})
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
					delete params['nameValues'];
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				}this.props.form.resetFields();


			}
		})
	}
	componentDidMount(){
		let biemingArray = (!this.props.checkedData.alias||this.props.checkedData.alias.length==0)?
		[{}]:this.props.checkedData.alias
		this.setState({
			biemingArray:biemingArray
		});
	}
	onSaveAdd(){
		this.onSaveAndClose(true);
	}
	onCancel(){
		const {form, onCancel} = this.props;
		this.props.onCancel();
		this.props.form.resetFields();
	}

	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {checkedData} = this.props;
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text',
										initialValue:'',
										classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<NameCheck
									form={this.props.form}
									fieldName='localName'
									initialValue={''}
									rules={true}
									className={'col-md-8 col-lg-8'}
								/>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{I18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('description', {
						                                initialValue:''
						                    })} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>CNS</label>
									<input type="text" {...getFieldProps('cns', {
						                                initialValue:''
						                    })} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
								</div>
						</div>
						<div className='row'>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>INS</label>
								<input type="text" {...getFieldProps('ins', {
																					initialValue:''
															})} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>CAS  Number</label>
								<input type="text" {...getFieldProps('casNumber', {
																					initialValue:''
															})} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
							</div>
						</div>
						<div className='row'>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>E  Number</label>
								<input type="text" {...getFieldProps('eNumber', {
																					initialValue:''
															})} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>UN  Number</label>
								<input type="text" {...getFieldProps('unNumber', {
																					initialValue:''
															})} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
							</div>
						</div>
						<div className='row'>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>EC  Number</label>
								<input type="text" {...getFieldProps('ecNumber', {
																					initialValue:''
															})} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
							</div>
						</div>
						{
							this.state.biemingArray.map((e,i)=>{
								  if(e== null) return e;
									return (<div className='row' key={i}>
														<div className="form-group col-md-12 col-lg-12">
															<label className={'col-md-2 col-lg-2'}>{I18n.t(100494/*产品别名*/)}</label>
															<input type="text" {...getFieldProps('alias['+i+']', {
																												initialValue:''
																						})} className={'col-md-4 col-lg-4 text-input-nowidth'}/>
															<div className="form-group col-xs-2 col-md-2">
																	<i className='foddingicon fooding-add-icon3'
																		style={{paddingLeft:'20px'}}
																			onClick={this.addClick.bind(this,i)}></i>
																	{  i==0?'':
																	<i className='foddingicon fooding-delete-icon4'
																		style={{paddingLeft:'20px'}} onClick={this.deleteClick.bind(this,i)}></i>
																	}
															</div>
														</div>
												</div>)
							})
						}

					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.id:''
			})
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.optlock:''
			})
			getFieldProps('nameValues', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.nameValues:''
			})
			getFieldProps('name', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.name:''
			})
			   content = (
			   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text',
										initialValue:checkedData.code,
										classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<NameCheck
									form={this.props.form}
									fieldName='localName'
									initialValue={checkedData?checkedData.localName:''}
									rules={true}
									className={'col-md-8 col-lg-8'}
								/>
								<AddMoreLanguage
								    menusetView={checkedData}
								    object = {'mtlType'}
								     isShowId={true}
								    upload={this.props.upload}
								    onCancel ={this.onCancel}
							    />
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{I18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('description', {
						                                initialValue:checkedData.description,
						                    })} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>CNS</label>
									<input type="text" {...getFieldProps('cns', {
																						initialValue:checkedData.cns?checkedData.cns:''
																})} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
								</div>
						</div>
						<div className='row'>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>INS</label>
								<input type="text" {...getFieldProps('ins', {
																					initialValue:checkedData.ins?checkedData.ins:''
															})} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>CAS  Number</label>
								<input type="text" {...getFieldProps('casNumber', {
																					initialValue:checkedData.casNumber?checkedData.casNumber:''
															})} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
							</div>
						</div>
						<div className='row'>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>E  Number</label>
								<input type="text" {...getFieldProps('eNumber', {
																					initialValue:checkedData.eNumber?checkedData.eNumber:''
															})} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>UN  Number</label>
								<input type="text" {...getFieldProps('unNumber', {
																					initialValue:checkedData.unNumber?checkedData.unNumber:''
															})} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
							</div>
						</div>
						<div className='row'>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>EC  Number</label>
								<input type="text" {...getFieldProps('ecNumber', {
																					initialValue:checkedData.ecNumber?checkedData.ecNumber:''
															})} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
							</div>
						</div>
						{
							this.state.biemingArray.map((e,i)=>{
									if( !e && e !='') return e;
									return (<div className='row' key={i}>
														<div className="form-group col-md-12 col-lg-12">
															<label className={'col-md-2 col-lg-2'}>{I18n.t(100494/*产品别名*/)}</label>
															<input type="text" {...getFieldProps('alias['+i+']', {
																												initialValue:typeof(e) != 'object' ? e:''
																						})} className={'col-md-4 col-lg-4 text-input-nowidth'}/>
															<div className="form-group col-xs-2 col-md-2">
																	<i className='foddingicon fooding-add-icon3'
																		style={{paddingLeft:'20px'}}
																			onClick={this.addClick.bind(this,i)}></i>
																	{  i==0?'':
																	<i className='foddingicon fooding-delete-icon4'
																		style={{paddingLeft:'20px'}} onClick={this.deleteClick.bind(this,i)}></i>
																	}
															</div>
														</div>
												</div>)
							})
						}

					</div>
			</div>
			)
		}else if(this.props.DialogContent==5){
			content = (
				<div className={'girdlayout scroll'} style={{overflow:'auto'}}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100000/*代码*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p>{checkedData?checkedData.code:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100001/*名称*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p>{checkedData?checkedData.localName:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100002/*描述*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p>{checkedData?checkedData.description:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>CNS</label>
							<div className={'col-md-8 col-lg-8'}>
								<p>{checkedData?checkedData.cns:''}</p>
							</div>
						</div>

					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>INS</label>
							<div className={'col-md-8 col-lg-8'}>
								<p>{checkedData?checkedData.ins:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>CAS  Number</label>
							<div className={'col-md-8 col-lg-8'}>
								<p>{checkedData?checkedData.casNumber:''}</p>
							</div>
						</div>

					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>E  Number</label>
							<div className={'col-md-8 col-lg-8'}>
								<p>{checkedData?checkedData.eNumber:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>UN  Number</label>
							<div className={'col-md-8 col-lg-8'}>
								<p>{checkedData?checkedData.unNumber:''}</p>
							</div>
						</div>

					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>EC  Number</label>
							<div className={'col-md-8 col-lg-8'}>
								<p>{checkedData?checkedData.ecNumber:''}</p>
							</div>
						</div>
					</div>
					{
							this.state.biemingArray.map((e,i)=>{
									if(e==null) return e;
									return (<div className='row' key={i}>
														<div className="form-group col-md-12 col-lg-12">
															<label className={'col-md-2 col-lg-2'}>{I18n.t(100494/*产品别名*/)}</label>
															<div className={'col-md-4 col-lg-4'}>
																	<p>{typeof(e) != 'object' ? e:''}</p>
															</div>

														</div>
												</div>)
							})
					}
				</div>
			)
		}

		return (
			<div className="package-action-buttons">
					<FormWrapper
					showFooter={true}
					buttonLeft = {this.props.buttonLeft}
					onSaveAndClose={this.onSaveAndClose}
					onCancel={this.onCancel}
					onSaveAdd={this.onSaveAdd}
					showSaveAdd={this.props.showSaveAdd}
					showSaveClose={this.props.showSaveClose}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(MtlTypePlug);
export default ProductForm;
