import React, { Component } from 'react';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
 import Tooltip from '../../../../../components/Tip';
 import {I18n} from "../../../../../lib/i18n"; 
 import i18n from './../../../../../lib/i18n';
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
		apiGet(API_FOODING_DS,'/payTrm/getDetail',{id:this.props.id},(response)=>{
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
					<span>{I18n.t(100138/*常规*/)}</span>
					<span onClick={this.props.alterClick} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-alter'}></i></span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{I18n.t(100000/*代码*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{data.payTrm ? data.payTrm.code:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{I18n.t(100001/*名称*/)}</label>
							<div className={'col-md-8'}>
								<Tooltip placement="top" overlay={<div style={{color:'black',backgroundColor:'#ccc'}}>{data.payTrm ? data.payTrm.localName:''}</div>} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}><p className={'paragraph text-ellipsis'}>{data.payTrm ? data.payTrm.localName:''}</p></Tooltip>
							</div>
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{I18n.t(100193/*支付条款分组*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{data.payTrm ? data.payTrm.payTagType.name:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{I18n.t(100190/*信保标识*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{data.payTrm ? (data.payTrm.crdPrMark?I18n.t(100141/*是*/) : I18n.t(100142/*否*/)):''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-3">
								<label className={'col-md-4'}>{I18n.t(100189/*信保分类*/)}</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{data.payTrm ? data.payTrm.corpType.name:''}</p>
								</div>
							</div>
							<div className="form-group col-md-3">
								<label className={'col-md-4'}>{I18n.t(100191/*信保天数*/)}</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{data.payTrm ? data.payTrm.limtDays:''}</p>
								</div>
							</div>
							<div className="form-group col-md-3">
								<label className={'col-md-4'}>{I18n.t(100192/*投保比例*/)}</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{data.payTrm ? data.payTrm.insurePercent:''}</p>
								</div>
							</div>
							<div className="form-group col-md-3">
								<label className={'col-md-4'}>{I18n.t(600237/*银行通知费*/)}</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{data.payTrm ? (data.payTrm.bankNoticeFee ? I18n.t(100141/*是*/):I18n.t(100142/*否*/) ):''}</p>
								</div>
							</div>							
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
