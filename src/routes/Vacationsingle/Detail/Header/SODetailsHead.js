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
						{name:i18n.t(100097/*详情*/),url:'/Vacationsingle/detail',id:'detail',isLoading:false},
						{name:i18n.t(100136/*附件*/),url:'/Vacationsingle/accessory',id:'accessory',isLoading:false},

			];
					let activeTabId= getActiveTab(props.location.pathname,navTabs)
	        this.state = { visible: false ,isUp:false,activeTab:this.props.curentId,
	        			isShow:false,
				        navContent:navTabs,
				        tiaozhengArray:[]
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
    		// let tab={id:this.props.navigate.currentTab,url:v.url};
            // this.props.updateTab(tab);
    		// browserHistory.push({pathname:v.url,query:{id:this.props.location.query.id,saleNo:this.props.getOne.no}});
    	}
    	componentWillReceiveProps(nextProps){
    		// console.log(nextProps);
    	}



		render(){
			let array_name=this.state.navContent;

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
