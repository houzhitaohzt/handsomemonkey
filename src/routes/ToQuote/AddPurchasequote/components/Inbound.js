import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Measurement from  '../../../../components/RuleTemplate';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import Template1  from  '../../../Client/Detail/Content/components/Template1';
import {
    apiGet, apiPost, apiForm, API_FOODING_ERP, language, pageSize, sizeList, toDecimal,
    API_FOODING_DS
} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
export class ProductDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.addBeforeSaveClick = this.addBeforeSaveClick.bind(this);
        this.initProduct = this.initProduct.bind(this);
        this.maitouhandleClick = this.maitouhandleClick.bind(this);
        this.initMatou= this.initMatou.bind(this);
    }
    handleClick = (e, data, Template) => {
        // var that = this;
        // if(data.number ==2){
			// 		let dd = this.state.data.length>0?this.state.data[0].billId:false;
        // 	if(dd){
			// 			Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			// 		 done: () => {
			// 			 apiForm(API_FOODING_ERP,'/purquotation/price/delete',{billId:dd},(response)=>{
			// 				 ServiceTips({text:response.message,type:'sucess'});
			// 				 this.getList();
			// 			 },(error)=>{
			// 				 ServiceTips({text:error.message,type:'error'});
			// 			 })
			// 		 }
			// 	 });
			// 		}else {
			// 			ServiceTips({text:i18n.t(300066/*您确定要生成订单吗？*/),type:'error'});
			// 		}
        // }else{
        // 	let dialogTitle= data.action+data.name.title;
        // 	if(data.number == 0){
        // 		let id= data.record.billDtlId;
        // 		apiGet(API_FOODING_ERP,'/purquotation/price/getOne',{id:id},(response)=>{
			// 		let DialogTempalte = require('./requireDialog').default;
			// 		let element=React.createElement(DialogTempalte,
			// 			{onSaveAndClose:that.getList,onCancel:that.onCancel,
			// 				getOne:response.data,
			// 				data:data,
			// 				zhu:this.props.getOne,
			// 		});
			// 		that.setState({
			// 			visible:true,
		 //                dialogTitle:dialogTitle,
		 //                dilogTelmp:element
			// 		});
			// 	},(error)=>{
        //
			// 	})
        // 	}else {
        // 		let DialogTempalte = require('./requireDialog').default;
			// 	let element=React.createElement(DialogTempalte,
			// 			{onSaveAndClose:that.getList,onCancel:that.onCancel,
			// 				zhu:this.props.getOne,
			// 				data:data});
	     //    	this.setState({
	     //    	 	visible:true,
	     //            dialogTitle:dialogTitle,
	     //            dilogTelmp:element
	     //    	});
        // 	}
        // }
        let select = data.selectArr?data.selectArr[0]:null||data.record;
        let billId = this.state.productData.length>0?this.state.productData[0].billId:false;
        if(data.number ==2){
            if(billId){
                Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
                    done: () => {
                        apiForm(API_FOODING_ERP,'/purquotation/price/delete',{billId:billId},(response)=>{
                            ServiceTips({text:response.message,type:'sucess'});
                            this.initProduct();
                        },(error)=>{
                            ServiceTips({text:error.message,type:'error'});
                        });
                    }
                });
            }else {
                ServiceTips({text:i18n.t(300066/*您确定要生成订单吗？*/),type:'error'});
            }

        }else{

            let dialogTitle= data.action+data.name.title;
            this.setState({
                visible:true,
                dialogTitle:dialogTitle,
                dilogTelmp:Template
            });

        }
    }
     addBeforeSaveClick(initAjax){
    	if(this.props.id){
    		initAjax();
    	}else{
    		this.props.getForm(true,initAjax);
    	}
    }
    onSaveAndClose(value){
   //      var that = this;
   //      value = Object.assign({},value,{billId:this.props.id});
   //      apiPost(API_FOODING_ERP,'/purquotation/price/save',value,(response)=>{
   //      	ServiceTips({text:response.message,type:'sucess'});
   //      	that.getList();
   //      },(error)=>{
			// ServiceTips({text:error.message,type:'error'});
   //      });
   //      this.setState({visible:false});
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
            titleArray:[],
            initData:{}
        }
	}
    componentDidMount(){
       this.handleResize();
        if(this.props.id){
        	 this.getList();
        }
        window.addEventListener('resize', this.handleResize(20));
    }
    initProduct(){
    	var that = this;
    	apiGet(API_FOODING_ERP,'/purquotation/price/getList',{billId:this.props.id},(response)=>{
    		that.setState({
                productData:response.data || []
    		});
    	},(error)=>{

    	});
    }
    initMatou(){
        apiGet(API_FOODING_ERP,'/purquotation/policy/getList',{billId:this.props.id},(response)=>{
            this.setState({
                maTouArray:response.data||[]
            });
        },(error)=>{

        });
    }
    maitouhandleClick(e, data, Template){
	    debugger
        let select = data.selectArr?data.selectArr[0]:null||data.record;
        if(data.number ==2){
            Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
                done: () => {
                    apiForm(API_FOODING_ERP,'/purquotation/policy/delete',{id:select.billDtlId},(response)=>{
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
    componentDidMount(){
        this.handleResize();
        if(this.props.id){
            apiPost(API_FOODING_DS,'/object/getMiniList',{obj:'com.fooding.fc.ds.entity.Item'},(response)=>{
                this.setState({
                    titleArray:response.data
                })
            },(error)=>{

            })
            this.initProduct();
            this.initMatou();
        }
        window.addEventListener('resize', this.handleResize(20));
    }
	render(){
		const commonForm = this.state.dilogTelmp;
		let getOne = this.props.getOne;
		return (
			  <div>
	               <div style={{backgroundColor:'#f0f4f8',marginTop:'10px'}}>
		               <div>
		                    <Measurement
								isPanDuan={true}
								menuList={[
									{type:'add'},
									{type:'delete'},
									{type:'edit'}
								]}
								 title ={i18n.t(200938/*区间价格*/)}
			                    addBeforeSaveClick={this.addBeforeSaveClick}
                                otherData = {{getOne:this.props.getOne,initData:this.state.initData}}
                                onSaveAndClose={this.initProduct}
                                openDialog={this.handleClick}
                                DialogTempalte ={require('../dialog/ProductOrder').default}
			               		onCancel = {this.onCancel}
			                    id={'41'}
			                     showHeader ={true}
			                     menuItems={[0,2]}
								iconArray={[0,2]}
			                     columns ={
			                    	[{
										title : i18n.t(200939/*起始数值*/),
										dataIndex : 'sNum',
										key : "sNum",
										width : '18%',
										uom:getOne['uom'+language],
										render(data,row,index){
											return(<div>{data?data+ ' ' + getOne['uom'+language]:0+ ' ' + getOne['uom'+language]}</div>)
										}
									},{
										title : i18n.t(200940/*终止数值*/),
										dataIndex : "eNum",
										key : "eNum",
										width : "25%",
										uom:getOne['uom'+language],
										render(data,row,index){
											return(<div>{data?data+ ' ' + getOne['uom'+language]:''}</div>)
										}
									},{
										title : i18n.t(200080/*类型*/),
										dataIndex : "countType",
										key : "countType",
										width : "25%",
										render(data,row,index){
											return <div>{row.countTypeName}</div>;
										}
									},{
										title : i18n.t(200954/*金额/比例*/),
										dataIndex : "convertValue",
										key : "convertValue",
										width : "18%",
										render(data,row,index){
											return data;
										}
									},{
										title : i18n.t(200942/*送到价*/),
										dataIndex : "sendPrc",
										key : "sendPrc",
										width : "18%",
										cny:getOne['cny'+language],
										render(data,row,index){
											return(<div>{data?toDecimal(data)+ ' ' + getOne['cny'+language]:''}</div>)
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
                               onCancel ={this.onCancel} title ={i18n.t(200943/*策略*/)}
                               id={'32'}
                               addBeforeSaveClick = {this.addBeforeSaveClick}
                               otherData = {{getOne:this.props.getOne,initData:this.state.initData}}
                               openDialog={this.maitouhandleClick}
                               onSaveAndClose={this.initMatou}
                               DialogTempalte ={require('../dialog/maTou').default}
                               showHeader ={true}
                               columns ={
                                   [{
                                       title : i18n.t(100087/*国家*/),
                                       className:'text-center',
                                       dataIndex : 'country'+language,
                                       key : 'country'+language,
                                       width : '10%',
                                       render(data,row,index){
                                           return (<div title={data}>{data}</div>)
                                       }
                                   },{
                                       title : i18n.t(200944/*国家定价类型*/),
                                       width : "30%",
                                       className:'text-center',
                                       width:'15%',
                                       dataIndex : "countryTypeName",
                                       key : "countryTypeName",
                                       render(data,row,index){
                                           return (<div title={data}>{data}</div>)
                                       }
                                   },
                                       {
                                           title : i18n.t(200945/*国家定价金额/比例*/),
                                           width : '10%',
                                           dataIndex : "countryValue",
                                           key : "countryValue",
                                           render(data,row,index){
                                               return data;
                                           }
                                       },
                                       {
                                           title : i18n.t(200946/*终端客户定价类型*/),
                                           width : "15%",
                                           className:'text-center',
                                           dataIndex : "beTypeName",
                                           key : "beTypeName",
                                           render(data,row,index){
                                               return data;
                                           }
                                       },{
                                       title : i18n.t(200947/*终端客户定价金额/比例*/),
                                       dataIndex : "beValue",
                                       width : "15%",
                                       className:'text-center',
                                       key : "beValue",
                                       render(data,row,index){
                                           return data;
                                       }
                                   },
                                       {
                                           title : i18n.t(200948/*贸易公司定价类型*/),
                                           width : "15%",
                                           className:'text-center',
                                           dataIndex : "ccTypeName",
                                           key : "ccTypeName",
                                           render(data,row,index){
                                               return data;
                                           }
                                       },
                                       {
                                           title : i18n.t(200949/*贸易公司定价金额/比例*/),
                                           width : "15%",
                                           className:'text-center',
                                           dataIndex : "ccValue",
                                           key : "ccValue",
                                           render(data,row,index){
                                               return data;
                                           }
                                       }]
                               }
                               data={this.state.maTouArray}
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
