import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Calendar from  '../../../../components/Calendar/Calendar';
import PriceProductMore from '../../../Client/List/components/PriceProductMore';
import Table from  "../../../../components/Table";
import Checkbox from "../../../../components/CheckBox";
import xt from '../../../../common/xt'; // 下拉
import {I18n} from "../../../../lib/i18n";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import AddMoreLanguage from "../../../../components/AddMoreLanguage";
import NameCheck from "../../../../components/InputBoxCheck/NameCheck";
export class  ContactDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.addRadio;
        this.state=this.initState();
        this.clientClick = this.clientClick.bind(this);
		this.statusClick = this.statusClick.bind(this);
		this.clientSelect = this.clientSelect.bind(this);
	}
	initState(){
		return {
				data:{main:{
					bizEntprisCode:"CUS001608150056",
					bizEntprisName:'DaD',
					bizEntprisCntryId:i18n.t(200465/*还原胶*/),
					country:i18n.t(200464/*曼恩岛*/)
				},
			},
			lbizPrns:[],
			tableSources:[],
			statusArray:[],
			client:[]
		}
	}

	statusClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.WorkingState'},
			(response)=>{
				that.setState({
					statusArray:response.data
				});
		},(error)=>{

		});
	}
	clientSelect(e){
	    var that = this;
	    if(this.props.form.setFieldsValue){
	    	this.props.form.setFieldsValue({lbizPrnId:undefined});
	    }
	}
	// 客户
	clientClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{"obj":"com.fooding.fc.ds.entity.Vendor"},
			(response)=>{
				this.setState({	client: response.data });
			},(errors)=>{
				// ServiceTips({text: errors.message,type: 'error'});
		});
	}
	onSaveAndClose(){
		var that = this;
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				if(this.props.data){
					let aa = this.props.data.record||{};
					let defaultEmailId = aa.defaultEmail?aa.defaultEmail.id:undefined;
				    let defaultEmailOptlock = aa.defaultEmail?aa.defaultEmail.optlock:undefined;
				    let defaultMobileId = aa.defaultMobile?aa.defaultMobile.id:undefined;
				    let defaultMobileOptlock = aa.defaultMobile?aa.defaultMobile.optlock:undefined;
				    let defaultSkypeId = aa.defaultSkype?aa.defaultSkype.id:undefined;
				    let defaultSkypeOptlock = aa.defaultSkype?aa.defaultSkype.optlock:undefined;
					var contactList = [{name:value.email,linkTyId:80,dfutMark:true,id:defaultEmailId,optlock:defaultEmailOptlock,dataTyId:120},
					{name:value.defaultMobile,linkTyId:100,dfutMark:true,id:defaultMobileId,optlock:defaultMobileOptlock,dataTyId:120},
					{name:value.skype,linkTyId:110,dfutMark:true,id:defaultSkypeId,optlock:defaultSkypeOptlock,dataTyId:120}];
					delete value.email;
					delete value.defaultMobile;
					delete value.skype;
					value = Object.assign({},value,{contactList:contactList,id:aa.id,optlock:aa.optlock,nameValues:aa.nameValues,name:aa.name});
				}else {
					var contactList = [{name:value.email,linkTyId:80,dfutMark:true,dataTyId:120},
					{name:value.defaultMobile,linkTyId:100,dfutMark:true,dataTyId:120},
					{name:value.skype,linkTyId:110,dfutMark:true,dataTyId:120}];
					delete value.email;
					delete value.defaultMobile;
					delete value.skype;
					value=Object.assign({},value,{contactList:contactList});
				}
	      		value = Object.assign({},value,{dataTyId:120});
		    	apiPost(API_FOODING_DS,'/entContact/save',value,(response)=>{
		    		ServiceTips({text:response.message,type:'sucess'});
		    		that.props.form.resetFields();
		    		that.props.onSaveAndClose();
		    	},(errors)=>{
		    			ServiceTips({text:errors.message,type:'error'});
		    	})
			}

    	});
	}
	componentDidMount(){
	}
	onCancel(){
		const {form}=this.props;
		this.props.onCancel();
		form.resetFields();
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError,getNFieldProps,getFieldValue} = this.props.form;
		let {data} = this.props;
		let content = <div></div>;
		let checkedData = data?data.record:{};
		getFieldProps('dataTyId', {
				initialValue:120
		})
		checkedData.maryType = checkedData.maryType ||{};
		checkedData.enterprise = checkedData.enterprise ||{};
		checkedData.country = checkedData.country||{};
		checkedData.sex = checkedData.sex||{};
		checkedData.lbizPrn = checkedData.lbizPrn || {};
    	checkedData.depmnt = checkedData.depmnt || {};
    	checkedData.positn = checkedData.positn || {};
		let common =<div></div>;
		let beId = getFieldValue('beId') ||(checkedData.enterprise?checkedData.enterprise.id:undefined);
		let demp = getFieldValue("depmntId",{}).depmntId || checkedData.depmnt.id;

		console.log(getFieldValue('beId',{}).cntryId, 1 , (checkedData.country && checkedData.country.id), 2 ,getFieldValue('beId',{}).beId, 3 , (checkedData.enterprise && checkedData.enterprise.id), 4 ,getFieldValue('beId',{countrylocalName:checkedData.country.localName}).countrylocalName,'hdkfei')

		if(data){
				common =<AddMoreLanguage
									    menusetView={checkedData}
									    object = {'entprisContact'}
									    upload={this.props.onSaveAndClose}
									    onCancel ={this.onCancel}
								    />
			}
		content = (
						<div className="contact-edit scroll">
										<div className="girdlayout">
											<div className="row">
												<div className='form-group col-xs-6 col-md-6'>
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
													<input type="text"
													 placeholder={I18n.t(100378/*自动生成*/)}
													{...getFieldProps('code', {
						                                initialValue:checkedData.code?checkedData.code:''
						                            })} className='text-input-nowidth col-md-9 col-lg-9' readOnly/>
												</div>
												<div className='form-group col-xs-6 col-md-6'>
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100229/*邮箱*/)}</label>
													<input type="text"
														placeholder=''
														{...getFieldProps('email', {
															rules: [{required: true,pattern:(/[@]/g)}],
						                                initialValue:checkedData.defaultEmail&&checkedData.defaultEmail.localName?checkedData.defaultEmail.localName:''
						                            })} className={getFieldError('email')?'text-input-nowidth col-md-9 col-lg-9 error-border':'text-input-nowidth col-md-9 col-lg-9'} />
												</div>

											</div>
											<div className="row">
												<div className='form-group col-xs-6 col-md-6'>
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100312/*供应商*/)}</label>
													<ConstVirtualSelect
													    form={this.props.form}
													    apiType={apiPost}
													    fieldName='beId'
													    apiUri='/enterprise/search?dataTyId=40&attrs=country._id,country.name,country.nameValues'
													    async={true}
													    apiParams='keyword'
													    initialValue={checkedData.enterprise?{s_label:checkedData.enterprise.localName,beId:checkedData.enterprise.id}:undefined}
													    valueKeys={ da => ({
													        s_label:da.localName,
													        beId:da.id,
													        cntryId:da.country.id,
													        countryname:da.country.name,
													        countrylocalName:da.country.localName
													    })} rules={true}
													     className='currency-btn select-from-currency col-md-9 col-lg-9'
													/>
												</div>
												<div className='form-group col-xs-6 col-md-6'>
													<label className={'col-xs-3 col-md-3'}>{I18n.t(300009/*手机*/)}</label>
													<input type="text"
													placeholder=''
													{...getFieldProps('defaultMobile', {
														rules: [{pattern:(/^\s*\+?\s*(\(\s*\d+\s*\)|\d+)(\s*-?\s*(\(\s*\d+\s*\)|\s*\d+\s*))*\s*$/g)}],
						                                initialValue:checkedData.defaultMobile&&checkedData.defaultMobile.localName?checkedData.defaultMobile.localName:''
						                            })} className={getFieldError('defaultMobile')?'text-input-nowidth col-md-9 col-lg-9 error-border':'text-input-nowidth col-md-9 col-lg-9'} />
												</div>
											</div>
											<div className='row'>
												<div className='form-group col-xs-6 col-md-6'>
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100231/*姓名*/)}</label>
													<NameCheck
														form={this.props.form}
														fieldName='localName'
														rules={true}
														initialValue={checkedData.localName?checkedData.localName:''}
														className={'col-md-9 col-lg-9'}
													/>
													{common}
												</div>
												<div className='form-group col-xs-6 col-md-6'>
													<label className={'col-xs-3 col-md-3'}>Skype</label>
													<input type="text"
													placeholder=''
													{...getFieldProps('skype', {
						                                initialValue:checkedData.defaultSkype&&checkedData.defaultSkype.localName?checkedData.defaultSkype.localName:''
						                            })} className="text-input-nowidth col-md-9 col-lg-9" />
												</div>
											</div>
											<div className="row">
												<div className='form-group col-xs-6 col-md-6'>
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100239/*性别*/)}</label>
													<ConstMiniSelect form={this.props.form}
				                                                 pbj={{
				                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
				                                                     params: {obj:'com.fooding.fc.enumeration.Sex'}
				                                                 }} fieldName="sexId"
				                                                 initValueOptions={[]}
				                                                 initialValue={
				                                                 	xt.initSelectValue(checkedData.sex.id, {sexId:checkedData.sex.id, ...checkedData.sex}, ['sexId'], 'name', this.props.form)}
				                                                 optionValue={(da, di) => <Option key={di} objValue={{
				                                                     sexId: da.id,
				                                                     s_label: da.name
				                                                 }}>{da.name}</Option>} reles ={true}
				                                                 className='currency-btn select-from-currency col-md-9 col-lg-9'

				                                	/>
												</div>
													<div className='form-group col-xs-6 col-md-6'>
														<label className={'col-xs-3 col-md-3'}>{I18n.t(300010/*婚姻状况*/)}</label>
														<ConstMiniSelect form={this.props.form}
				                                                 pbj={{
				                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
				                                                     params: {obj:'com.fooding.fc.enumeration.MaryType'}
				                                                 }} fieldName="maryTypeId"
				                                                 initValueOptions={[]}
				                                                 initialValue={
				                                                 	xt.initSelectValue(checkedData.maryType.id,{maryTypeId:checkedData.maryType.id,...checkedData.maryType}, ['maryTypeId'], 'name', this.props.form)}
				                                                 optionValue={(da, di) => <Option key={di} objValue={{
				                                                     maryTypeId: da.id,
				                                                     s_label: da.name
				                                                 }}>{da.name}</Option>}
				                                                 className='currency-btn select-from-currency col-md-9 col-lg-9'

				                                		/>

													</div>
												</div>
												<div className='row'>
													<div className='form-group col-xs-6 col-md-6'>
													<label className={'col-xs-3 col-md-3'}>{I18n.t(300011/*出生日期*/)}</label>
														<div className='col-md-9 col-lg-9 datetime'>
															<Calendar width={'100%'}
															 showTime = {false}
															 value ={checkedData.birthDate}
															 isShowIcon={true}
															 name={'birthDate'}
															form={this.props.form}
															 />
														 </div>
													</div>
													<div className='form-group col-xs-6 col-md-6'>
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(300012/*国籍*/)}</label>
				                                		<ConstMiniSelect form={this.props.form}
																refreshMark={getFieldValue('beId',{}).beId || (checkedData.enterprise && checkedData.enterprise.id)}
				                                                 pbj={{
				                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
				                                                     params: {obj:'com.fooding.fc.ds.entity.Country'}
				                                                 }} fieldName="cntryId"
				                                                 initValueOptions={[]}
				                                                 initialValue={
				                                                 	xt.initSelectValue(
				                                                 		(getFieldValue('beId',{}).cntryId || (checkedData.country && checkedData.country.id)) && 
				                                                 	(getFieldValue(beId,{}).beId || checkedData.enterprise.id) ===  checkedData.enterprise.id,
				                                                 	{cntryId:getFieldValue('beId',{cntryId:checkedData.country.id}).cntryId,
				                                                 	 localName:getFieldValue('beId',{}).countrylocalName || checkedData.country && checkedData.country.localName }, ['cntryId'], 'localName', this.props.form)}
				                                                 optionValue={(da, di) => <Option key={di} objValue={{
				                                                     cntryId: da.id,
				                                                     s_label: da.localName
				                                                 }}>{da.localName}</Option>} reles ={true}
				                                                 className='currency-btn select-from-currency col-md-9 col-lg-9'

				                                		/>
													</div>
												</div>
												<div className='row'>
													<div className='form-group col-xs-6 col-md-6'>
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100238/*部门*/)}</label>
														<ConstMiniSelect form={this.props.form}
				                                                 pbj={{
				                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
				                                                     params: {obj:'com.fooding.fc.ds.entity.Depmnt'}
				                                                 }} fieldName="depmntId"
				                                                 initValueOptions={[]}
				                                                 initialValue={
                                                                     xt.initSelectValue(checkedData.depmnt, {
                                                                         depmntId: checkedData.depmnt && checkedData.depmnt.id ? checkedData.depmnt.id :undefined,
                                                                         localName: checkedData.depmnt && checkedData.depmnt.localName ? checkedData.depmnt.localName : undefined
                                                                     }, ['depmntId'], 'localName', this.props.form)}
				                                                 optionValue={(da, di) => <Option key={di} objValue={{
				                                                     depmntId: da.id,
				                                                     s_label: da.localName
				                                                 }}>{da.localName}</Option>} reles ={true}
				                                                 className='currency-btn select-from-currency col-md-9 col-lg-9'

				                                		/>
													</div>
													<div className='form-group col-xs-6 col-md-6'>
														<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100227/*职务*/)}</label>
														<ConstMiniSelect form={this.props.form}
										             				isRequest={Boolean(getFieldValue("depmntId",{}).depmntId||checkedData.depmnt.id)}
										                              refreshMark={getFieldValue("depmntId",{}).depmntId+checkedData.depmnt.id}
														             				 pbj={{apiType: apiGet, host: API_FOODING_DS, uri: '/positn/getPositnsByDepmntId',
														             				 params: {depmntId:getFieldValue("depmntId",{}).depmntId||checkedData.depmnt.id}
										                                             }} fieldName="positnId"
											                                             optionValue={da => <Option key={da.id} objValue={{
											                                                positnId: da.id,
											                                               s_label: da.localName
											                                             }}>{da.localName}</Option>}
											                                             	reles={true}
											                                             	initialValue={
					                                                            xt.initSelectValue(checkedData.positn && demp == checkedData.depmnt.id,
					                                                            {positnId:checkedData.positn.id,localName:checkedData.positn.localName},
					                                                             ['positnId'], 'localName', this.props.form)
					                                                          }
											                                             className ={'col-xs-9 col-md-9 currency-btn select-from-currency'}

										                />
													</div>
												</div>
												<div className='row'>
													<div className='form-group col-xs-6 col-md-6'>
														<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100228/*在职状态*/)}</label>
														<Select
															{...getNFieldProps('status',{
															validateFirst: true,
															rules: [{required:true,}],
															valuedateTrigger:"onBlur",
															initialValue:checkedData.workingState?{s_label:checkedData.workingState.name,status:checkedData.workingState.id}:{s_label:I18n.t(201206/*正式*/),status:10}
															})}
															optionLabelProp="children"
															optionFilterProp="children"
															className ={getFieldError('status')?'currency-btn select-from-currency col-md-9 col-lg-9  error-border' :'currency-btn select-from-currency col-md-9 col-lg-9'}
															onClick={this.statusClick}
															>
															{
																this.state.statusArray.map((e,i)=>{
																	return <Option value ={String(e.id)} title={e.name} key={i}>{e.name}</Option>
																})
															}
														</Select>
													</div>
													<div className='form-group col-xs-6 col-md-6'>
														<label className={'col-xs-3 col-md-3'}>{I18n.t(300013/*领导人*/)}</label>
														<ConstMiniSelect form={this.props.form}
															isRequest={Boolean(getFieldValue('beId',{}).beId || (checkedData.enterprise&& checkedData.enterprise.id))}
			                                                 refreshMark={getFieldValue('beId',{}).beId || (checkedData.enterprise&& checkedData.enterprise.id)}
			                                                 pbj={{
			                                                     apiType: apiGet, host: API_FOODING_DS,
			                                                     uri:'/entContact/getByBeIdDataTyId',
			                                                     params: {beId:getFieldValue('beId',{}).beId || (checkedData.enterprise && checkedData.enterprise.id),dataTyId:120,id:checkedData.id}
			                                                 }} fieldName="lbizPrnId"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(checkedData.lbizPrn && checkedData.lbizPrn.id  && (getFieldValue('beId',{}).beId || (checkedData.enterprise&& checkedData.enterprise.id)) ===  (checkedData.enterprise && checkedData.enterprise.id), {lbizPrnId:checkedData.lbizPrn && checkedData.lbizPrn.id?checkedData.lbizPrn.id:"",localName:checkedData.lbizPrn && checkedData.lbizPrn.localName?checkedData.lbizPrn.localName:""}, ['lbizPrnId'],'localName', this.props.form)
			                                                 }
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     lbizPrnId: da.id,
			                                                     s_label: da.localName
			                                                 }}>{da.localName}</Option>}
			                                                 className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
			                                			/>
													</div>
												</div>
												<div className='row'>
													<div className='form-group col-xs-6 col-md-6'>
														<label className={'col-xs-3 col-md-3'}>{I18n.t(100372/*主联系人*/)}</label>
														<Checkbox
															{...getFieldProps('dfutMark',{
															    initialValue:checkedData.dfutMark?checkedData.dfutMark:false
															})}
															checked={this.props.form.getFieldValue("dfutMark")?true:false}
														/>
													</div>
													<div className='form-group col-xs-6 col-md-6'>
														<label className={'col-xs-3 col-md-3'}>{I18n.t(100002/*描述*/)}</label>
														<input type="text"
															placeholder=''
															{...getFieldProps('description', {

							                                initialValue:checkedData.description?checkedData.description:''
							                            })} className={'text-input-nowidth col-md-9 col-lg-9'} />
													</div>
												</div>
												<div className='row'>
													<div className='form-group col-xs-6 col-md-6'>
														<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(300015/*首选联系方式*/)}</label>
														<ConstVirtualSelect form={this.props.form}
																apiType={apiPost}
																 apiParams="com.fooding.fc.enumeration.ContactType"
																												 fieldName="contactTypeId"
																												  initialValue={checkedData.contactType?{s_label:checkedData.contactType.name,contactTypeId:checkedData.contactType.id}:{s_label:I18n.t(100586/*邮件*/),contactTypeId:0}}
																												 className={'col-md-9 col-lg-9'} rules={true}
																						/>
													</div>
												</div>
											</div>
						</div>
			);
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
						{content}
				</FormWrapper>
			</div>
			);
	}
}
const DialogFrom =createForm()(ContactDialog);
export default DialogFrom;
