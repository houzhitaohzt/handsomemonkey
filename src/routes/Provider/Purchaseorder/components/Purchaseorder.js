import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';

import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
import Table from "../../../../components/Table";//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import ButtonConfirm from '../../../../components/button/confirm';//删除弹层

import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
export class Order extends Component {
    constructor (props) {
        super(props);
        props.purchaseorder && props.purchaseorder(this);
        this.columns = [{
			title : i18n.t(500098/*订单状态*/),
			dataIndex : "statusName",
			key : "statusName",
			width : "7%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100325/*订单编号*/),
			dataIndex : 'no',
			key : "no",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(500023/*订单日期*/),
			dataIndex : "billDate",
			key : "billDate",
			width : "10%",
			render(data,row,index){
				if(data){
					return new Date(data).Format('yyyy-MM-dd');
				}
			}
		},{
			title : i18n.t(100379/*产品*/),
			dataIndex : "mtlLcName",
			key : "mtlLcName",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(100382/*产品规格*/),
			dataIndex : "basSpeci",
			key : "basSpeci",
			width : "20%",
			render(data,row,index){
				return (<div className={'text-ellipsis'} title={data}>{data}</div>);
			}
		},{
			title : i18n.t(100319/*采购数量*/),
			dataIndex : "purQty",
			key : "purQty",
			width : "8%",
			render(data,row,index){
				if(data && !row.type){
					return (<div>{data}&nbsp;&nbsp;{row.uomLcName}</div>)
				}
				return "";
			}
		},{
			title : i18n.t(200847/*含税单价*/),
			dataIndex : "purTaxPrc",
			key : "purTaxPrc",
			width : "10%",
			render(data,row,index){
				if(data && !row.type){
					return (<div>{data}&nbsp;&nbsp;{row.cnyLcName}</div>)
				}
				return "";
			}
		},{
			title : i18n.t(400098/*采购总额*/),
			dataIndex : "setTaxAgg",
			key : "setTaxAgg",
			width : "9%",
			render(data,row,index){
				if(data && !row.type){
					return (<div>{data}&nbsp;&nbsp;{row.cnyLcName}</div>)
				}
				return "";
			}
		},{
			title : i18n.t(400011/*销售员*/),
			dataIndex : "needStaffLcName",
			key : "needStaffLcName",
			width : "8%",
			render(data,row,index){
				return data;
			}
		}];
		//this.handleClick = this.handleClick.bind(this);


        this.state = {
			showHeader:true,
			title:'',
			paddingTop:false,
			data: [],
			id:this.props.location.query.id,
			pageSize:pageSize,
			currentPage:1
		};

    }
	addClick = () => {
		let {navAddTab, navRemoveTab} = this.props;
	     navRemoveTab({name:i18n.t(200988/*采购订单编辑*/),component:i18n.t(200988/*采购订单编辑*/),url:'/pruchaseorder/add'});
	     navAddTab({ name: i18n.t(200989/*采购订单新增*/), component: i18n.t(200989/*采购订单新增*/), url: '/pruchaseorder/add'});
	     this.props.router.push({pathname: '/pruchaseorder/add'});
    }

	deleteClick =() => {
		let numArr = this.refs.pruchaseOrder.getSelectArr(),billId;
		if(!numArr.length){
			ServiceTips({text:"请选择数据！",type:"info"});
			return false;
		}
		billId = numArr[0].billId;
		Confirm("删除后将无法恢复,您是否要删除该条数据？", {
		  done: () => {
			    this.deletedFunc(billId);
			},
			close:() => {
				console.log('no, close')
			}
		});
	}
	// 调用删除 ajax 
	deletedFunc = (ID) => {	
		let that = this;
		apiForm(API_FOODING_ERP,'/purorder/delete',{billId: ID},
			(response)=>{							
				ServiceTips({text:response.message,type:'sucess'});
				that.getPages();
			},(error)=>{
				ServiceTips({text:error.message,type:'error'});
		});
	}
	onRowDoubleClick = (record,index,checked) => {    
		 let {navAddTab, navRemoveTab} = this.props;
	     navRemoveTab({name:i18n.t(200990/*采购订单详情*/),component:i18n.t(200990/*采购订单详情*/),url:'/pruchaseorder/detail'});
	     navAddTab({ name: i18n.t(200990/*采购订单详情*/), component: i18n.t(200990/*采购订单详情*/), url: '/pruchaseorder/detail'});
	     this.props.router.push({pathname: '/pruchaseorder/detail',query:{id:record.billId},state: {refresh: true}});    
	}
	//列表初始化
	getPages = (currentPage,objValue) => {
		let that = this;
		var sID = sID || '';
		let currentP = !isNaN(currentPage)?currentPage:1;
		let object=Object.assign({},{isPlatform:true,
		 pageSize: this.state.pageSize,
		 currentPage: currentP,orderType:20,vndBeId:this.state.id});
		apiGet(API_FOODING_ERP,'/purorder/getPage',object,
				(response)=>{
					that.setState({
						data: response.data.data,
						totalPages: response.data.totalPages,
						totalRecords:response.data.totalRecords,
						currentPage: response.data.currentPage
					});
				},(error)=>{
					ServiceTips({text: error.message,type:'error'});
		});
	}
  	handleResize(height){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
  		let padding = this.state.paddingTop ? 173:262;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;

		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
  		if(!this.props.isDetail){
            this.getPages();
		}
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));	
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
		  let id = nextProps.location.query.id; 
		  if(id !== this.props.location.query.id){
			  this.setState({id:id},() => this.getPages())
		  }
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));	
  	}
    render() {
		let  iconArray = [
			{type:'add',onClick:this.addClick},
			{type:'delete',onClick:this.deleteClick}]
			let {page,currentPage} =this.state;
        return (
            <div className="">
				<div className='content-margin'></div>
				<div className={'client-body'} style={{height:this.state.scrollHeight}}>
					<div className={'client-body-single'}>
					  <div className="action-buttons">
						<div className={'key-page'}>
							<ButtonConfirm iconArray ={iconArray}/>
							<Page
							currentPage={this.state.currentPage}
							totalPages={this.state.totalPages}
							totalRecords={this.state.totalRecords}
							sizeList={sizeList}
							currentSize={this.state.pageSize}
							pageSizeChange={(num)=>{
								this.setState({ pageSize: Number.parseInt(num) },()=>this.getPages(currentPage, num));
							}}
							backClick={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPages(num));
							}}
							nextClick={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPages(num));
							}}
							goChange={(num)=>{
								this.setState({ currentPage: Number.parseInt(num) },()=>this.getPages(num));
							}}
						/>
						</div>
						
							<Table
								ref = "pruchaseOrder"
								columns={this.columns}
								data={this.state.data}
								checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
								colorFilterConfig={{show : false,dataIndex:'colorType'}}
								followConfig={{show:false}}
								scroll={{x:true,y:this.state.scroll}}
								onRowDoubleClick={this.onRowDoubleClick}
								singleSelect={true}
							/>
						</div>
					</div>
				</div>
			</div>
        )
    }
}
export default NavConnect(Order);

