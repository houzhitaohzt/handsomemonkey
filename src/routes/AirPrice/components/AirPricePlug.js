import i18n from './../../../lib/i18n';
 import {I18n} from "../../../lib/i18n";
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../components/Select';
import Radio from '../../../components/Radio';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import WebData from '../../../common/WebData';
import xt from '../../../common/xt'; // 下拉
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList,API_FOODING_ES} from '../../../services/apiCall';
export class AirPricePlug extends Component{
	constructor(props){
		super(props);
		this.state={
			qiyunArray:[],
			chuangArray:[],
			huodaiArray:[],
			bizhongArray:[]

		}
		this.qiyunClick = this.qiyunClick.bind(this);
		this.chuangsClick = this.chuangsClick.bind(this);
		this.huodaiClick = this.huodaiClick.bind(this);
		this.bizhongClick = this.bizhongClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.getData = this.getData.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
	}
	getData(value,that){
		this.addSelect = that;
		this.props.form.setFieldsValue({eStatnId:undefined,});
	}
	onSaveAdd(){
		this.onSaveAndClose(true);
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
	chuangsClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.ServBe',queryParams:[{attr:"beDataMulDivIds",expression:"oin",
			value:90
		}]},
			(response)=>{
				that.setState({
					chuangArray:response.data
				});
		},(error)=>{

		});
	}
	huodaiClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.AgnShipBe'},
			(response)=>{
				that.setState({
					huodaiArray:response.data
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
	onSaveAndClose(isAdd){
		this.props.form.validateFields((error, value) => {
			if(error){
			}else{
				if(this.props.DialogContent == 1){
					let params = this.props.form.getFieldsValue();
					this.props.onSaveAndClose(params,{},isAdd,this.getData);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.props.checkedData,isAdd);
				}

				
			}

    	});
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError ,getNFieldProps,getFieldValue} = this.props.form;
		let {checkedData,getTermModes} = this.props;
		getFieldProps('type', {
		      initialValue: '30',
	    });
	    let ccLocalName = WebData.user.data.staff.company.localName;
		let ccenName  =   WebData.user.data.staff.company.enName;
		let Cid = WebData.user.data.staff.company.id;

		let LocalName = WebData.user.data.staff.localName;
		let LocalEname = WebData.user.data.staff.enName;
		let Ccid = WebData.user.data.staff.id;
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
           		<div className={'  girdlayout'}>
           									<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200268/*起飞机场*/)}</label>
													<Select
										                {...getNFieldProps('sStatnId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('sStatnId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, sStatnId: o.id, sStatnLcName :o.localName, sStatnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200269/*目的机场*/)}</label>
													<Select
										                {...getNFieldProps('eStatnId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('eStatnId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, eStatnId: o.id, eStatnLcName:o.localName, eStatnEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200270/*航空公司*/)}</label>
													<Select
										                {...getNFieldProps('lsBeId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('lsBeId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.chuangsClick}
										            >
										                {this.state.chuangArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, lsBeId: o.id, lsBeLcName:o.localName, lsBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100299/*货代公司*/)}</label>
													<Select
										                {...getNFieldProps('forBeId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('forBeId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.huodaiClick}
										            >
										                {this.state.huodaiArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, forBeId:o.id, forBeLcName:o.localName, forBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100284/*币种*/)}</label>
													<Select
										                {...getNFieldProps('cnyId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('cnyId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.bizhongClick}
										            >
										                {this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId:o.id, cnyLcName:o.localName, cnyEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
															showTime = {false}
															 validate={true}
															 isShowIcon={true}
															 name={"sDate"}
															 value={new Date()}
															 form={this.props.form}
														 />
													</div>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100288/*发布日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
															showTime = {false}
															validate={true}
															isShowIcon={true}
															 name={"reDate"}
															 form={this.props.form}
														/>
													</div>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100287/*失效日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
														 isShowIcon={true}
														 showTime = {false}
														 validate={true}
														 name={"eDate"}
														 form={this.props.form}
														 />
													</div>
												</div>
												
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}>{i18n.t(NaN/**/)}<span>*</span>{i18n.t(500259/*发布企业*/)}</label>
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
											<ul className={'foreach'}>
												  {
												  	getTermModes.airMeasure.map((e,i)=>{
												  		return (<li key={i}>
												  			<label className={'col-md-3 col-lg-3'}><span className={e.id=="P0"||e.id == "P45"?'':'none'}>*</span>{e.localName}</label>
															<input
															type="text" {...getFieldProps('prices.'+e.id, {
						                                		initialValue:'',
						                                		rules:[{required:(e.id=="P0"||e.id=="P45")}],
						                           				 })} className={getFieldError('prices.'+e.id)?"col-md-8 col-lg-8 text-input error-border":"col-md-8 col-lg-8 text-input"}/>
												  	</li>);
												  })
												}
											</ul>

           		</div>
           	</div>
           	);
		}else if(this.props.DialogContent==3){
			   content = (
			   <div className={'addnormal'} style={{marginBottom:'10px'}}>
           	    	<div className={'  girdlayout'}>
           									<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200268/*起飞机场*/)}</label>
													<Select
										                {...getNFieldProps('sStatnId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["sStatn"+language], sStatnId: checkedData.sStatnId, sStatnLcName :checkedData.sStatnLcName, sStatnEnName: checkedData.sStatnEnName}
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('sStatnId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, sStatnId: o.id, sStatnLcName :o.localName, sStatnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200269/*目的机场*/)}</label>
													<Select
										                {...getNFieldProps('eStatnId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["eStatn"+language], eStatnId: checkedData.eStatnId, eStatnLcName:checkedData.eStatnLcName, eStatnEnName:checkedData.eStatnEnName}
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('eStatnId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, eStatnId: o.id, eStatnLcName:o.localName, eStatnEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200270/*航空公司*/)}</label>
													<Select
										                {...getNFieldProps('lsBeId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["lsBe"+language], lsBeId: checkedData.lsBeId, lsBeLcName:checkedData.lsBeLcName, lsBeEnName:checkedData.lsBeEnName}
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('lsBeId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.chuangsClick}
										            >
										                {this.state.chuangArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, lsBeId: o.id, lsBeLcName:o.localName, lsBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100299/*货代公司*/)}</label>
													<Select
										                {...getNFieldProps('forBeId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["forBe"+language], forBeId:checkedData.forBeId, forBeLcName:checkedData.forBeLcName, forBeEnName:checkedData.forBeEnName}
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('forBeId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.huodaiClick}
										            >
										                {this.state.huodaiArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, forBeId:o.id, forBeLcName:o.localName, forBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100284/*币种*/)}</label>
													<Select
										                {...getNFieldProps('cnyId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["cny"+language], cnyId:checkedData.cnyId, cnyLcName:checkedData.cnyLcName, cnyEnName:checkedData.cnyEnName}
										                })}
										                optionLabelProp="children"
										              	className ={getFieldError('cnyId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.bizhongClick}
										            >
										                {this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId:o.id, cnyLcName:o.localName, cnyEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
														showTime = {false}
														validate={true}
														 isShowIcon={true}
														 value={checkedData.sDate|| new Date()}
														 name={"sDate"}
														 form={this.props.form}
														 />
													</div>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100288/*发布日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
															showTime = {false}
															validate={true}
															isShowIcon={true}
															value={checkedData.reDate}
															 name={"reDate"}
															 form={this.props.form}
														/>
													</div>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100287/*失效日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
														 isShowIcon={true}
														 showTime = {false}
														validate={true}
														value={checkedData.eDate}
														 name={"eDate"}
														 form={this.props.form}
														 />
													</div>
												</div>
											</div>
											<div className="row">
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
							                         initialValue={xt.initSelectValue(checkedData,{s_label:checkedData.ccLcName,ccId:checkedData.ccId,ccEnName:checkedData.ccEnName,ccLcName:checkedData.ccLcName},['ccId','ccLcName','ccEnName'], 's_label', this.props.form)}
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
									                         initialValue={xt.initSelectValue(LocalName,{s_label:LocalName,reStaffId:Ccid,reStaffLcName:LocalName,reStaffEnName:LocalEname},['reStaffId','reStaffLcName','reStaffEnName'], 's_label', this.props.form)}
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

											<ul className='foreach'>
												  {
												  	getTermModes.airMeasure.map((e,i)=>{
												  		return (<li key={i}>
												  			<label  className={'col-md-3 col-lg-3'}><span className={e.id==10?'':'none'}>*</span>{e.localName}</label>
															<input
															type="text" {...getFieldProps('prices.'+e.id, {
																rules:[{required:(e.id=="P0"||e.id=="P45")}],
						                                		initialValue:checkedData.prices && checkedData.prices[e.id]?checkedData.prices[e.id]:''
						                           				 })} className={getFieldError('prices.'+e.id)?"v text-input error-border":"col-md-8 col-lg-8 text-input"}/>
												  	</li>);
												  })
												}
											</ul>

           	        </div>
           	   </div>
           	);
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} 
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
