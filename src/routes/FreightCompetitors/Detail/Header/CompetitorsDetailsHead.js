import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {browserHistory,withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import ColorSelect from "../../../../components/Table/ColorColumn";

import {I18n} from '../../../../lib/i18n';

function getActiveTab(pathname,navTabs){
	let currents,activeTab=0;
	currents= navTabs.filter((item,index)=>(item.url==pathname));
	if(currents&&currents.length>0){
		activeTab=currents[0].id;
	}
	return activeTab;
}
export  class  CompetitorsDetailsHead extends Component{
	    constructor(props) {
	        super(props);
	        this.array =[];
					let navTabs=[
						{name:I18n.t(100097/*详情*/),url:'/freightCompetitors/detail',id:'detail',isLoading:false},
						// {name:I18n.t(100350/*关注产品*/),url:'/freightCompetitors/focuproduct',id:'product',isLoading:false},
						{name:i18n.t(100136/*附件*/),url:'/freightCompetitors/accessory',id:'accessory',isLoading:false},
						{name:i18n.t(100148/*注释*/),url:'/freightCompetitors/annotation',id:'annotation',isLoading:false}
			];
					let activeTabId= getActiveTab(props.location.pathname,navTabs);
	        this.state = { visible: false ,isUp:false,activeTab:this.props.curentId,
	        			isShow:false,
				        navContent:navTabs
			};
		        this.onClickLink=this.onClickLink.bind(this);
    	}

    	onClickLink(e,v){
            this.props.onClickLink({id:v.id, dataTyId: v.dataTyId,activeTab:this.state.activeTab,isLoading:v.isLoading});
            let navContent = this.state.navContent;
            navContent[e].isLoading = true;
            this.setState({
                activeTab:v.id,
                navContent:navContent
            });
    		// let tab = {id:this.props.navigate.currentTab,url:v.url};
    		// this.props.updateTab(tab);
    		// browserHistory.push({pathname:v.url,query:{id:this.props.location.query.id}})
    	}
    	componentWillReceiveProps(nextProps){
    		// console.log(nextProps);
    	}
		componentDidMount(){
			// let activeId= getActiveTab(this.props.location.pathname,this.state.navContent);
			// this.setState({activeTab:activeId});
		}
		render(){
			let value = this.props.value;
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
											<div className="daima">
												<p>{value.code}</p>						
											</div>
											<span className="name"><p>{value.localName}</p></span>
										</div>
										<div className="box4">
												<div className="flex"><div className="nation"><span>{I18n.t(100087/*国家*/)}/{I18n.t(100091/*地区*/)}</span><b>{value.countryName}</b></div></div>
												<div className="flex"><div className="contact"><span>{I18n.t(100371/*网站*/)}</span><b>{value.defaultWebName}</b></div></div>
												<div className="flex"><div className="source"><span>{I18n.t(100244/*企业*/)}</span><b>{value.clusterName}</b></div></div>
												<div className="flex"><div className="web"><span>{I18n.t(100229/*邮箱*/)}</span><b>{value.defaultEmail}</b></div></div>
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
export default LocationConnect(withRouter(CompetitorsDetailsHead));

