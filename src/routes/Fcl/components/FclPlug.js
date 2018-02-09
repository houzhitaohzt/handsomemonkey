import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
// common 
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option,ConstVirtualSelect} from '../../../components/Select'; // 下拉
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,API_FOODING_ES } from '../../../services/apiCall';
import i18n from './../../../lib/i18n';
import {I18n } from '../../../lib/i18n';
import WebData from '../../../common/WebData';
import xt from '../../../common/xt'; // 下拉



export class FclPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);

		// even func
		this.handlePortType = this.handlePortType.bind(this);
		this.handleTransportationCompany = this.handleTransportationCompany.bind(this);
		this.handleCurrency = this.handleCurrency.bind(this);
		this.handleStatesPort = this.handleStatesPort.bind(this);
				
		this.changePortType = this.changePortType.bind(this);

		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		
		

		// init state
		this.state = {
			portType: [{id:1,localName:''}], // 港口类型（运输方式）
			transportationCompany: [{id:1,localName:''}], // 货代公司
			currency: [{id:1,localName:''}], // 币种
			statesPort: [{id:1,localName:''}], // 起运港
			
			portTypeID: '', // 港口类型 id
			portTypeVal:'', // 港口类型的值
			portTypeResult:false, // 港口类型的状态

			clearFrom: false, // 清空表单

			initData: this.props.initData
		}

	}
	getData(value,that){
		this.addSelect = that;
	}

	// 港口类型
	handlePortType(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.portType,
			(response)=>{							
				this.setState({	portType:response.data.filter((o)=>Number(o['id']) == 10 || Number(o['id']) == 20)});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	// 港口类型 切换
	changePortType(value){
		this.props.form.resetFields(['sStatnId']); // 清除表单
		this.setState({clearFrom: true}); 

		switch( value ){
			case '10':
				this.setState({ portTypeID:value, portTypeVal:'seaBox', portTypeResult:true, statesPort: [{id:1,localName:''}]});
			break;
			case '20':
				this.setState({ portTypeID:value, portTypeVal:'trainBox', portTypeResult:true, statesPort: [{id:1,localName:''}]});				
			break;
			default:
				this.setState({ portTypeID:'', portTypeVal:'', portTypeResult:false, statesPort: [{id:1,localName:''}]});				
				ServiceTips({ text:I18n.t(600006/*只支持铁运或者海运！*/),type:'error'});
		}
	}

	// 起运港 
	handleStatesPort(){

		let that = this; 
		function ajax(){
			that.state.portTypeID ?
			that.props.form.validateFields((errors, value)=>{
				apiPost(API_FOODING_DS,'/object/getMiniList',
				{ 
					"obj":"com.fooding.fc.ds.entity.Statn", 
					"queryParams":[{attr: "statnTyId", expression: "=", value: value['statnTyId']}]	
				},
				(response)=>{							
					that.setState({	statesPort:response.data });
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
				})			
			})			

				:
				ServiceTips({ text:I18n.t(600007/*请选择运输方式！*/),type:'error'});
		}


		if(this.props.checkedData.statnTyId){
			this.setState({portTypeID: this.props.checkedData.statnTyId},function(){
				ajax();
			});
		} else{
			ajax();
		}
	}


	// 货运公司
	handleTransportationCompany(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.transportationCompany,
			(response)=>{							
				this.setState({	transportationCompany:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	// 币种 ajax 
	handleCurrency(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.currency,
			(response)=>{							
				this.setState({	currency:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 保存
	onSaveAndClose(){

		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_ERP,'/termsportcharges/cc/save',value,
					(response)=>{	

						this.setState({ portTypeVal: '', portTypeResult: false, portTypeID: '' },function(){
							ServiceTips({text:response.message,type:'success'});
							that.props.form.resetFields(); // 清除表单
							that.props.onSaveAndClose(); // 关闭弹框
							that.props.getPage();	// 刷新页面
						});						

					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})		
	}
	// onSaveAndClose(isAdd){
	// 	const {form, onSaveAndClose} = this.props;
	// 	form.validateFields((errors, value) => {
	// 		if(errors){

	// 		}else{
	// 			if(this.props.DialogContent == 1){
	// 				this.setState({ portTypeVal: '', portTypeResult: false, portTypeID: '' },function(){
	// 						let params = this.props.form.getFieldsValue();
	// 						this.props.onSaveAndClose(params,{},isAdd);
	// 				});
					
	// 			}else{
	// 				this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.props.checkedData,isAdd);
	// 			}

				
	// 		}
	// 	})
	// }
	// 取消
	onCancel(){
		this.setState({ portTypeVal: '', portTypeResult: false, portTypeID: '' },function(){
			this.props.onSaveAndClose(); // 关闭弹框
		this.props.form.resetFields();
		});

	}


	render(){
		let that = this;
		const { getNFieldProps, getFieldProps, getFieldError,getFieldValue } = this.props.form;
		let {checkedData,initData} = this.props;
		let {clearFrom} = this.state;
		let content = <div></div>;

		// let EachPage = initData[this.state.portTypeVal];  // 遍历的 页面片段
		let EachPage = checkedData.statnTyId ? this.state.portTypeVal ? initData[this.state.portTypeVal]  : checkedData.statnTyId == 10 ? initData['seaBox'] : initData['trainBox'] : initData[this.state.portTypeVal];  // 遍历的 页面片段
		let result = checkedData.statnTyId ? true : this.state.portTypeResult;		
		let ccLocalName = WebData.user.data.staff.company.localName;
		let ccenName  =   WebData.user.data.staff.company.enName;
		let Cid = WebData.user.data.staff.company.id;

		let LocalName = WebData.user.data.staff.localName;
		let LocalEname = WebData.user.data.staff.enName;
		let Ccid = WebData.user.data.staff.id;

		getNFieldProps('type', {
			initialValue: 10,
		});

		getNFieldProps('prices.aaa', {
			initialValue: '',
		});

		if(this.props.DialogContent == 1){
           content = (
           	<div className="packageplug-add scroll girdlayout">
           		<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500259/*发布企业*/)}</label>
														<ConstVirtualSelect
								                        placeholder=""
								                        form={this.props.form}
								                       fieldName='ccId'
								                        apiHost={API_FOODING_ES}
								                        apiUri='/party/getLoginCompanies'
								                        apiParams={{}}
								                         disabled={true}	    
								                         initialValue={xt.initSelectValue(ccLocalName,{s_label:ccLocalName,ccId:Cid,ccLcName:ccLocalName,ccEnName:ccenName},['ccId','ccLcName','ccEnName'], 's_label', this.props.form)}
								                        valueKeys={ da => ({
													     
													        ccId: da.id,
													         ccLcName: da.localName,
													         ccEnName: da.name,
													        s_label: da.localName
													    })}
													     rules
								                        className ={'currency-btn select-from-currency col-md-8 col-lg-8'}  
								                    />
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200937/*发布人*/)}</label>
													<ConstVirtualSelect
													refreshMark={getFieldValue('ccId',{}).ccId || getFieldValue('ccId')}
							                        placeholder=""
							                        form={this.props.form}
							                         disabled={true}	
							                       fieldName='reStaffId'
							                        apiHost={API_FOODING_ES}
							                        apiUri='/staff/getListByCcId'
							                        apiParams={{
							                            ccid: getFieldValue('ccId',{}).ccId || getFieldValue('ccId')
							                            
							                        }}
							                         initialValue={xt.initSelectValue(LocalName&& getFieldValue("ccId",{}).ccId == Cid,{s_label:LocalName,reStaffId:Ccid,reStaffLcName:LocalName,reStaffEnName:LocalEname},['reStaffId','reStaffLcName','reStaffEnName'], 's_label', this.props.form)}
							                        valueKeys={ da => ({
												         reStaffId: da.id,
												         reStaffLcName: da.localName,
												         reStaffEnName: da.name,
												        s_label: da.localName
												    })}
												     rules
							                        className ={'currency-btn select-from-currency col-md-8 col-lg-8'}  
							                    />
											</div>
				</div>
				<div className="row">
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100224/*运输方式*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('statnTyId',{
								rules: [{required:true}],
								initialValue: checkedData['statnTyId'] ? 
												{ s_label: checkedData['statnTyName'], statnTyId: checkedData.statnTyId, statnTyName: checkedData.statnTyName} 
												: 
												''	
							})} 
							optionLabelProp="children"
							className ={getFieldError('statnTyId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
							onClick={this.handlePortType}
							onSelect={this.changePortType}	
							allowClear={false}
						>
							{this.state.portType.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>						
					</div>
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100297/*起运港*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('sStatnId',{
								rules: [{required:true}],
								initialValue: checkedData['sStatnId'] ? 
												clearFrom ? '' : { s_label: checkedData['sStatn'+language], sStatnId: checkedData.sStatnId, sStatnLcName: checkedData.sStatnLcName, sStatnEnName: checkedData.sStatnEnName} 
												: 
												''								
							})} 
							optionLabelProp="children"
							className ={getFieldError('sStatnId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
							onClick={this.handleStatesPort}
							allowClear={false}
							
						>
							{this.state.statesPort.map((o,i)=><Option key={i} objValue={{s_label:o.localName,sStatnId:o.id,sStatnLcName:o.localName,sStatnEnName:o.enName}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
				</div>
				<div className="row">
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(200343/*货运公司*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('lsBeId',{
								rules: [{required:true}],
								initialValue: checkedData['lsBeId'] ? 
												{ s_label: checkedData['lsBe'+language], lsBeId: checkedData.lsBeId, lsBeLcName: checkedData.lsBeLcName, lsBeEnName: checkedData.lsBeEnName} 
												: 
												''									
							})} 
							optionLabelProp="children"
							className ={getFieldError('lsBeId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
							onClick={this.handleTransportationCompany}
							allowClear={false}							
						>
							{this.state.transportationCompany.map((o,i)=><Option key={i} objValue={{s_label:o.localName,lsBeId:o.id,lsBeLcName:o.localName,lsBeEnName:o.enName}} title={o.localName}>{o.localName}</Option>)}
						</Select>						
					</div>
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100284/*币种*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('cnyId',{
								rules: [{required:true}],
								initialValue: checkedData['cnyId'] ? 
												{ s_label: checkedData['cny'+language], cnyId: checkedData.cnyId, cnyLcName: checkedData.cnyLcName, cnyEnName: checkedData.cnyEnName} 
												: 
												''								
							})}
							optionLabelProp="children"
							className ={getFieldError('cnyId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
							onClick={this.handleCurrency}
							allowClear={false}							
						>
							{this.state.currency.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
				</div>
				<div className="row">
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100286/*生效日期*/)}</label> 
						<div className='col-md-8 col-lg-8 datetime'>
							<Calendar    
							showTime = {false} isShowIcon={true} form={this.props.form} 
							validate={true}					
							name={'sDate'}
							width={'100%'}
							value={checkedData['reDate']}
							/>
						</div>
					</div>
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(500120/*终止日期*/)}</label>
						<div className='col-md-8 col-lg-8 datetime'>
							<Calendar   showTime = {false} isShowIcon={true} form={this.props.form}
							validate={true}
							width={'100%'}
							name={'eDate'}
							value={checkedData['eDate']}												
							/>
						</div>
					</div>
				</div>
				<div className="row">
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100288/*发布日期*/)}</label>
						<div className='col-md-8 col-lg-8 datetime'>
							<Calendar  showTime = {false} 
							isShowIcon={true} form={this.props.form} 
							validate={true}
							width={'100%'}
							name={'reDate'}
							value={checkedData['sDate']}						
							/> 
						</div>
					</div>
				</div>
				<ul className='foreach'>
				{ result ?  
						 EachPage.map((e,i)=>{
							return (
								<li key={e.id}>
									<label className='col-md-3'><span>*</span>{e.localName}</label>
									<input type="text" placeholder=''
									{...getFieldProps("prices." + e.id , {
										initialValue: this.state.portTypeVal ? '' : checkedData.prices ? checkedData.prices[e.id] : ''
										
									})} 
									className={getFieldError('prices.'+e.id)?"col-md-8 col-lg-8 text-input-nowidth error-border":"col-md-8 col-lg-8 text-input-nowidth"} 
									/>
								</li>
							)
						})
					
					:
					<s></s>
				}
				</ul>
           	</div>
           	);
		}else if(this.props.DialogContent == 3){
			getNFieldProps('id', {
			initialValue: checkedData ? checkedData['id'] : '',
		});
			 content = (
           	<div className="packageplug-add scroll girdlayout">
           		<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500259/*发布企业*/)}</label>
														<ConstVirtualSelect
								                        placeholder=""
								                        form={this.props.form}
								                       fieldName='ccId'
								                        apiHost={API_FOODING_ES}
								                        apiUri='/party/getLoginCompanies'
								                        apiParams={{}}
								                         disabled={true}	    
								                         initialValue={xt.initSelectValue(ccLocalName,{s_label:ccLocalName,ccId:Cid,ccLcName:ccLocalName,ccEnName:ccenName},['ccId','ccLcName','ccEnName'], 's_label', this.props.form)}
								                        valueKeys={ da => ({
													     
													        ccId: da.id,
													         ccLcName: da.localName,
													         ccEnName: da.name,
													        s_label: da.localName
													    })}
													     rules
								                        className ={'currency-btn select-from-currency col-md-8 col-lg-8'}  
								                    />
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200937/*发布人*/)}</label>
													<ConstVirtualSelect
													refreshMark={getFieldValue('ccId',{}).ccId || getFieldValue('ccId')}
							                        placeholder=""
							                        form={this.props.form}
							                         disabled={true}	
							                       fieldName='reStaffId'
							                        apiHost={API_FOODING_ES}
							                        apiUri='/staff/getListByCcId'
							                        apiParams={{
							                            ccid: getFieldValue('ccId',{}).ccId || getFieldValue('ccId')
							                            
							                        }}
							                         initialValue={xt.initSelectValue(LocalName&& getFieldValue("ccId",{}).ccId == Cid,{s_label:LocalName,reStaffId:Ccid,reStaffLcName:LocalName,reStaffEnName:LocalEname},['reStaffId','reStaffLcName','reStaffEnName'], 's_label', this.props.form)}
							                        valueKeys={ da => ({
												         reStaffId: da.id,
												         reStaffLcName: da.localName,
												         reStaffEnName: da.name,
												        s_label: da.localName
												    })}
												     rules
							                        className ={'currency-btn select-from-currency col-md-8 col-lg-8'}  
							                    />
											</div>
											</div>
				<div className="row">
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100224/*运输方式*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('statnTyId',{
								rules: [{required:true}],
								initialValue: checkedData['statnTyId'] ? 
												{ s_label: checkedData['statnTyName'], statnTyId: checkedData.statnTyId, statnTyName: checkedData.statnTyName} 
												: 
												''	
							})} 
							optionLabelProp="children"
							className ={getFieldError('statnTyId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
							onClick={this.handlePortType}
							onSelect={this.changePortType}	
							allowClear={false}
						>
							{this.state.portType.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>						
					</div>
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100297/*起运港*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('sStatnId',{
								rules: [{required:true}],
								initialValue: checkedData['sStatnId'] ? 
												clearFrom ? '' : { s_label: checkedData['sStatn'+language], sStatnId: checkedData.sStatnId, sStatnLcName: checkedData.sStatnLcName, sStatnEnName: checkedData.sStatnEnName} 
												: 
												''								
							})} 
							optionLabelProp="children"
							className ={getFieldError('sStatnId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
							onClick={this.handleStatesPort}
							allowClear={false}
							
						>
							{this.state.statesPort.map((o,i)=><Option key={i} objValue={{s_label:o.localName,sStatnId:o.id,sStatnLcName:o.localName,sStatnEnName:o.enName}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
				</div>
				<div className="row">
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(200343/*货运公司*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('lsBeId',{
								rules: [{required:true}],
								initialValue: checkedData['lsBeId'] ? 
												{ s_label: checkedData['lsBe'+language], lsBeId: checkedData.lsBeId, lsBeLcName: checkedData.lsBeLcName, lsBeEnName: checkedData.lsBeEnName} 
												: 
												''									
							})} 
							optionLabelProp="children"
							className ={getFieldError('lsBeId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
							onClick={this.handleTransportationCompany}
							allowClear={false}							
						>
							{this.state.transportationCompany.map((o,i)=><Option key={i} objValue={{s_label:o.localName,lsBeId:o.id,lsBeLcName:o.localName,lsBeEnName:o.enName}} title={o.localName}>{o.localName}</Option>)}
						</Select>						
					</div>
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100284/*币种*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('cnyId',{
								rules: [{required:true}],
								initialValue: checkedData['cnyId'] ? 
												{ s_label: checkedData['cny'+language], cnyId: checkedData.cnyId, cnyLcName: checkedData.cnyLcName, cnyEnName: checkedData.cnyEnName} 
												: 
												''								
							})}
							optionLabelProp="children"
							className ={getFieldError('cnyId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
							onClick={this.handleCurrency}
							allowClear={false}							
						>
							{this.state.currency.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
				</div>
				<div className="row">
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100286/*生效日期*/)}</label> 
						<div className='col-md-8 col-lg-8 datetime'>
							<Calendar    
							showTime = {false} isShowIcon={true} form={this.props.form} 
							validate={true}					
							name={'sDate'}
							width={'100%'}
							value={checkedData['reDate']}
							/>
						</div>
					</div>
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(500120/*终止日期*/)}</label>
						<div className='col-md-8 col-lg-8 datetime'>
							<Calendar   showTime = {false} isShowIcon={true} form={this.props.form}
							validate={true}
							width={'100%'}
							name={'eDate'}
							value={checkedData['eDate']}												
							/>
						</div>
					</div>
				</div>
				<div className="row">
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100288/*发布日期*/)}</label>
						<div className='col-md-8 col-lg-8 datetime'>
							<Calendar  showTime = {false} 
							isShowIcon={true} form={this.props.form} 
							validate={true}
							width={'100%'}
							name={'reDate'}
							value={checkedData['sDate']}						
							/> 
						</div>
					</div>
				</div>
				<ul className='foreach'>
				{ result ?  
						 EachPage.map((e,i)=>{
							return (
								<li key={e.id}>
									<label className='col-md-3'><span>*</span>{e.localName}</label>
									<input type="text" placeholder=''
									{...getFieldProps("prices." + e.id , {
										initialValue: this.state.portTypeVal ? '' : checkedData.prices ? checkedData.prices[e.id] : ''
										
									})} 
									className={getFieldError('prices.'+e.id)?"col-md-8 col-lg-8 text-input-nowidth error-border":"col-md-8 col-lg-8 text-input-nowidth"} 
									/>
								</li>
							)
						})
					
					:
					<s></s>
				}
				</ul>
           	</div>
           	);
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}> 
						{content}
					</FormWrapper>
			</div>
		)
	}
}






const ProductForm =createForm()(FclPlug);
export default ProductForm;
