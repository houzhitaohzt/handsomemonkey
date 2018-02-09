import i18n from './../../../../lib/i18n';
import React, {Component,PropTypes} from "react";
import Radio from "../../../../components/Radio";
import {createForm,FormWrapper} from '../../../../components/Form';
import {I18n} from '../../../../lib/i18n';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';

// common
import Select, { ConstVirtualSelect,Option } from '../../../../components/Select'; // 下拉
import Calendar from  '../../../../components/Calendar/Calendar';


// ajax
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,commonAjax,toDecimal} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import xt from "../../../../common/xt";




class OrderCorporationAdd extends Component{
    constructor(props){
        super(props);
        let that = this;
        this.backClick=this.backClick.bind(this);

        // init Func
        this.getOne=this.getOne.bind(this);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);

        this.handlePersonnel=this.handlePersonnel.bind(this);
        this.handleUserName=this.handleUserName.bind(this);
        this.handleProduct=this.handleProduct.bind(this);
		this.handleCurrency = this.handleCurrency.bind(this);
		this.handlePay = this.handlePay.bind(this);
		this.handlePayType = this.handlePayType.bind(this);
		this.handleTransport = this.handleTransport.bind(this);
		this.handleCountry = this.handleCountry.bind(this);




        this.changeProduct=this.changeProduct.bind(this);
        this.changeUser=this.changeUser.bind(this);


