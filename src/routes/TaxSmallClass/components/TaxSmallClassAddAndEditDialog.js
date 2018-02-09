import i18n from './../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
//引入弹层
//引入select插件
import Select, { Option } from 'rc-select';
import {I18n} from '../../../lib/i18n';
import Checkbox from "../../../components/CheckBox";

class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.marineClick=this.marineClick.bind(this);
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
			initData:{},
			checked:false
		}
	}

	static defaultProps={
		onSaveAndClose(){},
		onCancel(){}
	}
	marineClick(e){
		let temV = e.target.checked;
		this.setState({
			checked:temV
		})
	}
	componentDidMount(){

	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(null==errors){
				if(onSaveAndClose){
					let record= form.getFieldsValue();
					addUpdateRecord
					/*addUpdateJson*/(record,(value)=>{
						onSaveAndClose(value);
					},(msg)=>{
						console.log(msg);
					});
				}
			}
		})
	}

	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	render(){
		const {form,data} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
				<div className={'girdlayout scroll'} style={{overflow:'auto'}}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100000/*代码*/)}</label>
							<input type="text" className={'text-input-nowidth col-xs-8 col-md-8'} placeholder={i18n.t(100378/*自动生成*/)} disabled readOnly 
								{...getFieldProps('code',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:''
								})} />
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100001/*名称*/)}</label>
							<input type="text" className={'text-input-nowidth col-xs-8 col-md-8'} placeholder=""
								{...getFieldProps('description',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:''
								})} />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100002/*描述*/)}</label>
							<input type="text" className={'text-input-nowidth col-xs-8 col-md-8'} placeholder=""
								{...getFieldProps('description',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:''
								})} />
						</div>
					</div>
				</div>
			</FormWrapper>);
	}
}

const TaxSmallClassAddAndEdit = createForm()(CommonForm);

export default TaxSmallClassAddAndEdit;

