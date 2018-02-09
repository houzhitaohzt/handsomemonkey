import React, { Component } from 'react';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../../services/apiCall';
import {I18n} from '../../../../../lib/i18n';
export class  SellerInformation extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {businessOne} = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'addnormal-title'}>
						<span>{I18n.t(500081/*卖方信息*/)}</span>
					</div>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500036/*卖方企业*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne["cc"+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500082/*卖方部门*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne["salePor"+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}><span></span>{I18n.t(500083/*收款企业*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne["receiptCc"+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500084/*关闭原因*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.closeInstruct}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500085/*卖方联系人*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.saleLinkLcName}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500044/*联系电话*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.saleLinkTel}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(500086/*收款账号*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne["receBankAccount"+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(100336/*备注*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{businessOne.salerNote}</p>
								</div>
							</div>
						</div>
					</div>
				</div>)
	}
}

export default  SellerInformation;
