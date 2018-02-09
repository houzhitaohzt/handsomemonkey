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
        this.initMatou= this.initMatou.bind(this);
        this.initZhengshu = this.initZhengshu.bind(this);
    }
    initProduct(billId){
    	apiGet(API_FOODING_ERP,'/insale/mtl/getList',{billId:this.props.id},(response)=>{
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
        	maTouArray:[],//唛头
        	zhengshuArray:[],//证书
        	titleArray:[]//遍历唛头标签
        }
	}
    componentDidMount(){
        this.handleResize();
         apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Item'},(response)=>{
                    this.setState({
                        titleArray:response.data
                    })
            },(error)=>{

            },()=>{
            	
            })

        this.initProduct(this.props.id);
        this.initMatou();
        this.initZhengshu();
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
		let {getOne} = this.props;
		return (
			  	<div>
	               	<div style={{backgroundColor:'#f0f4f8',overflow:'hidden'}}>
		               	<div>
		                    <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(400082/*产品信息*/)} openDialog={this.handleClick}
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
		                    <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(400137/*唛头要求*/)} openDialog={this.handleClick}
			                     id={'32'}
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
											ignore_equals: true,
											render(data,row,index){
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
		                    <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(500078/*证书要求*/)} openDialog={this.handleClick}
		                     id={'33'}
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
		               <Template1 
								menuList={[
									{type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
								]}							
						onCancel ={this.onCancel} isShowMenu={true} openDialog={this.handleClick} id={'4'} title={i18n.t(100140/*组织*/)} isShowMenu={false} isShowIcon={false} tempArray={[{key:i18n.t(500143/*集团组织*/),value:this.props.getOne["cluster"+language]},{key:i18n.t(100244/*企业*/),value:this.props.getOne["cc"+language]},{key:i18n.t(200119/*销售组织*/),value:this.props.getOne["sor"+language]},{key:i18n.t(400011/*销售员*/),value:this.props.getOne["saleStaff"+language]}]}/>
	               	</div>
	                <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
		                {commonForm}
		            </Dialog>
               	</div>
			);
	}

}
export default ProductDetail;
