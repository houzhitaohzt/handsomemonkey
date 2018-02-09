import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {browserHistory,withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import ColorSelect from "../../../../components/Table/ColorColumn";
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {permissionsBtn,apiGet, apiPost, apiForm, API_FOODING_ERP, API_FOODING_DS, language} from '../../../../services/apiCall';
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框
 import {I18n} from '../../../../lib/i18n';
import xt from '../../../../common/xt';
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
    		this.setState({
    			activeTab:v.id
    		});
    		browserHistory.push(v.url);
    	}
    	componentWillReceiveProps(nextProps){
    		// console.log(nextProps);
    	}
		
		onEditDetail = ()=> {
	        let {navAddTab, navRemoveTab, navReplaceTab} = this.props;
	        navRemoveTab({name:I18n.t(500025/*买家订单新增*/),component:I18n.t(500025/*买家订单新增*/),url:'/onlineorderbuyer/edit'});
	        navReplaceTab({ name: I18n.t(500024/*编辑买家订单*/), component: I18n.t(500024/*编辑买家订单*/), url: '/onlineorderbuyer/edit'});
	        this.props.router.push({pathname: '/onlineorderbuyer/edit', query: {id: this.props.billId}});
    	};

    deleteClick = ()=>{
    	 let {navAddTab, navRemoveTab, navReplaceTab} = this.props;
        Confirm(I18n.t(500093/*删除后无法撤回,你确定要删除此订单吗？*/), {
            done: () => {
            	///nooorder/delete replace  /inquiryorder/delete
                apiForm(API_FOODING_ERP, ' /inquiryorder/delete', {
                    id: this.props.billId
                }, response => {
                    successTips({text:response.message,type:'success'});
                   // this.props.refreshDetail('one');
                       navRemoveTab({name:I18n.t(500094/*买家订单*/),component:I18n.t(500094/*买家订单*/),url:'/onlineorderbuyer'});
                       navAddTab({name:I18n.t(500094/*买家订单*/),component:I18n.t(500094/*买家订单*/),url:'/onlineorderbuyer'});
				       navRemoveTab({ name: I18n.t(500026/*买家订单详情*/), component: I18n.t(500026/*买家订单详情*/), url: '/onlineorderbuyer/detail'});
				       this.props.router.push({pathname: '/onlineorderbuyer'});
                }, error => {
                    errorTips({text:error.message,type:'error'});
                })
            }
        });
    };
    onplaceClick = ()=>{
    	let {businessOne}= this.props;
       if(!businessOne.amt){
			//return false;
			Confirm("产品信息不全,请检查产品信息!", {
				close:() => {
					console.log('no, close')
				}
			});
		}else if(!businessOne.receBankAccountLcName && !businessOne.receBankAccountEnName && businessOne.receBankAccountId ==null){
			//return false;
			Confirm("缺少卖家的收款账号,请编辑,完善一下信息!", {
				close:() => {
					console.log('no, close')
				}
			});
			
		}else{
			Confirm(i18n.t(500029/*您确定要下订单吗*/), {
			  done: () => {
			  		///nooorder/doOrder replace /inquiryorder/booking
				    apiForm(API_FOODING_ERP,"/inquiryorder/booking",{id:businessOne.id},response => {
				    	ServiceTips({text:response.message,type:"success"})
				    	 this.props.refreshDetail('one');
				    },error => {
				    	ServiceTips({text:error.message,type:'error'})
				    })
				},
				close:() => {
					console.log('no, close')
				}
		});
		}
    };
    shallClick = ()=>{
        Confirm('确定要撤单吗？', {
            done: () => {
            	///nooorder/cancleOrder replace /inquiryorder/cancel
                apiForm(API_FOODING_ERP, '/inquiryorder/cancel', {
                    id: this.props.billId
                }, response => {
                    successTips("撤单成功!");
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
				                                                condition: {key: 'status', value: 1, exp: '=='},
				                                                content: <i key="0" className={permissionsBtn('onlineorderbuyer.edit') ? "foddingicon fooding-Edit" : 'hide'} style={{fontSize: '16px', marginRight: '20px'}}
				                                                            title={i18n.t(100439/*编辑*/)} onClick={this.onEditDetail}/>
				                                            },
				                                            {
				                                                condition: {key: 'status', value: 1, exp: '=='},
				                                                content:  <i key="1" className={permissionsBtn('onlineorderbuyer.del') ? "foddingicon fooding-delete-icon3" : 'hide'} style={{fontSize: '16px', marginRight: '20px'}}
				                                                             title={i18n.t(100437/*删除*/)} onClick={this.deleteClick}/>
				                                            },
				                                            {
				                                                condition: {key: 'status', value: 1, exp: '=='},
				                                                content: <i key="2" className={permissionsBtn('onlineorderbuyer.done') ? "foddingicon fooding-place" : 'hide'} onClick={this.onplaceClick}
				                                                            style={{fontSize: '16px', marginRight: '20px'}} title={i18n.t(100457/*下单*/)}/>
				                                            },
				                                            {
				                                                condition: {key: 'status', value: 30, exp: '=='},
				                                                content: <i key="3" className={permissionsBtn('onlineorderbuyer.cancel') ? "foddingicon fooding-shall" : 'hide'} onClick={this.shallClick}
				                                                            style={{fontSize: '16px', marginRight: '20px'}} title={i18n.t(500040/*撤单*/)}/>
				                                            }
				                                        ])
                                    			}
												</span>
											</div>
											<span className="name"><p>{businessOne.billTypeName}</p></span>
										</div>
										<div className="box4">
												<div className="flex"><div className="nation"><span>{i18n.t(500038/*订单金额*/)}</span><b>{businessOne.amt}</b></div></div>
												<div className="flex"><div className="contact"><span>{i18n.t(500125/*货币*/)}</span><b>{businessOne['cny'+language]}</b></div></div>
												<div className="flex"><div className="source"><span>{i18n.t(500023/*订单日期*/)}</span><b>{businessOne.billDate}</b></div></div>
												<div className="flex"><div className="web"><span>{i18n.t(100336/*备注*/)}</span><b>{businessOne.note}</b></div></div>
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

