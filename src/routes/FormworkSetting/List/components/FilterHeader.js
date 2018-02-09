import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
//引入select插件
import {createForm, FormWrapper} from "../../../../components/Form";
//引入时间插件
import Calendar from '../../../../components/Calendar/Calendar';
import {I18n} from '../../../../lib/i18n';
// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, {ConstVirtualSelect, Option} from '../../../../components/Select'; // 下拉
// ajax
import {apiGet, apiPost, apiForm, API_FOODING_DS, API_FOODING_ERP, language} from '../../../../services/apiCall';

class FormworkFilterHeader extends Component {
    constructor(props) {
        super(props)
        this.state = this.initState();
        this.show_hide_filter = this.show_hide_filter.bind(this);
        this.search_more = this.search_more.bind(this);
        this.searchFunc = this.searchFunc.bind(this);	 // 头部 查询
        this.resetFunc = this.resetFunc.bind(this);	 // 头部 清空
        props.normalRef && props.normalRef(this);
    }

    initState() {
        return {
            expand: false,
            showFilter: 'comb-panel',
            expandClassName: 'unfold',
            minor: 'filter-header-information-pre hidden',
        }
    }

    static propTypes = {
        expand: PropTypes.bool,
        expandFilter: PropTypes.func,
        initData: PropTypes.object
    }
    static defaultProps = {
        expand: false,
        expandFilter() {
        },
        showFilter: 'comb-panel',
        expandClassName: 'unfold',
        minor: 'filter-header-information-pre hidden'
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
        }, () => this.props.expandFilter(null, this.refs.header.offsetHeight == 0 ? 1 : this.refs.header.offsetHeight))
    }

    search_more() {
        let classN, classMinor;
        if (this.state.expandClassName === 'unfold') {
            classN = 'fold';
            classMinor = "filter-header-information-pre";//显示的全部条件输入框
        } else {
            classN = "unfold";
            classMinor = "filter-header-information-pre hidden";//隐藏条件输入框
        }
        this.setState({
            expandClassName: classN, minor: classMinor
        }, () => this.props.expandFilter(null, this.refs.header.offsetHeight));
    }

    // 查找
    searchFunc() {
        const {form} = this.props;
        let sID = form.getFieldsValue();
        this.props.getPage(1);	// 刷新 列表
    }

    getForm(){
        let obj ={};
        obj = Object.assign({},this.props.form.getFieldsValue())
        return obj;
    }

    // 清空
    resetFunc() {
        this.props.form.resetFields(); // 清除表单
        this.props.getPage();	// 刷新 列表
    }

    render() {
        let domFilter;
        let {form} = this.props;
        const {getNFieldProps, getFieldProps, getFieldError} = this.props.form;
        if (this.state.showFilter === 'comb-panel') {
            domFilter = (
                <div className={'filter-header'}>
                    <div className={'filter-header-information-pre'}>
                        <label>{i18n.t(400203/*模板名称*/)}</label>
                        <input type="text" className={'text-input-filter-header'}
                               placeholder=""
                               {...getFieldProps('name', {
                                   initialValue: ''
                               })}
                               onKeyDown={(e) => {
                                   if (e.keyCode == 13) {
                                       this.searchFunc()
                                   }
                               }}
                        />
                    </div>
                    <div className={'filter-header-information-pre'}>
                        <label>{i18n.t(400203/*模板名称*/)}</label>
                        <input type="text" className={'text-input-filter-header'}
                               placeholder=""
                               {...getFieldProps('identity', {
                                   initialValue: ''
                               })}
                               onKeyDown={(e) => {
                                   if (e.keyCode == 13) {
                                       this.searchFunc()
                                   }
                               }}
                        />
                    </div>
                    <div className={"filter-header-information-pre"}>
                        <label>{i18n.t(400204/*模板标识*/)}</label>
                        <ConstVirtualSelect
                            form={form}
                            style={{width: 200}}
                            apiType={apiPost}
                            fieldName="type"
                            apiParams="com.fooding.fc.enumeration.TemplateType"
                        />
                    </div>
                    <div className={"filter-header-information-pre"}>
                        <label>{i18n.t(400206/*语种*/)}</label>
                        <ConstVirtualSelect
                            form={form}
                            style={{width: 200}}
                            apiType={apiPost}
                            fieldName="language"
                            apiParams="com.fooding.fc.enumeration.Language"
                        />
                    </div>
                    <div className={'filter-header-key'}>
                        <span onClick={this.searchFunc} className="search"><i
                            className="foddingicon fooding-search_icon"></i></span>
                        <span onClick={this.resetFunc} className="clean"><i
                            className="foddingicon fooding-clean_icon"></i></span>
                    </div>
                    <div className={this.state.showFilter}>
						<span className="screen" onClick={this.show_hide_filter
                        }><i className="foddingicon fooding-screen_icon"></i></span>
                    </div>
                </div>)
        } else {
            domFilter = (<div className={this.state.showFilter}>
					<span className="screen" onClick={this.show_hide_filter
                    }><i className="foddingicon fooding-screen_icon"></i></span>
            </div>)
        }
        return (<div className={'clientcontact-list-header'} ref="header">{domFilter}</div>)
    }
}

FormworkFilterHeader = createForm()(FormworkFilterHeader);
export default FormworkFilterHeader;

