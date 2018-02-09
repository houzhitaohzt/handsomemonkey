import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
import {permissionsBtn, apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP,toDecimal} from '../../../../../services/apiCall';
export class DetailNormal extends Component{
	constructor(props){
		super(props);

	}
	render(){
		let {getOne} = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span></span>
					{ permissionsBtn('payment.record') && getOne.status != 1? <span onClick={this.props.recordClick}><i className={'foddingicon fooding-record'}  title={i18n.t(200815/*查看收付款记录*/)}></i></span> : ''}
					{ permissionsBtn('payment.pay') && getOne.status != 10? <span onClick={this.props.paymentClick}><i className={'foddingicon fooding-payment-last'}  title={i18n.t(100132/*付款*/)}></i></span> : ''}
					{permissionsBtn('payment.revoke')? <span onClick={this.props.chexiaoClick} title={i18n.t(500149/*撤销*/)}><i className={'foddingicon fooding-cancal'} ></i></span> : ''}
					{ getOne.status == 10 ? <span onClick={this.props.hexiaoClick}><i className={'foddingicon fooding-charge'} title={i18n.t(200597/*核销*/)}></i></span> : ''}
					{ getOne.status == 10 ? <span onClick={this.props.approveClick}><i className={'foddingicon fooding-lookover'} title={i18n.t(200618/*查看发票核销*/)}></i></span> : ''}
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400048/*单据编号*/)}</label>
							<div className={'col-md-3 col-lg-3'}>
								<p className={'paragraph'}>{getOne.no}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{new Date(getOne.billDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400084/*收款单位*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["receiptBe"+language]}</p>
							</div>
						</div>
					</div>
					<div className='row'>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne.statusName}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200840/*申请付款时间*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{new Date(getOne.applyPayDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200821/*收款人名称*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne.receiverName}</p>
							</div>
						</div>
					</div>
					<div className='row'>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200622/*期数*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne.periodNum}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100181/*款项类型*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["fundTy"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500086/*收款账号*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne.receBankAccount}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500050/*付款企业*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["payCc"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200817/*申请人*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["payStaff"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>SWIFTCODE</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne.swiftCode}</p>
							</div>
						</div>

					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200841/*申请付款金额*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{toDecimal(getOne.applyAmt)}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200819/*已付金额*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{toDecimal(getOne.payAmt)}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200613/*收款银行*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'} title={getOne["receBank"+language]}>{getOne["receBank"+language]}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200820/*未付金额*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{toDecimal(getOne.applyAmt - getOne.payAmt)}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100284/*币种*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["cny"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100505/*收款人地址*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'} title={getOne.receiverAddress}>{getOne.receiverAddress}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100133/*支付条款*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["payTrm"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500063/*付款方式*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne["payTrmTy"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200822/*银行英文地址*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne.bankEhAddr}</p>
							</div>
						</div>

					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500146/*源单类型*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne.billTypeName}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500129/*源单编号*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{getOne.sourceNo}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
