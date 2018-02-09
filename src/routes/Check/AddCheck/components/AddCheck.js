import i18n from './../../../../lib/i18n';
import React, { Component } from 'react';
import {createForm,FormWrapper} from '../../../../components/Form';
import AddNormal from "./AddNormal";
import Kucun from "./kucun";
import Page from "../../../../components/Page";//分页
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
export  class  ActivityDetail extends Component{
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.onTableClick = this.onTableClick.bind(this);
		this.saveClick = this.saveClick.bind(this);
		this.getForm = this.getForm.bind(this);
		this.setGetOne = this.setGetOne.bind(this);
		this.normalRef = null;
		this.state = {
			inputValue:'',
			checked:0,
			paddingTop:0,
			scroll:0,
			id:this.props.location.query.id,
			isnormal:this.props.location.query.isnormal?this.props.location.query.isnormal:false,
			getOne:{},
			cangKuArray:[]
		}
		this.btnClick = this.btnClick.bind(this);
	}
	btnClick(value){
		let that = this;
		if(value.slId){
			apiGet(API_FOODING_ERP,'/stock/getPage',{slId:value.slId,stId:value.stId,slspId:value.slspId,brandId:value.brandId,vndBeId:value.vndBeId,mtlId:value.mtlId,mStatsId:value.mStatsId,purCnyId:value.purCnyId},(response)=>{
			this.setState({
				cangKuArray:response.data.data
			});
		},(error)=>{

		})
		}else{
			return;
		}
		
	}
	setGetOne(obj){
		this.setState({
			getOne:obj
		});
	}
	handleChange(e){
		if(e.target.value == 2 || e.target.value == 3){
				this.setState({
					isShowDialog:true,
					checked:e.target.value,
					inputValue:'' + e.target.value
				});
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
	handleResize(){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
  		let padding = 80;
		let sch=document.body.offsetHeight-padding;
		let scroll = sch-135;

		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize);
		apiGet(API_FOODING_ERP,'/stocking/getOne',{billId:this.state.id},(response)=>{
			this.setState({
				getOne:response.data
			});
		},(error)=>{

		})

    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize);
  	}

  	saveClick(value,isclose,initAjax){
  		var that = this;
  		let getOne=this.state.getOne;
  		apiPost(API_FOODING_ERP,'/stocking/save',Object.assign({},getOne,value),(response)=>{
	      			that.setState({
	      				id:response.data
	      			});
	      			if(isclose){
	      			   initAjax();
	      			}else{
	      				ServiceTips({text:response.message,type:'sucess'});
	      				this.props.navReplaceTab({name: i18n.t(200411/*盘点单详情*/), component: i18n.t(200411/*盘点单详情*/), url: '/check/detail'});
	      				 this.props.router.push({pathname:'/check/detail',query:{id:response.data}});
	      			}
	    },(error)=>{
	    		ServiceTips({text:error.message,type:'error'});
	    })
  	}
  	getForm(isclose,initAjax){
  		var that = this;
  		that.normalRef.saveClick(true,initAjax);
  	}
	render(){

			return (
				<div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
					<AddNormal
					normalRef={no => this.normalRef = no} 
					onTableClick ={this.onTableClick}
					inputValue ={this.state.inputValue} 
					columns = {this.state.columns}
					checked ={this.state.checked}
					data = {this.state.data}
					getOne = {this.state.getOne}
					form = {this.props.form}
					setGetOne={this.setGetOne}
					btnClick = {this.btnClick}
					saveClick={this.saveClick}
					id={this.state.id}
					/>
					<Kucun id={this.state.id} cangKuArray = {this.state.cangKuArray}/>
				</div> 
			);

	}

}

export default NavConnect(createForm()(ActivityDetail));

