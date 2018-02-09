import i18n from './../../../../../lib/i18n';
/**产品详情模块*/
import React, { Component,PropTypes } from 'react';
import RightKey from '../../../../../components/RightKey/RightKey';
import TraderulesDetailDialog from './TraderulesDetailDialog';
export class DetailTemplate extends Component{
	constructor(props){
		super(props);
		this.handleClick=this.handleClick.bind(this);
		this.addClick = this.addClick.bind(this);
		}
		handleClick(e, data, target){
			this.props.openDialog(data,<TraderulesDetailDialog 
				onSaveAndClose ={this.props.onSaveAndClose}
				onCancel ={this.props.onCancel}
				data ={data} id = {this.props.id}/>);

		}
		addClick(data){
			let number={number:1};
			let {onSaveAndClose,onCancel} = this.props;
			this.props.openDialog(data,<TraderulesDetailDialog 
				onSaveAndClose ={onSaveAndClose}
				onCancel ={onCancel}
				data ={number} id = {data.id}/>);
		}
		componentDidMount(){
			//console.log(this.props.route)
		}
		render(){
			let array = [
		        {type:i18n.t(100439/*编辑*/),child:<div><i className='foddingicon fooding-alter_icon2'></i>{i18n.t(100439/*编辑*/)}</div>}
		    ];
			let {tempArray,title}= this.props;
			return (
				  <RightKey id = {this.props.id} isShowMenu={true} handleClick ={this.handleClick} data ={{id:this.props.id,title:this.props.title,data:tempArray}} array = {array}>
					<div className='template1 traderules'>
						<span>{this.props.title}</span>
						<i className='foddingicon fooding-add-icon3' onClick={this.addClick.bind(this,{action:i18n.t(100392/*新增*/),name:{title:this.props.title},id:this.props.id})}></i>
					</div>
				</RightKey>
				)
		}
}
export default DetailTemplate
