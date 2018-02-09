import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option,ConstMiniSelect } from '../../../../components/Select';
import  SelectChange from "../../../../components/SelectChange";
import Checkbox from  '../../../../components/CheckBox';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP,API_FOODING_ES} from '../../../../services/apiCall';
class Clause extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState();
		this.clientClick = this.clientClick.bind(this);
		this.clientSelect = this.clientSelect.bind(this);
		this.LinkClick = this.LinkClick.bind(this);
		this.fLinkClick = this.fLinkClick.bind(this);
		this.TzLinkClick = this.TzLinkClick.bind(this);
		this.shouhuoqyChange = this.shouhuoqyChange.bind(this);
	}
	initState(){
		return {
			radioState:'',
			radioAddress:'',
			clientArray:[],
			LinkArray:[],
			contrnyArray:[],
			fLinkArray:[],
			TzLinkArray:[]
		}
	}
	shouhuoqyChange(e){
		let that = this;
		let getOne = this.props.getOne;
		getOne = Object.assign({},getOne,e);
        that.props.setGetOne(getOne);
	}
	TzLinkClick(){
		if(this.props.form.getFieldValue("noticeBusinessId") && this.props.form.getFieldValue("noticeBusinessId").noticeBusinessId){
			apiGet(API_FOODING_DS, '/entContact/getByBeIdDataTyId', {beId: this.props.form.getFieldValue("noticeBusinessId").noticeBusinessId,dataTyId:100}, response => {
            this.setState({TzLinkArray: response.data || []});
	        }, error => {
	        })
		}
	}
	fLinkClick(){
		if(this.props.form.getFieldValue("payBusinessId") && this.props.form.getFieldValue("payBusinessId").payBusinessId){
			apiGet(API_FOODING_DS, '/entContact/getByBeIdDataTyId', {beId: this.props.form.getFieldValue("payBusinessId").payBusinessId,dataTyId:100}, response => {
            this.setState({fLinkArray: response.data || []});
	        }, error => {
	        })
		}
	}
	LinkClick(){
		if(this.props.form.getFieldValue("receiptCcId") && this.props.form.getFieldValue("receiptCcId").receiptCcId){
			apiGet(API_FOODING_DS, '/entContact/getByBeIdDataTyId', {beId: this.props.form.getFieldValue("receiptCcId").receiptCcId,dataTyId:100}, response => {
            this.setState({LinkArray: response.data || []});
	        }, error => {
	        })
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
	clientSelect(e,item){
		if (item.props.objValue.salBeId === '') return;
		let that = this;
		let getOne = this.props.getOne;
		apiGet(API_FOODING_DS, '/customer/getCustInfoForErp', {id: item.props.objValue.salBeId}, response => {
           getOne = Object.assign({},getOne,response.data);
           that.props.setGetOne(getOne);
        }, error => {
        })
	}
	StateChange(e){
		let tex;
		tex = e.target.value;
		this.setState({
			radioState:tex
		})
	}
	componentDidMount(){
		// apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Country'},
		// 	(response)=>{
		// 		this.setState({
		// 			contrnyArray:response.data
		// 		})
		// 	},(error)=>{

		// 	});
	}
	AddressChange(e){
		let addres;
		addres = e.target.value;
		this.setState({
			radioAddress:addres
		})
	}
	render(){
		const {radioAddress, radioState} = this.state;
		let  {getOne}=this.props;
		console.log(clusterId);
		let {getNFieldProps,getFieldError,getFieldProps,getFieldValue} = this.props.form;
		let beField = getNFieldProps('salBeId',{
										rules: [{required:true}],
										initialValue:getOne["salBe"+language]?{s_label:getOne["salBe"+language], salBeId:getOne.salBeId, salBeLcName:getOne.salBeLcName, salBeEnName:getOne.salBeEnName}:undefined
									 });
		let beFieldValue = getFieldValue("salBeId") || {};
		let common;
		let isCcMark=getFieldProps('isCcMark',{
											initialValue:getOne.isCcMark?getOne.isCcMark:false
										});
		let clusterId = getFieldValue("clusterId")||{};
		if(getFieldValue("isCcMark")){
			common=<ConstMiniSelect form={this.props.form}
									isRequest={Boolean(clusterId.clusterId)}
                                    refreshMark={clusterId.clusterId}
                                     pbj={{
                                                     apiType: apiGet, host: API_FOODING_ES, uri:'/party/getLoginCompanies',
                                                     params: {clusId:clusterId.clusterId}
                                          }} fieldName="sendBeId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["sendBe"+language]?{s_label:getOne["sendBe"+language],sendBeId:getOne.sendBeId,sendBeLcName:getOne.sendBeLcName,sendBeEnName:getOne.sendBeEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     sendBeId: da.id,
                                                     sendBeLcName: da.localName,
                                                     sendBeEnName: da.name,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>} reles={true}
                                                 className ={getFieldError('sendBeId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />;
		}else{
			common=<ConstMiniSelect form={this.props.form}
									isRequest={Boolean( beFieldValue.salBeId)}
                                    refreshMark={beFieldValue.salBeId}
                                     pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/partner/getListBySourceId',
                                                     params: {sourceId: beFieldValue.salBeId,dataTyId:30,isAddSelf:true}
                                          }} fieldName="sendBeId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["sendBe"+language]?{s_label:getOne["sendBe"+language],sendBeId:getOne.sendBeId,sendBeLcName:getOne.sendBeLcName,sendBeEnName:getOne.sendBeEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     sendBeId: da.enterpriseId,
                                                     sendBeLcName: da.enterpriseLcName,
                                                     sendBeEnName: da.enterpriseEnName,
                                                     s_label: da["enterprise"+language]
                                                 }}>{da["enterprise"+language]}</Option>} reles={true}
                                                 className ={getFieldError('sendBeId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />;
		}

		return(
			<div className={'addnormal'} style={{marginTop:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(500057/*商务条款*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100311/*客户*/)}</label>
								<Select 
									{...beField}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"							
									className ={getFieldError('salBeId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
									onSearch={this.clientClick}
									onSelect ={this.clientSelect}
								>	
									{this.state.clientArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, salBeId:o.id, salBeLcName:o.localName, salBeEnName:o.name}} title={o.name}>{o.name}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500050/*付款企业*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( beFieldValue.salBeId)}
                                                 refreshMark={beFieldValue.salBeId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/partner/getListBySourceId',
                                                     params: {sourceId: beFieldValue.salBeId,dataTyId:30,isAddSelf:true}
                                                 }} fieldName="payBusinessId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["payBusiness"+language]?{s_label:getOne["payBusiness"+language],payBusinessId:getOne.payBusinessId,payBusinessLcName:getOne.payBusinessLcName,payBusinessEnName:getOne.payBusinessEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     payBusinessId: da.enterpriseId,
                                                     payBusinessLcName: da.enterpriseLcName,
                                                     payBusinessEnName: da.enterpriseEnName,
                                                     s_label: da.enterpriseLcName
                                                 }}>{da.enterpriseLcName}</Option>} reles={true}
                                                 className ={getFieldError('payBusinessId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500045/*收货企业*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( beFieldValue.salBeId)}
                                                 refreshMark={beFieldValue.salBeId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/partner/getListBySourceId',
                                                     params: {sourceId: beFieldValue.salBeId,dataTyId:30,isAddSelf:true}
                                                 }} fieldName="revBusinessId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["revBusiness"+language]?{s_label:getOne["revBusiness"+language],revBusinessId:getOne.revBusinessId,revBusinessLcName:getOne.revBusinessLcName,revBusinessEnName:getOne.revBusinessEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     revBusinessId: da.enterpriseId,
                                                     revBusinessLcName: da.enterpriseLcName,
                                                     revBusinessEnName: da.enterpriseEnName,
                                                     s_label: da.enterpriseLcName,
                                                     reclinkId:da.entContactorId,
                                                     reclinkLcName :da.entContactorLcName,
                                                     reclinkEnName :da.entContactorEnName,
                                                     recTel:da.phone,
                                                     recFax:da.fax,
                                                     recAddress:da.address,
                                                     recAddressList:da.addressList,
                                                     reclinkList:da.phoneList
                                                 }}>{da.enterpriseLcName}</Option>}
                                                 onChange = {this.shouhuoqyChange} reles={true}
                                                 className ={getFieldError('revBusinessId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500046/*收货联系人*/)}</label>
							<Select 
									{...getNFieldProps('reclinkId',{
										rules: [{required:true}],
										initialValue:getOne["reclink"+language]?{s_label:getOne["reclink"+language],reclinkLcName:getOne.reclinkLcName,reclinkEnName:getOne.reclinkEnName,reclinkId:getOne.reclinkId}:undefined
									 })}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"							
									className ={getFieldError('reclinkId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
									onClick={this.LinkClick}
								>	
									{this.state.LinkArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, reclinkId:o.id, reclinkLcName:o.localName, reclinkEnName:o.name}} title={o.name}>{o.name}</Option>)}
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200158/*客户国家*/)}</label>
							<Select 
									{...getNFieldProps('beCntryId',{
										rules: [{required:true}],
										initialValue:getOne["beCntry"+language]?{s_label:getOne["beCntry"+language],beCntryId:getOne.beCntryId,beCntryLcName:getOne.beCntryLcName,beCntryEnName:getOne.beCntryEnName}:undefined
									 })}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"							
									className ={getFieldError('beCntryId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
									disabled
								>	
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200706/*客户汇款国*/)}</label>
								<Select 
									{...getNFieldProps('remittanceCountryId',{
										rules: [{required:true}],
										initialValue:getOne["remittanceCountry"+language]?{s_label:getOne["remittanceCountry"+language],remittanceCountryId:getOne.remittanceCountryId,remittanceCountryLcName:getOne.remittanceCountryLcName,remittanceCountryEnName:getOne.remittanceCountryEnName}:undefined
									 })}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"							
									className ={getFieldError('remittanceCountryId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
								>	
									{this.state.contrnyArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, remittanceCountryId:o.id, remittanceCountryLcName:o.localName, remittanceCountryEnName:o.name}} title={o.name}>{o.name}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200163/*收货人电话*/)}</label>
							<input placeholder=''
								   type="text" {...getFieldProps('recTel', {
								   		rules: [{required:true}],
						                initialValue:getOne["recTel"]?getOne["recTel"]:''
						            })} 
								className={getFieldError('recTel')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'} 
							 />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200164/*收货人传真*/)}</label>
							<input placeholder=''
								   type="text" {...getFieldProps('recFax', {
								   		rules: [{required:true}],
						                initialValue:getOne["recFax"]?getOne["recFax"]:''
						            })} 
								className={getFieldError('recFax')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'} 
							 />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200159/*客户地区*/)}</label>
							<Select 
									{...getNFieldProps('beAreaId',{
										initialValue:getOne["beArea"+language]?{s_label:getOne["beArea"+language],beAreaId:getOne.beAreaId,beAreaLcName:getOne.beAreaLcName,beAreaEnName:getOne.beAreaEnName}:undefined
									 })}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"							
									className ={getFieldError('beAreaId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
									disabled
								>	
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200707/*付款联系人*/)}</label>
							<Select 
									{...getNFieldProps('payLinkId',{
										rules: [{required:true}],
										initialValue:getOne["payLink"+language]?{s_label:getOne["payLink"+language],payLinkId:getOne.payLinkId,payLinkLcName:getOne.payLinkLcName,payLinkEnName:getOne.payLinkEnName}:undefined
									 })}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"							
									className ={getFieldError('payLinkId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
									onClick={this.fLinkClick}
								>	
									{this.state.fLinkArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, payLinkId:o.id, payLinkLcName:o.localName, payLinkEnName:o.name}} title={o.name}>{o.name}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}><span>*</span>{i18n.t(200166/*收货人地址*/)}</label>
							<input placeholder=''
								   type="text" {...getFieldProps('recAddress', {
								   		rules: [{required:true}],
						                initialValue:getOne.recAddress?getOne.recAddress:''
						            })} 
								className={getFieldError('recAddress')?'col-md-10 col-lg-10 text-input-nowidth error-border':'col-md-10 col-lg-10 text-input-nowidth'} 
							 />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100096/*美国制裁*/)}</label>
							<Select 
									{...getNFieldProps('sacInUsMark',{
										initialValue:getOne.sacInUsMark?{s_label:getOne.sacInUsMark?i18n.t(100141/*是*/):i18n.t(100142/*否*/),sacInUsMark:getOne.sacInUsMark}:i18n.t(100142/*否*/)
									 })}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"							
									className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
									disabled
								>	
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200708/*客户采购员*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( beFieldValue.salBeId)}
                                                 refreshMark={beFieldValue.salBeId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/entContact/getByBeIdDataTyId',
                                                     params: {beId: beFieldValue.salBeId,dataTyId:100}
                                                 }} fieldName="cusLinkId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["cusLink"+language]?{s_label:getOne["cusLink"+language],cusLinkId:getOne.cusLinkId,cusLinkLcName:getOne.cusLinkLcName,cusLinkEnName:getOne.cusLinkEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     cusLinkId: da.id,
                                                     cusLinkLcName: da.localName,
                                                     cusLinkEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles ={true}
                                                 className ={getFieldError('cusLinkId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500095/*通知企业*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( beFieldValue.salBeId)}
                                                 refreshMark={beFieldValue.salBeId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/partner/getListBySourceId',
                                                     params: {sourceId: beFieldValue.salBeId,dataTyId:30,isAddSelf:true}
                                                 }} fieldName="noticeBusinessId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["noticeBusiness"+language]?{s_label:getOne["noticeBusiness"+language],noticeBusinessId:getOne.noticeBusinessId,noticeBusinessLcName:getOne.noticeBusinessLcName,noticeBusinessEnName:getOne.noticeBusinessEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     noticeBusinessId: da.enterpriseId,
                                                     noticeBusinessLcName: da.enterpriseLcName,
                                                     noticeBusinessEnName: da.enterpriseEnName,
                                                     s_label: da.enterpriseLcName,
                                                     noticeLinkId:da.entContactorId,
                                                     noticeLinkLcName:da.entContactorLcName,
                                                     noticeLinkEnName:da.entContactorEnName,
                                                     noticeTel:da.phone,
                                                     noticeFax:da.fax,
                                                     noticeAddress:da.address,
                                                     noticeAddressList:da.addressList,
                                                     noticeLinkList:da.phoneList
                                                 }}>{da.enterpriseLcName}</Option>}
                                                 onChange = {this.shouhuoqyChange} reles={true}
                                                 className ={getFieldError('noticeBusinessId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500054/*通知联系人*/)}</label>
							<Select 
								 {...getNFieldProps('noticeLinkId',{
										                    initialValue:getOne["noticeLinkLcName"]?{s_label:getOne["noticeLink"+language],noticeLinkId:getOne.noticeLinkId,noticeLinkLcName:getOne.noticeLinkLcName,noticeLinkEnName:getOne.noticeLinkEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                optionFilterProp="children"							
										                className ={'currency-btn select-from-currency col-md-8 col-lg-8'}	
										            onClick={this.TzLinkClick}				
								>	
									{this.state.TzLinkArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, noticeLinkId:o.id, noticeLinkLcName:o.localName, noticeLinkEnName:o.name}} title={o.name}>{o.name}</Option>)}
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200160/*风险分类*/)}</label>
							<Select 
									{...getNFieldProps('riskTyId',{
										initialValue:getOne["riskTy"+language]?{s_label:getOne["riskTy"+language],riskTyId:getOne.riskTyId,riskTyLcName:getOne.riskTyLcName,riskTyEnName:getOne.riskTyEnName}:undefined
									 })}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"							
									className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
									disabled
								>	
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200709/*客户操作员*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( beFieldValue.salBeId)}
                                                 refreshMark={beFieldValue.salBeId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/entContact/getByBeIdDataTyId',
                                                     params: {beId: beFieldValue.salBeId,dataTyId:100}
                                                 }} fieldName="cusOLinkId"
                                                 initValueOptions={[]}
                                                 initialValue={getOne["cusOLink"+language]?{s_label:getOne["cusOLink"+language],cusOLinkId:getOne.cusOLinkId,cusOLinkLcName:getOne.cusOLinkLcName,cusOLinkEnName:getOne.cusOLinkEnName}:undefined}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     cusOLinkId: da.id,
                                                     cusOLinkLcName: da.localName,
                                                     cusOLinkEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={getFieldError('cusLinkId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200347/*通知人电话*/)}</label>
							<input placeholder=''
								   type="text" {...getFieldProps('noticeTel', {
								   		rules: [{required:true}],
						                initialValue:getOne.noticeTel?getOne.noticeTel:''
						            })} 
								className={getFieldError('noticeTel')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'} 
							 />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200348/*通知人传真*/)}</label>
							<input placeholder=''
								   type="text" {...getFieldProps('noticeFax', {
								   		rules: [{required:true}],
						                initialValue:getOne.noticeFax?getOne.noticeFax:''
						            })} 
								className={getFieldError('noticeFax')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'} 
							 />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200710/*我司发运*/)}</label>
							 <Checkbox
								        style={{lineHeight:'32px'}}
										{...getFieldProps('isCcMark',{
											initialValue:getOne.isCcMark?getOne.isCcMark:false
										})}
										checked={this.props.form.getFieldValue("isCcMark")}
							 />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200711/*提单发货方*/)}</label>
							{common}
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}><span>*</span>{i18n.t(200350/*通知人地址*/)}</label>
							<input placeholder=''
								   type="text" {...getFieldProps('noticeAddress', {
								   		rules: [{required:true}],
						                initialValue:getOne["noticeAddress"]?getOne["noticeAddress"]:''
						            })} 
								className={getFieldError('noticeAddress')?'col-md-10 col-lg-10 text-input-nowidth error-border':'col-md-10 col-lg-10 text-input-nowidth'} 
							 />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Clause;
