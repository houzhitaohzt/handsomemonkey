import i18n from './../../../lib/i18n';
/**常规模块
*/
import React, { Component,PropTypes } from 'react';
import RightKey from '../../../components/RightKey/RightKey';
// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
export class MenuTemp extends Component{
	constructor(props){
		super(props);
		this.handleClick=this.handleClick.bind(this);
	}
	handleClick = (e, data, target) => {
		/*
			同样，每一次编辑的时候，看是否需要一次ajax请求对数据进行初始化
		*/
			if(this.props.AjaxInit){
				let params = Object.assign({},this.props.params);
				apiGet(this.props.API_FOODING,this.props.portname,params,response => {
					let initData = response.data;
					let DialogTempalte = this.props.DialogTempalte;
		        	if(DialogTempalte){
		        		let element=React.createElement(DialogTempalte,
							{onSaveAndClose:this.props.onSaveAndClose,onCancel:this.props.onCancel,onSaveAdd:this.props.onSaveAdd,
								data:data,id:this.props.id,tempArray:this.props.tempArray,initData:initData,otherData:this.props.otherData,
								upload:this.props.upload
						});
						 this.props.openDialog(e,data,element);
						return false;
		        	}
				},error => {return false})
			}else{
				// const count = parseInt(target.getAttribute('data-count'), 10);
	        	let DialogTempalte = this.props.DialogTempalte;
	        	if(DialogTempalte){
	        		let element=React.createElement(DialogTempalte,
						{onSaveAndClose:this.props.onSaveAndClose,onCancel:this.props.onCancel,onSaveAdd:this.props.onSaveAdd,
							data:data,id:this.props.id,tempArray:this.props.tempArray,otherData:this.props.otherData,
							upload:this.props.upload
					});
					 this.props.openDialog(e,data,element);
					return false;
	        	}
			}	        
    	}
		
		componentDidMount(){
			console.log(this.props.route)
		}
		render(){
			let {permissions,tempArray,title}= this.props;
			let array = [
		        {permissions:permissions,type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
		    ];
			return (
				 <RightKey id = {this.props.id} isShowMenu={this.props.isShowMenu} handleClick ={this.handleClick} data ={{id:this.props.id,title:this.props.title,data:tempArray,responseData:this.props.responseData}} array = {array.filter(o=>o['permissions'] ? permissionsBtn(o['permissions']) : 1 )}>
					<div className={'menu-view'}>
						<div className='menu-view-title'><span>{title}</span>
						{ (array[0].permissions ? (permissionsBtn(array[0].permissions)) : 1) ?
							<i className={this.props.isShowMenu?'foddingicon fooding-alter_icon2':'none'} onClick={this.handleClick.bind(null,this,{id:this.props.id,title:this.props.title,data:tempArray})} title={i18n.t(100439/*编辑*/)}></i>
							:
							''
						}						
						</div>
						<ul className={'ul'}>
							{
								tempArray.map((value,i)=>{
									return (<li key ={i}><span>{value.key}</span><span>{value.value}</span></li>)
								})
							}
						</ul>
					</div>
				 </RightKey>
				)
		}
}
export default MenuTemp;
