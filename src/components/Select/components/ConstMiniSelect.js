import React, {PropTypes, PureComponent} from "react";

import {API_FOODING_DS, apiPost} from "../../../services/apiCall";
import xt from "../../../common/xt";

import ConstVirtualSelect from "./ConstVirtualSelect";

/**
 * 废弃, 作为过渡到.
 * @deprecated
 */
export default class extends PureComponent {

    static propTypes = {
        initRequest: PropTypes.bool,
        disabled: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.func
        ]),
        fieldName: PropTypes.string,
        pbj: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        initValueOptions: PropTypes.array,
        optionValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
        allowClear: PropTypes.bool,
        className: PropTypes.string,
        initialValue: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
            PropTypes.object,
            PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object])),
            PropTypes.func
        ]),
        style: PropTypes.object,
        isRequest: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.func
        ]),
        onSelect: PropTypes.func,
        onChange: PropTypes.func,
        sendChange: PropTypes.bool,
        responseName: PropTypes.string,
        refreshChangeName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ])
    };

    constructor(props){
        super(props);
        console.warn("ConstMiniSelect is deprecated, please use ConstVirtualSelect!")
    }

    static defaultProps = {
        initRequest: false,
        isRequest: true, //是否请求接口
        disabled: false,
        allowClear: false,
        sendChange: false,
        refreshMark: undefined,
        style: {},
        responseName: 'data',
        initialValue: '',
        initValueOptions: [],
        onSelect: () => {},
        onChange: () => {},
        className: 'col-xs-8 col-md-8',
        optionValue: 'id',

    };

    onSelectChange = value => {
        this.props.onChange && this.props.onChange(value);
        this.props.onSelect && this.props.onSelect({}, {
            props: {
                objValue: value
            }
        });
    };

    render() {
        const {pbj, props = {}} = this.props;
        let host = API_FOODING_DS;
        let uri = '/object/getMiniList';
        let params = {};
        let apiType = apiPost;
        if (xt.isObject(pbj)) {
            host = pbj.host || host;
            uri = pbj.uri || uri;
            params = pbj.params;
            apiType = pbj.apiType || apiType;
        } else {
            params = {obj: pbj}
        }
        let valueKeys = this.props.optionValue;
        if(xt.isFunction(valueKeys)){
            valueKeys = da => {
                let option = this.props.optionValue(da);
                return option.props.objValue || {
                        s_label: option.props.children,
                        s_value: option.props.value
                    };
            }
        }
        let multi = props.tags === true;
        let style = props.style || this.props.style || {};

        return (
            <ConstVirtualSelect
                placeholder={this.props.placeholder}
                pageSize={this.props.pageSize}
                initRequest={this.props.initRequest}
                isRequest={this.props.isRequest}
                disabled={this.props.disabled}
                refreshMark={this.props.refreshMark}
                className={this.props.className}
                fieldName={this.props.fieldName}
                rules={this.props.reles}
                form={this.props.form}
                clearable={!this.props.reles}
                style={style}
                refreshChangeName={this.props.refreshChangeName}
                multi={multi}
                onChange={this.onSelectChange}
                sendChange={this.props.sendChange}
                responseName={this.props.responseName}
                initialValue={this.props.initialValue}
                initValueOptions={this.props.initValueOptions}
                apiType={apiType}
                apiHost={host}
                apiUri={uri}
                apiParams={params}
                valueKeys={valueKeys}
            />
        )
    }
}