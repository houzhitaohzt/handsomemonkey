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
import Select, { Option } from '../../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language} from '../../../../services/apiCall';
import AddMoreLanguage from "../../../../components/AddMoreLanguage"; 
import fieldsFormat from '../../../../common/FieldsFormat';



class CommonForm extends Component{

	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.searchClick=this.searchClick.bind(this);

		// init onclick
		this.countryClick = this.countryClick.bind(this); // 国家 click


		// init state
		this.state=this.initState();


	}

	initState(initData){
		return {
			customerRechecking : "add-label",
			cntryId:'',
			staffIds:[],
			options:[],

			country: [{id:1,name:''}], // 国家

		}
	}

	static defaultProps={
		data:{},
		onSaveAndClose(){},
		onCancel(){}
	}

	componentDidMount(){
	}


	// 保存
	onSaveAndClose(){

		const {form, onSaveAndClose} = this.props;
		let that = this;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_DS,'/rival/save',value,
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
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
			this.props.form.resetFields();
		}
	}

	// 查找
	searchClick(){
		let className;
		 className = "add-label rechecking";
		 //点击之后更新数据，让数据去渲染Table
		 this.setState({
		 	customerRechecking : className
		 })
	}

	// 国家 click
	countryClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Country'},
			(response)=>{
				this.setState({	country: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}



	render(){
		const {form,data,initData,checkedData} = this.props;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let {staffIds}=this.state;
		staffIds=staffIds||[];

		const inputStar=(<span className={''}>*</span>);

		// 参数
		getNFieldProps('id', {
			initialValue: checkedData ? checkedData['id'] : '',
		});

		getNFieldProps('optlock', {
			initialValue: checkedData ? checkedData['optlock'] : '',
		});
		let common = <div></div>;
		if(checkedData&&checkedData.localName){
			//  common = <AddMoreLanguage
			// 					    menusetView={checkedData}
			// 					    object = {'rival'}
			// 					    upload={this.props.getPage}
			// 					    onCancel ={this.onCancel}
			//  />
		}

		let dom = (
			 <div className={'addnormal'} style={{marginBottom:'10px'}}>
		      	<div className="  girdlayout">
					<div className="row">
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100000/*代码*/)}</label>
							<input type="text"
								className="col-md-9 col-lg-9 text-input-nowidth"
								placeholder={I18n.t(100378/*自动生成*/)}
								disabled
								{...getFieldProps('code',{
									initialValue: checkedData.code ? checkedData.code : ''
								})}
							/>
						</div>
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100001/*名称*/)}</label>
							<input type="text"
								className ={getFieldError('name') ? 'text-input-nowidth col-md-9 col-lg-9 error-border' : 'text-input-nowidth col-md-9 col-lg-9'}
								{...getFieldProps('name',{
									rules: [{required:true}],
									initialValue: checkedData.localName ? checkedData.localName : ''
								})}
							/>
							{common}
						</div>
					</div>
					<div className="row">
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100087/*国家*/)}</label>
							<Select
								animation='slide-up'
								className ={'currency-btn  col-xs-9 col-md-9'}
          						optionLabelProp="children"
								{...getNFieldProps('cntryId',{
									initialValue: checkedData.country ?
									{s_label: checkedData.country.localName,
										cntryId: checkedData.country.id } : ''
								})}
								onClick={this.countryClick}
								>
								{this.state.country.map((o,i)=><Option key={i} value={o.id} title={o.localName}>{o.localName}</Option>)}
							</Select>
						</div>
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100561/*法人代表*/)}</label>
							<input type="text"
								className="col-md-9 col-lg-9 text-input-nowidth"
								{...getFieldProps('leglpsn',{
									initialValue: checkedData.leglpsn ? checkedData.leglpsn : ''
								})}
							/>
						</div>
					</div>
					<div className="row">
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100345/*纳税人识别号*/)}</label>
							<input type="text"
								className="col-md-9 col-lg-9 text-input-nowidth"
								{...getFieldProps('taxIdenSN',{
									initialValue: checkedData.taxIdenSN ? checkedData.taxIdenSN : '',
									normalize: fieldsFormat.taxIdenSN
								})}
							/>
						</div>
						{/*<div className={'col-md-6 form-group'}>
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100358*//*税号*//*)}</label>
							<input type="text"
								className="col-md-9 col-lg-9 text-input-nowidth"
								{...getFieldProps('registCode',{
									initialValue: checkedData.registCode ? checkedData.registCode : '',
									normalize: fieldsFormat.beMtlCode
								})}
							/>
						</div>*/}
					</div>
					<div className="row">
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100346/*优势*/)}</label>
							<input type="text"
								className="col-md-9 col-lg-9 text-input-nowidth"
								{...getFieldProps('strength',{
									initialValue: checkedData.strength ? checkedData.strength : ''
								})}
							/>
						</div>
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100347/*劣势*/)}</label>
							<input type="text"
								className="col-md-9 col-lg-9 text-input-nowidth"
								{...getFieldProps('weakness',{
									initialValue: checkedData.weakness ? checkedData.weakness : ''
								})}
							/>
						</div>
					</div>
					<div className="row">
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100348/*威胁*/)}</label>
							<input type="text"
								className ={getFieldError("threat") ? 'col-md-9 col-lg-9 text-input-nowidth error-border' : 'col-md-9 col-lg-9 text-input-nowidth'}
								{...getFieldProps('threat',{
									initialValue: checkedData.threat ? checkedData.threat : ''
								})}
							/>
						</div>
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100002/*描述*/)}</label>
							<input type="text"
								className="col-md-9 col-lg-9 text-input-nowidth"
								{...getFieldProps('description',{
									initialValue: checkedData.description ? checkedData.description : ''
								})}
							/>
						</div>
					</div>
				</div>
				</div>)
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
					<FreeScrollBar style={{height:"344px"}} className="scroll_style">
						{dom}
					</FreeScrollBar>
			</FormWrapper>);
	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;
