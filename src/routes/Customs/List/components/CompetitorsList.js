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

		// this state 
		this.state = {
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


		this.columns = [{
			title: I18n.t(600194/*采购商*/),
			dataIndex : 'purchaser',
			key : "purchaser",
			width : '8%',
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : I18n.t(100312/*供应商*/),
			dataIndex : "vendor",
			key : "vendor",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(100385/*海关编码*/),
			dataIndex : "hscode",
			key : "hscode",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);								
			}
		},{
			title: I18n.t(300077/*产品*/),
			dataIndex : "mtlName",
			key : "mtlName",
			width : "17%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(200557/*规格*/),
			dataIndex : "specTxt",
			key : "specTxt",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(600195/*原产国*/),
			dataIndex : "countryOriginTxt",
			key : "countryOriginTxt",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(100297/*起运港*/),
			dataIndex : "portFromTxt",
			key : "portFromTxt", 
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(100298/*目的港*/),
			dataIndex : "portToTxt",
			key : "portToTxt",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(600049/*FOB价*/),
			dataIndex : "fobPrice",
			key : "fobPrice",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(600050/*CIF价*/),
			dataIndex : "cifPrice",
			key : "cifPrice",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(600196/*重量*/),
			dataIndex : "weight",
			key : "weight",
			width : "8%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);				
			}
		},{
			title: I18n.t(600197/*进关日期*/),
			dataIndex : "enterDate",
			key : "enterDate",
			width : "8%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title: I18n.t(600198/*出关日期*/),
			dataIndex : "leaveDate",
			key : "leaveDate",
			width : "8%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title: I18n.t(100230/*状态*/),
			dataIndex : "irowSts",
			key : "irowSts",
			width : "6%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data ? data['name'] : ''}</div>);
			}
		}];

		// even func 
		this.getPage = this.getPage.bind(this);

	}

	componentDidMount(){
		window.addEventListener('resize', this.handleResize(0));
		this.getPage();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(0));
	}


	// 编辑 | 新增
	editClick = (action)=> {

		let row = this.refs.provider.getSelectArr();
		let content =require('./CompetitorsListAddAndEdit').default;
		let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,
			checkedData: action == true ? {} : row[0],
			getPage: this.getPage,
		});
    	this.setState({
    		showDilaog : true,
    		title: action == true ? I18n.t(100392/*新增*/) : I18n.t(100439/*编辑*/),
    		dialogContent : element
    	})
	}

	// 删除
	deleteClick = ()=> {

		let select = this.refs.provider.getSelectArr();
		let IDAll = select.map( (o)=>o.id );
		let that = this;

		if( select.length == 0 ){
			Confirm(I18n.t(100434/*请选择一条数据！*/));
		} else{
			Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
				done: () => {
					apiForm(API_FOODING_DS,'/customsData/delete',{id: IDAll},
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

	onSaveAndClose = ()=> {
		this.setState({
			showDilaog:!this.state.showDilaog
		})
	}

	onCancel = (that)=> {
		this.setState({
			showDilaog:false
		})
	}


	onHeaderCellClick = (e,data)=> {
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

	onRowClick = (record,index,checked)=> {
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


	handleResize(height){
		let sch=document.body.offsetHeight-height-72;
		let scroll=sch-160;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
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

		apiGet(API_FOODING_DS,'/customsData/getPage',value,
			(response)=>{
				that.setState({
					record: response.data.data||[],
					data: response.data.data||[],
					totalPages: response.data.totalPages,
					currentPage: response.data.currentPage 	
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 关联 客户|供应商 
	relatedClick = (...param)=> {
		let row = this.refs.provider.getSelectArr()[0];
		let action = param[1].type;

		if( action == 2 ) this.judgeHandle({dataTyId:30}); // 关联客户 验证
		if( action == 3 ) this.judgeHandle({dataTyId:40}); // 关联供应商 验证

	}

	// 判断 关联 
	judgeHandle = (param)=> {
		let row = this.refs.provider.getSelectArr()[0];
		let that = this;

		apiGet(API_FOODING_DS,'/customsData/checkConnect',Object.assign(param,{id:row['id']}),
			(response)=>{
				if( response.data ) {
					Confirm( param['dataTyId'] == 30 ? I18n.t(600209/*已关联客户，继续关联将覆盖原先客户*/) : I18n.t(600210/*已关联供应商，继续关联将覆盖原先供应商*/), {
						done: () => {
							that.creatClick(response.data || '',param);
						}
					});
				} else {
					that.creatClick(response.data || '',param);
				}
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 创建 客户关联 | 供应商关联 
	creatClick = (...param)=> {
		let ID = this.refs.provider.getSelectArr()[0]['id'];

		// 客户
		if( param[1].dataTyId == 30 ) {
			var content = require('./AddUser').default;
		}

		// 供应商 
		if( param[1].dataTyId == 40 ) {
			var content = require('./Provider').default;
		}	 	

		let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,
			checkedData: Object.assign({},{id:ID,connectedId:param[0]}),
			getPage: this.getPage,
		});
    	this.setState({
    		showDilaog : true,
    		title: param[1].dataTyId == 30 ? I18n.t(600207/*关联客户*/) : I18n.t(600208/*关联供应商*/) ,
    		dialogContent : element
    	})
	}

	// 获取 客户来源 
	getUserSource = (callBack)=> {
		apiPost(API_FOODING_DS,'/object/getMiniOne',
			{
				obj: 'com.fooding.fc.ds.entity.CstmCrsekt',
				queryParams:[{
					attr:'code',
					expression:"=",
					value:10
				}]
			},
			(response)=>{							
				callBack && callBack(response.data);		
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	// 创建客户 
	creatUser = ()=> {
		let that = this;
		let row = this.refs.provider.getSelectArr()[0];
		var content = require('../../../Client/List/components/AddCommonDialog').default;		
		
		this.getUserSource(function(data){


			let element=React.createElement(content,{onSaveAndClose:that.onSaveAndClose,onCancel:that.onCancel,
				data: {countryTo:row['countryTo'] || {},name:row['purchaser'],enName:row['purchaser'],cstmCrsektId:data['id'],cstmCrsektName:data['localName']},
				getPage: that.getPage,
			});

			that.setState({
				showDilaog : true,
				title: I18n.t(600205/*创建客户*/),
				dialogContent : element
			})

		});
		

	}

	// 创建供应商 
	creatProvider = ()=> {
		let that = this;
		let row = this.refs.provider.getSelectArr()[0];
		var content = require('../../../Provider/List/components/ProviderAdd').default;		
		
		this.getUserSource(function(data){


			let element=React.createElement(content,{onSaveAndClose:that.onSaveAndClose,onCancel:that.onCancel,
				checkedData: {
					country:row['countryFrom'],
					name:row['vendor'],
					enName:row['vendor'],
					cstmCrsekt:{
						id:data['id'],
						name:data['localName']
					}
				},
				getPage: that.getPage,
			});

			that.setState({
				showDilaog : true,
				title: I18n.t(600206/*创建供应商*/),
				dialogContent : element
			})

		});		
		

	}

	// 发布 
	conferenceClick = ()=> {
		let select = this.refs.provider.getSelectArr();
		let IDAll = select.map( (o)=>o.id );
		let that = this;

		if( select.length == 0 ){
			Confirm(I18n.t(100434/*请选择一条数据！*/));
		} else{
			Confirm(I18n.t(100460/*确认*/)+I18n.t(500257/*发布*/), {
				done: () => {
					apiForm(API_FOODING_DS,'/customsData/publish',{id: IDAll},
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



	render(){
		let that = this;
		const {record} = this.state;
		return(<div>
			<FilterHeader ref="heard" getPage={this.getPage}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionsKeys that={this} getPage={this.getPage} addClick={this.editClick.bind(this,true)} deleteClick={this.deleteClick} importClick={this.importClick} exportClick={this.exportClick} conferenceClick={this.conferenceClick}/>
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
						//onRowDoubleClick={this.onRowDoubleClick}
						contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									//permissions:'competitors.right.mtl',
									onClick:this.creatUser,
									content:<div><i className={'foddingicon fooding-user_icon'}></i>{I18n.t(600205/*创建客户*/)}</div>,
									data:{action:I18n.t(600205/*创建客户*/),type:4,dataTyId:30}
								},{
									//permissions:'competitors.right.mtl',
									onClick:this.relatedClick,
									content:<div><i className={'foddingicon fooding-correlation'}></i>{I18n.t(600207/*关联客户*/)}</div>,
									data:{action:I18n.t(600207/*关联客户*/),type:2}
								},{
									//permissions:'competitors.right.mtl',
									onClick:this.creatProvider,
									content:<div><i className={'foddingicon fooding-user_icon'}></i>{I18n.t(600206/*创建供应商*/)}</div>,
									data:{action:I18n.t(600206/*创建供应商*/),type:5,dataTyId:40}
								},{
									//permissions:'competitors.right.mtl',
									onClick:this.relatedClick,
									content:<div><i className={'foddingicon fooding-correlation'}></i>{I18n.t(600208/*关联供应商*/)}</div>,
									data:{action:I18n.t(600208/*关联供应商*/),type:3}
								},{
									//permissions:'competitors.edit',
									onClick:this.editClick,
									content:<div><i className={'foddingicon fooding-alter_icon2'}></i><span>{I18n.t(100439/*编辑*/)}</span></div>,
									data:{action:I18n.t(100439/*编辑*/),type:1}
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

