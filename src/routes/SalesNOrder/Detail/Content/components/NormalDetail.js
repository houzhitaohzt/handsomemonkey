import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,
	API_FOODING_DS,pageSize,sizeList,language,permissionsBtn} from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
import Confirm from '../../../../../components/Dialog/Confirm';
export class DetailNormal extends Component{
	constructor(props){
		super(props);
		this.commitClick = this.commitClick.bind(this);
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
		let {getOne} = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(100138/*常规*/)}</span>
				    { permissionsBtn('insaleorder.outnotice')&& getOne.status == 10 ? <span onClick={this.props.chukuClick}><i className={'foddingicon fooding-cktz'} title ={i18n.t(500415/*销售出库*/)}></i></span> : ''}
					{ permissionsBtn('insaleorder.examine') ? <span onClick={this.props.shenpiClick}><i className={'foddingicon fooding-approve'} title ={i18n.t(100470/*查看审批*/)}></i></span> : ''}
					{ permissionsBtn('insaleorder.edit')&& getOne.status == 1 ? <span onClick={this.props.Edit}><i className={'foddingicon fooding-alter_icon2'} title ={i18n.t(200376/*修改*/)}></i></span> : ''}
					{ permissionsBtn('insaleorder.commit') && getOne.status == 1? <span onClick={this.commitClick} className ={getOne.status ==1?'':'none'}><i className={'foddingicon fooding-submit'} title ={i18n.t(100472/*提交*/)}></i></span> : ''}
					{ permissionsBtn('insaleorder.del')&& getOne.status == 1 ? <span onClick={this.props.deleteClick}><i className={'foddingicon fooding-delete-icon4'} title ={i18n.t(100437/*删除*/)}></i></span> : ''}
				</div>
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400048/*单据编号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.no}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{new Date(getOne.billDate).Format('yyyy-MM-dd')}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne.statusName}</p>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100284/*币种*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{getOne["cny"+language]}</p>
							</div>
						</div>
					</div>
				</div>
			</div>)
	}
}

export default  DetailNormal;
