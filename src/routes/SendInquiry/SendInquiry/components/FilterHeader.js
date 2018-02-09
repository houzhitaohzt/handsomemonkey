import React, {Component, PropTypes} from "react";
//引入select插件
import {createForm} from "../../../../components/Form";
import i18n from '../../../../lib/i18n';

class SendQuotationFilterHeader extends Component {
    constructor(props) {
        super(props)
        this.state = this.initState();
        this.show_hide_filter = this.show_hide_filter.bind(this);
        this.onTabClick = this.onTabClick.bind(this);
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
            minor: 'filter-header-information-pre hidden',
            activeTab: 0
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

    onTabClick(id) {
        if (this.state.activeTab == id) return false;
        // if(id === 20){
        //     //过期
        //     this.props.form.setFieldsValue({currentDate: new Date().Format('yyyy-MM-dd')});
        //     this.props.form.setFieldsValue({status: ''});
        // } else {
        //     this.props.form.resetFields(['currentDate']);
            this.props.form.setFieldsValue({status: id || ''});
        // }
        this.setState({ activeTab: id });
        this.props.searchCustomer();
    }

    cleanForm = () => {
        this.props.form.resetFields();
    };

    render() {
        let domFilter;
        let array = [
            {id: 0, content: i18n.t(200011/*全部询盘*/)}, {id: 1, content: i18n.t(300039/*草稿*/)},
            {id: 5, content: i18n.t(200013/*询盘中*/)}, {id: 10, content: i18n.t(200012/*询盘已完成*/)},
            {id: 15, content: i18n.t(100432/*关闭*/)}, {id: 20, content: i18n.t(200014/*过期*/)}
            ];
        let domButton = array.map((e, i) => {
            return (<span key={i} onClick={this.onTabClick.bind(this, e.id)}
                          className={e.id == this.state.activeTab ? 'single-click active' : 'single-click'}>{e.content}</span>)
        });
        const {getFieldProps, getFieldError} = this.props.form;
        getFieldProps('status', {initialValue: this.state.activeTab || ''});
        getFieldProps('currentDate', {initialValue: ''});
        if (this.state.showFilter === 'comb-panel') {
            domFilter = (
                <div className={'filter-header'}>
                    <div className={'filter-header-information-pre'}>
                        <label>{i18n.t(200005/*询盘编号*/)}</label>
                        <input type="text" className={'text-input-filter-header'} placeholder=""
                               {...getFieldProps('no', {
                                   initialValue: ''
                               })} />
                    </div>
                    <div className={'filter-header-key'}>
                        <span className="search" onClick={this.props.searchCustomer}><i className="foddingicon fooding-search_icon"/></span>
                        <span className="clean" onClick={this.cleanForm}><i className="foddingicon fooding-clean_icon"/></span>
                    </div>
                    <div className={this.state.showFilter}>
						<span className="screen" onClick={this.show_hide_filter
                        }><i className="foddingicon fooding-screen_icon"/></span>
                    </div>
                </div>)
        } else {
            domFilter = (<div className={this.state.showFilter}>
					<span className="screen" onClick={this.show_hide_filter
                    }><i className="foddingicon fooding-screen_icon"/></span>
            </div>)
        }
        return (<div className={'clientcontact-list-header'}>
            <div className={'list-header-click'}>{domButton}</div>
            {domFilter}
        </div>)
    }
}
SendQuotationFilterHeader = createForm()(SendQuotationFilterHeader);
export default SendQuotationFilterHeader;
