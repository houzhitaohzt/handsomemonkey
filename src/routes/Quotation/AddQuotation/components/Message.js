import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option } from 'rc-select';
import  SelectChange from "../../../../components/SelectChange";
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP,toDecimal} from '../../../../services/apiCall';
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
			radioAddress:'',
			shangjiArray:[]
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
		apiGet(API_FOODING_ERP,'/common/getNoList',{billType:301},(response)=>{
			this.setState({
				shangjiArray:response.data
			});
		},(error)=>{

		});
	}
	render(){
		const {radioAddress, radioState} = this.state;
		let {getOne} = this.props;
		let {getNFieldProps,getFieldError,getFieldProps,getFieldValue} = this.props.form;
		return(
			<div className={'addnormal'} style={{marginTop:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(200712/*市场信息*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100321/*商机*/)}</label>
							<Select 
										                {...getFieldProps('businessNo',{
										                    initialValue:getOne.businessNo?getOne.businessNo:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                optionFilterProp="children"							
										                className ={getFieldError('businessNo')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}					
										            >	
										           {this.state.shangjiArray.map((o,i)=><Option key={i} objValue={{s_label:o, businessNo:o}} title={o.name}>{o}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200241/*销售报价*/)}</label>
							<Select 
									{...getNFieldProps('offerId',{
										initialValue:getOne.offerNo?{s_label:getOne.offerNo,offerNo:getOne.offerNo,offerId:getOne.offerId}:undefined
									 })}
									animation='slide-up'
									placeholder=''
								    optionLabelProp="children"
									optionFilterProp="children"							
									className ={getFieldError('offerId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}							
									disabled
								>	
							</Select>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Addnormal;
