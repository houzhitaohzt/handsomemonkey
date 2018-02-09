import React, {Component} from 'react';

import i18n from '../../../../../lib/i18n';
export class CommerceClause extends Component{
	constructor(props){
		super(props)
	}

	render(){
	    let {businessOne} = this.props;
		return(<div className={'addnormal'} style={{margin:'10px 0'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(500057/*商务条款*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100224/*运输方式*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.transLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500088/*装箱类型*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.packTypeName}</p>
							</div>
						</div>
						<div className="form-group col-md-2 col-lg-2">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100297/*起运港*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.sStatnLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-2 col-lg-2">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100298/*目的港*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.eStatnLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-2 col-lg-2">
							<label className={'col-md-5 col-lg-5'}>{i18n.t(200017/*有效期至*/)}</label>
							<div className={'col-md-7 col-lg-7'}>
								<p className={'paragraph'}>{new Date(businessOne.validityDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100376/*交易条款*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.incotmLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100133/*支付条款*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.payTrmLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-2 col-lg-2">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100284/*币种*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.cnyLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-2 col-lg-2">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500090/*可否转运*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.canTransportMark?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</p>
							</div>
						</div>
						<div className="form-group col-md-2 col-lg-2">
							<label className={'col-md-5 col-lg-5'}>{i18n.t(200018/*预计装运期*/)}</label>
							<div className={'col-md-7 col-lg-7'}>
								<p className={'paragraph'}>{new Date(businessOne.preAriveDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  CommerceClause;
