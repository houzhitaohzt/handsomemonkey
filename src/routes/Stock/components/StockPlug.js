import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';

import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';



// common 
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';
import {I18n} from "../../../lib/i18n";



export class StockPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);

		// init func 
		this.handleAdjustType = this.handleAdjustType.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		




		this.state = {
			adjustType: [{id:1,name:''}], // 币种
		};
		
	}
	getData(value,that){
		this.addSelect = that;
	}

	// 类型调整 ajax 
	handleAdjustType(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.adjustType,
			(response)=>{							
				this.setState({	adjustType:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}	

	// 保存
	onSaveAndClose(){

		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiForm(API_FOODING_ERP,'/stockadjust/adjust',Object.assign({billId:that.props.checkedData.id},value),
					(response)=>{	
							ServiceTips({text:response.message,type:'success'});
							that.props.form.resetFields(); // 清除表单
							that.props.onSaveAndClose(); // 关闭弹框
							that.props.getPage();	// 刷新页面
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})		
	}

	// 取消
	onCancel(){
		this.props.form.resetFields(); // 清除表单
		this.props.onCancel(); // 关闭弹框
	}


	render(){
		let that = this;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		let {checkedData} = this.props;
		let content = <div></div>;

	
		if(this.props.DialogContent == 1){
           content = (
           	<div className="  scroll">
				<div className="row">
					<div className="col-md-6">
						<label className="col-md-3"><span>*</span>{I18n.t(200080/*类型*/)}</label>
						<div className="col-md-9">
							<Select
								placeholder=''
								{...getNFieldProps('type',{
									rules: [{required:true}],
									initialValue: ''								
								})}
								optionLabelProp="children"
								style={{width:300,marginRight:15}}
								className ={getFieldError('type')?'adjustType-btn select-from-adjustType error-border':'adjustType-btn select-from-adjustType'}
								onClick={this.handleAdjustType}
								onSelect={this.changeadjustType}
							>
								{this.state.adjustType.map((o,i)=><Option key={o.id} value={String(o.id)} title={o.name}>{o.name}</Option>)}
							</Select>
						</div>
					</div>
					<div className="col-md-6"> 
						<label className="col-md-3"><span>*</span>{I18n.t(400050/*调整数量*/)}</label>
						<div className="col-md-9">
							<input type="text" 
								{...getFieldProps('adjustQty', {
									rules: [{required:true}],
									initialValue:''
								})} 
								placeholder=""							
								className ={getFieldError('adjustQty')?'text-input error-border':'text-input'}													
								style={{width:300}}
							/>							
						</div>
					</div>					
				</div>				
				<div className="row">
					<div className="col-md-6">
						<label className="col-md-3"><span>*</span>{I18n.t(200910/*原因*/)}</label>
						<div className="col-md-9">
							<textarea
								placeholder=""
								{...getFieldProps('reason', {
									rules: [{required:true}],
									initialValue:''
								})} 
								className ={getFieldError('reason')?'text-input-nowidth error-border':'text-input-nowidth'}													
								style={{resize:'none',height:'65px',width:'750px',verticalAlign:'top'}}>
							</textarea>
						</div>
					</div>					
				</div>
           	</div>
           	);
		}else if(this.props.DialogContent==3){
			content = (
			   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					{/*<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100323*//*业务日期*//*)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>2017-02-17</p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(400008*//*销售单号*//*)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>Alimaju international M Snd Bnd</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{I18n.t(400011*//*销售员*//*)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>Robin</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{I18n.t(600069*//*交通银行*//*)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{i18n.t(200293*//*中国*//*)}</p>
								</div>
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200649*//*交单金额*//*)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>SEA</p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500125*//*货币*//*)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>QINGDAO</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200648*//*交单日期*//*)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>2017-02-17</p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200655*//*信用证号*//*)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>COCHIN</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200656*//*银行交单日*//*)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}></p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200657*//*托收行*//*)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}></p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200658*//*托收行地址*//*)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}></p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200659*//*开证行*//*)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}></p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(200650*//*收汇金额*//*)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}></p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(200660*//*收汇日期*//*)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}></p>
								</div>
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200661*//*快递公司*//*)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}></p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200662*//*快递单号*//*)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}></p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200663*//*单证人员*//*)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}></p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200322*//*运营组织*//*)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}></p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500143*//*集团组织*//*)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{i18n.t(200907*//*弘昊集团有限公司*//*)}</p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100244*//*企业*//*)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{i18n.t(200908*//*上海弘昊化工有限公司*//*)}</p>
							</div>
						</div>
					</div>
					</div>*/}
				</div>
			)
		}else if(this.props.DialogContent==4){
			content = (
				<div className='scroll lose'>
							<span>
								<i>*</i>
								失效原因
							</span>
							<Select
								placeholder={''}
								style={{width: 450}}
								getPopupContainer={this.getPopupContainer}
						    >
							   	<Option value={'111111'}>11</Option>
							</Select>
				</div>
			)
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} 
						showSaveClose={this.props.showSaveClose}
						buttonLeft = {this.props.buttonLeft} 
						onSaveAndClose={this.onSaveAndClose}
					 	onCancel={this.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(StockPlug);
export default ProductForm;
