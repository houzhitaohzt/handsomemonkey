import i18n from './../../../../../lib/i18n';
import React, {Component} from 'react';

export class ReceivedInformation extends Component{
	constructor(props){
		super(props)
	}
	render(){
        const {businessOne} = this.props;
		return(<div className={'addnormal'} style={{margin:'10px 0'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(200019/*收货信息*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500045/*收货企业*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
                                <p className={'paragraph'}>{businessOne.revBusinessLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500046/*收货联系人*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
                                <p className={'paragraph'}>{businessOne.reclinkLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500047/*收货电话*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
                                <p className={'paragraph'}>{businessOne.recTel}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500048/*收货传真*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
                                <p className={'paragraph'}>{businessOne.recFax}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(500049/*收货地址*/)}</label>
							<div className={'col-md-10 col-lg-10'}>
                                <p className={'paragraph'}>{businessOne.recAddress}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  ReceivedInformation;
