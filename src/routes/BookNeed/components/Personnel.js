import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';

import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';


// common 
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option } from '../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';




export class LogPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);

		// init func
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		

		this.handleCompany = this.handleCompany.bind(this);
		this.handleDepartment = this.handleDepartment.bind(this);
		this.handleStaff = this.handleStaff.bind(this);
		
		this.changeDepartment = this.changeDepartment.bind(this);
		this.changeCompany = this.changeCompany.bind(this);
		

		
						
		
		
		
		
		


		// init state
		this.state = {
			company: [{id:1,localName:''}], // 收款企业
			department: [{id:1,localName:''}], // 运营组织
			staff: [{id:1,staffLocalName:''}], // 物流员
			
			departmentTem: null, // 组织 临时 Name
			staffTem: null, // 物流员 临时 Name
			staffID: '', // 物流员 临时 ID 

			ccID:'', // 企业ID


		};

	}

	componentDidMount(){

    };
	componentWillUnmount() {
	}

	getData(value,that){
		this.addSelect = that;
	}




	// 企业 ajax 
	handleCompany(){
		apiGet(API_FOODING_ES,'/party/getLoginCompanies',{},
			(response)=>{							
				this.setState({	company:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}	

	// 企业切换 
	changeCompany(e){
		let that = this;
		this.setState({	
			ccID:e,
			staffTem:'',
			departmentTem:'',
		},function(){
			that.props.form.resetFields(['lsStaffId','plantId']); 			
		});
	}

	// 运营组织 ajax 
	handleDepartment(){
		apiGet(API_FOODING_ES,'/party/getPartysByType',{partyId:this.state.ccID || this.props.getOne.ccId,typeAttributeIds:["43"]},
			(response)=>{							
				this.setState({	department:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}	

	// 运营组织 切换 
	changeDepartment(e){

		let that = this;
		this.setState({	
			staffID:e,
			staffTem:'',
		},function(){
			that.props.form.resetFields(['lsStaffId']); 			
		});
	}

	// 物流员 ajax 
	handleStaff(){
		apiGet(API_FOODING_ES,'/user/getListForPermissionsInParty',{partyId:this.state.staffID || this.props.getOne.plantId,typeAttributeIds:[609,610]},
			(response)=>{							
				this.setState({	staff:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 保存
	onSaveAndClose(){


		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_ERP,'/shipping/assignStaff',value,
					(response)=>{	
							ServiceTips({text:response.message,type:'success'});
							that.props.form.resetFields(); // 清除表单
							that.props.onSaveAndClose(); // 关闭弹框
							that.props.getPage();	// 刷新页面
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})		
	}

	// 取消
	onCancel(){
        this.props.form.resetFields(); // 清除表单
        this.props.onSaveAndClose(); // 关闭弹框
	}


	render(){
		let that = this;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		let {getOne} = this.props;

		// 编辑 保存 参数
		getNFieldProps('billId', {
			initialValue: getOne ? getOne['billId'] : '',
		});

	

		let content =            	
			<div className="packageplug-add scroll girdlayout"> 
				<div className="row">
					<div className="col-md-6">
						<label className="col-md-3">{i18n.t(400008/*销售单号*/)}</label>
						<div className="col-md-9">
							<input type="text" 
								{...getFieldProps('sourceNo',{
									initialValue: getOne['sourceNo']								
								})} 
								readOnly										
								className ={'text-input'}													
								style={{width:300,marginRight:15}}
							/>							
						</div>
					</div>
					<div className="col-md-6">
						<label className="col-md-3">{i18n.t(500143/*集团组织*/)}</label>
						<div className="col-md-9">
							<input type="text" 
								{...getFieldProps('clusterId',{
									initialValue: getOne['cluster'+language]								
								})} 
								readOnly											
								className ={'text-input'}													
								style={{width:300,marginRight:15}}
							/>							
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6">
						<label className="col-md-3"><span>*</span>{i18n.t(100244/*企业*/)}</label>
						<div className="col-md-9">
							<Select
								placeholder=''
								{...getNFieldProps('ccId',{
									rules: [{required:true}],
									initialValue: getOne['ccId'] ? 
													{ s_label: getOne['cc'+language], ccId: getOne.ccId, ccLcName: getOne.ccLcName, ccEnName: getOne.ccEnName} 
													: 
													''								
								})}
								optionLabelProp="children"
								style={{width:300,marginRight:15}}
								className ={getFieldError('ccId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handleCompany}
								onSelect={this.changeCompany}							
							>
								{this.state.company.map((o,i)=><Option key={o.id} objValue={{s_label:o.localName, ccId: o.id, ccLcName:o.localName, ccEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>							
						</div>
					</div>
					<div className="col-md-6">
						<label className="col-md-3"><span>*</span>{i18n.t(200322/*运营组织*/)}</label>
						<div className="col-md-9">
							<Select
								{...getNFieldProps('plantId',{
									rules: [{required:true}],
									initialValue: getOne['plantId'] ? 
													this.state['departmentTem'] == '' ? '' : { s_label: getOne['plant'+language], plantId: getOne.plantId, plantLcName: getOne.plantLcName, plantEnName: getOne.plantEnName} 
													: 
													'',
								})}
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								style={{width:300,marginRight:15}}							
								className ={getFieldError('plantId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handleDepartment}
								onSelect={this.changeDepartment}
							>
								{this.state.department.map((o,i)=><Option key={o.id} objValue={{s_label:o.localName, plantId: o.id, plantLcName:o.localName, plantEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>							
						</div>
					</div>					
				</div>
				<div className="row">
					<div className="col-md-6">
						<label className="col-md-3"><span>*</span>{i18n.t(200312/*物流员*/)}</label>
						<div className="col-md-9">
							<Select
								{...getNFieldProps('lsStaffId',{
									rules: [{required:true}],
									initialValue: getOne['lsStaffId'] ? 
													this.state['staffTem'] == '' ? '' : { s_label: getOne['lsStaff'+language], lsStaffId: getOne.lsStaffId, lsStaffLcName: getOne.lsStaffLcName, lsStaffEnName: getOne.lsStaffEnName} 
													: 
													'',
								})}
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								style={{width:300,marginRight:15}}							
								className ={getFieldError('lsStaffId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handleStaff}
							>
								{this.state.staff.map((o,i)=><Option key={i} objValue={{s_label:o['staffLocalName'], lsStaffId: o.refId, lsStaffLcName:o.staffLocalName, lsStaffEnName: o.staffEnName}} title={o.staffLocalName}>{o.staffLocalName}</Option>)}
							</Select>							
						</div>
					</div>
				</div>								              								
			</div>;


		return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} 
						showSaveClose={this.props.showSaveClose}
						buttonLeft = {this.props.buttonLeft} 
						onSaveAndClose={this.onSaveAndClose}
					 	onCancel={this.onCancel}>
						{content}
					</FormWrapper>
			</div>
		)
	}
}
const ProductForm =createForm()(LogPlug);
export default ProductForm;
