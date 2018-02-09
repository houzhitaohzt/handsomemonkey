import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
import Radio from '../../../../../components/Radio';
import AddSelect from '../../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../../components/Dialog/Confirm';
import Calendar from  '../../../../../components/Calendar/Calendar';
import {toForm} from  '../../../../../common/toForm';
// common 
import ServiceTips from '../../../../../components/ServiceTips'; // 提示
import Select, {Option ,ConstMiniSelect } from '../../../../../components/Select';
import xt from '../../../../../common/xt'; // 下拉
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,toDecimal} from '../../../../../services/apiCall';
import Input from '../../../../../components/FormValidating/FormValidating';
export class SploadcostPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this); // 保存
		this.onCancel = this.onCancel.bind(this)
		this.wuliaoClick =this.wuliaoClick.bind(this)  //物料状态
		var that = this;
		this.state=this.initState();
	}
	initState(){
		return {
			
			data:{},
			info:[],
			wuliaoArray:[],
		}
	}
	getData(value,that){
		this.addSelect = that;
	}
	// 保存
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_ERP,'/noticestock/inStock',value,
					(response)=>{							
						ServiceTips({text:response.message,type:'success'});
						that.props.form.resetFields(); // 清除表单
						that.props.onSaveAndClose(); // 关闭弹框
						this.props.getList(); // 刷新列表
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})
		
	}
	// 取消
	onCancel(){
		this.props.form.resetFields(); // 清除表单
		this.props.onSaveAndClose(); // 关闭弹框
	}
	wuliaoClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.MaterialStatus'},
		(response)=>{
				that.setState({
					wuliaoArray:response.data
				})
		},(error)=>{

		});
	}
	render(){
		let that = this;
		let {getNFieldProps,getFieldProps,getFieldError,getFieldValue }= this.props.form;
		let {checkedData} = this.props;
		let info = this.props.info || {}
		let data = this.props.data;
		let beField = getNFieldProps('slId',{
										rules: [{required:true}],
										initialValue:data["sl"+language]?{s_label:data["sl"+language], slId:data.slId, slLcName:data.slLcName, slEnName:data.slEnName}:undefined
									 });
		let beFieldValue = getFieldValue("slId") || {};
		let content = <div></div>;
		getFieldProps('billId', {
							            	validateFirst: true,
						                    initialValue:info.mtl?info.mtl.billId:''
			})
			getFieldProps('billDtlId', {
							            	validateFirst: true,
						                    initialValue:info.mtl?info.mtl.billDtlId:''
			})
			getFieldProps('billType', {
							            	validateFirst: true,
						                    initialValue:info.mtl?info.billType:''
			})
			getFieldProps('mtlId', {
							            	validateFirst: true,
						                    initialValue:info.mtl?info.mtl.mtlId:''
			})
			getFieldProps('uomId', {
							            	validateFirst: true,
						                    initialValue:info.mtl?info.mtl.uomId:''
			})
			getFieldProps('eqBasnum', {
							            	validateFirst: true,
						                    initialValue:info.mtl?info.eqBasnum:''
			})	
		if(this.props.DialogContent == 1){
           content = (
           <div className={'  girdlayout'} style={{height:"344px"}}>
						  	<div className={'row'}>
								                <div className="form-group col-xs-3 col-md-3">
													<label className={'col-xs-4 col-md-4'}>{i18n.t(100379/*产品*/)}</label>
													<p className={'col-xs-8 col-md-8'}>{info.mtl?info.mtl.mtlLcName:''}</p>
														
												</div>
												<div className="form-group col-xs-3 col-md-3">
													<label className={'col-xs-8 col-md-8'}>{i18n.t(500154/*入库数量/已操作数量*/)}</label>
													<p className={'col-xs-4 col-md-4'}>{info.mtl?info.mtl.qty:''}/{info.mtl?info.mtl.hasBeenQty:''}</p>
							
												</div>
												<div className="form-group col-xs-3 col-md-3">
													<label className={'col-xs-4 col-md-4'}>{i18n.t(400035/*产品单位*/)}</label>
													<p className={'col-xs-8 col-md-8'}>{info.mtl?info.mtl.uomLcName:''}</p>
												</div>
												<div className="form-group col-xs-3 col-md-3">
													<label className={'col-xs-4 col-md-4'}>{i18n.t(500141/*采购单价*/)}</label>
													<p className={'col-xs-8 col-md-8'}>{info.mtl?toDecimal(info.mtl.purTaxPrc):''} {info.mtl?info.mtl.purCnyLcName:''}</p>
												</div>

							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-4 col-md-4">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(500150/*操作数量*/)}</label>
													<input  
											   				 type="text"
																{...getFieldProps('instock[0].nums',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue:''})}
																className={'col-xs-8 col-md-8 text-input-nowidth'} 
													/>
												</div>
												<div className="form-group col-xs-4 col-md-4">
													<label className={'col-xs-4 col-md-4'}>{i18n.t(400029/*过期日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar 
															isShowIcon={true}
															showTime={false}
															width={'100%'}
															name={'instock[0].shelfEdate'}
															form={this.props.form} 
														/>
													</div>
												</div>
												<div className="form-group col-xs-4 col-md-4">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(400030/*物料状态*/)}</label>
													<Select
														animation='slide-up'
														placeholder=''
														className ={'col-md-8 col-lg-8 currency-btn select-from-currency'}
														choiceTransitionName="rc-select-selection__choice-zoom"
														optionLabelProp="children"
														onClick={this.wuliaoClick}
														{...getNFieldProps('instock[0].abc',{
															initialValue:'',

														})}
														>
														{this.state.wuliaoArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, mStatsId:o.id, mStatsLcName:o.localName, mStatsEnName:o.name}} title={o.name}>{o.name}</Option>)}
							</Select>
												</div>
							</div>
						</div>
           	);
		}else if(this.props.DialogContent==2){
			let beFields = getNFieldProps('instock[0].stId',{
										rules: [{required:true}],
										initialValue:info["st"+language]?{s_label:info["st"+language], stId:info.stId, stLcName:info.stLcName, stEnName:info.stEnName}:undefined
									 });
			let beFieldValues = getFieldValue("instock[0].stId") || {};
				content = (
           <div className={'  girdlayout'} style={{height:"344px"}}>
						  	<div className={'row'}>
								                <div className="form-group col-xs-3 col-md-3">
													<label className={'col-xs-4 col-md-4'}>{i18n.t(100379/*产品*/)}</label>
													<p className={'col-xs-8 col-md-8'}>{info.mtl?info.mtl.mtlLcName:''}</p>
														
												</div>
												<div className="form-group col-xs-3 col-md-3">
													<label className={'col-xs-8 col-md-8'}>{i18n.t(500154/*入库数量/已操作数量*/)}</label>
													<p className={'col-xs-4 col-md-4'}>{info.mtl?info.mtl.qty:''}/{info.mtl?info.mtl.hasBeenQty:''}</p>
							
												</div>
												<div className="form-group col-xs-3 col-md-3">
													<label className={'col-xs-4 col-md-4'}>{i18n.t(400035/*产品单位*/)}</label>
													<p className={'col-xs-8 col-md-8'}>{info.mtl?info.mtl.uomLcName:''}</p>
												</div>
												<div className="form-group col-xs-3 col-md-3">
													<label className={'col-xs-4 col-md-4'}>{i18n.t(500141/*采购单价*/)}</label>
													<p className={'col-xs-8 col-md-8'}>{info.mtl?toDecimal(info.mtl.purTaxPrc):''} {info.mtl?info.mtl.purCnyLcName:''}</p>
												</div>
							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-4 col-md-4">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(500150/*操作数量*/)}</label>
													<Input form={this.props.form} obj={{name:'instock[0].nums',type:'text',
													initialValue:'',
													classn:'col-md-8 col-lg-8 text-input-nowidth'}}
								/>
												</div>
												<div className="form-group col-xs-4 col-md-4">
													<label className={'col-xs-4 col-md-4'}>{i18n.t(400029/*过期日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar 
															isShowIcon={true}
															showTime={false}
															width={'100%'}
															name={'instock[0].shelfEdate'}
															form={this.props.form}
															validate={true}

														/>
													</div>
												</div>
												<div className="form-group col-xs-4 col-md-4">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(400030/*物料状态*/)}</label>
													<Select
														animation='slide-up'
														placeholder=''
														className ={getFieldError("instock[0].abc") ?'currency-btn select-from-currency col-md-8 col-lg-8  error-border':'currency-btn select-from-currency col-md-8 col-lg-8 '}
														choiceTransitionName="rc-select-selection__choice-zoom"
														optionLabelProp="children"
														onClick={this.wuliaoClick}
														{...getNFieldProps('instock[0].abc',{
															initialValue:'',

														})}
														>
														{this.state.wuliaoArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, mStatsId:o.id, mStatsLcName:o.localName, mStatsEnName:o.name}} title={o.name}>{o.name}</Option>)}
													</Select>
												</div>
							</div>
							<div className={'row'}>
								<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400026/*库区*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue("slId", {}).slId)}
                                                 refreshMark={getFieldValue("slId", {}).slId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.StorArea',
		                                                     queryParams:[{
		                                                     				attr:'slid',
		                                                     				expression:'=',
		                                                     				value:getFieldValue("slId", {}).slId
		                                                     			}]
                                                	 }
                                                 }} fieldName="instock[0].stId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(info["st"+language], info, ['stId', 'stLcName', 'stEnName'], 'stLcName', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     stId: da.id,
                                                     stLcName: da.localName,
                                                     stEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={getFieldError("instock[0].stId") ?'currency-btn select-from-currency col-md-8 col-lg-8  error-border':'currency-btn select-from-currency col-md-8 col-lg-8 '}							
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400027/*储位*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={beFieldValues.stId}
                                                 refreshMark={beFieldValues.stId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.SlBin',
		                                                     queryParams:[{
		                                                     				attr:'slAid',
		                                                     				expression:'=',
		                                                     				value:beFieldValues.stId
		                                                     			}]
                                                	 }
                                                 }} fieldName="instock[0].slspId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(info["st"+language], info, ['slspId','slspLcName','slspEnName'], 'slspLcName', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     slspId: da.id,
                                                     slspLcName: da.localName,
                                                     slspEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={getFieldError("instock[0].slspId") ?'currency-btn select-from-currency col-md-8 col-lg-8  error-border':'currency-btn select-from-currency col-md-8 col-lg-8 '}						
                                />
						</div>
							</div>
						</div>
           	);
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(SploadcostPlug);
export default ProductForm;
