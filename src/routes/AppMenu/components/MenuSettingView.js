import i18n from './../../../lib/i18n';
/**常规模块
*/
import React, { Component,PropTypes } from 'react';
import RightKey from '../../../components/RightKey/RightKey';
import {permissionsBtn} from '../../../services/apiCall';

export class MenuTemp extends Component{
	constructor(props){
		super(props);
		this.handleClick=this.handleClick.bind(this);
		}
		handleClick = (e, data, target) => {
	        // const count = parseInt(target.getAttribute('data-count'), 10);
	        	let DialogTempalte = this.props.DialogTempalte;
	        	if(DialogTempalte){
	        		let element=React.createElement(DialogTempalte,
						{onSaveAndClose:this.props.onSaveAndClose,onCancel:this.props.onCancel,
							data:data,id:this.props.id,
							tempArray:this.props.tempArray,
							menusetView:this.props.menusetView,
							upload:this.props.upload
					});
					 this.props.openDialog(e,data,element);
					return false;
	        	}
	    }
		componentDidMount(){
			console.log(this.props.route)
		}
		render(){
			let array = [
		        {permissions:'menuset.edit',type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
		    ];
			let {tempArray,title}= this.props;
			return (
				  <RightKey id = {this.props.id} isShowMenu={this.props.isShowMenu} handleClick ={this.handleClick} data ={{id:this.props.id,title:this.props.title,data:tempArray}} array = {array.filter(o=>o['permissions'] ? permissionsBtn(o['permissions']) : 1 )} >
					<div className={'menu-view'}>
						<div className='menu-view-title'><span>{title}</span>
							{ permissionsBtn('menuset.edit') ?
								<i className={'foddingicon fooding-alter_icon2'} onClick={this.handleClick.bind(null,this,{id:this.props.id,title:this.props.title,data:tempArray})}></i>
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
