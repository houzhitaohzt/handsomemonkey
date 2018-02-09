import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option } from '../../../components/Select';
import Radio from '../../../components/Radio';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../services/apiCall';
export class AirPricePlug extends Component{
	constructor(props){
		super(props);
		this.state={
			qiyunArray:[],
			chuangArray:[],
			huodaiArray:[],
			bizhongArray:[]

		}
		this.qiyunClick = this.qiyunClick.bind(this);
		this.chuangsClick = this.chuangsClick.bind(this);
		this.huodaiClick = this.huodaiClick.bind(this);
		this.bizhongClick = this.bizhongClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
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
	chuangsClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',
			{
				"obj":"com.fooding.fc.ds.entity.Carrier",
				"prettyMark":true
			},
			(response)=>{
				that.setState({
					chuangArray:response.data
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
	qiyunClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Statn',
			queryParams:[{
			attr:"statnTyId",
			expression:"=",
			value:30
		}]
		},
			(response)=>{
				that.setState({
					qiyunArray:response.data
				})
		},(error)=>{

		});
	}
	onSaveAndClose(isAdd){
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
	      		this.props.onSaveAndClose(value,this.props.checkedData,isAdd);
	      		this.props.form.resetFields();
			}

    	});
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError ,getNFieldProps} = this.props.form;
		let {checkedData,getTermModes} = this.props;
		getFieldProps('type', {
		      initialValue: '30',
	    });
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
           		<div className={'  girdlayout'}>
           									<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200268/*起飞机场*/)}</label>
													<Select
										                {...getNFieldProps('sStatnId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('sStatnId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, sStatnId: o.id, sStatnLcName :o.localName, sStatnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200269/*目的机场*/)}</label>
													<Select
										                {...getNFieldProps('eStatnId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('eStatnId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, eStatnId: o.id, eStatnLcName:o.localName, eStatnEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200270/*航空公司*/)}</label>
													<Select
										                {...getNFieldProps('lsBeId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('lsBeId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.chuangsClick}
										            >
										                {this.state.chuangArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, lsBeId: o.id, lsBeLcName:o.localName, lsBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100299/*货代公司*/)}</label>
													<Select
										                {...getNFieldProps('forBeId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('forBeId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.huodaiClick}
										            >
										                {this.state.huodaiArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, forBeId:o.id, forBeLcName:o.localName, forBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100284/*币种*/)}</label>
													<Select
										                {...getNFieldProps('cnyId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('cnyId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.bizhongClick}
										            >
										                {this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId:o.id, cnyLcName:o.localName, cnyEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
															showTime = {false}
															 validate={true}
															 isShowIcon={true}
															 name={"sDate"}
															 value={new Date()}
															 form={this.props.form}
														 />
													</div>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100287/*失效日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
														 isShowIcon={true}
														 showTime = {false}
														 validate={true}
														 name={"eDate"}
														 form={this.props.form}
														 />
													</div>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100288/*发布日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
															showTime = {false}
															validate={true}
															isShowIcon={true}
															 name={"reDate"}
															 form={this.props.form}
														/>
													</div>
												</div>
											</div>
											<ul className={'foreach'}>
												  {
												  	getTermModes.airMeasure.map((e,i)=>{
												  		return (<li key={i}>
												  			<label className={'col-md-3 col-lg-3'}><span className={e.id=="P0"||e.id == "P45"?'':'none'}>*</span>{e.localName}</label>
															<input
															type="text" {...getFieldProps('prices.'+e.id, {
						                                		initialValue:'',
						                                		rules:[{required:(e.id=="P0"||e.id=="P45")}],
						                           				 })} className={getFieldError('prices.'+e.id)?"col-md-8 col-lg-8 text-input error-border":"col-md-8 col-lg-8 text-input"}/>
												  	</li>);
												  })
												}
											</ul>

           		</div>
           	</div>
           	);
		}else if(this.props.DialogContent==3){
			   content = (
			   <div className={'addnormal'} style={{marginBottom:'10px'}}>
           	    	<div className={'  girdlayout'}>
           									<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200268/*起飞机场*/)}</label>
													<Select
										                {...getNFieldProps('sStatnId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["sStatn"+language], sStatnId: checkedData.sStatnId, sStatnLcName :checkedData.sStatnLcName, sStatnEnName: checkedData.sStatnEnName}
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('sStatnId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, sStatnId: o.id, sStatnLcName :o.localName, sStatnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200269/*目的机场*/)}</label>
													<Select
										                {...getNFieldProps('eStatnId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["eStatn"+language], eStatnId: checkedData.eStatnId, eStatnLcName:checkedData.eStatnLcName, eStatnEnName:checkedData.eStatnEnName}
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('eStatnId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, eStatnId: o.id, eStatnLcName:o.localName, eStatnEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200270/*航空公司*/)}</label>
													<Select
										                {...getNFieldProps('lsBeId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["lsBe"+language], lsBeId: checkedData.lsBeId, lsBeLcName:checkedData.lsBeLcName, lsBeEnName:checkedData.lsBeEnName}
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('lsBeId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.chuangsClick}
										            >
										                {this.state.chuangArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, lsBeId: o.id, lsBeLcName:o.localName, lsBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100299/*货代公司*/)}</label>
													<Select
										                {...getNFieldProps('forBeId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["forBe"+language], forBeId:checkedData.forBeId, forBeLcName:checkedData.forBeLcName, forBeEnName:checkedData.forBeEnName}
										                })}
										                optionLabelProp="children"

										                className ={getFieldError('forBeId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.huodaiClick}
										            >
										                {this.state.huodaiArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, forBeId:o.id, forBeLcName:o.localName, forBeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100284/*币种*/)}</label>
													<Select
										                {...getNFieldProps('cnyId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["cny"+language], cnyId:checkedData.cnyId, cnyLcName:checkedData.cnyLcName, cnyEnName:checkedData.cnyEnName}
										                })}
										                optionLabelProp="children"
										              	className ={getFieldError('cnyId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.bizhongClick}
										            >
										                {this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId:o.id, cnyLcName:o.localName, cnyEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
														showTime = {false}
														validate={true}
														 isShowIcon={true}
														 value={checkedData.sDate|| new Date()}
														 name={"sDate"}
														 form={this.props.form}
														 />
													</div>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100287/*失效日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
														 isShowIcon={true}
														 showTime = {false}
														validate={true}
														value={checkedData.eDate}
														 name={"eDate"}
														 form={this.props.form}
														 />
													</div>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(100288/*发布日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
															showTime = {false}
															validate={true}
															isShowIcon={true}
															value={checkedData.reDate}
															 name={"reDate"}
															 form={this.props.form}
														/>
													</div>
												</div>
											</div>
											<ul className='foreach'>
												  {
												  	getTermModes.airMeasure.map((e,i)=>{
												  		return (<li key={i}>
												  			<label  className={'col-md-3 col-lg-3'}><span className={e.id==10?'':'none'}>*</span>{e.localName}</label>
															<input
															type="text" {...getFieldProps('prices.'+e.id, {
																rules:[{required:(e.id=="P0"||e.id=="P45")}],
						                                		initialValue:checkedData.prices && checkedData.prices[e.id]?checkedData.prices[e.id]:''
						                           				 })} className={getFieldError('prices.'+e.id)?"v text-input error-border":"col-md-8 col-lg-8 text-input"}/>
												  	</li>);
												  })
												}
											</ul>

           	        </div>
           	   </div>
           	);
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft}
					onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(AirPricePlug);
export default ProductForm;
