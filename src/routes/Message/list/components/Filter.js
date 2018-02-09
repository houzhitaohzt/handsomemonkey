import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Select, {Option, ConstVirtualSelect} from './../../../../components/Select';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS} from '../../../../services/apiCall';
import Calendar from '../../../../components/Calendar/Calendar';
import {createForm, FormWrapper} from '../../../../components/Form';

export class FilterHead extends Component {

    constructor(props) {
        super(props);
        props.formCall(this.props.form);
    }

    cleanForm = () => {
        this.props.form.resetFields();
    };

    render() {
        const {getFieldProps, getFieldError} = this.props.form;
        return (
            <div style={{backgroundColor: '#fff', marginBottom: '10px',borderRadius: '6px'}} className='footer-header'>
                <label style={{float:'left'}}>{i18n.t(200754/*发信人*/)}</label>
                <ConstVirtualSelect
                    form={this.props.form}
                    fieldName='sentStaffName'
                    apiType={apiPost}
                    style={{width: 200,marginTop:'7px'}}
                    clearable
                    initRequest={true}
                    apiParams="com.fooding.fc.enumeration.Module"
                />
                <label>{i18n.t(200041/*内容*/)}</label>
                <input type='text' className='text-input' {...getFieldProps('content', {initialValue: ''})}/>
                <label>{i18n.t(200756/*日期*/)}</label>
                <Calendar name={'startTime'} form={this.props.form} showTime={true} isShowIcon={true}/>
                <label style={{width: '25px'}}>{i18n.t(500103/*至*/)}</label>
                <Calendar name={'endTime'} form={this.props.form} showTime={true} isShowIcon={true}/>
                <span className="search" onClick={this.props.searchCustomer}>
                    <i style={{paddingLeft: '20px', fontSize: '18px', color: '#cccccc'}}
                       className="foddingicon fooding-search_icon"/></span>
                <span className="clean" onClick={this.cleanForm}>
                    <i style={{paddingLeft: '20px', fontSize: '18px', color: '#cccccc'}}
                       className="foddingicon fooding-clean_icon"/></span>
            </div>
        )
    }
}

export default createForm()(FilterHead)