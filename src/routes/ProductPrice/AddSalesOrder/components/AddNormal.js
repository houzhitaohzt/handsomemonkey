import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option,ConstMiniSelect } from '../../../../components/Select';
import DataTime from '../../../../components/Calendar/Calendar';
import  SelectChange from "../../../../components/SelectChange";
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../services/apiCall";
import xt from '../../../../common/xt'; // 下拉
import ProductSelect from '../../../../components/FindGridSelect';
import Checkbox from "../../../../components/CheckBox";
class Addnormal extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState();
		this.productSelect = this.productSelect.bind(this);
		this.gangkouClick =this.gangkouClick.bind(this);
	}
	productSelect(item){
		let that = this;
		apiGet(API_FOODING_DS,'/material/getProductInforErp',{mtlType:'pmtl',id:item.id},(response)=>{
			let objValue = Object.assign({},that.props.getOne,response.data);
			that.props.setGetOne(objValue);
		},(error)=>{

		})
		
	}
	initState(){
		return {
			radioState:'',
			radioAddress:'',
			gangkouArray:[]
		}
	}
	StateChange(e){
		let tex;
		tex = e.target.value;
		this.setState({
			radioState:tex
		})
	}
	gangkouClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.StatnType'},
		(response)=>{
				that.setState({
					gangkouArray:response.data
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
	componentDidMount(){
	}
	render(){
		const {radioAddress, radioState} = this.state;
		let {getFieldProps,getNFieldProps,getFieldError,getFieldValue} = this.props.form;
		let {getOne} = this.props;
		return(
			<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span>{i18n.t(100138/*常规*/)}</span>
					<span onClick={this.props.saveClick}><i className={'foddingicon fooding-save'}></i></span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400048/*单据编号*/)}</label>
							<input placeholder=''
								   type="text" {...getFieldProps('no', {
						                initialValue:getOne.no ? getOne.no:''
						            })} 
								disabled
								className={'col-md-8 col-lg-8 text-input-nowidth'} 
							 />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100323/*业务日期*/)}</label>
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
							<Select
								placeholder=""
								{...getNFieldProps('status',{
										rules: [{required:true}],
										initialValue:getOne.statusName?{s_label:getOne.statusName,status:getOne.status}:undefined
								 })}
								className ='currency-btn select-from-currency col-md-8 col-lg-8'
								disabled
							>
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(500125/*货币*/)}</label>
							<ConstMiniSelect form={this.props.form}
												refreshMark={getFieldValue("salBeId",{}).salBeId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Curren'}
                                                 }} fieldName="cnyId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["cnyId"], getOne, ['cnyId', 'cnyLcName', 'cnyEnName'], "cny"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     cnyId: da.id,
                                                     cnyLcName: da.localName,
                                                     cnyEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                            />
						</div>
					</div>
					<div className ='row'>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100379/*产品*/)}</label>
							<ProductSelect 
								form={this.props.form}
								className={'text-input'}
								width={'379%'}
								value={getOne.mtlId?{id:getOne.mtlId,localName:getOne.mtlLcName,name:getOne.mtlEnName}:undefined}
								onSelect = {this.productSelect}
								url='/material/search'
								titleClass={' col-md-8 col-lg-8'}
							/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100382/*产品规格*/)}</label>
							<input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'} 
								placeholder=""
								{...getFieldProps('basSpeci',{
								initialValue:getOne.basSpeci?getOne.basSpeci:''
								})} 
								disabled
							/>

						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-xs-4 col-md-4'}>HSCODE</label>
							<input type='text' className={getFieldError("hsCode")?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} 
								placeholder=""
								{...getFieldProps('hsCode',{
									initialValue:getOne.hsCode?getOne.hsCode:''
								})}  disabled/>
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
					<div className='row'>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(500067/*包装*/)}</label>
													<ConstMiniSelect form={this.props.form}
															isRequest={Boolean( getFieldValue("mtlId",{}).mtlId)}
			                                                 refreshMark={getFieldValue("mtlId",{}).mtlId}
			                                                 pbj={{
			                                                     apiType: apiGet, host: API_FOODING_DS, uri:'/pack/getList',
			                                                     params: {sourceId: getFieldValue("mtlId",{}).mtlId}
			                                                 }} fieldName="packagId"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(getOne["packag"+language], getOne, ['packagId', 'packagLcName', 'packagEnName'],"packag"+language, this.props.form)
			                                                }
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     packagId: da.packaging.id,
			                                                     packagLcName: da.packaging.localName,
			                                                     packagEnName: da.packaging.name,
			                                                     s_label: da.packaging.localName
			                                                 }}>{da.packaging.localName}</Option>} reles ={true}
			                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
			                                		/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>交货期(天)</label>
							<input type='text' className={getFieldError("delDates")?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} 
								placeholder=""
								{...getFieldProps('delDates',{
									initialValue:getOne.delDates?getOne.delDates:''
								})}/>
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
															rules:[{required:true}],
															initialValue:getOne.statnTyEnName?{s_label:getOne.statnTyLcName,statnTyId:getOne.statnTyId,statnTyLcName:getOne.statnTyLcName,statnTyEnName:getOne.statnTyEnName}:undefined,

														})} 
														>
														{this.state.gangkouArray.map((o,i)=><Option key={i} objValue={{s_label:o.name, statnTyId:o.id,statnTyLcName:o.name,statnTyEnName:o.name}} title={o.name}>{o.name}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100297/*起运港*/)}</label>
							<ConstMiniSelect form={this.props.form}
												isRequest={Boolean( getFieldValue('statnTyId', {}).statnTyId)}
                                                 refreshMark={getFieldValue('statnTyId', {}).statnTyId}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.Statn',queryParams:[{attr:"statnTyId",expression:"=",value:getFieldValue("statnTyId",{}).statnTyId}]}
                                                 }} fieldName="sStatnId"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne["sStatn"+language] && getFieldValue('transId', {}).transId === getOne.transId, getOne, ['sStatnId', 'sStatnLcName', 'sStatnEnName'], "sStatn"+language, this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     sStatnId: da.id,
                                                     sStatnLcName: da.localName,
                                                     sStatnEnName: da.name,
                                                     s_label: da.localName
                                                 }}>{da.localName}</Option>} reles ={true}
                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                                />
						</div>
					</div>
					<div className='row'>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									showTime={false}
									isShowIcon={true}
									validate={true}
									width={'100%'}
									value={getOne.sDate||new Date()}
									form={this.props.form} 
									name={'sDate'}
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100287/*失效日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime
									showTime={false}
									isShowIcon={true}
									validate={true}
									width={'100%'}
									value={getOne.eDate}
									form={this.props.form} 
									name={'eDate'}
								/>
							</div>
						</div>
						<div className="form-group col-xs-3 col-md-3">
													<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(400035/*产品单位*/)}</label>
													<ConstMiniSelect form={this.props.form}
															isRequest={Boolean(getFieldValue("mtlId",{}).mtlId)}
			                                                 refreshMark={getFieldValue("mtlId",{}).mtlId}
			                                                 pbj={{
			                                                     apiType: apiGet, host: API_FOODING_DS, uri:'/measum/getList',
			                                                     params: {sourceId:getFieldValue("mtlId",{}).mtlId}
			                                                 }} fieldName="uomId"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(getOne["uom"+language], getOne, ['uomId', 'uomLcName', 'uomEnName'], "uom"+language, this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     uomId: da.unitofmea.id,
			                                                     uomLcName: da.unitofmea.localName,
			                                                     uomEnName: da.unitofmea.name,
			                                                     s_label: da.unitofmea.localName
			                                                 }}>{da.unitofmea.localName}</Option>} reles ={true}
			                                                 className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
			                                		/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200951/*整柜价*/)}</label>
							<input type='text' className={getFieldError("fclPrice")?'col-xs-8 col-md-8 text-input-nowidth error-border':'col-xs-8 col-md-8 text-input-nowidth'} 
								placeholder=""
								{...getFieldProps('fclPrice',{
									initialValue:getOne.fclPrice?getOne.fclPrice:'',
									rules: [{required:true}]
								})}/>
						</div>
					</div>
					<div className='row'>
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
	                             initialValue={xt.initSelectValue(getOne.contnrTypeId && getFieldValue("mtlId",getOne).mtlId, getOne, ['contnrTypeId', 'contnrTypeLcName', 'contnrTypeEnName'], 'contnrTypeLcName', this.props.form)}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                             disabled={true}
	                        />
						</div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(500343/*直销价*/)}</label>
                            <input type='text' className ={getFieldError('dsPrice')?'col-md-8 col-lg-8 text-input-nowidth  error-border':'col-md-8 col-lg-8 text-input-nowidth'}
                                   {...getFieldProps('dsPrice',{
                                       rules:[{pattern:xt.pattern.positiveNonZero}],
                                       initialValue:getOne.dsPrice?getOne.dsPrice:''
                                   })} />
                        </div>
					</div>
				</div>
			</div>
		)
	}
}

const ProductForm =Addnormal;
export default ProductForm;
