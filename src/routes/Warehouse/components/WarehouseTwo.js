import i18n from './../../../lib/i18n';
/**常规模块
*/
import React, { Component,PropTypes } from 'react';
import RightKey from '../../../components/RightKey/RightKey';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
export class WarehouseOne extends Component{
	constructor(props){
		super(props);
		this.handleClick=this.handleClick.bind(this);
		}
		handleClick = (e, data, target) => {
	        // const count = parseInt(target.getAttribute('data-count'), 10);
	        	let DialogTempalte = this.props.DialogTempalte;
	        	if(DialogTempalte){
	        		apiGet(API_FOODING_DS,'/storArea/getOne',{id:this.props.treeInfo.props.label.id},(response)=>{
						let value = response.data;
						let element=React.createElement(DialogTempalte,
							{onSaveAndClose:this.props.onSaveAndClose,onCancel:this.props.onCancel,onSaveAdd:this.props.onSaveAdd,
								data:data,id:this.props.id,tempArray:this.props.tempArray,otherData:value,treeInfo:this.props.treeInfo
						});
						 this.props.openDialog(e,data,element);
					},(error)=>{

					})
	       
	        	}
	    }
		componentDidMount(){
			console.log(this.props.route)
		}
		render(){
			let {tempArray,title}= this.props;
			let array = [
		        {type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
		    ];
			if(tempArray.length >1){
				return (
				 <RightKey id = {this.props.id} isShowMenu={this.props.isShowMenu} handleClick ={this.handleClick} data ={{id:this.props.id,title:this.props.title,data:tempArray,responseData:this.props.responseData}} array = {array}>
					<div className={'menu-view girdlayout'}>
					<div className='menu-view-title'><span>{title}</span><i className={'foddingicon fooding-alter_icon2'} onClick={this.handleClick.bind(null,this,{id:this.props.id,title:this.props.title,data:tempArray})} title={i18n.t(100439/*编辑*/)}></i></div>
					<div className={'row'}>
						<div className={'form-group col-xs-4 col-md-4 col-lg-4'}>
							<label className={'col-xs-3 col-md-3 col-lg-3'}>{tempArray[0].key}</label>
							<div className={'col-xs-9 col-md-9 col-lgl-9'}>
								<p className={'paragraph'}>{tempArray[0].value}</p>
							</div>
						</div>
						<div className={'form-group col-xs-4 col-md-4 col-lg-4'}>
							<label className={'col-xs-3 col-md-3 col-lg-3'}>{tempArray[1].key}</label>
							<div className={'col-xs-9 col-md-9 col-lgl-9'}>
								<p className={'paragraph'}>{tempArray[1].value}</p>
							</div>
						</div>
						<div className={'form-group col-xs-4 col-md-4 col-lg-4'}>
							<label className={'col-xs-3 col-md-3 col-lg-3'}>{tempArray[2].key}</label>
							<div className={'col-xs-9 col-md-9 col-lgl-9'}>
								<p className={'paragraph'}>{tempArray[2].value}</p>
							</div>
						</div>
					</div>
					<div className={'row'}>
						<div className={'form-group col-xs-4 col-md-4 col-lg-4'}>
							<label className={'col-xs-3 col-md-3 col-lg-3'}>{tempArray[3].key}</label>
							<div className={'col-xs-9 col-md-9 col-lgl-9'}>
								<p className={'paragraph'}>{tempArray[3].value}</p>
							</div>
						</div>
						<div className={'form-group col-xs-4 col-md-4 col-lg-4'}>
							<label className={'col-xs-3 col-md-3 col-lg-3'}>{tempArray[4].key}</label>
							<div className={'col-xs-9 col-md-9 col-lgl-9'}>
								<p className={'paragraph'}>{tempArray[4].value}</p>
							</div>
						</div>
						
					</div>
					<div className={'row'}>
						<div className={'form-group col-xs-4 col-md-4 col-lg-4'}>
							<label className={'col-xs-3 col-md-3 col-lg-3'}>{tempArray[5].key}</label>
							<div className={'col-xs-9 col-md-9 col-lgl-9'}>
								<p className={'paragraph'}>{tempArray[5].value}</p>
							</div>
						</div>
					</div>
				</div>
				</RightKey>
				)
			}else {
				return <div></div>
			}
			
		}
}
export default WarehouseOne;
