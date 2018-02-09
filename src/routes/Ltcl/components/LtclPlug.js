import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import i18n from './../../../lib/i18n';
import {I18n } from '../../../lib/i18n';
import WebData from '../../../common/WebData';
import xt from '../../../common/xt'; // 下拉
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option,ConstVirtualSelect } from '../../../components/Select'; // 下拉
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,API_FOODING_ES} from '../../../services/apiCall';
export class FclPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.handlePortType = this.handlePortType.bind(this);
		this.handleTransportationCompany = this.handleTransportationCompany.bind(this);
		this.handleCurrency = this.handleCurrency.bind(this);
		this.handleStatesPort = this.handleStatesPort.bind(this);
		this.handleDestinationPort = this.handleDestinationPort.bind(this);
		this.changePortType = this.changePortType.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.state = {
			portType: [{id:1,localName:''}], // 港口类型（运输方式）
			transportationCompany: [{id:1,localName:''}], // 货代公司
			currency: [{id:1,localName:''}], // 币种
			statesPort: [{id:1,localName:''}], // 起运港
			destinationPort: [{id:1,localName:''}], // 目的港						
			portTypeID: '', // 港口类型 id
			portTypeVal:'', // 港口类型的值
			clearFrom: false, // 清空表单
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

		this.props.form.resetFields(['sStatnId','eStatnId']); // 清除表单
		this.setState({clearFrom: true}); 

		switch( value ){
			case '10':
				this.setState({ portTypeID:value, portTypeVal:'seaMeasure', portTypeResult:true, statesPort: [{id:1,localName:''}]});
			break;
			case '20':
				this.setState({ portTypeID:value, portTypeVal:'trainMeasure', portTypeResult:true, statesPort: [{id:1,localName:''}]});				
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

	// 目的港  
	handleDestinationPort(){
		let that = this;
		(this.state.portTypeID || this.props.checkedData['statnTyId']) ?
			that.props.form.validateFields((errors, value)=>{
				apiPost(API_FOODING_DS,'/object/getMiniList',
				{
					"obj":"com.fooding.fc.ds.entity.Statn", 
					"queryParams":[{attr: "statnTyId", expression: "=", value: value['statnTyId']}]	
				},
				(response)=>{							
					this.setState({	destinationPort:response.data });
				},(errors)=>{
					ServiceTips({ text:errors.message,type:'error'});
				})
			})		

			:
			ServiceTips({ text:I18n.t(600007/*请选择运输方式！*/),type:'error'});
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
						this.setState({ portTypeVal: '',portTypeResult:false, portTypeID: '' },function(){
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

	// 取消
	onCancel(){
		this.setState({ portTypeVal: '', portTypeResult: false, portTypeID: '' },function(){
			this.props.form.resetFields(); // 清除表单
			this.props.onSaveAndClose(); // 关闭弹框
		});

	}


	render(){
		let that = this;
		const { getNFieldProps, getFieldProps, getFieldError,getFieldValue } = this.props.form;
		let {checkedData,initData} = this.props;
		let {clearFrom} = this.state;
		let EachPage = checkedData.statnTyId ? this.state.portTypeVal ? initData[this.state.portTypeVal]  : checkedData.statnTyId == 10 ? initData['seaMeasure'] : initData['trainMeasure'] : initData[this.state.portTypeVal];  // 遍历的 页面片段
		let result = checkedData.statnTyId ? true : this.state.portTypeResult;	
		let content = <div></div>;
		let ccLocalName = WebData.user.data.staff.company.localName;
		let ccenName  =   WebData.user.data.staff.company.enName;
		let Cid = WebData.user.data.staff.company.id;

		let LocalName = WebData.user.data.staff.localName;
		let LocalEname = WebData.user.data.staff.enName;
		let Ccid = WebData.user.data.staff.id;
		getNFieldProps('type', {
			initialValue: 30,
		});

		getNFieldProps('prices.aaa', {
			initialValue: '',
		});




		if(this.props.DialogContent == 1){
           content = (
           	<div className="packageplug-add scroll girdlayout" style={{height:'300px',overflow:'auto'}}>
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
						<div className="col-md-9">
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
								style={{width:300,marginRight:15}}
								className ={getFieldError('statnTyId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handlePortType}
								onSelect={this.changePortType}	
								allowClear={false}							
												
							>
								{this.state.portType.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
							</Select>							
						</div>
					</div>
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(200343/*货运公司*/)}</label>
						<div className="col-md-9">
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
								style={{width:300,marginRight:15}}
								className ={getFieldError('lsBeId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handleTransportationCompany}
								allowClear={false}
							>
								{this.state.transportationCompany.map((o,i)=><Option key={i} objValue={{s_label:o.localName,lsBeId:o.id,lsBeLcName:o.localName,lsBeEnName:o.enName}} title={o.localName}>{o.localName}</Option>)}
							</Select>							
						</div>
					</div>					
				</div>
				<div className="row">
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100297/*起运港*/)}</label>
						<div className="col-md-9">
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
								style={{width:300,marginRight:15}}
								className ={getFieldError('sStatnId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handleStatesPort}
								allowClear={false}
							>
								{this.state.statesPort.map((o,i)=><Option key={i} objValue={{s_label:o.localName,sStatnId:o.id,sStatnLcName:o.localName,sStatnEnName:o.enName}} title={o.localName}>{o.localName}</Option>)}
							</Select>							
						</div>
					</div>
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100298/*目的港*/)}</label>
						<div className="col-md-9">
							<Select
								placeholder=''
								{...getNFieldProps('eStatnId',{
									rules: [{required:true}],
									initialValue: checkedData['eStatnId'] ? 
													clearFrom ? '' : { s_label: checkedData['eStatn'+language], eStatnId: checkedData.eStatnId, eStatnLcName: checkedData.eStatnLcName, eStatnEnName: checkedData.eStatnEnName} 
													: 
													''								
								})} 
								optionLabelProp="children"
								style={{width:300,marginRight:15}}
								className ={getFieldError('eStatnId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handleDestinationPort}
								allowClear={false}
							>
								{this.state.destinationPort.map((o,i)=><Option key={i} objValue={{s_label:o.localName,eStatnId:o.id,eStatnLcName:o.localName,eStatnEnName:o.enName}} title={o.localName}>{o.localName}</Option>)}
							</Select>							
						</div>
					</div>					
				</div>
				<div className="row">
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100284/*币种*/)}</label>
						<div className="col-md-9">
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
								style={{width:300,marginRight:15}}
								className ={getFieldError('cnyId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handleCurrency}
								allowClear={false}
							>
								{this.state.currency.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>							
						</div>
					</div>
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100288/*发布日期*/)}</label>
						<div className="col-md-9">
							<Calendar width={300} showTime = {false} 
								isShowIcon={true} form={this.props.form} 
								validate={true}
								className ={getFieldError('reDate')?'error-border':''}
								name={'reDate'}
								value={checkedData['sDate']}						
							/>							
						</div>
					</div>					
				</div>
				<div className="row">
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100286/*生效日期*/)}</label>
						<div className="col-md-9">
							<Calendar width={300}   showTime = {false} isShowIcon={true} form={this.props.form} 
								validate={true}
								className ={getFieldError('sDate')?'error-border':''}						
								name={'sDate'}
								value={checkedData['reDate']}
							/>							
						</div>
					</div>
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(500120/*终止日期*/)}</label>
						<div className="col-md-9">
							<Calendar width={300}  showTime = {false} isShowIcon={true} form={this.props.form}
								validate={true}
								className ={getFieldError('eDate')?'error-border':''}
								name={'eDate'}
								value={checkedData['eDate']}												
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
				<ul className='foreach'>
					{ initData['lclCharge'] ?  
							initData['lclCharge'].map((e,i)=>{
								return (
									<li key={e.id}>
										<label className='col-md-3'>{e.localName}</label>
										<div className="col-md-9">
											<input type="text" placeholder=''
												{...getFieldProps("prices." + e.id , {
													initialValue: this.state.portTypeVal ? '' : checkedData.prices ? checkedData.prices[e.id] : ''
													
												})} 
												className="text-input" 
												style={{marginRight:15}}
											/>										
										</div>
									</li>
								)
							})
						
						:
						<s></s>
					}					
				</ul>
           	</div>
           	);
		}else if(this.props.DialogContent==3){
			getNFieldProps('id', {
			initialValue: checkedData ? checkedData['id'] : '',
		});
				content = (
           	<div className="packageplug-add scroll girdlayout" style={{height:'300px',overflow:'auto'}}>
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
						<div className="col-md-9">
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
								style={{width:300,marginRight:15}}
								className ={getFieldError('statnTyId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handlePortType}
								onSelect={this.changePortType}	
								allowClear={false}							
												
							>
								{this.state.portType.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
							</Select>							
						</div>
					</div>
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(200343/*货运公司*/)}</label>
						<div className="col-md-9">
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
								style={{width:300,marginRight:15}}
								className ={getFieldError('lsBeId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handleTransportationCompany}
								allowClear={false}
							>
								{this.state.transportationCompany.map((o,i)=><Option key={i} objValue={{s_label:o.localName,lsBeId:o.id,lsBeLcName:o.localName,lsBeEnName:o.enName}} title={o.localName}>{o.localName}</Option>)}
							</Select>							
						</div>
					</div>					
				</div>
				<div className="row">
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100297/*起运港*/)}</label>
						<div className="col-md-9">
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
								style={{width:300,marginRight:15}}
								className ={getFieldError('sStatnId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handleStatesPort}
								allowClear={false}
							>
								{this.state.statesPort.map((o,i)=><Option key={i} objValue={{s_label:o.localName,sStatnId:o.id,sStatnLcName:o.localName,sStatnEnName:o.enName}} title={o.localName}>{o.localName}</Option>)}
							</Select>							
						</div>
					</div>
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100298/*目的港*/)}</label>
						<div className="col-md-9">
							<Select
								placeholder=''
								{...getNFieldProps('eStatnId',{
									rules: [{required:true}],
									initialValue: checkedData['eStatnId'] ? 
													clearFrom ? '' : { s_label: checkedData['eStatn'+language], eStatnId: checkedData.eStatnId, eStatnLcName: checkedData.eStatnLcName, eStatnEnName: checkedData.eStatnEnName} 
													: 
													''								
								})} 
								optionLabelProp="children"
								style={{width:300,marginRight:15}}
								className ={getFieldError('eStatnId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handleDestinationPort}
								allowClear={false}
							>
								{this.state.destinationPort.map((o,i)=><Option key={i} objValue={{s_label:o.localName,eStatnId:o.id,eStatnLcName:o.localName,eStatnEnName:o.enName}} title={o.localName}>{o.localName}</Option>)}
							</Select>							
						</div>
					</div>					
				</div>
				<div className="row">
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100284/*币种*/)}</label>
						<div className="col-md-9">
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
								style={{width:300,marginRight:15}}
								className ={getFieldError('cnyId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handleCurrency}
								allowClear={false}
							>
								{this.state.currency.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>							
						</div>
					</div>
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100288/*发布日期*/)}</label>
						<div className="col-md-9">
							<Calendar width={300} showTime = {false} 
								isShowIcon={true} form={this.props.form} 
								validate={true}
								className ={getFieldError('reDate')?'error-border':''}
								name={'reDate'}
								value={checkedData['sDate']}						
							/>							
						</div>
					</div>					
				</div>
				<div className="row">
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(100286/*生效日期*/)}</label>
						<div className="col-md-9">
							<Calendar width={300}   showTime = {false} isShowIcon={true} form={this.props.form} 
								validate={true}
								className ={getFieldError('sDate')?'error-border':''}						
								name={'sDate'}
								value={checkedData['reDate']}
							/>							
						</div>
					</div>
					<div className='col-md-6'>
						<label className='col-md-3'><span>*</span>{I18n.t(500120/*终止日期*/)}</label>
						<div className="col-md-9">
							<Calendar width={300}  showTime = {false} isShowIcon={true} form={this.props.form}
								validate={true}
								className ={getFieldError('eDate')?'error-border':''}
								name={'eDate'}
								value={checkedData['eDate']}												
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
				<ul className='foreach'>
					{ initData['lclCharge'] ?  
							initData['lclCharge'].map((e,i)=>{
								return (
									<li key={e.id}>
										<label className='col-md-3'>{e.localName}</label>
										<div className="col-md-9">
											<input type="text" placeholder=''
												{...getFieldProps("prices." + e.id , {
													initialValue: this.state.portTypeVal ? '' : checkedData.prices ? checkedData.prices[e.id] : ''
													
												})} 
												className="text-input" 
												style={{marginRight:15}}
											/>										
										</div>
									</li>
								)
							})
						
						:
						<s></s>
					}					
				</ul>
           	</div>
           	);
		}else if(this.props.DialogContent==4){
			content = (
				<div className='scroll lose'>
							<span>
								<i>*</i>
								失效原因
							</span>
							<Select
								placeholder={''}
								style={{width: 450}}
								getPopupContainer={this.getPopupContainer}
						    >
							   	<Option value={'111111'}>11</Option>
							</Select>
				</div>
			)
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
