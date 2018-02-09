import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option,ConstMiniSelect} from '../../../../components/Select';
import  SelectChange from "../../../../components/SelectChange";
import Checkbox from  '../../../../components/CheckBox';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP,API_FOODING_ES } from '../../../../services/apiCall';
import xt from '../../../../common/xt'; // 下拉
class Trading extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState();
		this.jiaoyiTKClick = this.jiaoyiTKClick.bind(this);
		// this.zhifuTKClick = this.zhifuTKClick.bind(this);
		this.zhifuSelect = this.zhifuSelect.bind(this);
		this.maixinbaoClick = this.maixinbaoClick.bind(this);
		this.jiayiSelect = this.jiayiSelect.bind(this);
		this.xinbaoChange= this.xinbaoChange.bind(this);
		// this.maiBaoxianClick = this.maiBaoxianClick.bind(this);
	}
	initState(){
		return {
			radioState:'',
			radioAddress:'',
			jiaoyiArray:[],
			clientArray:[],
			zhifuArray:[]
		}
	}
	maixinbaoClick(){
		let that = this;
		xt.initSelectValue(false,{}, ['insBeId', 'insBeLcName', 'insBeEnName'], '', this.props.form)
	}
	jiayiSelect(e){
		let that = this;
		let getOne = this.props.getOne;
		getOne = Object.assign({},getOne,{pShipMark:e.pShipMark});
        that.props.setGetOne(getOne);
	}
	zhifuSelect(e){
		let that = this;
		let getOne = this.props.getOne;
		getOne = Object.assign({},getOne,e);
        that.props.setGetOne(getOne);
        let {getFieldValue}=this.props.form;
		let billDate = new Date(getFieldValue("billDate",{})).Format('yyyy-MM-dd');
		let payTrmId = e.payTrmId;
		let insBeId = getFieldValue("insBeId",{}).insBeId;
		let corpTypeId = e.corpTypeId;
		let riskTyId =getOne.riskTyId;
		let ccId = getFieldValue("ccId",{}).ccId;

		if(billDate && payTrmId  && insBeId &&
		 corpTypeId && riskTyId&& ccId){
			apiGet(API_FOODING_ERP,'/termscreditrate/getRate',{
				billDate:billDate,payTrmId:payTrmId,insBeId:insBeId,
				corpTypeId:corpTypeId,riskTyId:riskTyId,ccId:ccId
			},(response)=>{
				let getOne = this.props.getOne;
				getOne = Object.assign({},getOne,{corpRate:response.data});
        		that.props.setGetOne(getOne);
			},(error)=>{

			})
		}
	}
	xinbaoChange(e){
		let that = this;
		let {getFieldValue}=this.props.form;
		let billDate = new Date(getFieldValue("billDate",{})).Format('yyyy-MM-dd');
		let payTrmId = getFieldValue("payTrmId",{}).payTrmId;
		let insBeId = e.insBeId;
		let corpTypeId = getFieldValue("corpTypeId",{}).corpTypeId;
		let riskTyId = getFieldValue("riskTyId",{}).riskTyId;
		let ccId = getFieldValue("ccId",{}).ccId;

		if(billDate && payTrmId  && insBeId &&
		 corpTypeId && riskTyId&& ccId){
			apiGet(API_FOODING_ERP,'/termscreditrate/getRate',{
				billDate:billDate,payTrmId:payTrmId,insBeId:insBeId,
				corpTypeId:corpTypeId,riskTyId:riskTyId,ccId:ccId
			},(response)=>{
				let getOne = this.props.getOne;
				getOne = Object.assign({},getOne,{corpRate:response.data});
        		that.props.setGetOne(getOne);
			},(error)=>{

			})
		}
	}
	// zhifuTKClick(){
	// 	let {getFieldValue} = this.props.form;
	// 	let beFieldValue = getFieldValue("salBeId") || {};
	// 	if(beFieldValue.salBeId){
	// 		apiPost(API_FOODING_DS,'/object/getList',{obj:'com.fooding.fc.ds.entity.TradrulePayterm',attrs:['payTrm'],
	// 			queryParams:[{attr:'sourceId',expression:'=',value:beFieldValue.salBeId}]},
	// 			(response)=>{
	// 				this.setState({
	// 					zhifuArray:response.data
	// 				})
	// 			},(error)=>{

	// 		});
	// 	}
	// }
	StateChange(e){
		let tex;
		tex = e.target.value;
		this.setState({
			radioState:tex
		})
	}
	componentDidMount(){
	}
	AddressChange(e){
		let addres;
		addres = e.target.value;
		this.setState({
			radioAddress:addres
		})
	}
	jiaoyiTKClick(){
		let that = this;
		apiGet(API_FOODING_DS,'/incotm/getList',{},(response)=>{
			that.setState({
				jiaoyiArray:response.data
			})
		},(error)=>{

		});
	}
	render(){
		const {radioAddress, radioState} = this.state;
		let {getNFieldProps,getFieldProps,getFieldValue,getFieldError} = this.props.form;
		let {getOne} = this.props;
		let clusterId = getFieldValue("clusterId")||{};
		// let beField = getNFieldProps('incotmId',{
		// 								rules: [{required:true}],
		// 								initialValue:getOne["incotm"+language]?{s_label:getOne["incotm"+language], incotmId:getOne.incotmId, incotmLcName:getOne.incotmLcName, incotmEnName:getOne.incotmEnName}:undefined
		// 							 });
		// let beFieldValue = getFieldValue("incotmId") || {};

		let receiptCcValue = getFieldValue("receiptCcId") || {};
		let cnyValue = getFieldValue("cnyId") || {};
		return(
			<div className={'addnormal'} style={{marginTop:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(200728/*商务条款-交易*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100376/*交易条款*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Incotm',queryParams:[{
                                                     	attr:'incotmTyId',
                                                     	expression:'=',
                                                     	value:10
                                                     }]}
                                                 }} fieldName="incotmId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["incotm"+language], getOne, ['incotmId', 'incotmLcName', 'incotmEnName'], "incotm"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     incotmId: da.id,
                                                     incotmLcName: da.localName,
                                                     incotmEnName: da.name,
                                                     s_label: da.localName,
                                                     pShipMark:da.pShipMark
                                                 }}
                                                 >{da.localName}</Option>}
                                                 onChange = {this.jiayiSelect}
                                                 reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100133/*支付条款*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue('salBeId',{}).salBeId)}
                                                 refreshMark={getFieldValue('salBeId', {}).salBeId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getList',
                                                     params: {obj:'com.fooding.fc.ds.entity.TradrulePayterm',attrs:['payTrm'],
													 queryParams:[{attr:'sourceId',expression:'=',value:getFieldValue('salBeId', {}).salBeId}]}
                                                 }} fieldName="payTrmId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["payTrm"+language], getOne, ['payTrmId', 'payTrmLcName', 'payTrmEnName'], "payTrm"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     payTrmId: da.payTrm.id,
                                                     payTrmLcName: da.payTrm.localName,
                                                     payTrmEnName: da.payTrm.name,
                                                     s_label: da.payTrm.localName,
                                                     corpMark:da.payTrm.crdPrMark,
                                                     corpTypeId:da.payTrm.corpType.id,
                                                     corpTypeLcName:da.payTrm.corpType.name,
                                                     corpTypeEnName:da.payTrm.corpType.name
                                                 }}

                                                 >{da.payTrm.localName}</Option>}
                                                 onChange = {this.zhifuSelect}
                                                 reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />

						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500059/*买信保*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								 <Checkbox
								        style={{lineHeight:'32px'}}
										{...getFieldProps('corpMark',{
											initialValue:getOne.corpMark?getOne.corpMark:false
										})}
										checked={this.props.form.getFieldValue("corpMark")}
										onClick={this.maixinbaoClick}

								    />
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100189/*信保分类*/)}</label>
							<Select
									{...getNFieldProps('corpTypeId',{
										initialValue:getOne["corpType"+language]?{s_label:getOne["corpType"+language],corpTypeId:getOne.corpTypeId,corpTypeLcName:getOne.corpTypeLcName,corpTypeEnName:getOne.corpTypeEnName}:undefined
									 })}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"
									className ={getFieldError('corpTypeId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
									disabled
								>
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200730/*信保费率*/)}</label>
							<input
								   type="text" {...getFieldProps('corpRate', {
						                initialValue:getOne.corpRate?getOne.corpRate:''
						            })}
								disabled
								className={getFieldError('corpRate')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
							 />
					    </div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200729/*信保公司*/)}</label>
							<ConstMiniSelect form={this.props.form}
									 refreshMark={getFieldValue('corpMark', {})}
                                     pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.ServBe',queryParams:[{
                                                     	attr:'beDataMulDivIds',
                                                     	expression:'oin',
                                                     	value:60
                                                     }]}
                                          }} fieldName="insBeId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["insBe"+language]&&getFieldValue("corpMark"), getOne, ['insBeId', 'insBeLcName', 'insBeEnName'], "insBe"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     insBeId: da.id,
                                                     insBeLcName: da.localName,
                                                     insBeEnName: da.name,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>}
                                                 onChange = {this.xinbaoChange}
                                                 disabled ={!this.props.form.getFieldValue("corpMark")}
                                                 className ={getFieldError('insBeId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500062/*买保险*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								 <Checkbox
								        style={{lineHeight:'32px'}}
										{...getFieldProps('pShipMark',{
											initialValue:getOne.pShipMark?getOne.pShipMark:false
										})}
										checked={this.props.form.getFieldValue("pShipMark")}
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200731/*保险公司*/)}</label>
							<ConstMiniSelect form={this.props.form}
											 refreshMark={getFieldValue('pShipMark', {})}
                                     pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.ServBe',queryParams:[{
                                                     	attr:'beDataMulDivIds',
                                                     	expression:'oin',
                                                     	value:50
                                                     }]}
                                          }} fieldName="prateBeId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["prateBe"+language]&&getFieldValue("pShipMark"), getOne, ['prateBeId', 'prateBeLcName', 'prateBeEnName'], "prateBe"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     prateBeId: da.id,
                                                     prateBeLcName: da.localName,
                                                     prateBeEnName: da.name,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>}
                                                 disabled ={!this.props.form.getFieldValue("pShipMark")}
                                                 className ={getFieldError('prateBeId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
                            </div>
					</div>
				</div>
			</div>
		)
	}
}

export default Trading;
