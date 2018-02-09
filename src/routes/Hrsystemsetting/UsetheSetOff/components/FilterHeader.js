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

            <div className={'system-staff-list-header-key'}>
                <i className={!this.props.isDetail ? "foddingicon fooding-save bg" : "foddingicon fooding-alter_icon2"} onClick={this.onSaveClickAndEdit}/>
            </div>
        </div>)
    }
}
PriceParametersFilterHeader = createForm()(PriceParametersFilterHeader);
export default PriceParametersFilterHeader;
