import i18n from './../../../../lib/i18n';
import React, { Component } from 'react';
const {Table} = require("../../../../components/Table");
import Clause from "./Clause";
import Trading from "./Trading";
import AddNormal from "./AddNormal";
import Shipping from "./Shipping";
import Organ from "./Organ";
import Require from "./Require";
import {createForm,FormWrapper} from '../../../../components/Form';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import Confirm from '../../../../components/Dialog/Confirm';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,
	API_FOODING_DS,pageSize,sizeList } from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
export  class  ActivityDetail extends Component{
	constructor(props){
		super(props);
		this.onTableClick = this.onTableClick.bind(this);
		this.saveClick = this.saveClick.bind(this);
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
		this.getOneCall();
    };
    getOneCall(id,initAjax){
    	let that = this;
    	apiGet(API_FOODING_ERP,'/insale/getOne',
    		{billId:this.state.id||id,salBeId:this.state.salBeId}
    		,(response)=>{
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
			  apiPost(API_FOODING_ERP,'/insale/save',Object.assign({},this.state.getOne,value),(response)=>{
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
  	saveClickLink(initAjax){
  		let that = this;
  		this.props.form.validateFields((error, value) => {
			if(error){
				console.log(error, value);
			}else{
			  apiPost(API_FOODING_ERP,'/insale/save',Object.assign({},this.state.getOne,value),(response)=>{
					let cancel = ()=>{
						 let param = response.data;
							this.props.router.push({pathname: this.props.router.location.pathname, query: {id: param.billId}, state: {refresh: false}});
							that.setState({id:param},()=>{
								that.getOneCall();
							});

					};
					let done = ()=>{
						ServiceTips({text:response.message,type:'sucess'});
			  		// initAjax();
			  		// this.getOneCall(response.data);
			  		// this.setState({
			  		// 	id:response.data
			  		// });
			  		this.props.navReplaceTab({ name: i18n.t(201057/*国内销售订单详情*/), component: i18n.t(201057/*国内销售订单详情*/), url: '/salesn/detail'});
	        		this.props.router.push({pathname: '/salesn/detail',query:{id:response.data}});
					};
					Confirm(i18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5,cancel, done});

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
					 <Clause isShowChecked={true} setGetOne={this.setGetOne}  getOne = {this.state.getOne} form ={this.props.form}/>
					 <Trading isShowChecked={true} setGetOne={this.setGetOne}  getOne = {this.state.getOne} form ={this.props.form}/>
					 <Shipping isShowChecked={true} setGetOne={this.setGetOne} getOne = {this.state.getOne} form ={this.props.form}/>
					 <Organ isShowChecked={true} setGetOne={this.setGetOne} getOne = {this.state.getOne} form ={this.props.form}/>
					 <Require isShowChecked={true}
					    getOneCall= {this.getOneCall}
					 	getOne = {this.state.getOne}
					 	id={this.state.id}
					 	saveClick = {this.saveClick}
					 />
				</div>
			);

	}

}

export default createForm()(NavConnect(ActivityDetail));
