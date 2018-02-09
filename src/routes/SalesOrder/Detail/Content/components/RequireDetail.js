import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {browserHistory,withRouter} from 'react-router';
import OnlyreadyRuleTemplate from  '../../../../../components/OnlyreadyRuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../../services/apiCall";
export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        props.require && props.require(this);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.initProduct = this.initProduct.bind(this);
        this.initDanju = this.initDanju.bind(this);
        this.initMatou= this.initMatou.bind(this);
        this.initZhengshu = this.initZhengshu.bind(this);
        this.initChuang = this.initChuang.bind(this);
        this.initYunshu = this.initYunshu.bind(this);
        this.initZhuangchuang  = this.initZhuangchuang.bind(this);
        this.initheYan = this.initheYan.bind(this);
        this.initzhuangXiang = this.initzhuangXiang.bind(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
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
        	danJuArray:[],//单据要求
        	zhengshuArray:[],//证书
        	chuangArray:[],//船公司要求
        	yunshuArray:[],//运输要求
        	zhuangChuangArray:[],//装船要求
        	jianYanArray:[],//检验要求
        	zhuangXiangArray:[],//装箱信息
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
         if(this.props.id){
        	// this.getPage();
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
        // window.removeEventListener('resize', this.handleResize(20));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0); 
        // window.addEventListener('resize', this.handleResize(0));
    }
    onClickLink(row){
		let {navAddTab} =this.props;
 		navAddTab({id:7,name:i18n.t(100402/*产品详情*/),component:i18n.t(100402/*产品详情*/),url:'/product/detail'});
  		browserHistory.push({pathname:'/product/detail',query:{id:row.mtlId}});
	}
	render(){
		const commonForm = this.state.dilogTelmp;
		let that = this;
		let {getOne} = this.props;
		return (
			  	<div>
	               	<div style={{backgroundColor:'#f0f4f8',overflow:'hidden'}}>
		               	<div>
		                    <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(500077/*订单产品*/)} openDialog={this.handleClick}
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
											return <div onClick={that.onClickLink.bind(that,row)} className='link-color'>{data}</div>;
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
                                        ignore_equals: true,
										render(data,row ,index){
											return <div>{data?(toDecimal(data)+' '+getOne["cny"+language]):''}</div>;
										}
									},{
										title : i18n.t(200848/*销售小计*/),
										dataIndex : 'setTaxAgg',
										key : "setTaxAgg",
										width : "21%",
                                        ignore_equals: true,
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
		                    <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(100128/*单据要求*/)} openDialog={this.handleClick}
			                     id={'31'}
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
                                                                  return <span key={i} style={{paddingRight:'10px'}}>{value["localName"]+' '+data[value["id"]]}</span>;  
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
		                     	<OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(500079/*检验要求*/)} openDialog={this.handleClick}
				                     id={'37'}
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
		                <div className = 'col' style={{paddingLeft:0}}>
		                	<Template1 
								menuList={[
									{type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
								]}							
								onCancel ={this.onCancel}  openDialog={this.handleClick} id={'4'} title={i18n.t(100140/*组织*/)}  isShowIcon={false} isShowMenu={false}  tempArray={[{key:i18n.t(500143/*集团组织*/),value:this.props.getOne["cluster"+language]},{key:i18n.t(100244/*企业*/),value:this.props.getOne["cc"+language]},{key:i18n.t(200119/*销售组织*/),value:this.props.getOne["sor"+language]},{key:i18n.t(400011/*销售员*/),value:this.props.getOne["saleStaff"+language]}]}/>
		                </div>
		                <div className = 'col' style={{paddingLeft:'10px'}}>
		                	<Template1 
								menuList={[
									{type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
								]}							
								onCancel ={this.onCancel}  openDialog={this.handleClick} id={'900'} title={i18n.t(200701/*佣金*/)}  isShowIcon={false} isShowMenu={false}  tempArray={[{key:i18n.t(200702/*佣金类型*/),value:this.props.getOne.ibcomsnTypeName},{key:i18n.t(200703/*佣金数值*/),value:this.props.getOne.ibcomsnNums},{key:i18n.t(200704/*佣金人*/),value:this.props.getOne["ibcomsnPerson"+language]},{key:i18n.t(200705/*佣金币种*/),value:this.props.getOne["ibcomsnCny"+language]}]}/>
		                </div>
	               	</div>
	                <Dialog visible={this.state.visible} title={this.state.dialogTitle} width={926}>
		                {commonForm}
		            </Dialog>
               	</div>
			);
	}

}
export default NavConnect(ProductDetail);
