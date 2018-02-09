import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";

//引入select插件
import {createForm, FormWrapper} from "../../../../components/Form";
import {Translate, Localize, I18n} from '../../../../lib/i18n';
import Select, {Option, ConstVirtualSelect} from './../../../../components/Select';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS} from '../../../../services/apiCall';

class WorkCalenderFilterHeader extends Component {
    constructor(props) {
        super(props);
        this.state = this.initState();
        props.formCall(this.props.form);
    }

    static propTypes = {
        expand: PropTypes.bool,
        expandFilter: PropTypes.func,
    };
    static defaultProps = {
        expand: false,
        expandFilter(){
        },
        showFilter: 'comb-panel',
        expandClassName: 'unfold',
        minor: 'filter-header-information-pre hidden'
    };

    initState() {
        return {
            expand: false,
            showFilter: 'comb-panel',
            expandClassName: 'unfold',
            minor: 'filter-header-information-pre hidden'
        }
    }

    cleanForm = () => {
        this.props.form.resetFields();
    };

    render() {
        let domFilter;
        const {getFieldProps, getFieldError} = this.props.form;
        if (this.state.showFilter === 'comb-panel') {
            domFilter = (
                <div className={'filter-header'}>
                    <div className={'filter-header-information-pre'}>
                        <label>{i18n.t(400209/*日历编号*/)}</label>
                        <input type="text" className={'text-input-filter-header'} placeholder=""
                               {...getFieldProps('calendarId', { initialValue: ''})}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.props.searchCustomer()}
                               }}
                        />
                    </div>
                    <div className={'filter-header-information-pre'}>
                        <label>{i18n.t(400230/*日历名称*/)}</label>
                        <input type="text" className={'text-input-filter-header'} placeholder=""
                               {...getFieldProps('calendarName', { initialValue: ''})}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){this.props.searchCustomer()}
                               }}
                        />
                    </div>
                    <div className={'filter-header-information-pre'}>
                        <label>{i18n.t(400231/*日历类型*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            fieldName='calendarTypeId'
                            apiType={apiPost}
                            style={{width: 200}}
                            clearable
                            apiParams="com.fooding.fc.enumeration.CalendarType"
                        />
                    </div>
                    <div className={'filter-header-information-pre'}>
                        <label>{i18n.t(100230/*状态*/)}</label>
                        <ConstVirtualSelect
                            form={this.props.form}
                            fieldName='stateId'
                            style={{width: 200}}
                            clearable
                            isRequest={false}
                            initValueOptions={[{name: "草稿", id: 5},{name: i18n.t(400247/*有效*/), id: 10},{name: i18n.t(100441/*失效*/), id: 20}]}
                        />
                    </div>
                    <div className={'filter-header-key'}>
                        <span className="search" onClick={this.props.searchCustomer}><i className="foddingicon fooding-search_icon"/></span>
                        <span className="clean" onClick={this.cleanForm}><i className="foddingicon fooding-clean_icon"/></span>
                    </div>
                </div>)
        }
        return (<div className={'system-staff-list-header'}>{domFilter}</div>)
    }
}
WorkCalenderFilterHeader = createForm()(WorkCalenderFilterHeader);
export default WorkCalenderFilterHeader;
