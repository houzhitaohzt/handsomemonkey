import React, { Component } from 'react';
import {
    apiGet, apiPost, apiForm, API_FOODING_DS, language, pageSize, sizeList,
    permissionsBtn
} from '../../../../../services/apiCall';
 import Tooltip from '../../../../../components/Tip';
 import {I18n} from "../../../../../lib/i18n"; 
 import i18n from './../../../../../lib/i18n';
export class DetailNormal extends Component{
	constructor(props){
		super(props)
		this.state={
			data:{}
		}
	}
	render(){
        //{ permissionsBtn('businessregistration.print') ? <span onClick={this.props.dayinClick} title={i18n.t(201307/*打印*/)}><i className={'foddingicon fooding-print'}></i></span> : '' }
        let {Data,getOneData} = this.props;
        getOneData = getOneData || '';
        getOneData.users = getOneData.users || [];
        let common ;
        if(getOneData.status ==1){//草稿
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                    { permissionsBtn('businessregistration.del') ? <span onClick={this.props.delClick} title={i18n.t(100437/*删除*/)}><i className={'foddingicon fooding-close-all'}></i></span> : '' }
                    { permissionsBtn('businessregistration.submit') ? <span onClick={this.props.submitClick} title={i18n.t(100472/*提交*/)}><i className={'foddingicon fooding-submit'}></i></span> : '' }
                    { permissionsBtn('businessregistration.copy')  ?  <span onClick={this.props.copyClick} title={i18n.t(100452/*复制*/)}><i className={'foddingicon fooding-copy-last'}></i></span>:''}
                    { permissionsBtn('businessregistration.edit') ?  <span onClick={this.props.alterClick} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-Edit'}></i></span> : '' }

                </div>
            )
        }else if(getOneData.status == 10){//已审批
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                    { permissionsBtn('businessregistration.reimbursement') ? <span onClick={this.props.baoxiaoClick} title={I18n.t(600079/*报销单*/)}><i className={'foddingicon fooding-Expense'}></i></span> : '' }
                    { permissionsBtn('businessregistration.approve') ? <span title ={i18n.t(100470/*查看审批*/)} onClick={this.props.onApproveClick}><i className="foddingicon fooding-approve"></i></span> : '' }
                    { permissionsBtn('businessregistration.copy') ? <span onClick={this.props.copyClick} title={i18n.t(100452/*复制*/)}><i className={'foddingicon fooding-copy-last'}></i></span>:''}
                </div>
            )
        }else if(getOneData.status == 5){//提交
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                    { permissionsBtn('businessregistration.approve') ? <span title ={i18n.t(100470/*查看审批*/)} onClick={this.props.onApproveClick}><i className="foddingicon fooding-approve"></i></span> : '' }
                    { permissionsBtn('businessregistration.copy') ? <span onClick={this.props.copyClick} title={i18n.t(100452/*复制*/)}><i className={'foddingicon fooding-copy-last'}></i></span>:''}
                </div>
            )
        }else{
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                </div>
            )
        }
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
            {common}
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{I18n.t(400048/*单据编号*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{getOneData?getOneData.no:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{i18n.t(700076/*日期*/)}</label>
							<div className={'col-md-8'}>
                                <p className={'paragraph'}>{new Date(getOneData['billDate']).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{i18n.t(700074/*状态*/)}</label>
							<div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOneData.statusName}</p>
							</div>
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>{i18n.t(100244/*企业*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{getOneData.ccLcName}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-3">
								<label className={'col-md-4'}>{i18n.t(100238/*部门*/)}</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{getOneData.depmntLcName}</p>
								</div>
							</div>
							<div className="form-group col-md-3">
								<label className={'col-md-4'}>{I18n.t(500358/*登记人*/)}</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{getOneData.registerLcName}</p>
								</div>
							</div>
							<div className="form-group col-md-6">
								<label className={'col-md-2'}>{I18n.t(500369/*随行人员*/)}</label>
								<div className={'col-md-10'}>
                                    <p className={'paragraph'}>
                                    {
                                        getOneData.users.map((e,i)=>{
                                            return e && e.staffLocalName?(e.staffLocalName + " "):''
                                        })
                                    }
                                    </p>
								</div>
							</div>

					</div>
                    <div className={'row'}>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4'}>{I18n.t(500419/*目的地*/)}</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOneData?getOneData.destination:''}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4'}>{I18n.t(500420/*出差类型*/)}</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOneData.evectionTypeName?getOneData.evectionTypeName.name:''}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4'}>{I18n.t(100305/*开始时间*/)}</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOneData['startDate']?new Date(getOneData['startDate']).Format("yyyy-MM-dd hh:mm:ss"):''}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4'}>{I18n.t(100306/*结束时间*/)}</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOneData['endDate']?new Date(getOneData['endDate']).Format("yyyy-MM-dd hh:mm:ss"):''}</p>
                            </div>
                        </div>
					</div>
                    <div className={'row'}>
						<div className="form-group col-md-6">
                            <label className={'col-md-2'}>{I18n.t(500360/*事由*/)}</label>
                            <div className={'col-md-10'}>
                                <p className={'paragraph'}>{getOneData?getOneData.reason:''}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4'}>{I18n.t(500370/*交通工具*/)}</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOneData.vehicleType?getOneData.vehicleType.name:''}</p>
                            </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4'}>{I18n.t(100284/*币种*/)}</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOneData?getOneData.currencyLcName:''}</p>
                            </div>
                        </div>
                    </div>
					<div className={'row'}>
                        <div className="form-group col-md-6">
                            <label className={'col-md-2'}>{I18n.t(100326/*总金额*/)}</label>
                            <div className={'col-md-10'}>
                                <p className={'paragraph'}>{getOneData?getOneData.totalAmt:''}</p>
                            </div>
                        </div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
