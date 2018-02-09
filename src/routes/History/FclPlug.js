import i18n from './../../lib/i18n';
import React, {Component} from 'react';
import {createForm, FormWrapper} from '../../components/Form';
import Calendar from '../../components/Calendar/Calendar';
// common
import ServiceTips from '../../components/ServiceTips'; // 提示
import Select, {Option} from '../../components/Select'; // 下拉
// ajax
import {API_FOODING_DS, API_FOODING_ERP, apiForm, apiGet, apiPost, commonAjax, language,} from '../../services/apiCall';



export class FclPlug extends Component{
	constructor(props){
		super(props);
		this.addSelect;
		this.getData = this.getData.bind(this);

		// even func
		this.handlePortType = this.handlePortType.bind(this);
		this.handleTransportationCompany = this.handleTransportationCompany.bind(this);
		this.handleCurrency = this.handleCurrency.bind(this);
		this.handleStatesPort = this.handleStatesPort.bind(this);
				
		this.changePortType = this.changePortType.bind(this);

		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.onCancel = this.onCancel.bind(this);
		
		

		// init state
		this.state = {
			portType: [{id:1,localName:''}], // 港口类型（运输方式）
			transportationCompany: [{id:1,localName:''}], // 货代公司
			currency: [{id:1,localName:''}], // 币种
			statesPort: [{id:1,localName:''}], // 起运港
			
			portTypeID: '', // 港口类型 id
			portTypeVal:'', // 港口类型的值
			portTypeResult:false, // 港口类型的状态

			initData: this.props.initData
		}

	}
	getData(value,that){
		this.addSelect = that;
	}

