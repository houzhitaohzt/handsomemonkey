import i18n from './../../../../lib/i18n';
import React, { Component } from 'react';
// ajax
 import {I18n} from '../../../../lib/i18n';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../services/apiCall';
export class  ShippingInstructions extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {businessOne} = this.props;
		return(<div className={'addnormal'} style={{margin:'10px 0'}}>
				<div className={'addnormal-title'}>
					<span  >{I18n.t(500087/*装运要求*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100224/*运输方式*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne["trans"+language]?businessOne["trans"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(500088/*装箱类型*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne.payBusinessEnName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100297/*起运港*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne["sStatn"+language]?businessOne["sStatn"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100298/*目的港*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{businessOne["eStatn"+language]?businessOne["eStatn"+language]:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500089/*要求装运日*/)}</label>
								<div className={'col-md-9 col-lg-8'}>
									<p className={'paragraph'}>{new Date(businessOne.validityDate).Format('yyyy-MM-dd')}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500090/*可否转运*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.canTransportMark?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100299/*货代公司*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne["forwardBe"+language]?businessOne["forwardBe"+language]:''}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500092/*提单方式*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.billLadTypeName}</p>
								</div>
							</div>
					</div>
				</div>
			</div>)
	}
}

export default  ShippingInstructions;
