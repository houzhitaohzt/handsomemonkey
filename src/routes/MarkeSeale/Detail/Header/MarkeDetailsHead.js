import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {browserHistory,withRouter} from 'react-router';
import LocationConnect from '../../../../components/location/Container';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import ColorSelect from "../../../../components/Table/ColorColumn";

// common 
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层




// ajax
import {permissionsBtn, apiGet, apiPost, apiForm,language, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList } from "../../../../services/apiCall";
import ServiceTips, {errorTips, successTips} from "../../../../components/ServiceTips";//提示框


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
				{name:i18n.t(100097/*详情*/),url:'/marke/detail',id:'detail',isLoading:false},
				// {name:'客户',url:'/marke/contact',id:1},
				{name:i18n.t(100587/*约会*/),url:'/marke/date',id:'date',isLoading:false},
				{name:i18n.t(100588/*联络*/),url:'/marke/contact',id:'contact',isLoading:false}
			];

			let activeTabId= getActiveTab(props.location.pathname,navTabs);
	        this.state = { visible: false ,isUp:false,activeTab:this.props.curentId,
	        			isShow:false,
				        navContent:navTabs
			};
		        this.onClickLink=this.onClickLink.bind(this);
		        this.onItemClick=this.onItemClick.bind(this);
		        this.onclickXin =this.onclickXin.bind(this);
		        this.editClick = this.editClick.bind(this);
		        this.deleteClick = this.deleteClick.bind(this);
		        this.submitClick = this.submitClick.bind(this);
		        this.opportunityClick = this.opportunityClick.bind(this);
				
				
				

				
    	}
    	editClick(){
    		let that = this;
    		let {navReplaceTab} = this.props;
	        navReplaceTab({ name: i18n.t(200700/*市场活动编辑*/), component: i18n.t(200700/*市场活动编辑*/), url: '/marke/addEidt'});
	        this.props.router.push({pathname: '/marke/addEidt',query:{id:this.props.id}});
    	}
    	deleteClick(){

			let that = this;	
    		Confirm(i18n.t(200735/*您确定要删除吗*/), {
				done:() => {
					apiForm(API_FOODING_ERP,'/activity/delete',{billId:this.props.id},(response)=>{
						ServiceTips({text:'成功！',type:'sucess'});				
						let {navReplaceTab} = this.props;
						navReplaceTab({ name: i18n.t(100332/*市场活动*/), component: i18n.t(100332/*市场活动*/), url: '/marke/list'});
						this.props.router.push({pathname: '/marke/list',query:{id:this.props.id}});
					},(error)=>{
						ServiceTips({text:error.message,type:'error'});
					})
				}
			});			
    	}

		// 提交 
		submitClick(){
			let that = this;
    		Confirm(i18n.t(200736/*您确定要提交吗*/), {
			  done:() => {
				    apiForm(API_FOODING_ERP,"/common/submitBill",{billId:that.props.getOne['billId'],billType:that.props.getOne['billType']},
					response => {
				    	ServiceTips({text:'成功！',type:"success"});
						that.props.getPage(); //刷新当前页面//刷新当前页面
			  		},error => {
				    	ServiceTips({text:error.message,type:'error'});
				    })
				}
			});
    	}

		// 生成商机 
		opportunityClick(){
			ServiceTips({text:'正在建设中...',type:'info'});			
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
        	// let tab = {id: this.props.navigate.currentTab, url: v.url};
	        // this.props.updateTab(tab);
	        // browserHistory.push({pathname: v.url, query: {id: this.props.location.query.id}});
            this.props.onClickLink({id:v.id, dataTyId: v.dataTyId,activeTab:this.state.activeTab,isLoading:v.isLoading});
            let navContent = this.state.navContent;
            navContent[e].isLoading = true;
            this.setState({
                activeTab:v.id,
                navContent:navContent
            });

    	}
    	componentWillReceiveProps(nextProps){
    		// console.log(nextProps);
    	}
		componentDidMount(){
			// let activeId= getActiveTab(this.props.location.pathname,this.state.navContent);
			// this.setState({activeTab:activeId});
		}

		onclickXin(){
				this.setState({
					isShow:!this.state.isShow
				});
		}
		render(){
			let array_name = this.state.navContent;
			let {getOne} = this.props;

			return  (
				<div className = 'cdetails'>
					<div className="box1">
							<div className="touxiang">
									<div className="tupian"><i className="foddingicon fooding-user_icon"></i></div>
							</div>
							<div className="right">
									<div className="box3">
										<div className="daima">
											<p>{getOne['no']}</p>
											<span style={{background:'#c6ced8',marginLeft:'250px',display:'inline-block',fontSize:'14px',color:'#fafbfc',width:'50px',height:'20px',textAlign:'center',lineHeight:'20px',borderRadius:'10px'}}>{getOne.statusName || i18n.t(200576/*无*/)}</span>
											{ getOne['status'] == 1 ?
												<span style={{float:'right'}}>
													{ permissionsBtn('marke.edit') ? <i className="foddingicon fooding-Edit" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200376/*修改*/)} onClick={this.editClick} ></i> : ''}
													{ permissionsBtn('marke.del') ? <i className="foddingicon fooding-delete-icon3" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100437/*删除*/)}  onClick={this.deleteClick}></i> : ''}
													{ permissionsBtn('marke.submit') ? <i className="foddingicon fooding-submit" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(100472/*提交*/)} onClick={this.submitClick}></i> : ''}
												</span>
												:
												''
											}
											{ getOne['status'] == 10 ?
												<span style={{float:'right'}}>
													{/*{ permissionsBtn('marke.tobusiness') ? <i className="foddingicon fooding-submit" style={{fontSize:'16px',marginRight:'20px'}} title ={i18n.t(200737*//*生成商机*//*)} onClick={this.opportunityClick}></i> : ''}*/}
												</span>
												:
												''
											} 
										</div>
										<span className="name"><p>{getOne["markActvName"]}</p></span>
									</div>
									<div className="box4">
											<div className="flex"><div className="nation"><span>{i18n.t(200738/*预计客户数*/)}</span><b>{getOne["tagResps"] || 0}</b></div></div>
											<div className="flex"><div className="contact"><span>{i18n.t(200739/*实际客户数*/)}</span><b>{getOne["actBeQty"] || 0}</b></div></div>
											<div className="flex"><div className="source"><span>{i18n.t(200740/*涉及订单金额*/)}</span><b>{getOne['orderAmts'] || 0} {getOne['cny'+language]}</b></div></div>
											<div className="flex"><div className="web"><span>{i18n.t(200741/*总成本*/)}</span><b>{getOne["costAmt"] || 0} {getOne['cny'+language]}</b></div></div>
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
export default NavConnect(LocationConnect(withRouter(SODetailsHead)));

