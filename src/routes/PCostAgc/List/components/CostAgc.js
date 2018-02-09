import React, {Component, PropTypes} from "react";
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table  from "../../../../components/Table";//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FunctionKeys from "./FuncKeys";
import FilterHeader from "./FilterHeader";

// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,copy,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import {I18n } from '../../../../lib/i18n';
import i18n from './../../../../lib/i18n';
class Forwarderlist extends Component{
	constructor(props){
		super(props)
		this.handleResize = this.handleResize.bind(this);
		this.handleClick=this.handleClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.getPage = this.getPage.bind(this);
		this.shoucangClick=this.shoucangClick.bind(this);
		this.allshoucangClick=this.allshoucangClick.bind(this);
		var that = this;
		this.state = {
			scrollHeight:0,
			filter:null,
			choised:false,
			MeunState:true,
			rodalShow:false,
			showSaveAdd:false,
			showSaveClose:true,
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			contentTemplate:<div></div>,
			checkedData:'',
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条
			data : [],
			obj:{}
		}
		this.columns = [{
			title :I18n.t(100299/*货代公司*/),
			dataIndex : "reCc"+language,
			key : "reCc"+language,
			width : "15%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100155/*港口*/),
			dataIndex : "statn"+language,
			key : "statn"+language,
			width : "7%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(500122/*标准费用*/),
			dataIndex : "costAgg",
			key : "costAgg",
			width : "7%",
			render(data,row,index){
				return (<div>{data?toDecimal(data)+' '+row["cny"+language]:''}</div>)
			}
			},{
			title : I18n.t(500121/*费用名称*/),
			dataIndex : "costlvtr"+language,
			key : "costlvtr"+language,
			width : "7%",
			render(data,row,index){
				return data;
			}
			},{
			title : I18n.t(500088/*装箱类型*/),
			dataIndex : "contnrTy"+language,
			key : "contnrTy"+language,
			width : "7%",
			render(data,row,index){
				return data;
			}
			},{
			title : I18n.t(100214/*箱型*/),
			dataIndex : "packTyName",
			key : "packTyName",
			width : "7%",
			render(data,row,index){
				return data;
			}
			},{
			title : I18n.t(500123/*计算模式*/),
			dataIndex : "chargeTyName",
			key : "chargeTyName",
			width : "7%",
			render(data,row,index){
				return data;
			}
		},{
			title :I18n.t(100286/*生效日期*/),
			dataIndex : "sDate",
			key : "sDate",
			width : "15%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title :I18n.t(100287/*失效日期*/),
			dataIndex : 'eDate',
			key : 'eDate',
			width : "15%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title :I18n.t(100288/*发布日期*/),
			dataIndex : 'reDate',
			key : 'reDate',
			width : "15%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
					title : '',
					dataIndex : "isContained",
					key : "isContained",
                    width : '10%',
					render(data,row,index){
                        return <div>{data?i18n.t(500294/*已收藏*/):''}</div>;
					}
		}];
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
						    apiForm(API_FOODING_ERP,'/termslsbeport/platform/enshrine',{ids:value},(response)=>{
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
							    apiForm(API_FOODING_ERP,'/termslsbeport/platform/enshrine',{ids:value},(response)=>{
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
						    apiForm(API_FOODING_ERP,'/termslsbeport/platform/enshrineall',object,(response)=>{
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
		var that = this;
		this.setState({
			rodalShow:!!isAdd
		})
		if(this.state.DialogContent == 3){
			value=Object.assign({},checkedData,value);
		}else {
			
		}
		apiPost(API_FOODING_ERP,'/termslsbeport/cc/save',value,(response)=>{
				that.getPage();
				ServiceTips({text:response.message,type:'sucess'});
		},(message)=>{
				ServiceTips({text:message.message,type:'error'});
		});
	}
	onCancel(that){
		this.setState({
			rodalShow:false
		})
	}
	
	handleClick(e,data){
	}
	handleResize(e, height) {
		 this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 ;
        this.setState({scroll: scroll});
	}
	
	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{isPlatform:true, beType:20,pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm());
		apiGet(API_FOODING_ERP,'/termslsbeport/platform/getPage',object,
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
	componentDidMount(){
		this.getPage();
		window.addEventListener('resize', this.handleResize(47));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	render(){
		const data = this.state.data || [];
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader getPage = {this.getPage} expandFilter={this.handleResize} normalRef={no => this.normalRef = no}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight,marginTop:'10px'}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
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
						ref = "costTray"
						columns={this.columns}
						data={data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title}>
						{this.state.dialogContent}
					</Dialog>
					 </div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(Forwarderlist);
