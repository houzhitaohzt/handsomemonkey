import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import Select, {Option, ConstMiniSelect } from '../../../../components/Select';
import DataTime from '../../../../components/Calendar/Calendar';
import  SelectChange from "../../../../components/SelectChange";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import { I18n } from '../../../../lib/i18n';
class Addnormal extends Component{
	constructor(props){
		super(props)
	}
	render(){
		const { getFieldProps, getFieldError } = this.props.form;
		const { PurOrder = {} } = this.props;
		return(
			<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span>{I18n.t(100138/*常规*/)}</span>
					<span onClick={this.props.backClick} title={I18n.t(100431/*返回*/)}><i className={'foddingicon fooding-back'}></i></span>
					<span onClick={this.props.saveClick} title={I18n.t(100430/*保存*/)}><i className={'foddingicon fooding-save'}></i></span>
					{
						PurOrder.type === 1?
						<span onClick={this.props.cancelClick} title={I18n.t(400067/*取消合单*/)}><i className={'foddingicon fooding-cancal-p'}></i></span>:
						<div></div>						
					}
				</div>
				<div className={'girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400048/*单据编号*/)}</label>
							<input type='text' disabled {...getFieldProps('no', {
								validateFirst: true,
								rules: [{required:true}],
                                initialValue:PurOrder.no?PurOrder.no:''
                            })} className ={getFieldError('no')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}/>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<DataTime 
									showTime={false}
									isShowIcon={true}
									width={'100%'}
									form={this.props.form} 
									name={'billDate'}
									className ={getFieldError('billDate')?'error-border':''}
									validate={true}
									value={new Date(PurOrder.billDate).Format('yyyy-MM-dd')}
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400049/*业务状态*/)}</label>
							<Select
								animation='slide-up'
								className ={getFieldError('status')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
								choiceTransitionName="rc-select-selection__choice-zoom"
								optionLabelProp="children"
								disabled={true}
								allowClear={false}
								{...getFieldProps('status',{
									validateFirst: true,
									rules: [{required:true}],
									initialValue:String(PurOrder.status?PurOrder.status:'')
								})}
							>
							{
								[{id:'',name:I18n.t(400051/*不限*/)},{id:'1',name:I18n.t(300039/*草稿*/)},{id:'5',name:I18n.t(200258/*已提交*/)},{id:'10',name:I18n.t(400053/*已审批*/)}].map((e,i) => {
									return <Option key={i} value={String(e.id)} title={e.name}>{e.name}</Option>
								})
							}
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(100284/*币种*/)}</label>
							<ConstMiniSelect form={this.props.form} pbj='com.fooding.fc.ds.entity.Curren' fieldName="cnyId"
	                             initValueOptions={[]}
	                             optionValue={da => <Option key={da.id} objValue={{
	                                 cnyId: da.id,
	                                 cnyLcName: da.localName,
	                                 cnyEnName: da.name,
	                                 s_label: da.localName
	                             }}>{da.localName}</Option>} reles={true}
	                             initialValue={{cnyId:PurOrder.cnyId,cnyLcName:PurOrder.cnyLcName,cnyEnName:PurOrder.cnyEnName,s_label:PurOrder.cnyLcName}}
	                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
	                        />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Addnormal;
