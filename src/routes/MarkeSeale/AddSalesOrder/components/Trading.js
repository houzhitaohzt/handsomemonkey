import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option,ConstMiniSelect} from '../../../../components/Select';
import  SelectChange from "../../../../components/SelectChange";
import Checkbox from  '../../../../components/CheckBox';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP,API_FOODING_ES } from '../../../../services/apiCall';
class Trading extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState();
		this.jiaoyiTKClick = this.jiaoyiTKClick.bind(this);
		this.jiaoyiSelect = this.jiaoyiSelect.bind(this);
		this.zhifuTKClick = this.zhifuTKClick.bind(this);
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
	zhifuTKClick(){
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.TradrulePayterm'},
			(response)=>{
				this.setState({
					zhifuArray:response.data
				})
			},(error)=>{

		});
	}
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
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Incotm',queryParams:[{
			attr:'incotmTyId',
			expression:'=',
			value:'10'
		}]},(response)=>{
			that.setState({
				jiaoyiArray:response.data
			})
		},(error)=>{

		});
	}
	jiaoyiSelect(e){
		let that = this;
		apiGet(API_FOODING_DS,'/incotm/getOne',{id:e},(response)=>{
		},(error)=>{

		});

	}
	render(){
		const {radioAddress, radioState} = this.state;
		let {getNFieldProps,getFieldProps,getFieldValue,getFieldError} = this.props.form;
		let {getOne} = this.props;
		let clusterId = getFieldValue("clusterId")||{};
		let beField = getNFieldProps('incotmId',{
										rules: [{required:true}],
										initialValue:getOne["incotm"+language]?{s_label:getOne["incotm"+language], incotmId:getOne.incotmId, incotmLcName:getOne.incotmLcName, incotmEnName:getOne.incotmEnName}:undefined
									 });
		let beFieldValue = getFieldValue("incotmId") || {};
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
							<Select 
									{...beField}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"							
									className ={getFieldError('incotmId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
									onClick={this.jiaoyiTKClick}
									onSelect = {this.jiaoyiSelect}
								>	
									{this.state.jiaoyiArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, incotmId:o.id, incotmLcName:o.localName, incotmEnName:o.name}} title={o.name}>{o.name}</Option>)}
							</Select>
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
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500083/*收款企业*/)}</label>
							<ConstMiniSelect form={this.props.form}
									isRequest={Boolean(clusterId.clusterId)}
                                    refreshMark={clusterId.clusterId}
                                     pbj={{
                                                     apiType: apiGet, host: API_FOODING_ES, uri:'/party/getLoginCompanies',
                                                     params: {clusId:clusterId.clusterId}
                                          }} fieldName="receiptCcId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["receiptCc"+language]?{s_label:getOne["receiptCc"+language],receiptCcId:getOne.receiptCcId,receiptCcLcName:getOne.receiptCcLcName,receiptCcEnName:getOne.receiptCcEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     receiptCcId: da.id,
                                                     receiptCcLcName: da.localName,
                                                     receiptCcEnName: da.name,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100133/*支付条款*/)}</label>
							<Select 
								 {...getNFieldProps('payTrmId',{
										                    rules: [{required:true}],
										                    initialValue:getOne["payTrm"+language]?{s_label:getOne["payTrm"+language],payTrmLcName:getOne.payTrmLcName,payTrmTyEnName:getOne.payTrmTyEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                optionFilterProp="children"	
										                onClick={this.zhifuTKClick}						
										                className ={getFieldError('payTrmId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}					
								>	
									{this.state.zhifuArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, payTrmId:o.id, payTrmLcName:o.localName, payTrmEnName:o.name}} title={o.name}>{o.name}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200729/*信保公司*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                     pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.ServBe',queryParams:[{
                                                     	attr:'beDataMulDivIds',
                                                     	expression:'oin',
                                                     	value:60
                                                     }]}
                                          }} fieldName="insBeId"
                                                 initValueOptions={[]}
                                                 initialValue={this.props.form.getFieldValue("corpMark")&&getOne["insBe"+language]?{s_label:getOne["insBe"+language],insBeId:getOne.insBeId,insBeLcName:getOne.insBeLcName,insBeEnName:getOne.insBeEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     insBeId: da.id,
                                                     insBeLcName: da.localName,
                                                     insBeEnName: da.name,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>}
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
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500086/*收款账号*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean(cnyValue.cnyId&&receiptCcValue.receiptCcId)}
                                                 refreshMark={cnyValue.cnyId + ''+receiptCcValue.receiptCcId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/bankacct/getList',
                                                     params: {sourceId:receiptCcValue.receiptCcId,curcyId:cnyValue.cnyId}
                                                 }} fieldName="receBankAccountId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["receBankAccount"+language]?{s_label:getOne["receBankAccount"+language],receBankAccountId:getOne.receBankAccountId,receBankAccountLcName:getOne.receBankAccountLcName,receBankAccountEnName:getOne.receBankAccountEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     receBankAccountId: da.id,
                                                     receBankAccountLcName: da.localName,
                                                     receBankAccountEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles={true}
                                                 className ={getFieldError('receBankAccountId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500063/*付款方式*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                     pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.PayTrmType'}
                                          }} fieldName="payTrmTyId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["payTrmTy"+language]?{s_label:getOne["payTrmTy"+language],payTrmTyId:getOne.payTrmTyId,payTrmTyLcName:getOne.payTrmTyLcName,payTrmTyEnName:getOne.payTrmTyEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     payTrmTyId: da.id,
                                                     payTrmTyLcName: da.localName,
                                                     payTrmTyEnName: da.name,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={getFieldError('payTrmTyId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />
						</div>
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
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200731/*保险公司*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                     pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.ServBe',queryParams:[{
                                                     	attr:'beDataMulDivIds',
                                                     	expression:'oin',
                                                     	value:50
                                                     }]}
                                          }} fieldName="prateBeId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["prateBe"+language]?{s_label:getOne["prateBe"+language],prateBeId:getOne.prateBeId,prateBeLcName:getOne.prateBeLcName,prateBeEnName:getOne.prateBeEnName}:undefined}
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
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100299/*货代公司*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                     pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.AgnShipBe'}
                                          }} fieldName="forwarderBeId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["forwarderBe"+language]?{s_label:getOne["forwarderBe"+language],forwarderBeId:getOne.forwarderBeId,forwarderBeLcName:getOne.forwarderBeLcName,forwarderBeEnName:getOne.forwarderBeEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     forwarderBeId: da.id,
                                                     forwarderBeLcName: da.localName,
                                                     forwarderBeEnName: da.name,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={getFieldError('forwarderBeId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Trading;
