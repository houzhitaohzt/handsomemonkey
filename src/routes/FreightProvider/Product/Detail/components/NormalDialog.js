import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option,ConstMiniSelect } from '../../../../../components/Select';
import Radio from '../../../../../components/Radio';
import AddSelect from '../../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../../components/Dialog/Confirm';
import Calendar from  '../../../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
import Input from '../../../../../components/FormValidating/FormValidating';
import Checkbox from '../../../../../components/CheckBox';
import ProductSelect from '../../../../../components/FindGridSelect';
export class Productplug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.getData = this.getData.bind(this);
		this.productClick = this.productClick.bind(this);
		 this.data ={};
		this.state ={
			productArray:[]
		}
	}
	getData(value,that){
		this.addSelect = that;
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
		let that = this;
		const {onCancel} = this.props;
		if(onCancel){
            onCancel();
            that.props.form.resetFields();
        }
	}
	componentDidMount(){
		var that = this;
		that.productClick();
	}
	productClick(e){
		var that = this;
		apiGet(API_FOODING_DS,'/material/search',{keyword:''},
			(response)=>{
				that.setState({
					productArray:response.data
				})
		},(error)=>{

		});
	}
	 needQtyChange = e => {
        let value = e.target.value;
        let fob = this.props.form.getFieldValue('fobSalePrc');
        if(fob && value && !isNaN(fob) && !isNaN(value)){
            this.props.form.setFieldsValue({agg: (parseFloat(fob) * parseFloat(value)).toFixed(6)});
        } else {
            this.props.form.setFieldsValue({agg: ''});
        }
    };
    // inputchange(){
    // 	alert('只能填写整数')
    // }
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps, getFieldErrorStyle } = this.props.form;
		let {data,initData} = this.props;
        initData.beMtl = initData.beMtl || {};
		const {enterpris,material,operContactor,saleContactor} = initData.beMtl;
		let  vendorContacts = initData.vendorContacts || [];
		initData.beMtl.enterpris = initData.beMtl.enterpris || {};
		initData.beMtl.material = initData.beMtl.material || {};
		initData.beMtl.operContactor = initData.beMtl.operContactor || {};
		initData.beMtl.saleContactor = initData.beMtl.saleContactor || {};
		this.data = Object.assign({},initData.beMtl);
		let content = <div></div>;
		getFieldProps('dataTyId', {
		      initialValue: 70,
		 });
		getFieldProps('sourceId', {
		      initialValue: initData.sourceId,
		 });
		if(data.name.id== 'detail-normal'){
			   content = (
			   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
           			<div className={'  girdlayout'}>
           									<div className={'row'}>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100379/*产品*/)}</label>
													<ProductSelect 
														form={this.props.form}
														className={'col-xs-8 col-md-8 text-input-nowidth'}
														value={initData.beMtl.material?{id:initData.beMtl.material.id,localName:initData.beMtl.material.localName,name:initData.beMtl.material.name}:undefined}
														url='/material/search'
														width={'233%'}
														titleClass={'col-xs-8 col-md-8'}
													/>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-xs-4 col-md-4'}>{i18n.t(200976/*供应商产品编码*/)}</label>
										
													<input type="text" className='col-xs-8 col-md-8 text-input-nowidth'
															{...getFieldProps('beMtlCode',{
																		initialValue:initData.beMtl?initData.beMtl.beMtlCode :''
															})}
													/>
												</div>
											</div>
											<div className={'row'}>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200977/*供方销售员*/)}</label>
													<Select
															animation='slide-up'
															onClick={this.onClick}
															placeholder=''
															className ={ getFieldError("saleContactorId") ?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
															optionLabelProp="children"
															{...getNFieldProps('saleContactorId',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue:{s_label:initData.beMtl.saleContactor.localName,saleContactorId:initData.beMtl.saleContactor.id}
															})}
															>
															{
																vendorContacts.map((e,i)=>{
																	return  <Option value={e.id+""} title={e.name} key={i}>{e.localName}</Option>
																})
															}
													</Select>
												</div>
												<div  className="form-group col-md-6 col-lg-6">
													<label  className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(400081/*产品操作员*/)}</label>
													<Select
															animation='slide-up'
															onClick={this.onClick}
															placeholder=''
															className ={ getFieldError("operContactorId") ?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
															optionLabelProp="children"
															{...getNFieldProps('operContactorId',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue:{s_label:initData.beMtl.operContactor.localName,operContactorId:initData.beMtl.operContactor.id}
															})}
															>
															{
																vendorContacts.map((e,i)=>{
																	return  <Option value={e.id+""} title={e.name} key={i}>{e.localName}</Option>
																})
															}
													</Select>
												</div>
											</div>
											<div className={'row'}>
												<div  className="form-group col-md-6 col-lg-6">
													<label className="col-md-4 col-lg-4"><span>*</span>保质期天数(天)</label>
													<input type="text" placeholder={i18n.t(200978/*请填写整数*/)} className={getFieldErrorStyle('assurDay','error-border', 'col-xs-8 col-md-8 text-input-nowidth')}
						                                   {...getFieldProps('assurDay', {
						                                       validateFirst: true,
						                                       rules: [{required: true, pattern: xt.pattern.positiveInteger}],
						                                       initialValue:initData.beMtl.assurDay || '',
						                                       
						                                   })}
						                                  


						                            />
												</div>
												<div  className="form-group col-md-6 col-lg-6">
													<label className="col-md-4 col-lg-4"><span>*</span>{i18n.t(400077/*境内货源地*/)}</label>
													<Input 
															form={this.props.form} 
															obj={{name:'domestic',type:'text',
															classn:'col-xs-8 col-md-8 text-input-nowidth',
															initialValue:initData.beMtl.domestic}}  
													/>
												</div>
											</div>
           			</div>
           		</div>
           	)
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
const ProductForm =createForm()(Productplug);
export default ProductForm;
