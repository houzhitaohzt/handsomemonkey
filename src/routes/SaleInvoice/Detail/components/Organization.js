import i18n from './../../../../lib/i18n';
import React, { Component } from 'react';
import {language} from '../../../../services/apiCall';
export class Organization extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {valueone = {} } = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(100140/*组织*/)}</span>
				</div>
				<div className={' '}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100243/*集团*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph shengyue'}>{valueone.clusterLcName || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100486/*公司*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph shengyue'}>{valueone.ccLcName || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200119/*销售组织*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone["sor"+language] || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400011/*销售员*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone["saleStaff"+language] || ""}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  Organization;
