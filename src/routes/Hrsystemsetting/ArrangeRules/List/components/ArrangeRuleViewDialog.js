import React, {PropTypes, Component} from 'react';
import {createForm, FormWrapper} from "../../../../../components/Form";
//引入select插件
import Checkbox from '../../../../../components/CheckBox';
import xt from '../../../../../common/xt';
import Radio from "../../../../../components/Radio";
import Select, {Option, ConstMiniSelect, ConstVirtualSelect} from '../../../../../components/Select';

import {
    apiGet,
    apiPost,
    apiForm,
    API_FOODING_ES,
    API_FOODING_DS,
    API_FOODING_HR
} from '../../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from '../../../../../components/ServiceTips';

import i18n, {I18n} from '../../../../../lib/i18n';
import WebData from '../../../../../common/WebData';

class ArrangeRuleViewDialog extends Component {
    constructor(props) {
        super(props);
        this.onCancel = this.onCancel.bind(this);
        let weeks = props.getOne.weeks;
        let rotates = props.getOne.rotates;
        this.state = {
            arrWeek: weeks && weeks.length > 0 ? weeks : [],
            arrRotate: rotates && rotates.length > 0 ? rotates : [],
        };

    }

    static propTypes = {
        data: PropTypes.object,
        form: PropTypes.object,
        onSaveAndClose: PropTypes.func,
        onCancel: PropTypes.func,
    };

    componentDidMount() {

    }

    onCancel() {
        this.props.onCancel && this.props.onCancel()
    }

    renderWeek = () => {
        let {arrWeek} = this.state;
        return (
            <div className={'row'}>
                <div className={'row'}>
                    <div className="form-group col-xs-3 col-md-3">
                        <label className={'col-md-3 col-lg-3'}></label>
                            {i18n.t(600274/*班次名称*/)}
                    </div>
                    <div className="form-group col-xs-1 col-md-1" style={{textAlign:'center'}}>
                        {I18n.t(400172/*星期一*/)}
                    </div>
                    <div className="form-group col-xs-1 col-md-1" style={{textAlign:'center'}}>
                        {I18n.t(400173/*星期二*/)}
                    </div>
                    <div className="form-group col-xs-1 col-md-1" style={{textAlign:'center'}}>
                        {I18n.t(400174/*星期三*/)}
                    </div>
                    <div className="form-group col-xs-1 col-md-1" style={{textAlign:'center'}}>
                        {I18n.t(400175/*星期四*/)}
                    </div>
                    <div className="form-group col-xs-1 col-md-1" style={{textAlign:'center'}}>
                        {I18n.t(400176/*星期五*/)}
                    </div>
                    <div className="form-group col-xs-1 col-md-1" style={{textAlign:'center'}}>
                        {I18n.t(400177/*星期六*/)}
                    </div>
                    <div className="form-group col-xs-1 col-md-1" style={{textAlign:'center'}}>
                        {I18n.t(400178/*星期日*/)}
                    </div>
                </div>
                {
                    arrWeek.map((da, i) => {
                        return (<div className={'row'} key={i}>
                            <div className="form-group col-xs-3 col-md-3">
                                <label className={'col-md-3 col-lg-3'}></label>
                                <div className={'col-md-8 col-lg-8'}>
                                    <p>{da.schedule && da.schedule.localName ? da.schedule.localName : ""}</p>
                                </div>
                            </div>
                            <div className="form-group col-xs-1 col-md-1" style={{textAlign:'center'}}>
                                {da.weekDay && da.weekDay[0] ? <i className={'foddingicon fooding-dui-icon2'}></i>:null}
                            </div>
                            <div className="form-group col-xs-1 col-md-1" style={{textAlign:'center'}}>
                                {da.weekDay && da.weekDay[1] ? <i className={'foddingicon fooding-dui-icon2'}></i>:null}
                            </div>
                            <div className="form-group col-xs-1 col-md-1" style={{textAlign:'center'}}>
                                {da.weekDay && da.weekDay[2] ? <i className={'foddingicon fooding-dui-icon2'}></i>:null}
                            </div>
                            <div className="form-group col-xs-1 col-md-1" style={{textAlign:'center'}}>
                                {da.weekDay && da.weekDay[3] ? <i className={'foddingicon fooding-dui-icon2'}></i>:null}
                            </div>
                            <div className="form-group col-xs-1 col-md-1" style={{textAlign:'center'}}>
                                {da.weekDay && da.weekDay[4] ? <i className={'foddingicon fooding-dui-icon2'}></i>:null}
                            </div>
                            <div className="form-group col-xs-1 col-md-1" style={{textAlign:'center'}}>
                                {da.weekDay && da.weekDay[5] ? <i className={'foddingicon fooding-dui-icon2'}></i>:null}
                            </div>
                            <div className="form-group col-xs-1 col-md-1" style={{textAlign:'center'}}>
                                {da.weekDay && da.weekDay[6] ? <i className={'foddingicon fooding-dui-icon2'}></i>:null}
                            </div>
                        </div>)
                    })
                }
            </div>
        )
    };

