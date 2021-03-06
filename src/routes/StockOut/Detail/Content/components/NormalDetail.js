import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
// ajax
import {I18n} from '../../../../../lib/i18n';
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../../services/apiCall';
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
									<span  >{I18n.t(100138/*常规*/)}</span>
									{ permissionsBtn('outnotice.submit') ? <span onClick={this.props.saveClick} title={i18n.t(100472/*提交*/)}><i className={'foddingicon fooding-submit'}></i></span> : '' }
									{ permissionsBtn('outnotice.del') ? <span onClick={this.props.deleteClick} title={i18n.t(100437/*删除*/)}><i className={'foddingicon fooding-delete_icon2'}></i></span> : '' }
									{ permissionsBtn('outnotice.edit') ? <span onClick={this.props.EditClick} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-Edit'}></i></span> : '' }
									
								</div>
								)
				}else if(data.status == 10){
						 common = (
									<div className={'addnormal-title'}>
										<span  >{I18n.t(100138/*常规*/)}</span>
										{ permissionsBtn('outnotice.outstock') ? <span onClick={this.props.stockClick} title={i18n.t(500167/*出库*/)}><i className={'foddingicon fooding-stock'}></i></span> : '' }
										{ permissionsBtn('outnotice.revoke') ? <span onClick={this.props.shallClick} title={i18n.t(500149/*撤销*/)}><i className={'foddingicon fooding-shall'}></i></span>:''}
									</div>
								)
				}else{
							common = (
									<div className={'addnormal-title'}>
										<span  >{I18n.t(100138/*常规*/)}</span>
									</div>
								)
		}
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				{common}
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400048/*单据编号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data.no || ''}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(data.billDate).Format('yyyy-MM-dd') || ''}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data.statusName || ''}</p>
							</div>
						</div>
						
					</div>
					<div className={'row'}>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(400025/*仓库*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{data["sl"+language]?data["sl"+language]:''}</p>
								</div>
							</div>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500135/*三方仓*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{data.thirdMark?I18n.t(100141/*是*/):I18n.t(100142/*否*/)}</p>
								</div>
							</div>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(500136/*目的地*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{data.receAddress || ''}</p>
								</div>
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(500137/*预计入库日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(data.predictDate).Format('yyyy-MM-dd') || ''}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(500131/*事物类型*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data["stOpe"+language]?data["stOpe"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100311/*客户*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data["salBe"+language]?data["salBe"+language]:''}</p>
							</div>
						</div>
						
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100336/*备注*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data.note || ''}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(500129/*源单编号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data?data.sourceNo:''}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
