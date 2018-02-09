import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Measurement from  '../../../../../components/RuleTemplate';
import OnlyreadyRuleTemplate from '../../../../../components/OnlyreadyRuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
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
				   apiForm(API_FOODING_ERP,'/saleadjust/mtl/delete',{id:select.billDtlId},(response)=>{
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
        	 Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
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
    initProduct(billId){
    	apiGet(API_FOODING_ERP,'/saleadjust/mtl/getNews',{billId:this.props.id},(response)=>{
    		this.props.getOneCall();
            this.setState({
    			productData:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initDanju(saleId){
    	apiGet(API_FOODING_ERP,'/saleadjust/mtl/getList',{billId:this.props.id},(response)=>{
    		this.setState({
    			danJuArray:response.data||[]
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
            dilogTelmp:<div></div>,
            titleArray:[]//遍历唛头标签
        }
	}
    componentDidMount(){
        this.handleResize();
        this.initProduct(this.props.id);
        window.addEventListener('resize', this.handleResize(20));
        this.initDanju();
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
        // console.log(nextProps);
        // if(nextProps.getOne.saleBillId){
        //     this.initDanju(nextProps.getOne.saleBillId);
        // }
        window.addEventListener('resize', this.handleResize(0));
    }
	render(){
		const commonForm = this.state.dilogTelmp;
        let that = this;
        let {getOne} = this.props;
        let {getFieldProps,getFieldError} = this.props.form;
		return (
			  <div>
	               <div style={{backgroundColor:'#f0f4f8',overflow:'hidden'}}>
		               <div style={{marginTop:'10px'}}>
                             <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(201072/*原订单产品*/)}
                                 id={'31'}
                                addBeforeSaveClick = {this.addBeforeSaveClick}
                                otherData = {{getOne:this.props.getOne,initData:this.state.initData}}
                                openDialog={this.danzhenghandleClick}
                                onSaveAndClose={this.initDanju}

                                 showHeader ={true}
                                    columns ={
                                        [{
                                            title : i18n.t(100379/*产品*/),
                                            dataIndex : 'mtl'+language,
                                            key : 'mtl'+language,
                                            width : '10%',
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
                                            width : "15%",
                                            render(data,row,index){
                                                return <div>{data}</div>;
                                            }
                                        },{
                                            title : i18n.t(500067/*包装*/),
                                            dataIndex : "packag"+language,
                                            key : "packag"+language,
                                            width : "15%",
                                            render(data,row ,index){
                                                return <div>{data}</div>;
                                            }
                                        },{
                                            title : i18n.t(201073/*原销售数量*/),
                                            dataIndex : "salQty",
                                            key : "salQty",
                                            width : "10%",
                                            render(data,row ,index){
                                                return <div>{data}</div>;
                                            }
                                        },{
                                            title : i18n.t(400118/*调整后数量*/),
                                            dataIndex : "adjustQty",
                                            key : "adjustQty",
                                            width : "8%",
                                            ignore_equals: true,
                                            render(data,row ,index){
                                                getFieldProps('mtlInfo['+ index.index +'].adjustAmt',{
                                                            initialValue:row.adjustAmt?row.adjustAmt:''
                                                })
                                                getFieldProps('mtlInfo['+ index.index +'].billDtlId',{
                                                            initialValue:row.billDtlId?row.billDtlId:''
                                                })
                                                return (
                                                    <input type='text' style={{width:'90%'}} className={'text-input-nowidth'}
                                                        placeholder=""
                                                        {...getFieldProps('mtlInfo['+ index.index +'].adjustQty',{
                                                            initialValue:data?data:''
                                                        })}
                                                    />);
                                            }
                                        },{
                                            title : i18n.t(400035/*产品单位*/),
                                            dataIndex : "uom"+language,
                                            key : "uom"+language,
                                            width : "8%",
                                            render(data,row ,index){
                                                return <div>{data}</div>;
                                            }
                                        },{
                                            title : i18n.t(201074/*原销售单价*/),
                                            dataIndex : "salTaxPrc",
                                            key : "salTaxPrc",
                                            width : "8%",
                                            ignore_equals: true,
                                            render(data,row ,index){
                                                return <div>{data?data+' '+getOne["cny"+language]:0+' '+getOne["cny"+language]}</div>;
                                            }
                                        },{
                                            title : i18n.t(400120/*调整后单价*/),
                                            dataIndex : "adjustPrc",
                                            key : "adjustPrc",
                                            width : "8%",
                                            ignore_equals: true,
                                            render(data,row ,index){
                                                return (
                                                    <input type='text' style={{width:'90%'}} className={getFieldError('mtlInfo['+index.index+'].adjustPrc')?'text-input-nowidth error-border':'text-input-nowidth'}
                                                        placeholder=""
                                                        {...getFieldProps('mtlInfo['+index.index+'].adjustPrc',{
                                                            initialValue:data?data:''
                                                        })}
                                                    />)
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
								onCancel ={this.onCancel} title ={i18n.t(201075/*新订单产品*/)}
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
											return <div>{data}</div>;
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
											return data+' '+row["uom"+language];
										}},{
										title : i18n.t(200847/*含税单价*/),
										dataIndex : 'salTaxPrc',
										key : "salTaxPrc",
										width : "21%",
                                        ignore_equals: true,
										render(data,row ,index){
											return data+' '+getOne["cny"+language];
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
