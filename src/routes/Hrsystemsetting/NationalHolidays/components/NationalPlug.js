import React, {Component, PropTypes} from 'react';
import {createForm, FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, {Option, ConstMiniSelect, ConstVirtualSelect} from '../../../../components/Select';
import Radio from '../../../../components/Radio';
import AddMoreLanguage from "../../../../components/AddMoreLanguage";
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import DataTime from '../../../../components/Calendar/Calendar';
import Input from '../../../../components/FormValidating/FormValidating';
import Checkbox from "../../../../components/CheckBox";
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, API_FOODING_HR} from '../../../../services/apiCall';
import Loading from "../../../../components/Loading";//加载动画
import ServiceTips from "../../../../components/ServiceTips";//提示框
import {I18n} from "../../../../lib/i18n";
import xt from '../../../../common/xt';
import NameCheck from "../../../../components/InputBoxCheck/NameCheck";
import Dialog from '../../../../components/Dialog/Dialog';
export class Productplug extends Component {
    constructor(props) {
        super(props);
        this.addSelect;
        this.getData = this.getData.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onSaveAdd = this.onSaveAdd.bind(this);

        let nowData = new Date();
        this.yearList = [nowData.getFullYear(), nowData.getFullYear() + 1].map(da => ({id: da, name: da}));
        this.state = {
            dialogContent : <div></div>,
            showDilaogsecond:false
        }

    }

    getData(value, that) {
        this.addSelect = that;
    }

    onSaveAndClose(isAdd) {
        const {form, onSaveAndClose} = this.props;
        console.log(form.getFieldsValue())
        form.validateFields((errors, value) => {
            if (errors) {

            } else {
                let params = this.props.form.getFieldsValue();
                if (this.props.DialogContent == 1) {
                    delete params['id'];
                    delete params['optlock'];
                    delete params['nameValues'];
                }
                apiPost(API_FOODING_HR, '/holiday/save', params, (response) => {
                    ServiceTips({text: response.message, type: 'success'});
                    this.props.onSaveAndClose(!!isAdd);
                    this.props.form.resetFields();
                }, (errors) => {
                    ServiceTips({text: errors.message, type: 'error'});

                })

            }
        })
    }

