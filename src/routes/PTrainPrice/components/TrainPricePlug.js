import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';
//引入select插件
import Select, { Option } from '../../../components/Select';
import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';
 import Tooltip from '../../../components/Tip';
 import {I18n} from "../../../lib/i18n";
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../services/apiCall';
export class SeaPricePlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.state={
			routeArray:[],//航线
			statnTyArray:[],
			qiyunArray:[],
			chuanqi:[1,2,3,4,5,6,7],
			chuangArray:[],
			huodaiArray:[],
			bizhongArray:[]
		}
		this.handleCertificate = this.handleCertificate.bind(this);
		this.qiyunClick = this.qiyunClick.bind(this);
		this.chuangsClick = this.chuangsClick.bind(this);
		this.huodaiClick = this.huodaiClick.bind(this);
		this.bizhongClick = this.bizhongClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);

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
	handleCertificate(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.TransRout'},
			(response)=>{
				that.setState({
					routeArray:response.data
				})
		},(error)=>{

		});
	}
	qiyunClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Statn',
			queryParams:[{
			attr:"statnTyId",
			expression:"=",
			value:20
		}]
		},
			(response)=>{
				that.setState({
					qiyunArray:response.data
				})
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
						getNFieldProps('type',{
							initialValue:20
						})
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
           		<div className={'addnormal scroll'} style={{maxHeight:'300px',overflowY:'auto'}}>
           		<div className={'  girdlayout'}>
           									<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100177/*航线*/)}</label>
													<Select
										                {...getNFieldProps('routeId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                optionLabelProp="children"
										                className ={getFieldError('routeId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.handleCertificate}
										            >
										                {this.state.routeArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, routeId : o.id, routeLcName:o.localName, routeEnName: o.name}} title={o.name}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100297/*起运港*/)}</label>
													<Select
										                {...getNFieldProps('sStatnId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={getFieldError('sStatnId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, sStatnId: o.id, sStatnLcName :o.localName, sStatnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100298/*目的港*/)}</label>
													<Select
										                {...getNFieldProps('eStatnId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                placeholder=''
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
													<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100284/*币种*/)}</label>
													<Select
										                {...getNFieldProps('cnyId',{
										                    rules: [{required:true}],
										                    initialValue:undefined
										                })}
										                optionLabelProp="children"
										                className ={getFieldError('cnyId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.bizhongClick}
										            >
										                {this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId:o.id, cnyLcName:o.localName, cnyEnName:o.name}} title={o.name}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100286/*生效日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
														showTime = {false}
														validate={true}
														 isShowIcon={true}
														 name={"sDate"}
														 form={this.props.form}
														 />
													</div>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100287/*失效日期*/)}</label>
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
													<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100288/*发布日期*/)}</label>
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
											<div className="row">
												<div>
													<label style={{display:'inline-block',color:'#70aae3'}}>{I18n.t(100296/*拼箱价*/)}</label>
												</div>
											</div>
											<ul className={'foreach'}>
												  {
												  	getTermModes.trainMeasure.map((e,i)=>{
												  		return (<li key={i}>
												  			<label className={'col-md-3 col-lg-3'}>{e.localName}</label>
															<input placeholder=''
															type="text" {...getFieldProps('prices.'+e.id, {
						                                		initialValue:''
						                           				 })} className={'col-md-8 col-lg-8 text-input-nowidth'}/>
												  	</li>);
												  })
												}
											</ul>
											<div className="row">
												<div>
													<label style={{display:'inline-block',color:'#70aae3'}}>{I18n.t(100295/*整箱价*/)}</label>
												</div>
											</div>
											<ul className={'foreach'}>
												  {
												  	getTermModes.trainBox.map((e,i)=>{
												  		return (<li key={i}>
												  			<Tooltip placement="top" overlay={<div style={{color:'black',backgroundColor:'red'}}>{e.localName}</div>} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
												  				<label className={'col-md-3 col-lg-3 text-ellipsis'} style={{width:'25%'}}><span className={e.id=="10"?'':'none'}>*</span>{e.localName}</label>
												  			</Tooltip>
															<input
															type="text" {...getFieldProps('prices.'+e.id, {
						                                		initialValue:'',
						                                		rules:[{required:(e.id=="10")}],
						                           				 })} className={getFieldError('prices.'+e.id)?"col-md-8 col-lg-8 text-input-nowidth error-border":"col-md-8 col-lg-8 text-input-nowidth"}/>
												  	</li>);
												  })
												}
											</ul>

           		</div>
           	</div>);
		}else if(this.props.DialogContent==3){
			content = (
           <div className={'addnormal scroll'} style={{maxHeight:'300px',overflowY:'auto'}}>
           		<div className={'  girdlayout'}>
           									<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100177/*航线*/)}</label>
													<Select
										                {...getNFieldProps('routeId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["route"+language], routeId :checkedData.routeId, routeLcName:checkedData.routeLcName, routeEnName:checkedData.routeEnName}
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={getFieldError('routeId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.handleCertificate}
										            >
										                {this.state.routeArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, routeId : o.id, routeLcName:o.localName, routeEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100297/*起运港*/)}</label>
													<Select
										                {...getNFieldProps('sStatnId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["sStatn"+language], sStatnId: checkedData.sStatnId, sStatnLcName :checkedData.sStatnLcName, sStatnEnName: checkedData.sStatnEnName}
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={getFieldError('sStatnId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, sStatnId: o.id, sStatnLcName :o.localName, sStatnEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100298/*目的港*/)}</label>
													<Select
										                {...getNFieldProps('eStatnId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["eStatn"+language], eStatnId: checkedData.eStatnId, eStatnLcName:checkedData.eStatnLcName, eStatnEnName:checkedData.eStatnEnName}
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={getFieldError('eStatnId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.qiyunClick}
										            >
										                {this.state.qiyunArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, eStatnId: o.id, eStatnLcName:o.localName, eStatnEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100299/*货代公司*/)}</label>
													<Select
										                {...getNFieldProps('forBeId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["forBe"+language], forBeId:checkedData.forBeId, forBeLcName:checkedData.forBeLcName, forBeEnName:checkedData.forBeEnName}
										                })}
										                placeholder=''
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
													<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100284/*币种*/)}</label>
													<Select
										                {...getNFieldProps('cnyId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:checkedData["cny"+language], cnyId:checkedData.cnyId, cnyLcName:checkedData.cnyLcName, cnyEnName:checkedData.cnyEnName}
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={getFieldError('cnyId')?'col-md-8 col-lg-8 currency-btn select-from-currency error-border':'col-md-8 col-lg-8 currency-btn select-from-currency'}
										                onClick={this.bizhongClick}
										            >
										                {this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId:o.id, cnyLcName:o.localName, cnyEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100286/*生效日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
														showTime = {false}
														validate={true}
														value={checkedData.sDate}
														 isShowIcon={true}
														 name={"sDate"}
														 form={this.props.form}
														 />
													</div>
												</div>
											</div>
											<div className="row">
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100287/*失效日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
														 isShowIcon={true}
														 showTime = {false}
														validate={true}
														 name={"eDate"}
														 value={checkedData.eDate}
														 form={this.props.form}
														 />
													</div>
												</div>
												<div className="form-group col-md-6 col-lg-6">
													<label className={'col-md-3 col-lg-3'}><span>*</span>{I18n.t(100288/*发布日期*/)}</label>
													<div className={'col-md-8 col-lg-8 datetime'}>
														<Calendar width={'100%'}
														showTime = {false}
														validate={true}
														isShowIcon={true}
														 name={"reDate"}
														 value={checkedData.reDate}
														 form={this.props.form}
														/>
													</div>
												</div>
											</div>
											<div className="row">
												<div>
													<label style={{display:'inline-block',color:'#70aae3'}}>{I18n.t(100296/*拼箱价*/)}</label>
												</div>
											</div>
											<ul className={'foreach'}>
												{
													getTermModes.trainMeasure.map((e,i)=>{
														return (<li key={i}>
												  			<label className={'col-md-3 col-lg-3'}>{e.localName}</label>
															<input placeholder=''
															type="text" {...getFieldProps('prices.'+e.id, {
						                                		  initialValue:checkedData.prices && checkedData.prices[e.id]?checkedData.prices[e.id]:'',

						                           				 })} className={"col-md-8 col-lg-8 text-input-nowidth"}/>
												  	</li>)
													})
												}
											</ul>

											<div className="row">
												<div>
													<label style={{display:'inline-block',color:'#70aae3'}}>{I18n.t(100295/*整箱价*/)}</label>
												</div>
											</div>
											<ul className={'foreach'}>
												  {
												  	getTermModes.trainBox.map((e,i)=>{
												  		return (<li key={i}>
												  			<Tooltip placement="top" overlay={<div style={{color:'black',backgroundColor:'red'}}>{e.localName}</div>} arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
												  				<label className={'col-md-3 col-lg-3 text-ellipsis'} style={{width:'25%'}}><span className={e.id=="10"?'':'none'}>*</span>{e.localName}</label>
												  			</Tooltip>
															<input placeholder=''
															type="text" {...getFieldProps('prices.'+e.id, {
						                                		  initialValue:checkedData.prices && checkedData.prices[e.id]?checkedData.prices[e.id]:'',
						                                		rules:[{required:(e.id=="10")}],
						                           				 })} className={getFieldError('prices.'+e.id)?"col-md-8 col-lg-8 text-input-nowidth error-border":"col-md-8 col-lg-8 text-input"}/>
												  	</li>);
												  })
												}
											</ul>

           		</div>
           	</div>);
		}
		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(SeaPricePlug);
export default ProductForm;
