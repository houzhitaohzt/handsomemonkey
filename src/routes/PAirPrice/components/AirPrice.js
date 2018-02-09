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
import AirPricePlug from './AirPricePlug';
import Checkbox from '../../../components/CheckBox';
import {I18n} from "../../../lib/i18n";
// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,copy} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
class AirPrice extends Component{
	constructor(props){
		super(props);
		this.columns = [];
		this.state = {
			scrollHeight:0,
			filter:null,
			choised:false,
			MeunState:true,
			rodalShow:false,
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条
			data : [],
			airMeasure:[],
			getTermModes:{},
			obj:{},
			getSelectArr:[]
		}
		this.handleResize = this.handleResize.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
		this.getPage = this.getPage.bind(this);
		this.getXiang = this.getXiang.bind(this);
		this.onChange=this.onChange.bind(this);
		this.shoucangClick=this.shoucangClick.bind(this);
		this.allshoucangClick=this.allshoucangClick.bind(this);
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
	shoucangClick(){
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
			Confirm('您确定要收藏选中的数据吗?', {
					  done: () => {
						    apiForm(API_FOODING_ERP,'/termsfreight/platform/enshrine',{ids:value},(response)=>{
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
	allshoucangClick(){
		let getSelectArr =[];
		this.state.getSelectArr.map((e)=>{if(e){
		   getSelectArr.push(e);	
		}})
		let value=[];
		var that = this;
			let object=Object.assign({},that.normalRef.getForm());
			Confirm('您确定要执行全部收藏操作吗?', {
					  done: () => {
						    apiForm(API_FOODING_ERP,'/termsfreight/platform/enshrineall',object,(response)=>{
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
	onSaveAndClose(value,checkedData,isAdd){
		// var that = this;
		// this.setState({
		// 	rodalShow:!!isAdd
		// })
		// if(this.state.DialogContent == 3){
		// 	value=Object.assign({},checkedData,value);
		// }else {

		// }
		// 
		// apiPost(API_FOODING_ERP,'/freight/save',value,(response)=>{
		// 		that.getPage();
		// 		ServiceTips({text:response.message,type:'sucess'});
		// },(message)=>{
		// 		ServiceTips({text:message.message,type:'error'});
		// });
	}
	// 取消
	onCancel(that){
		this.setState({
			rodalShow:false
		})
	}
	onRowDoubleClick(record,index,checked){
		// this.setState({
		// 	rodalShow : true,
		// 	showHeader:true,
		// 	buttonLeft:'保存并且关闭',
		// 	DialogContent:3,
		// 	title:'编辑空运运价',
		// 	checkedData:record
		// })
	}
	handleResize(e, height) {
		 this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        this.setState({scroll: scroll});
	}
	componentDidMount(){
		this.getPage();
		this.getXiang();
		window.addEventListener('resize', this.handleResize());
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize());
	}
	// ajax list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
		let object=Object.assign({},{isPlatform:true,type:30, pageSize: this.state.pageSize,currentPage: currentP},this.normalRef.getForm());
			apiGet(API_FOODING_ERP,'/termsfreight/platform/getPage',object,
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
	getXiang(){
		var that = this;
		apiGet(API_FOODING_ERP,'/common/getTermModes',{},(response)=>{
			that.setState({
				airMeasure:response.data.airMeasure,
				getTermModes:response.data
			});
		},(error)=>{

		})
	}
	render(){
		let {page,currentPage} =this.state;
		var that = this;
		return(<div>
			<FilterHeader  getPage ={this.getPage}
			normalRef={no => this.normalRef = no}
			expandFilter={this.handleResize}
			/>
			<div className={'clientcontact-list-body'} style={{height:this.state.scrollHeight}}>
				<div className={'clientcontact-list-body-single'}>
					<div className={'keys-page'}>
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
					<div className="line"></div>
					<div className="train-action-buttons scroll" style={{height:this.state.scroll}}>
					{
						this.state.data.map((dataItem,i)=>{
							return(
							<div className="train" key={i}>
								<div className="top">
									{dataItem.isContained?<Checkbox className="terms-checkbox" style={{marginLeft:'20px'}} onChange={this.onChange.bind(this,dataItem,i)} disabled />:<Checkbox className="terms-checkbox" style={{marginLeft:'20px'}} onChange={this.onChange.bind(this,dataItem,i)}/>}
									<span style={{flex:2,color:'#5594ea',marginLeft:'19px'}}>{dataItem["sStatn"+language]}-{dataItem["eStatn"+language]}</span>
									<span style={{flex:1,color:'#3d495a'}}>{dataItem["lsBe"+language]}</span>
									<span style={{flex:2,color:'#3d495a'}}>{dataItem["reCc" + language]}</span>
									<span style={{flex:2,color:'#3d495a'}}><span style={{marginRight:'20px'}}>{i18n.t(100286/*生效日期*/)}</span>{new Date(dataItem["sDate"]).Format("yyyy-MM-dd")}</span>
									<span style={{flex:2,color:'#3d495a'}}><span style={{marginRight:'20px'}}>{i18n.t(100287/*失效日期*/)}</span>{new Date(dataItem["eDate"]).Format("yyyy-MM-dd")}</span>
									{dataItem.isContained?<span style={{flex:1,color:'#3d495a'}}>{i18n.t(500294/*已收藏*/)}</span>:''}
								</div>
								<div className="bottom">
									<span style={{flex:1,color:'#5594ea',marginLeft:'50px'}}>
										<span style={{paddingRight:'20px'}}>{i18n.t(100284/*币种*/)}</span>
										<span style={{color:'#747d89'}}>{dataItem["cny"+language]}</span>
									</span>
									<span style={{flex:5,color:'#5594ea'}}>
										<span style={{marginRight:20}}>{i18n.t(500128/*运价*/)}</span>
										{
											this.state.airMeasure.map((e,i)=>{
												if(dataItem.prices==null){
													return
												}else if(dataItem.prices[e.id]){
													return <span style={{color:'#f33535',marginRight:'90px'}} key={i}>{e.localName}/{dataItem.prices[e.id]}</span>
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
						<AirPricePlug DialogContent={this.state.DialogContent}
						 getTermModes = {this.state.getTermModes}
						 checkedData = {this.state.checkedData}
						 buttonLeft = {this.state.buttonLeft}
						  onSaveAndClose ={this.onSaveAndClose}
						  contentDate = {this.state.contentDate}
						  onCancel = {this.onCancel}/>
					</Dialog>
				</div>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(AirPrice);
