import React, { Component } from 'react';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../../services/apiCall';
import {I18n} from '../../../../../lib/i18n';
export class DetailNormal extends Component{
	constructor(props){
		super(props)
		this.getInit = this.getInit.bind(this);
		this.state={
			data:{}
		}
	}
	getInit(){
		var that = this;
		apiGet(API_FOODING_ERP,'/noticestock/getOne',{billId:this.props.id},(response)=>{
			that.setState({
				data:response.data
			})
		},(error)=>{

		})
	}
	componentDidMount(){
		this.getInit();
    }
	render(){
		let data = this.state.data;
		return(<div className={'addnormal'} style={{marginTop:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{I18n.t(100140/*组织*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(500143/*集团组织*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["cluster"+language]?data["cluster"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(100244/*企业*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["cc"+language]?data["cc"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{I18n.t(500144/*营运组织*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["plant"+language]?data["plant"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400145/*职员*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{data["staff"+language]?data["staff"+language]:''}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
