import React, { Component,PropTypes } from 'react';
import ErpContactDate from "../../../ErpCommonContact/SingleList/CommonContDate";

class QuotationContact extends Component{
	constructor(props){
		super(props)
        props.contact && props.contact(this);
        this.getPages = this.getPages.bind(this);
    }
    getPages(){
        this.contact.getPages();
    }
	/*
		salBeId ID
		salBeLcName 本地名称
		salBeEnName 因为名称
		typeNumber  判断显示那一个值 

		客户 typeNumber = 10
		供应商 typeNuber = 20
		服务机构 typeNumber = 30
		市场活动 typeNumber = 40
		商机 typeNumber = 50
		销售订单 typeNumber = 60
		采购订单 typeNumber = 70
		订舱单 typeNumber = 80
		销售报价 typeNumber = 140
	*/
	render(){
		let salBeLcName = this.props.getOne.salBeLcName || "";
		let salBeEnName = this.props.getOne.salBeEnName || "";
		let salBeId = this.props.getOne.salBeId || "";
		let originalId = this.props.location.query.id || "";
		return(<ErpContactDate  type={"quotation"} activityType={20}
								contact ={no => this.contact = no}  isDetail ={true}
								router={this.props.router} salBeId={salBeId} salBeLcName={salBeLcName} salBeEnName = {salBeEnName} typeNumber={140} originalId={originalId}/>)
	}
}
export default QuotationContact;