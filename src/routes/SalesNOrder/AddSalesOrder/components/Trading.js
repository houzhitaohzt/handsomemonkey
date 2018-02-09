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
		this.zhifuSelect = this.zhifuSelect.bind(this);
		this.maixinbaoClick = this.maixinbaoClick.bind(this);
		this.jiayiSelect = this.jiayiSelect.bind(this);
		this.xinbaoChange= this.xinbaoChange.bind(this);
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

		let receiptCcValue = getFieldValue("receiptCcId") || {};
		let cnyValue = getFieldValue("cnyId") || {};
		return(
			<div className={'addnormal'} style={{marginTop:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(200834/*收款信息*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>	
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500083/*收款企业*/)}</label>
							<ConstMiniSelect form={this.props.form}
									isRequest={Boolean(getOne.clusterId)}
                                    refreshMark={getOne.clusterId}
                                     pbj={{
                                                     apiType: apiGet, host: API_FOODING_ES, uri:'/party/getLoginCompanies',
                                                     params: {clusId:getOne.clusterId}
                                          }} fieldName="receiptCcId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["receiptCc"+language], getOne, ['receiptCcId', 'receiptCcLcName', 'receiptCcEnName'], "receiptCc"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     receiptCcId: da.id,
                                                     receiptCcLcName: da.localName,
                                                     receiptCcEnName: da.name,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />
						</div>
						<div className="form-group col-md-9 col-lg-9">
							<label className={'col-md-2 col-lg-2'}><span>*</span>{i18n.t(500086/*收款账号*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean(cnyValue.cnyId&&receiptCcValue.receiptCcId)}
                                                 refreshMark={cnyValue.cnyId + ''+receiptCcValue.receiptCcId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/bankacct/getList',
                                                     params: {sourceId:receiptCcValue.receiptCcId,curcyId:cnyValue.cnyId}
                                                 }} fieldName="receBankAccountId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["receBankAccount"+language], getOne, ['receBankAccountId', 'receBankAccountLcName', 'receBankAccountEnName'], "receBankAccount"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     receBankAccountId: da.id,
                                                     receBankAccountLcName: da.bacctCode,
                                                     receBankAccountEnName: da.bacctCode,
                                                     receBankLcName:da.bankName,
                                                     receBankEnName :da.bankName,
                                                     s_label: da.bacctCode
                                                 }}>{da.bacctCode}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-10 col-lg-10'}							
                            />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Trading;
