import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
//引入滚动条
import FreeScrollBar from "../../../Client/List/components/FreeScrollBar";
import AddRepeats from '../../../Client/List/components/AddRepeats';
import {addUpdateRecord,addUpdateJson} from '../../../../services/client/call';
import {I18n} from '../../../../lib/i18n';
import ProductSelect from '../../../../components/FindGridSelect';



// common
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { Option,ConstVirtualSelect } from '../../../../components/Select'; // 下拉
import Calendar from  '../../../../components/Calendar/Calendar';


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language} from '../../../../services/apiCall';
import AddMoreLanguage from "../../../../components/AddMoreLanguage"; 
import fieldsFormat from '../../../../common/FieldsFormat';



class CommonForm extends Component{

	constructor(props){
		super(props)

		// init state
		this.state = {
			checkedData:{}, 
			specTxt:'', // 规格 			
		}


	}

	static defaultProps={
		data:{},
		onSaveAndClose(){},
		onCancel(){}
	}

	componentDidMount(){
		this.getPage();
	}

	// getPage 
	getPage = ()=> {
		let that = this;
		let row = this.props.checkedData;

		if(!row['id']) return; // 新增
		apiGet(API_FOODING_DS,'/customsData/getOne',{id:row.id},
			(response)=>{
				that.setState({checkedData:response.data});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	// 产品 切换  
	onSelect = (row)=> this.setState({specTxt: row['specTxt']});

	// 保存
	onSaveAndClose = ()=> {
		let row = this.props.checkedData;
		const {form, onSaveAndClose} = this.props;
		let that = this;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_DS,'/customsData/save',Object.assign(value,{id:row['id'],optlock:row['optlock']}),
					(response)=>{
						that.props.form.resetFields(); // 清除表单
						that.props.onSaveAndClose(); // 关闭弹框
						that.props.getPage();	// 刷新页面
						ServiceTips({text: response.message,type:'success'});
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});
	}

	// 取消
	onCancel = ()=> {
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
			this.props.form.resetFields();
		}
	}


	render(){
		let {checkedData,specTxt} = this.state
		const {form} = this.props;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;



		let dom = <div className="addnormal girdlayout">
					<div className="row">
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3'}><span>*</span>{I18n.t(600194/*采购商*/)}</label>
							<div className={'col-md-9'}>
								<input type="text"
									style={{width:'100%'}}
									className ={getFieldError('purchaser') ? 'text-input-nowidth error-border' : 'text-input-nowidth'}
									
									{...getFieldProps('purchaser',{
										rules: [{required:true}],
										initialValue: checkedData.purchaser ? checkedData.purchaser : ''
									})}
								/>
							</div>
						</div>
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3'}>{I18n.t(100312/*供应商*/)}</label>
							<div className={'col-md-9'}>
								<input type="text"
									style={{width:'100%'}}
									className ={getFieldError('vendor') ? 'text-input-nowidth error-border' : 'text-input-nowidth'}
									
									{...getFieldProps('vendor',{
										// rules: [{required:true}],
										initialValue: checkedData.vendor ? checkedData.vendor : ''
									})}
								/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3'}>{I18n.t(100385/*海关编码*/)}</label>
							<div className={'col-md-9'}>
								<input type="text"
									style={{width:'100%'}}																
									className ={'text-input-nowidth'}
									
									{...getFieldProps('hscode',{
										//rules: [{required:true}],
										initialValue: checkedData.hscode ? checkedData.hscode : ''
									})}
								/>
							</div>
						</div>
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3'}><span>*</span>{I18n.t(300077/*产品*/)}</label>
							<div className={'col-md-9'}>
								<ProductSelect
									form={this.props.form}
									value={checkedData.material ? {mtlId:checkedData.material['id'],s_label:checkedData.material['localName']}:undefined}
									onSelect = {this.onSelect}
									search='/platformMaterial/search' 
									url='/platformMaterial/search'
									titleClass={'col-md-12'}
								/>								
							</div>
						</div>						
					</div>
					<div className="row">
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3'}>{I18n.t(200557/*规格*/)}</label>
							<div className={'col-md-9'}>							
								<input type="text"
									style={{width:'100%'}}								
									className ={'text-input-nowidth'}
									
									disabled
									{...getFieldProps('specTxt',{
										
										initialValue: specTxt ? specTxt : checkedData.specTxt
									})}
								/>
							</div>
						</div>
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3'}>{I18n.t(600195/*原产国*/)}</label>
							<div className={'col-md-9'}>							
								<ConstVirtualSelect
									form={form}
									style={{width:'100%'}}
									apiType={apiPost}
									fieldName="countryOriginId"
									labelKey='localName'
									apiParams="com.fooding.fc.ds.entity.Country"
									clearable
									initialValue={{s_label:checkedData['countryOriginTxt'],countryOriginId:checkedData['countryOrigin']?checkedData['countryOrigin']['id']:''}}									
								/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3'}>{I18n.t(100297/*起运港*/)}</label>
							<div className={'col-md-9'}>							
								<ConstVirtualSelect
									form={form}
									style={{width:'100%'}}									
									apiType={apiPost}
									fieldName="portFromId"
									labelKey='localName'
									apiParams={{obj:'com.fooding.fc.ds.entity.Statn',queryParams:[{attr:"statnTyId",expression:"=",value:10}]}}
									clearable
									initialValue={{s_label:checkedData['portFromTxt'],portFromId:checkedData['portFrom']?checkedData['portFrom']['id']:''}}
								/>
							</div>
						</div>
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3'}>{I18n.t(100298/*目的港*/)}</label>
							<div className={'col-md-9'}>							
								<ConstVirtualSelect
									form={form}
									style={{width:'100%'}}									
									apiType={apiPost}
									fieldName="portToId"
									labelKey='localName'
									apiParams={{obj:'com.fooding.fc.ds.entity.Statn',queryParams:[{attr:"statnTyId",expression:"=",value:10}]}}
									clearable
									initialValue={{s_label:checkedData['portToTxt'],portToId:checkedData['portTo']?checkedData['portTo']['id']:''}}
								/>
							</div>
						</div>						
					</div>						
					<div className="row">
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3'}>{I18n.t(600203/*FOB报价*/)}</label>
							<div className={'col-md-9'}>							
								<input type="text"
									style={{width:'100%'}}								
									className ={'text-input-nowidth'}
									
									{...getFieldProps('fobPrice',{
										//rules: [{required:true}],
										initialValue: checkedData.fobPrice ? checkedData.fobPrice : ''
									})}
								/>
							</div>
						</div>
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3'}>{I18n.t(600204/*CIF报价*/)}</label>
							<div className={'col-md-9'}>							
								<input type="text"
									style={{width:'100%'}}								
									className ={'text-input-nowidth'}
									
									{...getFieldProps('cifPrice',{
										//rules: [{required:true}],
										initialValue: checkedData.cifPrice ? checkedData.cifPrice : ''
									})}
								/>
							</div>
						</div>						
					</div>	
					<div className="row">
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3'}><span>*</span>{I18n.t(600196/*重量*/)}</label>
							<div className={'col-md-9'}>
								<input type="text"
									style={{width:'100%'}}
									className ={getFieldError('weight') ? 'text-input-nowidth error-border' : 'text-input-nowidth'}
									
									{...getFieldProps('weight',{
										rules: [{required:true}],
										initialValue: checkedData.weight ? checkedData.weight : ''
									})}
								/>
							</div>
						</div>
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3'}><span>*</span>{I18n.t(100169/*单位*/)}</label>
							<div className={'col-md-9'}>
								<ConstVirtualSelect
									form={form}
									style={{width:'100%'}}
									pageSize={6}
									apiType={apiPost}
									fieldName="unitofmeaId"
									labelKey='localName'
									apiParams="com.fooding.fc.ds.entity.Unitofmea"
									clearable
									rules
									initialValue={{s_label:checkedData['unitofmeaTxt'],unitofmeaId:checkedData['unitofmea']?checkedData['unitofmea']['id']:''}}									
								/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3'}>{I18n.t(600197/*进关日期*/)}</label>
							<div className={'col-md-9'}>
								<Calendar 
									width={'350px'}
									showTime = {false} 
									isShowIcon={true} 
									form={this.props.form}
									//validate={true}
									className ={getFieldError('enterDate')?'error-border':''}
									name={'enterDate'}
									value={checkedData['enterDate']}												
								/>	
							</div>
						</div>
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3'}>{I18n.t(600198/*出关日期*/)}</label>
							<div className={'col-md-9'}>
								<Calendar 
									width={'350px'}
									showTime = {false} 
									isShowIcon={true} 
									form={this.props.form}
									//validate={true}
									className ={getFieldError('leaveDate')?'error-border':''}
									name={'leaveDate'}
									value={checkedData['leaveDate']}												
								/>	
							</div>
						</div>
					</div>																						
				</div>;
		return (<FormWrapper 
					showFooter={true} 
					onSaveAndClose={this.onSaveAndClose} 
					onCancel={this.onCancel}>
					{dom}
				</FormWrapper>);
	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;
