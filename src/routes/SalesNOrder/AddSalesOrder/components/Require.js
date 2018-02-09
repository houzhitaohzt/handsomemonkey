import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Measurement from  '../../../../components/RuleTemplate';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import Template1  from  '../../../Client/Detail/Content/components/Template1';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.initProduct = this.initProduct.bind(this);
        this.producthandleClick = this.producthandleClick.bind(this);
        this.addBeforeSaveClick = this.addBeforeSaveClick.bind(this);

        //唛头要求
        this.maitouhandleClick = this.maitouhandleClick.bind(this);
        this.initMatou= this.initMatou.bind(this);

        //证书
        this.initZhengshu = this.initZhengshu.bind(this);
        this.zhengshuhandleClick = this.zhengshuhandleClick.bind(this);

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
        	 Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
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
        	 Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
				  done: () => {
				   apiForm(API_FOODING_ERP,'/insale/mtl/delete',{id:select.billDtlId},(response)=>{
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
    maitouhandleClick(e, data, Template){
    	let select = data.selectArr?data.selectArr[0]:null||data.record;
    	if(data.number ==2){
        	 Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
				  done: () => {
				   apiForm(API_FOODING_ERP,'/insale/marks/delete',{id:select.billDtlId},(response)=>{
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
        	 Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
				  done: () => {
				   apiForm(API_FOODING_ERP,'/insale/card/delete',{id:select.billDtlId},(response)=>{
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

    initProduct(billId){
    	apiGet(API_FOODING_ERP,'/insale/mtl/getList',{billId:this.props.id},(response)=>{
    		this.props.getOneCall();
            this.initZhengshu();
            this.setState({
    			productData:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initMatou(){
    	apiGet(API_FOODING_ERP,'/insale/marks/getList',{billId:this.props.id},(response)=>{
    		this.setState({
    			maTouArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initZhengshu(){
    	apiGet(API_FOODING_ERP,'/insale/card/getList',{billId:this.props.id},(response)=>{
    		this.setState({
    			zhengshuArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initChuang(){
    	apiGet(API_FOODING_ERP,'/insale/ship/getList',{billId:this.props.id},(response)=>{
    		this.setState({
    			chuangArray:response.data||[]
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
        	zhengshuArray:[],//证书
            visible:false,
            dialogTitle:'',
            initData:{},
            dilogTelmp:<div></div>,
            titleArray:[]//遍历唛头标签
        }
	}
    componentDidMount(){
        this.handleResize();
         if(this.props.id){
            apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Item'},(response)=>{
                    this.setState({
                        titleArray:response.data
                    })
            },(error)=>{

            })
        	this.initProduct(this.props.id);
        	this.initMatou();
            this.initZhengshu();
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
        let that = this;
        let getOne = this.props.getOne;
        console.log(getOne);
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
								onCancel ={this.onCancel} title ={i18n.t(400082/*产品信息*/)}
		                    	addBeforeSaveClick = {this.addBeforeSaveClick}
		                    	otherData = {{getOne:this.props.getOne,initData:this.state.initData}}
		                    	openDialog={this.producthandleClick}
			                    onSaveAndClose={this.initProduct}
			               		onCancel = {this.onCancel}
			               		DialogTempalte ={require('../dialog/ProductOrder').default}
			                    id={'30'}
			                    showHeader ={true}
			                    columns ={
			                    	[{
										title : i18n.t(100379/*产品*/),
										dataIndex : 'mtl'+language,
										key : 'mtl'+language,
										width : '18%',
										render(data,row,index){
											return (<div title={data}>{data}</div>)
										}
									},{
										title : i18n.t(100382/*产品规格*/),
										dataIndex : "basSpeci",
										key : "basSpeci",
										width : "25%",
										render(data,row,index){
											return <div>{data}</div>;
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
											return <div>{data?(data +' '+row["uom"+language]):''}</div>;
										}},{
										title : i18n.t(200847/*含税单价*/),
										dataIndex : 'salTaxPrc',
										key : "salTaxPrc",
										width : "21%",
                                        cny: getOne["cny"+language],
										render(data,row ,index){
											return <div>{data?(toDecimal(data)+' '+getOne["cny"+language]):''}</div>;
										}
									},{
										title : i18n.t(200848/*销售小计*/),
										dataIndex : 'setTaxAgg',
										key : "setTaxAgg",
										width : "21%",
                                        cny: getOne["cny"+language],
										render(data,row ,index){
											return <div>{data?(toDecimal(data)+' '+getOne["cny"+language]):''}</div>;
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
								onCancel ={this.onCancel} title ={i18n.t(400137/*唛头要求*/)} openDialog={this.handleClick}
			                     id={'32'}
			                     addBeforeSaveClick = {this.addBeforeSaveClick}
		                    	otherData = {{getOne:this.props.getOne,initData:this.state.initData}}
		                    	openDialog={this.maitouhandleClick}
			                    onSaveAndClose={this.initMatou}
			               		onCancel = {this.onCancel}
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
											dataIndex : "items",
											key : "items",
											width : "30%",
                                            titleArray:that.state.titleArray,
											render(data,row,key){
												return <div>
                                                    {
                                                        that.state.titleArray.map((value,i)=>{
                                                            if(data&&data[value["id"]]){
                                                                  return value["localName"]+' '+data[value["id"]];
                                                            }
                                                        })
                                                    }
                                                </div>;
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
										width : "10%",
										render(data,row,index){
											return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
											//return <div>{data?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</div>;
										}
									},
                                    {
										title : i18n.t(400134/*相关产品*/),
										dataIndex : "mtl"+language,
										key :"mtl"+language,
										width : "25%",
										render(data,row,index){
											return data;
										}
									},{
                                        title : i18n.t(400135/*供应商提供*/),
                                        dataIndex : "vndBeMark",
                                        key :"vndBeMark",
                                        width : "15%",
                                        render(data,row,index){
											return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                            //return <div>{data?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</div>;
                                        }
                                    }]
			                    }
		                    	data={this.state.zhengshuArray}
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
