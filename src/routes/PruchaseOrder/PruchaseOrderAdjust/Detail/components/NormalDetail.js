import React, {Component,PropTypes} from "react";
import {permissionsBtn,toDecimal} from '../../../../../services/apiCall';
import { I18n } from '../../../../../lib/i18n';
class NormalDetail extends Component{
	constructor(props){
		super(props)
	}
	render(){
		const { valueone = {} } = this.props;;
		let eidtDom,deleteDom,submitClickDom;
		if(valueone.status === 1){ 
			//表示状态已经提交了
			eidtDom = (permissionsBtn('porder.edit') ? <span onClick={this.props.editClick} title={I18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-alter_icon2'}></i></span> : '');
			deleteDom =(permissionsBtn('porder.del') ? <span onClick={this.props.deleteClick} title={I18n.t(100437/*删除*/)}><i className={'foddingicon fooding-delete-icon4'}></i></span> : '');
			submitClickDom = (permissionsBtn('porder.submit') ? <span onClick={this.props.submitClick} title={I18n.t(100472/*提交*/)}><i className={'foddingicon fooding-submit'}></i></span> : '');
		}else if(valueone.status === 10){
			eidtDom = (permissionsBtn('porder.adjustment') ? <span onClick={this.props.adjustClick} title={I18n.t(100466/*调整*/)}><i className={'foddingicon fooding-tiaozheng'}></i></span> : '');
			deleteDom=<div></div>;
			submitClickDom=<div></div>;
		}else{
			eidtDom = <div></div>;
			deleteDom=<div></div>;
			submitClickDom=<div></div>;
		}
		return(
			<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span>{I18n.t(400083/*供应商信息*/)}</span>
					{ permissionsBtn('porder.examine') ? <span onClick={this.props.onApproveClick} title ={I18n.t(100470/*查看审批*/)}><i className="foddingicon fooding-approve"></i></span> : ''}
					{eidtDom}{deleteDom}{submitClickDom}				
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400048/*单据编号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{valueone.no || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{valueone.statusName || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{new Date(valueone.billDate || "").Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400054/*采购单号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{valueone.purNo || ""}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100312/*供应商*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{valueone.vndBeLcName || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100284/*币种*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{valueone.cnyLcName || ""}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400115/*调整金额*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{toDecimal(valueone.adjustAmt) || ""}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-12 col-lg-12">
							<label className={'col-md-1 col-lg-1'}>{I18n.t(400116/*调整原因*/)}</label>
                            <div className={'col-md-11 col-lg-11'}>
								<p className={'paragraph shengyue'}>{valueone.adjustCause || ""}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default NormalDetail;
