import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import OnlyreadyRuleTemplate from  '../../../../../components/OnlyreadyRuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../../services/apiCall";
export class ProductDetail extends Component{
    constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
        this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.initProduct = this.initProduct.bind(this);
        this.initMatou= this.initMatou.bind(this);
    }
    initProduct(billId){
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
                        <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(200938/*区间价格*/)}
                                               openDialog={this.handleClick}
                                               onSaveAndClose={this.onSaveAndClose}
                                               id={'30'}
                                               showHeader ={true}
                                               columns ={
                                                   [{
                                                       title : i18n.t(200939/*起始数值*/),
                                                       dataIndex : 'sNum',
                                                       key : 'sNum',
                                                       width : '20%',
                                                       ignore_equals: true,
                                                       render(data,row,index){
                                                           return(<div>{data?data+ ' ' + getOne['uom'+language]:0+ ' ' + getOne['uom'+language]}</div>)
                                                       }
                                                   },{
                                                       title : i18n.t(200940/*终止数值*/),
                                                       dataIndex : "eNum",
                                                       key : "eNum",
                                                       width : "20%",
                                                       ignore_equals: true,
                                                       render(data,row,index){
                                                           return(<div>{data?data+ ' ' + getOne['uom'+language]:''}</div>)
                                                       }
                                                   },{
                                                       title : i18n.t(200080/*类型*/),
                                                       dataIndex : "countTypeName",
                                                       key : "countTypeName",
                                                       width : "20%",
                                                       render(data,row,index){
                                                           return data;
                                                       }
                                                   },{
                                                       title : i18n.t(200941/*金额比例*/),
                                                       dataIndex :"convertValue",
                                                       key :"convertValue",
                                                       width : "20%",
                                                       render(data,row,index){
                                                           return (<div>{data}</div>)
                                                       }
                                                   },{
                                                       title : i18n.t(200942/*送到价*/),
                                                       dataIndex :"sendPrc",
                                                       key :"sendPrc",
                                                       width : "20%",
                                                       ignore_equals: true,
                                                       render(data,row,index){
                                                           return(<div>{data?toDecimal(data)+ ' ' + getOne['cny'+language]:''}</div>)
                                                       }
                                                   }]
                                               }
                                               data={this.state.productData}
                        />
                        <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(200943/*策略*/)} openDialog={this.handleClick}
                                               id={'32'}
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
