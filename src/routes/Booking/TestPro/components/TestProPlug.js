import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
import Select, {Option,ConstMiniSelect } from '../../../../components/Select';
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
		this.productSelect = this.productSelect.bind(this);
	}
	productSelect(e,item){
		let that = this;
		apiGet(API_FOODING_DS,'/material/getProductInforErp',{id:item.props.objValue.mtlId,mtlType:'mtl'},(response)=>{
			let getOnedata = this.state.getOnedata;
			let data = response.data;
			getOnedata = Object.assign({},getOnedata,{mtlTyId:data.mtlTyId,mtlTyLcName:data.mtlTyLcName,mtlTyEnName:data.mtlTyEnName});
			this.setState({
				getOnedata:getOnedata
			})
		},(error)=>{

		});
	}
	onSaveAndClose(){
		let that = this;
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				value =Object.assign({},this.props.checkedData.record,value,
					{billId:that.props.getOne.billId,shippingOrderNo:this.props.getOne.no,
					ccId:this.props.getOne.ccId});
				apiPost(API_FOODING_ERP,'/shipping/test/save',value,(response)=>{
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
		apiGet(API_FOODING_ERP,'/shipping/test/getOne',{id:id},(response)=>{
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
												<div className='form-group col-md-6 col-lg-6'>
													<label className='col-md-3 col-lg-3'><span>*</span>{i18n.t(100379/*产品*/)}</label>
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
																className={getFieldError('mtlId')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}
																onSelect ={this.productSelect}
															>	
																{this.state.xiaoshouArray.map((o,i)=><Option key={i} 
																	objValue={{s_label:o["mtl"+language], mtlId:o.mtlId,mtlLcName:o.mtlLcName,mtlEnName:o.mtlEnName}} 
																	title={o.sourceNo}>{o["mtl"+language]}</Option>)}
													</Select>
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
													<label className='col-md-3 col-lg-3'>{i18n.t(200172/*产品分类*/)}</label>
													<ConstMiniSelect form={this.props.form}
		                                                 fieldName="mtlTyId"
		                                                 initValueOptions={[]}
		                                                 initialValue={
						                                                 	xt.initSelectValue(getOnedata["mtlTy"+language], getOnedata, ['mtlTyId', 'mtlTyLcName', 'mtlTyEnName'], "mtlTy"+language, this.props.form)
						                                              }
						                                 disabled
		                                                 className ={'currency-btn select-from-currency col-md-9 col-lg-9'}							
		                                			/>
												</div>
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
												
											</div>
											<div className="package-add-line1 row">
												<div className='form-group col-md-6 col-lg-6'>
													<label className='col-md-3 col-lg-3'><span>*</span>{i18n.t(200396/*检验机构*/)}</label>
													<ConstMiniSelect form={this.props.form}
		                                                 pbj={{
					                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
					                                                     params: {obj:'com.fooding.fc.ds.entity.ServBe',queryParams:[{
					                                                     	attr:'beDataMulDivIds',
					                                                     	expression:"oin",
					                                                     	value:40
					                                                     }]}
					                                          }} fieldName="servBeId"
		                                                 initValueOptions={[]}
		                                                 initialValue={
						                                                 	xt.initSelectValue(getOnedata["servBe"+language], getOnedata, ['servBeId', 'servBeLcName', 'servBeEnName'], "servBe"+language, this.props.form)
						                                              }
		                                                 optionValue={(da, di) => <Option key={di} objValue={{
		                                                     servBeId: da.id,
		                                                     servBeLcName: da.localName,
		                                                     servBeEnName: da.name,
		                                                     s_label: da.localName
		                                                 }}>{da.localName}</Option>} reles={true}
		                                                 className ={'currency-btn select-from-currency col-md-9 col-lg-9'}							
		                                			/>
												</div>
												<div className='form-group col-md-6 col-lg-6'>
													<label className='col-md-3 col-lg-3'><span>*</span>{i18n.t(200320/*收款机构*/)}</label>
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
					  onCancel={this.props.onCancel}
					  showSaveClose = {this.state.getOnedata.payMentUuId?false:true}
					  >
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(FclPlug);
export default ProductForm;
