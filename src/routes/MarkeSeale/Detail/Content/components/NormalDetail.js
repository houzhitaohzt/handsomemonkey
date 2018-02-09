import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../../services/apiCall";
export class DetailNormal extends Component{
	constructor(props){
		super(props)
	}
	render(){
		let {getOne} = this.props;

		switch(getOne["timeType"]){
			case 1 :
				var timeType = i18n.t(200519/*天*/);
			break;
			case 2 :
				var timeType = i18n.t(400150/*周*/);
			break;			
			case 3 :
				var timeType = i18n.t(400149/*月*/);
			break;			
			case 4 :
				var timeType = i18n.t(200691/*年*/);
			break;			
		}

		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(100138/*常规*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400048/*单据编号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["no"]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOne['billDate']).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["statusName"]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(500125/*货币*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["cny"+language]}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200686/*活动类型*/)}</label>
								<div className={'col-md-9 col-lg-8'}>
									<p className={'paragraph'}>{getOne["markActvTy"+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200243/*活动名称*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{getOne["markActvName"]}</p>
								</div>
							</div>
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200687/*拟定开始日*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{new Date(getOne['predictSDate']).Format('yyyy-MM-dd')}</p>
								</div>
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200688/*活动性质*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["marketNatureName"]}</p>
							</div>
						</div>
						{ getOne['marketNature'] == 20 ?
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200291/*周期*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{getOne["timeNum"]}</p>
								</div>
							</div>	
							:
							''					
						}
						{ getOne['marketNature'] == 20 ?
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200690/*周期类型*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{timeType}</p>
								</div>
							</div>
							:
							''
						}

						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200692/*拟定结束日*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOne['predictEDate']).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200693/*主办单位*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne['exhibitionBe'+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200694/*展会联系人*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["exhibLinkLcName"]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200695/*展会号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["exhibitionNo"]}</p>
							</div>
						</div>
						{ getOne['marketNature'] != 10 ? 
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200696/*下次时间*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p className={'paragraph'}>{new Date(getOne['nextTime']).Format('yyyy-MM-dd')}</p>
								</div>
							</div>
							:
							''
						}
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200697/*展会所在国家*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne['exhibitionCntry'+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200698/*展会所在城市*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne['exhibitionCity'+language]}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200734/*分配的运算*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["budgetCost"]}</p>
							</div>
						</div>
					</div>					
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(100250/*详细地址*/)}</label>
							<div className={'col-md-10 col-lg-10'}>
								<p className={'paragraph'} title={getOne["address"]}>{getOne["address"]}</p>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(100336/*备注*/)}</label>
							<div className={'col-md-10 col-lg-10'}>
								<p className={'paragraph'} title={getOne["actCont"]}>{getOne["actCont"]}</p>
							</div>
						</div>						
					</div>									
				</div>
			</div>)
	}
}

export default  DetailNormal;
