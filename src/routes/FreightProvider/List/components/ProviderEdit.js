import i18n from './../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
//引入滚动条
import FreeScrollBar from "../../../Client/List/components/FreeScrollBar";
//引入select插件
import Select, { Option } from 'rc-select';
import {I18n} from '../../../../lib/i18n';

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
	}

	initState(initData){
		return {
			cntryId:'',
			staffIds:[],
			data : {id:'',code:'SUPOO1608150056',cntryId:'',name:'',ename:'',type:'',cstmLevel:'',cstmfromId:'',name1:''}
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
		const {form} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let {staffIds, data}=this.state;
		staffIds=staffIds||[];
		const inputStar=(<span className={''}>*</span>);
		let idCtnl;
		if(data && ('id' in data)){
			idCtnl =(<div>
				<input type='hidden' {...getFieldProps('id',{
				initialValue:data.id
			})} />
				<input type='hidden' {...getFieldProps('optlock',{
				initialValue:data.optlock
			})} />
			</div>);
		}
		let dom = (<div className="common-add">
					{idCtnl}
					<div className="row">
						<div className={'col-xs-6'}>
							<label className={'add-label'}>{i18n.t(200964/*供应商代码*/)}</label>
							<input type="text"  className="text-input" placeholder={I18n.t(100354/*客户代码*/)} disabled
								{...getFieldProps('code',{
									validateFirst: true,
									initialValue:data?data.code:''
								})}
							/>
						</div>
						<div className={'col-xs-6'}>
							<label className={'add-label'}>{inputStar}供应商国家</label>
							<Select
								animation='slide-up'
								placeholder={I18n.t(100087/*国家*/)}
								style={{width:320}}
								className ='currency-btn select-from-currency'
								choiceTransitionName="rc-select-selection__choice-zoom"
          						optionLabelProp="children"
								{...getFieldProps('cntryId',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:data&&('country' in data)?data.country:''
								})}
								>
								<Option value={i18n.t(200293/*中国*/)} title={i18n.t(200293/*中国*/)}>{i18n.t(200293/*中国*/)}</Option>
							</Select>
						</div>
					</div>
					<div className="row">
						<div className={'col-xs-6'}>
							<label className={'add-label'}>{inputStar}{i18n.t(100001/*名称*/)}</label>
							<input type="text" placeholder={i18n.t(200574/*请输入名称*/)} className="text-input"
								{...getFieldProps('name',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:data&&('name' in data)?data.name:''
								})}
							/>
						</div>
						<div className={'col-xs-6'}>
							<label className={'add-label'}>{inputStar}{i18n.t(100226/*英文名称*/)}</label>
							<input type="text" name="bizEntprisEnName" placeholder={i18n.t(200575/*请输入英文名称*/)} className="text-input"
								{...getFieldProps('enName',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:data&&('enName' in data)?data.enName:''
								})}
							/>
						</div>
					</div>
					<div className="row">
						<div className={'col-xs-6'}>
							<label className={'add-label'}>{i18n.t(200966/*供应商类型*/)}</label>
							<Select
								animation='slide-up'
								placeholder={I18n.t(100087/*国家*/)}
								style={{width:320}}
								className ='currency-btn select-from-currency'
								choiceTransitionName="rc-select-selection__choice-zoom"
          						optionLabelProp="children"
								{...getFieldProps('type',{
									validateFirst: true,
									rules: [{required:true,}],
									initialValue:data&&('type' in data)?data.type:undefined
								})}
								>
								<Option value={i18n.t(200972/*生产商*/)} title={i18n.t(200972/*生产商*/)}>{i18n.t(200972/*生产商*/)}</Option>
							</Select>
						</div>
						<div className={'col-xs-6'}>
							<label className={'add-label'}>{i18n.t(200468/*供应商等级*/)}</label>
							<Select
								placeholder={i18n.t(200468/*供应商等级*/)}
								style={{width:320}}
								animation='slide-up'
								className ='currency-btn select-from-currency'
								choiceTransitionName="rc-select-selection__choice-zoom"
          						optionLabelProp="children"
								{...getFieldProps('cstmLevelId',{
									validFirst:true,
									rules:[{required:true}],
									valuedateTrigger:"onBlur",
									initialValue:data&&('cstmLevel' in data)?data.cstmLevel:''
								})}
								>
								<Option value='A' title="A">A</Option>
							</Select>
						</div>
					</div>
					<div className="row">
						<div className={'col-xs-6'}>
							<label className={'add-label'}>{i18n.t(200967/*供应商来源*/)}</label>
							<Select
								placeholder={i18n.t(200967/*供应商来源*/)}
								style={{width:320}}
								animation='slide-up'
								className ='currency-btn select-from-currency'
								choiceTransitionName="rc-select-selection__choice-zoom"
          						optionLabelProp="children"
								{...getFieldProps('cstmfromId',{
									validFirst:true,
									rules:[{required:true}],
									valuedateTrigger:"onBlur",
									initialValue:data&&('cstmType' in data)?data.cstmfromId:''
								})}
								>
								<Option value={i18n.t(200679/*展会*/)} title={i18n.t(200679/*展会*/)}>{i18n.t(200679/*展会*/)}</Option>
							</Select>
						</div>
						<div className={'col-xs-6'}>
							<label className={'add-label'}>{i18n.t(100002/*描述*/)}</label>
							<input type="text" placeholder={i18n.t(200574/*请输入名称*/)} className="text-input"
								{...getFieldProps('name',{
									validateFirst:true,
									rules:[{required:true,}],
									valuedateTrigger:'onBlur',
									initialValue:data&&('name1' in data)?data.name1:''
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

const ProviderEdit = createForm()(CommonForm);

export default ProviderEdit;

