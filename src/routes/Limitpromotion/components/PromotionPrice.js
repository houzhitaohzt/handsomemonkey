import i18n from '../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../services/apiCall";
import ServiceTips from '../../../components/ServiceTips';
import FunctionKeys from "./FuncKeys";
class SalesOrderList extends Component{
	constructor(props){
		super(props);
		let that = this;
		this.getPage = this.getPage.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
		this.state = this.initState();
		this.columns = [{
			title : i18n.t(100311/*客户*/),
			dataIndex : 'salBe'+language,
			key : 'salBe'+language,
			width : '30%',
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100379/*产品*/),
			dataIndex : "mtl"+language,
			key : "mtl"+language,
			width : "30%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(200080/*类型*/),
			dataIndex : "sourceTypeName",
			key : "sourceTypeName",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100145/*创建时间*/),
			dataIndex : "createDate",
			key : "createDate",
			width : "20%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		}];

	}
	initState(){
		return{
			scrollHeight:0,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:[],
			obj:{},
			initData: [], // 初始化 数据
			currentPage:1, // 当前页
			pageSize: pageSize // 每页 多少条
			

		}
	}
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/promoteblacklist/getPage',object,
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
	handleResize = (e, height)=> {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 190 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }
	deleteClick(){
		let that = this;
		let select = this.refs.mainTab.getSelectArr();

		// 编辑 条件判断
		if(select.length == 0 ){
			ServiceTips({text:i18n.t(200328/*请选择一条数据进行操作*/),type:'error'});
		}else if( select.length > 1 ){
			ServiceTips({text:i18n.t(500220/*不支持批量操作!*/),type:'error'});
		}else{
			Confirm('确定解锁此条数据?', {
					  done: () => {
						    apiForm(API_FOODING_ERP,'/promoteblacklist/delete',{id:this.refs.mainTab.getSelectArr()[0].id},(response)=>{
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
	}
	componentDidMount(){
        this.getPage();
    };
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }
	render(){
		const data = this.state.data || [];
		let {page,currentPage} =this.state;
		let that = this;
		return(<div>
			<FilterHeader
			id={this.props.id||this.props.businessNo||this.props.offerId}
			getPage = {this.getPage} normalRef={no => this.normalRef = no}
			expandFilter={this.handleResize}
			/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys  deleteClick={this.deleteClick}/> 
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
						columns={this.columns} 
						ref = "mainTab"
						data={data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
						onRowClick={this.onRowClick}
						
						
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
export default NavConnect(SalesOrderList);