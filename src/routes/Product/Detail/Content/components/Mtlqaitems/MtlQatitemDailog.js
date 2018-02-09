import i18n from '../../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../../components/Form';
import Select, { Option, ConstMiniSelect, ConstVirtualSelect } from '../../../../../../components/Select';
import Checkbox from '../../../../../../components/CheckBox';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../../services/apiCall';
import ServiceTips from '../../../../../../components/ServiceTips';
import AddMoreLanguage from "../../../../../../components/AddMoreLanguage";
class MtlQatiemDailog extends Component{
    constructor(props){
        super(props)
    }
    onSaveAndClose = () => {
        let that = this;
        let {type,initData,mtlId,form,dataTyId} = this.props;
        let data = initData || {};
        form.validateFields((errors, value) =>{
            if(errors){

            }else{
                  value = Object.assign({},value,{mtlId:mtlId,dataTyId:dataTyId})
                //data为空对象，表示是新增,否则表示是编辑
                if(JSON.stringify(data) !== "{}"){
                    value = Object.assign({},value,{id:data.id,optlock:data.optlock,localName:data.qaItem.localName})
                }
                //apiPost 保存数据
                apiPost(API_FOODING_DS,'/mtlQaitem/save',value,response => {
                    ServiceTips({text:response.message,type:'success'});
                    //getPage 刷新单个模块数据
                    that.props.onSaveAndClose(mtlId)
                },error => {
                    ServiceTips({text:error.message,type:'error'})
                })
            }
        })
    }
    onCancel = () => {
        const {onCancel} = this.props;
        if(onCancel){
            onCancel();
        }
    }
    render(){
        const { getFieldProps, getFieldError, getNFieldProps, getFieldErrorStyle} = this.props.form;
        let {initData} = this.props;
        let common = <div></div>;
        let common1= <div></div>;
        let {calSymBols,qaItems,testMeths, qaItem} = initData;
        this.data = Object.assign({},initData);
        if (JSON.stringify(initData) !== "{}") {
            common = <AddMoreLanguage
                menusetView={initData}
                object={'mtlQaitem'}
                upload={this.props.onSaveAndClose}
                attr={'maxQaValueId'}
                onCancel={this.onCancel}
            />
        }
        if (JSON.stringify(initData) !== "{}") {
            common1 = <AddMoreLanguage
                menusetView={initData}
                object={'mtlQaitem'}
                upload={this.props.onSaveAndClose}
                attr={'testQaValueId'}
                onCancel={this.onCancel}
            />
        }
        return (
            <FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
	           <div className={' girdlayout'}>
                    <div className={'row'}>
                        <div className="form-group col-md-2 col-lg-2">
                            <label className={'col-md-6 col-lg-6'}>{i18n.t(100602/*主要*/)}</label>
                            <Checkbox
                                {...getFieldProps('majMrk',{
                                    initialValue:initData&&initData.majMrk?initData.majMrk:false
                                })}
                                checked={this.props.form.getFieldValue("majMrk")}
                            />
                        </div>
                        <div className="form-group col-md-10 col-lg-10">
                            <div className={'row'}>
                                <div className="form-group col-md-6 col-lg-6">
                                    <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(400163/*规格名称*/)}</label>
                                    <ConstVirtualSelect
                                        apiType={apiPost}
                                        form={this.props.form}
                                        fieldName="qaItemId"
                                        rules
                                        apiParams={'com.fooding.fc.ds.entity.QaItem'}
                                        initialValue={qaItem?{s_label:qaItem.localName,qaItemId:qaItem.id}:undefined}
                                        className="col-md-9 col-lg-9"
                                    />
                                </div>
                                <div className="form-group col-md-6 col-lg-6">
                                    <label className={'col-md-1 col-lg-1'}/>
                                    <ConstVirtualSelect
                                        form={this.props.form}
                                        apiType={apiPost}
                                        apiParams={'com.fooding.fc.enumeration.CalSymBol'}
                                        fieldName="maSymbId"
                                        style={{float: 'left'}}
                                        initValueOptions={calSymBols}
                                        initRequest={true}
                                        clearable
                                        initialValue={initData.maSymbId?String(initData.maSymbId):undefined}
                                        className="col-md-5 col-lg-5"
                                    />
                                    <label className={'col-md-1 col-lg-1'}/>
                                    <input type="text" {...getFieldProps('maxQaValue', {
                                        initialValue:initData&&initData.maxQaValue?initData.maxQaValue:''
                                    })} className={"col-md-5 col-lg-5 text-input-nowidth"}  />
                                    {common}
                                </div>
                            </div>
                            <div className={'row'}>
                                <div className="form-group col-md-6 col-lg-6">
                                    <label className={'col-md-3 col-lg-3'}>{i18n.t(100606/*测试方法*/)}</label>
                                    <ConstVirtualSelect
                                        form={this.props.form}
                                        apiType={apiPost}
                                        apiParams={'com.fooding.fc.ds.entity.TestMeth'}
                                        pageSize={6}
                                        fieldName="testMethId"
                                        initValueOptions={testMeths}
                                        clearable
                                        initialValue={initData.testMeth?{s_label:initData.testMeth.localName,testMethId:initData.testMeth.id}:undefined}
                                        className="col-md-9 col-lg-9"
                                    />
                                </div>
                                <div className="form-group col-md-6 col-lg-6">
                                    <label className={'col-md-4 col-lg-4'}>{i18n.t(400162/*指标检测值*/)}</label>
                                    <input type="text" {...getFieldProps('testQaValue', {
                                        initialValue:initData&&initData.testQaValue?initData.testQaValue:''
                                    })} className="col-md-8 col-lg-8 text-input-nowidth"/>
                                    {common1}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
			</FormWrapper>)
    }
}

const mtlQatForm = createForm()(MtlQatiemDailog);
export default mtlQatForm;