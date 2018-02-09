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
//import PurStockPlug from './PurStockPlug';
// ajax
import {hrefFunc,apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';

import {I18n} from '../../../lib/i18n';
import xt from "../../../common/xt";
class PurStock extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.handleClick=this.handleClick.bind(this);
		this.getPage = this.getPage.bind(this);
		this.kucunClick = this.kucunClick.bind(this);
        this.searchField = xt.getQuerySearch();
		var that = this;
		this.columns = [{
			title : I18n.t(400048/*单据编号*/),
			dataIndex : 'no',
			key : "no",
			width : '10%',
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>);
			}
		},{
			title : I18n.t(100379/*产品*/),
			dataIndex : "mtl"+language,
			key : "department",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title :  I18n.t(100382/*产品规格*/),
			dataIndex : "basSpeci",
			key : "basSpeci",
			width : "30%",
			render(data,row,index){
				return (<div title={data} className={'text-ellipsis'}>{data}</div>);
			}
		},{
			title :  I18n.t(400038/*送达仓库*/),
			dataIndex : "receSl"+language,
			key : "receSl"+language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100319/*采购数量*/),
			dataIndex : "purQty",
			key : "purQty",
			width : "10%",
			className:"text-right",
			render(data,row,index){
				if(data){
					return (<div>{data} { row.uomEnName}</div>)
				}
			}
		},{
			title : I18n.t(400037/*采购员*/),
			dataIndex : "purStaff"+language,
			key : "purStaff"+language,
			width : "10%",
			className:'text-center',
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(400008/*销售单号*/),
			dataIndex : "sourceNo",
			key : "sourceNo",
			width : "12%",
			render(data,row,index){
				return <div onClick={that.numDetailHandle.bind(this,data)} className="text-ellipsis mail-hover">{data}</div>;
			}
		},{
			title :I18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "10%",
			render(data,row,index){
				
				return (<div className="text-ellipsis" title={data}>
						<i className='foddingicon fooding-look' onClick={that.handleClick.bind(that,row)} title={i18n.t(200560/*查看*/)} style={{paddingRight:20,}}></i>
						<i className="foddingicon fooding-transport-message" onClick={hrefFunc.bind(that,I18n.t(600164/*出运信息*/),`/print/single?single=messagePurchase&billId=${row['sourceId']}`)} title={I18n.t(600164/*出运信息*/)} style={{paddingRight:20,}}></i>
						<i className='foddingicon fooding-stockinformation' onClick={that.kucunClick.bind(that,row)} title={'库存信息'} ></i>
					</div>)
			}
		}];

		this.state = {
			scrollHeight:0,
			rodalShow:false,
			buttonLeft:i18n.t(100429/*保存并关闭*/),
			showSaveClose:true,
			contentTemplate:<div></div>,
			checkedRows:[],
			choised:false,
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条
			data:[]
		}
	}
	//请求列表  list
	getPage(currentPage,objValue){
		let that = this;
		var sID = sID || '';
		let currentP = currentPage||1;
		let object=Object.assign({},{orderType:30, pageSize: this.state.pageSize, currentPage: currentP},that.normalRef.getForm(),that.searchField);
		apiGet(API_FOODING_ERP,'/purorder/getPage',object,
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
    searchCustomer = ()=> {
        this.searchField = null;
        this.getPage();

    };
	handleClick(data,e){
		let content=require('./Require').default;
        let element=React.createElement(content,{onCancel:this.onCancel,data:data});
        this.setState({
            rodalShow : true,
            dilogTelmp: element,
            showHeader:false
        })
	}
	kucunClick(data,e){
		//查看库存
		let content=require('./kucun').default;
        let element=React.createElement(content,{onCancel:this.onCancel,data:data});
        this.setState({
            rodalShow : true,
            dilogTelmp: element,
            title: i18n.t(500329/*库存状态*/),
            showHeader:true
        })
	}
	deleteClick = () => {
		let that = this;
		let numArr = that.refs.prustock.getSelectArr(),billId;
		if(!numArr.length){
			ServiceTips({text:I18n.t(100394/*请选择数据！*/),type:"error"});
			return false;
		}
		billId = numArr[0].billId;
		Confirm(I18n.t(100433/*删除后将无法恢复，您确定删除吗？*/), {
		  done: () => {
			    apiForm(API_FOODING_ERP,'/purorder/delete',{billId: billId},
					(response)=>{							
						ServiceTips({text:response.message,type:'sucess'});
						that.getPage();
					},(error)=>{
						ServiceTips({text:error.message,type:'error'});
				});
			},
			close:() => {
				console.log('no, close')
			}
		});
	}
	// 销售单号 查看详情
	numDetailHandle = (num)=>{
		let that = this;
		this.setState({
			rodalShow: true,
			title: I18n.t(400008/*销售单号*/) + i18n.t(500281/*执行情况*/),
			dilogTelmp: React.createElement(require('../../BookNeed/components/sourceNoDetail').default,{onCancel:that.onCancel,num:num})
		});
	}
	onCancel(that){
		this.setState({
			rodalShow:false
		})
	}

	handleResize(e,height){
		this.filterHeight = height || this.filterHeight || 50;
		 let sch = document.body.offsetHeight - this.filterHeight - 92;
         let scroll = sch - 90;
		 this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
		this.getPage();		
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	render(){
		const commonForm = this.state.dilogTelmp;
		let {page,currentPage} =this.state;
		return(<div>
			<FilterHeader  getPage ={this.searchCustomer} expandFilter= {this.handleResize}  normalRef={no => this.normalRef = no} />
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<FunctionKeys deleteClick={this.deleteClick}/>
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
						ref="prustock"
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						singleSelect={true}
					/>
					<Dialog width={926} visible={this.state.rodalShow} title={this.state.title} showHeader ={this.state.showHeader}>
						{commonForm}
					</Dialog>
				</div>
			</div>
		</div>
		</div>
	)
	}
}
export default NavConnect(PurStock);

