import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {browserHistory,withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import ColorSelect from "../../../../components/Table/ColorColumn";
//引入ajax请求
import {webInit,apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
//引入提示
import Tooltip from 'antd/lib/tooltip';
import FormerNameDailog from "../../../Client/Detail/FormerName/FormerNameDialog";
import xt from '../../../../common/xt';
//引入session数据
import WebData from '../../../../common/WebData';

function getActiveTab(pathname,navTabs){
	let currents,activeTab=0;
	currents= navTabs.filter((item,index)=>(item.url==pathname));
	if(currents&&currents.length>0){
		activeTab=currents[0].id;
	}
	return activeTab;
}
export  class  PDetailsHead extends Component{
	    constructor(props) {
	        super(props);
	        this.array =[];
					let navTabs=[
						{name:i18n.t(100097/*详情*/),url:'/freightProvider/detail',id:'detail',isLoading:false},
						//{name:i18n.t(100379/*产品*/),url:'/freightProvider/product',id:'product',isLoading:false},
						{name:i18n.t(100370/*联系人*/),url:'/freightProvider/linkman',id:'linkman',isLoading:false},
						{name:i18n.t(100526/*关联企业*/),url:"/freightProvider/enterprise",id:'enterprise',isLoading:false},
						//{name:i18n.t(400020/*采购订单*/),url:'/freightProvider/purchaseorder',id:'purchaseorder',isLoading:false},
						{name:i18n.t(100586/*邮件*/),url:'/freightProvider/email',id:'email',isLoading:false},
						{name:i18n.t(100587/*约会*/),url:'/freightProvider/date',id:'date',isLoading:false},
						{name:i18n.t(100588/*联络*/),url:'/freightProvider/contact',id:'contact',isLoading:false},
						{name:i18n.t(100585/*市场活动响应*/),url:'/freightProvider/activity',id:'activity',isLoading:false},
						// {name:'历史记录',url:'/freightProvider/history',id:309},
						{name:i18n.t(100136/*附件*/),url:'/freightProvider/accessory',id:'accessory',isLoading:false},
						{name:i18n.t(100148/*注释*/),url:'/freightProvider/annotation',id:'annotation',isLoading:false}
			];
					let activeTabId= getActiveTab(props.location.pathname,navTabs);
	        this.state = { visible: false ,isUp:false,activeTab:this.props.curentId,
	        			isShow:false,
				        navContent:navTabs
			};
		        this.onClickLink=this.onClickLink.bind(this);
		        this.onStarClick =this.onStarClick.bind(this);
		        this.savePrefers = this.savePrefers.bind(this);
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
    		// browserHistory.push({pathname:v.url,query:{id:this.props.location.query.id,dataTyId:v.dataTyId}});
    	}
    	//颜色分类
		savePrefers = (color) => {
			let that = this;
			// let {value} = this.props;
			apiGet(API_FOODING_DS,"/vendor/getOne",{id:this.props.location.query.id},response => {
				let value = response.data;
				let followMark = value.followMark || {};
				let follow = !!followMark[WebData.user.data.staff.id];
				 let params = {id: value.id, colorType: color, optlock: value.optlock, followMark:follow};
				apiForm(API_FOODING_DS,'/vendor/savePrefers',params, response => {
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
			apiGet(API_FOODING_DS,"/vendor/getOne",{id:this.props.location.query.id},response => {
				let value = response.data;
				let colorType = value.colorType || {};
				let followMark = value.followMark || {};
				let color = colorType[WebData.user.data.staff.id] || "";
				let follow = !followMark[WebData.user.data.staff.id];
				let params = {id: value.id, colorType: color, optlock: value.optlock, followMark: follow};
				apiForm(API_FOODING_DS,'/vendor/savePrefers',params, response => {
					ServiceTips({text: response.message, type: 'success'});
					that.props.getDetailData();
				}, error => {
					ServiceTips({text: error.message,type:'error'});
				});
			},error => console.log(error.message))
		}
    	componentWillReceiveProps(nextProps){
    		// console.log(nextProps);
    	}
		componentDidMount(){
			// let activeId= getActiveTab(this.props.location.pathname,this.state.navContent);
			// this.setState({activeTab:activeId});
		}
		shouldComponentUpdate(props, state) {
			return xt.equalsObject(state, this.state)
				|| props.value !== this.props.value
				|| props.id !== this.props.id;
		}
		render(){
			//从ProviderLayout 传过来的数据
			let {value = {} } = this.props;
			console.log(this.state.activeTab);
			let array_name=this.state.navContent;
			return  (<div className = 'cdetails'>
						<div className="box1">
								<div className="touxiang">
										<div className="tupian"><i className="foddingicon fooding-user_icon"></i></div>
								</div>
								<div className="right">
										<div className="box3">
											<div className="daima"><p>{value.code}</p><ColorSelect dataIndex={'colorType'} onSelect={this.savePrefers} value={value.colorType}/>
											<span className={value.followMark? 'glyphicon glyphicon-star':'glyphicon glyphicon-star-empty'} onClick={this.onStarClick}> </span></div>
											<span className="name"><p>{value.localName}</p>
											<Tooltip
												placement="right"
												mouseEnterDelay={0.5}
												arrowPointAtCenter={true}
												mouseLeaveDelay={0.2}
												prefixCls="card-toolip"
												overlay={<FormerNameDailog sourceId={this.props.location.query.id} />}
											>
												<i className="foddingicon fooding-bm-icon" style={{cursor:"pointer"}}></i>
											</Tooltip>
											</span>
										</div>
										<div className="box4">
												<div className="flex"><div className="nation"><span>{i18n.t(200565/*国家/地区*/)}</span><b>{value.country}</b></div></div>

												<div className="flex"><div className="contact"><span>{i18n.t(200566/*主要联系人*/)}</span><b>{value.defaultContact&&value.defaultContact.localName?value.defaultContact.localName:""}</b></div></div>

												<div className="flex"><div className="source"><span>{i18n.t(200967/*供应商来源*/)}</span><b>{value.source}</b></div></div>
											
												<div className="flex">
													<div className="web"><span>{i18n.t(100371/*网站*/)}</span><a href={webInit(value.defaultWeb)} target="_blank"><b title={value.defaultWeb}>{value.defaultWeb}</b></a></div>
												</div>																			
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
				</div>);
		}
}
export default LocationConnect(withRouter(PDetailsHead));

