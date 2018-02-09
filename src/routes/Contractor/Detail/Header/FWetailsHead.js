import React, { Component,PropTypes } from 'react';
import {browserHistory,withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import ColorSelect from "../../../../components/Table/ColorColumn";
import {webInit,API_FOODING_DS, apiForm} from "../../../../services/apiCall";

//引入国际化
import {I18n} from '../../../../lib/i18n';




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
						{name:I18n.t(100097/*详情*/),url:'/servbe/detail',id:'detail',isLoading:false},
						{name:I18n.t(100370/*联系人*/),url:'/servbe/linkman',id:'linkman',dataTyId:140,isLoading:false},
						{name:I18n.t(100148/*注释*/),url:'/servbe/annotation',id:'annotation',isLoading:false}
			];
					let activeTabId= getActiveTab(props.location.pathname,navTabs)
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
		}
		render(){
			let array_name=this.state.navContent;
			let {value = {}} = this.props;
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
												<span style={{float:'right'}}>

												</span>
											</div>
											<span className="name"><p>{value.name}</p><i className="foddingicon fooding-bm-icon"></i></span>
										</div>
										<div className="box4">
												<div className="flex"><div className="nation"><span>{I18n.t(100087/*国家*/)}/{I18n.t(100091/*地区*/)}</span><b>{value.country ||""}</b></div></div>
												<div className="flex"><div className="contact"><span>{I18n.t(100372/*主联系人*/)}</span><b>{value.defaultCarrierLinkMan&&value.defaultCarrierLinkMan.name?value.defaultCarrierLinkMan.name:""}</b></div></div>
												<div className="flex">
													<div className="web"><span>{I18n.t(100371/*网站*/)}</span><a href={webInit(value.web)} target="_blank"><b title={value.web}>{value.web}</b></a></div>
												</div>
												<div className="flex"><div className="web"><span>{I18n.t(100229/*邮箱*/)}</span><b>{value.email ||""}</b></div></div>
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
