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
import {apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';
export class LogPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);

		// init func
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		
		this.handleNumber = this.handleNumber.bind(this);
		this.handleBank = this.handleBank.bind(this);
		
		this.changeNumber = this.changeNumber.bind(this);
		//this.onChangeNumber = this.onChangeNumber.bind(this);
		


		// init state
		this.state = {
			number: ['Loding...'], // 销售单号
			bank: [{id:1,localName:''}], // 交单银行

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

	// 银行账号
	handleBank(){
		apiGet(API_FOODING_DS,'/bankacct/getList',{sourceId:String(this.props.checkedData.ccId )},
			(response)=>{							
				this.setState({	bank: response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	// 销售单号
	handleNumber(){
		apiGet(API_FOODING_ERP,'/common/getNoList',{billType:318},
			(response)=>{							
				this.setState({	number:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	// 销售员 交单记录 货币
	changeNumber(ID){
		let that = this;
		 this.setState({changeNumber:{}});
		  
		apiGet(API_FOODING_ERP,'/presentrecord/getSaleInfo',{sourceNo:ID},
			(response)=>{
				let aaa = response.data;
				let pamt= response.data.pamts
				if(pamt==null){
					pamt=''
				}
				 this.props.form.setFieldsValue({pamts:pamt ,cnyId:{s_label:aaa["cny"+language],cnyId:aaa.cnyId,cnyLcName:aaa.cnyLcName,cnyEnName:aaa.cnyEnName},
				 	saleStaffId:{s_label:aaa["saleStaff"+language],saleStaffId:aaa.saleStaffId,saleStaffLcName:aaa.saleStaffLcName,saleStaffEnName:aaa.saleStaffEnName}});
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
				apiPost(API_FOODING_ERP,'/presentrecord/save',value,
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
									
								}
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
				
			}	
		},function(){
			this.props.form.resetFields(); // 清除表单
			this.props.onSaveAndClose(); // 关闭弹框

		});

	}


	render(){
		let that = this;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		let {checkedData} = this.props;
		const {changeNumber} = this.state;

		// 编辑 保存 参数
		getNFieldProps('billId', {
			initialValue: checkedData ? checkedData['billId'] : '',
		});

		getNFieldProps('optlock', {
			initialValue: checkedData ? checkedData['optlock'] : '',
		});

		let content = <div></div>;
		if(this.props.DialogContent == 1){
           content = (
        <div className={'addnormal'} style={{marginBottom:'10px'}}>
           <div className={'girdlayout  scroll'} style={{height:'290px',overflow:'auto'}}> 
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(100323/*业务日期*/)}</label>
						<div className={'col-md-9 col-lg-9 datetime'}>
							<Calendar 
								width={'100%'}
								showTime = {false} 
								isShowIcon={true} 
								form={this.props.form}
								validate={true}
								name={'billDate'}
								value={checkedData['billDate']}												
							/>
						</div>						
					</div>
					<div  className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(400008/*销售单号*/)}</label>
						<Select
							{...getNFieldProps('salNo',{
								rules: [{required:true,}],								
								initialValue: checkedData['salNo'] ? 
												checkedData['salNo']
												: 
												''																
							})} 
							optionLabelProp="children"														
							placeholder={''}
							className ='col-md-9 col-lg-9 currency-btn select-from-currency'
							onClick={this.handleNumber}	
							onSelect={this.changeNumber}
													
						>
							{this.state.number.map((o,i)=><Option key={i} value={String(o)} title={String(o)}>{String(o)}</Option>)}
						</Select>
												
					</div>
				</div>
				<div className={'row'}>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(400011/*销售员*/)}</label>
						<Select
							{...getNFieldProps('saleStaffId',{
															
								initialValue: checkedData['saleStaffId'] ? 
												{ s_label: checkedData['saleStaff'+language], saleStaffId: checkedData.saleStaffId, saleStaffLcName: checkedData.saleStaffLcName, saleStaffEnName: checkedData.saleStaffEnName} 												
												: 
												{ s_label:changeNumber['saleStaff'+language], saleStaffId: changeNumber.saleStaffId, saleStaffLcName: changeNumber.saleStaffLcName, saleStaffEnName: changeNumber.saleStaffEnName} 																	
							})} 
							optionLabelProp="children"														
							placeholder={i18n.t(100378/*自动生成*/)}
							className ={getFieldError('saleStaffId')?'col-md-9 col-lg-9 currency-btn select-from-currency error-border':'col-md-9 col-lg-9 currency-btn select-from-currency'}
							disabled={true}
							allowClear={false}
													
						>
							
						</Select>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(200647/*交单银行*/)}</label>
						<input type="text" 
							{...getFieldProps('pBankerLcName', {
								rules: [{required:true}],
								initialValue: checkedData['pBankerLcName'] ? 
												checkedData['pBankerLcName']
												: 
												''
							})} 
							className="col-xs-9 col-md-9 text-input-nowidth" 
						/>						
					</div>
				</div>
				<div className="row">
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(200649/*交单金额*/)}</label>
						<input type="text" 
							{...getFieldProps('pamts', {
								initialValue: checkedData['pamts'] ?checkedData['pamts']:changeNumber.pamts
							})} 
							//placeholder={i18n.t(100378/*自动生成*/)}
							//disabled
							className="col-xs-9 col-md-9 text-input-nowidth" 
						/>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(500125/*货币*/)}</label>
						<Select
							{...getNFieldProps('cnyId',{
															
								initialValue: checkedData['cnyId'] ? 
												{ s_label: checkedData['cny'+language], cnyId: checkedData.cnyId, cnyLcName: checkedData.cnyLcName, cnyEnName: checkedData.cnyEnName} 												
												: 
												{ s_label: changeNumber['cny'+language], cnyId: changeNumber.cnyId, cnyLcName: changeNumber.cnyLcName, cnyEnName:changeNumber.cnyEnName} 																	
							})} 
							optionLabelProp="children"														
							placeholder={i18n.t(100378/*自动生成*/)}
							className="col-md-9 col-lg-9 currency-btn select-from-currency" 
							disabled={true}
							allowClear={false}>
													
						</Select>
					</div>
				</div>
				<div className="row">
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(200648/*交单日期*/)}</label>
						<div className={'col-md-9 col-lg-9 datetime'}>
							<Calendar 
								width={'100%'}  
								showTime = {false} 
								isShowIcon={true} 
								form={this.props.form}
								validate={false}
								name={'sendDate'}
								value={checkedData['sendDate']}												
							/>	
						</div>					
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(200655/*信用证号*/)}</label>
						<input type="text" 
							{...getFieldProps('lcno', {
								initialValue: checkedData['lcno'] ? 
												checkedData['lcno'] 
												: 
												''
							})} 
							placeholder={''}
							className="col-xs-9 col-md-9 text-input-nowidth" 
						/>
					</div>
				</div>
				<div className="row">
					<div className="form-group col-md-6 col-lg-6">
						<label  className={'col-md-3 col-lg-3'}>{i18n.t(200656/*银行交单日*/)}</label>
						<div className={'col-md-9 col-lg-9 datetime'}>
							<Calendar 
								width={'100%'}  
								showTime = {false} 
								isShowIcon={true} 
								form={this.props.form}
								validate={false}
								name={'bankdate'}
								value={checkedData['bankdate']}												
							/>
						</div>						
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(200657/*托收行*/)}</label>
						<input type="text" 
							{...getFieldProps('collection', {
								initialValue: checkedData['collection'] ? 
												checkedData['collection'] 
												: 
												''
							})} 
							placeholder={''}
							className="col-xs-9 col-md-9 text-input-nowidth" 
						/>
					</div>
				</div>
				<div className="row">
					<div className="form-group col-md-6 col-lg-6">
						<label  className={'col-md-3 col-lg-3'}>{i18n.t(200658/*托收行地址*/)}</label>
						<input type="text" 
							{...getFieldProps('collectionAdress', {
								initialValue: checkedData['collectionAdress'] ? 
												checkedData['collectionAdress'] 
												: 
												''
							})} 
							placeholder={''}
							className="col-xs-9 col-md-9 text-input-nowidth" 
						/>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label  className={'col-md-3 col-lg-3'}>{i18n.t(200659/*开证行*/)}</label>
						<input type="text" 
							{...getFieldProps('bankname', {
								initialValue: checkedData['bankname'] ? 
												checkedData['bankname'] 
												: 
												''
							})} 
							placeholder={''}
							className="col-xs-9 col-md-9 text-input-nowidth" 
						/>
					</div>
				</div>
				<div className="row">
					<div  className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(200650/*收汇金额*/)}</label>
						<input type="text" 
							{...getFieldProps('receiptAgg', {
								initialValue: checkedData['receiptAgg'] ? 
												checkedData['receiptAgg'] 
												: 
												''
							})}
							placeholder={''}
							className="col-xs-9 col-md-9 text-input-nowidth"
						/>
					</div>
					<div  className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(200660/*收汇日期*/)}</label>
						<div className={'col-md-9 col-lg-9 datetime'}>
							<Calendar 
								width={'100%'}  
								showTime = {false} 
								isShowIcon={true} 
								form={this.props.form}
								validate={false}
								name={'receiptDate'}
								value={checkedData['receiptDate']}												
							/>	
						</div>					
					</div>
				</div>
				<div className="row">
					<div className="form-group col-md-6 col-lg-6">
						<label  className={'col-md-3 col-lg-3'}>{i18n.t(200661/*快递公司*/)}</label>
						<input type="text" 
							{...getFieldProps('expressName', {
								initialValue: checkedData['expressName'] ? 
												checkedData['expressName'] 
												: 
												''
							})} 
							placeholder={''}
							className="col-xs-9 col-md-9 text-input-nowidth"
						/>
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(200662/*快递单号*/)}</label>
						<input type="text" 
							{...getFieldProps('expressNo', {
								initialValue: checkedData['expressNo'] ? 
												checkedData['expressNo'] 
												: 
												''
							})} 
							placeholder={''}
							className="col-xs-9 col-md-9 text-input-nowidth"
						/>
					</div>
				</div>
				<div className="row">
					<div className="form-group col-md-6 col-lg-6">
						<label  className={'col-md-3 col-lg-3'}>{i18n.t(200663/*单证人员*/)}</label>	
						
						<Select
							{...getNFieldProps('docStaffId',{
															
								initialValue: checkedData['docStaffId'] ? 
												{ s_label: checkedData['docStaff'+language], docStaffId: checkedData.docStaffId, docStaffLcName: checkedData.docStaffLcName, docStaffEnName: checkedData.docStaffEnName} 
												: 
												''																	
							})} 
							optionLabelProp="children"														
							
							className="col-md-9 col-lg-9 currency-btn select-from-currency" 
							disabled={true}
							allowClear={false}>
													
						</Select>											
					</div>
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(200322/*运营组织*/)}</label>
						<Select
							{...getNFieldProps('plantId',{
															
								initialValue: checkedData['plantId'] ? 
												{ s_label: checkedData['plant'+language], plantId: checkedData.plantId, plantLcName: checkedData.plantLcName, plantEnName: checkedData.plantEnName} 
												: 
												''																
							})} 
							optionLabelProp="children"														
							placeholder={i18n.t(100378/*自动生成*/)}
							className="col-md-9 col-lg-9 currency-btn select-from-currency" 
							disabled={true}
							allowClear={false}>
													
						</Select>
					</div>
				</div>
				<div className="row">
					<div className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(500143/*集团组织*/)}</label>
						
						<Select
							{...getNFieldProps('clusterId',{
															
								initialValue:checkedData['clusterId'] ? 
												{ s_label: checkedData['cluster'+language], clusterId: checkedData.clusterId, clusterLcName: checkedData.clusterLcName, clusterEnName: checkedData.clusterEnName} 
												: 
												''																
							})} 
							optionLabelProp="children"														
							
							className="col-md-9 col-lg-9 currency-btn select-from-currency" 
							disabled={true}
							allowClear={false}>
													
						</Select>
					</div>
					<div  className="form-group col-md-6 col-lg-6">
						<label className={'col-md-3 col-lg-3'}>{i18n.t(100244/*企业*/)}</label>
						
						<Select
							{...getNFieldProps('ccId',{
															
								initialValue:checkedData['ccId'] ? 
												{ s_label: checkedData['cc'+language], ccId: checkedData.ccId, ccLcName: checkedData.ccLcName, ccEnName: checkedData.ccEnName} 
												: 
												''																
							})} 
							optionLabelProp="children"														
							
							className="col-md-9 col-lg-9 currency-btn select-from-currency" 
							disabled={true}
							allowClear={false}>
													
						</Select>
					</div>
				</div>
           	</div>
        </div>);
           	
		}else if(this.props.DialogContent==3){
			content = (
			   	// <div className={'addnormal scroll'} style={{height:'310px'}}>
					<div className={'girdlayout scroll'} style={{overflow:'auto',height:'260px'}}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(100323/*业务日期*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p>{new Date(checkedData['billDate']).Format('yyyy-MM-dd')}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(400008/*销售单号*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p>{checkedData['salNo']}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{i18n.t(400011/*销售员*/)}</label>
									<div className={'col-md-8 col-lg-8'}>
										<p>{checkedData['saleStaff'+language]}</p>
									</div>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{i18n.t(200647/*交单银行*/)}</label>
									<div className={'col-md-8 col-lg-8'}>
										<p>{checkedData['pBankerLcName']}</p>
									</div>
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200649/*交单金额*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p>{checkedData['pamts']}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(500125/*货币*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p>{checkedData['cny'+language]}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200648/*交单日期*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p>{new Date(checkedData['sendDate']).Format('yyyy-MM-dd')}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200655/*信用证号*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p>{checkedData['lcno']}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200656/*银行交单日*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p>{new Date(checkedData['bankdate']).Format('yyyy-MM-dd')}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200657/*托收行*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p>{checkedData['collection']}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200658/*托收行地址*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p>{checkedData['collectionAdress']}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200659/*开证行*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p>{checkedData['bankname']}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{i18n.t(200650/*收汇金额*/)}</label>
									<div className={'col-md-8 col-lg-8'}>
										<p>{checkedData['receiptAgg']}</p>
									</div>
								</div>
								<div className="form-group col-md-6 col-lg-6">
									<label className={'col-md-4 col-lg-4'}>{i18n.t(200660/*收汇日期*/)}</label>
									<div className={'col-md-8 col-lg-8'}>
										<p>{new Date(checkedData['receiptDate']).Format('yyyy-MM-dd')}</p>
									</div>
								</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200661/*快递公司*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p>{checkedData['expressName']}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200662/*快递单号*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p>{checkedData['expressNo']}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200663/*单证人员*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p>{checkedData['docStaff'+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(200322/*运营组织*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p>{checkedData['plant'+language]}</p>
								</div>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(500143/*集团组织*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p>{checkedData['cluster'+language]}</p>
								</div>
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-4 col-lg-4'}>{i18n.t(100244/*企业*/)}</label>
								<div className={'col-md-8 col-lg-8'}>
									<p>{checkedData['cc'+language]}</p>
								</div>
							</div>
						</div>
					</div>
				// </div>
			)
		}else if(this.props.DialogContent==4){
			content = (
				<div className='scroll lose'>
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
			)
		}
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
