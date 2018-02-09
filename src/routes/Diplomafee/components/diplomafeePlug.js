import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import Input from '../../../components/FormValidating/FormValidating';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP} from '../../../services/apiCall';
import AddMoreLanguage from "../../../components/AddMoreLanguage"; 
import Select, { Option,ConstVirtualSelect,ConstMiniSelect } from '../../../components/Select';
import {I18n} from "../../../lib/i18n";
import xt from '../../../common/xt'; // 下拉
import Checkbox from "../../../components/CheckBox";
import WebData from "../../../common/WebData";
export class CertificatePlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.state=this.initState();
		this.getData = this.getData.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.ccidClick = this.ccidClick.bind(this);
	}
	initState(){
		return {
			ccidArray:[]
		}
	}
	getData(value,that){
		this.addSelect = that;
	}
	onClick(){

	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;

		form.validateFields((errors, value) => {
			if(errors){

			}else{
				
				if(this.props.DialogContent == 1){
					let params = this.props.form.getFieldsValue();
					delete params['billId'];
					delete params['optlock'];
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
	onSelect(){
		apiGet(API_FOODING_DS,'/ccardType/getList',{},(response)=>{
		},(error)=>{

		});
	}
	ccidClick(){
		var that =this;
		apiGet(API_FOODING_ES,'/staff/getListByCcId',{ccid: WebData.user.data.staff.ccid},(response)=>{
			that.setState({
				ccidArray:response.data
			});
		},(errors)=>{

		})
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError,getNFieldProps } = this.props.form;
		let ccLocalName = WebData.user.data.staff.localName;
		let ccLocalEname = WebData.user.data.staff.enName;
		let Cid = WebData.user.data.staff.id;
		let {checkedData} = this.props;
		let content = <div></div>;
		getFieldProps('status', {
							            	validateFirst: true,
						                    initialValue:'1'
		})
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(400008/*销售单号*/)}</label>
									<ConstVirtualSelect
										form={this.props.form}
										fieldName='saleNo'
										apiType={apiGet}
										apiHost={API_FOODING_ERP}
										apiUri='/common/getNoList?billType=318'
										valueKeys={da =>String(da)}
										 rules
									/>	
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className='col-md-4 col-lg-4'><span>*</span>{I18n.t(500070/*证书名称*/)}</label>
													<ConstMiniSelect form={this.props.form}
					                                     pbj={{
					                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
					                                                     params: {obj:'com.fooding.fc.ds.entity.Certfct'}
					                                          }} fieldName="cardId"
					                                                 initValueOptions={[]}
					                                                  
					                                                 optionValue={(da, di) => <Option key={di} objValue={{
					                                                     cardId: da.id,
					                                                     cardLcName: da.localName,
					                                                     cardEnName: da.name,
					                                                     s_label:da.localName
					                                                 }}>{da.localName}</Option>} reles={true}
					                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
					                            	/>
								</div>
						</div>
						
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{I18n.t(500072/*是否正本*/)}</label>
										<Checkbox 
											{...getFieldProps('gentMark',{
													initialValue:false
												})}
											
											/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{I18n.t(500071/*是否加急*/)}</label>
										<Checkbox 
											{...getFieldProps('origMark',{
													initialValue:false
												})}
											
											/>
								</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400084/*收款单位*/)}</label>
								<ConstVirtualSelect
									form={this.props.form}
									fieldName='recBeId'
									apiType={apiPost}
									apiUri='/enterprise/search'
									async={true}
									apiParams='keyword'
									
									 rules
									 valueKeys={ da => ({
													        recBeId: da.id,
			                                                recBeLcName: da.localName,
			                                                recBeEnName: da.name,
			                                                s_label: da.localName
													    })}
									className={'currency-btn select-from-currency col-md-8 col-lg-8'}
								/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(200321/*实际金额*/)}</label>
										<Input form={this.props.form} obj={{name:'charge',type:'text', 
										initialValue:'',
										classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
								</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-xs-6 col-md-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100284/*币种*/)}</label>
									<ConstMiniSelect form={this.props.form}
			                                                 pbj={{
			                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
			                                                     params: {obj:'com.fooding.fc.ds.entity.Curren'}
			                                                 }} fieldName="cnyId"
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     cnyId: da.id,
			                                                     cnyLcName: da.localName,
			                                                     cnyEnName: da.name,
			                                                     s_label: da.localName
			                                                 }}>{da.localName}</Option>}
			                                                 reles={true}
			                                                  
			                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
			                            />
								</div>
								<div className="form-group col-xs-6 col-md-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(200817/*申请人*/)}</label>
									<ConstVirtualSelect
					                        placeholder=""
					                        form={this.props.form}
					                       fieldName='lsStaffId'
					                        apiHost={API_FOODING_ES}
					                        apiUri='/staff/getListByCcId'
					                        apiParams={{
					                            ccid: WebData.user.data.staff.ccid
					                            
					                        }}
					                         initialValue={xt.initSelectValue(ccLocalName,{s_label:ccLocalName,lsStaffId:Cid,lsStaffLcName:ccLocalName,lsStaffEnName:ccLocalEname},['lsStaffId','lsStaffLcName','lsStaffEnName'], 's_label', this.props.form)}
					                        valueKeys={ da => ({
										         lsStaffId: da.id,
										         lsStaffLcName: da.localName,
										         lsStaffEnName: da.name,
										        s_label: da.localName
										    })}
										     rules
					                        className ={'currency-btn select-from-currency col-md-8 col-lg-8'}  
					                    />
									
								</div>
							
						</div>
					</div>
			</div>
           	);
		}
		else if(this.props.DialogContent == 3){
			getFieldProps('billId', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.billId:''
			}) 
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.optlock:''
			})
			getFieldProps('sourceNo', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.sourceNo:''
			})
			content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(400008/*销售单号*/)}</label>
									<ConstVirtualSelect
										form={this.props.form}
										 rules
										fieldName='saleNo'
										apiType={apiGet}
										apiHost={API_FOODING_ERP}
										apiUri='/common/getNoList?billType=318'
										valueKeys={da =>String(da)}
										  initialValue={xt.initSelectValue(checkedData.saleNo,{saleNo:checkedData.saleNo},['saleNo'], 'saleNo', this.props.form)}
									/>	
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className='col-md-4 col-lg-4'><span>*</span>{I18n.t(500070/*证书名称*/)}</label>
													<ConstMiniSelect form={this.props.form}
					                                     pbj={{
					                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
					                                                     params: {obj:'com.fooding.fc.ds.entity.Certfct'}
					                                          }} fieldName="cardId"
					                                                 initValueOptions={[]}
					                                                  
					                                                 optionValue={(da, di) => <Option key={di} objValue={{
					                                                     cardId: da.id,
					                                                     cardLcName: da.localName,
					                                                     cardEnName: da.name,
					                                                     s_label:da.localName
					                                                 }}>{da.localName}</Option>} reles={true}
					                                                 initialValue={xt.initSelectValue(checkedData.cardLcName,{cardId:checkedData.cardId,cardLcName:checkedData.cardLcName,cardEnName:checkedData.cardEnName,s_label:checkedData.cardLcName},['cardId','cardLcName','cardEnName'], 's_label', this.props.form)}
					                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
					                            	/>
								</div>
						</div>
						
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{I18n.t(500072/*是否正本*/)}</label>
										<Checkbox 
											{...getFieldProps('gentMark',{
													initialValue:checkedData.gentMark?checkedData.gentMark:false
												})}
											
											checked={this.props.form.getFieldValue("gentMark")}/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-md-4 col-lg-4'}>{I18n.t(500071/*是否加急*/)}</label>
										<Checkbox 
											{...getFieldProps('origMark',{
													initialValue:checkedData.origMark?checkedData.origMark:false
												})}
											
											checked={this.props.form.getFieldValue("origMark")}/>
								</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400084/*收款单位*/)}</label>
								<ConstVirtualSelect
									form={this.props.form}
									fieldName='recBeId'
									apiType={apiPost}
									apiUri='/enterprise/search'
									async={true}
									apiParams='keyword'
									 rules
									 valueKeys={ da => ({
													        recBeId: da.id,
			                                                recBeLcName: da.localName,
			                                                recBeEnName: da.name,
			                                                s_label: da.localName
													    })}
									className={'currency-btn select-from-currency col-md-8 col-lg-8'}
									initialValue={xt.initSelectValue(checkedData.recBeLcName,{recBeId:checkedData.recBeId,recBeLcName:checkedData.recBeLcName,recBeEnName:checkedData.recBeEnName,s_label:checkedData.recBeLcName},['recBeId','recBeLcName','recBeEnName'], 's_label', this.props.form)}
								/>
								</div>
								<div className="form-group col-md-6 col-lg-6">
										<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(200321/*实际金额*/)}</label>
										<Input form={this.props.form} obj={{name:'charge',type:'text', 
										initialValue:checkedData? checkedData.charge:'',
										classn:'col-md-8 col-lg-8 text-input-nowidth'}}/>
								</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-xs-6 col-md-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100284/*币种*/)}</label>
									<ConstMiniSelect form={this.props.form}
			                                                 pbj={{
			                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
			                                                     params: {obj:'com.fooding.fc.ds.entity.Curren'}
			                                                 }} fieldName="cnyId"
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     cnyId: da.id,
			                                                     cnyLcName: da.localName,
			                                                     cnyEnName: da.name,
			                                                     s_label: da.localName
			                                                 }}>{da.localName}</Option>}
			                                                reles={true}
			                                                initialValue={
			                                                	xt.initSelectValue(checkedData.cnyLcName,
			                                                		{cnyId:checkedData.cnyId,cnyLcName:checkedData.cnyLcName,cnyEnName:checkedData.cnyEnName,s_label:checkedData.cnyLcName},['cnyId','cnyLcName','cnyEnName'], 's_label', this.props.form)}  
			                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}                         
			                            />
								</div>
								<div className="form-group col-xs-6 col-md-6">
									<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(200817/*申请人*/)}</label>
									<ConstVirtualSelect
					                        placeholder=""
					                        form={this.props.form}
					                       fieldName='lsStaffId'
					                        apiHost={API_FOODING_ES}
					                        apiUri='/staff/getListByCcId'
					                        apiParams={{
					                            ccid: WebData.user.data.staff.ccid
					                            
					                        }}
					                        initialValue={xt.initSelectValue(checkedData.lsStaffLcName,{lsStaffId:checkedData.lsStaffId,lsStaffLcName:checkedData.lsStaffLcName,lsStaffEnName:checkedData.lsStaffEnName,s_label:checkedData.lsStaffLcName},['lsStaffId','lsStaffLcName','lsStaffEnName'], 's_label', this.props.form)}
					                        valueKeys={ da => ({
										         lsStaffId: da.id,
										         lsStaffLcName: da.localName,
										         lsStaffEnName: da.name,
										        s_label: da.localName
										    })}
										     rules
					                        className ={'currency-btn select-from-currency col-md-8 col-lg-8'}  
					                    />
									
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
const ProductForm =createForm()(CertificatePlug); 
export default ProductForm;
