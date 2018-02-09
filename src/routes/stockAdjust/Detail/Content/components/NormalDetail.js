import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../../services/apiCall';
export class DetailNormal extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let data = this.props.data;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
				<span  >{i18n.t(100138/*常规*/)}</span>
				</div>
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
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200080/*类型*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data.type == 1?i18n.t(201259/*增加*/):i18n.t(201260/*减少*/)}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(500143/*集团组织*/)}</label>
								<div className={'col-md-9 col-lg-8'}>
									<p className={'paragraph'}>{data["cluster"+language]?data["cluster"+language]:''}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(100244/*企业*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{data["cc"+language]?data["cc"+language]:''}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(500144/*营运组织*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{data["plant"+language]?data["plant"+language]:''}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(400145/*职员*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{data.staffLcName || ''}</p>
								</div>
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400025/*仓库*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["sl"+language]?data["sl"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500131/*事物类型*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["stOpe"+language]?data["stOpe"+language]:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-9 col-lg-9">
							<label className={'col-md-1 col-lg-1'}>{i18n.t(200910/*原因*/)}</label>
							<div className={'col-md-11 col-lg-11'}>
								<p className={'paragraph'}>{data.reason || ''}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
