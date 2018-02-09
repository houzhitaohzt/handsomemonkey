import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../../components/Form";
import {toDecimal} from '../../../../../services/apiCall';
//引入弹层

import {I18n} from '../../../../../lib/i18n';
//引入table
const {Table} = require("../../../../../components/Table");

class OrderProDetail extends Component{
	constructor(props){
		super(props)
		this.columns_party = [{
			title : I18n.t(100379/*产品*/),
			dataIndex : "mtlLcName",
			key : "mtlLcName",
			width : "15%",
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>);
			}
		},{
			title : I18n.t(100382/*产品规格*/),
			dataIndex : 'basSpeci',
			key : "basSpeci",
			width : '20%',
			render(data,row,index){
				return (<div className="text-ellipsis" title={data}>{data}</div>)
			}
		},{
			title : I18n.t(500067/*包装*/),
			dataIndex : "packagLcName",
			key : "packagLcName",
			width : "12%",
			render(data,row,index){
				return data;
			}
		},{
			title :I18n.t(400117/*原采购数量*/),
			dataIndex : "purQty",
			key : "purQty",
			width : "8%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(400118/*调整后数量*/),
			dataIndex : "adjustQty",
			key : "adjustQty",
			width : "8%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(400035/*产品单位*/),
			dataIndex : "uomLcName",
			key : "uomLcName",
			width : "8%",
			render(data,row,index){
				return data;
			}
		},{
			title : I18n.t(400119/*原采购单价*/),
			dataIndex : "purTaxPrc",
			key : "purTaxPrc",
			width : "8%",
			render(data,row,index){
				return (<div>{data?toDecimal(data):''}</div>);
			}
		},{
			title : I18n.t(400120/*调整后单价*/),
			dataIndex : "adjustPrc",
			key : "adjustPrc",
			width : "8%",
			render(data,row,index){
				return (<div>{data?toDecimal(data):''}</div>);
			}
		},{
			title : I18n.t(500129/*源单编号*/),
			dataIndex : "sourceNo",
			key : "sourceNo",
			width : "12%",
			render(data,row,index){
				return data;
			}
		}];
	}

	static propTypes={
		data: PropTypes.object,
		form: PropTypes.object
	}
	static defaultProps={

	}
	/*initState(){
		return {
			orderProDate:[]
		}
	}
	initOrderPro = billId =>　{
		if(!billId) return;
		apiGet(API_FOODING_ERP,'/puradjust/getList',{purId:billId}, response => {
			this.setState({orderProDate:response.data || ""})
		},error => ServiceTips({text:error.message,type:'error'}))
	}
	componentDidMount(){
		this.initOrderPro(this.props.billId);
	}
	componentWillReceiveProps(nextProps){
		if(this.props.billId !== nextProps.billId){
			this.initOrderPro(nextProps.billId);
		}
  	}*/
	render(){
		const {valueone} = this.props;
		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span>{I18n.t(500077/*订单产品*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<Table
						columns={this.columns_party}
						data={valueone.mtls || []}
						checkboxConfig={{show:false}}
						colorFilterConfig={{show:false}}
						followConfig={{show:false}}
						// prefixCls={"rc-confirm-table"}
					/>
				</div>
			</div>)
	}
}

/*const OrderProductForm = createForm()(OrderProduct);*/

export default OrderProDetail;
