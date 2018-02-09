import i18n from './../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import SeaPricePlug from './SeaPricePlug';
import Checkbox from '../../../components/CheckBox';
import {I18n} from "../../../lib/i18n";
// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,copy} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
class SeaPrice extends Component{
	constructor(props){
		super(props);
		this.columns = [];
		this.state = {
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			MeunState:true,
			rodalShow:false,
			showSaveAdd:false,
			showSaveClose:true,
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:{},
			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条
			data : [],
			seaMeasure:[],
			seaBox:[],
			getTermModes:{},
			obj:{},
			getSelectArr:[]

		}
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.copyClick=this.copyClick.bind(this);
		this.editClick=this.editClick.bind(this);
		this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
		this.getPage = this.getPage.bind(this);
		this.getXiang = this.getXiang.bind(this);
		this.daochuClick = this.daochuClick.bind(this);
		this.daoruClick = this.daoruClick.bind(this);
		this.fabuClick = this.fabuClick.bind(this);
		this.allfabuClick = this.allfabuClick.bind(this);
		this.zuofeiClick = this.zuofeiClick.bind(this);
		this.onChange = this.onChange.bind(this);
		this.zuofeiBtnClick=this.zuofeiBtnClick.bind(this); 
	}
	addClick(){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			showSaveAdd:false,
			showSaveAdd:true,
			showSaveClose:true,
			title:i18n.t(201091/*新增海运运价*/)
		})
	}
	copyClick(record){
		var that = this;
		apiGet(API_FOODING_ERP,'/termsfreight/copy',{id:record.id},(response)=>{
			that.setState({
				DialogContent:3,
				checkedData:response.data
			})
		},(error)=>{

		});
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:0,
			showSaveAdd:false,
			title:i18n.t(201092/*编辑海运运价*/),
			checkedData:record
		})
	}
	onChange(dataItem,index){
		let getSelectArr =this.state.getSelectArr;
		let array =[];
		getSelectArr.map((e)=>{
			array.push(e.id);
		})
	   if(array.indexOf(dataItem.id) == -1){
	   		getSelectArr[index] = dataItem;
	   }else{
	   		getSelectArr.splice(index,1);
	   } 
	   this.setState({
	   		getSelectArr
	   });

	}
	daochuClick(){
		console.log('1')
	}
	daoruClick(){
		console.log('2')
	}
	fabuClick(){
		let getSelectArr =[];
		this.state.getSelectArr.map((e)=>{if(e){
		   getSelectArr.push(e);	
		}})
		let value=[];
		var that = this;
		if(getSelectArr.length > 0){
			for (var i = 0; i < getSelectArr.length; i++) {
					value.push(getSelectArr[i].id);	
			}
			Confirm(I18n.t(500179/*确定发布吗?*/), {
					  done: () => {
						    apiForm(API_FOODING_ERP,'/termsfreight/forbe/release',{ids:value},(response)=>{
						    	that.props.navRefreshCurrentTab()
						    		that.props.router.push({pathname: this.props.router.location.pathname, query: {}, state: {refresh: true}});
						    	

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
	zuofeiBtnClick(record){
		var that = this;
		Confirm(I18n.t(500178/*你确定执行作废操作吗?*/), {
		  done: () => {
			    apiForm(API_FOODING_ERP,'/termsfreight/forbe/drop',{ids:record.id},(response)=>{
					ServiceTips({text:response.message,type:'sucess'});
					that.getPage();
			    },(error)=>{
			    	ServiceTips({text:error.message,type:'error'});
			    })
			},
			close:() => {
				console.log('no, close')
			}
		});
	}
	allfabuClick(){
		let getSelectArr =[];
		this.state.getSelectArr.map((e)=>{if(e){
		   getSelectArr.push(e);	
		}})
		let value=[];
		var that = this;
			let object=Object.assign({},that.normalRef.getForm());
			Confirm(i18n.t(500238/*您确定全部发布吗?*/), {
					  done: () => {
						    apiForm(API_FOODING_ERP,'/termsfreight/forbe/releaseall',object,(response)=>{
						    	that.props.navRefreshCurrentTab()
						    		that.props.router.push({pathname: this.props.router.location.pathname, query: {}, state: {refresh: true}});
						    	

						    },(errors)=>{
						    	ServiceTips({text:errors.message,type:'error'});
						    });
						},
						close:() => {
						}
			});
	}
	zuofeiClick(){
		let getSelectArr =[];
		this.state.getSelectArr.map((e)=>{if(e){
		   getSelectArr.push(e);	
		}})
		let value=[];
		var that = this;
		if(getSelectArr.length > 0){
			for (var i = 0; i < getSelectArr.length; i++) {
					value.push(getSelectArr[i].id);	
			}
			Confirm(I18n.t(500178/*你确定执行作废操作吗?*/), {
					  done: () => {
						    apiForm(API_FOODING_ERP,'/termsfreight/forbe/drop',{ids:value},(response)=>{
						    	that.props.navRefreshCurrentTab()
						    		that.props.router.push({pathname: this.props.router.location.pathname, query: {}, state: {refresh: true}});
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
	editClick(record,isCopy){
		var that = this;
		apiGet(API_FOODING_ERP,'/freight/getOne',{id:record.billId},(response)=>{
			let checkedData = isCopy===1?Object.assign({},response.data,{reDate:new Date(),sDate:new Date(),eDate:undefined}):response.data;
			this.setState({
				rodalShow : true,
				showHeader:true,
				DialogContent:3,
				showSaveAdd:false,
				title:i18n.t(201092/*编辑海运运价*/),
				checkedData:checkedData
			})
		},(error)=>{

		});

	}

	
	editClick(record){
		var that = this;
		apiGet(API_FOODING_ERP,'/termsfreight/getOne',{id:record.id},(response)=>{
			that.setState({
				DialogContent:3,
				showSaveAdd:false,
				checkedData:response.data
			})
		},(error)=>{

		});
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:0,
			title:i18n.t(201092/*编辑海运运价*/),
			checkedData:record
		})
	}
	deleteClick(record){
		var that = this;
		Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/),{
		  done: () => {
			    apiForm(API_FOODING_ERP,'/termsfreight/forbe/delete',{id:record.id},(response)=>{
					ServiceTips({text:response.message,type:'sucess'});
					that.getPage();
			    },(error)=>{
			    	ServiceTips({text:error.message,type:'error'});
			    })
			},
			close:() => {
				console.log('no, close')
			}
		});
	}
	onRowDoubleClick(record,index,checked){
		// this.setState({
		// 	rodalShow : true,
		// 	showHeader:true,
		// 	buttonLeft:i18n.t(200267/*保存并且关闭*/),
		// 	DialogContent:3,
		// 	title:i18n.t(201092/*编辑海运运价*/),
		// 	checkedData:record
		// })
	}
	handleResize(e, height) {
		 this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        this.setState({scroll: scroll});
	}
	// ajax list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
		let object=Object.assign({},{type:10, pageSize: this.state.pageSize, currentPage: currentP},this.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/termsfreight/forbe/getPage',object,
				(response)=>{
					that.setState({
						data: response.data.data,
						totalPages: response.data.totalPages,
						totalRecords:response.data.totalRecords,
						currentPage: response.data.currentPage
					});
				},(errors)=>{
		});


	}
	onSaveAndClose(value,checkedData,isAdd,call){
		var that = this;
		
		if(this.state.DialogContent == 3){
			value=Object.assign({},checkedData,value);
		}else {

		}
		apiPost(API_FOODING_ERP,'/termsfreight/forbe/save',value,(response)=>{
				that.getPage();
				this.setState({
			rodalShow:!!isAdd
		})
				ServiceTips({text:response.message,type:'sucess'});
				if(isAdd){
					call();
				}
		},(message)=>{
				ServiceTips({text:message.message,type:'error'});
		});
	}
	// 取消
	onCancel(that){
		this.setState({
			rodalShow:false
		})
	}
	getXiang(){
		var that = this;
		apiGet(API_FOODING_ERP,'/common/getTermModes',{},(response)=>{
			that.setState({
				seaMeasure:response.data.seaMeasure,
				seaBox:response.data.seaBox,
				getTermModes:response.data
			});
		},(error)=>{

		})
	}
	componentDidMount(){
		this.getPage();
		this.getXiang();
		window.addEventListener('resize', this.handleResize(47));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	render(){
		let that = this;
		return(<div>
			<FilterHeader  getPage ={this.getPage}  normalRef={no => this.normalRef = no} expandFilter={this.handleResize}/>
			<div className={'clientcontact-list-body'} style={{height:this.state.scrollHeight}}>
				<div className={'clientcontact-list-body-single'}>
					<div className={'keys-page'}>
						<FunctionKeys addClick={this.addClick} 
						daochuClick={this.daochuClick}
						daoruClick={this.daoruClick}
						fabuClick={this.fabuClick}
						allfabuClick={this.allfabuClick}
						zuofeiClick={this.zuofeiClick} />
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
					</div>
					<div className="line"></div>
					<div className="train-action-buttons scroll" style={{height:this.state.scroll}}>
					{
						this.state.data.map((dataItem,i)=>{
							return(
							<div className="train" key={i}>
								<div className="top">
									<Checkbox className="terms-checkbox" style={{marginLeft:'20px'}} onChange={this.onChange.bind(this,dataItem,i)}/>
									<span style={{flex:3,color:'#5594ea',marginLeft:'19px'}}>{dataItem["sStatn"+language]}-{dataItem["eStatn"+language]}</span>
								 	<span style={{flex:2,color:'#3d495a'}}>{dataItem["route" + language]}</span>
									<span style={{flex:1,color:'#3d495a'}}>{dataItem["lsBe"+language]}</span>
									
									<span style={{flex:2,color:'#3d495a'}}><span style={{marginRight:'20px'}}>{i18n.t(100286/*生效日期*/)}</span>{new Date(dataItem["sDate"]).Format("yyyy-MM-dd")}</span>
									<span style={{flex:2,color:'#3d495a'}}><span style={{marginRight:'20px'}}>{i18n.t(100287/*失效日期*/)}</span>{new Date(dataItem["eDate"]).Format("yyyy-MM-dd")}</span>
									<span style={{flex:1,color:'#3d495a'}}>{dataItem["reStatusName"]}</span>
									<span style={{flex:1,color:'#3d495a',textAlign:'right',paddingRight:'20px'}}>

										{dataItem.reStatus!=0 && permissionsBtn('forwseaPrice.copy')? <i  style={{marginRight:'25px'}} title={i18n.t(100452/*复制*/)} onClick ={this.copyClick.bind(this,dataItem)} className="foddingicon fooding-copy"></i> : ''}	
											{dataItem.reStatus!= 0 && dataItem.reStatus!= 35 && permissionsBtn('forwseaPrice.delete')? <i style={{marginRight:'25px'}} title={i18n.t(100437/*删除*/)} onClick ={this.deleteClick.bind(this,dataItem)} className="foddingicon fooding-delete-icon4"></i> : ''}
											{dataItem.reStatus!= 0 && dataItem.reStatus!= 35 && dataItem.reStatus!= 38 && permissionsBtn('forwseaPrice.edit')? <i onClick ={this.editClick.bind(this,dataItem)} title={i18n.t(100439/*编辑*/)} className="foddingicon fooding-alter_icon2"></i> : ''}
											{dataItem.reStatus!= 0 && dataItem.reStatus!= 1 && dataItem.reStatus!= 38 && permissionsBtn('forwseaPrice.void')? <i onClick ={this.zuofeiBtnClick.bind(this,dataItem)} title={i18n.t(100471/*作废*/)} className="foddingicon fooding-ivoid"></i>: ''}
									
									</span>
								</div>
								<div className="bottom">
									<span style={{flex:2,color:'#5594ea',marginLeft:'50px'}}>
										<span style={{paddingRight:'20px'}}>{i18n.t(201093/*船期*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["shipdate"]}</span>
									</span>
									<span style={{flex:2,color:'#5594ea'}}>
										<span style={{marginRight:'20px'}}>{i18n.t(300049/*航程(天)*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["voyNums"]}</span>
									</span>
									<span style={{flex:2,color:'#5594ea'}}>
										<span style={{marginRight:'20px'}}>{i18n.t(100284/*币种*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["cny"+language]}</span>
									</span>
									<span style={{color:'#5594ea',flex:5}}>
									<span style={{marginRight:'10px'}}>{i18n.t(100295/*整箱价*/)}</span>
										{
											this.state.seaBox.map((e,i)=>{
												if(dataItem.prices[e.id]){
													return <span style={{color:'#f33535',marginRight:'30px'}} key={i}>{e.localName}/{dataItem.prices[e.id]}</span>
												}
											})
										}
									</span>
									<span style={{color:'#5594ea',flex:3}}>
										<span style={{marginRight:'10px'}}>{i18n.t(100296/*拼箱价*/)}</span>
										{
											this.state.seaMeasure.map((e,k)=>{
												let price = dataItem.prices[e.id] || "";
												let lb = String(e.localName + "/" + price);
												if(dataItem.prices[e.id]){
													return <span style={{color:'#f33535',marginRight:'30px'}} key={k}>{lb}</span>
												}
											})
										}
									</span>
								</div>
							</div>
								)
						})
					}
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						<SeaPricePlug DialogContent={this.state.DialogContent}
						getTermModes ={this.state.getTermModes}
						 checkedData = {this.state.checkedData}
						 buttonLeft = {this.state.buttonLeft}
						  onSaveAndClose ={this.onSaveAndClose}
						  contentDate = {this.state.contentDate}
						  showSaveAdd ={this.state.showSaveAdd}
						  showSaveClose={this.state.showSaveClose}
						  onCancel = {this.onCancel}/>
					</Dialog>
				</div>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(SeaPrice);
