import i18n from './../../../../lib/i18n';
import React, { Component } from 'react';
const {Table} = require("../../../../components/Table");
import Clause from "./Clause";
import EditNormal from "./EditNormal";
import Organ from "./Organ";
import Require from "./Require";
import {createForm,FormWrapper} from '../../../../components/Form';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList } from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
export  class  ActivityDetail extends Component{
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.saveClick = this.saveClick.bind(this);
		this.backClick = this.backClick.bind(this);
		this.state = {
			inputValue:'',
			scroll:0,
			data:[],
			billId:this.props.location.query.id,
			getOne:{}
		}
		this.getOneCall = this.getOneCall.bind(this);
		this.qiaoXiaoClick = this.qiaoXiaoClick.bind(this);
	}
	getOneCall(){
		let that = this;
		apiGet(API_FOODING_ERP,'/shipping/getOne',{billId:this.state.billId},
			(response)=>{
				this.setState({
					getOne:response.data
				})
			},(error)=>{

			})
	}
	handleChange(e){
		this.setState({
			isShowDialog:true,
			checked:e.target.value,
			inputValue:'' + e.target.value
		});
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
		this.getOneCall();
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
  	saveClick(){
  		let that = this;
  		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
			  apiPost(API_FOODING_ERP,'/shipping/save',Object.assign({},this.state.getOne,value),(response)=>{
					let param = response.data;
					let cancel = ()=>{
							this.props.router.push({pathname: this.props.router.location.pathname, query: {id: param},
								 state: {refresh: false}});
							that.setState({billId:param},()=>{
								that.getOneCall();
							})
					};
					let done = ()=>{
						ServiceTips({text:response.message,type:'sucess'});
			  		this.props.navReplaceTab({ name: i18n.t(200370/*物流订单详情*/), component: i18n.t(200370/*物流订单详情*/), url: '/booking/detail'});
	        	this.props.router.push({pathname: '/booking/detail',query:{id:response.data}});
					};
					Confirm(i18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5,cancel, done});
			  },(error)=>{
			  		ServiceTips({text:error.message,type:'error'});
			  })
			}

    	});
  	}
  	qiaoXiaoClick(){
  		Confirm("您确定要取消下单吗？", {
			  done: () => {
				    apiForm(API_FOODING_ERP,'/shipping/delete',{billId:this.state.billId},
				    	(response)=>{
				    		ServiceTips({text:response.message,type:'success'});
				    		this.props.navRemoveTab({name: i18n.t(200371/*物流订单编辑*/), component: i18n.t(200371/*物流订单编辑*/), url: '/booking/edit'});
				    		this.props.navReplaceTab({ name: i18n.t(200373/*物流订单*/), component: i18n.t(200373/*物流订单*/), url: '/Booking/list'});
	        				this.props.router.push({pathname: '/Booking/list'});
				    	},(error)=>{
				    		ServiceTips({text:error.message,type:'error'});
				    	})
				},
				close:() => {

				}
			});
  	}
  	backClick(){
  		let that = this;
  		this.props.navRemoveTab({name: i18n.t(200371/*物流订单编辑*/), component: i18n.t(200371/*物流订单编辑*/), url: '/booking/edit'});
        this.props.navAddTab({name:i18n.t(200373/*物流订单*/),component:i18n.t(200373/*物流订单*/),url:'/Booking/list'});
        this.props.router.push({ pathname: '/Booking/list'});
  	}
	render(){

			return (
				<div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
					<EditNormal  form={this.props.form} getOne={this.state.getOne}
					 saveClick={this.saveClick}
					 backClick ={this.backClick}
					 qiaoXiaoClick = {this.qiaoXiaoClick}/>
					<Clause isShowChecked={true} form={this.props.form} getOne={this.state.getOne}/>
					<Require isShowChecked={true} form={this.props.form} getOne={this.state.getOne} id={this.state.billId}/>
					<Organ isShowChecked={true} form={this.props.form} getOne={this.state.getOne}/>
				</div>
			);

	}

}

export default createForm()(NavConnect(ActivityDetail));
