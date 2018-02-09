import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
import Checkbox from '../../../../components/CheckBox';
import {I18n} from '../../../../lib/i18n';
// common
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, {Option,ConstMiniSelect} from '../../../../components/Select'; // 下拉
import xt from '../../../../common/xt'; // 下拉
// ajax
import ProductSelect from "../../../../components/FindGridSelect";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../../services/apiCall';
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.productChange = this.productChange.bind(this);
	    this.productSelect = this.productSelect.bind(this);
		this.state=this.initState();
	}
	 initState() {
        return {
        	productArray:[],
            billDtlId: null,
            productData: {},
        }
    }
	productSelect(e,item){
		let that = this;
		apiGet(API_FOODING_DS,'/material/getProductInforErp',{sourceId:this.props.otherData.getOne.salBeId,id:e.id,mtlType:'mtl'},(response)=>{
			let obj = Object.assign({},this.state.productData,response.data,{chgHsCode:response.data.hsCode});
			this.props.form.setFieldsValue({changeMtlName:e.enName});
			this.setState({productData:obj});
		},(error)=>{

		});
	}
	productChange(e){
		let that = this;
		apiGet(API_FOODING_DS,'/beMtl/getMtlList',{sourceId:this.props.otherData.getOne.salBeId},(response)=>{
			this.setState({
				productArray:response.data||[]
			});
		},(error)=>{

		});
	}

	componentWillReceiveProps (props){
		let {data} = props;
        let {billDtlId} = this.state;
        let record = data.number === 1 ? null : data.record;
        if (record && record.billDtlId !== billDtlId) {
            this.getEditOne(record.billDtlId);
        }
	}

	componentDidMount() {
        let {data} = this.props;
        if (data.number !== 1 && data.record) {
            this.getEditOne(data.record.billDtlId);
        }
    }

    getEditOne = billDtlId => {
        if (!billDtlId) return;
        this.setState({billDtlId});
        apiGet(API_FOODING_ERP, '/insale/mtl/getOne', {id: billDtlId},
            response => {
                this.setState({businessOne: response.data, productData: response.data});
            }, error => {
                errorTips(error.message);
            });
    };

	onSaveAndClose(isAdd){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				if(this.props.data.number == 0){
					value = Object.assign({},this.state.productData,this.state.businessOne,value,{billId:this.props.otherData.getOne.billId});
				}else{
					value = Object.assign({},this.state.productData,value,{billId:this.props.otherData.getOne.billId})
				}
				apiPost(API_FOODING_ERP,'/insale/mtl/save',value,(response)=>{
						this.props.onSaveAndClose();
						this.props.form.resetFields();
						this.props.onCancel();
						ServiceTips({text:response.message,type:'sucess'});
						this.setState({...this.initState()});
				},(error)=>{
						ServiceTips({text:error.message,type:'error'});
				})
			}

    	});
	}
	onCancel(){
		this.props.form.resetFields();
		this.setState({...this.initState()}, this.props.onCancel);
	}
	render(){
		let that = this;
		let {data} = this.props;
		let initData = this.state.productData;
		const { getNFieldProps, getFieldProps, getFieldError,getFieldValue} = this.props.form;
		let beField = getNFieldProps('mtlId',{
										rules: [{required:true}],
										initialValue:initData["mtl"+language]?{s_label:initData["mtl"+language],mtlId:initData.mtlId,mtlLcName:initData.mtlLcName,mtlEnName:initData.mtlEnName,basSpeci:initData.basSpeci}:undefined
									 });
		let beFieldValue = getFieldValue("mtlId") || {};
		let content = <div></div>
		//订单产品
			if(data.number == 0 || data.number == 1){
				content =(
						<div className={'  girdlayout'} style={{height:"344px"}}>
						  	<div className={'row'}>
								                <div className="form-group col-xs-4 col-md-4">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100379/*产品*/)}</label>
													<ProductSelect
														ref='productSelect'
														form={this.props.form}
														width={'379%'}
														isSearch={false}
														value ={initData.mtlId?{id:initData.mtlId,localName:initData.mtlLcName,name:initData.mtlEnName}:undefined}
														onSelect ={this.productSelect}
														titleClass={getFieldError('mtlId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
														url='/beMtl/getMtlList'
														params={{sourceId:this.props.otherData.getOne.salBeId}}
													/>
												</div>
												<div className="form-group col-xs-4 col-md-4">
													<label className={'col-xs-4 col-md-4'}>{i18n.t(100382/*产品规格*/)}</label>
													<input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
														placeholder=""
														{...getFieldProps('basSpeci',{
															initialValue:initData.basSpeci?initData.basSpeci:''
														})}
														disabled
													/>
												</div>
												<div className="form-group col-xs-4 col-md-4">
													<label className={'col-xs-4 col-md-4'}>HSCODE</label>
													<input type='text' className={getFieldError("hsCode")?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'}
														placeholder=""
														{...getFieldProps('hsCode',{
															validateFirst:true,
															rules:[{required:true}],
															valuedateTrigger:'onBlur',
															initialValue:initData.hsCode?initData.hsCode:''
														})}  disabled/>
												</div>
							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-4 col-md-4">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200846/*销售数量*/)}</label>
													<input type='text' className={getFieldError("salQty")?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'}
														placeholder=""
														{...getFieldProps('salQty',{
															validateFirst:true,
															rules:[{required:true,}],
															valuedateTrigger:'onBlur',
															initialValue:initData&&('salQty' in initData)?initData.salQty:''
														})} />
												</div>
												<div className="form-group col-xs-4 col-md-4">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(400035/*产品单位*/)}</label>
													<ConstMiniSelect form={this.props.form}
															isRequest={Boolean( beFieldValue.mtlId)}
			                                                 refreshMark={beFieldValue.mtlId}
			                                                 pbj={{
			                                                     apiType: apiGet, host: API_FOODING_DS, uri:'/measum/getList',
			                                                     params: {sourceId: beFieldValue.mtlId}
			                                                 }} fieldName="uomId"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["uom"+language], initData, ['uomId', 'uomLcName', 'uomEnName'], "uom"+language, this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     uomId: da.unitofmea.id,
			                                                     uomLcName: da.unitofmea.localName,
			                                                     uomEnName: da.unitofmea.name,
			                                                     s_label: da.unitofmea.localName
			                                                 }}>{da.unitofmea.localName}</Option>} reles ={true}
			                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
			                                		/>
												</div>
												<div className="form-group col-xs-4 col-md-4">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(500067/*包装*/)}</label>
													<ConstMiniSelect form={this.props.form}
															isRequest={Boolean( beFieldValue.mtlId)}
			                                                 refreshMark={beFieldValue.mtlId}
			                                                 pbj={{
			                                                     apiType: apiGet, host: API_FOODING_DS, uri:'/pack/getList',
			                                                     params: {sourceId: beFieldValue.mtlId}
			                                                 }} fieldName="packagId"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["packag"+language], initData, ['packagId', 'packagLcName', 'packagEnName'],"packag"+language, this.props.form)
			                                                }
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     packagId: da.packaging.id,
			                                                     packagLcName: da.packaging.localName,
			                                                     packagEnName: da.packaging.name,
			                                                     s_label: da.packaging.localName
			                                                 }}>{da.packaging.localName}</Option>} reles ={true}
			                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
			                                		/>
												</div>
							</div>
							<div className={'row'}>
												<div className="form-group col-xs-4 col-md-4">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(200847/*含税单价*/)}</label>
													<input type='text' className={getFieldError('salTaxPrc')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'}
														placeholder=""

														{...getFieldProps('salTaxPrc',{
															validateFirst:true,
															rules:[{required:true,}],
															valuedateTrigger:'onBlur',
															initialValue:initData.salTaxPrc?initData.salTaxPrc:''
														})} />
												</div>
												<div className="form-group col-xs-4 col-md-4">
													<label className={'col-xs-4 col-md-4'}>{i18n.t(200246/*金额*/)}</label>
													<input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}  disabled
													 value={getFieldValue("salTaxPrc")&&getFieldValue("salQty")&&!isNaN(getFieldValue("salTaxPrc"))&&!isNaN(getFieldValue("salQty"))?parseFloat(getFieldValue("salTaxPrc"))*parseFloat(getFieldValue("salQty")):''} />
												</div>
												<div className="form-group col-xs-4 col-md-4">
													<label className={'col-xs-4 col-md-4'}>{i18n.t(500068/*托盘*/)}</label>
													<ConstMiniSelect form={this.props.form}
			                                                 pbj={{
			                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/salvrType/getList',
			                                                     params: {}
			                                                 }} fieldName="salvrId"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["salvr"+language], initData, ['salvrId', 'salvrLcName','salvrEnName'],"salvr"+language, this.props.form)
			                                                 }
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     salvrId: da.id,
			                                                     salvrLcName:da.localName,
			                                                     salvrEnName:da.name,
			                                                     s_label: da.localName
			                                                 }}>{da.name}</Option>}
			                                                 className ={getFieldError('profTyp')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
			                                		/>
												</div>
							</div>
						</div>)
			}
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
					<div style={{height:"344px"}} className="scroll">
						{content}
					</div>
			</FormWrapper>);
	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;
