import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, {ConstMiniSelect, Option,ConstVirtualSelect} from '../../../../../components/Select';
//引入弹层
import Dialog from '../../../../../components/Dialog/Dialog';
//引入时间插件
import DataTime from '../../../../../components/Calendar/Calendar';
import {I18n} from '../../../../../lib/i18n';
import {API_FOODING_DS, API_FOODING_ES, apiGet,apiPost} from "../../../../../services/apiCall";
import fieldsFormat from '../../../../../common/FieldsFormat';

import xt from '../../../../../common/xt';
import InputBoxCheck from '../../../../../components/InputBoxCheck';

export class  Dialog1 extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.nativeClick = this.nativeClick.bind(this);
        this.data ={};
        this.state ={
        /*	clustersDate:[], //集团
        	companiesData:[], //企业
        	staffData:[] //分管人*/
        }
        this.onCancelSecond = this.onCancelSecond.bind(this);
        this.upload = this.upload.bind(this);
	}
	upload(){
		this.onCancel();
		this.props.upload();
	}
	nativeClick = () => {
		let content=require('../../../../MenuSetting/components/MoreLanguageSetDialog').default;
		let element=React.createElement(content,{onSaveAndClose:this.upload,
			menusetView:this.props.initData.customer,
			apiHost:API_FOODING_DS,
			object:'customer',
			onCancel:this.onCancelSecond})
    	this.setState({
    		showDilaogsecond : true,
    		title: I18n.t(100496/*多语言配置*/),
    		dialogContent: element
    	})
	}
	onCancelSecond = () => {
		this.setState({
			showDilaogsecond:false
		})
	}
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				onSaveAndClose(that.props.form.getFieldsValue(),that.data);
				that.props.form.resetFields();
			}
		})
	}
	onCancel(){
		let that = this;
		const {onCancel} = this.props;
		if(onCancel){
            onCancel();
            that.props.form.resetFields();
        }
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getFieldValue } = this.props.form;
		let {data,initData} = this.props;

        let customerSign = initData;
        let {customer} = initData;

		let content;
        let taxIdenSN = getFieldProps('taxIdenSN', {
            normalize: fieldsFormat.taxIdenSN,
            initialValue: customer? (customer.taxIdenSN?String(customer.taxIdenSN):''): (customerSign.taxIdenSN?String(customerSign.taxIdenSN):'')
        });

        let taxIdenComp = <input type="text" value={taxIdenSN.value} onChange={(...args)=>taxIdenSN.onChange(...args)}
                                 className ={ getFieldError("taxIdenSN") ?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'} placeholder=""/>;
        if(data.name.id == "client-detail-normal"){
			//客户常规
			let {countrys,cstmCrsekts,cstmLevels,cstmTypes,incotms} = initData;
			this.data = Object.assign({},customer,{title:"client-detail-normal"});
			content = (<div className={'girdlayout'}>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100355/*客户名称*/)}</label>
						<InputBoxCheck
							placeholder={I18n.t(201264/*输入后,显示重复客户信息!*/)}
							form={this.props.form}
							fieldName='name'
							apiUri='/customer/searchByNameEnName'
							apiParams={{column:'name'}}
							rules={true}
							initialValue={customer&&customer.name?customer.name:''}
							className={'col-md-9 col-lg-9'}
						/>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100226/*英文名称*/)}</label>
						<InputBoxCheck
							placeholder={I18n.t(400169/*输入后,显示重复英文名称*/)}
							tips={I18n.t(400170/*以下显示重复英文名称*/)}
							form={this.props.form}
							fieldName='enName'
							apiUri='/customer/searchByNameEnName'
							apiParams={{column:'enName'}}
							rules={true}
							isEnName={true}
							initialValue={customer&&customer.enName?customer.enName:''}
							className={'col-md-9 col-lg-9'}
						/>
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100359/*客户等级*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							isRequest={false}
							fieldName="cstmLvId"
							rules
							initValueOptions={cstmLevels}
							initialValue={customer&&customer.cstmLevel?customer.cstmLevel.id:''}
							className="col-md-9 col-lg-9"
						/>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100360/*客户类型*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							isRequest={false}
							fieldName="cstmTypeId"
							rules
							initValueOptions={cstmTypes}
							initialValue={customer&&customer.cstmType?customer.cstmType.id:''}
							className="col-md-9 col-lg-9"
						/>
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100376/*交易条款*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							isRequest={false}
							fieldName="incotmId"
							rules
							initValueOptions={incotms}
							initialValue={customer&&customer.incotm?customer.incotm.id:''}
							className="col-md-9 col-lg-9"
						/>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100087/*国家*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							isRequest={false}
							fieldName="countryId"
							rules
							initValueOptions={countrys}
							initialValue={customer&&customer.country?customer.country.id:''}
							className="col-md-9 col-lg-9"
						/>
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{I18n.t(100358/*税号*/)}</label>
                        {taxIdenComp}
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100362/*客户来源*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							isRequest={false}
							fieldName="cstmSrcId"
							rules
							initValueOptions={cstmCrsekts}
							initialValue={customer&&customer.cstmCrsekt?customer.cstmCrsekt.id:''}
							className="col-md-9 col-lg-9"
						/>
					</div>
				</div>
			</div>)
		}else if(data.name.title == I18n.t(100139/*注册信息*/)){

			this.data = Object.assign({},customerSign,{title:'client-detail-sign'});
			content = (<div className={'addnormal-content girdlayout'} >
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100358/*税号*/)}</label>
                            {taxIdenComp}
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100561/*法人代表*/)}</label>
	                        <input type="text" {...getFieldProps('leglpsn', {
		                            initialValue:customerSign.leglpsn?customerSign.leglpsn:''
		                        })}
		                        className ={ getFieldError("leglpsn") ?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'} placeholder={""}
	                      	/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100563/*成立日期*/)}</label>
							<div className={'col-md-9 col-lg-9 datetime'}>
								<DataTime width={'100%'}  showTime = {false} isShowIcon={true} form={this.props.form} name={'estabDate'} value={customerSign.estabDate} className ={ getFieldError("estabDate") ?'error-border':''} validate={false}/>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-5 col-lg-5'}>{I18n.t(100564/*注册资本*/)}</label>
	                        <input type="text" {...getFieldProps('regCapital', {
		                            initialValue:customerSign.regCapital?customerSign.regCapital:'',
									rules: [{pattern: xt.pattern.positiveNonZero}],
		                        	})}
	                        	className ={ getFieldError("regCapital") ?'col-md-7 col-lg-7 text-input-nowidth error-border':'col-md-7 col-lg-7 text-input-nowidth'} placeholder={""}
	                        />
						</div>
						<div className="form-group col-md-2 col-lg-2">
							<label className={'col-md-1 col-lg-1'}></label>
	                       <ConstVirtualSelect
								form={this.props.form}
								fieldName="regCapitalCurrenId"
								apiType={apiPost}
								apiParams={'com.fooding.fc.ds.entity.Curren'}
								initValueOptions={console.log(customerSign&&customerSign.regCapitalCurren) || customerSign&&customerSign.regCapitalCurren?[{id:customerSign.regCapitalCurren.id,localName:customerSign.regCapitalCurren.localName}]:[]}
								initialValue={customerSign&&customerSign.regCapitalCurren?customerSign.regCapitalCurren.id:''}
								className="col-md-11 col-lg-11"
						/>
						</div>
					</div>
				</div>)

		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
					{content}
					<Dialog width={976} visible={this.state.showDilaogsecond} title={this.state.title}>
						{this.state.dialogContent}
					</Dialog>
				</FormWrapper>
			</div>
			);
	}
}
Dialog1.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
Dialog1.defaultProps ={
	onSaveAndClose(){},
    onCancel(){}
}
const DialogFrom =createForm()(Dialog1);
export default DialogFrom;

/*
<ConstVirtualSelect
	searchPromptText="输入后,显示重复客户信息!"
	form={this.props.form}
	fieldName='name'
	disabledOption={true}
	valueKeys="localName"
	labelKey="localName"
	autoComplete
	async
	apiUri='/customer/search?length=4'
	onChange={this.onProductChange}
	apiParams='keyword'
	initialValue={customer&&customer.name?customer.name:''}
	rules={true}
	className="col-md-9 col-lg-9"
/>
*/
