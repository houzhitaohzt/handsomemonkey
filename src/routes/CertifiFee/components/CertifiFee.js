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

import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language} from "../../../services/apiCall";
import ServiceTips from '../../../components/ServiceTips';
class SalesOrderList extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.addClick=this.addClick.bind(this);
		this.partyClick=this.partyClick.bind(this);
		this.deleteClick=this.deleteClick.bind(this);
		this.priceClick=this.priceClick.bind(this);
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.copyClick=this.copyClick.bind(this);
		this.columns = [{
			title : i18n.t(400008/*销售单号*/),
			dataIndex : 'saleNo',
			key : "saleNo",
			width : '5%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(200311/*订舱单号*/),
			dataIndex : "shippingOrderNo",
			key : "shippingOrderNo",
			width : "12%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(500070/*证书名称*/),
			dataIndex : "card"+language,
			key : "card"+language,
			width : "8%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200326/*认证单位*/),
			dataIndex : "cerBe"+language,
			key : "cerBe"+language,
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(200330/*出证单位*/),
			dataIndex : 'cardBe'+language,
			key : "cardBe"+language,
			width : "8%",
			render(data,row ,index){
				return data;
			}
		},{
			title : i18n.t(500050/*付款企业*/),
			dataIndex : "payCc"+language,
			key : "payCc"+language,
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(200320/*收款机构*/),
			dataIndex : 'recBe'+language,
			key : 'recBe'+language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400134/*相关产品*/),
			dataIndex : 'mtl'+language,
			key : "mtl"+language,
			width : "5%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200321/*实际金额*/),
			dataIndex : 'actAgg',
			key : "actAgg",
			width : "12%",
			render(data,row,index){
				return <div>{data?data+' '+row["cny"+language]:''}</div>;
			}
		},{
			title : i18n.t(100145/*创建时间*/),
			dataIndex : 'createDate',
			key : "createDate",
			width : "5%",
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		}];
		this.getPage = this.getPage.bind(this);
	}

	initState(){
		return{
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:[],
			MeunState:true,
			currentPage:1,
            pageSize:pageSize
		}
	}
	addClick(){
        //付款申请
        let numArr = this.refs.mainTab.getSelectArr();
        let array = [];
        for(var i =0;i<numArr.length;i++){
            array.push(numArr[i].billDtlId);
        }
        if(numArr.length > 0){
            Confirm("您确定要执行付款申请吗？", {
              done: () => {
                    apiForm(API_FOODING_ERP,'/shipping/card/payApply',{ids:array.join(',')},(response)=>{
                            this.getPage();
                            ServiceTips({text:response.message,type:'sucess'});
                    },(error)=>{
                            ServiceTips({text:error.message,type:'error'});
                    })
                },
                close:() => {
                    console.log('no, close')
                }
            });
        }else{
        	 ServiceTips({text:i18n.t(200328/*请选择一条数据进行操作*/),type:'error'});
        }
		// let {navAddTab} =this.props;
		// navAddTab({id:7,name:'市场活动新增',component:'市场活动新增',url:'/marke/addEidt'});
		// this.props.router.push('/marke/addEidt');
	}
	partyClick(){
		// let content=require('./ProductParty').default;
		// let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel});
		  //   	this.setState({
		  //   		showDilaog : true,
		  //   		title: '新增 - 平台引入',
		  //   		dialogContent: element
		  //   	})
	}
	deleteClick(){
		let numArr = this.refs.mainTab.getSelectArr();
         let array = [];
        for(var i =0;i<numArr.length;i++){
            array.push(numArr[i].billDtlId);
        }
        if(numArr.length > 0){
        	Confirm("您确定要执行报销吗？", {
			  done: () => {
				    apiForm(API_FOODING_ERP,'/shipping/card/reimburse',{ids:array.join(',')},(response)=>{
		    				this.getPage();
		    				ServiceTips({text:response.message,type:'sucess'});
		    		},(error)=>{
		    				ServiceTips({text:error.message,type:'error'});
		    		})
				},
				close:() => {
					console.log('no, close')
				}
			});
        }else{
        	ServiceTips({text:i18n.t(200328/*请选择一条数据进行操作*/),type:'error'});
        }
	}
	priceClick(){
		// let numArr = this.state.selectArr;
		  //   	let tempString;
		  //   	let num = numArr.length;
		  //   	if(numArr.length === 0) tempString = "自动报价";
		  //   	if(numArr.length === 1) tempString = "自动报价-"+ numArr;
		  //   	if(numArr.length > 1) tempString = "已选择"+numArr.length+"个客户";
				// 	let content=require('./Productprice').default;
				// 	let element=React.createElement(content,{onSaveAndClose:this.onSaveAndClose,onCancel:this.onCancel,num:num});
		  //   	this.setState({
		  //   		showDilaog : true,
		  //   		title: tempString,
		  //   		dialogContent: element
		  //   	})
	}
	// ajax list
	getPage(sID){
		    let that = this;
			let object=Object.assign({},{pageSize: this.state.pageSize, currentPage: this.state.currentPage},this.normalRef.getForm());
			apiGet(API_FOODING_ERP,'/shipping/card/getPage',object,
				(response)=>{	
					that.setState({	
						data: response.data.data,
						totalPages: response.data.totalPages,
						currentPage: response.data.currentPage 	
					});
				},(errors)=>{
			});
		
		
	}
	onSaveAndClose(){
		this.setState({
			showDilaog:!this.state.showDilaog
		})
	}
	onCancel(){
		this.setState({
			showDilaog:false
		})
	}
	copyClick(){
		console.log('copyClick')
	}
	handleResize(e, height) {
		 this.filterHeight = height || this.filterHeight || 50;
        let scroll = document.body.offsetHeight - 170 - this.filterHeight;
        this.setState({scroll: scroll});
	}
	componentDidMount(){
		this.getPage();
		window.addEventListener('resize', this.handleResize(47));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	render(){
		let {data} = this.state;
		let meun;
		let that = this;
		return(<div>
			<FilterHeader  getPage = {this.getPage} 
			normalRef={no => this.normalRef = no}
			expandFilter={this.handleResize}
			/>
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				  <div className ='action-buttons'>
					<div className={'key-page'}>
						<FunctionKeys 
                        addClick={this.addClick}
                         deleteClick={this.deleteClick}/>
						<Page 
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages} 
							sizeList={sizeList}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								that.setState({ pageSize: Number.parseInt(num),currentPage:1 },()=>that.getPage());
							}} 
							backClick={(num)=>{
								that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());
							}} 
							nextClick={(num)=>{
								that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());										
							}}
							goChange={(num)=>{
								that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());																				
							}}								
						/>
					</div>
					<Table
						columns={this.columns} ref = "mainTab"
						data={data}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						scroll={{x:true,y:this.state.scroll}}
					/>
					<Dialog width={926} visible={this.state.showDilaog} title={this.state.title}>
						{this.state.dialogContent}
					</Dialog>
				</div>
				</div>
			</div>
		</div>)
	}
}
export default NavConnect(SalesOrderList);

