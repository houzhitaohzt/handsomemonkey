import React,{Component,PropTypes} from 'react';
import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../components/Table");//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import FunctionKeys from "./FuncKeys";
import LtclPlug from './LtclPlug';
import i18n from '../../../lib/i18n';
import {copy,permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import {I18n} from "../../../lib/i18n";


class Ltcl extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		var that = this;
		this.getPage = this.getPage.bind(this);
		this.addClick=this.addClick.bind(this);
		this.editClick=this.editClick.bind(this);		
		this.deleteClick=this.deleteClick.bind(this);
		this.copyClick=this.copyClick.bind(this);	
		this.onCancel=this.onCancel.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		// 列表 遍历数据
		this.getTermModes = [{id:1, name:"nini"}];
		this.state = {
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:null,
			MeunState:true,
			rodalShow:false,
			buttonLeft:I18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			initData: [], // 初始化 数据
			data:[], // 列表数据
			currentPage:1, // 当前页
			showSaveAdd:false,
			showSaveClose:true,
			pageSize: pageSize, // 每页 多少条
			billId: '',	
			ccId: '',


		}


		this.columns = [{
			title : i18n.t(100244/*企业*/),
			dataIndex : 'cc'+language,
			key : "cc"+language,
			width : '12%',
			render(data,row,Idindex){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
				}
		},{
			title : I18n.t(100224/*运输方式*/),
			dataIndex : 'statnTyName',
			key : "statnTyName",
			width : '5%',
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>)
			}
		},{
			title : I18n.t(100297/*起运港*/),
			dataIndex : 'sStatn' + language,
			key : 'sStatn' + language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100298/*目的港*/),
			dataIndex : 'eStatn' + language,
			key : 'eStatn' + language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(200343/*货运公司*/),
			dataIndex : 'lsBe' + language,
			key : 'lsBe' + language,
			width : "12%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100284/*币种*/),
			dataIndex : 'cny' + language,
			key : 'cny' + language,
			width : "5%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(600010/*拼箱港杂*/),
			dataIndex : "prices",
			key : "prices",
			width : "9%",
			render(data,row,index){
				return that.getTermModes.map( (o,i)=> 
					<div key={i}><span style={{marginRight:30}}>{o.name}</span><label>{toDecimal(data[o.id])}</label></div> 
				);
			}
		},{
			title : I18n.t(100286/*生效日期*/),
			dataIndex : "sDate",
			key : "sDate",
			width : "7%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : I18n.t(100287/*失效日期*/),
			dataIndex : "eDate",
			key : "eDate",
			width : "7%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : I18n.t(100288/*发布日期*/),
			dataIndex : "reDate",
			key : "reDate",
			width : "7%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : I18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "15%",
			render(data,row,index){
				return <div>
							{ permissionsBtn('ltcl.edit') ? 
								<i className='foddingicon fooding-alter_icon2' onClick={that.editClick.bind(this,data,row)} style={{marginRight:'20px'}} title={I18n.t(100439/*编辑*/)}></i>
								:
								''
							}
							{ permissionsBtn('ltcl.del') ? 
								<i className='foddingicon fooding-delete-icon4' onClick={that.deleteClick.bind(this,data,row)} style={{marginRight:'20px'}} title={I18n.t(100437/*删除*/)}></i>
								:
								''
							}
							{ permissionsBtn('ltcl.copy') ? 
								<i className='foddingicon fooding-copy' onClick={that.copyClick.bind(this,data,row)} style={{marginRight:'20px'}} title={I18n.t(100452/*复制*/)}></i>
								:
								''
							}
					   </div>;
			}
		}];


	}

	componentDidMount(){
		window.addEventListener('resize', this.handleResize(47));
		this.getInit();
		// this.getPage();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}
	handleResize(height){
		let sch=document.body.offsetHeight-72-height;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
		console.log(scroll);
	}
	onSaveAndClose(){
		this.setState({
			rodalShow:false
		});		
	}
	onCancel(that){
		this.setState({
			rodalShow:false
		})
	}

	addClick(){
		this.setState({
			rodalShow : true,
			showHeader:true,
			DialogContent:1,
			title:I18n.t(500234/*新增拼箱预估港杂*/),
			showSaveAdd:true,
			showSaveClose:true
		})
	}

	// 修改 click
	editClick(e,record,event){
		var that = this;
		if(event){
				event.stopPropagation();
		}
		that.refs.product.setSelectRow(record,true);
		apiGet(API_FOODING_ERP,'/termsportcharges/getOne',{id:record.id},
			(response)=>{	
				that.setState({	
					rodalShow : true,
					showHeader:true,
					DialogContent:3,
					showSaveAdd:false,
					checkedData:response.data,
					title:i18n.t(500235/*编辑拼箱预估港杂*/)
				});
			},(errors)=>{
		});
	}

	// 复制
	copyClick(e,record,event){
		var that = this;
		if(event){
				event.stopPropagation();
		}
		that.refs.product.setSelectRow(record,true);
		apiGet(API_FOODING_ERP,'/termsportcharges/copy',{id:record.id},(response)=>{
			that.setState({
				rodalShow : true,
				showHeader:true,
				DialogContent:3,
				showSaveAdd:false,
				checkedData:response.data,
				title:i18n.t(500235/*编辑拼箱预估港杂*/)
			})
		},(error)=>{

		});
	}

	// 删除
	deleteClick(e,data,event){
		var that = this;
		event.stopPropagation();
		that.refs.product.setSelectRow(data,true);
		Confirm(i18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
		  done: () => {
			    apiForm(API_FOODING_ERP,'/termsportcharges/cc/delete',{id:data.id},(response)=>{
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


	

	// ajax init
	getInit(){
		var that = this;
		apiGet(API_FOODING_ERP,'/common/getTermModes',{},
			(response)=>{
				this.getTermModes = [].concat(response.data.seaMeasure,response.data.lclCharge);						
				this.state.initData = response.data;	
				this.getPage();
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{isPlatform:true,type:30,pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/termsportcharges/cc/getPage',object,
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
		let	that = this;
		let {page,currentPage} =this.state;
		const data = this.state.data || [];
		return(<div>
			<FilterHeader getPage={this.getPage} normalRef={no => this.normalRef = no}
			expandFilter={this.handleResize}/>
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
						ref = "product"
						columns={this.columns}
						data={data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						onRowDoubleClick={this.onRowDoubleClick}
						scroll={{x:true,y:this.state.scroll}}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						<LtclPlug DialogContent={this.state.DialogContent}
						 	checkedData = {this.state.checkedData}
							buttonLeft = {this.state.buttonLeft}
						  	onSaveAndClose ={this.onSaveAndClose}
						  	contentDate = {this.state.contentDate}
						  	onCancel = {this.onCancel}
						  	initData = {this.state.initData}
						  	getPage = {this.getPage}
						/>
					</Dialog>
				</div>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(Ltcl);

