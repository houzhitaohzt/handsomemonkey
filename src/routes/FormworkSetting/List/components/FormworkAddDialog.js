import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import RightKey from '../../../../components/RightKey/RightKey';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option,ConstVirtualSelect } from '../../../../components/Select';
import DataTime from  '../../../../components/Calendar/Calendar';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS , API_FOODING_TPM} from "../../../../services/apiCall";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
import {I18n} from '../../../../lib/i18n';

import '../../../../components/Summernote/assets/email/semail.less'; // import styles
import ReactSummernote from '../../../../components/Summernote/components/react-summernote';
import 'bootstrap/js/modal';
import 'bootstrap/js/dropdown';
import '../../../../components/Summernote/components/tooltip';

import ServiceTips from "../../../../components/ServiceTips";//提示框
import Checkbox from '../../../../components/CheckBox';

export class  FormworkAddDialog extends Component{
    constructor(props){
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.onSaveAdd = this.onSaveAdd.bind(this);
        this.state = {
            content: '',
        }
    }
    onSaveAdd (){
        const {form, onSaveAdd} = this.props;
        form.validateFields((errors, value) => {
            if(errors){

            }else{
                let params = Object.assign({},form.getFieldsValue(),{content:ReactSummernote.getText()});
                // let params = Object.assign({},form.getFieldsValue(),{content: this.state.content});
                apiPost(API_FOODING_TPM,"/template/save",params, response => {
                    onSaveAdd && onSaveAdd();
                    ServiceTips({text:response.message,type:'success'});
                    form.resetFields();
                },error => ServiceTips({text:error.message,type:'error'}));
            }
        })
    }
    onSaveAndClose(){
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if(errors){

            }else{
                let params = Object.assign({},form.getFieldsValue(),{content:ReactSummernote.getText()});
                // let params = Object.assign({},form.getFieldsValue(),{content: this.state.content});
                apiPost(API_FOODING_TPM,"/template/save",params, response => {
                    onSaveAndClose && onSaveAndClose();
                    ServiceTips({text:response.message,type:'success'});
                    form.resetFields();
                },error => ServiceTips({text:error.message,type:'error'}));
            }
        })
    }
    onCancel(){
        let that = this;
        const {onCancel} = this.props;
        if(onCancel){
            onCancel();
            that.props.form.resetFields();
        }
    }
    componentDidMount(){

    }

    onWriteChange = (event)=> {
        let value = event.target.value;
        let { content } = this.state;
        this.setState({ content: value});
    };

    render(){
        const { getFieldProps, getFieldError } = this.props.form;
        return(
            <div className="action-normal-buttons">
                <FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} showSaveAdd={true} onSaveAdd={this.onSaveAdd} width={976}>
                    <div className={'girdlayout'} >
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(400203/*模板名称*/)}</label>
                                <input type="text" {...getFieldProps('templateName', {
                                    rules: [{required:true}],
                                    initialValue:''
                                })} className={getFieldError('templateName')?"col-md-9 col-lg-9 text-input-nowidth error-border":"col-md-9 col-lg-9 text-input-nowidth"} placeholder=""/>
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(400203/*模板名称*/)}</label>
                                <input type="text" {...getFieldProps('identity', {
                                    rules: [{required:true}],
                                    initialValue:''
                                })} className={getFieldError('identity')?"col-md-9 col-lg-9 text-input-nowidth error-border":"col-md-9 col-lg-9 text-input-nowidth"} placeholder=""/>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(400204/*模板标识*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    fieldName="type"
                                    rules
                                    apiType={apiPost}
                                    initValueOptions={[]}
                                    initialValue={''}
                                    className="col-md-9 col-lg-9"
                                    apiParams="com.fooding.fc.enumeration.TemplateType"
                                />
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(400206/*语种*/)}</label>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    fieldName="language"
                                    rules
                                    apiType={apiPost}
                                    initValueOptions={[]}
                                    initialValue={''}
                                    className="col-md-9 col-lg-9"
                                    apiParams="com.fooding.fc.enumeration.Language"
                                />
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-3 col-lg-3'}>{i18n.t(400208/*是否淸缓存*/)}</label>
                                <Checkbox
                                    {...getFieldProps("isClearCache" ,{
                                        initialValue: false
                                    })}
                                    checked={this.props.form.getFieldValue("isClearCache")}
                                />
                            </div>
                        </div>
                        {/*<textarea className='scroll formworkedit' value={this.state.content || ""} onChange={this.onWriteChange}/>*/}
                        <ReactSummernote
                            value={''}
                            options={{
                                lang: 'zh-CN',
                                height: 240,
                                dialogsInBody: true,
                                dialogsFade:false,
                                toolbar: [
                                    ['style', ['undo','redo']],
                                    ['font', ['fontsize','bold', 'underline', 'clear','color','backColor','italic']],
                                    ['fontname', ['fontname']],
                                    ['para', ['ul', 'ol', 'paragraph','paragraph1','height']],
                                    ['table', ['table']],
                                    ['insert', ['link',]],
                                    ['view', ['codeview']]
                                ]
                            }}
                            className={"formworkadd"}
                            codeview={true}
                        />
                    </div>
                </FormWrapper>
            </div>
        );
    }
}
FormworkAddDialog.propTypes ={
    onSaveAndClose:PropTypes.func,
    onCancel:PropTypes.func
}
FormworkAddDialog.defaultProps ={
    onSaveAndClose(){},
    onCancel(){}
}
const FormworkAddForm =createForm()(FormworkAddDialog);
export default FormworkAddForm;
