import React, { Component,PropTypes } from 'react';

import "./stateshow.less";

class StateShow extends Component{
	constructor(props) {
	  super(props);
	  this.state=this.initState();
	}
	initState(){
		return {

		}
	}
	static propTypes = {
		status:React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.number
		]),
		statusName:React.PropTypes.string,
		styleObj:React.PropTypes.object
	};

	static defaultProps = {
	  status:1, //状态默认给1 是草稿状态
	  statusName:"草稿",
	  styleObj:{}
	};

	isWhichStatu = () => {
		let classN = "status status-draft";
		let {status} = this.props;
		if(status == 1){//草稿状态
			classN = "status status-draft";
		}else if(status == 5){//提交状态
			classN = "status status-submit";
		}else if(status == 10){//已审批
			classN = "status status-approval";
		}else if(status == 15){//开启
			classN = "status status-start";
		}else if(status == 20){//关闭
			classN="status status-end";
		}
		return classN;
	};

	render(){
		let singleClass = this.isWhichStatu();
		let styleObj = this.props.styleObj;
		return(<span className={singleClass} style={{...styleObj}}>{this.props.statusName}</span>)
	}
}
export default StateShow;