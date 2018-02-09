import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
//引入select插件
import {ConstVirtualSelect} from "../../../../components/Select";
import {createForm} from "../../../../components/Form";
import {API_FOODING_ES, apiPost} from "../../../../services/apiCall";

class SystemStaffFilterHeader extends Component {
    constructor(props) {
        super(props)
        this.state = this.initState();
        props.formCall(this.props.form);
    }

    static propTypes = {
        expand: PropTypes.bool,
        expandFilter: PropTypes.func,
        initData: PropTypes.object
    }
    static defaultProps = {
        expand: false,
        expandFilter(){
        },
        showFilter: 'comb-panel',
        expandClassName: 'unfold',
        minor: 'filter-header-information-pre hidden'
    }

    initState() {
        return {
            expand: false,
            showFilter: 'comb-panel',
            expandClassName: 'unfold',
            minor: 'filter-header-information-pre hidden'
        }
    }

    show_hide_filter() {
        let classN;
        if (this.state.showFilter === "comb-panel") {
            classN = "comb-panel-floating";
        } else {
            classN = "comb-panel";
        }
        this.setState({
            showFilter: classN
        })
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
                        <label>{i18n.t(200771/*企业名称*/)}</label>
                        <ConstVirtualSelect
                            apiHost={API_FOODING_ES}
                            form={this.props.form}
                            fieldName='ccId'
                            style={{width: 200}}
                            apiUri='/party/getLoginCompanies'
                            clearable
                        />
                    </div>
                    <div className={'filter-header-information-pre'}>
                        <label>{i18n.t(201170/*员工姓名*/)}</label>
                        <ConstVirtualSelect
                            apiType={apiPost}
                            form={this.props.form}
                            fieldName='sourceId'
                            style={{width: 200}}
                            apiParams="com.fooding.fc.es.entity.Staff"
                            clearable
                        />
                    </div>
                    <div className={'filter-header-information-pre'}>
                        <label>{i18n.t(201171/*邮箱地址*/)}</label>
                        <input type="text" className={'text-input-filter-header'} placeholder=""
                               {...getFieldProps('name', {initialValue:''})}
                               onKeyDown={(e)=>{
                                   if(e.keyCode == 13){
                                       this.props.searchCustomer();
                                   }
                               }}
                        />
                    </div>
                    <div className={'filter-header-key'}>
                        <span className="search" onClick={this.props.searchCustomer}><i className="foddingicon fooding-search_icon"></i></span>
                        <span className="clean" onClick={this.cleanForm}><i className="foddingicon fooding-clean_icon"></i></span>
                    </div>
                </div>)
        }
        return (<div className={'system-staff-list-header'}>{domFilter}</div>)
    }
}
SystemStaffFilterHeader = createForm()(SystemStaffFilterHeader);
export default SystemStaffFilterHeader;
