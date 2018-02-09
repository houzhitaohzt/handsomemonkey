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
		// this.productChange = this.productChange.bind(this);
	    this.productSelect = this.productSelect.bind(this);
		this.state=this.initState();
	}
	 initState() {
        return {
        	productArray:[],
            billDtlId: null,
            productData: {},
        }
    }
	productSelect(key){
		for(var i=0;i<this.state.productArray.length;i++){
			if(this.state.productArray[i].id == key){
				// this.props.form.setFieldsValue({title:this.state.productArray[i].localName});
				return this.state.productArray[i].localName;
			}
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
        // this.productChange();
        if (data.number !== 1 && data.record) {
            this.getEditOne(data.record.billDtlId);
        }
    }

    getEditOne = billDtlId => {
        if (!billDtlId) return;
        this.setState({billDtlId});
        apiGet(API_FOODING_ERP, '/saleorder/marks/getOne', {id: billDtlId},
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
				delete value.key;
				delete value.title;
				apiPost(API_FOODING_ERP,'/saleorder/marks/save',value,(response)=>{
						this.props.onSaveAndClose();
						this.props.form.resetFields();
						this.props.onCancel();
						ServiceTips({text:response.message,type:'sucess'});
						this.setState({...this.initState()});
				},(error)=>{
						ServiceTips({text:error.message,type:'error'});
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
		if(initData.items){
			   for(var key in initData.items){
			   	    common = (<div className={'row'} key={key}>
		                <div className="form-group col-xs-12 col-md-12">
							<ConstMiniSelect form={this.props.form} initRequest={true}
                                     pbj='com.fooding.fc.ds.entity.Item'
                                     initialValue={key}
                                     className ={'currency-btn select-from-currency col-md-2 col-lg-2'}							
                    		/>
							<input type='text' className={'col-xs-10 col-md-10 text-input-nowidth'} 
								placeholder=""
								{...getFieldProps('items.'+ key,{
									initialValue:initData.items[key]
								})} />
						</div>
							</div>)
			   };
		}else {
			common = <div className={'row'}>
								                <div className="form-group col-xs-12 col-md-12">
													<ConstMiniSelect form={this.props.form}
			                                                 pbj={{
			                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
			                                                     params: {obj:'com.fooding.fc.ds.entity.Item'}
			                                                 }} fieldName="title"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["items.key"], initData, ['key'], "", this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} value={da.id}>{da.localName}</Option>}
			                                                 className ={getFieldError('colorType')?'currency-btn select-from-currency col-md-2 col-lg-2 error-border':'currency-btn select-from-currency col-md-2 col-lg-2'}							
			                                		/>
													<input type='text' className={'col-xs-10 col-md-10 text-input-nowidth'} 
														placeholder=""
														{...getFieldProps('items.'+beFieldValue,{
															initialValue:initData.mlNote ?initData.mlNote:''
														})} />
												</div>
			</div>
		}
		let content = <div></div>
			if(data.number == 0 || data.number == 1){
				content =(
						<div className={'  girdlayout'} style={{height:"344px"}}>
						  	<div className={'row'}>
								                <div className="form-group col-xs-12 col-md-12">
													<label className={'col-xs-2 col-md-2'}><span>*</span>{i18n.t(100379/*产品*/)}</label>
													<ConstMiniSelect form={this.props.form}
			                                                 pbj={{
			                                                     apiType: apiGet, host: API_FOODING_ERP, uri:'/saleorder/mtl/getList',
			                                                     params: {billId:this.props.otherData.getOne.billId}
			                                                 }} fieldName="mtlId"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["mtl"+language], initData, ['mtlId', 'mtlLcName ', 'mtlEnName'], "mtl"+language, this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     mtlId: da.mtlId,
			                                                     mtlLcName: da.mtlLcName,
			                                                     mtlEnName: da.mtlTyEnName,
			                                                     s_label: da["mtl"+language]
			                                                 }}>{da["mtl"+language]}</Option>} reles ={true}
			                                                 className ={getFieldError('mtlId')?'currency-btn select-from-currency col-md-10 col-lg-10 error-border':'currency-btn select-from-currency col-md-10 col-lg-10'}							
			                                		/>
												</div>
							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-12 col-md-12">
													<label className={'col-xs-2 col-md-2'}>{i18n.t(400130/*贴唛方*/)}</label>
													<ConstMiniSelect form={this.props.form}
			                                                 pbj={{
			                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
			                                                     params: {obj:'com.fooding.fc.enumeration.MarksStick'}
			                                                 }} fieldName="stickDirection"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["stickDirectionName"], initData, ['stickDirection', 'stickDirectionName'], "stickDirectionName", this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     stickDirection: da.id,
			                                                     stickDirectionName: da.name,
			                                                     s_label: da.name
			                                                 }}>{da.name}</Option>} reles ={true}
			                                                 className ={getFieldError('stickDirection')?'currency-btn select-from-currency col-md-10 col-lg-10 error-border':'currency-btn select-from-currency col-md-10 col-lg-10'}							
			                                		/>
												</div>
							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-12 col-md-12">
													<label className={'col-xs-2 col-md-2'}><span>*</span>{i18n.t(400131/*唛头类型*/)}</label>
													<ConstMiniSelect form={this.props.form}
			                                                 pbj={{
			                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
			                                                     params: {obj:'com.fooding.fc.enumeration.MarkType'}
			                                                 }} fieldName="markTyId"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["markTy"+language], initData, ['markTyId', 'markTyLcName', 'markTyEnName'], "markTy"+language, this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     markTyId: da.id,
			                                                     markTyLcName: da.name,
			                                                     markTyEnName: da.name,
			                                                     s_label: da.name
			                                                 }}>{da.name}</Option>} reles ={true}
			                                                 className ={getFieldError('markTyId')?'currency-btn select-from-currency col-md-10 col-lg-10 error-border':'currency-btn select-from-currency col-md-10 col-lg-10'}							
			                                		/>
												</div>
							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-12 col-md-12">
													<label className={'col-xs-2 col-md-2'}>{i18n.t(400132/*颜色*/)}</label>
													<ConstMiniSelect form={this.props.form}
			                                                 pbj={{
			                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
			                                                     params: {obj:'com.fooding.fc.enumeration.MarksColor'}
			                                                 }} fieldName="colorType"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["colorTypeName"], initData, ['colorType', 'colorTypeName'], "colorTypeName", this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     colorType: da.id,
			                                                     colorTypeName: da.name,
			                                                     s_label: da.name
			                                                 }}>{da.name}</Option>}
			                                                 className ={getFieldError('colorType')?'currency-btn select-from-currency col-md-10 col-lg-10 error-border':'currency-btn select-from-currency col-md-10 col-lg-10'}							
			                                		/>
												</div>
							</div>
							{common}
							
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