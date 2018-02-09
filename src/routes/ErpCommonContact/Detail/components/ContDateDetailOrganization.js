import React, {Component, PropTypes} from 'react';
import {I18n} from "../../../../lib/i18n";
class ActivityDetailOrganization extends Component{
	constructor(props){
		super(props)
	}

	render(){
		let {commonData = {}} = this.props;
		return (<div className={'organization'}>
				<div className={'organization-title'}>
					<span className={'org'}>{I18n.t(100140/*组织*/)}</span>
				</div>
				<div className={'girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100243/*集团*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{commonData.clusterLcName || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100486/*公司*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{commonData.ccLcName || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100361/*分管人*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{commonData.responsibleOfficerLcName}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default ActivityDetailOrganization;
