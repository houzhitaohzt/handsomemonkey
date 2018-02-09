// import i18n from './../../../../lib/i18n';
// import React, {Component,PropTypes} from "react";
// import Confirm from '../../../../components/Dialog/Confirm';
// import {permissionsBtn, apiGet, apiPost, apiForm, API_FOODING_ES,sourceRouter,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../services/apiCall";
// import ServiceTips from '../../../../components/ServiceTips';
// import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';


// 页面作废
export class PANormal extends Component{
	constructor(props){
		super(props)
		this.state=this.initState()
		this.commitClick = this.commitClick.bind(this);
		this.upDate = this.upDate.bind(this);
		this.linkClick = this.linkClick.bind(this);
	}
	initState(){
		return {
		}
	}
	upDate(){
		let that = this;
		let {getOne} = this.props;
    	Confirm(i18n.t(200855/*您确定要更新日期*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/paymentapplcat/updateDate",{billId:getOne.billId},response => {
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
	linkClick(){
		let that = this;
		let {getOne,navAddTab} = this.props;
		let obj =sourceRouter(getOne.sourceType);
		navAddTab({name:obj.name,component:obj.name,url:obj.url});
		that.props.router.push({ pathname:obj.url,query:{id:getOne.sourceId}
		});
	}
	commitClick(){
		let that = this;
		let {getOne} = this.props;
    	Confirm(i18n.t(200736/*您确定要提交吗*/), {
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
					{ permissionsBtn('payrequest.del')&& getOne.status == 1 ? <span onClick={this.props.deleteClick} title={i18n.t(100437/*删除*/)} ><i className={'foddingicon fooding-delete-icon4'}></i></span> : ''}
					{ permissionsBtn('payrequest.submit') && getOne.status == 1? <span onClick={this.commitClick}  title={i18n.t(100472/*提交*/)} className ={getOne.status ==1?'':'none'}><i className={'foddingicon fooding-submit'}></i></span> : ''}
					{ permissionsBtn('payrequest.edit')&& getOne.status == 1 ? <span onClick={this.props.EditClick} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-alter_icon2'}></i></span> : ''}
					{ permissionsBtn('payrequest.examine') ? <span onClick={this.props.shenpiClick} title={i18n.t(100470/*查看审批*/)}><i className={'foddingicon fooding-approve'}></i></span> : ''}
					{ (getOne.status == 10 && permissionsBtn('payrequest.revoke')) ? <span onClick={this.props.chexiaoClick} title={i18n.t(500149/*撤销*/)}><i className={'foddingicon fooding-cancal'}></i></span> : ''}
				</div>
				<div className={'businessdetailnormal-content girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400048/*单据编号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph  '}>{getOne.no}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph  '}>{new Date(getOne.billDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph  '}>{getOne.statusName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500125/*货币*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph  '}>
                                    {getOne["cny"+language]}
								</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500146/*源单类型*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph  '}>
                                    {getOne.sourceTypeName}
								</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500129/*源单编号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								{(getOne.sourceType==500 || getOne.sourceType == 338 || getOne.sourceType == 449)? <a className={'paragraph   link-color'} onClick={this.linkClick}>{getOne.sourceNo}</a>:<p className="paragraph shengyue">{getOne.sourceNo}</p>}
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200841/*申请付款金额*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph  '}>{getOne.orderAmt}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200817/*申请人*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph  '}>{getOne["payStaff"+language]}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400084/*收款单位*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph  '}>{getOne["receiptBe"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100133/*支付条款*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph  '}>{getOne["payTrm"+language]}</p>
							</div>
						</div>
                        <div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500063/*付款方式*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph  '}>{getOne["payTrmTy"+language]}</p>
							</div>
						</div>
					</div>
                    <div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500050/*付款企业*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph  '}>{getOne["payCc"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200856/*收款人姓名*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph  '}>{getOne.receiverName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500086/*收款账号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph  '}>{getOne.receBankAccount}</p>
							</div>
						</div>
                        <div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>SWIFTCODE</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph  '}>{getOne.swiftCode}</p>
							</div>
						</div>
					</div>
                    <div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200613/*收款银行*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph  '}>{getOne["receBank"+language]}</p>
							</div>
						</div>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200822/*银行英文地址*/)}</label>
                        	<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph  '}>{getOne["bankEnAddr"]}</p>
							</div>
                        </div>


					</div>
                    <div className={'row'}>
                        <div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(200845/*款项用途*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={'paragraph  '}>{getOne.remark}</p>
                            </div>
                        </div>
						<div className="form-group col-md-3 col-lg-3">
                            <label className={'col-md-4 col-lg-4'}>{i18n.t(400055/*纸质发票号*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>
                                <p className={'paragraph  '}>{getOne.paperNo || ""}</p>
                            </div>
                        </div>
                    </div>
				</div>
			</div>
		)
	}
}

//export default NavConnect(PANormal);
