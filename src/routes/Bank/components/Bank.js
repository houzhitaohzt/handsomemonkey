import i18n from './../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import BankPlug from './BankPlug';
class Bank extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.editClick=this.editClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.copyClick=this.copyClick.bind(this);
		this.onRowClick=this.onRowClick.bind(this);
		this.onHeaderCellClick=this.onHeaderCellClick.bind(this);
		this.handleClick=this.handleClick.bind(this);
		var that = this;
		this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
		this.columns = [{
			title : i18n.t(100000/*代码*/),
			dataIndex : "department",
			key : "department",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100001/*名称*/),
			dataIndex : "duty",
			key : "duty",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100341/*所属国家*/),
			dataIndex : "type",
			key : "type",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : "SWITF CODE",
			dataIndex : "customer",
			key : "customer",
			width : "10%",
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
			},{
			title : "CNAPS CODE",
			dataIndex : "up",
			key : "up",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100508/*银行地址*/),
			dataIndex : "startday",
			key : "startday",
			width : "25%",
			render(data,row,index){
				return data;
			}
		}];

		this.state = {
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			MeunState:true,
			rodalShow:false,
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			showSaveAdd:false,
			showSaveClose:true,
			checkedData:'',
			data : [
			{'department':'BANK0000029','duty':i18n.t(200304/*中国银行股份有限公司南通城南支行*/),'type':i18n.t(200293/*中国*/),'customer':'CHASUS33','up':'','startday':i18n.t(200309/*中国江苏南通市青年中路15号*/)},
			{'department':'BANK0000029','duty':i18n.t(200304/*中国银行股份有限公司南通城南支行*/),'type':i18n.t(200293/*中国*/),'customer':'CHASUS33','up':'','startday':i18n.t(200309/*中国江苏南通市青年中路15号*/)},
			{'department':'BANK0000029','duty':i18n.t(200304/*中国银行股份有限公司南通城南支行*/),'type':i18n.t(200293/*中国*/),'customer':'CHASUS33','up':'','startday':i18n.t(200309/*中国江苏南通市青年中路15号*/)},
			{'department':'BANK0000029','duty':i18n.t(200304/*中国银行股份有限公司南通城南支行*/),'type':i18n.t(200293/*中国*/),'customer':'CHASUS33','up':'','startday':i18n.t(200309/*中国江苏南通市青年中路15号*/)}
			]
		}
	}
	addClick(){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			title:i18n.t(200305/*银行新增*/),
			showSaveAdd:true,
			showSaveClose:true
		})
	}
	editClick(e,record){
		this.setState({
				rodalShow : true,
				showHeader:true,
				DialogContent:3,
				title:i18n.t(200306/*银行编辑*/),
				showSaveAdd:true,
				checkedData:{record:record},
				showSaveClose:true
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
		console.log('copyClick')
	}
	onSaveAndClose(){
	}
	onCancel(that){
		this.setState({
			rodalShow:false
		})
		if(that){
			that.props.form.resetFields();
			that.addradio.setState({
				array:[{radio:{type:i18n.t(300009/*手机*/),checked:true},select:i18n.t(300009/*手机*/),inputValue:''}]
			});
		}
	}

	handleClick(e,data){
		//右键处理
		if(data.type == 1){
			this.deleteClick();
		}else if(data.type ==2){
  			this.editClick();
  		}else if(data.type ==3){
  			this.setState({
				rodalShow : true,
				showHeader:true,
				DialogContent:4,
				title:i18n.t(100441/*失效*/),
				checkedData:data
			})
  		}
	}
	onHeaderCellClick(e,data){
		let {checkedRows, selectArr} = this.state;
		if(data.checkedAll){
			selectArr=selectArr.concat(this.state.data);
			selectArr = Array.from(new Set(selectArr));
			checkedRows= selectArr.map((value,index)=>index);
		}else{
			selectArr=[];
			checkedRows=[];
		}
	}
	onRowClick(record,index,checked){
		let {checkedRows, selectArr} = this.state;
		if(checked){
			selectArr.push(record);
			if(checkedRows.indexOf(index)<0){
				checkedRows.push(index);
			}
		}else{
			selectArr.remove(record);
			checkedRows.remove(index);
		}
	}
	onRowDoubleClick(record,index,checked){
		this.setState({
			rodalShow : true,
			showHeader:true,
			onSaveAndClose:false,
			DialogContent:5,
			title:i18n.t(200308/*银行详情*/),
			showSaveAdd:false,
			showSaveClose:false,
			checkedData:{record:record}
		})
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
		let  iconArray = [{type:'add',onClick:this.addClick},{type:'delete',onClick:this.deleteClick},{type:'copy',onClick:this.copyClick}];
		return(<div>
			<FilterHeader />
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}  copyClick={this.copyClick} />
						<Page totalPages={10} />
					</div>
					
					<Table
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						onRowDoubleClick={this.onRowDoubleClick}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{i18n.t(100437/*删除*/)}</div>,
									data:{type:1,title:i18n.t(100437/*删除*/)}
									},{
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
										data:{type:2,title:i18n.t(100439/*编辑*/)}
									},{
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-sx-icon2'}></i>{i18n.t(100441/*失效*/)}</div>,
										data:{type:3,title:i18n.t(100441/*失效*/)}
									}]
						}}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						<BankPlug DialogContent={this.state.DialogContent}
						 checkedData = {this.state.checkedData}
						 showSaveAdd ={this.state.showSaveAdd}
						 showSaveClose={this.state.showSaveClose}
						 buttonLeft = {this.state.buttonLeft}
						  onSaveAndClose ={this.onSaveAndClose}
						  contentDate = {this.state.contentDate}
						  onCancel = {this.onCancel}/>

					</Dialog>
				</div>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(Bank);

