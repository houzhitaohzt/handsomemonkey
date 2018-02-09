/*
	采购需求 下单
*/
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../../components/Select';
import Radio from "../../../../components/Radio";

import {I18n} from '../../../../lib/i18n';

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

class PlaceDialog extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
	}

	static propTypes={
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func
	}

	initState(){
		return {
		}
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){}
	}
	componentDidMount(){

	}
	onSaveAndClose = () => {
		let that = this;
		const { onSaveAndClose, form} = that.props;
		form.validateFields((error, value) => {
			if(error){

			}else{
				onSaveAndClose(form.getFieldsValue())
			}
		})	
	}
	onCancel = () => {
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	render(){
		const {form, initData} = this.props;
		const {purStaffs = [],suppliers =[], mtlNames=[]} = initData;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
				<div className={'girdlayout scroll'}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(400039/*操作员*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								isRequest={false}
								fieldName="staffId"
								rules
								initValueOptions={purStaffs}
								initialValue={''}
								className="col-md-9 col-lg-9"
							/>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}><span>*</span>{I18n.t(100312/*供应商*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								isRequest={false}
								fieldName="supplierId"
								rules
								initValueOptions={suppliers}
								initialValue={''}
								className="col-md-9 col-lg-9"
							/>
						</div>
					</div>
					<div className={'row'}>
					{
						mtlNames.map((e,i) => {
							return (<div className="form-group col-xs-12 col-md-12" key={i}>
							<label className={'col-xs-2 col-md-2'}></label>
							<div className={'col-xs-10 col-md-10'}>
								<p className={'paragraph'}>{e}</p>
							</div>
						</div>)
						})	
					}					
					</div>
				</div>
			</FormWrapper>);
	}
}

const PlaceForm = createForm()(PlaceDialog);

export default PlaceForm;

