/**常规模块
 */
import React, {Component} from 'react';
import RightKey from '../../../../../components/RightKey/RightKey';
import Dialog1 from './Template1Dialog';
import {apiGet, permissionsBtn} from "../../../../../services/apiCall";
import {I18n} from "../../../../../lib/i18n";
import UUID from 'uuid';
//引入提示
import Tooltip from 'antd/lib/tooltip';
export class Template1 extends Component{ 
	constructor(props){
		super(props);
		this.state = {
		    id: UUID.v4()
        };
		this.handleClick=this.handleClick.bind(this);
		this.editClick = this.handleClick.bind(this);
	}
	static defaultProps = {
		isShowIcon:true
	}
		handleClick = (e, data, target) => {
	        /*
	        	AjaxInit 是否进行初始化，一般有用于编辑和少部分新增
				数据开始进行初始化
				params 请求传到参数 是一个对象
				API_FOODING 传的是API_FOODING_DS,或者API_FOODING_ES
				portname 请求网址 eg:'/address/getInit'
			*/
			console.log(data);
	        if(this.props.AjaxInit){
	        	apiGet(this.props.API_FOODING,this.props.portname,this.props.params, response => {
	        		let initData = response.data;
	        		let DialogTempalte = this.props.DialogTempalte;
		        	if(DialogTempalte){
		        		let element=React.createElement(DialogTempalte,
							{onSaveAndClose:this.props.onSaveAndClose,onCancel:this.props.onCancel,
								data:data,id:this.props.id,initData:initData,info:this.props.info,upload:this.props.upload
						});
						 this.props.openDialog(e,data,element);
						return false;
		        	}
		        	this.props.openDialog(e,data,<Dialog1 onCancel = {this.props.onCancel} onSaveAndClose={this.props.onSaveAndClose} upload={this.props.upload} data = {data} initData={initData} />);
	        	},error => {
	        		return false;
	        	})
	        }else{
	        	/*
	        		没有进行ajax请求 ，暂时留着
	        	*/
	        	let DialogTempalte = this.props.DialogTempalte;
	        	if(DialogTempalte){
	        		let element=React.createElement(DialogTempalte,
						{onSaveAndClose:this.props.onSaveAndClose,onCancel:this.props.onCancel,
							data:data,id:this.props.id,info:this.props.info,upload:this.props.upload
					});
					 this.props.openDialog(e,data,element);
					return false;
	        	}
	        	this.props.openDialog(e,data,<Dialog1 onCancel = {this.props.onCancel} onSaveAndClose={this.props.onSaveAndClose} data = {data} />);
	        }
	    }
		componentDidMount(){
			//console.log(this.props.route)
		}
		render(){
			let {menuList=[],tempArray,title,allData,isShowIcon}= this.props;
			let  tt = menuList[0]?menuList[0].type:'';
			allData?allData:{};
			return (
				<div>
				  <RightKey id = {this.state.id} isShowMenu={this.props.isShowMenu} handleClick ={this.handleClick} data ={{id:this.props.id,title:this.props.title,data:tempArray,allData:allData,responseData:this.props.responseData}} array = {menuList.filter( (o)=>o['permissions'] ? permissionsBtn(o['permissions']) : 1 )} style={{zIndex:99}}>
					<div className={this.props.perfixCel?this.props.perfixCel:'template1'}style={{zIndex:this.props.Zindex}}>
						<div className='item-title' >{title}
							<span onClick={this.handleClick.bind(this,null,{action:tt,name:{id:this.props.id,title:this.props.title,data:tempArray,allData:allData,responseData:this.props.responseData}})}  style={{float:'right'}}>
							{
								isShowIcon?<i className='foddingicon fooding-alter_icon2' style={{cursor:"pointer"}}></i>:""
							}
						</span>
						</div>
						<div style={{margin:'10px',padding:'10px'}}>
							{
								tempArray.map((value,i)=>{
									return (<div key ={i}>
										
										 <Tooltip
												placement="topLeft"
												mouseEnterDelay={0.2}
												mouseLeaveDelay={0.1}
												overlay={value.value?value.value:' '}
											>	
										<p>{value.value?value.value:' '}</p>
		                          							
										</Tooltip>
									</div>)
								})
							}
						</div>
					</div>
				</RightKey>
				</div>
				)
		}
}
export default Template1
