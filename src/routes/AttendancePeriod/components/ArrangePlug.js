import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../components/Select';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Dialog from '../../../components/Dialog/Dialog';


import {apiGet,apiPost,apiForm,API_FOODING_HR,API_FOODING_ES,API_FOODING_DS} from '../../../services/apiCall';
import ServiceTips from "../../../components/ServiceTips";//提示框
import {I18n} from "../../../lib/i18n";
import xt from '../../../common/xt';


import WebData from '../../../common/WebData';





export class Productplug extends Component{
	
	constructor(props){
		super(props);
		let groupData = WebData.user.data.staff.cluster || {};

		// this state 
		this.state = {
			groupData:groupData, // 集团
			dataOne:{}, // getOne
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

		console.log( this.props.form.getFieldValue('code') );
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				let params = Object.assign({},dataOne,value,{
					cluster:groupData,
					// leaveEarly:Number(value['leaveEarly']),
					// beLate:Number(value['beLate']),
					// overTime:Number(value['overTime']),
					// absenteeism:Number(value['absenteeism'])
				});

				console.log(value);

				apiPost(API_FOODING_HR,'/attendanceCycle/save',params,
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

		if( !checkedData['id'] ) return;

		apiGet(API_FOODING_HR,'/attendanceCycle/getOne',{id:checkedData['id']},
			(response)=>{
				that.setState({
					dataOne: response['data']
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 班次名称 多语言 
	nativeClick = (object) => {

		let content=require('../../MenuSetting/components/MoreLanguageSetDialog').default;
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
		let {dataOne,groupData} = this.state;
		let {checkedData,form} = this.props;
		const {getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;

		let month = [1,2,3,4,5,6,7,8,9,10,11,12];


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
							<div className={'girdlayout'}>
								<div className={'row'}>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(100243/*集团*/)}</label>
										<span>{groupData['localName']}</span>
									</div>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}><span>*</span>{I18n.t(100244/*企业*/)}</label>
										<ConstVirtualSelect form={this.props.form}
											apiHost={API_FOODING_ES}
											apiUri={'/party/getLoginCompanies'}
											apiParams={{clusId:groupData['id']}}
											
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
										<label className={'col-md-4'}><span>*</span>{I18n.t(600303/*周期编号*/)}</label>
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
										<label className={'col-md-4'}><span>*</span>{I18n.t(600304/*周期名称*/)}</label>
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
									<div className="form-group col-md-12">
										<label className={'col-md-2'}><span>*</span>{I18n.t(200690/*周期类型*/)}</label>
										<ConstVirtualSelect
											style={{width:'100px'}}
											form={this.props.form}
											fieldName="cycleTypeId"
											rules
											apiType={apiPost}
											initValueOptions={dataOne.attendanceCycleType ? [dataOne.attendanceCycleType] : []}
											initialValue={String( dataOne.cycleTypeId )}
											apiParams={{obj:'com.fooding.fc.enumeration.AttendanceCycleType'}}
										/>
										&nbsp;&nbsp;
										{ ( (getFieldValue('cycleTypeId') == 20) || (dataOne['cycleTypeId'] == 20)  ) ?
											'':
											<span>
												<ConstVirtualSelect
													form={this.props.form}
													apiType={apiGet}
													apiHost={API_FOODING_HR}
													apiUri={'/calendar/getYear'}
													fieldName="year"
													rules={true}
													apiParams={{obj:'com.fooding.fc.enumeration.AttendanceCycleType'}}
													style={{width:'100px'}}
													initValueOptions={dataOne.year ? [String(dataOne.year)] : []}
													initialValue={String( dataOne.year )}													
													valueKeys={da => String(da)}

												/>												
												&nbsp;&nbsp;									
												<ConstVirtualSelect
													form={this.props.form}
													isRequest = {false}
													initValueOptions={month}
													initialValue={dataOne['month'] || 1}
													valueKeys={da => String(da)}
													fieldName="month"
													pageSize={3}
													rules={true}
													style={{width:'90px'}}
												/>
											</span>
										}
									</div>
								</div>								

								{ ( (getFieldValue('cycleTypeId') == 20) || (dataOne['cycleTypeId'] == 20)  ) ?
									<div className={'row'}>
										<div className="form-group col-md-6">
											<label className={'col-md-4'}><span>*</span>{I18n.t(400233/*开始日期*/)}</label>
											<Calendar 
												width={'286px'}
												showTime = {false}
												value ={dataOne['beginDate']}
												isShowIcon={true}
												name={'beginDate'}
												form={this.props.form}
												validate={true}
											/>
										</div>										
										<div className="form-group col-md-6">
											<label className={'col-md-4'}><span>*</span>{I18n.t(400234/*结束日期*/)}</label>
											<Calendar 
												width={'286px'}
												showTime = {false}
												value ={dataOne['endDate']}
												isShowIcon={true}
												name={'endDate'}
												form={this.props.form}
												validate={true}
											/>
										</div>
									</div>
									:''
								}
					
								<div className={'row'}>
									<div className="form-group col-md-6">
										<label className={'col-md-4'}>{I18n.t(100300/*创建日期*/)}</label>
										<span>{new Date(dataOne['createDate']).Format('yyyy-MM-dd')}</span>
									</div>
								</div>
								<div className={'row'}>
									<div className="form-group col-md-12">
										<label className={'col-md-2'}>{I18n.t(100002/*描述*/)}</label>
										<textarea
											{...getFieldProps('description',{
												initialValue:dataOne['description'] || ''
											})}
											className={'col-md-10 text-input-nowidth'}
											style={{resize:'none',height:'50px'}}
										>
										</textarea>
									</div>
								</div>

							</div>
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

