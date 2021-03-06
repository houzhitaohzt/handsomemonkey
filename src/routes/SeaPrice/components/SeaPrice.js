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
// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,copy,toDecimal} from '../../../services/apiCall';
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
			pageSize: pageSize, // 每页 多少条
			data : [],
			seaMeasure:[],
			seaBox:[],
			getTermModes:{},
			obj:{}

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
		
	}
	addClick(){
		this.setState({
			rodalShow : true,
			showHeader:true,
			showSaveAdd:true,
			showSaveAdd:false,
			showSaveClose:true,
			DialogContent:1,
			title:i18n.t(201091/*新增海运运价*/)
		})
	}
	editClick(record){
		var that = this;
		apiGet(API_FOODING_ERP,'/termsfreight/getOne',{id:record.id},(response)=>{
			that.setState({
				DialogContent:3,
				checkedData:response.data
			})
		},(error)=>{

		});
		this.setState({
			rodalShow : true,
			showHeader:true,
			showSaveAdd:false,
			DialogContent:0,
			title:i18n.t(201091/*新增海运运价*/),
			checkedData:record
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
			showSaveAdd:false,
			DialogContent:0,
			title:i18n.t(201091/*新增海运运价*/),
			checkedData:record
		})
	}
	deleteClick(record){
		var that = this;
		Confirm(i18n.t(300035/*删除后将无法恢复，您确定要删除吗？*/), {
		  done: () => {
			    apiForm(API_FOODING_ERP,'/termsfreight/cc/delete',{id:record.id},(response)=>{
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
		apiGet(API_FOODING_ERP,'/termsfreight/cc/getPage',object,
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
		apiPost(API_FOODING_ERP,'/termsfreight/cc/save',value,(response)=>{
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
		let {page,currentPage} =this.state;
		let  iconArray = [{type:'add',onClick:this.addClick}];
		let that = this;
		return(<div>
			<FilterHeader  getPage ={this.getPage}  normalRef={no => this.normalRef = no} expandFilter={this.handleResize}/>
			<div className={'clientcontact-list-body'} style={{height:this.state.scrollHeight}}>
				<div className={'clientcontact-list-body-single'}>
					<div className={'keys-page'}>
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
					<div className="line"></div>
					<div className="train-action-buttons scroll" style={{height:this.state.scroll}}>
					{
						this.state.data.map((dataItem,i)=>{
							return(
							<div className="train" key={i}>
								<div className="top">
									<Checkbox className="terms-checkbox" style={{marginLeft:'20px'}} onChange={this.onChange}/>
									<span style={{flex:2,color:'#5594ea',marginLeft:'19px'}}>{dataItem["sStatn"+language]}-{dataItem["eStatn"+language]}</span>
									<span style={{flex:2,color:'#3d495a'}}>{dataItem["route" + language]}</span>
									<span style={{flex:3,color:'#3d495a'}}>{dataItem["lsBe"+language]}</span>
									{ dataItem.reStatus ? <span style={{flex:3,color:'#3d495a'}}>{dataItem["reCc" + language]}</span> : <span style={{flex:3,color:'#3d495a'}}>{dataItem["forBe" + language]}</span>}
									<span style={{flex:2,color:'#3d495a'}}><span style={{marginRight:'20px'}}>{i18n.t(100286/*生效日期*/)}</span>{new Date(dataItem["sDate"]).Format("yyyy-MM-dd")}</span>
									<span style={{flex:2,color:'#3d495a'}}><span style={{marginRight:'20px'}}>{i18n.t(100287/*失效日期*/)}</span>{new Date(dataItem["eDate"]).Format("yyyy-MM-dd")}</span>
									<span style={{flex:1,color:'#3d495a'}}>{dataItem["reStatusName"]}</span>
									<span style={{flex:1,color:'#3d495a',textAlign:'right',paddingRight:'20px'}}>

										{ dataItem.reStatus!=35 && dataItem.reStatus!=0 && permissionsBtn('seaPrice.copy') ? <i  style={{marginRight:'25px'}} onClick ={this.copyClick.bind(this,dataItem)} title={i18n.t(100452/*复制*/)} className="foddingicon fooding-copy"></i> : ''}	
										{ permissionsBtn('seaPrice.del') ? <i style={{marginRight:'25px'}} onClick ={this.deleteClick.bind(this,dataItem)} className="foddingicon fooding-delete-icon4" title={i18n.t(100437/*删除*/)}></i> : ''}
										{dataItem.reStatus!=35 && dataItem.reStatus!=0 && permissionsBtn('seaPrice.edit')? <i onClick ={this.editClick.bind(this,dataItem)} className="foddingicon fooding-alter_icon2" title={i18n.t(100439/*编辑*/)}></i> : ''}								

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
													return <span style={{color:'#f33535',marginRight:'30px'}} key={i}>{e.localName}/{toDecimal(dataItem.prices[e.id])}</span>
												}
											})
										}
									</span>
									<span style={{color:'#5594ea',flex:3}}>
										<span style={{marginRight:'10px'}}>{i18n.t(100296/*拼箱价*/)}</span>
										{
											this.state.seaMeasure.map((e,k)=>{
												let price = dataItem.prices[e.id] || "";
												let lb = String(e.localName + "/" + toDecimal(price));
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
