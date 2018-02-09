import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
import {apiGet, apiPost,apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../../services/apiCall";
export class DetailNormal extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let getOne = this.props.getOne||{};
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(100138/*常规*/)}</span>
					{getOne.status == 1?<span onClick={this.props.commitClick}><i className={'foddingicon fooding-submit'} title={i18n.t(100472/*提交*/)}></i></span>:''}
					{getOne.status == 1?<span onClick={this.props.deleteClick}><i className={'foddingicon fooding-close-all'} title={i18n.t(100437/*删除*/)}></i></span>:''}
					{getOne.status == 1?<span onClick={this.props.editClick}><i className={'foddingicon fooding-Edit'} title={i18n.t(100439/*编辑*/)}></i></span>:''}
					{<span onClick={this.props.shenpiClick}><i className={'foddingicon fooding-approve'} title={i18n.t(100470/*查看审批*/)}></i></span>}
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400048/*单据编号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.no}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.statusName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOne.billDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400008/*销售单号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.saleNo}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(100311/*客户*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{getOne["salBe"+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(100284/*币种*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{getOne["cny"+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(100133/*支付条款*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{getOne["payTrm"+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(100376/*交易条款*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{getOne["incotm"+language]}</p>
								</div>
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(400116/*调整原因*/)}</label>
							<div className={'col-md-10 col-lg-10'}>
								<p className={'paragraph'}>{getOne["adjustCause"]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100297/*起运港*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["sStatn"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100298/*目的港*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["eStatn"+language]}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
