import React, { Component } from 'react';
import {permissionsBtn,language,toDecimal} from "../../../../services/apiCall";
import { I18n } from '../../../../lib/i18n';
export class DetailNormal extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {valueone = {}} = this.props,paymentDom=(<a></a>),outputDom=(<a></a>),submitDom=(<a></a>),approveDom=(<a></a>);
		if(valueone.status == 1){//草稿
			approveDom=permissionsBtn('purorderreturn.del')?(<span title ={I18n.t(100437/*删除*/)} onClick={this.props.onDeleteClick}><i className="foddingicon fooding-delete-icon4"></i></span>):"";
			submitDom= permissionsBtn('purorderreturn.commit')? (<span onClick={this.props.submitClick} title={I18n.t(100472/*提交*/)}><i className={'foddingicon fooding-submit'}></i></span>):"";
		}else if(valueone.status == 5){
		}else if(valueone.status == 10){
			paymentDom = permissionsBtn('purorderreturn.redpayment')?(<span onClick={this.props.paymentClick} title={I18n.t(400124/*红字付款单*/)}><i className={'foddingicon fooding-payment-apply'}></i></span>):"";
			outputDom =permissionsBtn('purorderreturn.outnotice')?(<span onClick={this.props.outputClick} title={I18n.t(400125/*出库通知*/)}><i className={'foddingicon fooding-put'}></i></span>):""
		}

		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{I18n.t(100138/*常规*/)}</span>
					<span title ={I18n.t(100470/*查看审批*/)} onClick={this.props.onApproveClick}><i className="foddingicon fooding-approve"></i></span>
					{paymentDom}
					{outputDom}
					{submitDom}
					{approveDom}					
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(400122/*退货单号*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone["no"] || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone.billDate?new Date(valueone.billDate).Format('yyyy-MM-dd'):""}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone["statusName"] || ""}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100312/*供应商*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone["vndBe"+language] || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(400123/*退货金额*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{toDecimal(valueone["orderAmt"])|| ""}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100284/*币种*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone["cnyEnName"]}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(400099/*退货原因*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone["causeName"]}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100336/*备注*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone["remark"]}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(400054/*采购单号*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone["sourceNo"]}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
