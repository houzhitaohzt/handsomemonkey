import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import RightKey from '../../../../components/RightKey/RightKey';
import {createForm, FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, {Option, ConstMiniSelect} from './../../../../components/Select';
import Calendar from '../../../../components/Calendar/Calendar';
import Checkbox from '../../../../components/CheckBox';
//引入table
const {Table} = require("../../../../components/Table");
import ServiceTips, {errorTips, successTips} from '../../../../components/ServiceTips'; // 提示
import {apiPost, API_FOODING_DS, API_FOODING_ES, apiGet} from '../../../../services/apiCall';
import xt from '../../../../common/xt';

export class OrganizationNormalAndStaffDialog extends Component {
    constructor(props) {
        super(props);
        this.onSaveAndClose = this.onSaveAndClose.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.columns = [{
            title: i18n.t(100225/*工号*/),
            dataIndex: 'staffnumber',
            key: "staffnumber",
            width: '10%',
            render(data, row, index) {
                return (<div title={data}>{data}</div>)
            }
        },
            {
                title: i18n.t(100231/*姓名*/),
                dataIndex: 'name',
                key: "name",
                width: '10%',
                render(data, row, index) {
                    return (<div title={data}>{data}</div>)
                }
            },
            {
                title: i18n.t(100227/*职务*/),
                dataIndex: 'duty',
                key: "duty",
                width: '20%',
                render(data, row, index) {
                    return (<div title={data}>{data}</div>)
                }
            },
            {
                title: i18n.t(100228/*在职状态*/),
                dataIndex: 'status',
                key: "status",
                width: '10%',
                render(data, row, index) {
                    return (<div title={data}>{data}</div>)
                }
            },
            {
                title: i18n.t(200644/*电子邮箱*/),
                dataIndex: 'email',
                key: "email",
                render(data, row, index) {
                    return (<div title={data}>{data}</div>)
                }
            }]
        this.state = {
            data: [{
                'staffnumber': '1053',
                'name': i18n.t(201204/*王垚*/),
                'duty': i18n.t(201205/*采购部门经理*/),
                'status': i18n.t(201206/*正式*/),
                'email': 'sourcing@chinafooding.com'
            }, {
                'staffnumber': '1053',
                'name': i18n.t(201204/*王垚*/),
                'duty': i18n.t(201205/*采购部门经理*/),
                'status': i18n.t(201206/*正式*/),
                'email': 'sourcing@chinafooding.com'
            }, {
                'staffnumber': '1053',
                'name': i18n.t(201204/*王垚*/),
                'duty': i18n.t(201205/*采购部门经理*/),
                'status': i18n.t(201206/*正式*/),
                'email': 'sourcing@chinafooding.com'
            }
            ]
        }
    }

    render() {
        let that = this;
        const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
        let {data} = this.props;
        let responseData = data.name.responseData;
        let content;
        let typeId = getFieldValue('typeId', xt.getItemValue(responseData, 'party.typeId', ''));
        if (data.name.title == i18n.t(100138/*常规*/)) {
            content = (
                <div className="girdlayout">
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}><span>*</span>{data.name.data[0].key}</label>
                            <input type='text' className={getFieldError("localName")?'col-xs-9 col-md-9 text-input-nowidth error-border':'col-xs-9 col-md-9 text-input-nowidth'}
                                   placeholder=""
                                   {...getFieldProps('localName', {
                                       validateFirst: true,
                                       rules: [{required: true,}],
                                       valuedateTrigger: 'onBlur',
                                       initialValue: data.name.data[0].value
                                   })} />
                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}><span>*</span>{data.name.data[1].key}</label>
                            <ConstMiniSelect form={this.props.form} pbj={{
                                apiType: apiGet,
                                host: API_FOODING_ES,
                                uri: '/party/getPartyTypes',
                                params: {parentId: responseData.party.parentId}
                            }} fieldName="typeId"
                                             initValueOptions={responseData.party.partyType ? [responseData.party.partyType] : []}
                                             className='currency-btn select-from-currency col-xs-9 col-md-9'
                                             initialValue={xt.getItemValue(responseData, 'party.partyType.id', '')}
                                             reles={true}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}>{data.name.data[2].key}</label>
                            <input type='text' className={'col-xs-9 col-md-9 text-input-nowidth'}
                                   placeholder=""
                                   {...getFieldProps('enName', {
                                       initialValue: responseData.party.enName || ''
                                   })} />
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
                                                 initValueOptions={typeId  == 50 ? (responseData.party.positn ? [responseData.party.positn] : []) : (responseData.party.depmnt ? [responseData.party.depmnt] : [])}
                                                 className='currency-btn select-from-currency col-xs-9 col-md-9'
                                                 initialValue={typeId == 50 ? xt.getItemValue(responseData, 'party.positn.code', '') : xt.getItemValue(responseData, 'party.depmnt.code', '')}
                                                 reles={true}/>
                            </div> : null
                        }
                        {/*{*/}
                            {/*typeId == 50 ? <div className="form-group col-xs-6 col-md-6">*/}
                                {/*<label className={'col-xs-3 col-md-3'}>岗位属性</label>*/}
                                {/*<ConstMiniSelect form={this.props.form}*/}
                                                 {/*refreshMark={getFieldValue("typeId", typeId)}*/}
                                                 {/*pbj={{*/}
                                                     {/*apiType: apiPost,*/}
                                                     {/*host: API_FOODING_DS,*/}
                                                     {/*uri: "/object/getMiniList",*/}
                                                     {/*params: "com.fooding.fc.ds.entity.Positn"*/}
                                                 {/*}}*/}
                                                 {/*fieldName="typeAttributeId"*/}
                                                 {/*optionValue={'code'}*/}
                                                 {/*initValueOptions={responseData.party.positn ? [responseData.party.positn] : []}*/}
                                                 {/*className='currency-btn select-from-currency col-xs-9 col-md-9'*/}
                                                 {/*initialValue={xt.getItemValue(responseData, 'party.positn.code', '')}*/}
                                                 {/*reles={true}/>*/}
                            {/*</div> : null*/}
                        {/*}*/}
                        {/*{*/}
                            {/*typeId == 40 ? <div className="form-group col-xs-6 col-md-6">*/}
                                {/*<label className={'col-xs-3 col-md-3'}>部门属性</label>*/}
                                {/*<ConstMiniSelect form={this.props.form}*/}
                                                 {/*refreshMark={getFieldValue("typeId", typeId)}*/}
                                                 {/*pbj={{*/}
                                                     {/*apiType: apiPost,*/}
                                                     {/*host: API_FOODING_DS,*/}
                                                     {/*uri: "/object/getMiniList",*/}
                                                     {/*params: "com.fooding.fc.ds.entity.Depmnt"*/}
                                                 {/*}}*/}
                                                 {/*optionValue={'code'}*/}
                                                 {/*fieldName="typeAttributeId"*/}
                                                 {/*initValueOptions={responseData.party.depmnt ? [responseData.party.depmnt] : []}*/}
                                                 {/*className='currency-btn select-from-currency col-xs-9 col-md-9'*/}
                                                 {/*initialValue={xt.getItemValue(responseData, 'party.positn.code', '')}*/}
                                                 {/*reles={true}/>*/}
                            {/*</div> : null*/}
                        {/*}*/}
                    </div>
                </div>
            );
        } else if (data.name.title == i18n.t(400145/*职员*/)) {
            if (data.number == 0) {
                content = (
                    <div className="girdlayout scroll">
                        <div className={'row'}>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}>{i18n.t(100225/*工号*/)}</label>
                                <div className={'col-xs-9 col-md-9'}>
                                    <p className={'paragraph'}>{data.record.staffnumber}</p>
                                </div>
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}>{i18n.t(100231/*姓名*/)}</label>
                                <div className={'col-xs-9 col-md-9'}>
                                    <p className={'paragraph'}>{data.record.name}</p>
                                </div>
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}>{i18n.t(100227/*职务*/)}</label>
                                <div className={'col-xs-9 col-md-9'}>
                                    <p className={'paragraph'}>{data.record.duty}</p>
                                </div>
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}>{i18n.t(100228/*在职状态*/)}</label>
                                <div className={'col-xs-9 col-md-9'}>
                                    <p className={'paragraph'}>{data.record.status}</p>
                                </div>
                            </div>
                            <div className="form-group col-xs-6 col-md-6">
                                <label className={'col-xs-3 col-md-3'}>{i18n.t(200644/*电子邮箱*/)}</label>
                                <div className={'col-xs-9 col-md-9'}>
                                    <p className={'paragraph'}>{data.record.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else if (data.number == 1) {
                content = (<div className='scroll lose scroll-style'>
                    <Table
                        columns={this.columns}
                        data={this.state.data}
                        checkboxConfig={{show: true}}
                        colorFilterConfig={{show: false}}
                        followConfig={{show: false}}
                        prefixCls={"rc-confirm-table"}
                        scroll={{x: false, y: 210}}
                    />
                </div>);
            } else if (data.number == 3) {
                content = (<div className="girdlayout scroll">
                    <div className={'row'}>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}>{i18n.t(100225/*工号*/)}</label>
                            <input type="text" placeholder=""
                                   className="text-input-nowidth col-xs-9 col-md-9" {...getFieldProps('staffnumber', {
                                validateFirst: true,
                                rules: [{required: true,}],
                                valuedateTrigger: "onBlur",
                                initialValue: '' + data.record.staffnumber
                            })} />
                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}>{i18n.t(100231/*姓名*/)}</label>
                            <input type="text" placeholder=""
                                   className="text-input-nowidth col-xs-9 col-md-9" {...getFieldProps('staffnumber', {
                                validateFirst: true,
                                rules: [{required: true,}],
                                valuedateTrigger: "onBlur",
                                initialValue: '' + data.record.name
                            })} />
                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}>{i18n.t(100227/*职务*/)}</label>
                            <input type="text" placeholder=""
                                   className="text-input-nowidth col-xs-9 col-md-9" {...getFieldProps('duty', {
                                validateFirst: true,
                                rules: [{required: true,}],
                                valuedateTrigger: "onBlur",
                                initialValue: '' + data.record.duty
                            })} />
                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}>{i18n.t(100228/*在职状态*/)}</label>
                            <input type="text" placeholder=""
                                   className="text-input-nowidth col-xs-9 col-md-9" {...getFieldProps('status', {
                                validateFirst: true,
                                rules: [{required: true,}],
                                valuedateTrigger: "onBlur",
                                initialValue: '' + data.record.status
                            })} />
                        </div>
                        <div className="form-group col-xs-6 col-md-6">
                            <label className={'col-xs-3 col-md-3'}>{i18n.t(200644/*电子邮箱*/)}</label>
                            <input type="text" placeholder=""
                                   className="text-input-nowidth col-xs-9 col-md-9" {...getFieldProps('email', {
                                validateFirst: true,
                                rules: [{required: true,}],
                                valuedateTrigger: "onBlur",
                                initialValue: '' + data.record.email
                            })} />
                        </div>
                    </div>
                </div>)
            }
        }
        return (
            <div className="action-normal-buttons">
                <FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}
                             width={976}>
                    {content}
                </FormWrapper>
            </div>
        );
    }

    onSaveAndClose() {
        let {form, onSaveAndClose, data} = this.props;
        form.validateFields((errors, value) => {
            if (errors) {

            } else {
                apiPost(API_FOODING_ES, '/party/save', Object.assign(
                    {},
                    data.name.responseData.party,
                    value
                ), response => {
                    successTips("保存成功!");
                    onSaveAndClose && onSaveAndClose();
                    form.resetFields();
                }, error => {
                    errorTips("保存失败!");
                })
            }
        })
    }

    onCancel() {
        const {onCancel} = this.props;
        if (onCancel) {
            onCancel();
        }
    }
}

OrganizationNormalAndStaffDialog.propTypes = {
    onSaveAndClose: PropTypes.func,
    onCancel: PropTypes.func
}
OrganizationNormalAndStaffDialog.defaultProps = {
    onSaveAndClose() {
    },
    onCancel() {
    }
}
const OrganizationNormalAndStaffFrom = createForm()(OrganizationNormalAndStaffDialog);
export default OrganizationNormalAndStaffFrom;
