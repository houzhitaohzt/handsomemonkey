import i18n from './../../../../lib/i18n';
import React, { Component } from 'react';
import {language} from "../../../../services/apiCall";
import {permissionsBtn,toDecimal} from '../../../../services/apiCall';
export class DetailNormal extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {valueone = {}} = this.props,paymentDom=(<a></a>),outputDom=(<a></a>),submitDom=(<a></a>),approveDom=(<a></a>);
		if(valueone.status == 1){//草稿
			submitDom = permissionsBtn('saleinvoice.commit')?(<span onClick={this.props.submitClick} title={i18n.t(100472/*提交*/)}><i className={'foddingicon fooding-submit'}></i></span>):"";
			approveDom=(permissionsBtn('saleinvoice.examine')?<span title ={i18n.t(100470/*查看审批*/)} onClick={this.props.onApproveClick}><i className="foddingicon fooding-approve"></i></span>:'')
		}else if(valueone.status == 5){
			approveDom=(permissionsBtn('saleinvoice.examine')?<span title ={i18n.t(100470/*查看审批*/)} onClick={this.props.onApproveClick}><i className="foddingicon fooding-approve"></i></span>:'')
		}else if(valueone.status == 10){
			approveDom=(permissionsBtn('saleinvoice.examine')?<span title ={i18n.t(100470/*查看审批*/)} onClick={this.props.onApproveClick}><i className="foddingicon fooding-approve"></i></span>:'')
		}

		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(100138/*常规*/)}</span>
					{submitDom}
					{approveDom}					
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200590/*销售发票号*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone["no"] || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone.billDate?new Date(valueone.billDate).Format('yyyy-MM-dd'):""}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone["statusName"] || ""}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100311/*客户*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone["salBe"+language] || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400058/*开票金额*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{toDecimal(valueone["orderAmt"]) || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100284/*币种*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone["cnyEnName"]}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200387/*销售订单号*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone["sourceNo"]}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400055/*纸质发票号*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone["paperNo"]}</p>
							</div>
						</div>
						<div className="form-group col-md-4 col-lg-4">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(400065/*开票日期*/)}</label>
							<div className={'col-md-9 col-lg-9'}>
								<p className={'paragraph'}>{valueone.makeDate?new Date(valueone.makeDate).Format('yyyy-MM-dd') : ""}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
