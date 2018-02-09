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

import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';
class SalesOrderList extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.addClick=this.addClick.bind(this);
		this.partyClick=this.partyClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.priceClick=this.priceClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.copyClick=this.copyClick.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.handleClick=this.handleClick.bind(this);
		this.columns = [{
			title : i18n.t(400048/*单据编号*/),
			dataIndex : 'no',
			key : "no",
			width : '10%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title : i18n.t(400011/*销售员*/),
			dataIndex : 'saleStaff'+language,
			key : "saleStaff"+language,
			width : '6%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}			
		},{
			title : i18n.t(200686/*活动类型*/),
			dataIndex : 'markActvTy'+language,
			key : "markActvTy"+language,
			width : '6%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}			
		},{
			title : i18n.t(200688/*活动性质*/),
			dataIndex : 'marketNatureName',
			key : 'marketNatureName',
			width : '5%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}			
		},{
			title : i18n.t(200243/*活动名称*/),
			dataIndex : 'markActvName',
			key : 'markActvName',
			width : '10%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}			
		},{
			title : i18n.t(200687/*拟定开始日*/),
			dataIndex : "predictSDate",
			key : "predictSDate",
			width : "6%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(200692/*拟定结束日*/),
			dataIndex : "predictEDate",
			key : "predictEDate",
			width : "6%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "6%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(400049/*业务状态*/),
			dataIndex : "status",
			key : "status",
			width : "7%",
			render(data,row,index){
				switch(data){
					case 1 :
						return i18n.t(300039/*草稿*/);
					break;
					case 5 :
						return i18n.t(200258/*已提交*/);
					break;
					case 10 :
						return i18n.t(400053/*已审批*/);
					break;
					default:										
				}
			}
		}];
		this.getPage = this.getPage.bind(this);
	}

	initState(){
		return{
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:[],
			MeunState:true,
			
			initData: [], // 初始化 数据
			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
			billId: '',	
			ccId: '',
			sData:{},

		}
	}
	addClick(){
		let {navAddTab} =this.props;
		navAddTab({id:7,name:i18n.t(200399/*市场活动新增*/),component:i18n.t(200399/*市场活动新增*/),url:'/marke/addEidt'});
		this.props.router.push('/marke/addEidt');
	}
	partyClick(){
		// let content=require('./ProductParty').default;
		// let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel});
		  //   	this.setState({
		  //   		showDilaog : true,
		  //   		title: '新增 - 平台引入',
		  //   		dialogContent: element
		  //   	})
	}
	deleteClick(react,row){
		let that = this;
		let select = this.refs.product.getSelectArr();


		// 删除 条件判断
		if(react){
			if( select.length == 0 ){
				ServiceTips({text:i18n.t(500115/*请选中一条数据？*/),type:'error'});
			} else if( select.length > 1 ){
				ServiceTips({text:i18n.t(500220/*不支持批量操作!*/),type:'error'});
			} else{
				this.deleteAjax(select[0].billId); // 删除 请求
			}
		} else{
			this.deleteAjax(row.billId); // 右键
		}
	}

	// 删除 请求
	deleteAjax(ID){
		let that = this;
		Confirm('确认删除已选中的数据？', {
			done: () => {
				apiForm(API_FOODING_ERP,'/activity/delete',{billId: ID},
					(response)=>{	
						ServiceTips({text:response.message,type:'success'});
						that.getPage();
					},(errors)=>{
						ServiceTips({text:errors['message'],type:'error'});
				});
			}
		});	
	}

	priceClick(){
		// let numArr = this.state.selectArr;
		  //   	let tempString;
		  //   	let num = numArr.length;
		  //   	if(numArr.length === 0) tempString = "自动报价";
		  //   	if(numArr.length === 1) tempString = "自动报价-"+ numArr;
		  //   	if(numArr.length > 1) tempString = "已选择"+numArr.length+"个客户";
				// 	let content=require('./Productprice').default;
				// 	let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,num:num});
		  //   	this.setState({
		  //   		showDilaog : true,
		  //   		title: tempString,
		  //   		dialogContent: element
		  //   	})
	}

	onSaveAndClose(){
		this.setState({
			showDilaog:!this.state.showDilaog
		})
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}
	copyClick(){
		console.log('copyClick')
	}
	handleClick(e,data){
		// if(data.action=="删除"){
		// 	Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
		// 	  done: () => {
		// 		    console.log('ok, got it');
		// 		},
		// 		close:() => {
		// 			console.log('no, close')
		// 		}
		// 	});
		// }else if(data.action=="自动报价"){
		// 	let content=require('./Productprice').default;
		// 	let element=React.createElement(content,{onSaveAndClose:this.onSaveAndclose,onCancel:this.onCancel,num:1});
		// 	this.setState({
		// 		showDilaog : true,
		// 		title: "自动报价",
		// 		dialogContent: element
		// 	})
		// }else if(data.action=="激活"){
		// 	console.log('让该条数据样式显示正常');
		// }else if(data.action=="失效"){
		// 	let content=require('./Failure').default;
		// 	let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel});
		// 	this.setState({
		// 		showDilaog : true,
		// 		title: '编辑失效原因',
		// 		dialogContent: element
		// 	})
		// }
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:6,name:i18n.t(200685/*市场活动详情*/),component:i18n.t(200685/*市场活动详情*/),url:'/marke/detail'});
		this.props.router.push({pathname:'/marke/detail',query:{id:record.billId}});
	}
	handleResize(height){
		let sch=document.body.offsetHeight-82-height;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
		console.log(scroll);
	}
	componentDidMount(){
		this.getPage();
		window.addEventListener('resize', this.handleResize(47));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	// 页面 刷新
	getPage(sData=null){

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
			apiGet(API_FOODING_ERP,'/activity/getPage',Object.assign({pageSize: that.state.pageSize,currentPage: that.state.currentPage},that.state.sData),
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
		let {data} = this.state;
		let meun;
		let that = this;
		if(this.state.MeunState){
			meun = [{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-send-email'}></i>{i18n.t(200256/*发邮件*/)}</div>,
					data:{action:i18n.t(200256/*发邮件*/)}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-contact'}></i>{i18n.t(100588/*联络*/)}</div>,
					data:{action:i18n.t(100588/*联络*/)}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-yuehui'}></i>{i18n.t(100587/*约会*/)}</div>,
					data:{action:i18n.t(100587/*约会*/)}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-caigou-icon'}></i>{i18n.t(200743/*采购指令*/)}</div>,
					data:{action:i18n.t(200743/*采购指令*/)}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-yuehui'}></i>{i18n.t(200744/*订舱指令*/)}</div>,
					data:{action:i18n.t(200744/*订舱指令*/)}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-order'}></i>{i18n.t(100469/*订单调整*/)}</div>,
					data:{action:i18n.t(100469/*订单调整*/)}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-approve'}></i>{i18n.t(100470/*查看审批*/)}</div>,
					data:{action:i18n.t(100470/*查看审批*/)}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-yuehui'}></i>{i18n.t(100472/*提交*/)}</div>,
					data:{action:i18n.t(100472/*提交*/)}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-send'}></i>{i18n.t(200427/*发送*/)}</div>,
					data:{action:i18n.t(200427/*发送*/)}
				}]
		}else{
			meun = [{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-send-email'}></i>{i18n.t(200256/*发邮件*/)}</div>,
					data:{action:i18n.t(200256/*发邮件*/)}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-contact'}></i>{i18n.t(100588/*联络*/)}</div>,
					data:{action:i18n.t(100588/*联络*/)}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-yuehui'}></i>{i18n.t(100587/*约会*/)}</div>,
					data:{action:i18n.t(100587/*约会*/)}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-caigou-icon'}></i>{i18n.t(200743/*采购指令*/)}</div>,
					data:{action:i18n.t(200743/*采购指令*/)}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-yuehui'}></i>{i18n.t(200744/*订舱指令*/)}</div>,
					data:{action:i18n.t(200744/*订舱指令*/)}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-order'}></i>{i18n.t(100469/*订单调整*/)}</div>,
					data:{action:i18n.t(100469/*订单调整*/)}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-approve'}></i>{i18n.t(100470/*查看审批*/)}</div>,
					data:{action:i18n.t(100470/*查看审批*/)}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-yuehui'}></i>{i18n.t(100472/*提交*/)}</div>,
					data:{action:i18n.t(100472/*提交*/)}
				},{
					onClick:this.handleClick,
					content:<div><i className={'foddingicon fooding-send'}></i>{i18n.t(200427/*发送*/)}</div>,
					data:{action:i18n.t(200427/*发送*/)}
				}]
		}
		return(<div>
			<FilterHeader  getPage = {this.getPage} normalRef={no => this.normalRef = no}/>
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
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						onRowDoubleClick={this.onRowDoubleClick}
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

