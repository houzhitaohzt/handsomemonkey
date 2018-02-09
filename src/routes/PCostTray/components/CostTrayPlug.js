import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option } from '../../../components/Select';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../services/apiCall';
export class CostTrayPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
		this.handleCertificate = this.handleCertificate.bind(this);
		this.qiyunClick = this.qiyunClick.bind(this);
		this.huodaiClick = this.huodaiClick.bind(this);
		this.bizhongClick = this.bizhongClick.bind(this);
		this.state={
			statnTyArray:[],//港口类型
			qiyunArray:[],
			huodaiArray:[],
			bizhongArray:[]
		}
	}
	getData(value,that){
		this.addSelect = that;
	}
	onSaveAndClose(isAdd){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
	      		this.props.onSaveAndClose(this.props.form.getFieldsValue(),this.props.checkedData,isAdd);
	      		this.props.form.resetFields();
			}

    	});
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	handleCertificate(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.TransportType'},
			(response)=>{
				that.setState({
					statnTyArray:response.data
				});
		},(error)=>{

		});
	}
	qiyunClick(){
		var that = this;
		let obj = Object.assign({},{statnTyId:this.props.form.getFieldValue("statnTyId")},this.props.form.getFieldValue("statnTyId"));
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Statn',
			queryParams:[{attr:"statnTyId",expression:"=",value:obj.statnTyId}]},
			(response)=>{
				that.setState({
					qiyunArray:response.data
				});
		},(error)=>{

		});
	}
	huodaiClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.AgnShipBe'},
			(response)=>{
				that.setState({
					huodaiArray:response.data
				});
		},(error)=>{

		});
	}
	bizhongClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Curren'},
			(response)=>{
				that.setState({
					bizhongArray:response.data
				});
		},(error)=>{

		});
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError,getNFieldProps} = this.props.form;
		let {checkedData,getTermModes} = this.props;
		getFieldProps('normal', {
		      initialValue: '0',
		 });
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
        <div className={'addnormal'} style={{marginBottom:'10px'}}>
           	<div className={'  girdlayout scroll'}>
           									<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100156/*港口类型*/)}</label>
													 <Select
										                {...getNFieldProps('statnTyId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}

										                optionLabelProp="children"
										                className ={getFieldError('statnTyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										                onClick={this.handleCertificate}
										            >
										                {this.state.statnTyArray.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100297/*起运港*/)}</label>
													<Select
										                {...getNFieldProps('statnId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}

										                optionLabelProp="children"
										                className ={getFieldError('statnId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, statnId : o.id, statnLcName:o.localName, statnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100299/*货代公司*/)}</label>
													<Select
										                {...getNFieldProps('forBeId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}

										                optionLabelProp="children"
										                className ={getFieldError('forBeId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										                onClick={this.huodaiClick}
										            >
										                {this.state.huodaiArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, forBeId:o.id, forBeLcName:o.localName, forwBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100284/*币种*/)}</label>
													<Select
										                {...getNFieldProps('cnyId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}

										                optionLabelProp="children"
										                className ={getFieldError('cnyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										                onClick={this.bizhongClick}
										            >
										                {this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId:o.id, cnyLcName:o.localName, cnyEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
															<Calendar width={'100%'}   showTime = {false} isShowIcon={true} form={this.props.form}
															validate={true}
															name={'sDate'}
															value={checkedData['sDate']}
															/>
													</div>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500120/*终止日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
															<Calendar width={'100%'}  showTime = {false} isShowIcon={true} form={this.props.form}
															validate={true}
															name={'eDate'}
															value={checkedData['eDate']}
															/>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100288/*发布日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
															<Calendar width={'100%'} showTime = {false}
															isShowIcon={true} form={this.props.form}
															validate={true}
															name={'reDate'}
															value={checkedData['reDate']}
															/>
													</div>
												</div>
											</div>
											<ul className='row'>
											{
												getTermModes.map((e,i)=>{
													return (<li key={i} className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{e.localName}</label>
													<input type="text" {...getFieldProps("prices."+e.id, {
						                                initialValue:''
						                            })} className="col-md-9 col-lg-9 text-input-nowidth"/>
												</li>)
												})
											}
											</ul>
           	</div>
        </div>);
		}else if(this.props.DialogContent==3){
			   content = (
			 <div className={'addnormal'} style={{marginBottom:'10px'}}>
			   	<div className={' scroll girdlayout'}>
			   			<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100156/*港口类型*/)}</label>
													 <Select
										                {...getNFieldProps('statnTyId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["statnTyName"], statnTyId :checkedData.statnTyId, statnTyName:checkedData.statnTyName}
										                })}

										                optionLabelProp="children"
										                className ={getFieldError('statnTyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										                onClick={this.handleCertificate}
										            >
										                {this.state.statnTyArray.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100297/*起运港*/)}</label>
													<Select
										                {...getNFieldProps('statnId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["statn"+language], statnId : checkedData.statnId, statnLcName:checkedData.statnLcName, statnEnName: checkedData.statnEnName}
										                })}

										                optionLabelProp="children"
										                className ={getFieldError('statnId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, statnId : o.id, statnLcName:o.localName, statnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100299/*货代公司*/)}</label>
													<Select
										                {...getNFieldProps('forBeId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["forwBe"+language], forBeId:checkedData.forBeId, forBeLcName:checkedData.forBeLcName, forBeEnName:checkedData.forBeEnName}
										                })}

										                optionLabelProp="children"
										                className ={getFieldError('forBeId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										                onClick={this.huodaiClick}
										            >
										                {this.state.huodaiArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, forBeId:o.id, forBeLcName:o.localName, forBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100284/*币种*/)}</label>
													<Select
										                {...getNFieldProps('cnyId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["cny"+language], cnyId:checkedData.cnyId, cnyLcName:checkedData.cnyLcName, cnyEnName:checkedData.cnyEnName}
										                })}

										                optionLabelProp="children"
										                className ={getFieldError('cnyId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										                onClick={this.bizhongClick}
										            >
										                {this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId:o.id, cnyLcName:o.localName, cnyEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
															<Calendar width={'100%'}   showTime = {false} isShowIcon={true} form={this.props.form}
															validate={true}
															name={'sDate'}
															value={checkedData['sDate']}
															/>
													</div>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500120/*终止日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
														<Calendar width={'100%'}  showTime = {false} isShowIcon={true} form={this.props.form}
														validate={true}
														name={'eDate'}
														value={checkedData['eDate']}
														/>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100288/*发布日期*/)}</label>
													<div className={'col-md-9 col-lg-9 datetime'}>
														<Calendar width={'100%'} showTime = {false}
														isShowIcon={true} form={this.props.form}
														validate={true}
														name={'reDate'}
														value={checkedData['reDate']}
														/>
													</div>
												</div>
											</div>
											<ul className='row'>
											{
												getTermModes.map((e,i)=>{
													return (<li key={i} className="form-group col-md-6 col-lg-6">
													<label  className={'col-md-3 col-lg-3'}><span>*</span>{e.localName}</label>
													<input type="text" placeholder=''   {...getFieldProps("prices."+e.id, {
						                                initialValue:checkedData.prices && checkedData.prices[e.id]?String(checkedData.prices[e.id]):''
						                            })} className="col-md-9 col-lg-9 text-input-nowidth"/>
												</li>)
												})
											}
											</ul>
				</div>
			</div>)
		}else if(this.props.DialogContent==4){
			content = (
				<div className='scroll lose'>
							<span>
								<i>*</i>
								失效原因
							</span>
							<Select
								placeholder={''}
								style={{width: 450}}
								getPopupContainer={this.getPopupContainer}
						    >
							   	<Option value={'111111'}>11</Option>
							</Select>
				</div>
			)
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose.bind(this)} onCancel={this.onCancel.bind(this)}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(CostTrayPlug);
export default ProductForm;
