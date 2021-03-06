import React, { Component } from 'react';
import {I18n} from "../../../../lib/i18n";
export class DetailNormal extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let {commonData = {} } = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span>{I18n.t(100138/*常规*/)}</span>
					{
						commonData.flag != 1?<span onClick={this.props.editClick} title={I18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-alter'}></i></span>:""
					}
					{
						(commonData.flag != 1 && this.props.typeNumber == 10)?<span onClick={this.props.onTurnToBusiClick} title={I18n.t(400004/*转商机*/)}><i className={'foddingicon fooding-send'}></i></span>:""
					}
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100304/*主题*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{commonData.title || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{this.props.Label}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{commonData.salBeLcName || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100230/*状态*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{commonData.state ==0?I18n.t(100329/*计划*/):I18n.t(100330/*已响应*/)}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100481/*地址*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{commonData.addrState == 0?I18n.t(100331/*展馆*/):I18n.t(100488/*其他*/)}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100332/*市场活动*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{commonData.activitLcName || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100087/*国家*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{commonData.cntryLcName || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100535/*省/州*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{commonData.provinceLcName || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100248/*市*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{commonData.cityLcName || ""}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100481/*地址*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{commonData.address || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{commonData.state ==0?I18n.t(100307/*预计开始时间*/):I18n.t(100305/*开始时间*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{commonData.state ==0?new Date(commonData.expectedStartTime).Format('yyyy-MM-dd hh:mm:ss'):new Date(commonData.starts).Format('yyyy-MM-dd hh:mm:ss')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{commonData.state ==0?I18n.t(100308/*预计结束时间*/):I18n.t(100306/*结束时间*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{commonData.state ==0?new Date(commonData.expectedEndTime).Format('yyyy-MM-dd hh:mm:ss'):new Date(commonData.ends).Format('yyyy-MM-dd hh:mm:ss')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100309/*提醒时间*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(commonData.reminderTime).Format('yyyy-MM-dd hh:mm:ss')}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100333/*与会人员*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>
								{
									String(commonData.customerParticipantIds?commonData.customerParticipantIds.split(",").map((e,i) =>{
									return e.split(".")[1]
									}):"")
								}		
								</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100316/*响应目的*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{commonData.respond || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100335/*后续跟踪方式*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{commonData.trackingModeLcName || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100336/*备注*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{commonData.remark || ""}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100337/*后续提醒时间*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(commonData.nextReminderTime).Format('yyyy-MM-dd hh:mm:ss')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100334/*礼品准备*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{commonData.gift || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100317/*响应记录*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{commonData.respondRecord || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100338/*我方参与人员*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>
								{
									String(commonData.participantIds?commonData.participantIds.split(",").map((e,i) =>{
									return e.split(".")[1]
									}):"")
								}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
