import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';

import "../assets/_morekeys.less";
import Confirm from '../../Dialog/Confirm';
import {permissionsBtn} from "../../../services/apiCall";

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

		if(this.props.isPanDuan){
			datapost = data;
			datapost.record = datat[0];
			this.props.handleClick(e,datapost,null);
			return;
		}
		if(data.number == 0){//编辑
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
		}else if(data.number == 2){//删除 就不用传record进来(这样可以根据有没有record来判断是右键的删除还是点击之后的再删除)
			if(datat.length < 1 && data.number != 1){
				 Confirm(i18n.t(400166/*请选择至少一条数据进行*/)+edit, {
				  done: () => {
				    console.log('ok, got it');
				  }
				});
				return false;
			}
			  datapost = data;
			  this.props.handleClick(e,datapost,null);
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
		let {showKey=true} = this.props;
		let dom = this.props.iconArray.filter(o=>o['permissions'] ? permissionsBtn(o['permissions']) : 1).map((e,i) => {
			let d={};
			return (<div data-permissions={e['permissions']} className={'single pointer'} key={i} onClick={this.handleClick.bind(this,e.data)}>
				<i className={e.classn} ></i>
				<span>{e.action}</span>
			</div>)
		})
		return(<div className={'keys-all'} id={this.props.id +''} tabIndex="-1" onBlur = {this.onBlur}>
			<i className={showKey ? 'foddingicon fooding-zk_icon more' : 'hide'} onClick = {this.showClick.bind(this,this.props.id)} ></i>
			<div className={this.state.show ? 'morekeys':'morekeys hidden'}  >
				{dom}
			</div>
		</div>)
	}
}
export default Morekeys;
