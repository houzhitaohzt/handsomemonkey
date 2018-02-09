import React, { Component,PropTypes } from 'react';
import RightKey from '../../../../../components/RightKey/RightKey';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option,ConstMiniSelect } from '../../../../../components/Select';
import Radio from '../../../../../components/Radio';
import Calendar from  '../../../../../components/Calendar/Calendar';
import Checkbox from '../../../../../components/CheckBox';
import Input from '../../../../../components/FormValidating/FormValidating';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS} from '../../../../../services/apiCall';
import Loading from "../../../../../components/Loading";//加载动画
import ServiceTips from "../../../../../components/ServiceTips";//提示框 
import {I18n} from "../../../../../lib/i18n";
import xt from '../../../../../common/xt';
import NameCheck from "../../../../../components/InputBoxCheck/NameCheck";
import i18n from "../../../../../lib/i18n";
import WebData from "../../../../../common/WebData";
export class  NormalDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.onChangeCheck = this.onChangeCheck.bind(this);
        this.initCluster=this.initCluster.bind(this);
        this.initCompany=this.initCompany.bind(this);
        this.clusterChange=this.clusterChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.state ={
        	checkeds:false,
        	checkedc:false,
        	positns:[],
        	clustersDate:[], //集团
        	companiesData:[] //企业
        }
	}
	onChangeCheck(num,e){
		this.setState({
			checkeds:e.target.checked
		});
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
		
	}
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				debugger
                onSaveAndClose(that.props.form.getFieldsValue(),that.data);
				that.props.form.resetFields();
			}
		})
	}
	onSelect(e,item){
		var that = this;
		this.props.form.setFieldsValue({positnId:''});
		apiGet(API_FOODING_ES,'/staff/getChildPosin',{partyId:e},(response)=>{
			this.setState({
				positns:response.data
			})
		},(error)=>{
		})
		
	}
	render(){
		let that = this;
		const { getNFieldProps, getFieldError, getFieldProps, getFieldValue } = this.props.form;
		let {data,initData} = this.props;
		let  iconArray = [{type:'add',onClick:this.addClick}]
		let {clustersDate,companiesData} = this.state;
		let content = <div></div>;
		 if(data.name.id == 'staffer-detail-normal'){
		 	initData = initData || {};
			initData.positn = initData.positn || {};
			initData.locale = initData.locale || {};
			initData.country = initData.country || {};
			initData.organization = initData.organization || {};
			initData.stfType = initData.stfType || {};
			initData.title = initData.title || {};
			initData.workingState = initData.workingState || {};
			initData.organization = initData.organization || {};
			initData.positn = initData.positn || {};
			initData.eduDegr = initData.eduDegr || {};
			initData.sex  = initData.sex  || {};
		 	//客户常规
			let  {countrys,eduDegrs,inSvrTypes,linkTypes,locales,organizations,sexs,staff,stfTypes,titles} = initData;
			this.data = Object.assign({},staff,{title:"staffer-detail-normal"});
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:initData? initData.id:''
			})
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:initData? initData.optlock:''
			})
			getFieldProps('rowSts', {
							            	validateFirst: true,
						                    initialValue:initData? initData.rowSts:''
			})
           content =(
               <div className={'addnormal scroll'} style={{marginBottom:'10px',maxHeight:'300px',overflowY:'auto'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100225/*工号*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text',
													initialValue:initData?initData.code:'',
													classn:'col-md-8 col-lg-8 text-input-nowidth'}}
								/> 
							</div>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100231/*姓名*/)}</label>
								<NameCheck
									form={this.props.form}
									fieldName='name'
									 rules={true}
									initialValue={initData?initData.name:''}
									className={'col-md-8 col-lg-8'}
								/>		
							</div>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100226/*英文名称*/)}</label>
								<NameCheck
									form={this.props.form}
									fieldName='enName'
									isEnName={true}

									initialValue={initData?initData.enName:''}
									className={'col-md-8 col-lg-8'}
								/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100095/*语言分类*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Locale' 
                                             fieldName="localeId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                localeId: da.id,
                                                localeLcName: da.localName,
                                                localeEnName: da.name,
                                                s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	allowClear
                                            initialValue={xt.initSelectValue(initData.locale,{localeId:initData.locale.id,...initData.locale},['localeId'], 'localName', this.props.form)}
                                            className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                />   
							</div>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100087/*国家*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Country' 
                                             fieldName="cntryId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                cntryId: da.id,
                                                cntryLcName: da.localName,
                                                cntryEnName: da.name,
                                                s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             	
                                            initialValue={xt.initSelectValue(initData.country,{cntryId:initData.country.id,...initData.country},['cntryId'], 'localName', this.props.form)}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    />
							</div>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100236/*职称*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Title' 
                                             fieldName="titleId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                titleId: da.id,
                                                titleLcName: da.localName,
                                                titleEnName: da.name,
                                                s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	allowClear
                                             	initialValue={xt.initSelectValue(initData.title,{titleId:initData.title.id,...initData.title},['titleId'], 'localName', this.props.form)}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    />  
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100237/*职员类型*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.StfType' 
                                             fieldName="stfTyId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                stfTyId: da.id,
                                                stfTyName: da.name,
                                                s_label: da.name
                                             }}>{da.name}</Option>}
                                             allowClear
                                             initialValue={xt.initSelectValue(initData.stfType,{stfTyId:initData.stfType.id,...initData.stfType},['stfTyId'], 'name', this.props.form)}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    /> 
							</div>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100238/*部门*/)}</label>
								 <ConstMiniSelect form={this.props.form}
												  pbj={{apiType: apiGet, host: API_FOODING_ES, uri: '/party/getLoginDepartments',
                                                      params: {ccId:WebData.user.data.staff.ccid}
                                                  }}
	                                             fieldName="organizationId"
	                                             optionValue={da => <Option key={da.id} objValue={{
	                                                 organizationId: da.id,
	                                                organizationLcName: da.localName,
	                                                 organizationEnName: da.name,
	                                                 s_label: da.localName
	                                             }}>{da.localName}</Option>}
	                                             	reles={true}
	                                             	
	                                             	initialValue={xt.initSelectValue(initData.organization,{organizationId:initData.organization.id,...initData.organization},['organizationId'], 'localName', this.props.form)}
	                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
	                                             
					            /> 
							</div>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100227/*职务*/)}</label>
								<ConstMiniSelect form={this.props.form}
					             				isRequest={Boolean(getFieldValue("organizationId",initData).organizationId)}
                                                 			refreshMark={getFieldValue("organizationId", initData).organizationId}
												 pbj={{apiType: apiGet, host: API_FOODING_ES, uri: '/party/getPartysByTypeIdAndPartyId',
                                                     params: {partyId:getFieldValue("organizationId",{initData}).organizationId,typeId:50}
                                                 }} fieldName="positnId"
	                                             optionValue={da => <Option key={da.id} objValue={{
	                                                positnId: da.id,
	                                                positnLcName: da.localName,
	                                                positnEnName: da.name,
	                                                 s_label: da.localName
	                                             }}>{da.localName}</Option>}
	                                             	reles={true}
	                                             	
	                                             	initialValue={xt.initSelectValue(initData.positnId&& getFieldValue("organizationId",initData).organizationId== initData.organizationId, {positnId:initData.positn.id,localName:initData.positn.localName}, ['positnId'], 'localName', this.props.form) }
	                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
	                                             
					                /> 
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100228/*在职状态*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.WorkingState' 
                                             fieldName="workingStateId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                workingStateId: da.id,
                                                workingStatename: da.name,
                                                s_label: da.name
                                             }}>{da.name}</Option>}
                                             	reles={true}
                                             	
                                             	initialValue={xt.initSelectValue(initData.workingState,{workingStateId:initData.workingState.id,...initData.workingState},['workingStateId'], 'name', this.props.form)}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    />  
							</div>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100239/*性别*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.Sex' 
                                             fieldName="sexId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                sexId: da.id,
                                                sexname: da.name,
                                                s_label: da.name
                                             }}>{da.name}</Option>}
                                             	allowClear
                                             	initialValue={xt.initSelectValue(initData.sex,{sexId:initData.sex.id,...initData.sex},['sexId'], 'name', this.props.form)}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    /> 
							</div>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100240/*学历*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.EduDegr' 
                                             fieldName="eduDegrId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                eduDegrId: da.id,
                                                eduDegrLcName: da.localName,
                                                eduDegrEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	allowClear
                                             	initialValue={xt.initSelectValue(initData.eduDegr,{eduDegrId:initData.eduDegr.id,...initData.eduDegr},['eduDegrId'], 'localName', this.props.form)}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                             
				                    /> 
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100241/*身份证号*/)}</label>
								<input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
										{...getNFieldProps('idcardSN',{
													initialValue:initData.idcardSN?initData.idcardSN:''
										})}
								/>   
							</div>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100242/*兴趣爱好*/)}</label>
								<input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
										{...getNFieldProps('hobbys',{
													initialValue:initData.hobbys?initData.hobbys:''
										})}
								/> 
							</div>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100229/*邮箱*/)}</label>
								<input type="text" className ={getFieldError("emailAddress") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
										{...getNFieldProps('emailAddress',{
											validateFirst: true,
													rules: [{required: true,pattern:(/[@]/g)}],
													initialValue:initData.emailAddress?initData.emailAddress:''
										})}
								/> 
							</div>
						</div>
						<div className={'row'}>
                            <div className="form-group col-md-4 col-lg-4">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(500413/*入职日期*/)}</label>
                                <div className={'col-md-8 col-lg-8 datetime'}>
                                    <Calendar
                                        width={'100%'}
                                        showTime = {false}
                                        isShowIcon={true}
                                        form={this.props.form}
                                        name={'entryDate'}
                                        value={initData['entryDate']}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-4 col-lg-4">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(500414/*入职时工龄*/)}</label>
                                <input type="text" className={getFieldError("entryWorkAge")?"col-md-8 col-lg-8 text-input-nowidth error-border":'col-md-8 col-lg-8 text-input-nowidth'}
									   {...getNFieldProps('entryWorkAge',{
                                           rules: [{pattern: xt.pattern.positiveZero}],
                                           initialValue:initData.entryWorkAge?initData.entryWorkAge:''
                                       })}
                                />
                            </div>
						</div>
					</div>
			</div>
           	);
		}else if(data.name.id == '5'){
			content = (
				 <div className="client-normal-add scroll">
											<div className="client-normal-add-line1">
												<div>
												<label><span>*</span>{data.name.data[0].key}</label>
												<input type="text" {...getNFieldProps('name', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:''+ data.name.data[0].value
						                            })} className="text-input" />
												</div>
												<div>
												<label><span>*</span>{data.name.data[1].key}</label>
												<input type="text" {...getNFieldProps('name', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:''+data.name.data[1].value
						                            })} className="text-input" />
												</div>
											</div>
											<div className="client-normal-add-line2">
												<div>
													<label><span>*</span>{data.name.data[2].key}</label>
													<Calendar width={300}   showTime = {false} isShowIcon={true}/>
												</div>
												<div>
													<label><span>*</span>{data.name.data[3].key}</label>
													<input type="text" {...getNFieldProps('name', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:''
						                            })} style={{width:100}} className="text-input" />

						                            <Select
														{...getNFieldProps('11',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:''
														})}
														style={{width:80,marginLeft:10,marginRight:10}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
						                            <Select
														{...getNFieldProps('11',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:''
														})}
														style={{width:100}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
												</div>
											</div>
								   </div>
			);
		}else if(data.name.id == '33'){
		 	debugger
			this.data = Object.assign({},initData,{title:"orginzation"});
			 content = (<div className={'girdlayout'} >
				 	<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{data.name.data[0].key}</label>		
	                        <ConstMiniSelect form={this.props.form}
							 pbj={{
								apiType:apiGet,
								 host:API_FOODING_ES,
								 uri: '/party/getLoginClusters',
								 params:{}
							}} fieldName="clusId"
								reles={true}
	                              initValueOptions={[{id:initData&&initData.clus?initData.clus.id:'',name:initData&&initData.clus?initData.clus.localName:''}]}
	                             initialValue={initData&&initData.clus?initData.clus.id:''}
	                             className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
	                        />		                            
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{data.name.data[1].key}</label>
							<ConstMiniSelect form={this.props.form}
								refreshMark={getFieldValue('clusId',initData&&initData.clus?initData.clus.id:'')|| getFieldValue('clusId')}
								pbj={{
									apiType:apiGet,
									 host:API_FOODING_ES,
									 uri: '/party/getLoginCompanies',
									  params:{clusId:getFieldValue('clusId',initData&&initData.clus?initData.clus.id:'')|| getFieldValue('clusId')}
								}} fieldName="ccId"
								reles={true}
                                initValueOptions={[{id:initData&&initData.company?initData.company.id:'',name:initData&&initData.company?initData.company.localName:''}]}
                                             initialValue={initData&&initData.company?initData.company.id:''}
								className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
	                        />
						</div>
					</div>
			 	</div>);
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
								{content}
				</FormWrapper>
			</div>
			);
	}
	onCancel(){
		const {onCancel}=this.props;
        if(onCancel){
            onCancel();
        }
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
