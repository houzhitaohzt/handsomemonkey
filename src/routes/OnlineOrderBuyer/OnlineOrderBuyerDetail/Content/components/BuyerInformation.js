import React, { Component } from 'react';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../../services/apiCall';
 import Tooltip from '../../../../../components/Tip';
 import {I18n} from '../../../../../lib/i18n';
export class  BuyerInformation extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {businessOne} = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>		
					<div className={'addnormal-title'}>
						<span>{I18n.t(500041/*买方信息*/)}</span>
					</div>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500035/*买方企业*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne['salBe'+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500042/*买方部门*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne['buyerDep'+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500043/*买方联系人*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.buyerlinkLcName}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500044/*联系电话*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.buyerLinkTel}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500045/*收货企业*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph text-ellipsis'}>{businessOne.revBusinessLcName}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500046/*收货联系人*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.reclinkLcName}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500047/*收货电话*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.recTel}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500048/*收货传真*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.recFax}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500049/*收货地址*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<Tooltip placement="top" overlay={<div style={{color:'black',backgroundColor:'red'}}>{businessOne.recAddress}</div>} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}><p className={'paragraph text-ellipsis'}>{businessOne.recAddress}</p></Tooltip>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500050/*付款企业*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.payBusinessLcName}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500051/*撤单原因*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.cancelReason}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100336/*备注*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.buyerNote}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500053/*企业通知*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.noticeBusinessLcName}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500054/*通知联系人*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.noticeLinkLcName}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500055/*通知电话*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.noticeTel}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500056/*通知地址*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<Tooltip placement="top" overlay={<div style={{color:'black',backgroundColor:'red'}}>{businessOne.noticeAdd}</div>} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}><p className={'paragraph text-ellipsis'}>{businessOne.noticeAdd}</p></Tooltip>
								</div>
							</div>
						</div>
					</div>
				</div>)
	}
}

export default  BuyerInformation;
