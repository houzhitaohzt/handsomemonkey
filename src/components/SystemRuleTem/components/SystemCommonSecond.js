import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
const {Table} =  require("../../Table");
import "../assets/_systemDetaill.less";
import MeasureCommonDialog from './SystemCommonDialog';
import RightKey from '../../RightKey/RightKey';
import Morekeys from "./Morekeys";

export class SystemCommon extends Component{
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.addClick=this.addClick.bind(this);
		this.onHeaderCellClick=this.onHeaderCellClick.bind(this);
		this.onRowClick=this.onRowClick.bind(this);
		this.state=this.initState();
	}
	initState(){
		this.datat = [];
		return{
			checkedRows:[],
			selectArr:[],
			choised:false,
			data:[]
		}
	}
	 onHeaderCellClick(e,data){

  	}
  	onRowClick(record,index,checked){

  	}
	addClick(data){
		let DialogTempalte = this.props.DialogTempalte;
		let element=React.createElement(DialogTempalte,
			{onSaveAndClose:this.props.onSaveAndClose,onCancel:this.props.onCancel,
				data:data,id:this.props.id
			});
		if(this.props.DialogTempalte){
			this.props.openDialog(null,data,element);
		}else{
			this.props.openDialog(null,data,<MeasureCommonDialog 
			onSaveAndClose ={this.props.onSaveAndClose}
			onCancel ={this.props.onCancel}
			data ={data} id = {data.id}/>);
		}
	}
	handleClick(e, data, target){
		let DialogTempalte = this.props.DialogTempalte;
		let element=React.createElement(DialogTempalte,
			{onSaveAndClose:this.props.onSaveAndClose,onCancel:this.props.onCancel,
				data:data,id:this.props.id
			});
		if(DialogTempalte){
			this.props.openDialog(e,data,element);
		}else{
			this.props.openDialog(e,data,<MeasureCommonDialog 
			onSaveAndClose ={this.props.onSaveAndClose}
			onCancel ={this.props.onCancel}
			data ={data} id = {this.props.id}/>);
		}
		
	}
	render(){
		let {array,title}= this.props;
		let arrayRightkey = [
	        {type:i18n.t(100392/*新增*/),child:<div><i className='foddingicon fooding-add-icon3'></i>{i18n.t(100392/*新增*/)}</div>}
	    ];
	    let iconArray=[{action:'查看',classn:'foddingicon fooding-approval',title:'查看',data:{action:'查看',number:0,name:{title:this.props.title},id:this.props.id}},
	    	{action:'添加',classn:'foddingicon fooding-add-icon3',title:i18n.t(100392/*新增*/),data:{action:i18n.t(100392/*新增*/),number:1,name:{title:this.props.title},id:this.props.id}},
	    	{action:i18n.t(100437/*删除*/),classn:'foddingicon fooding-delete-icon3',title:i18n.t(100437/*删除*/),data:{action:i18n.t(100437/*删除*/),number:2,name:{title:this.props.title},id:this.props.id}},
	    	{action:i18n.t(100439/*编辑*/),classn:'foddingicon fooding-alter_icon2',title:i18n.t(100439/*编辑*/),data:{action:i18n.t(100439/*编辑*/),number:3,name:{title:this.props.title},id:this.props.id}}
	    	];
		if(this.props.data.length == 0){
			return (
			<RightKey array={arrayRightkey} handleClick={this.addClick.bind(this,{action:i18n.t(100392/*新增*/),name:{title:this.props.title},id:this.props.id,number:1})} isShowMenu={true} id={this.props.id} >
				<div style={{width: '100%',overflow:'hidden',backgroundColor: '#fff',borderRadius: '6px',
				marginBottom:10,border:'1px solid #eeeeee'}} className='systemdetail-measurement'>
					<div>
						<div className='item-title-one'><span className='title'>{title}</span><span className='icon'><i className={'foddingicon fooding-add-icon3'} onClick={this.addClick.bind(this,{action:i18n.t(100392/*新增*/),name:{title:this.props.title},id:this.props.id,number:1})}></i></span></div>
					</div>
				</div>
			</RightKey>)
		}else{
			return (
			<div style={{width: '100%',backgroundColor: '#fff',borderRadius: '6px',zIndex:this.props.Zindex,
			border:'1px solid #eeeeee',marginBottom:10,position:"relative"}} className='systemdetail-measurement'>
				<div style={{bordeBottom:'1px solid #eeeeee'}}>
					<div className='item-title-one'>
						<span className='title'>{title}</span>
					</div>
				</div>
				<Morekeys iconArray={iconArray} id={this.props.id} datat ={()=>this.refs["mainTable" + this.props.id].getSelectArr()} handleClick ={this.handleClick}/>
				<Table  ref = {"mainTable" + this.props.id}
                            showHeader ={this.props.showHeader}
							columns={this.props.columns}
							data={this.props.data}
							checkboxConfig={{show:true, position:'last'}}
							colorFilterConfig={{show:false}}
							followConfig={{show:false}}
							scroll={{x:true,y:0}}
							onHeaderCellClick={this.onHeaderCellClick}
							onRowClick={this.onRowClick}
							onRowDoubleClick={this.onRowDoubleClick}
							contextMenuConfig={{
								enable:true,
								contextMenuId:'SystemCommon'+this.props.id,
								menuItems:[{
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-approval'}></i>查看</div>,
									data:{action:'查看',number:0,name:{title:this.props.title},id:this.props.id}
								},
								{
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-add-icon3'}></i><span>{i18n.t(100392/*新增*/)}</span></div>,
									data:{action:i18n.t(100392/*新增*/),number:1,name:{title:this.props.title},id:this.props.id}
								},
								{
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
									data:{action:i18n.t(100437/*删除*/),number:2,name:{title:this.props.title},id:this.props.id}
								},{
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-alter_icon2'}></i><span>{i18n.t(100439/*编辑*/)}</span></div>,
									data:{action:i18n.t(100439/*编辑*/),number:3,name:{title:this.props.title},id:this.props.id}
								}
								]
							}}
						/>
			</div>
			)
		}
	}
}

export default SystemCommon;
