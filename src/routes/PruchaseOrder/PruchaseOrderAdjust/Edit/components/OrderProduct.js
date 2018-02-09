import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../../components/Form";
//引入弹层
import Dialog from '../../../../../components/Dialog/Dialog';
//引入select插件
import Select, {Option, ConstMiniSelect } from '../../../../../components/Select';
import Radio from "../../../../../components/Radio";
import {I18n} from '../../../../../lib/i18n';
import {toDecimal} from '../../../../../services/apiCall';
//引入table
const {Table} = require("../../../../../components/Table");

class OrderProduct extends Component{
	constructor(props){
		super(props)
		this.state=this.initState();
		this.columns_party = [{
			title : I18n.t(100379/*产品*/),
			dataIndex : "mtlLcName",
			key : "mtlLcName",
			width : "12%",
            tooltip(data,record,index){
                return record.mtlEnName || "";
            },
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
			title :  I18n.t(500067/*包装*/),
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
			title :  I18n.t(400118/*调整后数量*/),
			dataIndex : "adjustQty",
			key : "adjustQty",
			width : "8%",
			ignore_equals: true,
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
			title :I18n.t(400120/*调整后单价*/),
			dataIndex : "adjustPrc",
			key : "adjustPrc",
			width : "8%",
			ignore_equals: true,
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
	initState(){
		return {

		}
	}
	componentDidMount(){

	}
	componentWillReceiveProps(nextProps){

  	}
	render(){
		const {form,valueone } = this.props;
		let orderProDate = valueone.mtls || [];
		const { getFieldProps, getFieldValue, getFieldError, getNFieldProps} = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let array = [];
			for(var i= 0 ;i< orderProDate.length;i++){
				getFieldProps('mtlInfo['+i+'].billDtlId', {
							            	validateFirst: true,
						                    initialValue: orderProDate[i].billDtlId,
				})
				let obj = Object.assign({},orderProDate[i],{
					adjustQty:<input type="text" disabled={!!orderProDate[i].sourceNo} style={{width:'100%'}} className="text-input-nowidth"
					{...getFieldProps('mtlInfo['+i+'].adjustQty',{
																initialValue:orderProDate[i].adjustQty || ""})}
					/>,
					adjustPrc:<input type="text" style={{width:'100%'}} className="text-input-nowidth"
					{...getFieldProps('mtlInfo['+i+'].adjustPrc',{
																initialValue:orderProDate[i].adjustPrc || ""})}
					/>,
				});
				array.push(obj);
			}

		return(<div className={'addnormal'} style={{marginBottom:'10px'}}>
				<div className={'addnormal-title'}>
					<span>{I18n.t(500077/*订单产品*/)}</span>
				</div>
				<div className={'  girdlayout'}>
					<Table
						columns={this.columns_party}
						data={array}
						checkboxConfig={{show:false}}
						colorFilterConfig={{show:false}}
						followConfig={{show:false}}
						// prefixCls={"rc-confirm-table"}
						scroll={{x:false, y:210}}
					/>
				</div>
			</div>)
	}
}

// const OrderProductForm = createForm()(OrderProduct);

export default OrderProduct;
