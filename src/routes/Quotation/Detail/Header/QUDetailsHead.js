import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {browserHistory,withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import ColorSelect from "../../../../components/Table/ColorColumn";
import Confirm from '../../../../components/Dialog/Confirm';
import Dialog  from '../../../../components/Dialog';
import StatusShow from "../../../../components/StateShow";
import {permissionsBtn, apiGet, apiPost, apiForm,language, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,toDecimal } from "../../../../services/apiCall";
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
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
						{name:i18n.t(100097/*详情*/),url:'/quotation/detail',id:'detail',isLoading:false},
						{name:i18n.t(100586/*邮件*/),url:'/quotation/email',id:'email',isLoading:false},
						{name:i18n.t(100588/*联络*/),url:'/quotation/contact',id:'contact',isLoading:false},
						{name:i18n.t(100587/*约会*/),url:'/quotation/date',id:'date',isLoading:false},
						{name:i18n.t(100136/*附件*/),url:'/quotation/accessory',id:'accessory',isLoading:false},
						{name:i18n.t(100324/*订单*/),url:'/quotation/salesOrder',id:'salesOrder',isLoading:false},
						{name:i18n.t(100148/*注释*/),url:'/quotation/annotation',id:'annotation',isLoading:false}
			];
					// let activeTabId= getActiveTab(props.location.pathname,navTabs)
	        this.state = { visible: false ,isUp:false,
	        			isShow:false,
						activeTab:this.props.curentId,
				        navContent:navTabs
			};
		        this.onClickLink=this.onClickLink.bind(this);
		        this.onItemClick=this.onItemClick.bind(this);
		        this.onclickXin =this.onclickXin.bind(this);
		        this.editClick = this.editClick.bind(this);
		        this.deleteClick = this.deleteClick.bind(this);
		        this.commitClick = this.commitClick.bind(this);
		        this.jisuanClick = this.jisuanClick.bind(this);
		        this.shengchengClick = this.shengchengClick.bind(this);
		        this.shenpiClick = this.shenpiClick.bind(this);
    	}
    	shenpiClick(){
    		this.props.shenpiClick();
    	}
    	jisuanClick(){
			let that = this;
    		let {getOne} = this.props;
    		if(!getOne.billType) return;
    		Confirm(i18n.t(600104/*最终目的国（地区）*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/saleoffer/calculate",{billId:this.props.id},response => {
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

		// 计算价格
		countPriceHandle = ()=>{
			let that = this;

			apiGet(API_FOODING_ERP,'/saleoffer/getElements',{billId: that.props.location.query['id']},
				(response)=>{
					let data = response.data;

					if(!data['colList'].length) {
						ServiceTips({text:i18n.t(600165/*不能*/),type:'error'});
						return;
					}

					let key = response.data.params.pakgs.filter(o=>!o['sdMtlId']);
					let pakgMtls = response.data.params.pakgMtls.map(o=>{
						return Object.assign({},o,{disable: key.filter(j=>j['contQty'] && j['contnrTyId']==o['contnrTyId']).length ? true : false});
					});
					data.params.pakgMtls = pakgMtls;

					let content = require('./CountPriceDialog').default;
					let element = React.createElement(content,{getOne:{data:data,ResultData: response.data},onSaveAndClose:that.onSaveAndClose,onCancel:that.onCancel});
					this.setState({
						showDilaog : true,
						title: i18n.t(200058/*报价计算*/),
						dialogContent: element
					})
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
			});

		}

    	shengchengClick(){
    		let that = this;
    		let {getOne} = this.props;
    		if(!getOne.billType) return;
    		Confirm(i18n.t(300058/*是否生成销售订单*/), {
			  done: () => {
				    apiForm(API_FOODING_ERP,"/saleoffer/createOrder",{billId:this.props.id},response => {
				    	//刷新当前页面
				    	this.props.navRemoveTab({name: i18n.t(200239/*销售订单编辑*/), component: i18n.t(200239/*销售订单编辑*/), url: '/salesorder/addEidt'});
	        			this.props.navAddTab({name:i18n.t(200239/*销售订单编辑*/),component:i18n.t(200239/*销售订单编辑*/),url:'/salesorder/addEidt'});
	        			this.props.router.push({ pathname: '/salesorder/addEidt',query:{id:response.data}});
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
            // let that = this;
            // let {getOne} = this.props;
            // if(!getOne.billType) return;
            // Confirm(i18n.t(201024/*您确定要操作吗*/), {
			//   done: () => {
			// 	    apiForm(API_FOODING_ERP,"/saleoffer/purchase",{billId:this.props.id},response => {
			// 	    	//刷新当前页面
			// 	    	this.props.onPackUp();
			// 	    	ServiceTips({text:response.message,type:"success"})
			// 	    },error => {
			// 	    	ServiceTips({text:error.message,type:'error'})
			// 	    })
			// 	},
			// 	close:() => {
			// 		console.log('no, close')
			// 	}
			// });
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
     		navRemoveTab({name:i18n.t(201025/*销售报价新增*/),component:i18n.t(201025/*销售报价新增*/),url:'/quotation/addedit'});
	        navReplaceTab({ name: i18n.t(200238/*销售报价编辑*/), component: i18n.t(200238/*销售报价编辑*/), url: '/quotation/addedit'});
	        this.props.router.push({pathname: '/quotation/addedit',query:{id:this.props.id}});
    	}
    	deleteClick(){
    		Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
			  done: () => {
    			apiForm(API_FOODING_ERP,'/saleoffer/delete',{billId:this.props.id},(response)=>{
    				 let {navReplaceTab, businessOne, navRemoveTab} = this.props;
		       		this.props.navRemoveTab({name: i18n.t(201019/*销售报价详情*/), component: i18n.t(201019/*销售报价详情*/), url: '/quotation/detail'});
        			this.props.navReplaceTab({name:i18n.t(200241/*销售报价*/),component:i18n.t(200241/*销售报价*/),url:'/Quotation/list'});
        			this.props.router.push({ pathname: '/Quotation/list'});
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
    		// browserHistory.push({pathname:v.url,query:{id:this.props.location.query.id}});
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

		onSaveAndClose = ()=>{
			this.onCancel();
		}

		onCancel = ()=>{
			this.setState({ showDilaog: false });
		}

		render(){
			let array_name=this.state.navContent;
			let {getOne} =this.props;
			let {showDilaog,title,dialogContent} = this.state;
			let that = this;
			return  (
				<div>
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
													{ permissionsBtn('offer.sentemplate') && 1 ? <span style={{float:'right'}}><i className="foddingicon fooding-stockinformation" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(600293/*发送模板*/)} onClick={this.props.sendTemplateHandle}></i></span> : ''}
													{ permissionsBtn('offer.price') && getOne.status == 1? <span style={{float:'right'}}><i className="foddingicon fooding-count-price" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200062/*计算价格*/)} onClick = {this.countPriceHandle}></i></span> : ''}
													{ permissionsBtn('offer.edit') && getOne.status == 1? <span style={{float:'right'}}><i className="foddingicon fooding-Edit" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200376/*修改*/)} onClick={this.editClick} ></i></span> : ''}
													{ permissionsBtn('offer.del') && getOne.status == 1? <span style={{float:'right'}}><i className="foddingicon fooding-delete-icon3" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100437/*删除*/)}  onClick={this.deleteClick}></i></span> : ''}
													{ permissionsBtn('offer.submit')&& getOne.status == 1? <span style={{float:'right'}}><i className="foddingicon fooding-submit" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100472/*提交*/)} onClick={this.commitClick}></i></span>: ''}
													{ permissionsBtn('offer.tosorder') &&  getOne.status == 10? <span style={{float:'right'}}><i className="foddingicon fooding-creat-order" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(201026/*生成订单*/)} onClick={this.shengchengClick}></i></span> : ''}
													{ permissionsBtn('offer.examine') ? <span style={{float:'right'}}><i className="foddingicon fooding-approve" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100470/*查看审批*/)} onClick={this.shenpiClick}></i></span> : ''}

												</div>
												<span className="name"><p>{getOne["salBe"+language]}</p></span>
											</div>
											<div className="box4">
													<div className="flex"><div className="nation"><span>{i18n.t(200708/*客户采购员*/)}</span><b>{getOne["cusLink"+language]}</b></div></div>
													<div className="flex"><div className="contact"><span>{i18n.t(200709/*客户操作员*/)}</span><b>{getOne["cusOLink"+language]}</b></div></div>
													<div className="flex"><div className="source"><span>{i18n.t(100323/*业务日期*/)}</span><b>{new Date(getOne.billDate).Format('yyyy-MM-dd')}</b></div></div>
													<div className="flex"><div className="web"><span>{i18n.t(200240/*预计收入*/)}</span><b>{getOne.saleTaxAmt?(toDecimal(getOne.saleTaxAmt)+' '+getOne["cny"+language]):''}</b></div></div>
											</div>
									</div>

							</div>
							<ul className="box2">
									{
										array_name.map((item,i)=>{
											return (<li key={i}><a onClick ={()=>this.onClickLink(i,item)} className={that.state.activeTab== item.id ?'heghtL':''}>{item.name} </a></li>);
										})
									}

							</ul>

					</div>
					<Dialog visible={showDilaog} title={title} width={1300}>
						{dialogContent}
					</Dialog>
				</div>
				);
		}
}
export default NavConnect(LocationConnect(withRouter(SODetailsHead)));
