import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option,ConstMiniSelect,ConstVirtualSelect } from '../../../components/Select';
import xt from '../../../common/xt'; // 下拉
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Input from '../../../components/FormValidating/FormValidating';
import {apiGet, apiPost, apiForm, language, API_FOODING_ERP, API_FOODING_DS, API_FOODING_ES} from '../../../services/apiCall';
import AddMoreLanguage from "../../../components/AddMoreLanguage"; 
import {I18n} from "../../../lib/i18n";
export class ShelftypePlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.state=this.initState()
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
	}
	initState(){
		return {
			checkedData:{}
		}
	}
	getData(value,that){
		this.addSelect = that;
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				if(this.props.DialogContent == 1){
					let params = this.props.form.getFieldsValue();
					delete params['optlock'];
					delete params['nameValues'];
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				}this.props.form.resetFields();

				
			}
		})
	}
	onSaveAdd(){
		this.onSaveAndClose(true);
	}
	onCancel(){
		const {form, onCancel} = this.props;
		this.props.onCancel();
		this.props.form.resetFields();
	}
	
	
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		let {checkedData,info,datas} = this.props;
		info = info || {};
		info.unitofmeas = info.unitofmeas || [];
		let content = <div></div>;
		checkedData.transportTypeIdNames = checkedData.transportTypeIdNames ||[];
		let obj = Object.assign({},checkedData,{id:checkedData.id,localName:checkedData.localName,name:checkedData.name});
		let array =[];
		checkedData.transportTypeIdNames.map((e)=>{array.push(xt.initSelectValue(e, e, ['id'],"name", this.props.form))});
		let countriesValue= array;
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal scroll'} style={{marginBottom:'10px',maxHeight:'300px',overflowY:'auto'}}>
					<div className={' girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100003/*ID*/)}</label>
								<Input form={this.props.form} obj={{name:'id',type:'text', 
										initialValue:'',
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text', 
										initialValue:'',
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
							
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
									<Input form={this.props.form} obj={{name:'localName',type:'text', 
											initialValue:'',
											classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100218/*长度单位*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Unitofmea' 
                                             fieldName="spcUomId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 spcUomId: da.id,
                                                spcUomLcName: da.localName,
                                                 spcUomEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                              allowClear
				                    />
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100031/*规格长*/)}</label>
								<Input form={this.props.form} obj={{name:'specl',type:'text', 
										initialValue:'',
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100032/*规格宽*/)}</label>
								<Input form={this.props.form} obj={{name:'specw',type:'text', 
										initialValue:'',
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100033/*规格高*/)}</label>
								<Input form={this.props.form} obj={{name:'spech',type:'text', 
										initialValue:'',
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100040/*重量单位*/)}</label>
								 <ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Unitofmea' 
                                             fieldName="wtUomtId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 wtUomtId: da.id,
                                                wtUomtLcName: da.localName,
                                                 wtUomtEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                              allowClear
				                    />
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100219/*空箱重量*/)}</label>
								<Input form={this.props.form} obj={{name:'empWt',type:'text', 
										initialValue:'',
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100220/*载重上限*/)}</label>
								<Input form={this.props.form} obj={{name:'maxLodWt',type:'text', 
										initialValue:'',
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100221/*最大毛重*/)}</label>
								<Input form={this.props.form} obj={{name:'maxgrosWt',type:'text', 
										initialValue:'',
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100426/*体积单位*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Unitofmea' 
                                             fieldName="vluomId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 vluomId: da.id,
                                                vluomLcName: da.localName,
                                                 vluomEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                              allowClear
				                    />
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100223/*体积量*/)}</label>
								<Input form={this.props.form} obj={{name:'vols',type:'text', 
										initialValue:'',
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}>{I18n.t(100224/*运输方式*/)}</label>
								<ConstVirtualSelect form={this.props.form}
															apiType={apiPost}
															apiParams='com.fooding.fc.enumeration.TransportType'
			                                                 fieldName="transTypeIds"
			                                                 valueKeys={da => ({
			                                                     id: da.id,
			                                                     s_label: da.name
			                                                })}

			                                                 multi rules
			                                                 className ={'col-xs-8 col-md-8'}							
			                                		/>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}>{I18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('description', {
						                                initialValue:'',
						                    })} className={'col-xs-8 col-md-8 text-input-nowidth'}/>
								</div>
						</div>
					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			checkedData = checkedData || {};
			checkedData.lengthU = checkedData.lengthU || {};
			checkedData.weight = checkedData.weight || {};
			checkedData.volumn = checkedData.volumn || {};
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.optlock:''
			})
			getFieldProps('nameValues', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.nameValues:''
			})
			getFieldProps('name',{
						validateFirst: true,
						initialValue:checkedData? checkedData.name:''
			})
			   content = (
			   <div className={'addnormal srcoll'} style={{marginBottom:'10px',maxHeight:'300px',overflowY:'auto'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100003/*ID*/)}</label>
								<Input form={this.props.form} obj={{name:'id',type:'text', 
										initialValue:checkedData.id,
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text', 
										initialValue:checkedData.code,
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
							
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
									<Input form={this.props.form} obj={{name:'localName',type:'text', 
											initialValue:checkedData.localName,
											classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
									<AddMoreLanguage 
									    menusetView={checkedData}
									    object = {'contnrType'}
									    upload={this.props.upload}
									    onCancel ={this.onCancel}
									    isShowId ={true}
								    />
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}>{I18n.t(100218/*长度单位*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Unitofmea' 
                                             fieldName="spcUomId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 spcUomId: da.id,
                                                spcUomLcName: da.localName,
                                                 spcUomEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             	initialValue={xt.initSelectValue(checkedData.lengthU,{spcUomId:checkedData.lengthU.id,...checkedData.lengthU},['spcUomId'], 'localName', this.props.form)}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                              allowClear
				                    />
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100031/*规格长*/)}</label>
								<Input form={this.props.form} obj={{name:'specl',type:'text', 
										initialValue:checkedData.specl,
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100032/*规格宽*/)}</label>
								<Input form={this.props.form} obj={{name:'specw',type:'text', 
										initialValue:checkedData.specw,
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100033/*规格高*/)}</label>
								<Input form={this.props.form} obj={{name:'spech',type:'text', 
										initialValue:checkedData.spech,
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100040/*重量单位*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Unitofmea' 
                                             fieldName="wtUomtId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 wtUomtId: da.id,
                                                wtUomtLcName: da.localName,
                                                 wtUomtEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             	initialValue={xt.initSelectValue(checkedData.weight,{wtUomtId:checkedData.weight.id,...checkedData.weight},['wtUomtId'], 'localName', this.props.form)}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                              allowClear
				                /> 
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100219/*空箱重量*/)}</label>
								<Input form={this.props.form} obj={{name:'empWt',type:'text', 
										initialValue:checkedData.empWt,
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100220/*载重上限*/)}</label>
								<Input form={this.props.form} obj={{name:'maxLodWt',type:'text', 
										initialValue:checkedData.maxLodWt,
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100221/*最大毛重*/)}</label>
								<Input form={this.props.form} obj={{name:'maxgrosWt',type:'text', 
										initialValue:checkedData.maxgrosWt,
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100426/*体积单位*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Unitofmea' 
                                             fieldName="vluomId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 vluomId: da.id,
                                                vluomLcName: da.localName,
                                                vluomEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             	initialValue={xt.initSelectValue(checkedData.volumn,{vluomId:checkedData.volumn.id,...checkedData.volumn},['vluomId'], 'localName', this.props.form)}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                              allowClear
				                />
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100223/*体积量*/)}</label>
								<Input form={this.props.form} obj={{name:'vols',type:'text', 
										initialValue:checkedData.vols,
										classn:'col-xs-8 col-md-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}>{I18n.t(100224/*运输方式*/)}</label>
								<ConstVirtualSelect form={this.props.form}
															apiType={apiPost}
															apiParams='com.fooding.fc.enumeration.TransportType'
			                                                 fieldName="transTypeIds"
			                                                 initialValue={countriesValue}
			                                                 valueKeys={da => ({
			                                                     id: da.id,
			                                                     s_label: da.name
			                                                })}
			                                                 multi rules

			                                                 className ={'col-xs-8 col-md-8'}							
			                    />
			              
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}>{I18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('description', {
						                                initialValue:checkedData.description || '',
						                    })} className={'col-xs-8 col-md-8 text-input-nowidth'}/>
								</div>
						</div>
					</div>
			</div>
			)
		}else if(this.props.DialogContent==5){
			checkedData.transportTypes = checkedData.transportTypes || []
			
			content = (
				<div className={'addnormal scroll'} style={{maxHeight:'300px',overflowY:'auto',marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100003/*ID*/)}</label>
								<div className={'col-xs-8 col-md-8'}>
									<p>{datas.id || ''}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<div className={'col-xs-8 col-md-8'}>
									<p>{datas.code || ''}</p>
								</div>
							</div>
							
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
									<div className={'col-xs-8 col-md-8'}>
										<p>{datas.localName || ''}</p>
									</div>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}>{I18n.t(100218/*长度单位*/)}</label>
										<div className={'col-xs-8 col-md-8'}>
											<p>{datas.lengthU?datas.lengthU.localName:''}</p>
										</div> 
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100031/*规格长*/)}</label>
								<div className={'col-xs-8 col-md-8'}>
									<p>{datas.specl || ''}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100032/*规格宽*/)}</label>
								<div className={'col-xs-8 col-md-8'}>
									<p>{datas.specw || ''}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100033/*规格高*/)}</label>
								<div className={'col-xs-8 col-md-8'}>
									<p>{datas.spech || ''}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100040/*重量单位*/)}</label>
								<div className={'col-xs-8 col-md-8'}>
									<p>{datas.weight?datas.weight.localName: ''}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100219/*空箱重量*/)}</label>
								<div className={'col-xs-8 col-md-8'}>
									<p>{datas.empWt || ''}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100220/*载重上限*/)}</label>
								<div className={'col-xs-8 col-md-8'}>
									<p>{datas.maxLodWt || ''}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100221/*最大毛重*/)}</label>
								<div className={'col-xs-8 col-md-8'}>
									<p>{datas.maxgrosWt || ''}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100426/*体积单位*/)}</label>
								<div className={'col-xs-8 col-md-8'}>
									<p>{datas.volumn?datas.volumn.localName: ''}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100223/*体积量*/)}</label>
								<div className={'col-xs-8 col-md-8'}>
									<p>{datas.vols || ''}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}>{I18n.t(100224/*运输方式*/)}</label>
								<div className={'col-xs-8 col-md-8'}>
									<p>
									{
										checkedData.record.transportTypes.map((e,i)=>{
											return e+ " "
										})
									}
								</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}>{I18n.t(100002/*描述*/)}</label>
									<div className={'col-xs-8 col-md-8'}>
									<p>{datas.description || ''}</p>
								</div>
								</div>
						</div>
					</div>
			</div>
			)
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper 
					showFooter={true} 
					buttonLeft = {this.props.buttonLeft} 
					onSaveAndClose={this.onSaveAndClose} 
					onCancel={this.onCancel}
					onSaveAdd={this.onSaveAdd}
					showSaveAdd={this.props.showSaveAdd}
					showSaveClose={this.props.showSaveClose}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(ShelftypePlug);
export default ProductForm;
