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
import {I18n} from "../../../lib/i18n";
// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,copy,toDecimal} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';


class CostTray extends Component{

	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.shoucangClick=this.shoucangClick.bind(this);
		this.allshoucangClick=this.allshoucangClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		var that = this;
		this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
		this.getPage = this.getPage.bind(this);
		this.getInit = this.getInit.bind(this);
		

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
					return  data;

				}
			}]
			
		}
	}
	shoucangClick(){
		let numArr = this.refs.costTray.getSelectArr();
		let value=[];
		var that = this;
		if(numArr.length > 1){
			for (var i = 0; i < numArr.length; i++) {
					value.push(numArr[i].id);	
			}
			Confirm('您确定要收藏选中的数据吗?', {
					  done: () => {
						    apiForm(API_FOODING_ERP,'/termssalver/platform/enshrine',{ids:value},(response)=>{
						    	that.getPage();
						    	ServiceTips({text:response.message,type:'success'});

						    },(errors)=>{
						    	ServiceTips({text:errors.message,type:'error'});
						    });
						},
						close:() => {
						}
			});
		}else if(numArr.length ==1){
				for (var i = 0; i < numArr.length; i++) {
						value.push(numArr[i].id);	
				}
              if(!numArr[0].isContained){
	              		Confirm('您确定要收藏选中的数据吗?', {
						  done: () => {
							    apiForm(API_FOODING_ERP,'/termssalver/platform/enshrine',{ids:value},(response)=>{
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
              	ServiceTips({text:'该条数据已经被收藏!',type:'error'});
              }
		}else{
			ServiceTips({text:I18n.t(100434/*请选择一条数据！*/),type:'error'});
		}
	}
	allshoucangClick(){
		let numArr = this.refs.costTray.getSelectArr();
		let value=[];
		var that = this;
		let object=Object.assign({},that.normalRef.getForm());
			Confirm('您确定要执行全部收藏操作吗?', {
					  done: () => {
						    apiForm(API_FOODING_ERP,'/termssalver/platform/enshrineall',object,(response)=>{
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
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(47));
		this.getInit();
		this.getPage(); // 页面初始化
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	// 保存
	onSaveAndClose(value,checkedData,isAdd){
		var that = this;
		this.setState({
			rodalShow:!!isAdd
		})
		if(this.state.DialogContent == 3){
			value=Object.assign({},checkedData,value);
		}else {
			
		}
		apiPost(API_FOODING_ERP,'/salvr/save',value,(response)=>{
				that.getPage();
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
			key : "sStatn"+language,
            width : '10%',
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100299/*货代公司*/),
			dataIndex : "reCc"+language,
			key : "reCc"+language,
            width : '10%',
			render(data,row,index){
				return data;
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
					dataIndex : "isContained",
					key : "isContained",
                    width : '5%',
					render(data,row,index){
                        return <div>{data?i18n.t(500294/*已收藏*/):''}</div>;
					}
				}];
				columns = columns.concat(contentArray);
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
		let object=Object.assign({},{isPlatform:true,pageSize:this.state.pageSize,currentPage:currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/termssalver/platform/getPage',object,
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
					 	<FunctionKeys shoucangClick={this.shoucangClick} 
							allshoucangClick={this.allshoucangClick}/>
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

