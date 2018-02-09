import i18n from './../../../../lib/i18n';
import React, { Component } from 'react';
const {Table} = require("../../../../components/Table");
import {createForm,FormWrapper} from '../../../../components/Form';
import AddNormal from "./AddNormal";
import Organ from "./Organ";
import Inbound from "./Inbound";
import { browserHistory } from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
export  class  ActivityDetail extends Component{
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.onTableClick = this.onTableClick.bind(this);
		this.saveClick = this.saveClick.bind(this);
		this.backClick = this.backClick.bind(this);
		this.getForm = this.getForm.bind(this);
		this.setGetOne = this.setGetOne.bind(this);
		this.normalRef = null;
		this.state = {
			inputValue:'',
			checked:0,
			paddingTop:0,
			selectArr:[],
			rodalShow:false,
			scroll:0,
			id:this.props.location.query.id,
			isnormal:this.props.location.query.isnormal?this.props.location.query.isnormal:false,
			getOne:{},
			productSelectData:[], //产品数组列表
			material:{},//选择单条产品得到数据
			noId:false,//判断是否有供应商id
			providerSelectData:[],//供应商
			providerOth:{}, //选择供应商带出来的数据
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
	handleResize(height){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
  		let padding = 80;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;

		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	//产品搜索
	onProductChange = (data) => {
		if(data.trim() === "") return;
		apiGet(API_FOODING_DS,'/material/search',{keyword:data},response =>{
			// this.props.form.resetFields(['products[0].mtlId'])
			this.setState({productSelectData:response.data || []})
		}, error => {
			ServiceTips({text:error.message,type:'error'})
		})
	}
	//产品选择 连带出数据
	onProductSelect = (data) => {
		this.setState({mtlId:data});
		const { getFieldProps, getFieldValue, getFieldError, getNFieldProps} = this.props.form;
		let vndBeIdValue = getFieldValue('vndBeId',{}).vndBeId || '';//供应商id
		apiGet(API_FOODING_DS,'/material/getProductInforErp',{id:data,mtlType:'pmtl',sourceId:vndBeIdValue},response => {
			let providerOth = Object.assign({},this.state.getOne,response.data);
			this.setState({getOne:providerOth})
		},error => console.log(error.message))
	}
	//产品点击时
	ProductClick = (index) => {
		let that = this;
		const { getFieldProps, getFieldValue, getFieldError, getNFieldProps} = that.props.form;
		let vndBeIdValue = getFieldValue('vndBeId',{}).vndBeId;//供应商id
		if(!vndBeIdValue){
			//表示没有供应id
			this.setState({
				noId:true
			})
		}else{
			apiGet(API_FOODING_DS,'/beMtl/getList',{sourceId:vndBeIdValue},response => {
				let array = response.data.map((e,i) => {
					return {id:e.material.id,localName:e.material.localName,name:e.material.name,key:i}
				})
				that.setState({
					productSelectData:array || [],
					noId:false
				})
			},error => {

			})
		}
	}
	//选择某一个供应商
	onProviderSelect = (data) => {
		let that = this;
		const { getFieldProps, getFieldValue, getFieldError, getNFieldProps} = that.props.form;
		let mtlBeIdValue = this.state.mtlId;//产品id
		if(mtlBeIdValue == undefined) return;
		apiGet(API_FOODING_DS,'/beMtl/getVendorForErp',{mtlId:mtlBeIdValue,sourceId:data},response => {
		let products = that.state.getOne.products;
		let providerOth = Object.assign({},that.state.getOne,{linkerId:response.data.vndSlinkerId,linkerLcName:response.data.vndSlinkerLcName,linkerEnName:response.data.vndSlinkerEnName,products:products,beMtlCode:response.data.beMtlCode});
			that.setState({getOne:providerOth})
		},error => console.log(error.message))
	}
	onProviderClick = () => {
		let that = this;
		const { getFieldProps, getFieldValue, getFieldError, getNFieldProps} = that.props.form;
		let mtlBeIdValue = this.state.mtlId;//产品id
		if(!mtlBeIdValue){
			//表示没有产品id
			apiPost(API_FOODING_DS,'/object/getMiniList',{"obj":"com.fooding.fc.ds.entity.Vendor"},response => {
				that.setState({providerSelectData:response.data})
			},error => {
				ServiceTips({text:error.message,type:'error'});
			})
		}else{
			apiGet(API_FOODING_DS,'/beMtl/byMtl/getList',{mtlId:mtlBeIdValue,dataTyId:70},response => {
				let array = response.data.map((e,i) => {
					return {id:e.enterpris.id,localName:e.enterpris.localName,name:e.enterpris.name,key:i}
				})
				that.setState({
					providerSelectData:array || [],
					noId:false
				})
			},error => {
				ServiceTips({text:error.message,type:'error'});
			})
		}
	}
	//关闭某一个的产品
	onCloseClick = index => {
		let {getOne} = this.state;
		let products = getOne.products;
		let indexAry = getOne.indexAry;
		products.splice(index,1);
		indexAry.splice(index, 1);
		let PurOrderOne = Object.assign({},getOne,{products:products})
		this.setState({getOne:PurOrderOne})
	}
	componentDidMount(){
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
		apiGet(API_FOODING_ERP,'/purquotation/getOne',{billId:this.state.id},(response)=>{
			this.setState({
				getOne:response.data
			});
		},(error)=>{

		})

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
  		const { getFieldProps, getFieldValue, getFieldError, getNFieldProps} = that.props.form;
  		let getOne=this.state.getOne;
  		apiPost(API_FOODING_ERP,'/purquotation/save',Object.assign({},getOne,value),(response)=>{
	      			that.setState({
	      				id:response.data
	      			});
	      			if(isclose){
	      			   initAjax();
	      			}else{
	      				ServiceTips({text:response.message,type:'sucess'});
	      				this.props.navReplaceTab({name: i18n.t(201010/*供应商报价详情*/), component: i18n.t(201010/*供应商报价详情*/), url: '/purchasequote/detail'});
	      				 this.props.router.push({pathname:'/purchasequote/detail',query:{id:response.data}});
	      			}
	    },(error)=>{
	    		ServiceTips({text:error.message,type:'error'});
	    })
  	}
  	backClick(data){
		if(data.billId){
			this.props.navReplaceTab({name: i18n.t(500133/*入库通知单详情*/), component: i18n.t(500133/*入库通知单详情*/), url: '/stockin/detail'});
			this.props.router.push({pathname:'/stockin/detail',query: {id:data.billId}});
		} else {
			this.props.navReplaceTab({name: i18n.t(400041/*入库通知单*/), component: i18n.t(400041/*入库通知单*/), url: '/stockin/list'});
			this.props.router.push({pathname:'/stockin/list',query: {}});
		}
  	}
  	getForm(isclose,initAjax){
  		var that = this;
  		that.refs.normalRef.saveClick(true,initAjax);
  	}
	render(){

			return (
				<div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
					<AddNormal ref ='normalRef'
						saveClick={this.saveClick}
						backClick={this.backClick}
						onTableClick ={this.onTableClick}
						inputValue ={this.state.inputValue}
						checked ={this.state.checked}
						id={this.state.id}
						columns = {this.state.columns}
						data = {this.state.data}
						getOne = {this.state.getOne}
						form = {this.props.form}
						setGetOne={this.setGetOne}
						form = {this.props.form} 
						onProductChange={this.onProductChange} 
						onProductSelect={this.onProductSelect}
						ProductClick={this.ProductClick} 
						productSelectData={this.state.productSelectData}
						noId={this.state.noId}
						onCloseClick = {this.onCloseClick}
						onProviderSelect={this.onProviderSelect}
						onProviderClick={this.onProviderClick}
						providerSelectData={this.state.providerSelectData}
					/>
					 <Organ getOne={this.state.getOne} form = {this.props.form} setGetOne={this.setGetOne}/>

					<Inbound isShowChecked={true}
					  id={this.state.id}
					  getForm={this.getForm}
					/>
				</div>
			);

	}

}

export default NavConnect(createForm()(ActivityDetail));

