import React, {Component} from 'react';
import Page from '../../../../components/Page'
import DialogConfirm from "../../../../components/Dialog/Confirm";
import Confirm from "../../../../components/button/confirm";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';


import {I18n} from "../../../../lib/i18n";

import {API_FOODING_DS, apiForm, apiGet, apiPost, pageSize, sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

const {Table} = require("../../../../components/Table");

export class EnterpriseCommon extends Component {
    constructor (props) {
        super(props);
        props.enterprise && props.enterprise(this);
        this.columns = [{
                    title : I18n.t(100528/*公司名称*/),
                    dataIndex : 'localName',
                    key : "localName",
                    width : "50%",
                    render(data,row,index){
                        return (<div title={data} className={'text-ellipsis'}>{data}</div>)
                    }
                },{
                    title : I18n.t('100529'),
                    dataIndex : 'prtnType',
                    key : "prtnType",
                    width : "30%",
                    render(data,row,index){
                        return <div>{data}</div>
                    }
                 },{
                    title : I18n.t(100123/*默认*/),
                    dataIndex : "dfutMrk",
                    key : "dfutMrk",
                    width : "20%",
                    render(data,row,index){
						return <i style = {{display: 'inline-block',textAlign: 'center'}} className={data ?'foddingicon fooding-dui-icon2':''}></i>;
                        //return data?I18n.t(100141/*是*/):I18n.t(100142/*否*/);
                    }
                }
               ]
        //新增 编辑保存
		this.addClick = this.addClick.bind(this);
		//保存
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		//删除
		this.deleteClick =this.deleteClick.bind(this);
		//取消
		this.onCancel = this.onCancel.bind(this);
		this.getPages = this.getPages.bind(this);	// 刷新页面	

		this.handleClick = this.handleClick.bind(this);
        this.state = {
			showDilaog:false,
			id:this.props.id,
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
			data:[]
		};

    }
	addClick(title){
		this.addAndEditDialog(I18n.t(100392/*新增*/))
    }
    //删除
	deleteClick(){
    	let numArr = this.refs.enterprise.getSelectArr();
		let tempString = "",id=[];
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
		DialogConfirm(tempString, {
		  done: () => {
            apiForm(API_FOODING_DS,'/partner/delete',{id:id},(response)=>{
                ServiceTips({text:response.message,type:'success'});
                this.getPages();
            },(error) => {
                ServiceTips({text:error.message,type:'error'});
            })
        },
        close: () => {
            console.log('no ')
        }
		});
    }
    //刷新页面
    getPages(currentPage,size,filter,order){
		filter=filter||{};
		order=order||{column:'id',order:'desc'};
		let {page}=this.state;
		currentPage = currentPage||1;
		size=size||this.state.pageSize;
		let params=Object.assign({},{currentPage:currentPage,pageSize:size,dataTyId:this.props.dataTyId,sourceId:this.state.id},filter,order)
		apiGet(API_FOODING_DS,'/partner/getPage',params,(response)=>{
			this.setState({
				data:response.data.data,
				pageSize:response.data.pageSize,
				totalPages:response.data.totalPages,
				currentPage:response.data.currentPage,
				totalRecords:response.data.totalRecords
			})
		},(message)=>{
			ServiceTips({text: message,type:'error'});
		});
	}

	//Dialog 编辑和新增
	addAndEditDialog(title,id){
		id = id?id:'';
		let that = this;
		apiGet(API_FOODING_DS,"/partner/getInit",{beId:this.props.id,dataTyId:this.props.dataTyId,id:id},response => {
			let initData = response.data;
			let content=require('./EnterpriseForm').default;
			let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:that.onCancel,initData:initData,dataTyId:this.props.dataTyId});
	    	this.setState({
	    		showDilaog : true,
	    		title: title,
	    		dialogContent: element
	    	})
		},error => ServiceTips({text:error.message,type:'error'}))
	}
    onSaveAndClose(value,data){
    	value = Object.assign({},data,value,{sourceId:this.props.id,dataTyId:this.props.dataTyId});
		//data为空对象，表示是新增,否则表示是编辑		
		if(JSON.stringify(data) !== "{}"){
			value = Object.assign({},value,{id:data.id,optlock:data.optlock})
		}
        apiPost(API_FOODING_DS,'/partner/save',value,(response) => {
            ServiceTips({text:response.message,type:'success'});
            this.getPages();
        },(error)=>{
            ServiceTips({text:error.message,type:'error'});
        })
    	this.setState({showDilaog:!this.state.showDilaog});
	}
	onCancel(){
		this.setState({
			showDilaog:false
		});
	}
  	handleClick(e,data,target){
  		//右键处理
  		if(data.type == 1){
			  this.addAndEditDialog(I18n.t(100439/*编辑*/),data.record.id);
  		}else if(data.type == 2){
  			this.deleteClick(data);
  		}else if(data.type == 3){//失效
  			DialogConfirm(I18n.t(100435/*是否对该条数据失效？*/), {
			  done: () => {
			  		//表示是失效
					apiForm(API_FOODING_DS,'/partner/disable',{id:data.record.id,optLock:data.record.optlock},(response)=>{
						ServiceTips({text:response.message,type:'sucess'})
						this.getPages();
					},(error)=>{
						ServiceTips({text:error.message,type:'error'})
					})
				},
				close:() => {
				}
			});
  		}else if(data.type == 4){//生效
  			DialogConfirm(I18n.t(100436/*是否对该条数据激活？*/), {
			  done: () => {
			  		//表示是生效
					apiForm(API_FOODING_DS,'/partner/enable',{id:data.record.id,optLock:data.record.optlock},(response)=>{
						ServiceTips({text:response.message,type:'sucess'})
						this.getPages();
					},(error)=>{
						ServiceTips({text:error.message,type:'error'})
					})
				},
				close:() => {
				}
			});
  		}
  	}

  	handleResize(height){
  		let padding = 262;
  		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(nextProps){
		// this.getPages();
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));	
  	}
    render() {




		let {pageIdent} = this.props;
		// 权限按钮 
		switch(pageIdent){
			case 'client' :  // 客户 
				var iconArray = [{type:'add',onClick:this.addClick,permissions:'clien.dtl.add'},{type:'delete',onClick:this.deleteClick,permissions:'clien.dtl.del'}];
				var menuItems = [
					{
						permissions:'clien.edit',
						onClick:this.handleClick,
						content:<div><i className={'foddingicon fooding-alter_icon'}></i>{I18n.t(100439/*编辑*/)}</div>,
						data:{type:1,title:I18n.t(100439/*编辑*/)}
					},
					{
						permissions:'clien.dtl.del',
						onClick:this.handleClick,
						content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{I18n.t(100437/*删除*/)}</div>,
						data:{type:2,title:I18n.t(100437/*删除*/)}
					}
					// ,{
					// 	permissions:'clien.dtl.Invalid',
					// 	onClick:this.handleClick,
					// 	condition: [{key: 'irowSts.id', value: [5, 10], exp: '==='}],
					// 	content:<div><i className={'foddingicon fooding-sx-icon2'}></i>{I18n.t(100441/*失效*/)}</div>,
					// 	data:{type:3,title:I18n.t(100441/*失效*/)}
					// },{
					// 	permissions:'clien.dtl.activation',
					// 	onClick:this.handleClick,
					// 	 condition: [{key: 'irowSts.id', value: [5, 20], exp: '==='}],
					// 	content:<div><i className={'foddingicon fooding-jh-icon2'}></i>{I18n.t(100442/*激活*/)}</div>,
					// 	data:{type:4,title:I18n.t(100442/*激活*/)}
					// }
				];			
			break;
			case 'forwarder' :  // 货代公司 
				var  iconArray = [{type:'add',onClick:this.addClick,permissions:'forwarder.dtl.add'},{type:'delete',onClick:this.deleteClick,permissions:'forwarder.dtl.del'}];
				var menuItems = [
					{
						permissions:'forwarder.edit',
						onClick:this.handleClick,
						content:<div><i className={'foddingicon fooding-alter_icon'}></i>{I18n.t(100439/*编辑*/)}</div>,
						data:{type:1,title:I18n.t(100439/*编辑*/)}
					},
					{
						permissions:'forwarder.dtl.del',
						onClick:this.handleClick,
						content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{I18n.t(100437/*删除*/)}</div>,
						data:{type:2,title:I18n.t(100437/*删除*/)}
					}
					// ,{
					// 	permissions:'forwarder.dtl.Invalid',
					// 	onClick:this.handleClick,
					// 	condition: [{key: 'irowSts.id', value: [5, 10], exp: '==='}],
					// 	content:<div><i className={'foddingicon fooding-sx-icon2'}></i>{I18n.t(100441/*失效*/)}</div>,
					// 	data:{type:3,title:I18n.t(100441/*失效*/)}
					// },{
					// 	permissions:'forwarder.dtl.activation',
					// 	onClick:this.handleClick,
					// 	condition: [{key: 'irowSts.id', value: [5, 20], exp: '==='}],
					// 	content:<div><i className={'foddingicon fooding-jh-icon2'}></i>{I18n.t(100442/*激活*/)}</div>,
					// 	data:{type:4,title:I18n.t(100442/*激活*/)}
					// }
				];			
			break; 
			case 'provider' : //供应商	
				var  iconArray = [{type:'add',onClick:this.addClick,permissions:'provider.dtl.add'},{type:'delete',onClick:this.deleteClick,permissions:'provider.dtl.del'}];
				var menuItems = [
					{
						permissions:'provider.edit',
						onClick:this.handleClick,
						content:<div><i className={'foddingicon fooding-alter_icon'}></i>{I18n.t(100439/*编辑*/)}</div>,
						data:{type:1,title:I18n.t(100439/*编辑*/)}
					},
					{
						permissions:'provider.dtl.del',
						onClick:this.handleClick,
						content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{I18n.t(100437/*删除*/)}</div>,
						data:{type:2,title:I18n.t(100437/*删除*/)}
					}
					// ,{
					// 	permissions:'provider.dtl.Invalid',
					// 	onClick:this.handleClick,
					// 	condition: [{key: 'irowSts.id', value: [5, 10], exp: '==='}],
					// 	content:<div><i className={'foddingicon fooding-sx-icon2'}></i>{I18n.t(100441/*失效*/)}</div>,
					// 	data:{type:3,title:I18n.t(100441/*失效*/)}
					// },{
					// 	permissions:'provider.dtl.activation',
					// 	onClick:this.handleClick,
					// 	condition: [{key: 'irowSts.id', value: [5, 20], exp: '==='}],
					// 	content:<div><i className={'foddingicon fooding-jh-icon2'}></i>{I18n.t(100442/*激活*/)}</div>,
					// 	data:{type:4,title:I18n.t(100442/*激活*/)}
					// }
				];							
			default:
				var  iconArray = [{type:'add',onClick:this.addClick},{type:'delete',onClick:this.deleteClick}];
				var menuItems = [
					{
						onClick:this.handleClick,
						content:<div><i className={'foddingicon fooding-alter_icon'}></i>{I18n.t(100439/*编辑*/)}</div>,
						data:{type:1,title:I18n.t(100439/*编辑*/)}
					},
					{
						onClick:this.handleClick,
						content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{I18n.t(100437/*删除*/)}</div>,
						data:{type:2,title:I18n.t(100437/*删除*/)}
					}
					// ,{
					// 	onClick:this.handleClick,
					// 	condition: [{key: 'irowSts.id', value: [5, 10], exp: '==='}],
					// 	content:<div><i className={'foddingicon fooding-sx-icon2'}></i>{I18n.t(100441/*失效*/)}</div>,
					// 	data:{type:3,title:I18n.t(100441/*失效*/)}
					// },{
					// 	permissions:'provider.dtl.activation',
					// 	onClick:this.handleClick,
					// 	condition: [{key: 'irowSts.id', value: [5, 20], exp: '==='}],
					// 	content:<div><i className={'foddingicon fooding-jh-icon2'}></i>{I18n.t(100442/*激活*/)}</div>,
					// 	data:{type:4,title:I18n.t(100442/*激活*/)}
					// }
				];	
	}


        return (
            <div className="">
				<div className="enterprise-header"></div>
				
				<div className="enterprise-body" style = {{height:this.state.scrollHeight}}>
					<div className="action-buttons">
						<Confirm iconArray ={iconArray}/>
						<Page 
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages} 
							sizeList={sizeList}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{	
								if(this.state.currentPage == num) return;							
								this.getPages(this.state.currentPage,num);
							}} 
							backClick={(num)=>{
								if(this.state.currentPage == num) return;
								this.getPages(num);
							}} 
							nextClick={(num)=>{
								if(this.state.currentPage == num) return;
								this.getPages(num);									
							}}
							goChange={(num)=>{
								if(this.state.currentPage == num) return;
								this.getPages(num);																				
							}}								
						/>
					<Table
						ref = "enterprise"
						columns={this.columns}
						data={this.state.data}
						scroll={{x:true,y:this.state.scroll}}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						style={{width:'100%'}}
						contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems: menuItems,
						}}

					/>
					<Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
						{this.state.dialogContent}
					</Dialog>
					</div>
				</div>

			</div>
        )
    }
}
export default EnterpriseCommon;
