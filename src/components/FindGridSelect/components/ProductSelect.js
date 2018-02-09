import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import Table from '../../Table';
import '../assets/_productselect.less';
import Select, {Option, ConstMiniSelect} from '../../Select';
import xt from '../../../common/xt';
import {apiGet, apiPost, apiForm, API_FOODING_DS, language, pageSize, sizeList} from '../../../services/apiCall';

export class AddSelect extends Component {
    static defaultProps = {
        apiType: apiGet,
        apiHost: API_FOODING_DS,
        params: {keyword: ''},
        titleClass: "",
        name: 'mtlId',
        enName: 'name',
        isSearch: true,
        required: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            visbled: false,
            columns_party: [{
                title: i18n.t(100000/*代码*/),
                dataIndex: 'code',
                key: "code",
                width: '15%',
                render(data, row, index) {
                    return <div>{data}</div>;
                }
            }, {
                title: i18n.t(100001/*名称*/),
                dataIndex: "localName",
                key: "localName",
                width: "20%",
                render(data, row, index) {
                    return <div className={'text-ellipsis shenglue'}>{data}</div>;
                }
            }, {
                title: i18n.t(100226/*英文名称*/),
                dataIndex: "nameValues",
                key: "nameValues",
                width: "30%",
                render(data, row, index) {
                    return <div>{data ? data.en : (row.enName ? row.enName : '')}</div>;
                }
            }, {
                title: "规格",
                dataIndex: "specTxt",
                key: "specTxt",
                width: "40%",
                render(data, row, index) {
                    return <div className={'text-ellipsis shenglue'}>{data}</div>;
                }
            }],
            data: [],
            value: this.props.value,
            searchValue: '',
        }
        this.productClick = this.productClick.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.search = this.search.bind(this);
        // this.onBlur = this.onBlur.bind(this);
        this.showClick = this.showClick.bind(this);
        this.onBiput = this.onBiput.bind(this);
        this.clear = this.clear.bind(this);
    }

    clear(initAjax, varl) {
        let that = this;
        this.setState({
            value: undefined
        }, function () {
            if (initAjax) {
                initAjax(varl);
            }

        });
    }

    showClick(id) {
        this.setState({
            visbled: false
        });
    }

    productClick() {
        let that = this;
        if (this.state.visbled) {
            that.setState({
                visbled: false
            });
        } else {
            const {apiHost, apiType, params} = this.props;
            apiType(apiHost, this.props.url, params, (response) => {
                that.setState({
                    visbled: true,
                    data: response.data || []
                }, () => {
                    document.getElementById("dialog").focus();
                });
            }, (error) => {

            })
        }
    }

    onRowClick(row) {
        let that = this;
        this.setState({
            visbled: false,
            value: row
        });
        let {enName} = this.props;
        let value = row;
        let mtlId = value ? (value.id || value.mtlId) : undefined;
        let mtlLcName = value ? (value.localName || value.mtlLcName) : undefined;
        let mtlEnName = value ? (value[enName] || value.mtlEnName) : undefined;
        let s_label = value ? (value.localName || value.s_label) : undefined;

        this.props.form.setFieldsValue({
            [this.props.name]: {
                s_label: s_label,
                [this.props.name]: mtlId,
                mtlLcName: mtlLcName,
                mtlEnName: mtlEnName
            }
        });
        if (this.props.onSelect) {
            this.props.onSelect(row);
        }
    }

    onChange(e) {
        this.setState({
            searchValue: e.target.value
        });
    }

    search() {
        let that = this;
        const {apiHost, apiType, params} = this.props;
        let search = this.props.search|| '/material/search';
        let value = Object.assign({}, params, {keyword: this.state.searchValue});
        apiType(apiHost, search, value, (response) => {
            that.setState({
                data: response.data
            });
        }, (error) => {

        })
    }

    /**
     * 获取验证规则
     * @param props
     * @returns {*}
     */
    getValidateRules = (props) => {
        let validate = props.required;
        return validate ?
            (rule, value, callback, source, options) => {
                let errors = [];
                if (xt.isEmpty(value)) {
                    errors.push(rule.field + " is required");
                } else if (xt.isObject(value)) {
                    if (xt.isEmpty(value.s_label)) {
                        errors.push(rule.field + ".s_label is required");
                    }
                }
                callback(errors);
            } : {required: validate}
    };

    onBiput() {
        let that = this;
        that.setState({
            visbled: true
        })
    }

    _onKeyUpEvent = event => {
        if (event.keyCode === 13) {
            this.search();
        }
    };
    // onBlur(){
    // 	var that = this;
    // 	setTimeout(function(argument) {
    // 		if(document.activeElement.id == 'btn'){

    // 		}else {
    // 			that.setState({
    // 				visbled:false
    // 			})
    // 		}
    // 	},100);
    // }
    render() {
        let {getNFieldProps, getFieldProps, getFieldError, getFieldValue} = this.props.form;
        let {name, enName} = this.props;
        let value = this.state.value || this.props.value;
        let mtlId = value ? (value.id || value.mtlId) : undefined;
        let mtlLcName = value ? (value.localName || value.mtlLcName) : undefined;
        let mtlEnName = value ? (value[enName] || value.mtlEnName) : undefined;
        let s_label = value ? (value.localName || value.s_label) : undefined;
        let required = this.props.required;
        let field = getNFieldProps(name, {
            validateFirst: true,
            rules: [this.getValidateRules(this.props)],
            initialValue: {
                s_label: s_label,
                [name]: mtlId,
                mtlLcName: mtlLcName,
                mtlEnName: mtlEnName
            }
        });
        return <div style={{padding: '0 0 0 0'}}
                    className={getFieldError(name) ? ' error-border product-select ' + this.props.titleClass : 'product-select ' + this.props.titleClass}>
            <input type="text" className='text-input-nowidth' placeholder=""
                   ref={field.ref} value={field.value || ''} onChange={field.onChange}
                   onClick={this.productClick}
                   readOnly
                   style={{width: "100%"}}
            />
            <i className={field.value && !this.props.required?'foddingicon fooding-clear yashi clear':'none'}
               style={{position: 'absolute',right: '32px',top: '9px', cursor: 'pointer',
                   color:'#ccc',
                   fontSize: '14px'}}
               onClick={()=>{
                   this.setState({
                       value:undefined
                   });
                   this.props.form.setFieldsValue({[name]:undefined})
               }}
            >
                <span className ='path1'></span>
                <span className ='path2'></span>
            </i>
            <i className="foddingicon fooding-search_icon search-icon" onClick={this.productClick}/>
            <div className={this.state.visbled? "dialog" : "none"} tabIndex="-1" id={'dialog'}>
                <i className='foddingicon fooding-clear yashi clear'
                   style={{
                       position: 'absolute', right: '10px', top: '10px', cursor: 'pointer',
                       color: '#ccc',
                       fontSize: '24px'
                   }}
                   onClick={this.showClick}
                >
                    <span className='path1'></span>
                    <span className='path2'></span>
                </i>
                <div className={this.props.isSearch ? 'search-head' : 'none'}>
                    <label>{i18n.t(200041/*内容*/)}</label>
                    <input className={"text-input"}
                           id='btn'
                           onKeyUp={this._onKeyUpEvent}
                           value={this.state.searchValue}
                           onBlur={this.onBiput}
                           onChange={this.onChange}/>
                    <span onClick={this.search}>模糊查询</span>
                </div>
                <div className="common-party-table" style={{marginTop: (!this.props.isSearch ? '30px' : '0px')}}>
                    <Table
                        columns={this.state.columns_party}
                        data={this.state.data}
                        checkboxConfig={{show: false}}
                        onRowClick={this.onRowClick}
                        colorFilterConfig={{show: false}}
                        followConfig={{show: false}}
                        prefixCls={"rc-confirm-table"}
                        scroll={{x: true, y: 250}}
                    />
                </div>
            </div>
        </div>
    }
}

export default AddSelect;
