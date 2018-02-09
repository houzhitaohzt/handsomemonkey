import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../components/Form";
//引入弹层
import Dialog from '../../../../components/Dialog/Dialog';
import Confirm from '../../../../components/Dialog/Confirm';//删除弹层
//引入select插件
import Select, { Option } from '../../../../components/Select';
//引入table
import Table from "../../../../components/Table";
//引入分页
import Page from "../../../../components/Page";
//tab切换
import TabSwitch from "../../../../components/TabSwitch";
import ProductListOne from "./ProductListOne";
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,language,pageSize,sizeList} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';

import {I18n} from '../../../../lib/I18n';
class Record extends Component{
	constructor(props){
		super(props)
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
		var that = this;
	}
	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object,
		onCancel: PropTypes.func,
	}
	initState(){
		let that = this;
		return {
		titleArray:[],//遍历唛头标签
		
		columns_voucher:[{
			title : I18n.t(400025/*仓库*/),
			dataIndex : 'orderNo',
			key : "orderNo",
			width : '8%',
			render(data,row,index){
				return <div title={data} className={'text-ellipsis'}>{data}</div>;
			}
		},{
			title : I18n.t(400026/*库区*/),
			dataIndex : "salBe"+language,
			key : "salBe"+language,
			width : "8%",
			render(data,row,index){
				return <div title={data} className={'text-ellipsis'}>{data}</div>;
			}
		},{
			title : I18n.t(400027/*储位*/),
			dataIndex : "orderAmt",
			key : "orderAmt",
			width : "8%",
			render(data,row,index){
				return <div title={data} className={'text-ellipsis'}>{data}</div>;
			}
		},{
			title : I18n.t(400028/*原供应商*/),
			dataIndex : "exchgRate111",
			key : "exchgRate111",
			width : "8%",
			render(data,row,index){
				return <div title={data} className={'text-ellipsis'}>{data}</div>;
			}
		},{
			title : I18n.t(400029/*过期日期*/),
			dataIndex : "exchgRateww",
			key : "exchgRateww",
			width : "6%",
			render(data,row,index){
				return <div title={data} className={'text-ellipsis'}>{data}</div>;
			}
		},{
			title : I18n.t(400030/*物料状态*/),
			dataIndex : "saleStaff13"+language,
			key : "saleStaff13"+language,
			width : "5%",
			render(data,row,index){
				return <div title={data} className={'text-ellipsis'}>{data}</div>;
			}
		},{
			title : I18n.t(400031/*库存数量*/),
			dataIndex : "saleStaff1"+language,
			key : "saleStaff1"+language,
			width : "5%",
			render(data,row,index){
				return <div title={data} className={'text-ellipsis'}>{data}</div>;
			}
		},{
			title : I18n.t(500163/*出库数量*/),
			dataIndex : "saleStaff"+language,
			key : "saleStaff"+language,
			width : "5%",
			render(data,row,index){
				return <div title={data} className={'text-ellipsis'}>{data}</div>;
			}
		}],

		billreqirListData:[],//单据


		}
	}
	componentDidMount(){
		let {data} = this.props;
		this.getTableInitData(data.billId);
	}
	componentWillReceiveProps(nextProps){
		if((nextProps.data && nextProps.data.billId) && nextProps.data.billId !== this.props.billId)
			this.getTableInitData(nextProps.data.billId);
	}
	getTableInitData = billId => {
		if( !billId) return;
		//单据要求初始化
		apiGet(API_FOODING_ERP,'/purorder/getBillreqirList',{billId:billId},response => {
			this.setState({billreqirListData:response.data})
		},error => ServiceTips({text:error.message,type:'error'}))

	}


	onCancel = () => this.props.onCancel();

	render(){
		const {form,data} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		let TabSwitchArray = [
			{title:I18n.t(200180/*库存*/),content:<ProductListOne onCancel={this.onCancel} data={this.state.billreqirListData} columns={this.state.columns_voucher}/>},
		];

		
		return <TabSwitch TabSwitchArray={TabSwitchArray}/>;
	}
}

Record = createForm()(Record);

export default Record;
