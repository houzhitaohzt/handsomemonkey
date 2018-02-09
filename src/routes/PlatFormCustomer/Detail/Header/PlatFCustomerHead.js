import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {browserHistory,withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import ColorSelect from "../../../../components/Table/ColorColumn";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import xt from '../../../../common/xt';

import {I18n} from '../../../../lib/i18n';
function getActiveTab(pathname,navTabs){
	let currents,activeTab=0;
	currents= navTabs.filter((item,index)=>(item.url==pathname));
	if(currents&&currents.length>0){
		activeTab=currents[0].id;
	}
	return activeTab;
}
export  class  PlatFCustomerHead extends Component{
	    constructor(props) {
	        super(props);
	        this.array =[];
					let navTabs=[
						{name:i18n.t(200862/*客户产品*/),url:'/platform/customer/detail',id:'detail'},
						{name:i18n.t(100139/*注册信息*/),url:'/platform/customer/info',id:'info'}
			];
					let activeTabId= getActiveTab(props.location.pathname,navTabs)
	        this.state = { visible: false ,isUp:false,activeTab:activeTabId,
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
    		// this.setState({
    		// 	activeTab:v.id
    		// });
    		// let tab={id:this.props.navigate.currentTab,url:v.url};
            // this.props.updateTab(tab);
    		// browserHistory.push({pathname:v.url,query:{id:this.props.location.query.id,dataTyId:v.dataTyId}});
    	}
    	componentWillReceiveProps(nextProps){
    		// console.log(nextProps);
    	}
		componentDidMount(){
			let activeId= getActiveTab(this.props.location.pathname,this.state.navContent);
			this.setState({activeTab:activeId});
		}

		render(){
			//从ProductLayout 传过来的数据		
			let {valueone = {}} = this.props;
			let array_name=this.state.navContent;
			let cuurntTab=getActiveTab(this.props.location.pathname,this.state.navContent);
			return  (
				<div className = 'cdetails'>
					<div className="box1">
							<div className="touxiang">
									<div className="tupian"><i className="foddingicon fooding-user_icon"/></div>
							</div>
							<div className="right">
									<div className="box3">
                                        <div className="daima"><p>{valueone.code}</p></div>
										<span className="name"><p>{valueone.localName || ''}</p><i className="foddingicon fooding-bm-icon"/></span>
									</div>
									<div className="box4">
											<div className="flex"><div className="nation"><span>{i18n.t(100371/*网站*/)}</span><b>{valueone.defaultWeb&&valueone.defaultWeb.localName?valueone.defaultWeb.localName:''}</b></div></div>
											<div className="flex"><div className="contact"><span>{i18n.t(100229/*邮箱*/)}</span><b>{valueone.defaultEmail&&valueone.defaultEmail.localName?valueone.defaultEmail.localName:''}</b></div></div>
											<div className="flex"><div className="source"><span>{i18n.t(100478/*电话*/)}</span><b>{valueone.defaultTel&&valueone.defaultTel.localName?valueone.defaultTel.localName:''}</b></div></div>
											<div className="flex"><div className="web"><span>{i18n.t(100479/*传真*/)}</span><b>{valueone.defaultFax&&valueone.defaultFax.localName?valueone.defaultFax.localName:''}</b></div></div>
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
export default LocationConnect(withRouter(PlatFCustomerHead));

