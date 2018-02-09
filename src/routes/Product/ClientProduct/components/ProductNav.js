import i18n from './../../../../lib/i18n';
import React, {Component, PorpTypes} from "react"
//引入select插件
import Select, {ConstMiniSelect, Option} from '../../../../components/Select';
//引入表格
import Calendar from '../../../../components/Calendar/Calendar';
import {createForm, FormWrapper} from '../../../../components/Form';
import {API_FOODING_DS, apiGet, apiPost} from '../../../../services/apiCall';
import ProductSelect from '../../../../components/FindGridSelect';
import xt from '../../../../common/xt';
import fieldsFormat from '../../../../common/FieldsFormat';
import {I18n} from "../../../../lib/i18n";

export class ProductNav extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.state={
			productArray:[],
			profitTypeArray:[],
			jingzhengArray:[],
			baozhaungArray:[],
			zhengshuArray:[],
			specTxt:this.props.getOne.material?this.props.getOne.material.specTxt:''
		}
		this.productClick = this.productClick.bind(this);
		this.onSearch = this.onSearch.bind(this);
		this.onSelect = this.onSelect.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onChange = this.onChange.bind(this);
	}
	onChange(e){
		
			this.props.form.setFieldsValue({purchaseLawId:undefined});
			this.props.form.setFieldsValue({purchaseDate:undefined});
		
	}
	onSearch(e){

	}
	onSaveAndClose(){
		this.props.form.validateFields((error, value) => {
			if(error|| !value.mtlId){
				console.log(error, value);
			}else{
	      		this.props.onSaveAndClose(value);
	      		this.props.form.resetFields();
			}

    	});
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	onSelect(row){
		var that = this;
		that.setState({
			specTxt:row.specTxt?row.specTxt:''
		})
	}
	componentDidMount(){
		var that = this;
		that.productClick();
		if(this.props.getOne.material){
			this.setState({
				specTxt:this.props.getOne.material.specTxt
			});
		}

		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.ProfitType'},
			(response)=>{
				that.setState({
					profitTypeArray:response.data
				})
		},(error)=>{

		});
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
	render(){
		let that = this;
		const { getFieldProps,getFieldValue,getFieldError,getNFieldProps} = this.props.form;
		let {getOne}=this.props;
		getOne.unitofmea = getOne.unitofmea ||{};
		getOne.purchaseType = getOne.purchaseType ||{};
		getOne.purchaseLaw =getOne.purchaseLaw||{};
		getOne.material = getOne.material || {};
		let content = <div></div>;
								getFieldProps('dataTyId',{
									initialValue:50,
								});
		let mtl = getFieldValue("mtlId",{}).mtlId||getOne.material.id;
		if(this.props.DialogContent == 1){
			getFieldProps('sourceId',{
									initialValue:this.props.sourceId,
			});
            getFieldProps('profitTypeId',{
                initialValue:10,
            });
           content = <div className="addnormal scroll" >
											<div className="girdlayout">
												<div className="row">
												 	<div className='form-group col-md-6'>
														<label className={'col-md-4'}><span>*</span>{i18n.t(100379/*产品*/)}</label>
														<ProductSelect
															form={this.props.form}
															value={getOne.material?{mtlId:getOne.material.id,s_label:getOne.material.localName}:undefined}
															onSelect = {this.onSelect}
															url='/material/search'
															titleClass={'col-md-8 '}
														/>
													</div>
													<div className='form-group col-md-6'>
														<label className={'col-md-4'}>{i18n.t(100382/*产品规格*/)}</label>
														<input type="text" value={this.state.specTxt?this.state.specTxt:''} className={"text-input-nowidth col-md-8"} readOnly/>
													</div>
												</div>
												<div className='row'>
													<div className='form-group col-md-6'>
														<label className={'col-md-4'}>{i18n.t(100607/*客户产品编码*/)}</label>
														<input type="text" {...getFieldProps('beMtlCode', {
                                                            normalize: fieldsFormat.beMtlCode,
							                                initialValue:getOne.beMtlCode?getOne.beMtlCode:''
							                            })}  className="text-input-nowidth col-md-8" />
													</div>
													<div className='form-group col-md-6'>
														<label className={'col-xs-4 col-md-4'}>{i18n.t(400012/*品牌*/)}</label>
														<ConstMiniSelect form={this.props.form}
																													isRequest={Boolean(mtl)}
																													refreshMark={mtl}
					                                                 pbj={{
					                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/brand/getListByMtlId',
					                                                     params: {mtlId:mtl,dataTyId:70}
					                                                 }} fieldName="brandId"
					                                                 initValueOptions={[]}
					                                                 initialValue={getOne.brand?{s_label:getOne.brand.name,brandId:getOne.brand.id}:undefined}
					                                                 optionValue={(da, di) => <Option key={di} objValue={{
					                                                     brandId: da.id,
					                                                     s_label: da.localName
					                                                 }}>{da.localName}</Option>}
					                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
					                                />
													</div>
												</div>
												<div className='row'>
													<div className='form-group col-md-6'>
															<label className={'col-md-4'}><span>*</span>{I18n.t(100420/*利润率%*/)}</label>
															<input type="text" {...getFieldProps('profit', {
																validateFirst: true,
																								rules: [{required: true,},{pattern: xt.pattern.positiveZero}],
																								validateTrigger: 'onBlur',
																								initialValue:getOne.profit?getOne.profit:''
															})} className={getFieldError("profit")?"text-input-nowidth  col-md-8 error-border":'text-input-nowidth  col-md-8'} />
													</div>
													<div className='form-group col-md-6'>
														<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100319/*采购数量*/)}</label>
														<input type="text" {...getFieldProps('quantity', {
																validateFirst: true,
								                                rules: [
								                                    {
								                                    required: true,
								                                    },{pattern: xt.pattern.positiveNonZero}
								                                ],
								                                validateTrigger: 'onBlur',
								                                initialValue:getOne.quantity?getOne.quantity:''
								                            })} className={getFieldError("quantity")?"text-input-nowidth  col-md-3 error-border":'text-input-nowidth  col-md-3'} />
														<label className={'col-md-1'}></label>
														<ConstMiniSelect form={this.props.form}
																 isRequest={Boolean( getFieldValue("mtlId",getOne).mtlId)}
			                                                 	 refreshMark={getFieldValue("mtlId",getOne).mtlId}
			                                                 	 initRequest
				                                                 pbj={{
				                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
				                                                     params: {obj:'com.fooding.fc.ds.entity.Measum',attrs:["id","unitofmea"],
				                                                     		queryParams:[{
					                                                 		 "attr":"sourceId",
					                                                 		 "expression":"=",
					                                                 		 "value":getFieldValue("mtlId",getOne).mtlId
					                                                 		}]
				                                 					 }
				                                                 }} fieldName="unitId"
				                                                 initValueOptions={[]}
				                                                 initialValue={
				                                                 	xt.initSelectValue(getOne.unitofmea.id, {unitId:getOne.unitofmea.id, ...getOne.unitofmea}, ['unitId'], "localName", this.props.form)}
				                                                 optionValue={(da, di) => <Option key={di} objValue={{
				                                                     unitId: da.unitofmea.id,
				                                                     s_label: da.unitofmea.localName
				                                                 }}>{da.unitofmea.localName}</Option>} reles ={true}
				                                                 className ={'currency-btn select-from-currency col-md-4 '}
				                                		/>
													</div>
											   </div>
											   <div className='row'>

													 <div className='form-group col-md-6'>
 														<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200113/*采购类型*/)}</label>
 				                                		<ConstMiniSelect form={this.props.form}
 				                                                 pbj={{
 				                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
 				                                                     params: {obj: 'com.fooding.fc.enumeration.CycleType'}
 				                                                 }} fieldName="purchaseTypeId"
 				                                                 initValueOptions={[]}
 				                                                 initialValue={
 				                                                 	xt.initSelectValue(getOne.purchaseTypeId, {purchaseTypeId:getOne.purchaseType.id, ...getOne.purchaseType}, ['purchaseTypeId'], 'name', this.props.form)
 				                                                 }
 				                                                 optionValue={(da, di) => <Option key={di} objValue={{
 				                                                     purchaseTypeId: da.id,
 				                                                     s_label: da.name
 				                                                 }}>{da.name}</Option>} reles ={true}
 				                                                 onChange = {this.onChange}
 				                                                 className ={'currency-btn select-from-currency col-md-8 '}
 				                                		/>
 													</div>
                                                   <div className='form-group col-md-6'>
                                                       <label className={'col-xs-4 col-md-4'}><span className={getFieldValue("purchaseTypeId",getOne).purchaseTypeId == 10?'':'none'}>*</span>{i18n.t(200114/*采购规律*/)}</label>
                                                       <ConstMiniSelect form={this.props.form}
                                                                        pbj={{
                                                                            apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                                            params: {obj: 'com.fooding.fc.enumeration.CycleRule'}
                                                                        }} fieldName="purchaseLawId"
                                                                        initValueOptions={[]}
                                                                        initialValue={
                                                                            xt.initSelectValue(getOne.purchaseLaw.id &&getFieldValue("purchaseTypeId",getOne).purchaseTypeId == 10, {purchaseLawId:getOne.purchaseLaw.id, ...getOne.purchaseLaw}, ['purchaseLawId'], 'name', this.props.form)
                                                                        }
                                                                        optionValue={(da, di) => <Option key={di} objValue={{
                                                                            purchaseLawId: da.id,
                                                                            s_label: da.name
                                                                        }}>{da.name}</Option>}
                                                                        disabled ={getFieldValue("purchaseTypeId",getOne).purchaseTypeId == 20}
                                                                        reles={getFieldValue("purchaseTypeId",getOne).purchaseTypeId == 10}
                                                                        className ={'currency-btn select-from-currency col-md-8 '}
                                                       />
                                                   </div>
											   </div>
											   <div className='row'>
													 <div className='form-group col-md-6'>
														 <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200115/*下次采购时间*/)}</label>
														 <div className={'col-md-8 col-lg-8 datetime'}>
														 <Calendar
															 showTime={false}
															 isShowIcon={true}
															 width={'100%'}
															 name={'purchaseDate'}
															 form={this.props.form}
															 value ={new Date(getOne.purchaseDate).Format('yyyy-MM-dd')}
															 // disabled={getFieldValue("purchaseTypeId",getOne).purchaseTypeId == 10}
															 //validate={getFieldValue("purchaseTypeId",getOne).purchaseTypeId == 20}
                                                             validate={true}
														 />
													 </div>
													 </div>
                                                   <div className='form-group col-md-6'>
                                                       <label className={'col-xs-4 col-md-4'}>{i18n.t(200922/*买方业务员*/)}</label>
                                                       <ConstMiniSelect form={this.props.form}
                                                                        pbj={{
                                                                            apiType: apiGet, host: API_FOODING_DS, uri: '/entContact/getByBeIdDataTyId',
                                                                            params: {beId: this.props.sourceId,dataTyId:100}
                                                                        }} fieldName="saleContactorId"
                                                                        initValueOptions={[]}
                                                                        initialValue={getOne.saleContactor?{s_label:getOne.saleContactor.localName,saleContactorId:getOne.saleContactor.id}:undefined}
                                                                        optionValue={(da, di) => <Option key={di} objValue={{
                                                                            saleContactorId: da.id,
                                                                            s_label: da.localName
                                                                        }}>{da.localName}</Option>}
                                                                        className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                                       />
                                                   </div>
											   </div>
												 <div className='row'>
                                                     <div className='form-group col-md-6'>
                                                         <label className={'col-xs-4 col-md-4'}>{i18n.t(400081/*产品操作员*/)}</label>
                                                         <ConstMiniSelect form={this.props.form}
                                                                          pbj={{
                                                                              apiType: apiGet, host: API_FOODING_DS, uri: '/entContact/getByBeIdDataTyId',
                                                                              params: {beId: this.props.sourceId,dataTyId:100}
                                                                          }} fieldName="operContactorId"
                                                                          initValueOptions={[]}
                                                                          initialValue={getOne.operContactor?{s_label:getOne.operContactor.localName,operContactorId:getOne.operContactor.id}:undefined}
                                                                          optionValue={(da, di) => <Option key={di} objValue={{
                                                                              operContactorId: da.id,
                                                                              s_label: da.localName
                                                                          }}>{da.localName}</Option>}
                                                                          className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                                         />
                                                     </div>

												 </div>
											</div>
								   </div>
		}
		return (
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						{content}
					</FormWrapper>
		)
	}
}
const ProductForm =createForm()(ProductNav);
export default ProductForm;
