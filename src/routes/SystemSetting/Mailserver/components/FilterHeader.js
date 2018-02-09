import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
//引入select插件
import {ConstVirtualSelect} from "../../../../components/Select";
import {createForm} from "../../../../components/Form";
import {API_FOODING_ES} from "../../../../services/apiCall";

class SystemMailboxFilterHeader extends Component {
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
                        <label>{i18n.t(201184/*邮件服务名*/)}</label>
                        <input type="text" className={'text-input-filter-header'} placeholder=""
                               {...getFieldProps('name', {
                                   initialValue: ''
                               })}
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
SystemMailboxFilterHeader = createForm()(SystemMailboxFilterHeader);
export default SystemMailboxFilterHeader;
