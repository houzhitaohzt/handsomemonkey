import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../Form';
import Select, { Option } from 'rc-select';
import Calendar from  '../../Calendar/Calendar';
import Checkbox from '../../CheckBox';

export class SystemCommonDialog extends Component{
	constructor(props) {
		super(props);
		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onChange = this.onChange.bind(this);
	}
	onSaveAndClose(){
		this.props.onSaveAndClose();
	}
	onCancel(){
		this.props.onCancel();

	}
	onChange(e){

	}
	render(){
		let content;
		const { getFieldProps, getFieldError } = this.props.form;
		let {data,id} = this.props;
		if(data.number == 3){
				 content = (<div  className='scroll lose scroll-style'>
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
				</div>);
		}else if(id == 22){
			//表示计量单位
			if(data.number == 0 || data.number == 1){
				content =(<div className="contact-bianji scroll">
							<span>*</span>	
							<label>{i18n.t(100589/*计量单位*/)}</label>
							<Select
								{...getFieldProps('unit',{
								validateFirst: true,
								rules: [{required:true,}],
								valuedateTrigger:"onBlur",
								initialValue:data.number == 1 ? '':data.record.creatdate
								})}
								style={{width:100,marginRight:15}}
								className ='currency-btn select-from-currency'>
								<Option value ={'0'}>{'dd'}</Option>
							</Select>
							<span>*</span>	
							<label>{i18n.t(100591/*基础计量*/)}</label>
							 <Checkbox
				              style={{marginRight:10}}
				              onChange={this.onChange}
				            />
				            <label>{i18n.t(100592/*采购计量*/)}</label>
							 <Checkbox
				              style={{marginRight:10}}
				              onChange={this.onChange}
				            />
				             <label>{i18n.t(100593/*销售计量*/)}</label>
							 <Checkbox
				              onChange={this.onChange}
				              style={{marginRight:10}}
				            />
				            <span>*</span>	
							<label>{i18n.t(100594/*基础单位数量*/)}</label>
							<input type="text" {...getFieldProps('count', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:data.number== 1 ? '':data.record.endtime
						   })} className="text-input" />
						</div>);
			}
		}else if(id == 23){
			//箱型装载数据
			if(data.number == 0 || data.number == 1){
				content =(
						<div className='action-normal-buttons'>
						  <div className="client-normal-add scroll">
								<div className="client-normal-add-line1">
								 	<div>
								 		<label><span>*</span>{i18n.t(100596/*包装名称*/)}</label>
										<Select
											placeholder=''
											optionLabelProp='children'
											{...getFieldProps('unit',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:data.number == 1 ? '':data.record.creatdate
											})}
											style={{width:250,marginRight:15}}
											className ='currency-btn select-from-currency'>
											<Option value ={'0'} title={'0'}>{'dd'}</Option>
										</Select>
								 	</div>
								 	<div>
								 		<label><span>*</span>{i18n.t(100214/*箱型*/)}</label>
										<Select
											placeholder =''
											{...getFieldProps('unit',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:data.number == 1 ? '':data.record.direction
											})}
											style={{width:250,marginRight:15}}
											className ='currency-btn select-from-currency'>
											<Option value ={'0'}>{'dd'}</Option>
										</Select>
								 	</div>
								 	<div>
								 		<label><span>*</span>{i18n.t(100598/*箱型数量*/)}</label>
								 		<input placeholder =''
								 		type="text" {...getFieldProps('theme', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:data.number == 1 ? '':data.record.theme
						   				})}   className="text-input" />
	
