import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {browserHistory,withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import ColorSelect from "../../../../components/Table/ColorColumn";


// 切换 tab
function getActiveTab(pathname, navTabs) {
    let currents, activeTab = {};
    currents = navTabs.filter((item, index) => (item.url.indexOf(pathname) !== -1));
    if (currents && currents.length > 0) {
        activeTab = currents[0];
    }
    return activeTab;
}

export  class  FWDetailsHead extends Component{
	    constructor(props) {
	        super(props);
	        this.array =[];
					let navTabs=[
						{name:i18n.t(100097/*详情*/),url:'/clientcontact/detail',id:'detail',isLoading:false},
						{name:i18n.t(100586/*邮件*/),url:'/clientcontact/email',id:'email',isLoading:false},
						{name:i18n.t(100585/*市场活动响应*/),url:'/clientcontact/activity',id:'activity',isLoading:false},
						{name:i18n.t(100587/*约会*/),url:'/clientcontact/date',id:'date',isLoading:false},
						{name:i18n.t(100588/*联络*/),url:'/clientcontact/contact',id:'contact',isLoading:false},
						// {name:'历史记录',url:'/servcon/history',id:5},
						{name:i18n.t(100136/*附件*/),url:'/clientcontact/accessory',id:'accessory',isLoading:false},
						{name:i18n.t(100148/*注释*/),url:'/clientcontact/annotation',id:'annotation',isLoading:false}
			];
					let activeTabId= getActiveTab(props.location.pathname,navTabs)
	        this.state = { visible: false ,isUp:false,activeTab:this.props.curentId,
	        			isShow:false,
				        navContent:navTabs
			};
		        this.onClickLink=this.onClickLink.bind(this);
		        this.onItemClick=this.onItemClick.bind(this);
		        this.onclickXin =this.onclickXin.bind(this);
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
    		// this.setState({
    		// 	activeTab:v.id
    		// });
    		// let tab={id:this.props.navigate.currentTab,url:v.url};
            // this.props.updateTab(tab);
    		// browserHistory.push({pathname:v.url,query:{id:this.props.location.query.id}});
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

		onclickXin(){
				this.setState({
					isShow:!this.state.isShow
				});
		}
		render(){
			let array_name=this.state.navContent;
			let {value} = this.props;

				if(this.state.isUp){
				return  (
				<div className = 'cdetail'>
						<div className="box5">
								<div className="top">
										<div className="box6">
												<div className="name"><p>{value.localName?value.localName:''}</p><i className="foddingicon fooding-bm-icon"></i></div>
												<div className="daima"><p>{value.code?value.code:''}</p>
												</div>
												<div className="gery">
													<div className="flex"><div className="nation"><span>{i18n.t(100311/*客户*/)}</span><b>{value.enterprise?value.enterprise.localName:''}</b></div></div>
												<div className="flex"><div className="contact"><span>{i18n.t(100227/*职务*/)}</span><b>{value.positn?value.positn.localName:''}</b></div></div>
												<div className="flex"><div className="source"><span>{i18n.t(100238/*部门*/)}</span><b>{value.depmnt?value.depmnt.localName:''}</b></div></div>
												<div className="flex"><div className="web"><span>{i18n.t(100361/*分管人*/)}</span><b>{value.staffs&&value.staffs[0]?value.staffs[0].localName:''}</b></div></div>
												</div>
										</div>
								</div>

						</div>
						<ul className="box2">
								{
									array_name.map((item,i)=>{
										return (<li key={i}><a onClick ={()=>this.onClickLink(i,item)} className={this.state.activeTab== item.id ?'heghtL':''}>{item.name}</a></li>);
									})
								}
								<li style={{position:'absolute',right:10}}><a><span><i onClick ={this.onItemClick}  className={this.state.isUp ?"foddingicon fooding-up_icon":"foddingicon fooding-pull_down_icon"}></i></span></a></li>

						</ul>
				</div>
				);
				}else{
				return  (
				<div className = 'cdetails'>
						<div className="box1">
								<div className="touxiang">
										<div className="tupian"><i className="foddingicon fooding-user_icon"></i></div>
								</div>
								<div className="right">
										<div className="box3">
											<div className="daima"><p>{value.code?value.code:''}</p>
											</div>
											<span className="name"><p>{value.localName?value.localName:''}</p><i className="foddingicon fooding-bm-icon"></i></span>
										</div>
										<div className="box4">
												<div className="flex"><div className="nation"><span>{i18n.t(100311/*客户*/)}</span><b>{value.enterprise?value.enterprise.localName:''}</b></div></div>
												<div className="flex"><div className="contact"><span>{i18n.t(100227/*职务*/)}</span><b>{value.positn?value.positn.localName:''}</b></div></div>
												<div className="flex"><div className="source"><span>{i18n.t(100238/*部门*/)}</span><b>{value.depmnt?value.depmnt.localName:''}</b></div></div>
												<div className="flex"><div className="web"><span>{i18n.t(100361/*分管人*/)}</span><b>{value.staffs&&value.staffs[0]?value.staffs[0].localName:''}</b></div></div>
										</div>
								</div>

						</div>
						<ul className="box2">
								{
									array_name.map((item,i)=>{
										return (<li key={i}><a onClick ={()=>this.onClickLink(i,item)} className={this.state.activeTab== item.id ?'heghtL':''}>{item.name} </a></li>);
									})
								}
								<li style={{position:'absolute',right:10}}><a><span><i onClick ={this.onItemClick}  className={this.state.isUp ?"foddingicon fooding-up_icon":"foddingicon fooding-pull_down_icon"}></i></span></a></li>

						</ul>
				</div>
				);
			}
		}
}
export default LocationConnect(withRouter(FWDetailsHead));

