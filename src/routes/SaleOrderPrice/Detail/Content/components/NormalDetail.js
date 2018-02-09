import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
import Dialog from '../../../../../components/Dialog/Dialog';//弹层
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../../services/apiCall';
export class DetailNormal extends Component{
	constructor(props){
		super(props)
		this.state={
		}
	}
	componentDidMount(){
    }
	render(){
		let data = this.props.data;
		let common ;
		if(data.statusName ==i18n.t(300039/*草稿*/)){
						common = (
								<div className={'addnormal-title'}>
									<span  >{i18n.t(100138/*常规*/)}</span>
									<span onClick={this.props.saveClick}><i className={'foddingicon fooding-submit'}></i></span>
									<span onClick={this.props.deleteClick}><i className={'foddingicon fooding-delete_icon2'}></i></span>
									<span onClick={this.props.EditClick}><i className={'foddingicon fooding-Edit'}></i></span>
									<span onClick={this.props.FOBClick}>FOB</span>
									<span onClick={this.props.cancalClick}><i className={'foddingicon fooding-cancal'}></i></span>
								</div>
								)
				}else if(data.statusName == i18n.t(201012/*已发布*/)){
						 common = (
									<div className={'addnormal-title'}>
										<span  >{i18n.t(100138/*常规*/)}</span>
										<span onClick={this.props.cancalClick}><i className={'foddingicon fooding-cancal'}></i></span>
									</div>
								)
				}
		const commonForm = this.state.dilogTelmp;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				{common}
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400048/*单据编号*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data.no || ''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{new Date(data.billDate || '').Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data.statusName || ''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400037/*采购员*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data.purStaffLcName || ''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(100379/*产品*/)}</label>
								<div className={'col-md-9 col-lg-8'}>
									<p className={'paragraph'}>{data["mtl"+language]?data["mtl"+language]:''}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(100382/*产品规格*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{data.basSpeci || ''}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>HSCODE</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{data.hsCode || ''}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(400012/*品牌*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{data["brand"+language]?data["brand"+language]:''}</p>
								</div>
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100312/*供应商*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["vndBe"+language]?data["vndBe"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(201007/*供方联系人*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["purStaff"+language]?data["purStaff"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(201008/*供应品号*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data.beMtlCode || ''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400097/*价格条款*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["purIncotm"+language]?data["purIncotm"+language]:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500067/*包装*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["packag"+language]?data["packag"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200958/*交货期*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data.delDates || ''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500125/*货币*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["cny"+language]?data["cny"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100156/*港口类型*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data.statnTyEnName || ''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100297/*起运港*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["sStatn"+language]?data["sStatn"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100286/*生效日期*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{new Date(data.sDate || '').Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100287/*失效日期*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{new Date(data.eDate || '').Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100419/*默认箱型*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["contnrType"+language]?data["contnrType"+language]:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400035/*产品单位*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data.uomLcName || ''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200951/*整柜价*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data.fclPrice || ''}</p>
							</div>
						</div>
						<div className={data.fobPrice?"form-group col-md-3 col-lg-3":'none'}>
							<label className={'col-md-3 col-lg-3'}>FOB价</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data.fobPrice}USD</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
