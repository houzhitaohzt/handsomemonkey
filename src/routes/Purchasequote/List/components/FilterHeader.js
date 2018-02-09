import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, {Option, ConstMiniSelect} from '../../../../components/Select'; // 下拉
//引入select插件
import {createForm, FormWrapper} from "../../../../components/Form";
// ajax
import {
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_ES,
    API_FOODING_DS,
    API_FOODING_ERP,
    language,
    commonAjax, toDecimal
} from '../../../../services/apiCall';
import {I18n} from '../../../../lib/i18n';
import xt from '../../../../common/xt'; // 下拉
import ProductSelect from '../../../../components/FindGridSelect';
import DataTime from '../../../../components/Calendar/Calendar';

class ProviderFilterHeader extends Component {
    constructor(props) {
        super(props)
        this.state = this.initState();
        this.show_hide_filter = this.show_hide_filter.bind(this);
        this.search_more = this.search_more.bind(this);
        this.getForm = this.getForm.bind(this);
        this.search = this.search.bind(this);
        // this.clean=this.clean.bind(this);
        props.normalRef && props.normalRef(this);
        // init onClick
        this.handleSupplierSource = this.handleSupplierSource.bind(this);	 // 供应商
        this.handleProduct = this.handleProduct.bind(this);	 // 产品
        this.handleEnterprise = this.handleEnterprise.bind(this); //企业
        this.searchData = {};


    }

