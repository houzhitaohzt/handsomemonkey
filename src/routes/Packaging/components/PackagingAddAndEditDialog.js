import i18n from './../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
//引入弹层
//引入select插件
import Select, { Option } from 'rc-select';
import {I18n} from '../../../lib/i18n';

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
			initData:{},
		}
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
				<div className={'girdlayout scroll'} style={{height:"334px",overflow:'auto'}}>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100000/*代码*/)}</label>
							<input type="text" className={'text-input-nowidth col-xs-8 col-md-8'} placeholder={i18n.t(100378/*自动生成*/)} disabled={true} readOnly
								{...getFieldProps('code',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:''
								})} />
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100001/*名称*/)}</label>
							<input type="text" className={'text-input-nowidth col-xs-8 col-md-8'} placeholder=""
								{...getFieldProps('name',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:''
								})} />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100243/*集团*/)}</label>
							<Select
								animation='slide-up'
								placeholder=''
								className ='currency-btn select-from-currency col-xs-8 col-md-8'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('group',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:''
								})}
								>
								<Option value="0" title={i18n.t(200494/*未投*/)}>{i18n.t(200494/*未投*/)}</Option>
								<Option value="1" title={i18n.t(200799/*已投*/)}>{i18n.t(200799/*已投*/)}</Option>
							</Select>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100486/*公司*/)}</label>
							<Select
								animation='slide-up'
								placeholder=''
								className ='currency-btn select-from-currency col-xs-8 col-md-8'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('company',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:''
								})}
								>
								<Option value="0" title={i18n.t(200494/*未投*/)}>{i18n.t(200494/*未投*/)}</Option>
								<Option value="1" title={i18n.t(200799/*已投*/)}>{i18n.t(200799/*已投*/)}</Option>
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100029/*材质*/)}</label>
							<Select
								animation='slide-up'
								placeholder=''
								className ='currency-btn select-from-currency col-xs-8 col-md-8'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('group',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:''
								})}
								>
								<Option value="0" title={i18n.t(200811/*好*/)}>{i18n.t(200811/*好*/)}</Option>
								<Option value="1" title={i18n.t(200812/*不好*/)}>{i18n.t(200812/*不好*/)}</Option>
							</Select>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100030/*规格单位*/)}</label>
							<Select
								animation='slide-up'
								placeholder=''
								className ='currency-btn select-from-currency col-xs-8 col-md-8'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('group',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:''
								})}
								>
								<Option value="0" title={i18n.t(200811/*好*/)}>{i18n.t(200811/*好*/)}</Option>
								<Option value="1" title={i18n.t(200812/*不好*/)}>{i18n.t(200812/*不好*/)}</Option>
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100031/*规格长*/)}</label>
							<input type="text" className={'text-input-nowidth col-xs-8 col-md-8'} placeholder=""
								{...getFieldProps('chang',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:''
								})} />
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100032/*规格宽*/)}</label>
							<input type="text" className={'text-input-nowidth col-xs-8 col-md-8'} placeholder=""
								{...getFieldProps('chang',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:''
								})} />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100033/*规格高*/)}</label>
							<input type="text" className={'text-input-nowidth col-xs-8 col-md-8'} placeholder=""
								{...getFieldProps('gao',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:''
								})} />
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100034/*容积单位*/)}</label>
							<Select
								animation='slide-up'
								placeholder=''
								className ='currency-btn select-from-currency col-xs-8 col-md-8'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('group',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:''
								})}
								>
								<Option value="0" title={i18n.t(200494/*未投*/)}>{i18n.t(200494/*未投*/)}</Option>
								<Option value="1" title={i18n.t(200799/*已投*/)}>{i18n.t(200799/*已投*/)}</Option>
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100035/*容积量*/)}</label>
							<input type="text" className={'text-input-nowidth col-xs-8 col-md-8'} placeholder=""
								{...getFieldProps('gao',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:''
								})} />
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100036/*承重单位*/)}</label>
							<Select
								animation='slide-up'
								placeholder=''
								className ='currency-btn select-from-currency col-xs-8 col-md-8'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('company',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:''
								})}
								>
								<Option value="0" title={i18n.t(200494/*未投*/)}>{i18n.t(200494/*未投*/)}</Option>
								<Option value="1" title={i18n.t(200799/*已投*/)}>{i18n.t(200799/*已投*/)}</Option>
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100038/*承重*/)}</label>
							<input type="text" className={'text-input-nowidth col-xs-8 col-md-8'} placeholder=""
								{...getFieldProps('chang',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:''
								})} />
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100039/*自重*/)}</label>
							<input type="text" className={'text-input-nowidth col-xs-8 col-md-8'} placeholder=""
								{...getFieldProps('chang',{
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
								{...getFieldProps('chang',{
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

const PackagingAddAndEdit = createForm()(CommonForm);

export default PackagingAddAndEdit;