        // init state
        this.state = {
            scrollHeight:0,
            paymentMethod:'L/C',

            getOneData:{}, // 单条数据
			userMessage:{}, // 客户信息
            productMessage:{}, // 产品信息
            creditTypeMessage: 0, // 合同支付方式信息

			personnel: [{id:1,localName:''}], // 销售员
			clientArray:[{id:1,localName:''}], // 客户
			product:[{id:1,localName:''}], // 产品名称
            currency: [{id:1,localName:''}], // 币种
            pay: [{id:1,localName:''}], // 支付条款
            creditType: [{id:1,name:''}], // 合同支付方式
			transport:[{id:1,name:''}], // 运输方式
			country:[{id:1,name:''}], // 国家


        };


    }
    saveClick(){
        let {navAddTab} =this.props;
        navAddTab({id:'corporationapplylimit-detail',name:i18n.t(200516/*信保限额申请详情*/),component:i18n.t(200516/*信保限额申请详情*/),url:'/ordercorporation/detail'});
        this.props.router.push('/corporationapplylimit/detail');
    }

    handleResize(height){
        let sch=document.body.offsetHeight-50-height;
        let scroll = sch-140;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
        console.log(scroll);
    }
    componentDidMount(){
        window.addEventListener('resize', this.handleResize(47));
        this.getOne();
    };
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(47));
    }

	// 销售员
	handlePersonnel(){
		let that = this;
        apiGet(API_FOODING_ES,'/user/getListForPermissionsInParty',{partyId:that.state.getOneData['clusterId'],typeAttributeIds:[601,602]},
            (response)=>{
                that.setState({
                    personnel: response.data,
                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });
	}

	// 客户名称
	handleUserName(data){
		if(!data){
			this.props.form.resetFields(['salBeId']);
			return;
		}
        apiGet(API_FOODING_DS, '/customer/search', {keyword: data},
			response => {
            	this.setState({clientArray: response.data || []});
			}, errors => {
                ServiceTips({text:errors.message,type:'error'});
        })
	}

	// 客户 切换
	changeUser(data){
        this.setState({userMessage:{}});
        this.props.form.resetFields(['salBeCode','salBeAddress','clientTel','clientFax','cliregistNum','dutyPara','mtlId']); // 清除表单
        apiGet(API_FOODING_DS, '/customer/getCustInfoForErp', {id: data},
			response => {
            	this.setState({userMessage: response.data,productMessage:{}});
			}, errors => {
				ServiceTips({text:errors.message,type:'error'});
        })
	}

	// 产品名称
	handleProduct(){
		let that = this;
		let ID = this.state.getOneData['salBeId'];
        if( !ID ){
            ServiceTips({text:i18n.t(600098/*立方（CBM）*/),type:'info'});
            return;
        }

        apiGet(API_FOODING_DS,'/beMtl/getMtlList',{sourceId:ID},
            (response)=>{
                that.setState({
                    product: response.data || [],
                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });
	}

	// 产品名称 切换
	changeProduct(data){

        this.setState({productMessage: {}});
        this.props.form.resetFields(['mtlId']); // 清除表单
        apiGet(API_FOODING_DS, '/material/getOne', {id: data},
			response => {
            	this.setState({productMessage: response.data});
			}, errors => {
				ServiceTips({text:errors.message,type:'error'});
        })
	}

	// 币种 ajax
	handleCurrency(){

		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.currency,
			(response)=>{
				this.setState({	currency:response.data });
			},(errors)=>{
				ServiceTips({ text:errors.message,type:'error' });
		});
	}

	// 支付条款 ajax
	handlePay(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.payList,
			(response)=>{
				this.setState({	pay:response.data || [] });
			},(errors)=>{
				ServiceTips({ text:errors.message,type:'error' });
		});
	}

	// 合同支付方式 ajax
	handlePayType(){
		// apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.creditType,
		// 	(response)=>{
		// 		this.setState({	creditType:response.data || [] });
		// 	},(errors)=>{
		// 		ServiceTips({ text:errors.message,type:'error' });
		// });
	}

    // 合同支付方式 切换
    changeCreditType(data){

        if(data['payTrmCorpTyId'] == 20){
            this.setState({creditTypeMessage:1});
            //ServiceTips({ text:i18n.t(600099/*中华人民共和国海关出口货物报关单（最新版）*/),type:'info' });
        } else{
            this.setState({creditTypeMessage:2});
        }
	}

	// 运输方式
	handleTransport(){
		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.portType,
			(response)=>{
				this.setState({	transport:response.data });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 国家 ajax
	handleCountry(){

		apiPost(API_FOODING_DS,'/object/getMiniList',commonAjax.country,
			(response)=>{
				this.setState({	country:response.data });
			},(errors)=>{
				ServiceTips({ text:errors.message,type:'error' });
		});
	}





    // getOne
    getOne(){

        let that = this;
        apiGet(API_FOODING_ERP,'/ordercredit/getOne',{billId:that.props.location.query['id']},
            (response)=>{
                that.setState({
                    getOneData: response.data,
                });
            },(errors)=>{
                ServiceTips({text:errors.message,type:'error'});
        });
    }

    // 保存
    onSaveAndClose(){
        let that = this;
        const {form, getPage} = that.props;
        form.validateFields((errors, value) => {
            if(errors){
                //ServiceTips({text:'带有‘*’号的字段必填！',type:'info'});
            }else{
                apiPost(API_FOODING_ERP,'/ordercredit/save',Object.assign(that.state['getOneData'],value),
                    (response)=>{
                      let cancel=()=>{
                        this.props.router.push({pathname: this.props.router.location.pathname, query: {id: response.data}, state: {refresh: false}});
                        this.getOne();
                      };
                      let done = ()=>{
        							         window.navTabs.replace(i18n.t(200790/*订单信保详情*/),`/ordercorporation/detail`,{id:response.data},{refresh: true});
        						  };
						Confirm(i18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5,cancel,done});
                    },(errors)=>{
                        ServiceTips({text:errors.message,type:'error'});
                });
            }
        });
    }

    // 返回
	backClick() {

		let {navReplaceTab} = this.props;
		let billId = this.props.location.query.id;
		if(billId){
			navReplaceTab({name:i18n.t(200790/*订单信保详情*/),component:i18n.t(200790/*订单信保详情*/),url:'/ordercorporation/detail'});
			this.props.router.push({pathname: '/ordercorporation/detail', query: {id: billId}});
		} else {
			navReplaceTab({name:i18n.t(200791/*订单信保*/),component:i18n.t(200791/*订单信保*/),url:'/ordercorporation/list'});
			this.props.router.push({pathname: '/ordercorporation/list'});
		}
	}



    render(){

		let that = this;
        const {getOneData,userMessage,productMessage,creditTypeMessage} = this.state;
        const {form} = this.props;
        const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
        const disabled = form.isFieldsValidating() || form.isSubmitting();




        return(<div style={{padding:'10px',backgroundColor:'#f4f6f8'}}>
            <div className={'addnormal scroll'} style={{overflow:'auto',height:this.state.scrollHeight}}>
                <div className={'addnormal-title'}>
                    <span></span>
                    <span title={i18n.t(100431/*返回*/)} onClick={this.backClick}><i className={'foddingicon fooding-back'}></i></span>
                    <span title={i18n.t(100430/*保存*/)} onClick={this.onSaveAndClose}><i className={'foddingicon fooding-save'}></i></span>
                </div>
                <div className={'  girdlayout'}>

					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200518/*信保状态*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['statusName']}</p>
                            </div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(400011/*销售员*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['saleStaff'+language]}</p>
                            </div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(100355/*客户名称*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['salBe'+language]}</p>
                            </div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(100354/*客户代码*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['salBeCode']}</p>
                            </div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200498/*客户地址*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['salBeAddress']}</p>
                            </div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200499/*客户国家/地区*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['beCntry'+language]}{'/'}{getOneData['beArea'+language]}</p>
                            </div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200792/*收货人名称*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['revBusiness'+language]}</p>
                            </div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200387/*销售订单号*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['salesOrderNo']}</p>
                            </div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(100385/*海关编码*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}
                                    {...getFieldProps('customsNo', {
                                        initialValue: productMessage['hsCode'] ? productMessage['hsCode'] : (getOneData['customsNo'] || ''),
                                    })}
                                >
                                    {productMessage['hsCode'] ? productMessage['hsCode'] : (getOneData['customsNo'] || '')}
                                </p>
                            </div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  ><span>*</span>{i18n.t(100284/*币种*/)}</label>
							<Select
								{...getNFieldProps('cnyId',{
                                    rules: [{required:true}],
								    initialValue: getOneData['cnyId'] ?
												{ s_label: getOneData['cny'+language], cnyId: getOneData.cnyId, cnyLcName: getOneData.cnyLcName, cnyEnName: getOneData.cnyEnName }
												:
												''
								})}
								allowClear={false}
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								className ={getFieldError('cnyId')?'currency-btn select-from-currency col-md-4 col-lg-4 error-border':'currency-btn select-from-currency col-md-4 col-lg-4'}
                                onClick={this.handleCurrency}
							>
                                {this.state.currency.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(500038/*订单金额*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{toDecimal(getOneData['orderAccount'])}</p>
                            </div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200504/*投保金额*/)}</label>
                            <div className={'col-md-6'}>
                                {/*<p className={'paragraph'}>{getOneData['coverAccount']}</p>*/}
								<input type="text"
									{...getFieldProps('coverAccount',{
										rules: [{required:false, pattern: xt.pattern.positiveNonZero}],
										initialValue: getOneData['coverAccount'] || 0
									})}
									className ={getFieldError('coverAccount')?'col-md-8 text-input-nowidth error-border':'col-md-8 text-input-nowidth'}
								/>
                            </div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(100133/*支付条款*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['payTrm'+language]}</p>
                            </div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200505/*合同支付方式*/)}</label>
                            <div className={'col-md-6'}>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    fieldName='salBeId'
                                    apiType={apiPost}
									apiParams={{
										obj:'com.fooding.fc.enumeration.CorpType',
										queryParams:[{
											attr:'id',
											expression:"in",
											objValues:[10,20,30]
										}]					
									}}
									closeClear={true}
                                    clearable
                                	onChange={this.changeCreditType.bind(that)}									
                                    initialValue={{
                                        s_label: getOneData['payTrmCorpTy'+language],
                                        payTrmCorpTyId: getOneData['payTrmCorpTyId'],
                                        payTrmCorpTyLcName: getOneData['payTrmCorpTyLcName'],
                                        payTrmCorpTyEnName: getOneData['payTrmCorpTyEnName'],
                                    }}
                                    valueKeys={ da => ({
                                        s_label:da.name,
                                        payTrmCorpTyId:da.id,
                                        payTrmCorpTyLcName:da.name,
                                        payTrmCorpTyEnName:da.name
                                    })}
                                />
							</div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  >{i18n.t(200793/*加保支付方式*/)}</label>
                            <div className={'col-md-6'}>
								<ConstVirtualSelect
                                    placeholder={i18n.t(200994/*请选择*/)}
                                    form={this.props.form}
                                    fieldName='corpTyId'
                                    apiType={apiPost}
									apiParams={{
										obj:'com.fooding.fc.enumeration.CorpType',
										queryParams:[{
											attr:'id',
											expression:"in",
											objValues:[10,20,30]
										}]					
									}}									
									closeClear={true}
                                    clearable
                                    initialValue={{
                                        s_label: getOneData['corpTy'+language],
                                        corpTyId: getOneData['corpTyId'],
                                        corpTyLcName: getOneData['corpTyLcName'],
                                        corpTyEnName: getOneData['corpTyEnName'],
                                    }}
                                    valueKeys={ da => ({
                                        s_label:da.name,
                                        corpTyId:da.id,
                                        corpTyLcName:da.name,
                                        corpTyEnName:da.name
                                    })}
                                />
							</div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  ><span>*</span>{i18n.t(200506/*信用期限*/)}</label>
                            <input type="text"
                                {...getFieldProps('useLimit',{
                                    rules: [{required:true}],
                                    initialValue: getOneData['useLimit'] || ''
                                })}

                                placeholder=""
								className ={getFieldError('useLimit') ? 'col-md-3 text-input-nowidth error-border' : 'col-md-3 text-input-nowidth'}
                            />
                            <label className={'col-md-1 col-lg-1'} style={{textAlign:'left',color:'#000033'}}>{i18n.t(200519/*天*/)}</label>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  ><span>*</span>{i18n.t(100224/*运输方式*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}>{getOneData['trans'+language]}</p>
                            </div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  ><span>*</span>{i18n.t(200794/*预计到达目的港日期*/)}</label>
                            <div className={'col-md-4 col-lg-4 datetime'}>
								<Calendar
									width={'100%'}
									showTime = {false}
									isShowIcon={true}
									form={this.props.form}
									validate={true}
									className ={getFieldError('predictArrivalDate')?'error-border':''}
									name={'predictArrivalDate'}
									value={getOneData['predictArrivalDate']}
									onChangeTime={this.changeStartTime}
								/>
                            </div>
                        </div>
					</div>
					<div className={'row'}>
                        <div className="col-md-12">
                            <label className={'col-md-3 col-md-offset-3'}  ><span>*</span>{i18n.t(200795/*融资*/)}</label>
							<Select
								{...getNFieldProps('financing',{
                                    rules: [{required:true}],
								    initialValue:getOneData['financing']? {s_label:i18n.t(100141/*是*/),financing:getOneData['financing']}:{s_label:i18n.t(100142/*否*/),financing:false}
								})}
								allowClear={false}																	
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								className ={getFieldError('financing')?'currency-btn select-from-currency col-md-4 col-lg-4 error-border':'currency-btn select-from-currency col-md-4 col-lg-4'}
							>
								<Option key={0} value={'true'} title={i18n.t(100141/*是*/)}>{i18n.t(100141/*是*/)}</Option>
								<Option key={1} value={'false'} title={i18n.t(100142/*否*/)}>{i18n.t(100142/*否*/)}</Option>
							</Select>
                        </div>
					</div>

                    <div className={'row'}>
                    </div>
					{ (creditTypeMessage ? (creditTypeMessage ==1 ? true : false) : (getOneData['payTrmCorpTyId']=='20' ? true : false)) ?
						<div>
							<div className={'row'}>
								<div className="col-md-12">
									<label className={'col-md-3 col-md-offset-3'}  ><span>*</span>{i18n.t(200510/*开证银行英文名称*/)}</label>
									<input type="text"
										{...getFieldProps('bankEnName',{
											rules: [{required:true,}],
											initialValue: getOneData['bankEnName'] || ''
										})}
										placeholder=""
										className ={getFieldError('bankEnName')?'col-md-4 col-lg-4 text-input-nowidth error-border':'col-md-4 col-lg-4 text-input-nowidth'}
									/>
								</div>
							</div>
							<div className={'row'}>
								<div className="col-md-12">
									<label className={'col-md-3 col-md-offset-3'}  ><span>*</span>{i18n.t(200511/*开证所属国家地区*/)}</label>
									<Select
										{...getNFieldProps('beCntryId',{
											rules: [{required:true}],
											initialValue: getOneData['beCntryId'] ?
														{ s_label: getOneData['beCntry'+language], beCntryId: getOneData.beCntryId, beCntryLcName: getOneData.beCntryLcName, beCntryEnName: getOneData.beCntryEnName }
														:
														''
										})}
										placeholder=''
										optionLabelProp="children"
										optionFilterProp="children"
										className ={getFieldError('beCntryId')?'currency-btn select-from-currency col-md-4 col-lg-4 error-border':'currency-btn select-from-currency col-md-4 col-lg-4'}
										onClick={this.handleCountry}
									>
										{this.state.country.map((o,i)=><Option key={i} objValue={{s_label:o.localName, beCntryId: o.id, beCntryLcName:o.localName, beCntryEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
									</Select>
								</div>
							</div>
							<div className={'row'}>
								<div className="col-md-12">
									<label className={'col-md-3 col-md-offset-3'}  ><span>*</span>{i18n.t(200512/*开证银行SWIFT码*/)}</label>
									<input type="text"
										{...getFieldProps('bankSWIFT',{
											rules: [{required:true,}],
											initialValue: getOneData['bankSWIFT'] || ''
										})}
										placeholder=""
										className ={getFieldError('bankSWIFT')?'col-md-4 col-lg-4 text-input-nowidth error-border':'col-md-4 col-lg-4 text-input-nowidth'}
									/>
								</div>
							</div>
							<div className={'row'}>
								<div className="col-md-12">
									<label className={'col-md-3 col-md-offset-3'}  ><span>*</span>{i18n.t(200796/*信用证编号*/)}</label>
									<input type="text"
										{...getFieldProps('lcNo',{
											initialValue: getOneData['lcNo'] || ''
										})}
										placeholder=""
										className ={'col-md-4 col-lg-4 text-input-nowidth'}
									/>
								</div>
							</div>
						</div>
						:
						<i></i>
					}
                </div>
            </div>
        </div>
        )
    }
}
const OrderCorporationAddForm = createForm()(OrderCorporationAdd);
export default NavConnect(OrderCorporationAddForm);
