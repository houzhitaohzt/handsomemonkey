import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option ,ConstMiniSelect } from '../../../../components/Select';
import DataTime from '../../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import  SelectChange from "../../../../components/SelectChange";
import xt from '../../../../common/xt'; // 下拉
class Addnormal extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState();
		this.gangkouClick =this.gangkouClick.bind(this);
		this.bizhongClick=this.bizhongClick.bind(this);
		this.saveClick = this.saveClick.bind(this);
	}
	initState(){
		return {
			radioState:'',
			radioAddress:'',
			data:{},
			info:[],
			gangkouArray:[],
			bizhongArray:[],
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



	gangkouClick(){{
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.StatnType'},
		(response)=>{
				that.setState({
					gangkouArray:response.data
				})
		},(error)=>{

		});
	}}
	bizhongClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Curren'},
		(response)=>{
				that.setState({
					bizhongArray:response.data
				})
		},(error)=>{

		});
	}
	saveClick(isclose,initAjax){
		var that = this;
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
	      		if(that.state.data.billId){
	      			value = Object.assign({},this.state.data,value);
	      		}
	      		if(this.props.id){
	      			value=Object.assign({},value,{billId:this.props.id});
	      			that.props.saveClick(value,isclose,initAjax);
	      		}else {
	      			that.props.saveClick(value,isclose,initAjax);
	      		}
			}

    	});
	}
	render(){
		const {radioAddress, radioState,data} = this.state;
		let {getNFieldProps,getFieldProps,getFieldError,getFieldValue }= this.props.form;
		let that = this;
		let {form, getOne} = this.props;
		let title = {title_1:i18n.t(100315/*约会目的*/),title_2:i18n.t(400005/*约会地址*/)}
		return(
			<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span>{i18n.t(100138/*常规*/)}</span>
					<span onClick={this.saveClick.bind(this,null)}><i className={'foddingicon fooding-save'}></i></span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400048/*单据编号*/)}</label>
							<input
											    type="text"
												{...getFieldProps('no',{
												validateFirst: true,
												rules: [{required:true}],
												initialValue: String(getOne.no || '')})}
												className={'col-xs-8 col-md-8 text-input-nowidth'}
												disabled = {true}
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									isShowIcon={true}
									showTime={false}
									width={'100%'}
									name={'billDate'}
									value={getOne.billDate}
									form={this.props.form}
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400049/*业务状态*/)}</label>
							<Select
								{...getNFieldProps('status',{
										                    rules: [{required:true}],
										                    initialValue:getOne.status?{s_label:getOne.statusName,status:getOne.status}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
										                disabled={true}
							>
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400037/*采购员*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue("porId", {}).porId)}
                                                 refreshMark={getFieldValue("porId", {}).porId}
                                                 pbj={{
                                                      apiType: apiGet, host: API_FOODING_ES, uri: '/user/getListForPermissionsInParty',
                                                     params: {partyId: getFieldValue("porId", {}).porId,typeAttributeIds:["605"]}
                                                 }} fieldName="purStaffId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne.purStaffId, getOne, ['purStaffId', 'purStaffLcName', 'purStaffEnName'], 'purStaff'+language, this.props.form)}
				                                 optionValue={da => <Option key={da.refId} objValue={{
					                                 purStaffId: da.refId,
					                                 purStaffLcName: da.staffLocalName,
					                                 purStaffEnName: da.staffEnName,
					                                 s_label: da.staffLocalName
					                             }}>{da.staffLocalName}</Option>} reles={true}
                                                 className ={getFieldError('purStaffId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
                            />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100379/*产品*/)}</label>
							<Select
	                            animation='slide-up'
	                            placeholder=""
	                            className ={getFieldError('mtlId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
	                            choiceTransitionName="rc-select-selection__choice-zoom"
	                            optionLabelProp="children"
	                            optionFilterProp='children'
	                            onSearch={this.props.noId?that.props.onProductChange:()=>{}}
	                            {...getNFieldProps('mtlId', {
						            validateFirst: true,
						            rules: [{required:true,}],
						            initialValue:{mtlId:getOne.mtlId,mtlLcName:getOne.mtlLcName,mtlEnName:getOne.mtlEnName,s_label:getOne.mtlEnName}
						        })}
						        onSelect={that.props.onProductSelect}
	                            onClick={that.props.ProductClick}
	                        >
	                            {this.props.productSelectData.map(
	                                da => <Option key={da.id} objValue={{
	                                     mtlId: da.id,
		                                 mtlLcName: da.localName,
		                                 mtlEnName: da.name,
		                                 s_label: da.localName
	                                }}>{da.localName}</Option>
	                            )}
	                        </Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100382/*产品规格*/)}</label>
								<input type='text' className={'col-md-8 col-lg-8 text-input-nowidth'} readOnly
							 {...getFieldProps('basSpeci', {
	                            initialValue:getOne.basSpeci?getOne.basSpeci:''
	                        })}/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>HSCODE</label>
							<input type='text' className ={getFieldError('hsCode')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
							{...getFieldProps('hsCode', {
	                            initialValue:getOne.hsCode?getOne.hsCode:''
	                        })}/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400012/*品牌*/)}</label>
							<ConstMiniSelect form={this.props.form}
	        					pbj='com.fooding.fc.ds.entity.Brand'
								 fieldName={"brandId"}
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                  brandId: da.id,
	                                 brandLcName: da.localName,
	                                 brandEnName: da.name,
	                                 s_label: da.localName
	                             }}>{da.localName}</Option>}
	                             initialValue={{brandId: getOne.brandId,brandLcName: getOne.brandLcName,brandEnName: getOne.brandEnName,s_label: getOne.brandLcName}}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100312/*供应商*/)}</label>
		                        <Select
	                                animation='slide-up'
	                                placeholder=""
	                                className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                                choiceTransitionName="rc-select-selection__choice-zoom"
	                                optionLabelProp="children"
	                                optionFilterProp='children'
	                                {...getNFieldProps('vndBeId', {
							            validateFirst: true,
							            rules: [{required:true,}],
							            initialValue:{vndBeId:getOne.vndBeId,vndBeEnName:getOne.vndBeEnName,vndBeLcName:getOne.vndBeLcName,s_label:getOne.vndBeLcName}
							        })}
	                                onClick={that.props.onProviderClick}
	                                onSelect={that.props.onProviderSelect}
	                            >
	                                {this.props.providerSelectData.map(
	                                    da => <Option key={da.id} objValue={{
	                                         vndBeId: da.id,
			                                 vndBeLcName: da.localName,
			                                 vndBeEnName: da.name,
			                                 s_label: da.localName
	                                    }}>{da.localName}</Option>
	                                )}
	                            </Select>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(201007/*供方联系人*/)}</label>
								<ConstMiniSelect form={this.props.form}
								refreshMark={getFieldValue("vndBeId",{}).vndBeId}
								 fieldName={'linkerId'}
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                  linkerId: da.id,
	                                 linkerLcName: da.localName,
	                                 linkerEnName: da.name,
	                                 s_label: da.localName,
	                             }}>{da.localName}</Option>} reles={true}
	                             initialValue={xt.initSelectValue(getOne.linkerId && getFieldValue("vndBeId",{}).vndBeId, getOne, ['linkerId', 'linkerLcName', 'linkerEnName'], 'linkerLcName', this.props.form)}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                             disabled = {true}
	                        />
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(201008/*供应品号*/)}</label>
			                       <input
													    type="text"
														{...getFieldProps('beMtlCode',{
														validateFirst: true,
														rules: [{required:true}],
														initialValue:getOne.beMtlCode?getOne.beMtlCode:''})}
														className={'col-xs-8 col-md-8 text-input-nowidth'}
														disabled = {true}
									/>
							</div>
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
                                                 }} fieldName="purIncotmId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["purIncotm"+language], getOne, ['purIncotmId', 'purIncotmLcName', 'purIncotmEnName'], "purIncotm"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     purIncotmId: da.id,
                                                     purIncotmLcName: da.localName,
                                                     purIncotmEnName: da.name,
                                                     s_label: da.localName,
                                                 }}
                                                 allowClear
                                                 >{da.localName}</Option>}
                                                 onChange = {this.jiayiSelect}
                                                 reles={true}
                                                 allowClear
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                                />

							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500067/*包装*/)}</label>
							<ConstMiniSelect form={this.props.form}
								refreshMark={getFieldValue("mtlId",{}).mtlId}
								 fieldName={'packagId'}
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                  packagId: da.id,
	                                 packagLcName:da.localName,
	                                 packagEnName:da.name,
	                                 s_label: da.localName,
	                             }}>{da.localName}</Option>} reles={true}
	                             initialValue={xt.initSelectValue(getOne.packagId && getFieldValue("mtlId",{}).mtlId, getOne, ['packagId', 'packagLcName', 'packagEnName'], 'packagLcName', this.props.form)}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                             disabled={true}
	                        />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>交货期(天)</label>
							<input type='text' className ={'col-md-8 col-lg-8 text-input-nowidth'}
							{...getFieldProps('delDates', {
	                            initialValue:getOne.delDates?getOne.delDates:''
	                        })} />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500125/*货币*/)}</label>
							<Select
														animation='slide-up'
														placeholder=''
														 className ={getFieldError('cnyId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
														choiceTransitionName="rc-select-selection__choice-zoom"
														optionLabelProp="children"
														onClick={this.bizhongClick}
														allowClear
														{...getNFieldProps('cnyId',{
															initialValue:getOne["cny"+language]?{s_label:getOne["cny"+language], cnyId:getOne.cnyId, cnyLcName:getOne.cnyLcName, cnyEnName:getOne.cnyEnName}:undefined,

														})}
														>
														{this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId:o.id, cnyLcName:o.localName, cnyEnName:o.name}} title={o.name}>{o.name}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100156/*港口类型*/)}</label>
							<Select
														animation='slide-up'
														placeholder=''
														 className ={getFieldError('statnTyId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
														choiceTransitionName="rc-select-selection__choice-zoom"
														optionLabelProp="children"
														onClick={this.gangkouClick}
														allowClear
														{...getNFieldProps('statnTyId',{
															initialValue:getOne?{s_label:getOne.statnTyEnName, statnTyId:getOne.statnTyId}:undefined,

														})}
														>
														{this.state.gangkouArray.map((o,i)=><Option key={i} objValue={{s_label:o.name, statnTyId:o.id, statnTyEnName:o.name}} title={o.name}>{o.name}</Option>)}
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3"  key={1}>
                    				<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(201009/*起运港口*/)}</label>
                    				<ConstMiniSelect form={this.props.form}
                    				isRequest={Boolean(getFieldValue("statnTyId",{}).statnTyId)}
									refreshMark={getFieldValue("statnTyId",{}).statnTyId}
                    					 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getList',
                                                     params: {obj:'com.fooding.fc.ds.entity.BeStatn',queryParams:[{
                                                     	attr:'statnTyId',
                                                     	expression:'=',
                                                     	value:getFieldValue("statnTyId",{}).statnTyId
                                                     },{
                                                     	attr:'sourceId',
                                                     	expression:'=',
                                                     	value:getFieldValue("vndBeId",{}).vndBeId
                                                     }]}
                                                 }}
										 fieldName="sStatnId"
			                             initValueOptions={[]}
			                             optionValue={da => <Option key={da.statn?da.statn.id:''} objValue={{
			                                  sStatnId:da.statn?da.statn.id:'',
			                                 sStatnLcName:da.statn?da.statn.localName:'',
			                                 sStatnEnName:da.statn?da.statn.name:'',
			                                 s_label:da.statn?da.statn.localName:''
			                             }} >{da.statn?da.statn.localName:''}</Option>} reles={true}
			                            initialValue={xt.initSelectValue(getOne.sStatnId,getOne,['sStatnId', 'sStatnLcName', 'sStatnEnName'], 'sStatnLcName', this.props.form)}
			                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
			                        />
			            </div>
			            <div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									isShowIcon={true}
									showTime={false}
									width={'100%'}
									name={'sDate'}
									value={getOne.sDate}
									form={this.props.form}
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100287/*失效日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									isShowIcon={true}
									showTime={false}
									width={'100%'}
									name={'eDate'}
									value={getOne.eDate}
									form={this.props.form}
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400035/*产品单位*/)}</label>
							<ConstMiniSelect form={this.props.form}
								isRequest={Boolean(getFieldValue("mtlId",{}).mtlId)}
								refreshMark={getFieldValue("mtlId",{}).mtlId}
	        					 pbj={{
									apiType:apiGet,
									 host:API_FOODING_DS,
									 uri: '/measum/getList',
									 params:{sourceId:getFieldValue("mtlId",{}).mtlId}
								}}
								 fieldName={'uomId'}
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                  uomId: da.unitofmea?da.unitofmea.id:'',
	                                 uomLcName: da.unitofmea?da.unitofmea.localName:'',
	                                 uomEnName: da.unitofmea?da.unitofmea.name:'',
	                                 s_label: da.unitofmea?da.unitofmea.localName:'',
	                             }}>{da.unitofmea?da.unitofmea.localName:''}</Option>} reles={true}
	                             initialValue={xt.initSelectValue(getOne.uomId && getFieldValue("mtlId",{}).mtlId, getOne, ['uomId', 'uomLcName', 'uomEnName'], 'uomLcName', this.props.form)}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200951/*整柜价*/)}</label>
							<input type='text' className ={'col-md-8 col-lg-8 text-input-nowidth'}
							{...getFieldProps('fclPrice', {
	                            initialValue:getOne.fclPrice?getOne.fclPrice:''
	                        })} />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100419/*默认箱型*/)}</label>
							<ConstMiniSelect form={this.props.form}
								refreshMark={getFieldValue("mtlId",{}).mtlId}
	        					 fieldName={'contnrTypeId'}
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                  contnrTypeId: da.id,
	                                 contnrTypeLcName:da.localName,
	                                 contnrTypeEnName:da.name,
	                                 s_label: da.localName,
	                             }}>{da.localName}</Option>} reles={true}
	                             initialValue={xt.initSelectValue(getOne.contnrTypeId && getFieldValue("mtlId",{}).mtlId, getOne, ['contnrTypeId', 'contnrTypeLcName', 'contnrTypeEnName'], 'contnrTypeLcName', this.props.form)}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                             disabled={true}
	                        />
						</div>
					</div>

				</div>
			</div>)

	}
}

export default Addnormal;
