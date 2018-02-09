import i18n from './../../../../lib/i18n';
import React, { Component } from 'react';
import Table  from  "../../../../components/Table";
import Normal from "./Normal";
import Require from "./Require";
import { browserHistory } from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
export  class  ActivityDetail extends Component{
	constructor(props){
		super(props);
		this.onTableClick = this.onTableClick.bind(this);
		this.saveClick = this.saveClick.bind(this);
		this.backClick = this.backClick.bind(this);
		this.getForm = this.getForm.bind(this);
		this.normalRef = null;
		this.state = {
			inputValue:'',
			checked:0,
			paddingTop:0,
			scroll:0,
			id:this.props.location.query.id,
			isnormal:this.props.location.query.isnormal?this.props.location.query.isnormal:false,
		}
	}
	onTableClick(value){
		if(this.state.checked == 0){
			this.setState({
				inputValue:value.business + '  '+ value.theme
			})
		}else if(this.state.checked == 1){
			this.setState({
				inputValue:value.business + '  '+ value.theme
			})
		}
	}
	handleResize(height){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
  		let padding = 80;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;

		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}
  	saveClick(value,isclose,initAjax){
  		var that = this;
  		apiPost(API_FOODING_ERP,'/lsbeport/save',value,(response)=>{
	      			that.setState({
	      				id:response.data
	      			});
	      			if(isclose){
	      			   initAjax();
	      			}else{
	      				ServiceTips({text:response.message,type:'sucess'});
	
	      				this.props.navReplaceTab({name: i18n.t(200530/*货运港杂详情*/), component: i18n.t(200530/*货运港杂详情*/), url: '/costtsp/detail'});
	      				 this.props.router.push({pathname:'/costtsp/detail',query:{id:response.data}});
	      			}
	    },(error)=>{
	    		ServiceTips({text:error.message,type:'error'});
	    })
  	}
  	backClick(data){
  		this.props.navRemoveTab({name: i18n.t(200531/*货运港杂编辑*/), component: i18n.t(200531/*货运港杂编辑*/), url: '/costtsp/add'});
        this.props.navReplaceTab({name:i18n.t(200532/*货运港杂*/),component:i18n.t(200532/*货运港杂*/),url:'/costtsp/list'});
        this.props.router.push({ pathname: '/costtsp/list'}); 
		// if(data.billId){
		// 	this.props.navReplaceTab({name: '货运港杂详情', component: '货运港杂详情', url: '/costtsp/detail'});
		// 	this.props.router.push({pathname:'/costtsp/detail',query: {id:data.billId}});
		// } else {
		// 	this.props.navReplaceTab({name: '货运港杂', component: '货运港杂', url: '/costtsp/list'});
		// 	this.props.router.push({pathname:'/costtsp/list',query: {}});
		// }
  	}
  	getForm(isclose,initAjax){
  		var that = this;
  		that.normalRef.saveClick(true,initAjax);
  	}
	render(){

			return (
				<div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
					<Normal
					    normalRef={no => this.normalRef = no}
						saveClick={this.saveClick}
						backClick={this.backClick}
						onTableClick ={this.onTableClick}
						inputValue ={this.state.inputValue}
						checked ={this.state.checked}
						id={this.state.id}
					 />
					 <Require isShowChecked={true}
					  id={this.state.id}
					  getForm={this.getForm}
					  />
				</div>
			);

	}

}

export default NavConnect(ActivityDetail);

