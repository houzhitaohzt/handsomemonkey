import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
import Checkbox from '../../../../components/CheckBox';
import {I18n} from '../../../../lib/i18n';
// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, {Option,ConstMiniSelect} from '../../../../components/Select'; // 下拉
import xt from '../../../../common/xt'; // 下拉
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../../services/apiCall';
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
	}
	 initState() {
        return {
        	productArray:[],
            billDtlId: null,
            productData: {},
        }
    }
	componentWillReceiveProps (props){
		let {data} = props;
        let {billDtlId} = this.state;
        let record = data.number === 1 ? null : data.record;
        if (record && record.billDtlId !== billDtlId) {
            this.getEditOne(record.billDtlId);
        }
	}

	componentDidMount() {
        let {data} = this.props;
        if (data.number !== 1 && data.record) {
            this.getEditOne(data.record.billDtlId);
        }
    }

    getEditOne = billDtlId => {
        if (!billDtlId) return;
        this.setState({billDtlId});
        apiGet(API_FOODING_ERP, '/saleorder/billreqir/getOne', {id: billDtlId},
            response => {
                this.setState({businessOne: response.data, productData: response.data});
            }, error => {
                // errorTips(error.message);
            });
    };

	onSaveAndClose(isAdd){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				if(this.props.data.number == 0){
					value = Object.assign({},this.state.businessOne,value,{billId:this.props.otherData.getOne.billId});
				}else{
					value = Object.assign({},value,{billId:this.props.otherData.getOne.billId})
				}
				apiPost(API_FOODING_ERP,'/saleorder/billreqir/save',value,(response)=>{
						this.props.onSaveAndClose();
						this.props.form.resetFields();
						this.props.onCancel();
						ServiceTips({text:response.message,type:'sucess'});
						this.setState({...this.initState()});
				},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				})
			}
	      	
    	});
	}
	onCancel(){
		this.props.form.resetFields();	
		this.setState({...this.initState()}, this.props.onCancel);
	}
	render(){
		let that = this;
		let {data} = this.props;
		let initData = this.state.productData;
		const { getNFieldProps, getFieldProps, getFieldError,getFieldValue} = this.props.form;
		let beFieldValue = this.props.form.getFieldValue("title")|| {};
		let common = <div></div>;
		let content = <div></div>
			if(data.number == 0 || data.number == 1){
				content =(
						<div className={'  girdlayout'} style={{height:"344px"}}>
						  	<div className={'row'}>
								                <div className="form-group col-xs-12 col-md-12">
													<label className={'col-xs-2 col-md-2'}><span>*</span>{i18n.t(200335/*操作人员*/)}</label>
													<ConstMiniSelect form={this.props.form}
			                                                 pbj={{
			                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
			                                                     params: {obj:'com.fooding.fc.enumeration.PersonType'}
			                                                 }} fieldName="userType"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["userTypeName"], initData, ['userType', 'userTypeName'],"userTypeName", this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     userType: da.id,
			                                                     userTypeName: da.name,
			                                                     s_label: da.name
			                                                 }}>{da.name}</Option>} reles ={true}
			                                                 className ={'currency-btn select-from-currency col-md-10 col-lg-10'}
			                                		/>
												</div>
							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-12 col-md-12">
													<label className={'col-xs-2 col-md-2'}>{i18n.t(100128/*单据要求*/)}</label>
													<ConstMiniSelect form={this.props.form}
			                                                 pbj={{
			                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
			                                                     params: {obj:'com.fooding.fc.ds.entity.TradruleBillrequ'}
			                                                 }} fieldName="billRequId"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["billRequ"+language], initData, ['billRequId','billRequLcName',"billRequEnName"], "billRequ"+language, this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     billRequId: da.id,
			                                                     billRequLcName: da.localName,
			                                                     billRequEnName:da.name,
			                                                     s_label: da.localName
			                                                 }}>{da.localName}</Option>} reles ={true}
			                                                 className ={getFieldError('billRequId')?'currency-btn select-from-currency col-md-10 col-lg-10 error-border':'currency-btn select-from-currency col-md-10 col-lg-10'}							
			                                		/>
												</div>
							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-12 col-md-12">
													<label className={'col-xs-2 col-md-2'}><span>*</span>{i18n.t(100002/*描述*/)}</label>
													<textarea
														placeholder=""
														{...getFieldProps('content',{
															initialValue:initData.content?initData.content:''
														})}
														className={'col-md-10 col-lg-10 text-input-nowidth'}
														style={{resize:'none',height:'65px'}}
													>
													</textarea>
												</div>
							</div>
						</div>)
			}
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
					<div style={{height:"344px"}} className="scroll">
						{content}
					</div>
			</FormWrapper>);
	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;