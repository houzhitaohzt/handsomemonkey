import i18n from './../../../lib/i18n';
import React,{Component,PorpTypes} from "react"
//引入select插件
import Select, { Option } from 'rc-select';
//引入表格
const {Table} = require("../../../components/Table");

import AddSelect from  '../../../components/AddRadio/components/AddSelect';
import Calendar from  '../../../components/Calendar/Calendar';
import {createForm,FormWrapper} from '../../../components/Form';
import Confirm from '../../../components/Dialog/Confirm';
export class PriceNav extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);
	}
	getData(value,that){
		this.addSelect = that;
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError } = this.props.form;
		getFieldProps('normal', {
		      initialValue: '0',
		 });
		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = <div className="client-add scroll">
										<div className="confirm-left">
											<div className="client-add-line1">
												<div>
													<label><span>*</span>{i18n.t(100379/*产品*/)}</label>
													<Select
													{...getFieldProps('11',{
													validateFirst: true,
													rules: [{required:true,}],
													valuedateTrigger:"onBlur",
													initialValue:''
													})}
													style={{width:270}}
													className ='currency-btn select-from-currency'>
													<Option value ={'0'}>{'dd'}</Option>
												</Select>
												</div>
												<div>
													<label><span>*</span>{i18n.t(100382/*产品规格*/)}</label>
													<input type="text" {...getFieldProps('name', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:''
						                            })} className="text-input" />
												</div>
											</div>
											<div className="client-add-line3">
												<div>
													<label>{i18n.t(200289/*客户产品编码*/)}</label>
													<input type="text" {...getFieldProps('name', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:''
						                            })} className="text-input" />
												</div>
												<div>
													<label><span>*</span>{i18n.t(100422/*利润类型*/)}</label>
													 <Select
														{...getFieldProps('12',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:''
														})}
														style={{width:80,marginRight:10}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
													<input type="text" {...getFieldProps('name', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:''
						                            })} style={{width:179}} className="text-input" />
						                            
												</div>
											</div>
											<div className="client-add-line2">
												<div>
													<label><span>*</span>{i18n.t(100319/*采购数量*/)}</label>
													<input type="text" {...getFieldProps('number', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:''
						                            })} style={{width:179}} className="text-input" />
						                            <Select
														{...getFieldProps('11',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:''
														})}
														style={{width:80,marginLeft:10,marginRight:10}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'}>{'dd'}</Option>
													</Select>
												</div>
												<div className="sex">
													<label>{i18n.t(200113/*采购类型*/)}</label>
													<input
										                type="radio"
										                {...getFieldProps('normal.0', {
										                  exclusive: true,
										                  getValueFromEvent(e) {
										                    return e.target.checked ? '0' : '';
										                  },
										                  getValueProps(value) {
										                    return {
										                      checked: value === '0',
										                    };
										                  },
										                })}
										              /><span>{i18n.t(200290/*非周期*/)}</span>
													<input
										                type="radio"
										                {...getFieldProps('normal.1', {
										                  exclusive: true,
										                  getValueFromEvent(e) {
										                    return e.target.checked ? '1' : '';
										                  },
										                  getValueProps(value) {
										                    return {
										                      checked: value === '1',
										                    };
										                  },
										                })}
										              /><span>{i18n.t(200291/*周期*/)}</span>
												</div>
											</div>
											<div className="client-add-line2">
											<div>
												<label><span>*</span>{i18n.t(200115/*下次采购时间*/)}</label>
												<Calendar width={261}   showTime = {false} isShowIcon={true}/>
											</div>
										</div>
										</div>
									   <div className="chajian">
										<AddSelect getData = {this.getData}
										width ={238}
										addLength={10}
										dataArray={[{title:i18n.t(100449/*竞争对手*/),isMus:false,radio:{type:i18n.t(300009/*手机*/),checked:true},select:i18n.t(300009/*手机*/)}]}
										addobj={{title:i18n.t(100449/*竞争对手*/),isMus:false,radio:{type:i18n.t(300009/*手机*/),checked:false},select:i18n.t(300009/*手机*/)}}
										/>
									   </div>
								   </div>
		}else if(this.props.DialogContent==2){
			   Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				    console.log('ok, got it');
				}
			   });
			   return false;
			//content = <div style={{paddingTop:20}}>删除后将无法恢复，您确定删除吗？</div>;
		}else if(this.props.DialogContent==3){
			content = <div className='no-footer'>自动报价后将无法撤回，您确定要报价吗？</div>;
		}else if(this.props.DialogContent==4){
			content = <div className='no-footer'>更新价格后将无法恢复，您确定要更新吗？</div>;
		}else if(this.props.DialogContent==5){
			content = <div className='scroll scroll-style'>
						<AddSelect 
							getData={this.getData}
						    dataArray = {this.props.contentDate.dataArray}
							addobj = {this.props.contentDate.addobj}
						/>
				</div>;
				if(this.addSelect){
					this.addSelect.state.array= this.props.contentDate.dataArray;
				}
		}else if(this.props.DialogContent==6){
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
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.props.onSaveAndClose} onCancel={this.props.onCancel}>
						{content}
					</FormWrapper>
		)
	}
}
const ProductForm =createForm()(PriceNav);
export default ProductForm;
