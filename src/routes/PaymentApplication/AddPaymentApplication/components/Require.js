import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Measurement from  '../../../../components/RuleTemplate';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import Template1  from  '../../../Client/Detail/Content/components/Template1';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
import Selle from "./Selle";
export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.initProduct = this.initProduct.bind(this);
        this.producthandleClick = this.producthandleClick.bind(this);
        this.addBeforeSaveClick = this.addBeforeSaveClick.bind(this);
        //单据要求
        this.danzhenghandleClick = this.danzhenghandleClick.bind(this);
        this.initDanju = this.initDanju.bind(this);

        //唛头要求
        this.maitouhandleClick = this.maitouhandleClick.bind(this);
        this.initMatou= this.initMatou.bind(this);

        //证书
        this.initZhengshu = this.initZhengshu.bind(this);
        this.zhengshuhandleClick = this.zhengshuhandleClick.bind(this);

        //船公司
        this.chuanghandleClick = this.chuanghandleClick.bind(this);
        this.initChuang = this.initChuang.bind(this);

        //运输要求
        this.yunshuhandleClick = this.yunshuhandleClick.bind(this);
        this.initYunshu = this.initYunshu.bind(this);

        //装船要求
        this.zhuangChuanghandleClick = this.zhuangChuanghandleClick.bind(this);
        this.initZhuangchuang  = this.initZhuangchuang.bind(this);

        //核验要求
        this.heYanhandleClick = this.heYanhandleClick.bind(this);
        this.initheYan = this.initheYan.bind(this);

        //装箱要求
        this.zhuangXianghandleClick = this.zhuangXianghandleClick.bind(this);
        this.initzhuangXiang = this.initzhuangXiang.bind(this);
    }
    addBeforeSaveClick(initAjax){
    	if(this.props.id){
    		initAjax();
    	}else{
    		this.props.saveClick(initAjax);
    	}
    }
    handleClick = (e, data, Template) => {
        if(data.number ==2){
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				    console.log('ok, got it');
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
    //产品右键
    producthandleClick(e, data, Template){
    	let select = data.selectArr?data.selectArr[0]:null||data.record;
    	if(data.number ==2){
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				   apiForm(API_FOODING_ERP,'/saleorder/mtl/delete',{id:select.billDtlId},(response)=>{
		        		ServiceTips({text:response.message,type:'sucess'});
		        		this.initProduct();
		        	},(error)=>{
						ServiceTips({text:error.message,type:'error'});
		        	});
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
    //单据要求
    danzhenghandleClick(e, data, Template){
    	let select = data.selectArr?data.selectArr[0]:null||data.record;
    	if(data.number ==2){
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				   apiForm(API_FOODING_ERP,'/saleorder/billreqir/delete',{id:select.billDtlId},(response)=>{
		        		ServiceTips({text:response.message,type:'sucess'});
		        		this.initDanju();
		        	},(error)=>{
						ServiceTips({text:error.message,type:'error'});
		        	});
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
    maitouhandleClick(e, data, Template){
    	let select = data.selectArr?data.selectArr[0]:null||data.record;
    	if(data.number ==2){
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				   apiForm(API_FOODING_ERP,'/saleorder/marks/delete',{id:select.billDtlId},(response)=>{
		        		ServiceTips({text:response.message,type:'sucess'});
		        		this.initMatou();
		        	},(error)=>{
						ServiceTips({text:error.message,type:'error'});
		        	});
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
     zhengshuhandleClick(e, data, Template){
    	let select = data.selectArr?data.selectArr[0]:null||data.record;
    	if(data.number ==2){
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				   apiForm(API_FOODING_ERP,'/saleorder/card/delete',{id:select.billDtlId},(response)=>{
		        		ServiceTips({text:response.message,type:'sucess'});
		        		this.initZhengshu();
		        	},(error)=>{
						ServiceTips({text:error.message,type:'error'});
		        	});
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
    chuanghandleClick(e, data, Template){
    	let select = data.selectArr?data.selectArr[0]:null||data.record;
    	if(data.number ==2){
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				   apiForm(API_FOODING_ERP,'/saleorder/ship/delete',{id:select.billDtlId},(response)=>{
		        		ServiceTips({text:response.message,type:'sucess'});
		        		this.initChuang();
		        	},(error)=>{
						ServiceTips({text:error.message,type:'error'});
		        	});
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
    yunshuhandleClick(e, data, Template){
    	let select = data.selectArr?data.selectArr[0]:null||data.record;
    	if(data.number ==2){
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				   apiForm(API_FOODING_ERP,'/saleorder/lsreqir/delete',{id:select.billDtlId},(response)=>{
		        		ServiceTips({text:response.message,type:'sucess'});
		        		this.initYunshu();
		        	},(error)=>{
						ServiceTips({text:error.message,type:'error'});
		        	});
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
    zhuangChuanghandleClick(e, data, Template){
    	let select = data.selectArr?data.selectArr[0]:null||data.record;
    	if(data.number ==2){
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				   apiForm(API_FOODING_ERP,'/saleorder/require/delete',{id:select.billDtlId},(response)=>{
		        		ServiceTips({text:response.message,type:'sucess'});
		        		this.initZhuangchuang();
		        	},(error)=>{
						ServiceTips({text:error.message,type:'error'});
		        	});
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
    heYanhandleClick(e, data, Template){
    	let select = data.selectArr?data.selectArr[0]:null||data.record;
    	if(data.number ==2){
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				   apiForm(API_FOODING_ERP,'/saleorder/test/delete',{id:select.billDtlId},(response)=>{
		        		ServiceTips({text:response.message,type:'sucess'});
		        		this.initheYan();
		        	},(error)=>{
						ServiceTips({text:error.message,type:'error'});
		        	});
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
    zhuangXianghandleClick(e, data, Template){
    	let select = data.selectArr?data.selectArr[0]:null||data.record;
    	if(data.number ==2){
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				   apiForm(API_FOODING_ERP,'/saleorder/pakg/delete',{id:select.billDtlId},(response)=>{
		        		ServiceTips({text:response.message,type:'sucess'});
		        		this.initzhuangXiang();
		        	},(error)=>{
						ServiceTips({text:error.message,type:'error'});
		        	});
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
    initProduct(billId){
    	apiGet(API_FOODING_ERP,'/saleorder/mtl/getList',{billId:this.props.id},(response)=>{
    		this.setState({
    			productData:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initMatou(){
    	apiGet(API_FOODING_ERP,'/saleorder/marks/getList',{billId:this.props.id},(response)=>{
    		this.setState({
    			maTouArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initDanju(){
    	apiGet(API_FOODING_ERP,'/saleorder/billreqir/getList',{billId:this.props.id},(response)=>{
    		this.setState({
    			danJuArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initZhengshu(){
    	apiGet(API_FOODING_ERP,'/saleorder/card/getList',{billId:this.props.id},(response)=>{
    		this.setState({
    			zhengshuArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initChuang(){
    	apiGet(API_FOODING_ERP,'/saleorder/ship/getList',{billId:this.props.id},(response)=>{
    		this.setState({
    			chuangArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initYunshu(){
    	apiGet(API_FOODING_ERP,'/saleorder/lsreqir/getList',{billId:this.props.id},(response)=>{
    		this.setState({
    			yunshuArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initZhuangchuang(){
    	apiGet(API_FOODING_ERP,'/saleorder/require/getList',{billId:this.props.id},(response)=>{
    		this.setState({
    			zhuangChuangArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initheYan(){
    	apiGet(API_FOODING_ERP,'/saleorder/test/getList',{billId:this.props.id},(response)=>{
    		this.setState({
    			jianYanArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initzhuangXiang(){
    	apiGet(API_FOODING_ERP,'/saleorder/pakg/getList',{billId:this.props.id},(response)=>{
    		this.setState({
    			zhuangXiangArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    //保存产品
    onSaveAndClose(values){
        this.setState({visible:false});
    }
	onCancel(){
        this.setState({visible:false});
	}
    initState(){
        return {
        	productData:[],//订单产品
        	maTouArray:[],//唛头
        	danJuArray:[],//单据要求
        	zhengshuArray:[],//证书
        	chuangArray:[],//船公司要求
        	yunshuArray:[],//运输要求
        	zhuangChuangArray:[],//装船要求
        	jianYanArray:[],//检验要求
        	zhuangXiangArray:[],//装箱信息
            visible:false, 
            dialogTitle:'',
            initData:{},
            dilogTelmp:<div></div>
        }
	}
    componentDidMount(){
        this.handleResize();
         if(this.props.id){
        	this.initProduct(this.props.id);
        	this.initDanju();
        	this.initMatou();
        	this.initZhengshu();
        	this.initChuang();
        	this.initYunshu();
        	this.initZhuangchuang();
        	this.initheYan();
        	this.initzhuangXiang();
        }
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        this.setState({
            paddingTop:!this.state.paddingTop
        });
        let padding = this.state.paddingTop ? 173:262;
        let sch=document.body.offsetHeight-height-padding;
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
		return (
			  <div>
	               <div style={{backgroundColor:'#f0f4f8',overflow:'hidden'}}>
		               <div style={{marginTop:'10px'}}>
		                    <Measurement 
								menuList={[
									{type:'add'},
									{type:'delete'},
									{type:'edit'}                                        
								]}							
								onCancel ={this.onCancel} title ={i18n.t(500077/*订单产品*/)}
		                    	addBeforeSaveClick = {this.addBeforeSaveClick}
		                    	otherData = {{getOne:this.props.getOne,initData:this.state.initData}}
		                    	openDialog={this.producthandleClick}
			                    onSaveAndClose={this.initProduct}
			               		DialogTempalte ={require('../dialog/ProductOrder').default}
			                    id={'30'}
			                    showHeader ={true}
			                    columns ={
			                    	[{
										title : i18n.t(100379/*产品*/),
										dataIndex : 'mtl'+language,
										key : 'mtl'+language,
										width : '18%',
                                        tooltip(data,record,index){
                                            return record.mtlEnName || "";
                                        },
										render(data,row,index){
											return (<div title={data}>{data}</div>)
										}
									},{
										title : i18n.t(100382/*产品规格*/),
										dataIndex : "basSpeci",
										key : "basSpeci",
										width : "25%",
										render(data,row,index){
											return data;
										}
									},{
										title : "HSCODE",
										dataIndex : "hsCode",
										key : "hsCode",
										width : "18%",
										render(data,row,index){
											return data;
										}
									},{
										title : i18n.t(400012/*品牌*/),
										dataIndex :"brand"+language,
										key :"brand"+language,
										width : "18%",
										render(data,row,index){
											return (<div>{data}</div>)
										}
									},{
										title : i18n.t(500067/*包装*/),
										dataIndex : "packag"+language,
										key : "packag"+language,
										width : "21%",
										render(data,row ,index){
											return data;
										}
									},{
										title : i18n.t(500068/*托盘*/),
										dataIndex : "salvr"+language,
										key : "salvr"+language,
										width : "21%",
										render(data,row ,index){
											return data;
										}
									},{
										title : i18n.t(200846/*销售数量*/),
										dataIndex : 'salQty',
										key : "salQty",
										width : "21%",
										render(data,row ,index){
											return data;
										}},{
										title : i18n.t(200847/*含税单价*/),
										dataIndex : 'salTaxPrc',
										key : "salTaxPrc",
										width : "21%",
										render(data,row ,index){
											return data;
										}
									},{
										title : i18n.t(200848/*销售小计*/),
										dataIndex : 'setTaxAgg',
										key : "setTaxAgg",
										width : "21%",
										render(data,row ,index){
											return data;
										}
									},{
										title : i18n.t(500069/*可否混装*/),
										dataIndex : 'isMixed',
										key : "isMixed",
										width : "21%",
										render(data,row ,index){
											return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
											//return data?i18n.t(100141/*是*/):i18n.t(100142/*否*/);
										}
									}]
			                    }
			                    data={this.state.productData}
			                />
		                    <Measurement 
								menuList={[
									{type:'add'},
									{type:'delete'},
									{type:'edit'}                                        
								]}							
								onCancel ={this.onCancel} title ={i18n.t(100128/*单据要求*/)}
			                     id={'31'}
			                    addBeforeSaveClick = {this.addBeforeSaveClick}
		                    	otherData = {{getOne:this.props.getOne,initData:this.state.initData}}
		                    	openDialog={this.danzhenghandleClick}
			                    onSaveAndClose={this.initDanju}
			                    DialogTempalte ={require('../dialog/Danju').default}
			                     showHeader ={true}
				                    columns ={
				                    	[{
											title : i18n.t(200335/*操作人员*/),
											dataIndex : 'userTypeName',
											key : "userTypeName",
											width : '25%',
											render(data,row,index){
												return (<div title={data}>{data}</div>)
											}
										},{
											title : i18n.t(200336/*单证要求*/),
											dataIndex : "billRequ"+language,
											key : "billRequ"+language,
											width : "30%",
											render(data,row,index){
												return data;
											}
										},{
											title : i18n.t(100002/*描述*/),
											dataIndex : "content",
											key : "content",
											width : "25%",
											render(data,row,index){
												return data;
											}
										}]
				                    }
				                    data={this.state.danJuArray}
			                />
		                    <Measurement 
								menuList={[
									{type:'add'},
									{type:'delete'},
									{type:'edit'}                                        
								]}							
								onCancel ={this.onCancel} title ={i18n.t(400137/*唛头要求*/)}
			                     id={'32'}
			                     addBeforeSaveClick = {this.addBeforeSaveClick}
		                    	otherData = {{getOne:this.props.getOne,initData:this.state.initData}}
		                    	openDialog={this.maitouhandleClick}
			                    onSaveAndClose={this.initMatou}
			               		DialogTempalte ={require('../dialog/maTou').default}
			                     showHeader ={true}
				                    columns ={
				                    	[{
											title : i18n.t(100379/*产品*/),
											dataIndex : 'mtl'+language,
											key : 'mtl'+language,
											width : '15%',
											render(data,row,index){
												return (<div title={data}>{data}</div>)
											}
										},{
											title : i18n.t(400130/*贴唛方*/),
											dataIndex : "stickDirectionName",
											key : "stickDirectionName",
											width : "15%",
											render(data,row,index){
												return data;
											}
										},{
											title : i18n.t(400131/*唛头类型*/),
											dataIndex : "markTy"+language,
											key : "markTy"+language,
											width : "15%",
											render(data,row,index){
												return data;
											}
										},{
											title : i18n.t(400132/*颜色*/),
											dataIndex : "colorTypeName",
											key : "colorTypeName",
											width : "15%",
											render(data,row,index){
												return data;
											}
										},{
											title : i18n.t(400133/*唛头内容*/),
											dataIndex : "mlNote",
											key : "mlNote",
											width : "30%",
											render(data,row,index){
												return <div>{data}</div>;
											}
										}]
				                    }
				                    data={this.state.maTouArray}
			                />
		                    <Measurement 
								menuList={[
									{type:'add'},
									{type:'delete'},
									{type:'edit'}                                        
								]}							
								onCancel ={this.onCancel} title ={i18n.t(500078/*证书要求*/)} openDialog={this.handleClick}
		                     id={'33'}
		                       addBeforeSaveClick = {this.addBeforeSaveClick}
		                    	otherData = {{getOne:this.props.getOne,initData:this.state.initData}}
		                    	openDialog={this.zhengshuhandleClick}
			                    onSaveAndClose={this.initZhengshu}
			               		onCancel = {this.onCancel}
			               		DialogTempalte ={require('../dialog/Zhengshu').default}
		                     showHeader ={true}
			                    columns ={
			                    	[{
										title : i18n.t(500070/*证书名称*/),
										dataIndex : 'card'+language,
										key : 'card'+language,
										width : '30%',
										render(data,row,index){
											return (<div title={data}>{data}</div>)
										}
									},{
										title : i18n.t(500071/*是否加急*/),
										dataIndex : "gentMark",
										key : "gentMark",
										width : "25%",
										render(data,row,index){
											return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
											//return <div>{data?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</div>;
										}
									},{
										title : i18n.t(500072/*是否正本*/),
										dataIndex : "origMark",
										key : "origMark",
										width : "25%",
										render(data,row,index){
											return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
											//return <div>{data?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</div>;
										}
									},{
										title : i18n.t(400134/*相关产品*/),
										dataIndex : "mtl"+language,
										key :"mtl"+language,
										width : "25%",
										render(data,row,index){
											return data;
										}
									}]
			                    }
		                    	data={this.state.zhengshuArray}
		                    />
		                </div>
		                <div style={{overflow:'hidden'}}>
		                <div className='col' style={{padding:0}}>
		                    	<div className='col'style={{padding:0,paddingRight:'10px'}}>
		                    			 <Measurement 
											menuList={[
												{type:'add'},
												{type:'delete'},
												{type:'edit'}                                        
											]}										 
										 	onCancel ={this.onCancel} title ={i18n.t(100512/*船公司要求*/)} openDialog={this.handleClick}
						                     id={'34'}
						                      addBeforeSaveClick = {this.addBeforeSaveClick}
						                    	otherData = {{getOne:this.props.getOne,initData:this.state.initData}}
						                    	openDialog={this.chuanghandleClick}
							                    onSaveAndClose={this.initChuang}
							               		onCancel = {this.onCancel}
							               		DialogTempalte ={require('../dialog/Chuang').default}
						                     showHeader ={true}
						                    columns ={
						                    	[{
													title : i18n.t(500075/*指定/禁止*/),
													dataIndex : 'spickTypeName',
													key : "spickTypeName",
													width : '50%',
													render(data,row,index){
														return (<div title={data}>{data}</div>)
													}
												},{
													title : i18n.t(500076/*船公司*/),
													dataIndex :"shipBe"+language,
													key :"shipBe"+language,
													width : "50%",
													render(data,row,index){
														return data;
													}
												}]
						                    }
						                    data={this.state.chuangArray}
						                  />
		                        </div>
		                        <div className='col'style={{padding:0,paddingRight:'10px'}}>
		                    			 <Measurement 
											menuList={[
												{type:'add'},
												{type:'delete'},
												{type:'edit'}                                        
											]}										 
										 	onCancel ={this.onCancel} title ={i18n.t(200339/*运输要求*/)} openDialog={this.handleClick}
						                     id={'35'}
						                       addBeforeSaveClick = {this.addBeforeSaveClick}
						                    	otherData = {{getOne:this.props.getOne,initData:this.state.initData}}
						                    	openDialog={this.yunshuhandleClick}
							                    onSaveAndClose={this.initYunshu}
							               		onCancel = {this.onCancel}
							               		DialogTempalte ={require('../dialog/Yunshu').default}
						                     showHeader ={true}
						                    columns ={
						                    	[{
													title : i18n.t(200339/*运输要求*/),
													dataIndex : 'isRequ'+language,
													key :'isRequ'+language,
													width : '50%',
													render(data,row,index){
														return (<div title={data}>{data}</div>)
													}
												},{
													title : i18n.t(100148/*注释*/),
													dataIndex : "instructions",
													key : "instructions",
													width : "50%",
													render(data,row,index){
														return data;
													}
												}]
						                    }
						                    data={this.state.yunshuArray}
						                  />
		                        </div>
		                </div>
		               <div className = 'col' style={{padding:0}}>
		               		  <Measurement 
								menuList={[
									{type:'add'},
									{type:'delete'},
									{type:'edit'}                                        
								]}								 
								 onCancel ={this.onCancel} title ={i18n.t(400138/*装船要求*/)}
			                     id={'36'}
			                     addBeforeSaveClick = {this.addBeforeSaveClick}
						         otherData = {{getOne:this.props.getOne,initData:this.state.initData}}
						        openDialog={this.zhuangChuanghandleClick}
							    onSaveAndClose={this.initZhuangchuang}
							     onCancel = {this.onCancel}
							      DialogTempalte ={require('../dialog/ZhuangChuang').default}
			                     showHeader ={true}
					                    columns ={
				                    	[{
											title : i18n.t(100379/*产品*/),
											dataIndex :  'mtl'+language,
											key : 'mtl'+language,
											width : '25%',
											render(data,row,index){
												return (<div title={data}>{data}</div>)
											}
										},{
											title : i18n.t(200080/*类型*/),
											dataIndex : "shipTestTypeName",
											key : "shipTestTypeName",
											width : "25%",
											render(data,row,index){
												return data;
											}
										},{
											title : i18n.t(100313/*服务机构*/),
											dataIndex : "splBe"+language,
											key : "splBe"+language,
											width : "50%",
											render(data,row,index){
												return data;
											}
										}]
				                    }
				                    data={this.state.zhuangChuangArray}
			                   />
			             </div>
			             </div>
			             	<div>
		                     <Measurement 
								menuList={[
									{type:'add'},
									{type:'delete'},
									{type:'edit'}                                        
								]}							 
							 	onCancel ={this.onCancel} title ={i18n.t(500079/*检验要求*/)}
			                     id={'37'}
			                     addBeforeSaveClick = {this.addBeforeSaveClick}
						         otherData = {{getOne:this.props.getOne,initData:this.state.initData}}
						        openDialog={this.heYanhandleClick}
							    onSaveAndClose={this.initheYan}
							     onCancel = {this.onCancel}
							      DialogTempalte ={require('../dialog/HeYan').default}
			                     showHeader ={true}
					                    columns ={
				                    	[{
											title : i18n.t(100379/*产品*/),
											dataIndex :  'mtl'+language,
											key : 'mtl'+language,
											width : '10%',
											render(data,row,index){
												return (<div title={data}>{data}</div>)
											}
										},{
											title : i18n.t(200172/*产品分类*/),
											dataIndex : "mtlTy"+language,
											key : "mtlTy"+language,
											width : "10%",
											render(data,row,index){
												return data;
											}
										},{
											title : i18n.t(100606/*测试方法*/),
											dataIndex : "testMeth"+language,
											key : "testMeth"+language,
											width : "10%",
											render(data,row,index){
												return data;
											}
										},{
											title : i18n.t(500073/*测试项目*/),
											dataIndex : "testItm"+language,
											key : "testItm"+language,
											width : "10%",
											render(data,row,index){
												return data;
											}
										}]
				                    }
				                    data={this.state.jianYanArray}
			                   />
		               </div>
		               <div>
		               <Measurement 
							menuList={[
								{type:'add'},
								{type:'delete'},
								{type:'edit'}                                        
							]}					   
					   	onCancel ={this.onCancel} title ={i18n.t(200340/*装箱信息*/)}
			                     id={'38'}
			                     addBeforeSaveClick = {this.addBeforeSaveClick}
						         otherData = {{getOne:this.props.getOne,initData:this.state.initData}}
						        openDialog={this.zhuangXianghandleClick}
							    onSaveAndClose={this.initzhuangXiang}
							     onCancel = {this.onCancel}
							      DialogTempalte ={require('../dialog/zhuangXiang').default}
			                     showHeader ={true}
					                    columns ={
				                    	[{
											title : i18n.t(100214/*箱型*/),
											dataIndex :  'contnrTy'+language,
											key : 'contnrTy'+language,
											width : '60%',
											render(data,row,index){
												return (<div title={data}>{data}</div>)
											}
										},{
											title : i18n.t(200849/*集装箱型*/),
											dataIndex : "contQty",
											key : "contQty",
											width : "30%",
											render(data,row,index){
												return data;
											}
										}]
				                    }
				                    data={this.state.zhuangXiangArray}
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
