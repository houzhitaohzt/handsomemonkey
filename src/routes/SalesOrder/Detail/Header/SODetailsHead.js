import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {browserHistory,withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import ColorSelect from "../../../../components/Table/ColorColumn";
import Confirm from '../../../../components/Dialog/Confirm';
import {permissionsBtn, apiGet, apiPost, apiForm,language, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,toDecimal} from "../../../../services/apiCall";
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
import StatusShow from "../../../../components/StateShow";
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
						{name:i18n.t(100097/*详情*/),url:'/SalesOrder/detail',id:'detail',isLoading:false},
						{name:i18n.t(200408/*费用确认*/),url:'/SalesOrder/costconfirmation',id:'costconfirmation',isLoading:false},
						{name:i18n.t(100586/*邮件*/),url:'/SalesOrder/email',id:'email',isLoading:false},
						{name:i18n.t(100588/*联络*/),url:'/SalesOrder/contact',id:'contact',isLoading:false},
						{name:i18n.t(100587/*约会*/),url:'/SalesOrder/date',id:'date',isLoading:false},
						{name:i18n.t(400089/*单证*/),url:'/SalesOrder/print',id:'print',isLoading:false},
						{name:i18n.t(100136/*附件*/),url:'/SalesOrder/accessory',id:'accessory',isLoading:false},
						{name:i18n.t(100148/*注释*/),url:'/SalesOrder/annotation',id:'annotation',isLoading:false},
						{name:i18n.t(500263/*共享附件*/),url:'/SalesOrder/share',id:'share',isLoading:false},
			];
					let activeTabId= getActiveTab(props.location.pathname,navTabs)
	        this.state = { visible: false ,isUp:false,activeTab:this.props.curentId,
	        			isShow:false,
				        navContent:navTabs,
				        tiaozhengArray:[]
			};
		        this.onClickLink=this.onClickLink.bind(this);
		        this.onItemClick=this.onItemClick.bind(this);
		        this.onclickXin =this.onclickXin.bind(this);
		        this.editClick = this.editClick.bind(this);
		        this.deleteClick = this.deleteClick.bind(this);
		        this.commitClick = this.commitClick.bind(this);
		        this.caigouClick = this.caigouClick.bind(this);
		        this.copyClick = this.copyClick.bind(this);
                this.chukuClick = this.chukuClick.bind(this);
		        this.tiaoZheng = this.tiaoZheng.bind(this);
		        this.Link = this.Link.bind(this);
    	}
    	Link(billId){
    		let {navAddTab, navRemoveTab,navReplaceTab} = this.props;
    		navAddTab({name:i18n.t(201068/*销售调整单详情*/),component:i18n.t(201068/*销售调整单详情*/),url:'/tiaozheng/detail'});
			this.props.router.push({pathname:'/tiaozheng/detail',query:{id:billId,saleNo:this.props.getOne.saleNo}});
    	}
    	copyClick(){
    		let that = this;
    		let {getOne} = this.props;
    		Confirm("您确定执行订单复制？", {
			  done: () => {
				    apiGet(API_FOODING_ERP,"/saleorder/copy",{billId:this.props.id},response => {
				    	let {navAddTab, navRemoveTab,navReplaceTab} = this.props;
				    	navAddTab({id:7,name:i18n.t(201054/*销售订单新增*/),component:i18n.t(201054/*销售订单新增*/),url:'/salesorder/addEidt'});
     						this.props.router.push({pathname:'/salesorder/addEidt',query:{id:response.data}});
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
    	tiaoZheng(){
    		let that = this;
    		let {getOne} = this.props;
    		if(!getOne.billType) return;
    		Confirm("您确定执行订单调整？", {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/saleorder/adjust",{billId:this.props.id},response => {
				    	let {navAddTab, navRemoveTab,navReplaceTab} = this.props;
				    	if(response.data.status == 1){ //草稿状态
     						navAddTab({name:i18n.t(201069/*销售调整单编辑*/),component:i18n.t(201069/*销售调整单编辑*/),url:'/tiaozheng/edit'});
     						this.props.router.push({pathname:'/tiaozheng/edit',query:{id:response.data.billId}});
				    	}else{
				    		navAddTab({name:i18n.t(201068/*销售调整单详情*/),component:i18n.t(201068/*销售调整单详情*/),url:'/tiaozheng/detail'});
				    		this.props.router.push({pathname:'/tiaozheng/detail',query:{id:response.data.billId}});
				    	}
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

    	caigouClick(){
    		let that = this;
    		let {getOne} = this.props;
    		if(!getOne.billType) return;
    		Confirm("您确定要执行采购指令？", {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/saleorder/purchase",{billId:this.props.id},response => {
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
    		if(this.props.getOne.lsStatus){
    			ServiceTips({text:i18n.t(201070/*已经生成订舱单，请先删除订舱单再操作*/),type:'error'});
    		}else{
    			let {navAddTab, navRemoveTab,navReplaceTab} = this.props;
	     		navRemoveTab({name:i18n.t(201054/*销售订单新增*/),component:i18n.t(201054/*销售订单新增*/),url:'/salesorder/addEidt'});
		        navReplaceTab({ name: i18n.t(200239/*销售订单编辑*/), component: i18n.t(200239/*销售订单编辑*/), url: '/salesorder/addEidt'});
		        this.props.router.push({pathname: '/salesorder/addEidt',query:{id:this.props.id}});
    		}
    	}
    	deleteClick(){
    		Confirm("您确定要删除吗？", {
			  done: () => {
			  		apiForm(API_FOODING_ERP,'/saleorder/delete',{billId:this.props.id},(response)=>{
    				 let {navReplaceTab, businessOne, navRemoveTab} = this.props;
		       		this.props.navRemoveTab({name: i18n.t(200962/*销售订单详情*/), component: i18n.t(200962/*销售订单详情*/), url: '/salesorder/detail'});
        			this.props.navReplaceTab({name:i18n.t(200237/*销售订单*/),component:i18n.t(200237/*销售订单*/),url:'/salesorder/list'});
        			this.props.router.push({ pathname: '/salesorder/list'});
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
		chukuClick(){
			let that = this;
			Confirm(i18n.t(300034/*您确定要执行销售出库吗？*/), {
				done: () => {
					apiForm(API_FOODING_ERP,'/saleorder/noticeOut',{billId:this.props.id},(response)=>{
						ServiceTips({text:response.message,type:'sucess'});
						this.props.navAddTab({name:i18n.t(500160/*出库通知单详情*/),component:i18n.t(500160/*出库通知单详情*/),url:'/stockout/detail'});
						this.props.router.push({ pathname:'/stockout/detail',query:{id:response.data}});
					},(error)=>{
						ServiceTips({text:error.message,type:'error'});
					});
				}
			});
		}
    	onItemClick(){
    		this.setState({
    			isUp:!this.state.isUp
    		});
    		if(this.state.isUp){
    			this.props.onPackUp(226);
    		}else{
    			this.props.onPackUp(173);
    		}
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
    		// browserHistory.push({pathname:v.url,query:{id:this.props.location.query.id,saleNo:this.props.getOne.no}});
    	}
    	componentWillReceiveProps(nextProps){
    		// console.log(nextProps);
    	}
		componentDidMount(){
			apiGet(API_FOODING_ERP,'/saleadjust/getList',{saleId:this.props.id},
				(response)=>{
					this.setState({
						tiaozhengArray:response.data
					});
				},(error)=>{

				})
			// let activeId= getActiveTab(this.props.location.pathname,this.state.navContent);
			// this.setState({activeTab:activeId});
		}

		onclickXin(){
				this.setState({
					isShow:!this.state.isShow
				});
		}
		render(){
			let array_name=this.state.navContent;
			let {getOne} =this.props;
			let common =<div></div>;

			if(this.state.tiaozhengArray.length>0){
				common =<div style={{float:'left',marginRight:'30px'}}>
								<span style={{marginRight:'10px'}}>{i18n.t(400096/*调整单*/)}</span>
								{
									this.state.tiaozhengArray.map((value,i)=>{
										return <a key={i} onClick={this.Link.bind(this,value.billId)} style={{marginRight:'10px'}}>{value.no}</a>
									})
								}
						</div>
			}
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
												{common}
												<i className="foddingicon fooding-copy" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100452/*复制*/)} onClick={this.copyClick} ></i> 
												{ permissionsBtn('sorder.edit') && getOne.status == 1? <i className="foddingicon fooding-Edit" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200376/*修改*/)} onClick={this.editClick} ></i> : ''}
												{ permissionsBtn('sorder.del') && getOne.status == 1? <i className="foddingicon fooding-delete-icon3" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100437/*删除*/)}  onClick={this.deleteClick}></i> : ''}
												{ permissionsBtn('sorder.submit') && getOne.status == 1 ? <i className="foddingicon fooding-submit" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100472/*提交*/)} onClick={this.commitClick}></i> : ''}
												{ permissionsBtn('sorder.topurchase') && getOne.status == 10 && !getOne.purStatus? <i className="foddingicon fooding-count-binning" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200743/*采购指令*/)} onClick={this.caigouClick}></i> : ''}
												{ permissionsBtn('sorder.toshipping') && (getOne.status == 10||getOne.status == 5) && !getOne.lsStatus? <i className="foddingicon fooding-booking" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200744/*订舱指令*/)} onClick={this.props.dingCang}></i> : ''}
												{ permissionsBtn('sorder.adjustment') && getOne.status == 10? <i className="foddingicon fooding-order" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100469/*订单调整*/)} onClick={this.tiaoZheng}></i> : ''}
												{ permissionsBtn('sorder.examine') ? <i className="foddingicon fooding-approve" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100470/*查看审批*/)} onClick={this.props.shenpiClick}></i> : ''}
												{ permissionsBtn('sorder.return') && getOne.status == 10? <i className="foddingicon fooding-shall" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(201071/*退货按钮*/)} onClick={this.props.tuihuoClick}></i> : ''}
												{ permissionsBtn('sorder.invoice') && getOne.status == 10? <i className="foddingicon fooding-quote" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200606/*销售发票*/)} onClick={this.props.fapiaoClick}></i> : ''}
												{ permissionsBtn('sorder.void') && getOne.status == 10? <i className="foddingicon fooding-cancal" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100471/*作废*/)} onClick={this.props.zuofeiClick}></i> : ''}
												{ permissionsBtn('sorder.outnotice')&& getOne.status == 10 ? <i className={'foddingicon fooding-cktz'} onClick={this.chukuClick} style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(500415/*销售出库*/)}></i> : ''}
												
												{ permissionsBtn('sorder.sentemplate') && 1 ? <i className="foddingicon fooding-stockinformation" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(600293/*发送模板*/)} onClick={this.props.sendTemplateHandle}></i> : ''}
												
												</span>
											</div>
											<span className="name"><p>{getOne["salBe"+language]}</p></span>
										</div>
										<div className="box4">
												<div className="flex"><div className="nation"><span>{i18n.t(200708/*客户采购员*/)}</span><b>{getOne["cusLink"+language]}</b></div></div>
												<div className="flex"><div className="contact"><span>{i18n.t(200709/*客户操作员*/)}</span><b>{getOne["cusOLink"+language]}</b></div></div>
												<div className="flex"><div className="source"><span>{i18n.t(200165/*销售总额*/)}</span><b>{getOne.saleTaxAmt?(toDecimal(getOne.saleTaxAmt)+' '+getOne["cny"+language]):''}</b></div></div>
												<div className="flex"><div className="web"><span>{i18n.t(201027/*订单利润率*/)}</span><b>{getOne["orderRate"]?getOne["orderRate"].toFixed(2):''}</b></div></div>
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
				</div>
				);
		}
}
export default NavConnect(LocationConnect(withRouter(SODetailsHead)));
