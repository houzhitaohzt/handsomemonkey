import React, {PureComponent} from "react";
import PropTypes from "prop-types";

import {API_FOODING_DS, apiGet} from "../../../services/apiCall";
import ReactSelect from "react-virtualized-select";
import {emitter} from "../../../common/EventEmitter";
import {errorTips} from "../../../components/ServiceTips";
import xt from "../../../common/xt";
import "react-select/dist/react-select.css";
import "react-virtualized/styles.css";
import "../assets/ReactSelect.less";

//所有参数说明
/*
 initRequest        default = false;    (boolean)                   是否初始化时加载接口数据
 disabled           default = false;    (boolean)                   是否禁用下拉框
 disabledOption     default = false;    (boolean|function)          是否禁用全部下拉选项,或禁用特定条件项
 isRequest          default = true;     (boolean)                   是否可以请求接口数据
 refreshMark        default = undefined;(any)                       刷新标志, 就是表单什么时候用重新用initialValue里面的值
 initValueOptions   default = [];       (array)                     选项值数据, 可用于不请求数据接口时
 clearable          default = false;    (boolean)                   显示清除按钮
 searchable         default = true;     (boolean)                   带搜索功能
 async              default = false;    (boolean)                   接口模糊搜索
 autoload           default = false;    (boolean)                   接口模糊搜索, 是否开始就请求一次
 cache              default = false;    (boolean)                   接口模糊搜索, 缓存每次搜索的关键词结果
 multi              default = false;    (boolean)                   多选
 isLoading          default = false;    (boolean)                   显示加载进度圈
 pageSize           default = 8;        (number)                    下拉选项中显示几个View
 optionHeight       default = 33;       (number)                    下拉选项单个View的高度
 className          default = 'col-xs-8 col-md-8';(string)          样式
 style              default = {};       (object)                    样式
 initialValue       default = '';       (number|string|object|array)初始值
 fieldName          default = (无默认值);    (string)                表单字段Name值
 form               default = (无默认值);    (object=>Form)          表单对象
 rules              default = false;    (boolean)                   表单验证
 onChange           default = ()=>{};           (function)          值改变时回调方法
 errorClassName     default = "error-border";   (string)            表单验证不通过时, 显示的样式
 sendChange         default = false;            (boolean)           值改变时发生事件, 监听此事件的地方可收到()
 responseName       default = "data";           (string)            接口数据取值字段, 多层时如: data.data
 apiType            default = apiGet;           (function)          接口类型
 apiHost            default = API_FOODING_DS;       (string)        接口Host
 apiUri             default = '/object/getMiniList';(string)        接口URI
 apiParams          default = (无默认值);            (string|object) 接口参数字段, 默认字符串: 搜索时作为搜索参数, 其他作为obj参数. 对象直接做参数
 valueKeys          default = 'id'          (string|function)       默认取值字段, 可用方法返回一个对象
 labelKey           default = 'localName'   (string)                默认取值显示字段
 searchPromptText   default = '输入搜索词'   (string)                搜索提示字段
 placeholder        default = ''            (string)                提示字段
 autoComplete       default = false;        (boolean)               可输入的选项下拉
 activeOption       default = false;        (boolean|function)      默认激活第一个下拉值为选择, 或者回调自己想要选中的
 errorTipsType      default = 1;            (number)                接口请求错误之后显示错误消息类型, 1 = 默认值(服务器报错), 2 = (取接口message值)
 clearableValue     default = undefined;    (any)                   叉✘点击后被点击此为默认值
 */
/**
 * 2018-01-11: 修改单值问题.
 * @author tangzehua
 * @since update 2018-01-11
 */
export default class extends PureComponent {

