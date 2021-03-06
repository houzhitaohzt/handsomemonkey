import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect} from '../../../components/Select';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import WebData from '../../../common/WebData';
import xt from '../../../common/xt'; // 下拉
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList,API_FOODING_ES} from '../../../services/apiCall';
export class SeaPricePlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.state={
			routeArray:[],//航线
			statnTyArray:[],
			qiyunArray:[],
			chuanqi:[1,2,3,4,5,6,7],
			chuangArray:[],
			huodaiArray:[],
			bizhongArray:[]
		}
		this.handleCertificate = this.handleCertificate.bind(this);
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
	onSaveAndClose(isAdd){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
			// 	let {getTermModes} = this.props;
			// 	getTermModes.seaBox.map((e)=>{
			// 		value.prices[e.id] = value.prices[e.id+'a'];
			// 		delete value.prices[e.id+'a'];
			// 	});
			
	  //     		this.props.onSaveAndClose(value,this.props.checkedData,isAdd);
	  //     		//this.props.form.resetFields();
			// }

			if(this.props.DialogContent == 1){
					let {getTermModes} = this.props;
					getTermModes.seaBox.map((e)=>{
						value.prices[e.id] = value.prices[e.id+'a'];
						delete value.prices[e.id+'a'];
					});
					//let params = this.props.form.getFieldsValue();
					this.props.onSaveAndClose(value,this.props.checkedData,isAdd,this.getData);
					if(isAdd){
						this.props.form.setFieldsValue({eStatnId:undefined,});
					}
				}else{
					let {getTermModes} = this.props;
					getTermModes.seaBox.map((e)=>{
						value.prices[e.id] = value.prices[e.id+'a'];
						delete value.prices[e.id+'a'];
					});
					this.props.onSaveAndClose(value,this.props.checkedData,isAdd);
				}}

    	});
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	handleCertificate(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.TransRout'},
			(response)=>{
				that.setState({
					routeArray:response.data
				})
		},(error)=>{

		});
	}
	qiyunClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Statn',
			queryParams:[{
			attr:"statnTyId",
			expression:"=",
			value:10
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
		apiPost(API_FOODING_DS,'/object/getMiniList',
			{
				"obj":"com.fooding.fc.ds.entity.Carrier",
				"prettyMark":true
			},
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
						getNFieldProps('type',{
							initialValue:10
						})
		checkedData.shipdate = checkedData.shipdate || "";
		let content = <div></div>;
		let ccLocalName = WebData.user.data.staff.company.localName;
		let ccenName  =   WebData.user.data.staff.company.enName;
		let Cid = WebData.user.data.staff.company.id;

		let LocalName = WebData.user.data.staff.localName;
		let LocalEname = WebData.user.data.staff.enName;
		let Ccid = WebData.user.data.staff.id;
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal scroll'} style={{maxHeight:'344px',overflowY:'auto'}}>
           		<div className={'  girdlayout'}>
           									<div className={'row'}>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100177/*航线*/)}</label>
													<Select
										                {...getNFieldProps('routeId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"

										                className ={getFieldError('routeId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.handleCertificate}
										            >
										                {this.state.routeArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, routeId : o.id, routeLcName:o.localName, routeEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100297/*起运港*/)}</label>
													<Select
										                {...getNFieldProps('sStatnId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"

										                className ={getFieldError('sStatnId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, sStatnId: o.id, sStatnLcName :o.localName, sStatnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100298/*目的港*/)}</label>
													<Select
										                {...getNFieldProps('eStatnId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"

										                 className ={getFieldError('eStatnId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, eStatnId: o.id, eStatnLcName:o.localName, eStatnEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(201093/*船期*/)}</label>
																<ConstVirtualSelect form={this.props.form}
																		isRequest={false}
																		initValueOptions={[1,2,3,4,5,6,7].map(da => ({id:da, name: da}))}
						                                                 fieldName="shipdate"
						                                                 multi rules
						                  		/>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(300049/*航程(天)*/)}</label>
													<input type="text" placeholder='' {...getFieldProps('voyNums', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,pattern:xt.pattern.positiveInteger
						                                    }
						                                ], initialValue: ''
						                            })} className ={getFieldError('voyNums')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}/>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500076/*船公司*/)}</label>
													<Select
										                {...getNFieldProps('lsBeId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"

										               className ={getFieldError('lsBeId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.chuangsClick}
										            >
										                {this.state.chuangArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, lsBeId: o.id, lsBeLcName:o.localName, lsBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100299/*货代公司*/)}</label>
													<Select
										                {...getNFieldProps('forBeId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"

										               className ={getFieldError('forBeId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
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
										                    initialValue:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"

										                className ={getFieldError('cnyId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.bizhongClick}
										            >
										                {this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId:o.id, cnyLcName:o.localName, cnyEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
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
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100287/*失效日期*/)}</label>
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
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100288/*发布日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
														showTime = {false}
														validate={true}
														isShowIcon={true}
														 name={"reDate"}
														 form={this.props.form}
														 value={new Date()}
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
											<div className="row">
												<div>
													<label style={{display:'inline-block',color:'#70aae3'}}>{i18n.t(201095/*整箱运价*/)}</label>
												</div>
											</div>
											<ul className={'row'}>
												  {
												  	getTermModes.seaBox.map((e,i)=>{
												  		return (<li key={i} className= 'form-group col-md-6 col-lg-6'>
												  			<label  className={'col-md-3 col-lg-3'}><span className={e.id=="10"?'':'none'}>*</span>{e.localName}</label>
															<input placeholder={i18n.t(500273/*请输入数字*/)}
															type="text" {...getFieldProps('prices['+e.id+'a]', {
						                                		initialValue:'',
						                                		rules:[{required:(e.id=="10"),pattern:xt.pattern.positiveNonZero}],
						                           				 })} className={getFieldError('prices['+e.id+'a]')?"col-md-8 col-lg-8 text-input-nowidth error-border":"col-md-8 col-lg-8 text-input-nowidth"}/>
												  	</li>);
												  })
												}
											</ul>
											<div className="row">
												<div>
													<label style={{display:'inline-block',color:'#70aae3'}}>{i18n.t(201094/*拼箱运价*/)}</label>
												</div>
											</div>
											<ul className={'row'}>
												  {
												  	getTermModes.seaMeasure.map((e,i)=>{
												  		return (<li key={i} className= 'form-group col-md-6 col-lg-6'>
												  			<label className={'col-md-3 col-lg-3'}>{e.localName}</label>
															<input placeholder={i18n.t(500273/*请输入数字*/)}
															type="text" {...getFieldProps('prices.'+e.id, {
						                                		initialValue:'',
						                                		rules:[{pattern:xt.pattern.positiveNonZero}],
						                                		})} className={getFieldError('prices.'+e.id)?"col-md-8 col-lg-8 text-input-nowidth error-border":"col-md-8 col-lg-8 text-input-nowidth"}/>
												  	</li>);
												  })
												}
											</ul>


           		</div>
           	</div>
           	);
		}else if(this.props.DialogContent==3){
			content = (
		<div className={'addnormal scroll'} style={{maxHeight:'344px',overflowY:'auto'}}>
           	 	<div className={'  girdlayout'}>
           									<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100177/*航线*/)}</label>
													<Select
										                {...getNFieldProps('routeId',{
										                    rules: [{required:true}],
										                    initialValue:checkedData["route"+language]?{s_label:checkedData["route"+language], routeId :checkedData.routeId, routeLcName:checkedData.routeLcName, routeEnName:checkedData.routeEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"

										                className ={getFieldError('routeId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.handleCertificate}
										            >
										                {this.state.routeArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, routeId : o.id, routeLcName:o.localName, routeEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100297/*起运港*/)}</label>
													<Select
										                {...getNFieldProps('sStatnId',{
										                    rules: [{required:true}],
										                    initialValue:checkedData["sStatn"+language]?{s_label:checkedData["sStatn"+language], sStatnId: checkedData.sStatnId, sStatnLcName :checkedData.sStatnLcName, sStatnEnName: checkedData.sStatnEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"

										                className ={getFieldError('sStatnId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, sStatnId: o.id, sStatnLcName :o.localName, sStatnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100298/*目的港*/)}</label>
													<Select
										                {...getNFieldProps('eStatnId',{
										                    rules: [{required:true}],
										                    initialValue:checkedData["eStatn"+language]?{s_label:checkedData["eStatn"+language], eStatnId: checkedData.eStatnId, eStatnLcName:checkedData.eStatnLcName, eStatnEnName:checkedData.eStatnEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"

										                className ={getFieldError('eStatnId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, eStatnId: o.id, eStatnLcName:o.localName, eStatnEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(201093/*船期*/)}</label>
															<ConstVirtualSelect form={this.props.form}
																		isRequest={false}
																		initialValue={checkedData.shipdate.map(statns=>statns)}
																		initValueOptions={[1,2,3,4,5,6,7].map(da => ({id:da, name: da}))}
																														 fieldName="shipdate"
																														 multi rules
															/>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(300049/*航程(天)*/)}</label>
													<input type="text" placeholder=''
													{...getFieldProps('voyNums', {
														validateFirst: true,
						                                rules: [{required: true,}],
						                                validateTrigger: 'onBlur',
						                                initialValue:checkedData.voyNums? checkedData.voyNums:''
						                            })} className={getFieldError('voyNums')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}/>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500076/*船公司*/)}</label>
													<Select
										                {...getNFieldProps('lsBeId',{
										                    rules: [{required:true}],
										                    initialValue:checkedData["lsBe"+language]?{s_label:checkedData["lsBe"+language], lsBeId: checkedData.lsBeId, lsBeLcName:checkedData.lsBeLcName, lsBeEnName:checkedData.lsBeEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"

										                className ={getFieldError('lsBeId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.chuangsClick}
										            >
										                {this.state.chuangArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, lsBeId: o.id, lsBeLcName:o.localName, lsBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100299/*货代公司*/)}</label>
													<Select
										                {...getNFieldProps('forBeId',{
										                    rules: [{required:true}],
										                    initialValue:checkedData["forBe"+language]?{s_label:checkedData["forBe"+language], forBeId:checkedData.forBeId, forBeLcName:checkedData.forBeLcName, forBeEnName:checkedData.forBeEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"

										                className ={getFieldError('forBeId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
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
										                    initialValue:checkedData["cny"+language]?{s_label:checkedData["cny"+language], cnyId:checkedData.cnyId, cnyLcName:checkedData.cnyLcName, cnyEnName:checkedData.cnyEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"

										                className ={getFieldError('cnyId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.bizhongClick}
										            >
										                {this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId:o.id, cnyLcName:o.localName, cnyEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
														showTime = {false}
														validate={true}
														value={checkedData.sDate || new Date()}
														 isShowIcon={true}
														 name={"sDate"}
														 form={this.props.form}
														 />
													</div>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100287/*失效日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
														 isShowIcon={true}
														 showTime = {false}
														 validate={true}
														 name={"eDate"}
														 value={checkedData.eDate}
														 form={this.props.form}
														 />
													</div>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100288/*发布日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
														showTime = {false}
														validate={true}
														isShowIcon={true}
														 name={"reDate"}
														 value={checkedData.reDate||new Date()}
														 form={this.props.form}
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

											<div className="row">
												<div>
													<label style={{display:'inline-block',color:'#70aae3'}}>{i18n.t(201095/*整箱运价*/)}</label>
												</div>
											</div>
											<ul className='row'>
												  {
												  	getTermModes.seaBox.map((e,i)=>{
												  		return (<li key={i} className= 'form-group col-md-6 col-lg-6'>
												  			<label  className={'col-md-3 col-lg-3'}><span className={e.id=="10"?'':'none'}>*</span>{e.localName}</label>
															<input placeholder={i18n.t(500273/*请输入数字*/)}
															type="text" {...getFieldProps('prices['+String(e.id)+'a]', {
						                                		initialValue: checkedData.prices && checkedData.prices[e.id]?checkedData.prices[e.id]:'',
						                                		rules:[{required:(e.id=="10"),pattern:xt.pattern.positiveNonZero}],
						                           				 })} className={getFieldError('prices['+e.id+'a]')?"col-xs-9 col-md-9 text-input-nowidth error-border":"col-xs-9 col-md-9 text-input-nowidth"}/>
												  	</li>);
												  })
												}
											</ul>
											<div className="row">
												<div>
													<label style={{display:'inline-block',color:'#70aae3'}}>{i18n.t(201094/*拼箱运价*/)}</label>
												</div>
											</div>
											<ul className={'row'}>
												  {
												  	getTermModes.seaMeasure.map((e,i)=>{
												  		return (<li key={i} className= 'form-group col-md-6 col-lg-6'>
												  			<label className={'col-md-3 col-lg-3'}>{e.localName}</label>
															<input placeholder={i18n.t(500273/*请输入数字*/)}
															type="text" {...getFieldProps('prices.'+e.id, {
						                                		initialValue: checkedData.prices && checkedData.prices[e.id]?checkedData.prices[e.id]:'',
						                                		rules:[{pattern:xt.pattern.positiveNonZero}],
						                                		})} className={getFieldError('prices.'+e.id)?"col-md-8 col-lg-8 text-input-nowidth error-border":"col-md-8 col-lg-8 text-input-nowidth"}/>
												  	</li>);
												  })
												}
											</ul>


           		</div>
           	</div>);
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
const ProductForm =createForm()(SeaPricePlug);
export default ProductForm;
