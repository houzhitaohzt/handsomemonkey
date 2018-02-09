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

import {I18n} from '../../../../../lib/i18n';
import MtlqaitemsDOM from "../../../../Product/Detail/Content/components/Mtlqaitems";

export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        props.detail && props.detail(this);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        this.initMeasum();
        this.initContnrLoadings();
        this.initPackDate();
	}
    handleClick = (e, data, Template) => {
    	let that = this;
        if(data.number ==2){
        	let id = [],tempString = I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
            id = (data && data.record)? [data.record.id]:data.selectArr.map((o) => o.id);
            if(!(data && data.record || data.selectArr.length == 1)){
                tempString = I18n.t(100395/*已选中*/) + data.selectArr.length + I18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
            }
            Confirm(tempString, {
				done: () => {
					if(data.id == 22){
						apiForm(API_FOODING_DS,'/measum/delete',{id:id},response => {
							ServiceTips({text:response.message,type:'success'})
							that.initMeasum();
						})
        			}
        			if(data.id == 23){
						apiForm(API_FOODING_DS,'/contnrLoading/delete',{id:id},response => {
							ServiceTips({text:response.message,type:'success'})
							that.initContnrLoadings()
						})
        			}
					if(data.id == 24){
						apiForm(API_FOODING_DS,'/mtlQaitem/delete',{id:id},response => {
							ServiceTips({text:response.message,type:'success'})
							that.initMtlQailtem()
						})
        			}
        			if(data.id == 25){
						apiForm(API_FOODING_DS,'/pack/delete',{id:id},response => {
							ServiceTips({text:response.message,type:'success'})
							that.initPackDate();
						})
        			}
        			if(data.id == 26){//产品别名删除时,不要id,因此id没有作用
						let extName = (data && data.record)? [data.record.extName]:data.selectArr.map((o) => o.extName);
						apiForm(API_FOODING_DS,'/platformMaterial/deleteExtNames',{id:this.state.id,extNames:extName},response => {
							ServiceTips({text:response.message,type:'success'})
							that.props.getDetailData();//更新父类，进行数据请求
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

    // 常规和编辑的保存按钮
    onSaveAndClose = (value,data) => {
    	if(data.title == "product-detail-normal"){
    		let a = [];
			value.pPStdId.map((e)=>{a.push(e.id)});
			delete value.pPStdId;
    		value = Object.assign({},data,value,{pPStdId:a,id:this.state.id});
    		apiPost(API_FOODING_DS,'/platformMaterial/updateRoutine',value,(response) => {
                ServiceTips({text:response.message,type:'success'});
                this.props.getDetailData();//更新父类，进行数据请求
            },(error) => {
                ServiceTips({text:error.message,type:'error'});
            })
    	}else if(data.title == "orginzation"){
    		value = Object.assign({},data,{id:this.state.id,optlock:data.optlock});
    		apiForm(API_FOODING_DS,'/material/updateParty',xt.formatFormData(value),(response) => {
                ServiceTips({text:response.message,type:'success'});
                this.props.getDetailData();//更新父类，进行数据请求
            },(error) => {
                ServiceTips({text:error.message,type:'error'});
            })
    	}else if(data.title == "product-detail-miaoshu"){
    		value = Object.assign({},data,value);
    		apiPost(API_FOODING_DS,'/platformMaterial/updateRoutine',value,(response) => {
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

	changguigetOne(){

	}
	//产品规格细分 新增和编辑保存
	onMtlQailtemSaveAndClose = (value,data) => {
		value = Object.assign({},value,{mtlId:this.state.id,dataTyId:25})
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

	//产品规格细分 初始化数据
	initMtlQailtem = () => {
		apiGet(API_FOODING_DS,'/mtlQaitem/getPage',{mtlId:this.state.id,dataTyId:25},
            response => {
                let mtlQaitems = response.data.data || [];
                let specTxt = '';
                mtlQaitems.forEach(da => {
                    if(da.majMrk){
                        if( specTxt) specTxt += ";";
                        specTxt += da.qaItem&&da.qaItem.localName?da.qaItem.localName:"" + da.calSymBol&&da.calSymBol.name?da.calSymBol.name:"" + da.maxQaValue;
                    }
                });
                this.setState({mtlQaitems}, ()=>{
                    this.props.setGeOne( Object.assign({}, this.props.material, {specTxt:specTxt}));
                });
			},error => {
				ServiceTips({text:error.message,type:'error'});
			})
	}

	//计量单位 新增和编辑保存
	onMeasumSaveAndClose = (value,data) => {
		value = Object.assign({},value,{sourceId:this.state.id,dataTyId:25})
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
		apiGet(API_FOODING_DS,'/measum/getPage',{sourceId:this.state.id,dataTyId:25},response => {
			this.setState({
				measums:response.data.data
			})
		},error => {
			ServiceTips({text:error.message,type:'error'});
		})
	}

	//产品箱型装载数据 新增和编辑保存
	onContnrLoadingsSaveAndClose = (value,data) => {
		value = Object.assign({},value,{sourceId:this.state.id,dataTyId:25})
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
		apiGet(API_FOODING_DS,'/contnrLoading/getPage',{sourceId:this.state.id,dataTyId:25},response => {
			this.setState({
				contnrLoadings:response.data.data
			})
		},error => {
			ServiceTips({text:error.message,type:'error'});
		})
	}

	//产品包装 新增和编辑保存
	onPackSaveAndClose = (value,data) => {
		value = Object.assign({},value,{sourceId:this.state.id,dataTyId:25})
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
		apiGet(API_FOODING_DS,'/pack/getPage',{sourceId:this.state.id,dataTyId:25},response => {
				this.setState({
					packs:response.data.data
				})
			},error => {
				ServiceTips({text:error.message,type:'error'})
			})
	}

	//产品别名
	onMaterialExtNamesSaveAndClose = (value,data) => {
		let that = this;
		value = Object.assign({},value,{id:this.state.id,dataTyId:25})
		//apiPost 保存数据
		apiForm(API_FOODING_DS,'/platformMaterial/saveExtNames',value,response => {	
			ServiceTips({text:response.message,type:'success'})
			that.props.getDetailData();
		},error => {
			ServiceTips({text:error.message,type:'error'})
		})
		this.setState({visible:false});
	}

	//产品别名初始化数据
	initMaterialExtNames = () =>{
		apiGet(API_FOODING_DS,'/materialExtName/getPage',{mtlId:this.state.id,dataTyId:25,currentPage:1,pageSize:500},response => {
				this.setState({
					materialExtNames:response.data.data
				})
			},error => {
				ServiceTips({text:error.message,type:'error'});
			})
	}
    componentDidMount(){
    	//this.initMtlQailtem();
    	//this.initMaterialExtNames();
		if(!this.props.isDetail){
			this.getPage();
		}
        this.handleResize();
        window.addEventListener('resize', this.handleResize(30));
    }
    componentWillReceiveProps(nextProps){
    	this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));  
    }
    handleResize(height){
        let padding = 262;
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
		return (
			  <div> 
	               <div className='scroll' style={{backgroundColor:'#f0f4f8',
	               height:this.state.scrollHeight,overflow:'auto'}}>             
		               <div className = 'col'>
		               		<Template1 
							menuList={[
								{permissions:'platform.mtl.edit',type:I18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{I18n.t(100439/*编辑*/)}</div>}
							]}							   
							Zindex={6} onCancel ={this.onCancel}
		            		DialogTempalte={require('./Normal').default}
		               		width={107}
		               		upload={this.props.getDetailData}
		               		isShowMenu={true} 
		               		openDialog={this.handleClick}
		               		onSaveAndClose={this.onSaveAndClose}
		               		AjaxInit={true}
                            API_FOODING={API_FOODING_DS}
                            portname={'/platformMaterial/getOne'}
                            params={{id:this.state.id}}
		                    id={'product-detail-1'} 
		                    title={I18n.t(100138/*常规*/)} 
		                    tempArray={[
                                {key:'CAS Number',value:material.casNumber},
		                        {key:'E Number',value: material.eNumber},
                                {key:'UN Number',value:material.unNumber},
                                {key:'EC Number',value:material.ecNumber},
                                {key:'CNS',value:material.cns},
                                {key:'INS',value:material.ins},
                                {key:I18n.t(100413/*申报要素*/),value:material.rptMtl},
                                {key:'',value:''},
                                {key:I18n.t(100386/*生产标准*/),value:material.pPStd},
                                {key:'',value:''},
                                {key:I18n.t(100414/*生产工艺*/),value:material.pProces}
		                    ]} />

		                    <Measurement 
								menuList={[
									{type:'add',permissions:'platform.mtl.dtl.add'},
									{type:'delete',permissions:'platform.mtl.dtl.del'},
									{type:'edit',permissions:'platform.mtl.edit'}                      
								]}							
								onCancel ={this.onCancel} title ={I18n.t(100589/*计量单位*/)}
		                    Zindex={5}
		                    openDialog={this.handleClick}
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
									title :I18n.t(100592/*采购计量*/),
									dataIndex : "purMrk",
									key : "purMrk",
									width : "18%",
									render(data,row,index){
										//return data?I18n.t(100141/*是*/):I18n.t(100142/*否*/);
										return (<i style = {{display: 'inline-block',textAlign: 'center'}} className={data?'foddingicon fooding-dui-icon2':''}></i>)
									}
								},{
									title : I18n.t(100593/*销售计量*/),
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
									{type:'add',permissions:'platform.mtl.dtl.add'},
									{type:'delete',permissions:'platform.mtl.dtl.del'},
									{type:'edit',permissions:'platform.mtl.edit'}                                        
								]}								
								onCancel ={this.onCancel} title ={I18n.t(100595/*箱型装载数据*/)} openDialog={this.handleClick}
		                    Zindex={4}
		                     id={'23'}
		                     showHeader ={true}
		                     onSaveAndClose={this.onContnrLoadingsSaveAndClose}
		                     AjaxInit={true}
							 addNoInit={true}
                             API_FOODING={API_FOODING_DS}
                             portname={'/contnrLoading/getOne'}
                             params={{dataTyId:25,sourceId:this.state.id}}
                             otherData={{sourceId:this.state.id}}
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
									title : I18n.t(100589/*计量单位*/),
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
		                    <Template1 title={I18n.t(100194/*系统信息*/)} id ={'31'}
							isShowIcon={false}
		                    tempArray={[{key:I18n.t(100143/*创建人*/),value:material.createUserName},{key:I18n.t(100144/*修改人*/),value:material.updateUserName},
		                    {key:I18n.t(100145/*创建时间*/),value:new Date(material.createDate).Format('yyyy-MM-dd hh:mm:ss')},{key:I18n.t(100146/*修改时间*/),value:new Date(material.updateDate).Format('yyyy-MM-dd hh:mm:ss')}]}/>
		               </div>
		               <div className = 'col' style={{paddingLeft:0}}> 
						<MtlqaitemsDOM id={this.state.id}  menuObj={
									{permissionsAdd:'platform.mtl.dtl.add',permissionsDelete:'platform.mtl.dtl.del',permissionsEdit:'platform.mtl.edit'}                             
								}	
								dataTyId={25}	
								initMtlQailtem={this.initMtlQailtem}
							/>		               		
		                     <Measurement 
								menuList={[
									{type:'add',permissions:'platform.mtl.dtl.add'},
									{type:'delete',permissions:'platform.mtl.dtl.del'},
									{type:'edit',permissions:'platform.mtl.edit'}                                        
								]}							 
							 	onCancel ={this.onCancel} title ={I18n.t(100550/*产品包装*/)} openDialog={this.handleClick}
		                     	Zindex={2}
			                     id={'25'}
			                     showHeader ={true}
			                     DialogTempalte ={require('../../../../Product/Detail/Content/components/ProPackDialog').default}
			                     onSaveAndClose={this.onPackSaveAndClose}
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
												return (<div className={'text-ellipsis'}>{data.localName}</div>)
											}
											return data;
										}
									},{
										title : I18n.t(100551/*净重量*/),
										dataIndex : "netWtNum",
										key : "netWtNum",
										width : "15%",
										render(data,row,index){
											
											return (<div>{data?(data+' '+row.weight.name):''}</div>)
										}
									},{
										title : I18n.t(100553/*毛重量*/),
										dataIndex : "grosWtNum",
										key : "grosWtNum",
										width : "15%",
										render(data,row,index){
											return (<div>{data?(data+' '+row.weight.name):''}</div>)
										}
									},{
										title : I18n.t(100223/*体积量*/),
										dataIndex : 'volNum',
										key : "volNum",
										width : "20%",
										render(data,row ,index){
											return (<div>{data?(data+' '+row.volume.name):''}</div>)
										}
									},{
										title : I18n.t(100557/*基础包装*/),
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
								menuList={[
									{type:'add',permissions:'platform.mtl.dtl.add'},
									{type:'delete',permissions:'platform.mtl.dtl.del'},
									{type:'edit',permissions:'platform.mtl.edit'}                                        
								]}							 
							 	onCancel ={this.onCancel} title ={I18n.t(100494/*产品别名*/)} openDialog={this.handleClick}
		                     Zindex={1}
		                     id={'26'}
		                     showHeader ={false}
		                     onSaveAndClose={this.onMaterialExtNamesSaveAndClose}
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
		                    <Template2
								menuList={[
									{permissions:'mtl.edit',type:I18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{I18n.t(100439/*编辑*/)}</div>}
								]}
								Zindex={8} onCancel ={this.onCancel}
			            		DialogTempalte={require('../../../../Product/Detail/Content/components/Miaoshu').default}
			               		width={107}
			               		isShowMenu={true}
			               		openDialog={this.handleClick}
			               		onSaveAndClose={this.onSaveAndClose}
			               		upload={this.props.getDetailData}
			               		AjaxInit={true}
	                            API_FOODING={API_FOODING_DS}
	                           portname={'/platformMaterial/getOne'}
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


// <Measurement 
// 	menuList={[
// 		{type:'add',permissions:'platform.mtl.dtl.add'},
// 		{type:'delete',permissions:'platform.mtl.dtl.del'},
// 		{type:'edit',permissions:'platform.mtl.edit'}                                        
// 	]}							   
// 	onCancel ={this.onCancel} title ={I18n.t(100601/*产品规格细分*/)} openDialog={this.handleClick}
// 	Zindex={3}
// 	id={'24'}
// 	showHeader ={true}
// 	onSaveAndClose={this.onMtlQailtemSaveAndClose}
// 	AjaxInit={true}
// 	API_FOODING={API_FOODING_DS}
// 	portname={'/mtlQaitem/getInit'}
// 	params={{dataTyId:25}}
// 	columns ={
// 	[{
// 		title : I18n.t(100602/*主要*/),
// 		dataIndex : 'majMrk',
// 		key : "majMrk",
// 		width : '12.5%',
// 		render(data,row,index){
// 			return data?I18n.t(100141/*是*/):I18n.t(100142/*否*/);
// 		}
// 	},{
// 		title : I18n.t(100001/*名称*/),
// 		dataIndex : "qaItem",
// 		key : "qaItem",
// 		width : "30%",
// 		render(data,row,index){
// 			data = data !== null?data:"";
// 			if(data && ('localName' in data)){
// 				return <div className={'text-ellipsis'} title={data.localName}>{data.localName}</div>;
// 			}
// 			return <div className={'text-ellipsis'} title={data}>{data}</div>;
// 		}
// 	},{
// 		title : I18n.t(100604/*符号*/),
// 		dataIndex : "calSymBol",
// 		key : "calSymBol",
// 		width : "11.5%",
// 		render(data,row,index){
// 			data = data !== null?data:"";
// 			if(data && data.name){
// 				return data.name;
// 			}
// 			return data;
// 		}
// 	},{
// 		title : I18n.t(100605/*指标*/),
// 		dataIndex : "maxQaValue",
// 		key : "maxQaValue",
// 		width : "12.5%",
// 		render(data,row,index){
// 			return (<div>{data}</div>)
// 		}
// 	},{
// 		title : I18n.t(100606/*测试方法*/),
// 		dataIndex : 'testMeth',
// 		key : "testMeth",
// 		width : "20%",
// 		render(data,row ,index){
// 			data = data !== null?data:"";
// 			if(data && ('localName' in data)){
// 				return data.localName;
// 			}
// 			return data;
// 		}
// 	}]
// 	}
// 	data={this.state.mtlQaitems}
// />
