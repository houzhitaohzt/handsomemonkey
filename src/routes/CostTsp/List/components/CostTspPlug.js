import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../../components/Select';
import DataTime from  '../../../../components/Calendar/Calendar';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import Calendar from  '../../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList,API_FOODING_ES} from '../../../../services/apiCall';
import {I18n } from '../../../../lib/i18n';
import i18n from './../../../../lib/i18n';
import WebData from '../../../../common/WebData';
import xt from '../../../../common/xt'; // 下拉
export class AirPricePlug extends Component{
	constructor(props){
		super(props);
		this.state={
			zhuangxiangArray:[],
			costlvtrArray:[],
			huodaiArray:[],
			bizhongArray:[],
			xiangxingArray:[],
			jifeimoshiArray:[],
			hanxianArray:[],
			packTyArray:[],
			chuangArray:[],
			qiyunArray:[],
			data:{}

		}
		this.addSelect;
		this.qiyunClick = this.qiyunClick.bind(this);
		this.packTyClick = this.packTyClick.bind(this);
		this.bizhongClick = this.bizhongClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.xiangxingClick = this.xiangxingClick.bind(this);
		this.jifeimoshiClick = this.jifeimoshiClick.bind(this);
		this.costlvtrClick = this.costlvtrClick.bind(this);
		this.hangxianClick = this.hangxianClick.bind(this);
		this.chuangsClick = this.chuangsClick.bind(this);
		this.getData = this.getData.bind(this);
	}
	getData(value,that){
		this.addSelect = that;
		this.props.form.setFieldsValue({routeId:undefined,chargeTy:undefined,costlvtrId:undefined,contnrTyId:undefined,costlvtrId:undefined,cnyId:undefined,costAgg:'',packTy:undefined});
	}
	onSaveAdd(){
		this.onSaveAndClose(true);
	}
	costlvtrClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Costlvtr'},
			(response)=>{
				that.setState({
					costlvtrArray:response.data
				});
		},(error)=>{

		});
	}
	hangxianClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.TransRout'},
			(response)=>{
				that.setState({
					hanxianArray:response.data
				});
		},(error)=>{

		});
	}
	jifeimoshiClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.ChargeType'},
			(response)=>{
				that.setState({
					jifeimoshiArray:response.data
				});
		},(error)=>{

		});
	}
	xiangxingClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.ContnrType'},
			(response)=>{
				that.setState({
					xiangxingArray:response.data
				});
		},(error)=>{

		});

	}
	bizhongClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Curren'},
			(response)=>{
				that.setState({
					bizhongArray:response.data
				});
		},(error)=>{

		});
	}
	packTyClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.PackType'},
			(response)=>{
				that.setState({
					packTyArray:response.data
				});
		},(error)=>{

		});
	}
	qiyunClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Statn',
			queryParams:[{
			attr:"statnTyId",
			expression:"=",
			value:30
		}]
		},
			(response)=>{
				that.setState({
					qiyunArray:response.data
				})
		},(error)=>{

		});
	}
	chuangsClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.AgnShipBe'},
			(response)=>{
				that.setState({
					chuangArray:response.data
				});
		},(error)=>{

		});
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				if(this.props.DialogContent == 1){
					let params = this.props.form.getFieldsValue();
					this.props.onSaveAndClose(params,{},isAdd,this.getData);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.props.checkedData,isAdd);
				}

				
			}
		})
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	render(){
		let that = this;
		const { getFieldProps,getFieldError,getNFieldProps,getFieldValue} = this.props.form;
		let {getTermModes} = this.props;
		let otherData = this.props.checkedData ||{};
		getFieldProps('beType', {
		      initialValue: '10',
	    });
	    let ccLocalName = WebData.user.data.staff.company.localName;
		let ccenName  =   WebData.user.data.staff.company.enName;
		let Cid = WebData.user.data.staff.company.id;

		let LocalName = WebData.user.data.staff.localName;
		let LocalEname = WebData.user.data.staff.enName;
		let Ccid = WebData.user.data.staff.id;
		let content = <div></div>;
		if(this.props.DialogContent == 1){
		content =(
						<div className={'  girdlayout'} style={{height:"344px"}}>
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200343/*货运公司*/)}</label>
									<Select
										{...getNFieldProps('forBeId',{
											rules: [{required:true}],
										    initialValue:undefined
										     
										})}
									    placeholder=''
										optionLabelProp="children"
										className ={getFieldError('forBeId')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}
									    onClick={this.chuangsClick}
									>
									  {this.state.chuangArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, forBeId: o.id, forBeLcName:o.localName, forBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
									</Select>
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100155/*港口*/)}</label>
										<Select
											{...getNFieldProps('statnId',{
													                    rules: [{required:true}],
													                    initialValue:undefined
													                })}
													                placeholder=''
													                optionLabelProp="children"
													                className ={getFieldError('statnId')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}
													                onClick={this.qiyunClick}
										>
													                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, statnId: o.id, statnLcName :o.localName, statnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										</Select>
								</div>
							</div>
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100286/*生效日期*/)}</label>
									<div className={'col-md-9 col-lg-9 datetime'}>
										<DataTime
											showTime={false}
											isShowIcon={true}
											width={'100%'}
											form={this.props.form}
											name={'sDate'}
											validate={true}
										/>
									</div>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100288/*发布日期*/)}</label>
									<div className={'col-md-9 col-lg-9 datetime'}>
										<DataTime
											showTime={false}
											isShowIcon={true}
											width={'100%'}
											form={this.props.form}
											name={'reDate'}
											validate={true}
										/>
									</div>
								</div>
							</div>
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100287/*失效日期*/)}</label>
									<div className={'col-md-9 col-lg-9 datetime'}>
										<DataTime
											showTime={false}
											isShowIcon={true}
											width={'100%'}
											form={this.props.form}
											name={'eDate'}
											validate={true}
										/>
									</div>
								</div>
								<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}>{i18n.t(500259/*发布企业*/)}</label>
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
							</div>
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}>{i18n.t(200937/*发布人*/)}</label>
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
								<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(500121/*费用名称*/)}</label>
													<Select 
														placeholder=""
										                {...getNFieldProps('costlvtrId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"							
										                className ={getFieldError('costlvtrId')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}							
										                onClick={this.costlvtrClick}
										            >	
										                {this.state.costlvtrArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, costlvtrId: o.id, costlvtrLcName:o.localName, costlvtrEnName:o.name}} title={o.name}>{o.localName}</Option>)}
													</Select>
								</div>
							</div>
						  	<div className={'row'}>
								                <div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(500125/*货币*/)}</label>
													<Select 
										                {...getNFieldProps('cnyId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"							
										                className ={getFieldError('cnyId')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}							
										                onClick={this.bizhongClick}
										            >	
										                {this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId:o.id, cnyLcName:o.localName, cnyEnName:o.name}} title={o.name}>{o.localName}</Option>)}
										            </Select>
												</div>
												 <div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(500122/*标准费用*/)}</label>
													<input placeholder=''
															type="text" {...getFieldProps('costAgg', {
																	rules: [{required:true}],
						                                			initialValue:''
						                           				 })} className={getFieldError('costAgg')?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'}/>
												</div>
							</div>
							<div className={'row'}>
								               
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100214/*箱型*/)}</label>
													<Select 
										                {...getNFieldProps('packTy',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"							
										                className ={getFieldError('packTy')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}							
										                onClick={this.packTyClick}
										            >	
										                {this.state.packTyArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(500088/*装箱类型*/)}</label>
													<Select 
														allowClear
										                {...getNFieldProps('contnrTyId',{
										               		rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"							
										                 className ={getFieldError('contnrTyId')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}						
										                onClick={this.xiangxingClick}
										            >	
										                {this.state.xiangxingArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, contnrTyId:o.id, contnrTyLcName:o.localName, contnrTyEnName:o.name}} title={o.name}>{o.localName}</Option>)}
										            </Select>
												</div>
							</div>
							<div className={'row'}>
								                
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(500123/*计算模式*/)}</label>
													<Select 
										                {...getNFieldProps('chargeTy',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                   
										                })}
										                placeholder=''
										                optionLabelProp="children"							
										                className ={getFieldError('chargeTy')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}							
										                onClick={this.jifeimoshiClick}
										            >	
										                {this.state.jifeimoshiArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100177/*航线*/)}</label>
													<Select 
														allowClear
										                {...getNFieldProps('routeId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"							
										                className ={getFieldError('routeId')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}							
										                onClick={this.hangxianClick}
										            >	
										                {this.state.hanxianArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, routeId:o.id, routeLcName:o.localName, routeEnName:o.name}} title={o.name}>{o.localName}</Option>)}
										            </Select>
												</div>
							</div>
							
						</div>);
		}else if(this.props.DialogContent==3){
			content =(
						<div className={'  girdlayout'} style={{height:"344px"}}>
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200343/*货运公司*/)}</label>
									<Select
										{...getNFieldProps('forBeId',{
											rules: [{required:true}],
										    initialValue:otherData["forBe"+language]?{s_label:otherData["forBe"+language],
										     forBeId: otherData.forBeId, forBeLcName:otherData.forBeLcName,
										      forBeEnName:otherData.forBeEnName}:undefined
										})}
									    placeholder=''
									    disabled={true}	
										optionLabelProp="children"
										className ={getFieldError('forBeId')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}
									    onClick={this.chuangsClick}
									    allowClear={false}
									>
									  {this.state.chuangArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, forBeId: o.id, forBeLcName:o.localName, forBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
									</Select>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100155/*港口*/)}</label>
									<Select
										{...getNFieldProps('statnId',{
												                    rules: [{required:true}],
												                    initialValue:otherData["statn"+language]?{s_label:otherData["statn"+language], statnId: otherData.statnId, statnLcName:otherData.statnLcName,statnEnName:otherData.statnEnName}:undefined
												                })}
												                placeholder=''
												                optionLabelProp="children"
												               
												                className ={getFieldError('statnId')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}
												                onClick={this.qiyunClick}
												                allowClear={false}
												                 allowClear={false}
									>
												                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, statnId: o.id, statnLcName :o.localName, statnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
									</Select>
								</div>
							</div>
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100288/*发布日期*/)}</label>
									<div className={'col-md-9 col-lg-9 datetime'}>
										<DataTime
											showTime={false}
											isShowIcon={true}
											value={otherData['reDate']}
											width={'100%'}
											form={this.props.form}
											name={'reDate'}
											validate={true}
										/>
									</div>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100286/*生效日期*/)}</label>
									<div className={'col-md-9 col-lg-9 datetime'}>
										<DataTime
											showTime={false}
											value={otherData['sDate']}
											isShowIcon={true}
											width={'100%'}
											form={this.props.form}
											name={'sDate'}
											validate={true}
										/>
									</div>
								</div>
							</div>
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100287/*失效日期*/)}</label>
									<div className={'col-md-9 col-lg-9 datetime'}>
										<DataTime
											showTime={false}
											isShowIcon={true}
											value={otherData['eDate']}
											width={'100%'}
											form={this.props.form}
											name={'eDate'}
											validate={true}
										/>
									</div>
								</div>
								<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}>{i18n.t(500259/*发布企业*/)}</label>
														<ConstVirtualSelect
								                        placeholder=""
								                        form={this.props.form}
								                       fieldName='ccId'
								                        apiHost={API_FOODING_ES}
								                        apiUri='/party/getLoginCompanies'
								                        apiParams={{}}
								                         disabled={true}	    
								                         initialValue={xt.initSelectValue(otherData,{s_label:otherData.ccLcName,ccId:otherData.ccId,ccEnName:otherData.ccEnName,ccLcName:otherData.ccLcName},['ccId','ccLcName','ccEnName'], 's_label', this.props.form)}
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
							</div>
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}>{i18n.t(200937/*发布人*/)}</label>
													<ConstVirtualSelect
									                        placeholder=""
									                        form={this.props.form}
									                       fieldName='reStaffId'
									                        apiHost={API_FOODING_ES}
									                        apiUri='/staff/getListByCcId'
									                         disabled={true}	    
									                        apiParams={{
									                            ccid: WebData.user.data.staff.ccid
									                            
									                        }}
									                         initialValue={xt.initSelectValue(otherData,{s_label:otherData.reStaffLcName,reStaffId:otherData.reStaffId,reStaffLcName:otherData.reStaffLcName,reStaffEnName:otherData.reStaffEnName},['reStaffId','reStaffLcName','reStaffEnName'], 's_label', this.props.form)}
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
								<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(500121/*费用名称*/)}</label>
													<Select 
														placeholder=""
										                {...getNFieldProps('costlvtrId',{
										                    rules: [{required:true}],
										                    initialValue:otherData["costlvtr"+language]?{s_label:otherData["costlvtr"+language], costlvtrId: otherData.costlvtrId, costlvtrLcName:otherData.costlvtrLcName, costlvtrEnName:otherData.costlvtrEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"							
										                className ={getFieldError('costlvtrId')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}							
										                onClick={this.costlvtrClick}
										                 allowClear={false}
										            >	
										                {this.state.costlvtrArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, costlvtrId: o.id, costlvtrLcName:o.localName, costlvtrEnName:o.name}} title={o.name}>{o.localName}</Option>)}
													</Select>
								</div>
							</div>
						  	<div className={'row'}>
								                
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(500125/*货币*/)}</label>
													<Select 
										                {...getNFieldProps('cnyId',{
										                    rules: [{required:true}],
										                    initialValue:otherData["cny"+language]?{s_label:otherData["cny"+language], cnyId:otherData.cnyId, cnyLcName:otherData.cnyLcName, cnyEnName:otherData.cnyEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"							
										                className ={getFieldError('cnyId')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}							
										                onClick={this.bizhongClick}
										                 allowClear={false}
										            >	
										                {this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId:o.id, cnyLcName:o.localName, cnyEnName:o.name}} title={o.name}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(500122/*标准费用*/)}</label>
													<input placeholder=''
															type="text" {...getFieldProps('costAgg', {
																	rules: [{required:true}],
						                                			initialValue:otherData.costAgg?otherData.costAgg:''
						                           				 })} className={getFieldError('costAgg')?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'}/>
												</div>
							</div>
							<div className={'row'}>
								                
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100214/*箱型*/)}</label>
													<Select 
										                {...getNFieldProps('packTy',{
										                    rules: [{required:true}],
										                    initialValue:otherData["packTyName"]?{s_label:otherData["packTyName"],packTy:otherData["packTy"]}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"							
										                className ={getFieldError('packTy')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}							
										                onClick={this.packTyClick}
										                 allowClear={false}
										            >	
										                {this.state.packTyArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(500088/*装箱类型*/)}</label>
													<Select 
														allowClear
										                {...getNFieldProps('contnrTyId',{
										               
										                    initialValue:otherData["contnrTy"+language]?{s_label:otherData["contnrTy"+language], contnrTyId:otherData.contnrTyId, contnrTyLcName:otherData.contnrTyLcName, contnrTyEnName:otherData.contnrTyEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"							
										                 className ={getFieldError('contnrTyId')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}						
										                onClick={this.xiangxingClick}
										                 allowClear={false}
										            >	
										                {this.state.xiangxingArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, contnrTyId:o.id, contnrTyLcName:o.localName, contnrTyEnName:o.name}} title={o.name}>{o.localName}</Option>)}
										            </Select>
												</div>
							</div>
							<div className={'row'}>
								                
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(500123/*计算模式*/)}</label>
													<Select 
										                {...getNFieldProps('chargeTy',{
										                    rules: [{required:true}],
										                    initialValue: otherData["chargeTyName"]?{s_label:otherData["chargeTyName"],chargeTy:otherData["chargeTy"]}:undefined
										                   
										                })}
										                placeholder=''
										                optionLabelProp="children"							
										                className ={getFieldError('chargeTy')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}							
										                onClick={this.jifeimoshiClick}
										                 allowClear={false}
										            >	
										                {this.state.jifeimoshiArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100177/*航线*/)}</label>
													<Select 
														allowClear
										                {...getNFieldProps('routeId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:otherData["route"+language], routeId:otherData.routeId, routeLcName:otherData.routeLcName, routeEnName:otherData.routeEnName}
										                })}
										                placeholder=''
										                optionLabelProp="children"							
										                className ={getFieldError('routeId')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}							
										                onClick={this.hangxianClick}
										                allowClear={false}
										            >	
										                {this.state.hanxianArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, routeId:o.id, routeLcName:o.localName, routeEnName:o.name}} title={o.name}>{o.localName}</Option>)}
										            </Select>
												</div>
							</div>
							
					
					</div>);
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper 
						showFooter={true} 
						buttonLeft = {this.props.buttonLeft} 
						onSaveAndClose={this.onSaveAndClose} 
						onSaveAdd={this.onSaveAdd}
					    showSaveAdd={this.props.showSaveAdd}
					    showSaveClose={this.props.showSaveClose}
						onCancel={this.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(AirPricePlug);
export default ProductForm;

