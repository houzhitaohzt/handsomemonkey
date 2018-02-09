import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,
	API_FOODING_DS,pageSize,sizeList,language,permissionsBtn,toDecimal} from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
import Confirm from '../../../../../components/Dialog/Confirm';
export class DetailNormal extends Component{
	constructor(props){
		super(props);
		
	}

	render(){
		let {getOne} = this.props;
		//permissionsBtn('productpricing.del')
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(100138/*常规*/)}</span>
				    { getOne.status == 10 && permissionsBtn('productpricing.void') ? <span onClick={this.props.chukuClick} title={i18n.t(100471/*作废*/)}><i className={'foddingicon fooding-cancal'}></i></span> : ''}
					{ getOne.status == 1  && permissionsBtn('productpricing.edit')? <span onClick={this.props.Edit} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-alter_icon2'}></i></span> : ''}
					{ getOne.status == 1 && permissionsBtn('productpricing.commit')? <span onClick={this.props.commitClick} title={i18n.t(100472/*提交*/)} className ={getOne.status ==1?'':'none'}><i className={'foddingicon fooding-submit'}></i></span> : ''}
					{ getOne.status == 1 && permissionsBtn('productpricing.del')? <span onClick={this.props.deleteClick} title={i18n.t(100437/*删除*/)}><i className={'foddingicon fooding-delete-icon4'}></i></span> : ''}
					{ getOne.status == 1 && permissionsBtn('productpricing.fob')? <span onClick={this.props.FOBClick} title={i18n.t(201011/*计算FOB价*/)}><i className={'foddingicon fooding-fob'}></i></span> : ''}
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
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOne.billDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.statusName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500125/*货币*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["cny"+language]}</p>
							</div>
						</div>
					</div>
					<div className ='row'>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100379/*产品*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["mtl"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100382/*产品规格*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["basSpeci"]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>HSCODE</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["hsCode"]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400097/*价格条款*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["purIncotm"+language]}</p>
							</div>
						</div>
					</div>
					<div className='row'>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500067/*包装*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["packag"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200958/*交货期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["delDates"]?getOne["delDates"]+' '+i18n.t(200519/*天*/):''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100156/*港口类型*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["statnTy"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100297/*起运港*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["sStatn"+language]}</p>
							</div>
						</div>
					</div>
					<div className ='row'>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100286/*生效日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOne["sDate"]).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100287/*失效日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOne["eDate"]).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400035/*产品单位*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["uom"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200951/*整柜价*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{toDecimal(getOne.fclPrice)}</p>
							</div>
						</div>
					</div>
					<div className='row'>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100419/*默认箱型*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["contnrType"+language]}</p>
							</div>
						</div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(500343/*直销价*/)}</label>
                            <div className={getOne.dsPrice?'col-md-8 col-lg-8':'none'}>
                                <p className={'paragraph'}>{toDecimal(getOne.dsPrice)}&nbsp;&nbsp;USD</p>
                            </div>
                        </div>
						<div className={getOne.fobMtPrice?"form-group col-md-3 col-lg-3":'none'}>
							<label className={'col-md-4 col-lg-4'}>FOB价</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{toDecimal(getOne.fobMtPrice)}&nbsp;&nbsp;USD</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
