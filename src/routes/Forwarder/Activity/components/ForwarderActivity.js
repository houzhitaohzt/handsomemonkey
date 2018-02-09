import React, { Component,PropTypes } from 'react';
import CommonActivity from "../../../Activity/SingleList/CommonActivity";

class ForwarderActivity extends Component{
	constructor(props){
		super(props);
        props.activity && props.activity(this);
        this.getPages = this.getPages.bind(this);
	}
    getPages(){
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
	*/
	render(){
		let salBeLcName = this.props.agnShipBeVo.localName || "";
		let salBeEnName = this.props.agnShipBeVo.name || "";
		let salBeId = this.props.location.query.id || "";
		return(<CommonActivity pageIdent='forwarder' type={"forwarder"} activityType={30}
							   activity ={no => this.activity = no}  isDetail ={true}
							   router={this.props.router} salBeId={salBeId} salBeLcName={salBeLcName} salBeEnName = {salBeEnName} typeNumber={90}/>)
	}
}
export default ForwarderActivity;