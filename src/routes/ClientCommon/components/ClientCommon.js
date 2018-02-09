import React, {Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../components/Form";
import i18n from './../../../lib/i18n';


//引入select插件
import {ConstVirtualSelect} from "../../../components/Select";
import {API_FOODING_ES,API_FOODING_DS,apiPost} from "../../../services/apiCall";
import WebData from "../../../common/WebData";
import ServiceTips from '../../../components/ServiceTips';


class CommonForm extends Component {
    constructor(props) {
        super(props);
        let companyData = WebData.user.data.staff.company;

    
        this.state = {
            companyData:companyData, // 公司数据
        }
    }


    componentDidMount() {

    }

    onSaveAndClose =()=> {
        let that = this;
        let {form,onSaveAndClose,onCancel,data} = this.props;

        form.validateFields((errors, value) => {
            if ( !errors) {

				apiPost(API_FOODING_DS,'/customer/public/convert',Object.assign({},{publicFlag:false,ids:data.IDs},value),
                    (response)=>{
						ServiceTips({text:response.message,type:'sucess'});
                        onSaveAndClose();
				    },(error)=>{
                        ServiceTips({text:error.message,type:'error'});
				})
            }
        });
    }

    onCancel = ()=> {
        const {onCancel} = this.props;
        if (onCancel) {
            onCancel();
        }
        this.props.form.resetFields();
    }

    // 销售员 change  
    userChange = ()=> {
        this.props.form.validateFields((errors, value) => {});
    }

    render() {
        let that = this;
        let {form} = this.props;
        let {companyData} = this.state;
        let {getFieldProps, getFieldValue,getFieldError, getFieldErrorStyle} = this.props.form;



        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
                <div className="addnormal girdlayout">
					<div className="row">
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-4'}><span>*</span>{i18n.t(600291/*销售部门*/)}</label>
							<div className={'col-md-8'}>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    apiHost={API_FOODING_ES}
                                    apiUri={'/party/getPartysByType'}
                                    apiParams={{partyId:companyData['id'],typeAttributeIds:44}}
                                    
                                    fieldName="departmentId"
                                    style={{width:'100%'}}
                                    rules={true}
                                />
							</div>
						</div>
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-4'}><span>*</span>{i18n.t(400011/*销售员*/)}</label>
							<div className={'col-md-8'} onClick={this.userChange}>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    apiHost={API_FOODING_ES}
                                    apiUri={'/user/getUsersByPartyId'}
                                    refreshMark={getFieldValue('departmentId')}
                                    apiParams={{partyId:getFieldValue('departmentId') || '',typeAttributeId:601}}
                                    isRequest={getFieldValue('departmentId') ? true:false}
                                    fieldName="staffId"
                                    labelKey='staffLocalName'
                                    style={{width:'100%'}}
                                    valueKeys={da => ({
                                        s_label: da.staffLocalName,
                                        staffId: da['refId']
                                    })}
                                    rules={true}
                                    
                                />
							</div>
						</div>                        
					</div>																						
				</div>            
        </FormWrapper>);
    }
}

CommonForm = createForm()(CommonForm);

export default CommonForm;
