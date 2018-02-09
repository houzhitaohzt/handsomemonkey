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
                        // this.setState({
                        //     data:response.data
                        // });
                        this.props.onCancel();
                        //window.navTabs.open(i18n.t(201017/*供应商报价编辑*/), '/purchasequote/add', {id:response.data});
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
                        <div className="col-xs-9">
                                <p className="client-price-content-show col-xs-3" style={{textAlign: 'right', paddingRight: 10}}>{i18n.t(200457/*接受对象*/)}</p>
                                <ConstVirtualSelect
                                    pageSize={6}
                                    multi
                                    apiType={apiPost}
                                    form={this.props.form}
                                    fieldName='postins'
                                    apiParams="com.fooding.fc.ds.entity.Positn"
                                    rules={false}
                                    className="col-xs-9"
                                />
                        </div>
                        <div className="col-xs-3">
                                <p className="client-price-content-show" style={{marginRight:'10px'}}>{i18n.t(400181/*所有接收自动报价者*/)}</p>
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

