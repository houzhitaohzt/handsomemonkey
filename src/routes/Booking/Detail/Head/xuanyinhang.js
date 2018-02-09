import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import DataTime from  '../../../../components/Calendar/Calendar';
import WebData from '../../../../common/WebData';

// common
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, {Option,ConstMiniSelect,ConstVirtualSelect} from '../../../../components/Select'; // 下拉
import xt from '../../../../common/xt'; // 下拉
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax} from '../../../../services/apiCall';
import Table from '../../../../components/Table';
export class Productplug extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[]
        }

        this.onCancel = this.onCancel.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
    }
    onSaveAndClose(isAdd){
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if(errors){

            }else{
                let {data} = this.props;
                let obj = Object.assign({},value,{billId:this.props.getOne.billId});
                apiForm(API_FOODING_ERP,'/shipping/shipmentAgain',obj,(response)=>{
                    onSaveAndClose();
                     //this.props.onPackUp();
                    ServiceTips({text:response.message,type:'sucess'});
                },(error)=>{
                    ServiceTips({text:error.message,type:'error'});
                });

            }
        })
    }
    onCancel(){
        const {form, onCancel} = this.props;
        this.props.onCancel();
        this.props.form.resetFields();
    }
    onClick(){

    }
    componentDidMount(){
        let {selectRow} = this.props;
        console.log(selectRow);
    }
    render(){
        let that = this;
        const { getFieldProps, getFieldError, getNFieldProps} = this.props.form;
        let {data,checkedData, bankName} = this.props;
        let getOne = {};
        let content = <div></div>;
        content = (
            <div className={'addnormal'} style={{marginBottom:'10px'}}>
                <div className={'  girdlayout'}>
                    <div className={'row'}>
                        <div className="form-group col-md-12 col-lg-12">
                            <label className={'col-md-2 col-lg-2'}><span>*</span>银行</label>
                            <div className={'col-md-10 col-lg-10'}>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    isRequest={false}
                                    rules
                                    fieldName="limitId"
                                    valueKeys={'billId'}
                                    labelKey = "issBankEnName"
                                    initValueOptions={bankName}
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="package-action-buttons">
                <FormWrapper showFooter={true}
                             onSaveAndClose={this.onSaveAndClose.bind(this)} onCancel={this.onCancel}
                >
                    {content}
                </FormWrapper>
            </div>
        )
    }
}
const ProductForm =createForm()(Productplug);
export default ProductForm;
