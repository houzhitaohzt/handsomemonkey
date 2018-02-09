import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import Table from "../../../../../components/Table";
import Page from "../../../../../components/Page"
//引入按钮键
import  Confirm from  '../../../../../components/button/confirm'
import  DeleteDialog from '../../../../../components/Dialog/Confirm'
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
//引入弹层
import Dialog from '../../../../../components/Dialog/Dialog'
import Tooltip from "../../../../../components/Tip"
import Traderulesplug from './Traderulesplug'
import FilterHeader from "./FilterHeader";
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
import {I18n} from '../../../../../lib/i18n';
export class Traderules extends Component{
	constructor(props){
		super(props);
        props.traderules && props.traderules(this);
		this.columns = [{
			title : i18n.t(100087/*国家*/),
			dataIndex : 'country',
			key : "country",
			width : '32%',
			render(data,row,index){
				return (<div>{data?data.name:''}</div>)
			}
		},{
			title : i18n.t(100385/*海关编码*/),
			dataIndex : "hsCode",
			key : "hsCode",
			width : "35%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400075/*是否商检*/),
			dataIndex : "salImpMark",
			key : "salImpMark",
			width : "33%",
			render(data,row,index){
				return <div>{data?i18n.t(100141/*是*/):i18n.t(100142/*否*/)}</div>;
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
			dataTyId:'',
			pageSize:pageSize,
			currentPage:1,
			material:{},
			searchValue:''
		}
		this.addClick = this.addClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.editClick=this.editClick.bind(this);
		this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
		this.searchChange = this.searchChange.bind(this);
		this.searchClick = this.searchClick.bind(this);
		this.getPage = this.getPage.bind(this);
	}
	addClick(e){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			title:i18n.t(200881/*新增国家贸易规则*/)
		})
    }
    searchClick(){
		let that = this;
		apiGet(API_FOODING_OA,'/fastdfs/getList/'+this.state.searchValue,{businessType:this.props.businessType,businessId:this.state.id},(response)=>{
	        	this.setState({
	        		data:response.data
	        	});
	        	// this.getPage(response.data,this.state.searchValue);
	        	// this.getMulu(response.data);
	        },(error)=>{

	        });

	}
	searchChange(e){
		this.setState({
			searchValue:e.target.value
		});
	}
    editClick(record){
		var that = this;
		apiGet(API_FOODING_DS,'/tradrule/getOne',{id:record.record.id},(response)=>{
			that.setState({
				checkedData:response.data,
				rodalShow : true,
				showHeader:true,
				DialogContent:3,
				showSaveAdd:false,
			    showSaveClose:true,
				title:i18n.t(500186/*国家贸易规则编辑*/)
			});
		},(errors)=>{

		})
	}
    deleteClick(data){
		let numArr = this.refs.frexrat.getSelectArr();
		let value=[];
		var that = this;
		if(numArr.length > 0){
			for (var i = 0; i < numArr.length; i++) {
					value.push(numArr[i].id);	
			}
			DeleteDialog(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
					  done: () => {
						    apiForm(API_FOODING_DS,'/tradrule/delete',{id:value},(response)=>{
						    	that.getPage();
						    	ServiceTips({text:response.message,type:'success'});

						    },(errors)=>{
						    	ServiceTips({text:errors.message,type:'error'});
						    });
						},
						close:() => {
						}
			});
		}else{
			ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'error'});
		}
		
	}
     onSaveAndClose(value,data,isAdd){
		var that = this;
		value=Object.assign({},data,value);
		apiPost(API_FOODING_DS,'/tradrule/save',value,(response)=>{
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
	}
	//请求列表  list
	getPage(currentPage,objValue){
		
			let that = this;
			var sID = sID || '';
			let currentP = !isNaN(currentPage)?currentPage:1;
			
			apiGet(API_FOODING_DS,"/material/getDetail",{id:that.state.sourceId}, (response) => {
	            that.setState({
	                material:response.data.material
	            })
	            let object=Object.assign({},{sourceId:that.state.material.platformMtlId,isPlatform:true,dataTyId:25, pageSize: that.state.pageSize, currentPage: currentP},that.normalRef.getForm());
	            apiGet(API_FOODING_DS,'/tradrule/getPage',object,
						(response)=>{	
							that.setState({	
								data: response.data.data,
								totalRecords:response.data.totalRecords,
								totalPages: response.data.totalPages,
								currentPage: response.data.currentPage 	
							});
						},(errors)=>{
				});
	        },(error) => {
	        })
			
	}
	handleClick(e,data,target){
		//右键处理
		if(data.type == 1){
			this.deleteClick(data);
		}else if(data.type ==2){
  			this.editClick(data);
  		}
	}
	handleResize(){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});

		let sch=document.body.offsetHeight-200;
		let scroll = sch-135;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
        this.handleResize(0);
        if(!this.props.isDetail){
            this.getPage();
		}
		window.addEventListener('resize', this.handleResize);
    };
    componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize);
  	}

  	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:3,name:i18n.t(200884/*产品规则详情*/),component:i18n.t(200884/*产品规则详情*/),url:'/traderulesdetail'});
		//this.props.router.push({ pathname: '/traderulesdetail',query:{id:record.id,}});
        this.props.router.push({ pathname: '/traderulesdetail',query:{id:record.id,cntryId:record.cntryId,platformMtlId:record.sourceId}});

    }
	render(){
		let  iconArray = [];
		let title = <span>{this.state.title}<i className="font">{this.state.title_1}</i></span>;
		let {page,currentPage} =this.state;
		return (
				<div className="contact-body" style = {{height:this.state.scrollHeight}}>
					<FilterHeader normalRef={no => this.normalRef = no} getPage ={this.getPage}/>
                    <Confirm iconArray ={iconArray}/>
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
				<div className="action-normal-buttons">
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
							
					/>
					<Dialog visible={this.state.rodalShow} showHeader ={this.state.showHeader}  title={this.state.title} width={926}>
					<Traderulesplug DialogContent={this.state.DialogContent}
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

			
			);
	}

}
export default NavConnect(Traderules);
