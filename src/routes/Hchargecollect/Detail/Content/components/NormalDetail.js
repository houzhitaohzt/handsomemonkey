import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,toDecimal} from '../../../../../services/apiCall';
export class DetailNormal extends Component{
	constructor(props){
		super(props);
	}
render(){

		let {Data,getOneData} = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>

					{ getOneData['status'] == 10 ?  // 以审批
						<div className={'addnormal-title'}>
							<span>{i18n.t(100138/*常规*/)}</span>
							
						</div>
						:
						<div className={'addnormal-title'}>
							<span  >{i18n.t(100138/*常规*/)}</span>
							{ permissionsBtn('chargecollect.costconfirm') ? <span onClick={this.props.charge} title={i18n.t(200408/*费用确认*/)}><i className={'foddingicon fooding-char-jilu'}></i></span> : ''}
							{ permissionsBtn('chargecollect.submit') ? <span onClick={this.props.commit} title={i18n.t(100472/*提交*/)}><i className={'foddingicon fooding-submit'}></i></span> : ''}
							{ permissionsBtn('chargecollect.edit') ? <span onClick={this.props.edit} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-alter_icon2'}></i></span> : ''}
							{ permissionsBtn('chargecollect.del') ? <span onClick={this.props.delete} title={i18n.t(100437/*删除*/)}><i className={'foddingicon fooding-delete-icon4'}></i></span> : ''}
						</div>
					}

				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="col-md-3">
							<label className={'col-md-4'}>{i18n.t(400048/*单据编号*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{Data.no || ''}</p>
							</div>
						</div>
						<div className="col-md-3">
							<label className={'col-md-4'}>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{new Date(Data['billDate']).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="col-md-3">
							<label className={'col-md-4'}>{i18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{Data.statusName || ''}</p>
							</div>
						</div>
						<div className="col-md-3">
							<label className={'col-md-4'}>{i18n.t(100284/*币种*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{Data['cny'+language] || ''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="col-md-3">
								<label className={'col-md-4'}>{i18n.t(500083/*收款企业*/)}</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{Data['receiptCc'+language] || ''}</p>
								</div>
							</div>
							<div className="col-md-3">
								<label className={'col-md-4'}>{i18n.t(500241/*付款单位*/)}</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{Data['payBusiness'+language] || ''}</p>
								</div>
							</div>
							<div className="col-md-3">
								<label className={'col-md-4'}>{i18n.t(100370/*联系人*/)}</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{Data['bizLink'+language] || ''}</p>
								</div>
							</div>
							<div className="col-md-3">
								<label className={'col-md-4'}>{i18n.t(500242/*制单人*/)}</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{Data['reStaff'+language] || ''}</p>
								</div>
							</div>
					</div>
					<div className={'row'}>
						<div className="col-md-3">
							<label className={'col-md-4'}>{i18n.t(500244/*纸质发票*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{Data.paperNo || ''}</p>
							</div>
						</div>
						<div className="col-md-3">
							<label className={'col-md-4'}>{i18n.t(500249/*合计费用*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{toDecimal(Data.totalAmt) || ''}</p>
							</div>
						</div>
						<div className="col-md-3">
							<label className={'col-md-4'}>{i18n.t(100336/*备注*/)}</label>
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
