import i18n from './../../../../lib/i18n';
import React, {PropTypes, Component} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
//引入select插件
import Radio from "../../../../components/Radio";
import {Translate, Localize, I18n} from '../../../../lib/i18n';
import Select, { Option } from '../../../../components/Select'; // 下拉

import {apiForm,apiGet,API_FOODING_MassMailServer,API_FOODING_MAIL_SERVER,API_FOODING_ES, apiPost} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
import WebData from '../../../../common/WebData';


class CommonForm extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);

        // this state 
        this.state = {
            company: [{id:1,localName:''}], // 收款企业

        }

    }

    componentDidMount() {
    }

	// 收款企业
	handleCompany = ()=>{

		let userLogin = WebData.user.data;
		let companyID = userLogin.staff.clusId;

		apiGet(API_FOODING_ES,'/party/getPartysByTypeId',{typeId:30},
			(response)=>{							
				this.setState({	company: response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

    onSaveAndClose() {
		const {form, onSaveAndClose} = this.props;
		let that = this;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_MassMailServer,'/campaign/save',value,
					(response)=>{							
						ServiceTips({text:response.message,type:'success'});
						that.props.form.resetFields(); // 清除表单
						that.props.onCancel(); // 关闭弹框
						that.props.getPage();	// 刷新页面

					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})
    }

    onCancel() {
        this.props.onCancel();
    }

    render() {

		const { getFieldProps, getNFieldProps, getFieldError } = this.props.form;


        let dom = (<div className={'addnormal'} style={{marginBottom:'10px'}}>
            <div className={'  girdlayout'}>            
                <div className={'row'}>
                    <div className="col-md-6">
                        <label className={'col-md-4'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
						<Select
							{...getNFieldProps('ccId',{
                                rules: [{required: true,}],                                
								initialValue: ''								
							})} 
							animation='slide-up'
							placeholder=''
                            className ={getFieldError('ccId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}							
							prefixCls="rc-select-filter-header"
							choiceTransitionName="rc-select-selection__choice-zoom"
							optionLabelProp="children"							
							onClick={this.handleCompany}
                            allowClear={false}
						>
							{this.state.company.map((o,i)=><Option key={o.id} objValue={{s_label:o.localName,ccId:o.id,ccName:o.localName}} title={o.localName}>{o.localName}</Option>)}
						</Select>
                    </div>
                    <div className="col-md-6">
                        <label className={'col-md-4'}>{i18n.t(200678/*邮件活动类型*/)}</label>
                        <Select
                            {...getNFieldProps('type',{
                                initialValue: 'OFFER'								
                            })} 
                            placeholder=''
                            optionLabelProp="children"
                            className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
                        >
                            <Option key={0} value={'OFFER'} title={i18n.t(100451/*推广报价*/)}>{i18n.t(100451/*推广报价*/)}</Option>
                            <Option key={1} value={'COMMON'} title={i18n.t(200768/*普通*/)}>{i18n.t(200768/*普通*/)}</Option>
                            <Option key={2} value={'SHOW'} title={i18n.t(200679/*展会*/)}>{i18n.t(200679/*展会*/)}</Option>
                        </Select>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="col-md-6">
                        <label className={'col-md-4'}><span>*</span>{i18n.t(600153/*活动*/)}ID</label>
                        <input type='text' 
                            className ={getFieldError('campaignId')?'col-md-8 text-input-nowidth error-border':'col-md-8 text-input-nowidth'}							
                            placeholder=""
                            {...getFieldProps('campaignId', {
                                rules: [{required: true,}],
                                initialValue: ''
                            })} 
                        />
                    </div>
                </div>                
            </div>
        </div>)
        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
            {dom}
        </FormWrapper>);
    }
}

CommonForm = createForm()(CommonForm);

export default CommonForm;

