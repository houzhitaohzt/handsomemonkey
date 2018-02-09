import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";

//引入select插件
import Select, {Option} from './../../../../components/Select';
import {createForm, FormWrapper} from "../../../../components/Form";
import {Translate, Localize, I18n} from '../../../../lib/i18n';

class SystemStaffFilterHeader extends Component {
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
                        <label>{i18n.t(201218/*用户姓名*/)}</label>
                        <input type="text" className={'text-input-filter-header'} placeholder=""
                               {...getFieldProps('staffName', { initialValue: ''})}
                            onKeyDown={(e)=>{
                                if(e.keyCode == 13){this.props.searchCustomer()}
                            }}
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
SystemStaffFilterHeader = createForm()(SystemStaffFilterHeader);
export default SystemStaffFilterHeader;
