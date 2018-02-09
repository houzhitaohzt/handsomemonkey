import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
export class DetailNormal extends Component{
	constructor(props){
		super(props)
	}
	render(){
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span>{i18n.t(100138/*常规*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400048/*单据编号*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>SP1702280001</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>2017-02-22</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{i18n.t(400053/*已审批*/)}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400054/*采购单号*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>PO17010600009</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(100379/*产品*/)}</label>
								<div className={'col-md-9 col-lg-8'}>
									<p className={'paragraph'}>{i18n.t(200281/*三聚磷酸钠*/)}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(400028/*原供应商*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{i18n.t(200905/*徐州福德丰食品有限公司*/)}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(400012/*品牌*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{i18n.t(200904/*福德牌*/)}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(400050/*调整数量*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>790MT</p>
								</div>
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400025/*仓库*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{i18n.t(200906/*浦东仓库*/)}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400119/*原采购单价*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>17.09 CNY</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400120/*调整后单价*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>18.09 CNY</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-9 col-lg-9">
							<label className={'col-md-1 col-lg-1'}>{i18n.t(400116/*调整原因*/)}</label>
							<div className={'col-md-11 col-lg-11'}>
								<p className={'paragraph'}></p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
