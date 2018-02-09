import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, {Option,ConstMiniSelect} from '../../../../components/Select';
import DataTime from  '../../../../components/Calendar/Calendar';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import Calendar from  '../../../../components/Calendar/Calendar';
import Input from '../../../../components/FormValidating/FormValidating';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
import xt from './../../../../common/xt';
import ProductSelect from '../../../../components/FindGridSelect';
import {I18n} from '../../../../lib/i18n';
export class AirPricePlug extends Component{
	constructor(props){
		super(props);
		this.state= this.initState(props);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.productClick=this.productClick.bind(this);
		this.danweiClick=this.danweiClick.bind(this);
		this.pinpaiClick=this.pinpaiClick.bind(this);
		this.bizhongClick=this.bizhongClick.bind(this);
		this.gongyingshangClick=this.gongyingshangClick.bind(this);
		this.onSelect=this.onSelect.bind(this);
	}
	initState = (props = {}) =>{
		return {
			productArray:[],
			pinpaiArray:[],
			danweiArray:[],
			gongyingshangArray:[],
			bizhongArray:[],
			data:{},
			getOne: props.getOne || {}
		}
	};
	onSelect(row){
		var that = this;
		apiGet(API_FOODING_DS, '/material/getProductInforErp', {id:row.id,mtlType:'pmtl'}, response => {
        this.setState({
				getOne: Object.assign({},this.state.getOne,response.data)
			});
		},(error)=>{

		})

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
	danweiClick(){
		var that = this;
		let getOne=this.state.getOne;
		apiGet(API_FOODING_DS,'/measum/getList',{sourceId:getOne.mtlId},
			(response)=>{
				that.setState({
					danweiArray:response.data
				})
		},(error)=>{

		});
	}
	pinpaiClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Brand'},
		(response)=>{
				that.setState({
					pinpaiArray:response.data
				})
		},(error)=>{

		});
	}
	gongyingshangClick(){
		var that = this;
		let getOne=this.state.getOne;
		apiGet(API_FOODING_DS,'/beMtl/byMtl/getList',{mtlId:getOne.mtlId,dataTyId:70},response => {
				let array = response.data.map((e,i) => {
					return {id:e.enterpris.id,localName:e.enterpris.localName,name:e.enterpris.name,key:i}
				})
				that.setState({
					gongyingshangArray:array || [],
					noId:false
				})
			},error => {
				ServiceTips({text:error.message,type:'error'});
			})

	}
	bizhongClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Curren'},
		(response)=>{
				that.setState({
					bizhongArray:response.data
				})
		},(error)=>{

		});
	}
	onSaveAndClose(isAdd){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				if(this.props.data.number== 0){
				   value = Object.assign({},this.props.getOne,value);
				}
				this.setState({...this.initState()});
	      		this.props.onSaveAndClose(value);
	      		this.props.form.resetFields();
			}
	      	
    	});
	}
	onCancel(){
		this.setState({...this.initState()});
		this.props.form.resetFields();
		this.props.onCancel();
	}
	mingxilaqu(){
		var that = this;
		apiGet(API_FOODING_DS,'/noticestock/mtl/getOne',{sourceId:this.props.sourceId,dataTyId:70},(response)=>{
			that.setState({
				info:response.data
			});
		},(errors)=>{

		})
	}
	componentDidMount(){
		var that = this;
		let object=Object.assign({},{sourceId:this.props.sourceId,dataTyId:70});
		apiGet(API_FOODING_DS,'/beMtl/getInit',{sourceId:this.props.sourceId,dataTyId:70},(response)=>{
			that.setState({
				info:response.data
			});
		},(errors)=>{

		})
	}
	componentWillReceiveProps(props){
		if((props.getOne || {}).billDtlId !== (this.state.getOne || {}).billDtlId){
			
			this.setState({getOne: props.getOne||{}});
		}
		
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError ,getNFieldProps ,getFieldValue} = this.props.form;
		let {getTermModes,form} = this.props;
		let {getOne}= this.state;
		let otherData = this.props.otherData ||{};
		getFieldProps('billType', {
		      initialValue: '223',
	    });
		let content = <div></div>;
		content =(
						<div className={'  girdlayout'} style={{height:"344px"}}>
						  	<div className={'row'}>
								                <div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100379/*产品*/)}</label>
													<ProductSelect 
														form={this.props.form}
														className={'col-xs-9 col-md-9 text-input-nowidth'}
														value={getOne["mtl"+language]?{s_label:getOne["mtl"+language], mtlId:getOne.mtlId, mtlLcName:getOne.mtlLcName, mtlEnName:getOne.mtlEnName}:undefined}
														onSelect = {this.onSelect}
														url='/material/search'
														width={'233%'}
														titleClass={'col-xs-9 col-md-9'}
													/>	
														
												</div>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100382/*产品规格*/)}</label>
													<input  
											   				 type="text"
																{...getFieldProps('basSpeci',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue: String(getOne.basSpeci || '')})}
																className={getFieldError("basSpeci") ?'col-xs-9 col-md-9 text-input-nowidth error-border':'col-xs-9 col-md-9 text-input-nowidth'} 
																disabled = {true}
													/>
							
												</div>
							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(400035/*产品单位*/)}</label>
													<ConstMiniSelect form={this.props.form} 
	                                                      refreshMark={getFieldValue('mtlId', {}).mtlId} reles={true}
	                                                     pbj={{
	                                                         apiType: apiGet, host: API_FOODING_DS, uri: '/measum/getList',
	                                                        params: {sourceId: getFieldValue('mtlId', {}).mtlId}
	                                                     }} fieldName="uomId"
	                                                     optionValue={da => <Option key={da.id} objValue={{
	                                                         uomId: da.unitofmea.id,
	                                                         uomLcName: da.unitofmea.localName,
	                                                         uomEnName: da.unitofmea.name,
	                                                         s_label: da.unitofmea.localName
	                                                     }}>{da.unitofmea.localName}</Option>}
	                                                     initialValue={xt.initSelectValue(getOne['uom'+language], getOne, ['uomId', 'uomLcName', 'uomEnName'], 'uom'+language, form) }
                                    					 className={'col-md-9 col-lg-9 currency-btn select-from-currency'}
                                    				/>
												</div>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}>{I18n.t(400012/*品牌*/)}</label>
													 
				                                    <ConstMiniSelect form={this.props.form}
															isRequest={Boolean(getFieldValue("mtlId",getOne).mtlId)}
                                                 			refreshMark={getFieldValue("mtlId", getOne).mtlId}
														pbj={{
	                                                         apiType: apiGet, host: API_FOODING_DS, uri: '/manufty/getBrandsVndMtl',
	                                                          params: {mtlId:getFieldValue("mtlId",getOne).mtlId}
	                                                     }} fieldName="brandId"
	                                                     optionValue={da => <Option key={da.id} objValue={{
							                                 brandId: da.id,
							                                 brandLcName: da.localName,
							                                 brandEnName: da.name,
							                                 s_label: da.localName
	                                                     }}>{da.localName}</Option>}
	                                                      className ={'col-md-9 col-lg-9 currency-btn select-from-currency'}
	                                                      allowClear
	                                                     initialValue={xt.initSelectValue(getOne['brand'+language] && getFieldValue("mtlId",getOne).mtlId== getOne.mtlId, getOne, ['brandId', 'brandLcName', 'brandEnName'], 'brand'+language, form) }
                                    				/>
												</div>

							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(500163/*出库数量*/)}</label>
													<input  
											   				 type="text"
																{...getFieldProps('qty',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue: getOne.qty ? String(getOne.qty) : ''})}
																className={getFieldError("qty") ?'col-xs-9 col-md-9 text-input-nowidth error-border':'col-xs-9 col-md-9 text-input-nowidth'} 
													/>
												</div>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}>{I18n.t(100312/*供应商*/)}</label>
													<ConstMiniSelect form={this.props.form}
													isRequest={Boolean(getFieldValue("mtlId",getOne).mtlId || getOne.mtlId)}
                                                 			refreshMark={getFieldValue("mtlId", getOne).mtlId}
														pbj={{
	                                                          apiType: apiGet, host: API_FOODING_DS, uri: '/beMtl/byMtl/getList',
	                                                          params: {mtlId:getFieldValue("mtlId",getOne).mtlId,dataTyId:70}
	                                                     }} fieldName="vndBeId"
	                                                     optionValue={da => <Option key={da.enterpris.id} objValue={{
	                                                         vndBeId: da.enterpris.id,
	                                                         vndBeLcName: da.enterpris.localName,
	                                                         vndBeEnName: da.enterpris.name,
	                                                         s_label: da.enterpris.localName
	                                                     }}>{da.enterpris.localName}</Option>}
	                                                      className ={'col-md-9 col-lg-9 currency-btn select-from-currency'}
	                                                      allowClear
	                                                     initialValue={xt.initSelectValue(getOne['vndBe'+language] && getFieldValue("mtlId",getOne).mtlId== getOne.mtlId, getOne, ['vndBeId', 'vndBeLcName', 'vndBeEnName'], 'vndBe'+language, form) }
                                    				/>
												</div>
							</div>
							<div className={'row'}>
		
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}>{I18n.t(500146/*源单类型*/)}</label>
													<Select
														animation='slide-up'
														placeholder=''
														className ={'col-md-9 col-lg-9 currency-btn select-from-currency'}
														choiceTransitionName="rc-select-selection__choice-zoom"
														optionLabelProp="children"
														{...getNFieldProps('sourceType',{
															initialValue:getOne.sourceType?{s_label:getOne.sourceTypeName, sourceType:getOne.sourceType, sourceTypeName:getOne.sourceTypeName}:undefined,

														})}
														disabled
														>
													</Select>
												</div>
							</div>
						</div>);
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} 
					onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(AirPricePlug);
export default ProductForm;