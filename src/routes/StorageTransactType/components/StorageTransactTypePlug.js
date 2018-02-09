import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option,ConstMiniSelect,ConstVirtualSelect} from '../../../components/Select';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Input from '../../../components/FormValidating/FormValidating';
import AddMoreLanguage from "../../../components/AddMoreLanguage";
import {I18n} from "../../../lib/i18n";
import xt from '../../../common/xt'; // 下拉
export class StorageTransactTypePlug extends Component{
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
		var that = this;
		const {form, onSaveAndClose} = that.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				if(that.props.DialogContent == 1){
					let params = that.props.form.getFieldsValue();
					delete params['nameValues'];
					that.props.onSaveAndClose(params,{},isAdd);
				}else{
					that.props.onSaveAndClose(that.props.form.getFieldsValue(),{},isAdd);
				}that.props.form.resetFields();

				
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
		info.dataTypes = info.dataTypes || [];
		info.storOperts = info.storOperts || [];
		let content = <div></div>;
		if(this.props.DialogContent == 1){
			getFieldProps('optlock', {
							            	validateFirst: true,
						                     initialValue:0
			})
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100003/*ID*/)}</label>
								<Input form={this.props.form} obj={{name:'id',type:'text', 
										initialValue:'',
										classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
						</div>
						<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text', 
										initialValue:'',
										classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'localName',type:'text', 
										initialValue:'',
										classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(500015/*基础事物类型*/)}</label>
										<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.StorOpert' 
                                             fieldName="stOpeID"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 stOpeID: da.id,
                                                 stOpeLcName: da.localName,
                                                 stOpeEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              allowClear
				                 		/>   
							</div>
					</div>
					<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(500016/*数据标识*/)}</label>
									<ConstVirtualSelect form={this.props.form}
									isRequest={false}
									initValueOptions={[i18n.t(500316/*仓储事物*/)].map(da => ({id:170, name: da}))}
                                     fieldName="tbTyp"
                                      rules
                                      className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
						                /> 
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}>{I18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('description', {
						                                initialValue:''
						                    })} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
								</div>
					</div>
				</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			checkedData = checkedData || {};
			checkedData.storOpert = checkedData.storOpert || {};
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
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100003/*ID*/)}</label>
								<Input form={this.props.form} obj={{name:'id',type:'text', 
										initialValue:checkedData.id,
										classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
						    </div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text', 
										initialValue:checkedData.code,
										classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input  form={this.props.form} obj={{name:'localName',type:'text', 
										initialValue:checkedData.localName,
										classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
								<AddMoreLanguage 
								    menusetView={checkedData}
								    object = {'storOpert'}
								    isShowId={true}
								    upload={this.props.upload}
								    onCancel ={this.onCancel}
							    />
							</div>
							<div className="form-group col-md-6 col-lg-6">
											<label className={'col-xs-4 col-md-4'}>{I18n.t(500015/*基础事物类型*/)}</label>
											<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.StorOpert' 
                                             fieldName="stOpeID"
                                            optionValue={da => <Option key={da.id} objValue={{
                                                 stOpeID: da.id,
                                                 stOpeLcName: da.localName,
                                                 stOpeEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              initialValue={xt.initSelectValue(checkedData.storOpert,{
                                              	stOpeID:checkedData.storOpert.id,
                                              	stOpeLcName:checkedData.storOpert.localName,
                                              	stOpeEnName:checkedData.storOpert.name,
                                              	...checkedData.storOpert},['stOpeID','stOpeLcName','stOpeEnName'], 'localName', this.props.form)}
                                              allowClear
				                 		/>   
							</div>   
						
						</div>
						<div  className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}>{I18n.t(500016/*数据标识*/)}</label>
										<ConstVirtualSelect form={this.props.form}
									isRequest={false}
									initValueOptions={[i18n.t(500316/*仓储事物*/)].map(da => ({id:170, name: da}))}
									initialValue={checkedData.dataType ? {
					                        tbTyp: checkedData.dataType.id,
					                     
					                        
					                        s_label: checkedData.dataType.name
					                    } : undefined}
                                     fieldName="tbTyp"
                                      rules
                                      className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
						                /> 
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}>{I18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('description', {
						                                initialValue:checkedData.description,
						                    })} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
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
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100003/*ID*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p>{checkedData.id}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100000/*代码*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p>{checkedData.code}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100001/*名称*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p>{checkedData.localName}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(500015/*基础事物类型*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p>{checkedData.storOpert?checkedData.storOpert.localName:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(500016/*数据标识*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p>{checkedData.dataType?checkedData.dataType.name:''}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100002/*描述*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p>{checkedData.description}</p>
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
const ProductForm =createForm()(StorageTransactTypePlug); 
export default ProductForm;
