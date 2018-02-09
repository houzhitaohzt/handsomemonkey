import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {browserHistory,withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import ColorSelect from "../../../../components/Table/ColorColumn";
//引入ajax请求
import {webInit, apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS,permissionsBtn } from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
import Dialog from "../../../../components/Dialog/Dialog";

import xt from '../../../../common/xt';
//引入session数据
import WebData from '../../../../common/WebData';


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
			let urlName = props.params.name;

					let navTabs=[
						{name:i18n.t(100097/*详情*/),url:'/forwarder/detail' + urlName,id: 'detail',isLoading:false},
						{name:i18n.t(100370/*联系人*/),url:'/forwarder/linkman' + urlName,id: 'linkman',isLoading:false,dataTyId:130},
						{name:i18n.t(200373/*物流订单*/),url:'/forwarder/shiporder' + urlName,id: 'shiporder',isLoading:false},
						{name:i18n.t(100526/*关联企业*/),url:'/forwarder/enterprise' + urlName,id: 'enterprise',isLoading:false},
						{name:i18n.t(100586/*邮件*/),url:'/forwarder/email' + urlName,id: 'email',isLoading:false},
						{name:i18n.t(100585/*市场活动响应*/),url:'/forwarder/activity' + urlName,id: 'activity',isLoading:false},
						{name:i18n.t(100587/*约会*/),url:'/forwarder/date' + urlName,id: 'date',isLoading:false},
						{name:i18n.t(100588/*联络*/),url:'/forwarder/contact' + urlName,id: 'contact',isLoading:false},
						// {name:'历史记录',url:'/forwarder/history' + urlName,id:8},
						{name:i18n.t(100136/*附件*/),url:'/forwarder/accessory' + urlName,id: 'accessory',isLoading:false},
						{name:i18n.t(100148/*注释*/),url:'/forwarder/annotation' + urlName,id: 'annotation',isLoading:false},
                        {name: i18n.t(300083/*组织关系*/), url: '/forwarder/organizational/' + urlName, id: 'organizational',isLoading:false}
			];
			let activeTabId= getActiveTab(props.location.pathname,navTabs)
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
			apiGet(API_FOODING_DS,"/agnShipBe/getOne",{id:this.props.location.query.id},response => {
				let value = response.data;
				let followMark = value.followMark || {};
				let follow = !!followMark[WebData.user.data.staff.id];
				 let params = {custId: value.id, colorType: color, optlock: value.optlock, followMark:follow};
				apiForm(API_FOODING_DS,'/agnShipBe/savePrefers',params, response => {
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
			apiGet(API_FOODING_DS,"/agnShipBe/getOne",{id:this.props.location.query.id},response => {
				let value = response.data;
				let colorType = value.colorType || {};
				let followMark = value.followMark || {};
				let color = colorType[WebData.user.data.staff.id] || "";
				let follow = !followMark[WebData.user.data.staff.id];
				let params = {custId: value.id, colorType: color, optlock: value.optlock, followMark: follow};
				apiForm(API_FOODING_DS,'/agnShipBe/savePrefers',params, response => {
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

		// 发送邮件
		sendMailHandle = () => {

			let {value={}} = this.props;
			let content = require('../../../Common_confirm/sendlinkTpl').default;
			let element = React.createElement(content, {
				active:'forwarder',
				getOne: value,
				onCancel: this.onCancel,
			});

			this.setState({
				showDialog:true,
				title: i18n.t(600315/*选择收件人*/),
				dialogContent: element,
				showHeader:false
			}); 
		}

		onCancel = ()=> this.setState({showDialog:false});

		render(){
			let {value = {}} = this.props;
			let array_name=this.state.navContent;
			return  (
				<div className = 'cdetails' style={{zIndex:11}}>
						<div className="box1">
								<div className="touxiang">
										<div className="tupian"><i className="foddingicon fooding-user_icon"></i></div>
								</div>
								<div className="right">
										<div className="box3">
											<div className="daima"><p>{value.code}</p><ColorSelect dataIndex={'colorType'} onSelect={this.savePrefers} value={value.colorType}/>
											<span className={value.followMark? 'glyphicon glyphicon-star':'glyphicon glyphicon-star-empty'} onClick={this.onStarClick}> </span></div>
											<span className="name"><p>{value.name}</p><i className="foddingicon fooding-bm-icon"></i></span>
											<span style={{float:'right'}}>
												{ permissionsBtn('forwarder.add') && 1 ? <i className="foddingicon fooding-write-mail-new" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200256/*发邮件*/)} onClick={this.sendMailHandle} ></i> : ''}
											</span>
										</div>
										<div className="box4">
											<div className="flex"><div className="nation"><span>{i18n.t(200565/*国家/地区*/)}</span><b>{value.country}</b></div></div>
											<div className="flex"><div className="contact"><span>{i18n.t(200566/*主要联系人*/)}</span><b>{value.entprisContactor&&value.entprisContactor.localName?value.entprisContactor.localName:""}</b></div></div>
											<div className="flex">
												<div className="web"><span>{i18n.t(100371/*网站*/)}</span><a href={webInit(value.defaultWeb)} target="_blank"><b title={value.defaultWeb}>{value.defaultWeb}</b></a></div>
											</div>
											<div className="flex"><div className="web"><span>{i18n.t(100229/*邮箱*/)}</span><b>{value.defaultEmail || ""}</b></div></div>
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
						<Dialog showHeader={true} width={926} showHeader={true} visible={this.state.showDialog} title={this.state.title}>
							{this.state.dialogContent}
						</Dialog>						
				</div>
			);
		}
}
export default LocationConnect(withRouter(PDetailsHead));