	// 港口类型
	handlePortType(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.portType,
			(response)=>{							
				this.setState({	portType:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	// 港口类型 切换
	changePortType(value){

		switch( value ){
			case '10':
				this.setState({ portTypeID:value, portTypeVal:'seaBox', portTypeResult:true, statesPort: [{id:1,localName:''}]});
			break;
			case '20':
				this.setState({ portTypeID:value, portTypeVal:'trainBox', portTypeResult:true, statesPort: [{id:1,localName:''}]});				
			break;
			default:
				this.setState({ portTypeID:'', portTypeVal:'', portTypeResult:false, statesPort: [{id:1,localName:''}]});				
				ServiceTips({ text:'只支持铁运或者海运！',type:'info'});
		}
	}

	// 起运港 
	handleStatesPort(){
		let that = this;
		function ajax(){
			that.state.portTypeID ?
				apiPost(API_FOODING_DS,'/object/getMiniList',
				{
					"obj":"com.fooding.fc.ds.entity.Statn", 
					"queryParams":[{attr: "statnTyId", expression: "=", value: that.state.portTypeID}]	
				},
				(response)=>{							
					that.setState({	statesPort:response.data });
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
				})
				:
				ServiceTips({ text:'请选择运输方式！',type:'info'});
		}


		if(this.props.checkedData.statnTyId){
			this.setState({portTypeID: this.props.checkedData.statnTyId},function(){
				ajax();
			});
		} else{
			ajax();
		}
	}


	// 货运公司
	handleTransportationCompany(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.transportationCompany,
			(response)=>{							
				this.setState({	transportationCompany:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
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

	// 保存
	onSaveAndClose(){

		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_ERP,'/portcharges/save',value,
					(response)=>{	

						this.setState({ portTypeVal: '', portTypeResult: false, portTypeID: '' },function(){
							ServiceTips({text:response.message,type:'success'});
							that.props.form.resetFields(); // 清除表单
							that.props.onSaveAndClose(); // 关闭弹框
							that.props.getPage();	// 刷新页面
						});						

					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})		
	}

	// 取消
	onCancel(){
		this.setState({ portTypeVal: '', portTypeResult: false, portTypeID: '' },function(){
			this.props.form.resetFields(); // 清除表单
			this.props.onSaveAndClose(); // 关闭弹框
		});

	}


	render(){
		let that = this;
		const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
		let {checkedData,initData} = this.props;
		let content = <div></div>;

		// let EachPage = initData[this.state.portTypeVal];  // 遍历的 页面片段
		let EachPage = checkedData.statnTyId ? this.state.portTypeVal ? initData[this.state.portTypeVal]  : checkedData.statnTyId == 10 ? initData['seaBox'] : initData['trainBox'] : initData[this.state.portTypeVal];  // 遍历的 页面片段
		let result = checkedData.statnTyId ? true : this.state.portTypeResult;		



		// 编辑 保存 参数
		getNFieldProps('billId', {
			initialValue: checkedData ? checkedData['billId'] : '',
		});

		getNFieldProps('ccId', {
			initialValue: checkedData ? checkedData['ccId'] : '',
		});

		getNFieldProps('optlock', {
			initialValue: checkedData ? checkedData['optlock'] : '',
		});

		getNFieldProps('type', {
			initialValue: 10,
		});

		getNFieldProps('prices.aaa', {
			initialValue: '',
		});




		if(this.props.DialogContent == 1){
           content = (
           	<div className="packageplug-add scroll">
				<div className="package-add-line1">
					<div>
						<label><span>*</span>{i18n.t(100224/*运输方式*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('statnTyId',{
								rules: [{required:true}],
								initialValue: checkedData['statnTyId'] ? 
												{ s_label: checkedData['statnTyName'], statnTyId: checkedData.statnTyId, statnTyName: checkedData.statnTyName} 
												: 
												''	
							})} 
							optionLabelProp="children"
							style={{width:300,marginRight:15}}
							className ={getFieldError('statnTyId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
							onClick={this.handlePortType}
							onSelect={this.changePortType}													
						>
							{this.state.portType.map((o,i)=><Option key={i} value={o.id} title={o.name}>{o.name}</Option>)}
						</Select>						
					</div>
					<div>
						<label><span>*</span>{i18n.t(100297/*起运港*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('sStatnId',{
								rules: [{required:true}],
								initialValue: checkedData['sStatnId'] ? 
												{ s_label: checkedData['sStatn'+language], sStatnId: checkedData.sStatnId, sStatnLcName: checkedData.sStatnLcName, sStatnEnName: checkedData.sStatnEnName} 
												: 
												''								
							})} 
							optionLabelProp="children"
							style={{width:300,marginRight:15}}
							className ={getFieldError('sStatnId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
							onClick={this.handleStatesPort}
						>
							{this.state.statesPort.map((o,i)=><Option key={i} objValue={{s_label:o.localName,sStatnId:o.id,sStatnLcName:o.localName,sStatnEnName:o.enName}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
				</div>
				<div className="package-add-line1">
					<div>
						<label><span>*</span>{i18n.t(200343/*货运公司*/)}</label>
						<Select
							placeholder=''
							{...getNFieldProps('lsBeId',{
								rules: [{required:true}],
								initialValue: checkedData['lsBeId'] ? 
												{ s_label: checkedData['lsBe'+language], lsBeId: checkedData.lsBeId, lsBeLcName: checkedData.lsBeLcName, lsBeEnName: checkedData.lsBeEnName} 
												: 
												''									
							})} 
							optionLabelProp="children"
							style={{width:300,marginRight:15}}
							className ={getFieldError('lsBeId')?'currency-btn select-from-currency error-border':'currency-btn select-from-currency'}
							onClick={this.handleTransportationCompany}
						>
							{this.state.transportationCompany.map((o,i)=><Option key={i} objValue={{s_label:o.localName,lsBeId:o.id,lsBeLcName:o.localName,lsBeEnName:o.enName}} title={o.localName}>{o.localName}</Option>)}
						</Select>						
					</div>
					<div>
						<label><span>*</span>{i18n.t(100284/*币种*/)}</label>
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
						>
							{this.state.currency.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
						</Select>
					</div>
				</div>
				<div className="package-add-line1">
					<div style={{marginRight:15}}>
						<label><span>*</span>{i18n.t(100286/*生效日期*/)}</label> 
						<Calendar width={300}   showTime = {false} isShowIcon={true} form={this.props.form} 
						validate={true}
						className ={getFieldError('sDate')?'error-border':''}						
						name={'sDate'}
						value={checkedData['reDate']}
						/>
					</div>
					<div>
						<label style={{marginLeft:15}}><span>*</span>{i18n.t(500120/*终止日期*/)}</label>
						<Calendar width={300}  showTime = {false} isShowIcon={true} form={this.props.form}
						validate={true}
						className ={getFieldError('eDate')?'error-border':''}
						name={'eDate'}
						value={checkedData['eDate']}												
						/>
					</div>
				</div>
				<div className="package-add-line1">
					<div>
						<label><span>*</span>{i18n.t(100288/*发布日期*/)}</label>
						<Calendar width={300} showTime = {false} 
						isShowIcon={true} form={this.props.form} 
						validate={true}
						className ={getFieldError('reDate')?'error-border':''}
						name={'reDate'}
						value={checkedData['sDate']}						
						/> 
					</div>
				</div>
				{ result ?  
						 EachPage.map((e,i)=>{
							return (
								<div key={e.id}>
									<label><span>*</span>{e.localName}</label>
									<input type="text" placeholder=''
									{...getFieldProps("prices." + e.id , {
										initialValue: this.state.portTypeVal ? '' : checkedData.prices ? checkedData.prices[e.id] : ''
										
									})} 
									className="text-input" 
									style={{marginRight:15}}
									/>
								</div>
							)
						})
					
					:
					<s></s>
				}	
           	</div>
           	);
		}else if(this.props.DialogContent==3){
			   content = (
			   	<div className="packageplug-edit scroll">
				   	<h2>sometimes ever sometimes never!</h2>
					{/*<div className="package-add-line1">
						<div>
							<label><span>*</span>{i18n.t(100224*//*运输方式*//*)}</label>
							<Select
								{...getFieldProps('11',{
								validateFirst: true,
								rules: [{required:true,}],
								valuedateTrigger:"onBlur",
								initialValue:checkedData.record.mtransport
								})}
								style={{width:300,marginRight:15}}
								className ='currency-btn select-from-currency'>
								<Option value ={'0'}>{'dd'}</Option>
							</Select>
						</div>
						<div>
							<label><span>*</span>{i18n.t(100297*//*起运港*//*)}</label>
							<Select
								{...getFieldProps('11',{
								validateFirst: true,
								rules: [{required:true,}],
								valuedateTrigger:"onBlur",
								initialValue:checkedData.record.statnEnName
								})}
								style={{width:300,marginRight:15}}
								className ='currency-btn select-from-currency'>
								<Option value ={'0'}>{'dd'}</Option>
							</Select>
						</div>
					</div>
					<div className="package-add-line1">
						<div>
							<label><span>*</span>{i18n.t(100299*//*货代公司*//*)}</label>
							<Select
								{...getFieldProps('11',{
								validateFirst: true,
								rules: [{required:true,}],
								valuedateTrigger:"onBlur",
								initialValue:checkedData.record.lsBeLcName
								})}
								style={{width:300,marginRight:15}}
								className ='currency-btn select-from-currency'>
								<Option value ={'0'}>{'dd'}</Option>
							</Select>
						</div>
						<div>
							<label><span>*</span>{i18n.t(100284*//*币种*//*)}</label>
							<Select
								{...getFieldProps('11',{
								validateFirst: true,
								rules: [{required:true,}],
								valuedateTrigger:"onBlur",
								initialValue:checkedData.record.cnyName
								})}
								style={{width:300,marginRight:15}}
								className ='currency-btn select-from-currency'>
								<Option value ={'0'}>{'dd'}</Option>
							</Select>
						</div>
					</div>
					<div className="package-add-line1">
						<div style={{marginRight:15}}>
							<label><span>*</span>{i18n.t(100286*//*生效日期*//*)}</label>
							<Calendar width={300}   showTime = {false} isShowIcon={true}/>
						</div>
						<div>
							<label><span>*</span>{i18n.t(500120*//*终止日期*//*)}</label>
							<Calendar width={300}   showTime = {false} isShowIcon={true}/>
						</div>
					</div>
					<div className="package-add-line1">
						<div>
							<label><span>*</span>{i18n.t(100288*//*发布日期*//*)}</label>
							<Calendar width={300}   showTime = {false} isShowIcon={true}/>
						</div>
					</div>
					<div className="package-add-line1">
						<div>
							<label><span>*</span>20GP</label>
							<Select
								{...getFieldProps('11',{
								validateFirst: true,
								rules: [{required:true,}],
								valuedateTrigger:"onBlur",
								initialValue:checkedData.record.eachCharges.frist
								})}
								style={{width:300,marginRight:15}}
								className ='currency-btn select-from-currency'>
								<Option value ={'0'}>{'dd'}</Option>
							</Select>
						</div>
						<div>
							<label>40GP</label>
							<Select
								{...getFieldProps('11',{
								validateFirst: true,
								rules: [{required:true,}],
								valuedateTrigger:"onBlur",
								initialValue:checkedData.record.eachCharges.last
								})}
								style={{width:300,marginRight:15}}
								className ='currency-btn select-from-currency'>
								<Option value ={'0'}>{'dd'}</Option>
							</Select>
						</div>
					</div>*/}
				</div>
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
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}> 
						{content}
					</FormWrapper>
			</div>
		)
	}
}






const ProductForm =createForm()(FclPlug);
export default ProductForm;
