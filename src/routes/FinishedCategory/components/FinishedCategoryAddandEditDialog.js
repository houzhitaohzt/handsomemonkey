import i18n from './../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
//引入弹层
import Dialog from '../../../components/Dialog/Dialog';
//引入select插件
import Select, { Option } from '../../../components/Select';
import {I18n} from '../../../lib/i18n';
//引入ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import AddMoreLanguage from "../../../components/AddMoreLanguage"; 
class CommonFormOne extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.data = null;
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){},
		onSaveAdd(){}
	}
	componentDidMount(){

	}
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				that.props.onSaveAndClose(that.props.form.getFieldsValue(),this.data);
				that.props.form.resetFields();
			}
		})
	}
	// onSaveAdd(){
	// 	const {form, onSaveAdd} = this.props;
	// 	form.validateFields((errors, value) => {
	// 		if(errors){

	// 		}else{
	// 			this.props.onSaveAndClose(this.props.form.getFieldsValue,this.data);
	// 		}
	// 	})
	// }
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
			this.props.form.resetFields();
		}
	}

	render(){
		const {form,tempArray,initData} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		this.data = Object.assign({},initData);
		let dom = (<div className={'girdlayout'} style={{height:"225px"}}>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-1 col-md-1'}>{i18n.t(100000/*代码*/)}</label>
							<input type='text' className={getFieldError('code')?'col-xs-11 col-md-11 text-input-nowidth error-border':'col-xs-11 col-md-11 text-input-nowidth'} 
								placeholder=""
								{...getFieldProps('code',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:initData?initData.code:''
								})} />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-1 col-md-1'}>{i18n.t(100001/*名称*/)}</label>
							<input type='text' className={getFieldError('localName')?'col-xs-11 col-md-11 text-input-nowidth error-border':'col-xs-11 col-md-11 text-input-nowidth'} 
								placeholder=""
								{...getFieldProps('localName',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:initData?initData.localName:''

								})} />
							<AddMoreLanguage 
								    menusetView={initData}
								    object = {'dataMulDiv1'}
								    upload={this.props.upload}
								    onCancel ={this.onCancel}
							/>
						</div>
					</div>
					<div className={'row'}>
							<label className={'col-xs-1 col-md-1'}>{i18n.t(100002/*描述*/)}</label>
							<textarea
								className={'col-xs-11 col-md-11 textarea'} 
								placeholder=""
								{...getFieldProps('description',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:initData?initData.description:''
								})}
							></textarea>
					</div>
				</div>)	
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
				{dom}
			</FormWrapper>);
	}
}

CommonFormOne = createForm()(CommonFormOne);

export default CommonFormOne;

