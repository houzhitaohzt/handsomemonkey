import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option } from '../../../../components/Select';
import DataTime from  '../../../../components/Calendar/Calendar';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import Calendar from  '../../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
export class AirPricePlug extends Component{
	constructor(props){
		super(props);
		this.state={
			zhuangxiangArray:[],
			costlvtrArray:[],
			huodaiArray:[],
			bizhongArray:[],
			xiangxingArray:[],
			jifeimoshiArray:[],
			hanxianArray:[],
			packTyArray:[],
			data:{}

		}
		this.qiyunClick = this.qiyunClick.bind(this);
		this.packTyClick = this.packTyClick.bind(this);
		this.bizhongClick = this.bizhongClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.xiangxingClick = this.xiangxingClick.bind(this);
		this.jifeimoshiClick = this.jifeimoshiClick.bind(this);
		this.costlvtrClick = this.costlvtrClick.bind(this);
		this.hangxianClick = this.hangxianClick.bind(this);
	}
	costlvtrClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Costlvtr'},
			(response)=>{
				that.setState({
					costlvtrArray:response.data
				});
		},(error)=>{

		});
	}
	hangxianClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.TransRout'},
			(response)=>{
				that.setState({
					hanxianArray:response.data
				});
		},(error)=>{

		});
	}
	jifeimoshiClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.ChargeType'},
			(response)=>{
				that.setState({
					jifeimoshiArray:response.data
				});
		},(error)=>{

		});
	}
	xiangxingClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.ContnrType'},
			(response)=>{
				that.setState({
					xiangxingArray:response.data
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
	packTyClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.enumeration.PackType'},
			(response)=>{
				that.setState({
					packTyArray:response.data
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
				if(this.props.data.number== 0){
				   value = Object.assign({},this.props.otherData,value);
				}
	      		this.props.onSaveAndClose(value);
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
		let {getTermModes} = this.props;
		let otherData = this.props.otherData ||{};
		getFieldProps('type', {
		      initialValue: '10',
	    });
	    
		let content = <div></div>;
		content =(
						<div className={'  girdlayout'} style={{height:"344px"}}>
						  	<div className={'row'}>
								                <div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500121/*费用名称*/)}</label>
													<Select
														placeholder=""
										                {...getNFieldProps('costlvtrId',{
										                    rules: [{required:true}],
										                    initialValue:otherData["costlvtr"+language]?{s_label:otherData["costlvtr"+language], costlvtrId: otherData.costlvtrId, costlvtrLcName:otherData.costlvtrLcName, costlvtrEnName:otherData.costlvtrEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={getFieldError('costlvtrId')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}
										                onClick={this.costlvtrClick}
										            >
										                {this.state.costlvtrArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, costlvtrId: o.id, costlvtrLcName:o.localName, costlvtrEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
													</Select>
												</div>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500125/*货币*/)}</label>
													<Select
										                {...getNFieldProps('cnyId',{
										                    rules: [{required:true}],
										                    initialValue:otherData["cny"+language]?{s_label:otherData["cny"+language], cnyId:otherData.cnyId, cnyLcName:otherData.cnyLcName, cnyEnName:otherData.cnyEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={getFieldError('cnyId')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}
										                onClick={this.bizhongClick}
										            >
										                {this.state.bizhongArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId:o.id, cnyLcName:o.localName, cnyEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500122/*标准费用*/)}</label>
													<input placeholder=''
															type="text" {...getFieldProps('costAgg', {
																	rules: [{required:true}],
						                                			initialValue:otherData.costAgg?otherData.costAgg:''
						                           				 })} className={getFieldError('costAgg')?'col-md-9 col-lg-9 text-input-nowidth error-border':'col-md-9 col-lg-9 text-input-nowidth'}/>
												</div>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500088/*装箱类型*/)}</label>
													<Select
										                {...getNFieldProps('packTy',{
										                    rules: [{required:true}],
										                    initialValue:otherData["packTyName"]?{s_label:otherData["packTyName"],packTy:otherData["packTy"]}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={getFieldError('packTy')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}
										                onClick={this.packTyClick}
										            >
										                {this.state.packTyArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}
										            </Select>
												</div>
							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}>{i18n.t(100214/*箱型*/)}</label>
													<Select
														allowClear
										                {...getNFieldProps('contnrTyId',{

										                    initialValue:otherData["contnrTy"+language]?{s_label:otherData["contnrTy"+language], contnrTyId:otherData.contnrTyId, contnrTyLcName:otherData.contnrTyLcName, contnrTyEnName:otherData.contnrTyEnName}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={'currency-btn select-from-currency col-xs-9 col-md-9 '}
										                onClick={this.xiangxingClick}
										            >
										                {this.state.xiangxingArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, contnrTyId:o.id, contnrTyLcName:o.localName, contnrTyEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
												<div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(200533/*计费模式*/)}</label>
													<Select
										                {...getNFieldProps('chargeTy',{
										                    rules: [{required:true}],
										                    initialValue:otherData["chargeTyName"]?{s_label:otherData["chargeTyName"],chargeTy:otherData["chargeTy"]}:undefined
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={getFieldError('chargeTy')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}
										                onClick={this.jifeimoshiClick}
										            >
										                {this.state.jifeimoshiArray.map((o,i)=><Option key={i} value={String(o.id)} title={o.name}>{o.name}</Option>)}
										            </Select>
												</div>
							</div>
							<div className={'row'}>
								                <div className="form-group col-xs-6 col-md-6">
													<label className={'col-xs-3 col-md-3'}>{i18n.t(100177/*航线*/)}</label>
													<Select
														allowClear
										                {...getNFieldProps('routeId',{
										                    rules: [{required:true}],
										                    initialValue:{s_label:otherData["route"+language], routeId:otherData.routeId, routeLcName:otherData.routeLcName, routeEnName:otherData.routeEnName}
										                })}
										                placeholder=''
										                optionLabelProp="children"
										                className ={getFieldError('routeId')?'currency-btn select-from-currency col-xs-9 col-md-9 error-border':'currency-btn select-from-currency col-xs-9 col-md-9'}
										                onClick={this.hangxianClick}
										            >
										                {this.state.hanxianArray.map((o,i)=><Option key={i} objValue={{s_label:o.localName, routeId:o.id, routeLcName:o.localName, routeEnName:o.name}} title={o.localName}>{o.localName}</Option>)}
										            </Select>
												</div>
							</div>
						</div>);
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