								 	</div>
								</div>
								<div className="client-normal-add-line1">
								 	<div>
								 		<label><span>*</span>{i18n.t(100589/*计量单位*/)}</label>
										<Select
											placeholder =''
											{...getFieldProps('unit',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:data.number == 1 ? '':data.record.starttime
											})}
											style={{width:250,marginRight:15}}
											className ='currency-btn select-from-currency'>
											<Option value ={'0'}>{'dd'}</Option>
										</Select>
								 	</div>
								 	<div>
								 		<label>{i18n.t(100124/*托盘类型*/)}</label>
										<Select
											placeholder =''
											{...getFieldProps('unit',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:data.number == 1 ? '':data.record.endtime
											})}
											style={{width:250,marginRight:15}}
											className ='currency-btn select-from-currency'>
											<Option value ={'0'}>{'dd'}</Option>
										</Select>
								 	</div>
								 	<div>
								 		<label><span>*</span>每件盘件数</label>
								 		<input placeholder ='' type="text" {...getFieldProps('count', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:data.number == 1 ? '':data.record.count
						   				})}   className="text-input" />
								 	</div>
								</div>
							</div>
						</div>);
			}
		}else if(id == 24){
			//产品规格细分
			if(data.number == 0 || data.number == 1){
				content =(
						<div className='action-normal-buttons'>
						  <div className="client-normal-add scroll">
								<div className="client-normal-add-line1">
								 	<div>
								 		<label>{i18n.t(100602/*主要*/)}</label>
								 		 <Checkbox
							              style={{marginRight:10}}
							              onChange={this.onChange}
							            />
							            <label><span>*</span>规格名称</label>
										<Select
											placeholder=''
											optionLabelProp='children'
											{...getFieldProps('direction',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:data.number == 1 ? '':data.record.direction
											})}
											style={{width:250,marginRight:15}}
											className ='currency-btn select-from-currency'>
											<Option value ={'0'} title={'0'}>{'dd'}</Option>
										</Select>
										<Select
											placeholder=''
											optionLabelProp='children'
											{...getFieldProps('theme',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:data.number == 1 ? '':data.record.theme
											})}
											style={{width:150,marginRight:15}}
											className ='currency-btn select-from-currency'>
											<Option value ={'0'} title={'0'}>{'dd'}</Option>
										</Select>
										<input placeholder ='' type="text" {...getFieldProps('starttime', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:data.number == 1 ? '':data.record.starttime
						   				})} style={{width:150}} className="text-input" />
								 	</div>
								</div>
								<div className="client-normal-add-line1">
								 	<div>
								 		<label style={{width:192}}>{i18n.t(100606/*测试方法*/)}</label>
										<Select
											placeholder =''
											{...getFieldProps('endtime',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:data.number == 1 ? '':data.record.endtime
											})}
											style={{width:250,marginRight:15}}
											className ='currency-btn select-from-currency'>
											<Option value ={'0'}>{'dd'}</Option>
										</Select>
										<label><span>*</span>指标检测值</label>
								 		<input placeholder ='' type="text" {...getFieldProps('count', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:data.number == 1 ? '':data.record.count
						   				})} style={{width:225}} className="text-input" />
								 	</div>
								</div>
							</div>
						</div>);
			}
		}else if(id == 25){
			//产品包装
			if(data.number == 0 || data.number == 1){
				content =(
						<div className='action-normal-buttons'>
						  <div className="client-normal-add scroll">
								<div className="client-normal-add-line1">
								 	<div>
							            <label><span>*</span>{i18n.t(100596/*包装名称*/)}</label>
										<Select
											placeholder=''
											optionLabelProp='children'
											{...getFieldProps('direction',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:data.number == 1 ? '':data.record.direction
											})}
											style={{width:200,marginRight:15}}
											className ='currency-btn select-from-currency'>
											<Option value ={'0'} title={'0'}>{'dd'}</Option>
										</Select>
										<label><span>*</span>{i18n.t(100040/*重量单位*/)}</label>
										<Select
											placeholder=''
											optionLabelProp='children'
											{...getFieldProps('direction',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:data.number == 1 ? '':data.record.direction
											})}
											style={{width:90,marginRight:15}}
											className ='currency-btn select-from-currency'>
											<Option value ={'0'} title={'0'}>{'dd'}</Option>
										</Select>
										<label><span>*</span>{i18n.t(100551/*净重量*/)}</label>
										<input placeholder ='' type="text" {...getFieldProps('starttime', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:data.number == 1 ? '':data.record.starttime
						   				})} style={{width:90}} className="text-input" />
						   				<label><span>*</span>{i18n.t(100553/*毛重量*/)}</label>
										<input placeholder ='' type="text" {...getFieldProps('starttime', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:data.number == 1 ? '':data.record.starttime
						   				})} style={{width:90}} className="text-input" />
								 	</div>
								</div>
								<div className="client-normal-add-line1">
								 	<div>
							            <label><span>*</span>{i18n.t(100425/*包装自重*/)}</label>
										<input placeholder ='' type="text" {...getFieldProps('starttime', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:data.number == 1 ? '':data.record.starttime
						   				})} style={{width:200,marginRight:15}} className="text-input" />
										<label><span>*</span>{i18n.t(100426/*体积单位*/)}</label>
										<Select
											placeholder=''
											optionLabelProp='children'
											{...getFieldProps('direction',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:data.number == 1 ? '':data.record.direction
											})}
											style={{width:90,marginRight:15}}
											className ='currency-btn select-from-currency'>
											<Option value ={'0'} title={'0'}>{'dd'}</Option>
										</Select>
										<label><span>*</span>{i18n.t(100223/*体积量*/)}</label>
										<input placeholder ='' type="text" {...getFieldProps('starttime', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:data.number == 1 ? '':data.record.starttime
						   				})} style={{width:90}} className="text-input" />
						   				<label><span>*</span>{i18n.t(100557/*基础包装*/)}</label>
										 <Checkbox
							              style={{marginRight:10}}
							              onChange={this.onChange}
							            />
								 	</div>
								</div>
							</div>
						</div>);
			}
		}else if(id == 26){
			//产品别名
			if(data.number == 0 || data.number == 1){
				content =(
						<div className='action-normal-buttons'>
						  <div className="client-normal-add scroll">
								<div className="client-normal-add-line1">
								 	<div>
							            <label><span>*</span>别名</label>
										<Select
											placeholder=''
											optionLabelProp='children'
											{...getFieldProps('direction',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:data.number == 1 ? '':data.record.direction
											})}
											style={{width:300,marginRight:15}}
											className ='currency-btn select-from-currency'>
											<Option value ={'0'} title={'0'}>{'dd'}</Option>
										</Select>
								 	</div>
								</div>
							</div>
						</div>);
			}
		}else if(id == 27){
			//BOM维护
			if(data.number == 0 || data.number == 1){
				content =(
						<div className='action-normal-buttons'>
						  <div className="client-normal-add scroll">
								<div className="client-normal-add-line1">
								 	<div>
							            <label><span>*</span>原材料</label>
										<Select
											placeholder=''
											optionLabelProp='children'
											{...getFieldProps('direction',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:data.number == 1 ? '':data.record.direction
											})}
											style={{width:200,marginRight:15}}
											className ='currency-btn select-from-currency'>
											<Option value ={'0'} title={'0'}>{'dd'}</Option>
										</Select>
										 <label style={{width:50}}><span>*</span>{i18n.t(200080/*类型*/)}</label>
										<Select
											placeholder=''
											optionLabelProp='children'
											{...getFieldProps('direction',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:data.number == 1 ? '':data.record.direction
											})}
											style={{width:100,marginRight:15}}
											className ='currency-btn select-from-currency'>
											<Option value ={'0'} title={'0'}>{'dd'}</Option>
										</Select>
										<label><span>*</span>每单位数量</label>
										<input placeholder ='' type="text" {...getFieldProps('starttime', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:data.number == 1 ? '':data.record.starttime
						   				})} style={{width:100}} className="text-input" />
						   				<label><span>*</span>比例%</label>
										<input placeholder ='' type="text" {...getFieldProps('starttime', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:data.number == 1 ? '':data.record.starttime
						   				})} style={{width:100}} className="text-input" />
								 	</div>
								</div>
							</div>
						</div>);
			}
		}else if(id == 28){
			//供应品牌与原产地制造厂商
			if(data.number == 0 || data.number == 1){
				content =(
						<div className='action-normal-buttons'>
						  	<div className="client-normal-add scroll">
								<div className="client-normal-add-line1">
								 	<div>
							            <label><span>*</span>主品牌</label>
										<Select
											placeholder=''
											optionLabelProp='children'
											{...getFieldProps('creatdate',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:data.number == 1 ? '':data.record.creatdate
											})}
											style={{width:150,marginRight:15}}
											className ='currency-btn select-from-currency'>
											<Option value ={'0'} title={'0'}>{'dd'}</Option>
										</Select>
										<label><span>*</span>制造厂商</label>
										<Select
											placeholder=''
											optionLabelProp='children'
											{...getFieldProps('direction',{
											validateFirst: true,
											rules: [{required:true,}],
											valuedateTrigger:"onBlur",
											initialValue:data.number == 1 ? '':data.record.direction
											})}
											style={{width:200,marginRight:15}}
											className ='currency-btn select-from-currency'>
											<Option value ={'0'} title={'0'}>{'dd'}</Option>
										</Select>
										<label style={{width:108}}><span>*</span>原产国家/地区</label>
										<input placeholder ='' type="text" {...getFieldProps('theme', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:data.number == 1 ? '':data.record.theme
						   				})} style={{width:90}} className="text-input" />
								 	</div>
								</div>
							</div>
						</div>);
			}
		}else if(id == 29){
			//产品包装计费
			if(data.number == 0 || data.number == 1){
				content =(
						<div className='action-normal-buttons'>
						  	<div className="client-normal-add scroll">
								<div className="client-normal-add-line1">
								                <div>
													<label><span>*</span>{i18n.t(100596/*包装名称*/)}</label>
													<Select
														placeholder=''
														optionLabelProp='children'
														{...getFieldProps('creatdate',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:data.number == 1 ? '':data.record.creatdate
														})}
														style={{width:300,marginRight:15}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'} title={'0'}>{'dd'}</Option>
													</Select>
												</div>
												<div>
													<label><span>*</span>包装单价</label>
													<input placeholder ='' type="text" {...getFieldProps('direction', {
														validateFirst: true,
						                                rules: [
						                                    {
						                                    required: true,
						                                    }
						                                ],
						                                validateTrigger: 'onBlur',
						                                initialValue:data.number == 1 ? '':data.record.direction
						   									})} style={{width:150}} className="text-input" />
													<label style={{width:50}}><span>*</span>{i18n.t(500125/*货币*/)}</label>
													<Select
														placeholder=''
														optionLabelProp='children'
														{...getFieldProps('theme',{
														validateFirst: true,
														rules: [{required:true,}],
														valuedateTrigger:"onBlur",
														initialValue:data.number == 1 ? '':data.record.theme
														})}
														style={{width:90,marginRight:15}}
														className ='currency-btn select-from-currency'>
														<Option value ={'0'} title={'0'}>{'dd'}</Option>
													</Select>
												</div>
								</div>
								<div className="client-normal-add-line1">
												<div>
													<label><span>*</span>{i18n.t(100286/*生效日期*/)}</label>
													<Calendar width={300}   
													showTime = {false} 
													isShowIcon={true}
													 form={this.props.form}
     												 name={'name'}/>
												</div>
												<div>
													<label style={{marginLeft:15}}><span>*</span>{i18n.t(500120/*终止日期*/)}</label>
													<Calendar width={300} 
													  showTime = {false} 
													  isShowIcon={true}
													   form={this.props.form}
      													name={'name'}/>
												</div>
								</div>
							</div>
						</div>);
			}
		}
		return (
			<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
	           {content}
			</FormWrapper>
			);
	}
}
const SystemCommon =createForm()(SystemCommonDialog);
export default SystemCommon;
