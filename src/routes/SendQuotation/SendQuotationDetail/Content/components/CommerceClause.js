import i18n from './../../../../../lib/i18n';
import React, {Component} from 'react';

export class CommerceClause extends Component{
	constructor(props){
		super(props)
	}
	render(){
	    const {businessOne} = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
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
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200068/*询价总额*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.enquiryAmt}</p>
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
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200069/*报价总额*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.quotationAmt}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  CommerceClause;
