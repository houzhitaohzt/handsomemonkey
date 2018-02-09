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
        let {getOne} = this.props;
        let common ;
        //{ permissionsBtn('overtimeregister.print') ? <span onClick={this.props.dayinClick} title={i18n.t(201307/*打印*/)}><i className={'foddingicon fooding-print'}></i></span> : '' }
        if(getOne.status ==1){
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                   	{ permissionsBtn('overtimeregister.del') ? <span onClick={this.props.delClick} title={i18n.t(100437/*删除*/)}><i className={'foddingicon fooding-close-all'}></i></span> : '' }
                    { permissionsBtn('overtimeregister.submit') ? <span onClick={this.props.submitClick} title={i18n.t(100472/*提交*/)}><i className={'foddingicon fooding-submit'}></i></span> : '' }
                    { permissionsBtn('overtimeregister.copy')  ?  <span onClick={this.props.copyClick} title={i18n.t(100452/*复制*/)}><i className={'foddingicon fooding-copy-last'}></i></span>:''}
                    { permissionsBtn('overtimeregister.edit') ?  <span onClick={this.props.alterClick} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-Edit'}></i></span> : '' }

                </div>
            )
        }else if(getOne.status == 10){
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
					{ permissionsBtn('overtimeregister.copy') ? <span onClick={this.props.copyClick} title={i18n.t(100452/*复制*/)}><i className={'foddingicon fooding-copy-last'}></i></span>:''}
                    { permissionsBtn('overtimeregister.approve')  ?  <span title={i18n.t(100470/*查看审批*/)} onClick={this.props.onApproveClick}><i className="foddingicon fooding-approve"></i></span>:''}
                </div>
            )
        }else if(getOne.status == 5){
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                    { permissionsBtn('overtimeregister.copy') ? <span onClick={this.props.copyClick} title={i18n.t(100452/*复制*/)}><i className={'foddingicon fooding-copy-last'}></i></span>:''}
                    { permissionsBtn('overtimeregister.approve')  ?  <span title={i18n.t(100470/*查看审批*/)} onClick={this.props.onApproveClick}><i className="foddingicon fooding-approve"></i></span>:''}
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
								<p className={'paragraph'}>{getOne.no ? getOne.no:''}</p>
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
								<p className={'paragraph'}>{getOne?getOne.statusName:''}</p>
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
								<label className={'col-md-4'}>{I18n.t(500358/*登记人*/)}</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{getOne.registerLcName ? getOne.registerLcName:''}</p>
								</div>
							</div>
							<div className="form-group col-md-3">
								<label className={'col-md-4'}>{I18n.t(100305/*开始时间*/)}</label>
								<div className={'col-md-8'}>
                                    <p className={'paragraph'}>{getOne['startDate']?new Date(getOne['startDate']).Format("yyyy-MM-dd"):''}</p>
								</div>
							</div>
							<div className="form-group col-md-3">
								<label className={'col-md-4'}>{I18n.t(100306/*结束时间*/)}</label>
								<div className={'col-md-8'}>
                                    <p className={'paragraph'}>{getOne['endDate']?new Date(getOne['endDate']).Format("yyyy-MM-dd"):''}</p>
								</div>
							</div>							
					</div>
                    <div className={'row'}>
                        {getOne.startTime?<div className="form-group col-md-3">
                            <label className={'col-md-4'}>{I18n.t(600265/*加班时间*/)}</label>
                            <div className={'col-md-8'} style={{marginTop:'5px'}}>
                                <span>{ getOne.startTime || '' }</span>
                                <span>-</span>
                                <span>{ getOne.endTime || '' }</span>
                            </div>

                        </div>:''}
                        {getOne.scheduleName?<div className="form-group col-md-3">
                            <label className={'col-md-4'}>{I18n.t(500352/*考勤班次*/)}</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOne.scheduleName ? getOne.scheduleName:''}</p>
                            </div>
                        </div>:''}
                        <div className="form-group col-md-3">
                            <label className={'col-md-4'}>{I18n.t(500433/*是否考勤*/)}</label>
                            <div className={'col-xs-8 col-md-8'}>
                                <p className={'paragraph'}>{getOne.checkAttendance?I18n.t(100141/*是*/):I18n.t(100142/*否*/)}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4'}>{I18n.t(500361/*加班时长*/)}</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOne.overTime ? getOne.overTime:''}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4'}>{I18n.t(500359/*补偿方式*/)}</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOne.compensateType ? getOne.compensateType.name:''}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>

                        <div className="form-group col-md-6">
                            <label className={'col-md-2'}>{I18n.t(500360/*事由*/)}</label>
                            <div className={'col-md-10'}>
                                <p className={'paragraph'}>{getOne.reason ? getOne.reason:''}</p>
                            </div>
                        </div>
                    </div>

				</div>
			</div>)
	}
}

export default  DetailNormal;
