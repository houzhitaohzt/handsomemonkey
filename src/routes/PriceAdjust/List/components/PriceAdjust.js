import i18n from './../../../../lib/i18n';
import React,{Component,PropTypes} from 'react';
import Page from "../../../../components/Page";//分页
import Dialog from '../../../../components/Dialog/Dialog';//弹层
const {Table} = require("../../../../components/Table");//Table表格
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
import {browserHistory} from 'react-router';
import NavConnect from '../../../../components/NavigateTabs/containers/AddContainer';
import FilterHeader from "./FilterHeader";
import {toDecimal} from  '../../../../services/apiCall';
class PriceAdjust extends Component{
	constructor(props){
		super(props);
		this.handleResize = this.handleResize.bind(this);
		this.state=this.initState();
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);
		this.onRowClick=this.onRowClick.bind(this);
		this.onHeaderCellClick=this.onHeaderCellClick.bind(this);
		this.onRowDoubleClick=this.onRowDoubleClick.bind(this);
		this.columns = [{
			title : i18n.t(100323/*业务日期*/),
			dataIndex : "no",
			key : "no",
			width : "8%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400048/*单据编号*/),
			dataIndex : "salesman",
			key : "salesman",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis">{data}</div>);
			}
		},{
			title : i18n.t(100379/*产品*/),
			dataIndex : 'noticeBusinessName',
			key : "noticeBusinessName",
			width : "5%",
			render(data,row ,index){
				return <div>{data}</div>
			}
		},{
			title : i18n.t(400012/*品牌*/),
			dataIndex : "brand",
			key : "brand",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(400054/*采购单号*/),
			dataIndex : "mtlName",
			key : "mtlName",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(400025/*仓库*/),
			dataIndex : 'totalsales',
			key : "totalsales",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(400145/*职员*/),
			dataIndex : 'staffs',
			key : "staffs",
			width : '8%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(400119/*原采购单价*/),
			dataIndex : "oldprice",
			key : "oldprice",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data?toDecimal(data):''}</div>)
			}
		},{
			title : i18n.t(400120/*调整后单价*/),
			dataIndex : "newprice",
			key : "newprice",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data?toDecimal(data):''}</div>)
			}
		},{
			title : i18n.t(400050/*调整数量*/),
			dataIndex : "editamount",
			key : "editamount",
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : i18n.t(200910/*原因*/),
			dataIndex : "ariveDate",
			key : "ariveDate",
			width : "20%",
			render(data,row,index){
				return data;
			}
		
		}];
	}

	initState(){
		return{
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			data:null,
			MeunState:true,
			record:[{'no':'2017-02-27','salesman':'PO1702270001','noticeBusinessName':i18n.t(200911/*黄原胶*/),'brand':i18n.t(200904/*福德牌*/),'mtlName':'PO1702270003','totalsales':i18n.t(200906/*浦东仓库*/),'staffs':'候龙龙','oldprice':'85.47 CNY','newprice':'86.47CNY','editamount':'790MT','ariveDate':'采购价格调整'},
			{'no':'2017-02-27','salesman':'PO1702270003','noticeBusinessName':i18n.t(200911/*黄原胶*/),'brand':i18n.t(200904/*福德牌*/),'mtlName':'PO1702270003','totalsales':i18n.t(200906/*浦东仓库*/),'staffs':'候龙龙','oldprice':'85.47 CNY','newprice':'86.47CNY','editamount':'790MT','ariveDate':'采购价格调整'},
			{'no':'2017-02-27','salesman':'PO1702270003','noticeBusinessName':i18n.t(200911/*黄原胶*/),'brand':i18n.t(200904/*福德牌*/),'mtlName':'PO1702270003','totalsales':i18n.t(200906/*浦东仓库*/),'staffs':'候龙龙','oldprice':'85.47 CNY','newprice':'86.47CNY','editamount':'790MT','ariveDate':'采购价格调整'}]
		}
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
	onHeaderCellClick(e,data){
		let {checkedRows, selectArr} = this.state;
		if(data.checkedAll){
			selectArr=selectArr.concat(this.state.data);
			selectArr = Array.from(new Set(selectArr));
			checkedRows= this.state.data.map((value,index)=>index);
		}else{
			selectArr=[];
			checkedRows=[];
		}
		this.setState({
			selectArr:selectArr,
			checkedRows:checkedRows,
			choised:data.checkedAll
		})
	}
	onRowClick(record,index,checked){
		let {checkedRows, selectArr} = this.state;
		if(checked){
			selectArr.push(record);
			if(checkedRows.indexOf(index)<0){
				checkedRows.push(index);
			}
		}else{
			selectArr.remove(record);
			checkedRows.remove(index);
		}
		this.setState({
			selectArr:selectArr,
			checkedRows:checkedRows
		})
	}
	onRowDoubleClick(record,index,checked){
		let {navAddTab} =this.props;
		navAddTab({id:9,name:i18n.t(200912/*库存价格调整单详情*/),component:i18n.t(200912/*库存价格调整单详情*/),url:'/priceadjust/detail'});
		this.props.router.push('/priceadjust/detail');
	}
	handleResize(height){
		let sch=document.body.offsetHeight-72-height;
        let scroll = sch-140;
		this.setState({scrollHeight:sch+'px',scroll:scroll});
		console.log(scroll);
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize(47));
    };
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize(47));
	}

	render(){
		let {record} = this.state;
		return(<div>
			<FilterHeader />
			<div className={'client-body'} style={{height:this.state.scrollHeight}}>
				<div className={'client-body-single'}>
				 <div className='action-buttons'>
					<div className={'key-page'}>
						<Page totalPages={10} />
					</div>
					<Table
						data={record}
						columns={this.columns}
						checkboxConfig={{show:true,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						colorFilterConfig={{show : false,dataIndex:'colorType'}}
						followConfig={{show:false}}
						scroll={{x:true,y:this.state.scroll}}
						onHeaderCellClick={this.onHeaderCellClick}
						onRowClick={this.onRowClick}
						onRowDoubleClick={this.onRowDoubleClick}
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
export default NavConnect(PriceAdjust);

