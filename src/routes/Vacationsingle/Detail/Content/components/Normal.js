import React, { Component } from 'react';
import {
    apiGet, apiPost, apiForm, API_FOODING_DS, language, pageSize, sizeList, API_FOODING_HR,
    permissionsBtn
} from '../../../../../services/apiCall';
import Tooltip from '../../../../../components/Tip';
import {I18n} from "../../../../../lib/i18n";
import i18n from './../../../../../lib/i18n';
export class DetailNormal extends Component{
    constructor(props){
        super(props)
    }
    initState(){
        return {
            data:{},

        }
    }

    render(){
        //{ permissionsBtn('vacationsingle.print') ? <span onClick={this.props.dayinClick} title={i18n.t(201307/*打印*/)}><i className={'foddingicon fooding-print'}></i></span> : '' }
        let {getOne} = this.props;
        let common ;
        if(getOne.status ==1){
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                    { permissionsBtn('vacationsingle.del') ? <span onClick={this.props.delClick} title={i18n.t(100437/*删除*/)}><i className={'foddingicon fooding-close-all'}></i></span> : '' }
                    { permissionsBtn('vacationsingle.submit') ? <span onClick={this.props.submitClick} title={i18n.t(100472/*提交*/)}><i className={'foddingicon fooding-submit'}></i></span> : '' }
                    { permissionsBtn('vacationsingle.copy')  ?  <span onClick={this.props.copyClick} title={i18n.t(100452/*复制*/)}><i className={'foddingicon fooding-copy-last'}></i></span>:''}
                    { permissionsBtn('vacationsingle.edit') ?  <span onClick={this.props.alterClick} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-Edit'}></i></span> : '' }

                </div>
            )
        }else if(getOne.status == 10){
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                    { permissionsBtn('vacationsingle.copy') ? <span onClick={this.props.copyClick} title={i18n.t(100452/*复制*/)}><i className={'foddingicon fooding-copy-last'}></i></span>:''}
                    { permissionsBtn('vacationsingle.approve')  ?  <span title={i18n.t(100470/*查看审批*/)} onClick={this.props.onApproveClick}><i className="foddingicon fooding-approve"></i></span>:''}
                    { permissionsBtn('vacationsingle.xiaojia') ? <span onClick={this.props.xiaojiaClick} title={i18n.t(500425/*销假*/)}><i className={'foddingicon fooding-Salesleave'}></i></span> : ''}

                </div>
            )
        }else if(getOne.status == 5){
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>

                    { permissionsBtn('vacationsingle.copy') ? <span onClick={this.props.copyClick} title={i18n.t(100452/*复制*/)}><i className={'foddingicon fooding-copy-last'}></i></span>:''}
                    { permissionsBtn('vacationsingle.approve')  ?  <span title={i18n.t(100470/*查看审批*/)} onClick={this.props.onApproveClick}><i className="foddingicon fooding-approve"></i></span>:''}

                </div>
            )
        }else{
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                </div>
            )
        }
        return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
            {common}
            <div className={'  girdlayout'}>
                <div className={'row'}>
                    <div className="form-group col-md-3">
                        <label className={'col-md-4'}>{I18n.t(400048/*单据编号*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph'}>{getOne? getOne.no:''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className={'col-md-4'}>{i18n.t(700076/*日期*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph'}>{getOne['billDate']?new Date(getOne['billDate']).Format('yyyy-MM-dd'):''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className={'col-md-4'}>{i18n.t(700074/*状态*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph'}>{getOne.status ? getOne.statusName:''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className={'col-md-4'}>{i18n.t(100244/*企业*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph'}>{getOne.ccLcName?getOne.ccLcName:''}</p>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3">
                        <label className={'col-md-4'}>{i18n.t(100238/*部门*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph'}>{getOne.depmntLcName ? getOne.depmntLcName:''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className={'col-md-4'}>{I18n.t(500365/*请假项目*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph'}>{getOne.leaveTypeName ? getOne.leaveTypeName:''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className={'col-md-4'}>{I18n.t(100305/*开始时间*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph'}>{getOne['startDate']?new Date(getOne['startDate']).Format("yyyy-MM-dd hh:mm:ss"):''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className={'col-md-4'}>{I18n.t(100306/*结束时间*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph'}>{getOne['endDate']?new Date(getOne['endDate']).Format("yyyy-MM-dd hh:mm:ss"):''}</p>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className="form-group col-md-3">
                        <label className={'col-md-4'}>{I18n.t(500417/*请假人*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph'}>{getOne.applyLcName ? getOne.applyLcName:''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label className={'col-md-4'}>{I18n.t(500429/*时长*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph'}>{getOne.overTime ? getOne.overTime:''}</p>
                        </div>
                    </div>
                    <div className="form-group col-md-6">
                        <label className={'col-md-4'}>{I18n.t(500360/*事由*/)}</label>
                        <div className={'col-md-8'}>
                            <p className={'paragraph'}>{getOne.reason ? getOne.reason:''}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default  DetailNormal;
