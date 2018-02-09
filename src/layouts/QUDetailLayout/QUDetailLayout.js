import i18n from './../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import ReactDOM from 'react-dom'
import '../CoreLayout/CoreLayout.less'
import '../../styles/core.less'
import Header from '../../components/Header'
import SODetailsHead from '../../routes/Quotation/Detail/Header/QUDetailsHead';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList } from "../../services/apiCall";
import ServiceTips from '../../components/ServiceTips';
import Dialog from '../../components/Dialog/Dialog';//弹层

import DetailCommon from  '../../common/DetailCommon';
import Detail from  '../../routes/Quotation/Detail/Content/components/QuotationDetail';
import Email  from  '../../routes/Quotation/Email/components/Email';
import Contact from  '../../routes/Quotation/Contact/components/QuotationContact';
import Date from  '../../routes/Quotation/Date/components/QuotationDate';
import Accessory  from '../../routes/Quotation/Accessory/components/Accessory';
import SalesOrder from '../../routes/Quotation/SaleOrder/components/BODetailSalesOrder';
import Annotation from '../../routes/Quotation/Annotation/components/Annotation';
export class SODetailLayout extends Component{
	constructor(props) {
		super(props);
		this.state={
			paddingTop:226,
			id:this.props.location.query.id,
			getOne:{},
            curentId:DetailCommon.quotation[this.props.location.query.id] || this.props.location.query.index || 'detail',
		};
		this.onPackUp =this.onPackUp.bind(this);
		this.handleResize=this.handleResize.bind(this);
		this.shenpiClick = this.shenpiClick.bind(this);
		this.onCancel= this.onCancel.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
    }
    onClickLink(obj){
        let that = this;
        if(obj.id == 'detail' && !this.state.isDetail){
            // this.detail.getTableInitData();
            this.setState({
                isDetail:true
            });
        }else if(obj.id == 'email' && !obj.isLoading){
            this.email.getPage();
        }else if(obj.id == 'contact' && !obj.isLoading){
            this.contact.getPages();
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
        DetailCommon.quotation[this.props.location.query.id] = obj.id;
        that.setState({
            curentId:obj.id
        });
    }
    onCancel(){
    	this.setState({
	            showDilaog: false
	    });
    }
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
			active:'quotation',
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
    	apiGet(API_FOODING_ERP,'/saleoffer/getOne',{billId:this.state.id},(response)=>{
			this.setState({
				getOne:response.data
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
		let newProps=Object.assign({},children.props,{
			paddingTop:this.state.paddingTop,
			getOne:this.state.getOne,id:this.state.id,
			value:this.state.getOne
		});
		children.props=newProps;
		return (

			<div className='container-body'>
				<SODetailsHead  onPackUp={this.onPackUp} id={this.state.id}
								curentId ={this.state.curentId}
								onClickLink ={this.onClickLink}
								sendTemplateHandle={this.sendTemplateHandle}
				getOne={this.state.getOne} shenpiClick ={this.shenpiClick}/>
			    <div className={'detail-layout__viewport'} style={{paddingTop:this.state.paddingTop}}>
					<div>
						<div className={this.state.curentId == 'detail' ?"":"none"}>
							<Detail {...newProps} detail ={no => this.detail = no} isDetail ={this.state.isDetail} />
						</div>
						<div className={this.state.curentId == 'email' ?"":"none"}>
							<Email {...newProps} email ={no => this.email = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'contact' ?"":"none"}>
							<Contact {...newProps} contact ={no => this.contact = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'date' ?"":"none"}>
							<Date {...newProps} date ={no => this.date = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'accessory' ?"":"none"}>
							<Accessory {...newProps} accessory ={no => this.accessory = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'salesOrder' ?"":"none"}>
							<SalesOrder {...newProps} salesOrder ={no => this.salesOrder = no} isDetail ={true} />
						</div>
						<div className={this.state.curentId == 'annotation' ?"":"none"}>
							<Annotation {...newProps} annotation ={no => this.annotation = no} isDetail ={true} />
						</div>
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