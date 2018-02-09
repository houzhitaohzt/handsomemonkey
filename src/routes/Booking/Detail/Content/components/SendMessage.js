import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../../services/apiCall";
export class DetailNormal extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {getOne} = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(200342/*发运信息*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100299/*货代公司*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["forwarderBe"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200343/*货运公司*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["transportBe"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(200344/*收货人*/)}</label>
							<div className={'col-md-10 col-lg-10'}>
								<p className={'paragraph'}>{getOne["revBusiness"+language]}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200345/*货代联系人*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["linker"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100376/*交易条款*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["incotm"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200163/*收货人电话*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.recTel}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200164/*收货人传真*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.recFax}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100297/*起运港*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["sStatn"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100298/*目的港*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["eStatn"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(200166/*收货人地址*/)}</label>
							<div className={'col-md-10 col-lg-10'}>
								<p style={{width:'100%'}} className={'paragraph'}>{getOne.recAddress}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100224/*运输方式*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["trans"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500088/*装箱类型*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["packTypeName"]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200346/*通知人*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["noticeBusiness"+language]}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500090/*可否转运*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.canTransportMark?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500092/*提单方式*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.billLadTypeName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200347/*通知人电话*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.noticeTel}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200348/*通知人传真*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.noticeFax}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(500089/*要求装运日*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{new Date(getOne.ariveDate).Format('yyyy-MM-dd')}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200349/*免仓期申请*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{getOne.frStorAgeApp}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-2 col-lg-2'}>{i18n.t(200350/*通知人地址*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'} style={{width:'100%'}}>{getOne.noticeAddress}</p>
								</div>
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200351/*集装箱号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.containerNo}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(300064/*箱型箱量*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.container}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400112/*发货方*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["sendBe"+language]}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200353/*截单日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOne.cutoffDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500128/*运价*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{toDecimal(getOne.freightPrice)}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200354/*发货人电话*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.sendTel}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200355/*发货人传真*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.sendFax}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200356/*报关日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOne.declareDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200357/*截关/港日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOne.closingDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200358/*发货人地址*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.sendAddress}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200359/*预计开船日*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOne.predictSailingDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200360/*预计到港日*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOne.predictArrivalDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200361/*实际开船日*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOne.actSailingDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200362/*实际到港日*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOne.actArrivalDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
					</div>
					<div className='row'>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(201318/*运费缴付*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.freightPayName}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(200363/*仓储装箱要求*/)}</label>
							<div className={'col-md-10 col-lg-10'}>
								<p className={'paragraph'}>{getOne.stPackReq}</p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(200364/*拍照要求*/)}</label>
							<div className={'col-md-10 col-lg-10'}>
								<p>{getOne.photoReq}</p><br/>
							</div>
						</div>
					</div>
					</div>
				</div>)
	}
}

export default  DetailNormal;
