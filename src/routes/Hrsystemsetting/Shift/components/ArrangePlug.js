import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../../components/Select';
import Confirm from '../../../../components/Dialog/Confirm';
import Calendar from  '../../../../components/Calendar/Calendar';
import Dialog from '../../../../components/Dialog/Dialog';
import Checkbox from "../../../../components/CheckBox";
import {apiGet,apiPost,apiForm,API_FOODING_HR,API_FOODING_ES,API_FOODING_DS} from '../../../../services/apiCall';
import ServiceTips from "../../../../components/ServiceTips";//提示框
import {I18n} from "../../../../lib/i18n";
import xt from '../../../../common/xt';
import WebData from '../../../../common/WebData';
import {TimePickerN} from "../../../../components/TimePicker/TimePicker.js";
export class Productplug extends Component{
	
	constructor(props){
		super(props);
		let groupData = WebData.user.data.staff.cluster || {};

		// this state 
		this.state = {
			groupData:groupData, // 集团
			dataOne:{}, // getOne
			active:true, // git one 刷新
		}; 

		
	}

	componentDidMount(){
		this.getPage(); 
    }

	componentWillUnmount() {
	}



	// 保存并关闭
	onSaveAndClose =(active)=> {
		let that = this;
		let {dataOne,groupData} = this.state;
		const {form,upload,onCancel,onSaveAndClose} = this.props;

		
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				let params = Object.assign({},dataOne,value,{
					cluster:groupData,
					leaveEarly:Number(value['leaveEarly']),
					beLate:Number(value['beLate']),
					overTime:Number(value['overTime']),
					absenteeism:Number(value['absenteeism'])
				});


				apiPost(API_FOODING_HR,'/schedule/save',params,
					(response)=>{
						 ServiceTips({text:response.message,type:'success'});
						 upload();
						 active ? that.getPage() : onCancel(); // 新增并保存
						 that.props.form.resetFields();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				})
			}
		})
	}

	// 保存并新增 
	onSaveAdd =()=> this.onSaveAndClose(true);

	onCancel = ()=> {
		const {form, onCancel} = this.props;
		this.props.onCancel();
		this.props.form.resetFields();
	}

	// get one 
	getPage = ()=> {
		let that = this;
		let {checkedData} = this.props;	


		apiGet(API_FOODING_HR,'/schedule/getOne',{id:checkedData['id']},
			(response)=>{
				that.setState({active:false},()=>{
					that.setState({
						dataOne: response['data'],
						active:true,
					});
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 班次名称 多语言 
	nativeClick = (object) => {

		let content=require('../../../MenuSetting/components/MoreLanguageSetDialog').default;
		let element=React.createElement(content,{
			onSaveAndClose:this.onSaveAndClose,
			menusetView:this.props.checkedData,
			apiHost:API_FOODING_DS,
			object:object,
			onCancel:this.onCancel
		});

		this.setState({
			showDilaogsecond : true,
			title: I18n.t(100496/*多语言配置*/),
			dialogContent: element
		})
	}

	render(){
		let that = this;
		let {active,dataOne,groupData} = this.state;
		let {checkedData,form} = this.props;
		const {getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;

		return (
			<div className="package-action-buttons">
				<FormWrapper
					showFooter={true}
					//buttonLeft = {this.props.buttonLeft}
					showSaveAdd={!checkedData['id'] ? true :false}
					onSaveAndClose={this.onSaveAndClose}
					onCancel={this.onCancel}
					onSaveAdd={this.onSaveAdd}
					showSaveClose={this.props.showSaveClose}
					>
						<div className={'addnormal scroll'}>
							{ active ? 
								<div className={'girdlayout'}>
									<div className={'row'}>
										<div className="form-group col-md-6">
											<label className={'col-md-4'}>{I18n.t(100243/*集团*/)}</label>
											<span>{ checkedData['cluster'] ? checkedData.cluster['localName'] : groupData['localName']}</span>
										</div>
										<div className="form-group col-md-6">
											<label className={'col-md-4'}><span>*</span>{I18n.t(100244/*企业*/)}</label>
											<ConstVirtualSelect form={this.props.form}
												apiHost={API_FOODING_ES}
												apiUri={'/party/getLoginCompanies'}
												apiParams={{clusId:checkedData['cluster'] ? checkedData.cluster['id']:groupData['id']}}
												
												fieldName="company"
												initialValue={xt.initSelectValue(dataOne.company && dataOne.company.id , dataOne.company || {}, ['company'], 'localName', form, true)}
												valueKeys={da => ({
													...da,
													s_ignore_label: true
												})}
												rules={true}
												className ={'col-md-8 currency-btn select-from-currency'}
											/>
										</div>
									</div>					
									<div className={'row'}>
										<div className="form-group col-md-6">
											<label className={'col-md-4'}><span>*</span>{I18n.t(600273/*班次编号*/)}</label>
											<input type="text"
												readOnly={checkedData['id'] ? true :false}
												className={getFieldError('code')?'col-md-8 text-input-nowidth error-border':'col-md-8 text-input-nowidth'}
												{...getFieldProps('code',{
													rules: [{required:true}],
													initialValue:dataOne['code'] || ''
												})}
											/>
										</div>	
										<div className="form-group col-md-6">
											<label className={'col-md-4'}><span>*</span>{I18n.t(600274/*班次名称*/)}</label>
											<input type="text"
												className={getFieldError('name')?'col-md-8 text-input-nowidth error-border':'col-md-8 text-input-nowidth'}
												{...getFieldProps('name',{
													rules: [{required:true}],
													initialValue:dataOne['name'] || ''
												})}
											/>
											{ checkedData['id'] ?
												''
												//<i className={'foddingicon fooding-nation_icon'} style={{position:'absolute',top:'9px',right:'10px',cursor:'pointer'}} onClick={this.nativeClick.bind(this,'cstmCrsekt')}></i>
												:''
											}
										</div>
									</div>
									<div className={'row'}>
										<div className="form-group col-md-6">
											<label className={'col-md-4'}><span>*</span>{I18n.t(600277/*考勤开始时间*/)}</label>
											<TimePickerN 
												form={this.props.form}
												name={"attenceBeginTime"}	
												defaultValue={dataOne['attenceBeginTime'] || ''}
												rules={true}
											/>
										</div>
										<div className="form-group col-md-6">
											<label className={'col-md-4'}><span>*</span>{I18n.t(600275/*上班时间*/)}</label>
											<TimePickerN 
												form={this.props.form}
												name={"officeTime"}	
												defaultValue={dataOne['officeTime'] || ''}
												rules={true}
											/>
										</div>
									</div>
									<div className={'row'}>
										<div className="form-group col-md-6">
											<label className={'col-md-4'}>{I18n.t(600278/*休息开始时间*/)}</label>
											<TimePickerN 
												form={this.props.form}
												name={"halfTimeBegin"}	
												defaultValue={dataOne['halfTimeBegin'] || ''}
											/>										
										</div>
										<div className="form-group col-md-6">
											<label className={'col-md-4'}>{I18n.t(600279/*休息结束时间*/)}</label>
											<TimePickerN 
												form={this.props.form}
												name={"halfTimeEnd"}	
												defaultValue={dataOne['halfTimeEnd'] || ''}
											/>	
										</div>
									</div>						
									<div className={'row'}>
										<div className="form-group col-md-6">
											<label className={'col-md-4'}><span>*</span>{I18n.t(600276/*下班时间*/)}</label>
											<TimePickerN 
												form={this.props.form}
												name={"closingTime"}	
												defaultValue={dataOne['closingTime'] || ''}
												rules={true}
											/>
										</div>
										<div className="form-group col-md-6">
											<label className={'col-md-4'}>{I18n.t(600280/*早退允许值*/)}</label>
											<input type="text" 
												className={getFieldError('leaveEarly')?'col-md-8 text-input-nowidth error-border':'col-md-8 text-input-nowidth'}
												style={{width:'130px'}}
												{...getFieldProps('leaveEarly',{
													rules: [{required:false,pattern:xt.pattern.positiveInteger}],								
													initialValue:dataOne['leaveEarly'] || ''
												})}
											/>
											<span>&nbsp;{I18n.t(400196/*分钟*/)}</span>
										</div>
									</div>
									<div className={'row'}>
										<div className="form-group col-md-6">
											<label className={'col-md-4'}>{I18n.t(600281/*迟到允许值*/)}</label>
											<input type="text" 
												className={getFieldError('beLate')?'col-md-8 text-input-nowidth error-border':'col-md-8 text-input-nowidth'}
												style={{width:'130px'}}
												{...getFieldProps('beLate',{
													rules: [{required:false,pattern:xt.pattern.positiveInteger}],								
													initialValue:dataOne['beLate'] || ''
												})}
											/>
											<span>&nbsp;{I18n.t(400196/*分钟*/)}</span>								  
										</div>	
										<div className="form-group col-md-6">
											<label className={'col-md-4'}>{I18n.t(600282/*加班起始值*/)}</label>
											<input type="text" 
												className={getFieldError('overTime')?'col-md-8 text-input-nowidth error-border':'col-md-8 text-input-nowidth'}
												style={{width:'130px'}}
												{...getFieldProps('overTime',{
													rules: [{required:false,pattern:xt.pattern.positiveInteger}],								
													initialValue:dataOne['overTime'] || ''
												})}
											/>
											<span>&nbsp;{I18n.t(400196/*分钟*/)}</span>								  
										</div>
									</div>						
									<div className={'row'}>
										<div className="form-group col-md-6">
											<label className={'col-md-4'}>{I18n.t(600283/*旷工起始值*/)}</label>
											<input type="text" 
												className={getFieldError('absenteeism')?'col-md-8 text-input-nowidth error-border':'col-md-8 text-input-nowidth'}
												style={{width:'130px'}}
												{...getFieldProps('absenteeism',{
													rules: [{required:false,pattern:xt.pattern.positiveInteger}],								
													initialValue:dataOne['absenteeism'] || ''
												})}
											/>
											<span>&nbsp;{I18n.t(400196/*分钟*/)}</span>								  
										</div>
										<div className="form-group col-md-6">
											<label className={'col-md-4'}>{I18n.t(100300/*创建日期*/)}</label>
											<span>{new Date(dataOne['createDate']).Format('yyyy-MM-dd')}</span>
										</div>
									</div>
									<div className={'row'}>
										<div className="form-group col-md-6">
											<label className={'col-md-4'}>{I18n.t(600270/*标准工时*/)}</label>
											<span>{dataOne['manHour']}</span>
										</div>
										<div className="form-group col-md-6">
											<label className={'col-md-4'}>{I18n.t(100002/*描述*/)}</label>
											<textarea
												{...getFieldProps('memo',{
													initialValue:dataOne['memo'] || ''
												})}
												className={'col-md-8 text-input-nowidth'}
												style={{resize:'none',height:'50px'}}
											>
											</textarea>
										</div>
									</div>
									<div className={'row'}>
											<div className='form-group col-md-6'>
												<label className={'col-md-4'}>{I18n.t(100549/*是否默认*/)}</label>
												<Checkbox
													{...getFieldProps('approve',{
														initialValue:dataOne['approve'] || false
													})}
													checked={this.props.form.getFieldValue("approve")?true:false}
												/>
											</div>
									</div>
								</div>
								:''
							}
						</div>
						<Dialog width={976} visible={this.state.showDilaogsecond} title={this.state.title}>
							{this.state.dialogContent}
						</Dialog>						
				</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(Productplug);
export default ProductForm;

