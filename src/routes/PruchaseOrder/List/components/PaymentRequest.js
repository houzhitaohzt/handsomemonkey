import i18n from './../../../../lib/i18n';
/*
	付款申请的弹层
*/
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option } from '../../../../components/Select';
import Table from "../../../../components/Table";//Table表格
import xt from '../../../../common/xt';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

export class  PaymentRequestDialog extends Component{
	constructor(props){
		super(props);
		let that = this;
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.columns=[{
			title : i18n.t(200995/*申请单号*/),
			dataIndex : 'no',
			key : "no",
			width : '38%',
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200246/*金额*/),
			dataIndex : "orderAmt",
			key : "orderAmt",
			width : "60%",
			render(data,row,index){
				return data;
			}
		}];
	}
	//计算申请的金额
	getSomeData = () => {
		let paymentMoney = 0;
		let {setTaxAgg,billId,initTableData,cnyLcName} = this.props;
		if(!initTableData.length){
			paymentMoney = 0;
		} else{
			for(let i = 0; i < initTableData.length; i++){
				paymentMoney += Number(initTableData[i].orderAmt)
			}
		}
		return paymentMoney;
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let paymentMoney = this.getSomeData();
		let {setTaxAgg,billId,initTableData,cnyLcName} = this.props;
		return(<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976}>
				<div className="girdlayout">
					<div className="row">
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(200996/*订单币种*/)}</label>
							<input type="text" disabled value={cnyLcName || ""} className ={'col-xs-4 col-md-4 text-input-nowidth'} />
						</div>		
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(500038/*订单金额*/)}</label>
							<input type="text" disabled value={setTaxAgg || ""} className ={'col-xs-4 col-md-4 text-input-nowidth'} />
						</div>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(200997/*可申请金额*/)}</label>
							<input type="text" {...getFieldProps('amount', {
	                                initialValue:parseFloat(setTaxAgg - paymentMoney),
									rules: [{required:true,pattern: xt.pattern.positiveNonZero}],
									valuedateTrigger:"onBlur", 
	                            })} className ={getFieldError('amount')?'col-xs-4 col-md-4 text-input-nowidth error-border':'col-xs-4 col-md-4 text-input-nowidth'} placeholder={i18n.t(200998/*可申请金额最多不能大于*/) + parseInt(setTaxAgg - paymentMoney)}/>
						</div>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(200999/*已申请金额*/)}</label>
							<input type="text" disabled value={paymentMoney} className ={'col-xs-4 col-md-4 text-input-nowidth'} />
						</div>
						<Table
							columns={this.columns}
							data={initTableData}
							checkboxConfig={{show:false}}
							colorFilterConfig={{show:false,dataIndex:'colorType'}}
							followConfig={{show:false}}
							scroll={{x:true,y:150}}
						/>
					</div>
				</div>
			</FormWrapper>);
	}
	onSaveAndClose(){
		let that = this;
		const {form ,onSaveAndClose,billId,setTaxAgg} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				if(Number(value.amount).toString() === "NaN"){
					ServiceTips({text:i18n.t(400167/*请输入合理的数字！*/),type:'error'});
					return false;
				}else if(Number(value.amount) > parseFloat(setTaxAgg - that.getSomeData())){
					ServiceTips({text:i18n.t(201000/*可申请金额不能大于*/) + parseFloat(setTaxAgg - this.getSomeData())})
					return false
				}else if(!Number(value.amount)){
					ServiceTips({text:i18n.t(400168/*可申请金额不能为零*/),type:"error"})
					return false;
				}
				let valueone = Object.assign({},{billId:billId},value);
				apiForm(API_FOODING_ERP,"/purorder/payapply",valueone,response => {
					this.props.onSaveAndClose(response.data);
					this.props.form.resetFields();
				},error => {
					ServiceTips({text:error.message,type:"error"})
				})
				
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
}
PaymentRequestDialog.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
PaymentRequestDialog.defaultProps ={
	onSaveAndClose(){},
    onCancel(){}
}
const PaymentRequestForm =createForm()(PaymentRequestDialog);
export default PaymentRequestForm;
