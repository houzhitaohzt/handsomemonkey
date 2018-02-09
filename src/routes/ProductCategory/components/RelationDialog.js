import i18n from './../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
//引入弹层
import Dialog from '../../../components/Dialog/Dialog';
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../components/Select';
import {I18n} from '../../../lib/i18n';
//引入ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import ProductSelect, {ProductName} from "../../../components/FindGridSelect";
class RelationDialog extends Component{
	constructor(props){
		super(props)
		this.onSaveAdd=this.onSaveAdd.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){},
		onSaveAdd(){}
	}
	componentDidMount(){

	}
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				 value = Object.assign({},value,{mtlGroupId:that.props.mtlGroupId});
				apiForm(API_FOODING_DS,"/dataMulDiv2/saveMtlName",value,response => {
					ServiceTips({text:response.message,type:"success"})
					onSaveAndClose();
					that.props.form.resetFields();					
				},error => ServiceTips({text:error.message,type:'error'}))
			}
		})
	}
	onSaveAdd(){
		let that = this;
		const {form, onSaveAdd} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				 value = Object.assign({},{mtlGroupId:that.props.mtlGroupId},value);
				apiForm(API_FOODING_DS,"/dataMulDiv2/saveMtlName",value,response => {
					ServiceTips({text:response.message,type:"success"})
					that.props.form.resetFields();					
				},error => ServiceTips({text:error.message,type:'error'}))
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

	render(){
		const {form} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} onSaveAdd={this.onSaveAdd} showSaveAdd={true}>
				<div className={'girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-2 col-md-2'}><span>*</span>{i18n.t(500061/*产品名称*/)}</label>
							<ProductName
								ref ="productSelect"
								form={this.props.form}
								width={'379%'}
								fieldName ='mtlNameId'
								className={'currency-btn select-from-currency text-input-nowidth'}
								titleClass={"col-xs-8 col-md-8"}
								apiUri='/mtlType/search'
							/>
						</div>
					</div>
				</div>
			</FormWrapper>);
	}
}

RelationDialog = createForm()(RelationDialog);

export default RelationDialog;

