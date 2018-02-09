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
export class ProductNav extends Component{
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
		let {packagings,tradrulePack} = initData;
		this.data = Object.assign({},tradrulePack);
		let content;
		if(data.number == 0 || data.number == 1){
			content = <div className='scroll scroll-style'>
						<div className='addradio'>
							<Checkbox {...getNFieldProps('dfutMrk',{
										    initialValue:tradrulePack&&tradrulePack.dfutMrk?tradrulePack.dfutMrk:false
									 })}
								checked={this.props.form.getFieldValue("dfutMrk")}
							/>
							<label><span  style={{paddingRight:10,color:'red',verticalAlign: 'middle'}}>*</span>{i18n.t(200924/*指定包装*/)}</label>
							<Select 
									{...getNFieldProps('packId',{
						                    rules: [{required:true}],
						                    initialValue:tradrulePack&&tradrulePack.packId?tradrulePack.packId:''
									 })}
									 animation='slide-up'
									 optionFilterProp="children"
									 placeholder=''
									 optionLabelProp="children"							
									 style={{width:300,marginRight:15}}
									 className ={getFieldError('packId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}							
							>	
									 {packagings.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
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
const ProductForm =createForm()(ProductNav);
export default ProductForm;