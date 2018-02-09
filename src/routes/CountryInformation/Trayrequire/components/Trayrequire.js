import React, { Component,PropTypes } from 'react';
const {Table} = require("../../../../components/Table");
import Page from "../../../../components/Page"
//引入按钮键
import  Confirm from  '../../../../components/button/confirm'
import  DeleteDialog from '../../../../components/Dialog/Confirm'
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog'
import Tooltip from "../../../../components/Tip"
import TrayrequirePlug from './TrayrequirePlug'
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import {I18n} from "../../../../lib/i18n";
export class Trayrequire extends Component{
	constructor(props){
		super(props);
        props.trayrequire && props.trayrequire(this);
		this.columns = [{
			title : I18n.t(100124/*托盘类型*/),
			dataIndex : 'salvrType',
			key : "salvrType",
			width : '50%',
			render(data,row,index){
				return (<div>{data?data.localName:''}</div>)
			}
		},{
			title : I18n.t(100123/*默认*/),
			dataIndex : "dfutMrk",
			key : "dfutMrk",
			width : "50%",
			render(data,row,index){
				return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
				//return <div>{data?I18n.t(100141/*是*/):I18n.t(100142/*否*/)}</div>;
			}
		}];
		this.state = {
			rodalShow:false ,
			title:'',
			scroll:0,
			paddingTop:0,
			selectArr:[],
			checkedRows:[],
			buttonLeft:I18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			data : [],
			sourceId:this.props.location.query.id,
			dataTyId:'',
			pageSize:pageSize,
			currentPage:1
		}
		this.addClick = this.addClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.editClick=this.editClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
	}
	addClick(e){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			title:I18n.t(100121/*托盘要求新增*/)
		})
    }
    editClick(record){
		var that = this;
		apiGet(API_FOODING_DS,'/tradrulePallet/getOne',{id:record.record.id},(response)=>{
			this.setState({
				rodalShow:true,
				showHeader:true,
				title:I18n.t(100122/*托盘要求编辑*/),
				showSaveAdd:false,
				showSaveClose:true,
				DialogContent:3,
				checkedData:response.data
			})
		},(error)=>{

		})
	}
    deleteClick(data){
		let numArr = this.refs.frexrat.getSelectArr();
		let value=[];
		var that = this;
		if(numArr.length > 0){
			for (var i = 0; i < numArr.length; i++) {
					value.push(numArr[i].id);	
			}
			DeleteDialog(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
					  done: () => {
						    apiForm(API_FOODING_DS,'/tradrulePallet/delete',{id:value},(response)=>{
						    	that.getPage();
						    	ServiceTips({text:response.message,type:'success'});

						    },(errors)=>{
						    	ServiceTips({text:errors.message,type:'error'});
						    });
						},
						close:() => {
						}
			});
		}else{
			ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'error'});
		}
		
	}
    onSaveAndClose(value,data,isAdd){
		var that = this;
		value=Object.assign({},data,value);
		apiPost(API_FOODING_DS,'/tradrulePallet/save',value,(response)=>{
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
		});
	}
	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
		let object=Object.assign({},{sourceId:this.state.sourceId,dataTyId:10,isPlatform:true,pageSize:this.state.pageSize,currentPage:currentP});
		apiGet(API_FOODING_DS,'/tradrulePallet/getPage',object,
				(response)=>{	
					that.setState({	
						data: response.data.data,
						totalPages: response.data.totalPages,
						totalRecords:response.data.totalRecords,
						currentPage: response.data.currentPage 	
					});
				},(errors)=>{
		});
	}
	handleClick(e,data){
		//右键处理
		if(data.type == 1){
			this.deleteClick(data);
		}else if(data.type ==2){
  			this.editClick(data);
  		}
	}
	handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 90;
        let scroll = document.body.offsetHeight - 255 - this.filterHeight;
        this.setState({scroll: scroll});
    }
	componentDidMount(){
		var that = this;
		if(!this.props.isDetail){
            this.getPage();
		}
		this.handleResize();
		// window.addEventListener('resize', this.handleResize);
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		// window.addEventListener('resize', this.handleResize(0));
  	}
	render(){
		let  iconArray = [{type:'add',onClick:this.addClick},{type:'delete',onClick:this.deleteClick}];
		let title = <span>{this.state.title}<i className="font">{this.state.title_1}</i></span>;
		let {page,currentPage} =this.state;
		return (<div>
				<div className='content-margin'/>
				<div className={'client-body'} style={{height: '100%', position: 'absolute'}}>
				<div className={'client-body-single'}>
					<div className="action-buttons">
					 <div className={'key-page'}>
						<Confirm iconArray ={iconArray}/>
						<Page 
								currentPage={this.state.currentPage}
								totalPages={this.state.totalPages}
								totalRecords={this.state.totalRecords} 
								sizeList={sizeList}
								currentSize={this.state.pageSize}
								pageSizeChange={(num)=>{
									this.setState({ pageSize: Number.parseInt(num) },()=>this.getPage(currentPage, num));
								}} 
								backClick={(num)=>{
									this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));
								}} 
								nextClick={(num)=>{
									this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));										
								}}
								goChange={(num)=>{
									this.setState({ currentPage: Number.parseInt(num) },()=>this.getPage(num));																				
								}}								
						/>
					</div>
					<Table
							ref ="frexrat"
							columns={this.columns}
							scroll={{x:true,y:this.state.scroll}}
							data={this.state.data}
							checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
							colorFilterConfig={{show : false}}
							followConfig={{show:false}}
							style={{width:'100%'}}
							contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{I18n.t(100437/*删除*/)}</div>,
									data:{type:1,title:I18n.t(100437/*删除*/)}
									}]
							}}
					/>
					<Dialog visible={this.state.rodalShow} showHeader ={this.state.showHeader}  title={this.state.title} width={926}>
							<TrayrequirePlug DialogContent={this.state.DialogContent}
							 checkedData = {this.state.checkedData}
							 buttonLeft = {this.state.buttonLeft}
							 showSaveAdd ={this.state.showSaveAdd}
							 showSaveClose={this.state.showSaveClose}
							  onSaveAndClose ={this.onSaveAndClose}
							  contentDate = {this.state.contentDate}
							  onCancel = {this.onCancel}
							  sourceId={this.state.sourceId}
							  dataTyId={this.state.dataTyId}/>
					</Dialog>
				</div>
				</div>
			</div>
		</div>)
	}

}
export default Trayrequire;
