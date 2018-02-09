import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table  from "../../../../components/Table";//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import Select, { Option } from 'rc-select';
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import Loading from "../../../../components/Loading";//加载动画
//引入提示
import Tooltip from 'antd/lib/tooltip';
//邮件提示 用于默认联系人
import MailDefault from "../../../Client/List/MailCard/MailDefault";
// ajax
import {webInit,apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall'; // ajax
import ServiceTips from '../../../../components/ServiceTips'; // 提示框

import Card from "../../../Common_confirm/Card.js"; // 卡片


class ProviderList extends Component{

	constructor(props){
		super(props);
		this.columns =[];
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.partyClick=this.partyClick.bind(this);
		this.mergeClick=this.mergeClick.bind(this);
		this.distinctClick=this.distinctClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.copyClick=this.copyClick.bind(this);
		this.onRowClick=this.onRowClick.bind(this);
		this.onHeaderCellClick=this.onHeaderCellClick.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.handleClick=this.handleClick.bind(this);
		this.onChange = this.onChange.bind(this);
		this.initHeadTable = this.initHeadTable.bind(this);
		this.addPost = this.addPost.bind(this);
		this.initHeadTable();


		if(this.props.stateMaps.stateMaps['providerList']){
			var that = this;
			this.state = this.props.stateMaps.stateMaps['providerList'];
			let content;
			switch (this.state.title) {
				case i18n.t(100439/*编辑*/):
						content=require('./ProviderEdit').default;
					break;
				default:
						content=require('./ProviderEdit').default;
			}
			let element=React.createElement(content,{onSaveAndClose:that.onSaveAndClose,onCancel:that.onCancel});
			this.state.dialogContent = element;
		}else{
			this.state = this.initState();
		}



		// ajax func
		this.getInit = this.getInit.bind(this);
		this.getPage =this.getPage.bind(this);
		this.savePrefers =this.savePrefers.bind(this);
		this.saveFollow =this.saveFollow.bind(this);
		this.searchColor =this.searchColor.bind(this);
		this.searchFollow =this.searchFollow.bind(this);


	}

	// init state
	initState(){
		return{
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:null,
			MeunState:true,
			serachOne:'',
			showLoading:true,
			getOne: {}, //
			record: [], // tabal

			totalPages: 1, // 总页数
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条
			colorType: '',	// 颜色过滤
			followMark: false, // 过滤收藏
			searchVal:{}, // 查询条件

		}
	}

	// page state
	pageState(refresh={}){
		return Object.assign(
			{
				// 查询 条件
				beAreaId: "",
				cityId: "",
				cntryId: "",
				contactor: undefined,
				cstmLvId: "",
				cstmSrcId: "",
				districtId: "",
				email: undefined,
				endTime: null,
				mtl: undefined,
				name: "",
				provinceId: "",
				startTime: null,
			},
			refresh
		);
	}

	componentDidMount(){
		var that = this;
		this.getPage();
		window.addEventListener('resize', this.handleResize(80));
    }

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(80));
		this.props.saveState('providerList',this.state);
	}

	componentWillReceiveProps(nextProps) {
	}

	onChange(e){
		this.initHeadTable(e);
		this.setState({

		});

	}

	initHeadTable(e){
		let that = this;
	    this.columns = [
		{
			title : i18n.t(200964/*供应商代码*/),
			dataIndex : "code",
			key : "code",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},
		{
			title : i18n.t(100312/*供应商*/),
			dataIndex : 'localName',
			searchData:e?e:'',
			key : "localName",
			template:<Select optionLabelProp='children'  style={{width:'100%'}} name={"name"} onChange={this.onChange}>
							<Option value ={'0'}>{'dd'}</Option>
					 </Select>,
			width : '30%',
			render(data,row,index){
				return (<div className={'text-ellipsis'}>{data}</div>);
			}
		},{
			title : i18n.t(100341/*所属国家*/),
			dataIndex : "country",
			key : "country",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(200468/*供应商等级*/),
			dataIndex : "cstmLevel",
			key : "cstmLevel",
			width : "8%",
			template:<input   name={"level"}
					style={{width:'100%'}} 	type='text' className='text-input'/>,
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100371/*网站*/),
			dataIndex : "defaultWeb",
			searchData:1,
			key : "defaultWeb",
			width : "15%",
					template:<input   name={"defaultWeb"}
						style={{width:'100%'}} 	type='text' className='text-input'/>,
			render(data,row,index){
				return <div className="text-ellipsis"><a onClick={that.webHrefHandle.bind(that,webInit(data))} href="javascript:;" target="_blank">{data}</a></div>;
			}
		},{
			title : i18n.t(200566/*主要联系人*/),
			dataIndex : "defaultContact",
			searchData:1,
			key : "defaultContact",
			width : "15%",
			template:<input   name={"defaultContact"}
			style={{width:'100%'}} 	type='text' className='text-input'/>,
			render(data,row,index){

				// return <Card type="userLinkMan" data={row['defaultContact']}/>;



				let value = null;
                if (data && data.localName) {
                    value = data.localName;
                }
                if( !value) return null;
                return (<Tooltip
                    placement="bottomRight"
                    mouseEnterDelay={0.5}
                    arrowPointAtCenter={true}
                    mouseLeaveDelay={0.2}
                    prefixCls="card-toolip"
					trigger="click"
                    overlay={<MailDefault data={data} router={that.props.router} type={'provider'} />}
                >
                    <span className={'mail-hover'}>{value}</span>
                </Tooltip>)
			}
		},{
			title : i18n.t(100230/*状态*/),
			dataIndex : "irowSts",
			key : "irowSts",
			width : "5%",
			render(data,row,index){
				return data ? data['name'] : i18n.t(200576/*无*/);
			}
		}];
	}

	// 网址跳转 
	webHrefHandle = (href,e)=>{
        e.stopPropagation();
        e.preventDefault();

		window.open(href);
	}

	// 新增
	addClick(data,result){

		var that = this;
		// apiGet(API_FOODING_DS,'/vendor/getInit',{},
		// (response)=>{
		// 	let content=require('./ProviderAdd').default;
		// 	let element=React.createElement(content,{
		// 				onSaveAndClose: that.onSaveAndClose,
		// 				onCancel:that.onCancel,
		// 				initData:response.data,
		// 				getPage:that.getPage,
		// 				checkedData: result ? {} : data,
		// 			});
		// 	that.setState({
		// 				showDilaog : true,
		// 				title: i18n.t(100392/*新增*/),
		// 				dialogContent: element,
		// 				dialogFile:'./ProviderAdd'
		// 		})
		// },(errors)=>{

		// })
			let content=require('./ProviderAdd').default;
			let element=React.createElement(content,{
						onSaveAndClose: that.onSaveAndClose,
						onCancel:that.onCancel,
						initData:{},
						getPage:that.getPage,
						checkedData: result ? {} : data,
					});
			that.setState({
						showDilaog : true,
						title: i18n.t(100392/*新增*/),
						dialogContent: element,
						dialogFile:'./ProviderAdd'
				})



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
					apiForm(API_FOODING_DS,'/vendor/delete',{id: IDAll},
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

	addPost(value){
		var that = this;
		apiPost(API_FOODING_DS,'/vendor/save',value,(response)=>{
				ServiceTips({text:response.message,type:'sucess'});
				this.getPage();
		},
		(errors)=>{
			ServiceTips({text:errors.message,type:'error'});
		})
		this.setState({
			showDilaog:false
		});
	}

	getInit(id){

	}

	// 平台引入
	partyClick(e){



		let content=require('../../../Common_confirm/Party').default;
		let element=React.createElement(content,{ident:'provider',onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel});
		this.setState({
    		showDilaog : true,
    		title: i18n.t(100393/*平台引入*/),
    		dialogContent: element,
    	})
	}

	mergeClick(){
		let content=require('./ProviderMerge').default;
		let element=React.createElement(content,{getPage:this.getPage,onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,getPage:this.getPage })
    	this.setState({
    		showDilaog : true,
    		title: i18n.t(200438/*合并记录*/),
    		dialogContent: element,
				dialogFile:'./ProviderMerge'
    	})
	}

	distinctClick(){
		let content=require('./ProviderDistinct').default;
		let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel})
    	this.setState({
    		showDilaog : true,
    		title: i18n.t(200973/*供应商去重*/),
    		dialogContent: element,
			dialogFile:'./ProviderDistinct'
    	})
	}

	copyClick(){

	}

	onSaveAndClose(){
		this.setState({
			showDilaog:false
		},()=>{

		})
	}

	onCancel(){
		this.setState({
			showDilaog:false
		},()=>{

		})
	}

	handleClick(e,data){

		let that = this;

		// 失效|激活
		function OFF(action){
			apiForm(API_FOODING_DS,'/vendor/'+ action,{id:data.record['id'],optlock:data.record['optlock']},
				(response)=>{
					ServiceTips({text:response.message,type:'sucess'});
					that.getPage();
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
			});
		}

		if(data.action==i18n.t(100439/*编辑*/)){
			let ID = data.record.id;
			apiGet(API_FOODING_DS,'/vendor/getOne',{id: ID},
				(response)=>{
					this.addClick( response.data );
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
			});

		}else if(data.action==i18n.t(100437/*删除*/)){
			this.deleteClick();
		}else if(data.action==i18n.t(200256/*发邮件*/)){
			// let content=require('../../../Client/List/components/SendEmail').default;
			// let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,dataMain:{contacts:'112315@163.com'}})
	  //   	this.setState({
	  //   		showDilaog : true,
	  //   		title: i18n.t(200256/*发邮件*/),
	  //   		dialogContent: element
	  //   	})
		}else if(data.action==i18n.t(100588/*联络*/)){
			let {navAddTab, navRemoveTab} = this.props;
			navRemoveTab({name:i18n.t(200935/*供应商详情*/),component:i18n.t(200935/*供应商详情*/),url:'/provider/detail'});
             navAddTab({ name: i18n.t(200935/*供应商详情*/), component: i18n.t(200935/*供应商详情*/), url: '/provider/detail'});
             this.props.router.push({pathname: '/provider/detail',query:{id:data.record.id,index:'contact'}});
		}else if(data.action==i18n.t(100585/*市场活动响应*/)){
			let {navAddTab, navRemoveTab} = this.props;
			navRemoveTab({name:i18n.t(200935/*供应商详情*/),component:i18n.t(200935/*供应商详情*/),url:'/provider/detail'});
             navAddTab({ name: i18n.t(200935/*供应商详情*/), component: i18n.t(200935/*供应商详情*/), url: '/provider/detail'});
             this.props.router.push({pathname: '/provider/detail',query:{id:data.record.id,index:'activity'}});
		}else if(data.action==i18n.t(100587/*约会*/)){
			let {navAddTab, navRemoveTab} = this.props;
			navRemoveTab({name:i18n.t(200935/*供应商详情*/),component:i18n.t(200935/*供应商详情*/),url:'/provider/detail'});
             navAddTab({ name: i18n.t(200935/*供应商详情*/), component: i18n.t(200935/*供应商详情*/), url: '/provider/detail'});
             this.props.router.push({pathname: '/provider/detail',query:{id:data.record.id,index:'date'}});
		}else if(data.action==i18n.t(200582/*供应商产品*/)){

		}else if(data.action==i18n.t(200974/*供应商合并*/)){

		}else if(data.action==i18n.t(200579/*询价*/)){

		}else if(data.action==i18n.t(100450/*更新价格*/)){

		}else if(data.action == 'OFF'){
			OFF('disable');	 // 失效
		}else if(data.action == 'ON'){
			OFF('enable');	 // 激活
		}
	}

	onHeaderCellClick(e,data){
		let {checkedRows, selectArr} = this.state;
		if(data.checkedAll){
			selectArr=selectArr.concat(this.state.record);
			selectArr = Array.from(new Set(selectArr));
			checkedRows= selectArr.map((value,index)=>index);
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

	search(data){
	}

	onRowClick(record,index,checked){
		let {checkedRows, selectArr} = this.state;
		if(checked){
			selectArr.push(record);
			if(checkedRows.indexOf(index)<0){
				checkedRows.push(index);
			}
		}else{
			selectArr.remove(record);
			checkedRows.remove(index);
		}
		this.setState({
			selectArr:selectArr,
			checkedRows:checkedRows
		})
	}

	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:'provider-detail',name:i18n.t(200935/*供应商详情*/),component:i18n.t(200935/*供应商详情*/),url:'/freightProvider/detail'});
		this.props.router.push({pathname:'/freightProvider/detail',query:{id:record.id},state: {refresh: true}});
	}

	handleResize(e, height) {
        this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 180 - this.filterHeight;
        let scrollHeight = scroll + 70;
        this.setState({scroll: scroll,scrollHeight:scrollHeight});
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
		apiForm(API_FOODING_DS,'/vendor/savePrefers',{id:row.id, colorType:color, optlock:row.optlock},
			(response)=>{
				that.getPage();
				ServiceTips({text: response.message,type: 'success'});
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// 收藏
	saveFollow(row,index,result){

		let that = this;
		apiForm(API_FOODING_DS,'/vendor/savePrefers',{id:row.id, followMark:result, optlock:row.optlock},
			(response)=>{
				that.getPage();
				ServiceTips({text: response.message,type: 'success'});
			},(errors)=>{
				ServiceTips({text: errors.message,type: 'error'});
		});
	}

	// // 页面刷新
	// getPage(data = null){
	// 	data ?
	// 		this.setState( {searchVal: data,currentPage:1}, function(){ this.getPageAjax() })
	// 		:
	// 		this.getPageAjax();
	// }

	// // 页面刷新 ajax
	// getPageAjax(){

	// 	let page = {pageSize:this.state.pageSize,currentPage:this.state.currentPage, colorType:this.state.colorType, followMark:this.state.followMark};
	// 	let value = Object.assign(page,this.state.searchVal);
	// 	let that = this;

	// 	apiGet(API_FOODING_DS,'/vendor/getPage',value,
	// 		(response)=>{
	// 			that.setState({
	// 				record: response.data.data,
	// 				data: response.data.data,
	// 				totalPages: response.data.totalPages,
	// 				currentPage: response.data.currentPage
	// 			});
	// 		},(errors)=>{
	// 	});
	// }
	// ajax list
	getPage(currentPage,value){

		    let that = this;
		    let object;
			let {followMark,colorType} = this.state;
		    let pageSize = value|| this.state.pageSize;
		    let currentP = !isNaN(currentPage)? currentPage: 1;
		    if(this.normalRef.getForm().salBeId){
		    	object=Object.assign({},{followMark:followMark,colorType:colorType,pageSize: pageSize, currentPage:currentP,salBeId:this.props.id,businessNo:this.props.businessNo},this.normalRef.getForm());
		    }else{
		    	let a = this.normalRef.getForm();
		    	delete a.salBeId;
		    	object=Object.assign({},{followMark:followMark,colorType:colorType,pageSize: pageSize, currentPage:currentP,salBeId:this.props.id,businessNo:this.props.businessNo},a);
		    }

			// 拼接时间格式
			object['startTime'] = object['startTime'] ? object['startTime'] + ' 00:00:00' : '';
			object['endTime'] = object['endTime'] ? object['endTime'] + ' 23:59:59' : '';

			apiGet(API_FOODING_DS,'/vendor/getPage',object,
				(response)=>{
					that.setState({
						data:response.data.data,
						record: response.data.data,
						totalRecords:response.data.totalRecords,
						totalPages: response.data.totalPages,
						currentPage: response.data.currentPage
					});
				},(errors)=>{
			});


	}

	render(){
		let {record} = this.state;
		let that = this;
		return(<div>
			<FilterHeader getPage={this.getPage} normalRef={no => this.normalRef = no} expandFilter= {this.handleResize}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick} partyClick={this.partyClick} mergeClick={this.mergeClick} distinctClick={this.distinctClick} deleteClick={this.deleteClick}  copyClick={this.copyClick} />
						<Page totalPages={this.state.totalPages}
                                      currentPage={this.state.currentPage}
                                      totalRecords={this.state.totalRecords}
                                      currentSize={this.state.size}
                                      pageSizeChange={(value) => {
                                          if (this.state.size == value) {
                                              return;
                                          }
																			    this.setState({pageSize:value});
                                          this.getPage(1, value);
                                      }} backClick={(v) => {
                                    if (this.state.currentPage == v) {
                                        return;
                                    }
                                    this.getPage(v);
                                }} nextClick={(v) => {
                                    if (this.state.currentPage == v) {
                                        return;
                                    }
                                    this.getPage(v);
                                }}
                                      goChange={(v) => {
                                          if (this.state.currentPage == v) {
                                              return;
                                          }
                                          this.getPage(v);
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
						//onHeaderCellClick={this.onHeaderCellClick}
						//onRowClick={this.onRowClick}
						onRowDoubleClick={this.onRowDoubleClick}
						contextMenuConfig={{
							enable:true,
							contextMenuId:'SIMPLE_TABLE_MENU',
							menuItems:[
							//{
								//permissions:'provider.edit',
								//onClick:this.handleClick,
								//content:<div><i className={'foddingicon fooding-alter'}></i><span>编辑</span></div>,
								//data:{action:'编辑'}
							//},
							{
								permissions:'provider.del',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{i18n.t(100437/*删除*/)}</div>,
								data:{action:i18n.t(100437/*删除*/)}
							},//{
								// permissions:'provider.semail',
								// onClick:this.handleClick,
								// content:<div><i className={'foddingicon fooding-send-email'}></i><span>{i18n.t(200256/*发邮件*/)}</span></div>,
								// data:{action:i18n.t(200256/*发邮件*/)}
							//},
							{
								permissions:'provider.right.liaison',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-contact'}></i><span>{i18n.t(100588/*联络*/)}</span></div>,
								data:{action:i18n.t(100588/*联络*/)}
							},{
								permissions:'provider.right.response',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-activity'}></i><span>{i18n.t(100585/*市场活动响应*/)}</span></div>,
								data:{action:i18n.t(100585/*市场活动响应*/)}
							},{
								permissions:'provider.right.date',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-yuehui'}></i><span>{i18n.t(100587/*约会*/)}</span></div>,
								data:{action:i18n.t(100587/*约会*/)}
							}
							//,{
								//permissions:'provider.right.mtl',
								//onClick:this.handleClick,
								//content:<div><i className={'foddingicon fooding-product'}></i><span>{i18n.t(200582/*供应商产品*/)}</span></div>,
								//data:{action:i18n.t(200582/*供应商产品*/)}
							//}
							,{
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-merge_icon'}></i><span>{i18n.t(200974/*供应商合并*/)}</span></div>,
								data:{action:i18n.t(200974/*供应商合并*/)}
							},
							//{
							//	onClick:this.handleClick,
							//	content:<div><i className={'foddingicon fooding-enquity'}></i><span>询价</span></div>,
							//	data:{action:'询价'}
							//},
							//{
							//	onClick:this.handleClick,
							//	content:<div><i className={'foddingicon fooding-page'}></i><span>更新价格</span></div>,
							//	data:{action:'更新价格'}
							//},
							{
								onClick:this.handleClick,
								condition: [{key: 'irowSts.id', value: [5,10], exp: '==='}],
								content:<div><i className={'foddingicon fooding-shixiao'}></i>{i18n.t(100441/*失效*/)}</div>,
								data:{action:'OFF'}
							},{
								onClick:this.handleClick,
								condition: [{key: 'irowSts.id', value: [5,20], exp: '==='}],
								content:<div><i className={'foddingicon fooding-shixiao'}></i>{i18n.t(100442/*激活*/)}</div>,
								data:{action:'ON'}
							}]
						}}
					/>
					<Dialog width={926}  visible={this.state.showDilaog}
					 title={this.state.title}>
						{this.state.dialogContent}
					</Dialog>
					</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(ProviderList);