    static propTypes = {
        activeOption: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        initRequest: PropTypes.bool,
        disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        disabledOption: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        fieldName: PropTypes.string,
        rules: PropTypes.bool,
        initValueOptions: PropTypes.array,
        clearable: PropTypes.bool,
        searchable: PropTypes.bool,
        async: PropTypes.bool,
        multi: PropTypes.bool,
        autoload: PropTypes.bool,
        cache: PropTypes.bool,
        isLoading: PropTypes.bool,
        pageSize: PropTypes.number,
        optionHeight: PropTypes.number,
        className: PropTypes.string,
        initialValue: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
            PropTypes.object,
            PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])),
            PropTypes.func
        ]),
        style: PropTypes.object,
        isRequest: PropTypes.oneOfType([ PropTypes.bool, PropTypes.func ]),
        onChange: PropTypes.func,
        errorClassName: PropTypes.string,
        sendChange: PropTypes.bool,
        responseName: PropTypes.string,
        refreshChangeName: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
        apiType: PropTypes.func,
        apiHost: PropTypes.string,
        apiUri: PropTypes.string,
        apiParams: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        labelKey: PropTypes.string,
        valueKeys: PropTypes.oneOfType([ PropTypes.func, PropTypes.string]),
        searchPromptText: PropTypes.string,
        placeholder: PropTypes.string,
        autoComplete: PropTypes.bool,
        clearableValue: PropTypes.any,
    };

    static defaultProps = {
        closeClear:false,
        activeOption: false,
        initRequest: false,
        isRequest: true, //是否请求接口
        disabled: false,
        disabledOption: false,
        clearable:false,
        searchable: true,
        async: false,
        multi: false,
        autoload: false,
        cache: false,
        isLoading: false,
        rules: false,
        pageSize: 8,
        optionHeight: 33,
        sendChange: false,
        refreshMark: undefined,
        style: {},
        responseName: 'data',
        errorClassName: 'form-error',
        initialValue: '',
        initValueOptions: [],
        onChange: xt.noop,
        apiType: apiGet,
        apiHost: API_FOODING_DS,
        apiUri: '/object/getMiniList',
        className: 'col-xs-8 col-md-8',
        labelKey: 'localName',
        valueKeys: 'id',
        searchPromptText: "输入搜索词",
        placeholder: '',
        autoComplete: false,
        errorTipsType: 1,
        clearableValue: undefined,
    };

    constructor(props) {
        super(props);
        this.state = {isLoading: props.isLoading};
        this.state.optionData = this.getOptionValues(props.initValueOptions, props);//这里有优先级
        this.state.selectValue = props.fieldName ? undefined: this.getInitialValue(props);//上面初始化好了,才能调用这个

        this.isOpen = false;
        this.asyncValue = null;// 搜索词
        this.isInitData = false; // 是否加载完成了
        this.listenerName = null; // 监听名字
        this.asyncTimeOut = null;
        this.asyncTime = 800;
        this.filterOptions = null;
    }

    /**
     * 获取验证规则
     * @param props
     * @returns {*}
     */
    getValidateRules = (props) =>{
        let validate = props.rules;
        return validate && xt.isObject(this.getInitialValue(props)) ?
            (rule, value, callback, source, options)=>{
                let errors = [];
                if( xt.isEmpty(value)){
                    errors.push(rule.field + " is required");
                } else if(xt.isObject(value)){
                    if(xt.isEmpty(value.s_label)){
                        errors.push(rule.field + ".s_label is required");
                    }
                }
                callback(errors);
            }: {required: validate}
    };

    onSelectChange = value => {
        this.setState({selectValue: value});
        this.props.onChange(value? value.value: undefined);
        this.sendEmitterChange(this.props);
    };

    onFormSelectChange = value => {
        value = value? value.value: undefined;
        this.props.onChange(value);
        this.sendEmitterChange(this.props);
    };

    sendEmitterChange = props => {
        if(this.isChangeListener()){
            // value = value === null? this.getInitialValue(props): value;
            emitter.emit(this.listenerName);
        }
    };

    getFieldProps = props => {
        if(props.fieldName){
            let validate = props.rules;
            return props.form.getFieldProps(
                props.fieldName,
                {
                    ref: rf => this._selectRef = rf && rf._selectRef,
                    validateFirst: validate,
                    rules: [this.getValidateRules(props)],
                    initialValue: this.getInitialValue(props),
                    onChange: this.onFormSelectChange
                });
        } else {
            return {onChange: this.onSelectChange, value: this.state.selectValue, ref: rf => this._selectRef = rf && rf._selectRef }
        }
    };

    componentWillReceiveProps(props) {
        let that = this;
        let state = null;
        if (that.getRefreshMark(props) !== that.getRefreshMark(that.props)) {
            if(props.fieldName){
                this.props.form.resetFields([props.fieldName]);
                this.setInputValue();
            }
            state = {optionData: that.getOptionValues(props.initValueOptions, props) };
            that.isInitData = false;
            that.sendEmitterChange(props);
        } else if(
            (!that.state.optionData.length && props.initValueOptions.length)
            || (!props.isRequest && props.initValueOptions !== that.initValueOptions)
        ){
            state = {optionData: that.getOptionValues(props.initValueOptions, props)};
        }
        if( !props.fieldName && that.getInitialValue(props) !== that.getInitialValue(that.props)){
            state = Object.assign({}, state, {selectValue: that.getInitialValue(props)});
        }
        if(props.isLoading !== that.props.isLoading){
            !state ? state = {isLoading: props.isLoading} : (state.isLoading = props.isLoading);
        }
        state && that.setState(state);
    }

    componentDidMount() {
        let props = this.props;
        if (props.initRequest) {
            this.loadOptions(props, (error, data) => {
                this.setState({selectValue: this.getInitialValue(props, data)});
            });
        }
        this.listenerName = `ConstFormEvent.${props.fieldName}`;
        let refreshName = props.refreshChangeName;

        if (Array.isArray(refreshName)){
            refreshName.forEach( name => emitter.on(`ConstFormEvent.${name}`, this._forceRefresh));
        } else if(xt.isString(refreshName)){
            emitter.on(`ConstFormEvent.${refreshName}`, this._forceRefresh)
        }

        emitter.on("CURRENT_TAB_CHANGE", this._currentTabChange);
    }

    componentWillUnmount() {
        let props = this.props;

        let refreshName = props.refreshChangeName;
        if (Array.isArray(refreshName)){
            refreshName.forEach( name => emitter.off(`ConstFormEvent.${name}`));
        } else if(xt.isString(refreshName)){
            emitter.off(`ConstFormEvent.${refreshName}`)
        }
        emitter.off("CURRENT_TAB_CHANGE");
        this.asyncTimeOut && clearTimeout(this.asyncTimeOut);
    }

    componentDidUpdate() {
        if(this.props.fieldName){
            this.setInputValue(this.props.form.getFieldValue(this.props.fieldName));
        } else {
            this.setInputValue(this.state.selectValue);
        }
    }

    focus = ()=>{
        if( !this._selectRef) return;
        this._selectRef.focus();
    };

    _currentTabChange = currentTab =>{
        if(this.isInitData){
            this.isInitData = false;
        }
    };

    _forceRefresh = ()=>{
        this.forceUpdate();
    };

    isChangeListener = (props = this.props) => {
        return props.sendChange && props.fieldName
    };

    /**
     * 获取是否刷新标识
     * @param props
     */
    getIsRequest = props => {
        // let mark = props.isRequest;
        // if(xt.isFunction(mark)) return mark (this);
        // return mark;
        return props.isRequest;
    };

    /**
     * 获取禁用标识
     * @param props
     */
    getDisabled = props => {
        // let mark = props.disabled;
        // if(xt.isFunction(mark)) return mark (this);
        // return mark;
        return props.disabled;
    };

    /**
     * 获取刷新标识
     * @param props
     * @returns {*}
     */
    getRefreshMark = props =>{
        // let mark = props.refreshMark;
        // if(xt.isFunction(mark)) return mark (this);
        // return mark;
        return props.refreshMark;
    };

    /**
     * 获取初始化值
     * @param props
     * @param [optionData]
     * @returns {*}
     */
    getInitialValue = (props, optionData) => {
        let {initialValue: value, activeOption} = props;

        //activeOption
        if(activeOption && (value === '' || (xt.isObject(value) && xt.isEmpty(value.s_label)))){
            let option = optionData || this.state.optionData;
            if(option && option.length){
                return xt.isFunction(activeOption) ? activeOption(option): option[0];
            }
        }

        if(xt.isFunction(value)) value = value(this, props);
        if (!xt.isObject(value) && !Array.isArray(value))  value = String(value) || undefined;

        if(value && xt.isObject(value)){
            return {s_label: value.s_label, value};
        } else if(props.autoComplete){
            return {s_label: value, value: value};
        } else {
            return this.findOptionInitialValue(value, optionData);
        }
    };

    /**
     * 查找initValue 对应的下拉框值
     * @param value
     * @param optionData
     * @returns {*}
     */
    findOptionInitialValue = (value, optionData) =>{
        optionData = optionData || this.state.optionData;
        if( !value) return value;
        if(Array.isArray(value)) {
            if( !value.length) return value;
            if(xt.isObject(value[0])){

                let optionValue = [];
                value.forEach(da =>{
                    if(da.s_label) optionValue.push({s_label: da.s_label, value: da});
                });
                return optionValue;
            }
            return optionData.filter(da => da.value && ~value.indexOf(da.value));
        }
        return optionData.find(da => String(da.value) === value);
    };

    /**
     * 数据对象转换成elect对象
     * @param option
     * @param props
     * @returns {{s_label: *, value: *}}
     */
    optValue = (option, props) => {
        let {labelKey, valueKeys, disabledOption} = props;
        let value, s_label;
        if( !xt.isFunction(valueKeys) ){
            value = {
                s_label: option[labelKey] !== undefined? option[labelKey]: option['name'],
                s_value: option[valueKeys]
            }
        } else {
            value = valueKeys(option);
        }
        if(xt.isString(value)){
            s_label = value;
        } else if('s_label' in value){
            s_label = value.s_label;
        } else {
            s_label = value[props.labelKey];
            value.s_label = s_label;
        }
        let disable = {};
        if(disabledOption === true || (xt.isFunction(disabledOption) && disabledOption(option))){
            disable = {disabled: true};
        }
        if(xt.isObject(value) && 's_value' in value) return {s_label, value: value.s_value, ...disable};
        return { s_label, value, ...disable}
    };

    /**
     * 转换所有的option数据为select需要的数据格式
     * @param option
     * @param props
     */
    getOptionValues = (option, props) => {
        return option.map(da => this.optValue(da, props));
    };

    fetchData = (props, params, callback = xt.noop) => {
        this.isInitData = true;
        const {apiHost, apiType, apiUri, errorTipsType} = props;
        this.setState({isLoading: true});
        apiType( apiHost, apiUri.split("?")[0], Object.assign(xt.parseQueryParameter(apiUri), params),
                (response) => {
                    let optionData = this.getOptionValues(xt.getItemValue(response, props.responseName, []), props);
                    callback(null, optionData);
                    this.setState({optionData, isLoading: false});
                }, (errors) => {
                    callback(errors);
                    this.setState({isLoading: false});
                    this.isInitData = false;
                    errorTips(errorTipsType === 2?  (errors.message || '服务器报错!'): '服务器报错!')
                }, {isLoading: false});
    };

    /**
     * 获取下拉框数据列表
     */
    loadOptions = (props, callback) => {
        if(this.getDisabled(props) || this.props.async) return;
        if (this.getRefreshMark(props) !== -1 && (this.isInitData || !this.getIsRequest(props))) return;
        this.fetchData(props, xt.isObject(props.apiParams)? props.apiParams: {obj: props.apiParams}, callback);
    };

    /**
     * 搜索
     * @param props
     * @param input
     * @param callback
     */
    loadAsyncOptions = (props, input, callback) => {
        callback('No!');
        if(!this.props.async || input.trim() === '') return;
        this.asyncTimeOut && clearTimeout(this.asyncTimeOut);
        this.asyncTimeOut = setTimeout(()=>{
            this.asyncTimeOut = null;
            this.loadInputOptions(props, input, callback);
        }, this.asyncTime);
    };

    /**
     * 搜索
     * @param props
     * @param input
     */
    loadInputOptions = (props, input) => {
        if(this.getDisabled(props) || !this.getIsRequest(props)) return;
        this.asyncValue = input.trim();
        this.fetchData(props, {[props.apiParams]: this.asyncValue});
    };

    /**
     * 键盘事件
     * @param event
     */
    onInputKeyDown = (event) => {
        if(event.keyCode === 13){
            let value = event.target.value;
            if(this.props.async && this.isOpen && this.asyncValue !== value.trim()){
                this.asyncTimeOut && clearTimeout(this.asyncTimeOut);
                this.asyncTimeOut = null;
                this.loadInputOptions(this.props, value);
                event.preventDefault();
            }
        }
    };

    onFormChange = (field, value) => {
        if( xt.isEmpty(value) ){
            let initialValue = this.props.initialValue;
            let fv = null;
            if(xt.isObject(initialValue)) fv = initialValue;
            else if(xt.isArray(initialValue) && initialValue.length > 0 && xt.isObject(initialValue[0])) fv = initialValue[0];
            if(fv) {
                value = {};
                Object.keys(initialValue).forEach( da => value[da] = this.props.clearableValue);
            } else value = this.props.clearableValue;
        }
        field.onChange(value);
    };

    onInputChange = (field, value) => {
        this.props.autoComplete && field.onChange(value);
    };

    setInputValue = (inputValue = '') => {
        if(this.props.autoComplete && this._selectRef && this._selectRef.state.inputValue !== inputValue){
            if(typeof inputValue !== 'object'){
                this._selectRef.setState({ inputValue });
                this._selectRef.blurInput && this._selectRef.blurInput()
            }
        }
    };

    filterOptions = (options, filterValue, excludeOptions, props) => {
        return options;
    };

    /**
     * 计算高度, 有些值写死了.
     * @param option
     * @returns {number}
     */
    onOptionHeight = ({option}) => {
        if( !this._selectRef) return this.props.optionHeight;

        let select = this._selectRef.select || this._selectRef;
        let offsetWidth = xt.getItemValue(select, 'control.offsetParent.offsetWidth', 0);
        if( !offsetWidth) return this.props.optionHeight;
        offsetWidth -= 22;//padding
        let optLen = Math.max(Math.ceil(xt.getStrOffsetWidth(option.s_label) / offsetWidth) - 1, 0);
        return optLen * this.props.optionHeight / 2 + this.props.optionHeight;
    };

    onOpen = ()=>{
        this.isOpen = true;
        this.loadOptions(this.props);
    };

    onClose = () => {
        this.isOpen = false;
    };

    render() {
        let {isLoading} = this.state;
        let {rules, form, fieldName, className, errorClassName, multi} = this.props;
        className = rules && fieldName && form.getFieldError(fieldName) ? `${className} ${errorClassName}` : className;

        let field = this.getFieldProps(this.props);
        let value = field.value;
        if(value && !Array.isArray(field.value) && xt.isEmpty(value.s_label)) value = undefined;

        return (
            <ReactSelect
                maxHeight={this.props.pageSize * this.props.optionHeight}
                optionHeight={this.onOptionHeight}
                onBlurResetsInput={!this.props.autoComplete}
                autoBlur={true}
                multi={multi}
                backspaceRemoves={false}
                deleteRemoves={false}
                autosize={false}
                autoload={this.props.autoload}
                cache={this.props.cache}
                labelKey="s_label"
                matchProp="label"
                isLoading={isLoading}
                className={`React-select ${className}`}
                placeholder={this.props.placeholder}
                searchPromptText={this.props.searchPromptText}
                noResultsText={isLoading? "Loading..." : "No Data!"}
                disabled={this.getDisabled(this.props)}
                searchable={this.props.searchable}
                async={this.props.async}
                clearable={this.props.closeClear?!this.props.closeClear : !this.props.rules}
                wrapperStyle={this.props.style}
                options={this.state.optionData}
                onOpen={this.onOpen}
                onClose={this.onClose}
                loadOptions={this.loadAsyncOptions.bind(this, this.props)}
                onInputKeyDown={this.onInputKeyDown}
                ref={field.ref}
                onChange={this.onFormChange.bind(this, field)}
                onInputChange={this.onInputChange.bind(this, field)}
                filterOptions={this.props.autoComplete ? this.filterOptions : undefined}
                value={value}
            />
        );
    }
}
