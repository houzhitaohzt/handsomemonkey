import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {browserHistory,withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import ColorSelect from "../../../../components/Table/ColorColumn";
import Confirm from '../../../../components/Dialog/Confirm';
import {hrefFunc,permissionsBtn, apiGet, apiPost, apiForm,language, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList } from "../../../../services/apiCall";
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
import Dialog  from '../../../../components/Dialog';
import StatusShow from "../../../../components/StateShow";
import xuanyinhangDialog from '../Head/xuanyinhang'; //选择银行
function getActiveTab(pathname,navTabs){
	let currents,activeTab=0;
	currents= navTabs.filter((item,index)=>(item.url==pathname));
	if(currents&&currents.length>0){
		activeTab=currents[0].id;
	}
	return activeTab;
}
export  class  SODetailsHead extends Component{
	    constructor(props) {
	        super(props);
	        this.array =[];
					let navTabs=[
						{name:i18n.t(100097/*详情*/),url:'/booking/detail',id:'detail',isLoading:false},
						{name:i18n.t(100586/*邮件*/),url:'/booking/email',id:'email',isLoading:false},
						{name:i18n.t(100587/*约会*/),url:'/booking/date',id:'date',isLoading:false},
						{name:i18n.t(100588/*联络*/),url:'/booking/contact',id:'contact',isLoading:false},
						{name:i18n.t(400089/*单证*/),url:'/booking/print',id:'print',isLoading:false},
						{name:i18n.t(500262/*物流费用*/),url:'/booking/portfht',id:'portfht',isLoading:false},
						// {name:'物流费用',url:'/booking/ccidfee',id:6},
						// {name:'产品检测费用',url:'/booking/testpro',id:7},
						{name:i18n.t(200367/*其他费用*/),url:'/booking/feiyong',id:'feiyong',isLoading:false},
						{name:i18n.t(100136/*附件*/),url:'/booking/accessory',id:'accessory',isLoading:false},
						{name:i18n.t(500263/*共享附件*/),url:'/booking/share',id:'share',isLoading:false},
						{name:i18n.t(100148/*注释*/),url:'/booking/annotation',id:'annotation',isLoading:false}
			];
					let activeTabId= getActiveTab(props.location.pathname,navTabs);
	        this.state = {
	        			isUp:false,
	        			showDilaog:false,
	        			showHeader:true,
	        			activeTab:this.props.curentId,
	        			isShow:false,
				        navContent:navTabs,
			};
		        this.onClickLink=this.onClickLink.bind(this);
		        this.onItemClick=this.onItemClick.bind(this);
		        this.onclickXin =this.onclickXin.bind(this);
		        this.editClick = this.editClick.bind(this);
		        this.deleteClick = this.deleteClick.bind(this);
		        this.commitClick = this.commitClick.bind(this);
		        this.jisuanClick = this.jisuanClick.bind(this);
		        this.fuKuan = this.fuKuan.bind(this);
		        //this.fyClick = this.fyClick.bind(this);
		        this.chexiaoClick = this.chexiaoClick.bind(this);
		        this.jiedanClick = this.jiedanClick.bind(this);
		        this.fjiedanClick = this.fjiedanClick.bind(this);
    	}
    	fjiedanClick(){
    		let that = this;
    		let {getOne} = this.props;
    		if(!getOne.billType) return;
    		Confirm(i18n.t(300053/*您确定要执行反结单操作吗？*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/shipping/unsettle",{billId:this.props.id},response => {
				    	//刷新当前页面
				    	this.props.onPackUp();
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
    	jiedanClick(){
    		let that = this;
    		let {getOne} = this.props;
    		if(!getOne.billType) return;
    		Confirm(i18n.t(300054/*您确定要执行结单操作吗？*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/shipping/settle",{billId:this.props.id},response => {
				    	//刷新当前页面
				    	this.props.onPackUp();
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
    	chexiaoClick(){
    		let that = this;
    		let {getOne} = this.props;
    		if(!getOne.billType) return;
    		Confirm(i18n.t(300055/*您确定要执行撤销操作吗？*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/shipping/reject",{billId:this.props.id},response => {
				    	//刷新当前页面
				    	this.props.onPackUp();
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
    	/*fyClick(){
    		let that = this;
    		let {getOne} = this.props;
    		if(!getOne.billType) return;
    		Confirm(i18n.t(300056*//*您确定要执行发运操作吗？*//*), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/shipping/shipment",{billId:this.props.id},response => {
                        that.setState({
                            data: response.data.bankName,
                        });
                        if(response.data.bankName!=null){
                            let content = require('./xuanyinhang').default;
                            let element = React.createElement(content, {onCancel: this.onCancel,router:this.props.router, getOne:getOne,onSaveAndClose: this.xuanzeyinhangClick});
                            this.setState({
                                showDilaog: true,
                                title:'选择银行',
                                dialogContent: element,
                                showHeader:true
                            })
                        }


				    	//刷新当前页面
				    	this.props.onPackUp();
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
        xuanzeyinhangClick = (data,value) => {
            this.setState({
                showDilaog:true,
                title:'选择银行',
                dialogContent:<xuanyinhangDialog onCancel={this.onCancel}
                                             selectRow={this.state.selectRow}
                                             getOne ={this.state.getOne} onPackUp={this.onPackUp}/>
            });
        };*/
    	fuKuan(){
            let that = this;
    		let {getOne} = this.props;
    		if(!getOne.billType) return;
    		Confirm(i18n.t(300023/*您确定要执行付款申请吗？*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/shipping/payapply",{billId:this.props.id},response => {
				    	//刷新当前页面
				    	this.props.onPackUp();
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
    	jisuanClick(){
    		let that = this;
    		let {getOne} = this.props;
    		if(!getOne.billType) return;
    		Confirm(i18n.t(200368/*您确定要执行计算费用吗*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/shipping/calculate",{billId:this.props.id},response => {
				    	//刷新当前页面
				    	this.props.onPackUp();
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
    	commitClick(){
    		let {getOne} = this.props;
    		if(!getOne.billType) return;
    		Confirm(i18n.t(200369/*您确定要提交此订单吗*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/common/submitBill",{billId:this.props.id,billType:getOne.billType},response => {
				    	//刷新当前页面
				    	this.props.onPackUp();
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
    	editClick(){
    		let that = this;
    		let {navAddTab, navRemoveTab,navReplaceTab} = this.props;
	        navReplaceTab({ name: i18n.t(200371/*物流订单编辑*/), component: i18n.t(200371/*物流订单编辑*/), url: '/booking/edit'});
	        this.props.router.push({pathname: '/booking/edit',query:{id:this.props.id}});
    	}
    	deleteClick(){
    		Confirm(i18n.t(200372/*删除后将无法恢复，您确定要删除吗*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,'/shipping/delete',{billId:this.props.id},(response)=>{
		    				 let {navReplaceTab, businessOne, navRemoveTab} = this.props;
				       		this.props.navRemoveTab({name: i18n.t(200370/*物流订单详情*/), component: i18n.t(200370/*物流订单详情*/), url: '/booking/detail'});
		        			this.props.navReplaceTab({name:i18n.t(200373/*物流订单*/),component:i18n.t(200373/*物流订单*/),url:'/Booking/list'});
		        			this.props.router.push({ pathname: '/Booking/list'});
		    				ServiceTips({text:response.message,type:'sucess'});
		    		},(error)=>{
		    				ServiceTips({text:error.message,type:'error'});
		    		})
				},
				close:() => {
					console.log('no, close')
				}
			});
    	}
    	onItemClick(){
    		// this.setState({
    		// 	isUp:!this.state.isUp
    		// });
    		// if(this.state.isUp){
    		// 	this.props.onPackUp(226);
    		// }else{
    		// 	this.props.onPackUp(173);
    		// }
    	}
    	onClickLink(e,v){
            this.props.onClickLink({id:v.id, dataTyId: v.dataTyId,activeTab:this.state.activeTab,isLoading:v.isLoading});
            let navContent = this.state.navContent;
            navContent[e].isLoading = true;
            this.setState({
                activeTab:v.id,
                navContent:navContent
            });

			// let tab = {id: this.props.navigate.currentTab, url: v.url};
			// this.props.updateTab(tab);
			// browserHistory.push({pathname:v.url,query:{id:this.props.id}});
	}
    	componentWillReceiveProps(nextProps){
    		// console.log(nextProps);
    	}
		componentDidMount(){
			// let activeId= getActiveTab(this.props.location.pathname,this.state.navContent);
			// this.setState({activeTab:activeId});
		}

		onclickXin(){
				this.setState({
					isShow:!this.state.isShow
				});
		}
		// //销售订单执行情况
		// zhuangtaiClick=(num)=>{
		// 	let that = this;
		// 	this.setState({
		// 			showDilaog: true,
		// 			title:i18n.t(500260/*销售订单执行情况*/),
		// 			dialogContent: React.createElement(require('../../../BookNeed/components/sourceNoDetail').default,{onCancel:that.onCancel,num:num})
		// 		});
		// 	}



		render(){
			let array_name=this.state.navContent;
			let {getOne} =this.props;
															// { permissionsBtn('shipping.topayrequest') && (getOne.status==10 || getOne.status == 30)? <i className="foddingicon fooding-payment-apply" style={{fontSize:'16px',marginRight:'20px'}} title ={'付款申请'} onClick={this.fuKuan}></i> : ''}
			return  (
				<div className = 'cdetails'>
						<div className="box1">
								<div className="touxiang">
										<div className="tupian"><i className="foddingicon fooding-user_icon"></i></div>
								</div>
								<div className="right">
										<div className="box3">
											<div className="daima">
												<p>{getOne.no}</p>
												<StatusShow status={getOne.status || ""} statusName={getOne.statusName || ""}/>
												<span style={{float:'right'}}>
												{ permissionsBtn('shipping.Deliverynotice') && getOne.status == 10 ?<i className="foddingicon fooding-shouhuo" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200374/*送货通知*/)} onClick={this.props.songhuotonglzhiClick}></i>	: ''}
												{ permissionsBtn('shipping.shipinfo') && getOne.status == 10? <i className="foddingicon fooding-fyxx" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200342/*发运信息*/)} onClick={this.props.fayunClick}></i> : ''}
												{ permissionsBtn('shipping.shipment') && getOne.status == 10 ? <i className="foddingicon fooding-fc" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200375/*发运*/)} onClick={this.props.fyClick}></i> : ''}
												{ permissionsBtn('shipping.edit') && getOne.status == 1 ? <i className="foddingicon fooding-Edit" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200376/*修改*/)} onClick={this.editClick}></i> : ''}
												{ permissionsBtn('shipping.del') && getOne.status == 1 ? <i className="foddingicon fooding-delete_icon2" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100437/*删除*/)} onClick={this.deleteClick}></i> : ''}
												{ permissionsBtn('shipping.submit') && getOne.status == 1 ? <i className="foddingicon fooding-submit" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100472/*提交*/)} onClick={this.commitClick}></i> : ''}
												{ permissionsBtn('shipping.examine')? <i className="foddingicon fooding-approve" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100470/*查看审批*/)} onClick={this.props.shenpiClick}></i> : ''}
												{ permissionsBtn('shipping.cancelexamine')&& getOne.status == 10? <i className="foddingicon fooding-cancal" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200377/*驳回审批*/)} onClick={this.chexiaoClick}></i> : ''}
												{ permissionsBtn('shipping.singlenode')&&getOne.status == 30? <i className="foddingicon fooding-handle" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200378/*物流结单*/)} onClick={this.jiedanClick}></i> : ''}
												{ permissionsBtn('shipping.singlenode')&&getOne.status == 99? <i className="foddingicon fooding-reveser-cancal" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200379/*反结单*/)} onClick={this.fjiedanClick}></i> : ''}

												{ permissionsBtn('shipping.sentemplate') && 1 ? <i className="foddingicon fooding-stockinformation" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(600293/*发送模板*/)} onClick={this.props.sendTemplateHandle}></i> : ''}

												</span>





											</div>
											<span className="name"><p>{getOne["forwarderBe"+language]?getOne["forwarderBe"+language]:' '}</p></span>
										</div>
										<div className="box4">
												<div className="flex"><div className="nation"><span>{i18n.t(200345/*货代联系人*/)}</span><b>{getOne["linker"+language]}</b></div></div>
												<div className="flex">
													<div className="contact">
														<span>{i18n.t(400008/*销售单号*/)}</span>
														<b>


																<a href="javascript:;" className={'link-color'}  style={{marginRight:'10px'}} onClick={this.props.zhuangtaiClick.bind(this,getOne.sourceNo)}>{getOne.sourceNo}</a>
																<i className="foddingicon fooding-transport-message" onClick={hrefFunc.bind(this,i18n.t(600164/*出运信息*/),`/print/single?single=messageFlow&billId=`+getOne['sourceId'])} title={i18n.t(600164/*出运信息*/)}></i>





														</b>
													</div>
												</div>
												<div className="flex"><div className="source"><span>{i18n.t(100323/*业务日期*/)}</span><b>{new Date(getOne.billDate).Format('yyyy-MM-dd')}</b></div></div>
												<div className="flex"><div className="source"><span>{i18n.t(200332/*紧急程度*/)}</span><b>{getOne.urgencyTypeName}</b></div></div>
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
                    {/*<Dialog width={926} visible={this.state.showDilaog} title={this.state.title} showHeader={this.state.showHeader}>
                        {this.state.dialogContent}
                    </Dialog>*/}


				</div>
				);
		}
}
export default NavConnect(LocationConnect(withRouter(SODetailsHead)));
