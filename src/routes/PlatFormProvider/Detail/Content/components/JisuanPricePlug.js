import i18n from '../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
import OnlyreadyRuleTemplate from  '../../../../../components/OnlyreadyRuleTemplate';
//引入select插件
import Select, { Option,ConstVirtualSelect,ConstMiniSelect } from '../../../../../components/Select';
import Radio from '../../../../../components/Radio';
import AddSelect from '../../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../../components/Dialog/Confirm';
import Calendar from  '../../../../../components/Calendar/Calendar';
import {I18n} from "../../../../../lib/i18n";
import WebData from '../../../../../common/WebData';
import xt from '../../../../../common/xt'; // 下拉
import Jisuan from "./Jisuan";
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList,API_FOODING_ES,API_FOODING_ERP} from '../../../../../services/apiCall';
import ServiceTips from "../../../../../components/ServiceTips";
export class TruckPricePlug extends Component{
    constructor(props){
        super(props);
        this.onCancel = this.onCancel.bind(this);
        this.jisuanClick = this.jisuanClick.bind(this);
        this.state={
            cangKuArray:[]
        }

    }
    onCancel(){
        const {form, onCancel} = this.props;
        this.props.onCancel();
        this.props.form.resetFields();
        let platformMtlId = this.props.platformMtlId;
        if(platformMtlId){
            this.props.getPage();
            this.props.getPages();
        }else{
            this.props.getPages();
        }

    }
    jisuanClick(){
        const {form, onSaveAndClose} = this.props;
        let params = this.props.form.getFieldsValue();
        form.validateFields((errors, value) => {
            if(errors){

            }else {
                apiPost(API_FOODING_ERP,'/platformmtlprice/calculate',params,(response)=>{
                    this.setState({
                        cangKuArray:response.data
                    });
                },(errors)=>{
                    ServiceTips({text:errors.message,type:'error'});

                })

            }

        })
    }
    render(){
        let that = this;
        let content = <div></div>;
        let {checkedData,ccid} = this.props;
        const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
        console.log(getFieldValue('statnTyId'),getFieldValue('cntryId'))
        getFieldProps('mtlId', {
            validateFirst: true,
            initialValue:checkedData? checkedData.id:''
        })
        getFieldProps('mtlName', {
            validateFirst: true,
            initialValue:checkedData? checkedData.localName:''
        })
        getFieldProps('mtlCode', {
            validateFirst: true,
            initialValue:checkedData? checkedData.code:''
        })
        getFieldProps('specTxt', {
            validateFirst: true,
            initialValue:checkedData? checkedData.specTxt:''
        })
        getFieldProps('vndBeId', {
            validateFirst: true,
            initialValue:ccid
        })
        if(this.props.DialogContent == 1) {
            content = (
                <div className={'addnormal'} style={{marginBottom: '10px'}}>
                    <div className={'  girdlayout'}>
                        <div className="row">
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(100379/*产品*/)}</label>
                                <div className={'col-xs-8 col-md-8'}>
                                    <p>{checkedData?checkedData.localName:''}</p>
                                </div>
                            </div>

                        </div>
                        <div className='row'>
                            <div className="form-group col-md-12 col-lg-12">
                                <label className={'col-md-2 col-lg-2'}>{I18n.t(100382/*产品规格*/)}</label>
                                <div className={'col-xs-10 col-md-10'}>
                                    <p>{checkedData?checkedData.specTxt:''}</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">

                            <div className="form-group col-md-12 col-lg-12">
                                <label className={'col-md-2 col-lg-2'}>{i18n.t(400273/*可接受支付条款*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    fieldName="payTrmId"
                                    apiUri='/tradrulePayterm/getList'
                                    apiParams={{
                                        sourceId:ccid,

                                    }}
                                    valueKeys={da => ({
                                        payTermId: da.payTrm.id,
                                        s_label: da.payTrm.localName
                                    })}
                                    rules
                                    initValueOptions={[]}
                                    initialValue={xt.initSelectValue(checkedData.payTrmId , checkedData, ['payTrmId'], 's_label', this.props.form)}
                                />

                            </div>

                        </div>
                        <div className="row">
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>交货港国家</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    fieldName='cntryId'
                                    apiType={apiPost}
                                    apiParams={{
                                        obj:'com.fooding.fc.ds.entity.Country'
                                    }}
                                    valueKeys={da => ({
                                        s_label: da.localName,
                                        cntryId: da.id
                                    })}
                                    initialValue={xt.initSelectValue(checkedData.cntryId , checkedData, ['cntryId'], 's_label', this.props.form)}
                                    rules
                                />
                            </div>



                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(100224/*运输方式*/)}</label>
                                <ConstVirtualSelect form={this.props.form}
                                                    apiType={apiPost}
                                                    apiParams='com.fooding.fc.enumeration.TransportType'
                                                    fieldName="statnTyId"
                                                    valueKeys={da => ({
                                                        statnTyId: da.id,
                                                        s_label: da.name
                                                    })}
                                                    initialValue={xt.initSelectValue(checkedData.statnTyId , checkedData, ['statnTyId'], 's_label', this.props.form)}
                                                     rules
                                                    className ={'col-xs-8 col-md-8'}
                                />

                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{i18n.t(100155/*港口*/)}</label>
                                <ConstVirtualSelect
                                    refreshMark={getFieldValue('statnTyId').statnTyId + getFieldValue('cntryId').cntryId}
                                    isRequest={getFieldValue('statnTyId').statnTyId + getFieldValue('cntryId').cntryId}
                                    form={this.props.form}
                                    fieldName="offerRecStatns"
                                    rules
                                    multi
                                    apiParams={{
                                        statnTyId: getFieldValue('statnTyId').statnTyId,
                                        cntryId: getFieldValue('cntryId').cntryId
                                    }}
                                    valueKeys={da => ({
                                        statnId: da.id,
                                        statnName: da.localName,
                                        s_label: da.localName
                                    })}
                                    apiUri="/statn/getByStCn"

                                />
                            </div>
                            <div className="form-group col-md-2 col-lg-2">
                            </div>
                            <div className="form-group col-md-2 col-lg-2">
                                <button  className={'button'} onClick={this.jisuanClick.bind(this)}>{i18n.t(500428/*计算价格*/)}</button>
                            </div>

                        </div>

                    </div>
                </div>);
        }
        return (
            <div className="package-action-buttons">
                <FormWrapper showFooter={true}
                             buttonLeft = {this.props.buttonLeft}
                             onSaveAndClose={this.onSaveAndClose}
                             onCancel={this.onCancel}
                             onSaveAdd={this.onSaveAdd}
                             showSaveAdd={this.props.showSaveAdd}
                             showSaveClose={this.props.showSaveClose}>
                    {content}
                    <Jisuan cangKuArray = {this.state.cangKuArray}/>
                </FormWrapper>
            </div>
        )
    }
}
const ProductForm =createForm()(TruckPricePlug);
export default ProductForm;
