import i18n from './../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
//引入弹层
import Dialog from '../../../components/Dialog/Dialog';
import Input from '../../../components/FormValidating/FormValidating';
//引入sel ect插件
import Select, { Option,ConstMiniSelect} from '../../../components/Select';
import {I18n} from '../../../lib/i18n';
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
			initData:{}
		}
	}
	componentDidMount(){

	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				delete this.props.menusetView.dataType;
				this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.props.menusetView);
				// this.props.form.resetFields();
			}
		})
	}
	uploadData(){
		this.props.upload(this.props.menusetView.id);
		this.onCancel();
	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
			this.props.form.resetFields();
		}
	}
	nativeClick(){
		let content=require('./MoreLanguageSetDialog').default;
		let element=React.createElement(content,{onCancel:this.onCancelSecond,
			apiHost:API_FOODING_ES,
			onSaveAndClose:this.uploadData,
			object:'menu',
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
	render(){
		const {form,tempArray} = this.props;
		const { getFieldProps, getFieldErrorStyle } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let dom;
		let menusetView = this.props.menusetView || {};
		menusetView.dataType = menusetView.dataType || {};
		if(tempArray){
			dom = (<div className={'girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12" style={{position:'relative'}}>
							<label className={'col-xs-2 col-md-2'}>{tempArray[0].key}</label>
							<input type='text' className={getFieldErrorStyle('localName', 'error-border', 'col-xs-10 col-md-10 text-input-nowidth')}
								placeholder=""
								{...getFieldProps('localName',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:tempArray[0].value
								})} />
								<i className={'foddingicon fooding-nation_icon'} style={{position:'absolute',top:'9px',right:'10px',cursor:'pointer'}} onClick={this.nativeClick}></i>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-2 col-md-2'}>{tempArray[1].key}</label>
							<input type='text' className={getFieldErrorStyle('identity', 'error-border', 'col-xs-10 col-md-10 text-input-nowidth')}
								placeholder=""
								{...getFieldProps('identity',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:tempArray[1].value

								})} />
						</div>
					</div>
					<div className={'row'}>
							<label className={'col-xs-2 col-md-2'}>URL</label>
							<input type='text' className={getFieldErrorStyle('url', 'error-border', 'col-xs-10 col-md-10 text-input-nowidth')}
								placeholder=""
								{...getFieldProps('url',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:tempArray[2].value
								})} />
					</div>
					<div className={'row'}>
							<label className={'col-xs-2 col-md-2'}>{i18n.t(300070/*数据类型*/)}</label>
							<ConstMiniSelect form={this.props.form}
																					 pbj={{
																							 apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
																							 params: {obj:'com.fooding.fc.enumeration.DataType'}
																					 }} fieldName="dataTyId"  allowClear
																					 initialValue={
																						xt.initSelectValue(menusetView.dataType,
																							{dataTyId:menusetView.dataType.id,...menusetView.dataType}, ['dataTyId'],
																							'name', this.props.form)}
																					 optionValue={(da, di) => <Option key={di} objValue={{
																							 dataTyId: da.id,
																							 s_label: da.name
																					 }}>{da.name}</Option>}
																					 className='currency-btn select-from-currency col-xs-10 col-md-10'

							/>
					</div>
				</div>)
		}else{
			dom = (<div className={'girdlayout'}>
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
							<label className={'col-xs-2 col-md-2'}><i>*</i>URL</label>
                        <Input form={this.props.form} obj={{name:'url',type:'text',classn:'col-xs-10 col-md-10 text-input-nowidth'}}/>
					</div>
					<div className={'row'}>
							<label className={'col-xs-2 col-md-2'}>{i18n.t(300070/*数据类型*/)}</label>
							<ConstMiniSelect form={this.props.form}
																					 pbj={{
																							 apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
																							 params: {obj:'com.fooding.fc.enumeration.DataType'}
																					 }} fieldName="dataTyId" allowClear
																					 optionValue={(da, di) => <Option key={di} objValue={{
																							 dataTyId: da.id,
																							 s_label: da.name
																					 }}>{da.name}</Option>}
																					 className='currency-btn select-from-currency col-xs-10 col-md-10'

							/>
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
