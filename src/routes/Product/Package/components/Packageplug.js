import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import Select, { Option } from 'rc-select';
import Radio from '../../../../components/Radio';
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import Calendar from  '../../../../components/Calendar/Calendar';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import Input from '../../../../components/FormValidating/FormValidating';
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
		let object=Object.assign({},{sourceId:this.props.sourceId,dataTyId:20});
		apiGet(API_FOODING_DS,'/wrapgPrice/getInit',{sourceId:this.props.sourceId,dataTyId:20},(response)=>{
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
		info.packagings = info.packagings ||[];
		info.currens = info.currens || [];
		let content = <div></div>;
		getFieldProps('dataTyId', {
		      initialValue: 20,
		});
		 getFieldProps('sourceId',{
									initialValue:this.props.sourceId,
			});
		if(this.props.DialogContent == 1){
			content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100596/*包装名称*/)}</label>
								<Select
										animation='slide-up'
										onClick={this.onClick}
										placeholder=''
										className ={ getFieldError("packId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										optionLabelProp="children"
										{...getNFieldProps('packId',{
											validateFirst: true,
											rules: [{required:true}],
											initialValue:''
										})}
										>
										{
											info.packagings.map((e,i)=>{
												return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
											})
										}
								</Select>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(200933/*包装单价*/)}</label>
								<Input form={this.props.form} obj={{name:'wrapPrice',type:'text', 
										initialValue:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500125/*货币*/)}</label>
								<Select
										animation='slide-up'
										onClick={this.onClick}
										placeholder=''
										className ={ getFieldError("curcyId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										optionLabelProp="children"
										{...getNFieldProps('curcyId',{
											validateFirst: true,
											rules: [{required:true}],
											initialValue:''
										})}
										>
										{
											info.currens.map((e,i)=>{
												return  <Option value={e.id+""} title={e.name} key={i}>{e.name}</Option>
											})
										}
								</Select>
							</div>
							<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100286/*生效日期*/)}</label>
							<div className={'col-md-9 col-lg-9 datetime'}>
								<Calendar 
									showTime={false}
									isShowIcon={true}
									form={this.props.form} 
									name={'validDate'}
									width={'100%'}
									validate={true}
								/>
							</div>
						</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(100287/*失效日期*/)}</label>
								<div className={'col-md-9 col-lg-9 datetime'}>
									<Calendar 
										showTime={false}
										isShowIcon={true}
										form={this.props.form} 
										width={'100%'}
										name={'endDate'}
										validate={true}
									/>
								</div>
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
			getFieldProps('id', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.id:''
			});
			getFieldProps('optlock', {
							            	validateFirst: true,
						                    initialValue:checkedData? checkedData.optlock:''
			})
			   content = (	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(100596/*包装名称*/)}</label>
								<Select
										animation='slide-up'
										onClick={this.onClick}
										placeholder=''
										className ={ getFieldError("packId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										optionLabelProp="children"
										{...getNFieldProps('packId',{
											validateFirst: true,
											rules: [{required:true}],
											initialValue:checkedData.packaging?{s_label:checkedData.packaging.name,packId:checkedData.packaging.id}:undefined
										})}
										>
										{
											info.packagings.map((e,i)=>{
												return  <Option value={String(e.id)} title={e.name} key={i}>{e.name}</Option>
											})
										}
								</Select>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(200933/*包装单价*/)}</label>
								<Input form={this.props.form} obj={{name:'wrapPrice',type:'text', 
										initialValue:checkedData&&checkedData.wrapPrice?checkedData.wrapPrice:'',
										classn:'col-md-9 col-lg-9 text-input-nowidth'}}/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-xs-3 col-md-3'}><span>*</span>{i18n.t(500125/*货币*/)}</label>
								<Select
										animation='slide-up'
										onClick={this.onClick}
										placeholder=''
										className ={ getFieldError("curcyId") ?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
										optionLabelProp="children"
										{...getNFieldProps('curcyId',{
											validateFirst: true,
											rules: [{required:true}],
											initialValue:checkedData.curren?{s_label:checkedData.curren.name,curcyId:checkedData.curren.id}:undefined
										})}
										>
										{
											info.currens.map((e,i)=>{
												return  <Option value={String(e.id)} title={e.name} key={i}>{e.name}</Option>
											})
										}
								</Select>
							</div>
							<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-3 col-lg-3'}>{i18n.t(100286/*生效日期*/)}</label>
							<div className={'col-md-9 col-lg-9 datetime'}>
								<Calendar 
									showTime={false}
									isShowIcon={true}
									form={this.props.form} 
									name={'validDate'}
									width={'100%'}
									validate={true}
									value={checkedData['validDate']}
								/>
							</div>
						</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(100287/*失效日期*/)}</label>
								<div className={'col-md-9 col-lg-9 datetime'}>
									<Calendar 
										showTime={false}
										isShowIcon={true}
										form={this.props.form} 
										width={'100%'}
										name={'endDate'}
										validate={true}
										value={checkedData['endDate']}
									/>
								</div>
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
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(Traderulesplug);
export default ProductForm;
