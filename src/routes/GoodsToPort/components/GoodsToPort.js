import React,{Component,PropTypes} from 'react';

import Page from "../../../components/Page";//分页
import Dialog from '../../../components/Dialog/Dialog';//弹层
import Table from "../../../components/Table";//Table表格
import Confirm from '../../../components/Dialog/Confirm';//删除弹层

import {browserHistory} from 'react-router';
import NavConnect from '../../../components/NavigateTabs/containers/AddContainer';

import FilterHeader from "./FilterHeader";



// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips';
import {I18n} from "../../../lib/i18n";



class GoodsToPort extends Component{
	constructor(props){
		super(props);
		let that = this;
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.searchField = xt.getQuerySearch();
		// init func
		this.getPage = this.getPage.bind(this);


		this.columns = [{
			title : I18n.t(600027/*最后到货日期*/),
			dataIndex : 'lastSentDate',
			key : "lastSentDate",
			width : '6%',
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : I18n.t(400008/*销售单号*/),
			dataIndex : "sourceNo",
			key : "sourceNo",
			width : "6%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(400011/*销售员*/),
			dataIndex : "saleStaff"+language,
			key : "saleStaff"+language,
			width : "6%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(100379/*产品*/),
			dataIndex : "mtl"+language,
			key : "mtl"+language,
			width : "30%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(600028/*发货数量*/),
			dataIndex : "sOrderQty",
			key : "sOrderQty",
			width : "6%",
			render(data,row,index){
				return (data || 0) + ' ' + row['uom'+language];
			}
		},{
			title : I18n.t(600029/*执行状态*/),
			dataIndex : "statusDtlName",
			key : "statusDtlName",
			width : "5%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(200098/*操作*/),
			dataIndex : "operate",
			key : "operate",
			width : "7%",
			render(data,row,index){

			return  row['statusDtl'] == 20 ? 
					''
					:
					<div className={'table-last-keys'} key={index}>
						{ permissionsBtn('goodstoport.receipt') ? <button className={'btn btn-info btn-xs'} onClick={that.receiveClick.bind(that,row)}>{I18n.t(600030/*收货*/)}</button> : ''}
						&nbsp;&nbsp;&nbsp;
						{ permissionsBtn('goodstoport.freceipt') ? <button className={'btn btn-primary btn-xs'} onClick={that.completeClick.bind(that,row)}>{I18n.t(600031/*收货完成*/)}</button> : ''}
					</div>
			}
		}];
	}

	initState(){
		return{
			scrollHeight:0,
			data:null,
			//data: [{'number':'PO170287988','salenumber':'SO017wieru','buyer':'霍立鑫','provider':'衡阳市裕华进出口有限公司','product':'碳酸氢钠','buyercounts':'48MT','receivedcounts':'8','status':'执行中'},{'number':'PO170287988','salenumber':'SO017wieru','buyer':'霍立鑫','provider':'衡阳市裕华进出口有限公司','product':'碳酸氢钠','buyercounts':'48MT','receivedcounts':'8','status':'执行中'},{'number':'PO170287988','salenumber':'SO017wieru','buyer':'霍立鑫','provider':'衡阳市裕华进出口有限公司','product':'碳酸氢钠','buyercounts':'48MT','receivedcounts':'8','status':'执行中'}],
			data:[],
			initData: [], // 初始化 数据
			currentPage:1, // 当前页
			pageSize: pageSize, // 每页 多少条
			billId: '',	
			ccId: '',
			sData:{},
			sourceNo:this.props.location.query.sourceNo
		}
	}

	componentDidMount(){
		window.addEventListener('resize', this.handleResize(0));
		this.getPage();
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(0));
	}

	onSaveAndClose(){
		this.setState({
			showDilaog:!this.state.showDilaog
		});
		this.getPage();
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}

	// 收货
	receiveClick(data){

		let that = this;
		let {currentPage} = this.state;
		let content=require('./GoodstoPortDialog').default;
		let element=React.createElement(content,{currentPage:currentPage,getPage:that.getPage,onSaveAndClose:that.onSaveAndClose,onCancel:that.onCancel,checkedData:data});
    	this.setState({
    		showDilaog : true,
    		title: I18n.t(600030/*收货*/),	
    		dialogContent: element
    	})
	}

	// 收货完成 
	completeClick(data){
		let that = this;
		let {currentPage} = this.state;		
		let content=require('./Over').default;
		let element=React.createElement(content,{currentPage:currentPage,getPage:that.getPage,onSaveAndClose:that.onSaveAndClose,onCancel:that.onCancel,checkedData:data});
    	this.setState({
    		showDilaog : true,
    		title: I18n.t(600031/*收货完成*/),
    		dialogContent: element
    	})
	}
	handleResize(height){
		let sch=document.body.offsetHeight-150-height;
        let scroll = sch-80;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
		console.log(scroll);
	}


	// 页面 刷新
	// getPage(sData=null){
    //
	// 	let that = this;
     //    let currentP = currentPage||1;
	// 	if(sData){
	// 		this.setState({sData:sData,currentPage:1},function(){
	// 			ajax();
	// 		});
	// 	} else{
	// 		ajax();
	// 	}
	//
	// 	// 保存 请求
	// 	function ajax(){
	// 		let params=Object.assign({},{receiptPage:1,pageSize: that.state.pageSize, currentPage: currentP,sourceNo:that.state.sourceNo},that.state.sData,that.searchField)
	// 		apiGet(API_FOODING_ERP,'/shipping/getGoodsList',params,
	// 			(response)=>{
	// 				that.setState({
	// 					data: response.data.data || [],
	// 					totalPages: response.data.totalPages,
	// 					currentPage: response.data.currentPage
	// 				});
	// 			},(errors)=>{
	// 				ServiceTips({text:errors.message,type:'error'});
	// 		});
	// 	}
	// }
    getPage(currentPage,objValue){
        let that = this;
        var sID = sID || '';
        let currentP = currentPage||1;
        let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: currentP,sourceNo:that.state.sourceNo},that.normalRef.getForm(),that.searchField,);
        apiGet(API_FOODING_ERP,'/shipping/getGoodsList',object,
            (response)=>{
                that.setState({
                    data: response.data.data || [],
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
	render(){

		let that = this;
		let {record} = this.state;
		return(<div>
			<FilterHeader getPage={this.searchCustomer} expandFilter={this.handleResize} normalRef={no => this.normalRef = no}/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className="action-buttons">
					<div className={'key-page'}>
						<Page 
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages} 
							sizeList={sizeList}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								that.setState({ pageSize: Number.parseInt(num),currentPage:1 },()=>that.getPage());
							}} 
							backClick={(num)=>{
								that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage(num));
							}} 
							nextClick={(num)=>{
								that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage(num));										
							}}
							goChange={(num)=>{
								that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage(num));																				
							}}								
						/>
					</div>
					
					<Table
						ref = "product"
						columns={this.columns}
						data={this.state.data}
						checkboxConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
					/>
					<Dialog width={1200} visible={this.state.showDilaog} title={this.state.title}
						
					>
						{this.state.dialogContent}
					</Dialog>
					</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(GoodsToPort);

