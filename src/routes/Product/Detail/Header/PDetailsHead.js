import React, { Component,PropTypes } from 'react';
import {browserHistory,withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import ColorSelect from "../../../../components/Table/ColorColumn";
// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import {I18n} from '../../../../lib/i18n';
import xt from '../../../../common/xt';
//引入session数据
import WebData from '../../../../common/WebData';


// 切换 tab
function getActiveTab(pathname, navTabs) {
    let currents, activeTab = {};
    currents = navTabs.filter((item, index) => (item.url.indexOf(pathname) !== -1));
    if (currents && currents.length > 0) {
        activeTab = currents[0];
    }
    return activeTab;
}


export  class  PDetailsHead extends Component{
	    constructor(props) {
	        super(props);
	        this.array =[];
	       
			let navTabs=[
						{name:I18n.t(100097/*详情*/),url:'/product/detail',id:'detail',isLoading:false},
						{name:I18n.t(100569/*国家贸易规则*/),url:'/product/traderules',id:'traderules',isLoading:false},
						{name:I18n.t(600285/*国家定价策略*/),url:'/product/detail',id:'strategy',isLoading:false},
						{name:I18n.t(100570/*包装计费*/),url:'/product/package',id:'package',isLoading:false},
						{name:I18n.t(100571/*成品分类*/),url:'/product/chenpsort',id:'chenpsort',isLoading:false},
						{name:I18n.t(100572/*产品分组*/),url:'/product/groupe',id:'groupe',isLoading:false},
						{name:I18n.t(100321/*商机*/),url:'/product/detail',id:'businesspro',isLoading:false},
						{name:I18n.t(100136/*附件*/),url:'/product/accessory',id:'accessory',isLoading:false},
						{name:I18n.t(100148/*注释*/),url:'/product/annotation',id:'annotation',isLoading:false},
	
						

						
			];

			if(permissionsBtn('mtl.purorder')){
				navTabs.push({name:I18n.t(400020/*采购订单*/),url:'/platform/product/detail',id:'purchase'});
	        }

			if(permissionsBtn('mtl.stock')){
				navTabs.push({name:I18n.t(600298/*库存信息*/),url:'/platform/product/detail',id:'inventory'});
	        }

			if(permissionsBtn('mtl.vnd')){
				navTabs.push({name:I18n.t(100312/*供应商*/),url:'/product/supplie',id:'supplie'});
	        }
	        if(permissionsBtn('mtl.beid')){
	        	navTabs.push({name:I18n.t(100311/*客户*/),url:'/product/customer',id:'customer'});
	        }

			navTabs.push({name:"产品图片",url:'/product/detail',id:'picture'})




			let activeTabId= getActiveTab(props.location.pathname,navTabs);
	        this.state = { visible: false ,isUp:false,activeTab:activeTabId,
	        			isShow:false,
				        navContent:navTabs,
						activeTab:this.props.curentId
			};
		        this.onClickLink=this.onClickLink.bind(this);
		        this.onStarClick =this.onStarClick.bind(this);
		        this.savePrefers = this.savePrefers.bind(this);
    	}

    	onClickLink(e,v){
    		// this.setState({
    		// 	activeTab:v.id
    		// });
            this.props.onClickLink({id:v.id, dataTyId: v.dataTyId,activeTab:this.state.activeTab,isLoading:v.isLoading});
            let navContent = this.state.navContent;
            navContent[e].isLoading = true;
            this.setState({
                activeTab:v.id,
                navContent:navContent
            });
    		// let tab={id:this.props.navigate.currentTab,url:v.url};
            // this.props.updateTab(tab);
    		// browserHistory.push({pathname:v.url,query:{id:this.props.location.query.id,dataTyId:v.dataTyId}});
    	}
    	componentWillReceiveProps(nextProps){
			if( nextProps.location.pathname === this.props.location.pathname &&
				nextProps.location.query.index !== this.props.location.query.index){
				let activeTab = getActiveTab(nextProps.location.query.index, this.state.navContent);
				activeTab.id && this.setState({ activeTab: activeTab.id });
			}
    	}
		componentDidMount(){
			let activeTab = getActiveTab(this.props.location.query.index, this.state.navContent);
			if(activeTab.id){
				this.setState({ activeTab: activeTab.id });
				this.props.onClickLink({id:activeTab.id, dataTyId: activeTab.dataTyId,activeTab: this.state.activeTab, isLoading:activeTab.isLoading});
			}			
			// let activeId= getActiveTab(this.props.location.pathname,this.state.navContent);
			// this.setState({activeTab:activeId});
		}
		//颜色分类
		savePrefers = (color) => {
			let that = this;
			// let {value} = this.props;
			apiGet(API_FOODING_DS,"/material/getOne",{id:this.props.location.query.id},response => {
				let value = response.data;
				let followMark = value.followMark || {};
				let follow = !!followMark[WebData.user.data.staff.id];
				 let params = {id: value.id, colorType: color, optlock: value.optlock, followMark:follow};
				apiForm(API_FOODING_DS,'/material/savePrefers',params, response => {
					ServiceTips({text: response.message, type: 'success'})
					that.props.getDetailData();
				}, error => {
					ServiceTips({text: error.message,type:'error'});
				});
			},error => console.log(error.message))	  
	    };

	    //五角星选中与补选中的状态
		onStarClick = () => {
			let that = this;
			apiGet(API_FOODING_DS,"/material/getOne",{id:this.props.location.query.id},response => {
				let value = response.data;
				let colorType = value.colorType || {};
				let followMark = value.followMark || {};
				let color = colorType[WebData.user.data.staff.id] || "";
				let follow = !followMark[WebData.user.data.staff.id];
				let params = {id: value.id, colorType: color, optlock: value.optlock, followMark: follow};
				apiForm(API_FOODING_DS,'/material/savePrefers',params, response => {
					ServiceTips({text: response.message, type: 'success'})
					that.props.getDetailData();
				}, error => {
					ServiceTips({text: error.message,type:'error'});
				});
			},error => console.log(error.message))
		}
		shouldComponentUpdate(props, state) {
			return xt.equalsObject(state, this.state)
				|| props.value !== this.props.value
				|| props.id !== this.props.id;
		}
		render(){	
			//从ProductLayout 传过来的数据		
			let { value = {} } = this.props;
			let array_name=this.state.navContent;
			let cuurntTab=getActiveTab(this.props.location.pathname,this.state.navContent);       
			return  (
				<div className = 'cdetails'>
					<div className="box1">
							<div className="touxiang">
									<div className="tupian"><i className="foddingicon fooding-user_icon"></i></div>
							</div>
							<div className="right">
									<div className="box3">
										<div className="daima"><p>{value.code}</p><ColorSelect dataIndex={'colorType'} onSelect={this.savePrefers} value={value.colorType}/>
										<span className={value.followMark? 'glyphicon glyphicon-star':'glyphicon glyphicon-star-empty'} onClick={this.onStarClick}> </span></div>
										<span className="name"><p>{value.localName}</p><i className="foddingicon fooding-bm-icon"></i></span>
									</div>
									<div className="box4">
											<div className="flex"><div className="nation"><span>{I18n.t(100403/*产品类型*/)}</span><b>{value.mtlType}</b></div></div>
											<div className="flex"><div className="contact"><span>{I18n.t(100382/*产品规格*/)}</span><b title={value.specTxt || ""}>{value.specTxt}</b></div></div>
											<div className="flex"><div className="source"><span>{I18n.t(100385/*海关编码*/)}</span><b>{value.hsCode}</b></div></div>
											<div className="flex"><div className="web"><span>{I18n.t(100361/*分管人*/)}</span><b title={String(value.staffs?value.staffs.map(e => e ):'')}>{String(value.staffs?value.staffs.map(e => e ):'')}</b></div></div>
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
export default LocationConnect(withRouter(PDetailsHead));
