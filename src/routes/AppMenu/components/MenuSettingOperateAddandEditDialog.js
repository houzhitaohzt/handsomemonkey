import i18n from './../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
//引入弹层
import Dialog from '../../../components/Dialog/Dialog';
//引入select插件
import {ConstMiniSelect} from '../../../components/Select';
import {I18n} from '../../../lib/i18n';
import Input  from '../../../components/FormValidating/FormValidating';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS} from '../../../services/apiCall';
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.nativeClick=this.nativeClick.bind(this);
		this.onCancelSecond=this.onCancelSecond.bind(this);
		this.state=this.initState();
		this.uploadData = this.uploadData.bind(this);
	}
	initState(){
		return {
			initData:{},
			showDilaogsecond:false,
			moduleIdSelectArray:[]
		}
	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else {
				this.props.onSaveAndClose(value,this.props.data);
				this.props.form.resetFields();
			}
		})
	}
	onCancel(){
		const {onCancel} = this.props;
		this.props.form.resetFields();
		if(onCancel){
			onCancel();
		}
	}
	uploadData(){
		this.props.upload(this.props.menusetView.id);
		this.onCancel();
	}
	nativeClick(){
		let content=require('./MoreLanguageSetDialog').default;
		let element=React.createElement(content,{onCancel:this.onCancelSecond,
			object:'menu',
			apiHost:API_FOODING_ES,
			onSaveAndClose:this.uploadData,
			menusetView:this.props.menusetView})
    	this.setState({
    		showDilaogsecond : true,
    		title: i18n.t(100496/*多语言配置*/),
    		dialogContent: element
    	})
	}
	onCancelSecond(){
		this.setState({
			showDilaogsecond:false
		})
	}
	onChange(){
	}
	render(){
		const {form,data} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let dom;
		if(data.number == 1){
			 dom = (<div className={'girdlayout'} style={{height:"170px"}}>
						<div className={'row'}>
							<div className="form-group col-xs-12 col-md-12">
								<label className={'col-xs-2 col-md-2'}><i>*</i>{i18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'localName',type:'text',classn:'col-xs-10 col-md-10 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-xs-12 col-md-12">
								<label className={'col-xs-2 col-md-2'}><i>*</i>{i18n.t(200745/*标识*/)}</label>
								<Input form={this.props.form} obj={{name:'identity',type:'text',classn:'col-xs-10 col-md-10 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-xs-12 col-md-12">
								<label className={'col-xs-2 col-md-2'}>URL</label>
								<input type='text' className={'col-xs-10 col-md-10 text-input-nowidth'}
									{...getFieldProps('url',{
										initialValue:''
									})} />
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-xs-12 col-md-12">
								<label className={'col-xs-2 col-md-2'}><i>*</i>{i18n.t(200747/*所属系统*/)}</label>
								<ConstMiniSelect form={this.props.form}
																						 pbj={{
																								 apiType: apiPost, host: API_FOODING_DS, uri:'/object/getList',
																								 params: {obj:'com.fooding.fc.enumeration.Module'}
																						 }} fieldName="moduleId"
																						 initValueOptions={[]}
																						 optionValue={(da, di) => <Option key={di} objValue={{
																								 moduleId: da.id,
																								 s_label: da.name
																						 }}>{da.name}</Option>}
																						 className='currency-btn select-from-currency col-xs-10 col-md-10'

																/>
							</div>
						</div>
					</div>)
		}else if(data.number == 0){
			dom = (<div className={'girdlayout'} style={{height:"170px"}}>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12" style={{position:'relative'}}>
							<label className={'col-xs-2 col-md-2'}><i>*</i>{i18n.t(100001/*名称*/)}</label>
							<Input form={this.props.form} obj={{name:'localName',type:'text',
							classn:'col-xs-10 col-md-10 text-input-nowidth',initialValue:data.record.name}}/>
								<i className={'foddingicon fooding-nation_icon'} style={{position:'absolute',top:'9px',right:'10px',cursor:'pointer'}} onClick={this.nativeClick}></i>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-2 col-md-2'}><i>*</i>{i18n.t(200745/*标识*/)}</label>
							<Input form={this.props.form} obj={{name:'identity',type:'text',
							classn:'col-xs-10 col-md-10 text-input-nowidth',initialValue:data.record.identity}}/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-2 col-md-2'}>URL</label>
							<input type='text' className={'col-xs-10 col-md-10 text-input-nowidth'}
									{...getFieldProps('url',{
										initialValue:data.record.url
									})} />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-2 col-md-2'}>{i18n.t(200747/*所属系统*/)}</label>
								<ConstMiniSelect form={this.props.form}
																						 pbj={{
																								 apiType: apiPost, host: API_FOODING_DS, uri:'/object/getList',
																								 params: {obj:'com.fooding.fc.enumeration.Module'}
																						 }} fieldName="moduleId"
																						 initValueOptions={[]}
																						 initialValue={
																							xt.initSelectValue(data.record.moduleId,{maryTypeId:data.record.moduleId,...data.record}, ['moduleId'], 'name', this.props.form)}
																						 optionValue={(da, di) => <Option key={di} objValue={{
																								 moduleId: da.id,
																								 s_label: da.name
																						 }}>{da.name}</Option>}
																						 className='currency-btn select-from-currency col-xs-10 col-md-10'

																/>
						</div>
					</div>
				</div>)
		}

		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} buttonLeft={i18n.t(200043/*确定*/)}>
				{dom}
				<Dialog width={926} visible={this.state.showDilaogsecond} title={this.state.title}>
					{this.state.dialogContent}
				</Dialog>
			</FormWrapper>);
	}
}

const CommonFormSecond = createForm()(CommonForm);

export default CommonFormSecond;
