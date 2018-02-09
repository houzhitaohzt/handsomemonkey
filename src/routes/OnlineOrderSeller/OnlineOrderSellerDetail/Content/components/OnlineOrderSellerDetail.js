import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import OnlyreadyRuleTemplate from  '../../../../../components/OnlyreadyRuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import ShippingInstructions from "./ShippingInstructions";//装运要求
import CommerceClause from "./CommerceClause";//商务条款
import BuyerInformation from "./BuyerInformation";//买方信息
import SellerInformation from "./SellerInformation";//卖方信息
import ServiceTips, {errorTips, successTips} from "../../../../../components/ServiceTips";//提示框
 import {I18n} from '../../../../../lib/i18n';
import {apiGet, apiPost, apiForm, API_FOODING_ERP, API_FOODING_DS, language} from '../../../../../services/apiCall';
export class OnlineOrderBuyerDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
    }
   handleClick = (e, data, Template) => {
        if (data.number == 2) {
            console.log("delete", data)
        } else {
            let dialogTitle = data.action + data.name.title;
            this.setState({
                visible: true,
                dialogTitle: dialogTitle,
                dilogTelmp: Template
            });
        }
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
            dilogTelmp:<div></div>
        }
	}
    componentDidMount(){
        this.handleResize();
        window.addEventListener('resize', this.handleResize(0));
    }
    handleResize(height){
        let sch=document.body.offsetHeight-280;
        this.setState({scrollHeight:sch+'px',scroll:scroll});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize(0));
    }
    componentWillReceiveProps(nextProps){
        this.handleResize(0);
        window.addEventListener('resize', this.handleResize(0));    
    }
	render(){
         const {businessOne} = this.props;
		const commonForm = this.state.dilogTelmp;   
       
		return (
			  <div> 
	               <div className='scroll' style={{backgroundColor:'#f0f4f8',
	               height:this.state.scrollHeight,overflow:'auto'}}> 
                        <div style={{padding:'0 10px',backgroundColor:'#f0f4f8'}}>
                            <CommerceClause {...this.props}/>
                            <ShippingInstructions {...this.props}/>
                            <BuyerInformation {...this.props}/>
                            <SellerInformation {...this.props}/>
                            <OnlyreadyRuleTemplate onCancel={this.onCancel} title={i18n.t(500077/*订单产品*/)}
                                               Zindex={4}
                                               showHeader={true}
                                               checkedRowsArray={[]}
                                               id={'sendquotation-detail-01'}
                                               columns={
                                                   [{
                                                       title:I18n.t(100377/*产品编码*/),
                                                       dataIndex: 'code',
                                                       key: "code",
                                                       width: '7%',
                                                       render(data, row, index){
                                                           return (<div title={data}>{data}</div>)
                                                       }
                                                      },{
                                                           title:I18n.t(500061/*产品名称*/),
                                                           dataIndex: 'mtlLcName',
                                                           key: "mtlLcName",
                                                           width: '10%',
                                                           tooltip(data,record,index){
                                                               return record.mtlEnName || "";
                                                           },
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       },{
                                                           title:I18n.t(100382/*产品规格*/),
                                                           dataIndex: 'basSpeci',
                                                           key: "basSpeci",
                                                           width: '12%',
                                                           render(data, row, index){
                                                               return (<div title={data} className={'text-ellipsis'}>{data}</div>)
                                                           }
                                                       },{
                                                           title: I18n.t(400012/*品牌*/),
                                                           dataIndex: 'brandLcName',
                                                           key: "brandLcName",
                                                           width: '6%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       },{
                                                           title:  I18n.t(500065/*需求数量*/),
                                                           dataIndex: 'requireQty',
                                                           key: "requireQty",
                                                           width: '6%',

                                                           render(data, row, index){
                                                               return (<div>{data?(data+' '+row.uomLcName):''}</div>)
                                                           }
                                                       },{
                                                           title:  I18n.t(500066/*成交价*/),
                                                           dataIndex: "aimPrc",
                                                           key: "aimPrc",
                                                           width: "10%",
                                                           ignore_equals: true,
                                                           render(data, row, index){
                                                              
                                                               return(<div>{data?data+ ' ' + businessOne['cny'+language]:''}</div>)
                                                           }
                                                       },{
                                                       title:  I18n.t(500067/*包装*/),
                                                       dataIndex: "packagLcName",
                                                       key: "packagLcName",
                                                       width: "8%",
                                                       render(data, row, index){
                                                           return data;
                                                       }
                                                   },{
                                                       title:  I18n.t(500068/*托盘*/),
                                                       dataIndex: "salvrLcName",
                                                       key: "salvrLcName",
                                                       width: "8%",
                                                       render(data, row, index){
                                                           return data;
                                                       }
                                                   },{
                                                       title:  I18n.t(500069/*可否混装*/),
                                                       dataIndex: "canMixedStowage",
                                                       key: "canMixedStowage",
                                                       width: "8%",
                                                       render(data, row, index){
                                                           return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                                           //return data ?I18n.t(100141/*是*/):I18n.t(100142/*否*/);
                                                       }
                                                   }]
                                               }
                                               data={this.props.productData}
                        />   
                        </div>
                        <div className={'col'}>
                            <OnlyreadyRuleTemplate onCancel={this.onCancel} title={i18n.t(500078/*证书要求*/)}
                                               Zindex={5}
                                               showHeader={true}
                                               checkedRowsArray={[]}
                                               id={'sendquotation-detail-02'}
                                               columns={
                                                   [
                                                       {
                                                           title: I18n.t(500070/*证书名称*/),
                                                           dataIndex: 'cardLcName',
                                                           key: "cardLcName",
                                                           width: '50%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       },
                                                       {
                                                           title:I18n.t(500071/*是否加急*/),
                                                           dataIndex: 'gentMark',
                                                           key: "gentMark",
                                                           width: '25%',
                                                           render(data, row, index){
                                                               return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                                               //return (<div title={data}>{data ?I18n.t(100141/*是*/):I18n.t(100142/*否*/)}</div>)
                                                           }
                                                       },
                                                       {
                                                           title: I18n.t(500072/*是否正本*/),
                                                           dataIndex: 'origMark',
                                                           key: "origMark",
                                                           width: '25%',
                                                           render(data, row, index){
                                                               return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                                                               //return (<div title={data}>{data ? I18n.t(100141/*是*/):I18n.t(100142/*否*/)}</div>)
                                                           }
                                                       }]
                                               }
                                               data={this.props.cardData}
                        />
                            <OnlyreadyRuleTemplate onCancel={this.onCancel} title={i18n.t(500079/*检验要求*/)}
                                               Zindex={4}
                                               showHeader={true}
                                               columns={
                                                   [
                                                       {
                                                           title: I18n.t(500061/*产品名称*/),
                                                           dataIndex: 'mtlLcName',
                                                           key: "mtlLcName",
                                                           width: '50%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       },
                                                       {
                                                           title: I18n.t(500073/*测试项目*/),
                                                           dataIndex: 'testItmLcName',
                                                           key: "testItmLcName",
                                                           width: '25%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       },
                                                       {
                                                           title:I18n.t(100606/*测试方法*/),
                                                           dataIndex: 'testMethLcName',
                                                           key: "testMethLcName",
                                                           width: '25%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       }]
                                               }
                                               data={this.props.testData}
                        />
                        </div>
                        <div className={'col'}>
                            <OnlyreadyRuleTemplate onCancel={this.onCancel} title={i18n.t(100512/*船公司要求*/)}
                                               Zindex={4}
                                               showHeader={true}
                                               checkedRowsArray={[]}
                                               id={'sendquotation-detail-02'}
                                               columns={
                                                   [
                                                       {
                                                           title: I18n.t(500075/*指定/禁止*/),
                                                           dataIndex: 'spickTypeName',
                                                           key: "spickTypeName",
                                                           width: '50%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       },
                                                       {
                                                           title:I18n.t(500076/*船公司*/),
                                                           dataIndex: 'shipBeLcName',
                                                           key: "shipBeLcName",
                                                           width: '25%',
                                                           render(data, row, index){
                                                               return (<div title={data}>{data}</div>)
                                                           }
                                                       }]
                                               }
                                               data={this.props.shipData}
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
export default OnlineOrderBuyerDetail;
