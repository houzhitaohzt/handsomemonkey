import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../../components/Form";
//引入弹层
import Dialog from '../../../../../components/Dialog/Dialog';
//引入滚动条
import FreeScrollBar from "../../../../Client/List/components/FreeScrollBar";
//引入select插件
import Select, { Option } from 'rc-select';
import {addUpdateRecord,addUpdateJson} from '../../../../../services/client/call';
import {I18n} from '../../../../../lib/i18n';
import Input from '../../../../../components/FormValidating/FormValidating';
import Checkbox from "../../../../../components/CheckBox";
import AddMoreLanguage from "../../../../../components/AddMoreLanguage";
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
	}

	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func,
		initData:PropTypes.object
	}

	initState(){
		return {
			data : {},
		}
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){}
	}
	componentDidMount(){

	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
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
		const {form,data,info} = this.props;
		const { getFieldProps, getFieldError, getNFieldProps} = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:data? data.id:''
			})
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:data? data.optlock:''
			})
			getFieldProps('nameValues', {
							            	validateFirst: true,
						                    initialValue:data? data.nameValues:''
			})
			getFieldProps('name',{
						validateFirst: true,
						initialValue:data? data.name:''
			})
		const inputStar=(<span className={''}>*</span>);
		let dom = (<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text',
													initialValue:data.code,
													classn:'col-md-9 col-lg-9 text-input-nowidth'}}
								/> 
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{I18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'localName',type:'text',
													initialValue:data.localName,
													classn:'col-md-9 col-lg-9 text-input-nowidth'}}
								/>
								<AddMoreLanguage 
								    menusetView={data}
								    object = {'payTrm'}
								    upload={this.props.upload}
								    onCancel ={this.onCancel}
							    />
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{I18n.t(100193/*支付条款分组*/)}</label>
								<Select
											animation='slide-up'
											onClick={this.onClick}
											className ='col-md-9 col-lg-9 currency-btn select-from-currency'
											optionLabelProp="children"
												{...getNFieldProps('payTagTypeId',{
													initialValue:{s_label:data.payTagType.name,payTagTypeId:data.payTagType.id} 
												})}
										>
										{
											info.payTagTypes.map((e,i)=>{
															return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
														})
										}
								</Select> 
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{I18n.t(100190/*信保标识*/)}</label>
								<Checkbox 
									{...getFieldProps('crdPrMark',{
										initialValue:data.crdPrMark
									})}
									checked={this.props.form.getFieldValue("crdPrMark")}
								/>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{I18n.t(100189/*信保分类*/)}</label>
									<Select
											animation='slide-up'
											onClick={this.onClick}
											className ={getFieldError("corpTyId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
											optionLabelProp="children"
												{...getNFieldProps('corpTyId',{
													validateFirst: true,
													rules: [{required:true}],
													initialValue:{s_label:data.corpType.name,corpTyId:data.corpType.id}
												})}
										>
										{
											info.corpTypes.map((e,i)=>{
															return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
														})
										}
								</Select>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}>{I18n.t(100191/*信保天数*/)}</label>
									<input type="text" className='col-md-9 col-lg-9 text-input-nowidth'
										{...getFieldProps('limtDays',{
													initialValue:data.limtDays
										})}
								/>
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{I18n.t(100192/*投保比例*/)}</label>
								<input type="text" className='col-md-9 col-lg-9 text-input-nowidth'
										{...getFieldProps('insurePercent',{
													initialValue:data.insurePercent
										})}
								/> 
							</div>
							<div className="form-group col-md-6">
								<label className={'col-md-3'}>{I18n.t(600237/*银行通知费*/)}</label>
								<Checkbox 
									{...getFieldProps('bankNoticeFee',{
										initialValue:data.bankNoticeFee
									})}
									checked={this.props.form.getFieldValue("bankNoticeFee")}
								/>
							</div>							
						</div>
					</div>
			</div>)
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
					<FreeScrollBar style={{height:"344px"}} className="scroll_style">
						{dom}
					</FreeScrollBar>
			</FormWrapper>);
	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;

