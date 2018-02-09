import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import CountryInformationPlug from "./CountryInformationPlug";
import {apiGet,apiPost,apiForm,API_FOODING_ES,API_FOODING_DS,pageSize,sizeList} from '../../../../services/apiCall';
import Loading from "../../../../components/Loading";//加载动画
import ServiceTips from "../../../../components/ServiceTips";//提示框
import {I18n} from "../../../../lib/i18n";
class CountryInformationList extends Component{
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
			title :  I18n.t(100000/*代码*/),
			dataIndex : 'code',
			key : "code",
			width : '8%',
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100001/*名称*/),
			dataIndex : "localName",
			key : "localName",
			width : '10%',
			render(data,row,index){
				return data;
			}
		},{
			title :  I18n.t(100083/*三字码*/),
			dataIndex : "stThWord",
			key : "stThWord",
			width : "8%",
			render(data,row,index){
				return data;
			}
		},{
			title :  I18n.t(100084/*电话区号*/),
			dataIndex : "cntrycode",
			key : "cntrycode",
			width : "8%",
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title :  I18n.t(100085/*风险类型*/),
			dataIndex : "riskType",
			key : "riskType",
			width : "8%",
			render(data,row,index){
				return data;
			}
		},{
			title :  I18n.t(100086/*时区*/),
			dataIndex : "timZon",
			key : "timZon",
			width : "10%",
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
				checkedData:'',
				data : [],
				pageSize:pageSize,
				currentPage:1
				
			}
	}
	addClick(){
		this.setState({
				rodalShow : true,
				showHeader:true,
				DialogContent:1,
				showSaveAdd:true,
				showSaveClose:true,
				title:I18n.t(100088/*国家信息新增*/),
				checkedData:''
		})
	}
	editClick(record){
		var that = this;
		apiGet(API_FOODING_DS,'/country/getOne',{id:record.record.id},(response)=>{
			that.setState({
				DialogContent:3,
				checkedData:response.data
			})
		},(error)=>{

		})
		this.setState({
				rodalShow : true,
				showHeader:true,
				DialogContent:0,
				title:I18n.t(100089/*国家信息编辑*/),
				showSaveAdd:false,
				showSaveClose:true
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
						    apiForm(API_FOODING_DS,'/country/delete',{id:value},(response)=>{
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
		apiPost(API_FOODING_DS,'/country/save',value,(response)=>{
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
	}
	handleClick(e,data){
		//右键处理
		if(data.type == 1){
			this.deleteClick(data);
		}else if(data.type ==2){
  			this.editClick(data);
  		}
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({name:I18n.t(100090/*国家信息详情*/),component:I18n.t(100090/*国家信息详情*/),url:'/countryinformation/detail'});
		this.props.router.push({pathname:'/countryinformation/detail',query:{id:record.id}});
	}
	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
		let object=Object.assign({},{isPlatform:true, pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_DS,'/country/getPage',object,
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
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader normalRef={no => this.normalRef = no} getPage ={this.getPage}  expandFilter= {this.handleResize} />
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} deleteClick={this.deleteClick}  />
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
						contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									permissions:'country.del',
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{I18n.t(100437/*删除*/)}</div>,
									data:{type:1,title:I18n.t(100437/*删除*/)}
									},{
										permissions:'country.edit',
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{I18n.t(100439/*编辑*/)}</div>,
										data:{type:2,title:I18n.t(100439/*编辑*/)}
									}]
						}}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title}>
						<CountryInformationPlug DialogContent={this.state.DialogContent}
						 checkedData = {this.state.checkedData}
						 showSaveAdd ={this.state.showSaveAdd}
						 showSaveClose={this.state.showSaveClose}
						 buttonLeft = {this.state.buttonLeft}
						 onSaveAndClose ={this.onSaveAndClose}
						 contentDate = {this.state.contentDate}
						 upload ={this.getPage}
						 onCancel = {this.onCancel}/>
					</Dialog>
				</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(CountryInformationList);

