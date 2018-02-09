import React, { Component,PropTypes } from 'react';
import {browserHistory,withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import ColorSelect from "../../../../components/Table/ColorColumn";
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {permissionsBtn, apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import StatusShow from "../../../../components/StateShow";
import { I18n } from '../../../../lib/i18n';
function getActiveTab(pathname,navTabs){
	let currents,activeTab=0;
	currents= navTabs.filter((item,index)=>(item.url==pathname));
	if(currents&&currents.length>0){
		activeTab=currents[0].id;
	}
	return activeTab;
}
export  class  PODetailsHead extends Component{
	    constructor(props) {
	        super(props);
	        this.array =[];
					let navTabs=[
						{name:I18n.t(100097/*详情*/),url:'/pruchaseorder/detail',id:'detail',isLoading:false},
						{name:I18n.t(100586/*邮件*/),url:'/pruchaseorder/email',id:'email',isLoading:false},
						{name:I18n.t(100588/*联络*/),url:'/pruchaseorder/contact',id:'contact',isLoading:false},
						{name:I18n.t(100587/*约会*/),url:'/pruchaseorder/date',id:'date',isLoading:false},
						{name:I18n.t(400089/*单证*/),url:'/pruchaseorder/print',id:'print',isLoading:false},
						{name:I18n.t(100136/*附件*/),url:'/pruchaseorder/accessory',id:'accessory',isLoading:false},
						{name:I18n.t(100148/*注释*/),url:'/pruchaseorder/annotation',id:'annotation',isLoading:false},
						{name:I18n.t(500263/*共享附件*/),url:'/pruchaseorder/share',id:'share',isLoading:false}
			];
					let activeTabId= getActiveTab(props.location.pathname,navTabs)
	        this.state = { visible: false,activeTab:this.props.curentId,
	        			isShow:false,
				        navContent:navTabs,
				        showDilaog:false,
				        dialogContent:<div></div>,
				        showHeader:true,
				        tiaozhengArray:[]

			};
		        this.onClickLink=this.onClickLink.bind(this);
		        this.confirm = this.confirm.bind(this);
    	}
    	onClickLink(e,v){
            this.props.onClickLink({id:v.id, dataTyId: v.dataTyId,activeTab:this.state.activeTab,isLoading:v.isLoading});
            let navContent = this.state.navContent;
            navContent[e].isLoading = true;
            this.setState({
                activeTab:v.id,
                navContent:navContent
            });
    		// let tab={id:this.props.navigate.currentTab,url:v.url};
            // this.props.updateTab(tab);
    		// browserHistory.push({pathname:v.url,query:{id:this.props.location.query.id}});
    	}
    	//详情点击修改
    	onEditDetail = () => {
    		let {navReplaceTab, PurOrder, navRemoveTab,navAddTab} = this.props;
			//navRemoveTab({name: I18n.t(400020/*采购订单*/) + I18n.t(100097/*详情*/), component: I18n.t(400020/*采购订单*/) + I18n.t(100097/*详情*/), url: '/pruchaseorder/detail'});
	        navReplaceTab({name:I18n.t(100439/*编辑*/) + I18n.t(400020/*采购订单*/),component: I18n.t(100439/*编辑*/) + I18n.t(400020/*采购订单*/),url:'/pruchaseorder/add'});
	        this.props.router.push({pathname:'/pruchaseorder/add',query:{id:this.props.location.query.id},state:{refresh:true}})
    	}
    	deleteClick = () => {
    		let billId = this.props.location.query.id;
    		if(!billId) return;
			Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,'/purorder/delete',{billId: billId},
						(response)=>{							
							ServiceTips({text:response.message,type:'sucess'});
							let {navReplaceTab, PurOrder, navRemoveTab,navAddTab} = this.props;
					        navRemoveTab({name: I18n.t(400020/*采购订单*/) + I18n.t(100097/*详情*/), component: I18n.t(400020/*采购订单*/) + I18n.t(100097/*详情*/), url: '/pruchaseorder/detail'});
					        navRemoveTab({name: I18n.t(400020/*采购订单*/) , component: I18n.t(400020/*采购订单*/) , url: '/pruchaseorder/list'});
					        navAddTab({name:I18n.t(400020/*采购订单*/) ,component:I18n.t(400020/*采购订单*/) ,url:'/pruchaseorder/list'});
					        this.props.router.push({pathname:'/pruchaseorder/list'})
						},(error)=>{
							ServiceTips({text:error.message,type:'error'});
					});
				},
				close:() => {
					console.log('no, close')
				}
			});
    	}
    	//入库通知单
    	onRuKuDetail = () => {
    		let billId = this.props.location.query.id;
    		if(!billId) return;
			Confirm(I18n.t(400090/*你确定执行入库通知？*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/purorder/noticeIn",{billId:this.props.location.query.id},response => {
				    	let {navAddTab, PurOrder, navRemoveTab} = this.props;
				    	navRemoveTab({name:I18n.t(100439/*编辑*/) + I18n.t(400041/*入库通知单*/) ,component:I18n.t(100439/*编辑*/) + I18n.t(400041/*入库通知单*/),url:'/stockin/add'});
				        navAddTab({name:I18n.t(100439/*编辑*/) + I18n.t(400041/*入库通知单*/),component:I18n.t(100439/*编辑*/) + I18n.t(400041/*入库通知单*/),url:'/stockin/add'});
				        this.props.router.push({pathname:'/stockin/add',query:{id:response.data}})
				    },error => {
				    	ServiceTips({text:error.message,type:'error'})
				    })
				},
				close:() => {
					console.log('no, close')
				}
			});
    	}
    	//提交
    	onSubmitClick = () => {
    		let {PurOrder} = this.props;
    		let billId = this.props.location.query.id;
    		if(!PurOrder.billType) return;
			Confirm(I18n.t(400091/*您确定要提交此采购订单吗*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/common/submitBill",{billId:billId,billType:PurOrder.billType},response => {
				    	//刷新当前页面
				    	let {navReplaceTab} = this.props;
				    	navReplaceTab({name:I18n.t(400020/*采购订单*/) + I18n.t(100097/*详情*/),component:I18n.t(400020/*采购订单*/) + I18n.t(100097/*详情*/),url:'/pruchaseorder/detail'})
				    	this.props.router.push({pathname:'/pruchaseorder/detail',query:{id:billId},state:{refresh: true}})
				    	// navRefreshCurrentTab();
				    	// this.getDetail();
				    	ServiceTips({text:response.message,type:"success"})
				    },error => {
				    	ServiceTips({text:error.message,type:'error'})
				    })
				},
				close:() => {
					console.log('no, close')
				}
			});
    	}
    	confirm(){
    		let that = this;
            let {PurOrder} = this.props;
            apiGet(API_FOODING_ERP,'/purorder/checkapply',{billId:PurOrder.billId},(response)=>{
				if(response.data.pass){
					this.paymentClick();
				}else{
                    let content = require('./PruchaseConfrim').default;
                    let element = React.createElement(content, {onSaveAndClose: this.paymentClick,data:response.data.infos, onCancel: this.onCancel});
                    this.setState({
                        showDilaog: true,
                        title: I18n.t(200324/*收款情况*/),
                        dialogContent: element,
                        showHeader:true
                    });
				}

            },(error)=>{
                ServiceTips({text:error.message,type:"error"});
            });
		}
    	//付款申请
    	paymentClick = () => {
    		let {PurOrder} = this.props;
            apiGet(API_FOODING_ERP,"/paymentapplcat/getList",{sourceNo:PurOrder.no},response => {
                let initTableData = response.data;
                //订单金额
                let setTaxAgg = PurOrder.setTaxAgg;
                //金额币种
                let cnyLcName = PurOrder.cnyLcName;
                let billId = PurOrder.billId;
                let content = require('../../List/components/PaymentRequest').default;
                let element = React.createElement(content, {onSaveAndClose: this.onPaymentSaveAndClose, onCancel: this.onCancel,setTaxAgg:setTaxAgg,billId:billId,initTableData:initTableData,cnyLcName:cnyLcName});
                this.setState({
                    showDilaog: true,
                    title: I18n.t(400040/*付款申请*/),
                    dialogContent: element,
                    showHeader:true
                })
            },error => ServiceTips({text:error.message,type:"error"}))
    	}
	    //付款申请的保存
		onPaymentSaveAndClose = id => {
			this.setState({
				showDilaog:!this.state.showDilaog
			},() => {
				let {navAddTab, navRemoveTab} = this.props;
			     navRemoveTab({name:I18n.t(100392/*新增*/) + I18n.t(400040/*付款申请*/),component:I18n.t(100392/*新增*/) + I18n.t(400040/*付款申请*/),url:'/paymentApplication/addEidt'});
			     navAddTab({ name: I18n.t(100439/*编辑*/) + I18n.t(400040/*付款申请*/), component: I18n.t(100439/*编辑*/) + I18n.t(400040/*付款申请*/), url: '/paymentApplication/addEidt'});
			     this.props.router.push({pathname: '/paymentApplication/addEidt',query:{id:id}});
			})	
		}
		//采购调整单
		onTaozhengClick = () =>　{
			let billId = this.props.location.query.id;
			apiForm(API_FOODING_ERP,'/purorder/adjust',{billId:billId},response => {
				let data = response.data;
				let {navAddTab, navRemoveTab} = this.props;
				if(data && data.status == 1){
					//草稿状态 跳转到编辑页面
					navRemoveTab({name:I18n.t(400092/*采购调整*/),component:I18n.t(400092/*采购调整*/),url:'/pruchaseorderadjust/edit'});
		        	navAddTab({name:I18n.t(400092/*采购调整*/),component:I18n.t(400092/*采购调整*/),url:'/pruchaseorderadjust/edit'});
		        	this.props.router.push({pathname:'/pruchaseorderadjust/edit',query:{id:data.billId,isView:false}})
				}else{
					//其他状态，跳转到详情页面
					navRemoveTab({name:I18n.t(400092/*采购调整*/) + I18n.t(100097/*详情*/),component:I18n.t(400092/*采购调整*/) + I18n.t(100097/*详情*/),url:'/pruchaseorderadjust/detail'});
		        	navAddTab({name:I18n.t(400092/*采购调整*/) + I18n.t(100097/*详情*/),component:I18n.t(400092/*采购调整*/) + I18n.t(100097/*详情*/),url:'/pruchaseorderadjust/detail'});
		       		this.props.router.push({pathname:'/pruchaseorderadjust/detail',query:{id:data.billId,isView:true}})
				}				
			},error => ServiceTips({text:error.message,type:'error'}))
		}
		//查看审批
		onApproveClick = () => {
			let {PurOrder = {}} = this.props;
			let billId = PurOrder.billId,billType = PurOrder.billType;
			let content = require('../Content/components/ApprovalDialog').default;
	        let element = React.createElement(content, {onCancel: this.onCancel,billType:billType,billId:billId});
	        this.setState({
	            showDilaog: true,
	            title: I18n.t(100470/*查看审批*/),
	            dialogContent: element,
	            showHeader:false
	        })
		}
		onTuihuoClick = () => {
			let that = this;
			let {PurOrder = {}} = this.props;
			let billId = PurOrder.billId;
			apiGet(API_FOODING_ERP,'/purorderreturn/getReturnNum',{billId:billId},response => {
				let objReturnQty = response.data || {};
				let content = require('./PruchaseReturnDailog').default;
				let element = React.createElement(content, {onSaveAndClose:this.onTuihuoSaveClose,onCancel: this.onCancel,billId:billId,objReturnQty:objReturnQty});
				that.setState({
					showDilaog: true,
					title: I18n.t(400093/*退货通知*/),
					dialogContent: element,
					showHeader:true
				})
			},error => ServiceTips({text:error.message,type:'error'}))
			
		}
		//退货 保存并关闭
		onTuihuoSaveClose = data => {
			this.setState({showDilaog:false});
			let {navAddTab, navRemoveTab} = this.props;
		     navRemoveTab({name:I18n.t(400094/*采购退货*/) + I18n.t(100097/*详情*/),component:I18n.t(400094/*采购退货*/) + I18n.t(100097/*详情*/),url:'/purorderreturn/detail'});
		     navAddTab({ name: I18n.t(400094/*采购退货*/) + I18n.t(100097/*详情*/), component: I18n.t(400094/*采购退货*/) + I18n.t(100097/*详情*/), url: '/purorderreturn/detail'});

		     this.props.router.push({pathname: '/purorderreturn/detail',query:{id:data}});
		}
		//发票
		onInvoiceClick = () => {
			let {PurOrder = {}} = this.props;
			let billId = PurOrder.billId;
			let content = require('./PurchaseInvoiceDialog').default;
	        let element = React.createElement(content, {onSaveAndClose:this.onInvoiceSaveClose,
	        	onCancel: this.onCancel, PurOrder:this.props.PurOrder,
	        	billId:billId});
	        this.setState({
	            showDilaog: true,
	            title: I18n.t(400060/*采购发票*/),
	            dialogContent: element,
	            showHeader:true
	        })
		}
		//发票 保存并关闭
		onInvoiceSaveClose = data => {
			this.setState({showDilaog:false});
			let {navAddTab, navRemoveTab} = this.props;
		     navRemoveTab({name:I18n.t(400060/*采购发票*/) + I18n.t(100097/*详情*/),component:I18n.t(400060/*采购发票*/) + I18n.t(100097/*详情*/),url:'/purinvoice/detail'});
		     navAddTab({ name: I18n.t(400060/*采购发票*/) + I18n.t(100097/*详情*/), component: I18n.t(400060/*采购发票*/) + I18n.t(100097/*详情*/), url: '/purinvoice/detail'});

		     this.props.router.push({pathname: '/purinvoice/detail',query:{id:data}});
		}
		//作废
		chexiaoClick = () => {
			let that = this;
    		let {PurOrder ={}} = this.props;
    		if(!PurOrder.billType) return;
			Confirm(I18n.t(400095/*您确定要执行撤销操作吗？*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/purorder/reject",{billId:this.props.location.query.id},response => {
				    	//刷新当前页面
				    	this.props.getDetail();
				    	ServiceTips({text:response.message,type:"success"})
				    },error => {
				    	ServiceTips({text:error.message,type:'error'})
				    })
				},
				close:() => {
					console.log('no, close')
				}
			});
		}
    	onSaveAndClose = () => {
			this.setState({
				showDilaog:!this.state.showDilaog
			})
		}
		onCancel = () => {
			this.setState({
				showDilaog:false
			})
		}
		initAdjust = () => {
			let {PurOrder = {}} = this.props;
			let billId = this.props.location.query.id;
			if(!billId) return;
			apiGet(API_FOODING_ERP,'/puradjust/getList',{purId:billId},
				(response)=>{
					this.setState({
						tiaozhengArray:response.data
					});
				},(error)=>{

				})
		}
		Link = billId =>{
    		let {navAddTab, navRemoveTab,navReplaceTab} = this.props;
    		navAddTab({name:I18n.t(400092/*采购调整*/) + I18n.t(100097/*详情*/),component:I18n.t(400092/*采购调整*/) + I18n.t(100097/*详情*/),url:'/pruchaseorderadjust/detail'});

		    this.props.router.push({pathname:'/pruchaseorderadjust/detail',query:{id:billId,isView:true}})
    	}
    	componentWillReceiveProps(nextProps){
    		// console.log(nextProps);
    	}
		componentDidMount(){
			let activeId= getActiveTab(this.props.location.pathname,this.state.navContent);
			this.setState({activeTab:activeId},this.initAdjust());
		}

		// 发送模板 
		sendTemplateHandle = ()=> {
			let {PurOrder={}} = this.props;
			let content = require('../../../Common_confirm/sendTpl').default;
			let element = React.createElement(content, {
				active:'purchase',
				getOne:PurOrder,
				onCancel: this.onCancel,
			});

			this.setState({
				showDilaog: true,
				title: I18n.t(600293/*发送模板*/),
				dialogContent: element,
				showHeader:false
			}) 
		}

		render(){
			let array_name=this.state.navContent;
			let {PurOrder = {}} = this.props,buttonDom=<span></span>,stateShowDom,common=(<span></span>);
			if(this.state.tiaozhengArray.length>0){
				common =<span style={{marginLeft:'50px',fontSize:"14px"}}>
								<span style={{marginRight:'10px'}}>{I18n.t(400096/*调整单*/)}</span>
								{
									this.state.tiaozhengArray.map((value,i)=>{
										return <a key={i} onClick={this.Link.bind(this,value.billId)} style={{margin:"0 5px"}}>{value.no}</a>
									})
								}
						</span>
			}
			if(PurOrder.status == 1){
				//草稿
				buttonDom = (<span style={{float:'right'}}>
					
					{ permissionsBtn('porder.examine') ? <i className="foddingicon fooding-approve" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(100470/*查看审批*/)} onClick={this.onApproveClick}></i> : ''}
					{ permissionsBtn('porder.edit') ? <i className="foddingicon fooding-Edit" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(100439/*编辑*/)} onClick={this.onEditDetail}></i> : ''}
					{ permissionsBtn('porder.del') ? <i className="foddingicon fooding-delete-icon3" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(100437/*删除*/)} onClick = {this.deleteClick}></i> : ''}
					{ permissionsBtn('porder.submit') ? <i className="foddingicon fooding-submit" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(100472/*提交*/)} onClick={this.onSubmitClick}></i> : ''}
					
					{ permissionsBtn('porder.sentemplate') && 1 ? <i className="foddingicon fooding-stockinformation" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(600293/*发送模板*/)} onClick={this.sendTemplateHandle}></i> : ''}
					
				</span>)
			}else if(PurOrder.status == 5){
				//已提交
				buttonDom = (<span style={{float:'right'}}>
					{ permissionsBtn('porder.examine') ? <i className="foddingicon fooding-approve" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(100470/*查看审批*/)} onClick={this.onApproveClick}></i> :''}
					{ permissionsBtn('porder.sentemplate') && 1 ? <i className="foddingicon fooding-stockinformation" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(600293/*发送模板*/)} onClick={this.sendTemplateHandle}></i> : ''}
					
				</span>)
			}else if(PurOrder.status == 10){
				//已审批
				buttonDom = (<span style={{float:'right'}}>
					{ permissionsBtn('porder.examine') ? <i className="foddingicon fooding-approve" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(100470/*查看审批*/)} onClick={this.onApproveClick}></i> :''}
					{ permissionsBtn('porder.toinotice') ? <i className="foddingicon fooding-put" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(400041/*入库通知单*/)} onClick={this.onRuKuDetail}></i> : ''}
					{ permissionsBtn('porder.topayrequest') ? <i className="foddingicon fooding-payment-apply" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(400040/*付款申请*/)} onClick={this.confirm}></i> : ''}
					{ permissionsBtn('porder.adjustment') ? <i className="foddingicon fooding-order" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(100469/*订单调整*/)} onClick={this.onTaozhengClick}></i> : ''}
					{ permissionsBtn('porder.return') ? <i className="foddingicon fooding-shall" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(400094/*采购退货*/)} onClick={this.onTuihuoClick}></i> :''}
					{ permissionsBtn('porder.invoice') ? <i className="foddingicon fooding-quote" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(400060/*采购发票*/)} onClick={this.onInvoiceClick}></i> :''} 
					{ permissionsBtn('porder.cancelexamine') ? <i className="foddingicon fooding-cancal" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(100471/*作废*/)} onClick={this.chexiaoClick}></i> :""}
					{ permissionsBtn('porder.sentemplate') && 1 ? <i className="foddingicon fooding-stockinformation" style={{fontSize:'16px',marginRight:'20px'}} title ={I18n.t(600293/*发送模板*/)} onClick={this.sendTemplateHandle}></i> : ''}
			
				</span>)
			}
			return  (
				<div className = 'cdetails' style={{zIndex:11}}>
						<div className="box1">
								<div className="touxiang">
										<div className="tupian"><i className="foddingicon fooding-user_icon"></i></div>
								</div>
								<div className="right">
										<div className="box3">
											<div className="daima">
												<p>{PurOrder.no}</p>
												<StatusShow status={PurOrder.status || ""} statusName={PurOrder.statusName || ""}/>
												<span style={{float:'right'}}>
												{common}
												{buttonDom}</span>
											</div>
											<span className="name"><p>{PurOrder.vndBeLcName}</p></span>
										</div>
										<div className="box4">
												<div className="flex"><div className="nation"><span>{I18n.t(100133/*支付条款*/)}</span><b title={PurOrder.payTrmLcName || ""}>{PurOrder.payTrmLcName || ""}</b></div></div>
												<div className="flex"><div className="contact"><span>{I18n.t(400097/*价格条款*/)}</span><b>{PurOrder.incotmLcName || ""}</b></div></div>
												<div className="flex"><div className="source"><span>{I18n.t(100323/*业务日期*/)}</span><b>{new Date(PurOrder.billDate).Format('yyyy-MM-dd')}</b></div></div>
												<div className="flex"><div className="web"><span>{I18n.t(400098/*采购总额*/)}</span><b>{toDecimal(PurOrder.setTaxAgg)} {PurOrder.cnyLcName}</b></div></div>

										</div>
								</div>

						</div>
						<ul className="box2">
								{
									array_name.map((item,i)=>{
										return (<li key={i}><a onClick ={()=>this.onClickLink(i,item)} className={this.state.activeTab== item.id ?'heghtL':''}>{item.name} </a></li>);
									})
								}
						</ul>
						<Dialog showHeader={true} width={926} visible={this.state.showDilaog} title={this.state.title}>
							{this.state.dialogContent}
						</Dialog>
				</div>
				);
		}
}
export default NavConnect(LocationConnect(withRouter(PODetailsHead)));
