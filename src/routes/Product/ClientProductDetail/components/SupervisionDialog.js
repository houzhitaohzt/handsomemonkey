import i18n from './../../../../lib/i18n';
import React,{Component,PorpTypes} from "react"
//引入select插件
import Select, { Option , ConstMiniSelect} from '../../../../components/Select';
//引入表格
import Table from "../../../../components/Table";
import Checkbox from "../../../../components/CheckBox";
import Calendar from  '../../../../components/Calendar/Calendar';
import {createForm,FormWrapper} from '../../../../components/Form';
import Confirm from '../../../../components/Dialog/Confirm';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
export class SupervisionDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.data = null;
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				if(this.props.num == 0){
					let params = this.props.form.getFieldsValue();
					delete params['optlock'];
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				}this.props.form.resetFields();

				
			}
		})
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError,getNFieldProps} = this.props.form;
		let {data,initData} = this.props;
		let content;
		
		if(data.number == 1){
			getFieldProps('dataTyId',{
									initialValue:50,
								});
			content = (<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100102/*监装机构*/)}</label>
								<ConstMiniSelect form={this.props.form} pbj={{
	                                    uri: '/object/getMiniList',
	                                    params: {"obj":"com.fooding.fc.ds.entity.ServBe",
	                                    "queryParams":[{
	                                    	"attr":"beDataMulDivIds",
	                                    	"expression":"oin",
	                                    	"value":"70"
	                                    }]}
	                                }} fieldName="instBeId" initValueOptions={[]} initRequest={true}
	                                        className ={'currency-btn select-from-currency col-md-9 col-lg-9 '}
	                                         initialValue={''} reles={true}
	                            />
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
export default createForm()(SupervisionDialog);;