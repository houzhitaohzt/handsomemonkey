import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import RightKey from '../../../../../components/RightKey/RightKey';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../../../components/Select';
import DataTime from  '../../../../../components/Calendar/Calendar';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../../services/apiCall";
//引入弹层
import Dialog from '../../../../../components/Dialog/Dialog';
import {I18n} from '../../../../../lib/i18n';
import NameCheck from "../../../../../components/InputBoxCheck/NameCheck";
import fieldsFormat from '../../../../../common/FieldsFormat';
export class  NormalDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.initCluster=this.initCluster.bind(this);
        this.initCompany=this.initCompany.bind(this);
        this.clusterChange=this.clusterChange.bind(this);
        this.data ={};
        this.state ={
        	clustersDate:[], //集团
        	companiesData:[] //企业
        }
        this.upload = this.upload.bind(this);
        this.nativeClick = this.nativeClick.bind(this);
        this.onCancelSecond = this.onCancelSecond.bind(this);
	}
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				that.props.onSaveAndClose(that.props.form.getFieldsValue(),that.data);
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
	upload(){
		this.onCancel();
		this.props.upload();
	}
	nativeClick = () => {
		let content=require('../../../../MenuSetting/components/MoreLanguageSetDialog').default;
		let element=React.createElement(content,{onSaveAndClose:this.upload,
			menusetView:this.props.initData.vendor,
			apiHost:API_FOODING_DS,
			object:'vendor',
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
	initCluster(){
		//init select cluster(初始化可选择集团信息)
		let clustersDate = this.state.clustersDate;
		apiGet(API_FOODING_ES,'/party/getLoginClusters',{},(response)=>{
			 clustersDate = response.data;
			this.setState({
				clustersDate:clustersDate
			})
		},(error)=>{

		})
	}
	initCompany(){
		//init select company(初始化可选择企业信息)
		let companiesData = this.state.companiesData;
		apiGet(API_FOODING_ES,'/party/getLoginCompanies',{},(response)=>{
			 companiesData = response.data;
			this.setState({
				companiesData:companiesData
			})
		},(error)=>{

		})
	}
	//当集团数据改变，企业的选择数据就会不同
	clusterChange(e){
		//change select company(国家改变，可选择企业信息)
		let companiesData = this.state.companiesData;
		apiGet(API_FOODING_ES,'/party/getLoginCompanies',{id:e},(response)=>{
			this.props.form.setFieldsValue({"ccid": undefined});
			 companiesData = response.data;
			this.setState({
				companiesData:companiesData
			})
		},(error)=>{

		})
	}
	componentDidMount(){
		//this.initCluster()
		//this.initCompany()
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {data,initData} = this.props;
		let content;
		 if(data.name.id == 'provider-detail-normal'){
		 	let {countrys,cstmLevels,cstmCrsekts,cstmTypes,vendor} = initData;
		 	vendor.country = vendor.country || {};
		 	vendor.cstmType = vendor.cstmType || {};
		 	vendor.cstmCrsekt = vendor.cstmCrsekt || {};
		 	vendor.cstmLevel = vendor.cstmLevel || {};
		 	this.data = Object.assign({},vendor,{title:'provider-detail-normal'})
           content =(
           	<div className={'  girdlayout'} >
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(200964/*供应商代码*/)}</label>		
                        <input type="text" disabled {...getFieldProps('code', {
                            initialValue:vendor&&vendor.code?vendor.code:''
                        })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder=""/>			                            
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200965/*供应商国家*/)}</label>
						<ConstVirtualSelect
								form={this.props.form}
								isRequest={false}
								fieldName="cntryId"
								rules
								initValueOptions={countrys}
								initialValue={vendor&&vendor.country?vendor.country.id:''}
								className="col-md-9 col-lg-9"
							/>
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100001/*名称*/)}</label>		
						<NameCheck
							form={this.props.form}
							fieldName='name'
							rules={true}
							initialValue={vendor&&vendor.name?vendor.name:''}
							className={'col-md-9 col-lg-9'}
						/>			                            
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(100226/*英文名称*/)}</label>
						<NameCheck
							form={this.props.form}
							fieldName='enName'
							rules={true}
							isEnName={true}
							initialValue={vendor&&vendor.enName?vendor.enName:''}
							className={'col-md-9 col-lg-9'}
						/>
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(200966/*供应商类型*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							isRequest={false}
							fieldName="cstmTypeId"
							initValueOptions={cstmTypes}
							initialValue={vendor&&vendor.cstmType?vendor.cstmType.id:''}
							className="col-md-9 col-lg-9"
							clearable={true}
						/>				                            
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(200468/*供应商等级*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							isRequest={false}
							fieldName="cstmLevelId"
							initValueOptions={cstmLevels}
							initialValue={vendor&&vendor.cstmLevel?vendor.cstmLevel.id:''}
							className="col-md-9 col-lg-9"
							clearable={true}
						/>		
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(200967/*供应商来源*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							isRequest={false}
							fieldName="cstmCrsektId"
							initValueOptions={cstmCrsekts}
							initialValue={vendor&&vendor.cstmCrsekt?vendor.cstmCrsekt.id:''}
							className="col-md-9 col-lg-9"
							clearable={true}
						/>						                            
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(100002/*描述*/)}</label>
						<input type="text" {...getFieldProps('description', {
                            initialValue:vendor&&vendor.description?vendor.description:''
                        })} className="col-md-9 col-lg-9 text-input-nowidth" placeholder=""/>		
					</div>
				</div>
			</div>
           	);
		}else if(data.name.id == 'provider-detail-sign'){
			
		let vendor = initData;
		let taxIdenSN = getFieldProps('taxIdenSN', {
            normalize: fieldsFormat.taxIdenSN,
            initialValue:vendor.taxIdenSN?String(vendor.taxIdenSN):''
        });

        let taxIdenComp = <input type="text" value={taxIdenSN.value} onChange={(...args)=>taxIdenSN.onChange(...args)}
                                 className ={ getFieldError("taxIdenSN") ?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'} placeholder=""/>;
			this.data = Object.assign({},vendor,{title:'provider-detail-sign'});
			content = (<div className={'  girdlayout'} >
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100358/*税号*/)}</label>	
	                         {taxIdenComp}            
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100561/*法人代表*/)}</label>		
	                        <input type="text" {...getFieldProps('leglpsn', {
		                            initialValue:vendor.leglpsn?vendor.leglpsn:''
		                        })} 
		                        className ={'col-md-9 col-lg-9 text-input-nowidth'} placeholder="" 
	                      	/>			                            
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100563/*成立日期*/)}</label>
							<div className={'col-md-9 col-lg-9 datetime'}>
								<DataTime width={'100%'}  showTime = {false} isShowIcon={true} form={this.props.form} name={'estabDate'} value={vendor.estabDate} validate={false}/>
							</div>	                        			                            
						</div> 
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-5 col-lg-5'}>{I18n.t(100564/*注册资本*/)}</label>		
	                        <input type="text" {...getFieldProps('regCapital', {
		                            initialValue:vendor.regCapital?vendor.regCapital:'',
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
								initValueOptions={vendor&&vendor.regCapitalCurren?[{id:vendor.regCapitalCurren.id,localName:vendor.regCapitalCurren.localName}]:[]}
								initialValue={vendor&&vendor.regCapitalCurren?vendor.regCapitalCurren.id:''}
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
NormalDialog.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
NormalDialog.defaultProps ={
	onSaveAndClose(){},
    onCancel(){}
}
const DialogFrom =createForm()(NormalDialog);
export default DialogFrom;


/*
<div className="form-group col-md-6 col-lg-6">
	<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100564*//*注册资本*//*)}</label>		
	<input type="text" {...getFieldProps('regCapital', {
			initialValue:vendor.regCapital?vendor.regCapital:''
			})} 
		className ={getFieldError('regCapital')?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'} placeholder="" 
	/>		                           
</div>




else if(data.name.id == 'orginzation'){
			let {vendor} = initData;
			this.data = Object.assign({},vendor,{title:'orginzation'});
			  content = (<div className={'addnormal-content girdlayout scroll'} >
				 	<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{data.name.data[0].key}</label>		
	                        <Select
								animation='slide-up'
								placeholder={''}
								className ={getFieldError('clusterId')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('clusterId',{
									rules: [{required:true,}],
									valuedateTrigger:"onBlur",
									onChange:this.clusterChange,
									initialValue:vendor&&vendor.cluster?vendor.cluster.id:''
								})}
							>
								{
									this.state.clustersDate.map((e,i) =>{
										return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
									})
								}
							</Select>		                            
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{data.name.data[1].key}</label>
							<Select
								animation='slide-up'
								placeholder={''}
								className ={getFieldError('ccid')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('ccid',{
									rules: [{required:true,}],
									valuedateTrigger:"onBlur",
									initialValue:vendor&&vendor.company?vendor.company.id:''
								})}
							>
								{
									this.state.companiesData.map((e,i) =>{
										return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
									})
								}
							</Select>
						</div>
					</div>
			 	</div>)
		}else if(data.name.id == 'orginzation'){
			let {vendor} = initData;
			this.data = Object.assign({},vendor,{title:'orginzation'});
			  content = (<div className={'  girdlayout scroll'} >
				 	<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{data.name.data[0].key}</label>		
	                        <Select
								animation='slide-up'
								placeholder={''}
								className ={getFieldError('clusterId')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('clusterId',{
									rules: [{required:true,}],
									valuedateTrigger:"onBlur",
									onChange:this.clusterChange,
									initialValue:vendor&&vendor.cluster?vendor.cluster.id:''
								})}
							>
								{
									this.state.clustersDate.map((e,i) =>{
										return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
									})
								}
							</Select>		                            
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{data.name.data[1].key}</label>
							<Select
								animation='slide-up'
								placeholder={''}
								className ={getFieldError('ccid')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('ccid',{
									rules: [{required:true,}],
									valuedateTrigger:"onBlur",
									initialValue:vendor&&vendor.company?vendor.company.id:''
								})}
							>
								{
									this.state.companiesData.map((e,i) =>{
										return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
									})
								}
							</Select>
						</div>
					</div>
			 	</div>)
		}
*/
