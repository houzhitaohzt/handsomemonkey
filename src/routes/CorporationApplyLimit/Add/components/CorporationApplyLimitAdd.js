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
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,commonAjax} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
import Confirm from '../../../../components/Dialog/Confirm';




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
        apiGet(API_FOODING_ES,'/user/getListForPermissionsInParty',{partyId:that.state.getOneData['clusterId'],typeAttributeIds:["601","602"]},
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
	changeUser(o){
        let data = o['salBeId'];
        let that = this;
        this.setState({userMessage:{}});
        this.props.form.resetFields(['customsCode']); // 清除表单
       //this.props.form.resetFields(['salBeCode','salBeAddress','clientTel','clientFax','cliregistNum','dutyPara','mtlId']); // 清除表单
        apiGet(API_FOODING_DS, '/customer/getCustInfoForErp', {id: data},
			response => {
                 let getOneData= that.state.getOneData;
                 getOneData = Object.assign({},getOneData,{
                 beAreaId:response.data.beAreaId,
                 beAreaLcName:response.data.beAreaLcName,
                 beAreaEnName:response.data.beAreaEnName,
                 beCntryId:response.data.beCntryId,
                 beCntryLcName:response.data.beCntryLcName,
                 beCntryEnName:response.data.beCntryEnName
                })
                 let aaa = response.data;
                 let salBeAddress = response.data.recAddress;
                if(salBeAddress==null){salBeAddress=''};
               this.props.form.setFieldsValue({
                    //salBeCode:response.data.code,
                    salBeAddress:salBeAddress,
                    clientTel:response.data.recTel,
                    clientFax:response.data.recFax,
                    cliregistNum:'',
                    dutyPara:response.data.taxIdenSN,
                    customsCode:'',
                    beAreaId:{s_label:'', beAreaId:'', beAreaLcName:'', beAreaEnName:''},
                    beCntryId:{s_label:'',beCntryId:'',beCntryLcName:'',beCntryEnName:''},
                    mtlId:{s_label:aaa["mtl"+language],mtlId:aaa.mtlId,mtlLcName:aaa.mtlLcName,mtlEnName:aaa.mtlEnName}
                   });
            	that.setState({userMessage: response.data,productMessage:{},getOneData:getOneData});
			}, errors => {
				ServiceTips({text:errors.message,type:'error'});
        })
	}

	// 产品名称
	handleProduct(){
		let that = this;
         let  sourceId= that.state.userMessage['noticeBusinessId'] || that.state.getOneData['salBeId'];
        if( !that.state.userMessage['noticeBusinessId'] && !that.state.getOneData['salBeId'] ){
            ServiceTips({text:i18n.t(200445/*请选择客户*/),type:'info'});
            return;
        } 
        else
        apiGet(API_FOODING_DS,'/beMtl/getMtlList',{sourceId:sourceId},
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
        let that = this;
        let getOneData = that.state.getOneData;
        this.setState({productMessage: {}});
        //this.props.form.resetFields(['mtlId']); // 清除表单
        apiGet(API_FOODING_DS, '/material/getOne', {id: data},
			response => {
                 getOneData = Object.assign({}, getOneData,{customsCode:response.data.hsCode});
                 that.setState({
                    getOneData
                 })
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


    // 合同支付方式 切换
    changeCreditType(data){

        if(data['payTrmCorpTyId'] == 20){
            this.setState({creditTypeMessage:1});
            //ServiceTips({ text:i18n.t(600099/*中华人民共和国海关出口货物报关单（最新版）*/),type:'info' });
        } else{
            this.setState({creditTypeMessage:2});
        }
	}


    // getOne
    getOne(){

        let that = this;
        apiGet(API_FOODING_ERP,'/creditinslimit/getOne',{billId:that.props.location.query['id']},
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
        let getOneData=that.state.getOneData;
        const {form, getPage} = that.props;
        form.validateFields((errors, values) => {
            if(errors){
                //ServiceTips({text:'带有‘*’号的字段必填！',type:'info'});
            }else{
                let param = Object.assign({}, getOneData, values,{billId:that.state.getOneData.billId});
                apiPost(API_FOODING_ERP,'/creditinslimit/save',param,
                    (response)=>{
                        param.billId = response.data;
                        let cancel = ()=>{
                            this.props.router.push({pathname: this.props.router.location.pathname, query: {id: param.billId}, state: {refresh: false}});
                            this.setState({id: param.billId},()=>{
                                this.getOne();
                            });

                        };
                        let done = ()=>{
                        ServiceTips({text:response.message,type:'sucess'});
                        that.props.navReplaceTab({name:I18n.t(200516/*信保限额申请详情*/), component:I18n.t(200516/*信保限额申请详情*/), url: '/corporationapplylimit/detail'});
                        this.props.router.push({pathname:'/corporationapplylimit/detail',query:{id:response.data}});

                        };
                            Confirm(I18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5, cancel, done  });
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
			navReplaceTab({name:i18n.t(200516/*信保限额申请详情*/),component:i18n.t(200516/*信保限额申请详情*/),url:'/corporationapplylimit/detail'});
			this.props.router.push({pathname: '/corporationapplylimit/detail', query: {id: billId}});
		} else {
			navReplaceTab({name:i18n.t(200517/*信保限额申请*/),component:i18n.t(200517/*信保限额申请*/),url:'/corporationapplylimit/list'});
			this.props.router.push({pathname: '/corporationapplylimit/list'});
		}
	}


    render(){

        let that = this;
        const {getOneData,userMessage,productMessage,creditTypeMessage} = this.state;
        const {form} = this.props;
        const { getNFieldProps, getFieldProps, getFieldError } = this.props.form;
        const disabled = form.isFieldsValidating() || form.isSubmitting();



        // 保存 参数
        getFieldProps('billId', {
            initialValue: getOneData['billId'],
        });

        getFieldProps('optlock', {
            initialValue: getOneData['optlock'],
        });

        // 企业
         getFieldProps('clusterId', {
            initialValue: getOneData['clusterId'],
        });
        getFieldProps('clusterLcName', {
            initialValue: getOneData['clusterLcName'],
        });
        getFieldProps('clusterEnName', {
            initialValue: getOneData['clusterEnName'],
        });

        //  国家
        getFieldProps('beCntryId', {
            initialValue: userMessage['beCntryId'] || getOneData['beCntryId'],
        });
        getFieldProps('beCntryLcName', {
            initialValue: userMessage['beCntryLcName'] || getOneData['beCntryLcName'],
        });
        getFieldProps('beCntryEnName', {
            initialValue: userMessage['beCntryEnName'] || getOneData['beCntryEnName'],
        });

        // 地区
        getFieldProps('beAreaId', {
            initialValue: userMessage['beAreaId'] || getOneData['beAreaId'],
        });
        getFieldProps('beAreaLcName', {
            initialValue: userMessage['beAreaLcName'] || getOneData['beAreaLcName'],
        });
        getFieldProps('beAreaEnName', {
            initialValue: userMessage['beAreaEnName'] || getOneData['beAreaEnName'],
        });



        return(<div style={{padding:'10px',backgroundColor:'#f4f6f8'}}>
            <div className={'addnormal scroll'} style={{overflow:'auto',height:this.state.scrollHeight}}>
                <div className={'addnormal-title'}>
                    <span></span>
                    <span title={i18n.t(100431/*返回*/)} onClick={this.backClick}><i className={'foddingicon fooding-back'}></i></span>
                    <span title={i18n.t(100430/*保存*/)} onClick={this.onSaveAndClose}><i className={'foddingicon fooding-save'}></i></span>
                </div>
                <div className={'  girdlayout'}>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} >{i18n.t(200518/*信保状态*/)}</label>
                            <div className={'col-md-6'}>
                                <p className={'paragraph'}
                                    {...getFieldProps('status', {
                                        initialValue: getOneData['status']?getOneData['status'] :'',
                                    })}
                                >
                                    {getOneData['statusName']}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} >{i18n.t(400011/*销售员*/)}</label>
							<Select
								{...getNFieldProps('saleStaffId',{
									rules: [{required:true}],
									initialValue: getOneData['saleStaffId'] ?
													{ s_label: getOneData['saleStaff'+language], saleStaffId: getOneData.saleStaffId, saleStaffLcName: getOneData.saleStaffLcName, saleStaffEnName: getOneData.saleStaffEnName}
													:
													undefined,
								})}
								placeholder=''
								optionLabelProp="children"
								optionFilterProp="children"
								className ={getFieldError('saleStaffId')?'currency-btn select-from-currency col-md-4 error-border':'currency-btn select-from-currency col-md-4 col-lg-4'}
								onClick={this.handlePersonnel}
                                allowClear={false}
							>
								{this.state.personnel.map((o,i)=><Option key={i} objValue={{s_label:o.staffLocalName, saleStaffId: o.refId, saleStaffLcName:o.staffLocalName, saleStaffEnName: o.staffEnName}} title={o.staffLocalName}>{o.staffLocalName}</Option>)}
							</Select>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} ><span>*</span>{i18n.t(100355/*客户名称*/)}</label>
                           <ConstVirtualSelect
                                    form={this.props.form}
                                    fieldName='salBeId'
                                    apiType={apiGet}
                                    apiUri='/customer/search'
                                    async={true}
                                    className={'col-md-4'}
                                    apiParams='keyword'
                                    rules={true}
                                    onChange={this.changeUser}
                                    initialValue={{
                                        s_label: getOneData.salBeLcName,
                                        salBeId: getOneData.salBeId,
                                        salBeLcName: getOneData.salBeLcName,
                                        salBeEnName: getOneData.salBeEnName
                                    }}
                                    valueKeys={ da => ({
                                        s_label:da.localName,
                                        salBeId:da.id,
                                        salBeLcName:da.localName,
                                        salBeEnName:da.name
                                    })}
                            />
                            

                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} >{i18n.t(100354/*客户代码*/)}</label>
                            <input type="text"
                                {...getNFieldProps('salBeCode',{
                                    initialValue: getOneData['salBeCode']?getOneData['salBeCode']:''
                                })}
                               className ={'col-md-4 text-input-nowidth'}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} >{i18n.t(500207/*赔付比例*/)}</label>
                            <input type="text"
                                   {...getNFieldProps('compenScale',{
                                       initialValue: getOneData['compenScale']?getOneData['compenScale']:''
                                   })}
                                   className ={'col-md-4 text-input-nowidth'}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} >{i18n.t(100336/*备注*/)}</label>
                            <input type="text"
                                   {...getNFieldProps('remark',{
                                       initialValue: getOneData['remark']?getOneData['remark']:''
                                   })}
                                   className ={'col-md-4 text-input-nowidth'}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} ><span>*</span>{i18n.t(200498/*客户地址*/)}</label>
                            <input type="text"
                                {...getFieldProps('salBeAddress',{
                                    rules: [{required:true,}],
                                    initialValue: getOneData['salBeAddress']?getOneData['salBeAddress']:userMessage['recAddress']
                                })}
                               className ={getFieldError('salBeAddress')?'col-xs-4 text-input-nowidth error-border':'col-xs-4 text-input-nowidth'}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} >{i18n.t(200499/*客户国家/地区*/)}</label>
							<div className="col-md-4">
                            <p className={'paragraph'}>
								{
                                    ((getOneData['beCntry'+language] || '') + (getOneData.beCntryId &&getOneData.beAreaId? ' / ':'') + (getOneData['beArea'+language] || ''))?((getOneData['beCntry'+language] || '') + (getOneData.beCntryId &&getOneData.beAreaId? ' / ':'') + (getOneData['beArea'+language] || '')):((userMessage.beCntryId?userMessage['beCntry'+language]:'') + (userMessage.beCntryId &&userMessage.beAreaId? ' / ':'') +(userMessage.beAreaId?userMessage['beArea'+language] : ''))
								}
							</p>
                            </div>

                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} ><span>*</span>{i18n.t(200500/*客户电话*/)}</label>
                            <input type="text"
                                {...getFieldProps('clientTel',{
                                    rules: [{required:true,}],
                                    initialValue: getOneData['clientTel']?getOneData['clientTel']:userMessage['recTel']
                                })}
                               className ={getFieldError('clientTel')?'col-md-4 text-input-nowidth error-border':'col-md-4 text-input-nowidth'}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} >{i18n.t(200501/*客户传真*/)}</label>
                            <input type="text"
                                {...getFieldProps('clientFax',{
                                    initialValue: getOneData['clientFax']?getOneData['clientFax']:userMessage['recFax']
                                })}
                               className ={'col-md-4 text-input-nowidth'}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} >{i18n.t(200502/*客户注册号*/)}</label>
                            <input type="text"
                                {...getFieldProps('cliregistNum',{
                                    initialValue: getOneData['cliregistNum']? getOneData['cliregistNum']:userMessage['registCode']
                                })}
                               className ='col-md-4 text-input-nowidth'
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} >{i18n.t(200503/*客户税号*/)}</label>
                            <input type="text"
                                {...getFieldProps('dutyPara',{
                                    initialValue: getOneData['dutyPara']?getOneData['dutyPara']:userMessage['taxIdenSN']
                                })}
                               className ={'col-md-4 text-input-nowidth'}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} >{i18n.t(500061/*产品名称*/)}</label>
							<Select
								{...getNFieldProps('mtlId',{
									initialValue: getOneData['mtlId'] ?
													{ s_label: getOneData['mtl'+language], mtlId: getOneData.mtlId, mtlLcName: getOneData.mtlLcName, mtlEnName: getOneData.mtlEnName}
													:undefined,
								})}
								optionLabelProp="children"
								optionFilterProp="children"
								className ={'currency-btn select-from-currency col-md-4 col-lg-4'}
								onClick={this.handleProduct}
                                onSelect={this.changeProduct}
							>
								{this.state.product.map((o,i)=><Option key={String(o['id'])} objValue={{s_label:o.localName, mtlId: o.id, mtlLcName:o.localName, mtlEnName: o.staffEnName}} title={o.localName}>{o.localName}</Option>)}
							</Select>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} >{i18n.t(100385/*海关编码*/)}</label>
                           
                                <input type="text" disabled className ={'col-md-4 text-input-nowidth'}
                                    {...getFieldProps('customsCode', {

                                        initialValue: getOneData.customsCode?getOneData.customsCode:'',
                                    })}
                               />
                                    
                               
                           
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} ><span>*</span>{i18n.t(100284/*币种*/)}</label>
							<Select
								{...getNFieldProps('cnyId',{
                                    rules: [{required:true}],
								    initialValue: getOneData['cnyId'] ?
												{ s_label: getOneData['cny'+language], cnyId: getOneData.cnyId, cnyLcName: getOneData.cnyLcName, cnyEnName: getOneData.cnyEnName }
												:undefined
								})}
								optionLabelProp="children"
								optionFilterProp="children"
								className ={getFieldError('cnyId')?'currency-btn select-from-currency col-md-4 error-border':'currency-btn select-from-currency col-md-4 col-lg-4'}
                                onClick={this.handleCurrency}
                                showArrow={false}
                                allowClear={false}
							>
                                {this.state.currency.map((o,i)=><Option key={i} objValue={{s_label:o.localName, cnyId: o.id, cnyLcName:o.localName, cnyEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
							</Select>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} >{i18n.t(500038/*订单金额*/)}</label>
                            <input type="text"
                                {...getFieldProps('orderCost',{
                                    initialValue: getOneData['orderCost']?getOneData['orderCost']:''
                                })}
                                placeholder=""
								className ={'col-md-4 text-input-nowidth'}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} >{i18n.t(200504/*投保金额*/)}</label>
                            <input type="text"
                                {...getFieldProps('insureCost',{
                                    initialValue: getOneData['insureCost']?getOneData['insureCost'] :''
                                })}
                                placeholder=""
								className ={'col-md-4 text-input-nowidth'}
                            />
                        </div>
                    </div>

                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} ><span>*</span>{i18n.t(200505/*合同支付方式*/)}</label>
                            <div className={'col-md-6'}>
                                <ConstVirtualSelect
                                    form={this.props.form}
                                    fieldName='payTrmCorpTyId'
                                    apiType={apiPost}
									apiParams={{
										obj:'com.fooding.fc.enumeration.CorpType',
										queryParams:[{
											attr:'id',
											expression:"in",
											objValues:[10,20,30]
										}]					
									}}
                                    rules={true}
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
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} ><span>*</span>{i18n.t(200506/*信用期限*/)}</label>
                            <input type="text"
                                {...getFieldProps('creTerm',{
                                    rules: [{required:true}],
                                    initialValue: getOneData['creTerm']?getOneData['creTerm']:''
                                })}
                                className ={getFieldError('creTerm') ? 'col-md-3 text-input-nowidth error-border' : 'col-md-3 text-input-nowidth'}
                            />
                            <label className={'col-md-1 col-lg-1'} style={{textAlign:'left',color:'#000033'}}>&nbsp;&nbsp;&nbsp;{i18n.t(200519/*天*/)}</label>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} ><span>*</span>{i18n.t(100224/*运输方式*/)}</label>
							<Select
								{...getNFieldProps('transId',{
                                    rules: [{required:true}],
								    initialValue: getOneData['transId'] ?
												{ s_label: getOneData['trans'+language], transId: getOneData.transId, transLcName: getOneData.transLcName, transEnName: getOneData.transEnName }
												:
												undefined
								})}
								optionLabelProp="children"
								optionFilterProp="children"
								className ={getFieldError('transId')?'currency-btn select-from-currency col-md-4 error-border':'currency-btn select-from-currency col-md-4 col-lg-4'}
                                onClick={this.handleTransport}
                                showArrow={false}
                                allowClear={false}
							>
                                {this.state.transport.map((o,i)=><Option key={i} objValue={{
                                    s_label:o.name,
                                     transId: o.id,
                                      transLcName:o.name,
                                       transEnName: o.name
                                   }} title={o.name}>{o.name}</Option>)}
							</Select>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} ><span>*</span>{i18n.t(200507/*限额额度申请*/)}</label>
                            <input type="text"
                                {...getFieldProps('creditAmt',{
                                    rules: [{required:true,}],
                                    initialValue: getOneData['creditAmt']?getOneData['creditAmt']:''
                                })}
                                className ={getFieldError('creditAmt')?'col-md-4 text-input-nowidth error-border':'col-md-4 text-input-nowidth'}
                            />
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} >{i18n.t(200508/*预计出运日期*/)}</label>
                            <div className={'col-md-4 datetime'}>
								<Calendar
									width={'100%'}
									showTime = {false}
									isShowIcon={true}
									form={this.props.form}
									validate={false}
									className ={getFieldError('preTranDate')?'error-border':''}
									name={'preTranDate'}
									value={getOneData['preTranDate']}
									onChangeTime={this.changeStartTime}
								/>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className="form-group col-md-12">
                            <label className={'col-md-2 col-md-offset-2'} ><span>*</span>{i18n.t(200509/*咨信调查报告*/)}</label>
							<Select
								{...getNFieldProps('creReportMark',{
                                    rules: [{required:true}],
								    initialValue: getOneData['creReportMark'] ? String(getOneData['creReportMark']) : 'false'
								})}
								optionLabelProp="children"
								optionFilterProp="children"
								className ={getFieldError('creReportMark')?'currency-btn select-from-currency col-md-4 error-border':'currency-btn select-from-currency col-md-4 col-lg-4'}
                                showArrow={false}
                                allowClear={false}
                            >
								<Option key={0} value={'true'} title={i18n.t(100141/*是*/)}>{i18n.t(100141/*是*/)}</Option>
								<Option key={1} value={'false'} title={i18n.t(100142/*否*/)}>{i18n.t(100142/*否*/)}</Option>
							</Select>
                        </div>
                    </div>




                        { (creditTypeMessage ? ( (creditTypeMessage == 1) ? true : false) : ( (getOneData['payTrmCorpTyId']=='20') ? true : false) ) ?
                            <div>
                                <div className={'row'}>
                                    <div className="form-group col-md-12">
                                        <label className={'col-md-2 col-md-offset-2'} ><span>*</span>{i18n.t(200510/*开证银行英文名称*/)}</label>
                                        <input type="text"
                                            {...getFieldProps('issBankEnName',{
                                                rules: [{required:true,}],
                                                initialValue: getOneData['issBankEnName']?getOneData['issBankEnName']:''
                                            })}
                                           className ={getFieldError('issBankEnName')?'col-md-4 text-input-nowidth error-border':'col-md-4 text-input-nowidth'}
                                        />
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className="form-group col-md-12">
                                        <label className={'col-md-2 col-md-offset-2'} ><span>*</span>{i18n.t(100508/*银行地址*/)}</label>
                                        <input type="text"
                                            {...getFieldProps('bankAddr',{
                                                rules: [{required:true,}],
                                                initialValue: getOneData['bankAddr']?getOneData['bankAddr'] :''
                                            })}
                                           className ={getFieldError('bankAddr')?'col-md-4 text-input-nowidth error-border':'col-md-4 text-input-nowidth'}
                                        />
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className="form-group col-md-12">
                                        <label className={'col-md-2 col-md-offset-2'} ><span>*</span>{i18n.t(200511/*开证所属国家地区*/)}</label>
                                        <Select
                                            {...getNFieldProps('bankCoutryId',{
                                                rules: [{required:true}],
                                                initialValue: getOneData['bankCoutryId'] ?
                                                            { s_label: getOneData['bankCoutry'+language], bankCoutryId: getOneData.bankCoutryId, bankCoutryLcName: getOneData.bankCoutryLcName, bankCoutryEnName: getOneData.bankCoutryEnName }
                                                            :
                                                           undefined
                                            })}
                                            optionLabelProp="children"
                                            optionFilterProp="children"
                                            className ={getFieldError('bankCoutryId')?'currency-btn select-from-currency col-md-4 error-border':'currency-btn select-from-currency col-md-4 col-lg-4'}
                                            onClick={this.handleCountry}
                                        >
                                            {this.state.country.map((o,i)=><Option key={i} objValue={{s_label:o.localName, bankCoutryId: o.id, bankCoutryLcName:o.localName, bankCoutryEnName: o.name}} title={o.localName}>{o.localName}</Option>)}
                                        </Select>
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className="form-group col-md-12">
                                        <label className={'col-md-2 col-md-offset-2'} ><span>*</span>{i18n.t(200512/*开证银行SWIFT码*/)}</label>
                                        <input type="text"
                                            {...getFieldProps('bankSWIFT',{
                                                rules: [{required:true,}],
                                                initialValue: getOneData['bankSWIFT']?getOneData['bankSWIFT']:''
                                            })}
                                            className ={getFieldError('bankSWIFT')?'col-md-4 text-input-nowidth error-border':'col-md-4 text-input-nowidth'}
                                        />
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className="form-group col-md-12">
                                        <label className={'col-md-2 col-md-offset-2'} >{i18n.t(100478/*电话*/)}</label>
                                        <input type="text"
                                            {...getFieldProps('bankTel',{
                                                initialValue: getOneData['bankTel']?getOneData['bankTel'] :''
                                            })}
                                            placeholder=""
                                            className ={'col-md-4 text-input-nowidth'}
                                        />
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className="form-group col-md-12">
                                        <label className={'col-md-2 col-md-offset-2'} >{i18n.t(200513/*邮政编码*/)}</label>
                                        <input type="text"
                                            {...getFieldProps('bankPocode',{
                                                initialValue: getOneData['bankPocode']?getOneData['bankPocode'] :''
                                            })}
                                            placeholder=""
                                            className ={'col-md-4 text-input-nowidth'}
                                        />
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className="form-group col-md-12">
                                        <label className={'col-md-2 col-md-offset-2'} >{i18n.t(200514/*最迟装船日*/)}</label>
                                        <div className={'col-md-4 datetime'}>
                                            <Calendar
                                                width={'100%'}
                                                showTime = {false}
                                                isShowIcon={true}
                                                form={this.props.form}
                                                validate={false}
                                                className ={getFieldError('laShip')?'error-border':''}
                                                name={'laShip'}
                                                value={getOneData['laShip']}
                                                onChangeTime={this.changeStartTime}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className="form-group col-md-12">
                                        <label className={'col-md-2 col-md-offset-2'} >{i18n.t(200515/*最早装船日*/)}</label>
                                        <div className={'col-md-4 datetime'}>
                                            <Calendar
                                                width={'100%'}
                                                showTime = {false}
                                                isShowIcon={true}
                                                form={this.props.form}
                                                validate={false}
                                                className ={getFieldError('earliShip')?'error-border':''}
                                                name={'earliShip'}
                                                value={getOneData['earliShip']}
                                                onChangeTime={this.changeStartTime}
                                            />
                                        </div>
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
