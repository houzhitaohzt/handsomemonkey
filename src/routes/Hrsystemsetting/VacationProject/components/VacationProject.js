import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table from "../../../../components/Table";//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import StafferPlug from './VacationPlug';
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,pageSize,sizeList,API_FOODING_HR} from '../../../../services/apiCall';
import Loading from "../../../../components/Loading";//加载动画
import ServiceTips from "../../../../components/ServiceTips";//提示框
import AddMoreLanguage from "../../../../components/AddMoreLanguage";
import {I18n} from "../../../../lib/i18n";
class StafferList extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.handleClick=this.handleClick.bind(this);
		var that = this;
		this.getPage =this.getPage.bind(this);

		this.editClick=this.editClick.bind(this);
		this.columns = [{
			title : '休假编号',
			dataIndex : 'code',
			key : "code",
			width : '13%',
			sort: 'code',
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : '休假名称',
			dataIndex : "name",
			key : "name",
			width : "10%",
			sort:'name',
			render(data,row,index){
				return data && data? data : "";
			}
		},{
			title : '规定天数',
			dataIndex : "days",
			key : "days",
			width : "10%",
			sort:'days',
			render(data,row,index){
				return data;
			}
		},{
			title : '预置',
			dataIndex : "preset",
			key : "preset",
			width : "12%",
			sort:'preset',
			render(data,row,index){
                return (<i style = {{display: 'inline-block',textAlign: 'center'}} className={data?'foddingicon fooding-dui-icon2':''}></i>)
			}
		},{
			title : '备注',
			dataIndex : "mark",
			key : "mark",
			width : "12%",
			sort:'mark',
			render(data,row,index){
				return data;
			}
		},{
			title :'状态',
			dataIndex : "irowSts.name",
			key : "irowSts.name",
			width : "10%",
			sort:'irowSts.name',
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
	}
	addClick(){
		this.setState({
				rodalShow :true,
				showHeader:true,
				DialogContent:1,
				showSaveAdd:true,
				showSaveClose:true,
				title:'新增休假项目',
		})
	}
	editClick(record){
		apiGet(API_FOODING_HR,'/vacation/getOne',{id:record.record.id},(response)=>{
			this.setState({
				DialogContent:3,
				checkedData:response.data,
				rodalShow : true,
				showHeader:true,
				title:'休假项目编辑',
				showSaveAdd:true,
				showSaveClose:true
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
					Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
					  done: () => {
						    apiForm(API_FOODING_HR,'/vacation/delete',{ids:value},(response)=>{
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
	onSaveAndClose(bool){
		var that = this;
		this.getPage();
        !bool &&this.onCancel();
	}
	onCancel(that){
		this.setState({
			rodalShow:false
		})
	}

	handleClick(e,data){
		//右键处理
		if(data.type == 1){
			this.deleteClick(data);
		}else if(data.type ==2){
  			this.editClick(data);
  		}else if(data.type ==3){//失效
  			Confirm(I18n.t(100435/*是否对该条数据失效？*/), {
			  done: () => {
			  		//表示是失效
					apiForm(API_FOODING_HR,'/vacation/disable',{ids:data.record.id},(response)=>{
						ServiceTips({text:response.message,type:'sucess'})
						this.getPage();
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
					apiForm(API_FOODING_HR,'/vacation/able',{ids:data.record.id},(response)=>{
						ServiceTips({text:response.message,type:'sucess'})
						this.getPage();
					},(error)=>{
						ServiceTips({text:error.message,type:'error'})
					})
				},
				close:() => {
				}
			});
  		}
	}
	onRowDoubleClick(record,index,checked){
        apiGet(API_FOODING_HR,'/vacation/getOne',{id:record.id},(response)=>{
            this.setState({
                DialogContent:5,
                checkedData:response.data || {},
                rodalShow : true,
                showSaveClose:false,
                showHeader:true,
                title: '节假日详情',
                showSaveAdd:false,
            })
        },(error)=>{

        })

	}


	//请求列表  list
	getPage(currentPage,order){
		let that = this;
		this.columnSort = order = order || this.columnSort;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm(),order);
		apiGet(API_FOODING_HR,'/vacation/getPage',object,
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
	handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
       let scrollHeight = scroll + 70;
       this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }
	componentDidMount(){
		var that = this;
		this.getPage();
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	render(){
		let that = this;
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader normalRef={no => this.normalRef = no} getPage ={this.getPage}  expandFilter= {this.handleResize} info={this.state.info}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}/>
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
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show:false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						onRowDoubleClick={this.onRowDoubleClick}
						onHeaderSortClick={this.getPage.bind(this, null)}
						contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									    onClick:this.handleClick,
                                        condition: [
                                            {key: 'preset', value:[true], exp: '!=='},'and',{key: 'rowSts', value:[5], exp: '==='}
                                        ],
									    content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{I18n.t(100437/*删除*/)}</div>,
									    data:{type:1,title:I18n.t(100437/*删除*/)}
									},{
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{I18n.t(100439/*编辑*/)}</div>,
										data:{type:2,title:I18n.t(100439/*编辑*/)}
									},{
										onClick:this.handleClick,
										condition: [{key: 'preset', value:[true], exp: '!=='},'and',{key: 'rowSts', value: [10], exp: '==='}],
										content:<div><i className={'foddingicon fooding-sx-icon2'}></i><span>{I18n.t(100441/*失效*/)}</span></div>,
										data:{title:I18n.t(100441/*失效*/),type:3}
									},{
										onClick:this.handleClick,
										 condition: [{key: 'rowSts', value: [5,20], exp: '==='}],
										content:<div><i className={'foddingicon fooding-jh-icon2'}></i><span>{I18n.t(100442/*激活*/)}</span></div>,
										data:{title:I18n.t(100442/*激活*/),type:4}
									}]
						}}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title}>
						<StafferPlug DialogContent={this.state.DialogContent}
						 checkedData = {this.state.checkedData}
                                    /* oneData = {this.state.data}*/
						 info={this.state.info}
						 showSaveAdd ={this.state.showSaveAdd}
						 showSaveClose={this.state.showSaveClose}
						 buttonLeft = {this.state.buttonLeft}
						  onSaveAndClose ={this.onSaveAndClose}
						  contentDate = {this.state.contentDate}
						  upload={this.getPage}
						  onCancel = {this.onCancel}/>
					</Dialog>
				</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(StafferList);

