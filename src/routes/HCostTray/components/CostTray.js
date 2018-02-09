import i18n from './../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
import Table  from "../../../components/Table" ;//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import CostTrayPlug from './CostTrayPlug';
// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,copy,toDecimal} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';


class CostTray extends Component{

	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.addClick=this.addClick.bind(this);
		//this.deleteClick=this.deleteClick.bind(this);
		this.deleteBtnClick = this.deleteBtnClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.editClick=this.editClick.bind(this);
		this.copyClick=this.copyClick.bind(this);

		var that = this;
		this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
		this.getPage = this.getPage.bind(this);
		this.getInit = this.getInit.bind(this);
		this.daochuClick = this.daochuClick.bind(this);
		this.daoruClick = this.daoruClick.bind(this);
		this.fabuClick = this.fabuClick.bind(this);
		this.allfabuClick = this.allfabuClick.bind(this);
		this.zuofeiClick = this.zuofeiClick.bind(this);
		this.zuofeiBtnClick=this.zuofeiBtnClick.bind(this); 

		// init state
		this.state = {
			scrollHeight:0,
			filter:null,
			checkedRows:[],
			rodalShow:false,
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			data : [],
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条
			getTermModes:[],

			columns:[{
				title : i18n.t(200098/*操作*/),
				dataIndex : "handle",
				key : "handle",
				width : "10%",
				render(data,row,index){
					return <div>
						{ permissionsBtn('hcosttray.delete') ? <i className='foddingicon fooding-delete-icon4' title={i18n.t(100437/*删除*/)} onClick={that.deleteBtnClick.bind(this,data,row)} style={{marginRight:'20px'}}></i> : ''}
						{ permissionsBtn('hcosttray.edit') ? <i className='foddingicon fooding-alter_icon2'title={i18n.t(100439/*编辑*/)} onClick={that.editClick.bind(this,data,row)}></i> : ''}
						{ permissionsBtn('hcosttray.copy') ? <i className='foddingicon fooding-copy' title={i18n.t(100452/*复制*/)} onClick={that.copyClick.bind(this,data,row)} style={{marginRight:'20px'}} ></i>:	''}	
						
					</div>; 


				}
			}]
		}
	}
	zuofeiBtnClick(e,data,event){
		var that = this;
		event.stopPropagation();
		that.refs.costTray.setSelectRow(data,true);
		Confirm(i18n.t(500178/*你确定执行作废操作吗?*/), {
		  done: () => {
			    apiForm(API_FOODING_ERP,'/termssalver/forbe/drop',{ids:data.id},(response)=>{
			    		that.getPage();
						ServiceTips({text:response.message,type:'sucess'});
			    },(error)=>{
			    		ServiceTips({text:error.message,type:'error'});
			    })
			},
			close:() => {
				console.log('no, close')
			}
		});
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(47));
		this.getInit();
		this.getPage(); // 页面初始化
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	// 新增 click
	addClick(){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			title:i18n.t(200527/*新增托盘费用*/)
		})
	}

	// 编辑 click
	editClick(e,record,event){
		var that = this;
		if(event){
				event.stopPropagation();
		}
		that.refs.costTray.setSelectRow(record,true);
		apiGet(API_FOODING_ERP,'/termssalver/getOne',{id:record.id},
			(response)=>{	
				that.setState({	
					DialogContent:3,
					rodalShow : true,
					showHeader:true,
					title:i18n.t(200529/*编辑托盘费用*/),
					checkedData:response.data
				});
			},(errors)=>{
		});
	}

	// 删除 click
	deleteBtnClick(e,data,event){
		var that = this;
		event.stopPropagation();
		that.refs.costTray.setSelectRow(data,true);
		Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
		  done: () => {
			    apiForm(API_FOODING_ERP,'/termssalver/forbe/delete',{id:data.id},(response)=>{
			    		that.getPage();
						ServiceTips({text:response.message,type:'sucess'});
			    },(error)=>{
			    		ServiceTips({text:error.message,type:'error'});
			    })
			},
			close:() => {
				console.log('no, close')
			}
		});
	}

	// 复制
	copyClick(e,record,event){
		var that = this;
		if(event){
				event.stopPropagation();
		}
		that.refs.costTray.setSelectRow(record,true);
		apiGet(API_FOODING_ERP,'/termssalver/copy',{id:record.id},(response)=>{
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
			title:i18n.t(200529/*编辑托盘费用*/),
			checkedData:record
		})
	}
	daochuClick(){
		console.log('1')
	}
	daoruClick(){
		console.log('2')
	}
	fabuClick(){
		let numArr = this.refs.costTray.getSelectArr();
		let value=[];
		var that = this;
		if(numArr.length > 0){
			for (var i = 0; i < numArr.length; i++) {
					value.push(numArr[i].id);	
			}
			Confirm(i18n.t(500179/*确定发布吗?*/), {
					  done: () => {
						    apiForm(API_FOODING_ERP,'/termssalver/forbe/release',{ids:value},(response)=>{
						    	that.getPage();
						    	

						    },(errors)=>{
						    	ServiceTips({text:errors.message,type:'error'});
						    });
						},
						close:() => {
						}
			});
		}else{
			ServiceTips({text:i18n.t(100434/*请选择一条数据！*/),type:'error'});
		}
	}
	allfabuClick(){
		let numArr = this.refs.costTray.getSelectArr();
		let value=[];
		var that = this;
		let object=Object.assign({},that.normalRef.getForm());
			Confirm('您确定全部发布吗?', {
					  done: () => {
						    apiForm(API_FOODING_ERP,'/termssalver/forbe/releaseall',object,(response)=>{
						    	that.getPage();
                                ServiceTips({text:response.message,type:'success'});

						    },(errors)=>{
						    	ServiceTips({text:errors.message,type:'error'});
						    });
						},
						close:() => {
						}
			});
	}
	zuofeiClick(){
		let numArr = this.refs.costTray.getSelectArr();
		let value=[];
		var that = this;
		if(numArr.length > 0){
			for (var i = 0; i < numArr.length; i++) {
					value.push(numArr[i].id);	
			}
			Confirm(i18n.t(500178/*你确定执行作废操作吗?*/), {
					  done: () => {
						    apiForm(API_FOODING_ERP,'/termssalver/forbe/drop',{ids:value},(response)=>{
						    	// that.props.navRefreshCurrentTab()
						    	// 	that.props.router.push({pathname: this.props.router.location.pathname, query: {}, state: {refresh: true}});
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
			ServiceTips({text:i18n.t(100434/*请选择一条数据！*/),type:'error'});
		}
	}
	// 保存
	onSaveAndClose(value,checkedData,isAdd){
		var that = this;
		
		if(this.state.DialogContent == 3){
			value=Object.assign({},checkedData,value);
		}else {
			
		}
		apiPost(API_FOODING_ERP,'/termssalver/forbe/save',value,(response)=>{
				that.getPage();
				this.setState({
					rodalShow:!!isAdd
				})
				ServiceTips({text:response.message,type:'sucess'});
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
	// 双击
	onRowDoubleClick(record,index,checked){
		// this.setState({
		// 	rodalShow : true,
		// 	showHeader:true,
		// 	DialogContent:3,
		// 	title:'编辑托盘费用',
		// 	checkedData:{record:record}
		// })
	}
	handleResize(e, height) {
		 this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 219 - this.filterHeight;
        this.setState({scroll: scroll});
	}
	// ajax init
	getInit(){
		var that = this;
		let columns = [];
		let concatArray=[{
			title : i18n.t(100156/*港口类型*/),
			dataIndex : 'statnTyName',
			key : "statnTyName",
			width :'5%',
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : i18n.t(100297/*起运港*/),
			dataIndex : "sStatn"+language,
			key :  "sStatn"+language,
            width :'10%',
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100284/*币种*/),
			dataIndex : "cny"+language,
			key : "cny" + language,
            width :'5%',
			render(data,row,index){
				return data;
			}
		}];
		columns = columns.concat(concatArray);
		apiGet(API_FOODING_ERP,'/common/getTermModes',{},
			(response)=>{
				let array = response.data.salver;
				for(var i=0;i<array.length;i++){

					let obj = {
						title : array[i].localName,
						dataIndex :"prices",
						key : array[i].id,
						width : '5%',
						className:'text-center',
						render(data,row,index){
							return toDecimal(data[index.key]);
						}
					}
					columns.push(obj);
				}
				let contentArray=[{
					title : i18n.t(100286/*生效日期*/),
					dataIndex : "sDate",
					key : "sDate",
                    width : '7%',
					render(data,row,index){
						return new Date(data).Format('yyyy-MM-dd');
					}
				},{
					title : i18n.t(100287/*失效日期*/),
					dataIndex : "eDate",
					key : "eDate",
                    width : '7%',
					render(data,row,index){
                        return new Date(data).Format('yyyy-MM-dd');
					}
				},{
					title : i18n.t(100230/*状态*/),
					dataIndex : "reStatusName",
					key : "reStatusName",
                    width : '5%',
					render(data,row,index){
                        return data;
					}
				}];
				columns = columns.concat(contentArray);
				columns.push({
					title : i18n.t(200098/*操作*/),
					dataIndex : "handle",
					key : "handle",
                    width : '15%',
					render(data,row,index){
						return <div>
									{ row.reStatus == 1 && permissionsBtn('hcosttray.edit')? 
										<i className='foddingicon fooding-alter_icon2' title={i18n.t(100439/*编辑*/)} onClick={that.editClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>
										:
										''
									}	
									{  
										 row.reStatus != 35 && row.reStatus != 0 && permissionsBtn('hcosttray.delete')? 
										 <i className='foddingicon fooding-delete-icon4' title={i18n.t(100437/*删除*/)} onClick={that.deleteBtnClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>
										 :
										 ''
										
									}
									{ row.reStatus != 0 && permissionsBtn('hcosttray.copy')? 
										<i className='foddingicon fooding-copy' title={i18n.t(100452/*复制*/)} onClick={that.copyClick.bind(this,data,row)} style={{marginRight:'20px'}} ></i>
										:
										''
									}
									{ row.reStatus != 38 && row.reStatus != 0 && row.reStatus != 1 && permissionsBtn('hcosttray.void')? 
										<i className='foddingicon fooding-ivoid' title={i18n.t(100471/*作废*/)} onClick={that.zuofeiBtnClick.bind(this,data,row)} style={{marginRight:'20px'}} ></i>
										:
										''
									}																
							  </div>;
					}
				});
				that.setState({
					columns:columns,
					getTermModes:response.data.salver
				})
			},(errors)=>{
		});
	}
	// ajax list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
		let object=Object.assign({},{isPlatform:true, pageSize: this.state.pageSize, currentPage: currentP},this.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/termssalver/forbe/getPage',object,
			(response)=>{	
				that.setState({	
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
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader getPage = {this.getPage} expandFilter={this.handleResize} normalRef={no => this.normalRef = no}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
					 	<FunctionKeys addClick={this.addClick} 
						daochuClick={this.daochuClick}
						daoruClick={this.daoruClick}
						fabuClick={this.fabuClick}
						allfabuClick={this.allfabuClick}
						zuofeiClick={this.zuofeiClick}/>
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
					
					<Table
					    ref="costTray"
						columns={this.state.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						onRowDoubleClick={this.onRowDoubleClick}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						<CostTrayPlug DialogContent={this.state.DialogContent}
						 checkedData = {this.state.checkedData}
						 buttonLeft = {this.state.buttonLeft}
						  onSaveAndClose ={this.onSaveAndClose}
						  contentDate = {this.state.contentDate}
						  onCancel = {this.onCancel}
						  getPage = {this.getPage}
						  getTermModes={this.state.getTermModes}
						  />
					</Dialog>
				</div>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(CostTray);

