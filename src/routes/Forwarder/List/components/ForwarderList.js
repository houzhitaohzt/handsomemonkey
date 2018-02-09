import i18n from './../../../../lib/i18n';
import React, {Component, PropTypes} from "react";
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";

//引入提示
import Tooltip from 'antd/lib/tooltip';
//邮件提示 用于默认联系人
import MailDefault from "../../../Client/List/MailCard/MailDefault";

// ajax
import {webInit,apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall'; // ajax
import ServiceTips from '../../../../components/ServiceTips'; // 提示框


// 卡片
import Card from "../../../Common_confirm/Card.js";


class Forwarderlist extends Component{
	constructor(props){
		super(props)
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.onRowClick=this.onRowClick.bind(this);
		this.onHeaderCellClick=this.onHeaderCellClick.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.handleClick=this.handleClick.bind(this);
		this.addClick=this.addClick.bind(this);
		this.partyClick=this.partyClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.mergeClick=this.mergeClick.bind(this);
		this.distinctClick=this.distinctClick.bind(this);
		this.copyClick=this.copyClick.bind(this);
		this.startClick=this.startClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		let that = this;
		this.columns = [{
			title : i18n.t(400158/*货代代码*/),
			dataIndex : 'code',
			key : "code",
			width : '10%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(100299/*货代公司*/),
			dataIndex : "localName",
			key : "localName",
			width : "30%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);				
			}
		},{
			title : i18n.t(100341/*所属国家*/),
			dataIndex : "country",
			key : "country",
			width : "15%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title : i18n.t(100371/*网站*/),
			dataIndex : "web",
			key : "web",
			width : "15%",
			render(data,row,index){
				return <div className="text-ellipsis"><a onClick={that.webHrefHandle.bind(that,webInit(data))} href="javascript:;" target="_blank">{data}</a></div>;
			}
		},{
			title : i18n.t(100372/*主联系人*/),
			dataIndex : 'entprisContactor',
			key : "entprisContactor",
			width : "15%",
			render(data,row ,index){
				if( !data ) return '';
				return <Card type="forwarderLinkMan" data={row['entprisContactor']} router={that.props.router}/>;
			}
		},
		// {
		// 	title : "最近更新时间",
		// 	dataIndex : "updateDate",
		// 	key : "updateDate",
		// 	width : "7%",
		// 	render(data,row,index){
		// 		if(data){
		// 			return new Date(data).Format("yyyy-MM-dd hh:mm:ss");
		// 		}
		// 		return null;
		// 	}
		// },
		{
			title : i18n.t(100230/*状态*/),
			dataIndex : "irowSts",
			key : "irowSts",
			width : "10%",
			render(data,row,index){
				return data ? data['name'] : i18n.t(200576/*无*/);
			}
		}];


		// ajax func    
		this.getPage =this.getPage.bind(this);
		this.savePrefers =this.savePrefers.bind(this);
		this.saveFollow =this.saveFollow.bind(this);
		this.searchColor =this.searchColor.bind(this);
		this.searchFollow =this.searchFollow.bind(this);



	}

	initState(){
		return {
			scrollHeight:0,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:null,
			record: [],

			totalPages: 1, // 总页数			
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条 
			colorType: '',	// 颜色过滤
			followMark: false, // 过滤收藏
			searchVal:{}, // 查询条件
		}
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(47));
		this.getPage();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	// 网址跳转 
	webHrefHandle = (href,e)=>{
        e.stopPropagation();
        e.preventDefault();

		window.open(href);
	}

	addClick(data,result){
		let content=require('./ForwarderAdd').default;
		let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,getPage:this.getPage,
			checkedData:result ? {} : data,});
    	this.setState({
    		showDilaog : true,
    		title: result ? i18n.t(100392/*新增*/) : i18n.t(100439/*编辑*/),
    		dialogContent: element
    	})
	}
	partyClick(){
		let content=require('./ForwarderAddParty').default;
		let element=React.createElement(content,{getPage:this.getPage,onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel});
    	this.setState({
    		showDilaog : true,
    		title: i18n.t(300005/*新增 - 平台引入*/),
    		dialogContent: element
    	})
	}
	deleteClick(){
		let numArr = this.state.selectArr;
		let tempString = "";
		if(numArr.length==0){
			alert(i18n.t(200307/*请选择数据*/));
			return false;
		}else if(numArr.length==1){
			tempString=i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/);
		}else{
			tempString=i18n.t(100395/*已选中*/) + numArr.length + i18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
		}
		Confirm(tempString, {
		  done: () => {
			    console.log('ok, got it');
			},
			close:() => {
				console.log('no, close')
			}
		});
	}
	mergeClick(){
		let content=require('./ForwarderMerge').default;
		let element=React.createElement(content,{getPage:this.getPage,onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel});
    	this.setState({
    		showDilaog : true,
    		title: i18n.t(200438/*合并记录*/),
    		dialogContent: element
    	})
	}
	distinctClick(){
		let content=require('./ForwarderDistinc').default;
		let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel});
    	this.setState({
    		showDilaog : true,
    		title: i18n.t(200577/*货代去重*/),
    		dialogContent: element
    	})
	}


	copyClick(){
		let numArr = this.state.selectArr;
		let tempString = "";
		console.log('fanfan');
		if(numArr.length==0){
			alert(i18n.t(200307/*请选择数据*/));
			return false;
		}else if(numArr.length==1){
			tempString=i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/);
		}else{
			tempString=i18n.t(100395/*已选中*/) + numArr.length + i18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
		}		
	}
	startClick(){
		ServiceTips({text:'正在建设中...',type:'info'});
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
	onHeaderCellClick(e,data){
		let {checkedRows, selectArr} = this.state;
		if(data.checkedAll){
			selectArr=selectArr.concat(this.state.data);
			selectArr = Array.from(new Set(selectArr));
			checkedRows= this.state.data.map((value,index)=>index);
		}else{
			selectArr=[];
			checkedRows=[];
		}
		this.setState({
			selectArr:selectArr,
			checkedRows:checkedRows,
			choised:data.checkedAll
		})
	}
	onRowClick(record,index,checked){
		let {checkedRows, selectArr} = this.state;
		if(checked){
			selectArr.push(record);
			if(checkedRows.indexOf(index)<0){
				checkedRows.push(index);
			}
		}else{
			selectArr.slice(index,1);
			checkedRows.remove(index);
		}
		this.setState({
			selectArr:selectArr,
			checkedRows:checkedRows
		})
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:'forwader-detail',name:i18n.t(200571/*货代详情*/),component:i18n.t(200571/*货代详情*/),url:'/forwarder/detail'});
		this.props.router.push({pathname:'/forwarder/detail',query:{id:record.id,index:'detail'},state: {refresh: true}});
	}
	handleClick(e,data){

		let that = this;

		// 失效|激活 
		function OFF(action){
			apiForm(API_FOODING_DS,'/agnShipBe/'+ action,{id:data.record['id'],optlock:data.record['optlock']},
				(response)=>{
					ServiceTips({text:response.message,type:'sucess'});
					that.getPage();
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
			});			
		}

		if(data.action==i18n.t(100439/*编辑*/)){
			let ID = data.record.id;
			apiGet(API_FOODING_DS,'/agnShipBe/getOne',{id: ID},
				(response)=>{	
					this.addClick( response.data );
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
			});
		}else if(data.action==i18n.t(100437/*删除*/)){
			this.deleteClick();
		}else if(data.action==i18n.t(200256/*发邮件*/)){
			// let content=require('./ForwaderSendEmail').default;
			// let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,dataMain:{contacts:'112315@163.com'}})
	  //   	this.setState({
	  //   		showDilaog : true,
	  //   		title: i18n.t(200578/*请选择收件人*/),
	  //   		dialogContent: element
	  //   	})
		}else if(data.action==i18n.t(100588/*联络*/)){
			let {navAddTab, navRemoveTab} = this.props;
             navRemoveTab({name:i18n.t(200571/*货代详情*/),component:i18n.t(200571/*货代详情*/),url:'/forwarder/detail'});
             navAddTab({ name: i18n.t(200571/*货代详情*/), component: i18n.t(200571/*货代详情*/), url: '/forwarder/detail'});
             this.props.router.push({pathname: '/forwarder/detail',query:{id:data.record.id,index:'contact'}});
		}else if(data.action==i18n.t(100585/*市场活动响应*/)){
			let {navAddTab, navRemoveTab} = this.props;
             navRemoveTab({name:i18n.t(200571/*货代详情*/),component:i18n.t(200571/*货代详情*/),url:'/forwarder/detail'});
             navAddTab({ name: i18n.t(200571/*货代详情*/), component: i18n.t(200571/*货代详情*/), url: '/forwarder/detail'});
             this.props.router.push({pathname: '/forwarder/detail',query:{id:data.record.id,index:'activity'}});
		}else if(data.action==i18n.t(100587/*约会*/)){
			let {navAddTab, navRemoveTab} = this.props;
             navRemoveTab({name:i18n.t(200571/*货代详情*/),component:i18n.t(200571/*货代详情*/),url:'/forwarder/detail'});
             navAddTab({ name: i18n.t(200571/*货代详情*/), component: i18n.t(200571/*货代详情*/), url: '/forwarder/detail'});
             this.props.router.push({pathname: '/forwarder/detail',query:{id:data.record.id,index:'date'}});
		}else if(data.action==i18n.t(100585/*市场活动响应*/)){

		}else if(data.action==i18n.t(200579/*询价*/)){
			
		}else if(data.action==i18n.t(200580/*订舱委托*/)){

		}else if(data.action==i18n.t(100450/*更新价格*/)){

		}else if(data.action==i18n.t(200581/*查看运价*/)){

		}else if(data.action == 'OFF'){
			OFF('disable');	 // 失效
		}else if(data.action == 'ON'){
			OFF('enable');	 // 激活
		}
	}
	handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 180 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
    }

	// 删除
	deleteClick(){

		let select = this.refs.provider.getSelectArr();
		let IDAll = select.map( (o)=>o.id );
		let that = this;

		if( select.length == 0 ){
			Confirm(i18n.t(500115/*请选中一条数据？*/));
		} else{
			Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
				done: () => {
					apiForm(API_FOODING_DS,'/agnShipBe/delete',{id: IDAll},
						(response)=>{							
							ServiceTips({text:response.message,type:'sucess'});
							that.getPage();
						},(errors)=>{
							ServiceTips({text:errors.message,type:'error'});
					});
				}
			});			
		}

	}

	// 过滤颜色
	searchColor(color){
		this.setState({colorType: color}, function(){
			this.getPage();
		});
	}

	// 过滤 收藏
	searchFollow(result){
		this.setState({followMark: result}, function(){
			this.getPage();
		});
	}

	// 选择颜色
	savePrefers(color,row){
		let that = this;
		apiForm(API_FOODING_DS,'/agnShipBe/savePrefers',{custId:row.id, colorType:color, optlock:row.optlock},
			(response)=>{
				that.getPage();
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'})
		});
	}

	// 收藏
	saveFollow(row,index,result){

		let that = this;
		apiForm(API_FOODING_DS,'/agnShipBe/savePrefers',{custId:row.id, followMark:result, optlock:row.optlock},
			(response)=>{
				that.getPage();
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'})
		});		
	}

	// 页面刷新
	getPage(data = null){

		data ? 
			this.setState( {searchVal: data,currentPage:1}, function(){ this.getPageAjax() })
			:
			this.getPageAjax(); 
	}

	// 页面刷新 ajax
	getPageAjax(){

		let page = {pageSize:this.state.pageSize,currentPage:this.state.currentPage, colorType:this.state.colorType, followMark:this.state.followMark};
		let value = Object.assign(page,this.state.searchVal);
		let that = this;

		apiGet(API_FOODING_DS,'/agnShipBe/getPage',value,
			(response)=>{
				that.setState({
					record: response.data.data || [],
					data: response.data.data,
					totalPages: response.data.totalPages,
					currentPage: response.data.currentPage,
					totalRecords:response.data.totalRecords	
				});
			},(errors)=>{
		});
	}

	render(){

		let that = this;
		const {record} = this.state;
		return(<div>
			<FilterHeader getPage={this.getPage} expandFilter= {this.handleResize}/>
			<div ref="forward" className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} partyClick={this.partyClick} deleteClick={this.deleteClick} mergeClick={this.mergeClick} distinctClick={this.distinctClick} startClick={this.startClick} />
						<Page 
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages} 
							totalRecords={this.state.totalRecords}
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
						ref = "provider"
						columns={this.columns}
						data={record}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : true, dataIndex:'colorType', onSelect: this.savePrefers, onHeaderSelect: this.searchColor}}
						followConfig={{show:true, onClick:this.saveFollow, dataIndex:'followMark', onHeaderClick: this.searchFollow}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						onRowDoubleClick={this.onRowDoubleClick}
						contextMenuConfig={{
							enable:true,
							contextMenuId:'SIMPLE_TABLE_MENU',
							menuItems:[
							//{
								//permissions:'forwarder.edit',
								//onClick:this.handleClick,
								//content:<div><i className={'foddingicon fooding-alter_icon2'}></i>编辑</div>,
								//data:{action:'编辑'}
							//},
							{
								permissions:'forwarder.del',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
								data:{action:i18n.t(100437/*删除*/)}
							}
							// },{
							// 	permissions:'forwarder.semail',
							// 	onClick:this.handleClick,
							// 	content:<div><i className={'foddingicon fooding-send-email'}></i><span>{i18n.t(200256/*发邮件*/)}</span></div>,
							// 	data:{action:i18n.t(200256/*发邮件*/)}
							// },{
							,{
								permissions:'forwarder.right.liaison',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-contact'}></i><span>{i18n.t(100588/*联络*/)}</span></div>,
								data:{action:i18n.t(100588/*联络*/)}
							},{
								permissions:'forwarder.right.response',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-activity'}></i><span>{i18n.t(100585/*市场活动响应*/)}</span></div>,
								data:{action:i18n.t(100585/*市场活动响应*/)}
							},{
								permissions:'forwarder.right.date',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-yuehui'}></i><span>{i18n.t(100587/*约会*/)}</span></div>,
								data:{action:i18n.t(100587/*约会*/)}
							},
							//{
								//onClick:this.handleClick,
								//content:<div><i className={'foddingicon fooding-product'}></i><span>供应商产品</span></div>,
								//data:{action:'供应商产品'}
							//},
							//{
								//onClick:this.handleClick,
								//content:<div><i className={'foddingicon fooding-enquity'}></i><span>询价</span></div>,
								//data:{action:'询价'}
							//},
							//{
								//onClick:this.handleClick,
								//content:<div><i className={'foddingicon fooding-page'}></i><span>订舱委托</span></div>,
								//data:{action:'订舱委托'}
							//},
							//{
								//onClick:this.handleClick,
								//content:<div><i className={'foddingicon fooding-page'}></i><span>更新价格</span></div>,
								//data:{action:'更新价格'}
							//},
							//{
								//onClick:this.handleClick,
								//content:<div><i className={'foddingicon fooding-page'}></i><span>查看运价</span></div>,
								//data:{action:'查看运价'}
							//},
							{
								permissions:'forwarder.Invalid',								
								onClick:this.handleClick,
								condition: [{key: 'irowSts.id', value: [5,10], exp: '==='}],
								content:<div><i className={'foddingicon fooding-shixiao'}></i>{i18n.t(100441/*失效*/)}</div>,
								data:{action:'OFF'}
							},{
								permissions:'forwarder.activation',								
								onClick:this.handleClick,
								condition: [{key: 'irowSts.id', value: [5,20], exp: '==='}],
								content:<div><i className={'foddingicon fooding-shixiao'}></i>{i18n.t(100442/*激活*/)}</div>,
								data:{action:'ON'}
							}]
						}}
					/>
					<Dialog width={1000} visible={this.state.showDilaog} title={this.state.title}>
						{this.state.dialogContent}
					</Dialog>
					</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(Forwarderlist);
