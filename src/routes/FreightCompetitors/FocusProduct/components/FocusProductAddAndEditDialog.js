import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入select插件
import Select, { Option } from '../../../../components/Select';
import {I18n} from '../../../../lib/i18n';
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';

import ProductSelet from "../../../../components/FindGridSelect";
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.onSelect = this.onSelect.bind(this);
		this.productClick = this.productClick.bind(this);
		this.data = null;
		this.state = {
			specTxt:'',
			enName:"",
			productArray:[]
		}
	}
	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onSaveAndClose: PropTypes.func,
		onCancel: PropTypes.func
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){}
	}
	componentDidMount(){
	}
	onSelect(row){
		var that = this;
		that.setState({
			specTxt:row.specTxt?row.specTxt:'',
			enName:row.name?row.name:""
		})
	}
	productClick(data){
		var that = this;
		apiGet(API_FOODING_DS,'/material/search',{keyword:data},
			(response)=>{
				that.setState({
					productArray:response.data
				})
		},(error)=>{ 

		});
	}
	onSaveAndClose(){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
	      		this.props.onSaveAndClose(value,this.data);
	      		this.props.form.resetFields();
			}	      	
    	});
	}

	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	render(){
		const {form,data} = this.props;
		const { getFieldProps, getFieldError,getNFieldProps} = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
				<div className={'girdlayout scroll'} style={{overflow:'auto',height:'334px'}}>
					<div className={'row'}>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-2 col-md-2'}><span>*</span>{I18n.t(100379/*产品*/)}</label>
							<ProductSelet 
								form={this.props.form}
								onSelect={this.onSelect}
								url="/material/search"
								titleClass={"col-xs-10 col-md-10"}
							/>
						</div>
						
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100382/*产品规格*/)}</label>
							<input type="text" className={'text-input-nowidth col-xs-8 col-md-8'} placeholder={I18n.t(100382/*产品规格*/)} disabled readOnly
								{...getNFieldProps('specTxt',{
									initialValue:this.state.specTxt||''
								})} />
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100226/*英文名称*/)}</label>
							<input type="text" className={'text-input-nowidth col-xs-8 col-md-8'} placeholder={I18n.t(100226/*英文名称*/)} disabled={true} readOnly
								{...getNFieldProps('enName',{
									initialValue:this.state.enName || ""
								})} />
						</div>
					</div>
				</div>
			</FormWrapper>);
	}
}

const FocusProductAddAndEdit = createForm()(CommonForm);

export default FocusProductAddAndEdit;

