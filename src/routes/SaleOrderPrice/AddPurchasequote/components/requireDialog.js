import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option } from '../../../../components/Select';
import DataTime from  '../../../../components/Calendar/Calendar';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import ServiceTips from '../../../../components/ServiceTips';
import Calendar from  '../../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
export class AirPricePlug extends Component{
	constructor(props){
		super(props);
		this.state= this.initState(props);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.leixingClick=this.leixingClick.bind(this);
	}

	initState = (props = {}) =>{
		return {
			leixingArray:[],
			data:{},
			getOne: props.getOne || {}
		}
	};
	leixingClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.ExeNumType'},
		(response)=>{
				that.setState({
					leixingArray:response.data
				})
		},(error)=>{

		});
	}
	onSaveAndClose(isAdd){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				if(this.props.data.number== 0){
				   value = Object.assign({},this.props.getOne,value);
				}
				this.setState({...this.initState()});
	      		this.props.onSaveAndClose(value);
	      		this.props.form.resetFields();
			}
	      	
    	});
	}
	onCancel(){
		this.setState({...this.initState()});
		this.props.form.resetFields();
		this.props.onCancel();
	}
	componentWillReceiveProps(props){
		if((props.getOne || {}).billDtlId !== (this.state.getOne || {}).billDtlId){
			
			this.setState({getOne: props.getOne||{}});
		}
		
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError ,getNFieldProps} = this.props.form;
		let {getTermModes} = this.props;
		let {getOne}= this.state;
		let otherData = this.props.otherData ||{};
		let content = <div></div>;
		content =(
						<div className={'  girdlayout'} style={{height:"344px"}}>
							<div className={'row'}>
								                <div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(200939/*起始数值*/)}</label>
													<input  
											   				 type="text"
																{...getFieldProps('sNum',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue: getOne.sNum ? String(getOne.sNum) : ''})}
																className={'col-xs-9 col-md-9 text-input-nowidth'} 
													/>
												</div>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(200940/*终止数值*/)}</label>
													<input  
											   				 type="text"
																{...getFieldProps('eNum',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue: getOne.eNum ? String(getOne.eNum) : ''})}
																className={'col-xs-9 col-md-9 text-input-nowidth'} 
													/>
												</div>
							</div>
							<div className={'row'}>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(200080/*类型*/)}</label>
													<Select
														animation='slide-up'
														placeholder=''
														className ={ getFieldError("countType") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
														choiceTransitionName="rc-select-selection__choice-zoom"
														optionLabelProp="children"
														onClick={this.leixingClick}
														{...getNFieldProps('countType',{
															validateFirst: true,
															rules: [{required:true,}],
															initialValue:getOne?{s_label:getOne.countTypeName,countType:getOne.countType}:undefined,
														})}
														>
														{this.state.leixingArray.map((o,i)=><Option key={i} objValue={{s_label:o.name, countType:o.id}} title={o.name}>{o.name}</Option>)}
													</Select>
												</div>
								                <div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(200954/*金额/比例*/)}</label>
													<input  
											   				 type="text"
																{...getFieldProps('convertValue',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue:String(getOne.convertValue ? getOne.convertValue : '')})}
																className={'col-xs-9 col-md-9 text-input-nowidth'} 
													/>
												</div>
												
							</div>
							
						</div>);
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} 
					onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(AirPricePlug);
export default ProductForm;