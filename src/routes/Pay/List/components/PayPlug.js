import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, {Option,ConstMiniSelect } from '../../../../components/Select';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import DataTime from '../../../../components/Calendar/Calendar';
const {Table} = require("../../../../components/Table");//Table表格
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../services/apiCall";
import xt from '../../../../common/xt'; // 下拉
export class FclPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.showSaveClose = true;
	}
	getData(value,that){
		this.addSelect = that;
	}
	onSaveAndClose(){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
				this.props.onSaveAndClose(value);
			}

    	});
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		let {getOne} = this.props;
		let content = <div></div>;
	    if(this.props.DialogContent==2){
	    	that.showSaveClose =true;
	    	let validate = (rule, value, callback) => {
										//if(value.trim() === '') return callback([]);
										if(Math.abs(parseFloat(value)) <= Math.abs(getOne.applyAmt)){
											   callback([]);
										} else callback([i18n.t(400102/*数量不能大于*/) + getOne.applyAmt]);
									};
			   content = (
			   <div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-12 col-lg-12">
							<label className={'col-md-2 col-lg-2'}><span>*</span>{i18n.t(200814/*付款信息*/)}</label>
							<ConstMiniSelect form={this.props.form}
									isRequest={Boolean(getOne.cnyId&&getOne.payCcId)}
                                    refreshMark={getOne.cnyId+getOne.payCcId}
                                     pbj={{
                                                     apiType: apiGet, host: API_FOODING_DS, uri:'/bankacct/getList',
                                                     params: {sourceId:getOne.payCcId,curcyId:getOne.cnyId}
                                          }} fieldName="bankId"
                                                 initValueOptions={[]}
                                                 initialValue={xt.initSelectValue(getOne["bank"+language], getOne, ['bankId', 'bankLcName', 'bankEnName','accountId','accountLcName','accountEnName'],()=>{
                                                 	return ''
                                                 }, this.props.form)}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     bankLcName: da.bankName,
                                                     bankEnName : da.bankName,
                                                     accountId :da.bacctCode,
                                                     accountEnName :da.bacctCode,
                                                     accountLcName:da.bacctCode,
                                                     s_label:da.bankName+(da.bacctCode?('+'+da.bacctCode):'')+(da.actStaff?('+'+da.actStaff):'')+(da.actAddres?('+'+da.actAddres):'')+(da.swiftCode?('+'+da.swiftCode):'')
                                                 }}>{da.bankName+(da.bacctCode?('+'+da.bacctCode):'')+(da.actStaff?('+'+da.actStaff):'')+(da.actAddres?('+'+da.actAddres):'')+(da.swiftCode?('+'+da.swiftCode):'')}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-10 col-lg-10'}
                            />
						</div>
					</div>
					<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200835/*开户币种*/)}</label>
								<ConstMiniSelect form={this.props.form}
	                                                 pbj={{
	                                                     apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
	                                                     params: {obj:'com.fooding.fc.ds.entity.Curren'}
	                                                 }} fieldName="cnyId"
	                                                 initValueOptions={[]}
	                                                 initialValue={
	                                                 	xt.initSelectValue(getOne["cny"+language], getOne, ['cnyId', 'cnyLcName', 'cnyEnName'], "cny"+language, this.props.form)
	                                                 }
	                                                 optionValue={(da, di) => <Option key={di} objValue={{
	                                                     cnyId: da.id,
	                                                     cnyLcName: da.localName,
	                                                     cnyEnName: da.name,
	                                                     s_label: da.localName
	                                                 }}>{da.localName}</Option>} reles={true} disabled
	                                                 className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
	                            />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(200836/*应付金额*/)}</label>
								<input placeholder=''
								   type="text" {...getFieldProps('applyAmt', {
						                initialValue:getOne.applyAmt?toDecimal(getOne.applyAmt):''
						            })}
							        disabled
									className={'col-md-9 col-lg-9 text-input-nowidth'}
								 />
							</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(200819/*已付金额*/)}</label>
							<input placeholder=''
								   type="text" {...getFieldProps('payAmt', {
						                initialValue:getOne.payAmt?toDecimal(getOne.payAmt):0
						            })}
						        disabled
								className={'col-md-9 col-lg-9 text-input-nowidth'}
							 />
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500063/*付款方式*/)}</label>
							<ConstMiniSelect form={this.props.form}
                                     pbj={{
                                                     apiType: apiPost, host: API_FOODING_DS, uri:'/object/getMiniList',
                                                     params: {obj:'com.fooding.fc.ds.entity.PayTrmType'}
                                          }} fieldName="payTrmTyId"
                                                 initValueOptions={[]}
                                                 optionValue={(da, di) => <Option key={di} objValue={{
                                                     payTrmTyId: da.id,
                                                     payTrmTyLcName: da.localName,
                                                     payTrmTyEnName: da.name,
                                                     s_label:da.localName
                                                 }}>{da.localName}</Option>} reles={true}
                                                 className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
                            />
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200827/*付款日期*/)}</label>
							<div className={'col-md-9 col-lg-9 datetime'}>
								<DataTime
									form={this.props.form}
									name={'billDate'}
									showTime={false}
									value={new Date()}
									isShowIcon={true}
									width={'100%'}
								/>
							</div>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200615/*实付金额*/)}</label>
							<input placeholder=''
								   type="text" {...getFieldProps('billAmt', {
								   		validateFirst:true,
										rules:[{required:true},validate],
										valuedateTrigger:'onBlur',
						                initialValue:(getOne.applyAmt-getOne.payAmt)?toDecimal((getOne.applyAmt-getOne.payAmt)):0
						            })}
									className={getFieldError('billAmt')?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'}
							/>
						</div>
					</div>
					</div>
				</div>
			)
		}else if(this.props.DialogContent==1){
			let array=[]
			array.push(this.props.data)
			that.showSaveClose = false;
			 content = (
			<Table ref = "mainTable"
							showHeader ={true}
							columns={	[{
										title : i18n.t(100181/*款项类型*/),
										dataIndex : 'fundTy'+language,
										key : "fundTy"+language,
										width : '33%',
										render(data,row,index){
											return (<div title={data}>{data}</div>)
										}
									},{
										title : i18n.t(200841/*申请付款金额*/),
										dataIndex : "applyAmt",
										key : "applyAmt",
										width : "33%",
										render(data,row,index){
											return (<div>{data?(toDecimal(data)+' '+row.cnyLcName):''}</div>);
										}
									},{
										title : i18n.t(200829/*已付*/),
										dataIndex : "payAmt",
										key : "payAmt",
										width : "33%",
										render(data,row,index){
											return (<div>{data?(toDecimal(data)+' '+row.cnyLcName):''}</div>);
										}

									}]}
							data={array}
							checkboxConfig={{show:false}}
						/>)
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} showSaveClose ={this.showSaveClose} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.props.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(FclPlug);
export default ProductForm;
