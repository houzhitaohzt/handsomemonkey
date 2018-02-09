import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
//引入select插件
import Select, { Option } from '../../../../components/Select';
import Radio from "../../../../components/Radio";
import {I18n} from '../../../../lib/i18n';
import AddMoreLanguage from "../../../../components/AddMoreLanguage"; 
class CommonForm extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.defaultChange=this.defaultChange.bind(this);
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
			cntryId:'',
			staffIds:[],
			initData:{},
			radioDefaut:i18n.t(100141/*是*/),
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
		console.log(form.getFieldsValue(), form.getFieldValue("timearea2"));
        form.validateFields((error, value) => {
		    
        });
	}

	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	defaultChange(e){
		let defaultValue;
		defaultValue = e.target.value;
		this.setState({
			radioDefaut : defaultValue
		})
	}
	render(){
		const {form} = this.props;
		const {data,radioDefaut} = this.state;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let {staffIds}=this.state;
		staffIds=staffIds||[];
		let common =<div></div>;
		if(data){
			common =<AddMoreLanguage 
								    menusetView={data}
								    object = {'staff'}
								    upload={this.props.upload}
								    onCancel ={this.onCancel}
							    />
		}
		let dom = (<div className={'  girdlayout'} style={{height:"344px"}}>
					<div className={'row'}>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100225/*工号*/)}</label>
							<input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'} 
								placeholder=""
								{...getFieldProps('code',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:data&&('name' in data)?data.name:''
								})} />
						</div>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100231/*姓名*/)}</label>
							<input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'} 
								placeholder=""
								{...getFieldProps('name',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:data&&('name' in data)?data.name:''
								})} />
							{common}
						</div>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100235/*语言*/)}</label>
							<Select
								animation='slide-up'
								className ='currency-btn select-from-currency col-xs-8 col-md-8'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
                                {...getNFieldProps('timearea2',{
                                    validateFirst: false,
                                    rules: [{required:false,}]
                                })}
                                onClick = {()=> console.log('onClick')}
								>
								<Option objValue={{key:1, name: {i18n.t(200293/*中国*/)}, s_label: "中文1"}} value={i18n.t(200293/*中国*/)} title={i18n.t(200293/*中国*/)}>中文1</Option>
								<Option objValue={{key:2, name: {i18n.t(200569/*美国*/)}, s_label: "英文1"}} value={i18n.t(200569/*美国*/)} title={i18n.t(200569/*美国*/)}>英文1</Option>
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100087/*国家*/)}</label>
							<Select
								animation='slide-up'
								className ='currency-btn select-from-currency col-xs-8 col-md-8'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('timearea',{
									validateFirst: true,
									rules: [{required:true,}]
								})}
								>
								<Option value={i18n.t(200293/*中国*/)} title={i18n.t(200293/*中国*/)}>{i18n.t(200293/*中国*/)}</Option>
								<Option value={i18n.t(200569/*美国*/)} title={i18n.t(200569/*美国*/)}>{i18n.t(200569/*美国*/)}</Option>
							</Select>
						</div>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100236/*职称*/)}</label>
							<Select
								animation='slide-up'
								className ='currency-btn select-from-currency col-xs-8 col-md-8'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('risktype',{
									validateFirst: true,
									rules: [{required:true,}]
								})}
								>
								<Option value={i18n.t(201115/*工程师*/)} title={i18n.t(201115/*工程师*/)}>{i18n.t(201115/*工程师*/)}</Option>
								<Option value={i18n.t(200398/*经理*/)} title={i18n.t(200398/*经理*/)}>{i18n.t(200398/*经理*/)}</Option>
							</Select>
						</div>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100237/*职员类型*/)}</label>
							<Select
								animation='slide-up'
								placeholder=''
								className ='currency-btn select-from-currency col-xs-8 col-md-8'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('area',{
									validateFirst: true,
									rules: [{required:true,}]
								})}
								>
								<Option value={i18n.t(201120/*在职*/)} title={i18n.t(201120/*在职*/)}>{i18n.t(201116/*专职*/)}</Option>
								<Option value={i18n.t(201121/*离职*/)} title={i18n.t(201121/*离职*/)}>{i18n.t(201117/*兼职*/)}</Option>
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100227/*职务*/)}</label>
							<Select
								animation='slide-up'
								placeholder=''
								className ='currency-btn select-from-currency col-xs-8 col-md-8'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('area',{
									validateFirst: true,
									rules: [{required:true,}]
								})}
								>
								<Option value={i18n.t(201120/*在职*/)} title={i18n.t(201120/*在职*/)}>{i18n.t(201118/*销售专员*/)}</Option>
								<Option value={i18n.t(201121/*离职*/)} title={i18n.t(201121/*离职*/)}>{i18n.t(201119/*财务专员*/)}</Option>
							</Select>
						</div>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100228/*在职状态*/)}</label>
							<Select
								animation='slide-up'
								placeholder=''
								className ='currency-btn select-from-currency col-xs-8 col-md-8'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('area',{
									validateFirst: true,
									rules: [{required:true,}]
								})}
								>
								<Option value={i18n.t(201120/*在职*/)} title={i18n.t(201120/*在职*/)}>{i18n.t(201120/*在职*/)}</Option>
								<Option value={i18n.t(201121/*离职*/)} title={i18n.t(201121/*离职*/)}>{i18n.t(201121/*离职*/)}</Option>
							</Select>
						</div>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100239/*性别*/)}</label>
							<Select
								animation='slide-up'
								placeholder=''
								className ='currency-btn select-from-currency col-xs-8 col-md-8'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('languagetype',{
									validateFirst: true,
									rules: [{required:true,}]
								})}
								>
								<Option value={i18n.t(201122/*男*/)} title={i18n.t(201122/*男*/)}>{i18n.t(201122/*男*/)}</Option>
								<Option value={i18n.t(201123/*女*/)} title={i18n.t(201123/*女*/)}>{i18n.t(201123/*女*/)}</Option>
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100240/*学历*/)}</label>
							<Select
								animation='slide-up'
								placeholder=''
								className ='currency-btn select-from-currency col-xs-8 col-md-8'
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								{...getFieldProps('area',{
									validateFirst: true,
									rules: [{required:true,}]
								})}
								>
								<Option value={i18n.t(201120/*在职*/)} title={i18n.t(201120/*在职*/)}>{i18n.t(201124/*本科*/)}</Option>
								<Option value={i18n.t(201121/*离职*/)} title={i18n.t(201121/*离职*/)}>{i18n.t(201125/*专科*/)}</Option>
							</Select>
						</div>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100241/*身份证号*/)}</label>
							<input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'} 
								placeholder=""
								{...getFieldProps('threeword',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:data&&('name' in data)?data.name:''
								})} />
						</div>
						<div className="form-group col-xs-4 col-md-4">
							<label className={'col-xs-4 col-md-4'}>{i18n.t(100242/*兴趣爱好*/)}</label>
							<input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'} 
								placeholder=""
								{...getFieldProps('threeword',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:data&&('name' in data)?data.name:''
								})} />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-8 col-md-8">
							<label className={'col-xs-2 col-md-2'}>{i18n.t(100229/*邮箱*/)}</label>
							<input type='text' className={'col-xs-10 col-md-10 text-input-nowidth'} 
								placeholder=""
								{...getFieldProps('threeword',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:data&&('name' in data)?data.name:''
								})} />
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

