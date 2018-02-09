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
export class TrayRequire extends Component{
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
		let {salvrTypes,tradrulePallet} = initData;
		this.data = Object.assign({},tradrulePallet);
		let content;
		if(data.number == 0 || data.number == 1){
			content = <div className='scroll scroll-style'>
						<div className='addradio'>
							<Checkbox {...getNFieldProps('dfutMrk',{
										    initialValue:tradrulePallet&&tradrulePallet.dfutMrk?tradrulePallet.dfutMrk:false
									 })}
								checked={this.props.form.getFieldValue("dfutMrk")}
							/>
							<label style={{marginRight:'10px'}}><span  style={{paddingLeft:'5px',paddingRight:'5px',color:'red',verticalAlign: 'middle'}}>*</span>{i18n.t(200928/*指定托盘*/)}</label>
							<Select 
									{...getNFieldProps('salvrId',{
						                    rules: [{required:true}],
						                    initialValue:String(tradrulePallet&&tradrulePallet.salvrId?tradrulePallet.salvrId:'')
									 })}
									 animation='slide-up'
									 optionFilterProp="children"
									 placeholder=''
									 optionLabelProp="children"							
									 style={{width:300,marginRight:10}}
									 allowClear={false}
									 className ={getFieldError('salvrId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}							
							>	
									 {salvrTypes.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}
						   </Select>
					</div>
				</div>;
		}
		return (
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						{content}
					</FormWrapper>
		)
	}
}
export default createForm()(TrayRequire);;