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
import NameCheck from "../../../../components/InputBoxCheck/NameCheck";
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
	}

	static propTypes={
		form: PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func,
	}

	initState(){
		return{
			countryData:[],
		};
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){}
	}
	componentDidMount(){

	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.onSaveAndClose(this.props.form.getFieldsValue());
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
	componentDidMount(){
		
	}
	render(){
		const {form} = this.props;
		const { getFieldProps, getFieldError , getNFieldProps} = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		const inputStar=(<span className={''}>*</span>);
		let dom = (<div className="common-add">
					<div className="row">
						<div className={'col-xs-6'}>
							<label className={'add-label'} style={{width:'90px'}}>{I18n.t(100339/*服务机构代码*/)}</label>
							<input type="text"  className="text-input"  disabled
								{...getNFieldProps('code',{
									initialValue:''
								})}
							/>
						</div>
						<div className={'col-xs-6'}>
							<label className={'add-label'}><span style={{color:'red'}}>*</span>{I18n.t(100087/*国家*/)}</label>
							<Select
								animation='slide-up'
								style={{width:320}}
								className = {getFieldError('cntryId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								choiceTransitionName="rc-select-selection__choice-zoom"
          						optionLabelProp="children"
								{...getNFieldProps('cntryId',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:undefined
								})}
								onClick = {this.countryClick}
							>
								{
									this.state.countryData.map((e,i) =>{
										return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)
									})
								}
							</Select>
						</div>
					</div>
					<div className="row">
						<div className={'col-xs-6'}>
							<label className={'add-label'} style={{width:'90px'}}>{inputStar}{I18n.t(100001/*名称*/)}</label>
							<NameCheck
								form={this.props.form}
								fieldName='name'
								rules={true}
								initialValue={''}
								style={{width:"320px"}}	
							/>		
						</div>
						<div className={'col-xs-6'}>
							<label className={'add-label'}>{inputStar}{I18n.t(100226/*英文名称*/)}</label>
							<NameCheck
								form={this.props.form}
								fieldName='enName'
								rules={true}
								isEnName={true}
								initialValue={''}
								style={{width:"320px"}}	
							/>
						</div>
					</div>
					<div className="row">
						<div className={'col-xs-6'}>
							<label className={'add-label'} style={{width:'90px'}}>{I18n.t(100002/*描述*/)}</label>
							<input type="text" placeholder={""} className="text-input"
								{...getNFieldProps('description',{
									initialValue:''									
								})}
							/>
						</div>
					</div>
				</div>)
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
					<FreeScrollBar style={{height:"344px"}} className="scroll_style">
						{dom}
					</FreeScrollBar>
			</FormWrapper>);
	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;

