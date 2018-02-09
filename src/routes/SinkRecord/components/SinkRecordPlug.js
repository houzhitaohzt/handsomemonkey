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
import xt from '../../../common/xt';


// ajax
import {getUser,apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';




export class LogPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);

		// init func
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		
		this.handleCompany = this.handleCompany.bind(this);
		this.handleCurrency = this.handleCurrency.bind(this);
		this.handleTakeMode = this.handleTakeMode.bind(this);
		this.handleBankNumber = this.handleBankNumber.bind(this);
		
		this.changeCompany = this.changeCompany.bind(this);
		this.changeCurrency = this.changeCurrency.bind(this);
		
						
		
		
		
		
		


		// init state
		this.state = {
			company: [{id:1,localName:''}], // 收款企业
			bankNumber: [{id:1,bankName:'',bacctCode:''}], // 收款账号
			currency: [{id:1,localName:''}], // 币种
			takeMode: [{id:1,localName:''}], // 收汇方式
			country: [{id:1,localName:''}], // 收汇账号
			testCompany: '', // 企业临时ID
			testCurrency: '', // 货币临时ID




			// 销售单号 请求
			changeNumber:{	
				pamts:'',
				cnyEnName:'',
				cnyId:'',
				cnyLcName:'',
				saleStaffEnName:'',
				saleStaffId:'',
				saleStaffLcName:'',
				
			}, 

		};

	}

	componentDidMount(){

    };
	componentWillUnmount() {
	}

	getData(value,that){
		this.addSelect = that;
	}

	// 收款企业
	handleCompany(){
		// apiGet(API_FOODING_ES,'/party/getLoginCompanies',{clusId:this.props.checkedData.clusterId},
		// 	(response)=>{							
		// 		this.setState({	company: response.data });
		// 	},(errors)=>{
		// 		ServiceTips({text:errors.message,type:'error'});
		// });
		let sourceId = getUser().staff.ccid;	// 企业ID 
		apiGet(API_FOODING_DS,'/partner/getListBySourceId?&dataTyId=60&isAddSelf=true',{sourceId: sourceId},
			(response)=>{							
				this.setState({	company: response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 收款 企业 切换
	changeCompany(ID){
		this.setState({ testCompany:ID });		
	}
	
	// 币种 ajax 
	handleCurrency(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.currency,
			(response)=>{							
				this.setState({	currency:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}	

	// 币种 切换 
	changeCurrency(ID){

		this.setState({ testCurrency:ID });
	}

	// 收款账号 ajax 
	handleBankNumber(){
		if( !this.state.testCompany && !this.props.checkedData['billId'] ){
			ServiceTips({text:i18n.t(200993/*请选择企业*/),type:'error'});			
		} else if( !this.state.testCurrency && !this.props.checkedData['billId'] ){
			ServiceTips({text:i18n.t(100503/*请选择账户币种*/),type:'error'});			
		} else{

			this.props.form.validateFields((errors, value) => {
				
				apiGet(API_FOODING_DS,'/bankacct/getList',{sourceId: value['receiptCcId'],curcyId: value['cnyId']},
					(response)=>{							
						this.setState({	
							bankNumber: response.data 
						});
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			})

		}
		
	}

	// 收汇方式 ajax 
	handleTakeMode(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.takeMode,
			(response)=>{							
				this.setState({	takeMode:response.data });
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
				// if( !Number(value['receiptAmt']) ){
				// 	ServiceTips({text:'收款金额必须为大于0的数字！',type:'info'});
				// 	return;
				// }				
				apiPost(API_FOODING_ERP,'/foreexchange/save',value,
					(response)=>{	
							ServiceTips({text:response.message,type:'success'});
							that.props.form.resetFields(); // 清除表单
							that.props.onSaveAndClose(); // 关闭弹框
							that.props.getPage();	// 刷新页面

							that.setState({
								changeNumber:{	
									pamts:'',
									cnyEnName:'',
									cnyId:'',
									cnyLcName:'',
									saleStaffEnName:'',
									saleStaffId:'',
									saleStaffLcName:'',
									
								},
								testCompany:'',
								testCurrency:'',
							});
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})		
	}

	// 取消
	onCancel(){
		this.setState({ portTypeVal: '', portTypeResult: false, portTypeID: '', 
			changeNumber:{	
				pamts:'',
				cnyEnName:'',
				cnyId:'',
				cnyLcName:'',
				saleStaffEnName:'',
				saleStaffId:'',
				saleStaffLcName:'',
				
			},	
			testCompany:'',
			testCurrency:'',
			
		},function(){
			this.props.form.resetFields(); // 清除表单
			this.props.onSaveAndClose(); // 关闭弹框

		});

	}


	render(){
		let that = this;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		let {checkedData} = this.props;

		// 编辑 保存 参数
		getNFieldProps('billId', {
			initialValue: checkedData ? checkedData['billId'] : '',
		});

		getNFieldProps('optlock', {
			initialValue: checkedData ? checkedData['optlock'] : '',
		});

		getNFieldProps('status', {
			initialValue: checkedData ? checkedData['status'] : '',
		});

		getNFieldProps('no', {
			initialValue: checkedData ? checkedData['no'] : '',
		});

		getNFieldProps('receiptDate', {
			initialValue: checkedData ? checkedData['receiptDate'] : '',
		});		

		let content =            	
			<div className="addnormal girdlayout scroll">
				<div className="row">
					<div className="col-md-6">
						<label className="col-md-3">{i18n.t(100323/*业务日期*/)}</label>
						<div className="col-md-9">
							<Calendar 
								width={300}  
								showTime = {false} 
								isShowIcon={true} 
								form={this.props.form}
								validate={true}
								className ={getFieldError('billDate')?'error-border':''}
								name={'billDate'}
								value={checkedData['billDate']}												
							/>
						</div>						
					</div>
					<div className="col-md-6">
						<label className="col-md-3"><span>*</span>{i18n.t(500083/*收款企业*/)}</label>
						<div className="col-md-9">
							<Select
								{...getNFieldProps('receiptCcId',{
									rules: [{required:true,}],								
									initialValue: checkedData['receiptCcId'] ? 
													{ s_label: checkedData['receiptCc'+language],receiptCcId:checkedData.receiptCcId,receiptCcLcName:checkedData.receiptCcLcName,receiptCcEnName:checkedData.receiptCcEnName} 
													: 
													''																
								})} 
								optionLabelProp="children"
								placeholder={''}
								style={{width:300,marginRight:15}}
								className ={getFieldError('receiptCcId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handleCompany}	
								onSelect={this.changeCompany}						
							>
								{this.state.company.map((o,i)=><Option key={o.id} objValue={{s_label:o['enterprise'+language],receiptCcId:o.enterpriseId,receiptCcLcName:o.enterpriseLcName,receiptCcEnName:o.enterpriseEnName}} title={o['enterprise'+language]}>{o['enterprise'+language]}</Option>)}
							</Select>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6">
						<label className="col-md-3"><span>*</span>{i18n.t(100284/*币种*/)}</label>
						<div className="col-md-6">
							<Select
								placeholder=''
								{...getNFieldProps('cnyId',{
									rules: [{required:true}],
									initialValue: checkedData['cnyId'] ? 
													{ s_label: checkedData['cny'+language], cnyId: checkedData.cnyId, cnyLcName: checkedData.cnyLcName, cnyEnName: checkedData.cnyEnName} 
													: 
													''								
								})}
								optionLabelProp="children"
								style={{width:300,marginRight:15}}
								className ={getFieldError('cnyId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handleCurrency}
								onSelect={this.changeCurrency}
							>
								{this.state.currency.map((o,i)=><Option key={o.id} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>							
						</div>
					</div>
					<div className="col-md-6">
						<label className="col-md-3"><span>*</span>{i18n.t(200614/*收汇方式*/)}</label>
						<div className="col-md-6">	
							<Select
								placeholder=''
								{...getNFieldProps('payTrmTyId',{
									rules: [{required:true}],
									initialValue: checkedData['payTrmTyId'] ? 
													{ s_label: checkedData['payTrmTy'+language], payTrmTyId: checkedData.payTrmTyId, payTrmTyLcName: checkedData.payTrmTyLcName, payTrmTyEnName: checkedData.payTrmTyEnName} 
													: 
													''								
								})}
								optionLabelProp="children"
								style={{width:300,marginRight:15}}
								className ={getFieldError('payTrmTyId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handleTakeMode}
							>
								{this.state.takeMode.map((o,i)=><Option key={i} objValue={{s_label:o.localName, payTrmTyId: o.id, payTrmTyLcName:o.localName, payTrmTyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>
						</div>
					</div>					
				</div>
				<div className="row">
					<div className="col-md-6">
						<label className="col-md-3"><span>*</span>{i18n.t(500086/*收款账号*/)}</label>
						<div className="col-md-6">
							<Select
								placeholder=''
								{...getNFieldProps('receBankAccount',{
									rules: [{required:true}],
									initialValue: checkedData['receBankAccount'] ? 
													{s_label:checkedData.receBankAccount+' ('+checkedData.receBankLcName+')',receBankLcName:checkedData.receBankLcName,receBankAccount:checkedData.receBankAccount}
													: 
													''								
								})} 
								optionLabelProp="children"
								style={{width:300,marginRight:15}}
								className ={getFieldError('receBankAccount')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
								onClick={this.handleBankNumber}
							>
								{this.state.bankNumber.map((o,i)=><Option key={i} objValue={{s_label:o.bankName ? (o.bacctCode+' ('+o.bankName+')') : o.bacctCode,receBankLcName:o.bankName,receBankAccount:o.bacctCode}} title={o.bacctCode+'  ('+o.bankName+')'}>{o.bankName ? (o.bacctCode+' ('+o.bankName+')') : o.bacctCode}</Option>)}
							</Select>														
						</div>
					</div>
					<div className="col-md-6">
						<label className="col-md-3"><span>*</span>{i18n.t(200591/*收款金额*/)}</label>
						<div className="col-md-6">	
							<input type="text" 
								{...getNFieldProps('receiptAmt',{
									rules: [{required:true,pattern:xt.pattern.positiveNonZero}],								
									initialValue: checkedData['receiptAmt'] ? 
													checkedData['receiptAmt']
													: 
													''								
								})} 
								placeholder={i18n.t(201100/*请输入大于0的数字*/)}											
								className ={getFieldError('receiptAmt')?'text-input error-border':'text-input'}													
								style={{width:300,marginRight:15}}
							/>													
						</div>
					</div>					
				</div>	
				<div className="row">
					<div className="col-md-6">
						<label className="col-md-3"><span>*</span>{i18n.t(201097/*摘要*/)}</label>
						<div className="col-md-6">	
							<input type="text" 
								{...getNFieldProps('digest',{
									rules: [{required:true}],								
									initialValue: checkedData['digest'] ? 
													checkedData['digest']
													: 
													''								
								})} 	
								placeholder={''}				
								className ={getFieldError('digest')?'text-input error-border':'text-input'}																				
								style={{width:300,marginRight:15}}
							/>													
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
