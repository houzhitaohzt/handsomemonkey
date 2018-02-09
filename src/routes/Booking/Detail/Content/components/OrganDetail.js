import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../../services/apiCall";
export class DetailNormal extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {getOne} =this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span>{i18n.t(100140/*组织*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500143/*集团组织*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["cluster"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100244/*企业*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["cc"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200119/*销售组织*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["sor"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400011/*销售员*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["saleStaff"+language]}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500144/*营运组织*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["plant"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200312/*物流员*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["lsStaff"+language]}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
