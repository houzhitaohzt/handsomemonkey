import React, {Component, PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option, ConstMiniSelect, ConstVirtualSelect} from '../../../../components/Select';
import DataTime from '../../../../components/Calendar/Calendar';
import SelectChange from "../../../../components/SelectChange";
// ajax
import {
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_ERP,
    API_FOODING_DS,
    API_FOODING_ES,
    API_FOODING_HR,
    language,
    pageSize,
    sizeList
} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import i18n, {I18n} from '../../../../lib/i18n';
import WebData from '../../../../common/WebData';

class Addnormal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {form} = this.props;
        const {getFieldProps, getFieldError, getFieldValue} = this.props.form;
        const {getOne = {}} = this.props;

        let curYear = parseInt(getFieldValue("calendarYear", getOne.calendarYear || new Date().getFullYear()));
        let thisDefaultCurBegin = new Date(curYear, 0,  1).Format('yyyy-MM-dd');
        let thisDefaultCurEnd = new Date(curYear + 1, 0, 0).Format('yyyy-MM-dd');

        return (
            <div className={'girdlayout'}>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(100243/*集团*/)}</label>
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
                            initialValue={xt.initSelectValue(getOne.company && getOne.company.id , getOne.company, ['company'], 'localName', form, true)}
                            valueKeys={da => ({
                                ...da,
                                s_ignore_label: true
                            })} rules
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400231/*日历类型*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            fieldName="calendarTypeId"
                            rules
                            apiType={apiPost}
                            initValueOptions={getOne.calendarType ? [getOne.calendarType] : []}
                            initialValue={String( getOne.calendarTypeId )}
                            apiParams="com.fooding.fc.enumeration.CalendarType"
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400209/*日历编号*/)}</label>
                        <input type="text" {...getFieldProps('code', {
                            rules: [{required: true,}],
                            valuedateTrigger: "onBlur",
                            initialValue: getOne.code || ""
                        })}
                           className={getFieldError("code") ? 'col-md-8 col-lg-8 text-input-nowidth error-border' : 'col-md-8 col-lg-8 text-input-nowidth'}
                           placeholder=""
                        />
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400230/*日历名称*/)}</label>
                        <input type="text" {...getFieldProps('name', {
                            rules: [{required: true,}],
                            valuedateTrigger: "onBlur",
                            initialValue: getOne.name || ""
                        })}
                           className={getFieldError("name") ? 'col-md-8 col-lg-8 text-input-nowidth error-border' : 'col-md-8 col-lg-8 text-input-nowidth'}
                           placeholder=""
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(400232/*年度*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            fieldName="calendarYear"
                            rules
                            apiType={apiGet}
                            apiHost={API_FOODING_HR}
                            apiUri = "/calendar/getYear"
                            initValueOptions={getOne.calendarYear ? [String(getOne.calendarYear)] : []}
                            initialValue={String( getOne.calendarYear )}
                            valueKeys={da => String(da)}
                            disabled={getFieldValue("calendarTypeId",getOne.calendarTypeId) != 3 && Boolean(getOne.id)}
                        />
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400233/*开始日期*/)}</label>
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
                                validate={true}
                                disabled={getFieldValue("calendarTypeId",getOne.calendarTypeId) != 3}
                                value={getOne.dateBegin && getOne.dateEnd ? [new Date(getOne.dateBegin).Format('yyyy-MM-dd'),new Date(getOne.dateEnd).Format('yyyy-MM-dd')] : [thisDefaultCurBegin, thisDefaultCurEnd]}
                            />
                        </div>
                    </div>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400234/*结束日期*/)}</label>
                        <div className={'col-md-8 col-lg-8 datetime'}>
                            <DataTime
                                range={true}
                                type="end"
                                startName="dateBegin"
                                name="dateEnd"
                                endName="dateEnd"
                                showTime={false}
                                isShowIcon={true}
                                width={'100%'}
                                form={this.props.form}
                                validate={true}
                                disabled={getFieldValue("calendarTypeId",getOne.calendarTypeId) != 3}
                                value={getOne.dateBegin && getOne.dateEnd ? [new Date(getOne.dateBegin).Format('yyyy-MM-dd'),new Date(getOne.dateEnd).Format('yyyy-MM-dd')] : [thisDefaultCurBegin, thisDefaultCurEnd]}
                            />
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3 col-lg-3">
                        <label className={'col-md-4 col-lg-4'}>{i18n.t(100087/*国家*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            apiType={apiPost}
                            fieldName="country"
                            apiParams="com.fooding.fc.ds.entity.Country"
                            valueKeys={da => ({
                                ...da,
                                s_ignore_label: true
                            })}
                            initialValue={xt.initSelectValue(getOne.country && getOne.country.id , getOne.country , ['country'], 'localName', this.props.form, true)}
                        />
                    </div>
                    <div className="form-group col-md-6 col-lg-6">
                        <label className={'col-md-2 col-lg-2'}>{i18n.t(100002/*描述*/)}</label>
                        <input type="text" {...getFieldProps('remark', {
                                initialValue: getOne.remark || ""
                        })}
                           className={'col-md-10 col-lg-10 text-input-nowidth'}
                           placeholder=""
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Addnormal;
