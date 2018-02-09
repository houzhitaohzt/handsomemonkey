import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../../services/apiCall";
export class DetailNormal extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {getOne} = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(500057/*商务条款*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100224/*运输方式*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["trans"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500088/*装箱类型*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne.packTypeName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100297/*起运港*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["sStatn"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100298/*目的港*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["eStatn"+language]}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(500090/*可否转运*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{getOne.canTransportMark?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(100376/*交易条款*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{getOne["incotm"+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(100133/*支付条款*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{getOne["payTrm"+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(500045/*收货企业*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{getOne["revBusiness"+language]}</p>
								</div>
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500046/*收货联系人*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["reclink"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100322/*商机编号*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne.businessNo}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