/*handleClick(e,data,target){
	//右键处理
	if(data.type == 1){
			// 发邮件
			this.editClick(data);

	}else if(data.type == 2){
			// 联络
		this.deleteClick(data);
	}else if(data.type == 3){
			// 约会
		this.setState({
			title:i18n.t(300007*//*编辑失效原因*//*),
			rodalShow : true,
			showHeader:true,
			DialogContent:4
		});
	}else if(data.type == 4){
			// 付款指令
		this.setState({
			title:i18n.t(300007*//*编辑失效原因*//*),
			rodalShow : true,
			showHeader:true,
			DialogContent:4
		});
	}else if(data.type == 5){
			// 入库通知
		this.setState({
			title:i18n.t(300007*//*编辑失效原因*//*),
			rodalShow : true,
			showHeader:true,
			DialogContent:4
		});
	}else if(data.type == 6){
			// 订单调整
		this.setState({
			title:i18n.t(300007*//*编辑失效原因*//*),
			rodalShow : true,
			showHeader:true,
			DialogContent:4
		});
	}else if(data.type == 7){
			// 查看审批
		this.setState({
			title:i18n.t(300007*//*编辑失效原因*//*),
			rodalShow : true,
			showHeader:true,
			DialogContent:4
		});
	}else if(data.type == 8){
			// 跟踪
		this.setState({
			title:i18n.t(300007*//*编辑失效原因*//*),
			rodalShow : true,
			showHeader:true,
			DialogContent:4
		});
	}
}
contextMenuConfig={{
	enable:true,
	contextMenuId:'SIMPLE_TABLE_MENU',
	menuItems:[
		{
			onClick:this.handleClick,
			content:<div><i className={'foddingicon fooding-send-email'}></i>{i18n.t(200256*//*发邮件*//*)}</div>,
			data:{type:1,title:i18n.t(200256*//*发邮件*//*)}
		},
		{
			onClick:this.handleClick,
			content:<div><i className={'foddingicon fooding-contact'}></i>{i18n.t(100588*//*联络*//*)}</div>,
			data:{type:2,title:i18n.t(100588*//*联络*//*)}
		},
		{
			onClick:this.handleClick,
			content:<div><i className={'foddingicon fooding-yuehui'}></i>{i18n.t(100587*//*约会*//*)}</div>,
			data:{type:3,title:i18n.t(100587*//*约会*//*)}
		},{
			onClick:this.handleClick,
			content:<div><i className={'foddingicon fooding-shoukuan'}></i>{i18n.t(200991*//*付款指令*//*)}</div>,
			data:{type:4,title:i18n.t(200991*//*付款指令*//*)}
		},{
			onClick:this.handleClick,
			content:<div><i className={'foddingicon fooding-shoukuan'}></i>{i18n.t(100468*//*入库通知*//*)}</div>,
			data:{type:5,title:i18n.t(100468*//*入库通知*//*)}
		},{
			onClick:this.handleClick,
			content:<div><i className={''}></i>{i18n.t(100469*//*订单调整*//*)}</div>,
			data:{type:6,title:i18n.t(100469*//*订单调整*//*)}
		},{
			onClick:this.handleClick,
			content:<div><i className={'foddingicon fooding-approve'}></i>{i18n.t(100470*//*查看审批*//*)}</div>,
			data:{type:7,title:i18n.t(100470*//*查看审批*//*)}
		},{
			onClick:this.handleClick,
			content:<div><i className={'foddingicon fooding-tail'}></i>{i18n.t(200426*//*跟踪*//*)}</div>,
			data:{type:8,title:i18n.t(200426*//*跟踪*//*)}
		}]
}}*/
