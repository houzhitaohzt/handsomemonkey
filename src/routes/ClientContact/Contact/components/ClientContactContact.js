/*
	create by houzhitao
*/

import React, { Component,PropTypes } from 'react';
import DsContactDate from "../../../DsCommonContact/SingleList/CommonContDate";

class ClientContactContact extends Component{
	constructor(props){
		super(props)
        props.contact && props.contact(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
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
		货代 typeNumber = 90
		供应商联系人 typeNumber = 100
		服务机构联系人 typeNumber = 110
		客户联系人 typeNumber = 120
	*/
	render(){
		let salBeLcName = this.props.detail.enterprise?this.props.detail.enterprise.localName:"";
		let salBeEnName = this.props.detail.enterprise?this.props.detail.enterprise.name:"";
		let salBeId = this.props.detail.enterprise?this.props.detail.enterprise.id:"";
		return(<DsContactDate  pageIdent='clientLinkman' type={"clientcontactcontact"}
							   contact ={no => this.contact = no} isDetail ={true}
							   activityType={20} router={this.props.router} salBeId={salBeId} salBeLcName={salBeLcName} salBeEnName = {salBeEnName} typeNumber={120}/>)
	}
}
export default ClientContactContact;