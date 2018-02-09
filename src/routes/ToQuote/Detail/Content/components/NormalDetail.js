import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
import Dialog from '../../../../../components/Dialog/Dialog';//弹层
 import Tooltip from '../../../../../components/Tip';
 import SpecTextCard from "../../../../Product/List/SpecText/SpecText";
// ajax
import {permissionsBtn, apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../../../services/apiCall';
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
		if(data.status ==1){
						common = (
								<div className={'addnormal-title'}>
									<span  >{i18n.t(100138/*常规*/)}</span>
									

									{ permissionsBtn('purquotation.submit') ? <span onClick={this.props.saveClick} title={i18n.t(100472/*提交*/)}><i className={'foddingicon fooding-submit'}></i></span> : ''}
									{ permissionsBtn('purquotation.del') ? <span onClick={this.props.deleteClick} title={i18n.t(100437/*删除*/)}><i className={'foddingicon fooding-delete_icon2'}></i></span> : ''}
									{ permissionsBtn('purquotation.edit') ? <span onClick={this.props.EditClick} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-Edit'}></i></span> : ''}
									{ permissionsBtn('purquotation.fob') ? <span onClick={this.props.FOBClick} title={i18n.t(201011/*计算FOB价*/)}><i className={'foddingicon fooding-fob'}></i></span> : ''}

									
								</div>
								)
				}if(data.status ==10){
						common = (
								<div className={'addnormal-title'}>
									<span  >{i18n.t(100138/*常规*/)}</span>
									{ permissionsBtn('purquotation.release') ? <span onClick={this.props.fabuClick} title={i18n.t(100462/*发布*/)}><i className={'foddingicon fooding-relese'}></i></span> : ''}
									{ permissionsBtn('purquotation.tovoid') ? <span onClick={this.props.cancalClick} title={i18n.t(100471/*作废*/)}><i className={'foddingicon fooding-cancal'} ></i></span> : ''}
									{ permissionsBtn('purquotation.fob') ? <span onClick={this.props.FOBClick} title={i18n.t(201011/*计算FOB价*/)}><i className={'foddingicon fooding-fob'}></i></span> : ''}

									
								</div>
								)
				}else if(data.status == 35){
						 common = (
									<div className={'addnormal-title'}>
										<span  >{i18n.t(100138/*常规*/)}</span>
										{ permissionsBtn('purquotation.tovoid') ? <span onClick={this.props.cancalClick} title={i18n.t(100471/*作废*/)}><i className={'foddingicon fooding-cancal'} ></i></span> : ''}
									</div>
								)
				}
		const commonForm = this.state.dilogTelmp;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				{common}
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400048/*单据编号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data.no || ''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(data.billDate || '').Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data.statusName || ''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500125/*货币*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data["cny"+language]?data["cny"+language]:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(100379/*产品*/)}</label>
								<div className={'col-md-9 col-lg-8'}>
									<p className={'paragraph'}>{data["mtl"+language]?data["mtl"+language]:''}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(100382/*产品规格*/)}</label>

								<div className={'col-md-8 col-lg-8'}>
									<Tooltip placement="top" overlay={<div style={{color:'#fff',backgroundColor:'#756464'}}>{data.basSpeci}</div>} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}><p className={'paragraph text-ellipsis'}>{data.basSpeci}</p></Tooltip>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>HSCODE</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{data.hsCode || ''}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(400012/*品牌*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{data["brand"+language]?data["brand"+language]:''}</p>
								</div>
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100312/*供应商*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data["vndBe"+language]?data["vndBe"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(201007/*供方联系人*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data["linker"+language]?data["linker"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(201008/*供应品号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data.beMtlCode || ''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400097/*价格条款*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data["purIncotm"+language]?data["purIncotm"+language]:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500067/*包装*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data["packag"+language]?data["packag"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(300032/*交货期(天)*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data.delDates || ''}</p>
							</div>
						</div>
						
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100156/*港口类型*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data?data.statnTyEnName:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100297/*起运港*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data["sStatn"+language]?data["sStatn"+language]:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100286/*生效日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(data.sDate || '').Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100287/*失效日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(data.eDate || '').Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100419/*默认箱型*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data["contnrType"+language]?data["contnrType"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400035/*产品单位*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data['uom'+language]?data['uom'+language]:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200951/*整柜价*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{toDecimal(data.fclPrice) || ''}</p>
							</div>
						</div>
						<div className={data.fobPrice?"form-group col-md-3 col-lg-3":'none'}>
							<label className={'col-md-4 col-lg-4'}>FOB价</label>
							<div className={'col-md-8 col-lg-8'}>
                                <p className={'paragraph'}>{toDecimal(data.fobMtPrice)}</p>
							</div>
						</div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(500343/*直销价*/)}</label>
                            <div className={data.dsPrice?'col-md-8 col-lg-8':'none'}>
                                <p className={'paragraph'}>{toDecimal(data.dsPrice)}&nbsp;&nbsp;USD</p>
                            </div>
                        </div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
