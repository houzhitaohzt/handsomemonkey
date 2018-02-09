import React, {Component, PropTypes} from "react";
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import {webInit,apiGet, apiPost, apiForm, API_FOODING_ES, API_FOODING_DS,pageSize,sizeList } from "../../../../services/apiCall";
import ServiceTips from '../../../../components/ServiceTips';

//引入提示
import Tooltip from 'antd/lib/tooltip'; 
//邮件提示 用于默认联系人
import MailDefault from "../../../Client/List/MailCard/MailDefault";
//引入国际化
import {I18n} from '../../../../lib/i18n';


class ServBelist extends Component{
	constructor(props){
		super(props)
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.handleClick=this.handleClick.bind(this);

		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.copyClick=this.copyClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);

		this.getPages=this.getPages.bind(this);

		this.serchClick=this.serchClick.bind(this);
		this.cleanClick=this.cleanClick.bind(this);
		this.filter = null;
		 this.columnSort = {column: 'id', order: 'desc'};

		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		let that = this;
		this.columns = [{
			title : I18n.t(600215/*承运人代码*/),
			dataIndex : 'code',
			key : "code",
			width : '18%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title:I18n.t(600214/*承运人*/),
			dataIndex : "localName",
			key : "localName",
			width : "15%",
			render(data,row,index){
				return data;
			}
		},{
			title:I18n.t(100341/*所属国家*/),
			dataIndex : "country",
			key : "country",
			width : "12%",
			render(data,row,index){
				return data;
			}
		},{
			title:I18n.t(100371/*网站*/),
			dataIndex : "web",
			key : "web",
			width : "15%",
			render(data,row,index){
				return <div className="text-ellipsis"><a onClick={that.webHrefHandle.bind(that,webInit(data || ''))} href="javascript:;" target="_blank">{data}</a></div>;
			}
		},{
			title:I18n.t(100372/*主联系人*/),
			dataIndex : 'defaultCarrierLinkMan',
			key : "entContact",
			width : "12%",
			render(data,row ,index){
				let value = null;
                if (data && data.name) {
                    value = data.name;
                }
                if( !value) return null;
                return (<Tooltip
                    placement="bottomRight"
                    mouseEnterDelay={0.5}
                    arrowPointAtCenter={true}
                    mouseLeaveDelay={0.2}
                    prefixCls="card-toolip"
					trigger="click"
                    overlay={<MailDefault data={data} router={that.props.router} type={'servbe'} />}
                >
                    <span className={'mail-hover'}>{value}</span>
                </Tooltip>)	
			}
		},{
			title : I18n.t(100373/*最近更新时间*/),
			dataIndex : "updateDate",
			key : "updateDate",
			width : "16%",
			render(data,row,index){
				if(data){
					return new Date(data).Format('yyyy-MM-dd');
				}
				return null;
			}
		},{
			title : I18n.t(100230/*状态*/),
			dataIndex : 'irowSts',
			key : "irowSts",
			width : "6%",
			render(data,row,index){
				return data&&data.name?data.name:data;
			}
		}];
	}

	initState(){
		return {
			scrollHeight:0,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:null,
			page:{size:pageSize,totalPages:0,currentPage:1,totalRecords:0},
			filter:{}
		}
	}

	// 网址跳转 
	webHrefHandle = (href,e)=>{
        e.stopPropagation();
        e.preventDefault();

		window.open(href);
	}

	serchClick(value){//表格上面的搜索条件
		this.setState({filter:value},()=>this.getPages(1,null,value));
	}
	cleanClick(){//表格上面的清空搜索条件
		this.setState({filter:null},() => this.getPages(1));
	}
	addClick(){
		let content=require('./ForwarderAdd').default;
		let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,countryData:this.state.countryData});
    	this.setState({
    		showDilaog : true,
    		title: I18n.t(100392/*新增*/),
    		dialogContent: element
    	})
	}
	deleteClick(){
		let numArr = this.refs.contractor.getSelectArr();
		let tempString = "";
		let id = [];
		if(numArr.length==0){
			ServiceTips({text:I18n.t(100394/*请选择数据！*/),type:'error'});
			return false;
		}else if(numArr.length==1){
			tempString=I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/);
		}else{
			tempString=I18n.t(100395/*已选中*/) + numArr.length + I18n.t(100396/*条数据删除后将无法恢复，您确定删除吗？*/);
		}
		for(let j=0,len= numArr.length; j<len; j++){
			id.push(numArr[j].id)
		}
		Confirm(tempString, {
		  done: () => {
			  	apiForm(API_FOODING_DS,'/carrier/delete',{id:id},(response)=>{
			  		ServiceTips({text:response.message,type:'sucess'});
			  		this.getPages();
			  	},(error) => {

			  	})
			},
			close:() => {
			}
		});
	}
	copyClick(){

	}
	onSaveAndClose(value,data){
		let {page} = this.state;
		value = Object.assign({},value);
		apiPost(API_FOODING_DS,'/carrier/save',value,(response)=>{
			ServiceTips({text:response.message,type:'sucess'});
			this.getPages(page.currentPage);
			this.setState({
				showDilaog:!this.state.showDilaog
			})
		},(error) =>{
			ServiceTips({text:error.message,type:'error'})
		})
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({name:I18n.t(600214/*承运人*/) + I18n.t(100097/*详情*/),component:I18n.t(600214/*承运人*/) + I18n.t(100097/*详情*/),url:'/contractor/detail'});
		this.props.router.push({pathname:'/contractor/detail',query:{id:record.id,index:'detail'},state: {refresh: true}});
	}
	handleClick(e,data){
		if(data.type == 0){
			apiGet(API_FOODING_DS,'/carrier/getOne',{id:data.record.id},(response)=>{
					let content=require('./ForwarderEdit').default;
					let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,
						getPage:this.getPages,onCancel:this.onCancel,data:response.data})
			    	this.setState({
			    		showDilaog : true,
			    		title: I18n.t(100439/*编辑*/),
			    		dialogContent: element
			    	})
				},(error)=>{
					return false;
				})			
		}else if(data.type == 1){
			this.deleteClick()
		}else if(data.type == 2){
			Confirm(I18n.t(100435/*是否对该条数据失效？*/), {
			  done: () => {
			  		//表示是失效
					apiForm(API_FOODING_DS,'/carrier/disable',{id:data.record.id},(response)=>{
						ServiceTips({text:response.message,type:'sucess'})
						this.getPages();
					},(error)=>{

					})
				},
				close:() => {
					
				}
			});
		}else if(data.type == 3){
			//表示是激活
			apiForm(API_FOODING_DS,'/carrier/enable',{id:data.record.id},(response)=>{
				ServiceTips({text:response.message,type:'sucess'});
				this.getPages();
			},(error) => {
				ServiceTips({text:error.message,type:'error'})
			})
		}
	}
	getPages(currentPage,size,filter,order){
		let that = this;
		filter=filter||this.state.filter;
		this.columnSort = order = order || this.columnSort; 
		let {page}=this.state;
		currentPage = currentPage|| page.currentPage;
		size=size||page.size;
		let params=Object.assign({},{currentPage:currentPage,pageSize:size},filter,order)
		apiGet(API_FOODING_DS,'/carrier/getPage',params,(response)=>{
			let {totalRecords,totalPages,currentPage,pageSize,data}=response.data;
			that.setState({data:data,page:{size:pageSize,totalPages:totalPages,currentPage:currentPage,totalRecords:totalRecords}});
		},(message)=>{
			console.log(message);
		});
	}
	handleResize(e,height){
		this.filterHeight = height || this.filterHeight || 50;
		 let sch = document.body.offsetHeight - this.filterHeight - 92;
         let scroll = sch - 90;
		 this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
		this.getPages();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	render(){
		let {data,page} = this.state,record;
		record = data || [];
		return(<div>
			<FilterHeader cleanClick={this.cleanClick} serchClick={this.serchClick} expandFilter={this.handleResize}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				<div className='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys addClick={this.addClick}  deleteClick={this.deleteClick}  copyClick={this.copyClick}  />
						<Page totalPages={page.totalPages} 
							    currentPage={page.currentPage}
							     totalRecords={page.totalRecords}
								sizeList={sizeList}
								currentSize={page.size}
								pageSizeChange={(value)=>{
								let {page}=this.state;
								if(page.size==value){
									return;
								}
								this.getPages(page.currentPage,value);
							}} backClick={(v)=>{
								let {page}=this.state;
								if(page.currentPage==v){
									return;
								}
								this.getPages(v);
							}} nextClick={(v)=>{
								let {page}=this.state;
								if(page.currentPage==v){
									return;
								}
								this.getPages(v);
							}}
							goChange={(v)=>{
								let {page}=this.state;
								if(page.currentPage==v){
									return;
								}
								this.getPages(v);
							}}
						/>
					</div>
					<Table 
						ref = "contractor"
						columns={this.columns}
						data={record}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onRowDoubleClick={this.onRowDoubleClick}
						onHeaderSortClick={this.getPages.bind(this, null, null, null)}
						contextMenuConfig={{
							enable:true,
							contextMenuId:'SIMPLE_TABLE_MENU',
							menuItems:[{
								//permissions:'contractor.edit',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{I18n.t(100439/*编辑*/)}</div>,
								data:{action:I18n.t(100439/*编辑*/),type:0}
							},{
								permissions:'contractor.del',
								onClick:this.handleClick,
								content:<div><i className={'foddingicon fooding-delete-icon3'}></i>{I18n.t(100437/*删除*/)}</div>,
								data:{action:I18n.t(100437/*删除*/),type:1}
							},
							{
								//permissions:'contractor.Invalid',
								onClick:this.handleClick,
								condition: [{key: 'irowSts.id', value: [5, 10], exp: '==='}],
								content:<div><i className={'foddingicon fooding-sx-icon2'}></i>{I18n.t(100441/*失效*/)}</div>,
								data:{action:I18n.t(100441/*失效*/),type:2}
							},{
								//permissions:'contractor.activation',
								onClick:this.handleClick,
								condition: [{key: 'irowSts.id', value: [5, 20], exp: '==='}],
								content:<div><i className={'foddingicon fooding-jh-icon2'}></i><span>{I18n.t(100442/*激活*/)}</span></div>,
								data:{action:I18n.t(100442/*激活*/),type:3}
							}
							]
						}}
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
export default NavConnect(ServBelist);
