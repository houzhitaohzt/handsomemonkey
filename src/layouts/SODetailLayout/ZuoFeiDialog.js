import i18n from './../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../components/Form";
//引入弹层
import Dialog from '../../components/Dialog/Dialog';
import Confirm from '../../components/Dialog/Confirm';//删除弹层
//引入select插件
import Select, {Option,ConstMiniSelect} from '../../components/Select';
//引入table
import Table from "../../components/Table";
import NavConnect from '../../components/NavigateTabs/containers/AddContainer';
//引入分页
import Page from "../../components/Page";
import Checkbox from '../../components/CheckBox';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP} from '../../services/apiCall';
import ServiceTips from '../../components/ServiceTips'; // 提示
class Record extends Component{
	constructor(props){
		super(props)
		this.onCancel=this.onCancel.bind(this);
		var that = this;
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.state ={
			tableSources:[]
		}
	}
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
			    value = Object.assign({},value,{billId:this.props.getOne.billId});
				apiForm(API_FOODING_ERP,'/saleorder/drop',value,
					(response)=>{							
						ServiceTips({text:response.message,type:'success'});
						that.props.form.resetFields(); // 清除表单
						this.props.onCancel();
						window.location.reload();
						//this.props.onPackUp();
						
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})
	}
	componentDidMount(){
		apiGet(API_FOODING_ERP,'/saleorder/mtl/getList',{billId:this.props.getOne.billId},
			(response)=>{
				this.setState({
					tableSources:response.data
				});

		},(error)=>{

		});
	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	render(){
		const {form,data} = this.props;
		const { getFieldProps, getFieldError,getFieldValue} = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let that = this;
		return (<FormWrapper showFooter={true}  onCancel={this.onCancel} onSaveAndClose={this.onSaveAndClose}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-12 col-lg-12">
								<label className={'col-md-2 col-lg-2'}>{i18n.t(100336/*备注*/)}</label>
								<textarea placeholder=''
									 type="text" {...getFieldProps('remark', {
										    initialValue:'',
										    rules: [{required:true}]
									})} 
									className={getFieldError("remark")?'col-md-10 col-lg-10 textarea error-border':'col-md-10 col-lg-10 textarea'} 
								/>
							</div>
						</div>
					</div>
			</FormWrapper>);
	}
}

Record = createForm()(NavConnect(Record));

export default Record;


