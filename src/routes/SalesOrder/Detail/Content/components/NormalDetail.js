import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
import {
    apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_ERP, API_FOODING_DS, pageSize, sizeList, language,
    hrefFunc
} from "../../../../../services/apiCall";

import { Popover, Button } from 'antd';
import {I18n} from "../../../../../lib/i18n";
import NavConnect from "../../../../../components/NavigateTabs/containers/AddContainer";
export class DetailNormal extends Component{
	constructor(props){
		super(props)

	}
    initState(){
        return {
            data:{},

        }
    }
    zhuangtaiClick=(num)=>{
		let that = this;
        apiGet(API_FOODING_ERP,'/common/findByNo',{no:num},
            (response)=>{
                that.setState({
                    data:response.data,

                });
                let {navAddTab} =that.props;
                let billId = that.state.data.billId;
				window.navTabs.open(i18n.t(100321/*商机*/)+ '(' + num + ")",`/businessOpportunity/detail/${billId}`,{id:billId},{refresh:true});
            },(errors)=>{

            });

    }

	render(){
		let {getOne} = this.props;

		// 收货企业 
		let receiveHTML = <ul className="noohle-card-text">
			<li>
				<label>{i18n.t(500046/*收货联系人*/)}</label>
				<span title={getOne["reclinkLcName"]}>{getOne["reclinkLcName"]}</span>
			</li>
			<li>
				<label>{i18n.t(200163/*收货人电话*/)}</label>
				<span title={getOne["recTel"]}>{getOne["recTel"]}</span>
			</li>
			<li>
				<label>{i18n.t(200164/*收货人传真*/)}</label>
				<span title={getOne["recFax"]}>{getOne["recFax"]}</span>
			</li>			
			<li className="break-word">
				<label>{i18n.t(200166/*收货人地址*/)}</label>
				<span title={getOne["recAddress"]}>{getOne["recAddress"]}</span>
			</li>			
		</ul>;

		// 通知企业 
		let informHTML = <ul className="noohle-card-text">
			<li>
				<label>{i18n.t(500054/*通知联系人*/)}</label>
				<span title={getOne["noticeLinkLcName"]}>{getOne["noticeLinkLcName"]}</span>
			</li>
			<li>
				<label>{i18n.t(200347/*通知人电话*/)}</label>
				<span title={getOne["noticeTel"]}>{getOne["noticeTel"]}</span>
			</li>
			<li>
				<label>{i18n.t(200348/*通知人传真*/)}</label>
				<span title={getOne["noticeFax"]}>{getOne["noticeFax"]}</span>
			</li>			
			<li className="break-word">
				<label>{i18n.t(200350/*通知人地址*/)}</label>
				<span title={getOne["noticeAddress"]}>{getOne["noticeAddress"]}</span>
			</li>			
		</ul>;

		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span>{i18n.t(500057/*商务条款*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(600243/*投保企业*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["payBusiness"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500045/*收货企业*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<Popover placement="bottom" content={receiveHTML} trigger="click">
									<p className={'paragraph'} title={getOne["revBusiness"+language]}><a href="javascript:;">{getOne["revBusiness"+language]}</a></p>
								</Popover>								
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500095/*通知企业*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<Popover placement="bottom" content={informHTML} trigger="click">
									<p className={'paragraph'} title={getOne["noticeBusiness"+language]}><a href="javascript:;">{getOne["noticeBusiness"+language]}</a></p>
								</Popover>								
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500046/*收货联系人*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["reclink"+language]}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(500054/*通知联系人*/)}</label>
								<div className={'col-md-9 col-lg-8'}>
									<p className={'paragraph'}>{getOne["noticeLink"+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200158/*客户国家*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{getOne["beCntry"+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(100376/*交易条款*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{getOne["incotm"+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(100133/*支付条款*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{getOne["payTrm"+language]}</p>
								</div>
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100224/*运输方式*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["trans"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100297/*起运港*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["sStatn"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500090/*可否转运*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.canTransportMark?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200349/*免仓期申请*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.frStorAgeApp}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500088/*装箱类型*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.packTypeName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100298/*目的港*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["eStatn"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500089/*要求装运日*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOne.ariveDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100336/*备注*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.note}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500083/*收款企业*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["receiptCc"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500086/*收款账号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["receBankAccount"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100322/*商机编号*/)}</label>
                            <div className={'col-md-8 col-lg-8'}>


                                        <a className={'paragraph aaaa link-color'} onClick={this.zhuangtaiClick.bind(this,getOne.businessNo)} >{getOne.businessNo}</a>


                            </div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500059/*买信保*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.corpMark?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</p>
							</div>
						</div>
					</div>
					<div className='row'>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100189/*信保分类*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["corpType"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200729/*信保公司*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["insBe"+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200730/*信保费率*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.corpRate}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500062/*买保险*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.pShipMark?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</p>
							</div>
						</div>
					</div>
					<div className='row'>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200731/*保险公司*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["prateBe"+language]}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default NavConnect(DetailNormal);