    renderRotate = () => {
        let {arrRotate} = this.state;
        return (
            <div className={'row'}>
                <div className={'row'}>
                    <div className="form-group col-xs-4 col-md-4">
                        <label className={'col-md-5 col-lg-5'}></label>{i18n.t(400248/*班次选择*/)}
                    </div>
                    <div className="form-group col-xs-3 col-md-3">
                        <label className={'col-md-4 col-lg-4'}></label>{i18n.t(400249/*工作天数*/)}
                    </div>
                    <div className="form-group col-xs-3 col-md-3">
                        <label className={'col-md-4 col-lg-4'}></label>{i18n.t(400250/*休息天数*/)}
                    </div>
                </div>
                {
                    arrRotate.map((da, j) => {
                        return (
                            <div className={'row'} key={j}>
                                <div className="form-group col-xs-4 col-md-4">
                                    <label className={'col-md-5 col-lg-5'}></label>
                                    <div className={'col-md-7 col-lg-7'}>
                                        <p>{da.schedule && da.schedule.localName ? da.schedule.localName : ""}</p>
                                    </div>
                                </div>
                                <div className="form-group col-xs-3 col-md-3">
                                    <label className={'col-md-4 col-lg-4'}></label>
                                    <div className={'col-md-8 col-lg-8'}>
                                        <p>{da.workingDay || ""}</p>
                                    </div>
                                </div>
                                <div className="form-group col-xs-3 col-md-3">
                                    <label className={'col-md-4 col-lg-4'}></label>
                                    <div className={'col-md-8 col-lg-8'}>
                                        <p>{da.helfDay || ""}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    };


    render() {
        let that = this;
        let {getOne = {}} = this.props;
        return (<FormWrapper showFooter={true} onCancel={this.onCancel} showSaveClose={false}>
            <div className={'girdlayout'}>
                <div className={'row'}>
                    <div className="form-group col-md-6 col-lg-6">
                        <label className={'col-md-3 col-lg-3'}>{i18n.t(100243/*集团*/)}</label>
                        <div className={'col-md-9 col-lg-9'}>
                            <p>{getOne.cluster && getOne.cluster.localName ? getOne.cluster.localName : ""}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-6 col-lg-6">
                        <label className={'col-md-3 col-lg-3'}>{i18n.t(100244/*企业*/)}</label>
                        <div className={'col-md-9 col-lg-9'}>
                            <p>{getOne.company && getOne.company.localName ? getOne.company.localName : ""}</p>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-6 col-lg-6">
                        <label className={'col-md-3 col-lg-3'}>{i18n.t(400240/*规则编号*/)}</label>
                        <div className={'col-md-9 col-lg-9'}>
                            <p>{getOne.code || ""}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-6 col-lg-6">
                        <label className={'col-md-3 col-lg-3'}>{i18n.t(400241/*规则名称*/)}</label>
                        <div className={'col-md-9 col-lg-9'}>
                            <p>{getOne.name || ""}</p>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-6 col-lg-6">
                        <label className={'col-md-3 col-lg-3'}>{i18n.t(400242/*规则类型*/)}</label>
                        <div className={'col-md-9 col-lg-9'}>
                            <p>{getOne.typeName || ""}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-6 col-lg-6">
                        <label className={'col-md-3 col-lg-3'}>{I18n.t(100002/*描述*/)}</label>
                        <div className={'col-md-9 col-lg-9'}>
                            <p>{getOne.memo || ""}</p>
                        </div>
                    </div>
                </div>
                { getOne.type == 1 ? this.renderWeek() : this.renderRotate()}
            </div>
        </FormWrapper>);
    }
}

export default ArrangeRuleViewDialog;

