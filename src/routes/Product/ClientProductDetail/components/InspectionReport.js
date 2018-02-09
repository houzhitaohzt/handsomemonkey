import i18n from './../../../../lib/i18n';
import React,{Component,PorpTypes} from "react"
//引入select插件
import Select, { Option, ConstMiniSelect } from '../../../../components/Select';
//引入表格
import Table from "../../../../components/Table";
import Checkbox from "../../../../components/CheckBox";
import Calendar from  '../../../../components/Calendar/Calendar';
import {createForm,FormWrapper} from '../../../../components/Form';
import Confirm from '../../../../components/Dialog/Confirm';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
export class InspectionReport extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.data = null;
		this.state = {
			testBe:[]
		}
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
		let {testItems,testMeths,servBes,tradruleTest} = initData;
		this.data = Object.assign({},tradruleTest);
		let content;
		if(data.number == 0 || data.number == 1){
			content = <div className='scroll scroll-style girdlayout'>
						<div className='addradio row'>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}><span  style={{paddingRight:10,color:'red',verticalAlign: 'middle'}}>*</span>{i18n.t(200337/*检测项目*/)}</label>
							<Select 
									{...getNFieldProps('testItmId',{
						                    rules: [{required:true}],
						                    initialValue:tradruleTest&&tradruleTest.testItmId?tradruleTest.testItmId:''
									 })}
									 animation='slide-up'
									 optionFilterProp="children"
									 placeholder=''
									 optionLabelProp="children"							
									 className ={getFieldError('testItmId')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}							
							>	
									 {testItems.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						   </Select>
						</div>
						<div className="form-group col-xs-6 col-md-6">
						   <label className={'col-xs-3 col-md-3'}><span  style={{paddingRight:10,color:'red',verticalAlign: 'middle'}}>*</span>{i18n.t(200926/*检测方式*/)}</label>
							<Select 
									{...getNFieldProps('testMthId',{
						                    rules: [{required:true}],
						                    initialValue:tradruleTest&&tradruleTest.testMthId ?tradruleTest.testMthId :''
									 })}
									 animation='slide-up'
									 optionFilterProp="children"
									 placeholder=''
									 optionLabelProp="children"							
									 style={{width:300,marginRight:15}}
									 className ={getFieldError('testMthId')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}							
							>	
									 {testMeths.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						   </Select>
						</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}><span  style={{paddingRight:10,color:'red',verticalAlign: 'middle'}}>*</span>{i18n.t(200338/*检测机构*/)}</label>
								<ConstMiniSelect form={this.props.form} pbj={{
	                                    uri: '/object/getMiniList',
	                                    params: {"obj":"com.fooding.fc.ds.entity.ServBe",
	                                    	"queryParams":[{
		                                    	"attr":"beDataMulDivIds",
		                                    	"expression":"oin",
		                                    	"value":40
		                                    }]}
	                                }} 
	                                fieldName="testBeId" 
	                                initValueOptions={[]} 
	                                initRequest={true}
	                                reles={true}
	                                className ={'currency-btn select-from-currency col-md-9 col-lg-9'}   
	                                initialValue={tradruleTest&&tradruleTest.testBeId?tradruleTest.testBeId :''} reles={true}
	                            />
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
export default createForm()(InspectionReport);