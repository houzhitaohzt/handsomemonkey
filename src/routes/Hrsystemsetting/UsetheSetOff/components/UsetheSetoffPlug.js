import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
import xt from '../../../../common/xt';
import Select, { Option ,ConstMiniSelect ,ConstVirtualSelect} from '../../../../components/Select/';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList,commonAjax,API_FOODING_HR} from '../../../../services/apiCall';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import Calendar from  '../../../../components/Calendar/Calendar';
import Input from '../../../../components/FormValidating/FormValidating';
import Checkbox from "../../../../components/CheckBox";
import AddMoreLanguage from "../../../../components/AddMoreLanguage";
import WebData from "../../../../common/WebData";
import i18n, {I18n} from "../../../../lib/i18n";
import ServiceTips from "../../../../components/ServiceTips";//提示框
export class UsetheSetoffPlug extends Component{
	constructor(props){
		super(props);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.sle = null;
        this.daySelectData = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,24,25,26,27,28,29,30,31];
        this.monthSelectData = [1,2,3,4,5,6,7,8,9,10,11,12];
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose, oneData,getOneData} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
                let params = Object.assign({}, oneData, value);
                if(params.choose==1){
                    params.adjustTyId=null;
                    params.eDate=null;
                }else if(params.choose==0){
                    params.validDays=null;
                }
                apiPost(API_FOODING_HR,'/adjustvacation/save',params,(response)=>{

                    ServiceTips({text:response.message,type:'success'});
                    this.props.onSaveAndClose(!!isAdd);
                    this.props.form.resetFields();
                },(errors)=>{
                    ServiceTips({text:errors.message,type:'error'});
                })
				this.props.form.resetFields();
			}
		})
	}

	onCancel(){
		const {form, onCancel} = this.props;
		this.props.onCancel();
		this.props.form.resetFields();
	}

    choose = e =>{
	   this.sle = e.target.value;
    }

    componentWillMount() {
        let {getOneData = {}} = this.props;
        this.sle=getOneData.choose;
    }
	render(){
		let that = this;
        let {form} = this.props;
		const { getFieldProps, getNFieldProps, getFieldError } = this.props.form;
		let {getOneData = {}} = this.props;
		let content = <div></div>;
		if(this.props.DialogContent==3){
			getOneData = getOneData || {};
			getOneData.AnnualEffectType = getOneData.AnnualEffectType || {};
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:getOneData?getOneData.optlock:''
			})
			getFieldProps('nameValues', {
														validateFirst: true,
																initialValue:getOneData? getOneData.nameValues:''
			})
			getFieldProps('name',{
						validateFirst: true,
						initialValue:getOneData? getOneData.name:''
			})
			   content = (
			   	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
                            <div className="col-md-12 col-lg-12">
                                <label className={'col-xs-4 col-md-4'} >集团</label>
                                <div className={'col-xs-8 col-md-8'}>
                                    <ConstVirtualSelect
                                        form={this.props.form}
                                        apiHost={API_FOODING_ES}
                                        apiUri="/party/getLoginClusters"
                                        fieldName="cluster"
                                        initialValue={xt.initSelectValue(true, WebData.user.data.staff.cluster, ['cluster'], 'localName', form, true)}
                                        valueKeys={da => ({
                                            ...da,
                                            s_ignore_label: true
                                        })} disabled={true}
                                    />
                                </div>
                            </div>
						</div>
						<div className={'row'}>
                            <div className="col-md-12 col-lg-12">
                                <label className={'col-xs-4 col-md-4'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
                                <div className={'col-xs-8 col-md-8'}>
                                    <ConstVirtualSelect
                                        apiHost={API_FOODING_ES}
                                        form={this.props.form}
                                        apiUri='/party/getLoginCompanies'
                                        apiParams={{clusId: WebData.user.data.staff.clusId}}
                                        rules={true}
                                        fieldName="company"
                                        initialValue={xt.initSelectValue(true, WebData.user.data.staff.company, ['company'], 'localName', form, true)}
                                        valueKeys={da => ({
                                            ...da,
                                            s_ignore_label: true
                                        })}
                                        disabled={true}

                                    />
                                </div>
                            </div>
						</div>
						<div className={'row'}>
                            <div className="col-md-12 col-lg-12">
								<label className={'col-xs-4 col-md-4'}>调休使用失效日</label>
                                <div className={'col-xs-8 col-md-8'}>
                                    <div className={'form-group col-xs-3 col-md-3'}>
                                        <div className='col-xs-1 col-md-1' style={{marginRight:'10px'}}>
                                            <Radio
                                                checked={that.sle == 0}
                                                name={"choose"}
                                                {...getNFieldProps('choose', {
                                                    initialValue: that.sle == 0 ? 0 : 1,
                                                    onChange: this.choose,
                                                    checked: that.sle == 0
                                                })}
                                                value={0}
                                            />
                                        </div>
                                        {/*<ConstMiniSelect form={this.props.form}
                                                         pbj='com.fooding.fc.enumeration.AnnualEffectType'
                                                         fieldName="adjustTyId"
                                                         optionValue={da => <Option key={da.id} objValue={{
                                                             adjustTyId: da.id,
                                                             s_label: da.name
                                                         }}>{da.name}</Option>}
                                                         allowClear
                                                         initialValue={xt.initSelectValue(getOneData.adjustTyId,getOneData,['adjustTyId','adjustTyName'],'adjustTyName',this.props.form)}
                                                         className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                                         disabled={that.sle == 1}

                                        />*/}
                                        <ConstVirtualSelect form={this.props.form}
                                                            pbj='com.fooding.fc.enumeration.AnnualEffectType'
                                                            fieldName="adjustTyId"
                                                            isRequest = {false}
                                                            initialValue={2}
                                                            initValueOptions={[{id:2,name:'下个年度',localName:'下个年度'}]}
                                                            disabled={that.sle == 1}
                                                            className ={'col-xs-10 col-md-10 currency-btn select-from-currency'}
                                        />
                                    </div>
                                    <div className="form-group col-xs-4 col-md-4" style={{marginLeft:'10px'}}>
                                        <div className={'col-md-6 col-lg-6'}>
                                            <ConstVirtualSelect
                                                form={this.props.form}
                                                isRequest = {false}
                                                fieldName="month"
                                                initValueOptions={this.monthSelectData}
                                                valueKeys={da => String(da)}
                                                pageSize={4}
                                            />月
                                        </div>
                                        <div className={'col-md-6 col-lg-6'}>
                                            <ConstVirtualSelect
                                                form={this.props.form}
                                                isRequest = {false}
                                                fieldName="date"
                                                initValueOptions={this.daySelectData}
                                                valueKeys={da => String(da)}
                                                pageSize={4}
                                            />日
                                        </div>
                                    </div>
                                    {/*<div className={'col-xs-4 col-md-4'}>
                                      <Calendar
                                            name="eDate"
                                            showTime={false}
                                            showSecond={false}
                                            width={'100%'}
                                            isShowIcon={true}
                                            form={this.props.form}
                                            value={getOneData.eDate ? new Date(getOneData.eDate).Format('yyyy-MM-dd'):undefined}
                                            disabled={that.sle == 1}
                                        />
                                    </div>*/}
                                </div>
							</div>
						</div>
                        <div className={'row'}>
                            <div className="col-md-12 col-lg-12">
                                <label className={'col-xs-4 col-md-4'}></label>
                                <div className={'col-xs-8 col-md-8'}>
                                    <div className='col-xs-1 col-md-1'>
                                        <div className={' col-xs-1 col-md-1'} style={{marginRight:'10px'}}>
                                            <Radio
                                                checked={that.sle == 1}
                                                name={"choose"}
                                                {...getNFieldProps('choose', {
                                                    initialValue: that.sle == 1 ? 1 : 0,
                                                    onChange: this.choose,
                                                    checked: that.sle ==1
                                                })}
                                                value={1}
                                            />
                                        </div>
                                    </div>
                                    <div className={'col-xs-6 col-md-6'}>加班后
                                        <input type="text"
                                               {...getNFieldProps('validDays',{
                                                   initialValue: getOneData.validDays?getOneData.validDays:'',
                                                   rules: [{pattern:xt.pattern.positiveInteger}]
                                               })}
                                               disabled={that.sle == 0}
                                               className={getFieldError('validDays')?'text-input-nowidth error-border':'text-input-nowidth '}
                                        />天内修完
                                    </div>
                                </div>

                            </div>
                        </div>
					</div>
			    </div>
			)
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper
					showFooter={true}
					buttonLeft = {this.props.buttonLeft}
					onSaveAndClose={this.onSaveAndClose}
					onCancel={this.onCancel}
                    >
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(UsetheSetoffPlug);
export default ProductForm;
