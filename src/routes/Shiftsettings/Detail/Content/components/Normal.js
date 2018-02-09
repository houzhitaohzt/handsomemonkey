import React, { Component } from 'react';
import {
    apiGet, apiPost, apiForm, API_FOODING_DS, language, pageSize, sizeList,
    permissionsBtn
} from '../../../../../services/apiCall';
 import Tooltip from '../../../../../components/Tip';
 import {I18n} from "../../../../../lib/i18n";
 import i18n from './../../../../../lib/i18n';
export class DetailNormal extends Component{
	constructor(props){
		super(props)
		this.state={
			data:{}
		}
	}

	render(){
		let getOne = this.props.getOne;
        getOne = getOne || '';
        getOne.depments =getOne.depments ||[];
        getOne.irowSts = getOne.irowSts || {};
        getOne.staffs = getOne.staffs || [];
        let common ;
        if(getOne.irowSts && getOne.irowSts.id ==5){
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                    {permissionsBtn('shiftsettings.del') ?<span onClick={this.props.delClick} title={i18n.t(100437/*删除*/)}><i className={'foddingicon fooding-close-all'}></i></span>:''}
                    {permissionsBtn('shiftsettings.activation') ?<span onClick={this.props.jihuoClick} title={I18n.t(100442/*激活*/)}><i className={'foddingicon fooding-jh-icon2'}></i></span>:''}
                    {permissionsBtn('shiftsettings.edit') ?<span onClick={this.props.alterClick} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-airing-edit'}></i></span>:''}
                    {permissionsBtn('shiftsettings.copy')  ?  <span onClick={this.props.copyClick} title={i18n.t(100452/*复制*/)}><i className={'foddingicon fooding-copy-last'}></i></span>:''}

                </div>
            )
        }else if(getOne.irowSts && getOne.irowSts.id ==10){
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                    {permissionsBtn('shiftsettings.invalid') ?<span onClick={this.props.shixiaoClick} title={I18n.t(100441/*失效*/)}><i className={'foddingicon fooding-shixiao'}></i></span>:''}
                    {permissionsBtn('shiftsettings.edit') ?<span onClick={this.props.alterClick} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-airing-edit'}></i></span>:''}
                </div>
            )
        }else if(getOne.irowSts && getOne.irowSts.id ==20){
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                    {permissionsBtn('shiftsettings.activation') ?<span onClick={this.props.jihuoClick} title={I18n.t(100442/*激活*/)}><i className={'foddingicon fooding-jh-icon2'}></i></span>:''}
                    {permissionsBtn('shiftsettings.edit') ?<span onClick={this.props.alterClick} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-airing-edit'}></i></span>:''}
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
							<label className={'col-md-4'}>{i18n.t(100243/*集团*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{getOne.cluster? getOne.cluster.localName:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{i18n.t(100244/*企业*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph text-ellipsis'}>{getOne.company ? getOne.company.localName:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{i18n.t(500395/*排班编号*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{getOne?getOne.code:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{i18n.t(500396/*排班名称*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{getOne?getOne.name:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
                        <div className="form-group col-md-6">
                            <label className={'col-md-2'}>{i18n.t(100238/*部门*/)}</label>
                            <div className={'col-md-10'}>
                                <p className={'paragraph'}>
                                    {
                                        getOne.depments.map((e,i)=>{
                                            return e && e.localName?(e.localName + " "):''
                                        })
                                    }
                                </p>
                            </div>
                        </div>
							<div className="form-group col-md-6">
								<label className={'col-md-2'}>{i18n.t(400145/*职员*/)}</label>
                                <div className={'col-md-10'}>
                                    <p className={'paragraph'}>
                                        {
                                            getOne.staffs.map((e,i)=>{
                                                return e && e.localName?(e.localName + " "):''
                                            })
                                        }
                                    </p>
                                </div>
							</div>
					</div>
                    <div className={'row'}>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4'}>{I18n.t(400239/*工作日历*/)}</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOne.workingCalendar?getOne.workingCalendar.localName:''}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4'}>{I18n.t(500354/*排班规则*/)}</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOne.scheduleRule ? getOne.scheduleRule.localName:''}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(500399/*日期长度*/)}</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOne?getOne.dateLengthName:''}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(500400/*考勤开始日*/)}</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOne?getOne.dayBegin:''}</p>
                            </div>
                        </div>
                    </div>
					<div className={'row'}>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(700076/*日期*/)}</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{new Date(getOne['scheduleDate']).Format('yyyy-MM-dd')}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4 col-lg-4'}>{I18n.t(500360/*事由*/)}</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOne?getOne.remark:''}</p>
                            </div>
                        </div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
