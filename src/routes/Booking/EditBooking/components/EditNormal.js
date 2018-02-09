import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Select, {Option,ConstMiniSelect } from '../../../../components/Select';
import DataTime from '../../../../components/Calendar/Calendar';
import  SelectChange from "../../../../components/SelectChange";
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../services/apiCall";
import xt from '../../../../common/xt'; // 下拉

class Addnormal extends Component{
	constructor(props){
		super(props)
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		this.state=this.initState();
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
		return(
			<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span>{i18n.t(100138/*常规*/)}</span>
					<span onClick={this.props.backClick}><i className={'foddingicon fooding-back'}></i></span>
					<span onClick={this.props.qiaoXiaoClick}><i className={'foddingicon fooding-cancal-place'}></i></span>
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
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200332/*紧急程度*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                                 pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.enumeration.UrgencyType'}
                                                 }} fieldName="urgencyType"
                                                 initValueOptions={[]}
                                                 initialValue={
                                                 	xt.initSelectValue(getOne.urgencyType, getOne, ['urgencyType', 'urgencyTypeName'],"urgencyTypeName", this.props.form)
                                                 }
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     urgencyType: da.id,
                                                     urgencyTypeName: da.name,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>}
                                                 className ={getFieldError('urgencyType')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
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