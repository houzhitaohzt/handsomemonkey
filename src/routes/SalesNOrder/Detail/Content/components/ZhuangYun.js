import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,
	API_FOODING_DS,pageSize,sizeList,language} from "../../../../../services/apiCall";
export class DetailNormal extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {getOne} = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(400110/*装运信息*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
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
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400071/*交货日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOne["delDate"]).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400111/*发货方式*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["shipTypeName"]}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400112/*发货方*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["sendBe"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100547/*地址类型*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["arrPlaceTypeName"]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400014/*送达港口*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["statn"+language]}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(500087/*装运要求*/)}</label>
							<div className={'col-md-10 col-lg-10'}>
								<p className={'paragraph'}>{getOne["shipmentReq"]}</p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(400114/*送达地址*/)}</label>
							<div className={'col-md-10 col-lg-10'}>
								<p className={'paragraph'}>{getOne["receAdress"]}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
