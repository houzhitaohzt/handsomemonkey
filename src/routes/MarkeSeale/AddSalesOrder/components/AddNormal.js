import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import {createForm,FormWrapper} from '../../../../components/Form';
import Calendar from  '../../../../components/Calendar/Calendar';

import  SelectChange from "../../../../components/SelectChange";


// common 
import ServiceTips from '../../../../components/ServiceTips'; // 提示
import Select, { ConstVirtualSelect,Option } from '../../../../components/Select'; // 下拉


// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../../services/apiCall';



class Addnormal extends Component{

	constructor(props){
		super(props);
		this.StateChange=this.StateChange.bind(this);
		this.AddressChange=this.AddressChange.bind(this);
		props.normalRef && props.normalRef(this);
		this.saveClick = this.saveClick.bind(this);

		// init func
		this.handleCurrency = this.handleCurrency.bind(this);
		this.handleActivityType = this.handleActivityType.bind(this);
		this.handleExhibitionSponsor = this.handleExhibitionSponsor.bind(this);
		this.handleCountry = this.handleCountry.bind(this);
		this.handleLinkman = this.handleLinkman.bind(this);
		this.handleCity = this.handleCity.bind(this);
		
		
		this.changeActivityNature = this.changeActivityNature.bind(this);
		this.changeExhibitionSponsor = this.changeExhibitionSponsor.bind(this);


				
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.backClick = this.backClick.bind(this);
		

		// init state
		this.state = {
			radioState:'',
			radioAddress:'',
			chuangArray:[],
			qiyunArray:[],
			info:[],
			getOneData: 'rainbow',//this.props.getOneData,

			currency: [{id:1,localName:''}], // 币种
			activityType: [{id:1,name:''}], // 活动类型
			exhibitionSponsor: [{id:1,localName:''}], // 主办单位
			country: [{id:1,localName:''}], // 展会所在  国家
			city: [{id:1,localName:''}], // 展会所在  城市
			linkman: [{id:1,localName:''}], // 币种


			activityNature: 0,	// 活动性质 
			nextTime: 0, // 下次 时间	
			linkmanID:'', // 联系人 临时ID

			updateTime:'', // 更新下次时间		
		};		
		


	}

	componentDidMount(){
    };

	componentWillUnmount() {
  	}

	StateChange(e){
		let tex;
		tex = e.target.value;
		this.setState({
			radioState:tex
		})
	}
	AddressChange(e){
		let addres;
		addres = e.target.value;
		this.setState({
			radioAddress:addres
		})
	}

	saveClick(isclose,initAjax){
		var that = this;
		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
	      		if(that.state.data.billId){
	      			value = Object.assign({},this.state.data,value);
	      		}
	      		if(this.props.id){
	      			value=Object.assign({},value,{billId:this.props.id});
	      			that.props.saveClick(value,isclose,initAjax);
	      		}else {
	      			that.props.saveClick(value,isclose,initAjax);
	      		}
			}
	      	
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

