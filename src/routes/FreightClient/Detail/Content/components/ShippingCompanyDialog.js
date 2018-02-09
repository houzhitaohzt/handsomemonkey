import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, {Option,ConstVirtualSelect} from '../../../../../components/Select';
//引入ajax请求
import {API_FOODING_DS, apiPost} from "../../../../../services/apiCall";

import {I18n} from "../../../../../lib/i18n";

export class  ShippingCompanyDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
        this.onCancel=this.onCancel.bind(this);
        //this.shipBeClick=this.shipBeClick.bind(this); //船公司
        this.data = null;
        this.state= {
        	shipBeArr:[] //船公司数据
        }
	}
	// shipBeClick(){
	// 	this.shipInit()
	// }
	//每次进入弹层，初始化船公司下拉框数据
	// shipInit(){
	// 	let that = this;
	// 	apiPost(API_FOODING_DS,'/object/getMiniList',{
	// 		"obj":'com.fooding.fc.ds.entity.ServBe',
	// 		"queryParams":
	// 			[{
	// 				"attr":'beDataMulDivIds',
	// 				"expression":'oin',
	// 				"value":90
	// 			}]
	// 	},response => {
	// 		that.setState({
	// 			shipBeArr:response.data
	// 		})
	// 	},error => console.log(error.message))
	// }
	onSaveAdd(){
		const {form, onSaveAdd} = this.props;
		 form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.onSaveAdd(this.props.form.getFieldsValue(),this.data);
				this.props.form.resetFields();
			}
		})
	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.data);
				this.props.form.resetFields();
			}
		})
	}
	onCancel(){
		const {onCancel}=this.props;
        if(onCancel){
            onCancel();
            this.props.form.resetFields();
        }
	}
	componentDidMount(){
		//this.shipInit();
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {data,initData} = this.props;
		const {pickTypes,tradruleTransbe} = initData;
		this.data = Object.assign({},tradruleTransbe);
		let content;
		if(data.number == 0 || data.number == 1){
           content =(
			<div className={'girdlayout'}>
				<div className={'row'}>
					<div className="form-group col-xs-4 col-md-4">
						<label className={'col-xs-6 col-md-6'}><span>*</span>{I18n.t(100513/*固定*/)}/{I18n.t(100514/*禁止*/)}</label>
						<ConstVirtualSelect
								form={this.props.form}
								isRequest={false}
								fieldName="pickTy"
								rules
								initValueOptions={pickTypes}
								initialValue={tradruleTransbe && tradruleTransbe.pickType? tradruleTransbe.pickType.id:undefined}
								className="col-md-6 col-lg-6"
							/>
					</div>
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100515/*船公司名称*/)}</label>
						<ConstVirtualSelect
								form={this.props.form}
								fieldName="shipBeId"
								rules
								apiType={apiPost}
								apiParams={{
									"obj":"com.fooding.fc.ds.entity.Carrier",
									"prettyMark":true
								}}
								initValueOptions={tradruleTransbe && tradruleTransbe.shipBeId?[{id:tradruleTransbe.shipBeId,localName:tradruleTransbe.servBe.localName}]:[]}
								initialValue={tradruleTransbe && tradruleTransbe.shipBeId? tradruleTransbe.shipBeId:''}
								className={'col-xs-9 col-md-9'}
							/>
					</div>
				</div>
			</div>
           	);
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} showSaveAdd={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} onSaveAdd={this.onSaveAdd} width={976}>
						{content}
				</FormWrapper> 
			</div>
			);
	}
}
ShippingCompanyDialog.propTypes ={
	onSaveAdd:PropTypes.func,
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
ShippingCompanyDialog.defaultProps ={
	onSaveAdd(){},
	onSaveAndClose(){},
    onCancel(){}
}
const ShippingCompanyDialogForm =createForm()(ShippingCompanyDialog);
export default ShippingCompanyDialogForm;

/*
	<Select
		animation='slide-up'
		placeholder={""}
		className ={getFieldError('pickTy')?'currency-btn select-from-currency col-md-6 col-lg-6 error-border':'currency-btn select-from-currency col-md-6 col-lg-6'}
		choiceTransitionName="rc-select-selection__choice-zoom"
		optionLabelProp="children"
		{...getFieldProps('pickTy',{
			validateFirst: true,
			rules: [{required:true,}],
			initialValue:String(tradruleTransbe && tradruleTransbe.pickType? tradruleTransbe.pickType.id:undefined),
		})}
	>
		{
			pickTypes.map((e,i) =>{
				return (<Option key={i} value={String(e.id)} title={e.name}>{e.name}</Option>)
			})
		}
	</Select>
	<Select
		animation='slide-up'
		placeholder={""}
		className ={getFieldError('shipBeId')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}
		choiceTransitionName="rc-select-selection__choice-zoom"
		optionLabelProp="children"
		{...getFieldProps('shipBeId',{
			validateFirst: true,
			rules: [{required:true,}],
			initialValue:tradruleTransbe && tradruleTransbe.shipBeId? tradruleTransbe.shipBeId:undefined,
		})}
		onClick = {this.shipBeClick}
	>
		{
			this.state.shipBeArr.map((e,i) =>{
				return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
			})
		}
	</Select>
*/
