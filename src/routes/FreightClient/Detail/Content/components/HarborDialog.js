import i18n from './../../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, {Option,ConstVirtualSelect} from '../../../../../components/Select';
import '../../../../../components/Select/assets/index.less';
import {API_FOODING_DS, apiGet} from "../../../../../services/apiCall";
import {I18n} from "../../../../../lib/i18n";

import xt from "../../../../../common/xt";

export class  HarborDialog extends Component{
	constructor(props){
		super(props); 
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
        this.onCancel=this.onCancel.bind(this);
        //this.statnTyIdChange = this.statnTyIdChange.bind(this);//港口类型过滤
        //this.statnIdClick=this.statnIdClick.bind(this); //港口类型点击事件
        this.data = null;
        this.state = {
        	protArr : [],
        	statnTyId:''
        }
	}
	onSaveAdd(){
		const {form, onSaveAdd} = this.props;
		 form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.onSaveAdd(this.props.form.getFieldsValue(),this.data);
				this.props.form.resetFields();
			}
		})
	}
	onSaveAndClose(){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.data);
				this.props.form.resetFields();
			}
		})
	}
	onCancel(){
		const {onCancel}=this.props;
        if(onCancel){
            onCancel();
            this.props.form.resetFields();
        }
	}

	componentDidMount(){
		// let initData = this.props.initData;
		// if(initData.tradruleStatn && ('statnTyId' in initData.tradruleStatn) )this.initPortData(initData.tradruleStatn.statnTyId);
	}

	componentWillReceiveProps (props){
		// if(this.props.initData !== props.initData){
		// 	let initData = props.initData;
		// 	if(initData.tradruleStatn && ('statnTyId' in initData.tradruleStatn) )this.initPortData(initData.tradruleStatn.statnTyId);
		// }
	}

	render(){
		let that = this;
		const { getFieldProps, getFieldError,getFieldValue } = this.props.form;
		let {data,initData} = this.props;
		const {countrys,pickTypes,statnTypes,tradruleStatn = {},countryId} = initData;
		this.data = Object.assign({},tradruleStatn);
		let content;
		console.log(getFieldValue('cntryId',countryId|| tradruleStatn.cntryId))
		if(data.number == 0 || data.number == 1){
           content =(
			   <div className={'  girdlayout'}>
			   		<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100513/*固定*/)}/{I18n.t(100514/*禁止*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								isRequest={false}
								fieldName="pickTy"
								rules
								initValueOptions={pickTypes}
								initialValue={tradruleStatn && tradruleStatn.pickTy?tradruleStatn.pickTy:'10'}
								className="col-md-8 col-lg-8"
							/>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100087/*国家*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								isRequest={false}
								fieldName="cntryId"
								rules
								initValueOptions={countrys}
								initialValue={tradruleStatn && tradruleStatn.cntryId?tradruleStatn.cntryId:countryId}
								className="col-md-8 col-lg-8"
							/>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100156/*港口类型*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								isRequest={false}
								fieldName="statnTyId"
								rules
								initValueOptions={statnTypes}
								initialValue={tradruleStatn && tradruleStatn.statnTyId?tradruleStatn.statnTyId:'10'}
								className="col-md-8 col-lg-8"
							/>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100155/*港口*/)}</label>
							<ConstVirtualSelect
								refreshMark={getFieldValue('statnTyId',tradruleStatn.statnTyId || 10)+getFieldValue('cntryId',tradruleStatn.cntryId || countryId)}
								form={this.props.form}
								fieldName="statnId"
								rules
								apiParams={{statnTyId: getFieldValue('statnTyId',tradruleStatn.statnTyId || 10),cntryId:getFieldValue('cntryId',countryId|| tradruleStatn.cntryId)}}
                                apiUri="/statn/getByStCn"
								initValueOptions={tradruleStatn.statnId && tradruleStatn && tradruleStatn.statnId?[{id:tradruleStatn.statnId,localName:tradruleStatn.statn.localName}]:[]}
								initialValue={tradruleStatn.cntryId == getFieldValue('cntryId',countryId|| tradruleStatn.cntryId) && tradruleStatn.statnTyId == getFieldValue('statnTyId',tradruleStatn.statnTyId || 10),tradruleStatn,tradruleStatn.statnId}
								
							/> 
						</div>
					</div>
			   </div>
           	);
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} showSaveAdd={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} onSaveAdd={this.onSaveAdd} width={976}>
						{content}
				</FormWrapper>
			</div>
			);
	}
}
HarborDialog.propTypes ={
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
HarborDialog.defaultProps ={
	onSaveAndClose(){},
    onCancel(){}
}
const DialogFrom =createForm()(HarborDialog);
export default DialogFrom;







		/*<Select
			animation='slide-up'
			placeholder={""}
			choiceTransitionName="rc-select-selection__choice-zoom"
			optionLabelProp="children"
			optionFilterProp="children"	
			allowClear={false}
			{...getFieldProps('pickTy',{
				validateFirst: true,
				rules: [{required:true,}],
				valuedateTrigger:"onBlur",
				initialValue:String(tradruleStatn && tradruleStatn.pickTy?tradruleStatn.pickTy:'10')
			})}
			className = {getFieldError('pickTy')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
		>
			{
				pickTypes.map((e,i) =>{
					return (<Option key={i} value={String(e.id)} title={e.name}>{e.name}</Option>)							
				})
			}
		</Select>
		<Select
			animation='slide-up'
			placeholder={""}
			choiceTransitionName="rc-select-selection__choice-zoom"
			optionLabelProp="children"
			optionFilterProp="children"	
			allowClear={false}
			{...getFieldProps('cntryId',{
				validateFirst: true,
				rules: [{required:true,}],
				valuedateTrigger:"onBlur",
				initialValue:tradruleStatn && tradruleStatn.cntryId?tradruleStatn.cntryId:countryId
			})}
			className = {getFieldError('cntryId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
		>
			{
				countrys.map((e,i) =>{
					return (<Option key={i} value={String(e.id)} title={e.name}>{e.name}</Option>)							
				})
			}
		</Select>

		<Select
			animation='slide-up'
			placeholder={I18n.t(100156*//*港口类型*//*)}
			choiceTransitionName="rc-select-selection__choice-zoom"
			optionLabelProp="children"
			optionFilterProp="children"	
			allowClear={false}
			{...getFieldProps('statnTyId',{
				validateFirst: true,
				rules: [{required:true,}],
				valuedateTrigger:"onBlur",
				initialValue:String(tradruleStatn && tradruleStatn.statnTyId?tradruleStatn.statnTyId:'10'),
				onChange:this.statnTyIdChange
			})}
			className = {getFieldError('statnTyId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
		>
			{
				statnTypes.map((e,i) =>{
					return (<Option key={i} value={String(e.id)} title={e.name}>{e.name}</Option>)							
				})
			}
		</Select>
		<Select
			animation='slide-up'
			placeholder={I18n.t(100523*//*请选择港口*//*)}
			choiceTransitionName="rc-select-selection__choice-zoom"
			optionLabelProp="children"
			optionFilterProp="children"	
			allowClear={false}
			{...getFieldProps('statnId',{
				validateFirst: true,
				rules: [{required:true,}],
				valuedateTrigger:"onBlur",
				initialValue:tradruleStatn && tradruleStatn.statnId?tradruleStatn.statnId:undefined
			})}
			onClick={this.statnIdClick}
			className = {getFieldError('statnId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
		>
			{
				this.state.protArr.map((e,i) =>{
					return (<Option key={i} value={e.id} title={e.localName}>{e.localName}</Option>)							
				})
			}
		</Select>
			//初始化 通过港口类型过滤
	initPortData(statnTyId){
		let that = this;
		apiGet(API_FOODING_DS,'/statn/getByTyId',{statnTyId:statnTyId},response => {
			that.setState({
				protArr:response.data
			})
		}, error => console.log(error.message))
	}
	//港口类型过滤
	statnTyIdChange(e){
		this.props.form.setFieldsValue({'statnId':''});
		this.setState({
			statnTyId :e
		})
	}
	//每一次点击 进行一次请求，获取港口类型
	statnIdClick(){
		let statnTyId = this.state.statnTyId || 10;
		if(statnTyId == "") return false;
		this.initPortData(statnTyId)
	}
*/
