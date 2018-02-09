import React, { Component,PropTypes } from 'react';
import {browserHistory,withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import ColorSelect from "../../../../components/Table/ColorColumn";
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {permissionsBtn,apiGet, apiPost, apiForm, API_FOODING_ERP, API_FOODING_DS, language} from '../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
import xt from '../../../../common/xt';
import {I18n} from '../../../../lib/i18n';
import StatusShow from "../../../../components/StateShow";
function getActiveTab(pathname,navTabs){
	let currents,activeTab=0;
	currents= navTabs.filter((item,index)=>(item.url==pathname));
	if(currents&&currents.length>0){
		activeTab=currents[0].id;
	}
	return activeTab;
}
export  class  OnlineOrderBuyerDetailsHead extends Component{
	    constructor(props) {
	        super(props);
	        this.array =[];
					let navTabs=[
						{name:I18n.t(100097/*详情*/),url:'/onlineorderbuyer/detail',id:0}
						
			];
					let activeTabId= getActiveTab(props.location.pathname,navTabs)
	        this.state = { visible: false ,isUp:false,activeTab:activeTabId,
	        			isShow:false,
				        navContent:navTabs,
			};
		        this.onClickLink=this.onClickLink.bind(this);
		        this.onItemClick=this.onItemClick.bind(this);
		        this.onclickXin =this.onclickXin.bind(this);
		        this.onEditDetail=this.onEditDetail.bind(this);
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
    		this.setState({
    			activeTab:v.id
    		});
    		browserHistory.push(v.url);
    	}
    	componentWillReceiveProps(nextProps){
    		// console.log(nextProps);
    	}
		
		onEditDetail(e,item){
			var that = this;
	        let {navAddTab, navRemoveTab, navReplaceTab} = this.props;
	        navRemoveTab({name:I18n.t(500105/*卖家订单详情*/),component:I18n.t(500105/*卖家订单详情*/),url:'/onlineOrderSeller/view'});
	        navReplaceTab({ name: I18n.t(500107/*编辑卖家订单*/), component: I18n.t(500107/*编辑卖家订单*/), url: '/onlineOrderSeller/edit'});
	        this.props.router.push({pathname: '/onlineOrderSeller/edit', query: {id:this.props.businessOne.id}});
    	};
	    confirmClick = ()=>{
	        Confirm(I18n.t(500108/*确认接受订单吗？*/), {
	            done: () => {
                    ///nooorder/confirm replace /inquiryorder/confirm
                    apiForm(API_FOODING_ERP, '/inquiryorder/confirm', {
                        id: this.props.businessOne.id
	                }, response => {
	                    successTips(response.message);
	                    this.props.refreshDetail('one');
	                }, error => {
	                    errorTips(error.message);
	                })
	            }
	        });
    };
    componentDidMount() {
        let activeId = getActiveTab(this.props.location.pathname, this.state.navContent);
        this.setState({activeTab: activeId});
    }
    onclickXin(){
				this.setState({
					isShow:!this.state.isShow
				});
	}
	render(){
			 const {businessOne} = this.props;
        let array_name = this.state.navContent;
			return  (
				<div className = 'cdetails'>
						<div className="box1">
								<div className="touxiang">
										<div className="tupian"><i className="foddingicon fooding-user_icon"></i></div>
								</div>
								<div className="right">
										<div className="box3">
											<div className="daima">
												<p>{businessOne.no}</p>
												<StatusShow status={businessOne.status || ""} statusName={businessOne.statusName || ""}/>
												<span style={{float:'right'}}>
												{
				                                        xt.conditionComponents(businessOne, [
				                                            {
				                                                condition: {key: 'status', value: 10, exp: '=='},
				                                                content: <i key="1" className={permissionsBtn('onlineorderseller.edit') ? "foddingicon fooding-Edit" : 'hide'} style={{fontSize: '16px', marginRight: '20px'}}
				                                                            title={I18n.t(100439/*编辑*/)} onClick={this.onEditDetail}/>
				                                            },
				                          
				                                            {
				                                                condition: {key: 'status', value: 30, exp: '=='},
				                                                content: <i key="2" className={permissionsBtn('onlineorderseller.close') ? "foddingicon fooding-close-two" : 'hide'}  onClick={this.props.comp.closeClick}
				                                                            style={{fontSize: '16px', marginRight: '20px'}} title={I18n.t(100432/*关闭*/)}/>
				                                            },
				                                            {
				                                                condition: {key: 'status', value: 30, exp: '=='},
				                                                content: <i key="3" className={permissionsBtn('onlineorderseller.confirm') ? "foddingicon fooding-confirm" : 'hide'} onClick={this.confirmClick}
				                                                            style={{fontSize: '16px', marginRight: '20px'}} title={I18n.t(500021/*卖方确认*/)}/>
				                                            }
				                                        ])
                                    			}
												</span>
											</div>
											<span className="name"><p>{businessOne.billTypeName}</p></span>
										</div>
										<div className="box4">
												<div className="flex"><div className="nation"><span>{I18n.t(500038/*订单金额*/)}</span><b>{businessOne.amt}</b></div></div>
												<div className="flex"><div className="contact"><span>{I18n.t(100284/*币种*/)}</span><b>{businessOne['cny'+language]}</b></div></div>
												<div className="flex"><div className="source"><span>{I18n.t(500023/*订单日期*/)}</span><b>{businessOne.billDate}</b></div></div>
												<div className="flex"><div className="web"><span>{I18n.t(100336/*备注*/)}</span><b>{businessOne.note}</b></div></div>
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
export default NavConnect(LocationConnect(withRouter(OnlineOrderBuyerDetailsHead)));

