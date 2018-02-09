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
						{name:I18n.t(100312/*供应商*/),url:'/enterprise/platproduct/supplie',id:'detail',isLoading:false},
						{name:I18n.t(100311/*客户*/),url:'/enterprise/platproduct/customer',id:'client',isLoading:false},
						{name:I18n.t(100148/*注释*/),url:'/enterprise/platproduct/annotation',id:'annotation',isLoading:false}
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
            navContent[v.id].isLoading = true;
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
											<div className="flex"><div className="nation"><span>{I18n.t(100403/*产品类型*/)}</span><b>{valueone.mtlType&&valueone.mtlType.localName?valueone.mtlType.localName : ''}</b></div></div>
											<div className="flex"><div className="contact"><span>{I18n.t(100382/*产品规格*/)}</span><b title={valueone.specTxt || ''}>{valueone.specTxt || ''}</b></div></div>
											<div className="flex"><div className="source"><span>{I18n.t(100412/*基本型号*/)}</span><b>{valueone.basModel || ''}</b></div></div>
											<div className="flex"><div className="web"><span>{I18n.t(100419/*默认箱型*/)}</span><b>{valueone.contnrType&&valueone.contnrType.localName?valueone.contnrType.localName : ""}</b></div></div>
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

