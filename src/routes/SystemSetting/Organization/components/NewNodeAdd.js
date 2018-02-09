import i18n from './../../../../lib/i18n';
import React, {PropTypes, Component} from 'react';
import {createForm, FormWrapper} from "../../../../components/Form";
//引入select插件
import Select, {Option, ConstVirtualSelect, ConstMiniSelect} from '../../../../components/Select';

import {Translate, Localize, I18n} from '../../../../lib/i18n';

import {API_FOODING_DS, API_FOODING_ES, apiGet, apiPost} from '../../../../services/apiCall';

class CommonForm extends Component {
    constructor(props) {
        super(props)
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.state = this.initState();
    }

    initState() {
        return {
            cntryId: '',
            initData: {},
        }
    }

    static defaultProps = {
        onSaveAndClose() {
        },
        onCancel() {
        }
    }

    componentDidMount() {

    }

    onSaveAndClose() {
        const {form, onSaveAndClose} = this.props;
        form.validateFields((errors, value) => {
            if (null == errors) {
                this.props.onSaveAndClose(value);
                form.resetFields();
            }
        })
    }

    onCancel() {
        const {onCancel} = this.props;
        if (onCancel) {
            onCancel();
        }
    }

    onChange(e, a, b) {
        console.log(e, a, b);
    }

    render() {
        const {form, typeArray, parentId} = this.props;
        const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
        const disabled = form.isFieldsValidating() || form.isSubmitting();
        let typeId = getFieldValue('typeId');
        return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
            <div className={'girdlayout'}>
                <div className={'row'}>
                    <div className="form-group col-xs-6 col-md-6">
                        <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100001/*名称*/)}</label>
                        <input type='text'
                               className={getFieldError('name') ? 'col-xs-9 col-md-9 text-input-nowidth error-border' : 'col-xs-9 col-md-9 text-input-nowidth'}
                               placeholder=""
                               {...getFieldProps('name', {
                                   validateFirst: true,
                                   rules: [{required: true,}],
                                   valuedateTrigger: 'onBlur',
                                   initialValue: ''
                               })} />
                    </div>
                    <div className="form-group col-xs-6 col-md-6">
                        <label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(200080/*类型*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            isRequest={false}
                            fieldName="typeId"
                            rules
                            initValueOptions={typeArray}
                            initialValue={undefined}
                            className="col-md-9 col-lg-9"
                        />
                    </div>
                    {
                        typeId == 50 || typeId == 40 ? <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}><span>*</span>{typeId == 50 ? i18n.t(400269/*岗位属性*/) : i18n.t(400270/*部门属性*/)}</label>
                            <ConstMiniSelect form={this.props.form}
                                             refreshMark={getFieldValue("typeId", typeId)}
                                             pbj={{
                                                 apiType: apiPost,
                                                 host: API_FOODING_DS,
                                                 uri: "/object/getMiniList",
                                                 params:  typeId  == 50 ? "com.fooding.fc.ds.entity.Positn" : "com.fooding.fc.ds.entity.Depmnt"
                                             }}
                                             fieldName="typeAttributeId"
                                             optionValue={'code'}
                                             initValueOptions={[]}
                                             className='currency-btn select-from-currency col-xs-9 col-md-9'
                                             initialValue={""}
                                             reles={true}/>
                        </div> : null
                    }
                    {/*{*/}
                        {/*typeId == 40 ? <div className="form-group col-xs-6 col-md-6">*/}
                            {/*<label className={'col-xs-3 col-md-3'}>部门属性</label>*/}
                            {/*<ConstVirtualSelect form={this.props.form}*/}
                                                {/*apiType={apiPost}*/}
                                                {/*refreshMark={getFieldValue("typeId")}*/}
                                                {/*apiParams={"com.fooding.fc.ds.entity.Depmnt"}*/}
                                                {/*fieldName="typeAttributeId"*/}
                                                {/*initValueOptions={[]}*/}
                                                {/*className='col-xs-9 col-md-9'*/}
                                                {/*initialValue={""}*/}
                                                {/*reles={true}*/}
                                                {/*valueKeys={"code"}*/}
                            {/*/>*/}
                        {/*</div> : null*/}
                    {/*}*/}
                    {/*{*/}
                        {/*typeId == 50 ? <div className="form-group col-xs-6 col-md-6">*/}
                            {/*<label className={'col-xs-3 col-md-3'}>岗位属性</label>*/}
                            {/*<ConstVirtualSelect form={this.props.form}*/}
                                                {/*apiType={apiPost}*/}
                                                {/*refreshMark={getFieldValue("typeId")}*/}
                                                {/*apiParams={"com.fooding.fc.ds.entity.Positn"}*/}
                                                {/*fieldName="typeAttributeId"*/}
                                                {/*initValueOptions={[]}*/}
                                                {/*className='col-xs-9 col-md-9'*/}
                                                {/*initialValue={""}*/}
                                                {/*reles={true}*/}
                                                {/*valueKeys={"code"}*/}
                            {/*/>*/}
                        {/*</div> : null*/}
                    {/*}*/}
                </div>
            </div>
        </FormWrapper>);
    }
}

CommonForm = createForm()(CommonForm);

export default CommonForm;

