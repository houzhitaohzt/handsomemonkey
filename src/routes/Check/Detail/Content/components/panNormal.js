import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../../services/apiCall';
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
		apiGet(API_FOODING_ERP,'/stocking/getOne',{billId:this.props.id},(response)=>{
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
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(100138/*常规*/)}</span>
					<span onClick={this.props.backClick} title={i18n.t(100431/*返回*/)}><i className={'foddingicon fooding-back'}></i></span>
					<span onClick={this.props.saveClick} title={i18n.t(100430/*保存*/)}><i className={'foddingicon fooding-save'}></i></span>
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
								<p className={'paragraph'}>{data?data.statusName:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400145/*职员*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data?data['staff'+language]:''}</p>
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
								<label className={'col-md-3 col-lg-3'}>{i18n.t(400025/*仓库*/)}</label>
								<div className={'col-md-9 col-lg-9'}>
									<p className={'paragraph'}>{data["sl"+language]?data["sl"+language]:''}</p>
								</div>
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400026/*库区*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["st"+language]?data["st"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400027/*储位*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["slsp"+language]?data["slsp"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100379/*产品*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["mtl"+language]?data["mtl"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(500125/*货币*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["purCny"+language]?data["purCny"+language]:''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400012/*品牌*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["brand"+language]?data["brand"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400028/*原供应商*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["vndBe"+language]?data["vndBe"+language]:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400030/*物料状态*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{data["mStats"+language]?data["mStats"+language]:''}</p>
							</div>
						</div>
					</div>
					
				</div>
			</div>)
	}
}

export default  DetailNormal;
