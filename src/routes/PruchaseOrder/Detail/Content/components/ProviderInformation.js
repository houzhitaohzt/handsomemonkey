import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
import { I18n } from '../../../../../lib/i18n';
export class ProviderInformation extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {purorderData = {} } = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{I18n.t(400083/*供应商信息*/)}</span>
				</div>
				<div className={'girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100312/*供应商*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{purorderData.vndBeLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100133/*支付条款*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{purorderData.payTrmLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400084/*收款单位*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{purorderData.recVndBeLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400085/*供应商订单号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{purorderData.vndOrderNo}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100376/*交易条款*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{purorderData.incotmLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400086/*承担进仓费*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{purorderData.inStoreFee?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400087/*承担港杂*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{purorderData.portFee?I18n.t(100141/*是*/):I18n.t(100142/*否*/)}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400088/*是否开票*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{purorderData.invMark?I18n.t(100141/*是*/):I18n.t(100142/*否*/)}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  ProviderInformation;
