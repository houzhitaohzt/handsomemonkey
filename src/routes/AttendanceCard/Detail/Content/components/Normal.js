import React, { Component } from 'react';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
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
        let getOne = this.props.getOne;
        getOne = getOne || '';
        let common ;
        if(getOne.status && getOne.status ==5){
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                    {<span onClick={this.props.delClick} title={i18n.t(100437/*删除*/)}><i className={'foddingicon fooding-close-all'}></i></span>}
                    {<span onClick={this.props.jihuoClick} title={I18n.t(100442/*激活*/)}><i className={'foddingicon fooding-jh-icon2'}></i></span>}
                    {<span onClick={this.props.alterClick} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-airing-edit'}></i></span>}

                </div>
            )
        }else if(getOne.status && getOne.status ==10){
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                    {<span onClick={this.props.shixiaoClick} title={I18n.t(100441/*失效*/)}><i className={'foddingicon fooding-shixiao'}></i></span>}
                    {<span onClick={this.props.alterClick} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-airing-edit'}></i></span>}
                </div>
            )
        }else if(getOne.status && getOne.status==20){
            common = (
                <div className={'addnormal-title'}>
                    <span  >{I18n.t(100138/*常规*/)}</span>
                    {<span onClick={this.props.jihuoClick} title={I18n.t(100442/*激活*/)}><i className={'foddingicon fooding-jh-icon2'}></i></span>}
                    {<span onClick={this.props.alterClick} title={i18n.t(100439/*编辑*/)}><i className={'foddingicon fooding-airing-edit'}></i></span>}
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
							<label className={'col-md-4'}>{i18n.t(100243/*集团*/)}</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{getOne.cluster? getOne.cluster.localName:''}</p>
							</div>
						</div>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4'}>{i18n.t(100244/*企业*/)}</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph text-ellipsis'}>{getOne.company ? getOne.company.localName:''}</p>
                            </div>
                        </div>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>职员名称</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{getOne.employeeName ? getOne.employeeName:''}</p>
							</div>
						</div>
						<div className="form-group col-md-3">
							<label className={'col-md-4'}>所属部门</label>
							<div className={'col-md-8'}>
								<p className={'paragraph'}>{getOne.depmnt ?getOne.depmnt.localName :''}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-3">
								<label className={'col-md-4'}>职位</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{getOne.positionName ?getOne.positionName :''}</p>
								</div>
							</div>
							<div className="form-group col-md-3">
								<label className={'col-md-4'}>在职状态</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{getOne.workingStateName ?getOne.workingStateName :''}</p>
								</div>
							</div>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4'}>考勤卡号</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOne.cardNo ? getOne.cardNo:''}</p>
                            </div>
                        </div>
							<div className="form-group col-md-3">
								<label className={'col-md-4'}>生效日期</label>
								<div className={'col-md-8'}>
									<p className={'paragraph'}>{new Date(getOne['effectDate']).Format('yyyy-MM-dd')}</p>
								</div>
							</div>

					</div>
                    <div className={'row'}>
                        <div className="form-group col-md-3">
                            <label className={'col-md-4'}>描述</label>
                            <div className={'col-md-8'}>
                                <p className={'paragraph'}>{getOne.mark ? getOne.mark:''}</p>
                            </div>
                        </div>
                    </div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
