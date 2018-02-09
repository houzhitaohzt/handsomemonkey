import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, { Option } from '../../../../../components/Select';
import Radio from '../../../../../components/Radio';
import AddSelect from '../../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../../components/Dialog/Confirm';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
import Input from '../../../../../components/FormValidating/FormValidating';
import Checkbox from '../../../../../components/CheckBox';
export class Traderulesplug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.getData = this.getData.bind(this);
		this.state ={
			info:{}
		}
	}
	getData(value,that){
		this.addSelect = that;
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				if(this.props.DialogContent == 1){
					let params = this.props.form.getFieldsValue();
					delete params['id'];
					delete params['optlock'];
					this.props.onSaveAndClose(params,{},isAdd);
				}else{
					this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				}this.props.form.resetFields();

				
			}
		})
	}
	onCancel(){
		this.props.onCancel();
		this.props.form.resetFields();
	}
	componentDidMount(){
		var that = this;
		let object=Object.assign({},{sourceId:this.props.sourceId,dataTyId:25});
		apiGet(API_FOODING_DS,'/tradrule/getInit',{sourceId:this.props.sourceId,dataTyId:25},(response)=>{
			that.setState({
				info:response.data
			});
		},(errors)=>{

		})
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		let {checkedData} = this.props;
		let {info} = this.state;
		info.countrys = info.countrys ||[];
		let content = <div></div>;
		getFieldProps('dataTyId', {
		      initialValue: 25,
		});
		 getFieldProps('sourceId',{
									initialValue:this.props.sourceId,
		});
		if(this.props.DialogContent == 1){
			content = (<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100087/*国家*/)}</label>
								<Select
										animation='slide-up'
										placeholder=''
										className ={ getFieldError("cntryId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										optionLabelProp="children"
										{...getNFieldProps('cntryId',{
											validateFirst: true,
											rules: [{required:true}],
											initialValue:''
										})}
										>
										{
											info.countrys.map((e,i)=>{
												return  <Option value={e.id+""} title={e.localName} key={i}>{e.localName}</Option>
											})
										}
								</Select>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100385/*海关编码*/)}</label>
								<Input form={this.props.form} obj={{name:'hsCode',type:'text', 
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100415/*商检*/)}</label>
								<Checkbox 
								
									{...getFieldProps('salImpMark',{
										initialValue:false
									})}
									checked={this.props.form.getFieldValue("salImpMark")}
								/>
							</div>
						</div>
					</div>
			</div>
			);
		}else if(this.props.DialogContent==2){
			   Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				    console.log('ok, got it');
				}
			   });
			   return false;
		}else if(this.props.DialogContent==3){
			 getFieldProps('id',{
									initialValue:checkedData.id,
			});
			 getFieldProps('optlock',{
									initialValue:checkedData.optlock,
			});
			   content = (<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100087/*国家*/)}</label>
								<Select
										animation='slide-up'
										placeholder=''
										className ={ getFieldError("cntryId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										optionLabelProp="children"
										{...getNFieldProps('cntryId',{
											validateFirst: true,
											rules: [{required:true}],
											initialValue:{s_label:checkedData.country.name,cntryId:checkedData.country.id}
										})}
										>
										{
											info.countrys.map((e,i)=>{
												return  <Option value={e.id+""} title={e.localName} key={i}>{e.localName}</Option>
											})
										}
								</Select>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100385/*海关编码*/)}</label>
								<Input form={this.props.form} obj={{name:'hsCode',type:'text', 
										initialValue:checkedData.hsCode,
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100415/*商检*/)}</label>
								<Checkbox 
								
									{...getFieldProps('salImpMark',{
										initialValue:checkedData.salImpMark
									})}
									checked={this.props.form.getFieldValue("salImpMark")}
								/>
							</div>
						</div>
					</div>
			</div>)
		}else if(this.props.DialogContent==4){
			content = <div className='scroll lose'>
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
		}
		return (
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						{content}
					</FormWrapper>
		)
	}
}
const ProductForm =createForm()(Traderulesplug);
export default ProductForm;
