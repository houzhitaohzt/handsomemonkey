import React, { Component,PropTypes} from 'react';
import Select, { Option } from 'rc-select';
import {I18n} from "../../../lib/i18n";
//引入弹层
import Dialog from '../../Dialog/Dialog';
import {apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS } from "../../../services/apiCall";
export  class AddMoreLanguage extends Component{
	constructor (props) {
	    super(props);
	    this.state={
        	showDilaogsecond:false
        }
	    this.upload = this.upload.bind(this);
        this.nativeClick = this.nativeClick.bind(this);
        this.onCancelSecond = this.onCancelSecond.bind(this);
	}
	upload(){
		if(this.props.onCancel){
			this.props.onCancel();//关闭编辑弹框
		}
		if(this.props.isShowId){
			this.props.upload();
		}else {
			this.props.upload(this.props.menusetView.id);
		}
		
	}
	nativeClick = () => {
		let apiHost = this.props.apiHost || API_FOODING_DS;
		let content=require('../../../routes/MenuSetting/components/MoreLanguageSetDialog').default;
		let element=React.createElement(content,{onSaveAndClose:this.upload,
			menusetView:this.props.menusetView,
			apiHost:apiHost,
			object:this.props.object,
			attr:this.props.attr,
			onCancel:this.onCancelSecond})
    	this.setState({
    		showDilaogsecond : true,
    		title: I18n.t(100496/*多语言配置*/),
    		dialogContent: element
    	})
	}
	onCancelSecond = () => {
		this.setState({
			showDilaogsecond:false
		})
	}
  	render(){
		return (
			<div>
				<i className={'foddingicon fooding-nation_icon'} style={{position:'absolute',top:'9px',right:'10px',cursor:'pointer'}} onClick={this.nativeClick.bind(this,'cstmCrsekt')}></i>
				<Dialog width={976} visible={this.state.showDilaogsecond} title={this.state.title}>
							{this.state.dialogContent}
				</Dialog>
			</div>
			);
	}
}
export  default AddMoreLanguage;

