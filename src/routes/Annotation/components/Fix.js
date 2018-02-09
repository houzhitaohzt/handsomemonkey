import React,{Component} from 'react';
import i18n from './../../../lib/i18n';
export default class Fix extends Component{

	render(){
		const bol = this.props.bol
		const len = this.props.len
		let commentAll;
		if(bol){
			commentAll = (<div className={'annotation-content-comment-all'}>
				<span>{i18n.t(300043/*全部注释 */)}&nbsp;&nbsp;({len})</span>
			</div>)
		}else{
			commentAll=(<div className={'annotation-content-comment-fix'}>
				<div>
					<span>{i18n.t(300043/*全部注释 */)}&nbsp;&nbsp;({len})</span>

				</div>
			</div>);
		}
		return (
				<div>{commentAll}</div>
			);
	}
}


/*
<i className={'foddingicon fooding-add-icon3'}></i>*/
