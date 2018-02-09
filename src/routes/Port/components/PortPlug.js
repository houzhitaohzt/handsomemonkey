import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Input from '../../../components/FormValidating/FormValidating';
import Checkbox from "../../../components/CheckBox";
import AddMoreLanguage from "../../../components/AddMoreLanguage"; 
import {I18n} from "../../../lib/i18n";
import xt from '../../../common/xt'; // 下拉
import Select, { Option,ConstVirtualSelect,ConstMiniSelect } from '../../../components/Select';
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';
export class PortPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.state=this.initState();
	}
	getData(value,that){
		this.addSelect = that;
	}
	initState(){
		return{
			checkedData:{}
		}
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				if(this.props.DialogContent == 1){
					let params = this.props.form.getFieldsValue();
					delete params['id'];
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
	onClick(){

	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		let {checkedData} = this.props;
		checkedData.transRouts = checkedData.transRouts || [];
		let content = <div></div>;
		let obj = Object.assign({},checkedData,{id:checkedData.id,localName:checkedData.localName,name:checkedData.name});
		let array =[];
		checkedData.transRouts.map((e)=>{array.push(xt.initSelectValue(e, e, ['id'],"localName", this.props.form))});
		let countriesValue= array;
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}>{I18n.t(100000/*代码*/)}</label>
                                <input readOnly type="text" className={'text-input-nowidth col-md-8 col-lg-8'}
                                       {...getFieldProps('code',{
                                           initialValue:''
                                       })} />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'localName',type:'text', 
										initialValue:'',
										classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}>{I18n.t(100156/*港口类型*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.StatnType' 
                                             fieldName="statnTyId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 statnTyId: da.id,
                                                 statnTyLcName: da.name,
                                                 s_label: da.name
                                             }}>{da.name}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              allowClear
				                 	/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-xs-4 col-md-4'}>{I18n.t(100177/*航线*/)}</label>
										<ConstVirtualSelect form={this.props.form}
															apiType={apiPost}
															apiParams='com.fooding.fc.ds.entity.TransRout'
			                                                fieldName="transRoutIds"
			                                                dropdownMenuStyle={{ maxHeight: 200, overflow: 'auto' }}
			                                                valueKeys={da => ({
			                                                     id: da.id,
			                                                     s_label: da.localName
			                                                })}
			                                                 multi 
			                                                 className ={'col-md-8 col-lg-8'}							
			                            />
								</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100087/*国家*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Country' 
                                             fieldName="cntryId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 cntryId: da.id,
                                                 cntryLcName: da.localName,
                                                 cntryEnName:da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              allowClear
				                 	/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100160/*港口限重*/)}</label>
										<Input form={this.props.form} obj={{name:'stanLimtWt',type:'text', 
										initialValue:'',
										classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
								</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100040/*重量单位*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Unitofmea' 
                                             fieldName="wtUomId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 wtUomId: da.id,
                                                 wtUomLcName: da.localName,
                                                 wtUomEnName:da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              allowClear
				                 	/>

								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{I18n.t(100161/*强制托盘*/)}</label>
										<Checkbox 
											{...getFieldProps('foSalvMark',{
													initialValue:false
												})}
											/>
								</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-4 col-md-4'}>{I18n.t(100002/*描述*/)}</label>
								<input type="text" className={'text-input-nowidth col-md-8 col-lg-8'}
									{...getFieldProps('description',{
										initialValue:''
									})} />
							</div>
						</div>
					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			checkedData = checkedData || {};
			checkedData.unitofmea = checkedData.unitofmea || {};
			checkedData.statnType = checkedData.statnType || {};
			checkedData.country = checkedData.country || {};
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.id:''
			})
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
			   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<input readOnly type="text" className={'text-input-nowidth col-md-8 col-lg-8'}
                                       {...getFieldProps('code',{
                                           initialValue:checkedData?checkedData.code:''
                                       })} />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'localName',type:'text', 
										initialValue:checkedData? checkedData.localName:'',
										classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
								<AddMoreLanguage 
								    menusetView={checkedData}
								    object = {'statn'}
								    upload={this.props.upload}
								    onCancel ={this.onCancel}
								     isShowId={true}
							    />
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}>{I18n.t(100156/*港口类型*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.TimZon' 
                                             fieldName="statnTyId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 statnTyId: da.id,
                                                statnTyLcName: da.name,
                                                
                                                 s_label: da.name
                                             }}>{da.name}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              initialValue={xt.initSelectValue(checkedData.statnType,{statnTyId:checkedData.statnType.id,...checkedData.statnType},['statnTyId'], 'name', this.props.form)}
                                              allowClear
				                 	/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-xs-4 col-md-4'}>{I18n.t(100177/*航线*/)}</label>
										<ConstVirtualSelect form={this.props.form}
																apiType={apiPost}
																apiParams='com.fooding.fc.ds.entity.TransRout'
				                                                fieldName="transRoutIds"
				                                               multi rules
				                                                initialValue={countriesValue}
				                                                valueKeys={da => ({
				                                                     id: da.id,
				                                                     s_label: da.localName
				                                                })}
				                                                
				                                                 className ={'col-md-8 col-lg-8'}							
				                        />
								</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100087/*国家*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Country' 
                                             fieldName="cntryId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 cntryId: da.id,
                                               cntryLcName: da.localName,
                                                cntryEnName:da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              initialValue={xt.initSelectValue(checkedData.country,{cntryId:checkedData.country.id,...checkedData.country},['cntryId'], 'localName', this.props.form)}
                                              allowClear
				                 	/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100160/*港口限重*/)}</label>
										<Input form={this.props.form} obj={{name:'stanLimtWt',type:'text', 
										initialValue:checkedData?checkedData.stanLimtWt:'',
										classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
								</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100040/*重量单位*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Unitofmea' 
                                             fieldName="wtUomId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 wtUomId: da.id,
                                                wtUomLcName: da.localName,
                                                 wtUomEnName:da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              initialValue={xt.initSelectValue(checkedData.unitofmea,{wtUomId:checkedData.unitofmea.id,...checkedData.unitofmea},['wtUomId'], 'localName', this.props.form)}
                                              allowClear
				                 	/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{I18n.t(100161/*强制托盘*/)}</label>
										<Checkbox 
										
											{...getFieldProps('foSalvMark',{
												initialValue:checkedData?checkedData.foSalvMark:'',
											})}
											checked={this.props.form.getFieldValue("foSalvMark")}
										/>
								</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-4 col-md-4'}>{I18n.t(100002/*描述*/)}</label>
								<input type="text" className={'text-input-nowidth col-md-8 col-lg-8'}
									{...getFieldProps('description',{
										initialValue:checkedData?checkedData.description:'',
									})} />
							</div>
						</div>
					</div>
			</div>
			)
		}else if(this.props.DialogContent==5){
			content = (
				<div className={'girdlayout scroll'} style={{overflow:'auto'}}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100000/*代码*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData?checkedData.code:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100001/*名称*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData?checkedData.localName:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100156/*港口类型*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.statnType?checkedData.statnType.name:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100177/*航线*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>
									{
										checkedData.transRouts.map((e,i)=>{
											return e.localName + " "
										})
									}
								</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100087/*国家*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.country?checkedData.country.localName:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100160/*港口限重*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData?checkedData.stanLimtWt:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100040/*重量单位*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.unitofmea?checkedData.unitofmea.localName:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100161/*强制托盘*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData?checkedData.foSalvMark?I18n.t(100141/*是*/) : I18n.t(100142/*否*/):''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100002/*描述*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData?checkedData.description:''}</p>
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
const ProductForm =createForm()(PortPlug);
export default ProductForm;
