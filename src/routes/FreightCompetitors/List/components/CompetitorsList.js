import React,{Component,PropTypes} from 'react';
const {Table} = require("../../../../components/Table");
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionsKeys from "./FunctionsKeys";
import Checkbox from '../../../../components/CheckBox';



// ajax
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall'; // ajax
import ServiceTips from '../../../../components/ServiceTips'; // 提示框

import {I18n} from '../../../../lib/i18n';//国际化



class CompetitorsList extends Component{ 
	constructor(props){
		super(props);
		this.columns = [];
		this.state=this.initState();
		this.addClick=this.addClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);

		this.deleteClick=this.deleteClick.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.onRowClick=this.onRowClick.bind(this);
		this.onHeaderCellClick=this.onHeaderCellClick.bind(this);
		this.columns = [{
			//title : "竞争对手名称",
			title: I18n.t(100449/*竞争对手*/),
			dataIndex : 'localName',
			key : "localName",
			width : '10%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			//title:"所属国家",
			title : I18n.t(100341/*所属国家*/),
			dataIndex : "country",
			key : "country",
			width : "8%",
			render(data,row,index){
				var data =  data ? data['localName'] : '';
				return (<div className="text-ellipsis" title={data}>{data}</div>);				
			}
		},{
			//title : "网站",
			title: I18n.t(100371/*网站*/),
			dataIndex : "defaultWeb",
			key : "defaultWeb",
			width : "8%",
			render(data,row,index){
				var data =  data ? data['localName'] : '';
				return (<div className="text-ellipsis" title={data}>{data}</div>);								
			}
		},{
			//title : "邮箱",
			title: I18n.t(100229/*邮箱*/),
			dataIndex : "defaultEmail",
			key : "defaultEmail",
			width : "8%",
			render(data,row,index){
				var data =  data ? data['localName'] : '';
				return (<div className="text-ellipsis" title={data}>{data}</div>);				
			}
		},{
			//title : "最近更新时间",
			title: I18n.t(100388/*最新更新时间*/),
			dataIndex : "updateDate",
			key : "updateDate",
			width : "6%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd hh:mm:ss');
			}
		},{
			//title : "状态",
			title: I18n.t(100230/*状态*/),
			dataIndex : "irowSts",
			key : "irowSts",
			width : "2%",
			render(data,row,index){
				return data ? data['name'] : '';
			}
		}];

		// even func 
		this.getPage = this.getPage.bind(this);

	}
	initState(){
		return {
			scrollHeight:0,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:null,
			record:[],

			totalPages: 1, // 总页数			
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条 
			colorType: '',	// 颜色过滤
			followMark: false, // 过滤收藏
			searchVal:{}, // 查询条件
		}
	}

	componentDidMount(){
		window.addEventListener('resize', this.handleResize(0));
		this.getPage();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(0));
	}

	addClick(data,result){
		console.log();
		let content =require('./CompetitorsListAddAndEdit').default;
		let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,
			checkedData: result ? {} : data,
			getPage: this.getPage,
		});
    	this.setState({
    		showDilaog : true,
    		title: data['id'] ? I18n.t(100439/*编辑*/) : I18n.t(100392/*新增*/),
    		dialogContent : element
    	})
	}

	// 删除
	deleteClick(){

		let select = this.refs.provider.getSelectArr();
		let IDAll = select.map( (o)=>o.id );
		let that = this;

		if( select.length == 0 ){
			Confirm(I18n.t(100434/*请选择一条数据！*/));
		} else{
			Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				done: () => {
					apiForm(API_FOODING_DS,'/rival/delete',{id: IDAll},
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

	onSaveAndClose(){
		this.setState({
			showDilaog:!this.state.showDilaog
		})
	}
	onCancel(that){
		this.setState({
			showDilaog:false
		})
	}


	onHeaderCellClick(e,data){
		let {checkedRows, selectArr} = this.state;
		if(data.checkedAll){
			selectArr=selectArr.concat(this.state.data);
			selectArr = Array.from(new Set(selectArr));
			checkedRows= this.state.record.map((value,index)=>index);
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
		let {checkedRows}=this.state;
		let selectArr =[];
  		if(checked){
			if(checkedRows.indexOf(index)<0){
				checkedRows.push(index);
			}
  		}else{
  			for(let i=0,length=checkedRows.length;i<length;i++){
  				if(checkedRows[i]==index){
  					checkedRows.splice(i,1);
  				}
  			}
  		}
  		for(let i=0,length=checkedRows.length;i<length;i++){
  			selectArr.push(this.state.record[checkedRows[i]]);
  		}
  		this.setState({
  			selectArr : selectArr,
			checkedRows:checkedRows
  		})
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:'forwader-detail',name:I18n.t(100449/*竞争对手*/) + I18n.t(100097/*详情*/),component:I18n.t(100449/*竞争对手*/) + I18n.t(100097/*详情*/),url:'/freightCompetitors/detail'});
		this.props.router.push({pathname:'/freightCompetitors/detail',query:{id:record.id}});
	}
	handleClick=(e,data) => {

		let that = this;

		// 失效|激活 
		function OFF(action){
			apiForm(API_FOODING_DS,'/rival/'+ action,{id:data.record['id'],optlock:data.record['optlock']},
				(response)=>{
					ServiceTips({text:response.message,type:'sucess'});
					that.getPage();
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
			});			
		}

		if(data.type == 1){
			let ID = data.record.id;
			apiGet(API_FOODING_DS,'/rival/getInit',{id: ID},
				(response)=>{	
					this.addClick( response.data.rival );
				},(errors)=>{
					ServiceTips({text:errors.message,type:'error'});
			});
		}else if(data.type == 2){
			this.deleteClick();
		}else if(data.type == 3){
			let {navAddTab} =this.props;
			navAddTab({name:I18n.t(100449/*竞争对手*/) + I18n.t(100097/*详情*/),component:I18n.t(100449/*竞争对手*/) + I18n.t(100097/*详情*/),url:'/competitors/detail'});
			this.props.router.push({pathname:'/competitors/detail',query:{id:data.record.id,index:'product'}});
		}else if(data.action == 'OFF'){
			OFF('disable');	 // 失效
		}else if(data.action == 'ON'){
			OFF('enable');	 // 激活
		}

		
	}
	handleResize(height){
		let sch=document.body.offsetHeight-height-72;
		let scroll=sch-160;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
		console.log(scroll);
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

		let page = {pageSize:this.state.pageSize,currentPage:this.state.currentPage};
		let value = Object.assign(page,this.state.searchVal);
		let that = this;

		apiGet(API_FOODING_DS,'/rival/getPage',value,
			(response)=>{
				that.setState({
					record: response.data.data||[],
					data: response.data.data||[],
					totalPages: response.data.totalPages,
					currentPage: response.data.currentPage 	
				});
			},(errors)=>{
		});
	}



	render(){
		let that = this;
		const {record} = this.state;
		return(<div>
			<FilterHeader getPage={this.getPage}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionsKeys addClick={this.addClick} deleteClick={this.deleteClick}/>
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
						ref = "provider"
						columns={this.columns}
						data={record}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						onRowDoubleClick={this.onRowDoubleClick}
						contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									permissions:'competitors.edit',
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-alter_icon2'}></i><span>{I18n.t(100439/*编辑*/)}</span></div>,
									data:{action:I18n.t(100439/*编辑*/),type:1}
								},{
									permissions:'competitors.del',
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{I18n.t(100437/*删除*/)}</div>,
									data:{action:I18n.t(100437/*删除*/),type:2}
								}
								//,{
								//	permissions:'competitors.right.mtl',
								//	onClick:this.handleClick,
								//	content:<div><i className={'foddingicon fooding-product'}></i>{I18n.t(100350/*关注产品*/)}</div>,
								//	data:{action:I18n.t(100350/*关注产品*/),type:3}
								//}
								,{
									onClick:this.handleClick,
									condition: [{key: 'irowSts.id', value: [5,10], exp: '==='}],
									content:<div><i className={'foddingicon fooding-shixiao'}></i>{I18n.t(100441/*失效*/)}</div>,
									data:{action:'OFF'}
								},{
									onClick:this.handleClick,
									condition: [{key: 'irowSts.id', value: [5,20], exp: '==='}],
									content:<div><i className={'foddingicon fooding-shixiao'}></i>{I18n.t(100442/*激活*/)}</div>,
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
		</div>
	)
	}
}
export default NavConnect(CompetitorsList);

