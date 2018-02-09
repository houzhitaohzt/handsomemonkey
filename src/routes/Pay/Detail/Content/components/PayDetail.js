import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Template1  from  '../../../../Client/Detail/Content/components/Template1';
import MeasureCommon from  '../../../../../components/RuleTemplate';
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import Dialog  from '../../../../../components/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';
import Normal from "./Normal";
import Select, {Option,ConstMiniSelect} from '../../../../../components/Select';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips'; // 提示
export class GatherDetail extends Component{
	constructor(props) {
        super(props);
        this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
        this.state=this.initState();
        this.paySave = this.paySave.bind(this);
        this.getOneCall = this.getOneCall.bind(this);
        this.chexiaoClick = this.chexiaoClick.bind(this);
    }
    //核销
    hexiaoClick = () => {
        let {getOne = {}} = this.state;
        apiPost(API_FOODING_ERP,'/invoiceverification/getVeriInfo',{billId:getOne.billId,billType:getOne.billType}, response => {
            let content=require('./HexiaoDialog').default;
            let element=React.createElement(content,{onCancel:this.onCancel,getOne:response.data||{},valueone:getOne,onSaveAndClose:this.onhexiaoClick});
            this.setState({
                visible:true,
                title:i18n.t(200597/*核销*/),
                dilogTelmp:element,
            });
        },error => ServiceTips({text:error.message,type:'error'}))
    }
    onhexiaoClick = () => {
        this.setState({visible:false},() => this.getOneCall());
    }
    //查看发票核销
    approveClick = () => {
        let {getOne = {}} = this.state;
        let content=require('./ApprovialDialog').default;
        let element=React.createElement(content,{onCancel:this.onCancel,billId:getOne.billId,getOne:getOne});
        this.setState({
            visible:true,
            title:i18n.t(200598/*核销记录*/),
            dilogTelmp:element,
        });         
    }
    chexiaoClick(){
        let that = this;
         Confirm(i18n.t(200823/*您确定要撤销付款单*/), {
              done: () => {
                    apiForm(API_FOODING_ERP,'/payment/cancel',{billId:this.state.id},(response)=>{
                            that.props.navRemoveTab({name: i18n.t(200824/*付款单详情*/), component: i18n.t(200824/*付款单详情*/), url: '/pay/detail'});
                            that.props.navReplaceTab({name:i18n.t(200825/*付款单*/),component:i18n.t(200825/*付款单*/),url:'/pay/list'});
                            that.props.router.push({ pathname: '/pay/list'});
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
    paySave(value){
        //付款保存
         value = Object.assign({},value,{sourceId:this.state.getOne.billId});
         apiPost(API_FOODING_ERP,'/payment/pay',value,(response)=>{
            this.setState({visible:false});
            this.getOneCall();
            ServiceTips({text:response.message,type:'sucess'});
         },(error)=>{
            ServiceTips({text:error.message,type:'error'});
         })
    }
   paymentClick = (e, data, Template) => {
        let content=require('../../../List/components/PayPlug').default;
            let element=React.createElement(content,{onCancel:this.onCancel,DialogContent:2,getOne:this.state.getOne,onSaveAndClose:this.paySave});
            this.setState({
                visible : true,
                title: i18n.t(100132/*付款*/),
                dilogTelmp: element,
                dialogFile:'../../../List/components/PayPlug'
            })
    }
    recordClick = (e, data, Template) => {
        apiGet(API_FOODING_ERP,'/payment/getRecordList',{billId:this.state.getOne.billId},(response)=>{
            let content=require('./Record').default;
            let element=React.createElement(content,{onCancel:this.onCancel,
                DialogContent:1,
                getOneCall:this.getOneCall,
                getOne:this.state.getOne,
                tableSources:response.data||[]});
            this.setState({
                dilogTelmp:element
            })
        },(error)=>{

        })
        this.setState({
            visible : true,
            title: i18n.t(200826/*收付款记录*/),
            dilogTelmp:<div></div>
        })
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
            title:'',
            dilogTelmp:<div></div>,
            getOne:{},
            id:this.props.location.query.id
        }
	}
    editCllick(){

    }
    getOneCall(){
        apiGet(API_FOODING_ERP,'/payment/getOne',{billId:this.state.id},(response)=>{
            this.setState({
                getOne:response.data||{}
            });
        },(error)=>{

        })
    }
    componentDidMount(){
        this.handleResize();
        this.getOneCall();
        window.addEventListener('resize', this.handleResize(20));
    }
    handleResize(height){
        let sch=document.body.offsetHeight-100;
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
		return (
			  <div className='activity-detail scroll' style={{height:this.state.scrollHeight}}>
	               <Normal  recordClick = {this.recordClick} 
                   paymentClick={this.paymentClick} 
                   chexiaoClick = {this.chexiaoClick}
                   hexiaoClick = {this.hexiaoClick}
                   approveClick = {this.approveClick}
                   getOne={this.state.getOne}/>
                   <Dialog width={926} visible={this.state.visible} title={this.state.title}>
                    {commonForm}
                   </Dialog>
               </div>
			);
	}

}
export default NavConnect(GatherDetail);
