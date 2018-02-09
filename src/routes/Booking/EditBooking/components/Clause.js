import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Select, {Option,ConstMiniSelect } from '../../../../components/Select';
import  SelectChange from "../../../../components/SelectChange";
import Checkbox from '../../../../components/CheckBox';
import DataTime from '../../../../components/Calendar/Calendar';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../services/apiCall";
import xt from '../../../../common/xt'; //
class Addnormal extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState()
	}
	initState(){
		return {
			radioState:'',
			radioAddress:''
		}
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
	render(){
		const {radioAddress, radioState} = this.state;
		let {getFieldError,getFieldProps,getFieldValue,getNFieldProps} = this.props.form;
		let {getOne} =this.props;
		let adress = this.props.getOne.addressList ||[];
		let phone = this.props.getOne.phoneList ||[];
		let freightPay = getOne.freightPay?getOne:{freightPay:10,freightPayName:'FREIGHT PREPAID'}
		return(
			<div className={'addnormal booking'} style={{marginTop:'10px'}}>
				<div className={'addnormal-title'}>
					<span>{i18n.t(200386/*发运消息*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100299/*货代公司*/)}</label>
							<ConstMiniSelect form={this.props.form}
							refreshMark = {String( 1000)}
                                     pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.AgnShipBe'}
                                          }} fieldName="forwarderBeId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["forwarderBe"+language], getOne, ['forwarderBeId', 'forwarderBeLcName', 'forwarderBeEnName'], "forwarderBe"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     forwarderBeId: da.id,
                                                     forwarderBeLcName: da.localName,
                                                     forwarderBeEnName: da.name,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200343/*货运公司*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                     pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {
														"obj":"com.fooding.fc.ds.entity.Carrier",
														"prettyMark":true
													}
                                          }} fieldName="transportBeId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["transportBe"+language], getOne, ['transportBeId', 'transportBeLcName', 'transportBeEnName'], "transportBe"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     transportBeId: da.id,
                                                     transportBeLcName: da.localName,
                                                     transportBeEnName: da.enName,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(200344/*收货人*/)}</label>
							<ConstMiniSelect form={this.props.form}
												 fieldName="revBusinessId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["revBusiness"+language] , getOne, ['revBusinessId', 'revBusinessLcName', 'revBusinessEnName'], "revBusiness"+language, this.props.form)
                                                 }
                                                 disabled
                                                 className ={'currency-btn select-from-currency col-md-10 col-lg-10'}
                                />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200345/*货代联系人*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue('forwarderBeId', {}).forwarderBeId)}
                                                 refreshMark={getFieldValue('forwarderBeId', {}).forwarderBeId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.EntprisContact',queryParams:[{attr:"enterprise.id",expression:"=",value:getFieldValue('forwarderBeId', {}).forwarderBeId}]}
                                                 }} fieldName="linkerId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["linker"+language]&&getFieldValue('forwarderBeId', {}).forwarderBeId==getOne.forwarderBeId, getOne, ['linkerId', 'linkerLcName', 'linkerEnName'], "linker"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     linkerId: da.id,
                                                     linkerLcName: da.localName,
                                                     linkerEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100376/*交易条款*/)}</label>
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
                                                     s_label: da.localName
                                                 }}
                                                 >{da.localName}</Option>}
                                                 onChange = {this.jiayiSelect}
                                                 disabled
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200163/*收货人电话*/)}</label>
							<Select
		         				{...getFieldProps('recTel', {
						                initialValue:getOne["recTel"]?getOne["recTel"]:undefined
						        })}
		          				combobox
		          				placeholder=""
		          				defaultActiveFirstOption={false}
		          				showArrow={false}
		          				notFoundContent=""
		          				filterOption={false}
		          				className={getFieldError('recTel')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
		        			>
		          				{phone.map((e,i)=>{
		          					return <Option key={i} value ={e}>{e}</Option>
		          				})}
		        			</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200164/*收货人传真*/)}</label>
							<input placeholder=''
								   type="text" {...getFieldProps('recFax', {
						                initialValue:getOne["recFax"]?getOne["recFax"]:''
						            })}
								className={getFieldError('recFax')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
							 />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100297/*起运港*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue('transId', {}).transId)}
                                                 refreshMark={getFieldValue('transId', {}).transId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Statn',queryParams:[{attr:"statnTyId",expression:"=",value:getFieldValue('transId', {}).transId}]}
                                                 }} fieldName="sStatnId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["sStatn"+language] , getOne, ['sStatnId', 'sStatnLcName', 'sStatnEnName'], "sStatn"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     sStatnId: da.id,
                                                     sStatnLcName: da.localName,
                                                     sStatnEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} disabled
                                                 className ={getFieldError('sStatnId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100298/*目的港*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue('transId', {}).transId)}
                                                 refreshMark={getFieldValue('transId', {}).transId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Statn',queryParams:[{attr:"statnTyId",expression:"=",value:getFieldValue('transId', {}).transId}]}
                                                 }} fieldName="eStatnId"
                                                 initValueOptions={[]} disabled
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["eStatn"+language], getOne, ['eStatnId', 'eStatnLcName','eStatnEnName'],"eStatn"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     eStatnId: da.id,
                                                     eStatnLcName: da.localName,
                                                     eStatnEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>}
                                                 className ={getFieldError('eStatnId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(200166/*收货人地址*/)}</label>
							 <Select
		         				{...getFieldProps('recAddress', {
						                initialValue:getOne["recAddress"]?getOne["recAddress"]:undefined
						        })}
		          				combobox
		          				placeholder=""
		          				defaultActiveFirstOption={false}
		          				showArrow={false}
		          				notFoundContent=""
		          				filterOption={false}
		          				className={getFieldError('recAddress')?'col-md-10 col-lg-10 text-input-nowidth error-border':'col-md-10 col-lg-10 text-input-nowidth'}
		        			>
		          				{adress.map((e,i)=>{
		          					return <Option key={i} value ={e}>{e}</Option>
		          				})}
		        			</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100224/*运输方式*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.enumeration.TransportType'}
                                                 }} fieldName="transId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 		xt.initSelectValue(getOne["trans"+language], getOne, ['transId', 'transLcName', 'transEnName'], "trans"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     transId: da.id,
                                                     transLcName: da.name,
                                                     transEnName: da.name,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>} disabled
                                                 className ={getFieldError('transId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500088/*装箱类型*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.enumeration.PackType'}
                                                 }} fieldName="packType"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["packTypeName"], getOne, ['packType', 'packTypeName'], 'packTypeName', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     packType: da.id,
                                                     packTypeName: da.name,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>}
                                                 className ={getFieldError('packType')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(200346/*通知人*/)}</label>
							<ConstMiniSelect form={this.props.form}
												 fieldName="noticeBusinessId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["noticeBusiness"+language] , getOne, ['noticeBusinessId', 'noticeBusinessLcName', 'noticeBusinessEnName'], "noticeBusiness"+language, this.props.form)
                                                 }
                                                 disabled
                                                 className ={'currency-btn select-from-currency col-md-10 col-lg-10'}
                            />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500090/*可否转运*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								 <Checkbox
								        style={{lineHeight:'32px'}}
										{...getFieldProps('canTransportMark',{
											initialValue:getOne.canTransportMark?getOne.canTransportMark:false
										})}
										checked={this.props.form.getFieldValue("canTransportMark")}
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500092/*提单方式*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.enumeration.BillOfLading'}
                                                 }} fieldName="billLadType"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["billLadTypeName"], getOne, ['billLadType', 'billLadTypeName'], 'billLadTypeName', this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     billLadType: da.id,
                                                     billLadTypeName: da.name,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200347/*通知人电话*/)}</label>
							 <Select
		         				{...getFieldProps('noticeTel', {
						                initialValue:getOne["noticeTel"]?getOne["noticeTel"]:undefined
						        })}
						        style={{height:'30px'}}
		          				combobox
		          				placeholder=""
		          				defaultActiveFirstOption={false}
		          				showArrow={false}
		          				notFoundContent=""
		          				filterOption={false}
		          				className={getFieldError('noticeTel')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
		        			>
		          				{phone.map((e,i)=>{
		          					return <Option key={i} value={e}>{e}</Option>
		          				})}
		        			</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200348/*通知人传真*/)}</label>
							<input placeholder=''
								   type="text" {...getFieldProps('noticeFax', {
						                initialValue:getOne.noticeFax?getOne.noticeFax:''
						            })}
								className={getFieldError('noticeFax')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
							 />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500089/*要求装运日*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									showTime={false}
									isShowIcon={true}
									validate={true}
									width={'100%'}
									value={getOne.ariveDate}
									form={this.props.form}
									name={'ariveDate'}
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200349/*免仓期申请*/)}</label>
							<input type='text'
								className={'col-md-8 col-lg-8 text-input-nowidth'}
								{...getFieldProps('frStorAgeApp',{
									initialValue:getOne.frStorAgeApp?getOne.frStorAgeApp:''
								})}
							/>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(200350/*通知人地址*/)}</label>
							 <Select
		         				{...getFieldProps('noticeAddress', {
						                initialValue:getOne["noticeAddress"]?getOne["noticeAddress"]:undefined
						        })}
		          				combobox
		          				placeholder=""
		          				defaultActiveFirstOption={false}
		          				showArrow={false}
		          				notFoundContent=""
		          				filterOption={false}
		          				className={getFieldError('noticeAddress')?'col-md-10 col-lg-10 text-input-nowidth error-border':'col-md-10 col-lg-10 text-input-nowidth'}
		        			>
		          				{adress.map((e,i)=>{
		          					return <Option key={i} value={e}>{e}</Option>
		          				})}
		        			</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200351/*集装箱号*/)}</label>
							<input type='text'
								className={'col-md-8 col-lg-8 text-input-nowidth'}
								{...getFieldProps('containerNo',{
									initialValue:getOne.containerNo?getOne.containerNo:''
								})}
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(300064/*箱型箱量*/)}</label>
							<input type='text'
								className={getFieldError("container")?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
								{...getFieldProps('container',{
									rules: [{required:true}],
									initialValue:getOne.container?getOne.container:''
								})}
							/>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(400112/*发货方*/)}</label>
							<ConstMiniSelect form={this.props.form}
												 fieldName="sendBeId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["sendBe"+language] , getOne, ['sendBeId', 'sendBeLcName', 'sendBeEnName'], "sendBe"+language, this.props.form)
                                                 }
                                                 disabled
                                                 className ={'currency-btn select-from-currency col-md-10 col-lg-10'}
                            />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500128/*运价*/)}</label>
							<input type='text'
								className={getFieldError("freightPrice")?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
								{...getFieldProps('freightPrice',{
									rules: [{required:true}],
									initialValue:getOne.freightPrice?getOne.freightPrice:''
								})}
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(201318/*运费缴付*/)}</label>
							<ConstMiniSelect form={this.props.form}
																								 pbj={{
																										 apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
																										 params: {obj:'com.fooding.fc.enumeration.FreightPay'}
																								 }} fieldName="freightPay"
																								 initValueOptions={[]}
																								 initialValue={
																									xt.initSelectValue(freightPay, freightPay, ['freightPay','freightPayName'], 'freightPayName', this.props.form)}
																								 optionValue={(da, di) => <Option key={di} objValue={{
																										 freightPay: da.id,
																										 freightPayName:da.name,
																										 s_label: da.name
																								 }}>{da.name}</Option>}
																								 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
																/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200354/*发货人电话*/)}</label>
							<Select
		         				{...getFieldProps('sendTel', {
						                initialValue:getOne["sendTel"]?getOne["sendTel"]:undefined
						        })}
		          				combobox
		          				placeholder=""
		          				defaultActiveFirstOption={false}
		          				showArrow={false}
		          				notFoundContent=""
		          				filterOption={false}
		          				className={getFieldError('sendTel')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
		        			>
		          				{phone.map((e,i)=>{
		          					return <Option key={i} value ={e}>{e}</Option>
		          				})}
		        			</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200355/*发货人传真*/)}</label>
							<input placeholder=''
								   type="text" {...getFieldProps('sendFax', {
						                initialValue:getOne["sendFax"]?getOne["sendFax"]:''
						            })}
								className={getFieldError('sendFax')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
							 />
						</div>
					</div>
					<div className='row'>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200359/*预计开船日*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									showTime={false}
									isShowIcon={true}
									validate={false}
									width={'100%'}
									value={getOne.predictSailingDate}
									form={this.props.form}
									name={'predictSailingDate'}
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200360/*预计到港日*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									showTime={false}
									isShowIcon={true}
									validate={false}
									width={'100%'}
									value={getOne.predictArrivalDate}
									form={this.props.form}
									name={'predictArrivalDate'}
								/>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(200358/*发货人地址*/)}</label>
							<Select
		         				{...getFieldProps('sendAddress', {
						                initialValue:getOne["sendAddress"]?getOne["sendAddress"]:undefined
						        })}
		          				combobox
		          				placeholder=""
		          				defaultActiveFirstOption={false}
		          				showArrow={false}
		          				notFoundContent=""
		          				filterOption={false}
		          				className={getFieldError('sendAddress')?'col-md-10 col-lg-10 text-input-nowidth error-border':'col-md-10 col-lg-10 text-input-nowidth'}
		        			>
		          				{adress.map((e,i)=>{
		          					return <Option key={i} value ={e}>{e}</Option>
		          				})}
		        			</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(200364/*拍照要求*/)}</label>
							<textarea
								placeholder=""
								{...getFieldProps('photoReq',{
										initialValue:getOne.photoReq?getOne.photoReq:''
							    })}
								className={'col-md-10 col-lg-10 text-input-nowidth'}
								style={{resize:'none',height:'150px'}}
							>
							</textarea>
						</div>
						<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-2 col-lg-2'}>{i18n.t(100336/*备注*/)}</label>
								<textarea
									placeholder=""
									{...getFieldProps('remark',{
											initialValue:getOne.remark?getOne.remark:''
								    })}
									className={'col-md-10 col-lg-10 text-input-nowidth'}
									style={{resize:'none',height:'150px'}}
								>
								</textarea>
						</div>

					</div>
				</div>
			</div>
		)
	}
}

export default Addnormal;
