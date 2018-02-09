import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
//引入滚动条
import FreeScrollBar from "../../../Client/List/components/FreeScrollBar";
//引入select插件
import Select, { Option } from '../../../../components/Select';
import {addUpdateRecord,addUpdateJson} from '../../../../services/client/call';
import {I18n} from '../../../../lib/i18n';
import Input from '../../../../components/FormValidating/FormValidating';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import AddMoreLanguage from "../../../../components/AddMoreLanguage"; 
import NameCheck from "../../../../components/InputBoxCheck/NameCheck";
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
	}

	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func,
		initData:PropTypes.object
	}

	initState(){
		return {
			data : {},
			countryData:[]
		}
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){}
	}
	componentDidMount(){

	}
	onSaveAndClose(){
		const {form, onSaveAndClose,data} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.onSaveAndClose(Object.assign({},data,this.props.form.getFieldsValue()));
				this.props.form.resetFields();
			}
		})
	}

	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
			this.props.form.resetFields();
		}
	}
	// 国家 click
	countryClick = () => {
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Country'},
			(response)=>{							
				that.setState({	countryData: response.data });
			},(errors)=>{
				ServiceTips({text: error.message ,type: 'error'});
		});
	}
	render(){

		
		const {form,data} = this.props;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();

		let dom = ( <div className={'addnormal'} style={{marginBottom:'10px'}}>
		      			<div className="  girdlayout">
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(600215/*承运人代码*/)}</label>
							<input type="text"  className="text-input-nowidth col-md-9 col-lg-9"  
								placeholder={i18n.t(100378/*自动生成*/)}
								disabled
								{...getNFieldProps('code',{
									validateFirst: true,
									initialValue:data&&('code' in data)?data.code+'':''
								})}
							/>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span style={{color:'red'}}>*</span>{I18n.t(100087/*国家*/)}</label>
							<Select
								animation='slide-up'
								className = {getFieldError('cntryId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':' col-md-9 col-lg-9 currency-btn select-from-currency'}
								choiceTransitionName="rc-select-selection__choice-zoom"
          						optionLabelProp="children"
								{...getNFieldProps('cntryId',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:data&&data.country?{s_label:data.country.localName,cntryId:data.country.id}:undefined
								})}
								onClick = {this.countryClick}
							>
								{
									this.state.countryData.map((e,i) =>{
										return (<Option key={i} objValue={{s_label:e.localName, cntryId: e.id}} title={e.localName}>{e.localName}</Option>)
									})
								}
							</Select>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
							<NameCheck
								form={this.props.form}
								fieldName='name'
								rules={true}
								initialValue={data&&('name' in data)?data.name:''}
								className={'col-md-9 col-lg-9'}
							/>									
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100226/*英文名称*/)}</label>
							<NameCheck
								form={this.props.form}
								fieldName='enName'
								rules={true}
								isEnName={true}
								initialValue={data&&('enName' in data)?data.enName:''}
								className={'col-md-9 col-lg-9'}
							/>
						</div>
					</div>
					<div className="row">
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100002/*描述*/)}</label>
							<input type="text" placeholder={""} className="col-md-9 col-lg-9 text-input-nowidth"
								{...getNFieldProps('description',{
									initialValue:data&&('description' in data)?data.description:''
								})}
							/>
						</div>
					</div>
				</div>
				</div>)
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
						{dom}
			</FormWrapper>);
	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;

