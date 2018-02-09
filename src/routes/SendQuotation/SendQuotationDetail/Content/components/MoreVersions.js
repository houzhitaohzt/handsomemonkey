import i18n from './../../../../../lib/i18n';
import React, {Component} from 'react';
import "../../../../../components/RuleTemplate/assets/_morekeys.less";

class MoreVersions extends Component{
	constructor(props){
		super(props)
		this.showClick=this.showClick.bind(this);
		this.state=this.initState();
		this.onBlur = this.onBlur.bind(this);
	}
	initState(){
		return{
			show:false,
		}
	}
	showClick(){
		this.setState({
			show:!this.state.show
		},()=>{
			document.getElementById('versions').focus();
		})
	}
	handleClick(data,e){
		
	}
	onBlur(){
		this.setState({
			show:false
		});
	}
	render(){
		let dom = this.props.iconArray.map((e,i) => {
			return (<div className={'single'} key={i} onClick={this.handleClick.bind(this,e.data)}><span>{e.data}</span></div>)
		})
		return(<div className={'keys-all'} id={'versions'} tabIndex="-1" onBlur = {this.onBlur} style={{left:'20px',top:'8px',right:'0px',width:'20px'}}>
			<i className={'foddingicon fooding-zk_icon more'} onClick = {this.showClick.bind(this)} >
			</i>
			<div className={this.state.show ? 'morekeys':'morekeys hidden'}  style={{minWidth:'20px'}}>
				{dom}
			</div>
		</div>)
	}
}
export default MoreVersions;
