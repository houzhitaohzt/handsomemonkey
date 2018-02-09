import i18n from './../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS} from '../../../services/apiCall';
import Loading from "../../../components/Loading";//加载动画
import ServiceTips from "../../../components/ServiceTips";//提示框
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import TranstypePlug from './TranstypePlug';
class Transtype extends Component{
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
		this.getPage =this.getPage.bind(this);
		this.getPages = this.getPages.bind(this);
		this.lose = this.lose.bind(this);
		this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
		this.columns = [{
			title : i18n.t(100003/*ID*/),
			dataIndex : "id",
			key : "id",
			width : "20%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100000/*代码*/),
			dataIndex : "code",
			key : "code",
			width : "20%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100001/*名称*/),
			dataIndex : "name",
			key : "name",
			width : "20%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100002/*描述*/),
			dataIndex : "description",
			key : "description",
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		}];
		this.getInfo= this.getInfo.bind(this);
		this.state = {
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			MeunState:true,
			rodalShow:false,
			showSaveAdd:false,
			showSaveClose:true,
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			data : [],
			page:{size:20,totalPages:0,currentPage:1,totalRecords:0,pageSize:20},
			info:{}
			
		}
	}
	addClick(){

		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			showSaveAdd:true,
			showSaveClose:true,
			title:i18n.t(201246/*运输方式新增*/)
		})
	}
	editClick(record){
		this.setState({
				rodalShow : true,
				showHeader:true,
				DialogContent:3,
				showSaveAdd:false,
			    showSaveClose:true,
				title:i18n.t(201247/*运输方式编辑*/),
				checkedData:{record:record.record}
			})
	}
	deleteClick(data){
		let numArr = this.state.selectArr;
		let tempString = "";
		let value=[];
		var that = this;
		if(numArr.length == 0 ){
			if(data){
				tempString={i18n.t(201288/*已选择1条数据，您确定删除吗*/)}
				value.push(data.record.id);
			}else{
				tempString="请选择1条数据进行删除";
			}
			
		}else{
			for (var i = 0; i < this.state.selectArr.length; i++) {
				value.push(this.state.selectArr[i].id);	
			}
			tempString=i18n.t(100395/*已选中*/) + numArr.length + i18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
		}
		Confirm(tempString, {
		  done: () => {
			    apiForm(API_FOODING_DS,'/storOpert/delete',{id:value},(response)=>{
			    	that.getPage();
			    	ServiceTips({text:response.message,type:'success'});

			    },(errors)=>{
			    	ServiceTips({text:errors.message,type:'error'});
			    });
			},
			close:() => {
			}
		});
	}
	lose(data){
		Confirm("您确定要失效这条数据吗？", {
		  done: () => {
			    apiForm(API_FOODING_DS,'/storOpert/delete',{id:value},(response)=>{
			    	that.getPage();
			    	ServiceTips({text:response.message,type:'success'});

			    },(errors)=>{
			    	ServiceTips({text:errors.message,type:'error'});
			    });
			},
			close:() => {
			}
		});
	}
	copyClick(){
		console.log('copyClick')
	}
	onSaveAndClose(value,data,isAdd){
		var that = this;
		value=Object.assign({},data,value);
		apiPost(API_FOODING_DS,'/storOpert/save',value,(response)=>{
				that.setState({
					rodalShow:!!isAdd
				})
				 ServiceTips({text:response.message,type:'success'});
				 this.getPage();
		},(errors)=>{
			ServiceTips({text:errors.message,type:'error'});
			that.setState({
					rodalShow:!!isAdd
			})
		})
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
			this.deleteClick(data);
		}else if(data.type ==2){
  			this.editClick(data);
  		}else if(data.type ==3){
  			this.lose(data);
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
			showSaveAdd:false,
			showSaveClose:false,
			DialogContent:5,
			title:i18n.t(201248/*运输方式详情*/),
			checkedData:{record:record}
		})
	}
	handleResize(height){
		let sch=document.body.offsetHeight-72;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
		console.log(scroll);
	}
	getInfo(){
		var that = this;
		apiGet(API_FOODING_DS,'/storOpert/getInit',{},(response)=>{
			that.setState({
				info:response.data
			});
		},(errors)=>{

		})
	}
	getPage(currentPage,size,filter,order){
    	var that = this;
		filter=filter||{};
		order=order||{column:'id',order:'desc'};
		let {page}=this.state;
		currentPage = currentPage||page.currentPage-1,
		size=size||page.size;
		let params=Object.assign({},{currentPage:currentPage,pageSize:size},filter,order);

		apiGet(API_FOODING_DS,'/storOpert/getPage',params,
					(response)=>{
						let {totalRecords,totalPages,currentPage,pageSize,data}=response.data;
						that.setState({data:response.data.data,page:{size:pageSize,totalPages:totalPages,currentPage:currentPage,totalRecords:totalRecords}});
					},(errors)=>{

		});
	}
	getPages(data){
		var that = this;
		var filter=filter||{};
		var order=order||{column:'id',order:'desc'};
		let value =Object.assign({},{pageSize:20,currentPage:that.state.page.currentPage},data,filter,order);
		apiGet(API_FOODING_DS,'/storOpert/getPage',value,
					(response)=>{
						that.setState({data:response.data.data});
					},(errors)=>{

		});
	}
	componentDidMount(){
		var that = this;
		this.getPage();
		this.getInfo();
		window.addEventListener('resize', this.handleResize(47));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	render(){
		let {page} =this.state;
		return(<div>
			<FilterHeader getPage ={this.getPages} />
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				 <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}  copyClick={this.copyClick} />
						<Page totalPages={page.totalPages} 
						    currentPage={page.currentPage}
						    totalRecords={page.totalRecords}
							sizeList={[20,50,200]}
							currentSize={page.size}
							pageSizeChange={(value)=>{
							let {page}=this.state;
								if(page.size==value){
									return;
								}
									this.getPage(page.currentPage,value);
								}} backClick={(v)=>{
									let {page}=this.state;
									if(page.currentPage==v){
										return;
									}
									this.getPage(v);
								}} nextClick={(v)=>{
									let {page}=this.state;
									if(page.currentPage==v){
										return;
									}
									this.getPage(v);
								}}
								goChange={(v)=>{
									let {page}=this.state;
									if(page.currentPage==v){
										return;
									}
									this.getPage(v);
								}} 
						/>
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
						<TranstypePlug DialogContent={this.state.DialogContent}
						info={this.state.info}
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
export default NavConnect(Transtype);
