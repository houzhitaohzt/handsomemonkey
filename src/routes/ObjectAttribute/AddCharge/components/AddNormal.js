import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import {createForm,FormWrapper} from '../../../../components/Form';
import Calendar from  '../../../../components/Calendar/Calendar';

import  SelectChange from "../../../../components/SelectChange";


// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { ConstVirtualSelect,Option } from '../../../../components/Select'; // 下拉

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,language,commonAjax,toDecimal} from '../../../../services/apiCall';
import {I18n} from "../../../../lib/i18n";
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
 

class Addnormal extends Component{

	constructor(props){
		super(props);

		// init state
		this.state = {
			
		}

	}

	componentDidMount(){

	}

	saveClick = (isclose,initAjax)=> {
		var that = this;


	}

	// 保存
	onSaveAndClose = ()=>{

		let that = this;
		let {data} = this.state;
		const {getOneData,form,onSaveAndClose,getOne} = this.props;
		
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_DS,'/formObject/save',Object.assign({},{id:getOneData['id'],optlock:getOneData['optlock']},value),
					(response)=>{	 						
						ServiceTips({text: response.message,type:'success'});	
						setTimeout(that.onBack(),1000)
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}	
		});	
	}

	// 返回
	onBack = ()=> {
		let ID = this.props.location.query.id;
		let {getOneData} = this.props;

		this.props.navReplaceTab({name:I18n.t(600232/*表单对象详情*/),component:I18n.t(600232/*表单对象详情*/),url:'/objectAttribute/detail'});
		this.props.router.push({pathname: '/objectAttribute/detail', query: {id: ID}});
	}

	render(){

		let that = this;
		let {getNFieldProps,getFieldProps,getFieldError} = this.props.form;
		let {getOneData,form} = this.props;
		

		return(
			<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(100138/*常规*/)}</span>
					<span onClick={this.onBack} title={I18n.t(100430/*保存*/)}><i className={'foddingicon fooding-back'}></i></span>
					<span onClick={this.onSaveAndClose} title={I18n.t(100431/*返回*/)}><i className={'foddingicon fooding-save'}></i></span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3">
							<label className={'col-md-3'}>{I18n.t(100001/*名称*/)}</label>
							<input type="text"								  
								className ={'col-md-9 text-input-nowidth'}															
								{...getFieldProps('localName',{
									initialValue: getOneData.localName ? getOneData.localName : ''
								})}									
							/>
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-3'}>{I18n.t(600223/*所属表单*/)}</label>
							<div className={'col-md-9'}>
								<ConstVirtualSelect
									style={{width:'100%'}}
									form={form}
									apiType={apiPost}
									fieldName="formId"
									labelKey='localName'
									apiParams="com.fooding.fc.es.entity.Form"
									initialValue={getOneData.form ? {s_label:getOneData.form.localName,formId:getOneData.form['id']} : undefined}
									clearable
									rules
								/>
							</div>
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-3'}>{i18n.t(600224/*表单类型*/)}</label>
							<div className={'col-md-9'}>
								<ConstVirtualSelect
									style={{width:'100%'}}
									form={form}
									apiType={apiPost}
									fieldName="formObjectTypeId"
									labelKey='localName'
									apiParams="com.fooding.fc.enumeration.FormObjectType"
									initialValue={getOneData.formObjectType ? {s_label:getOneData.formObjectType.name,formObjectTypeId:getOneData.formObjectType.id} : undefined}
									clearable
									rules
								/>
							</div>
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-3'}><span>*</span>{I18n.t(200886/*表单标识*/)}</label>
							<input type="text"
								className={getFieldError('formIdentity')?'col-md-9 text-input-nowidth error-border':'col-md-9 text-input-nowidth'}
								{...getFieldProps('formIdentity',{
									rules:[{required:true}],
									initialValue: getOneData.formIdentity ? getOneData.formIdentity : ''
								})}																							
							/>
						</div>
					</div>
					<div className={'row'}>
						<div className="col-md-9">
							<label className={'col-md-1'}>{i18n.t(600225/*数据接口*/)}</label>
							<div className={''}>
								<input type="text"
									className ={'col-md-11 text-input-nowidth'}	
									{...getFieldProps('url',{
										initialValue: getOneData.url ? getOneData.url : ''
									})}																								
								/>
							</div>
						</div>
						<div className="col-md-3">
							<label className={'col-md-3'}>{i18n.t(200747/*所属系统*/)}</label>
							<div className={'col-md-9'}>
								<ConstVirtualSelect
									style={{width:'109%'}}
									form={form}
									apiType={apiPost}
									fieldName="moduleId"
									labelKey='localName'
									apiParams="com.fooding.fc.enumeration.Module"
									initialValue={getOneData.module ? {s_label:getOneData.module.name,moduleId:getOneData.module.id} : undefined}
									clearable
								/>								
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
const ProductForm =createForm()(Addnormal);
export default ProductForm;
