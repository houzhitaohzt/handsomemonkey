import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
import Select, {Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select';
import Checkbox from '../../../../components/CheckBox';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP,API_FOODING_ES} from '../../../../services/apiCall';
import xt from '../../../../common/xt'; // 下拉
import ServiceTips from '../../../../components/ServiceTips'; // 提示
export class FclPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
	    this.clientClick = this.clientClick.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.state={
			getOnedata:{},
			clientArray:[],
			xiaoshouArray:[]
		}
		this.getOne=this.getOne.bind(this);
	}
	onSaveAndClose(){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				value =Object.assign({},this.props.checkedData.record,value,{billId:this.props.getOne.billId,shippingOrderNo:this.props.getOne.no,
					ccId:this.props.getOne.ccId});
				apiPost(API_FOODING_ERP,'/shipping/card/save',value,(response)=>{
					ServiceTips({text:response.message,type:'success'});
					this.props.onSaveAndClose();
				},(error)=>{
					ServiceTips({text:error.message,type:'error'});
				});
			}

    	});
	}
	getData(value,that){
		this.addSelect = that;
	}
	getOne(id){
		apiGet(API_FOODING_ERP,'/shipping/card/getOne',{id:id},(response)=>{
			this.setState({
				getOnedata:response.data ||{}
			})
		},(error)=>{

		})
	}
	componentDidMount(){
		let that = this;
		apiGet(API_FOODING_ERP,'/shipping/getMtls',{billId:this.props.getOne.billId},
			(response)=>{
				this.setState({
					xiaoshouArray:response.data
				});
			},(error)=>{

		});
		if(this.props.checkedData.record &&
			this.props.checkedData.record.billDtlId){
			this.getOne(this.props.checkedData.record.billDtlId);
		}
	}
	clientClick(data){
		if (data.trim() === '') return;
        apiPost(API_FOODING_DS, '/enterprise/search', {keyword: data,dataTyId:80}, response => {
            this.props.form.resetFields(['salBeId']);
            this.setState({clientArray: response.data || []});
        }, error => {
        })
	}
	getData(value,that){
		this.addSelect = that;
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError,getNFieldProps,getFieldValue} = this.props.form;
		let {checkedData,getOne} = this.props;
		let {getOnedata,xiaoshouArray} = this.state;
		let content = <div></div>;
           content = (
           <div className="packageplug-add scroll girdlayout">
           									<div className="package-add-line1 row">
												<div className='form-group col-md-4 col-lg-4'>
													<label className='col-md-4 col-lg-4'><span>*</span>{i18n.t(500070/*证书名称*/)}</label>
													<ConstMiniSelect form={this.props.form}
					                                     pbj={{
					                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
					                                                     params: {obj:'com.fooding.fc.ds.entity.Certfct'}
					                                          }} fieldName="cardId"
					                                                 initValueOptions={[]}
					                                                  initialValue={
						                                                 	xt.initSelectValue(getOnedata["card"+language], getOnedata, ['cardId', 'cardLcName', 'cardEnName'], "card"+language, this.props.form)
						                                              }
					                                                 optionValue={(da, di) => <Option key={di} objValue={{
					                                                     cardId: da.id,
					                                                     cardLcName: da.localName,
					                                                     cardEnName: da.name,
					                                                     s_label:da.localName
					                                                 }}>{da.localName}</Option>} reles={true}
					                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
					                            	/>
					                            </div>
					                            <div className='form-group col-md-4 col-lg-4'>
													<label className='col-md-4 col-lg-4'><span>*</span>{i18n.t(200330/*出证单位*/)}</label>
													<ConstMiniSelect form={this.props.form}
					                                     pbj={{
					                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
					                                                     params: {obj:'com.fooding.fc.ds.entity.ServBe',queryParams:[{
					                                                     	attr:'beDataMulDivIds',
					                                                     	expression:"oin",
					                                                     	value:10
					                                                     }]}
					                                          }} fieldName="cardBeId"
					                                                 initValueOptions={[]}
					                                                  initialValue={
						                                                 	xt.initSelectValue(getOnedata["cardBe"+language], getOnedata, ['cardBeId', 'cardBeLcName', 'cardBeEnName'], "cardBe"+language, this.props.form)
						                                              }
					                                                 optionValue={(da, di) => <Option key={di} objValue={{
					                                                     cardBeId: da.id,
					                                                     cardBeLcName: da.localName,
					                                                     cardBeEnName: da.name,
					                                                     s_label:da.localName
					                                                 }}>{da.localName}</Option>} reles={true}
					                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
					                            />
												</div>
												<div className='form-group col-md-4 col-lg-4'>
													<label className='col-md-4 col-lg-4'><span>*</span>{i18n.t(500125/*货币*/)}</label>
													<ConstMiniSelect form={this.props.form}
		                                                 pbj={{
		                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
		                                                     params: {obj:'com.fooding.fc.ds.entity.Curren'}
		                                                 }} fieldName="cnyId"
		                                                 initValueOptions={[]}
		                                                 initialValue={
						                                                 	xt.initSelectValue(getOnedata["cny"+language], getOnedata, ['cnyId', 'cnyLcName', 'cnyEnName'], "cny"+language, this.props.form)
						                                              }
		                                                 optionValue={(da, di) => <Option key={di} objValue={{
		                                                     cnyId: da.id,
		                                                     cnyLcName: da.localName,
		                                                     cnyEnName: da.name,
		                                                     s_label: da.localName
		                                                 }}>{da.localName}</Option>} reles={true}
		                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
		                                			/>
												</div>
											</div>
											<div className="package-add-line1 row">
												<div className='form-group col-md-4 col-lg-4'>
													<label className='col-md-4 col-lg-4'><span>*</span>{i18n.t(400134/*相关产品*/)}</label>
													<Select
																{...getNFieldProps('mtlId',{
																	rules: [{required:true}],
																	initialValue:getOnedata["mtl"+language]?{s_label:getOnedata["mtl"+language],mtlId:getOnedata.mtlId,
																	mtlLcName:getOnedata.mtlLcName,mtlEnName:getOnedata.mtlEnName}:undefined
																 })}
																animation='slide-up'
																placeholder=''
															    optionLabelProp="children"
																optionFilterProp="children"
																className={getFieldError('mtlId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
																allowClear
															>
																{this.state.xiaoshouArray.map((o,i)=><Option key={i}
																	objValue={{s_label:o["mtl"+language], mtlId:o.mtlId,mtlLcName:o.mtlLcName,mtlEnName:o.mtlEnName}}
																	title={o.sourceNo}>{o["mtl"+language]}</Option>)}
													</Select>
												</div>
												<div className='form-group col-md-4 col-lg-4'>
													<label className='col-md-4 col-lg-4'><span>*</span>{i18n.t(200326/*认证单位*/)}</label>
													<ConstMiniSelect form={this.props.form}
		                                                 pbj={{
					                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
					                                                     params: {obj:'com.fooding.fc.ds.entity.ServBe',queryParams:[{
					                                                     	attr:'beDataMulDivIds',
					                                                     	expression:"oin",
					                                                     	value:20
					                                                     }]}
					                                          }} fieldName="cerBeId"
		                                                 initValueOptions={[]}
		                                                 initialValue={
						                                                 	xt.initSelectValue(getOnedata["cerBe"+language], getOnedata, ['cerBeId', 'cerBeLcName', 'cerBeEnName'], "cerBe"+language, this.props.form)
						                                              }
		                                                 optionValue={(da, di) => <Option key={di} objValue={{
		                                                     cerBeId: da.id,
		                                                     cerBeLcName: da.localName,
		                                                     cerBeEnName: da.name,
		                                                     s_label: da.localName
		                                                 }}>{da.localName}</Option>} reles={true}
		                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
		                                			/>
												</div>
												<div className='form-group col-md-4 col-lg-4'>
													<label className='col-md-4 col-lg-4'><span>*</span>{i18n.t(500050/*付款企业*/)}</label>
													<ConstMiniSelect form={this.props.form}
														isRequest={Boolean(getOne.ccId)}
                                                 		refreshMark={getOne.ccId}
		                                                 pbj={{
		                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/partner/getListBySourceId',
		                                                     params: {sourceId:getOne.ccId,dataTyId:60,isAddSelf:true}
		                                                 }} fieldName="payCcId"
		                                                 initValueOptions={[]}
		                                                  initialValue={
						                                                 	xt.initSelectValue(getOnedata["payCc"+language], getOnedata, ['payCcId', 'payCcLcName', 'payCcEnName'], "payCc"+language, this.props.form)
						                                              }
		                                                 optionValue={(da, di) => <Option key={di} objValue={{
		                                                     payCcId: da.enterpriseId,
		                                                     payCcLcName: da.enterpriseLcName,
		                                                     payCcEnName: da.enterpriseEnName,
		                                                     s_label: da.enterpriseLcName
		                                                 }}>{da.enterpriseLcName}</Option>} reles={true}
		                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
		                                           />
												</div>

											</div>
											<div className="package-add-line1 row">
												<div className='form-group col-md-4 col-lg-4'>
													<label className='col-md-4 col-lg-4'><span>*</span>{i18n.t(500072/*是否正本*/)}</label>
													 <Checkbox
																{...getFieldProps('gentMark',{
																	initialValue:getOnedata.gentMark?getOnedata.gentMark:false
																})}
																checked={this.props.form.getFieldValue("gentMark")}
													 />
												</div>
												<div className='form-group col-md-4 col-lg-4'>
													<label className='col-md-4 col-lg-4'><span>*</span>{i18n.t(200331/*约定标识*/)}</label>
													 <Checkbox
														        style={{lineHeight:'32px'}}
																{...getFieldProps('conventionMark',{
																	initialValue:getOnedata.conventionMark?getOnedata.conventionMark:false
																})}
																checked={this.props.form.getFieldValue("conventionMark")}
													 />
												</div>
												<div className='form-group col-md-4 col-lg-4'>
													<label className='col-md-4 col-lg-4'><span>*</span>{i18n.t(200320/*收款机构*/)}</label>
													<ConstMiniSelect form={this.props.form}
		                                                 pbj={{
		                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/servBe/getServBeByDivs',
		                                                     params: {beDataMulDivIds:[10,20]}
		                                                 }} fieldName="recBeId"
		                                                 initValueOptions={[]}
		                                                  initialValue={
						                                                 	xt.initSelectValue(getOnedata["recBe"+language], getOnedata, ['recBeId', 'recBeLcName', 'recBeEnName'], "recBe"+language, this.props.form)
						                                              }
		                                                 optionValue={(da, di) => <Option key={di} objValue={{
		                                                     recBeId: da.id,
		                                                     recBeLcName: da.localName,
		                                                     recBeEnName: da.name,
		                                                     s_label: da.localName
		                                                 }}>{da.localName}</Option>} reles={true}
		                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
		                                           />
												</div>
											</div>
											<div className="package-add-line1 row">
												<div className='form-group col-md-4 col-lg-4'>
													<label className='col-md-4 col-lg-4'><span>*</span>{i18n.t(500071/*是否加急*/)}</label>
													 <Checkbox
														        style={{lineHeight:'32px'}}
																{...getFieldProps('origMark',{
																	initialValue:getOnedata.origMark?getOnedata.origMark:false
																})}
																checked={this.props.form.getFieldValue("origMark")}
													 />
												</div>
												<div className='form-group col-md-4 col-lg-4'>
													<label className='col-md-4 col-lg-4'><span>*</span>{i18n.t(200321/*实际金额*/)}</label>
													<input placeholder=''
														   type="text" {...getFieldProps('actAgg', {
														   		rules: [{required:true}],
												                initialValue:getOnedata.actAgg?getOnedata.actAgg:''
												            })}
														className={getFieldError('actAgg')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
													 />
												</div>
												<div className='form-group col-md-4 col-lg-4'>
													<label className='col-md-4 col-lg-4'><span>*</span>{i18n.t(400008/*销售单号*/)}</label>
													<Select
																{...getNFieldProps('saleNo',{
																	rules: [{required:true}],
																	initialValue:getOnedata["saleNo"]?{s_label:getOnedata["saleNo"],saleNo:getOnedata.saleNo}:
																	{s_label:xiaoshouArray[0]?this.state.xiaoshouArray[0].sourceNo:'', saleNo:xiaoshouArray[0]?this.state.xiaoshouArray[0].sourceNo:''}
																 })}
																animation='slide-up'
																placeholder=''
															    optionLabelProp="children"
																optionFilterProp="children"
																className={getFieldError('saleNo')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
																allowClear
															>
																{this.state.xiaoshouArray.map((o,i)=><Option key={i}
																	objValue={{s_label:o.sourceNo, saleNo:o.sourceNo}}
																	title={o.sourceNo}>{o.sourceNo}</Option>)}
													</Select>
												</div>
											</div>
           	</div>
           	);
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true}
					buttonLeft = {this.props.buttonLeft}
					onSaveAndClose={this.onSaveAndClose}
					showSaveClose = {this.state.getOnedata.payMentUuId?false:true}
					 onCancel={this.props.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(FclPlug);
export default ProductForm;
