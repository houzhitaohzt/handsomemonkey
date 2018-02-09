import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,
	API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../../services/apiCall";
export class DetailNormal extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {getOne} = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(200834/*收款信息*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500083/*收款企业*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["receiptCc"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(201063/*收款账户*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["receBankAccount"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200165/*销售总额*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{toDecimal(getOne["saleTaxAmt"])}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
