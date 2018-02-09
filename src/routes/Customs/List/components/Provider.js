import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
import {I18n} from '../../../../lib/i18n';


// common
import Select, { Option,ConstVirtualSelect } from '../../../../components/Select'; // 下拉
import ServiceTips from '../../../../components/ServiceTips'; // 提示框


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language} from '../../../../services/apiCall';



class Page extends Component{

	constructor(props){
		super(props)

		// init state
		this.state = {
					
		}
	}

	componentDidMount(){
	}


	// 保存
	onSaveAndClose = ()=> {
		let row = this.props.checkedData;
		const {form, onSaveAndClose} = this.props;
		let that = this;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiForm(API_FOODING_DS,'/customsData/connect',Object.assign(value,{id:row['id'],dataTyId:40,connectedId:row['connectedId']}),
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
	onCancel = ()=> {
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
			this.props.form.resetFields();
		}
	}


	render(){
		const {form} = this.props;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;



		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
                <div className="addnormal girdlayout">
					<div className="row">
						<div className={'col-md-10 form-group'}>
							<label className={'col-md-4'}><span>*</span>{I18n.t(200467/*供应商名称*/)}</label>
							<div className={'col-md-8'}>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    apiType={apiPost}
                                    fieldName='beId'
                                    apiUri='/enterprise/search?dataTyId=40'
                                    async={true}
                                    apiParams='keyword'
                                    rules={true}
                                    style={{width:'100%'}}
                                />
							</div>
						</div>
					</div>																						
				</div>
			</FormWrapper>);
	}
}

Page = createForm()(Page);

export default Page;
