import React,{Component, PropTypes} from "react";
import {createForm, FormWrapper} from "../../../../components/Form";
import AddNormal from "./AddNormal";//新增常规
import ProviderInformationAdd from "./ProviderInformationAdd";//新增供应商信息
import OrganizationAdd from "./OrganizationAdd";//新增组织
import ProductInformationAdd from "./NewProductInfomationEditAdd";//新增产品信息
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import { I18n } from '../../../../lib/i18n';
import Confirm from '../../../../components/Dialog/Confirm';
class PruchaseEditAdd extends Component{
	constructor(props){
		super(props)
		this.backClick = this.backClick.bind(this);
		this.state={
			scrollHeight:0,
			PurOrder:{}, //getOne 拿到的对象
			mtlId:null,//存储产品id

			productSelectData:[], //产品数组列表
			material:{},//选择单条产品得到数据
			noId:false,//判断是否有供应商id

			providerSelectData:[],//供应商
			providerOth:{}, //选择供应商带出来的数据
		}
	}
	handleResize(height){
  		let padding = 80;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	//初始化数据
	initGetOne = billId =>　{
		if(!billId) billId = "";
		apiGet(API_FOODING_ERP,'/purorder/getOne',{billId:billId},response => {
			let purorderData = response.data;
			this.setState({PurOrder: Object.assign(purorderData, {indexAry: purorderData.products.map((e,i) => i) }), mtlId:purorderData.mtlId})
		},error => {console.log(error.message)})
	}
	//产品搜索
	onProductChange = (index,data) => {
		if(data.trim() === "") return;
		apiGet(API_FOODING_DS,'/material/search',{keyword:data},response =>{
			// this.props.form.resetFields(['products[0].mtlId'])
			this.setState({productSelectData:response.data || []})
		}, error => {
			ServiceTips({text:error.message,type:'error'})
		})
	}
	//产品选择 连带出数据
	// onProductSelect = (index,data,e) => {
	// 	let mtlId = data;
	// 	let mtlLcName = e.props.objValue.mtlLcName;
	// 	let mtlEnName = e.props.objValue.mtlEnName;
	// 	let that = this;
	// 	that.setState({mtlId:data});
	// 	const { getFieldProps, getFieldValue, getFieldError, getNFieldProps} = that.props.form;
	// 	let vndBeIdValue = getFieldValue('vndBeId',{}).vndBeId || '';//供应商id
	// 	apiGet(API_FOODING_DS,'/material/getProductInforErp',{id:data,mtlType:'pmtl',sourceId:vndBeIdValue},response => {
	// 		//取出对象的数组对象
	// 		let products = that.state.PurOrder.products;
	// 		//选择供应商时对每一个对象进行数据合并更新
	// 		//setFieldsInitialValue
	// 		products[index] = Object.assign({},products[index],response.data,{mtlId:mtlId,mtlLcName:mtlLcName,mtlEnName:mtlEnName});
	// 		let providerOth = Object.assign({},this.state.PurOrder,response.data,{products:products});
	// 		that.setState({PurOrder:providerOth})
	// 		that.props.form.setFieldsValue({
	// 			["products[" + index + "].basSpeci"]:response.data.basSpeci || "",
	// 			["products["+ index + "].hsCode"]:response.data.hsCode || "",
	// 			["products["+ index + "].domcSupply"]: response.data.domcSupply || "",
	// 			["products["+ index + "].inspcMark"]: response.data.inspcMark || false
	// 		});
	// 	},error => console.log(error.message))
	// }
	onProductSelect = (index,data) => {
		let mtlId = data.id;
		let mtlLcName = data.localName;
		let mtlEnName = data.name;
		let that = this;
		that.setState({mtlId:mtlId});
		const { getFieldProps, getFieldValue, getFieldError, getNFieldProps} = that.props.form;
		let vndBeIdValue = getFieldValue('vndBeId',{}).vndBeId || '';//供应商id
		apiGet(API_FOODING_DS,'/material/getProductInforErp',{id:mtlId,mtlType:'pmtl',sourceId:vndBeIdValue},response => {
			//取出对象的数组对象
			let products = that.state.PurOrder.products;
			//选择供应商时对每一个对象进行数据合并更新
			//setFieldsInitialValue
			products[index] = Object.assign({},products[index],response.data,{mtlId:mtlId,mtlLcName:mtlLcName,mtlEnName:mtlEnName});
			let providerOth = Object.assign({},this.state.PurOrder,response.data,{products:products});
			that.setState({PurOrder:providerOth})
			that.props.form.setFieldsValue({
				["products[" + index + "].basSpeci"]:response.data.basSpeci || "",
				["products["+ index + "].hsCode"]:response.data.hsCode || "",
				["products["+ index + "].domcSupply"]: response.data.domcSupply || "",
				["products["+ index + "].inspcMark"]: response.data.inspcMark || false
			});
		},error => console.log(error.message))
	}
	//产品点击时
	ProductClick = (index,callback) => {
		let that = this;
		const { getFieldProps, getFieldValue, getFieldError, getNFieldProps} = that.props.form;
		let vndBeIdValue = getFieldValue('vndBeId',{}).vndBeId;//供应商id
		if(!vndBeIdValue){
			//表示没有供应id
			this.setState({
				noId:true
			},() => callback(undefined))
		}else{
			apiGet(API_FOODING_DS,'/beMtl/getList',{sourceId:vndBeIdValue},response => {
				let array = response.data.map((e,i) => {
					return {id:e.material.id,localName:e.material.localName,name:e.material.name,key:i,code:e.material.code,nameValues:e.material.enName,specTxt:e.material.specTxt}
				})
				that.setState({
					productSelectData:array || [],
					noId:false
				},() => callback(array))
			},error => {

			})
		}
	}
	//选择某一个供应商
	onProviderSelect = (data,e) => {
		let vndBeId = e.props.objValue.vndBeId;
		let vndBeEnName = e.props.objValue.vndBeEnName;
		let vndBeLcName = e.props.objValue.vndBeLcName;
		let that = this;

		const { getFieldProps, getFieldValue, getFieldError, getNFieldProps} = that.props.form;
		let mtlBeIdValue = this.state.mtlId || getFieldValue('products[0].mtlId',{}).mtlId;//产品id
		if(mtlBeIdValue == undefined) return;
		apiGet(API_FOODING_DS,'/beMtl/getVendorForErp',{mtlId:mtlBeIdValue,sourceId:data},response => {
			//取出对象的数组对象
			let products = that.state.PurOrder.products;
			//选择供应商时对每一个对象进行数据合并更新
			for(let i  = 0; i < products.length; i++){
				products[i] = Object.assign({},products[i],response.data);
				that.props.form.setFieldsValue({
					["products["+ i + "].domcSupply"]: response.data.domcSupply || ""
				});
			}
			let providerOth = Object.assign({},that.state.PurOrder,response.data,{products:products,vndBeId:vndBeId,vndBeEnName:vndBeEnName,vndBeLcName:vndBeLcName});
			
			// select后 清空支付条款
			delete providerOth['payTrmId'];
			delete providerOth['payTrmLcName'];
			delete providerOth['payTrmEnName'];
			
			
			that.setState({PurOrder:providerOth})
		},error => console.log(error.message))
	}
	onProviderClick = () => {
		let that = this;
		const { getFieldProps, getFieldValue, getFieldError, getNFieldProps} = that.props.form;
		let mtlBeIdValue = this.state.mtlId || getFieldValue('products[0].mtlId',{}).mtlId;//产品id
		if(!mtlBeIdValue){
			//表示没有产品id
			apiPost(API_FOODING_DS,'/object/getMiniList',{"obj":"com.fooding.fc.ds.entity.Vendor"},response => {
				that.setState({providerSelectData:response.data || []})
			},error => {
				ServiceTips({text:error.message,type:'error'});
			})
		}else{
			apiGet(API_FOODING_DS,'/beMtl/byMtl/getList',{mtlId:mtlBeIdValue,dataTyId:70},response => {
				let array = response.data.map((e,i) => {
					return {id:e.enterpris.id,localName:e.enterpris.localName,name:e.enterpris.name}
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
	//点击添加新增一个产品列表
	onRequierAddClick = () => {
		//判断供应商有没有值
		let that = this;
		const { getFieldProps, getFieldValue, getFieldError, getNFieldProps} = that.props.form;
		let vndBeIdValue = getFieldValue('vndBeId',{}).vndBeId;//供应商id
		if(!vndBeIdValue) {
			ServiceTips({text:I18n.t(400179/*多产品采购时需要先指定供应商信息!*/),type:"error"});
			return;
		}
		//每点击一次一次点击新增，复制一下最初始化数据
		let {PurOrder} = this.state;
		let products = PurOrder.products;
		let indexAry = PurOrder.indexAry;
		products.push({sourceNo:null});
		indexAry.push(products.length - 1);
		let PurOrderOne = Object.assign({},PurOrder,{products:products, indexAry})
		that.setState({PurOrder:PurOrderOne})
	}
	//关闭某一个的产品
	onCloseClick = index => {
		let {PurOrder} = this.state;
		let products = PurOrder.products;
		let indexAry = PurOrder.indexAry;
		products.splice(index,1);
		indexAry.splice(index, 1);
		let PurOrderOne = Object.assign({},PurOrder,{products:products})
		this.setState({PurOrder:PurOrderOne})
	}
	//保存按钮
	saveClick = () => {
  		let that = this;
  		const { getFieldProps, getFieldValue, getFieldError, getNFieldProps} = that.props.form;

  		that.props.form.validateFields((error, value) => {
  			if(error){
  				if(error.products ){
					  window.Tip.errorTips(I18n.t(100379/*产品*/) + (error.products.findIndex(d => d) + 1) + I18n.t(100497/*填写不完整*/));
				  }
  			}else{
  				let productsOld = this.state.PurOrder.products;
  				let productsNew = value.products;
				let currentProducts = [];
  				for(let i = 0, j = productsOld.length; i < j; i++){
  					if(productsOld[0].billId){
						currentProducts.push(Object.assign({},productsOld[i],productsNew[i]));
						continue;
					}else{
  						currentProducts.push(Object.assign({},productsNew[i]));
					}
  				}
  				value = Object.assign({},this.state.PurOrder,value,{products:currentProducts});
  				apiPost(API_FOODING_ERP,'/purorder/save',value,response => {
  					let {navAddTab,navReplaceTab} =this.props;
					let cancel = () => {
						this.props.router.push({pathname: '/pruchaseorder/add', query: {id: response.data}, state: {refresh: false}});
						this.initGetOne(response.data);
					};
					let done = () => {
						ServiceTips({text:response.message,type:'sucess'});
						navReplaceTab({name:I18n.t(400020/*采购订单*/) + I18n.t(100097/*详情*/),component:I18n.t(400020/*采购订单*/) + I18n.t(100097/*详情*/),url:'/pruchaseorder/detail'});
						this.props.router.push({pathname:'/pruchaseorder/detail',query:{id:response.data}});
					};
					Confirm(I18n.t(500100/*保存成功, 是否跳转到详情界面?*/), { timing: 5,cancel, done});
  				},error => {
  					ServiceTips({text:error.message,type:'error'})
  				})
  			}
  		})
  	}
  	//返回按钮
  	backClick() {
	    let {navReplaceTab} = this.props;
	    let billId = this.props.location.query.id;
	    if(billId){
	        navReplaceTab({name:I18n.t(400020/*采购订单*/) + I18n.t(100097/*详情*/),component:I18n.t(400020/*采购订单*/) + I18n.t(100097/*详情*/),url:'/pruchaseorder/detail'});
	        this.props.router.push({pathname: '/pruchaseorder/detail', query: {id: billId}});
	    } else {
	        navReplaceTab({name:I18n.t(400020/*采购订单*/),component:I18n.t(400020/*采购订单*/),url:'/pruchaseorder/list'});
	        this.props.router.push({pathname: '/pruchaseorder/list'});
	    }
	}
	//取消合单
	cancelClick = () => {
		let {navReplaceTab,navRemoveTab,navAddTab} = this.props;
		apiForm(API_FOODING_ERP,"/purorder/delete",{billId:this.props.location.query.id},response => {
			ServiceTips({text:response.message,type:'success'})
			navRemoveTab({name:I18n.t(400020/*采购订单*/),component:I18n.t(400020/*采购订单*/),url:'/pruchaseorder/list'});
			navAddTab({name:I18n.t(400020/*采购订单*/),component:I18n.t(400020/*采购订单*/),url:'/pruchaseorder/list'})
	        this.props.router.push({pathname:'/pruchaseorder/list'});

		},error => ServiceTips({text:error.message,type:'error'}))
	}
	componentDidMount(){
		let billId = this.props.location.query.id || null;
		this.initGetOne(billId);
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
		if(this.props.location.query.id !== nextProps.location.query.id){
			this.initGetOne(nextProps.location.query.id)
		}
  	}
	render(){
		const { getNFieldProps, getFieldError } = this.props.form;
		return(<div style={{height:this.state.scrollHeight}} className='scroll activity-detail'>
				<AddNormal
					saveClick={this.saveClick}
					backClick={this.backClick}
					cancelClick={this.cancelClick}
					form = {this.props.form}
					PurOrder={this.state.PurOrder}
				/>
				<ProductInformationAdd ref={rf=>this.productInfos=rf}  form = {this.props.form} onProductChange={this.onProductChange} onProductSelect={this.onProductSelect} ProductClick={this.ProductClick} productSelectData={this.state.productSelectData} noId={this.state.noId} PurOrder={this.state.PurOrder} onRequierAddClick={this.onRequierAddClick} onCloseClick = {this.onCloseClick} />
				<ProviderInformationAdd
					form = {this.props.form} onProviderSelect={this.onProviderSelect} onProviderClick={this.onProviderClick} providerSelectData={this.state.providerSelectData} PurOrder={this.state.PurOrder}
				/>
				<OrganizationAdd form = {this.props.form} PurOrder={this.state.PurOrder} />
		</div>)
	}
}
export default NavConnect(createForm()(PruchaseEditAdd));
