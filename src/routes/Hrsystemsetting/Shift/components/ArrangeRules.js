import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table from "../../../../components/Table";//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import StafferPlug from './ArrangePlug';
import DetailDIV from './Detail';



import {apiGet,apiPost,apiForm,API_FOODING_HR,API_FOODING_ES,API_FOODING_DS,pageSize,sizeList} from '../../../../services/apiCall';
import Loading from "../../../../components/Loading";//加载动画
import ServiceTips from "../../../../components/ServiceTips";//提示框
import {I18n} from "../../../../lib/i18n";
class StafferList extends Component{
	constructor(props){
		super(props);
		var that = this;

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
			checkedData:{},
			data : [],
			filter:{},
			pageSize:pageSize,
			currentPage:1
		}

		this.columns = [{
			title : I18n.t(600273/*班次编号*/),
			dataIndex : 'code',
			key : "code",
			width : '10%',
			render(data,row,index){
				return (<div className={'text-ellipsis'}>{data}</div>);
			}
		},{
			title : I18n.t(600274/*班次名称*/),
			dataIndex : 'name',
			key : "name",
			width : '10%',
			render(data,row,index){
				return (<div className={'text-ellipsis'}>{data}</div>);
			}
		},{
			title : I18n.t(600275/*上班时间*/),
			dataIndex : 'officeTime',
			key : "officeTime",
			width : '6%',
			render(data,row,index){
				return (<div className={'text-ellipsis'}>{data}</div>);
			}
		},{
			title : I18n.t(600276/*下班时间*/),
			dataIndex : 'closingTime',
			key : "closingTime",
			width : '6%',
			render(data,row,index){
				return (<div className={'text-ellipsis'}>{data}</div>);
			}
		},{
			title : I18n.t(100300/*创建日期*/),
			dataIndex : 'createDate',
			key : "createDate",
			width : '6%',
			render(data,row,index){
				return (<div className={'text-ellipsis'}>{new Date(data).Format('yyyy-MM-dd')}</div>);
			}
		},{
			title : I18n.t(100002/*描述*/),
			dataIndex : 'memo',
			key : "memo",
			width : '39%',
			render(data,row,index){
				return (<div className={'text-ellipsis'}>{data}</div>);
			}
		},{
			title : I18n.t(700074/*状态*/),
			dataIndex : 'statusName',
			key : "statusName",
			width : '7%',
			render(data,row,index){
				return (<div className={'text-ellipsis'}>{row['irowSts'] ? row.irowSts['name'] :''}</div>);
			}
		}];

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

	handleResize = (e, height)=> {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 270 - this.filterHeight;
       let scrollHeight = scroll + 90;
       this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }

	// 新增 编辑
	addClick = (record)=> {
		this.setState({
			active:'edit',
			rodalShow :true,
			showHeader:true,
			DialogContent:1,
			showSaveAdd:true,
			showSaveClose:true,
			title:( record ? I18n.t(600309/*编辑考勤班次*/) : I18n.t(600308/*新增考勤班次*/)),
			checkedData:record['record'] || {},
			getPage:this.getPage
		})
	}



