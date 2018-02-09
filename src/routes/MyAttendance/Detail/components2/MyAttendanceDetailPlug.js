import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect} from '../../../../components/Select';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import Calendar from  '../../../../components/Calendar/Calendar';
import WebData from '../../../../common/WebData';
import xt from '../../../../common/xt'; // 下拉
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList,API_FOODING_ES} from '../../../../services/apiCall';
export class MyAttendanceDetailPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.state={
			routeArray:[],//航线
			statnTyArray:[],
			qiyunArray:[],
			chuanqi:[1,2,3,4,5,6,7],
			chuangArray:[],
			huodaiArray:[],
			bizhongArray:[]
		}
		/*this.handleCertificate = this.handleCertificate.bind(this);
		this.qiyunClick = this.qiyunClick.bind(this);
		this.chuangsClick = this.chuangsClick.bind(this);
		this.huodaiClick = this.huodaiClick.bind(this);
		this.bizhongClick = this.bizhongClick.bind(this);*/
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.getData = this.getData.bind(this);


	}
	getData(value,that){
		this.addSelect = that;
		this.props.form.setFieldsValue({eStatnId:undefined,});
	}
	onSaveAndClose(isAdd){
        const {form, onSaveAndClose} = this.props;
		form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else {
                let params = this.props.form.getFieldsValue();
                apiPost(API_FOODING_HR, '/holiday/save', params, (response) => {
                    ServiceTips({text: response.message, type: 'success'});
                    this.props.onSaveAndClose(!!isAdd);
                    this.props.form.resetFields();
                }, (errors) => {
                    ServiceTips({text: errors.message, type: 'error'});

                })

            }

    	});
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError,getNFieldProps,getFieldValue} = this.props.form;
		let {checkedData,getTermModes} = this.props;
						getNFieldProps('type',{
							initialValue:10
						})
		checkedData.shipdate = checkedData.shipdate || "";
		let content = <div></div>;
		if(this.props.DialogContent==3){
			content = (<div className={'addnormal'} style={{marginBottom: '10px'}}>
                <div className={'  girdlayout'}>
                    <div className={'row'}>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}>申诉日期</label>
                           {/* <input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
                                   {...getFieldProps('holidayId', {
                                       initialValue: checkedData ? checkedData.holidayId : '',
                                   })}
                            />*/}
                        </div>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>申诉类型</label>
{/*
                            <NameCheck
                                form={this.props.form}
                                fieldName='holidayName'
                                rules={true}
                                initialValue={checkedData ? checkedData.holidayName : ''}
                                className={'col-md-8 col-lg-8'}
                            />*/}
                        </div>

                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}>申诉原因</label>
                            {/*<ConstVirtualSelect
                                form={form}
                                apiType={apiPost}
                                fieldName="country"
                                apiParams="com.fooding.fc.ds.entity.Country"
                                valueKeys={da => ({
                                    id: da.id,
                                    localName: da.localName,
                                    enName : da.enName,
                                    nameValues: {enName:da.name, localName:da.localName, name:da.name},
                                    s_ignore_label: true
                                })}
                                initialValue={xt.initSelectValue(checkedData.country, checkedData.country, ['localName'],this.props.form)}
                                className='col-md-8 col-lg-8'
                            />*/}
                        </div>
                        <div className="form-group col-md-6 col-lg-6">
                            <label className={'col-md-4 col-lg-4'}>申诉时间</label>
                            {/*<ConstVirtualSelect
                                form={form}
                                isRequest={false}
                                fieldName="year"
                                initialValue={checkedData ? checkedData.year : ""}
                                initValueOptions={that.yearList}
                                className='col-md-8 col-lg-8'
                            />*/}
                        </div>
                    </div>
                </div>
            </div>);
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper
						showFooter={true}
						buttonLeft = {this.props.buttonLeft}
						onSaveAndClose={this.onSaveAndClose}
					    showSaveAdd={this.props.showSaveAdd}
					    showSaveClose={this.props.showSaveClose}
						onCancel={this.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(MyAttendanceDetailPlug);
export default ProductForm;
