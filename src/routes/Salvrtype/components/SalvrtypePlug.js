import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option ,ConstMiniSelect} from '../../../components/Select';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Input from '../../../components/FormValidating/FormValidating';
import AddMoreLanguage from "../../../components/AddMoreLanguage"; 
import {I18n} from "../../../lib/i18n";
import xt from './../../../common/xt';
export class Productplug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
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
					delete params['id'];
					delete params['optlock'];
					delete params['nameValues'];
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				}
				this.props.form.resetFields();
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
		const { getFieldProps, getFieldError } = this.props.form;
		let {checkedData,info} = this.props;
		info = info || {};
		info.trayTypes = info.trayTypes || [];
		info.texturs = info.texturs || [];
		info.unitofmeas = info.unitofmeas || [];
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text', 
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'localName',type:'text', 
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-3 col-md-3'}>{I18n.t(100124/*托盘类型*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.TrayType' 
                                             fieldName="trayTyId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 trayTyId: da.id,
                                                trayTyLcName: da.localName,
                                                 trayTyEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	
                                             className ={'col-md-9 col-lg-9 currency-btn select-from-currency'}
                                              allowClear
				                 />
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100029/*材质*/)}</label>
										<ConstMiniSelect form={this.props.form}
						             				 pbj='com.fooding.fc.ds.entity.Textur' 
		                                             fieldName="texturId"
		                                             optionValue={da => <Option key={da.id} objValue={{
		                                                 texturId: da.id,
		                                                 texturLcName: da.localName,
		                                                 texturEnName: da.name,
		                                                 s_label: da.localName
		                                             }}>{da.localName}</Option>}
		                                             	reles={true}
		                                             className ={'col-md-9 col-lg-9 currency-btn select-from-currency'}
		                                              allowClear
						                />
								</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100031/*规格长*/)}</label>
									<Input form={this.props.form} obj={{name:'specl',type:'text', 
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100032/*规格宽*/)}</label>
										<Input form={this.props.form} obj={{name:'specw',type:'text', 
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
								</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100169/*单位*/)}</label>
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
                                             className ={'col-md-9 col-lg-9 currency-btn select-from-currency'}
                                              allowClear
				                    />
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100039/*自重*/)}</label>
										<Input form={this.props.form} obj={{name:'selfWt',type:'text', 
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
								</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100040/*重量单位*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Unitofmea' 
                                             fieldName="wtUomId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                wtUomId: da.id,
                                                wtUomLcName: da.localName,
                                                 wtUomEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-9 col-lg-9 currency-btn select-from-currency'}
                                              allowClear
				                    />
								</div>
								<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>{I18n.t(100002/*描述*/)}</label>
								<input type="text" className={'text-input-nowidth col-md-9 col-lg-9'}
									{...getFieldProps('description',{
										initialValue:''
									})} />
							</div>
						</div>
					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			checkedData =checkedData || {};
			checkedData.trayType = checkedData.trayType || {};
			checkedData.weight = checkedData.weight || {};
			checkedData.textur = checkedData.textur || {};
			checkedData.unitofmea = checkedData.unitofmea || {};
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
								<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text', 
										initialValue:checkedData.code,
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'localName',type:'text', 
										initialValue:checkedData.localName,
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
								<AddMoreLanguage 
								    menusetView={checkedData}
								    object = {'salvrType'}
								    upload={this.props.upload}
								    onCancel ={this.onCancel}
								    isShowId={true}
							    />
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-3 col-md-3'}>{I18n.t(100124/*托盘类型*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.TrayType' 
                                             fieldName="trayTyId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 trayTyId: da.id,
                                                trayTyLcName: da.localName,
                                                 trayTyEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                               initialValue={xt.initSelectValue(checkedData.trayType,{trayTyId:checkedData.trayType.id,...checkedData.trayType},['trayTyId'], 'localName', this.props.form)}		
                                             className ={'col-md-9 col-lg-9 currency-btn select-from-currency'}
                                              allowClear
				                 />

								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100029/*材质*/)}</label>
										<ConstMiniSelect form={this.props.form}
						             				 pbj='com.fooding.fc.ds.entity.Textur' 
		                                             fieldName="texturId"
		                                             optionValue={da => <Option key={da.id} objValue={{
		                                                 texturId: da.id,
		                                                 texturLcName: da.localName,
		                                                 texturEnName: da.name,
		                                                 s_label: da.localName
		                                             }}>{da.localName}</Option>}
		                                             	reles={true}
		                                             	initialValue={xt.initSelectValue(checkedData.textur,{texturId:checkedData.textur.id,...checkedData.textur},['texturId'], 'localName', this.props.form)}
		                                             className ={'col-md-9 col-lg-9 currency-btn select-from-currency'}
		                                              allowClear
						                />
								</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100031/*规格长*/)}</label>
									<Input form={this.props.form} obj={{name:'specl',type:'text', 
										initialValue:checkedData.specl,
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100032/*规格宽*/)}</label>
										<Input form={this.props.form} obj={{name:'specw',type:'text', 
										initialValue:checkedData.specw,
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
								</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100169/*单位*/)}</label>
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
                                             		initialValue={xt.initSelectValue(checkedData.unitofmea,{spcUomId:checkedData.unitofmea.id,...checkedData.unitofmea},['spcUomId'], 'localName', this.props.form)}
                                             className ={'col-md-9 col-lg-9 currency-btn select-from-currency'}
                                              allowClear
				                    />
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100039/*自重*/)}</label>
										<Input form={this.props.form} obj={{name:'selfWt',type:'text', 
										initialValue:checkedData.selfWt,
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
								</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100040/*重量单位*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Unitofmea' 
                                             fieldName="wtUomId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                wtUomId: da.id,
                                                wtUomLcName: da.localName,
                                                 wtUomEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-9 col-lg-9 currency-btn select-from-currency'}
                                              initialValue={xt.initSelectValue(checkedData.weight,{wtUomId:checkedData.weight.id,...checkedData.weight},['wtUomId'], 'localName', this.props.form)}
                                              allowClear
				                    />
								</div>
								<div className="form-group col-xs-6 col-md-6">
								<label className={'col-xs-3 col-md-3'}>{I18n.t(100002/*描述*/)}</label>
								<input type="text" className={'text-input-nowidth col-md-9 col-lg-9'} placeholder=""
									{...getFieldProps('description',{
										initialValue:checkedData.description,
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
								<p>{checkedData.code || ''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100001/*名称*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.localName || ''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100124/*托盘类型*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.trayType.localName || ''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100029/*材质*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.textur.localName || ''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100031/*规格长*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.specl || ''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100032/*规格宽*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.specw || ''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100169/*单位*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.unitofmea.localName || ''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100039/*自重*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.selfWt || ''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100040/*重量单位*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.weight.localName || ''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100002/*描述*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.description || ''}</p>
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
const ProductForm =createForm()(Productplug);
export default ProductForm;
