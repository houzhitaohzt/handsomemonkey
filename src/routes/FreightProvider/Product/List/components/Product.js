import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Table from "../../../../../components/Table";
import Page from "../../../../../components/Page"
//引入按钮键
import  Confirm from  '../../../../../components/button/confirm'
import  DeleteDialog from '../../../../../components/Dialog/Confirm'
//引入弹层
import Dialog from '../../../../../components/Dialog/Dialog'
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import Tooltip from "../../../../../components/Tip"
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
import Productplug from './Productplug'
export class Product extends Component{
	constructor(props){
		super(props);
		this.columns = [{
			title : i18n.t(200861/*产品代码*/),
			dataIndex : "code",
			key : "code",
			width : "15%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(500061/*产品名称*/),
			dataIndex : 'localName',
			key : "localName",
			width : '10%',
			render(data,row,index){
				return <div>{data || ''}</div>
			}
		},{
			title : i18n.t(100226/*英文名称*/),
			dataIndex : "enName",
			key : "enName",
			width : "15%",
			render(data,row,index){
				return <div>{data || ''}</div>;
			}
		},{
			title : i18n.t(200557/*规格*/),
			dataIndex : "specTxt",
			key : "specTxt",
			width : "25%",
			render(data,row,index){
				return <div>{data || ''}</div>
			}
		},{
			title : i18n.t(200985/*供方业务员*/),
			dataIndex : "saleContactor",
			key : "saleContactor",
			width : "10%",
			render(data,row,index){
				return <div>{data?data.localName:''}</div>;
			}
		}];
		this.state = {
			rodalShow:false ,
			title:'',
			scroll:0,
			paddingTop:0,
			selectArr:[],
			checkedRows:[],
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			data : [],
			DialogContent:0,
			sourceId:this.props.location.query.id,
			dataTyId:'',
            currentPage:0,
            pageSize:20
			
		}
		this.addClick = this.addClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.getInfo= this.getInfo.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.editClick=this.editClick.bind(this);
		this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
	}
	addClick(e){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			title:i18n.t(200986/*供应商产品新增*/)
		})
    }
    editClick(record){
		this.getInfo(record.record.id);
		this.setState({
				rodalShow : true
			})
	}
	getInfo(id){
		var that = this;
		let object=Object.assign({},{sourceId:this.state.sourceId,dataTyId:70});
		if(id){
			apiGet(API_FOODING_DS,'/beMtl/getInit',{id:id,sourceId:this.state.sourceId,dataTyId:70},(response)=>{
			that.setState({
				info:response.data,
				checkedData:response.data.beMtl,
				showHeader:true,
				DialogContent:3,
				showSaveAdd:false,
			    showSaveClose:true,
				title:i18n.t(200987/*供应商产品编辑*/)
			});
		},(errors)=>{

		})
			return false;
		}
		apiGet(API_FOODING_DS,'/beMtl/getInit',{dataTyId:70},(response)=>{
			that.setState({
				info:response.data
			});
		},(errors)=>{

		})
	}
    deleteClick(e){
    	var that = this;
    	 let array=this.refs.frexrat.getSelectArr();
    	 if(array.length == 0){
    	 		DeleteDialog(i18n.t(200528/*请选择一条数据进行删除*/), {
					done: () => {
						
					}
				});
	    	 }else{
	    	 	DeleteDialog('删除后将无法恢复，您确定删除'+array.length+'条数据吗？', {
						done: () => {
							let id=[];
							array.map((e)=>{id.push(e.id)});
						    apiForm(API_FOODING_DS,'/beMtl/delete',{id:id},(response)=>{
						    		ServiceTips({text:response.message,type:'sucess'});
						    		that.getPage();
						    },(error)=>{
						    	ServiceTips({text:error.message,type:'error'});
						    })
						}
				});
	    	 }
    }
    onSaveAndClose(value,data,isAdd){
		var that = this;
		value=Object.assign({},data,value);
		apiPost(API_FOODING_DS,'/beMtl/save',value,(response)=>{
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
		});
		if(that){
			that.props.form.resetFields();
			that.addradio.setState({
				array:[{radio:{type:i18n.t(300009/*手机*/),checked:true},select:i18n.t(300009/*手机*/),inputValue:''}]
			});
		}
	}
	getPage(sID,objValue){
		let that = this;
		var sID = sID || '';
		if(objValue){
			this.setState({
				obj:objValue
			},function() {
			// body... 
				let object=Object.assign({},{sourceId:this.state.sourceId,isPlatform:true,dataTyId:70, pageSize: this.state.pageSize, currentPage: this.state.currentPage },this.state.obj);
				apiGet(API_FOODING_DS,'/beMtl/getPage',object,
					(response)=>{	
						that.setState({	
							data: response.data.data,
							totalPages: response.data.totalPages,
							currentPage: response.data.currentPage 	
						});
					},(errors)=>{
				});
			})
		}else {
			let object=Object.assign({},{sourceId:this.state.sourceId,isPlatform:true,dataTyId:70, pageSize: this.state.pageSize, currentPage: this.state.currentPage, mtltyId: sID },this.state.obj);
			apiGet(API_FOODING_DS,'/beMtl/getPage',object,
				(response)=>{	
					that.setState({	
						data: response.data.data,
						totalPages: response.data.totalPages,
						currentPage: response.data.currentPage 	
					});
				},(errors)=>{
			});
		}
		
	}
	handleClick(e,data,target){
		//右键处理
		if(data.type == 1){
			this.deleteClick(data);
		}else if(data.type ==2){
  			this.editClick(data);
  		}
	}
	handleResize(height){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
  		let padding = this.state.paddingTop ? 173:262;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;

		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
         this.handleResize(0);
        this.getPage();
        this.getInfo();
		window.addEventListener('resize', this.handleResize(0));
    };
    componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}
  	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:'provider-product',name:i18n.t(200582/*供应商产品*/),component:i18n.t(200582/*供应商产品*/),url:'/provider/productdetail'});
		this.props.router.push({ pathname: '/provider/productdetail',query:{id:record.id,sourceId:this.props.location.query.id,ids:record.mtlId}});
	}
	render(){
  		let that = this;
		let  iconArray = [{type:'add',onClick:this.addClick,permissions:'provider.dtl.add'},{type:'delete',onClick:this.deleteClick,permissions:'provider.dtl.del'}];
		let title = <span>{this.state.title}<i className="font">{this.state.title_1}</i></span>;
		return (
			<div className="">
				<div className='content-margin'></div>
				<div className="product-body" style = {{height:this.state.scrollHeight}}>
					<Confirm iconArray ={iconArray}/>
					<Page
						currentPage={this.state.currentPage}
						totalPages={this.state.totalPages}
						sizeList={[20,50,100]}
						currentSize={this.state.pageSize}
						pageSizeChange={(num)=>{
                            that.setState({ pageSize: Number.parseInt(num),currentPage:1 },()=>that.getPage());
                        }}
						backClick={(num)=>{
                            that.setState({ currentPage: Number.parseInt(num)},()=>that.getPage());
                        }}
						nextClick={(num)=>{
                            that.setState({ currentPage: Number.parseInt(num)},()=>that.getPage());
                        }}
						goChange={(num)=>{
                            that.setState({ currentPage: Number.parseInt(num)},()=>that.getPage());
                        }}
					/>
				<div className="action-buttons">
					<Table
							ref ="frexrat"
							columns={this.columns}
							scroll={{x:true,y:this.state.scroll}}
							data={this.state.data}
							checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
							colorFilterConfig={{show : false}}
							onRowDoubleClick={this.onRowDoubleClick}
							followConfig={{show:false}}
							style={{width:'100%'}}
							contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									permissions:'provider.dtl.del',
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{i18n.t(100437/*删除*/)}</div>,
									data:{type:1,title:i18n.t(100437/*删除*/)}
									},{
										permissions:'provider.edit',
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
										data:{type:2,title:i18n.t(100439/*编辑*/)}
									}]
							}}
					/>
					<Dialog visible={this.state.rodalShow} showHeader ={this.state.showHeader}  title={this.state.title} width={926}>
					<Productplug DialogContent={this.state.DialogContent}
							 checkedData = {this.state.checkedData}
							 buttonLeft = {this.state.buttonLeft}
							 showSaveAdd ={this.state.showSaveAdd}
							 showSaveClose={this.state.showSaveClose}
							  onSaveAndClose ={this.onSaveAndClose}
							  contentDate = {this.state.contentDate}
							  onCancel = {this.onCancel}
							  sourceId={this.state.sourceId}
							  dataTyId={this.state.dataTyId}/>
				</Dialog>
				</div>
				</div>

			</div>
			);
	}

}
export default NavConnect(Product);
