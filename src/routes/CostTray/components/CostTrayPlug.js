import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../components/Select';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import WebData from '../../../common/WebData';
import xt from '../../../common/xt'; // 下拉
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList,API_FOODING_ES} from '../../../services/apiCall';
export class CostTrayPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.handleCertificate = this.handleCertificate.bind(this);
		this.qiyunClick = this.qiyunClick.bind(this);
		this.huodaiClick = this.huodaiClick.bind(this);
		this.bizhongClick = this.bizhongClick.bind(this);
		this.state={
			statnTyArray:[],//港口类型
			qiyunArray:[],
			huodaiArray:[],
			bizhongArray:[]
		}
	}
	getData(value,that){
		this.addSelect = that;
	}
	onSaveAndClose(isAdd){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
	      		this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.props.checkedData,isAdd);
	      		this.props.form.resetFields();
			}

    	});
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	handleCertificate(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.TransportType'},
			(response)=>{
				that.setState({
					statnTyArray:response.data
				});
		},(error)=>{

		});
	}
	qiyunClick(){
		var that = this;
		let obj = Object.assign({},{statnTyId:this.props.form.getFieldValue("statnTyId")},this.props.form.getFieldValue("statnTyId"));
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Statn',
			queryParams:[{attr:"statnTyId",expression:"=",value:obj.statnTyId}]},
			(response)=>{
				that.setState({
					qiyunArray:response.data
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
	render(){
		let that = this;
		const { getFieldProps, getFieldError,getNFieldProps,getFieldValue} = this.props.form;
		let {checkedData,getTermModes} = this.props;
		getFieldProps('normal', {
		      initialValue: '0',
		 });
		let content = <div></div>;
		 let ccLocalName = WebData.user.data.staff.company.localName;
		let ccenName  =   WebData.user.data.staff.company.enName;
		let Cid = WebData.user.data.staff.company.id;

		let LocalName = WebData.user.data.staff.localName;
		let LocalEname = WebData.user.data.staff.enName;
		let Ccid = WebData.user.data.staff.id;
		if(this.props.DialogContent == 1){
           content = (
        <div className={'addnormal'} style={{marginBottom:'10px'}}>
           	<div className={'  girdlayout scroll'}>
           									<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100156/*港口类型*/)}</label>
													 <Select
										                {...getNFieldProps('statnTyId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}

										                optionLabelProp="children"
										                className ={getFieldError('statnTyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										                onClick={this.handleCertificate}
										            >
										                {this.state.statnTyArray.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100297/*起运港*/)}</label>
													<Select
										                {...getNFieldProps('sStatnId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}

										                optionLabelProp="children"
										                className ={getFieldError('sStatnId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, sStatnId : o.id, sStatnLcName:o.localName, sStatnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100299/*货代公司*/)}</label>
													<Select
										                {...getNFieldProps('forBeId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}

										                optionLabelProp="children"
										                className ={getFieldError('forBeId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										                onClick={this.huodaiClick}
										            >
										                {this.state.huodaiArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, forBeId:o.id, forBeLcName:o.localName, forBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100284/*币种*/)}</label>
													<Select
										                {...getNFieldProps('cnyId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}

										                optionLabelProp="children"
										                className ={getFieldError('cnyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										                onClick={this.bizhongClick}
										            >
										                {this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId:o.id, cnyLcName:o.localName, cnyEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
															<Calendar width={'100%'}  
															 showTime = {false} 
															 isShowIcon={true} 
															 form={this.props.form}
															validate={true}
															name={'sDate'}
															
															/>
													</div>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500120/*终止日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
															<Calendar width={'100%'}  
															showTime = {false} 
															isShowIcon={true} 
															form={this.props.form}
															validate={true}
															name={'eDate'}
															/>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100288/*发布日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
															<Calendar width={'100%'} showTime = {false}
															isShowIcon={true} 
															form={this.props.form}
															validate={true}
															name={'reDate'}
															
															/>
													</div>
												</div>
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
											</div>
											<div className="row">
												
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
											<ul className='row'>
											{
												getTermModes.map((e,i)=>{
													return (<li key={i} className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}>{e.localName}</label>
													<input type="text" {...getFieldProps("prices."+e.id, {
						                                initialValue:'',
						                                rules: [{pattern:xt.pattern.positiveNonZero}],
						                            })} className={getFieldError('prices.'+e.id)?"col-md-9 col-lg-9 text-input-nowidth error-border":"col-md-9 col-lg-9 text-input-nowidth"} placeholder={i18n.t(500273/*请输入数字*/)}/>
												</li>)
												})
											}
											</ul>
           	</div>
        </div>);
		}else if(this.props.DialogContent==3){
			   content = (
			 <div className={'addnormal'} style={{marginBottom:'10px'}}>
			   	<div className={' scroll girdlayout'}>
			   			<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100156/*港口类型*/)}</label>
													 <Select
										                {...getNFieldProps('statnTyId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["statnTyName"], statnTyId :checkedData.statnTyId, statnTyName:checkedData.statnTyName}
										                })}

										                optionLabelProp="children"
										                className ={getFieldError('statnTyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										                onClick={this.handleCertificate}
										            >
										                {this.state.statnTyArray.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100297/*起运港*/)}</label>
													<Select
										                {...getNFieldProps('sStatnId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["sStatn"+language], sStatnId : checkedData.sStatnId, sStatnLcName:checkedData.sStatnLcName, sStatnEnName: checkedData.sStatnEnName}
										                })}

										                optionLabelProp="children"
										                className ={getFieldError('sStatnId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, sStatnId : o.id, sStatnLcName:o.localName, sStatnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100299/*货代公司*/)}</label>
													<Select
										                {...getNFieldProps('forBeId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["forBe"+language], forBeId:checkedData.forBeId, forBeLcName:checkedData.forBeLcName, forBeEnName:checkedData.forBeEnName}
										                })}

										                optionLabelProp="children"
										                className ={getFieldError('forBeId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										                onClick={this.huodaiClick}
										            >
										                {this.state.huodaiArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, forBeId:o.id, forBeLcName:o.localName, forBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100284/*币种*/)}</label>
													<Select
										                {...getNFieldProps('cnyId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["cny"+language], cnyId:checkedData.cnyId, cnyLcName:checkedData.cnyLcName, cnyEnName:checkedData.cnyEnName}
										                })}

										                optionLabelProp="children"
										                className ={getFieldError('cnyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										                onClick={this.bizhongClick}
										            >
										                {this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId:o.id, cnyLcName:o.localName, cnyEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
															<Calendar width={'100%'}   showTime = {false} isShowIcon={true} form={this.props.form}
															validate={true}
															name={'sDate'}
															value={checkedData['sDate']}
															/>
													</div>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500120/*终止日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
														<Calendar width={'100%'}  showTime = {false} isShowIcon={true} form={this.props.form}
														validate={true}
														name={'eDate'}
														value={checkedData['eDate']}
														/>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100288/*发布日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
														<Calendar width={'100%'} showTime = {false}
														isShowIcon={true} form={this.props.form}
														validate={true}
														name={'reDate'}
														value={checkedData['reDate']}
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
											</div>
											<div className="row">
												
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
											<ul className='row'>
											{
												getTermModes.map((e,i)=>{
													return (<li key={i} className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}>{e.localName}</label>
													<input type="text" placeholder={i18n.t(500273/*请输入数字*/)}   {...getFieldProps("prices."+e.id, {
						                                initialValue:checkedData.prices && checkedData.prices[e.id]?String(checkedData.prices[e.id]):'',
						                                 rules: [{pattern:xt.pattern.positiveNonZero}],
						                            })} className={getFieldError('prices.'+e.id)?"col-md-9 col-lg-9 text-input-nowidth error-border":"col-md-9 col-lg-9 text-input-nowidth"}/>
												</li>)
												})
											}
											</ul>
				</div>
			</div>)
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
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose.bind(this)} onCancel={this.onCancel.bind(this)}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(CostTrayPlug);
export default ProductForm;
