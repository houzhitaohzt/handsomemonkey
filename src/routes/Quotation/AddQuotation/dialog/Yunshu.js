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
		this.productChange = this.productChange.bind(this);
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
				this.props.form.setFieldsValue({title:this.state.productArray[i].localName});
				return this.state.productArray[i].localName;
			}
		}
	}
	productChange(e){
		let that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Item'},(response)=>{
			this.setState({
				productArray:response.data||[]
			});
		},(error)=>{

		});
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
        this.productChange();
        if (data.number !== 1 && data.record) {
            this.getEditOne(data.record.billDtlId);
        }
    }

    getEditOne = billDtlId => {
        if (!billDtlId) return;
        this.setState({billDtlId});
        apiGet(API_FOODING_ERP, '/saleoffer/lsreqir/getOne', {id: billDtlId},
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
				apiPost(API_FOODING_ERP,'/saleoffer/lsreqir/save',value,(response)=>{
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
		let content = <div></div>
				content =(
						<div className={'  girdlayout'} style={{height:"344px"}}>
						  	<div className={'row'}>
								                <div className="form-group col-xs-12 col-md-12">
													<label className={'col-xs-2 col-md-2'}><span>*</span>{i18n.t(200339/*运输要求*/)}</label>
													<ConstMiniSelect form={this.props.form}
			                                                 pbj={{
			                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
			                                                     params: {obj:'com.fooding.fc.ds.entity.Proptype'}
			                                                 }} fieldName="isRequId"
			                                                 initValueOptions={[]}
			                                                 initialValue={
			                                                 	xt.initSelectValue(initData["isRequ"+language], initData, ['isRequId', 'isRequLcName','isRequEnName'], "isRequ"+language, this.props.form)}
			                                                 optionValue={(da, di) => <Option key={di} objValue={{
			                                                     isRequId: da.id,
			                                                     isRequLcName : da.localName,
			                                                     isRequEnName :da.name,
			                                                     s_label: da.name
			                                                 }}>{da.localName}</Option>} reles ={true}
			                                                 className ={'currency-btn select-from-currency col-md-9 col-lg-9'}							
			                                		/>
												</div>
							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-12 col-md-12">
													<label className={'col-xs-2 col-md-2'}>{i18n.t(100148/*注释*/)}</label>
													<textarea
														{...getFieldProps('instructions',{
																		initialValue:initData.instructions ?initData.instructions:''
														})}
														placeholder=""
														className={'col-md-9 col-lg-9 text-input-nowidth'}
														style={{resize:'none',height:'65px'}}
													>
													</textarea>
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