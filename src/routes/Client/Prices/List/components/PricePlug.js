import i18n from './../../../../../lib/i18n';
import React, {Component, PropTypes} from 'react'
import {createForm, FormWrapper} from "../../../../../components/Form";
//引入弹层
//引入select插件
import {ConstMiniSelect, ConstVirtualSelect, Option} from '../../../../../components/Select';
import Checkbox from "../../../../../components/CheckBox";
import {API_FOODING_ERP, apiForm, apiPost, apiGet} from '../../../../../services/apiCall';
import ServiceTips, {errorTips} from "../../../../../components/ServiceTips"; //提示框

class CommonForm extends Component{
	constructor(props){
		super(props);
		this.onCancel=this.onCancel.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
	}
    onSaveAndClose(isAdd){
        const {form, onSaveAndClose} = this.props;
        let params = this.props.form.getFieldsValue();
        let beId=this.props.beId;
        let value = Object.assign({},params,{beId:beId,mtls:this.props.selectArr});
        apiPost(API_FOODING_ERP,'/promoteprice/offer',value,
                    (response)=>{
                        this.props.onCancel();
                        ServiceTips({text:response.message,type:'success'});
                    },(errors)=>{
                        ServiceTips({text:errors.message,type:'error'});
                });
       
                
            
       
    }
    

 	onCancel(){
        const {form, onCancel} = this.props;
        this.props.onCancel();
        this.props.form.resetFields();
    }
    render(){
        let that = this;
        const { getFieldProps, getFieldError ,getFieldErrorStyle} = this.props.form;
 		const {form, data} = this.props;
 		const disabled = form.isFieldValidating() || form.isSubmitting();
        let content = <div></div>;
 		if(this.props.DialogContent == 1){
           content = (
            <div className="girdlayout">
                    <div className={'row'}>
                       <div className="col-xs-6">
                                <p className="client-price-content-show col-xs-4" style={{marginRight:'10px'}}>{i18n.t(400181/*所有接收自动报价者*/)}</p>
                                <Checkbox
                                    checked={true}
                                />
                        </div>

                    </div>
                    
                    
                </div>
            );
        }
        return (
			 <FormWrapper 
             showFooter={true} 
             onSaveAndClose={this.onSaveAndClose} 
             onCancel={this.onCancel}>
			{content}	
 			</FormWrapper>
 		)
 	}
}

CommonForm = createForm()(CommonForm);

export default CommonForm;

