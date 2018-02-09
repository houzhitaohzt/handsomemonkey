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
		this.deleteBtnClick = this.deleteBtnClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.editClick=this.editClick.bind(this);
		this.copyClick=this.copyClick.bind(this);
		var that = this;
		this.handleClick=this.handleClick.bind(this);
		this.getPage = this.getPage.bind(this);
		this.getInit = this.getInit.bind(this);
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
						{ permissionsBtn('costTray.edit') ? 
										<i className='foddingicon fooding-alter_icon2' title={'100439'} onClick={that.editClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>
										:
										''
									}	
									{ permissionsBtn('costTray.del') ? 
										<i className='foddingicon fooding-delete-icon4' title={'100437'} onClick={that.deleteBtnClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>
										:
										''
									}
									{ permissionsBtn('costTray.copy') ? 
										<i className='foddingicon fooding-copy' title={i18n.t(100452/*复制*/)} onClick={that.copyClick.bind(this,data,row)} style={{marginRight:'20px'}} ></i>
										:
										''
									}	
					</div>; 
				}
			}]
		}
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
					rodalShow : true,
					showHeader:true,
					DialogContent:3,
					checkedData:response.data,
					title:i18n.t(200529/*编辑托盘费用*/)
				});
			},(errors)=>{
		});
	}

	// 删除 click
	deleteBtnClick(e,data,event){
		var that = this;
		event.stopPropagation();
		that.refs.costTray.setSelectRow(data,true);
		Confirm("您确定要删除吗？", {
		  done: () => {
			    apiForm(API_FOODING_ERP,'/termssalver/cc/delete',{id:data.id},(response)=>{
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
				rodalShow : true,
				showHeader:true,
				DialogContent:3,
				checkedData:response.data,
				title:i18n.t(200529/*编辑托盘费用*/)
			})
		},(error)=>{

		});
	}

	// 保存
	onSaveAndClose(value,checkedData,isAdd){
		var that = this;
		
		if(this.state.DialogContent == 3){
			value=Object.assign({},checkedData,value);
		}else {
			
		}
		apiPost(API_FOODING_ERP,'/termssalver/cc/save',value,(response)=>{
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
	

	// 右键
	handleClick(e,data){
		if(data.type == 1){
			this.deleteClick();
		}else if(data.type ==2){
  			this.editClick(e,data.record);
  		}
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
			width : '5%',
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : i18n.t(100297/*起运港*/),
			dataIndex : "sStatn"+language,
			key :"sStatn"+language,
            width : '10%',
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100299/*货代公司*/),
			dataIndex : "forBe"+language,
			key : "forBe"+language,
            width : '10%',
			render(data,row,index){
				return <div>{row.reStatus || row.reStatus===0 ?row['reCc'+language]:data}</div>
						
			}
		},{
			title : i18n.t(100284/*币种*/),
			dataIndex : "cny"+language,
			key : "cny" + language,
            width : '5%',
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
						width : '6%',
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
					title : '',
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
									{ row.reStatus!=35 && row.reStatus!=0 &&permissionsBtn('costTray.edit') ? 
										<i className='foddingicon fooding-alter_icon2' title={i18n.t(100439/*编辑*/)} onClick={that.editClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>
										:
										''
									}	
									{ permissionsBtn('costTray.del') ? 
										<i className='foddingicon fooding-delete-icon4' title={i18n.t(100437/*删除*/)} onClick={that.deleteBtnClick.bind(this,data,row)} style={{marginRight:'20px'}}></i>
										:
										''
									}
									{ row.reStatus!=35 && row.reStatus!=0 &&permissionsBtn('costTray.copy') ? 
										<i className='foddingicon fooding-copy' title={i18n.t(100452/*复制*/)} onClick={that.copyClick.bind(this,data,row)} style={{marginRight:'20px'}} ></i>
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
		let object=Object.assign({},{pageSize:this.state.pageSize,currentPage:currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/termssalver/cc/getPage',object,
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
	render(){
		let that = this;
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader getPage = {this.getPage} expandFilter={this.handleResize} normalRef={no => this.normalRef = no}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
					 	<FunctionKeys addClick={this.addClick} />
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
						singleSelect  = {true}
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

