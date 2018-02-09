import i18n from './../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
const {Table} = require("../../../../components/Table");
import Page from "../../../../components/Page"
//引入按钮键
import  Confirm from  '../../../../components/button/confirm'
import  DeleteDialog from '../../../../components/Dialog/Confirm'
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog'
import Tooltip from "../../../../components/Tip"
import Packageplug from './Packageplug'
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
export class Package extends Component{
	constructor(props){
		super(props);
        props.package && props.package(this);
		this.columns = [{
			title : i18n.t(100596/*包装名称*/),
			dataIndex : 'packaging',
			key : "packaging",
			width : '30%',
			render(data,row,index){
				return <div>{data?data.localName:''}</div>
			}
		},{
			title : i18n.t(200933/*包装单价*/),
			dataIndex : "wrapPrice",
			key : "wrapPrice",
			width : "15%",
			render(data,row,index){
				return <div>{data?toDecimal(data):''}</div>;
			}
		},{
			title : i18n.t(100284/*币种*/),
			dataIndex : "curren",
			key : "curren",
			width : "15%",
			render(data,row,index){
				return <div>{data?data.localName:''}</div>;
			}
		},{
			title : i18n.t(100286/*生效日期*/),
			dataIndex : "validDate",
			key : "validDate",
			width : "20%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(500120/*终止日期*/),
			dataIndex : "endDate",
			key : "endDate",
			width : "20%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
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
			data :[],
			DialogContent:0,

			sourceId:this.props.location.query.id,
			dataTyId:''
		}
		this.addClick = this.addClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.getInfo= this.getInfo.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.editClick=this.editClick.bind(this);
	}
	addClick(e){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			title:i18n.t(200934/*新增包装计费*/)
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
		let object=Object.assign({},{sourceId:this.state.sourceId,dataTyId:20});
		if(id){
			apiGet(API_FOODING_DS,'/wrapgPrice/getInit',{id:id,sourceId:this.state.sourceId,dataTyId:20},(response)=>{
			that.setState({
				info:response.data,
				checkedData:response.data.wrapgPrice,
				showHeader:true,
				DialogContent:3,
				showSaveAdd:false,
			    showSaveClose:true,
				title:i18n.t(200882/*包装计费编辑*/)
			});
		},(errors)=>{

		})
			return false;
		}
		apiGet(API_FOODING_DS,'/wrapgPrice/getInit',{},(response)=>{
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
						    apiForm(API_FOODING_DS,'/wrapgPrice/delete',{id:id},(response)=>{
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
		apiPost(API_FOODING_DS,'/wrapgPrice/save',value,(response)=>{
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
				let object=Object.assign({},{sourceId:this.state.sourceId,isPlatform:true,dataTyId:20, pageSize: this.state.pageSize, currentPage: this.state.currentPage },this.state.obj);
				apiGet(API_FOODING_DS,'/wrapgPrice/getPage',object,
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
			let object=Object.assign({},{sourceId:this.state.sourceId,isPlatform:true,dataTyId:20, pageSize: this.state.pageSize, currentPage: this.state.currentPage, mtltyId: sID },this.state.obj);
			apiGet(API_FOODING_DS,'/wrapgPrice/getPage',object,
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
  		}else if(data.type == 3){
  			this.setState({
  				title:i18n.t(300007/*编辑失效原因*/),
				rodalShow : true,
				showHeader:true,
				DialogContent:4
			});
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
        if(!this.props.isDetail){
            this.getPage();
		}
        // this.getInfo();
		window.addEventListener('resize', this.handleResize(0));
    };
    componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}
	render(){
		let  iconArray = [{type:'add',onClick:this.addClick,permissions:'mtl.dtl.add'},{type:'delete',onClick:this.deleteClick,permissions:'mtl.dtl.del'}];
		let title = <span>{this.state.title}<i className="font">{this.state.title_1}</i></span>;
		return (
			<div className="contact-fluid">
				<div className='content-margin'></div>
				<div className="contact-body" style = {{height:this.state.scrollHeight}}>
					<Confirm iconArray ={iconArray}/>
					<Page />
				<div className="action-normal-buttons">
					<Table
							ref ="frexrat"
							columns={this.columns}
							scroll={{x:true,y:this.state.scroll}}
							data={this.state.data}
							checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
							colorFilterConfig={{show : false}}
							followConfig={{show:false}}
							style={{width:'100%'}}
							contextMenuConfig={{
								enable:true,
								contextMenuId:'SIMPLE_TABLE_MENU',
								menuItems:[{
									permissions:'mtl.dtl.del',
									onClick:this.handleClick,
									content:<div><i className={'foddingicon fooding-delete-icon4'}></i>{i18n.t(100437/*删除*/)}</div>,
									data:{type:1,title:i18n.t(100437/*删除*/)}
									},{
										permissions:'mtl.edit',
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-alter_icon2'}></i>{i18n.t(100439/*编辑*/)}</div>,
										data:{type:2,title:i18n.t(100439/*编辑*/)}
									},{
										permissions:'mtl.dtl.Invalid',
										onClick:this.handleClick,
										content:<div><i className={'foddingicon fooding-sx-icon2'}></i>{i18n.t(100441/*失效*/)}</div>,
										data:{type:3,title:i18n.t(100441/*失效*/)}
								}]
							}}
					/>
					<Dialog visible={this.state.rodalShow} showHeader ={this.state.showHeader}  title={this.state.title} width={926}>
					<Packageplug DialogContent={this.state.DialogContent}
							 checkedData = {this.state.checkedData}
							 buttonLeft = {this.state.buttonLeft}
							 showSaveAdd ={this.state.showSaveAdd}
							 showSaveClose={this.state.showSaveClose}
							  onSaveAndClose ={this.onSaveAndClose}
							  contentDate = {this.state.contentDate}
							  onCancel = {this.onCancel}
							  sourceId={this.state.sourceId}
							  dataTyId={this.state.dataTyId}
					/>
				</Dialog>
				</div>
				</div>

			</div>
			);
	}

}
export default Package;
