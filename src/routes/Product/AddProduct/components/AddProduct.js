import React, { Component } from 'react';
import Measurement from  '../../../../components/RuleTemplate';
import "../assets/_addproduct.less";
//引入常规
import AddNormal from "./AddNormalPage";
//引入组织
import AddOrganization from "./AddOrganization";

import MeasureCommon from  '../../../../components/RuleTemplate';
import Template1  from  '../../../Client/Detail/Content/components/Template1';

import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import {createForm, FormWrapper} from "../../../../components/Form";
import WebData from '../../../../common/WebData';
import {I18n} from '../../../../lib/i18n';
export  class  AddProduct extends Component{
	constructor(props){
		super(props);
		this.handleResize=this.handleResize.bind(this);
		this.saveClick = this.saveClick.bind(this);
		this.backClick = this.backClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);

		//单个页面公告的删除函数
		this.deleteFunc = this.deleteFunc.bind(this);
		//单个页面的保存函数
		this.saveFunc = this.saveFunc.bind(this);
		//单个小列表初始化数据函数
		this.getPage = this.getPage.bind(this);

		//产品计量单位 新增和编辑保存
		this.onMeasumSaveAndClose=this.onMeasumSaveAndClose.bind(this);
		//产品箱型装载数据 新增和保存
		this.onContnrLoadingsSaveAndClose=this.onContnrLoadingsSaveAndClose.bind(this);
        //产品规格细分 新增和编辑的保存
		this.onMtlQailtemSaveAndClose=this.onMtlQailtemSaveAndClose.bind(this);
		//产品包装
		this.onPackSaveAndClose=this.onPackSaveAndClose.bind(this);
		//产品别名
		this.onMaterialExtNamesSaveAndClose=this.onMaterialExtNamesSaveAndClose.bind(this);

		this.getMtlQailtemPages=this.getMtlQailtemPages.bind(this);
		this.getMeasumPage=this.getMeasumPage.bind(this);
		this.getContnrLoadingspage=this.getContnrLoadingspage.bind(this);
		this.getPackPage=this.getPackPage.bind(this);
		//this.getMaterialExtNamesPage=this.getMaterialExtNamesPage.bind(this);

