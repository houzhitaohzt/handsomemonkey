import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';


// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,toDecimal} from '../../../../../services/apiCall';
import {I18n} from "../../../../../lib/i18n";


export class DetailNormal extends Component{
	constructor(props){
		super(props);

	}

	render(){
		let {Data,getOneData} = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>

					{ getOneData['status'] == 10 ?  // 以审批
						<div className={'addnormal-title'}>
							<span  >{I18n.t(100138/*常规*/)}</span>
				   			{/*{ permissionsBtn('expenseaccount.topayrequest') ? <span onClick={this.props.pay} title={i18n.t(200551*//*支付*//*)}><i className={'foddingicon fooding-payment-last'}></i></span> : ''}				*/}
							{ permissionsBtn('expenseaccount.revoke') ? <span onClick={this.props.shall} title={I18n.t(500149/*撤销*/)}><i className={'foddingicon fooding-shall'}></i></span> : ''}				
						</div>
						:
						<div className={'addnormal-title'}>
							<span  >{I18n.t(100138/*常规*/)}</span>
							{ permissionsBtn('expenseaccount.costconfirm') ? <span onClick={this.props.charge} title={I18n.t(200408/*费用确认*/)}><i className={'foddingicon fooding-char-jilu'}></i></span> : ''}				
							{ permissionsBtn('expenseaccount.submit') ? <span onClick={this.props.commit} title={I18n.t(100472/*提交*/)}><i className={'foddingicon fooding-submit'}></i></span> : ''}				
							{ permissionsBtn('expenseaccount.edit') ? <span onClick={this.props.edit} title={I18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-alter_icon2'}></i></span> : ''}								
							{ permissionsBtn('expenseaccount.del') ? <span onClick={this.props.delete} title={I18n.t(100437/*删除*/)}><i className={'foddingicon fooding-delete-icon4'}></i></span> : ''}
                            { permissionsBtn('informSuperior') ? <span onClick={this.props.tongzhi} title={i18n.t(600213/*通知上级*/)}><i className={'foddingicon fooding-lead'}></i></span> : ''}
							</div>
					}
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="col-md-3">
							<label className={'col-md-4'}>{I18n.t(400048/*单据编号*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{Data.no || ''}</p>
							</div>
						</div>
						<div className="col-md-3">
							<label className={'col-md-4'}>{I18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{new Date(Data['billDate']).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="col-md-3">
							<label className={'col-md-4'}>{I18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{Data.statusName || ''}</p>
							</div>
						</div>
						<div className="col-md-3">
							<label className={'col-md-4'}>{I18n.t(100284/*币种*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{Data['cny'+language] || ''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="col-md-3">
								<label className={'col-md-4'}>{I18n.t(500146/*源单类型*/)}</label>
								<div className={'col-md-9 col-lg-8'}>
									<p className={'paragraph'}>{Data.sourceTypeName || ''}</p>
								</div>
							</div>
							<div className="col-md-3">
								<label className={'col-md-4'}>{I18n.t(500050/*付款企业*/)}</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{Data['payCc'+language] || ''}</p>
								</div>
							</div>
							<div className="col-md-3">
								<label className={'col-md-4'}>{I18n.t(400084/*收款单位*/)}</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{Data['receiptBe'+language] || ''}</p>
								</div>
							</div>
							<div className="col-md-3">
								<label className={'col-md-4'}>{I18n.t(200402/*报销人*/)}</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{Data['payStaff'+language] || ''}</p>
								</div>
							</div>
					</div>
					<div className={'row'}>
						<div className="col-md-3">
							<label className={'col-md-4'}>{I18n.t(600085/*报销合计*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{toDecimal(Data.costAmt) || ''}</p>
							</div>
						</div>
						<div className="col-md-3">
							<label className={'col-md-4'}>{I18n.t(100336/*备注*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{Data.remark || ''}</p>
							</div>
						</div>						
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
