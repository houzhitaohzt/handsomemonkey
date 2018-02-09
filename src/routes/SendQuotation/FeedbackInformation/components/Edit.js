import React, {Component} from 'react';
import Confirm from '../../../../components/Dialog/Confirm';
import {errorTips, successTips} from "../../../../components/ServiceTips"; //提示框
import {API_FOODING_ERP, apiPost} from "../../../../services/apiCall";
import i18n from '../../../../lib/i18n';

export default class Edit extends Component{
	constructor(props){
		super(props);
		this.checkLen=this.checkLen.bind(this);
		this.maxLength = 300;
		this.state={
			num: this.maxLength,
            textValue: '',
		}
	}

    subFeedback = ()=>{
	    let value = this.state.textValue.trim();
	    if(value === '') return Confirm(i18n.t(200039/*请先输入反馈信息!*/));
	    let {businessOne} = this.props;
        this.setState({textValue: ''});
        apiPost(API_FOODING_ERP, '/feedback/save', {
            context: value,
            enquiryNo: businessOne.enquiryNo,
            billId: businessOne.billId
        }, response => {
            successTips(response.message);
            this.props.getPages();
        }, error => {
            errorTips(error.message);
        })
    };

	checkLen(e){
		let curNum = e.target.value.length;
		let number;
		if(curNum > this.maxLength){
            // errorTips(i18n.t(200117/*文字已经不能输入*/));
			return false
		}
		number = this.maxLength - curNum;
		this.setState({
			num : number,
            textValue: e.target.value,
		})
	}
	render(){
		return(<div className={'annotation-content-input'}>
			<div className={'annotation-content-input-textarea'}>
				<div><span style={{color:'red',margin:'0px 3px'}}>*</span><span className="annotation-show">{i18n.t(200041/*内容*/)}</span>{i18n.t(200040/*还可以输入*/)}<span>{this.state.num}</span>{i18n.t(200042/*字符*/)}</div>
				<textarea onChange={this.checkLen} value={this.state.textValue}></textarea>
				<input type='button' value={i18n.t(200043/*确定*/)} className={'button'} onClick={this.subFeedback}/>
			</div>
		</div>)
	}
}
