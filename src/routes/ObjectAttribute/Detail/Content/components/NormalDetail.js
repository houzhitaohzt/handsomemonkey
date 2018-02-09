import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';


// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,language,commonAjax,toDecimal} from '../../../../../services/apiCall';


export class DetailNormal extends Component{
	constructor(props){
		super(props);

	}

	render(){
		let {getOneData} = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(100138/*常规*/)}</span>
					<span onClick={this.props.edit} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-alter_icon2'}></i></span>
					<span onClick={this.props.delete} title={i18n.t(100437/*删除*/)}><i className={'foddingicon fooding-delete-icon4'}></i></span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="col-md-3">
							<label className={'col-md-3'}>{i18n.t(100001/*名称*/)}</label>
							<div className={'col-md-9'}>
								<p className={'paragraph'}>{getOneData.name || ''}</p>
							</div>
						</div>
						<div className="col-md-3">
							<label className={'col-md-3'}>{i18n.t(600223/*所属表单*/)}</label>
							<div className={'col-md-9'}>
								<p className={'paragraph'}>{getOneData.form ? getOneData.form['localName'] : ''}</p>
							</div>
						</div>
						<div className="col-md-3">
							<label className={'col-md-3'}>{i18n.t(600224/*表单类型*/)}</label>
							<div className={'col-md-9'}>
								<p className={'paragraph'}>{getOneData.formObjectType ? getOneData.formObjectType['name'] : ''}</p>
							</div>
						</div>
						<div className="col-md-3">
							<label className={'col-md-3'}>{i18n.t(200886/*表单标识*/)}</label>
							<div className={'col-md-9'}>
								<p className={'paragraph'}>{getOneData.formIdentity || ''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="col-md-9">
							<label className={'col-md-1'}>{i18n.t(600225/*数据接口*/)}</label>
							<div className={'col-md-9'}>
								<p className={'paragraph'}>{getOneData.url || ''}</p>
							</div>
						</div>
						<div className="col-md-3">
							<label className={'col-md-3'}>{i18n.t(200747/*所属系统*/)}</label>
							<div className={'col-md-9'}>
								<p className={'paragraph'}>{getOneData.module ? getOneData.module['name'] : ''}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
