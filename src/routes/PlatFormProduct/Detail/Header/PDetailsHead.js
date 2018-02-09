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
export  class  PDetailsHead extends Component{
	    constructor(props) {
	        super(props);
	        this.array =[];
					let navTabs=[
						{name:I18n.t(100097/*详情*/),url:'/platform/product/detail',id:'detail',isLoading:false},
						{name:I18n.t(100569/*国家贸易规则*/),url:'/platform/product/traderules',id:'traderules',isLoading:false},
						{name:I18n.t(100571/*成品分类*/),url:'/platform/product/chenpsort',id:'chenpsort',isLoading:false},
						{name:I18n.t(100572/*产品分组*/),url:'/platform/product/groupe',id:'groupe',isLoading:false},
						{name:I18n.t(100312/*供应商*/),url:'/platform/product/supplie',id:'supplie',isLoading:false},
						{name:I18n.t(100311/*客户*/),url:'/platform/product/customer',id:'customer',isLoading:false},
						// {name:'历史记录',url:'/platform/product/history',id:6},
						{name:I18n.t(100136/*附件*/),url:'/platform/product/accessory',id:'accessory',isLoading:false},
						{name:I18n.t(100148/*注释*/),url:'/platform/product/annotation',id:'annotation',isLoading:false},
						{name:"产品图片",url:'/platform/product/picture',id:'picture',isLoading:false}
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
    		// let tab={id:this.props.navigate.currentTab,url:v.url};
            // this.props.updateTab(tab);
    		// browserHistory.push({pathname:v.url,query:{id:this.props.location.query.id,dataTyId:v.dataTyId}});
    	}
    	componentWillReceiveProps(nextProps){
    		// console.log(nextProps);
    	}
		componentDidMount(){
			// let activeId= getActiveTab(this.props.location.pathname,this.state.navContent);
			// this.setState({activeTab:activeId});
		}

		render(){
			//从ProductLayout 传过来的数据		
			let {material = {}} = this.props;
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
                                        <div className="daima"><p>{material.code}</p></div>
										<span className="name"><p>{material.localName || ''}</p><i className="foddingicon fooding-bm-icon"/></span>
									</div>
									<div className="box4">
											<div className="flex"><div className="nation"><span>{I18n.t(100403/*产品类型*/)}</span><b>{material.mtlType || ''}</b></div></div>
											<div className="flex"><div className="contact"><span>{I18n.t(100382/*产品规格*/)}</span><b title={material.specTxt || ''}>{material.specTxt || ''}</b></div></div>
											<div className="flex"><div className="source"><span>{I18n.t(100412/*基本型号*/)}</span><b>{material.basModel || ''}</b></div></div>
											<div className="flex"><div className="web"><span>{I18n.t(100419/*默认箱型*/)}</span><b>{material.contnrType}</b></div></div>
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

