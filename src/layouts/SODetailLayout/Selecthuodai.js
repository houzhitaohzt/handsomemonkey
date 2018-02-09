import i18n from './../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../components/Form";
//引入弹层
import Dialog from '../../components/Dialog/Dialog';
import Confirm from '../../components/Dialog/Confirm';//删除弹层
//引入select插件
import Select, {Option,ConstMiniSelect} from '../../components/Select';
//引入table
import Table from "../../components/Table";
import NavConnect from '../../components/NavigateTabs/containers/AddContainer';
//引入分页
import Page from "../../components/Page";
import Checkbox from '../../components/CheckBox';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP} from '../../services/apiCall';
import ServiceTips from '../../components/ServiceTips';
import xt from "../../common/xt"; // 提示
class Record extends Component{
    constructor(props){
        super(props)
        this.onCancel=this.onCancel.bind(this);
        var that = this;
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.state ={
            tableSources:[]
        }
    }
    onSaveAndClose(){
        let that = this;
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if(errors){
            }else{
                this.props.onSaveAndClose(this.props.form.getFieldsValue(),{});
            }
        })
    }
    onCancel(){
        const {onCancel} = this.props;
        if(onCancel){
            onCancel();
        }
    }
    render(){
        const {form,data} = this.props;
        const { getFieldProps, getFieldError,getFieldValue} = this.props.form;
        const disabled = form.isFieldsValidating() || form.isSubmitting();
        let that = this;
        return (<FormWrapper showFooter={true}  onCancel={this.onCancel} onSaveAndClose={this.onSaveAndClose}>
            <div className={'girdlayout'}>
                <div className={'row'}>
                    <div className="form-group col-md-12 col-lg-12">
                        <label className={'col-md-2 col-lg-2'}><span>*</span>{i18n.t(100299/*货代公司*/)}</label>
                        <ConstMiniSelect form={this.props.form}
                                         pbj={{
                                             apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                             params: {obj:'com.fooding.fc.ds.entity.AgnShipBe'}
                                         }} fieldName="forwarderBeId"
                                         initValueOptions={[]}
                                         optionValue={(da, di) => <Option key={di} objValue={{
                                             forwarderBeId: da.id,
                                             forwarderBeLcName: da.localName,
                                             forwarderBeEnName: da.name,
                                             s_label:da.localName
                                         }}>{da.localName}</Option>}
                                         reles={true}
                                         className ={'currency-btn select-from-currency col-md-10 col-lg-10'}
                        />
                    </div>
                </div>
            </div>
        </FormWrapper>);
    }
}

Record = createForm()(NavConnect(Record));

export default Record;


