import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../../../components/Select';
//引入ajax请求
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../../services/apiCall";
import xt from '../../../../../common/xt'; 
export class  DeliveryDialog extends Component{
	constructor(props){
		super(props);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.data = null;
        this.statnTyIdChange = this.statnTyIdChange.bind(this);//港口类型过滤
        this.statnIdClick=this.statnIdClick.bind(this); //港口类型点击事件
        this.state = {
        	protArr : [],
        	statnTyId:''
        }
	}
	shipBeClick(){
		this.shipInit()
	}
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
		let statnTyId = this.state.statnTyId;
		if(statnTyId == "") return false;
		this.initPortData(statnTyId)
	}
	onSaveAdd(){
		const {form, onSaveAdd} = this.props;
		 form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.onSaveAdd(this.props.form.getFieldsValue(),this.data);
                this.props.form.setFieldsValue({'statnId':''});
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
		// if(initData.beStatn && initData.beStatn.statnTyId )this.initPortData(initData.beStatn.statnTyId);
	}
	componentWillReceiveProps (props){
		// if(this.props.initData !== props.initData){
		// 	let initData = props.initData;
		// 	if(initData.beStatn && initData.beStatn.statnTyId )this.initPortData(initData.beStatn.statnTyId);
		// }
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError,getFieldValue } = this.props.form;
		let {data,initData} = this.props;
		const {currens,statnTypes,unitofmeas,beStatn} = initData;
		this.data = Object.assign({},beStatn);

		let content;
		if(data.number == 0 || data.number == 1){
           content =(
           		<div className="girdlayout">
				<div className="row">
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100156/*港口类型*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							isRequest={false}
							fieldName="statnTyId"
							rules
							initValueOptions={statnTypes}
							initialValue={beStatn&&beStatn.statnTyId? beStatn.statnTyId:''}
							className="col-md-9 col-lg-9"
						/>
					</div>
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100155/*港口*/)}</label>
						<ConstVirtualSelect
								refreshMark={getFieldValue('statnTyId',beStatn&&beStatn.statnTyId)}
								isRequest={Boolean(getFieldValue('statnTyId',beStatn&&beStatn.statnTyId))}
								form={this.props.form}
								fieldName="statnId"
								rules
								apiParams={{statnTyId: getFieldValue('statnTyId',beStatn&&beStatn.statnTyId)}}
                                apiUri="/statn/getByTyId"
								initValueOptions={beStatn && beStatn.statn?[beStatn.statn]:[]}
								initialValue={beStatn&&beStatn.statnTyId === getFieldValue('statnTyId',beStatn&&beStatn.statnTyId ) && beStatn && beStatn.statn?beStatn.statn.id:""}
								className="col-md-9 col-lg-9"
							/> 
					</div>
				</div>
				<div className="row">
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100589/*计量单位*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							isRequest={false}
							fieldName="unitofmeaId"
							rules
							initValueOptions={unitofmeas}
							initialValue={beStatn&&beStatn.unitofmea? beStatn.unitofmea.id:''}
							className="col-md-9 col-lg-9"
						/> 
					</div>
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(200466/*加收费用*/)}</label>
						<input type="text" {...getFieldProps('extCharge', {
                        	rules: [{required:true,pattern: xt.pattern.positiveZero}],
							valuedateTrigger:"onBlur", 
                            initialValue:beStatn&&beStatn.extCharge?beStatn.extCharge:0
                        })} className ={getFieldError('extCharge')?'col-xs-9 col-md-9 text-input-nowidth error-border':'col-xs-9 col-md-9 text-input-nowidth'} placeholder=""/>
					</div>
				</div>
				<div className="row">
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100284/*币种*/)}</label>
						<ConstVirtualSelect
							form={this.props.form}
							isRequest={false}
							fieldName="currenId"
							rules
							initValueOptions={currens}
							initialValue={beStatn && beStatn.curren? beStatn.curren.id:''}
							className="col-md-9 col-lg-9"
						/>
					</div>
				</div>
			</div>
           	);
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} showSaveAdd={!data.number==0} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} onSaveAdd={this.onSaveAdd} width={976}>
						{content}
				</FormWrapper> 
			</div>
			);
	}
}
DeliveryDialog.propTypes ={
	onSaveAdd:PropTypes.func,
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
DeliveryDialog.defaultProps ={
	onSaveAdd(){},
	onSaveAndClose(){},
    onCancel(){}
}
const DeliveryDialogForm =createForm()(DeliveryDialog);
export default DeliveryDialogForm;
