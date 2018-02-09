import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import DataTime from  '../../../../components/Calendar/Calendar';
import Input from '../../../../components/FormValidating/FormValidating';
import Checkbox from "../../../../components/CheckBox";
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_ERP, API_FOODING_HR} from '../../../../services/apiCall';
import Loading from "../../../../components/Loading";//加载动画
import Calendar from  '../../../../components/Calendar/Calendar';
import ServiceTips from "../../../../components/ServiceTips";//提示框
import {I18n} from "../../../../lib/i18n";
import xt from '../../../../common/xt';
import NameCheck from "../../../../components/InputBoxCheck/NameCheck";
import i18n from "../../../../lib/i18n";
import WebData from "../../../../common/WebData";
export class Productplug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onSaveAdd=this.onSaveAdd.bind(this);
        this.state ={
            nianxianArray:[{}]
        };
        this.addClick = this.addClick.bind(this);
        this.deleteClick = this.deleteClick.bind(this);
        this.onDayChange =  this.onDayChange.bind(this);
        this.endDate = (props.checkedData.endDate || '').split("-");
        this.monthData = this.endDate[0];
        this.dayData = this.endDate[1];
        this.daySelectData = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,24,25,26,27,28,29,30,31];
        this.monthSelectData = [1,2,3,4,5,6,7,8,9,10,11,12];

	}

	getData(value,that){
		this.addSelect = that;
	}
    onSaveAndClose(isAdd){
	    debugger
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if(errors){

            }else{
                if(this.props.DialogContent == 1){
                    let params = this.props.form.getFieldsValue();
                    delete params['id'];
                    delete params['optlock'];
                    delete params['nameValues'];
                    this.props.onSaveAndClose(params,{},isAdd);
                }else{
                    this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.data,isAdd);
                }
                this.props.form.resetFields();


            }
        })
    }
	onSaveAdd(){
		this.onSaveAndClose(true);
	}
	onCancel(){
		const {form, onCancel} = this.props;
		this.props.onCancel();

		this.props.form.resetFields();
	}
    deleteClick(i){
        let nianxianArray=this.state.nianxianArray;
        nianxianArray.splice(i, 1, null);
        this.setState({
            nianxianArray:nianxianArray
        });
    }
    addClick(){
        let that = this;
        let array = this.state.nianxianArray;
        array.push({});
        this.setState({
            nianxianArray:array
        })
    }
    componentDidMount(){
		if(this.props.DialogContent==3 || this.props.DialogContent==5){
            let that = this;
            apiGet(API_FOODING_HR,'/annualLeave/getOne',
                {id:this.props.checkedData.id},(response)=>{
                    this.setState({
                        nianxianArray:response.data.item.length>0?response.data.item:[{}]
                    });
                },(error)=>{

                });
		}

    }

    componentWillUnmount() {
        this.monthData = undefined;
        this.dayData = undefined;
        this.endDate = [];
    }

    onMonthChange = (value)=> {
	    if(!value){
            this.onDayChange(value);
        }
        this.monthData = value;
        this.props.form.setFieldsValue({"endDate": this.monthData + "-" + this.dayData});
    };

    onDayChange = (value)=> {
        if(!value){
            this.props.form.setFieldsValue({"endDate": this.monthData});
        }
	    this.dayData  = value;
	    this.props.form.setFieldsValue({"endDate": this.monthData + "-" + this.dayData});
    };

	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;
		let {checkedData} = this.props;
		let content = <div></div>;
        let common =<div></div>;
        let commons =<div></div>;
        let ccLocalName = WebData.user.data.staff.company.localName;
        let ccenName  =   WebData.user.data.staff.company.enName;
        let Cid = WebData.user.data.staff.company.id;
        let positionName = WebData.user.data.staff.positn.depmntName;
        let Pid = WebData.user.data.staff.positn.depmntId;
        let clusterLocalName = WebData.user.data.staff.cluster.localName;
        let clusterenName  =   WebData.user.data.staff.cluster.enName;
        let clusId = WebData.user.data.staff.clusId;
        let stffId = WebData.user.data.staff.id;
        let stffLcname = WebData.user.data.staff.localName;
        let {form} = this.props;
        let lastIndex = -1;
        let nianxianArray = this.state.nianxianArray;
        getFieldProps("endDate", {initialValue: checkedData.endDate});
        common=nianxianArray.map((e,i)=>{
            if(e== null) return e;
            let comp = (<div className='row' key={i}>
                <div className="form-group col-md-12 col-lg-12">
                    <label className={'col-md-2 col-lg-2'}></label>
                    <input type="text" {...getFieldProps('item['+i+'].gt', {
                        initialValue:(getFieldValue('item['+lastIndex+'].lte')?getFieldValue('item['+lastIndex+'].lte'):(e.gt?e.gt:0))
                    })} className={getFieldError('item['+i+'].gt')?'col-md-1 col-lg-1 text-input-nowidth error-border':'col-md-1 col-lg-1 text-input-nowidth'} disabled/>
                    <label className={'col-md-1 col-lg-1'} style={{textAlign:'center'}}>{I18n.t(500411/* <*/)}</label>
                    <label className={'col-md-1 col-lg-1'} style={{textAlign:'center'}}>{I18n.t(500409/*工作年限*/)}</label>
                    <label className={'col-md-1 col-lg-1'} style={{textAlign:'center'}}>{I18n.t(500412/* <=*/)}</label>
                    <input type='text' className={getFieldError('item['+i+'].lte')?
                        'ccol-md-1 col-lg-1 text-input-nowidth error-border':'col-md-1 col-lg-1 text-input-nowidth'}
                           placeholder=""
                           {...getFieldProps('item['+i+'].lte',{
                               rules:[{required:true},(rule, value, callback) => {
                                   if(parseFloat(value) >
                                       (getFieldValue('item['+(i-1)+'].lte')?getFieldValue('item['+(i-1)+'].lte'):0)
                                       && parseFloat(value) >= 0 && ( !getFieldValue('item['+(i+1)+'].lte')||parseFloat(value)<getFieldValue('item['+(i+1)+'].lte')
                                       )){
                                       callback([]);
                                   } else callback([i18n.t(400102/*数量不能大于*/) + getFieldValue('item['+(i-1)+'].lte')]);
                               }],
                               initialValue:e.lte?e.lte:''
                           })}
                    />
                    <label className={'col-md-2 col-lg-2'} style={{textAlign:'center'}}>{I18n.t(500434/*年假小时数=*/)}</label>
                    <input type='text' className={getFieldError('item['+i+'].count')?'error-border col-md-1 col-lg-1 text-input-nowidth':
                        'col-md-1 col-lg-1 text-input-nowidth'}
                           placeholder=""
                           {...getFieldProps('item['+i+'].count',{
                               initialValue:e.count?e.count:'',
                               rules: [{required:true}]
                           })}
                    />

					<div className="form-group col-xs-2 col-md-2">
                        <i className='foddingicon fooding-add-icon3'
                           style={{paddingLeft:'20px'}}
                           onClick={this.addClick.bind(this,i)}></i>
                        {  i==0?'':
                            <i className='foddingicon fooding-delete-icon4'
                               style={{paddingLeft:'20px'}} onClick={this.deleteClick.bind(this,i)}></i>
                        }
                    </div>
                </div>
            </div>)
            lastIndex = i;
            return comp;
        })
        commons=nianxianArray.map((e,i)=>{
            if(e== null) return e;
        	let comps = (<div className='row' key={i}>
                    <div className="form-group col-md-12 col-lg-12">
                        <label className={'col-md-2 col-lg-2'}></label>
                        <label className={'col-md-1 col-lg-1'}>{e.gt}</label>
                        <label className={'col-md-1 col-lg-1'} style={{textAlign:'center'}}>{I18n.t(500411/* <*/)}</label>
                        <label className={'col-md-1 col-lg-1'} style={{textAlign:'center'}}>{I18n.t(500409/*工作年限*/)}</label>
                        <label className={'col-md-1 col-lg-1'} style={{textAlign:'center'}}>{I18n.t(500412/* <=*/)}</label>
                        <label className={'col-md-1 col-lg-1'} style={{textAlign:'left'}}>{e.lte}</label>
                        <label className={'col-md-1 col-lg-1'}>{I18n.t(500410/*年假小时数*/)}</label>
                        <label className={'col-md-1 col-lg-1'} style={{textAlign:'center'}}>=</label>
                        <label className={'col-md-1 col-lg-1'} style={{textAlign:'left'}}>{e.count}</label>
                    </div>
                </div>)
                return comps;


        })
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{i18n.t(100243/*集团*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    apiHost={API_FOODING_ES}
                                    apiUri="/party/getLoginClusters"
                                    fieldName="cluster"
                                    initialValue={xt.initSelectValue(true, WebData.user.data.staff.cluster, ['cluster'], 'localName', form, true)}
                                    valueKeys={da => ({
                                        ...da,
                                        s_ignore_label: true
                                    })} disabled
                                />
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{i18n.t(100244/*企业*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    apiUri="/party/getLoginCompanies"
                                    apiHost={API_FOODING_ES}
                                    apiParams={{clusId: WebData.user.data.staff.clusId}}
                                    fieldName="company"
                                    initialValue={xt.initSelectValue(true, WebData.user.data.staff.company, ['company'], 'localName', form, true)}
                                    valueKeys={da => ({
                                        ...da,
                                        s_ignore_label: true
                                    })} disabled
                                />
                            </div>
                        </div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500385/*年假编号*/)}</label>
								<input type="text"
										{...getFieldProps('code',{
													initialValue:'',
													rules: [{required:true}]
										})}
                                       className={getFieldError("code") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
								/>

							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500386/*年假名称*/)}</label>
								<input
                                    type="text"
                                    {...getFieldProps('name',{
                                        initialValue:'',
                                        rules: [{required:true}]
                                    })}
                                    className={getFieldError("name") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
								/>

							</div>

						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500387/*工作年限类型*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.AnnualType'
                                             fieldName="annualTypeId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 annualTypeId: da.id,
                                                s_label: da.name
                                             }}>{da.name}</Option>}
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}

				                    />
							</div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-4 col-md-4'}>{I18n.t(100123/*默认*/)}</label>
                                <Checkbox
                                    {...getFieldProps("initialize" ,{
                                        initialValue:''
                                    })}
                                />
                            </div>
						</div>
                        {common}
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{I18n.t(500390/*当年年假有效期至*/)}</label>
                                    <ConstMiniSelect form={this.props.form}
                                                     pbj='com.fooding.fc.enumeration.AnnualEffectType'
                                                     fieldName="effectTypeId"
                                                     optionValue={da => <Option key={da.id} objValue={{
                                                         effectTypeId: da.id,
                                                         s_label: da.name
                                                     }}>{da.name}</Option>}
                                                     allowClear
                                                     className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}

                                    />

								</div>
								<div className="form-group col-md-5 col-lg-5" style={{marginLeft:'10px'}}>
                                    <div className={'col-md-4 col-lg-4'}>
                                        <ConstVirtualSelect
                                            form={this.props.form}
                                            rules={true}
                                            isRequest = {false}
                                            fieldName="month"
                                            initValueOptions={this.monthSelectData}
                                            valueKeys={da => String(da)}
                                            pageSize={4}
                                            className ={'col-xs-7 col-md-7'}
                                        />
                                    </div>
                                    <div className={'col-md-4 col-lg-4'}>
                                        <ConstVirtualSelect
                                            form={this.props.form}
                                            isRequest = {false}
                                            rules={true}
                                            fieldName="date"
                                            initValueOptions={this.daySelectData}
                                            valueKeys={da => String(da)}
                                            pageSize={4}
                                            className ={'col-xs-7 col-md-7'}
                                        />
                                    </div>
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500391/*请假控制方式*/)}</label>
								<ConstMiniSelect form={this.props.form}
				             				 pbj='com.fooding.fc.enumeration.ControllerType'
                                             fieldName="controllerTypeId"
                                             optionValue={da => <Option key={da.id} objValue={{
                                                 controllerTypeId: da.id,
                                                s_label: da.name
                                             }}>{da.name}</Option>}
                                             allowClear
                                             className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}

				                    />
							</div>


						</div>
						<div className={'row'}>
                            <div className="form-group col-md-12 col-lg-12">
                                <label className={'col-md-2 col-lg-2'}>{I18n.t(100336/*备注*/)}</label>
                                <input type="text" className='col-md-10 col-lg-10 text-input-nowidth'
                                       {...getFieldProps('remark',{
                                           initialValue:''
                                       })}
                                />
                            </div>


						</div>

					</div>
			</div>
           	);
		}else if(this.props.DialogContent==3){
			checkedData = checkedData || {};
            checkedData.annualType = checkedData.annualType || {};
            checkedData.irowSts=checkedData.irowSts || {};
            checkedData.annualEffectType = checkedData.annualEffectType || {};
            checkedData.controllerType = checkedData.controllerType || {};
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.id:''
			})
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.optlock:''
			})
            this.data = Object.assign({},checkedData);
            content = (
                <div className={'addnormal'} style={{marginBottom:'10px'}}>
                    <div className={'  girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{i18n.t(100243/*集团*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    apiHost={API_FOODING_ES}
                                    apiUri="/party/getLoginClusters"
                                    fieldName="cluster"
                                    initialValue={xt.initSelectValue(true, WebData.user.data.staff.cluster || checkedData.group, ['cluster'], 'localName', form, true)}
                                    valueKeys={da => ({
                                        ...da,
                                        s_ignore_label: true
                                    })} disabled
                                />
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{i18n.t(100244/*企业*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    apiUri="/party/getLoginCompanies"
                                    apiHost={API_FOODING_ES}
                                    apiParams={{clusId: WebData.user.data.staff.clusId}}
                                    fieldName="company"
                                    initialValue={xt.initSelectValue(true, WebData.user.data.staff.company || checkedData.company, ['company'], 'localName', form, true)}
                                    valueKeys={da => ({
                                        ...da,
                                        s_ignore_label: true
                                    })} disabled
                                />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500385/*年假编号*/)}</label>
                                <input type="text"
                                       {...getFieldProps('code',{
                                           initialValue:checkedData?checkedData.code:'',
                                           rules: [{required:true}]
                                       })}
                                       className={getFieldError("code") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
                                />
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500386/*年假名称*/)}</label>
                                <input
                                    type="text"
                                    {...getFieldProps('name',{
                                        rules: [{required:true}],
                                        initialValue:checkedData.name})}
                                    className={getFieldError("name") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}

                                />
                            </div>

                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(500387/*工作年限类型*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 pbj='com.fooding.fc.enumeration.AnnualType'
                                                 fieldName="annualTypeId"
                                                 optionValue={da => <Option key={da.id} objValue={{
                                                     annualTypeId: da.id,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>}
                                                 allowClear
                                                 className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                                 initialValue={xt.initSelectValue(checkedData.annualType,{annualTypeId:checkedData.annualType.id,s_label:checkedData.annualType.name},['annualTypeId'],'s_label',this.props.form)}

                                />
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-4 col-md-4'}>{I18n.t(100123/*默认*/)}</label>
                                <Checkbox
                                    {...getFieldProps('initialize',{
                                        initialValue:checkedData?checkedData.initialize:false,

                                    })}
                                    checked={this.props.form.getFieldValue("initialize")}
                                />
                            </div>
                        </div>
                        {common}
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(500390/*当年年假有效期至*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 pbj='com.fooding.fc.enumeration.AnnualEffectType'
                                                 fieldName="effectTypeId"
                                                 optionValue={da => <Option key={da.id} objValue={{
                                                     effectTypeId: da.id,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>}
                                                 allowClear
                                                 className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                                 initialValue={xt.initSelectValue(checkedData.annualEffectType,{effectTypeId:checkedData.annualEffectType.id,s_label:checkedData.annualEffectType.name},['effectTypeId'],'s_label',this.props.form)}

                                />

                            </div>
                            <div className="form-group col-md-5 col-lg-5" style={{marginLeft:'10px'}}>
                                <div className={'col-md-4 col-lg-4'}>
                                    <ConstVirtualSelect
                                        form={this.props.form}
                                        rules={true}
                                        isRequest = {false}
                                        fieldName="month"
                                        initValueOptions={this.monthSelectData}
                                        initialValue={checkedData.month}
                                        valueKeys={da => String(da)}
                                        pageSize={4}
                                        className ={'col-xs-7 col-md-7'}
                                    />
                                </div>
                                <div className={'col-md-4 col-lg-4'}>
                                    <ConstVirtualSelect
                                        form={this.props.form}
                                        isRequest = {false}
                                        rules={true}
                                        fieldName="date"
                                        initValueOptions={this.daySelectData}
                                        initialValue={checkedData.date}
                                        valueKeys={da => String(da)}
                                        pageSize={4}
                                        className ={'col-xs-7 col-md-7'}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(500391/*请假控制方式*/)}</label>
                                <ConstMiniSelect form={this.props.form}
                                                 pbj='com.fooding.fc.enumeration.ControllerType'
                                                 fieldName="controllerTypeId"
                                                 optionValue={da => <Option key={da.id} objValue={{
                                                     controllerTypeId: da.id,
                                                     s_label: da.name
                                                 }}>{da.name}</Option>}
                                                 allowClear
                                                 className ={'col-xs-8 col-md-8 currency-btn select-from-currency'}
                                                 initialValue={xt.initSelectValue(checkedData.controllerType,{controllerTypeId:checkedData.controllerType.id,s_label:checkedData.controllerType.name},['controllerTypeId'],'s_label',this.props.form)}

                                />
                            </div>


                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-12 col-lg-12">
                                <label className={'col-md-2 col-lg-2'}>{I18n.t(100336/*备注*/)}</label>
                                <input type="text" className='col-md-10 col-lg-10 text-input-nowidth'
                                       {...getFieldProps('remark',{
                                           initialValue:checkedData?checkedData.remark:''
                                       })}
                                />
                            </div>


                        </div>

                    </div>
                </div>
            );
		}else if(this.props.DialogContent==5){
            checkedData = checkedData || {};
            checkedData.annualType = checkedData.annualType || {};
            checkedData.annualEffectType = checkedData.annualEffectType || {};
            checkedData.controllerType = checkedData.controllerType || {};
            getFieldProps('id', {
                validateFirst: true,
                initialValue:checkedData? checkedData.id:''
            })
            getFieldProps('optlock', {
                validateFirst: true,
                initialValue:checkedData? checkedData.optlock:''
            })
            content = (
                <div className={'addnormal'} style={{marginBottom:'10px'}}>
                    <div className={'  girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500385/*年假编号*/)}</label>
                                <div className={'col-xs-8 col-md-8'}>
                                    <p>{checkedData.code?checkedData.code:''}</p>
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500386/*年假名称*/)}</label>
                                <div className={'col-xs-8 col-md-8'}>
                                    <p>{checkedData.name?checkedData.name:''}</p>
                                </div>
                            </div>

                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(500387/*工作年限类型*/)}</label>
                                <div className={'col-xs-8 col-md-8'}>
                                    <p>{checkedData.annualType?checkedData.annualType.name:''}</p>
                                </div>
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-4 col-md-4'}>{I18n.t(100123/*默认*/)}</label>
                                <div className={'col-xs-8 col-md-8'}>
                                    <p>{checkedData.initialize?'是':'否'}</p>
                                </div>
                            </div>
                        </div>
                        {commons}
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(500390/*当年年假有效期至*/)}</label>
                                <div className={'col-xs-2 col-md-2'}>
                                    <p>{checkedData.annualEffectType?checkedData.annualEffectType.name:''}</p>
                                </div>
                                <div style={{width:'20px',paddingRight:'0'}} className={'col-md-1 col-lg-1'}>
                                    <p style={{textAlign:'center'}}>{checkedData['month']?checkedData.month:''}</p>
                                </div>
                                <div style={{width:'2px'}} className={'col-md-1 col-lg-1'}>
                                    <p>-</p>
                                </div>
                                <div className={'col-md-1 col-lg-1'}>
                                    <p>{checkedData['date']?checkedData.date:''}</p>
                                </div>
                            </div>



                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(500391/*请假控制方式*/)}</label>
                                <div className={'col-xs-8 col-md-8'}>
                                    <p>{checkedData.controllerType?checkedData.controllerType.name:''}</p>
                                </div>
                            </div>


                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-12 col-lg-12">
                                <label className={'col-md-2 col-lg-2'}>{I18n.t(100336/*备注*/)}</label>
                                <div className={'col-xs-8 col-md-8'}>
                                    <p>{checkedData.remark?checkedData.remark:''}</p>
                                </div>
                            </div>


                        </div>

                    </div>
                </div>
            );
        }
		return (
			<div className="package-action-buttons">
					<FormWrapper
					showFooter={true}
					buttonLeft = {this.props.buttonLeft}
					showSaveAdd={this.props.showSaveAdd}
					onSaveAndClose={this.onSaveAndClose}
					onCancel={this.onCancel}
					onSaveAdd={this.onSaveAdd}
					showSaveClose={this.props.showSaveClose}
					>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(Productplug);
export default ProductForm;

