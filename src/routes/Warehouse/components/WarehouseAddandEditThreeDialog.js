import i18n from './../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
//引入弹层
import Dialog from '../../../components/Dialog/Dialog';
//引入select插件
import Select, { Option } from '../../../components/Select';
import {I18n} from '../../../lib/i18n';

import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import AddMoreLanguage from "../../../components/AddMoreLanguage"; 
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
		this.huojiaClick = this.huojiaClick.bind(this);
	}
	huojiaClick(){
		let that = this;
		apiGet(API_FOODING_DS,'/shelfType/getList',{},
			(response)=>{
				that.setState({
					huojiaArray:response.data
				});
			},
			(error)=>{

			});
	}
	initState(){
		return {
			initData:{},
			huojiaArray:[],
		}
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){},
		onSaveAdd(){}
	}
	componentDidMount(){
		var that = this;
		this.huojiaClick();
	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				let value= this.props.form.getFieldsValue();
				value =  Object.assign({},value,{slAid:this.props.treeInfo.props.eventKey,slid:this.props.treeInfo.props.label.slid});
				if(this.props.otherData){
					value = this.props.form.getFieldsValue();
					value = Object.assign({},this.props.otherData,value,{slAid:this.props.otherData.slAid,slid:this.props.otherData.slid});
				}
				apiPost(API_FOODING_DS,'/slBin/save',value, 
					(response)=>{
						ServiceTips({text:response.message,type:'sucess'});
						this.props.form.resetFields();
						this.props.onSaveAndClose();
					},(error)=>{
						ServiceTips({text:error.message,type:'error'});
						this.props.form.resetFields();
					});
			}
		})
	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
			this.props.form.resetFields();
		}
	}

	render(){
		const {form,tempArray,otherData} = this.props;
		const { getFieldProps, getFieldError,getNFieldProps} = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let dom;
		if(otherData){
			dom = (<div className={'girdlayout'} style={{height:"310px"}}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100000/*代码*/)}</label>
							<input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'} 
								placeholder=""
								{...getFieldProps('code',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:otherData.code?otherData.code:''
								})} />
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100001/*名称*/)}</label>
							<input type="text"
									placeholder=''
									{...getFieldProps('localName', {
						                    validateFirst:true,
											rules:[{required:true}],
											valuedateTrigger:'onBlur',
											initialValue:otherData.localName?otherData.localName:''
						            })} className={getFieldError('localName')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} />
							<AddMoreLanguage 
								    menusetView={otherData}
								    object = {'slBin'}
								    upload={this.props.onSaveAndClose}
								    onCancel ={this.onCancel}
							/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(201250/*货架类型*/)}</label>
							<Select 
									{...getNFieldProps('slfTyid',{
										    rules: [{required:true}],
										    initialValue:otherData.shelfType?{s_label:otherData.shelfType.localName,slfTyid:otherData.shelfType.id}:undefined
									 })}
									 onSelect={this.jiTuanSelect}
									 placeholder=''
									 optionLabelProp="children"	
									 optionFilterProp="children"
									 allowClear						
									 className ={getFieldError('slfTyid')?'currency-btn select-from-currency col-xs-8 col-md-8 error-border':'currency-btn select-from-currency col-xs-8 col-md-8'}							
								>	
									{this.state.huojiaArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}
							</Select>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(201251/*排*/)}</label>
							<input type="text"
									placeholder=''
									{...getFieldProps('lrow', {
						                    validateFirst:true,
											rules:[{required:true}],
											valuedateTrigger:'onBlur',
											initialValue:otherData.lrow?otherData.lrow:''
						            })} className={getFieldError('lrow')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(201252/*列*/)}</label>
							<input type="text"
									placeholder=''
									{...getFieldProps('lbay', {
						                    validateFirst:true,
											rules:[{required:true}],
											valuedateTrigger:'onBlur',
											initialValue:otherData.lbay?otherData.lbay:''
						            })} className={getFieldError('lbay')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} />
						</div>
					</div>
					<div className={'row'} style={{marginBottom:'10px'}}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(201253/*层*/)}</label>
							<input type="text"
									placeholder=''
									{...getFieldProps('llayr', {
						                    validateFirst:true,
											rules:[{required:true}],
											valuedateTrigger:'onBlur',
											initialValue:otherData.llayr?otherData.llayr:''
						            })} className={getFieldError('llayr')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} />
						</div>
					</div>
				</div>)
		}else{
			let treeInfo = this.props.treeInfo.props.label;
			dom = (<div className={'girdlayout'} style={{height:"310px"}}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100000/*代码*/)}</label>
							<input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'} 
								placeholder=""
								{...getFieldProps('code',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:''
								})} />
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100001/*名称*/)}</label>
							<input type="text"
									placeholder=''
									{...getFieldProps('name', {
						                    validateFirst:true,
											rules:[{required:true}],
											valuedateTrigger:'onBlur',
											initialValue:''
						            })} className={getFieldError('name')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(201250/*货架类型*/)}</label>
							<Select 
									{...getNFieldProps('slfTyid',{
										    rules: [{required:true}],
										    initialValue:undefined
									 })}
									 onSelect={this.jiTuanSelect}
									 placeholder=''
									 optionLabelProp="children"	
									 optionFilterProp="children"
									 allowClear						
									 className ={getFieldError('slfTyid')?'currency-btn select-from-currency col-xs-8 col-md-8 error-border':'currency-btn select-from-currency col-xs-8 col-md-8'}							
								>	
									{this.state.huojiaArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}
							</Select>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(201251/*排*/)}</label>
							<input type="text"
									placeholder=''
									{...getFieldProps('lrow', {
						                    validateFirst:true,
											rules:[{required:true}],
											valuedateTrigger:'onBlur',
											initialValue:''
						            })} className={getFieldError('lrow')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(201252/*列*/)}</label>
							<input type="text"
									placeholder=''
									{...getFieldProps('lbay', {
						                    validateFirst:true,
											rules:[{required:true}],
											valuedateTrigger:'onBlur',
											initialValue:''
						            })} className={getFieldError('lbay')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} />
						</div>
					</div>
					<div className={'row'} style={{marginBottom:'10px'}}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(201253/*层*/)}</label>
							<input type="text"
									placeholder=''
									{...getFieldProps('llayr', {
						                    validateFirst:true,
											rules:[{required:true}],
											valuedateTrigger:'onBlur',
											initialValue:''
						            })} className={getFieldError('llayr')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} />
						</div>
					</div>
				</div>)
		}

		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
				{dom}
			</FormWrapper>);
	}
}

const CommonFormSecond = createForm()(CommonForm);

export default CommonFormSecond;