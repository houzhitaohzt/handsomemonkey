import i18n from './../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import SODetailsHead from '../../routes/SalesOrder/Detail/Header/SODetailsHead';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList } from "../../services/apiCall";
import ServiceTips from '../../components/ServiceTips';
import Dialog from '../../components/Dialog/Dialog';//弹层

import DetailCommon from  '../../common/DetailCommon';
import Detail from  '../../routes/SalesOrder/Detail/Content/components/SalesOrderDetail';
import Costconfirmation from  '../../routes/SalesOrder/Costconfirmation/components/Portfht';
import Email from  '../../routes/SalesOrder/Email/components/Email';
import Contact from  '../../routes/SalesOrder/Contact/components/SaleOrderContact';
import Date from  '../../routes/SalesOrder/Date/components/SaleOrderDate';
import Print from  '../../routes/SalesOrder/Print/components/print';
import Accessory from  '../../routes/SalesOrder/Accessory/components/Accessory';
import Annotation from  '../../routes/SalesOrder/Annotation/components/Annotation';
import Share from  '../../routes/SalesOrder/Share/components/Share';
import Confirm from "../../components/Dialog/Confirm";
export class SODetailLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
			id:this.props.location.query.id,
			getOne:{},
			value:{},
            curentId:DetailCommon.saleOrder[this.props.location.query.id] || this.props.location.query.index  || 'detail',
            isDetail:false
		};
		this.onPackUp =this.onPackUp.bind(this);
		this.handleResize=this.handleResize.bind(this);
		this.shenpiClick = this.shenpiClick.bind(this);
		this.tuihuoClick = this.tuihuoClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.fapiaoClick = this.fapiaoClick.bind(this);
		this.zuofeiClick = this.zuofeiClick.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
        this.dingCang = this.dingCang.bind(this);
    }
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){
            this.detail.getPage();
            this.setState({
                isDetail:true
            });
        }else if(obj.id == 'costconfirmation' && !obj.isLoading){
            this.costconfirmation.getPage();
        }else if(obj.id == 'email' && !obj.isLoading){
            this.email.getPage();
        }else if(obj.id == 'contact' && !obj.isLoading){
            this.contact.getPage();
        }else if(obj.id == 'date' && !obj.isLoading){
            this.date.getPage();
        }else if(obj.id == 'print' && !obj.isLoading){

        }else if(obj.id == 'accessory' && !obj.isLoading){
            this.accessory.getPage();
        }else if(obj.id == 'annotation' && !obj.isLoading){
            this.annotation.getPage();
        }else if(obj.id == 'share' && !obj.isLoading){
            this.share.getPages();
        }
        DetailCommon.saleOrder[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
    }
    zuofeiClick(){
    	let that = this;
    	let {getOne = {}} = this.state;
		let content = require('./ZuoFeiDialog').default;
	    let element = React.createElement(content, {onCancel: this.onCancel, onPackUp:this.onPackUp,
	    	router:this.props.router,
	    	getOne:getOne});
	    this.setState({
	            showDilaog: true,
	            title: i18n.t(100471/*作废*/),
	            dialogContent: element
	    });
    }
    fapiaoClick(){
    	let that = this;
    	let {getOne = {}} = this.state;
		let content = require('./FaPiao').default;
	    let element = React.createElement(content, {onCancel: this.onCancel,router:this.props.router,
	    	getOne:getOne});
	    this.setState({
	            showDilaog: true,
	            title: i18n.t(200606/*销售发票*/),
	            dialogContent: element
	    });
    }
    onCancel(){
    	this.setState({
	            showDilaog: false
	    });
    }
    tuihuoClick(){
    	let {getOne = {}} = this.state;
		let content = require('./TuihuoDiaolog').default;
	    let element = React.createElement(content, {onCancel: this.onCancel,router:this.props.router,
	    	getOne:getOne});
	    this.setState({
	            showDilaog: true,
	            title: i18n.t(201049/*销售退货*/),
	            dialogContent: element
	    });
    }
    dingCang(){
		debugger
        let that = this;
        let {getOne = {}} = this.state;
        if(!getOne.billType) return;
        if(getOne.incotmId!=10 || getOne.forwarderBeId){
            Confirm("您确定要执行订舱指令吗？", {
                done: () => {
                    apiPost(API_FOODING_ERP,"/saleorder/shipping",{billId:getOne.billId},response => {
                        //刷新当前页面
                        this.onPackUp();
                        ServiceTips({text:response.message,type:"success"})
                    },error => {
                        ServiceTips({text:error.message,type:'error'})
                    })
                },
                close:() => {
                    console.log('no, close')
                }
            });
		}else if(getOne.incotmId == 10 && getOne.forwarderBeId==null){
            let content = require('./Selecthuodai').default;
            let element = React.createElement(content, {onCancel: this.onCancel,router:this.props.router, getOne:getOne,onSaveAndClose:this.onSaveShipping});
					this.setState({
						showDilaog: true,
						title:i18n.t(500335/*选择货代公司*/),
						dialogContent: element,
						showHeader:true
					})
		}

    }

    onSaveShipping = (data,value) => {
        let {getOne = {}} = this.state;
        let param = Object.assign({},{billId:getOne.billId},data);
		this.setState({showDilaog:false},() => {
            Confirm("您确定要执行订舱指令吗？", {
                done: () => {
                    apiPost(API_FOODING_ERP,"/saleorder/shipping",param,response => {
                        //刷新当前页面
                        this.onPackUp();
                        ServiceTips({text:response.message,type:"success"})
                    },error => {
                        ServiceTips({text:error.message,type:'error'})
                    })
                }
            });
		})
	};

    shenpiClick(){
    	let {getOne = {}} = this.state;
		let billId = getOne.billId,billType = getOne.billType;
		let content = require('../../routes/PruchaseOrder/Detail/Content/components/ApprovalDialog').default;
	    let element = React.createElement(content, {onCancel: this.onCancel,billType:billType,billId:billId});
	    this.setState({
	            showDilaog: true,
	            title: i18n.t(100470/*查看审批*/),
	            dialogContent: element,
	            showHeader:false
	    })
    }

	// 发送模板 
	sendTemplateHandle = ()=> {
    	let {getOne = {}} = this.state;
		let content = require('../../routes/Common_confirm/sendTpl').default;
		let element = React.createElement(content, {
			active:'salesorder',
			getOne:getOne,
			onCancel: this.onCancel,
		});

		this.setState({
			showDilaog: true,
			title: i18n.t(600293/*发送模板*/),
			dialogContent: element,
			showHeader:false
		}) 
	}

    onPackUp(topnum,obj){
    	apiGet(API_FOODING_ERP,'/saleorder/getOne',{billId:this.state.id},(response)=>{
			this.setState({
				getOne:response.data,
				value:response.data
			},()=>{
                if(obj){
                    this.onClickLink({id:this.state.curentId,isLoading:false})
                }
            });
		},(error)=>{

		})
    };
	handleResize(){
		let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
	};
	componentDidMount(){
        let sch=document.body.offsetHeight-this.state.paddingTop;
		this.setState({scrollHeight:sch+'px'});
		// window.addEventListener('resize', this.handleResize);
		this.onPackUp(null,true);

    };
	componentWillUnmount() {
    	// window.removeEventListener('resize', this.handleResize);
  	};
	render(){
		let children=Object.assign({},this.props.children,{});
		let newProps=Object.assign({},children.props,{paddingTop:this.state.paddingTop,getOne:this.state.getOne,id:this.state.id,value:this.state.value});
		children.props=newProps;
		return (

			<div className='container-body'>
				<SODetailsHead  onPackUp={this.onPackUp} id={this.state.id}
				 shenpiClick = {this.shenpiClick}
				 tuihuoClick = {this.tuihuoClick}
				dingCang = {this.dingCang}
				 fapiaoClick = {this.fapiaoClick}
				 zuofeiClick = {this.zuofeiClick}
				 curentId ={this.state.curentId}
				 onClickLink ={this.onClickLink}
				 sendTemplateHandle={this.sendTemplateHandle}
				 getOne={this.state.getOne}/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div className={this.state.curentId == 'detail' ?"":"none"}>
						<Detail {...newProps} isDetail ={this.state.isDetail} detail ={no => this.detail = no}/>
					</div>
					<div className={this.state.curentId == 'costconfirmation' ?"":"none"}>
						<Costconfirmation {...newProps} costconfirmation={no => this.costconfirmation = no} isDetail={true}/>
					</div>
					<div className={this.state.curentId == 'email' ?"":"none"}>
						<Email {...newProps} email={no => this.email = no} isDetail={true}/>
					</div>
					<div className={this.state.curentId == 'contact' ?"":"none"}>
						<Contact {...newProps} contact={no => this.contact = no} isDetail={true}/>
					</div>
					<div className={this.state.curentId == 'date' ?"":"none"}>
						<Date {...newProps} date={no => this.date = no} isDetail={true}/>
					</div>
					<div className={this.state.curentId == 'print' ?"":"none"}>
						<Print {...newProps}  isDetail={true}/>
					</div>
					<div className={this.state.curentId == 'accessory' ?"":"none"}>
						<Accessory {...newProps}  isDetail={true} accessory={no => this.accessory = no} />
					</div>
					<div className={this.state.curentId == 'annotation' ?"":"none"}>
						<Annotation {...newProps}  isDetail={true} annotation={no => this.annotation = no} />
					</div>
					<div className={this.state.curentId == 'share' ?"":"none"}>
						<Share {...newProps}  isDetail={true} share={no => this.share = no} />
					</div>
			    </div>
			     <Dialog showHeader={true} width={926} visible={this.state.showDilaog} title={this.state.title}>
					{this.state.dialogContent}
				</Dialog>
			</div>
			);
	}
}
SODetailLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default SODetailLayout