	deleteClick = (data)=> {

		let that = this;
        let IDs = this.refs.frexrat.getSelectArr().map(o => o.id);

        if (!IDs.length) {
			ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'error'});
			return;
		}
	
		// 不支持批量操作  
        if ( IDs.length > 1 ) {
			ServiceTips({text:I18n.t(500220/*不支持批量操作!*/),type:'error'});
			return;
		}		

		// 只有草稿状态能删 
        if (this.refs.frexrat.getSelectArr().filter(o => o.irowSts['id'] != 5)['length']) {
			ServiceTips({text:I18n.t(600319/*草稿状态才能删除！*/),type:'error'});
			return;
		}

		Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
			done: () => {
				apiForm(API_FOODING_HR,'/schedule/delete',{ids:IDs},(response)=>{
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

	onSaveAndClose = (value,data,isAdd)=> {
		var that = this;
		this.getPage();
		this.onCancel();
	}

	onCancel = (that)=> {
		this.setState({
			rodalShow:false
		})
	}

	handleClick = (e,data)=> {

		let {currentPage} = this.state;

		//右键处理
		if(data.type == 1){
			this.deleteClick(data);
		}else if(data.type ==2){
  			// this.editClick(data);
			this.addClick(data);  
  		}else if(data.type ==3){//失效
  			Confirm(I18n.t(100435/*是否对该条数据失效？*/), {
			  done: () => {
			  		//表示是失效
					apiForm(API_FOODING_HR,'/schedule/disInvalid',{ids:data.record.id},(response)=>{
						ServiceTips({text:response.message,type:'sucess'})
						this.getPage(currentPage);
					},(error)=>{
						ServiceTips({text:error.message,type:'error'})
					})
				},
				close:() => {
				}
			});
  		}else if(data.type ==4){//激活
  			Confirm(I18n.t(100436/*是否对该条数据激活？*/), {
			  done: () => {
			  		//表示是激活
					apiForm(API_FOODING_HR,'/schedule/invalid',{ids:data.record.id},(response)=>{
						ServiceTips({text:response.message,type:'sucess'})
						this.getPage(currentPage);
					},(error)=>{
						ServiceTips({text:error.message,type:'error'})
					})
				},
				close:() => {
				}
			});
  		}
	}

	onRowDoubleClick = (record,index,checked)=> {
		
		this.setState({
			active:'detail',
			rodalShow :true,
			showHeader:true,
			DialogContent:1,
			showSaveAdd:true,
			showSaveClose:true,
			title:I18n.t(600310/*考勤班次详情*/),
			checkedData:record
		})	


	}


	//请求列表  list
	getPage = (currentPage,order)=> {
		let that = this;	

		let currentP = currentPage || 1;
		let object=Object.assign({},{pageSize:this.state.pageSize,currentPage:currentP},that.normalRef.getForm());
		apiGet(API_FOODING_HR,'/schedule/getPage',object,
			(response)=>{
				that.setState({
					data: response.data.data,
					totalPages: response.data.totalPages,
					totalRecords:response.data.totalRecords,
					currentPage: response.data.currentPage
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}


	render(){
		let that = this;
		let {active,page,currentPage,scroll} =this.state;
		return(<div>
			<FilterHeader normalRef={no => this.normalRef = no} getPage ={this.getPage}  expandFilter= {this.handleResize} info={this.state.info}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick.bind(that,false)} deleteClick={this.deleteClick} />
						<Page
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages}
							totalRecords={this.state.totalRecords}
							sizeList={sizeList}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								this.setState({ pageSize: Number.parseInt(num) },()=>this.getPage(1,num));
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
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show:false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						onRowDoubleClick={this.onRowDoubleClick}
						//onHeaderSortClick={this.getPage.bind(this, null)}
						contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									permissions:'shift.del',
									onClick:this.handleClick,
									condition: [{key: 'irowSts.id', value: [5], exp: '==='}],
									content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{I18n.t(100437/*删除*/)}</div>,
									data:{type:1,title:I18n.t(100437/*删除*/)}
									},{
										permissions:'shift.edit',
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{I18n.t(100439/*编辑*/)}</div>,
										data:{type:2,title:I18n.t(100439/*编辑*/)}
									},{
										permissions:'shift.Invalid',
										onClick:this.handleClick,
										condition: [{key: 'irowSts.id', value: [10], exp: '==='}],
										content:<div><i className={'foddingicon fooding-sx-icon2'}></i><span>{I18n.t(100441/*失效*/)}</span></div>,
										data:{title:I18n.t(100441/*失效*/),type:3}
									},{
										permissions:'shift.activation',
										onClick:this.handleClick,
										condition: [{key: 'irowSts.id', value: [5,20], exp: '==='}],
										content:<div><i className={'foddingicon fooding-jh-icon2'}></i><span>{I18n.t(100442/*激活*/)}</span></div>,
										data:{title:I18n.t(100442/*激活*/),type:4}
									}]
						}}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title}>
						{ active == 'edit' ?
							<StafferPlug 
								DialogContent={this.state.DialogContent}
								checkedData = {this.state.checkedData}
								info={this.state.info}
								showSaveAdd ={this.state.showSaveAdd}
								showSaveClose={this.state.showSaveClose}
								buttonLeft = {this.state.buttonLeft}
								onSaveAndClose ={this.onSaveAndClose}
								contentDate = {this.state.contentDate}
								upload={this.getPage}
								onCancel = {this.onCancel}
							/>:''						
						}
						{ active == 'detail' ?
							<DetailDIV 
								onCancel = {this.onCancel}
								checkedData = {this.state.checkedData}
							/>:''						
						}
					</Dialog>
				</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(StafferList);

