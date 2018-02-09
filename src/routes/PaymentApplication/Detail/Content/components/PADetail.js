import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import Measurement from  '../../../../../components/RuleTemplate';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import PANormal from "./Normal";
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
import OnlyreadyRuleTemplate from  '../../../../../components/OnlyreadyRuleTemplate';
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
                this.EditClick = this.EditClick.bind(this);
                this.deleteClick = this.deleteClick.bind(this);
                this.shenpiClick = this.shenpiClick.bind(this);
                this.onCancel = this.onCancel.bind(this);
                this.chexiaoClick = this.chexiaoClick.bind(this);
    }
    chexiaoClick(){
        let that = this;
         Confirm(i18n.t(200857/*您确定要撤销付款申请*/), {
              done: () => {
                    apiForm(API_FOODING_ERP,'/paymentapplcat/cancel',{billId:this.state.id},(response)=>{
                            that.props.navRemoveTab({name: i18n.t(200405/*付款申请详情*/), component: i18n.t(200405/*付款申请详情*/), url: '/paymentApplication/detail'});
                            that.props.navReplaceTab({name:i18n.t(400040/*付款申请*/),component:i18n.t(400040/*付款申请*/),url:'/paymentApplication/list'});
                            that.props.router.push({ pathname: '/paymentApplication/list'});
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
        apiGet(API_FOODING_ERP,'/paymentapplcat/getOne',{billId:this.state.id},(response)=>{
            this.setState({
                getOne:response.data
            });
        },(error)=>{

        })
    }
    shenpiClick(){
        let {getOne = {}} = this.state;
        let billId = getOne.billId,billType = getOne.billType;
        let content = require('../../../../PruchaseOrder/Detail/Content/components/ApprovalDialog').default;
        let element = React.createElement(content, {onCancel: this.onCancel,billType:billType,billId:billId});
        this.setState({
                showDilaog: true,
                title: i18n.t(100470/*查看审批*/),
                dialogContent: element,
                showHeader:true
        })
    }
    onCancel(){
        this.setState({
            showDilaog:false,
        });
    }
    deleteClick(){
        let that = this;
        Confirm(i18n.t(200735/*您确定要删除吗*/), {
              done: () => {
                    apiForm(API_FOODING_ERP,'/paymentapplcat/delete',{billId:this.state.id},(response)=>{
                        that.props.navRemoveTab({name: i18n.t(200405/*付款申请详情*/), component: i18n.t(200405/*付款申请详情*/), url: '/paymentApplication/detail'});
                        that.props.navReplaceTab({name:i18n.t(400040/*付款申请*/),component:i18n.t(400040/*付款申请*/),url:'/paymentApplication/list'});
                        that.props.router.push({ pathname: '/paymentApplication/list'});
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
    EditClick(){
        let that = this;
        this.props.navRemoveTab({name: i18n.t(200405/*付款申请详情*/), component: i18n.t(200405/*付款申请详情*/), url: '/paymentApplication/detail'});
        this.props.navAddTab({name:i18n.t(200858/*付款申请修改*/),component:i18n.t(200858/*付款申请修改*/),url:'/paymentApplication/addEidt'});
        this.props.router.push({ pathname: '/paymentApplication/addEidt',query:{id:this.state.id}});
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
            getOne:{}
        }
	}
    componentDidMount(){
        this.handleResize();
        this.getOne();
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
        let {getOne} = this.state;
		return (
			  <div className='activity-detail  scroll' style={{height:this.state.scrollHeight,padding:'0px'}}>
	               <PANormal  getOne ={this.state.getOne}
                   EditClick = {this.EditClick}
                   deleteClick={this.deleteClick}
                   getOneCall={this.getOne}
                   shenpiClick = {this.shenpiClick}
                   chexiaoClick = {this.chexiaoClick}
                   router ={this.props.router}
                   />
                   <div style ={{marginTop:'10px'}}>
                        <OnlyreadyRuleTemplate onCancel ={this.onCancel} title ={i18n.t(200844/*付款计划*/)} openDialog={this.handleClick}
                                     id={'37'}
                                     showHeader ={true}
                                            columns ={
                                              [{
                                            title : i18n.t(100181/*款项类型*/),
                                            dataIndex :  'fundTy'+language,
                                            key : 'fundTy'+language,
                                            width : '25%',
                                            render(data,row,index){
                                                return (<div title={data}>{data}</div>)
                                            }
                                        },{
                                            title : i18n.t(200622/*期数*/),
                                            dataIndex : "periodNum",
                                            key : "periodNum",
                                            width : "25%",
                                            render(data,row,index){
                                                return data;

                                            }
                                        },
                                        {
                                            title : i18n.t(200840/*申请付款时间*/),
                                            dataIndex : "predictPayDate",
                                            key : "predictPayDate",
                                            width : "25%",
                                            render(data,row,index){
                                                return new Date(data).Format('yyyy-MM-dd');

                                            }
                                        },
                                        {
                                            title : i18n.t(200841/*申请付款金额*/),
                                            dataIndex : "predictPayAmt",
                                            key : "predictPayAmt",
                                            width : "25%",
                                            className:'text-right',
                                            render(data,row,index){
                                                return <div>{toDecimal(data)+' '+getOne["cny"+language]}</div>;
                                                
                                            }
                                        }]
                                            }
                                        data={getOne.planList ||[]}
                                />
                   </div>
                   <div style ={{marginTop:'10px'}}>
                        <Template1
                            menuList={[
                                {type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
                            ]}
                            onCancel ={this.onCancel}
                            isShowMenu={true}
                            openDialog={this.handleClick}
                            onSaveAndClose={this.onSaveAndClose}
                            id={'product-detail-1'}
                            title={i18n.t(100140/*组织*/)}
                            isShowIcon={false}
                            tempArray={[
                                    {key:i18n.t(100243/*集团*/),value:getOne["cluster"+language]},
                                    {key:i18n.t(100486/*公司*/),value:getOne["cc"+language]}

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