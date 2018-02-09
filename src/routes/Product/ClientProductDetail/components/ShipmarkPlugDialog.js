import i18n from './../../../../lib/i18n';
import React,{Component,PorpTypes} from "react"
//引入select插件
import Select, { Option } from '../../../../components/Select';
//引入表格
import Table from "../../../../components/Table";
import Checkbox from "../../../../components/CheckBox";
import Calendar from  '../../../../components/Calendar/Calendar';
import {createForm,FormWrapper} from '../../../../components/Form';
import Confirm from '../../../../components/Dialog/Confirm';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import Input from '../../../../components/FormValidating/FormValidating';
export class ShipmarkPlugDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.data = null;
	}
	onSaveAndClose(){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
	      		this.props.onSaveAndClose(value,this.data);
	      		this.props.form.resetFields();
			}
    	});
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError,getNFieldProps} = this.props.form;
		let {data,initData} = this.props;
		let {items,tradruleShipmark} = initData;
		this.data = Object.assign({},tradruleShipmark);
		let content;
		if(data.number == 0 || data.number == 1){
			content = (<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100111/*标记项目*/)}</label>
								<Select
										animation='slide-up'
										onClick={this.onClick}
										placeholder=''
										className ={ getFieldError("itemId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										optionLabelProp="children"
										{...getFieldProps('itemId',{
											validateFirst: true,
											rules: [{required:true}],
											initialValue:tradruleShipmark&&tradruleShipmark.itemId?tradruleShipmark.itemId:''
										})}
										>
										{
											items.map((e,i)=>{
												return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
											})
										}
								</Select>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100148/*注释*/)}</label>
								<Input form={this.props.form} obj={{name:'itemTxt',type:'text', 
										initialValue:tradruleShipmark&&tradruleShipmark.itemTxt?tradruleShipmark.itemTxt:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
						</div>
					</div>
			</div>);
		}
		return (
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						{content}
					</FormWrapper>
		)
	}
}
export default createForm()(ShipmarkPlugDialog);;