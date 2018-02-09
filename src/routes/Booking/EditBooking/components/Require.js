import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Measurement from  '../../../../components/RuleTemplate';
import OnlyreadyRuleTemplate from  '../../../../components/OnlyreadyRuleTemplate';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import Template1  from  '../../../Client/Detail/Content/components/Template1';
import ServiceTips from '../../../../components/ServiceTips';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../services/apiCall";
export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.initProduct = this.initProduct.bind(this);

         //装箱要求
        this.zhuangXianghandleClick = this.zhuangXianghandleClick.bind(this);
        this.initzhuangXiang = this.initzhuangXiang.bind(this);
    }
    initProduct(billId){
    	apiGet(API_FOODING_ERP,'/shipping/getMtls',{billId:this.props.id},(response)=>{
    		this.setState({
    			productData:response.data||[]
    		});
    	},(error)=>{

    	});
    }
    zhuangXianghandleClick(e, data, Template){
    	let select = data.selectArr?data.selectArr[0]:null||data.record;
    	if(data.number ==2){
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				  done: () => {
				   apiForm(API_FOODING_ERP,'/shipping/pakg/delete',{id:select.billDtlId},(response)=>{
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
            productData:[],
            dilogTelmp:<div></div>,
            zhuangXiangArray:[]
        }
	}
    componentDidMount(){
        this.handleResize();
        this.initProduct();
        this.initzhuangXiang();
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
		                	 <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(500077/*订单产品*/)} openDialog={this.handleClick}
			                    onSaveAndClose={this.onSaveAndClose}
			                    showHeader ={true}
			                    columns ={
			                    	[
			                    	{
										title : i18n.t(500061/*产品名称*/),
										dataIndex : 'mtl'+language,
										key : 'mtl'+language,
										width : '5%',
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
									}]
			                    }
			                    data={this.state.productData}
			                />
		                </div>
		                <div style={{marginTop:'10px'}}>
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
							      DialogTempalte ={require('./zhuangXiang').default}
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
