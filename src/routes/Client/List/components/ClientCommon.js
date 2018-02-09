import React, {Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
import i18n from './../../../../lib/i18n';


//引入select插件
import {ConstVirtualSelect} from "../../../../components/Select";
import {API_FOODING_ES,API_FOODING_DS,apiPost} from "../../../../services/apiCall";
import WebData from "../../../../common/WebData";
import ServiceTips from '../../../../components/ServiceTips';


class CommonForm extends Component {
    constructor(props) {
        super(props);
        let companyData = WebData.user.data.staff.company;
    

        this.state = {
            companyData:companyData, // 企业数据
        }
    }


    componentDidMount() {

    }

    onSaveAndClose =()=> {
        let that = this;
        let {companyData} = this.state;
        let {form,onSaveAndClose,onCancel,data} = this.props;

        form.validateFields((errors, value) => {
            if ( !errors) {
				apiPost(API_FOODING_DS,'/customer/public/convert',Object.assign({},{companyId:companyData['id'],publicFlag:true,ids:data.IDs},value),
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



    render() {
        let that = this;
        let {form} = this.props;
        let {companyData} = this.state;
        let {getFieldProps, getFieldError, getFieldErrorStyle} = this.props.form;



        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
                <div className="addnormal girdlayout">
					<div className="row">
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-4'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
							<div className={'col-md-8'}>
                                {/*<ConstVirtualSelect
                                    form={this.props.form}
                                    apiHost={API_FOODING_ES}
                                    apiUri={'/party/getLoginCompanies'}
                                    apiParams={{clusId:companyData['id']}}
                                    
                                    fieldName="companyId"
                                    style={{width:'100%'}}
                                    rules={true}
                                />*/}
                                <span>{companyData['localName']}</span>
							</div>
						</div>
						<div className={'col-md-6 form-group'}>
							<label className={'col-md-4'}>{i18n.t(100238/*部门*/)}</label>
							<div className={'col-md-8'}>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    apiHost={API_FOODING_ES}
                                    apiUri={'/party/getLoginDepartments'}
                                    apiParams={{ccid:companyData['id']}}
                                    
                                    fieldName="departmentId"
                                    style={{width:'100%'}}
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
