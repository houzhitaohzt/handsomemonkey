import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, {Option,ConstVirtualSelect} from '../../../../../components/Select';
//引入ajax请求
import {API_FOODING_DS, apiPost} from "../../../../../services/apiCall";

import {I18n} from "../../../../../lib/i18n";

export class  SingleCertificateDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
        this.onCancel=this.onCancel.bind(this);
        //this.SingleCert=this.SingleCert.bind(this); //单据要求
        this.data = null;
        this.state= {
        	SingleCertArr:[] //船公司数据
        }
	}
	// SingleCert(){
	// 	this.singleCertInit()
	// }
	//每次进入弹层，初始化船公司下拉框数据
	// singleCertInit(){
	// 	let that = this;
	// 	apiPost(API_FOODING_DS,'/object/getMiniList',{
	// 		"obj":'com.fooding.fc.ds.entity.BillRequ'
	// 	},response => {
	// 		that.setState({
	// 			SingleCertArr:response.data
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
		//this.singleCertInit();
	}
	render(){
		let that = this;
		const { getNFieldProps, getFieldError } = this.props.form;
		let {data,initData} = this.props;
		const {billRequs,tradruleBillrequ} = initData;
		this.data = Object.assign({},tradruleBillrequ);
		let content;
		if(data.number == 0 || data.number == 1){
           content =(
			<div className={'girdlayout'}>
				<div className={'row'}>
					<div className="form-group col-xs-6 col-md-66">
						<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100128/*单据要求*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							fieldName="billRequId"
							rules
							apiType={apiPost}
							apiParams={{
								"obj":'com.fooding.fc.ds.entity.BillRequ',
							}}
							initValueOptions={tradruleBillrequ && tradruleBillrequ.billRequ?[{id:tradruleBillrequ.billRequ.id,localName:tradruleBillrequ.billRequ.localName}]:[]}
							initialValue={tradruleBillrequ && tradruleBillrequ.billRequId? String(tradruleBillrequ.billRequId):undefined}
							className={'col-md-9 col-lg-9'}
						/>
					</div>
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-3 col-md-3'}>{I18n.t(100148/*注释*/)}</label>
						<input type="text"
							className ={getFieldError('itemTxt')?'col-xs-9 col-md-9 text-input-nowidth error-border':'col-xs-9 col-md-9 text-input-nowidth'}
							{...getNFieldProps('itemTxt',{
								initialValue:tradruleBillrequ && tradruleBillrequ.itemTxt? tradruleBillrequ.itemTxt:'',
							})}
						/>
					</div>
				</div>
			</div>
           	);
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} showSaveAdd={!data.number == 0} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} onSaveAdd={this.onSaveAdd} width={976}>
						{content}
				</FormWrapper> 
			</div>
			);
	}
}
SingleCertificateDialog.propTypes ={
	onSaveAdd:PropTypes.func,
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
SingleCertificateDialog.defaultProps ={
	onSaveAdd(){},
	onSaveAndClose(){},
    onCancel(){}
}
const SingleCertificateDialogForm =createForm()(SingleCertificateDialog);
export default SingleCertificateDialogForm;

/*
<Select
	animation='slide-up'
	placeholder={I18n.t(100518*//*请选择单据要求*//*)}
	className ={getFieldError('billRequId')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}
	choiceTransitionName="rc-select-selection__choice-zoom"
	optionLabelProp="children"
	{...getNFieldProps('billRequId',{
		validateFirst: true,
		rules: [{required:true,}],
		initialValue:tradruleBillrequ && tradruleBillrequ.billRequId? String(tradruleBillrequ.billRequId):undefined,
	})}
	onClick={this.SingleCert}
>
	{
		this.state.SingleCertArr.map((e,i) =>{
			return (<Option key={i} value={String(e.id)} title={e.localName}>{e.localName}</Option>)
		})
	}
</Select>
*/
