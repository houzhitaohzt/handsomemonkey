import i18n from '../../../../lib/i18n';
import React,{Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
//引入时间插件
import DataTime from '../../../../components/Calendar/Calendar'
import {I18n} from '../../../../lib/i18n';
import xt from '../../../../common/xt';
import Select, { Option ,ConstMiniSelect ,ConstVirtualSelect} from '../../../../components/Select/';
import ProductSelect, {ProductName,CustomerFilter,BussinessFilter} from "../../../../components/FindGridSelect";
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_ES,API_FOODING_DS,getUser,language,pageSize,sizeList,commonAjax} from '../../../../services/apiCall';
class ForwarderFilterHeader extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const { getFieldProps, getFieldError } = this.props.form;
        return(
            <div className={'search'} style={{border:'0px', borderRadius:'0px',marginLeft:'330px'}}>
                <label style={{width: '70px',position: 'absolute',top: '4px',left: '0', display: 'inline-block', padding:'0', margin:'0',color:'#9FACBD'}}>{i18n.t(500348/*商机筛选*/)}</label>
                <BussinessFilter
                    ref ="productSelect"
                    form={this.props.form}
                    width={'379%'}
                    fieldName ='type'
                    className={'currency-btn select-from-currency text-input-nowidth'}
                    titleClass={"col-md-8 col-lg-8"}
                    initialValue={""}
                    onChange={this.props.onfilterChange}
                />

            </div>)
    }
}
ForwarderFilterHeader = createForm()(ForwarderFilterHeader);
export default ForwarderFilterHeader;
