import i18n from './../../../../../lib/i18n';
import React,{Component,PorpTypes} from "react"
//引入select插件
import Select, { Option ,ConstVirtualSelect} from '../../../../../components/Select';
//引入表格
import Table from "../../../../../components/Table";
import Checkbox from "../../../../../components/CheckBox";
import Calendar from  '../../../../../components/Calendar/Calendar';
import {createForm,FormWrapper} from '../../../../../components/Form';
import Confirm from '../../../../../components/Dialog/Confirm';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
import Input from '../../../../../components/FormValidating/FormValidating';
export class TransportRequire extends Component{
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
		let {proptypes,tradrulePropty} = initData;
		this.data = Object.assign({},tradrulePropty);
		let content;
		if(data.number == 0 || data.number == 1){
			content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(200434/*运输要求类型*/)}</label>
								<ConstVirtualSelect
									form={this.props.form}
									isRequest={false}
									fieldName="proptyId"
									rules
									initValueOptions={proptypes}
									initialValue={tradrulePropty&&tradrulePropty.proptyId?tradrulePropty.proptyId:''}
									className="col-md-9 col-lg-9"
								/>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}>{i18n.t(100148/*注释*/)}</label>
								<input type="text" {...getFieldProps('infoTxt', {
									initialValue:tradrulePropty&&tradrulePropty.infoTxt?tradrulePropty.infoTxt:''
								})} className ={ getFieldError("infoTxt") ?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'} />		
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
export default createForm()(TransportRequire);


/*<Select
		animation='slide-up'
		onClick={this.onClick}
		placeholder=''
		className ={ getFieldError("proptyId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
		optionLabelProp="children"
		{...getFieldProps('proptyId',{
			validateFirst: true,
			rules: [{required:true}],
			initialValue:tradrulePropty&&tradrulePropty.proptyId?tradrulePropty.proptyId:''
		})}
		>
		{
			proptypes.map((e,i)=>{
				return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
			})
		}
		
	</Select>
*/