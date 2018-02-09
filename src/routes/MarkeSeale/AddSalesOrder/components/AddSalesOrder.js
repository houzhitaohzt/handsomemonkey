import i18n from './../../../../lib/i18n';
import React, { Component } from 'react';
const {Table} = require("../../../../components/Table");


import {createForm,FormWrapper} from '../../../../components/Form';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList } from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
import Confirm from '../../../../components/Dialog/Confirm';

import AddNormal from "./AddNormal";
import Organ from "./Organ";
import Require from "./Require";


export  class  ActivityDetail extends Component{

	constructor(props){
		super(props);
		this.onTableClick = this.onTableClick.bind(this);


		// init func 
		this.backClick = this.backClick.bind(this);		
		this.getOne = this.getOne.bind(this);
		this.productList = this.productList.bind(this);
		this.personnelList = this.personnelList.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		
		
		this.setGetOne = this.setGetOne.bind(this);

		// init state
		this.state = {
			inputValue:'',
			checked:0,
			paddingTop:0,
			scroll:0,
			isnormal:this.props.location.query.isnormal?this.props.location.query.isnormal:false,
			getOne:{},
			id:this.props.location.query.id,

			billId: '', // id
			productData:'', // 产品列表
			personnelData:'', // 职员列表
			
		}

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
		this.getOne();
    };

	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}

  	backClick(){
  		let that = this;
  		this.props.navRemoveTab({name: i18n.t(200700/*市场活动编辑*/), component: i18n.t(200700/*市场活动编辑*/), url: '/salesorder/addEidt'});
        this.props.navReplaceTab({name:i18n.t(100332/*市场活动*/),component:i18n.t(100332/*市场活动*/),url:'/salesorder/list'});
        this.props.router.push({ pathname: '/salesorder/list'});
  	}


	// getOne 数据
	getOne(ID,initAjax){

    	let that = this;
    	apiGet(API_FOODING_ERP,'/activity/getOne',{billId:this.props.location.query['id'] || ID || ''},
		(response)=>{
			this.setState({
				billId:response.data.billId,
				getOne:response.data
			},function(){
				that.productList();
				that.personnelList();
				initAjax && initAjax();
			});
		},(errors)=>{
			ServiceTips({text:errors.message,type:'error'});			
		})
    }

	// 产品列表 
	productList(){
		let that = this;
		apiGet(API_FOODING_ERP,'/activity/mtl/getPage',{billId:that.state.billId},
			(response)=>{	
				that.setState({	
					productData: response.data.data,
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});	
	}

	// 职员列表 
	personnelList(){
		let that = this;
		apiGet(API_FOODING_ERP,'/activity/staff/getPage',{billId:that.state.billId},
			(response)=>{	
				that.setState({	
					personnelData: response.data.data,
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}




    onSaveAndClose(initAjax){

		let that = this;
		let {getOne} = this.state;
		const {form, onSaveAndClose} = that.props;


		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_ERP,'/activity/save',Object.assign({},getOne,value),
					(response)=>{
						that.getOne(response.data,initAjax);
						
						if(initAjax) return; // 字表保存 跳过
						Confirm(i18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5,done:()=>{
							window.navTabs.replace(i18n.t(200685/*市场活动详情*/),`/marke/detail`,{id:response.data},{refresh: true});
						}});

					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});			
    }
	onCancel(){
        
	}

	render(){


			return (
				<div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
					<AddNormal 
						handleChange={this.handleChange}
						onSaveAndClose={this.onSaveAndClose}
						backClick={this.backClick}
						getOne={this.getOne}
						onTableClick ={this.onTableClick}
						inputValue ={this.state.inputValue}
						checked ={this.state.checked}
						columns = {this.state.columns}
						data = {this.state.data}
						getOneData = {this.state.getOne}
						form = {this.props.form}
						location={this.props.location}
						navReplaceTab={this.props.navReplaceTab}
						navRemoveTab={this.props.navRemoveTab}
						router={this.props.router}
						
					 />
					 <Organ isShowChecked={true}  getOne = {this.state.getOne} form ={this.props.form}/>
					 <Require 
					 	isShowChecked={true}
					 	getOne = {this.state.getOne}
					 	id={this.state.id}
					 	onSaveAndClose = {this.onSaveAndClose}
						productData={this.state.productData}
						personnelData={this.state.personnelData}
						productList={this.productList}
						personnelList={this.personnelList}
						
					 />
				</div>
			);

	}

}

export default createForm()(NavConnect(ActivityDetail));

