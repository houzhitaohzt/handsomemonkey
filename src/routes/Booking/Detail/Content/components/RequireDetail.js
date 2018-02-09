import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import OnlyreadyRuleTemplate from  '../../../../../components/OnlyreadyRuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../../services/apiCall";
import Table from '../../../../../components/Table';
export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.onRowClick = this.onRowClick.bind(this);
        this.state=this.initState();
        this.initProduct = this.initProduct.bind(this);
        this.initMingxi = this.initMingxi.bind(this);
        this.initDanju = this.initDanju.bind(this);
        this.initMatou= this.initMatou.bind(this);
        this.initChuang = this.initChuang.bind(this);
        this.initYunshu = this.initYunshu.bind(this);
        this.initZhuangchuang  = this.initZhuangchuang.bind(this);
        this.initheYan = this.initheYan.bind(this);
        this.initzhuangXiang = this.initzhuangXiang.bind(this);
				this.initZhengshu = this.initZhengshu.bind(this);
    }
		initZhengshu(){
			apiGet(API_FOODING_ERP,'/shipping/getCardList',{billId:this.props.id},(response)=>{
    		this.setState({
    			cardListData:response.data||[]
    		});
    	},(error)=>{

    	});
		}
    initProduct(billId){
    	apiGet(API_FOODING_ERP,'/shipping/getMtls',{billId:this.props.id},(response)=>{
    		this.setState({
    			productData:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initMingxi(){
    	apiGet(API_FOODING_ERP,'/shipping/getPurmtlList',{billId:this.props.id},(response)=>{
    		this.setState({
    			mingXiArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initMatou(){
    	apiGet(API_FOODING_ERP,'/shipping/getMarksList',{billId:this.props.id},(response)=>{
    		this.setState({
    			maTouArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initDanju(){
    	apiGet(API_FOODING_ERP,'/shipping/getBillreqirList',{billId:this.props.id},(response)=>{
    		this.setState({
    			danJuArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initChuang(){
    	apiGet(API_FOODING_ERP,'/shipping/getShipList',{billId:this.props.id},(response)=>{
    		this.setState({
    			chuangArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initYunshu(){
    	apiGet(API_FOODING_ERP,'/shipping/getLsreqirList',{billId:this.props.id},(response)=>{
    		this.setState({
    			yunshuArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initZhuangchuang(){
    	apiGet(API_FOODING_ERP,'/shipping/getRequireList',{billId:this.props.id},(response)=>{
    		this.setState({
    			zhuangChuangArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initheYan(){
    	apiGet(API_FOODING_ERP,'/shipping/getTestList',{billId:this.props.id},(response)=>{
    		this.setState({
    			jianYanArray:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    initzhuangXiang(){
    	apiGet(API_FOODING_ERP,'/shipping/pakg/getList',{billId:this.props.id},(response)=>{
    		this.setState({
    			zhuangXiangArray:response.data||[]
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
            mingXiArray:[],//配货明细
        	maTouArray:[],//唛头
        	danJuArray:[],//单据要求
        	cardListData:[],//证书
        	chuangArray:[],//船公司要求
        	yunshuArray:[],//运输要求
        	zhuangChuangArray:[],//装船要求
        	jianYanArray:[],//检验要求
        	zhuangXiangArray:[],//装箱信息
        	columns:[
			                    	{
										title : i18n.t(500061/*产品名称*/),
										dataIndex : 'mtl'+language,
										key : 'mtl'+language,
										width : '5%',
										render(data,row,index){
											return (<div title={data}>{data}</div>)
										}
									},{
										title : i18n.t(100382/*产品规格*/),
										dataIndex : "basSpeci",
										key : "basSpeci",
										width : "10%",
										render(data,row,index){
											return <div>{data}</div>;
										}
									},{
										title : "HSCODE",
										dataIndex : "hsCode",
										key : "hsCode",
										width : "10%",
										render(data,row,index){
											return data;
										}
									},{
										title : i18n.t(200333/*发运数量*/),
										dataIndex : "sendQty",
										key : "sendQty",
										width : "5%",
										className:'text-right',
										render(data,row ,index){
											return <div>{data?data+row["uom"+language]:row.sOrderQty+' '+row["uom"+language]}</div>;
										}
									},{
										title : i18n.t(200315/*件数*/),
										dataIndex : "packQty",
										key : "packQty",
										width : "4%",
										className:'text-center',
										render(data,row ,index){
											return <div>{data}</div>;
										}
									},{
										title : i18n.t(200314/*毛重*/),
										dataIndex : 'grosWt',
										key : "grosWt",
										width : "4%",
										className:'text-right',
										render(data,row ,index){
											return <div>{data?data +' '+row["wUom"+language]:''}</div>;
										}},{
										title : i18n.t(200313/*体积*/),
										dataIndex : 'vol',
										key : "vol",
										width : "5%",
										className:'text-right',
										render(data,row ,index){
											return <div>{data?data +' '+row["vUom"+language]:''}</div>;
										}
									},{
										title : i18n.t(500089/*要求装运日*/),
										dataIndex : 'ariveDate',
										key : "ariveDate",
										width : "8%",
										className:'text-center',
										render(data,row ,index){
											return <div>{new Date(data).Format('yyyy-MM-dd')}</div>
										}
									},
									{
										title : i18n.t(400075/*是否商检*/),
										dataIndex : 'inspcMark',
										key : "inspcMark",
										width : "3%",
										render(data,row ,index){
											return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
											//return <div>{data?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</div>
										}
									}],
									titleArray:[]
        }
	}
	onRowClick(){
		let array = this.refs.booking.getSelectArr();
		this.props.getSelectRow(this.refs.booking.getSelectArr());
	}
    componentDidMount(){
    	apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Item'},(response)=>{
                    this.setState({
                        titleArray:response.data
                    })
        	},(error)=>{

      	})
        this.handleResize();
        this.initProduct();
        this.initMingxi();
        this.initMatou();
        this.initChuang();
        this.initYunshu();
        this.initZhuangchuang();
        this.initheYan();
        this.initzhuangXiang();
        this.initDanju();
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
		return (
			  	<div>
	               	<div style={{backgroundColor:'#f0f4f8',overflow:'hidden'}}>
		               	<div>
							<div style={{width: '100%',backgroundColor: '#fff',borderRadius: '6px',zIndex:this.props.Zindex,
								boxShadow: '0px 2px 0px #dadada',marginBottom:10,position:"relative"}} className='product-measurement'>
									<div>
										<div className='item-title'>
											<span className='title'>{i18n.t(500077/*订单产品*/)}</span>
										</div>
									</div>
									<Table
									    ref = 'booking'
										singleSelect={true}
										data={this.state.productData}
										columns={this.state.columns}
										checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
										colorFilterConfig={{show : false,dataIndex:'colorType'}}
										followConfig={{show:false}}
										scroll={{x:true,y:0}}
										onRowClick={this.onRowClick}
									/>
							</div>

			                 <OnlyreadyRuleTemplate onCancel ={this.onCancel}
			                 title ={i18n.t(200334/*配货明细*/)} openDialog={this.handleClick}
			                    onSaveAndClose={this.onSaveAndClose}
			                    showHeader ={true}
			                    columns ={
			                    	[{
										title : i18n.t(100379/*产品*/),
										dataIndex : 'mtl'+language,
										key : 'mtl'+language,
										width : '8%',
										render(data,row,index){
											return (<div title={data}>{data}</div>)
										}
									},{
										title : "HSCODE",
										dataIndex : "hsCode",
										key : "hsCode",
										width : "8%",
										render(data,row,index){
											return data;
										}
									},{
										title : i18n.t(500067/*包装*/),
										dataIndex : "packag"+language,
										key : "packag"+language,
										width : "10%",
										render(data,row,index){
											return data;
										}
									},{
										title : i18n.t(100319/*采购数量*/),
										dataIndex :"purQty",
										key :"purQty",
										width : "8%",
										render(data,row,index){
											return (<div>{data}</div>)
										}
									},{
										title : i18n.t(400075/*是否商检*/),
										dataIndex : "inspcMark",
										key : "inspcMark",
										width : "5%",
										render(data,row ,index){
											return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
											//return <div>{data?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</div>;
										}
									},{
										title : i18n.t(200080/*类型*/),
										dataIndex : "orderType",
										key : "orderType",
										width : "5%",
										render(data,row ,index){
											return <div>{data==20?i18n.t(100417/*采购*/):i18n.t(100467/*锁库*/)}</div>;
										}
									},{
										title : i18n.t(400037/*采购员*/),
										dataIndex : 'purStaff'+language,
										key : "purStaff"+language,
										width : "10%",
										render(data,row ,index){
											return data;
										}
									},
									{
										title : i18n.t(400025/*仓库*/),
										dataIndex : 'receSl'+language,
										key : "receSl"+language,
										width : "10%",
										render(data,row ,index){
											return data;
										}
									}]
			                    }
			                    data={this.state.mingXiArray}
			                />
		                    <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(100128/*单据要求*/)} openDialog={this.handleClick}
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
			                <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(200337/*检测项目*/)} openDialog={this.handleClick}
				                     id={'37'}
				                     showHeader ={true}
					                   		columns ={
							                    [{
											title : i18n.t(500061/*产品名称*/),
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
											title : i18n.t(500073/*测试项目*/),
											dataIndex : "testItm"+language,
											key : "testItm"+language,
											width : "10%",
											render(data,row,index){
												return data;
											}
										},{
											title : i18n.t(200338/*检测机构*/),
											dataIndex : "servBe"+language,
											key : "servBe"+language,
											width : "10%",
											render(data,row,index){
												return data;
											}
										}]
						                    }
					                    data={this.state.jianYanArray}
		                     	/>
		                    <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(400137/*唛头要求*/)} openDialog={this.handleClick}
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
											<OnlyreadyRuleTemplate title ={i18n.t(500078/*证书要求*/)}
					                id={'32'}
					                showHeader ={true}
					                columns ={
					                	[{
											title : i18n.t(500070/*证书名称*/),
											dataIndex : 'cardLcName',
											key : "cardLcName",
											width : '14%',
											render(data,row,index){
												return (<div title={data}>{data}</div>)
											}
										},{
											title : i18n.t(500071/*是否加急*/),
											dataIndex : "gentMark",
											key : "gentMark",
											width : "5%",
											render(data,row,index){
												return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
												//return data?i18n.t(100141/*是*/):i18n.t(100142/*否*/);
											}
										},{
											title : i18n.t(500072/*是否正本*/),
											dataIndex : "origMark",
											key : "origMark",
											width : "5%",
											render(data,row,index){
												return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
												//return data?i18n.t(100141/*是*/):i18n.t(100142/*否*/);
											}
										},{
											title : i18n.t(400134/*相关产品*/),
											dataIndex : "mtlLcName",
											key : "mtlLcName",
											width : "20%",
											render(data,row,index){
												return (<div>{data}</div>);
											}
										},{
											title : i18n.t(400135/*供应商提供*/),
											dataIndex : "vndBeMark",
											key : "vndBeMark",
											width : "20%",
											render(data,row,index){
												return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
												//return (<div>{data?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</div>);
											}
										}]
					                }
					                data={this.state.cardListData}
					            />
		                </div>
						<div style={{overflow:'hidden'}}>
			                <div className='col' style={{padding:0}}>
			                    		<div className='col'style={{padding:0,paddingRight:'10px'}}>
			                    			 <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(100512/*船公司要求*/)} openDialog={this.handleClick}
							                     id={'34'}
							                     showHeader ={false}
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
			                    			 <OnlyreadyRuleTemplate  title ={i18n.t(200339/*运输要求*/)}
							                     showHeader ={false}
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
			               		  <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(400138/*装船要求*/)} openDialog={this.handleClick}
				                     id={'36'}
				                     showHeader ={false}
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
		                     	<OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(200340/*装箱信息*/)} openDialog={this.handleClick}
				                     id={'37'}
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
											title : i18n.t(200341/*集装箱数*/),
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
