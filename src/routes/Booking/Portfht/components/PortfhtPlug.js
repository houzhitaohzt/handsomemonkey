import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
import Select, {Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import Calendar from  '../../../../components/Calendar/Calendar';
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
			clientArray:[],
			xiaoshouArray:[],//销售单号
			getOnedata:{}
		}
		this.getOne=this.getOne.bind(this);
	}
	onSaveAndClose(){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				value =Object.assign({},this.props.checkedData.record,value,
					{billId:this.props.getOne.billId,shippingOrderNo:this.props.getOne.no,
					ccId:this.props.getOne.ccId});
				apiPost(API_FOODING_ERP,'/shipping/costlvtr/save',value,(response)=>{
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
		apiGet(API_FOODING_ERP,'/shipping/costlvtr/getOne',{id:id},(response)=>{
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
        apiGet(API_FOODING_DS, '/customer/search', {keyword: data}, response => {
            this.props.form.resetFields(['salBeId']);
            this.setState({clientArray: response.data || []});
        }, error => {
        })
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError,getFieldValue,getNFieldProps} = this.props.form;
		let {checkedData,getOne} = this.props;
		let {getOnedata,xiaoshouArray} = this.state;
		let content = <div></div>;
           content = (
           	<div className="packageplug-add scroll girdlayout">
           									<div className="package-add-line1 row">
												<div className='form-group col-md-6 col-lg-6'>
													<label className='col-md-3 col-lg-3'><span>*</span>{i18n.t(500121/*费用名称*/)}</label>
													<ConstMiniSelect form={this.props.form}
					                                     pbj={{
					                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
					                                                     params: {obj:'com.fooding.fc.ds.entity.Costlvtr'}
					                                          }} fieldName="costlvtrId"
					                                                 initValueOptions={[]}
					                                                  initialValue={
						                                                 	xt.initSelectValue(getOnedata["costlvtr"+language], getOnedata, ['costlvtrId', 'costlvtrLcName', 'costlvtrEnName'], "costlvtr"+language, this.props.form)
						                                              }
					                                                 optionValue={(da, di) => <Option key={di} objValue={{
					                                                     costlvtrId: da.id,
					                                                     costlvtrLcName: da.localName,
					                                                     costlvtrEnName: da.name,
					                                                     s_label:da.localName
					                                                 }}>{da.localName}</Option>} reles={true}
					                                                 className ={'currency-btn select-from-currency col-md-9 col-lg-9'}							
					                            />
												</div>
												<div className='form-group col-md-6 col-lg-6'>
													<label className='col-md-3 col-lg-3'><span>*</span>{i18n.t(500125/*货币*/)}</label>
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
		                                                 className ={'currency-btn select-from-currency col-md-9 col-lg-9'}							
		                                			/>
												</div>
											</div>
											<div className="package-add-line1 row">
												<div className='form-group col-md-6 col-lg-6'>
													<label className='col-md-3 col-lg-3'><span>*</span>{i18n.t(500050/*付款企业*/)}</label>
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
		                                                 className ={'currency-btn select-from-currency col-md-9 col-lg-9'}							
		                                           />
												</div>
												<div className='form-group col-md-6 col-lg-6'>
													<label className='col-md-3 col-lg-3'><span>*</span>{i18n.t(200320/*收款机构*/)}</label>
													<ConstVirtualSelect
													    form={this.props.form}
													    apiType={apiPost}
													    fieldName='recBeId'
													    apiUri='/enterprise/search?dataTyId=80'
													    async={true}
													    apiParams='keyword'
													    initialValue={
						                                        xt.initSelectValue(getOnedata["recBe"+language], getOnedata, ['recBeId', 'recBeLcName', 'recBeEnName'], "recBe"+language, this.props.form)
						                                }
													    valueKeys={ da => ({
													        s_label:da.localName, 
													        recBeId:da.id, 
													        recBeLcName:da.localName, 
													        recBeEnName:da.name
													    })} rules={true}
													    className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
													/>
												</div>
											</div>
											<div className="package-add-line1 row">
												<div className='form-group col-md-6 col-lg-6'>
													<label className='col-md-3 col-lg-3'><span>*</span>{i18n.t(200321/*实际金额*/)}</label>
													<input placeholder=''
														   type="text" {...getFieldProps('actAgg', {
														   		rules: [{required:true}],
												                initialValue:getOnedata.actAgg?getOnedata.actAgg:''
												            })} 
														className={getFieldError('actAgg')?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'} 
													 />
												</div>
												<div className='form-group col-md-6 col-lg-6'>
													<label className='col-md-3 col-lg-3'><span>*</span>{i18n.t(100133/*支付条款*/)}</label>
													<ConstMiniSelect form={this.props.form}
														isRequest={Boolean( getFieldValue('recBeId',{}).recBeId)}
		                                                 refreshMark={getFieldValue('recBeId', {}).recBeId}
		                                                 pbj={{
		                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getList',
		                                                     params: {obj:'com.fooding.fc.ds.entity.TradrulePayterm',attrs:['payTrm'],
															 queryParams:[{attr:'sourceId',expression:'=',value:getFieldValue('recBeId', {}).recBeId}]}
		                                                 }} fieldName="payTrmId"
		                                                 initValueOptions={[]}
		                                                 initialValue={
						                                                 	xt.initSelectValue(getOnedata["payTrm"+language], getOnedata, ['payTrmId', 'payTrmLcName', 'payTrmEnName'], "payTrm"+language, this.props.form)
						                                              }
		                                                 optionValue={(da, di) => <Option key={di} objValue={{
		                                                     payTrmId: da.payTrm.id,
		                                                     payTrmLcName: da.payTrm.localName,
		                                                     payTrmEnName: da.payTrm.name,
		                                                     s_label: da.payTrm.localName, 
		                                                 }}
                                                 
                                                    >{da.payTrm.localName}</Option>}
                                                 	reles={true}
                                                 	className ={'currency-btn select-from-currency col-md-9 col-lg-9'}							
                                				/>
												</div>
											</div>
											<div className="package-add-line1 row">
												<div className='form-group col-md-6 col-lg-6'>
													<label className='col-md-3 col-lg-3'><span>*</span>{i18n.t(400008/*销售单号*/)}</label>
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
																className={getFieldError('saleNo')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}
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
