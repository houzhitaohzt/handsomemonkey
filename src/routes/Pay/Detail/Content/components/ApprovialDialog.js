import i18n from './../../../../../lib/i18n';
import React, { Component,PropTypes } from 'react';
import {createForm,FormWrapper} from '../../../../../components/Form';
//引入select插件
import Select, {Option,ConstMiniSelect } from '../../../../../components/Select';
import Radio from '../../../../../components/Radio';
import Confirm from '../../../../../components/Dialog/Confirm';
import DataTime from '../../../../../components/Calendar/Calendar';
import {apiGet, apiPost, apiForm, API_FOODING_ES,API_FOODING_ERP,API_FOODING_DS,pageSize,sizeList,language,toDecimal} from "../../../../../services/apiCall";
import ServiceTips from '../../../../../components/ServiceTips';
import xt from '../../../../../common/xt'; // 下拉
const {Table} = require("../../../../../components/Table");
export class ApprovialDialog extends Component{
	constructor(props){
		super(props);
		let that = this;
		this.state = {
			invoiceList:[]
		}
		this.columns = [{
				title : i18n.t(200589/*付款单号*/),
				dataIndex : "orderNo",
				key : "orderNo",
				width : "12%",
				render(data,row,index){
					return data;
				}
			},{
				title : i18n.t(400056/*采购发票号*/),
				dataIndex : 'invoiceNo',
				key : "invoiceNo",
				width : '10%',
				render(data,row,index){
					return data;
				}
			},{
				title : i18n.t(400055/*纸质发票号*/),
				dataIndex : "paperNo",
				key : "paperNo",
				width : "12%",
				render(data,row,index){
					return data;
				}
			},{
				title : i18n.t(200819/*已付金额*/),
				dataIndex : "orderAmt",
				key : "orderAmt",
				width : "12%",
				render(data,row,index){
					return (<div>{toDecimal(data) + ' ' + that.props.getOne['cnyEnName']}</div>);
				}
			},{
				title : i18n.t(200592/*已开票金额*/),
				dataIndex : "invoiceAmt",
				key : "invoiceAmt",
				width : "10%",
				render(data,row,index){
					return (<div>{toDecimal(data)+ ' ' +that.props.getOne['cnyEnName']}</div>);
				}
			},{
				title : i18n.t(200593/*核销人*/),
				dataIndex : "staffLcName",
				key : "staffLcName",
				width : "8%",
				render(data,row,index){
					return data;
				}
			},{
				title : i18n.t(200594/*核销日期*/),
				dataIndex : "veriDate",
				key : "veriDate",
				width : "14%",
				render(data,row,index){
					if(data){
						return new Date(data).Format('yyyy-MM-dd');
					}
				}
			},{
				title : i18n.t(200098/*操作*/),
				dataIndex : "handle",
				key : "handle",
				width : "8%",
				render(data,row,index){
					return <div><i className='foddingicon fooding-reveser-cancal' onClick={that.handleClick.bind(that,row)} title={i18n.t(200595/*反核销*/)}></i></div>
				}
			}]

	}

	handleClick = (row,e) => {
		Confirm("是否确定反核销？",{
			done:() => {
				apiForm(API_FOODING_ERP,"/invoice/reverifi",{billId:row.billId},response => {
					ServiceTips({text:response.message,type:'success'});
					this.initList();
				},error => ServiceTips({text:error.message,type:"error"}))
			},
			close: () => {

			}
		})
	}

	initList = () => {
		let that = this;
		apiGet(API_FOODING_ERP,'/invoice/getVeriList',{billId:this.props.billId}, response => {
           let invoiceList = response.data ||[];
           that.setState({invoiceList})
        },error => ServiceTips({text:error.message,type:'error'}))
	}

	componentDidMount(){
		this.initList();
	}
	componentWillReceiveProps(nextProps){
		if(this.props.billId !== nextProps.billId){
			this.initList();
		}
	}

	render(){
		let that = this;
		return (
			<FormWrapper showFooter={true} showSaveClose={false} onCancel={this.props.onCancel}>
				<Table
					columns={this.columns}
					data={this.state.invoiceList || []}
					checkboxConfig={{show:false}}
					colorFilterConfig={{show : false,dataIndex:'colorType'}}
					followConfig={{show:false}}
					scroll={{x:true,y:270}}
					style={{width:"100%"}}
				/>
			</FormWrapper>
		)
	}
}
export default ApprovialDialog;
