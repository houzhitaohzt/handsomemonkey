import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
//引入select插件
import Select, { Option } from '../../../../components/Select';
import Radio from "../../../../components/Radio";

import {I18n} from '../../../../lib/i18n';
import AddSplitNumber from "../../../../components/AddSplitNumber";

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

class CommonForm extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.spliteArr = [];
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
	getData  = (arr,e) => {
		this.spliteArr = arr;
	}
	onSaveAndClose = () => {
		let that = this;
		const { onSaveAndClose, numArr } = this.props;
		let spliteArr =[];
        this.spliteArr.map((e)=>{
        	if(parseFloat(e) > 0){spliteArr.push(parseFloat(e))}
        });
		apiPost(API_FOODING_ERP,"/purorder/split",{billId:numArr[0].billId,nums:spliteArr},response => {
			that.props.onSaveAndClose();
			ServiceTips({text:response.message,type:'success'})
		},error => ServiceTips({text:error.message,type:'error'}))	
	}
	onCancel = () => {
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	render(){
		const {form, numArr,separteCount} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
				<div className={'girdlayout scroll'} style={{height:"344px",overflow:'auto'}}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(100379/*产品*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p>{numArr[0].mtlLcName}</p>
							</div>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-3 col-md-3'}>{I18n.t(400035/*产品单位*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p>{numArr[0].uomLcName}</p>
							</div>
						</div>
					</div>
					<AddSplitNumber getData={this.getData} totalValue={Number(separteCount)}/>
				</div>
			</FormWrapper>);
	}
}

const PurchaseSplit = createForm()(CommonForm);

export default PurchaseSplit;

