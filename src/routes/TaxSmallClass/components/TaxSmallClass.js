import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层

import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';

import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";

class TaxSmallClass extends Component{
	constructor(props){
		super(props)
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.onRowClick=this.onRowClick.bind(this);
		this.onHeaderCellClick=this.onHeaderCellClick.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.copyClick=this.copyClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.handleClick=this.handleClick.bind(this);
		this.columns = [{
			title : i18n.t(100000/*代码*/),
			dataIndex : 'code',
			key : "code",
			width : '20%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title : i18n.t(100001/*名称*/),
			dataIndex : "name",
			key : "name",
			width : "20%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title : i18n.t(100002/*描述*/),
			dataIndex : "description",
			key : "description",
			width : "35%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		}];
	}

	initState(){
		return {
			scrollHeight:0,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:null,
			record:[]
		}
	}
	addClick(){
		let content =require('./TaxSmallClassAddAndEditDialog').default;
		let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel});
    	this.setState({
    		showDilaog : true,
    		title:i18n.t(201234/*新增税小类*/),
    		dialogContent : element
    	})
	}
	deleteClick(){
		let numArr = this.state.selectArr;
		let tempString = "";
		if(numArr.length==0){
			alert(i18n.t(200307/*请选择数据*/));
			return false;
		}else if(numArr.length==1){
			tempString="删除后将无法恢复，您确定删除吗？";
		}else{
			tempString=i18n.t(100395/*已选中*/) + numArr.length + i18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
		}
		Confirm(tempString, {
		  done: () => {
			    console.log('ok, got it');
			},
			close:() => {
				console.log('no, close')
			}
		});
	}
	copyClick(){
		console.log(i18n.t(100452/*复制*/))
	}
	onSaveAndClose(){
		this.setState({
			showDilaog:!this.state.showDilaog
		})
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}
	onHeaderCellClick(e,data){
		let {checkedRows, selectArr} = this.state;
		if(data.checkedAll){
			selectArr=selectArr.concat(this.state.data);
			selectArr = Array.from(new Set(selectArr));
			checkedRows= this.state.record.map((value,index)=>index);
		}else{
			selectArr=[];
			checkedRows=[];
		}
		this.setState({
			selectArr:selectArr,
			checkedRows:checkedRows,
			choised:data.checkedAll
		})
	}
	onRowClick(record,index,checked){
		let {checkedRows}=this.state;
		let selectArr =[];
  		if(checked){
			if(checkedRows.indexOf(index)<0){
				checkedRows.push(index);
			}
  		}else{
  			for(let i=0,length=checkedRows.length;i<length;i++){
  				if(checkedRows[i]==index){
  					checkedRows.splice(i,1);
  				}
  			}
  		}
  		for(let i=0,length=checkedRows.length;i<length;i++){
  			selectArr.push(this.state.record[checkedRows[i]]);
  		}
  		this.setState({
  			selectArr : selectArr,
			checkedRows:checkedRows
  		})
	}
	onRowDoubleClick(record,index,checked){
		let content =require('./TaxSmallClassViewDialog').default;
		let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel});
    	this.setState({
    		showDilaog : true,
    		title:i18n.t(201235/*税小类详情*/),
    		dialogContent : element
    	})
	}
	handleClick=(e,data) => {
		if(data.action == i18n.t(100439/*编辑*/)){
			let content =require('./TaxSmallClassAddAndEditDialog').default;
			let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel});
	    	this.setState({
	    		showDilaog : true,
	    		title:i18n.t(201236/*编辑税小类*/),
	    		dialogContent : element
	    	})
		}else if(data.action == i18n.t(100437/*删除*/)){
			Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			  done: () => {
				    console.log('ok, got it');
				}
			});
		}else if(data.action == i18n.t(100441/*失效*/)){
			let content=require('../../Product/List/components/Failure').default;
			let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel})
	    	this.setState({
	    		showDilaog : true,
	    		title: i18n.t(200809/*失效原因*/),
	    		dialogContent: element
	    	})
		}
	}
	handleResize(height){
		let sch=document.body.offsetHeight-72-height;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
		console.log(scroll);
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(47));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	render(){
		const {record} = this.state;
		return(<div>
			<FilterHeader />
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick} copyClick={this.copyClick} />
						<Page totalPages={10} />
					</div>
					<Table 
						columns={this.columns}
						data={record}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						onRowDoubleClick={this.onRowDoubleClick}
						contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-alter_icon2'}></i><span>{i18n.t(100439/*编辑*/)}</span></div>,
									data:{action:i18n.t(100439/*编辑*/)}
								},{
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
									data:{action:i18n.t(100437/*删除*/)}
								},{
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-shixiao'}></i>{i18n.t(100441/*失效*/)}</div>,
									data:{action:i18n.t(100441/*失效*/)}
								}]
							}}
					/>
					<Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
						{this.state.dialogContent}
					</Dialog>
					</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(TaxSmallClass);
