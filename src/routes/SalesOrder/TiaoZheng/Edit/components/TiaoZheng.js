import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
const {Table} = require("../../../../../components/Table");
import AddNormal from "./AddNormal";
import Organ from "./Organ";
import Require from "./Require";
import {createForm,FormWrapper} from '../../../../../components/Form';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList } from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
export  class  ActivityDetail extends Component{
	constructor(props){
		super(props);
		this.onTableClick = this.onTableClick.bind(this);
		this.saveClick = this.saveClick.bind(this);
		this.backClick = this.backClick.bind(this);
		this.state = {
			inputValue:'',
			checked:0,
			paddingTop:0,
			scroll:0,
			isnormal:this.props.location.query.isnormal?this.props.location.query.isnormal:false,
			getOne:{},
			id:this.props.location.query.id,
			salBeId:this.props.location.query.salBeId
		}
		this.setGetOne = this.setGetOne.bind(this);
		this.getOneCall = this.getOneCall.bind(this);
		this.saveClickLink = this.saveClickLink.bind(this);
	}

	setGetOne(obj){
		this.setState({
			getOne:obj
		});
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
  		let padding = 100;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;

		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
		// this.getOneCall();
    };
    getOneCall(id,initAjax){
    	let that = this;
    	apiGet(API_FOODING_ERP,'/saleadjust/getOne',{billId:this.state.id||id},(response)=>{
			this.setState({
				getOne:response.data
			},()=>{
				if(initAjax){
					initAjax();
				}
			});
		},(error)=>{

		})
    }
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}
  	saveClick(initAjax){
  		let that = this;
  		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
			  apiPost(API_FOODING_ERP,'/saleorder/save',Object.assign({},this.state.getOne,value),(response)=>{
			  		ServiceTips({text:response.message,type:'sucess'});
			  		this.getOneCall(response.data,initAjax);
			  		this.setState({
			  			id:response.data
			  		});
			  },(error)=>{
			  		ServiceTips({text:error.message,type:'error'});
			  })
			}

    	});
  	}
  	backClick(){
  		let that = this;
  		this.props.navRemoveTab({name: i18n.t(200239/*销售订单编辑*/), component: i18n.t(200239/*销售订单编辑*/), url: '/salesorder/addEidt'});
        this.props.navReplaceTab({name:i18n.t(200237/*销售订单*/),component:i18n.t(200237/*销售订单*/),url:'/salesorder/list'});
        this.props.router.push({ pathname: '/salesorder/list'});
  	}
  	saveClickLink(initAjax){
  		let that = this;
  		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
			  let a = {};
			  a.billId = this.state.getOne.billId;
			  a.adjustCause = value.adjustCause ;
			  a.orgId = value.sorId;
			  a.orgLcName = value.sorLcName;
			  a.orgEnName = value.sorEnName;
			  a.staffId  = value.saleStaffId;
			  a.staffLcName  = value.saleStaffLcName;
			  a.staffEnName = value.saleStaffEnName;
			  a.mtlInfo  = value.mtlInfo;
			  a.payTrmId = value.payTrmId;
			  a.payTrmLcName = value.payTrmLcName;
			  a.payTrmEnName = value.payTrmEnName;
			  a.incotmId = value.incotmId;
			  a.incotmLcName = value.incotmLcName;
			  a.incotmEnName = value.incotmEnName;
			  a.sStatnId = value.sStatnId;
			  a.sStatnLcName = value.sStatnLcName;
			  a.sStatnEnName = value.sStatnEnName;
			  a.eStatnId = value.eStatnId;
			  a.eStatnLcName = value.eStatnLcName;
			  a.eStatnEnName = value.eStatnEnName;
			  apiPost(API_FOODING_ERP,'/saleadjust/save',Object.assign({},a),(response)=>{
			  		ServiceTips({text:response.message,type:'sucess'});
			  		this.props.navReplaceTab({ name: i18n.t(201076/*销售订单调整单详情*/), component: i18n.t(201076/*销售订单调整单详情*/), url: '/tiaozheng/detail'});
	        		this.props.router.push({pathname: '/tiaozheng/detail',query:{id:response.data}});
			  },(error)=>{
			  		ServiceTips({text:error.message,type:'error'});
			  })
			}

    	});
  	}
	render(){
			return (
				<div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
					<AddNormal handleChange={this.handleChange}
						saveClick={this.saveClickLink}
						backClick={this.backClick}
						onTableClick ={this.onTableClick}
						inputValue ={this.state.inputValue}
						checked ={this.state.checked}
						columns = {this.state.columns}
						data = {this.state.data}
						getOne = {this.state.getOne}
						form = {this.props.form}
						setGetOne = {this.setGetOne}
					 />
					 <Require isShowChecked={true}
					    getOneCall= {this.getOneCall}
					 	getOne = {this.state.getOne}
					 	id={this.state.id}
					 	saveClick = {this.saveClick}
					 	form = {this.props.form}
					 />
					 <Organ isShowChecked={true} setGetOne={this.setGetOne} getOne = {this.state.getOne} form ={this.props.form}/>
				</div>
			);

	}

}

export default createForm()(NavConnect(ActivityDetail));
