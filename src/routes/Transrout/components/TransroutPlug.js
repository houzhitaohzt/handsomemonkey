import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../components/Select';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Input from '../../../components/FormValidating/FormValidating';
import AddMoreLanguage from "../../../components/AddMoreLanguage"; 
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';
import {I18n} from "../../../lib/i18n";  
import xt from '../../../common/xt'; // 下拉
export class TransroutPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.state=this.initState();
		this.getData = this.getData.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
	}
	initState(){
		return{
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
					delete params['transRout.id'];
					delete params['transRout.optlock'];
					delete params['transRout.nameValues'];
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
		const { getFieldProps, getFieldError } = this.props.form;
		let {checkedData,info} = this.props;
		info = info || {};
		info.statns = info.statns || {};
		checkedData.statns = checkedData.statns ||[];
		let content = <div></div>;
		let obj = Object.assign({},checkedData,{id:checkedData.id,localName:checkedData.localName,name:checkedData.name});
		let array =[];
		checkedData.statns.map((e)=>{array.push(xt.initSelectValue(e, e, ['id'],"localName", this.props.form))});
		let countriesValue= array;
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-2 col-lg-2'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:"transRout.code",type:'text', 
										initialValue:'',
										classn:'col-md-10 col-lg-10 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-2 col-lg-2'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'transRout.localName',type:'text', 
										initialValue:'',
										classn:'col-md-10 col-lg-10 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-2 col-lg-2'}>{I18n.t(100155/*港口*/)}</label>
									<ConstVirtualSelect form={this.props.form}
															apiType={apiPost}
															apiParams='com.fooding.fc.ds.entity.Statn'
			                                                 fieldName="statns"
			                                                 initRequest
			                                                 valueKeys={da => ({
			                                                     id: da.id,
			                                                     s_label: da.localName
			                                                })}
			                                                 multi rules
			                                                 className ={'col-md-10 col-lg-10'}							
			                                		/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-2 col-lg-2'}>{I18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('transRout.description', {
						                                initialValue:''
						                    })} className={'col-md-110 col-lg-10 text-input-nowidth'}/>
								</div>
						</div>
					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			getFieldProps('transRout.id', {
							            	validateFirst: true,
						                    initialValue:checkedData?checkedData.id:''
			})
			getFieldProps('transRout.optlock', {
							            	validateFirst: true,
						                    initialValue:checkedData?checkedData.optlock:''
			})
			getFieldProps('transRout.rowSts', {
							            	validateFirst: true,
						                    initialValue:checkedData?checkedData.rowSts:''
			})
			getFieldProps('transRout.createDate', {
							            	validateFirst: true,
						                    initialValue:checkedData?checkedData.createDate:''
			})
			getFieldProps('transRout.createUserId', {
							            	validateFirst: true,
						                    initialValue:checkedData?checkedData.createUserId:''
			})
			getFieldProps('transRout.nameValues', {
							            	validateFirst: true,
						                    initialValue:checkedData?checkedData.nameValues:''
			})
			getFieldProps('transRout.name', {
							            	validateFirst: true,
						                    initialValue:checkedData?checkedData.name:''
			})
			   content = (
			   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-2 col-lg-2'}>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'transRout.code',type:'text', 
										initialValue:checkedData?checkedData.code:'',
										classn:'col-md-10 col-lg-10 text-input-nowidth'}}/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-2 col-lg-2'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'transRout.localName',type:'text', 
										initialValue:checkedData?checkedData.localName:'',
										classn:'col-md-10 col-lg-10 text-input-nowidth'}}/>
								<AddMoreLanguage 
								    menusetView={checkedData}
								    object = {'transRout'}
								    upload={this.props.upload}
								    onCancel ={this.onCancel}
								    isShowId={true}
							    />
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-2 col-lg-2'}>{I18n.t(100155/*港口*/)}</label>
									<ConstVirtualSelect form={this.props.form}
															apiType={apiPost}
															apiParams='com.fooding.fc.ds.entity.Statn'
			                                                 fieldName="statns"
			                                                 initRequest
			                                                 multi rules
			                                                 initialValue={countriesValue}
			                                                 valueKeys={da => ({
			                                                     id: da.id,
			                                                     s_label: da.localName
			                                                 })}
			                                                
			                                                 className ={'col-md-10 col-lg-10'}							
			                                		/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-2 col-lg-2'}>{I18n.t(100002/*描述*/)}</label>
									<input type="text" {...getFieldProps('transRout.description', {
						                                initialValue:checkedData?checkedData.description:'',
						                    })} className={'col-md-110 col-lg-10 text-input-nowidth'}/>
								</div>
						</div>
					</div>
			    </div>
			)
		}else if(this.props.DialogContent==5){
			checkedData.record.statns = checkedData.record.statns || []
			content = (
				<div className={'girdlayout scroll'} style={{overflow:'auto'}}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100000/*代码*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.record.code}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100001/*名称*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.record.localName}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
					<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100155/*港口*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>
									{
										checkedData.record.statns.map((e,i)=>{
											return e.localName + " "
										})
									}
								</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100002/*描述*/)}</label>
							<div className={'col-xs-8 col-md-8'}>
								<p>{checkedData.record.description}</p>
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
const ProductForm =createForm()(TransroutPlug);
export default ProductForm;
