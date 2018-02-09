import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Confirm from '../../../../components/Dialog/Confirm';
import {permissionsBtn, apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
export class PANormal extends Component{
	constructor(props){
		super(props)
		this.commitClick = this.commitClick.bind(this);
		this.ruKuClick = this.ruKuClick.bind(this);
		this.hShoukuanClick = this.hShoukuanClick.bind(this);
	}
	hShoukuanClick(){
		let that = this;
		let {getOne} = this.props;
    	Confirm(i18n.t(201045/*您确定要执行红字收款单操作吗*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/purorderreturn/receipt",{billId:getOne.billId},response => {
				    	//刷新当前页面
				    	this.props.getOneCall();
				    	ServiceTips({text:response.message,type:"success"})
				    },error => {
				    	ServiceTips({text:error.message,type:'error'})
				    })
				},
				close:() => {
					console.log('no, close')
				}
		});
	}
	ruKuClick(){
		let that = this;
		let {getOne} = this.props;
    	Confirm(i18n.t(201046/*您确定要执行入库操作吗*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/purorderreturn/noticeIn",{billId:getOne.billId},response => {
				    	//刷新当前页面
				    	this.props.getOneCall();
				    	ServiceTips({text:response.message,type:"success"})
				    },error => {
				    	ServiceTips({text:error.message,type:'error'})
				    })
				},
				close:() => {
					console.log('no, close')
				}
		});
	}
	commitClick(){
		let that = this;
		let {getOne} = this.props;
    	Confirm(i18n.t(200369/*您确定要提交此订单吗*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/common/submitBill",{billId:getOne.billId,billType:getOne.billType},response => {
				    	//刷新当前页面
				    	this.props.getOneCall();
				    	ServiceTips({text:response.message,type:"success"})
				    },error => {
				    	ServiceTips({text:error.message,type:'error'})
				    })
				},
				close:() => {
					console.log('no, close')
				}
		});

	}	
	render(){
		let {getOne} =this.props;
		return(
			<div className={'businessdetailnormal'}>
				<div className={'addnormal-title'}>
					<span>{i18n.t(100138/*常规*/)}</span>
					{ permissionsBtn('saleorderreturn.del')&& getOne.status == 1 ? <span onClick={this.props.deleleClick}><i className={'foddingicon fooding-delete-icon4'}></i></span> : ''}
					{ permissionsBtn('saleorderreturn.receipt')&& getOne.status == 10 ? <span onClick={this.hShoukuanClick}><i className={'foddingicon fooding-collenction'}></i></span> : ''}
					{ permissionsBtn('saleorderreturn.innotice')&& getOne.status == 10 ? <span onClick={this.ruKuClick}><i className={'foddingicon fooding-put'}></i></span> : ''}
					{ permissionsBtn('saleorderreturn.commit') && getOne.status == 1? <span onClick={this.commitClick} className ={getOne.status ==1?'':'none'}><i className={'foddingicon fooding-submit'}></i></span> : ''}
				</div>
				<div className={'businessdetailnormal-content girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400122/*退货单号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{getOne.no}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{new Date(getOne.billDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{getOne.statusName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100311/*客户*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>
                                    {getOne["salBe"+language]}
								</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400123/*退货金额*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>
                                    {toDecimal(getOne.orderAmt) + getOne["cny"+language]}
								</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100284/*币种*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{getOne["cny"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100224/*运输方式*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{getOne["trans"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100297/*起运港*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{getOne["sStatn"+language]}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100298/*目的港*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{getOne["eStatn"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400099/*退货原因*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{getOne.causeName}</p>
							</div>
						</div>
                        <div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100336/*备注*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{getOne.remark}</p>
							</div>
						</div>
					</div>
                    <div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(201047/*是否海外退货*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{getOne.needSeaOut?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(201048/*是否物流*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{getOne.needLogistics?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400008/*销售单号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'}>{getOne.sourceNo}</p>
							</div>
						</div>
					</div>				
				</div>
			</div>
		)
	}
}

export default PANormal;