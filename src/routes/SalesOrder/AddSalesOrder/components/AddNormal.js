import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option,ConstMiniSelect } from '../../../../components/Select';
import DataTime from '../../../../components/Calendar/Calendar';
import  SelectChange from "../../../../components/SelectChange";
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../services/apiCall";
import xt from '../../../../common/xt'; // 下拉

class Addnormal extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState();
		this.dataChang = this.dataChang.bind(this);
	}
	dataChang(value){
		let that = this;
		let {getFieldValue,setFieldsValue}=this.props.form;
		let billDate = value;
		let payTrmId = getFieldValue("payTrmId",{}).payTrmId;
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
	initState(){
		return {
			radioState:'',
			radioAddress:'',
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
	componentDidMount(){
	}
	render(){
		const {radioAddress, radioState} = this.state;
		let {getFieldProps,getNFieldProps,getFieldError,getFieldValue} = this.props.form;
		let {getOne} = this.props;
		console.log(getFieldValue("salBeId",{}).salBeId);
		return(
			<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span>{i18n.t(100138/*常规*/)}</span>
					<span onClick={this.props.backClick}><i className={'foddingicon fooding-back'}></i></span>
					<span onClick={this.props.saveClick}><i className={'foddingicon fooding-save'}></i></span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400048/*单据编号*/)}</label>
							<input
								   type="text" {...getFieldProps('no', {
						                initialValue:getOne.no ? getOne.no:''
						            })}
								disabled
								className={'col-md-8 col-lg-8 text-input-nowidth'}
							 />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400049/*业务状态*/)}</label>
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
					</div>
					<div className={'row'}>

						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200165/*销售总额*/)}</label>
							<input
								   type="text" {...getFieldProps('saleTaxAmt', {
						                initialValue:getOne.saleTaxAmt?toDecimal(getOne.saleTaxAmt):''
						            })}
						        disabled
								className={'col-md-8 col-lg-8 text-input-nowidth'}
							 />
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200244/*利润率*/)}</label>
							<input
								   type="text" {...getFieldProps('orderRate', {
						                initialValue:getOne.orderRate?getOne.orderRate.toFixed(2):''
						            })}
						            disabled
								className={getFieldError("orderRate")?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
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
