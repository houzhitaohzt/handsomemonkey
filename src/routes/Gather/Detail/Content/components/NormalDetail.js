import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
import {permissionsBtn, apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../../../services/apiCall';
 import Tooltip from '../../../../../components/Tip';
export class DetailNormal extends Component{
	constructor(props){
		super(props);
		this.state={
		}
		
	}
	componentDidMount(){
    }
	render(){
		let data = this.props.data;
		let common ;
		if(data.adjustAmt){
			common = (
								<div className={'addnormal-title'}>
									<span  >{i18n.t(100138/*常规*/)}</span>
									{ permissionsBtn('receipt.adjustment') ? <span onClick={this.props.tiaozhengClick}><i className={'foddingicon fooding-tiaozheng'} title={i18n.t(100469/*订单调整*/)}></i></span> : ''}
								</div>
					)
		}else if(data.statusName ==i18n.t(200616/*未处理*/)){
						common = (
								<div className={'addnormal-title'}>
									<span  >{i18n.t(100138/*常规*/)}</span>
									{ permissionsBtn('receipt.record') ? <span onClick={this.props.collenctionClick}  title={i18n.t(200599/*收款记录*/)}><i className={'foddingicon fooding-collenction'}></i></span> : ''}
				
									{ permissionsBtn('receipt.singlenode') ? <span onClick={this.props.handleClick} title={i18n.t(200617/*结单*/)}><i className={'foddingicon fooding-handle'}></i></span> : ''}
									
									{ permissionsBtn('receipt.edit') ? <span onClick={this.props.EditClick} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-Edit'} ></i></span> : ''}
									
									<span onClick={this.props.hexiaoClick}><i className={'foddingicon fooding-charge'} title={i18n.t(200597/*核销*/)}></i></span>
					                <span onClick={this.props.approveClick}><i className={'foddingicon fooding-lookover'} title={i18n.t(200618/*查看发票核销*/)}></i></span>
								</div>
								)
				}else if(data.statusName == i18n.t(200619/*已处理*/)){
						 common = (
									<div className={'addnormal-title'}>
										<span  >{i18n.t(100138/*常规*/)}</span>
										{ permissionsBtn('receipt.record') ? <span onClick={this.props.collenctionClick} title={i18n.t(200599/*收款记录*/)}><i className={'foddingicon fooding-collenction'} ></i></span> : ''}
										{ permissionsBtn('receipt.singlenode') ? <span onClick={this.props.guanbiClick} title={i18n.t(200379/*反结单*/)}><i className={'foddingicon fooding-close-two'} ></i></span> : ''}
										<span onClick={this.props.hexiaoClick}><i className={'foddingicon fooding-charge'} title={i18n.t(200597/*核销*/)}></i></span>
					                    <span onClick={this.props.approveClick}><i className={'foddingicon fooding-lookover'} title={i18n.t(200618/*查看发票核销*/)}></i></span>
									</div>
								)
				}else{
							common = (
									<div className={'addnormal-title'}>
										<span  >{i18n.t(100138/*常规*/)}</span>
										
										{ permissionsBtn('receipt.record') ? <span onClick={this.props.collenctionClick} title={i18n.t(200599/*收款记录*/)}><i className={'foddingicon fooding-collenction'} ></i></span> : ''}
										{ permissionsBtn('receipt.singlenode') ? <span onClick={this.props.handleClick} title={i18n.t(200617/*结单*/)}><i className={'foddingicon fooding-handle'}></i></span> : ''}
										<span onClick={this.props.hexiaoClick}><i className={'foddingicon fooding-charge'} title={i18n.t(200597/*核销*/)}></i></span>
					                    <span onClick={this.props.approveClick}><i className={'foddingicon fooding-lookover'} title={i18n.t(200618/*查看发票核销*/)}></i></span>
										
									</div>
								)
		}
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
								<p className={'paragraph'}>{new Date(data.billDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data.statusName || ''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100284/*币种*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["cny"+language]?data["cny"+language]:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500129/*源单编号*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data.sourceNo || ''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200620/*付款公司*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph text-ellipsis'}>{data["payBusiness"+language]?data["payBusiness"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100133/*支付条款*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								
								<Tooltip placement="top" overlay={<div style={{color:'black',backgroundColor:'#c5c5c5'}}>{data["payTrm"+language]?data["payTrm"+language]:''}</div>} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}><p className={'paragraph text-ellipsis'}>{data["payTrm"+language]?data["payTrm"+language]:''}</p></Tooltip>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500083/*收款企业*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["receiptCc"+language]?data["receiptCc"+language]:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100311/*客户*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["salBe"+language]?data["salBe"+language]:''}</p>
							</div>
						</div>
						<div className={data.orderAmt?"form-group col-md-3 col-lg-3":'none'}>
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500038/*订单金额*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{toDecimal(data.orderAmt) || ''}</p>
							</div>
						</div>
						<div className={data.receAmt?"form-group col-md-3 col-lg-3":'none'}>
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200621/*实收金额*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{toDecimal(data.receAmt)}</p>
							</div>
						</div>
						<div className={data.adjustAmt?"form-group col-md-3 col-lg-3":'none'}>
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400115/*调整金额*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{toDecimal(data.adjustAmt)}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
