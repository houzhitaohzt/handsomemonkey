import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import OnlyreadyRuleTemplate from  '../../../../../components/OnlyreadyRuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../../services/apiCall";
export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.initProduct = this.initProduct.bind(this);
        this.initDanju = this.initDanju.bind(this);
    }
    initProduct(billId){
    	apiGet(API_FOODING_ERP,'/saleadjust/mtl/getNews',{billId:this.props.id},(response)=>{
    		this.setState({
    			productData:response.data||[]
    		});
    	},(error)=>{
    	});
    }
    initDanju(){
    	apiGet(API_FOODING_ERP,'/saleadjust/mtl/getOlds',{billId:this.props.id},(response)=>{
    		this.setState({
    			danJuArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    onSaveAndClose(values){
        console.log(values);
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
            productData:[],//订单产品
        	danJuArray:[],//单据要求
        }
	}
    componentDidMount(){
        this.handleResize();
         if(this.props.id){
        	this.initProduct();
        	this.initDanju();
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
		let getOne = this.props.getOne||{};
		return (
			  	<div>
	               	<div style={{backgroundColor:'#f0f4f8',overflow:'hidden'}}>
		                     <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(201072/*原订单产品*/)} openDialog={this.handleClick}
			                     id={'31'}
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
                                            render(data,row ,index){

                                                return data;

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
                                            render(data,row ,index){
                                                return <div>{data?toDecimal(data):''}</div>;
                                            }
                                        },{
                                            title : i18n.t(400120/*调整后单价*/),
                                            dataIndex : "adjustPrc",
                                            key : "adjustPrc",
                                            width : "8%",
                                            render(data,row ,index){
                                                return <div>{data?toDecimal(data):''}</div>;
                                            }
                                        }]
				                    }
				                    data={this.state.danJuArray}
			                />
		                    <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(201075/*新订单产品*/)} openDialog={this.handleClick}
			                    onSaveAndClose={this.onSaveAndClose}
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
		                <div className = 'col' style={{paddingLeft:0}}>
		                	<Template1
								menuList={[
									{type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
								]}
								onCancel ={this.onCancel} isShowMenu={false}
                                 isShowIcon={false}
		                	openDialog={this.handleClick} id={'4'}
		                	 title={i18n.t(100140/*组织*/)}
		                	  tempArray={[{key:i18n.t(500143/*集团组织*/),
		                	  value:getOne["cluster"+language]},
		                	  {key:i18n.t(100244/*企业*/),value:getOne["cc"+language]},
		                	  {key:i18n.t(200119/*销售组织*/),value:getOne["sor"+language]},
		                	{key:i18n.t(400011/*销售员*/),value:getOne["saleStaff"+language]}]}/>
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
