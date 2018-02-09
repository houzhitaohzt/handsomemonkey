import React, { Component } from 'react';
import { I18n } from '../../../../../lib/i18n';
export class Organization extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {purorderData = {} } = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{I18n.t(100140/*组织*/)}</span>
				</div>
				<div className={'girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100243/*集团*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{purorderData.clusterLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100486/*公司*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{purorderData.ccLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400036/*采购组织*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{purorderData.porLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400037/*采购员*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{purorderData.purStaffLcName}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  Organization;
