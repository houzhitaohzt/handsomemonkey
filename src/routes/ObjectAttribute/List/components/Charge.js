import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";



// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';




class Charge extends Component{

	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);

		this.columns = [{
			title : i18n.t(100001/*名称*/),
			dataIndex : "name",
			key : "name",
			width : "20%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(600223/*所属表单*/),
			dataIndex : 'form',
			key : "form",
			width : "20%",
			render(data,row ,index){
				return (<div className="text-ellipsis" title={data ? data['localName']:''}>{data ? data['localName']:''}</div>)
			}
		},{
			title : i18n.t(600224/*表单类型*/),
			dataIndex : "formObjectType",
			key : "formObjectType",
			width : "20%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data ? data['name']:''}>{data ? data['name']:''}</div>)
			}
		},{
			title : i18n.t(200886/*表单标识*/),  
			dataIndex : 'formIdentity',
			key : "formIdentity",
			width : '20%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		}];

		// init state
		this.state = {
			scrollHeight:0,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:[],
			obj:{},

			initData: [], // 初始化 数据
			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
			id: '',	
			ccId: '',
			sData:{},
		};
		
	}


	componentDidMount(){
		window.addEventListener('resize', this.handleResize(47));
		this.getPage();		
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}	

	addClick = (data)=> {


		var that = this;
		let content=require('./AddPage').default;
		let element=React.createElement(content,{
			onSaveAndClose: that.onSaveAndClose,
			onCancel:that.onCancel,
			getPage:that.getPage,
			getOneData: data['id'] ? data : {}
			
		});

		that.setState({
			showDilaog : true,
			title: data['id'] ? i18n.t(100439/*编辑*/) : i18n.t(100392/*新增*/),
			dialogContent: element,
		});
	}


	onSaveAndClose = ()=> {
		this.setState({
			showDilaog:!this.state.showDilaog
		})
	}

	onCancel = ()=> {
		this.setState({
			showDilaog:false
		})
	}

	onRowDoubleClick = (record,index,checked)=> {
		let {navAddTab} =this.props;
		navAddTab({id:9,name:i18n.t(600232/*表单对象详情*/),component:i18n.t(600232/*表单对象详情*/),url:'/objectAttribute/detail'});
		this.props.router.push({ pathname: '/objectAttribute/detail',query:{id:record.id,billType:record.billType}});
	}

	handleResize(height){
		let sch=document.body.offsetHeight-72-height;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}

	// 右键 
	handleClick = (e,option)=> {
		let {key,record} = option;


		// 编辑
		if( key == "edit" ) this.addClick(record);

		// 删除 
		if( key == "delete" ) this.deleteClick(e,record);
		
	}

	// 删除
	deleteClick = (react,row)=> {

		let that = this;
		let select = this.refs.product.getSelectArr();

		console.log(row);
		// 删除 条件判断
		if(react){
			if( select.length == 0 ){
				ServiceTips({text:i18n.t(500115/*请选中一条数据？*/),type:'info'});
			} else if( select.length > 1 ){
				ServiceTips({text:i18n.t(500220/*不支持批量操作!*/),type:'info'});
			} else{
				this.deleteAjax(select[0].id); // 删除 请求
			}
		} else{
			this.deleteAjax(row.id); // 右键
		}
	}

	// 删除 请求
	deleteAjax = (ID)=> {
		let that = this;
		Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			done: () => {
				apiForm(API_FOODING_DS,'/formObject/delete',{id: ID},
					(response)=>{	
						ServiceTips({text:response.message,type:'success'});
						that.getPage();
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		});	
	}

	// 页面 刷新
	getPage = (sData=null)=> {

		let that = this;
		if(sData){
			this.setState({sData:sData,currentPage:1},function(){
				ajax();
			});
		} else{
			ajax();		
		}
	
		// 保存 请求
		function ajax(){
			apiGet(API_FOODING_DS,'/formObject/getPage',Object.assign({pageSize: that.state.pageSize,currentPage: that.state.currentPage, billType: 500},that.state.sData),
				(response)=>{				
					that.setState({	
						data: response.data.data || [],
						totalPages: response.data.totalPages,
						currentPage: response.data.currentPage 	
					});
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
			});	
		}
	}

	render(){

		let that = this;
		const data = this.state.data || [];
		return(<div>
			<FilterHeader getPage={this.getPage}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				<div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}/>
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
					</div>
					<Table
						ref = "product"
						colorConfig={[{key:'payMentUuId',color:'bg-green'}]}
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						onRowDoubleClick={this.onRowDoubleClick}
						contextMenuConfig={{
							enable:true,
							contextMenuId:'SIMPLE_TABLE_MENU',
							menuItems:[
							{
								//permissions:'provider.edit',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-alter'}></i><span>{i18n.t(100439/*编辑*/)}</span></div>,
								data:{key:'edit',action:i18n.t(100439/*编辑*/)}
							},
							{
								//permissions:'provider.del',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
								data:{key:'delete',action:i18n.t(100437/*删除*/)}
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
export default NavConnect(Charge);

