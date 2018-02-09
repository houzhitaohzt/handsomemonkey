import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option, ConstVirtualSelect } from '../../../../components/Select';
import Checkbox from "../../../../components/CheckBox";
import Radio from '../../../../components/Radio';
import Calendar from  '../../../../components/Calendar/Calendar';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../services/apiCall";
import Input from '../../../../components/FormValidating/FormValidating';
//引入国际化
import {I18n} from '../../../../lib/i18n';
import WebData from "../../../../common/WebData";

export class  OrgAssocaitedDialog extends Component{
	constructor(props){
		super(props);
		let that = this;
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.onSaveAdd=this.onSaveAdd.bind(this);
        this.companyChange=this.companyChange.bind(this);
        this.data = null;
        this.state={
            companyState:this.props.initData.partner?this.props.initData.partner.type:0,
            clientSelectData:[]
        }
	}
	companyChange(e){
		this.setState({
            companyState:e.target.value
    	})
	}
	 onClientChange = data => {
        if (data.trim() === '') return;
        apiPost(API_FOODING_DS, '/enterprise/search', {dataTyId:90,keyword: data}, response => {
            this.setState({clientSelectData: response.data || []});
        }, error => {

        })
    };
	componentWillReceiveProps(nextProps){
        //新增
        if(!nextProps.initData.partner) return false;
        //编辑时，根据返回的type类型获取
        if(this.props.initData.partner.type !== nextProps.initData.partner.type){
            this.setState({
                companyState:nextProps.initData.partner.type
            })
        }
    }
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		let {data, initData} = this.props;
		const {prtnTypes} = initData;
		let enterprises =initData.enterprises || [];
		let partner = initData.partner || {};
		this.data = Object.assign({},partner);
		let SelectDom;
		if(data.number == 0){
			if(this.state.companyState === 0){
				SelectDom = (<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100528/*公司名称*/)}</label>
                            <ConstVirtualSelect
								form={this.props.form}
								fieldName="prtnBeId"
								rules
								apiParams={{clusId: WebData.user.data.staff.clusId}}
                                apiUri="/party/getLoginCompanies"
                                apiHost={API_FOODING_ES}
								initValueOptions={partner && partner.enterprise?[{id:partner.enterprise.id,localName:partner.enterprise.localName}]:[]}
								initialValue={partner && partner.enterprise?partner.enterprise.id:""}
                                className='col-xs-8 col-md-8'
							/>
					</div>)
			}else{
				SelectDom = (
				<div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100528/*公司名称*/)}</label>
							<input type="text" {...getFieldProps('companyName', {
								rules: [{required:true,}],
								valuedateTrigger:"onBlur",
                                initialValue:('companyName' in partner)?partner.companyName:''
                            })} className={getFieldError('companyName')?"col-md-8 col-lg-8 text-input-nowidth error-border":"col-md-8 col-lg-8 text-input-nowidth"} placeholder={""}/>
						</div>

						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100479/*传真*/)}</label>
							<input type="text" {...getFieldProps('fax', {
								rules: [{required:true,}],
								valuedateTrigger:"onBlur",
                                initialValue:('fax' in partner)?partner.fax:''
                            })} className={getFieldError('fax')?"col-md-8 col-lg-8 text-input-nowidth error-border":"col-md-8 col-lg-8 text-input-nowidth"} placeholder={""}/>
						</div>
				</div>
				<div className='row'>
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-4 col-md-4'}>{I18n.t(100370/*联系人*/)}</label>
						<input type="text" {...getFieldProps('contactor', {
							rules: [{required:true,}],
							valuedateTrigger:"onBlur",
															initialValue:('contactor' in partner)?partner.contactor:''
													})} className={getFieldError('contactor')?"col-md-8 col-lg-8 text-input-nowidth error-border":"col-md-8 col-lg-8 text-input-nowidth"} placeholder={""}/>
					</div>
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-4 col-md-4'}>{I18n.t(100478/*电话*/)}</label>
						<input type="text" {...getFieldProps('phone', {
							rules: [{required:true,}],
							valuedateTrigger:"onBlur",
															initialValue:('phone' in partner)?partner.phone:''
													})} className={getFieldError('phone')?"col-md-8 col-lg-8 text-input-nowidth error-border":"col-md-8 col-lg-8 text-input-nowidth"} placeholder={""}/>
					</div>
				</div>
				<div className='row'>
					<div className="form-group col-xs-12 col-md-12">
						<label className={'col-xs-2 col-md-2'}>{I18n.t(100481/*地址*/)}</label>
						<input type="text" {...getFieldProps('address', {
							rules: [{required:true,}],
							valuedateTrigger:"onBlur",
															initialValue:('address' in partner)?partner.address:''
													})} className={getFieldError('address')?"col-md-10 col-lg-10 text-input-nowidth error-border":"col-md-10 col-lg-10 text-input-nowidth"} placeholder={""}/>
					</div>
				</div>
				<div className='row'>
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-4 col-md-4'}>{I18n.t(100123/*默认*/)}</label>
						<Checkbox
								{...getFieldProps('dfutMrk',{
									initialValue:('dfutMrk' in partner)?partner.dfutMrk:false
							})}
							checked={this.props.form.getFieldValue('dfutMrk')}
						/>
					</div>
				</div>
			</div>)
			}
		}else if(data.number == 1){
			if(this.state.companyState === 0){
				SelectDom = (<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100528/*公司名称*/)}</label>
							<ConstVirtualSelect
								form={this.props.form}
								fieldName="prtnBeId"
								rules
								apiParams={{clusId: WebData.user.data.staff.clusId}}
                                apiUri="/party/getLoginCompanies"
                                apiHost={API_FOODING_ES}
								initValueOptions={partner && partner.enterprise?[{id:partner.enterprise.id,localName:partner.enterprise.localName}]:[]}
								initialValue={partner && partner.enterprise?partner.enterprise.id:""}
                                className='col-xs-8 col-md-8'
							/>
					</div>)
			}else{
				SelectDom = (
					<div>
					<div className={'row'}>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100528/*公司名称*/)}</label>
							<input type="text" {...getFieldProps('companyName', {
								rules: [{required:true,}],
								valuedateTrigger:"onBlur",
                                initialValue:('companyName' in partner)?partner.companyName:''
                            })} className={getFieldError('companyName')?"col-md-8 col-lg-8 text-input-nowidth error-border":"col-md-8 col-lg-8 text-input-nowidth"} placeholder={""}/>
						</div>
						<div className="form-group col-xs-6 col-md-6">
							<label className={'col-xs-4 col-md-4'}>{I18n.t(100370/*联系人*/)}</label>
							<input type="text" {...getFieldProps('contactor', {
								rules: [{required:true,}],
								valuedateTrigger:"onBlur",
                                initialValue:('contactor' in partner)?partner.contactor:''
                            })} className={getFieldError('contactor')?"col-md-8 col-lg-8 text-input-nowidth error-border":"col-md-8 col-lg-8 text-input-nowidth"} placeholder={""}/>
						</div>
				</div>
				<div className='row'>
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-4 col-md-4'}>{I18n.t(100478/*电话*/)}</label>
						<input type="text" {...getFieldProps('phone', {
							rules: [{required:true,}],
							valuedateTrigger:"onBlur",
															initialValue:('phone' in partner)?partner.phone:''
													})} className={getFieldError('phone')?"col-md-8 col-lg-8 text-input-nowidth error-border":"col-md-8 col-lg-8 text-input-nowidth"} placeholder={""}/>
					</div>
					<div className="form-group col-xs-6 col-md-6">
						<label className={'col-xs-4 col-md-4'}>{I18n.t(100479/*传真*/)}</label>
						<input type="text" {...getFieldProps('fax', {
							rules: [{required:true,}],
							valuedateTrigger:"onBlur",
															initialValue:('fax' in partner)?partner.fax:''
													})} className={getFieldError('fax')?"col-md-8 col-lg-8 text-input-nowidth error-border":"col-md-8 col-lg-8 text-input-nowidth"} placeholder={""}/>
					</div>
					<div className='row'>
						<div className="form-group col-xs-12 col-md-12">
							<label className={'col-xs-2 col-md-2'}>{I18n.t(100481/*地址*/)}</label>
							<input type="text" {...getFieldProps('address', {
								rules: [{required:true,}],
								valuedateTrigger:"onBlur",
                                initialValue:('address' in partner)?partner.address:''
                            })} className={getFieldError('address')?"col-md-10 col-lg-10 text-input-nowidth error-border":"col-md-10 col-lg-10 text-input-nowidth"} placeholder={""}/>
						</div>
					</div>
				</div>
			</div>)
			}
		}
		return(
			<div className="action-normal-buttons">
				<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} width={976} onSaveAdd={this.onSaveAdd} showSaveAdd={true}>
						<div className="girdlayout">
							<div className="row">
								<div className="form-group col-xs-6 col-md-6">
										<label className={'col-xs-4 col-md-4'}><span>*</span>{I18n.t(100526/*关联企业*/)}</label>
										<Select
											animation='slide-up'
											placeholder={""}
											className ={ getFieldError("prtnTyId") ?'currency-btn select-from-currency col-xs-8 col-md-8 text-input-nowidth error-border':'currency-btn select-from-currency col-xs-8 col-md-8 text-input-nowidth'}
											choiceTransitionName="rc-select-selection__choice-zoom"
											optionLabelProp="children"
											{...getFieldProps('prtnTyId',{
												validateFirst: true,
												rules: [{required:true,}],
												initialValue:('prtnType' in partner)?partner.prtnType.id:'',
											})}>
											{
												prtnTypes.map((e,i) =>{
													return (<Option key={i} value={e.id} title={e.name}>{e.name}</Option>)
												})
											}
										</Select>
								</div>
								<div className="form-group col-xs-6 col-md-6">
									<label className={'col-xs-4 col-md-4'}></label>
									<div className={'col-md-8 col-lg-8'}>
										<Radio
											name = "type"
											checked = {this.state.companyState == 0}
											{...getFieldProps('type',{
												initialValue:0 ==  this.state.companyState?0:1,
												onChange:this.companyChange,
												checked:0==this.state.companyState
											})}
											value ={0}
										/>
										<span className={'radio-text'}>{I18n.t(100486/*公司*/)}</span>
										<Radio
											name = "type"
											checked = {this.state.companyState == 1}
											{...getFieldProps('type',{
												initialValue:1 ==  this.state.companyState?1:0,
												onChange:this.companyChange,
												checked:1==this.state.companyState
											})}
											value={1}
										/>
										<span className={'radio-text'}>{I18n.t(100488/*其他*/)}</span>
									</div>
								</div>
								{SelectDom}
							</div>
						</div>
				</FormWrapper>
			</div>
			);
	}
	onSaveAndClose(){
		const {form, onSaveAndClose } = this.props;
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
	onSaveAdd(){
		const {form, onSaveAdd } = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				this.props.onSaveAdd(this.props.form.getFieldsValue(),null);
				this.props.form.resetFields();
			}
		})
	}
}
OrgAssocaitedDialog.propTypes ={
	onSaveAdd:PropTypes.func,
	onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
OrgAssocaitedDialog.defaultProps ={
	onSaveAdd(){},
	onSaveAndClose(){},
    onCancel(){}
}
const OrgAssocaitedForm =createForm()(OrgAssocaitedDialog);
export default OrgAssocaitedForm;


/*
<Select
    animation='slide-up'
        className ={getFieldError('prtnBeId')?'currency-btn select-from-currency col-xs-8 col-md-8 text-input-nowidth error-border':'currency-btn select-from-currency col-xs-8 col-md-8 text-input-nowidth'}
    choiceTransitionName="rc-select-selection__choice-zoom"
    optionLabelProp="children"
    allowClear
    onClick={this.onEnterpriseClick}
    {...getNFieldProps('prtnBeId',{
        validateFirst: true,
        rules: [{required:true,}],
        initialValue:partner && partner.enterprise? {id:partner.enterprise,s_label:partner.enterprise.localName}:undefined
    })}>
    {this.state.clientSelectData.map(
            da => <Option key={da.id} objValue={{
                s_label: da.localName,
                prtnBeId: da.id,
            }}>{da.localName}</Option>
        )
    }
</Select>
*/
