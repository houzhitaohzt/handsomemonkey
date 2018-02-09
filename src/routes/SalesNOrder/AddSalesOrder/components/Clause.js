import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select';
import  SelectChange from "../../../../components/SelectChange";
import Checkbox from  '../../../../components/CheckBox';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP,API_FOODING_ES} from '../../../../services/apiCall';
import xt from '../../../../common/xt'; // 下拉
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
		this.shouhuoqyChange = this.shouhuoqyChange.bind(this);
		this.onWosiClick = this.onWosiClick.bind(this);
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
	onWosiClick(){
		let that = this;
		let object={
			  sendBeId: '',
              sendBeLcName: '',
              sendBeEnName: '',
		}
		let getOne = this.props.getOne;
		getOne = Object.assign({},getOne,object);
        that.props.setGetOne(getOne);
	}
	shouhuoqyChange(e){
		let that = this;
		let getOne = this.props.getOne;
		getOne = Object.assign({},getOne,e);
        that.props.setGetOne(getOne);
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
		if (e.salBeId === '') return;
		let that = this;
		let getOne = this.props.getOne;
		apiGet(API_FOODING_DS, '/customer/getCustInfoForErp', {id: e.salBeId}, response => {
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
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Country'},
			(response)=>{
				this.setState({
					contrnyArray:response.data
				})
			},(error)=>{

			});
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
		// console.log(clusterId);
		let {getNFieldProps,getFieldError,getFieldProps,getFieldValue} = this.props.form;
		let beField = getNFieldProps('salBeId',{
										rules: [{required:true}],
										initialValue:getOne["salBe"+language]?{s_label:getOne["salBe"+language], salBeId:getOne.salBeId, salBeLcName:getOne.salBeLcName, salBeEnName:getOne.salBeEnName}:undefined
									 });
		let beFieldValue = getFieldValue("salBeId")||{};
		let clusterId = getFieldValue("clusterId")||{};
		let adress = this.props.getOne.addressList ||[];
		let phone = this.props.getOne.phoneList ||[];
		let salBeId = getFieldValue("salBeId",{}).salBeId||getFieldValue("salBeId");
		return(
			<div className={'addnormal'} style={{marginTop:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(200034/*客户信息*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100311/*客户*/)}</label>
							<ConstVirtualSelect
			    			form={this.props.form}
			    			fieldName='salBeId'
			    		    apiUri='/customer/search'
			    			onChange={this.clientSelect}
			    		    async={true}
			                apiParams='keyword'
			                initialValue={getOne["salBe"+language]?{s_label:getOne["salBe"+language], salBeId:getOne.salBeId, salBeLcName:getOne.salBeLcName, salBeEnName:getOne.salBeEnName}:undefined}
			                valueKeys={ da => ({
			                   salBeId: da.id,
			                   salBeLcName: da.localName,
			                   salBeEnName: da.name,
			                   s_label: da.localName
			                })} rules={true}
			               disabled={getOne.billId?true:false}
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
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(201058/*付款客户*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( beFieldValue.salBeId)}
                                                 refreshMark={getFieldValue('salBeId', {}).salBeId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/partner/getListBySourceId',
                                                     params: {sourceId: beFieldValue.salBeId,dataTyId:30,isAddSelf:true}
                                                 }} fieldName="payBusinessId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["payBusiness"+language], getOne, ['payBusinessId', 'payBusinessLcName', 'payBusinessEnName'], "payBusiness"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     payBusinessId: da.enterpriseId,
                                                     payBusinessLcName: da.enterpriseLcName,
                                                     payBusinessEnName: da.enterpriseEnName,
                                                     s_label: da.enterpriseLcName
                                                 }}>{da.enterpriseLcName}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(201059/*客户订单号*/)}</label>
							<input placeholder=''
								   type="text" {...getFieldProps('beOrderNo', {
						                initialValue:getOne.beOrderNo? getOne.beOrderNo:''
						            })} 
								disabled
								className={'col-md-8 col-lg-8 text-input-nowidth'} 
							 />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400097/*价格条款*/)}</label>
								<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Incotm',queryParams:[{
                                                     	attr:'incotmTyId',
                                                     	expression:'=',
                                                     	value:20
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
                                                 }}
                                                 allowClear
                                                 >{da.localName}</Option>} 
                                                 reles={true}
                                                 allowClear
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100370/*联系人*/)}</label>
								<ConstMiniSelect form={this.props.form}
									isRequest={Boolean(getFieldValue("salBeId", {}).salBeId)}
									refreshMark={getFieldValue("salBeId", {}).salBeId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getList',
                                                     params: {"obj":"com.fooding.fc.ds.entity.EntprisContact",
													"queryParams":[{
														"attr":"enterprise._id",
														"expression":"=",
														"value":salBeId
													}]}
                                                 }} fieldName="linkId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["link"+language], getOne, ['linkId', 'linkLcName', 'linkEnName'], "link"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     linkId: da.id,
                                                     linkLcName: da.localName,
                                                     linkEnName: da.name,
                                                     s_label: da.localName,
                                                 }}
                                                 allowClear
                                                 >{da.localName}</Option>} 
                                                 reles={true}
                                                 allowClear
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400086/*承担进仓费*/)}</label>
							 <Checkbox
								        style={{lineHeight:'32px'}}
										{...getFieldProps('inStoreFee',{
											initialValue:getOne.inStoreFee?getOne.inStoreFee:false
										})}
										checked={this.props.form.getFieldValue("inStoreFee")}
										onClick={this.onWosiClick}
							 />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400087/*承担港杂*/)}</label>
							 <Checkbox
								        style={{lineHeight:'32px'}}
										{...getFieldProps('portFee',{
											initialValue:getOne.portFee?getOne.portFee:false
										})}
										checked={this.props.form.getFieldValue("portFee")}
										onClick={this.onWosiClick}
							 />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400088/*是否开票*/)}</label>
							 <Checkbox
								        style={{lineHeight:'32px'}}
										{...getFieldProps('invMark',{
											initialValue:getOne.invMark?getOne.invMark:false
										})}
										checked={this.props.form.getFieldValue("invMark")}
										onClick={this.onWosiClick}
							 />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Clause;
