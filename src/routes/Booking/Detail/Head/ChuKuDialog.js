import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
//引入select插件
import AddSelect from '../../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../../components/Dialog/Confirm';
import DataTime from  '../../../../components/Calendar/Calendar';
import Input from '../../../../components/FormValidating/FormValidating';
import WebData from '../../../../common/WebData';

// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, {Option,ConstMiniSelect} from '../../../../components/Select'; // 下拉
import xt from '../../../../common/xt'; // 下拉
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax} from '../../../../services/apiCall';
import Table from '../../../../components/Table';
export class Productplug extends Component{
	constructor(props){
		super(props);
		this.state={
			data:[]
		}

		this.onCancel = this.onCancel.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
	}
	onSaveAndClose(isAdd){
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				// if(this.props.DialogContent == 1){
				// 	this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				// }else{
				// 	this.props.onSaveAndClose(this.props.form.getFieldsValue(),{},isAdd);
				// }this.props.form.resetFields();
				let {data} = this.props;
				let obj = data;
				for(var i= 0;i <obj.outList.length;i++){
					obj.outList[i].nums = value.outList[i].nums;
				}
				apiPost(API_FOODING_ERP,'/shipping/noticeOut',obj,(response)=>{
					    this.props.onCancel();
					    this.props.onPackUp();
						ServiceTips({text:response.message,type:'sucess'});
				},(error)=>{
					ServiceTips({text:error.message,type:'error'});
				});
				
			}
		})
	}
	onCancel(){
		const {form, onCancel} = this.props;
		this.props.onCancel();
		this.props.form.resetFields();
	}
	onClick(){
		
	}
	componentDidMount(){
		let {selectRow} = this.props;
		console.log(selectRow);
		apiGet(API_FOODING_ERP,'/shipping/getNotice',{billId:selectRow[0].billId},(response)=>{
			this.setState({
				data:response.data
			});
		},(error)=>{

		});
	}
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps} = this.props.form;
		let {data} = this.props;
		let getOne = data.shippingOrder;
		let content = <div></div>;
			content = (
           	<div className={'addnormal'} style={{marginBottom:'10px'}}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100379/*产品*/)}</label>
								<Select 
															value={getOne["mtl"+language]}
															animation='slide-up'
															placeholder=''
														    optionLabelProp="children"
															optionFilterProp="children"	
															disabled						
															className ={getFieldError('mtlId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}								
														>	
								</Select>
							</div>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200333/*发运数量*/)}</label>
								<input type='text' className={'col-xs-8 col-md-8 text-input-nowidth'} 
														placeholder=""
													    value={getOne.sendQty}
														disabled
								/>
							</div>
							<div className="form-group col-md-4 col-lg-4">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400035/*产品单位*/)}</label>
								<Select 
															value={getOne["uom"+language]}
															animation='slide-up'
															placeholder=''
														    optionLabelProp="children"
															optionFilterProp="children"	
															disabled						
															className ={getFieldError('uomId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}								
														>	
								</Select>
							</div>
						</div>
						<div className="common-party">
							<div className="common-party-table">
								<Table
									columns={[{
										title : i18n.t(400048/*单据编号*/),
										dataIndex : 'mtl',
										key : "no",
										width : '40%',
										render(data,row,index){
											return <div>{data.no}</div>;
										}
									},{
										title : i18n.t(400025/*仓库*/),
										dataIndex : "mtl",
										key : "mtl",
										width : "10%",
										render(data,row,index){
											return <div className={'text-ellipsis'}>{data["receSl"+language]}</div>;
										}
									},{
										title : i18n.t(100319/*采购数量*/),
										dataIndex : "qty",
										key : "qty",
										width : "15%",
										render(data,row,index){
											return data;
										}
									},{
										title : i18n.t(500140/*已操作数量*/),
										dataIndex : "hasBeenQty",
										key : "hasBeenQty",
										width : "15%",
										render(data,row,index){
											return data;
										}
									},{
										title : i18n.t(500163/*出库数量*/),
										dataIndex : "nums",
										key : "nums",
										width : "20%",
										ignore_equals: true,
										render(data,row,index){
											let validate = (rule, value, callback) => {
								            	if(value.trim() === '') return callback([])
								                if((parseFloat(value)+parseFloat(row.hasBeenQty))>parseFloat(getOne.sendQty)){
								                    callback([i18n.t(200380/*出库数量过大*/)]);
								                } 
								            };
											return <input className={getFieldError('outList['+index.index+'].nums')?'text-input-nowidth error-border':'text-input-nowidth'}
											style={{width:'100%'}}
											{...getFieldProps('outList['+index.index+'].nums',{
															validateFirst:true,
															rules:[{required:true},validate],
															valuedateTrigger:'onBlur',
															initialValue:data?String(data):''
											})} 
											/> ;
										}
									}]}
									data={data.outList}
									checkboxConfig={{show:false}}
									colorFilterConfig={{show:false}}
									followConfig={{show:false}}
									prefixCls={"rc-confirm-table"}
									scroll={{x:false, y:300}}
								/>
							</div>
						</div>
					
						
					</div>
			</div>
           	);

           	return (
					<div className="package-action-buttons">
							<FormWrapper showFooter={true} 
							onSaveAndClose={this.onSaveAndClose.bind(this)} onCancel={this.onCancel}
							>
								{content}
							</FormWrapper>
					</div>
				)
		}
}
const ProductForm =createForm()(Productplug);
export default ProductForm;
