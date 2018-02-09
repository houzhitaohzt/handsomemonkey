import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../components/Form';

import Radio from '../../../components/Radio';
import AddSelect from '../../../components/AddRadio/components/AddSelect';
import Confirm from '../../../components/Dialog/Confirm';
import Calendar from  '../../../components/Calendar/Calendar';


// common
import ServiceTips from '../../../components/ServiceTips'; // 提示
import Select, { Option,ConstVirtualSelect } from '../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,toDecimal} from '../../../services/apiCall';
import xt from "../../../common/xt";




export class LogPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);

		// init func
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.handleNumber = this.handleNumber.bind(this);

		this.changType = this.changType.bind(this);





		// init state
		this.state = {
			company: [{id:1,localName:''}], // 收款企业
            number: ['Loding...'], // 原单编号
			client: [{id:1,name:''}], // 客户


			billType: '', // 源单类型
			userData: {}, // 客户 临时变量
			numberTem: '', // 原单编号 临时变量
			scrollHeight:0,

		};

	}

	componentDidMount(){
    	window.addEventListener('resize', this.handleResize(20));
    };
	componentWillUnmount() {
	}

	getData(value,that){
		this.addSelect = that;
	}

    handleResize(height){
        let padding = 233;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }

	// 源单类型 切换
	changType(ID){

		let that = this;
		this.setState({
			billType: ID,
			userData:{},
		 },function(){
			that.props.form.resetFields(['no','orderNo']); // 清除表单
		 });
	}

	// 单据编号 ajax
	handleNumber =() =>{
		// let that = this;
		// apiGet(API_FOODING_ERP,'/foreexchange/getOrderNoList',{billId:that.props.billId,billType: this.state.billType || '318'},
		// 	(response)=>{
		// 		this.setState({	number:response.data || [] });

		// 	},(errors)=>{
		// 		ServiceTips({text:errors.message,type:'error'});
		// });
	}

	// 编号 切换
	selectNumber(key){

		let that = this;
		this.setState({ userData:{} });
		apiGet(API_FOODING_ERP,'/foreexchange/getOrderInfo',{sourceNo:key || '',
		billType: that.state.billType || '318',billId:that.props.checkedData.billId},
			(response)=>{
				ServiceTips({text:response.message,type:'success'});
				this.setState({ userData:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}


	// 客户
	clientClick(){
		var that = this;
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.client,
			(response)=>{
				this.setState({	client: response.data });
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 保存
	onSaveAndClose(){


		let that = this;
		const {form, onSaveAndClose,currentPage} = this.props;
		form.validateFields((errors, value) => {
			if(errors){
			}else{

				let Num = Number.parseFloat( that.props.checkedData['notVerificationAmt'] );
				let Now = Number.parseFloat( value['verifiAmt'] );
				// if( Now > Num ){
				// 	ServiceTips({text:i18n.t(200609/*已核销金额*/)+i18n.t(400102/*数量不能大于*/)+i18n.t(201106/*未核销金额*/),type:'info'});
				// 	return;
				// }

				apiPost(API_FOODING_ERP,'/foreexchange/verifi',value,
					(response)=>{
							ServiceTips({text:response.message,type:'success'});
							that.props.form.resetFields(); // 清除表单
							that.props.onSaveAndClose(); // 关闭弹框
							that.props.getPage(currentPage);	// 刷新页面

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
								userData:{},
							});
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})
	}

	// 取消
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
		this.props.form.resetFields(); // 清除表单
		this.setState({ userData:{} });
	}



	render(){
		let that = this;
		const {getNFieldProps, getFieldError, getFieldProps, getFieldValue} = this.props.form;
		let {checkedData} = this.props;

		// 编辑 保存 参数
		getNFieldProps('foreExchangeId', {
			initialValue: checkedData ? checkedData['billId'] : '',
		});

		getNFieldProps('optlock', {
			initialValue: checkedData ? checkedData['optlock'] : '',
		});
		getNFieldProps('ccId', {
			initialValue: checkedData ? checkedData['ccId'] : '',
		});		
		getNFieldProps('ccLcName', {
			initialValue: checkedData ? checkedData['ccLcName'] : '',
		});		
		getNFieldProps('ccEnName', {
			initialValue: checkedData ? checkedData['ccEnName'] : '',
		});


		let	content = (
				<div className={'packageplug-add scroll girdlayout'} style={{height:'300px',overflow:'auto'}}>
					<div className={'row'}>
						<h3>{i18n.t(201096/*收汇信息*/)}</h3>
					</div>
					<div className={'row'}>
						<div className="col-md-6">
							<label className={'col-md-3'}>{i18n.t(201097/*摘要*/)}</label>
							<div className={'col-md-9'}>
								<p className={'paragraph'}>{checkedData['digest']}</p>
							</div>
						</div>
						<div className="col-md-6">
							<label className={'col-md-3'}>{i18n.t(201098/*收汇记录*/)}</label>
							<div className={'col-md-9'}>
								<p className={'paragraph'}>{checkedData['no']}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
							<div className="col-md-6">
								<label className={'col-md-3'}>{i18n.t(200591/*收款金额*/)}</label>
								<div className={'col-md-9'}>
									<p className={'paragraph'}>{toDecimal(checkedData['receiptAmt']) || 0} {checkedData['cny'+language]}</p>
								</div>
							</div>
							<div className="col-md-6">
								<label className={'col-md-3'}>{i18n.t(500200/*退款金额*/)}</label>
								<div className={'col-md-9'}>
									<p className={'paragraph'}>{toDecimal(checkedData['refundAmt']) || 0} {checkedData['cny'+language]}</p>
								</div>
							</div>
					</div>
					<div className={'row'}>
							<div className="col-md-6">
								<label className={'col-md-3'}>{i18n.t(200603/*已核销*/)}</label>
								<div className={'col-md-9'}>
									<p className={'paragraph'}>{toDecimal(checkedData['haveVerificationAmt']) || 0} {checkedData['cny'+language]}</p>
								</div>
							</div>
							<div className="col-md-6">
								<label className={'col-md-3'}>{i18n.t(200604/*未核销*/)}</label>
								<div className={'col-md-9'}>
									<p className={'paragraph'}>{toDecimal(checkedData['notVerificationAmt'])} {checkedData['cny'+language]}</p>
								</div>
							</div>
					</div>
					<div className={'row'}><h3>{i18n.t(200605/*核销信息*/)}</h3></div>
					<div className={'row'}>
						<div className="col-md-6">
							<label className={'col-md-3'}><span>*</span>{i18n.t(500146/*源单类型*/)}</label>
							<Select
								{...getNFieldProps('orderType',{
									initialValue: '318'
								})}
								placeholder=''
								optionLabelProp="children"
								className ={'currency-btn select-from-currency col-md-9'}
								allowClear={false}
								onSelect={this.changType}
							>
								<Option key={1} value={'318'} title={i18n.t(200400/*销售单*/)}>{i18n.t(200400/*销售单*/)}</Option>
								<Option key={2} value={'939'} title={i18n.t(100582/*样品单*/)}>{i18n.t(100582/*样品单*/)}</Option>
								<Option key={2} value={'308'} title={i18n.t(201062/*国内销售订单*/)}>{i18n.t(201062/*国内销售订单*/)}</Option>
								{/*
								<Option key={0} value={'323'} title={i18n.t(100332*//*市场活动*//*)}>{i18n.t(100332*//*市场活动*//*)}</Option>
								<Option key={0} value={'301'} title={i18n.t(100321*//*商机*//*)}>{i18n.t(100321*//*商机*//*)}</Option>
								<Option key={0} value={'338'} title={i18n.t(200401*//*采购单*//*)}>{i18n.t(200401*//*采购单*//*)}</Option>
								<Option key={0} value={'350'} title={i18n.t(200373*//*物流订单*//*)}>{i18n.t(200373*//*物流订单*//*)}</Option>
									*/}
							</Select>
						</div>
						<div className="col-md-6">
							<label className={'col-md-3'}><span>*</span>{i18n.t(201099/*源单号*/)}</label>
							{/*<Select
								{...getNFieldProps('orderNo',{
									rules: [{required:true}],
									initialValue: this.state.numberTem,
								})}
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								className ={getFieldError('orderNo')?'costName-btn select-from-costName col-md-9 error-border':'costName-btn select-from-costName col-md-9'}
								onClick={this.handleNumber}
								onSelect={this.selectNumber}
								allowClear={false}
							>
								{this.state.number.map((o,i)=><Option key={i} objValue={{s_label:String(o),orderNo:o}} title={String(o)}>{String(o)}</Option>)}
							</Select>*/}
							<ConstVirtualSelect
								form={this.props.form}
								apiType={apiGet}
								fieldName='orderNo'
								apiHost={API_FOODING_ERP}
								apiUri='/foreexchange/getOrderNoList'
								apiParams={{billId:that.props.billId,billType: this.state.billType || '318'}}
								refreshMark={this.state.billType} 
								rules={true}
								className='col-md-9'
								valueKeys={da => da}
								pageSize={'5'}
								onChange={this.selectNumber.bind(that)}																
							/>							
						</div>
					</div>
					<div className={'row'}>
						<div className="col-md-6">
							<label className={'col-md-3'}><span>*</span>{i18n.t(100311/*客户*/)}</label>
							<div className={'col-md-9'}>
								<p className={'paragraph'}
									{...getNFieldProps('salBe',{
										initialValue: { s_label:'',salBeId:this.state.userData['salBeId'],salBeLcName:this.state.userData['salBeLcName'],salBeEnName:this.state.userData['salBeEnName']},
									})}
								>
									{this.state.userData['salBe'+language]}
								</p>
							</div>
						</div>
						<div className="col-md-6">
							<label className={'col-md-3'}><span>*</span>{i18n.t(200608/*核销金额*/)}</label>
							<input type="text"
								{...getNFieldProps('verifiAmt',{
									//rules: [{required:true}],
									rules: [{required:true, pattern: xt.pattern.positiveNonZero}],
									initialValue: this.state.userData['saleTaxAmt']&&this.state.userData['receAmt']?toDecimal(this.state.userData['saleTaxAmt'] - this.state.userData['receAmt']):''
								})}
								placeholder={i18n.t(201100/*请输入大于0的数字*/)}
								className ={getFieldError('verifiAmt')?'col-md-6 text-input-nowidth error-border':'col-md-6 text-input-nowidth'}

							/>
							<div className={'col-md-2'} style={{paddingLeft:15}}>
								<p className={'paragraph'}
									{...getFieldProps('cnyId',{
										initialValue: this.state.userData['cny'+language]
									})}
								>
									{this.state.userData['cny'+language] || ''}
								</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="col-md-6">
							<label className={'col-md-3'}>{i18n.t(500038/*订单金额*/)}</label>
							<div className={'col-md-9'}>
								<p className={'paragraph'}
									{...getFieldProps('orderAmt',{
										initialValue: this.state.userData['saleTaxAmt']
									})}
								>
									{(this.state.userData['saleTaxAmt'] || 0) + ' ' + (this.state.userData['cnyLcName'] || '')}
								</p>
							</div>
						</div>
						<div className="col-md-6">
							<label className={'col-md-3'}>{i18n.t(201101/*已收款金额*/)}</label>
							<div className={'col-md-9'}>
								<p className={'paragraph'}
								>
									{(this.state.userData['receAmt'] || 0) + ' ' + (this.state.userData['cnyLcName'] || '')}
								</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="col-md-6">
							<label className={'col-md-3'}>{i18n.t(201102/*订单已核金额*/)}</label>
							<div className={'col-md-9'}>
								<p className={'paragraph'}>
									{(this.state.userData['orderVerifed'] || 0) + ' ' + (this.state.userData['cnyLcName'] || '')}
								</p>
							</div>
						</div>
						<div className="col-md-6">
							<label className={'col-md-3'}>{i18n.t(201244/*汇率*/)}</label>
							<div className={'col-md-9'}>
								<p className={'paragraph'}>
									{this.state.userData['exchgRate'] || 0}
								</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className="col-md-6">
							<label className={'col-md-3'}></label>
							<div className={'col-md-9'}>
								<p className={'paragraph'}
									{...getFieldProps('orderId',{
										initialValue: this.state.userData['sourceId']
									})}
								>
								</p>
							</div>
						</div>
					</div>

				</div>
			);

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
const CurrencyRecord =createForm()(LogPlug);
export default CurrencyRecord;