	// 活动类型	
	handleActivityType(){
		apiGet(API_FOODING_DS,'/marketType/getList',{},
			(response)=>{							
				this.setState({	activityType:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 活动性质 切换
	changeActivityNature(val){
		switch(val){
			case '20' :	// 周期
				this.setState({ activityNature: 2, nextTime: 2});
			break;
			case '10' :  // 一次性
				this.setState({ activityNature: 1, nextTime: 1});
			break;
			case '30' : // 非周期
				this.setState({ activityNature: 1, nextTime: 2});
			break;						
			default:
		}
	}

	// 主办单位 
	handleExhibitionSponsor(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.exhibitionSponsor,
			(response)=>{							
				this.setState({	exhibitionSponsor:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 主办单位  切换 	
	changeExhibitionSponsor(val){
		this.setState({linkmanID:val});
		this.props.form.resetFields(['exhibLinkId']); // 清除表单
	}	

	// 展会 所在国家 ajax 
	handleCountry(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.country,
			(response)=>{							
				this.setState({	country:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 展会 所在 城市 	
	handleCity(e){
		apiGet(API_FOODING_DS,'/area/search',{keyword: e},
			(response)=>{							
				this.setState({	city:response.data || [] });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}
	// 展会联系人 
	handleLinkman(){
		let {exhibitionBeId} = this.props.getOneData;
		if( !this.state.linkmanID && !exhibitionBeId ){
				ServiceTips({text:'未选择主办单位！',type:'info'});
				return;
		} 
		apiGet(API_FOODING_DS,'/entContact/getByBeIdDataTyId',{beId:this.state.linkmanID || exhibitionBeId,dataTyId:140},
			(response)=>{							
				this.setState({	linkman:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 周期输入 
	changeInput = (e)=> this.countNextTime(1,e.target.value);

	// 周期类型 切换 
	changePeriodType = (s)=> this.countNextTime(2,s);

	// 开始 时间 
	changeStartTime = ()=> this.countNextTime();

	// 计算 下次时间 
	countNextTime = (num,v)=> {

		let {timeNum,timeType,predictSDate} = this.props.form.getFieldsValue();

		// 修改 周期、周期类型的值  
		if( num == 1 ) timeNum = v;
		if( num == 2 ) timeType = v;	

		if( timeNum && timeType && predictSDate ){
			apiGet(API_FOODING_ERP,'/activity/getNextTime',{timeNum:timeNum,timeType:timeType,startDate:predictSDate},
			(response)=>{
				this.setState({ updateTime:response.data });
				ServiceTips({text:'下次时间已更新！',type:'success'});							
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});			
			})
		}
	}

	// 保存
	onSaveAndClose(callBack){
		this.props.onSaveAndClose();
	}

	// 返回
	backClick() {

		let {navReplaceTab} = this.props;
		let billId = this.props.location.query.id;
		if(billId){
			navReplaceTab({name:i18n.t(200685/*市场活动详情*/),component:i18n.t(200685/*市场活动详情*/),url:'/marke/detail'});
			this.props.router.push({pathname: '/marke/detail', query: {id: billId}});
		} else {
			navReplaceTab({name:i18n.t(100332/*市场活动*/),component:i18n.t(100332/*市场活动*/),url:'/marke/list'});
			this.props.router.push({pathname: '/marke/list'});
		}
	}


	render(){

		let that = this;
		let {getNFieldProps,getFieldProps,getFieldError} = this.props.form;
		let {getOneData} = this.props;
		
		const {radioAddress, radioState} = this.state;	


		// // 保存 参数
		// getFieldProps('billType', {
		// 	initialValue: getOneData.billType,
		// });

		// getFieldProps('billId', {
		// 	initialValue: getOneData.billId,
		// });	

		// getFieldProps('optlock', {
		// 	initialValue: getOneData.optlock,
		// });


		// // 单据编号
		// getFieldProps('no', {
		// 	initialValue: getOneData.no,
		// });
		// // 业务状态 
		// getFieldProps('status', {
		// 	initialValue: getOneData.status,
		// });

	
					

		return(
			<div className={'addnormal'}>
				<div className={'addnormal-title'}>
					<span  >{i18n.t(100138/*常规*/)}</span>
					<span onClick={this.backClick}><i className={'foddingicon fooding-back'}></i></span>
					<span onClick={this.onSaveAndClose}><i className={'foddingicon fooding-save'}></i></span>
				</div>				
				<div className={'  girdlayout'}>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400048/*单据编号*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{ getOneData['no'] || i18n.t(100378/*自动生成*/) }</p>
							</div>							
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(100323/*业务日期*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<Calendar 
									width={'100%'}  
									showTime = {false} 
									isShowIcon={true} 
									form={this.props.form}
									validate={true}
									className ={getFieldError('billDate')?'error-border':''}
									name={'billDate'}
									value={getOneData['billDate']}												
								/>
							</div>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400049/*业务状态*/)}</label>
							<div className={'col-md-8 col-lg-8'}>
								<p className={'paragraph'}>{ getOneData['statusName'] || i18n.t(100378/*自动生成*/) }</p>
							</div>							
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(100284/*币种*/)}</label>
							<Select
								{...getNFieldProps('cnyId',{
									rules: [{required:true}],
									initialValue: getOneData['cnyId'] ? 
													{ s_label: getOneData['cny'+language], cnyId: getOneData.cnyId, cnyLcName: getOneData.cnyLcName, cnyEnName: getOneData.cnyEnName} 
													: 
													'',
								})}
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								className ={getFieldError('cnyId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
								onClick={this.handleCurrency}
								allowClear={false}
								showArrow={false}								
							>
								{this.state.currency.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200686/*活动类型*/)}</label>
							<Select
								{...getNFieldProps('markActvTyId',{
									rules: [{required:true}],
									initialValue: getOneData['markActvTyId'] ? 
													{ s_label: getOneData['markActvTy'+language], markActvTyId: getOneData.markActvTyId, markActvTyLcName: getOneData.markActvTyLcName, markActvTyEnName: getOneData.markActvTyEnName} 
													: 
													'',
								})}
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								className ={getFieldError('markActvTyId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
								onClick={this.handleActivityType}
								allowClear={false}
								showArrow={false}
							>
								{this.state.activityType.map((o,i)=><Option key={i} objValue={{s_label:o.name, markActvTyId: o.id, markActvTyLcName:o.name, markActvTyEnName: o.name}} title={o.name}>{o.name}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}><span>*</span>{i18n.t(200243/*活动名称*/)}</label>
							<input type="text"
								{...getFieldProps('markActvName',{
									rules: [{required:true}],									
									initialValue: getOneData['markActvName'] ? getOneData.markActvName : ''
								})}		
								placeholder={''}
								className ={getFieldError('markActvName')?'col-md-10 col-lg-10 text-input-nowidth error-border':'col-md-10 col-lg-10 text-input-nowidth'}
							/>							
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200687/*拟定开始日*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<Calendar 
									width={'100%'}  
									showTime = {false} 
									isShowIcon={true} 
									form={this.props.form}
									validate={true}
									className ={getFieldError('predictSDate')?'error-border':''}
									name={'predictSDate'}
									value={getOneData['predictSDate']}		
									onChangeTime={this.changeStartTime}										
								/>
							</div>
						</div>						
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200688/*活动性质*/)}</label>
							<Select
								{...getNFieldProps('marketNature',{
									initialValue: getOneData['marketNature'] ? String(getOneData['marketNature']) : '10'								
								})} 
								placeholder=''
								optionLabelProp="children"
								allowClear={false}
								className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
								onSelect={this.changeActivityNature}								
							>
								<Option key={0} value={'10'} title={i18n.t(200689/*一次性*/)}>{i18n.t(200689/*一次性*/)}</Option>								
								<Option key={0} value={'30'} title={i18n.t(200290/*非周期*/)}>{i18n.t(200290/*非周期*/)}</Option>
								<Option key={0} value={'20'} title={i18n.t(200291/*周期*/)}>{i18n.t(200291/*周期*/)}</Option>
							</Select>							
						</div>
						{ (this.state.activityNature ? (this.state.activityNature == 2 ? true : false) : (getOneData['marketNature'] == 20 ? true : false) ) ? 						
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200291/*周期*/)}</label>
								<input type="text"
									{...getFieldProps('timeNum',{
										rules: [{required:true}],									
										initialValue: getOneData['timeNum'] ? getOneData.timeNum : '',
										onChange:this.changeInput
									})}		
									placeholder={''}
									className ={getFieldError('timeNum')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}
								/>							
							</div>
							:
							<i></i>
						}	
						{ (this.state.activityNature ? (this.state.activityNature == 2 ? true : false) : (getOneData['marketNature'] == 20 ? true : false) ) ? 						
												
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200690/*周期类型*/)}</label>
								<Select
									{...getNFieldProps('timeType',{
										initialValue: getOneData['timeType'] ? String(getOneData['timeType']) : '2'								
									})} 
									placeholder=''
									optionLabelProp="children"
									className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
									onSelect={this.changePeriodType}								
								>
									<Option key={0} value={'1'} title={i18n.t(200519/*天*/)}>{i18n.t(200519/*天*/)}</Option>								
									<Option key={0} value={'2'} title={i18n.t(400150/*周*/)}>{i18n.t(400150/*周*/)}</Option>
									<Option key={0} value={'3'} title={i18n.t(400149/*月*/)}>{i18n.t(400149/*月*/)}</Option>
									<Option key={0} value={'4'} title={i18n.t(200691/*年*/)}>{i18n.t(200691/*年*/)}</Option>
								</Select>						
							</div>
							:
							<i></i>
						}						
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200692/*拟定结束日*/)}</label>
							<div className={'col-md-8 col-lg-8 datetime'}>
								<Calendar 
									width={'100%'}  
									showTime = {false} 
									isShowIcon={true} 
									form={this.props.form}
									validate={true}
									className ={getFieldError('predictEDate')?'error-border':''}
									name={'predictEDate'}
									value={getOneData['predictEDate']}												
								/>
							</div>
						</div>													
					</div>					
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200693/*主办单位*/)}</label>
							<Select
								{...getNFieldProps('exhibitionBeId',{
									rules: [{required:true}],
									initialValue: getOneData['exhibitionBeId'] ? 
													{ s_label: getOneData['exhibitionBe'+language], exhibitionBeId: getOneData.exhibitionBeId, exhibitionBeLcName: getOneData.exhibitionBeLcName, exhibitionBeEnName: getOneData.exhibitionBeEnName} 
													: 
													'',
								})}
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								className ={getFieldError('exhibitionBeId')?'currency-btn select-from-currency col-md-8 col-lg-8 error-border':'currency-btn select-from-currency col-md-8 col-lg-8'}
								onClick={this.handleExhibitionSponsor}
								onSelect={this.changeExhibitionSponsor}
								allowClear={false}
								showArrow={false}
							>
								{this.state.exhibitionSponsor.map((o,i)=><Option key={o.id} objValue={{s_label:o.localName, exhibitionBeId: o.id, exhibitionBeLcName:o.localName, exhibitionBeEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200694/*展会联系人*/)}</label>
							<Select
								{...getNFieldProps('exhibLinkId',{
									initialValue: getOneData['exhibLinkId'] ? 
													{ s_label: getOneData['exhibLink'+language], exhibLinkId: getOneData.exhibLinkId, exhibLinkLcName: getOneData.exhibLinkLcName, exhibLinkEnName: getOneData.exhibLinkEnName} 
													: 
													'',
								})}
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
								onClick={this.handleLinkman}
							>
								{this.state.linkman.map((o,i)=><Option key={i} objValue={{s_label:o.localName, exhibLinkId: o.id, exhibLinkLcName:o.localName, exhibLinkEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>
						</div>						
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200695/*展会号*/)}</label>
							<input type="text"
								{...getFieldProps('exhibitionNo',{
									initialValue: getOneData['exhibitionNo'] ? getOneData.exhibitionNo : ''
								})}		
								placeholder={''}
								className ={'col-md-8 col-lg-8 text-input-nowidth'}
							/>							
						</div>
						{ (this.state.nextTime ? (this.state.nextTime == 2 ? true : false) : (getOneData['marketNature'] != 10 ? true : false)) ? 
							<div className="form-group col-md-3 col-lg-3">
								<label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(200696/*下次时间*/)}</label>
								<div className={'col-md-8 col-lg-8 datetime'}>
									<Calendar 
										width={'100%'}  
										showTime = {false} 
										isShowIcon={true} 
										form={this.props.form}
										validate={ true } // 暂时 解决不了 验证
										className ={getFieldError('nextTime')?'error-border':''}
										name={'nextTime'}
										value={this.state.updateTime || getOneData['nextTime']}												
									/>
								</div>
							</div>							
							:
							<i></i>
						}
					</div>
					<div className={'row'}>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200697/*展会所在国家*/)}</label>
							<Select
								{...getNFieldProps('exhibitionCntryId',{
									initialValue: getOneData['exhibitionCntryId'] ? 
													{ s_label: getOneData['exhibitionCntry'+language], exhibitionCntryId: getOneData.exhibitionCntryId, exhibitionCntryLcName: getOneData.exhibitionCntryLcName, exhibitionCntryEnName: getOneData.exhibitionCntryEnName} 
													: 
													'',
								})}
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
								onClick={this.handleCountry}
							>
								{this.state.country.map((o,i)=><Option key={i} objValue={{s_label:o.localName, exhibitionCntryId: o.id, exhibitionCntryLcName:o.localName, exhibitionCntryEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>
							
						</div>
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200698/*展会所在城市*/)}</label>
							{/*<Select
								{...getNFieldProps('exhibitionCityId',{
									initialValue: getOneData['exhibitionCityId'] ? 
													{ s_label: getOneData['exhibitionCity'+language], exhibitionCityId: getOneData.exhibitionCityId, exhibitionCityLcName: getOneData.exhibitionCityLcName, exhibitionCityEnName: getOneData.exhibitionCityEnName} 
													: 
													'',
								})}
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								className ={'currency-btn select-from-currency col-md-8 col-lg-8'}
								onSearch={this.handleCity}
							>
								{this.state.city.map((o,i)=><Option key={i} objValue={{s_label:o.localName, exhibitionCityId: o.id, exhibitionCityLcName:o.localName, exhibitionCityEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>*/}
							<ConstVirtualSelect
								form={this.props.form}
								fieldName='exhibitionCityId'
								apiUri='/area/search'
								async clearable 
								apiParams='keyword'
								apiType={apiGet}
								initialValue={{
									exhibitionCityId: getOneData['exhibitionCityId'],
									exhibitionCityLcName: getOneData['exhibitionCityLcName'],
									exhibitionCityEnName: getOneData['exhibitionCityEnName'],
									s_label: getOneData['exhibitionCity'+language],
								}}								
								valueKeys={ da => ({
									exhibitionCityId: da.id,
									exhibitionCityLcName: da.localName,
									exhibitionCityEnName: da.name,
									basSpeci: da.specTxt,
									s_label: da.localName
								})}								
							/>
						</div>						
						<div className="form-group col-md-3 col-lg-3">
							<label className={'col-md-4 col-lg-4'}>{i18n.t(200699/*分配的预算*/)}</label>
							<input type="text"
								{...getFieldProps('budgetCost',{
									initialValue: getOneData['budgetCost'] ? getOneData.budgetCost : ''
								})}		
								placeholder={''}
								className ={'col-md-8 col-lg-8 text-input-nowidth'}
							/>							
						</div>
					</div>
					<div className={'row'}>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(100250/*详细地址*/)}</label>
							<input type="text"
								{...getFieldProps('address',{
									initialValue: getOneData['address'] ? getOneData.address : ''
								})}		
								placeholder={''}
								className ={'col-md-10 col-lg-10 text-input-nowidth'}
							/>							
						</div>
						<div className="form-group col-md-6 col-lg-6">
							<label className={'col-md-2 col-lg-2'}>{i18n.t(100336/*备注*/)}</label>
							<input type="text"
								{...getFieldProps('actCont',{
									initialValue: getOneData['actCont'] ? getOneData.actCont : ''
								})}		
								placeholder={''}
								className ={'col-md-10 col-lg-10 text-input-nowidth'}
							/>							
						</div>												
					</div>					
				</div>
			</div>
		)
	}
}
const ProductForm =createForm()(Addnormal);
export default ProductForm;
