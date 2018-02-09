import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import Dialog  from '../../../../../components/Dialog';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import Confirm from '../../../../../components/Dialog/Confirm';
import shallowequal from 'shallowequal';
import '../../../../../components/RuleTemplate/assets/_productDetail.less';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        props.product && props.product(this);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.getDetailData=this.getDetailData.bind(this);
		 //产品包装 保存并关闭
        this.baozhuangSaveAndClose=this.baozhuangSaveAndClose.bind(this);
        this.baozhuangInitData=this.baozhuangInitData.bind(this);
        //箱型装载数据 
         this.zhuangzaiSaveAndClose=this.zhuangzaiSaveAndClose.bind(this);
        this.zhuangzaiInitData=this.zhuangzaiInitData.bind(this);
        //包装计费
         this.jifeiSaveAndClose=this.jifeiSaveAndClose.bind(this);
        this.jifeiInitData=this.jifeiInitData.bind(this);
        //品牌
         this.pinpaiSaveAndClose=this.pinpaiSaveAndClose.bind(this);
        this.pinpaiInitData=this.pinpaiInitData.bind(this);
		this.state = {
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>,
            id:this.props.location.query.id, //列表頁传过来的id
            sourceId:this.props.location.query.sourceId,
            ids:this.props.location.query.ids,
            baozhuang: [], //包装
            zhuangzai: [], //装载
            jifei:[], //包装计费
            pinpai:[], //包装计费
            data:{}
        }
        this.getPages = this.getPages.bind(this);
    }
    getPages(){
		let that = this;
        this.getDetailData();
        this.baozhuangInitData();
        this.zhuangzaiInitData();
        this.jifeiInitData();
        this.pinpaiInitData();
	}
    handleClick = (e, data, Template) => {
        let that = this;
        if(data.number== 2){
        	let id = [],tempString = i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
            id = (data && data.record)? [data.record.id]:data.selectArr.map((o) => o.id);
            if(!(data && data.record || data.selectArr.length == 1)){
                tempString = i18n.t(100395/*已选中*/) + data.selectArr.length + i18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
            }
             Confirm(tempString, {
                  done: () => {
                    if(data.id == "client-detail-baozhuang"){//包装
                        apiForm(API_FOODING_DS,'/pack/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.baozhuangInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-zhuangzai"){ //装载
                    	apiForm(API_FOODING_DS,'/contnrLoading/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.zhuangzaiInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-jifei"){ //包装计费
                    	 apiForm(API_FOODING_DS,'/wrapgPrice/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.jifeiInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }else if(data.id == "client-detail-pinpai"){ //原产地
                    	 apiForm(API_FOODING_DS,'/manufty/delete',{id:id},response => {
                            ServiceTips({text:response.message,type:'success'});
                            that.pinpaiInitData();
                        },(error) => {
                            ServiceTips({text:error.message,type:'error'});
                        })
                    }
   				}
   			})
        }else if(data.number == 3){//失效
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
     //产品包装 保存并关闭
     baozhuangSaveAndClose(value,data){
     	 let that = this;
        value = Object.assign({},{sourceId:this.state.id,dataTyId:70},value);
        apiPost(API_FOODING_DS,'/pack/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.baozhuangInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
     }
     //产品包装 数据拉取
    baozhuangInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/pack/getPage', {sourceId:this.state.id,dataTyId:70}, response => {
            that.setState({
                baozhuang:response.data.data
            })
        }, error => console.log(error.message))
    }
    //装载 保存并关闭
    zhuangzaiSaveAndClose(value,data){
     	 let that = this;
        value = Object.assign({},{sourceId:this.state.id,dataTyId:70},value);
        apiPost(API_FOODING_DS,'/contnrLoading/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.zhuangzaiInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
     }
     //装载 数据拉取
     zhuangzaiInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/contnrLoading/getPage', {sourceId:this.state.id,dataTyId:70}, response => {
            that.setState({
                zhuangzai:response.data.data
            })
        }, error => console.log(error.message))
    }
    //包装计费 保存并关闭
    jifeiSaveAndClose(value,data){
    	
     	 let that = this;
        value = Object.assign({},{sourceId:this.state.id,dataTyId:70},value);
        apiPost(API_FOODING_DS,'/wrapgPrice/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.jifeiInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
     }
     //包装计费 数据拉取
      jifeiInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/wrapgPrice/getPage', {sourceId:this.state.id,dataTyId:70}, response => {
            that.setState({
                 jifei:response.data.data
            })
        }, error => console.log(error.message))
    }
    //品牌与原产地
     pinpaiSaveAndClose(value,data){
     	 let that = this;
        value = Object.assign({},{vndMtlId:this.state.id,dataTyId:70},value);
        apiPost(API_FOODING_DS,'/manufty/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            that.pinpaiInitData();          
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
        this.setState({visible:false});
     }
     //品牌与原产地 数据拉取
      pinpaiInitData(){
        let that = this;
        apiGet(API_FOODING_DS,'/manufty/getPage', {vndMtlId:this.state.id,dataTyId:70}, response => {
            that.setState({
                 pinpai:response.data.data
            })
        }, error => console.log(error.message))
    }
    //常规的保存并关闭
    onSaveAndClose(value,data){
        value = Object.assign({},value,{id:data.id,optlock:data.optlock});
        apiPost(API_FOODING_DS,'/beMtl/save',value, response => {
            ServiceTips({text:i18n.t(200979/*编辑成功*/),type:'success'})
            this.getDetailData();
            this.setState({visible:false});
        }, error => {
            ServiceTips({text:i18n.t(200980/*编辑失败*/),type:'error'})
            this.setState({visible:false});
        })
    }
	onCancel(){
        this.setState({visible:false});
	}
    initState(){
        return {
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>
        }
	}
	getDetailData(){
    	let that = this;
    	apiGet(API_FOODING_DS,'/beMtl/getDetail',{id:this.state.id,sourceId:this.state.sourceId,dataTyId:70},(response)=>{
    		that.setState({
    			data:response.data
    		});
    	},(error)=>{
    	})
    }
    componentDidMount(){
        this.handleResize();
        if(!this.props.isDetail){
        	this.getPages();
		}
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        let sch=document.body.offsetHeight-80;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(20));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));
    }
	render(){
		const commonForm = this.state.dilogTelmp;
		const {baozhuang,zhuangzai,jifei,pinpai} = this.state;
         const data = this.state.data;
		return (
			  <div>
	               <div className='scroll' style={{backgroundColor:'#f0f4f8',
	               height:this.state.scrollHeight,overflow:'auto'}}>
		               	<div className = 'col'>
                            <Template1 
								menuList={[
									{permissions:'provider.edit',type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
								]}								
								onCancel ={this.onCancel} 
                                width={107}
                                Zindex ={12}
                                DialogTempalte={require('./NormalDialog').default}
                                isShowMenu={true} 
                                openDialog={this.handleClick}
                                onSaveAndClose={this.onSaveAndClose}
                                AjaxInit={true}
                                API_FOODING={API_FOODING_DS}
                                portname={'/beMtl/getInit'}
                                params={{id:this.state.id,dataTyId:70,sourceId:this.props.location.query.sourceId}}
                                id={'detail-normal'} title={i18n.t(100138/*常规*/)} tempArray={[
                                    {key:i18n.t(100379/*产品*/),value:data.beMtl?data.beMtl.material.localName:''},
                                    {key:i18n.t(200976/*供应商产品编码*/),value:data.beMtl?data.beMtl.beMtlCode:''},
                                    {key:i18n.t(200977/*供方销售员*/),value:data.beMtl?data.beMtl.saleContactor.localName:''},
                                    {key:i18n.t(400081/*产品操作员*/),value:data.beMtl?data.beMtl.operContactor.localName:''},
                                    {key:i18n.t(500274/*保质期天数*/),value:data.beMtl?data.beMtl.assurDay + '('+ i18n.t(200519/*天*/) +')':i18n.t(NaN/**/)},
                                    {key:i18n.t(400077/*境内货源地*/),value:data.beMtl?data.beMtl.domestic:''},
                            ]}/>
                            <div style={{marginTop:'10px'}}>
		                      <MeasureCommon  
									menuList={[
										{type:'add',permissions:'provider.dtl.add'},
										{type:'delete',permissions:'provider.dtl.del'},
										{type:'edit',permissions:'provider.edit'}                                        
									]}							  
								 title ={i18n.t(100595/*箱型装载数据*/)} 
		                    			Zindex ={11}
			                            openDialog={this.handleClick}
			                             DialogTempalte ={require('./TraderulesDetailDialog').default}
			                             showHeader ={true}
			                             checkedRowsArray={[]}
			                             getSelectArr={[]}
			                             onSaveAndClose={this.zhuangzaiSaveAndClose}
			                             onCancel={this.onCancel}
			                             AjaxInit={true}
                                         addNoInit={true}
                                         otherData={{id:this.state.id,sourceId:this.state.sourceId}}
			                             API_FOODING={API_FOODING_DS}
			                             portname={'/contnrLoading/getOne'}
			                             id={'client-detail-zhuangzai'}
			                             params={{}}
						                    columns ={
						                    	[{
													title : i18n.t(100596/*包装名称*/),
													dataIndex : 'packaging',
													key : "packaging",
													width : '25%',
													render(data,row,index){
														return (<div title={data}>{data?data.localName:''}</div>)
													}
												},{
													title : i18n.t(100214/*箱型*/),
													dataIndex : "contnrType",
													key : "contnrType",
													width : "12.5%",
													render(data,row,index){
														
															return <div>{data?data.localName:''}</div>
														}
												},{
													title : i18n.t(100598/*箱型数量*/),
													dataIndex : "mtlContNum",
													key : "mtlContNum",
													width : "10.5%",
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
													width : "25%",
													render(data,row ,index){
														return <div>{data?data.localName:''}</div>
													}
												},{
													title : i18n.t(100600/*每托盘件数*/),
													dataIndex : 'salvrIdNum',
													key : "salvrIdNum",
													width : "16.5%",
													render(data,row ,index){
														return data;
													}
												}]
						                    }
					                    data={zhuangzai}
		                      />
                            </div>
		                    <MeasureCommon 
								menuList={[
									{type:'add',permissions:'provider.dtl.add'},
									{type:'delete',permissions:'provider.dtl.del'},
									{type:'edit',permissions:'provider.edit'}                                        
								]}								
								title ={i18n.t(200981/*供应品牌与原产地制造商*/)} 
		                     			Zindex ={10}
			                            openDialog={this.handleClick}
			                             DialogTempalte ={require('./TraderulesDetailDialog').default}
			                             showHeader ={true}
			                             checkedRowsArray={[]}
			                             getSelectArr={[]}
			                             onSaveAndClose={this.pinpaiSaveAndClose}
			                             onCancel={this.onCancel}
			                             AjaxInit={true}
                                         addNoInit={true}
			                             API_FOODING={API_FOODING_DS}
			                             portname={'/manufty/getOne'}
			                             id={'client-detail-pinpai'}
			                             params={{}}
						                     columns ={
						                    	[{
													title : i18n.t(200982/*主品牌*/),
													dataIndex : 'brand',
													key : "brand",
													width : '25%',
													render(data,row,index){
														return (<div>{data?data.localName:''}</div>)
													}
												},{
													title : i18n.t(200983/*制造厂商*/),
													dataIndex : "vendor",
													key : "vendor",
													width : "25%",
													render(data,row,index){
														return (<div>{data?data.localName:''}</div>)
													}
												},{
													title : i18n.t(200984/*原产国家/地区*/),
													dataIndex : "country",
													key : "country",
													width : "25%",
													render(data,row,index){
														return (<div>{data?data.localName:''}</div>)
													}
												}]
						                     }
		                    data={pinpai}
		                    />
		                </div>
		                <div className = 'col' style={{paddingLeft:0}}>
		                     <MeasureCommon  
								menuList={[
									{type:'add',permissions:'provider.dtl.add'},
									{type:'delete',permissions:'provider.dtl.del'},
									{type:'edit',permissions:'provider.edit'}                                        
								]}							 	
								 title ={i18n.t(100550/*产品包装*/)}
										Zindex ={9}
			                            openDialog={this.handleClick}
			                             DialogTempalte ={require('./TraderulesDetailDialog').default}
			                             showHeader ={true}
			                             checkedRowsArray={[]}
			                             getSelectArr={[]}
			                             onSaveAndClose={this.baozhuangSaveAndClose}
			                             onCancel={this.onCancel}
			                             AjaxInit={true}
                                         otherData={{id:this.state.id,sourceId:this.state.sourceId,ids:this.state.ids}}
			                             API_FOODING={API_FOODING_DS}
			                             portname={'/pack/getOne'}
                                         addNoInit={true}
			                             id={'client-detail-baozhuang'}
			                             params={{}}
			                              columns ={
						                    	[{
													title : i18n.t(100596/*包装名称*/),
													dataIndex : 'packaging',
													key : "packaging",
													width : '25%',
													render(data,row,index){
															return (<div className={'text-ellipsis'}>{data?data.localName:''}</div>)
													}
												},{
													title : i18n.t(100551/*净重量*/),
													dataIndex : "netWtNum",
													key : "netWtNum",
													width : "15%",
													render(data,row,index){
														return data;
													}
												},{
													title : i18n.t(100553/*毛重量*/),
													dataIndex : "grosWtNum",
													key : "grosWtNum",
													width : "15%",
													render(data,row,index){
														return (<div>{data}</div>)
													}
												},{
													title : i18n.t(100223/*体积量*/),
													dataIndex : 'volNum',
													key : "volNum",
													width : "20%",
													render(data,row ,index){
														return data;
													}
												},{
													title : i18n.t(100557/*基础包装*/),
													dataIndex : 'basPackMrk',
													key : "basPackMrk",
													width : "8%",
													render(data,row ,index){
														return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
														//return data?i18n.t(100141/*是*/):i18n.t(100142/*否*/);
													}
												}]
					                   	  }
                            data={baozhuang}
							/>
		                     <MeasureCommon
								menuList={[
									{type:'add',permissions:'provider.dtl.add'},
									{type:'delete',permissions:'provider.dtl.del'},
									{type:'edit',permissions:'provider.edit'}                                        
								]}		   						
								   title={i18n.t(100570/*包装计费*/)}
		                     	Zindex ={8}
	                            openDialog={this.handleClick}
	                             DialogTempalte ={require('./TraderulesDetailDialog').default}
	                             showHeader ={true}
	                             checkedRowsArray={[]}
	                             getSelectArr={[]}
	                             onSaveAndClose={this.jifeiSaveAndClose}
	                             onCancel={this.onCancel}
	                             AjaxInit={true}
	                             API_FOODING={API_FOODING_DS}
                                 addNoInit={true}
	                             portname={'/wrapgPrice/getOne'}
                                 otherData={{id:this.state.id,sourceId:this.state.sourceId}}
	                             id={'client-detail-jifei'}
	                             params={{}}
				                    columns ={
				                    	[{
											title : i18n.t(100596/*包装名称*/),
											dataIndex : 'packaging',
											key : "packaging",
											width : '25%',
											render(data,row,index){
												return (<div title={data}>{data?data.localName:''}</div>)
											}
										},{
											title : i18n.t(200933/*包装单价*/),
											dataIndex : "wrapPrice",
											key : "wrapPrice",
											width : "15%",
											render(data,row,index){
												return data;
											}
										},{
											title : i18n.t(100284/*币种*/),
											dataIndex : "curren",
											key : "curren",
											width : "15%",
											render(data,row,index){
												return <div>{data?data.localName:''}</div>;
											}
										},{
											title : i18n.t(100286/*生效日期*/),
											dataIndex : "validDate",
											key : "validDate",
											width : "15%",
											render(data,row,index){
												return new Date(data).Format('yyyy-MM-dd');
											}
										},{
											title : i18n.t(500120/*终止日期*/),
											dataIndex : 'endDate',
											key : "endDate",
											width : "15%",
											render(data,row ,index){
												return new Date(data).Format('yyyy-MM-dd');
											}
										}]
				                    }
		                    data={jifei}
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
