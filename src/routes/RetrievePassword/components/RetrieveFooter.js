import i18n from './../../../lib/i18n';
import React ,{Component,PropTypes} from 'react';



// ajax

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';




class RetrieveFooter extends Component{
	constructor(props){
		super(props);

		// init Func 
		
	}


	// 帮助中心 
	handleHelp = ()=>{
		ServiceTips({text:'正在建设中...',type:'info'});
	}

	// 服务条款 
	handleClause = ()=>{
		ServiceTips({text:'正在建设中...',type:'info'});
	}

	// 隐私政策 
	handlePolicy = ()=>{
		ServiceTips({text:'正在建设中...',type:'info'});
	}

	// 问题反馈 
	handleFeedback = ()=>{
		ServiceTips({text:'正在建设中...',type:'info'});
	}

	// 关于我们 
	handleSynopsis = ()=>{

	}


	render(){
		let classN;
		if(this.props.footerClassName){
			classN = this.props.footerClassName
		}else {
			classN = 'retrievepassword-foot';
		}
		return(<div className={classN}>

			<div className={'retrievepassword-foot-help-about'}>
				{/*<a href='#' onClick={this.handleClause} className={'chained rightborder'}>{i18n.t(200670*//*服务条款*//*)}</a>*/}
				{/*<a href='#' onClick={this.handlePolicy} className={'chained rightborder'}>{i18n.t(200671*//*隐私政策*//*)}</a>*/}
				{/*<a href='#' onClick={this.handleFeedback} className={'chained rightborder'}>{i18n.t(200672*//*问题反馈*//*)}</a>*/}
				{/*<a href='#' onClick={this.handleSynopsis} className={'chained'}>{i18n.t(200673*//*关于我们*//*)}</a>*/}
			</div>
			
			<div className={'retrievepassword-foot-describe'}>
				<span>1993 - 2017 怒吼科技(中国)有限公司所有</span>
				<span className={'image'}></span>
				<span>{i18n.t(200674/*沪ICP备15058071号*/)}</span>
			</div>				
		</div>)
	}
}
export default RetrieveFooter;
