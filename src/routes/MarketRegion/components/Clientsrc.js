import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import ClientsrcPlug from './ClientsrcPlug';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,pageSize,sizeList} from '../../../services/apiCall';
import Loading from "../../../components/Loading";//加载动画
import ServiceTips from "../../../components/ServiceTips";//提示框
import {I18n} from "../../../lib/i18n";
class Clientsrc extends Component{

	constructor(props){
		super(props);
		var that = this;

		this.columns = [{
			title : I18n.t(100001/*名称*/),
			dataIndex : "name",
			key : "name",
			width : "20%",
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>);
			}
		},{
			title : I18n.t(100087/*国家*/),
			dataIndex : "code",
			key : "code",
			width : "20%",
			render(data,row,index){
				var data = ( row['countries'] || [] ).map((o)=> o['localName']).toString();
				return (<div title={data} className={'text-ellipsis'}>{data}</div>);
			}
		},{
			title : I18n.t(100336/*备注*/),
			dataIndex : "mark",
			key : "mark",
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>);
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
			showSaveAdd:false,
			showSaveClose:true,
			buttonLeft:I18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			data : [],
			pageSize:pageSize,
			currentPage:1
			
		}
	}

	componentDidMount(){
		var that = this;
		this.getPage();
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
    }
	
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	// add edit
	editClick = (record={})=> {

		this.setState({
			rodalShow : true,
			showHeader:true,
			showSaveAdd:false,
			showSaveClose:true,
			title: record['record'] ? I18n.t(600317/*编辑销售区域*/):I18n.t(600316/*新增销售区域*/),
			checkedData:record['record']
		});
	}

	deleteClick = (data)=> {
		let that = this;
        let IDs = this.refs.product.getSelectArr().map(o => o.id);

        if (!IDs.length) {
			ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'error'});
			return;
		}
	
		Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			done: () => {
				apiForm(API_FOODING_DS,'/saleArea/delete',{id:IDs},(response)=>{
					ServiceTips({text:response.message,type:'success'});
					that.getPage();					
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
				});
			},
			close:() => {
			}
		});

	}

	onSaveAndClose = ()=> {
		this.getPage();
	}

	onCancel = ()=> {
		this.setState({
			rodalShow:false
		})
	}

	handleClick = (e,data)=> {
		//右键处理
		if(data.type == 1){
			this.deleteClick(data);
		}else if(data.type ==2){
  			this.editClick(data);
  		}
	}


	handleResize = (e, height)=> {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 180 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }

	//请求列表  list
	getPage = (currentPage,objValue)=> {
		let that = this;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
		let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_DS,'/saleArea/getPage',object,
				(response)=>{	
					that.setState({	
						data: response.data.data || [],
						totalPages: response.data.totalPages,
						totalRecords:response.data.totalRecords,
						currentPage: response.data.currentPage 	
					});
				},(errors)=>{
		});
	}



	render(){
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader normalRef={no => this.normalRef = no} getPage ={this.getPage} expandFilter= {this.handleResize}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.editClick} deleteClick={this.deleteClick}/> 
						<Page 
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages} 
							totalRecords={this.state.totalRecords}
							sizeList={sizeList}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								this.setState({ pageSize: Number.parseInt(num) },()=>this.getPage(1, num));
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
					    ref ="product"
						columns={this.columns}
						data={this.state.data}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						contextMenuConfig={{
							enable:true,
							contextMenuId:'SIMPLE_TABLE_MENU',
							menuItems:[{
								permissions:'MarketRegion.del',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{I18n.t(100437/*删除*/)}</div>,
								data:{type:1,title:I18n.t(100437/*删除*/)}
								},{
									permissions:'MarketRegion.edit',
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{I18n.t(100439/*编辑*/)}</div>,
									data:{type:2,title:I18n.t(100439/*编辑*/)}
								}]
						}}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						<ClientsrcPlug DialogContent={this.state.DialogContent}
						upload={this.getPage}
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
export default NavConnect(Clientsrc);

