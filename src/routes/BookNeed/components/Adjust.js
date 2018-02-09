import i18n from './../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
import { Router, Route, IndexRoute, hashHistory ,Link} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
//引入select插件
import Select, { Option } from '../../../components/Select';
import {I18n} from '../../../lib/i18n';

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES ,language,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';

class BookNeedAdjustDialog extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
	}

	static propTypes={
		form: PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func
	}

	initState(){
		return {
			billId:""
		}
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){}
	}
	//初始化数据
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		onSaveAndClose && onSaveAndClose(this.state.billId);
	}

	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	//选择单据编号时，进行请求
	onNoClick = data => {
		if(data.trim() == ""){
			this.setState({billId:""});
		}else{
			this.setState({billId:data});
		}
	}
	componentDidMount(){
		this.setState({billId:""})
	}
	componentWillReceiveProps(nextProps){
		if(this.props.billId !==nextProps.billId){
			this.setState({billId:""})
		}
  	}
	render(){
		const {form,getOne} = this.props;
		let {shippingOrder = {}, orders = [] } = getOne;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
					<div className={'  girdlayout scroll'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(400008/*销售单号*/)}</label>	
		                       	<div className={'col-md-8 col-lg-8'}>
		                       		<p className={'paragraph shengyue'}>{shippingOrder.sourceNo || ""}</p>
		                       	</div>			                            
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(100379/*产品*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
		                       		<p className={'paragraph shengyue'}>{shippingOrder.mtlLcName || ""}</p>
		                       	</div>		                            
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(400050/*调整数量*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
		                       		<p className={'paragraph shengyue'}>{shippingOrder.sOrderQty  || ""}</p>
		                       	</div>		                            
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200311/*订舱单号*/)}</label>
								<Select
									animation='slide-up'
									placeholder={''}
									className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
									choiceTransitionName="rc-select-selection__choice-zoom"
									optionLabelProp="children"
									{...getNFieldProps('billId',{
										initialValue:""
									})}
									onSelect={this.onNoClick}
								>
									<Option key={0} value={""} title={""}>{""}</Option>
								{	
									orders.map((e,i) => {
										return <Option key={e.billId} objValue={{id:String(e.billId),status:e.statusName,s_label:e.no}} title={e.no}>{e.no}</Option>
									})
								}
								</Select>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(400049/*业务状态*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
		                       		<p className={'paragraph shengyue'}>{form.getFieldValue('billId',{}).status || ""}</p>
		                       	</div>
							</div>
						</div>
					</div>						
			</FormWrapper>);
	}
}

BookNeedAdjustDialog = createForm()(BookNeedAdjustDialog);

export default BookNeedAdjustDialog;

