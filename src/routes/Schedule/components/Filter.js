import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from 'react';
import RightKey from '../../../components/RightKey/RightKey';
import {createForm, FormWrapper} from '../../../components/Form';
//引入select插件
import Select, {Option, ConstMiniSelect, ConstVirtualSelect} from '../../../components/Select';

import {I18n} from '../../../lib/i18n';

import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS, permissionsBtn} from "../../../services/apiCall";
import ServiceTips from '../../../components/ServiceTips';
//引入session数据
import WebData from '../../../common/WebData';

export class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cluster: [],//集团
            clusterId: WebData.user.data.staff.clusId || undefined,
            company: [],//公司
            companyId: WebData.user.data.staff.ccid || undefined,
            orginzation: [] //组织
        }
        this.searchData = {}
        props.formCall(this.props.form);
    }

    serchClick = () => {
        const {form, serchClick} = this.props;
        form.validateFields((errors, value) => {
            if (!errors) {
                serchClick();
            } else {
                ServiceTips({text: I18n.t(400144/*请选择职员进行搜索！*/), type: "error"})
            }
        })
    }

    componentDidMount() {

    }

    shouldComponentUpdate(props, state) {
        return xt.equalsObject(state, this.state) || xt.equalsObject(props.form.getFieldsValue(), this.searchData);
    }

    componentDidUpdate() {
        this.searchData = this.props.form.getFieldsValue();
    }

    render() {
        let that = this;
        const {getFieldProps, getFieldError, getNFieldProps} = this.props.form;
        return (
            <div className={'filter-header'} style={{backgroundColor: "#fff", marginBottom: "10px", padding: "2px"}}>
                <input type="hidden" {...getNFieldProps('clusterId', {
                    initialValue: WebData.user.data.staff.clusId || "",
                })} />
                <input type="hidden" {...getNFieldProps('ccId', {
                    initialValue: WebData.user.data.staff.ccid || "",
                })} />
                <div className={'filter-header-information-pre'}>
                    <label>{I18n.t(400145/*职员*/)}</label>
                    <ConstVirtualSelect
                        form={this.props.form}
                        apiType={apiGet}
                        apiHost={API_FOODING_ES}
                        apiUri={"/acl/getAclAsUserInfo"}
                        apiParams={{formIdentity: 'routine'}}
                        fieldName="username"
                        initValueOptions={[{
                            username: WebData.user.data.loginName,
                            staffLocalName: WebData.user.data.staffName
                        }]}
                        initialValue={WebData.user.data.loginName || ""}
                        style={{width: '250px'}}
                        valueKeys="username"
                        labelKey="staffLocalName"
                        responseName="data.users"
                    />
                </div>
                <div className={'filter-header-key'}>
                    <span className="search" onClick={this.serchClick}><i
                        className="foddingicon fooding-search_icon"></i></span>
                </div>
                {
                    !!permissionsBtn('schedule.add') ?
                        (<div className={'filter-header-key'} style={{float: 'right'}}>
                            <span className="search" onClick={this.props.addClick} style={{color: 'red'}}
                                  title={i18n.t(400147/*新建日程*/)}><i
                                className="foddingicon fooding-add-icon3"></i></span>
                        </div>) : ""
                }

            </div>
        );
    }
}

Filter.propTypes = {
    serchClick: PropTypes.func,
    cleanClick: PropTypes.func
};
Filter.defaultProps = {
    serchClick() {
    },
    cleanClick() {
    }
};
const FilterForm = createForm()(Filter);
export default FilterForm;
