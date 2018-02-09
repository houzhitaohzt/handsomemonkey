import i18n from './../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
//引入弹层
import Dialog from '../../../components/Dialog/Dialog';
import Checkbox from '../../../components/CheckBox';
import {I18n} from '../../../lib/i18n';
// common 
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, {Option,ConstMiniSelect} from '../../../components/Select'; // 下拉
import xt from '../../../common/xt'; // 下拉
import DataTime from '../../../components/Calendar/Calendar';
import WebData from '../../../common/WebData';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
	    this.productSelect = this.productSelect.bind(this);
		this.state=this.initState();
		this.clientClick = this.clientClick.bind(this);
	}
	clientClick(data){
		if (data.trim() === '') return;
        apiPost(API_FOODING_DS, '/enterprise/search', {keyword: data}, response => {
            this.props.form.resetFields(['salBeId']);
            this.setState({clientArray: response.data || []});
        }, error => {
        })
	}
	 initState() {
        return {
        	productArray:[],
        	clientArray:[],
            billDtlId: null,
            productData: {},
        }
    }
	productSelect(key){
		for(var i=0;i<this.state.productArray.length;i++){
			if(this.state.productArray[i].id == key){
				this.props.form.setFieldsValue({title:this.state.productArray[i].localName});
				return this.state.productArray[i].localName;
			}
		}
	}
	componentDidMount() {
    }
	onSaveAndClose(isAdd){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				apiPost(API_FOODING_ERP,'/transportpremium/chargeApply',value,(response)=>{
						this.props.onSaveAndClose(response.data);
						this.props.form.resetFields();
						this.props.onCancel();
						ServiceTips({text:response.message,type:'sucess'});
						// this.setState({...this.initState()});
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
		let object = WebData.user.data.staff;
		let content = <div></div>
				content =(
						<div className={'  girdlayout'} style={{height:"344px"}}>
						  	<div className={'row'}>
								<div className="form-group col-xs-6 col-md-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500050/*付款企业*/)}</label>
									<ConstMiniSelect form={this.props.form}
											isRequest={Boolean(object.clusId)}
											refreshMark={object.clusId}
												pbj={{
																apiType: apiGet, host: API_FOODING_ES, uri:'/party/getLoginCompanies',
																params: {clusId:object.clusId}
													}} fieldName="payCcId"
															initValueOptions={[]}
															optionValue={(da, di) => <Option key={di} objValue={{
																payCcId: da.id,
																payCcLcName: da.localName,
																payCcEnName : da.name,
																s_label:da.localName
															}}>{da.localName}</Option>} reles={true}
															className ={getFieldError('payCcId')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}							
									/>
								</div>
								<div className='form-group col-xs-6 col-md-6'>
									<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(400084/*收款单位*/)}</label>
									<Select 
												{...getNFieldProps('receiptBeId',{
													initialValue:undefined,
													validateFirst: true,
													rules: [{required:true,}],
													valuedateTrigger:"onBlur"
													})}
												animation='slide-up'
												placeholder=''
												optionLabelProp="children"
												optionFilterProp="children"							
												className={getFieldError('receiptBeId')?'currency-btn select-from-currency col-md-9 col-lg-9 error-border':'currency-btn select-from-currency col-md-9 col-lg-9'}
												onSearch={this.clientClick}
											>	
												{this.state.clientArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, receiptBeId:o.id, receiptBeLcName:o.localName, receiptBeEnName:o.name}} title={o.name}>{o.name}</Option>)}
									</Select>
								</div>
							</div>
							<div className={'row'}>
								 <div className='form-group col-md-6 col-lg-6'>
													<label className='col-md-3 col-lg-3'><span>*</span>{i18n.t(500121/*费用名称*/)}</label>
													<ConstMiniSelect form={this.props.form}
					                                     pbj={{
					                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
					                                                     params: {obj:'com.fooding.fc.ds.entity.Costlvtr'}
					                                          }} fieldName="costlvtrId"
					                                                 initValueOptions={[]}
					                                                 optionValue={(da, di) => <Option key={di} objValue={{
					                                                     costlvtrId: da.id,
					                                                     costlvtrLcName: da.localName,
					                                                     costlvtrEnName: da.name,
					                                                     s_label:da.localName
					                                                 }}>{da.localName}</Option>} reles={true}
					                                                 className ={'currency-btn select-from-currency col-md-9 col-lg-9'}							
					                            />
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500125/*货币*/)}</label>
									<ConstMiniSelect form={this.props.form}
		                                                 pbj={{
		                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
		                                                     params: {obj:'com.fooding.fc.ds.entity.Curren'}
		                                                 }} fieldName="cnyId"
		                                                 initValueOptions={[]}
		                                                 optionValue={(da, di) => <Option key={di} objValue={{
		                                                     cnyId: da.id,
		                                                     cnyLcName: da.localName,
		                                                     cnyEnName: da.name,
		                                                     s_label: da.localName
		                                                 }}>{da.localName}</Option>} reles={true}
		                                                 className ={'currency-btn select-from-currency col-md-9 col-lg-9'}							
		                                />
									
								</div>
							</div>
							<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(201239/*导入日期*/)}</label>
									<div className={'col-md-9 col-lg-9'} style={{paddingRight:0}}>
										<DataTime 
											disabled={this.state.stateBol == 1}
											showTime={false}
											isShowIcon={true}
											width={'100%'}
											validate ={true}
											form={this.props.form}
											name={'uploadDate'}
										/>
									</div>
								</div>
							</div>
						</div>)
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
					<div style={{height:"344px"}} className="scroll">
						{content}
					</div>
			</FormWrapper>);
	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;