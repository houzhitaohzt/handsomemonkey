import React, {Component,PropTypes} from "react";
import Radio from "../../../../../components/Radio";
import Select, {Option, ConstMiniSelect } from '../../../../../components/Select';
import DataTime from '../../../../../components/Calendar/Calendar';
import  SelectChange from "../../../../../components/SelectChange";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
import { I18n } from '../../../../../lib/i18n';
class NormalEdit extends Component{
	constructor(props){
		super(props)
	}
	render(){
		const { getFieldProps, getFieldError } = this.props.form;
		const { valueone = {} } = this.props;;
		return(
			<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span>{I18n.t(400083/*供应商信息*/)}</span>
					<span onClick={this.props.saveClick} title={I18n.t(100430/*保存*/)}><i className={'foddingicon fooding-save'}></i></span>
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
					</div>
					<div className={'row'}>
						<div className="form-group col-md-12 col-lg-12">
							<label className={'col-md-1 col-lg-1'}>{I18n.t(400116/*调整原因*/)}</label>
							<input type='text' {...getFieldProps('adjustCause', {
								validateFirst: true,
								rules: [{required:true}],
                                initialValue:valueone.adjustCause || ""
                            })} className ={getFieldError('adjustCause')?'col-md-11 col-lg-11 text-input-nowidth error-border':'col-md-11 col-lg-11 text-input-nowidth'}/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default NormalEdit;
