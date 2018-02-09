import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template2  from  '../../../../Client/Detail/Content/components/Template2';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import Measurement from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import '../../../../../components/RuleTemplate/assets/_productDetail.less';

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
import xt from "../../../../../common/xt";

export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        props.detail && props.detail(this);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
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
		this.columnSort = {column: 'id', order: 'desc'};

		this.getPages = this.getPages.bind(this);
    }
    handleClick = (e, data, Template) => {
    	let that = this;
        if(data.number ==2){
        	let id = [],tempString = i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
            id = (data && data.record)? [data.record.id]:data.selectArr.map((o) => o.id);
            if(!(data && data.record || data.selectArr.length == 1)){
                tempString = i18n.t(100395/*已选中*/) + data.selectArr.length + i18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
            }
            Confirm(tempString, {
				done: () => {
					if(data.id == 22){
						this.deleteFunc(API_FOODING_DS,'/measum/delete',{id:id},response => {
							ServiceTips({text:response.message,type:'success'})
							that.initMeasum();
						})
        			}
        			if(data.id == 23){
						this.deleteFunc(API_FOODING_DS,'/contnrLoading/delete',{id:id},response => {
							ServiceTips({text:response.message,type:'success'})
							that.initContnrLoadings()
						})
        			}
					if(data.id == 24){
						this.deleteFunc(API_FOODING_DS,'/mtlQaitem/delete',{id:id},response => {
							ServiceTips({text:response.message,type:'success'})
							that.initMtlQailtem()
						})
        			}
        			if(data.id == 25){
						this.deleteFunc(API_FOODING_DS,'/pack/delete',{id:id},response => {
							ServiceTips({text:response.message,type:'success'})
							that.initPackDate();
						})
        			}
        			if(data.id == 26){//产品别名删除时,不要id,因此id没有作用
						let extName = (data && data.record)? [data.record.extName]:data.selectArr.map((o) => o.extName);
						this.deleteFunc(API_FOODING_DS,'/material/deleteExtNames',{id:this.state.id,extNames:extName},response => {
							ServiceTips({text:response.message,type:'success'})
							that.props.getDetailData();//更新父类，进行数据请求
						})
        			}
					if(data.id == "client-detail-shuixiang"){
                    	 //id = "client-detail-zhengshu"  表示是税项 此处id和传过去的id一样
                         apiForm(API_FOODING_DS,'/price/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.shuixiangInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }
				},
				close: () => {

				}
		   	});
        }else if(data.number == 3){
        	//失效功能没有做，留给后续开发
        	return false;
        }else{
        	let dialogTitle= data.action+data.name.title;
        	 this.setState({
        	 	visible:true,
                dialogTitle:dialogTitle,
                dilogTelmp:Template
        	});
        }
    }

    //常规和编辑的保存按钮
    onSaveAndClose(value,data){
    	if(data.title == "product-detail-normal"){
    		let a = [];
			value.pPStdId.map((e)=>{a.push(e.id)});
			delete value.pPStdId;
    		value = Object.assign({},data,value,{pPStdId:a,id:this.state.id});
    		apiPost(API_FOODING_DS,'/material/updateRoutine',value,(response) => {
                ServiceTips({text:response.message,type:'success'});
                this.props.getDetailData();//更新父类，进行数据请求
            },(error) => {
                ServiceTips({text:error.message,type:'error'});
            })
    	}else if(data.title == "orginzation"){
    		value = Object.assign({},data,value);
    		apiForm(API_FOODING_DS,'/material/updateParty',xt.formatFormData(value),(response) => {
                ServiceTips({text:response.message,type:'success'});
                this.props.getDetailData();//更新父类，进行数据请求
            },(error) => {
                ServiceTips({text:error.message,type:'error'});
            })
    	}else if(data.title == "product-detail-miaoshu"){
    		value = Object.assign({},data,value);
    		apiPost(API_FOODING_DS,'/material/updateRoutine',value,(response) => {

                ServiceTips({text:response.message,type:'success'});
                this.props.getDetailData();//更新父类，进行数据请求
            },(error) => {
                ServiceTips({text:error.message,type:'error'});
            })
    	}
        this.setState({visible:false});
    }
	onCancel(){
        this.setState({visible:false});
	}
    initState(){
        return {
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>,
            id:this.props.location.query.id

        }
	}


	//产品规格细分 新增和编辑保存
	onMtlQailtemSaveAndClose(value,data){
		value = Object.assign({},value,{mtlId:this.state.id,dataTyId:20})
		//data为空对象，表示是新增,否则表示是编辑
		if(JSON.stringify(data) !== "{}"){
			value = Object.assign({},value,{id:data.id,optlock:data.optlock,localName:data.qaItem.localName})
		}
		//apiPost 保存数据
		apiPost(API_FOODING_DS,'/mtlQaitem/save',value,response => {
			ServiceTips({text:response.message,type:'success'});
			//getPage 刷新单个模块数据
			this.initMtlQailtem();
		},error => {
			ServiceTips({text:error.message,type:'error'})
		})
		this.setState({visible:false});
	}
	onUpClick = (id,targetId,e) => {
		let that = this;
		if(id === targetId) return false;
		apiGet(API_FOODING_DS,"/mtlQaitem/move",{id:id,targetId:targetId,type:'before'},response => {
			that.initMtlQailtem();
		},error => ServiceTips({text:error.message,type:'error'}))
		e.stopPropagation() && e.preventDefault();
	}
	//产品规格细分 初始化数据
	initMtlQailtem = order => {
		this.columnSort = order = order || this.columnSort;
		let valueone = Object.assign({},{mtlId:this.state.id,dataTyId:20},order)
		apiGet(API_FOODING_DS,'/mtlQaitem/getPage',valueone,response => {
				this.setState({
					mtlQaitems:response.data.data
				})
			},error => {
				ServiceTips({text:error.message,type:'error'});
			})
	}

	//计量单位 新增和编辑保存
	onMeasumSaveAndClose(value,data){
		value = Object.assign({},value,{sourceId:this.state.id,dataTyId:20})
		//data为空对象，表示是新增,否则表示是编辑
		if(JSON.stringify(data) !== "{}"){
			value = Object.assign({},value,{id:data.id,optlock:data.optlock,rowSts:data.unitofmea.rowSts})
		}
		//apiPost 保存数据
		apiPost(API_FOODING_DS,'/measum/save',value,response => {
			//getPage 刷新单个模块数据
			ServiceTips({text:response.message,type:'success'})
			this.initMeasum();
		},error => {
			ServiceTips({text:error.message,type:'error'})
		})
		this.setState({visible:false});
	}
	//计量单位
	initMeasum = () => {
		apiGet(API_FOODING_DS,'/measum/getPage',{sourceId:this.state.id,dataTyId:20},response => {
			this.setState({
				measums:response.data.data
			})
		},error => {
			ServiceTips({text:error.message,type:'error'});
		})
	}

	//产品箱型装载数据 新增和编辑保存
	onContnrLoadingsSaveAndClose(value,data){
		value = Object.assign({},value,{sourceId:this.state.id,dataTyId:20})
		//data为空对象，表示是新增,否则表示是编辑
		if(JSON.stringify(data) !== "{}"){
			value = Object.assign({},value,{id:data.id,optlock:data.optlock})
		}
		//apiPost 保存数据
		apiPost(API_FOODING_DS,'/contnrLoading/save',value,response => {
			ServiceTips({text:response.message,type:'success'})
			//getPage 刷新单个模块数据
			this.initContnrLoadings();
		},error => {
			ServiceTips({text:error.message,type:'error'})
		})
		this.setState({visible:false});
	}

	//产品箱型装载数据 初始化数据
	initContnrLoadings = () => {
		apiGet(API_FOODING_DS,'/contnrLoading/getPage',{sourceId:this.state.id,dataTyId:20},response => {
			this.setState({
				contnrLoadings:response.data.data
			})
		},error => {
			ServiceTips({text:error.message,type:'error'});
		})
	}

	//产品包装 新增和编辑保存
	onPackSaveAndClose(value,data){
		value = Object.assign({},value,{sourceId:this.state.id,dataTyId:20})
		//data为空对象，表示是新增,否则表示是编辑
		if(JSON.stringify(data) !== "{}"){
			value = Object.assign({},value,{id:data.id,optlock:data.optlock,localName:data.packaging.localName})
		}
		//apiPost 保存数据
		apiPost(API_FOODING_DS,'/pack/save',value,response => {
			ServiceTips({text:response.message,type:'success'})
			//getPage 刷新单个模块数据
			this.initPackDate();
		},error => {
			ServiceTips({text:error.message,type:'error'})
		})
		this.setState({visible:false});
	}
	//产品包装 初始化数据
	initPackDate = () => {
		apiGet(API_FOODING_DS,'/pack/getPage',{sourceId:this.state.id,dataTyId:20},response => {
				this.setState({
					packs:response.data.data
				})
			},error => {
				ServiceTips({text:error.message,type:'error'})
			})
	}

	//产品别名
	onMaterialExtNamesSaveAndClose(value,data){
		let that = this;
		value = Object.assign({},value,{id:this.state.id,dataTyId:20})
		apiForm(API_FOODING_DS,'/material/saveExtNames',value,response => {
			ServiceTips({text:response.message,type:'success'})
			that.props.getDetailData();
		},error => {
			ServiceTips({text:error.message,type:'error'})
		})
		this.setState({visible:false});
	}
	//税项 保存并关闭
	shuixiangSaveAndClose = (value,data) => {
		    	 let that = this;
		        value = Object.assign({},{sourceId:this.state.id,dataTyId:20},value);
		        apiPost(API_FOODING_DS,'/price/save',value,(response) => {
		            ServiceTips({text:response.message,type:'success'});
		            that.shuixiangInitData();
		        },(error)=>{
		            ServiceTips({text:error.message,type:'error'});
		        })
		        this.setState({visible:false});
	}
	//税项 的数据拉取
	shuixiangInitData =() => {
		        let that = this;
		        apiGet(API_FOODING_DS,'/price/getPage', {sourceId:this.state.id,dataTyId:20}, response => {
		            that.setState({
		                shuixiang:response.data.data
		            })
		        }, error => console.log(error.message))
	}


	//删除函数 deleteFunc
	/**
		API_Fooding : 请求地址
		params : 请求路径
		value :　所传的参数
	*/
	deleteFunc = (API_Fooding,params,value,resolve,reject) => {
		let that = this;
		apiForm(API_Fooding,params,value,resolve,reject);
	}

	//保存函数 saveFunc
	/**
		API_Fooding : 请求地址
		params : 请求路径
		value :　所传的参数
	*/
	saveFunc = (API_FOODING,params,value) => {
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
	getPage = (API_FOODING,params,value,resolve,reject) =>{
		value = Object.assign({},value,{pageSize:100,currentPage:1,column:'id',order:'desc'})
		apiGet(API_FOODING,params,value,resolve,reject);
	}
	//变更记录
	onUpdateClick = (data,e) => {
        let content = require('../../../../Client/List/components/UpdateDialog').default;
        let element = React.createElement(content, {onCancel: this.onCancel,sourceId:data});
        this.setState({
            visible: true,
            dialogTitle: i18n.t(100428/*变更记录*/),
            dilogTelmp: element
        })
        e.stopPropagation();
    }
    getPages(){
        this.initMtlQailtem();
        this.initMeasum();
        this.initContnrLoadings();
        this.initPackDate();
        //this.initMaterialExtNames();
        this.shuixiangInitData();
	}
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize(30));
    }
    componentWillReceiveProps(nextProps){
    	this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }
    handleResize(height){
        let padding = 230;
        let sch=document.body.offsetHeight-height-padding;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }
	render(){
		const commonForm = this.state.dilogTelmp;
		//整个产品对象，通过ProductLayout类传过来
		let material = this.props.material || {};
		let materialExtname = (material.extNames || []).map( (e,idx) => ({id:idx,extName:e})) || [];
		let that = this;
		return (
			  <div>
	               <div className='scroll' style={{backgroundColor:'#f0f4f8',
	               height:this.state.scrollHeight,overflowX:'hidden'}}>
		               <div className = 'col'>
		               	<Template1
							menuList={[
								{permissions:'mtl.edit',type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
							]}
							Zindex={9} onCancel ={this.onCancel}
		            		DialogTempalte={require('./Normal').default}
		               		width={107}
		               		isShowMenu={true}
		               		openDialog={this.handleClick}
		               		onSaveAndClose={this.onSaveAndClose}
		               		upload={this.props.getDetailData}
		               		AjaxInit={true}
                            API_FOODING={API_FOODING_DS}
                            portname={'/material/getOne'}
                            params={{id:this.state.id}}
		                    id={'product-detail-1'}
		                    title={i18n.t(100138/*常规*/)}
		                    tempArray={[{key:i18n.t(100412/*基本型号*/),value:material.basModel || ""},
		                    {key:i18n.t(100226/*英文名称*/),value:material.enName},
		                    {key:"CAS Number",value:material.casNumber},
		                    {key:"E Number",value:material.eNumber},
		                    {key:"UN Number",value:material.unNumber},
		                    {key:"EC Number",value:material.ecNumber},
		                    {key:"CNS",value:material.cns},
		                    {key:"INS",value:material.ins},
		                    {key:i18n.t(100413/*申报要素*/),value:material.rptMtl},
		                    {key:i18n.t(100386/*生产标准*/),value:material.pPStd},
		                    {key:i18n.t(100414/*生产工艺*/),value:material.pProces},
		                    {key:i18n.t(100415/*商检*/),value:material.inspcMark?i18n.t(100141/*是*/):i18n.t(100142/*否*/)},
		                    {key:i18n.t(100384/*产品等级*/),value:material.dataDiv},
		                    {key:i18n.t(100416/*自产*/),value:material.selfProduced?i18n.t(100141/*是*/):i18n.t(100142/*否*/)},
		                    {key:i18n.t(100417/*采购*/),value:material.forPurchase?i18n.t(100141/*是*/):i18n.t(100142/*否*/)},
		                    {key:i18n.t(100418/*销售*/),value:material.forSale?i18n.t(100141/*是*/):i18n.t(100142/*否*/)},
		                    {key:i18n.t(100419/*默认箱型*/),value:material.contnrType},
		                    {key:i18n.t(100420/*利润率%*/),value:material.profit}
		                    ]}
		                />
		                <Measurement
							onCancel ={this.onCancel} title ={i18n.t(100589/*计量单位*/)}
		                    Zindex={8}
		                    openDialog={this.handleClick}
		                    id={'22'}
		                    showHeader ={true}
		                    onSaveAndClose={this.onMeasumSaveAndClose}
		                     AjaxInit={true}
                             API_FOODING={API_FOODING_DS}
                             portname={'/measum/getOne'}
							 addNoInit={true}
                             params={{}}
							 menuList={material.isPlatform?[]:[{type:'add',permissions:'mtl.dtl.add'},
                                 {type:'delete',permissions:'mtl.dtl.del'},
                                 {type:'edit',permissions:'mtl.edit'}]}
		                     columns ={
		                    	[{
									title : i18n.t(100589/*计量单位*/),
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
									title : i18n.t(100591/*基础计量*/),
									dataIndex : "basMrk",
									key : "basMrk",
									width : "25%",
									render(data,row,index){
										//return data?i18n.t(100141/*是*/):i18n.t(100142/*否*/);
										return (<i style = {{display: 'inline-block',textAlign: 'center'}} className={data?'foddingicon fooding-dui-icon2':''}></i>)
									}
								},{
									title : i18n.t(100592/*采购计量*/),
									dataIndex : "purMrk",
									key : "purMrk",
									width : "18%",
									render(data,row,index){
										//return data?i18n.t(100141/*是*/):i18n.t(100142/*否*/);
										return (<i style = {{display: 'inline-block',textAlign: 'center'}} className={data?'foddingicon fooding-dui-icon2':''}></i>)
									}
								},{
									title : i18n.t(100593/*销售计量*/),
									dataIndex : "salMrk",
									key : "salMrk",
									width : "18%",
									render(data,row,index){
                                        return (<i style = {{display: 'inline-block',textAlign: 'center'}} className={data?'foddingicon fooding-dui-icon2':''}></i>)
									}
								},{
									title : i18n.t(100594/*基础单位数量*/),
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
								{type:'add',permissions:'mtl.dtl.add'},
								{type:'delete',permissions:'mtl.dtl.del'},
								{type:'edit',permissions:'mtl.edit'}
							]}
							onCancel ={this.onCancel} title ={i18n.t(100595/*箱型装载数据*/)} openDialog={this.handleClick}
		                     Zindex={7}
		                     id={'23'}
		                     showHeader ={true}
		                     onSaveAndClose={this.onContnrLoadingsSaveAndClose}
		                     AjaxInit={true}
							 addNoInit={true}
                             API_FOODING={API_FOODING_DS}
                             portname={'/contnrLoading/getOne'}
                             params={{dataTyId:20,sourceId:this.state.id}}
                             otherData={{sourceId:this.state.id}}
			                 columns ={
			                    	[{
										title : i18n.t(100596/*包装名称*/),
										dataIndex : 'packaging',
										key : "packaging",
										width : '35%',
										render(data,row,index){
											data = data !== null?data:"";
											if(data && ('localName' in data)){
												return data.localName
											}
											return data;
										}
									},{
										title : i18n.t(100214/*箱型*/),
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
										title : i18n.t(100595/*箱型装载数据*/),
										dataIndex : "mtlContNum",
										key : "mtlContNum",
										width : "12.5%",
										render(data,row,index){
											return data;
										}
									},{
										title : i18n.t(100589/*计量单位*/),
										dataIndex : "unitofmea",
										key : "unitofmea",
										width : "12.5%",
										render(data,row,index){
											data = data !== null?data:"";
											if(data && ('localName' in data)){
												return data.localName
											}
											return data;
										}
									},{
										title : i18n.t(100124/*托盘类型*/),
										dataIndex : 'salvrType',
										key : "salvrType",
										width : "12.5%",
										render(data,row ,index){
											data = data !== null?data:"";
											if(data && ('localName' in data)){
												return data.localName
											}
											return data;
										}
									},{
										title : i18n.t(100600/*每托盘件数*/),
										dataIndex : 'salvrIdNum',
										key : "salvrIdNum",
										width : "12.5%",
										render(data,row ,index){
											return data;
										}
									}]
			                 }
			                 data={this.state.contnrLoadings}
		                />
		                <Template1
								menuList={[
									{permissions:'mtl.edit',type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
								]}
								onCancel ={this.onCancel} isShowMenu={true} Zindex={6}
                                openDialog={this.handleClick}  id={'product'}
                                DialogTempalte ={require('../../../../Client/Detail/Content/components/OrigizationDialogp').default}
                                allData={{key:'material'}}
                                AjaxInit={true}
                                API_FOODING={API_FOODING_DS}
                                portname={'/material/getOne'}
                                params={{id:this.state.id}}
                                title={i18n.t(100140/*组织*/)}  onSaveAndClose={this.onSaveAndClose}
                                tempArray={[{key:i18n.t(100243/*集团*/),value:material.cluster},
                                {key:i18n.t(100486/*公司*/),value:material.company},
                                {key:i18n.t(100361/*分管人*/),value:material.staffs?(<b><i className={'foddingicon fooding-approve'} title={i18n.t(100428/*变更记录*/)} onClick={this.onUpdateClick.bind(this,this.state.id)} style={{marginRight:'5px'}}></i>{String(material.staffs)}</b>):""}]}
                        />
		                <Template1 title={i18n.t(100194/*系统信息*/)} id ={'31'} isShowIcon={false} Zindex={5}
		                    tempArray={[{key:i18n.t(100194/*系统信息*/),value:material.createUserName},{key:i18n.t(100144/*修改人*/),value:material.updateUserName},
		                    {key:i18n.t(100145/*创建时间*/),value:new Date(material.createDate).Format('yyyy-MM-dd')},{key:i18n.t(100146/*修改时间*/),value:new Date(material.updateDate).Format('yyyy-MM-dd')}]}
		                />
		               </div>
		               <div className = 'col' style={{paddingLeft:0}}>
		               		<Measurement
							   	onCancel ={this.onCancel} title ={i18n.t(100601/*产品规格细分*/)} openDialog={this.handleClick}
			               		Zindex={4}
			                    id={'24'}
			                    showHeader ={true}
			                    onSaveAndClose={this.onMtlQailtemSaveAndClose}
								onHeaderSortClick={this.initMtlQailtem}
			                    AjaxInit={true}
								addNoInit={true}
	                            API_FOODING={API_FOODING_DS}
	                            portname={'/mtlQaitem/getOne'}
	                            params={{dataTyId:20}}
								menuList={material.isPlatform?[]:[{type:'add',permissions:'mtl.dtl.add'},
                                    {type:'delete',permissions:'mtl.dtl.del'},
                                    {type:'edit',permissions:'mtl.edit'}]}
			                    columns ={
			                    	[{
										title : i18n.t(100602/*主要*/),
										dataIndex : 'majMrk',
										key : "majMrk",
										width : '12.5%',
										render(data,row,index){
											return (<i style = {{display: 'inline-block',textAlign: 'center'}} className={data?'foddingicon fooding-dui-icon2':''}></i>)
										}
									},{
										title : i18n.t(100001/*名称*/),
										dataIndex : "qaItem",
										key : "qaItem",
										width : "30%",
										className:'text-right',
										render(data,row,index){
											data = data !== null?data:"";
											if(data && ('localName' in data)){
												return <div className={'text-ellipsis'} title={data.localName}>{data.localName}</div>;
											}
											return <div className={'text-ellipsis'} title={data}>{data}</div>;
										}
									},{
										title : "",
										dataIndex : "calSymBol",
										key : "calSymBol",
										width : "5%",
										className:'text-right',
										render(data,row,index){
											data = data !== null?data:"";
											if(data && ('name' in data)){
												return data.name;
											}
											return data;
										}
									},{
										title : i18n.t(100605/*指标*/),
										dataIndex : "maxQaValue",
										key : "maxQaValue",
										width : "12.5%",
										className:'text-left',
										render(data,row,index){
											return (<div>{data}</div>)
										}
									},{
										title : i18n.t(100606/*测试方法*/),
										dataIndex : 'testMeth',
										key : "testMeth",
										width : "20%",
										render(data,row ,index){
											data = data !== null?data:"";
											if(data && ('localName' in data)){
												return data.localName;
											}
											return data;
										}
									},{
										title : "",
										dataIndex : '',
										key : "",
										width : "5%",
										render(data,row ,index){
											let mtlArr = that.state.mtlQaitems;
											let idx = mtlArr.findIndex(e => e.id == row.id);
											let newIdx = idx - 1;
											if(newIdx < 0){
												newIdx = 0;
											}
											let targetId = mtlArr.filter((e,i) => i == newIdx )[0].id;
											return (<i className={'foddingicon fooding-boult_icon'} style={{transform:'rotate(180deg)',transformOrigin:"50% 50%",display:"inline-block",cursor:"default"}} onClick={that.onUpClick.bind(that,row.id,targetId)}></i>)
										}
									}]
			                    }
		                    	data={this.state.mtlQaitems}
		                    />
		                    <Measurement
								menuList={[
									{type:'add',permissions:'mtl.dtl.add'},
									{type:'delete',permissions:'mtl.dtl.del'},
									{type:'edit',permissions:'mtl.edit'}
								]}
							 	onCancel ={this.onCancel} title ={i18n.t(100550/*产品包装*/)} openDialog={this.handleClick}
		                     	Zindex={3}
			                    id={'25'}
			                    DialogTempalte ={require('./ProPackDialog').default}
			                    showHeader ={true}
			                    onSaveAndClose={this.onPackSaveAndClose}
			                    AjaxInit={true}
	                            API_FOODING={API_FOODING_DS}
	                            portname={'/pack/getInit'}
	                            params={{}}
			                    columns ={
			                    	[{
										title : i18n.t(100596/*包装名称*/),
										dataIndex : 'packaging',
										key : "packaging",
										width : '25%',
										render(data,row,index){
											data = data !== null?data:"";
											if(data && ('localName' in data)){
												return (<div className={'text-ellipsis'} title={data.localName}>{data.localName}</div>)
											}
											return data;
										}
									},{
										title : i18n.t(100551/*净重量*/),
										dataIndex : "netWtNum",
										key : "netWtNum",
										width : "15%",
										render(data,row,index){
											return (<div>{data?(data+' '+row.weight.name):''}</div>)
										}
									},{
										title : i18n.t(100553/*毛重量*/),
										dataIndex : "grosWtNum",
										key : "grosWtNum",
										width : "15%",
										render(data,row,index){
											return (<div>{data?(data+' '+row.weight.name):''}</div>)
										}
									},{
										title : i18n.t(100223/*体积量*/),
										dataIndex : 'volNum',
										key : "volNum",
										width : "20%",
										render(data,row ,index){
											return (<div>{data?(data+' '+row.volume.name):''}</div>)
										}
									},{
										title : i18n.t(100557/*基础包装*/),
										dataIndex : 'basPackMrk',
										key : "basPackMrk",
										width : "18%",
										render(data,row ,index){
											return (<i style = {{display: 'inline-block',textAlign: 'center'}} className={data?'foddingicon fooding-dui-icon2':''}></i>)
										}
									}]
			                    }
			                    data={this.state.packs}
		                    />
		                    <Measurement
								menuList={material.isPlatform?[]:[{type:'add',permissions:'mtl.dtl.add'},
                                    {type:'delete',permissions:'mtl.dtl.del'},
                                    {type:'edit',permissions:'mtl.edit'}]}
								onCancel ={this.onCancel} title ={i18n.t(100494/*产品别名*/)} openDialog={this.handleClick}
			                    Zindex={2}
			                    id={'26'}
			                    showHeader ={false}
			                    onSaveAndClose={this.onMaterialExtNamesSaveAndClose}
			                    columns ={
			                    	[{
										title : i18n.t(100494/*产品别名*/),
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
							<Measurement
	                            menuList={[
										{type:'add',permissions:'mtl.dtl.add'},
										{type:'delete',permissions:'mtl.dtl.del'},
										{type:'edit',permissions:'mtl.edit'}
								]}
								title={i18n.t(200877/*税项*/)}
								Zindex ={1}
								openDialog={this.handleClick}
								DialogTempalte ={require('../../../Traderules/Detail/components/TraderulesDetailDialog').default}
								showHeader ={true}
								checkedRowsArray={[]}
								getSelectArr={[]}
								onSaveAndClose={this.shuixiangSaveAndClose}
								onCancel={this.onCancel}
								AjaxInit={true}
								API_FOODING={API_FOODING_DS}
								portname={'/price/getInit'}
								id={'client-detail-shuixiang'}
								params={{}}
								columns ={
									[{
										title : i18n.t(200878/*税类别*/),
										dataIndex : 'taxType',
										key : "taxType",
										width:'10%',
										render(data,row,index){
											return <div>{data?data.localName:''}</div>
										}
									},{
										title : i18n.t(200879/*税小类*/),
										dataIndex : 'taxSubType',
										key : "taxSubType",
										width:'10%',
										render(data,row,index){
											return <div>{data?data.localName:''}</div>;
										}
									},{
										title : i18n.t(200080/*类型*/),
										dataIndex : 'priceType',
										key : "priceType",
										width:'10%',
										render(data,row,index){
											return <div>{data?data.name:''}</div>;
										}
									},{
										title : i18n.t(200880/*税率*/),
										dataIndex : 'taxRate',
										key : "taxRate",
										width:'20%',
										render(data,row,index){
											return data;
										}
									},{
										title : i18n.t(200246/*金额*/),
										dataIndex : 'sum',
										key : "sum",
										width:'20%',
										render(data,row,index){
											return data;
										}
									},{
										title : i18n.t(100284/*币种*/),
										dataIndex : 'curren',
										key : "curren",
										width:'10%',
										render(data,row,index){
											return <div>{data?data.localName:''}</div>;
										}
									},{
										title : i18n.t(100169/*单位*/),
										dataIndex : 'unitofmea',
										key : "unitofmea",
										width:'10%',
										render(data,row,index){
											return <div>{data?data.localName:''}</div>
										}
									}]

								}
								data={this.state.shuixiang || []}
							/>
							<Template2
								menuList={[
									{permissions:'mtl.edit',type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
								]}
								Zindex={0}
			            		DialogTempalte={require('./Miaoshu').default}
			               		width={107}
			               		isShowMenu={true}
			               		openDialog={this.handleClick}
			               		onSaveAndClose={this.onSaveAndClose}
			               		onCancel ={this.onCancel}
			               		upload={this.props.getDetailData}
			               		AjaxInit={true}
	                            API_FOODING={API_FOODING_DS}
	                            portname={'/material/getOne'}
	                            params={{id:this.state.id}}
			                    id={'product-detail-1'}
			                    title={i18n.t(400193/*产品描述*/)}
			                    tempArray={[{key:'',value:material.description || ""}
			                   ]}
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
export default ProductDetail;
