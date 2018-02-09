import React, { Component,PropTypes } from 'react';
import i18n from './../../../lib/i18n';
import "../../RuleTemplate/assets/_morekeys.less";
import Confirm from '../../Dialog/Confirm';

class Morekeys extends Component{
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
	showClick(id){
		this.setState({
			show:!this.state.show
		},()=>{
			document.getElementById(id).focus();
		})
	}
	handleClick(data,e){
		let edit = data.action;
		let datapost ={};
		let datat = this.props.datat();
		if(data.number == 0){
			if(datat.length != 1){
				 Confirm(i18n.t(400165/*只能选择一条数据编辑*/), {
				  done: () => {
				    console.log('ok, got it');
				}
		   	});
			}else{
			  datapost = data;
			  datapost.record = datat[0];
			  this.props.handleClick(e,datapost,null);
			}
		}else if(data.number==3){
			if(datat.length != 1){
				 Confirm(i18n.t(400165/*只能选择一条数据编辑*/), {
				  done: () => {
				    console.log('ok, got it');
				}
		   		});
			}else{
			  datapost = data;
			  datapost.record = datat[0];
			  this.props.handleClick(e,datapost,null);
			}
		}else{
			if(datat.length < 1 && data.number != 1){
				 Confirm(i18n.t(400166/*请选择至少一条数据进行*/)+edit, {
				  done: () => {
				    console.log('ok, got it');
				  }
				});
				return false;
			}
			  datapost = data;
			  datapost.record = datat[0];
			  this.props.handleClick(e,datapost,null);
		}	    
	}
	onBlur(){
		this.setState({
			show:false
		});
	}
	render(){
		let dom = this.props.iconArray.map((e,i) => {
			let d ={};
			return (<div className={'single'} key={i} onClick={this.handleClick.bind(this,e.data)}><i className={e.classn} ></i><span>{e.action}</span></div>)
		})
		return(<div className={'keys-all'} id={this.props.id +''} tabIndex="-1" onBlur = {this.onBlur}>
			<i className={'foddingicon fooding-zk_icon more'} onClick = {this.showClick.bind(this,this.props.id)} >
			</i>
			<div className={this.state.show ? 'morekeys':'morekeys hidden'}  >
				{dom}
			</div>
		</div>)
	}
}
export default Morekeys;
