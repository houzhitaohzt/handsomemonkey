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
export class CertificateDialog extends Component{
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
		let {certfcts,tradruleCertfct} = initData;
		this.data = Object.assign({},tradruleCertfct);
		let certfct = tradruleCertfct;
		let content;
		if(data.number == 1){
			content = (<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100098/*证书*/)}</label>
                                <Select
                                    animation='slide-up'
                                    className ={ getFieldError("certifctId") ?'col-xs-8 col-lg-8 currency-btn select-from-currency error-border':'col-xs-8 col-lg-8 currency-btn select-from-currency'}
                                    choiceTransitionName="rc-select-selection__choice-zoom"
                                    optionLabelProp="children"
                                    {...getNFieldProps('certifctId',{
                                        validateFirst: true,
                                        rules: [{required:true,}],
                                        initialValue:undefined,
                                    })}>
                                    {
                                        initData.map((e,i) =>{
                                            return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
                                        })
                                    }
                                </Select>
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
export default createForm()(CertificateDialog);;