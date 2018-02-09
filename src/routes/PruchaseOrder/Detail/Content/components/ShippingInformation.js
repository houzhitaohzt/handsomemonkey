import React, { Component } from 'react';
import { I18n } from '../../../../../lib/i18n';
export class ShippingInformation extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {purorderData = {} } = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{I18n.t(400110/*装运信息*/)}</span>
				</div>
				<div className={'girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400111/*发货方式*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{purorderData.shipTypeName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400112/*发货方*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{purorderData.sendBeLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100547/*地址类型*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{purorderData.arrPlaceTypeName}</p>
							</div>
						</div>
						{
							purorderData.arrPlaceType === 10? (<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(400014/*送达港口*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{purorderData.statnLcName}</p>
								</div>
							</div>)
							:
							(<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{I18n.t(400038/*送达仓库*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{purorderData.receSlLcName}</p>
								</div>
							</div>)
						}
						
						
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(500087/*装运要求*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{purorderData.shipmentReq}</p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{I18n.t(400114/*送达地址*/)}</label>
							<div className={'col-md-10 col-lg-10'}>
								<p className={'paragraph'}>{purorderData.receAdress}</p>
							</div>
						</div>
					</div>		
				</div>
			</div>)
	}
}

export default  ShippingInformation;
