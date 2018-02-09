import i18n from './../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
//引入弹层
import Dialog from '../../../components/Dialog/Dialog';
//引入select插件
import Select, { Option, ConstVirtualSelect } from '../../../components/Select';
import {I18n} from '../../../lib/i18n';

import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import AddMoreLanguage from "../../../components/AddMoreLanguage";
import xt from "../../../common/xt";

class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
		this.cankuClick = this.cankuClick.bind(this);
		this.jiTuanSelect = this.jiTuanSelect.bind(this);
		this.qiyeTuanSelect = this.qiyeTuanSelect.bind(this);
	}
	qiyeTuanSelect(e){
		let that = this;
		this.props.form.setFieldsValue({plntId:undefined});
		apiGet(API_FOODING_ES,'/party/getPartysByType',{partyId:e,typeAttributeIds:["43"]},(response)=>{
			that.setState({
				zuzhiArray:response.data
			});
		},(error)=>{

		});
	}
	jiTuanSelect(e){
		let that = this;
		this.props.form.setFieldsValue({ccid:undefined});
		apiGet(API_FOODING_ES,'/party/getChildren',{parentId:e},(response)=>{
			that.setState({
				qiyeArray:response.data
			});
		},(error)=>{

		});
	}
	cankuClick(){
		let that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:"com.fooding.fc.enumeration.StroType"},
			(response)=>{
				that.setState({
					chankuArray:response.data
				});
			},
			(error)=>{

			});
	}
	initState(){
		return {
			initData:{},
			jiTuanArray:[],
			qiyeArray:[],
			zuzhiArray:[],
			chankuArray:[]
		}
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){},
		onSaveAdd(){}
	}
	componentDidMount(){
		// var that = this;
		// apiGet(API_FOODING_ES,'/party/getLoginClusters',{},(response)=>{
		// 	that.setState({
		// 		jiTuanArray:response.data
		// 	})
		// },(error)=>{
        //
		// })
	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				let value= this.props.form.getFieldsValue();
				if(this.props.otherData){
					value = this.props.form.getFieldsValue();
					value = Object.assign({},this.props.otherData,value);
				}
				apiPost(API_FOODING_DS,'/storLocatn/save',value,
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
		const { getFieldProps, getFieldError,getNFieldProps,getFieldValue} = this.props.form;
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
								    object = {'storLocatn'}
								    upload={this.props.onSaveAndClose}
								    onCancel ={this.onCancel}
							/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100243/*集团*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								apiHost={API_FOODING_ES}
								apiUri="/party/getLoginClusters"
								fieldName="clusId"
								initialValue={xt.initSelectValue(otherData.cluster, {clusId: xt.getItemValue(otherData, 'cluster.id'), ...otherData.cluster}, ['clusId'], 'localName', this.props.form)}
								initValueOption={[]}
								valueKeys={da => ({
                                    clusId: da.id,
                                    s_label: da.localName
                                })} rules
							/>
							{/*<Select */}
									{/*{...getNFieldProps('clusId',{*/}
										    {/*rules: [{required:true}],*/}
										    {/*initialValue:otherData.cluster?{s_label:otherData.cluster.localName,clusId:otherData.cluster.id}:undefined*/}
									 {/*})}*/}
									 {/*onSelect={this.jiTuanSelect}*/}
									 {/*placeholder=''*/}
									 {/*optionLabelProp="children"	*/}
									 {/*optionFilterProp="children"						*/}
									 {/*className ={getFieldError('clusId')?'currency-btn select-from-currency col-xs-8 col-md-8 error-border':'currency-btn select-from-currency col-xs-8 col-md-8'}							*/}
								{/*>	*/}
									{/*{this.state.jiTuanArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}*/}
							{/*</Select>*/}
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100244/*企业*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								isRequest={Boolean(getFieldValue('clusId', {clusId: xt.getItemValue(otherData, 'cluster.id')}).clusId)}
								refreshMark={getFieldValue('clusId', {clusId: xt.getItemValue(otherData, 'cluster.id')}).clusId}
								apiHost={API_FOODING_ES}
								apiUri="/party/getChildren"
								apiParams={{parentId: getFieldValue('clusId', {clusId: xt.getItemValue(otherData, 'cluster.id')}).clusId}}
								fieldName="ccid"
								initialValue={xt.initSelectValue(otherData.company && (otherData.cluster && otherData.cluster.id) == getFieldValue('clusId', {clusId: xt.getItemValue(otherData, 'cluster.id')}).clusId, {ccid: xt.getItemValue(otherData, 'company.id'), ...otherData.company}, ['ccid'], 'localName', this.props.form)}
								valueKeys={da => ({
                                    ccid: da.id,
                                    s_label: da.localName
                                })} rules
							/>
							{/*<Select */}
									{/*{...getNFieldProps('ccid',{*/}
										    {/*rules: [{required:true}],*/}
										    {/*initialValue:otherData.company?{s_label:otherData.company.localName,ccid:otherData.company.id}:undefined*/}
									 {/*})}*/}
									 {/*onSelect={this.qiyeTuanSelect}*/}
									 {/*placeholder=''*/}
									 {/*optionLabelProp="children"	*/}
									 {/*optionFilterProp="children"						*/}
									 {/*className ={getFieldError('ccid')?'currency-btn select-from-currency col-xs-8 col-md-8 error-border':'currency-btn select-from-currency col-xs-8 col-md-8'}							*/}
								{/*>	*/}
									{/*{this.state.qiyeArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}*/}
							{/*</Select>*/}
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(500144/*营运组织*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								isRequest={Boolean(getFieldValue('ccid', {ccid: xt.getItemValue(otherData, 'company.id')}).ccid)}
								refreshMark={getFieldValue('ccid', {ccid: xt.getItemValue(otherData, 'company.id')}).ccid}
								apiHost={API_FOODING_ES}
								apiUri="/party/getPartysByType"
								apiParams={{
                                    partyId: getFieldValue('ccid', {ccid: xt.getItemValue(otherData, 'company.id')}).ccid,
                                    typeAttributeIds: ["43"]
                                }}
								fieldName="plntId"
								initialValue={xt.initSelectValue(otherData.plant && (otherData.cluster && otherData.cluster.id) == getFieldValue('clusId', {clusId: xt.getItemValue(otherData, 'cluster.id')}).clusId && (otherData.company && otherData.company.id) == getFieldValue('ccid', {ccid: xt.getItemValue(otherData, 'company.id')}).ccid, {plntId: xt.getItemValue(otherData, 'plant.id'), ...otherData.plant}, ['plntId'], 'localName', this.props.form)}
								valueKeys={da => ({
                                    plntId: da.id,
                                    s_label: da.localName
                                })} rules
							/>
							{/*<Select */}
									{/*{...getNFieldProps('plntId',{*/}
										    {/*rules: [{required:true}],*/}
										    {/*initialValue:otherData.plant?{s_label:otherData.plant.localName,plntId:otherData.plant.id}:undefined*/}
									 {/*})}*/}
									 {/*placeholder=''*/}
									 {/*optionLabelProp="children"	*/}
									 {/*optionFilterProp="children"						*/}
									 {/*className ={getFieldError('plntId')?'currency-btn select-from-currency col-xs-8 col-md-8 error-border':'currency-btn select-from-currency col-xs-8 col-md-8'}							*/}
								{/*>	*/}
									{/*{this.state.zuzhiArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}*/}
							{/*</Select>*/}
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(201254/*仓库类型*/)}</label>
								<Select 
									{...getNFieldProps('stroTyId',{
										    rules: [{required:true}],
										    initialValue:otherData.stroType?{s_label:otherData.stroType.name,stroTyId:otherData.stroType.id}:undefined
									 })}
									 placeholder=''
									 optionLabelProp="children"	
									 optionFilterProp="children"						
									 className ={getFieldError('stroTyId')?'currency-btn select-from-currency col-xs-8 col-md-8 error-border':'currency-btn select-from-currency col-xs-8 col-md-8'}							
									 onClick={this.cankuClick}
								>	
									{this.state.chankuArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}
								</Select>
						</div>
					</div>
					<div className={'row'} style={{marginBottom:'10px'}}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-2 col-md-2'}>{i18n.t(100002/*描述*/)}</label>
							<textarea className={'col-xs-10 col-md-10 textarea'}
								{...getFieldProps('description',{
									initialValue:otherData.description?otherData.description:''
								})}
							>
										
							</textarea>
						</div>
					</div>
					<div className={'row'} style={{marginBottom:'10px'}}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-2 col-md-2'}>{i18n.t(100481/*地址*/)}</label>
							<textarea className={'col-xs-10 col-md-10 textarea'}
								{...getFieldProps('address',{
									initialValue:otherData.address?otherData.address:''
								})}
							>
										
							</textarea>
						</div>
					</div>
					
				</div>)
		}else{
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
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100243/*集团*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								apiHost={API_FOODING_ES}
								apiUri="/party/getLoginClusters"
								fieldName="clusId"
								initialValue={undefined}
								initValueOption={[]}
								valueKeys={da => ({
                                    clusId: da.id,
                                    s_label: da.localName
                                })} rules
							/>
							{/*<Select */}
									{/*{...getNFieldProps('clusId',{*/}
										    {/*rules: [{required:true}],*/}
										    {/*initialValue:undefined*/}
									 {/*})}*/}
									 {/*onSelect={this.jiTuanSelect}*/}
									 {/*placeholder=''*/}
									 {/*optionLabelProp="children"	*/}
									 {/*optionFilterProp="children"						*/}
									 {/*className ={getFieldError('clusId')?'currency-btn select-from-currency col-xs-8 col-md-8 error-border':'currency-btn select-from-currency col-xs-8 col-md-8'}							*/}
								{/*>	*/}
									{/*{this.state.jiTuanArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}*/}
							{/*</Select>*/}
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100244/*企业*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								isRequest={Boolean(getFieldValue('clusId', {}).clusId)}
								refreshMark={getFieldValue('clusId', {}).clusId}
								apiHost={API_FOODING_ES}
								apiUri="/party/getChildren"
								apiParams={{parentId: getFieldValue('clusId', {}).clusId}}
								fieldName="ccid"
								initialValue={undefined}
								valueKeys={da => ({
                                    ccid: da.id,
                                    s_label: da.localName
                                })} rules
							/>
							{/*<Select */}
									{/*{...getNFieldProps('ccid',{*/}
										    {/*rules: [{required:true}],*/}
										    {/*initialValue:undefined*/}
									 {/*})}*/}
									 {/*onSelect={this.qiyeTuanSelect}*/}
									 {/*placeholder=''*/}
									 {/*optionLabelProp="children"	*/}
									 {/*optionFilterProp="children"						*/}
									 {/*className ={getFieldError('ccid')?'currency-btn select-from-currency col-xs-8 col-md-8 error-border':'currency-btn select-from-currency col-xs-8 col-md-8'}							*/}
								{/*>	*/}
									{/*{this.state.qiyeArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}*/}
							{/*</Select>*/}
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(500144/*营运组织*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								isRequest={Boolean(getFieldValue('ccid', {}).ccid)}
								refreshMark={getFieldValue('ccid', {}).ccid}
								apiHost={API_FOODING_ES}
								apiUri="/party/getPartysByType"
								apiParams={{
                                    partyId: getFieldValue('ccid', {}).ccid,
                                    typeAttributeIds: ["43"]
                                }}
								fieldName="plntId"
								initialValue={undefined}
								valueKeys={da => ({
                                    plntId: da.id,
                                    s_label: da.localName
                                })} rules
							/>
							{/*<Select */}
									{/*{...getNFieldProps('plntId',{*/}
										    {/*rules: [{required:true}],*/}
										    {/*initialValue:undefined*/}
									 {/*})}*/}
									 {/*placeholder=''*/}
									 {/*optionLabelProp="children"	*/}
									 {/*optionFilterProp="children"						*/}
									 {/*className ={getFieldError('plntId')?'currency-btn select-from-currency col-xs-8 col-md-8 error-border':'currency-btn select-from-currency col-xs-8 col-md-8'}							*/}
								{/*>	*/}
									{/*{this.state.zuzhiArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}*/}
							{/*</Select>*/}
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(201254/*仓库类型*/)}</label>
								<Select 
									{...getNFieldProps('stroTyId',{
										    rules: [{required:true}],
										    initialValue:undefined
									 })}
									 placeholder=''
									 optionLabelProp="children"	
									 optionFilterProp="children"						
									 className ={getFieldError('stroTyId')?'currency-btn select-from-currency col-xs-8 col-md-8 error-border':'currency-btn select-from-currency col-xs-8 col-md-8'}							
									 onClick={this.cankuClick}
								>	
									{this.state.chankuArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}
								</Select>
						</div>
					</div>
					<div className={'row'} style={{marginBottom:'10px'}}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-2 col-md-2'}>{i18n.t(100002/*描述*/)}</label>
							<textarea className={'col-xs-10 col-md-10 textarea'}
								{...getFieldProps('description',{
									initialValue:''
								})}
							>
										
							</textarea>
						</div>
					</div>
					<div className={'row'} style={{marginBottom:'10px'}}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-2 col-md-2'}>{i18n.t(100481/*地址*/)}</label>
							<textarea className={'col-xs-10 col-md-10 textarea'}
								{...getFieldProps('address',{
									initialValue:''
								})}
							>
										
							</textarea>
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

