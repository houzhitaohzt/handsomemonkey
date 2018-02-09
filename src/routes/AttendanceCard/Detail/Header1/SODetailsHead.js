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
						{name:i18n.t(100097/*详情*/),url:'/AttendanceCard/detail',id:'detail',isLoading:false},
						{name:i18n.t(100136/*附件*/),url:'/AttendanceCard/accessory',id:'accessory',isLoading:false},

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
			return  (
				<div className = 'cdetails' style={{height:'34px'}}>

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
