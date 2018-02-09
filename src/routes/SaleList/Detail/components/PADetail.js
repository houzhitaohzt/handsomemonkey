import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../Client/Detail/Content/components/Template1';
import Measurement from  '../../../../components/RuleTemplate';
import Dialog  from '../../../../components/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import PANormal from "./Normal";
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
import OnlyreadyRuleTemplate from  '../../../../components/OnlyreadyRuleTemplate';
export class PADetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.columns = 
				[
					{
						title : i18n.t(100181/*款项类型*/),
						dataIndex : 'paymentType',
						key : "paymentType",
						width : '25%',
						render(data,row,index){
							return (<div title={data}>{data}</div>)
						}
					},{
						title : i18n.t(200622/*期数*/),
						dataIndex : "period",
						key : "period",
						width : "25%",
						render(data,row,index){
							return data;
						}
					},{
						title : i18n.t(200840/*申请付款时间*/),
						dataIndex : "payTime",
						key : "payTime",
						width : "25%",
						render(data,row,index){
							return data;
						}
					},{
						title : i18n.t(200841/*申请付款金额*/),
						dataIndex : "payMoney",
						key : "payMoney",
						width : "25%",
						render(data,row,index){
							return (<div>{data?toDecimal(data):''}</div>)
						}
					}
				];
                this.getOne = this.getOne.bind(this);
                this.onCancel = this.onCancel.bind(this);
                this.getMtlList = this.getMtlList.bind(this);
                this.deleleClick = this.deleleClick.bind(this);
    }
    deleleClick(){
            let {getOne} = this.state;
            let {navRemoveTab,navAddTab,navReplaceTab}=this.props;
            Confirm("您确定要删除这条数据吗？", {
              done: () => {
                    apiForm(API_FOODING_ERP,'/saleorderreturn/delete',{billID:getOne.billId},(response)=>{
                            window.navTabs.replace(i18n.t(201049/*销售退货*/), "/saleorderreturn/list", {}, {refresh: true});
                            ServiceTips({text:response.message,type:'sucess'});
                    },(error)=>{
                            ServiceTips({text:error.message,type:'error'});
                    })
                },
                close:() => {
                    console.log('no, close')
                }
            });
    }
    getOne(){
        let that = this;
        apiGet(API_FOODING_ERP,'/saleorderreturn/getOne',{billId:this.state.id},(response)=>{
            this.setState({
                getOne:response.data
            });
        },(error)=>{

        })
    }
    onCancel(){
        this.setState({
            showDilaog:false,
        });
    }
    handleClick = (e, data, Template) => {
        if(data.number ==2){
        	 Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
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
    onSaveAndClose(values){
        console.log(values);
        this.setState({visible:false});
    }
    initState(){
        return {
            visible:false,
            dialogTitle:'',
            dilogTelmp:<div></div>,
            id:this.props.location.query.id,
            getOne:{},
            productData: [
							{paymentType :i18n.t(201050/*应付款*/),"period" : "1","payTime":"2017-01-11","payMoney":"144000CNY"},
                            {paymentType :i18n.t(201050/*应付款*/),"period" : "1","payTime":"2017-01-11","payMoney":"144000CNY"},
                            {paymentType :i18n.t(201050/*应付款*/),"period" : "1","payTime":"2017-01-11","payMoney":"144000CNY"},
                            {paymentType :i18n.t(201050/*应付款*/),"period" : "1","payTime":"2017-01-11","payMoney":"144000CNY"},

						]
        }
	}
    getMtlList(){
        let that = this;
        apiGet(API_FOODING_ERP,'/saleorderreturn/mtl/getList',{billId:this.state.id},
            (response)=>{
                this.setState({
                    planList:response.data
                });
            },(error)=>{

            })
    }
    componentDidMount(){
        this.handleResize();
        this.getOne();
        this.getMtlList();
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        let padding = 80;
        let sch=document.body.offsetHeight-height-padding;
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
		const commonForm = this.state.dilogTelmp;
        let that = this;
        let {getOne} = this.state;
		return (
			  <div className='activity-detail  scroll' style={{height:this.state.scrollHeight}}>
	               <PANormal  getOne ={this.state.getOne} 
                   deleleClick ={this.deleleClick}
                   getOneCall={this.getOne}
                   />
                   <div style ={{marginTop:'10px'}}>
                        <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(201051/*退货产品明细*/)} openDialog={this.handleClick}
                                     id={'37'}
                                     showHeader ={true}
                                            columns ={
                                              [{
                                title : i18n.t(100379/*产品*/),
                                dataIndex : 'mtl'+language,
                                key : "mtl"+language,
                                width : '10%',
                                render(data,row,index){
                                    return data;
                                }
                            },{
                                title : i18n.t(100382/*产品规格*/),
                                dataIndex : "basSpeci",
                                key : "basSpeci",
                                width : "10%",
                                render(data,row,index){
                                    return <div className={'text-ellipsis'}>{data}</div>;
                                }
                            },{
                                title : i18n.t(500067/*包装*/),
                                dataIndex : "packag"+language,
                                key : "packag"+language,
                                width : "10%",
                                render(data,row,index){
                                    return <div className={'text-ellipsis'}>{data}</div>;
                                }
                            },{
                                title : i18n.t(200846/*销售数量*/),
                                dataIndex : "salQty",
                                key : "salQty",
                                width : "10%",
                                render(data,row,index){
                                    return data;
                                }
                            },{
                                title : i18n.t(400101/*退货数量*/),
                                dataIndex : "returnQty",
                                key : "returnQty",
                                width : "10%",
                                ignore_equals: true,
                                render(data,row,index){
                                    return data;
                                }
                            },{
                                title : i18n.t(400035/*产品单位*/),
                                dataIndex : "uom"+language,
                                key : "uom"+language,
                                width : "10%",
                                render(data,row,index){
                                    return data;
                                }
                            },{
                                title : i18n.t(200847/*含税单价*/),
                                dataIndex : "salTaxPrc",
                                key : "salTaxPrc",
                                width : "10%",
                                cny:that.state.getOne["cny"+language],
                                render(data,row,index){
                                    return <div>{data?toDecimal(data)+' '+that.state.getOne["cny"+language]:0+that.state.getOne["cny"+language]}</div>;
                                }
                            },{
                                title : i18n.t(201052/*销售金额*/),
                                dataIndex : "0",
                                key : "0",
                                width : "10%",
                                ignore_equals: true,
                                render(data,row,index){
                                    return <div>{toDecimal(row.salTaxPrc*row.salQty)+' '+that.state.getOne["cny"+language]}</div>
                                }
                            },{
                                title : i18n.t(201053/*退货额*/),
                                dataIndex : "returnTaxAgg",
                                key : "returnTaxAgg",
                                width : "10%",
                                ignore_equals: true,
                                render(data,row,index){
                                    return <div>{data?toDecimal(data)+' '+that.state.getOne["cny"+language]:0+' '+that.state.getOne["cny"+language]}</div>
                                }
                            }]
                                            }
                                        data={this.state.planList ||[]}
                                />
                   </div>
                   <div style ={{marginTop:'10px'}}>
                        <Template1 
                            menuList={[
                                {type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
                            ]}
                            isShowMenu={false} 
                            openDialog={this.handleClick}
                            onSaveAndClose={this.onSaveAndClose}
                            onCancel = {this.onCancel}
                             isShowIcon={false}
                            id={'product-detail-1'} 
                            title={i18n.t(100140/*组织*/)} 
                            tempArray={[
                                    {key:i18n.t(100243/*集团*/),value:getOne["cluster"+language]},
                                    {key:i18n.t(100244/*企业*/),value:getOne["cc"+language]},
                                    {key:i18n.t(200119/*销售组织*/),value:getOne["sor"+language]},
                                    {key:i18n.t(400011/*销售员*/),value:getOne["saleStaff"+language]}
                                 
                                ]}
                        />
                    </div>
                     <Dialog width={926} visible={this.state.showDilaog} title={this.state.title} showHeader={this.state.showHeader}>
                        {this.state.dialogContent}
                    </Dialog>
               </div>
			);
	}

}
export default NavConnect(PADetail);