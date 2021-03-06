/*
	create by houzhitao
*/

import React, { Component,PropTypes } from 'react';
import CommonActivity from "../../../Activity/SingleList/CommonActivity";

class ProviderContactActivity extends Component{
	constructor(props){
		super(props)
        props.activity && props.activity(this);
        this.getPage = this.getPage.bind(this);
    }
    getPage(){
        this.activity.getPages();
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
	*/
	render(){
		let salBeLcName = this.props.detail.enterprise?this.props.detail.enterprise.localName:"";
		let salBeEnName = this.props.detail.enterprise?this.props.detail.enterprise.name:"";
		let salBeId = this.props.detail.enterprise?this.props.detail.enterprise.id:"";
		return(<CommonActivity pageIdent='providerLinkman' type={"providercontact"} activityType={30}
							   activity ={no => this.activity = no}  isDetail ={true}
							   router={this.props.router} salBeId={salBeId} salBeLcName={salBeLcName} salBeEnName = {salBeEnName} typeNumber={100}/>)
	}
}
export default ProviderContactActivity;