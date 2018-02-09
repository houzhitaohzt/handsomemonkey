import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../../services/apiCall';
export class DetailNormal extends Component{
	constructor(props){
		super(props);
		this.getInit = this.getInit.bind(this);
		this.state={
			data:{}
		}
	}
	getInit(){
		var that = this;
		apiGet(API_FOODING_ERP,'/lsbeport/getOne',{id:this.props.id},(response)=>{
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
		return(<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span>{i18n.t(100138/*常规*/)}</span>
					<span onClick={this.props.deleteClick}><i className={'foddingicon fooding-delete_icon2'}></i></span>
					<span onClick={this.props.EditClick}><i className={'foddingicon fooding-Edit'}></i></span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200343/*货运公司*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["lsBe"+language]?data["lsBe"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100155/*港口*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["statn"+language]?data["statn"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100244/*企业*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["cc"+language]?data["cc"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(100288/*发布日期*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{data["reDate"]?new Date(data["reDate"]).Format("yyyy-MM-dd"):''}</p>
								</div>
						</div>
					</div>
					<div className={'row'}>
								<div className="form-group col-md-3 col-lg-3">
									<label className={'col-md-3 col-lg-3'}>{i18n.t(100286/*生效日期*/)}</label>
									<div className={'col-md-9 col-lg-8'}>
										<p className={'paragraph'}>{data["sDate"]?new Date(data["sDate"]).Format("yyyy-MM-dd"):''}</p>
									</div>
								
								</div>
								<div className="form-group col-md-3 col-lg-3">
									<label className={'col-md-3 col-lg-3'}>{i18n.t(500120/*终止日期*/)}</label>
									<div className={'col-md-9 col-lg-9'}>
										<p className={'paragraph'}>{data["eDate"]?new Date(data["eDate"]).Format("yyyy-MM-dd"):''}</p>
									</div>
								</div>
							
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
