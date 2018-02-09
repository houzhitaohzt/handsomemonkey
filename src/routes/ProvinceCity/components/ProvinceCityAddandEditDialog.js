import i18n from './../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
//引入弹层
import Dialog from '../../../components/Dialog/Dialog';
//引入select插件
import Select, { Option } from '../../../components/Select';
import {I18n} from '../../../lib/i18n';
import AddMoreLanguage from "../../../components/AddMoreLanguage"; 
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.state=this.initState();
	}
	initState(){
		return {
			initData:{}
		}
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){},
		onSaveAdd(){}
	}
	componentDidMount(){

	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				if(this.props.tempArray){
					this.props.onSaveAndClose(this.props.form.getFieldsValue());
					this.props.form.resetFields();
				}else {
					let value = this.props.form.getFieldsValue();
					delete value.id;
					delete value.optlock;
					delete value.cntryId;
					delete value.parentId;
					this.props.onSaveAndClose(value);
					this.props.form.resetFields();
				}
				
			}
		})
	}
	onSaveAdd(){
		const {onSaveAdd,form} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.onSaveAndClose(this.props.form.getFieldsValue());
				this.props.form.resetFields();
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
		let responseData= otherData;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let dom;
		if(tempArray){
			getFieldProps('id', {
						                              
									
														initialValue:responseData.id
						                            })
			getFieldProps('optlock', {
						                              
									
														initialValue:responseData.optlock
						                            })
			getFieldProps('cntryId', {
						                              
									
														initialValue:responseData.cntryId
						                            })
				getFieldProps('parentId', {
						                              
									
														initialValue:responseData.parentId
						                            })
			dom = (<div className={'girdlayout'} style={{height:"225px"}}>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-1 col-md-1'}>{tempArray[0].key}</label>
							<input type="text"
													 placeholder=''
													{...getFieldProps('code', {
						                               	validateFirst:true,
														rules:[{required:true}],
														valuedateTrigger:'onBlur',
														initialValue:responseData.code?responseData.code:''
						                            })} className={getFieldError('code')?'col-xs-11 col-md-11 text-input-nowidth error-border error-border':'col-xs-11 col-md-11 text-input-nowidth'} />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-1 col-md-1'}>{tempArray[1].key}</label>
							<input type='text' className={'col-xs-11 col-md-11 text-input-nowidth'}
								{...getFieldProps('name',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:responseData.localName?responseData.localName:''

								})} />
								<AddMoreLanguage 
								    menusetView={responseData}
								    object = {'area'}
								    upload={this.props.upload}
								    onCancel ={this.onCancel}
							    />
						</div>
					</div>
					<div className={'row'}>
							<label className={'col-xs-1 col-md-1'}>{tempArray[2].key}</label>
							<textarea
								className={'col-xs-11 col-md-11 textarea'} 
								placeholder=""
								{...getFieldProps('description',{
									validateFirst:true,
									valuedateTrigger:'onBlur',
									initialValue:responseData.description?responseData.description:''
								})}
							></textarea>
					</div>
				</div>)
		}else{
			dom = (<div className={'girdlayout'} style={{height:"225px"}}>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-1 col-md-1'}>{i18n.t(100000/*代码*/)}</label>
							<input type="text"
													 placeholder=''
													{...getFieldProps('code', {
						                               	validateFirst:true,
														rules:[{required:true}],
														initialValue:''
						                            })} className={getFieldError('code')?'col-xs-11 col-md-11 text-input-nowidth error-border error-border':'col-xs-11 col-md-11 text-input-nowidth'} />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-1 col-md-1'}>{i18n.t(100001/*名称*/)}</label>
						<input type="text"
													 placeholder=''
													{...getFieldProps('name', {
						                               	validateFirst:true,
														rules:[{required:true}],
														initialValue:''
						                            })} className={getFieldError('name')?'col-xs-11 col-md-11 text-input-nowidth error-border error-border':'col-xs-11 col-md-11 text-input-nowidth'} />
						</div>
					</div>
					<div className={'row'}>
							<label className={'col-xs-1 col-md-1'}>{i18n.t(100002/*描述*/)}</label>
							<textarea
								className={'col-xs-11 col-md-11 textarea'} 
								placeholder=""
								{...getFieldProps('description',{
									initialValue:''
								})}
							></textarea>
					</div>
				</div>)
		}

		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} showSaveAdd={true} onSaveAdd={this.onSaveAdd}>
				{dom}
			</FormWrapper>);
	}
}

const CommonFormSecond = createForm()(CommonForm);

export default CommonFormSecond;