    onSaveAdd() {
        this.onSaveAndClose(true);
    }
    onCancelSecond = () => {
        this.setState({
            showDilaogsecond:false
        })
    }
    onCancel() {
        const {form, onCancel} = this.props;
        this.props.onCancel();
        this.props.form.resetFields();
    }
    nativeClick = () => {
        let content=require('../../../MenuSetting/components/MoreLanguageSetDialog').default;
        let element=React.createElement(content,{onSaveAndClose:this.upload,
            menusetView:this.props.checkedData,
            apiHost:API_FOODING_DS,
            object:'vacationName',
            onCancel:this.onCancelSecond})
        this.setState({
            showDilaogsecond : true,
            title: I18n.t(100496/*多语言配置*/),
            dialogContent: element
        })
    };
    upload = () => {

    };
    render() {
        let that = this;
        let {form} = this.props;
        const {getFieldProps, getFieldError, getNFieldProps, getFieldValue} = this.props.form;
        let {checkedData} = this.props;
        console.log(checkedData.dateBegin);
        let content = <div></div>;
        if (this.props.DialogContent == 1) {
            content = (
                /*新增*/
                <div className={'addnormal'} style={{marginBottom: '10px'}}>
                    <div className={'  girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>节假日编号</label>
                                <input type="text"
                                       className={getFieldError("code") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
                                       {...getFieldProps('code', {
                                           initialValue: '',
                                           rules: [{required:true}]
                                       })}
                                />
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>节假日名称</label>
                                <input type="text"
                                       className={getFieldError("name") ?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
                                       {...getFieldProps('name', {
                                           initialValue: '',
                                           rules: [{required:true}]
                                       })}
                                />
                                <i className={'foddingicon fooding-nation_icon'} style={{position:'absolute',top:'9px',right:'10px',cursor:'pointer'}} onClick={this.nativeClick.bind(this)}></i>
                            </div>

                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>国家</label>
                                <ConstVirtualSelect
                                    form={form}
                                    apiType={apiPost}
                                    fieldName="country"
                                    apiParams="com.fooding.fc.ds.entity.Country"
                                    valueKeys={da => ({
                                        ...da,
                                        s_ignore_label: true
                                    })}
                                    className='col-md-8 col-lg-8'
                                />
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>年度</label>
                               {/* <ConstVirtualSelect
                                    form={form}
                                    isRequest={false}
                                    fieldName="year"
                                    initValueOptions={that.yearList}
                                    className='col-md-8 col-lg-8'
                                />*/}
                                <ConstVirtualSelect
                                    form={form}
                                    fieldName="year"
                                    rules
                                    apiType={apiGet}
                                    apiHost={API_FOODING_HR}
                                    apiUri = "/calendar/getYear"
                                    initValueOptions={checkedData.year ? [String(checkedData.year)] : []}
                                    initialValue={String( checkedData.year )}
                                    valueKeys={da => String(da)}
                                />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>开始时间</label>
                                <div className={'col-md-8 col-lg-8 datetime'}>
                                    <DataTime
                                        range={true}
                                        type="start"
                                        startName="dateBegin"
                                        name="dateBegin"
                                        endName="dateEnd"
                                        showTime={false}
                                        isShowIcon={true}
                                        width={'100%'}
                                        form={this.props.form}
                                        value={[undefined, undefined]}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>结束时间</label>
                                <div className={'col-md-8 col-lg-8 datetime'}>
                                    <DataTime
                                        range={true}
                                        type="end"
                                        startName="dateBegin"
                                        name='dateEnd'
                                        endName="dateEnd"
                                        showTime={false}
                                        isShowIcon={true}
                                        width={'100%'}
                                        form={this.props.form}
                                        value={[undefined, undefined]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (this.props.DialogContent == 3) {
            checkedData = checkedData || {};
            getFieldProps('id', {
                validateFirst: true,
                initialValue: checkedData ? checkedData.id : ''
            })
            getFieldProps('optlock', {
                validateFirst: true,
                initialValue: checkedData ? checkedData.optlock : ''
            })
            getFieldProps('rowSts', {
                validateFirst: true,
                initialValue: checkedData ? checkedData.rowSts : ''
            })
            content = (
                <div className={'addnormal'} style={{marginBottom: '10px'}}>
                    <div className={'  girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>节假日编号</label>
                                <input type="text" className='col-md-8 col-lg-8 text-input-nowidth'
                                       {...getFieldProps('code', {
                                           initialValue: checkedData ? checkedData.code : '',
                                       })}
                                    disabled={true}
                                />
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}><span>*</span>节假日名称</label>

                                <NameCheck
                                    form={this.props.form}
                                    fieldName='name'
                                    rules={true}
                                    initialValue={checkedData ? checkedData.name : ''}
                                    className={'col-md-8 col-lg-8'}
                                />
                                <i className={'foddingicon fooding-nation_icon'} style={{position:'absolute',top:'9px',right:'10px',cursor:'pointer'}} onClick={this.nativeClick.bind(this)}></i>
                            </div>

                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(100087/*国家*/)}</label>
                                <ConstVirtualSelect
                                    form={form}
                                    apiType={apiPost}
                                    fieldName="country"
                                    apiParams="com.fooding.fc.ds.entity.Country"
                                    valueKeys={da => ({
                                        ...da,
                                        s_ignore_label: true
                                    })}
                                    initialValue={xt.initSelectValue(checkedData.country && checkedData.country.id , checkedData.country || {}, ['country'], 'localName', form, true)}
                                    className='col-md-8 col-lg-8'
                                />
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>年度</label>
                                <ConstVirtualSelect
                                    form={form}
                                    isRequest={false}
                                    apiType={apiGet}
                                    apiHost={API_FOODING_HR}
                                    apiUri = "/calendar/getYear"
                                    initValueOptions={checkedData.year ? [String(checkedData.year)] : []}
                                    fieldName="year"
                                    //initialValue={checkedData ? checkedData.year : ""}
                                    initialValue={String( checkedData.year )}
                                    valueKeys={da => String(da)}
                                    className='col-md-8 col-lg-8'
                                />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>开始时间</label>
                                <div className={'col-md-8 col-lg-8 datetime'}>
                                    <DataTime
                                        range={true}
                                        type="start"
                                        startName="dateBegin"
                                        name="dateBegin"
                                        endName="dateEnd"
                                        showTime={false}
                                        isShowIcon={true}
                                        width={'100%'}
                                        form={this.props.form}
                                        value={[new Date(checkedData && checkedData.dateBegin ?checkedData.dateBegin : "").Format('yyyy-MM-dd'),new Date(checkedData && checkedData.dateBegin ?checkedData.dateBegin : "").Format('yyyy-MM-dd')]}

                                    />
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>结束时间</label>
                                <div className={'col-md-8 col-lg-8 datetime'}>
                                    <DataTime
                                        range={true}
                                        type="end"
                                        startName="dateBegin"
                                        name='dateEnd'
                                        endName="dateEnd"
                                        showTime={false}
                                        isShowIcon={true}
                                        width={'100%'}
                                        form={this.props.form}
                                        value={
                                            [new Date(checkedData && checkedData.dateEnd ?checkedData.dateEnd : "").Format('yyyy-MM-dd'),new Date(checkedData && checkedData.dateEnd ?checkedData.dateEnd : "").Format('yyyy-MM-dd')]
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if (this.props.DialogContent == 5) {
            content = (
                <div className={'addnormal'} style={{marginBottom: '10px'}}>
                    <div className={'  girdlayout'}>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>节假日编号</label>
                                <div className="col-md-8 col-md-8">
                                    <p>{checkedData.code || ""}</p>
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>节假日名称</label>
                                <div className="col-md-8 col-md-8">
                                    <p>{checkedData.name || ""}</p>
                                </div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>{I18n.t(100087/*国家*/)}</label>
                                <div className="col-md-8 col-md-8">
                                    <p>{checkedData.country && checkedData.country.localName ? checkedData.country.localName : ""}</p>
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>年度</label>
                                <div className="col-md-8 col-md-8">
                                    <p>{checkedData.year}</p>
                                </div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>开始时间</label>
                                <div className="col-md-8 col-md-8">
                                    <p>{checkedData.dateBegin ? new Date(checkedData.dateBegin).Format('yyyy-MM-dd') : ""}</p>
                                </div>
                            </div>
                            <div className="form-group col-md-6 col-lg-6">
                                <label className={'col-md-4 col-lg-4'}>结束时间</label>
                                <div className="col-md-8 col-md-8">
                                    <p>{checkedData.dateEnd ? new Date(checkedData.dateEnd).Format('yyyy-MM-dd') : ""}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className="package-action-buttons">
                <FormWrapper
                    showFooter={true}
                    buttonLeft={this.props.buttonLeft}
                    showSaveAdd={this.props.showSaveAdd}
                    onSaveAndClose={this.onSaveAndClose}
                    onCancel={this.onCancel}
                    onSaveAdd={this.onSaveAdd}
                    showSaveClose={this.props.DialogContent == 5 ? false : this.props.showSaveClose}
                >
                    {content}
                    <Dialog width={976} visible={this.state.showDilaogsecond} title={this.state.title}>
                        {this.state.dialogContent}
                    </Dialog>
                </FormWrapper>
            </div>
        )
    }
}

const ProductForm = createForm()(Productplug);
export default ProductForm;

