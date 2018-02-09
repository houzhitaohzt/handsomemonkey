import i18n from './../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
const {Table} = require("../../../components/Table");
import Page from "../../../components/Page"
//引入按钮键
import  Confirm from  '../../../components/button/confirm'
import  DeleteDialog from '../../../components/Dialog/Confirm'
//引入弹层
import Dialog from '../../../components/Dialog/Dialog'
import AddDialog from './AddDialog'
import DetailDialog from './DetailDialog'
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList,getQueryString} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import {I18n} from "../../../lib/i18n/index";
export class Clentlist extends Component{
	constructor(props){
		super(props);
        props.client && props.client(this);
		let that = this;

		// list 
		this.columns = [{
			title : i18n.t(100000/*代码*/),
			dataIndex : 'code',
			key : "code",
			width : '7%',
			render(data,row,index){
				return (<div className="text-ellipsis">{row.customer['code']}</div>);
			}
		},{
			title : i18n.t(100311/*客户*/),
			dataIndex : "name",
			key : "name",
			width : "20%",
			render(data,row,index){
				return (<div className="text-ellipsis">{row.customer['localName']}</div>);
			}
		},{
			title : i18n.t(100087/*国家*/),
			dataIndex : "country",
			key : "country",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis">{row.customer['country']}</div>);
			}
		},{
			title : i18n.t(100371/*网站*/),
			dataIndex : "defaultWeb",
			key : "defaultWeb",
			width : "20%",
			render(data,row,index){
				return (<div className="text-ellipsis">{row.customer['defaultWeb']}</div>);
			}
		},{
			title : i18n.t(100372/*主联系人*/),
			dataIndex : 'defaultContact',
			key : "defaultContact",
			width : "16%",
			render(data,row ,index){
				return (<div className="text-ellipsis">{row.customer.defaultContact ? row.customer.defaultContact.localName : ''}</div>);
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : "defaultPhone",
			key : "defaultPhone",
			width : "7%",
			render(data,row,index){
				return <button onClick={that.detailHandle.bind(this,row)} type="button" className="btn btn-info btn-xs">{i18n.t(200469/*查看产品*/)}</button>;
			}
		}];
		this.state = {
			rodalShow:false ,
			title:'',
			scroll:0,
			paddingTop:0,
			selectArr:[],
			checkedRows:[],
			contentTemplate:<div></div>,
			data : [],
			info:{},
			id:getQueryString("id"),
			dataTyId:getQueryString("dataTyId"),

			currentPage:1, // 当前页 
			pageSize: pageSize, // 每页 多少条

		}
		this.addClick = this.addClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount(){
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
		if(!this.props.isDetail){
            this.getPage();
		}
    };

	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}

	handleResize(height){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
  		let padding = this.state.paddingTop ? 173:262;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;

		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}

	handleClick(e,data,target){
		var that = this;
		if(data.type == 7){
           this.deleteClick();
		}
	}

	addClick(e){
		var that = this;
		this.setState({
			rodalShow : true,
			title:i18n.t(100392/*新增*/),
			title_1:'',
			contentTemplate:<AddDialog data ={{record:{},type:2}} 
				onSaveAndClose={that.onSaveAndClose}  dataTyId={this.state.dataTyId} id={this.state.id}
				onCancel = {this.onCancel}/>
		})
    }

    deleteClick(e){
		let that = this;
		let select = this.refs.client.getSelectArr();
		
		if(!select.length) {
			ServiceTips({text:i18n.t(100434/*请选择一条数据！*/),type:'info'});
			return;
		}
		
		let ID = [];
		select.map(o=>ID.push(o['id']));
    	DeleteDialog(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			done: () => {
				apiForm(API_FOODING_DS,'/tradruleCustomer/delete',{id:ID},
					(response)=>{
						ServiceTips({text:response.message,type:'sucess'});
						that.getPage();
					},(error)=>{
						ServiceTips({text:error.message,type:'error'});
				})
			}
		});
    }

	// 查看 详情 
	detailHandle = (row)=>{
		var that = this;
		this.setState({
			rodalShow : true,
			title:i18n.t(100402/*产品详情*/),
			contentTemplate:<DetailDialog 
				id={row.customer.id}
				onCancel = {this.onCancel}/>
		})		
	}

	getPage = ()=>{
		let that = this;
		let {id,pageSize,currentPage} = this.state;
		apiGet(API_FOODING_DS,'/tradruleCustomer/getPage',{sourceId:id,pageSize:pageSize,currentPage:currentPage},
			(response)=>{	
				let data = response.data.data.filter(o=>o['customer'])
				that.setState({	
					data: data,
					totalPages: response.data.totalPages,
					currentPage: response.data.currentPage 	
				});
			},(errors)=>{
		});
	}
 
    onSaveAndClose = ()=>{
    	this.getPage();
	}

	onCancel(){
		this.setState({ rodalShow:false });
	}

	render(){
		var that = this;
		let {pageIdent} = this.props;

		// 权限按钮 
		switch(pageIdent){
			case 'client' :  // 客户 
				var  iconArray = [{type:'add',onClick:this.addClick,permissions:'clien.dtl.add'},{type:'delete',onClick:this.deleteClick,permissions:'clien.dtl.del'}];
				var	menuItems = [
					{
						permissions:'clien.dtl.del',
						onClick:this.handleClick,
						content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
						data:{title:i18n.t(100437/*删除*/),type:7}
					}
				];			
			break;							
			default:
	
		}
		
		
		let title = <span>{this.state.title}<i className="font">{this.state.title_1}</i></span>;
		return (
			<div className="contact-fluid">
				<div className='content-margin'></div>
				<div className="contact-body" style = {{height:this.state.scrollHeight}}>
					<Confirm iconArray ={iconArray}/>
					<Page 
						currentPage={this.state.currentPage}
						totalPages={this.state.totalPages} 
						sizeList={sizeList}
						currentSize={this.state.pageSize}
						pageSizeChange={(num)=>{
							that.setState({ pageSize: Number.parseInt(num),currentPage:1 },()=>that.getPage());
						}} 
						backClick={(num)=>{
							that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());
						}} 
						nextClick={(num)=>{
							that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());										
						}}
						goChange={(num)=>{
							that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());																				
						}}								
					/>
				<div className="action-normal-buttons">
					<Table  
						ref = "client"
						columns={this.columns}
						scroll={{x:true,y:this.state.scroll}}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						style={{width:'100%'}}
						contextMenuConfig={{
							enable:true,
							contextMenuId:'SIMPLE_TABLE_MENU',
							//menuItems:menuItems,
						}}
					/>
					<Dialog visible={this.state.rodalShow} title={title} width={926}>
							{this.state.contentTemplate}
					</Dialog>
				</div>
				</div>
			</div>
		)
	}
}

export default NavConnect(Clentlist);
