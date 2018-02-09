import React, { Component,PropTypes } from 'react';
import RightKey from '../../../../../components/RightKey/RightKey';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option ,ConstMiniSelect} from '../../../../../components/Select';
import Radio from '../../../../../components/Radio';
import Calendar from  '../../../../../components/Calendar/Calendar';
import Checkbox from '../../../../../components/CheckBox';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS} from '../../../../../services/apiCall';
import Input from '../../../../../components/FormValidating/FormValidating';
import Loading from "../../../../../components/Loading";//加载动画
import ServiceTips from "../../../../../components/ServiceTips";//提示框
import AddMoreLanguage from "../../../../../components/AddMoreLanguage"; 
import {I18n} from "../../../../../lib/i18n";
import xt from '../../../../../common/xt';
export class  NormalDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.onChangeCheck = this.onChangeCheck.bind(this);
        this.state ={
        	checkeds:false,
        	checkedc:false
        }
	}
	onChangeCheck(num,e){
		this.setState({
			checkeds:e.target.checked
		});
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		let {data,initData} = this.props;
		let  iconArray = [{type:'add',onClick:this.addClick}]
		let content= <div></div>;
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:initData? initData.id:''
			})
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:initData? initData.optlock:''
			})
			getFieldProps('nameValues', {
							            	validateFirst: true,
						                    initialValue:initData? initData.nameValues:''
			})
			getFieldProps('name',{
											validateFirst: true,
											initialValue:initData? initData.name:''
			})
		 if(data.name.title == I18n.t(100138/*常规*/)){
		 	initData =initData || {};
			initData.timZon = initData.timZon || {};
			initData.riskType = initData.riskType || {};
			initData.beArea = initData.beArea || {};
			initData.locale = initData.locale || {};
		 	let  {timZons,riskTypes,beAreaIds,locales,country} = initData;
			this.data = Object.assign({},initData,{title:"countryinformation-detail-normal"});
           content =(
           		<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
								<Input form={this.props.form} obj={{name:'code',type:'text',
													initialValue:initData.code?initData.code:'',
													classn:'col-md-8 col-lg-8 text-input-nowidth'}}
								/> 
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
								<Input form={this.props.form} obj={{name:'localName',type:'text',
													initialValue:initData.localName?initData.localName:'',
													classn:'col-md-8 col-lg-8 text-input-nowidth'}}
								/>
								<AddMoreLanguage 
								    menusetView={initData}
								    object = {'country'}
								     isShowId={true}
								    upload={this.props.upload}
								    onCancel ={this.onCancel}
							    />
							</div>
							
						</div>
						<div className={'row'}>
						    <div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100083/*三字码*/)}</label>
								<input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
										{...getFieldProps('stThWord',{
													initialValue:initData.stThWord?initData.stThWord:'',
										})}
								/>  
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100086/*时区*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.TimZon' 
                                             fieldName="timZonId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 timZonId: da.id,
                                                 timZonLcName: da.localName,
                                                 timZonEnName: da.name,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              initialValue={xt.initSelectValue(initData.timZon,{timZonId:initData.timZon.id,...initData.timZon},['timZonId'], 'localName', this.props.form)}
                                              allowClear
				                 />
							</div>
							</div>
							<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100085/*风险类型*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.RiskType' 
                                             fieldName="riskTyId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 riskTyId: da.id,
                                                 riskTyName: da.name,
                                                 s_label: da.name
                                             }}>{da.name}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                              initialValue={ xt.initSelectValue(initData.riskType,{riskTyId:initData.riskType.id,...initData.riskType},['riskTyId'], 'name', this.props.form)}
                                              allowClear
				                 />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100091/*地区*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.BeAreaId' 
                                             fieldName="beAreaId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 beAreaId: da.id,
                                                 beAreaName: da.name,
                                                  beAreaLcName: da.localName,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                             initialValue={ xt.initSelectValue(initData.beArea,{beAreaId:initData.beArea.id,...initData.beArea},['beAreaId'], 'localName', this.props.form)}
                                              allowClear
				                 />
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{I18n.t(100096/*美国制裁*/)}</label>
									<Checkbox 
										{...getFieldProps('sacInUsMark',{
											initialValue:initData.sacInUsMark
										})}
										checked={this.props.form.getFieldValue("sacInUsMark")}
									/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{I18n.t(100084/*电话区号*/)}</label>
									<input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
										{...getFieldProps('cntrycode',{
													initialValue:initData.cntrycode?initData.cntrycode:''
										})}
									/>
								</div>
								
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{I18n.t(100095/*语言分类*/)}</label>
									<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.ds.entity.Locale' 
                                             fieldName="localeId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 localeId: da.id,
                                                 localeName: da.name,
                                                  localeLcName: da.localName,
                                                 s_label: da.localName
                                             }}>{da.localName}</Option>}
                                             	reles={true}
                                             className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
                                             initialValue={xt.initSelectValue(initData.locale,{localeId:initData.locale.id,...initData.locale},['localeId'], 'localName', this.props.form)}
                                              allowClear
				                 />
								</div>
						</div>
					</div>
			</div>)
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
								{content}
				</FormWrapper>
			</div>
			);
	}
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				that.props.onSaveAndClose(that.props.form.getFieldsValue(),that.data);
				that.props.form.resetFields();
			}
		})
	}
	onCancel(){
		const {onCancel}=this.props;
        if(onCancel){
            onCancel();
        }
	}
}
NormalDialog.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
NormalDialog.defaultProps ={
	onSaveAndClose(){},
    onCancel(){}
}
const DialogFrom =createForm()(NormalDialog);
export default DialogFrom;
