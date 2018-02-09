import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
//引入滚动条
import FreeScrollBar from "../../../Client/List/components/FreeScrollBar";
import AddRepeats from '../../../Client/List/components/AddRepeats';
import {addUpdateRecord,addUpdateJson} from '../../../../services/client/call';
import {I18n} from '../../../../lib/i18n';



// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { ConstVirtualSelect,Option } from '../../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language} from '../../../../services/apiCall';
import AddMoreLanguage from "../../../../components/AddMoreLanguage"; 
import NameCheck from "../../../../components/InputBoxCheck/NameCheck";


class CommonForm extends Component{

	constructor(props){
		super(props)

		// init state
		this.state = {
			data:{}, // 编辑
		};
	}


	componentDidMount(){
		this.getPage(); // 编辑
	}

	// getPage  
	getPage = ()=> {
		let that = this;
		let {getOneData} = this.props;

		if( !getOneData['id'] ) return;
		apiGet(API_FOODING_DS,'/formObject/getOne',{id:getOneData['id']},
			(response)=>{				
				that.setState({	
					data: response.data
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});			
	}

	// 保存
	onSaveAndClose = ()=>{

		let that = this;
		let {data} = this.state;
		const {form, onSaveAndClose} = this.props;
		
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_DS,'/formObject/save',Object.assign({},data,value),
					(response)=>{							
						that.props.form.resetFields(); // 清除表单
						that.props.onSaveAndClose(); // 关闭弹框
						that.props.getPage();	// 刷新页面
						ServiceTips({text: response.message,type:'success'});	
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}	
		});	
	}

	// 取消
	onCancel =()=> {
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
			this.props.form.resetFields();
		}
	}



	render(){

		let {data} = this.state;
		const {form} = this.props;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;

	


		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
					<FreeScrollBar style={{height:"320px"}} className="scroll_style">
						<div className={'addnormal'} style={{marginBottom:'10px'}}>
							<div className="girdlayout">
								<div className="row">
									<div className="form-group col-md-6">
										<label className={'col-md-3'}><span>*</span>{i18n.t(100001/*名称*/)}</label>
										<div className="col-md-9">
											<input
												style={{width:"100%"}}
												className={getFieldError('localName')?'text-input-nowidth error-border':'text-input-nowidth'}
												{...getFieldProps('localName',{
													rules:[{required:true}],
													initialValue: data.localName ? data.localName : ''
												})}											
											/>											
										</div>											

									</div>
									<div className="form-group col-md-6">
										<label className={'col-md-3'}>{i18n.t(600223/*所属表单*/)}</label>
										<div className="col-md-9">
											<ConstVirtualSelect
												style={{width:'316px'}}
												form={form}
												apiType={apiPost}
												fieldName="formId"
												labelKey='localName'
												apiParams="com.fooding.fc.es.entity.Form"
												initialValue={data.form ? {s_label: data.form.localName} : undefined}
												clearable
												
											/>
										</div>
									</div>								
								</div>
								<div className="row">
									<div className="form-group col-md-6">
										<label className={'col-md-3'}><span>*</span>{i18n.t(600224/*表单类型*/)}</label>
										<div className="col-md-9">
											<ConstVirtualSelect
												style={{width:'316px'}}
												form={form}
												apiType={apiPost}
												fieldName="formObjectTypeId"
												labelKey='localName'
												apiParams="com.fooding.fc.enumeration.FormObjectType"
												initialValue={data.formObjectType ? {s_label: data.formObjectType.name} : undefined}
												clearable
												rules
											/>
										</div>
									</div>	
									<div className="form-group col-md-6">
										<label className={'col-md-3'}><span>*</span>{i18n.t(200886/*表单标识*/)}</label>
										<div className="col-md-9">
											<input
												style={{width:"100%"}}
												className={getFieldError('formIdentity')?'text-input-nowidth error-border':'text-input-nowidth'}
												{...getFieldProps('formIdentity',{
													rules:[{required:true}],
													initialValue: data.formIdentity ? data.formIdentity : ''
												})}
											/>											
										</div>																	
									</div>																
								</div>								
							</div>
						</div>
					</FreeScrollBar>
			</FormWrapper>);
	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;

