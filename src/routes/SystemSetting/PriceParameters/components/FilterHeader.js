import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
//引入select插件
import {ConstVirtualSelect} from "../../../../components/Select";
import {createForm} from "../../../../components/Form";
import {API_FOODING_ES} from "../../../../services/apiCall";
import xt from '../../../../common/xt'; // 下拉

class PriceParametersFilterHeader extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
    }
    static defaultProps = {
    }

    initState() {
        return {
        }
    }

    onSaveClickAndEdit = () => {
        let obj = this.props.form.getFieldsValue();
        this.props.onSaveClickAndEdit(obj);
    }
    onChange = data => {
        let ccId = data&&data.ccId?data.ccId:"";
        this.props.searchObj(ccId)
    }

    render() {
        let {valueone = {} } = this.props;
        const {getFieldProps, getFieldError} = this.props.form;
        return (<div className={'system-staff-list-header'}>
            <div className={'filter-header'}>
                <div className={'filter-header-information-pre'}>
                    <label>{i18n.t(200771/*企业名称*/)}</label>
                    <ConstVirtualSelect
                        apiHost={API_FOODING_ES}
                        form={this.props.form}
                        fieldName='ccId'
                        style={{width: 250}}
                        apiUri='/party/getLoginCompanies'
                        //clearable
                        valueKeys={ da => ({
                            s_label:da.localName, 
                            ccId:da.id, 
                            ccLcName:da.localName, 
                            ccEnName:da.name
                        })}
                        disabled={this.props.isDetail}
                        initialValue={
                            xt.initSelectValue(true, valueone, ['ccId', 'ccLcName', 'ccEnName'], "ccLcName", this.props.form)
                        }
                        onChange={this.onChange}
                    />
                </div>
            </div>
            <div className={'system-staff-list-header-key'}>
                <i className={!this.props.isDetail ? "foddingicon fooding-save bg" : "foddingicon fooding-alter_icon2"} onClick={this.onSaveClickAndEdit}/>
            </div>
        </div>)
    }
}
PriceParametersFilterHeader = createForm()(PriceParametersFilterHeader);
export default PriceParametersFilterHeader;
