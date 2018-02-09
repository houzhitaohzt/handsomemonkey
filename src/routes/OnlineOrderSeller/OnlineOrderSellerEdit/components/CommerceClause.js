import React, { Component } from 'react';
 import {I18n } from '../../../../lib/i18n';
export class CommerceClause extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {businessOne} = this.props;
		return(<div className={'addnormal'} style={{margin:'10px 0'}}>
				<div className={'addnormal-title'}>
					<span  >{I18n.t(500057/*商务条款*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100133/*支付条款*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.payTrmLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(500059/*买信保*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.corpMark?I18n.t(100141/*是*/):I18n.t(100142/*否*/)}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100189/*信保分类*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.corpTypeName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100376/*交易条款*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.incotmLcName}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(500062/*买保险*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.pShipMark?I18n.t(100141/*是*/):I18n.t(100142/*否*/)}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(500063/*付款方式*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.payTrmTyLcName}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  CommerceClause;
