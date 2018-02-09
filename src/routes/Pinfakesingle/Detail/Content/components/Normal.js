import React, {Component} from 'react';
import {
    apiGet, apiPost, apiForm, API_FOODING_DS, language, pageSize, sizeList,
    permissionsBtn
} from '../../../../../services/apiCall';
import Tooltip from '../../../../../components/Tip';
import {I18n} from "../../../../../lib/i18n";
import i18n from './../../../../../lib/i18n';

export class DetailNormal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }

    render() {
        let {getOne} = this.props;
        let common ;
        if(getOne.status ==1){
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>

                    { permissionsBtn('pinfakesingle.del') ? <span onClick={this.props.delClick} title={i18n.t(100437/*删除*/)}><i className={'foddingicon fooding-close-all'}></i></span> : '' }
                    { permissionsBtn('pinfakesingle.submit') ? <span onClick={this.props.submitClick} title={i18n.t(100472/*提交*/)}><i className={'foddingicon fooding-submit'}></i></span> : '' }
                    { <span onClick={this.props.alterClick} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-Edit'}></i></span>}

                </div>
            )
        }else if(getOne.status == 10){
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                    { permissionsBtn('pinfakesingle.approve')  ?  <span title={i18n.t(100470/*查看审批*/)} onClick={this.props.onApproveClick}><i className="foddingicon fooding-approve"></i></span>:''}
                </div>
            )
        }else if(getOne.status == 5){
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                    { permissionsBtn('pinfakesingle.approve')  ?  <span title={i18n.t(100470/*查看审批*/)} onClick={this.props.onApproveClick}><i className="foddingicon fooding-approve"></i></span>:''}
                </div>
            )
        }else{
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                </div>
            )
        }
        return (<div className={'addnormal'} style={{marginBottom: '10px'}}>
            {common}
            <div className={'girdlayout'}>
                <div className={'row'}>
                    <div className="form-group col-md-3">
                        <label className={'col-md-4'}>{i18n.t(100243/*集团*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph'}>{getOne ? getOne.ccLcName : ''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className={'col-md-4'}>{i18n.t(100244/*企业*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph text-ellipsis'}>{getOne ? getOne.ccLcName : ''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className={'col-md-4'}>{i18n.t(500382/*销假单号*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph'}>{getOne ? getOne.no : ''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className={'col-md-4'}>{i18n.t(500376/*请假单号*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph'}>{getOne ? getOne.leaveNo : ''}</p>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-6">
                        <label className={'col-md-2'}>{i18n.t(500426/*请假日期*/)}</label>
                        <div className={'col-md-2'}>
                            <p className={'paragraph'}>{new Date(getOne['leaveStartDate']).Format("yyyy-MM-dd hh:mm:ss")}</p>
                        </div>
                        <div className={'col-md-1'}>
                            <p className={'paragraph'}>&nbsp;-&nbsp;</p>
                        </div>
                        <div className={'col-md-2'}>
                            <p className={'paragraph'}>{new Date(getOne['leaveEndDate']).Format("yyyy-MM-dd hh:mm:ss")}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-6">
                        <label className={'col-md-2'}>{i18n.t(500384/*销假日期*/)}</label>
                        <div className={'col-md-2'}>
                            <p className={'paragraph'}>{new Date(getOne['startDate']).Format("yyyy-MM-dd hh:mm:ss")}</p>
                        </div>
                        <div className={'col-md-1'}>
                            <p className={'paragraph'}>&nbsp;-&nbsp;</p>
                        </div>
                        <div className={'col-md-2'}>
                            <p className={'paragraph'}>{new Date(getOne['endDate']).Format("yyyy-MM-dd hh:mm:ss")}</p>
                        </div>
                    </div>

                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3">
                        <label className={'col-md-4'}>{i18n.t(500375/*员工名称*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph'}>{getOne ? getOne.applyLcName : ''}</p>
                        </div>
                    </div>

                    <div className="form-group col-md-3">
                        <label className={'col-md-4'}>{I18n.t(700074/*状态*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph'}>{getOne ? getOne.statusName : ''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-6">
                        <label className={'col-md-2'}>{I18n.t(500381/*销假原因*/)}</label>
                        <div className={'col-md-10'}>
                            <p className={'paragraph'}>{getOne ? getOne.reason : ''}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default DetailNormal;