		//新增之前的保存函数
		this.addBeforeSaveClick = this.addBeforeSaveClick.bind(this);
		this.state = {
			visible:false, 
            dialogTitle:'',
            dilogTelmp:<div></div>,

			paddingTop:0,
			scroll:0,

			//每一个小列表的数据
			contnrLoadings:[],  //箱型装箱数据
			materialExtNames:[], //产品别名
			measums:[],  //计量单位
			mtlQaitems:[], //产品规格细分
			packs:[], //产品包装

			specTxt:"", //产品规格
			valueone:{}
		}
		this.productData = null;
		console.log(this.props.location)
	}

	//新增之前判断有没有保存？保存编辑函数
	addBeforeSaveClick(callback){
		if(!this.productData){
			const {form} = this.props;
	  		form.validateFields((error, value) => {
	  			if(error){
	  				callback(I18n.t(100497/*填写不完整*/))
	  			}else{
	  				let params = this.props.form.getFieldsValue();
	  				let a = [];
					params.pPStdId.map((e)=>{a.push(e.id)});

					delete params.pPStdId;
					let valueone = Object.assign({},params,{pPStdId:a});
	  				apiPost(API_FOODING_DS,'/material/save',valueone,response => {
	  					this.productData = response.data;
	  					this.props.router.push({pathname: '/product/add', query: {id: this.productData}, state: {refresh: false}});
	  					callback(null, this.productData)
	  				}, error => {
	  					callback(error.message)
	  				})
	  			}	
	  		})
		}else{
			callback(null,this.productData)
		}
	}
	//初始化数据
	initObj = id => {
		if(!id) return;
		this.productData = id;
		apiGet(API_FOODING_DS,"/material/getOne",{id:id}, response => {
			let valueone = response.data || {};
			this.setState({valueone})
		},error => ServiceTips({text:error.message,type:'error'}))

		this.getContnrLoadingspage();
        //this.getMaterialExtNamesPage();
        this.getMeasumPage();
        this.getMtlQailtemPages();
        this.getPackPage();
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

	handleClick = (e, data, Template) => {
        if(data.number ==2){
        	let id = [],tempString = I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
            id = (data && data.record)? [data.record.id]:data.selectArr.map((o) => o.id);
            if(!(data && data.record || data.selectArr.length == 1)){
                tempString = I18n.t(100395/*已选中*/) + data.selectArr.length + I18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
            }
            Confirm(tempString, {
				done: () => {
					if(data.id == "22"){
						this.deleteFunc(API_FOODING_DS,'/measum/delete',{id:id},response => {
							this.getPage(API_FOODING_DS,'/measum/getPage',{sourceId:this.state.id},response => {
								ServiceTips({text:response.message,type:'success'});
								this.setState({
									measums:response.data.data
								})
							},error => {
								ServiceTips({text:error.message,type:'error'});
							})
						})
        			}
        			if(data.id == "23"){
						this.deleteFunc(API_FOODING_DS,'/contnrLoading/delete',{id:id},response => {
							this.getPage(API_FOODING_DS,'/contnrLoading/getPage',{sourceId:this.state.id},response => {
								ServiceTips({text:response.message,type:'success'});
								this.setState({
									contnrLoadings:response.data.data
								})
							},error => {
								ServiceTips({text:error.message,type:'error'});
							})
						})
        			}
					if(data.id == "24"){
						this.deleteFunc(API_FOODING_DS,'/mtlQaitem/delete',{id:id},response => {
							this.getPage(API_FOODING_DS,'/mtlQaitem/getPage',{mtlId:this.state.id},response => {
								ServiceTips({text:response.message,type:'success'});
								this.setState({
									mtlQaitems:response.data.data
								})
							},error => {
								ServiceTips({text:error.message,type:'error'});
							})
						})
        			}
        			if(data.id == "25"){
						this.deleteFunc(API_FOODING_DS,'/pack/delete',{id:id},response => {
							this.getPage(API_FOODING_DS,'/pack/getPage',{sourceId:this.state.id},response => {
								ServiceTips({text:response.message,type:'success'});
								this.setState({
									packs:response.data.data
								})
							},error => {
								ServiceTips({text:error.message,type:'error'});
							})
						})
        			}
					if(data.id == 26){//产品别名删除时,不要id,因此id没有作用
						let extName = (data && data.record)? [data.record.extName]:data.selectArr.map((o) => o.extName);
						this.deleteFunc(API_FOODING_DS,'/material/deleteExtNames',{id:this.productData,extNames:extName},response => {
							ServiceTips({text:response.message,type:'success'})
							that.initObj(this.productData);//更新父类，进行数据请求
						})
        			}
        			/*if(data.id == "26"){  
						this.deleteFunc(API_FOODING_DS,'/materialExtName/delete',{id:id},response => {
							this.getPage(API_FOODING_DS,'/materialExtName/getPage',{mtlId:this.state.id},response => {
								ServiceTips({text:response.message,type:'success'});
								this.setState({
									materialExtNames:response.data
								})
							},error => {
								ServiceTips({text:error.message,type:'error'});
							})
						})
        			}*/
				},
				close: () => {

				}
		   	});
        }else{
        	let dialogTitle= data.action+data.name.title;
        	 this.setState({
        	 	visible:true,
                dialogTitle:dialogTitle,
                dilogTelmp:Template
        	});
        }
    }
    onSaveAndClose(values){
        this.setState({visible:false});
    }
	onCancel(){
        this.setState({visible:false});
	}

  	//右上保存 保存就跳转页面
  	saveClick(values,data){
  		let that = this;
  		const {form} = that.props;
  		form.validateFields((error, value) => {
  			if(error){

  			}else{
				//保存时，查看是否每个列表有数据，没有就不进行数据保存和页面跳转
				let {contnrLoadings,materialExtNames,measums,mtlQaitems,packs} = that.state;
				if(mtlQaitems.length == 0){
					ServiceTips({text:I18n.t(100392/*新增*/) + I18n.t(100601/*产品规格细分*/),type:'error'})
					return false;
				}
				/*if(packs.length == 0){
					ServiceTips({text:i18n.t(200867*//*请新增产品包装*//*),type:'error'})
					return false;
				}
				if(materialExtNames.length == 0){
					ServiceTips({text:i18n.t(200868*//*请新增产品别名*//*),type:'error'})
					return false;
				}*/
				if(measums.length == 0){
					ServiceTips({text:I18n.t(100392/*新增*/) + I18n.t(100589/*计量单位*/),type:'error'})
					return false;
				}
				/*if(contnrLoadings.length == 0){
					ServiceTips({text:i18n.t(200869*//*请新增箱型装载数据*//*),type:'error'})
					return false;
				} */ 
  				apiGet(API_FOODING_DS,"/material/getOne",{id:that.productData},response => {
	  				let params = this.props.form.getFieldsValue();
	  				let a = [];
					params.pPStdId.map((e)=>{a.push(e.id)});
					delete params.pPStdId;
	  				let valueone = Object.assign({},params,{id:that.productData,optlock:response.data.optlock,pPStdId:a});
	  				apiPost(API_FOODING_DS,'/material/save',valueone,response => {
	  					ServiceTips({text:response.message,type:'success'})
	  					let {navAddTab,navReplaceTab} =that.props;
						navReplaceTab({name:I18n.t(100379/*产品*/) + I18n.t(100097/*详情*/),component:I18n.t(100379/*产品*/) + I18n.t(100097/*详情*/),url:'/product/detail'});
						that.props.router.push({pathname:'/product/detail',query:{id:that.productData}});
						that.productData = null;
						that.props.form.resetFields();
	  				}, error => {
	  					ServiceTips({text:error.message,type:'error'})
	  				})
  				},error => ServiceTips({text:error.message,type:'error'}))
  			}	
  		})
  	}
  	//返回按钮
  	backClick(){
  		let {navAddTab, navReplaceTab,navRemoveTab} =this.props;
  		navRemoveTab({name:I18n.t(100379/*产品*/) + I18n.t(100392/*新增*/),component:I18n.t(100379/*产品*/) + I18n.t(100392/*新增*/),url:'/product/add'});
  		navRemoveTab({name:I18n.t(500198/*企业产品*/),component:I18n.t(500198/*企业产品*/),url:'/product/list'});
       	navAddTab({name:I18n.t(500198/*企业产品*/),component:I18n.t(500198/*企业产品*/),url:'/product/list'});
		this.props.router.push('/product/list');
  	}	

	//产品规格细分 新增和编辑保存
	onMtlQailtemSaveAndClose(value,data){
		value = Object.assign({},value,{mtlId:this.productData,dataTyId:20})
		//data为空对象，表示是新增,否则表示是编辑
		if(JSON.stringify(data) !== "{}"){
			value = Object.assign({},value,{id:data.id,optlock:data.optlock,localName:data.qaItem.localName})
		}
		apiPost(API_FOODING_DS,'/mtlQaitem/save',value,response => {
			ServiceTips({text:response.message,type:'success'});
			this.getMtlQailtemPages();
		},error => {
			ServiceTips({text:error.message,type:'error'})
		})
		this.setState({visible:false});
	}

	//产品细分初始化数据拉取
	getMtlQailtemPages(){
		apiGet(API_FOODING_DS,'/mtlQaitem/getPage',{mtlId:this.productData,pageSize:100,currentPage:1,column:'id',order:'desc',dataTyId:20},response => {
				let mtlQaitems = response.data.data || [];
				let specTxt = '';
                mtlQaitems.forEach(da => {
                    if(da.majMrk){
                        if( specTxt) specTxt += ";";
                        specTxt += da.qaItem.localName + da.calSymBol.name + da.maxQaValue;
                    }
                });
                this.setState({mtlQaitems, specTxt});
			},error => {
				
			})
	}

	//计量单位 新增和编辑保存
	onMeasumSaveAndClose(value,data){
		value = Object.assign({},value,{sourceId:this.productData,dataTyId:20})
		//data为空对象，表示是新增,否则表示是编辑		
		if(JSON.stringify(data) !== "{}"){
			value = Object.assign({},value,{id:data.id,optlock:data.optlock,rowSts:data.unitofmea.rowSts})
		}
		//apiPost 保存数据
		apiPost(API_FOODING_DS,'/measum/save',value,response => {			
			//getPage 刷新单个模块数据
			ServiceTips({text:response.message,type:'success'});
			this.getMeasumPage();
		},error => {
			ServiceTips({text:error.message,type:'error'})
		})
		this.setState({visible:false});
	}

	//计量单位初始化拉去数据
	getMeasumPage(){
		apiGet(API_FOODING_DS,'/measum/getPage',{sourceId:this.productData,pageSize:100,currentPage:1,column:'id',order:'desc',dataTyId:20},response => {		
				this.setState({
					measums:response.data.data
				})
			},error => {
				
			})
	}

	//产品箱型装载数据 新增和编辑保存
	onContnrLoadingsSaveAndClose(value,data){
		value = Object.assign({},value,{sourceId:this.productData,dataTyId:20})
		//data为空对象，表示是新增,否则表示是编辑		
		if(JSON.stringify(data) !== "{}"){
			value = Object.assign({},value,{id:data.id,optlock:data.optlock})
		}
		//apiPost 保存数据
		apiPost(API_FOODING_DS,'/contnrLoading/save',value,response => {			
			//getPage 刷新单个模块数据
			ServiceTips({text:response.message,type:'success'});
			this.getContnrLoadingspage();
		},error => {
			ServiceTips({text:error.message,type:'error'})
		})
		this.setState({visible:false});
	}

	//产品箱型装载数据 初始化
	getContnrLoadingspage(){
		apiGet(API_FOODING_DS,'/contnrLoading/getPage',{sourceId:this.productData,pageSize:100,currentPage:1,column:'id',order:'desc',dataTyId:20},response => {
				this.setState({
					contnrLoadings:response.data.data
				})
			},error => {
				
			})
	}

	//产品包装 新增和编辑保存
	onPackSaveAndClose(value,data){
		value = Object.assign({},value,{sourceId:this.productData,dataTyId:20})
		//data为空对象，表示是新增,否则表示是编辑		
		if(JSON.stringify(data) !== "{}"){
			value = Object.assign({},value,{id:data.id,optlock:data.optlock,localName:data.packaging.localName,dataTyId:20})
		}
		//apiPost 保存数据
		apiPost(API_FOODING_DS,'/pack/save',value,response => {			
			//getPage 刷新单个模块数据
			ServiceTips({text:response.message,type:'success'});
			this.getPackPage()
		},error => {
			ServiceTips({text:error.message,type:'error'})
		})
		this.setState({visible:false});
	}

	//产品包装 初始化
	getPackPage(){
		apiGet(API_FOODING_DS,'/pack/getPage',{sourceId:this.productData,pageSize:100,currentPage:1,column:'id',order:'desc',dataTyId:20},response => {
				this.setState({
					packs:response.data.data
				})
			},error => {
				
			})
	}

	//产品别名
	onMaterialExtNamesSaveAndClose(value,data){
		let that = this;
		value = Object.assign({},value,{id:this.productData,dataTyId:20})
		apiForm(API_FOODING_DS,'/material/saveExtNames',value,response => {
			ServiceTips({text:response.message,type:'success'})
			that.initObj(this.productData);
		},error => {
			ServiceTips({text:error.message,type:'error'})
		})
		this.setState({visible:false});
	}

	//产品别名初始化
	/*getMaterialExtNamesPage(){
		apiGet(API_FOODING_DS,'/materialExtName/getPage',{mtlId:this.productData,pageSize:100,currentPage:1,column:'id',order:'desc',dataTyId:20},response => {
				this.setState({
					materialExtNames:response.data.data
				})
			},error => {
				
			})
	}*/



	//删除函数 deleteFunc
	/**
		API_Fooding : 请求地址
		params : 请求路径
		value :　所传的参数
	*/
	deleteFunc(API_Fooding,params,value){
		let that = this;
		apiForm(API_Fooding,params,value,response => {
			ServiceTips({text:response.message,type:'success'})
		}, error => {
			ServiceTips({text:error.message,type:'error'})
		})
	}

	//保存函数 saveFunc
	/**
		API_Fooding : 请求地址
		params : 请求路径
		value :　所传的参数
	*/
	saveFunc(API_FOODING,params,value){
		let that = this;
		apiForm(API_FOODING,params,value,response => {
			ServiceTips({text:response.message,type:'success'})
		}, error => {
			ServiceTips({text:error.message,type:'error'})
		})
	}

	//更新单个列表模块的页面
	/*
		由于每个列表模块的页面数据比较少，最多也就50多条，因此将每次拉取的数据写死
	*/
	getPage(API_FOODING,params,value,resolve,reject){
		value = Object.assign({},value,{pageSize:100,currentPage:1,column:'id',order:'desc'})
		apiGet(API_FOODING,params,value,resolve,reject);
	}


	componentDidMount(){
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
		this.initObj(this.props.location.query.id);
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
		let id = nextProps.location.query.id;
        if (id !== this.props.location.query.id) {
            this.initObj(id);
        }
  	}
	render(){
		const commonForm = this.state.dilogTelmp;
		const { valueone } = this.state;
			let materialExtname = (valueone&&valueone.extNames || []).map( (e,idx) => ({id:idx,extName:e})) || [];
		let {form} = this.props;
		return (
				<div className='activity-detail scroll' style={{height:this.state.scrollHeight,overflow:scroll}}>
					<AddNormal
						saveClick={this.saveClick}
						backClick={this.backClick}
						form ={form}
						data = {{specTxt:this.state.specTxt}}
						valueone = {this.state.valueone}
					 />
					<div>             
		            	<div className = 'col'>
							<Measurement 
								menuList={[
									{type:'add'},
									{type:'delete'},
									{type:'edit'}                                        
								]}							
								onCancel ={this.onCancel} title ={I18n.t(100601/*产品规格细分*/)}
							 openDialog={this.handleClick}
							 	addBeforeSaveClick={this.addBeforeSaveClick}
			               		Zindex={9}
			                     id={'24'}
			                     showHeader ={true}
			                     checkedRowsArray={[]}
			                     onSaveAndClose={this.onMtlQailtemSaveAndClose}
			                     AjaxInit={true}
								 addNoInit={true}
	                             API_FOODING={API_FOODING_DS}
	                             portname={'/mtlQaitem/getOne'}
	                             params={{dataTyId:20}}
			                     columns ={
			                    	[{
										title : I18n.t(100602/*主要*/),
										dataIndex : 'majMrk',
										key : "majMrk",
										width : '12.5%',
										render(data,row,index){
											//return data?I18n.t(100141/*是*/):I18n.t(100142/*否*/);
											return (<i style = {{display: 'inline-block',textAlign: 'center'}} className={data?'foddingicon fooding-dui-icon2':''}></i>)
										}
									},{
										title : I18n.t(100001/*名称*/),
										dataIndex : "qaItem",
										key : "qaItem",
										width : "20%",
										render(data,row,index){
											data = data !== null?data:"";
											if(data && ('localName' in data)){
												return data.localName
											}
											return data;
										}
									},{
										title : I18n.t(100604/*符号*/),
										dataIndex : "calSymBol",
										key : "calSymBol",
										width : "11.5%",
										render(data,row,index){
											data = data !== null?data:"";
											if(data && ('name' in data)){
												return data.name
											}
											return data;
										}
									},{
										title :I18n.t(100605/*指标*/),
										dataIndex : "maxQaValue",
										key : "maxQaValue",
										width : "12.5%",
										render(data,row,index){
											return (<div>{data}</div>)
										}
									},{
										title : I18n.t(100606/*测试方法*/),
										dataIndex : 'testMeth',
										key : "testMeth",
										width : "20%",
										render(data,row ,index){
											data = data !== null?data:"";
											if(data && ('localName' in data)){
												return data.localName
											}
											return data;
										}
									}]
			                    }
			                    data={this.state.mtlQaitems}
		                    />
							<Measurement 
								menuList={[
									{type:'add'},
									{type:'delete'},
									{type:'edit'}                                        
								]}							
								onCancel ={this.onCancel} title ={I18n.t(100550/*产品包装*/)} openDialog={this.handleClick}
		                     	Zindex={8}
			                     id={'25'}
			                     showHeader ={true}
			                     DialogTempalte ={require('../../Detail/Content/components/ProPackDialog').default}
			                     addBeforeSaveClick={this.addBeforeSaveClick}
			                     onSaveAndClose={this.onPackSaveAndClose}
			                     checkedRowsArray={[]}
			                     AjaxInit={true}
	                             API_FOODING={API_FOODING_DS}
	                             portname={'/pack/getInit'}
	                             params={{}}
			                    columns ={
			                    	[{
										title : I18n.t(100596/*包装名称*/),
										dataIndex : 'packaging',
										key : "packaging",
										width : '25%',
										render(data,row,index){
											data = data !== null?data:"";
											if(data && ('localName' in data)){
												return data.localName
											}
											return data;
										}
									},{
										title : I18n.t(100551/*净重量*/),
										dataIndex : "netWtNum",
										key : "netWtNum",
										width : "15%",
										render(data,row,index){
											return data;
										}
									},{
										title : I18n.t(100553/*毛重量*/),
										dataIndex : "grosWtNum",
										key : "grosWtNum",
										width : "15%",
										render(data,row,index){
											return (<div>{data}</div>)
										}
									},{
										title : I18n.t(100223/*体积量*/),
										dataIndex : 'volNum',
										key : "volNum",
										width : "20%",
										render(data,row ,index){
											return data;
										}
									},{
										title :I18n.t(100557/*基础包装*/),
										dataIndex : 'basPackMrk',
										key : "basPackMrk",
										width : "18%",
										render(data,row ,index){
											//return data?I18n.t(100141/*是*/):I18n.t(100142/*否*/);
											return (<i style = {{display: 'inline-block',textAlign: 'center'}} className={data?'foddingicon fooding-dui-icon2':''}></i>)
										}
									}]
			                    }
			                    data={this.state.packs}
		                    />
							 <Measurement 
							 	onCancel ={this.onCancel} title ={I18n.t(100494/*产品别名*/)} openDialog={this.handleClick}
			                     Zindex={7}
			                     id={'26'}
			                     showHeader ={false}
			                     addBeforeSaveClick={this.addBeforeSaveClick}
			                     onSaveAndClose={this.onMaterialExtNamesSaveAndClose}
			                     checkedRowsArray={[]}
			                     menuList={[]}
			                     columns ={
			                    	[{
										title : I18n.t(100494/*产品别名*/),
										dataIndex : 'extName',
										key : "extName",
										width : '90%',
										render(data,row,index){
											return (<div title={data} className={'text-ellipsis'}>{data}</div>)
										}
									}]
			                    }
		                    	data={materialExtname}
		                    />
		                    <AddOrganization form={form} valueone = {this.state.valueone}/>
		            	</div>
		            	<div className = 'col' style={{paddingLeft:0}}>
		               		<Measurement 
								menuList={[
									{type:'add'},
									{type:'delete'},
									{type:'edit'}                                        
								]}							   
							   	title ={I18n.t(100589/*计量单位*/)} 
		               			addBeforeSaveClick={this.addBeforeSaveClick}
			                    Zindex={6}
			                    openDialog={this.handleClick}
			               		onCancel = {this.onCancel}
			               		checkedRowsArray={[]}
			                    id={'22'}
			                    showHeader ={true}
			                    onSaveAndClose={this.onMeasumSaveAndClose}
			                     AjaxInit={true}
								 addNoInit={true}
	                             API_FOODING={API_FOODING_DS}
	                             portname={'/measum/getOne'}
	                             params={{}}
			                    columns ={
			                    	[{
										title : I18n.t(100589/*计量单位*/),
										dataIndex : 'unitofmea',
										key : "unitofmea",
										width : '18%',
										render(data,row,index){
											data = data !== null?data:"";
											if(data && ('localName' in data)){
												return data.localName
											}
											return data;
										}
									},{
										title : I18n.t(100591/*基础计量*/),
										dataIndex : "basMrk",
										key : "basMrk",
										width : "25%",
										render(data,row,index){
											//return data?I18n.t(100141/*是*/):I18n.t(100142/*否*/);
											return (<i style = {{display: 'inline-block',textAlign: 'center'}} className={data?'foddingicon fooding-dui-icon2':''}></i>)
										}
									},{
										title : I18n.t(100592/*采购计量*/),
										dataIndex : "purMrk",
										key : "purMrk",
										width : "18%",
										render(data,row,index){
											//return data?I18n.t(100141/*是*/):I18n.t(100142/*否*/);
											return (<i style = {{display: 'inline-block',textAlign: 'center'}} className={data?'foddingicon fooding-dui-icon2':''}></i>)
										}
									},{
										title :I18n.t(100593/*销售计量*/),
										dataIndex : "salMrk",
										key : "salMrk",
										width : "18%",
										render(data,row,index){
											//return data?I18n.t(100141/*是*/):I18n.t(100142/*否*/);
											return (<i style = {{display: 'inline-block',textAlign: 'center'}} className={data?'foddingicon fooding-dui-icon2':''}></i>)
										}
									},{
										title : I18n.t(100594/*基础单位数量*/),
										dataIndex : 'eqBasnum',
										key : "eqBasnum",
										width : "21%",
										render(data,row ,index){
											return data;
										}
									}]
			                    }
			                    data={this.state.measums}
		                    />
		                    <Measurement 
								menuList={[
									{type:'add'},
									{type:'delete'},
									{type:'edit'}                                        
								]}							
								onCancel ={this.onCancel} title ={I18n.t(100595/*箱型装载数据*/)} openDialog={this.handleClick}
		                    	addBeforeSaveClick={this.addBeforeSaveClick}
			                    Zindex={5}
			                     id={'23'}
			                     showHeader ={true}
			                     checkedRowsArray={[]}
			                     onSaveAndClose={this.onContnrLoadingsSaveAndClose}
			                     AjaxInit={true}
								 addNoInit={true}
	                             API_FOODING={API_FOODING_DS}
	                             portname={'/contnrLoading/getOne'}
	                             params={{dataTyId:20,sourceId:this.productData}}
	                             otherData={{sourceId:this.productData}}
			                    columns ={
			                    	[{
										title : I18n.t(100596/*包装名称*/),
										dataIndex : 'packaging',
										key : "packaging",
										width : '25%',
										render(data,row,index){
											data = data !== null?data:"";
											if(data && ('localName' in data)){
												return data.localName
											}
											return data;
										}
									},{
										title : I18n.t(100214/*箱型*/),
										dataIndex : "contnrType",
										key : "contnrType",
										width : "12.5%",
										render(data,row,index){
											data = data !== null?data:"";
											if(data && ('localName' in data)){
												return data.localName
											}
											return data;
										}
									},{
										title : I18n.t(100598/*箱型数量*/),
										dataIndex : "mtlContNum",
										key : "mtlContNum",
										width : "10.5%",
										render(data,row,index){
											return data;
										}
									},{
										title : I18n.t(100598/*箱型数量*/),
										dataIndex : "mtlUom",
										key : "mtlUom",
										width : "12.5%",
										render(data,row,index){
											data = data !== null?data:"";
											if(data && ('localName' in data)){
												return data.localName
											}
											return data;
										}
									},{
										title : I18n.t(100124/*托盘类型*/),
										dataIndex : 'salvrType',
										key : "salvrType",
										width : "25%",
										render(data,row ,index){
											data = data !== null?data:"";
											if(data && ('localName' in data)){
												return data.localName
											}
											return data;
										}
									},{
										title : I18n.t(100600/*每托盘件数*/),
										dataIndex : 'salvrIdNum',
										key : "salvrIdNum",
										width : "16.5%",
										render(data,row ,index){
											return data;
										}
									}]
			                    }
			                    data={this.state.contnrLoadings}
		                    />
		           		</div>
	               </div>
	                <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
		                {commonForm}
		            </Dialog>
				</div>
				);
	}

}

export default NavConnect(createForm()(AddProduct));
