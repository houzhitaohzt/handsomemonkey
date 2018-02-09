import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option,ConstMiniSelect } from '../../../../components/Select';
import DataTime from '../../../../components/Calendar/Calendar';
import  SelectChange from "../../../../components/SelectChange";
import {
    apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_ERP, API_FOODING_DS, pageSize, sizeList, language,
    toDecimal, hrefFunc
} from "../../../../services/apiCall";
import xt from '../../../../common/xt';
import {I18n} from "../../../../lib/i18n"; // 下拉
import ServiceTips from '../../../../components/ServiceTips';
class Addnormal extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState();
        this.clientSelect = this.clientSelect.bind(this);
		this.clientClick = this.clientClick.bind(this);
		this.onChange = this.onChange.bind(this);

	}
	onChange(e){
		if(!e){
            this.props.form.setFieldsValue({
                swiftCode:'',
                receiverName:'',
                receBankAccount:'',
                receBankLcName:'',
                bankEnAddr:''
            });
		}else{
            this.props.form.setFieldsValue({
                swiftCode:e.swift,
                receiverName:e.actStaff,
                receBankAccount:e.bacctCode,
                receBankLcName:e.bankName,
                bankEnAddr:e.bankEnAddr
            });
		}
	}


	initState(){
		return {
			radioState:'',
			radioAddress:'',
            clientArray:[],
            providerSelectData:{},
		}
	}
	clientClick(data){
		if (data.trim() === '') return;
        apiPost(API_FOODING_DS, '/enterprise/search', {keyword: data}, response => {
            this.props.form.resetFields(['salBeId']);
            this.setState({clientArray: response.data || []});
            console.log(this.state.clientArray)
        }, error => {
        })
	}
	//收款单位选择时
    clientSelect= (e,data) =>{
		console.log(data.props.objValue)
		let that = this;
		let getOne= that.props.getOne;
        const { getFieldProps, getFieldValue, getFieldError, getNFieldProps} = this.props.form;
		let receiptBeId = data.props.objValue.receiptBeId;
        apiGet(API_FOODING_DS,'/bankacct/getList',{sourceId:receiptBeId,curcyId:getOne.cnyId},response => {
        	let list =  response.data || [];
        	let filterlist = list.filter( e => !!e.dfutMrk);
        	let arr = filterlist.length == 0 ? list : filterlist;
        	if(getOne.cnyId=='583ceccbd1072ad765871494'){
                let providerOth = Object.assign({},getOne,
                    {swiftCode:arr[0] && arr[0].swiftCode ? arr[0].swiftCode : '',
                        receiverName:arr[0] && arr[0].actStaff ? arr[0].actStaff : '',
                        receBankAccount:arr[0] && arr[0].bacctCode? arr[0].bacctCode : '',
                        receBankLcName:arr[0] && arr[0].bankName ? arr[0].bankName : '',
                        receiverAddress:arr[0] && arr[0].actAddres ?arr[0].actAddres :''
                    },data.props.objValue);
                that.props.setGetOne(providerOth)

			}else{
                let providerOth = Object.assign({},getOne,
                    {swiftCode:arr[0] && arr[0].swiftCode ? arr[0].swiftCode :'',
                        receiverName:arr[0] && arr[0].actStaff ? arr[0].actStaff : '',
                        receBankAccount:arr[0] && arr[0].bacctCode ? arr[0].bacctCode :'',
                        receBankLcName: arr[0] && arr[0].bankName ? arr[0].bankName:'',
                        bankEnAddr: arr[0] && arr[0].bankadres ? arr[0].bankadres : '',
                        receiverAddress: arr[0] && arr[0].actAddres ? arr[0].actAddres : ''
                    },data.props.objValue);
                that.props.setGetOne(providerOth)
			}

          },error => {}
          )

	}
	StateChange(e){
		let tex;
		tex = e.target.value;
		this.setState({
			radioState:tex
		})
	}
	AddressChange(e){
		let addres;
		addres = e.target.value;
		this.setState({
			radioAddress:addres
		})
	}
	componentDidMount(){
	}
	render(){
		const {radioAddress, radioState} = this.state;
		let {getFieldProps,getNFieldProps,getFieldError,getFieldValue} = this.props.form;
		let {getOne} = this.props;

		// let beField = getNFieldProps('cnyId',{
		// 								rules: [{required:true}],
		// 								initialValue:getOne["cny"+language]?{s_label:getOne["cny"+language], cnyId:getOne.cnyId, cnyLcName:getOne.cnyLcName, cnyEnName:getOne.cnyEnName}:undefined
		// 							 });
		// let beFieldValue = getFieldValue("cnyId") || {};
		// let clusterId = getNFieldProps('receiptBeId',{
		// 								rules: [{required:true}],
		// 								initialValue:getOne["receiptBe"+language]?{s_label:getOne["receiptBe"+language], receiptBeId:getOne.receiptBeId, receiptBeLcName:getOne.receiptBeLcName, receiptBeEnName:getOne.receiptBeEnName}:undefined
		// 							 });
		// let clusterIdValue = getFieldValue("receiptBeId") || {};
		// let receBankId = getNFieldProps('receBankId',{
		// 								rules: [{required:true}],
		// 								initialValue:getOne["receBank"+language]?{s_label:getOne["receBank"+language], receBankId:getOne.receBankId, receBankLcName:getOne.receBankLcName, receBankEnName:getOne.receBankEnName}:undefined
		//
		// 						 });
        console.log(getFieldValue("cnyId",{cnyId:getOne.cnyId}).cnyId,getFieldValue("receiptBeId",{receiptBeId:getOne.receiptBeId}).receiptBeId)
        return(
			<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span>{i18n.t(100138/*常规*/)}</span>
					<span onClick={this.props.backClick}><i className={'foddingicon fooding-back'}></i></span>
					<span onClick={this.props.saveClick}><i className={'foddingicon fooding-save'}></i></span>
				</div>
				<div className={'girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400048/*单据编号*/)}</label>
						    <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
														placeholder=""
														{...getFieldProps('no',{
															initialValue:getOne.no?getOne.no:''
														})}
												disabled
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									showTime={false}
									isShowIcon={true}
									width={'100%'}
									value = {getOne.billDate}
									form={this.props.form}
									validate={true}
									name={'billDate'}
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400049/*业务状态*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Curren'}
                                                 }} fieldName="status"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne.statusName, getOne, ['statusName', 'status'],"statusName", this.props.form)}
                                                 reles={true} disabled
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500125/*货币*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Curren'}
                                                 }} fieldName="cnyId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne["cny"+language], getOne, ['cnyId', 'cnyLcName', 'cnyEnName'],"cny"+language, this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     cnyId: da.id,
                                                     cnyLcName: da.localName,
                                                     cnyEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles={true}
                                                 disabled
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />

						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500146/*源单类型*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 fieldName="sourceType"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne["sourceTypeName"], getOne, ['sourceType', 'sourceTypeName'],"sourceTypeName", this.props.form)}
                                                 disabled
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500129/*源单编号*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_ERP, uri: '/common/getNoList',
                                                     params: {billType:getOne.sourceType}
                                                 }} fieldName="sourceNo"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne["sourceNo"], getOne, ['sourceNo'],"sourceNo", this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     sourceNo: da.id,
                                                     s_label: da.id
                                                 }}>{da.id}</Option>} reles={true} disabled
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200841/*申请付款金额*/)}</label>
							<input type='text' className={getFieldError('orderAmt')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'}
														{...getFieldProps('orderAmt',{
															validateFirst:true,
															rules:[{required:true}],
															valuedateTrigger:'onBlur',
															initialValue:getOne.orderAmt?getOne.orderAmt:0
														})}
														disabled
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200817/*申请人*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Curren'}
                                                 }} fieldName="payStaffId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne["payStaff"+language], getOne, ['payStaffId', 'payStaffLcName', 'payStaffEnName'],"payStaff"+language, this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     payStaffId: da.id,
                                                     payStaffLcName: da.localName,
                                                     payStaffEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} disabled
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400084/*收款单位*/)}</label>
                            <Select
									{...getNFieldProps('receiptBeId',{
										rules: [{required:true}],
										initialValue:getOne["receiptBe"+language]?{s_label:getOne["receiptBe"+language], receiptBeId:getOne.receiptBeId, receiptBeLcName:getOne.receiptBeLcName, receiptBeEnName:getOne.receiptBeEnName}:undefined
									 })}
									animation='slide-up'
									placeholder={i18n.t(100477/*请搜索*/)}
								    optionLabelProp="children"
									optionFilterProp="children"
									className ={getFieldError('receiptBeId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
									onSearch={this.clientClick}
                                    onSelect={this.clientSelect}

									allowClear={false}
								>
									{this.state.clientArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, receiptBeId:o.id, receiptBeLcName:o.localName, receiptBeEnName:o.name}} title={o.name}>{o.name}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100133/*支付条款*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.TradrulePayterm'}
                                                 }} fieldName="payTrmId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne["payTrm"+language], getOne, ['payTrmId', 'payTrmLcName', 'payTrmEnName'],"payTrm"+language, this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     payTrmId: da.id,
                                                     payTrmLcName: da.localName,
                                                     payTrmEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} disabled
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500063/*付款方式*/)}</label>
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
                                                 }}>{da.localName}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500050/*付款企业*/)}</label>
							<ConstMiniSelect form={this.props.form}
														isRequest={Boolean(getOne.ccId)}
                                                 		refreshMark={getOne.ccId}
		                                                 pbj={{
		                                                     apiType: apiGet, host: API_FOODING_DS, uri: '/partner/getListBySourceId',
		                                                     params: {sourceId:getOne.ccId,dataTyId:60,isAddSelf:true}
		                                                 }} fieldName="payCcId"
		                                                 initValueOptions={[]}
		                                                  initialValue={
						                                                 	xt.initSelectValue(getOne["payCc"+language], getOne, ['payCcId', 'payCcLcName', 'payCcEnName'], "payCc"+language, this.props.form)
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
					<div className = 'row'>
						{getOne.cnyId != '583ceccbd1072ad765871495'?
                            <div className="form-group col-md-12 col-lg-12">
                                <label className={'col-md-1 col-lg-1'}>{i18n.t(200834/*收款信息*/)}</label>
                                <ConstMiniSelect form={this.props.form}
												 allowClear={false}
                                                 isRequest={Boolean(getFieldValue("cnyId",getOne).cnyId&&getFieldValue("receiptBeId",getOne).receiptBeId)}
                                                 refreshMark={getFieldValue("cnyId",getOne).cnyId+getFieldValue("receiptBeId",getOne).receiptBeId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri:'/bankacct/getList',
                                                     params: {sourceId:getFieldValue("receiptBeId",getOne).receiptBeId,curcyId:getFieldValue("cnyId",getOne).cnyId}
                                                 }} fieldName="receBankId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne["receBank"+language]&& getFieldValue('receiptBeId', {}).receiptBeId === getOne.receiptBeId, getOne, ['receBankId', 'receBankEnName'],()=>{
                                                     return getOne["receBank"+language] +(getOne.receBankAccount?'+'+getOne.receBankAccount:'')+(getOne.receiverName?'+'+getOne.receiverName:'')+(getOne.receiverAddress?'+'+getOne.receiverAddress:'')
                                                 }, this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     bankName: da.bankName,
                                                     receBankEnName : da.bankName,
                                                     bacctCode:da.bacctCode,
                                                     actStaff:da.actStaff,
                                                     receiverAddress:da.actAddres,
                                                     bankEnAddr:da.bankadres,
                                                     swift:da.swiftCode,
                                                     s_label:da.bankName+(da.bacctCode?'+'+da.bacctCode:'')+(da.actStaff?'+'+da.actStaff:'')+(da.actAddres?'+'+da.actAddres:'')
                                                 }}>{da.bankName+(da.bacctCode?'+'+da.bacctCode:'')+(da.actStaff?'+'+da.actStaff:'')+(da.actAddres?'+'+da.actAddres:'')}</Option>}
                                                 onChange={this.onChange}
                                                 className ={'currency-btn select-from-currency col-md-11 col-lg-11'}
                                />
                            </div>
							:
							<div className="form-group col-md-12 col-lg-12">
                                <label className={'col-md-1 col-lg-1'}>{i18n.t(200834/*收款信息*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 isRequest={Boolean(getFieldValue("cnyId",getOne).cnyId&&getFieldValue("receiptBeId",getOne).receiptBeId)}
                                                 refreshMark={getFieldValue("cnyId",getOne).cnyId+getFieldValue("receiptBeId",getOne).receiptBeId}
                                                 pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri:'/bankacct/getList',
                                                     params: {sourceId:getFieldValue("receiptBeId",getOne).receiptBeId,curcyId:getFieldValue("cnyId",getOne).cnyId}
                                                 }} fieldName="receBankId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne["receBank"+language]&& getFieldValue('receiptBeId', {}).receiptBeId === getOne.receiptBeId, getOne, ['receBankId', 'receBankEnName'],()=>{
                                                     return getOne["receBank"+language] +(getOne.receBankAccount?'+'+getOne.receBankAccount:'')+(getOne.receiverName?'+'+getOne.receiverName:'')+(getOne.receiverAddress?'+'+getOne.receiverAddress:'')
                                                 }, this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     bankName: da.bankName,
                                                     receBankEnName : da.bankName,
                                                     bacctCode:da.bacctCode,
                                                     actStaff:da.actStaff,
                                                     receiverAddress:da.actAddres,
                                                     bankEnAddr:da.bankadres,
                                                     swift:da.swiftCode,
                                                     s_label:da.bankName+(da.bacctCode?'+'+da.bacctCode:'')+(da.actStaff?'+'+da.actStaff:'')+(da.actAddres?'+'+da.actAddres:'')
                                                 }}>{da.bankName+(da.bacctCode?'+'+da.bacctCode:'')+(da.actStaff?'+'+da.actStaff:'')+(da.actAddres?'+'+da.actAddres:'')}</Option>}
                                                 onChange={this.onChange}
                                                 className ={'currency-btn select-from-currency col-md-11 col-lg-11'}
                                />
                            </div>
						}

					</div>
					<div className='row'>
						 <div className="form-group col-md-3 col-lg-3">
							 	<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200856/*收款人姓名*/)}</label>
								<input type='text' className={getFieldError('receiverName')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'}
															{...getFieldProps('receiverName',{
																validateFirst:true,
																rules:[{required:true}],
																valuedateTrigger:'onBlur',
																initialValue:getOne.receiverName?getOne.receiverName:''
															})}
								/>
						 </div>
						 <div className="form-group col-md-3 col-lg-3">
							 <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500086/*收款账号*/)}</label>
							 <input type='text' className={getFieldError('receBankAccount')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'}
														 {...getFieldProps('receBankAccount',{
															 validateFirst:true,
															 rules:[{required:true}],
															 valuedateTrigger:'onBlur',
															 initialValue:getOne.receBankAccount?getOne.receBankAccount:''
														 })}
							 />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>SWIFTCODE</label>
							<input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
														{...getFieldProps('swiftCode',{
															initialValue:getOne.swiftCode?getOne.swiftCode:''
														})}
							/>
						</div>
					 <div className="form-group col-md-3 col-lg-3">
						 <label className={'col-md-4 col-lg-4'}>{i18n.t(200613/*收款银行*/)}</label>
						 <input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
													 {...getFieldProps('receBankLcName',{
														 initialValue:getOne.receBankLcName?getOne.receBankLcName:''
													 })}
						 />
					</div>
					</div>
					<div className ='row'>
						 <div className="form-group col-md-12 col-lg-12">
                                <label className={'col-md-1 col-lg-1'}><span className={getFieldValue("cnyId",getOne).cnyId != '583ceccbd1072ad765871494'?'':'none'}>*</span>{i18n.t(200822/*银行英文地址*/)}</label>
                                <input type='text' className={getFieldError('bankEnAddr')?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'}
                                       {...getFieldProps('bankEnAddr',{
                                           rules:[{required:getFieldValue("cnyId",getOne).cnyId != '583ceccbd1072ad765871494'}],
                                           initialValue:getOne.bankEnAddr?getOne.bankEnAddr:''
                                       })}
                                />
							 </div>



					</div>
					<div className = 'row'>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(200845/*款项用途*/)}</label>
							<input type='text' className={'col-xs-10 col-md-10 text-input-nowidth'}
														{...getFieldProps('remark',{
															initialValue:getOne.remark?getOne.remark:''
														})}
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400055/*纸质发票号*/)}</label>
							<input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'}
														{...getFieldProps('paperNo',{
															initialValue:getOne.paperNo?getOne.paperNo:''
														})}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const ProductForm =Addnormal;
export default ProductForm;
