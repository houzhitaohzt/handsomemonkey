import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Radio from "../../../../components/Radio";
import {createForm, FormWrapper} from '../../../../components/Form';
import Calendar from '../../../../components/Calendar/Calendar';
import xt from '../../../../common/xt'; // 下拉
import SelectChange from "../../../../components/SelectChange";
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, {ConstVirtualSelect, Option, ConstMiniSelect} from '../../../../components/Select'; // 下拉
import {
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_ES,
    API_FOODING_DS,
    API_FOODING_ERP,
    language,
    commonAjax,
    toDecimal,
    API_FOODING_HR
} from '../../../../services/apiCall';
import {I18n} from "../../../../lib/i18n";
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import WebData from '../../../../common/WebData';

class Addnormal extends Component {
    constructor(props) {
        super(props);
        this.saveClick = this.saveClick.bind(this);
        this.onBack = this.onBack.bind(this);
        this.state = this.initState();
    }

    initState() {
        return {
            positionName: "", //职位
            workingStatename: "", //在职状态
            id: this.props.location.query.id || "",
            getOne: this.props.getOneData || {}
        }
    }

    componentWillReceiveProps(props) {
        if (props.getOneData !== this.props.getOneData) {
            this.setState({getOne: props.getOneData});
        }
    }

    changeUser = o => {
        this.getOneData(o.s_employeeId);
    };

    getOneData = id => {
        if (!id) return;
        let that = this;
        let {getOne} = this.state;
        apiGet(API_FOODING_ES, "/staff/getOneById", {id}, response => {
            let data = response.data || {};
            let organization = data.organization || {};
            that.setState({
                getOne: Object.assign({}, getOne, {
                    depmnt: {
                        id: organization.id || "",
                        name: organization.name || "",
                        enName: organization.enName || "",
                        code: organization.code || "",
                        localName: organization.localName
                    },
                    positionName: organization.partyType && organization.partyType.name ? organization.partyType.name : "",
                    workingStateName: data.workingState && data.workingState.name ? data.workingState.name : "",
                })
            })

        }, error => ServiceTips({text: error.message, type: 'error'}))
    };

    // 保存
    saveClick() {
        let that = this;
        const {router, navReplaceTab, form} = that.props;

        form.validateFields((errors, value) => {
            if (errors) {

            } else {
                let param = this.props.form.getFieldsValue();
                console.log(param, that.state.getOne);
                apiPost(API_FOODING_HR, '/attendCard/save', Object.assign({}, that.state.getOne, param),
                    (response) => {
                        that.setState({id: response.data}, function () {
                            Confirm(i18n.t(500100/*保存成功, 是否跳转到详情界面?*/), {

                                timing: 5,
                                done: () => {
                                    navReplaceTab({id: 13, name: '考勤发卡详情', component: '考勤发卡详情', url: '/attendancecard/detail'});
                                    router.push({pathname: '/attendancecard/detail', query: {id: response.data}, state: {refresh: true}});
                                },
                                cancel: () => {
                                    router.push({pathname: router.location.pathname, query: {...router.location.query, id: response.data}});
                                }
                            });
                        });
                    }, (errors) => {
                        ServiceTips({text: errors.message, type: 'error'});
                    });
            }
        });
    }

    // 返回
    onBack() {
        let billId = this.props.location.query.id;
        if (billId) {
            this.props.navReplaceTab({name: '发卡详情', component: '发卡详情', url: '/attendancecard/detail'});
            this.props.router.push({pathname: '/attendancecard/detail', query: {id: billId}});
        } else {
            this.props.navReplaceTab({name: '考勤发卡', component: '考勤发卡', url: '/attendancecard'});
            this.props.router.push({pathname: '/attendancecard'});
        }
    }

    render() {
        let that = this;
        let {getNFieldProps, getFieldProps, getFieldError, getFieldValue} = this.props.form;
        let {form} = this.props;
        let {getOne} = this.state;
        return (
            <div className={'addnormal'}>
                <div className={'addnormal-title'}>
                    <span></span>
                    <span onClick={this.onBack}><i className={'foddingicon fooding-back'}></i></span>
                    <span onClick={this.saveClick}><i className={'foddingicon fooding-save'}></i></span>
                </div>
                <div className={'  girdlayout'}>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>集团</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                apiHost={API_FOODING_ES}
                                apiUri="/party/getLoginClusters"
                                fieldName="cluster"
                                initialValue={xt.initSelectValue(true, WebData.user.data.staff.cluster, ['cluster'], 'localName', form, true)}
                                valueKeys={da => ({
                                    ...da,
                                    s_ignore_label: true
                                })} disabled
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100244/*企业*/)}</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                apiUri="/party/getLoginCompanies"
                                apiHost={API_FOODING_ES}
                                apiParams={{clusId: WebData.user.data.staff.clusId}}
                                fieldName="company"
                                initialValue={xt.initSelectValue(getOne.company && getOne.company.id || WebData.user.data.staff.company, getOne.company || WebData.user.data.staff.company, ['company'], 'localName', form, true)}
                                valueKeys={da => ({
                                    ...da,
                                    s_ignore_label: true
                                })} rules
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>职员选择</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                fieldName='employeeId'
                                apiType={apiGet}
                                apiHost={API_FOODING_ES}
                                apiUri='/staff/search'
                                async={true}
                                className={'col-md-8 col-lg-8'}
                                apiParams='keyWord'
                                rules={true}
                                initialValue={xt.initSelectValue(getOne, getOne, ['employeeId', 'employeeName'], 'employeeName', form)}
                                onChange={this.changeUser}
                                valueKeys={da => ({
                                    s_employeeId: da.id,
                                    employeeId: da.code,
                                    employeeName: da.name,
                                    s_label: da.name,
                                })}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>所属部门</label>
                            <ConstVirtualSelect
                                form={this.props.form}
                                apiHost={API_FOODING_ES}
                                apiUri={'/party/getPartysByType'}
                                fieldName="depmnt"
                                initialValue={xt.initSelectValue(getOne.depmnt && getOne.depmnt.id, getOne.depmnt || {}, ['depmnt'], 'localName', form, true)}
                                valueKeys={da => ({
                                    ...da,
                                    s_ignore_label: true
                                })} disabled

                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>职位</label>
                            <input type="text"
                                   value={getOne.positionName || ""} disabled
                                   className={'col-md-8 col-lg-8 text-input-nowidth'}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>在职状态</label>
                            <input type="text"
                                   value={getOne.workingStateName || ""} disabled
                                   className={'col-md-8 col-lg-8 text-input-nowidth'}
                            />
                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}><span>*</span>考勤卡号</label>
                            <input type="text"
                                   {...getNFieldProps('cardNo', {
                                       initialValue: getOne['cardNo'] || '',
                                       rules: [{required: true}]
                                   })}
                                   className={getFieldError('cardNo') ? 'col-md-8 col-lg-8 text-input-nowidth error-border' : 'col-md-8 col-lg-8 text-input-nowidth'}
                            />

                        </div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4 datetime'}>生效日期</label>
                            <Calendar
                                width={'100%'}
                                showTime={false}
                                isShowIcon={true}
                                form={this.props.form}
                                name={'effectDate'}
                                value={getOne.effectDate || ''}
                            />
                        </div>
                    </div>
                    <div className={'row'}>

                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>描述</label>
                            <input type="text"
                                   {...getNFieldProps('mark', {
                                       initialValue: getOne['mark'] || '',
                                   })}
                                   className={'col-md-8 col-lg-8 text-input-nowidth'}
                            />

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const ProductForm = createForm()(Addnormal);
export default ProductForm;
