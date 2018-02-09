import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';

import TabSwitch from "../../../../../components/TabSwitch";
import { I18n } from '../../../../../lib/i18n';
import Dialog from '../../../../../components/Dialog/Dialog';//弹层
import {hrefFunc,getQueryString,toDecimal} from '../../../../../services/apiCall';


class ProductInformation extends Component{
	constructor(props){
		super(props)
		this.state = {
					visible: false,
					showDilaog:false,
				    dialogContent:<div></div>,
				    showHeader:true
			};
	}
	onCancel = () => {
			this.setState({
				showDilaog:false
			})
		}
	//销售订单执行情况
		zhuangtaiClick=(num)=>{
			let that = this;
			this.setState({
					showDilaog: true,
					title:i18n.t(500260/*销售订单执行情况*/),
					dialogContent: React.createElement(require('../../../../BookNeed/components/sourceNoDetail').default,{onCancel:that.onCancel,num:num})
				});
			}
	render(){
		//e.sourceType == 318 ?
		let {purorderData = {} } = this.props;
		let array = [{title:I18n.t(100379/*产品*/),content:'loading...'}];
		if(purorderData.products &&　purorderData.products.length){
			let productArr = purorderData.products;
			array = productArr.map((e,i) => {
				return ({title:I18n.t(100379/*产品*/)  + (i + 1),content:<div className={'girdlayout'}>
				{
					e.sourceNo !== null ? (<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400108/*销售合同号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
							
								{
									e.sourceType == 318 ?
									<div>
									<a href="javascript:;" className={'aaaa link-color'}  style={{padding:' 0px',margin:' 0px',display:'inline-block', marginTop: '5px',marginRight:'10px'}}onClick={this.zhuangtaiClick.bind(this,e.sourceNo)}>{e.sourceNo}</a>
									<i className="foddingicon fooding-transport-message" onClick={hrefFunc.bind(this,I18n.t(600164/*出运信息*/),`/print/single?single=messagePurchase&billId=`+e['sourceId'])} title={I18n.t(600164/*出运信息*/)}></i></div>
									:
										<p className={'paragraph'}>{e.sourceNo}</p>
										
                                }
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400011/*销售员*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.needStaffLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100297/*起运港*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.statnLcName || ""} {e.eStatnLcName?" - " + e.eStatnLcName :"" }</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100224/*运输方式*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.transLcName || ""}</p>
							</div>
						</div>
					</div>)
					:
					(<span></span>)
				}
					
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100379/*产品*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.mtlLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100382/*产品规格*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph shengyue'} title={e.basSpeci}>{e.basSpeci}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(500067/*包装*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.packagLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(500068/*托盘*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.salvrLcName}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(100319/*采购数量*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.purQty}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400035/*产品单位*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.uomLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400070/*含税价格*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{toDecimal(e.purTaxPrc)}&nbsp;&nbsp;{e.cnyLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
				<label className={'col-md-4 col-lg-4'}>{I18n.t(400109/*总价*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{toDecimal(e.setTaxAgg)}&nbsp;&nbsp;{e.cnyLcName}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400071/*交货日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(e.delDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400072/*装运日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(e.ariveDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400073/*报关方式*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.cleaTypName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>HSCODE</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.hsCode}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400075/*是否商检*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.inspcMark?I18n.t(100141/*是*/):I18n.t(100142/*否*/)}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400076/*商检单价*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{toDecimal(e.ciPrice)}&nbsp;&nbsp;{e.cnyLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400077/*境内货源地*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.domcSupply}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400012/*品牌*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.brandLcName}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400078/*清关*/) + 'HSCODE'}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.chgHsCode}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400079/*清关品名*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.changeMtlName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(400080/*产品销售员*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.vndSlinkerLcName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{I18n.t(600187/*不退税*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{e.noTax ? i18n.t(100141/*是*/) : i18n.t(100142/*否*/)}</p>
							</div>
						</div>
					</div>
				</div>})
			})
		}
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'} style={{marginBottom:'10px'}}>
					<span  >{I18n.t(400082/*产品信息*/)}</span>
				</div>
				<TabSwitch TabSwitchArray={array} />
				<Dialog width={926} visible={this.state.showDilaog} title={this.state.title} showHeader={this.state.showHeader}>
							{this.state.dialogContent}
				</Dialog>
			</div>)
	}
}
export default ProductInformation;