    initState() {
        return {
            expand: false,
            showFilter: 'comb-panel',
            expandClassName: 'unfold',
            minor: 'filter-header-information-pre hidden',
            product: [{id: 1, name: ''}], // 产品
            supplierSource: [{id: 1, name: ''}], // 供应商
            Enterprise: [{id: 1, name: ''}], // 企业

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


    // 原供应商 click
    handleSupplierSource() {
        var that = this;
        apiPost(API_FOODING_DS, '/object/getMiniList', commonAjax.supplierSource,
            (response) => {
                this.setState({supplierSource: response.data});
            }, (errors) => {
                ServiceTips({text: errors.message, type: 'error'});
            });
    }


    // 产品 click
    handleProduct() {
        var that = this;
        apiPost(API_FOODING_DS, '/object/getMiniList', commonAjax.product,
            (response) => {
                this.setState({product: response.data});
            }, (errors) => {
                ServiceTips({text: errors.message, type: 'error'});
            });
    }

    // 企业 click
    handleEnterprise() {
        var that = this;
        apiGet(API_FOODING_ES, '/party/getLoginCompanies', {},
            (response) => {
                this.setState({Enterprise: response.data});
            }, (errors) => {
                ServiceTips({text: errors.message, type: 'error'});
            });
    }

    // 查找
    search() {
        this.props.getPage();
    }

    getForm() {
        let obj = {};
        obj = Object.assign({}, this.props.form.getFieldsValue())
        return obj;
    }

    cleanForm = () => {
        let that = this;
        if (this.props.form.getFieldsValue().mtlId) {
            this.props.form.resetFields();
            this.refs.productSelect.clear(this.props.getPage);
        } else {
            this.props.form.resetFields();
            this.props.getPage();
        }
    };

    shouldComponentUpdate(props, state) {
        return xt.equalsObject(state, this.state) || xt.equalsObject(props.form.getFieldsValue(), this.searchData);
    }

    componentDidUpdate() {
        this.searchData = this.props.form.getFieldsValue();
    }

    render() {
        let domFilter;
        const {getNFieldProps, getFieldProps, getFieldError} = this.props.form;
        if (this.state.showFilter === 'comb-panel') {
            domFilter = (
                <div className={'filter-header'}>
                    <div className={'filter-header-information-pre'}>
                        <label>{i18n.t(400048/*单据编号*/)}</label>
                        <input
                            type="text"
                            {...getFieldProps('no', {
                                validateFirst: true,
                                rules: [{required: true}],
                                initialValue: ''
                            })}
                            className={'text-input-nowidth'}
                            style={{width: 200}}
                            onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                    this.search()
                                }
                            }}
                        />
                    </div>
                    <div className={'filter-header-information-pre'} style={{width: '300px'}}>
                        <label>{i18n.t(100379/*产品*/)}</label>
                        <div style={{float: 'right', width: '200px'}}>
                            <ProductSelect
                                ref="productSelect"
                                form={this.props.form}
                                url='/material/search'
                                width={'379%'}
                                titleClass={' col-md-12 col-lg-12'}
                                className={getFieldError("mtlId") ? "currency-btn select-from-currency text-input-nowidth error-border" : 'currency-btn select-from-currency text-input-nowidth'}

                            />
                        </div>
                    </div>
                    <div className={'filter-header-information-pre'}>
                        <label>{i18n.t(100312/*供应商*/)}</label>
                        <Select
                            animation='slide-up'

                            style={{width: 200}}
                            className='currency-btn select-from-currency'
                            optionLabelProp="children"
                            placeholder=""
                            {...getNFieldProps('vndBeId', {
                                initialValue: undefined
                            })}
                            onClick={this.handleSupplierSource}
                        >
                            {this.state.supplierSource.map((o, i) => <Option key={i} value={o.id}
                                                                             title={o.name}>{o.name}</Option>)}
                        </Select>

                    </div>
                    <div className={'filter-header-information-pre'}>
                        <label>{i18n.t(400037/*采购员*/)}</label>
                        <input
                            type="text"
                            {...getFieldProps('purStaffLcName', {

                                initialValue: ''
                            })}
                            style={{float: 'right', width: '200px'}}
                            className={'text-input-nowidth'}
                            onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                    this.search()
                                }
                            }}
                        />
                    </div>
                    <div className={this.state.minor}>
                        <label>{i18n.t(200008/*有效期*/)}</label>
                        <DataTime
                            range={true}
                            type="start"
                            startName="startDate"
                            name="starts"
                            endName="endDate"
                            showTime={false}
                            width={'100%'}
                            isShowIcon={true}
                            form={this.props.form}
                            value={[undefined, undefined]}
                        />
                        &nbsp;-&nbsp;
                        <DataTime
                            range={true}
                            type="end"
                            startName="startDate"
                            name="ends"
                            endName="endDate"
                            showTime={false}
                            width={'100%'}
                            isShowIcon={true}
                            form={this.props.form}
                            value={[undefined, undefined]}
                        />
                    </div>
                    <div className={this.state.minor}>
                        <input
                            type="text"
                            {...getFieldProps('dueDays', {
                                rules: [{pattern:xt.pattern.positiveNonZero}],
                                initialValue: ''
                            })}
                            style={{marginLeft:'20px',width: '135px'}}
                            className={getFieldError('dueDays')?'text-input-nowidth error-border':'text-input-nowidth'}
                            onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                    this.search()
                                }
                            }}
                            />
                        <label style={{textAlign:'left',width:'120px',marginTop:'5px'}}>{i18n.t(500435/*天内到期的价格*/)}{}</label>


                    </div>
                    <div className={'filter-header-key'}>
                        <span className="search" onClick={this.search}><i className="foddingicon fooding-search_icon"/></span>
                        <span className="clean" onClick={this.cleanForm}><i className="foddingicon fooding-clean_icon"/></span>
                        <span className={this.state.expandClassName} onClick={this.search_more}><i
                            className="foddingicon fooding-zk_icon"></i></span>
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

ProviderFilterHeader = createForm()(ProviderFilterHeader);
export default ProviderFilterHeader;

/*
	<div className={'filter-header-information-pre'}>
		<label>{i18n.t(100244*/
/*企业*/
/*)}</label>
		<Select
			animation='slide-up'
			
			style={{width:200}}
			className ='currency-btn select-from-currency'
			prefixCls="rc-select-filter-header"
			choiceTransitionName="rc-select-selection__choice-zoom"
			optionLabelProp="children"
																	
			{...getNFieldProps('ccId',{
				initialValue: undefined
			})}
			onClick={this.handleEnterprise}
			>
			{this.state.Enterprise.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
		</Select>
	</div>
*/
