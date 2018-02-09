import i18n from './../../lib/i18n';
/*
	create by houzhitao
	采购发票
*/
import React, {Component, PropTypes} from "react";
import {createForm,FormWrapper} from "../../components/Form";
import Table from "../../components/Table";//Table表格
import Calendar from  '../../components/Calendar/Calendar';
import Select, {Option,ConstMiniSelect} from '../../components/Select';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,language} from '../../services/apiCall';
import ServiceTips from '../../components/ServiceTips';
import NavConnect from '../../components/NavigateTabs/containers/AddContainer';
const calculatePrice = (array,billId,newTaxAgg,pre) => {
	let newArray = [];
	if(!billId) return newArray;
	for(let i = 0; i < array.length; i++){
		if(array[i].billId === billId){
			array[i].setTaxAgg = newTaxAgg * pre;
		}
		newArray.push(array[i]);
	}
	return newArray;
}

class PurchaseInvoiceDialog extends Component{
	constructor(props){
		super(props)
		let that = this;
		this.state = {
			invoiceList:[],
			valueone:[],
			visibil:{} 
		}
	}
	onCancel = () => {
		let {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	onSaveAndClose = () => {
		let {onSaveAndClose, form} = this.props;
		form.validateFields((errors, value) => {
			if(errors){

			}else{
				let valueone = Object.assign({},value,{billId:this.props.getOne.billId});
				apiPost(API_FOODING_ERP,"/saleorder/invoice",valueone,response => {
					ServiceTips({text:response.message,type:"success"});
					let {navAddTab,navRemoveTab} =this.props;
					navAddTab({name:i18n.t(201044/*销售发票详情*/),component:i18n.t(201044/*销售发票详情*/),url:'/saleinvoice/detail'});
					this.props.router.push({pathname:'/saleinvoice/detail',query:{id:response.data}});
				},error => ServiceTips({text:error.message,type:"error"}))
			}
		})
	}
	//初始化数据
	getTableInitData = (billId) => {
		if( !billId) return;
		//单据要求初始化
		apiGet(API_FOODING_ERP,'/saleorder/mtl/getList',{billId:billId},response => {
			this.setState({invoiceList:response.data || []})
		},error => ServiceTips({text:error.message,type:'error'}))
	}
	componentDidMount(){
		let {billId,billType} = this.props.getOne;
		this.getTableInitData(billId);
		apiGet(API_FOODING_ERP,'/invoice/dtl/getCount',{billId:billId,billType:billType},
			(response)=>{
					this.setState({
						visibil:response.data||{}
					});
			},(error)=>{

			});
	}
	render(){
		const { getFieldProps, getFieldError, getNFieldProps,getFieldValue} = this.props.form;
		let array = [];
		let that = this;
		let {visibil} = this.state;
		for(var i= 0 ;i < this.state.invoiceList.length;i++){
		}
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
			<div className={'girdlayout scroll'} style={{height:"344px"}}>
				<div className={'row'}>
					<div className="form-group col-md-4 col-lg-4">
	                   <label className={'col-md-4 col-lg-4'}><span>*</span>{i18n.t(400055/*纸质发票号*/)}</label>
						<input type='text' {...getFieldProps('paperNo', {
								validateFirst: true,
								rules: [{required:true}],
                                initialValue:''
                            })} className ={getFieldError('paperNo')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}/>	                            
					</div>
					<div className="form-group col-md-4 col-lg-4">
	                   <label className={'col-md-4 col-lg-4'}>{i18n.t(400065/*开票日期*/)}</label>
	                   <div className={'col-md-8 col-lg-8 dateTime'}>
	                   		<Calendar 
								width={'100%'}  
								showTime = {false} 
								isShowIcon={true} 
								form={this.props.form}
								validate={true}
								name={'billdate'}
							/>
	                   </div>	                            
					</div>
				</div>	
				<Table
					columns={[{
						title : i18n.t(100379/*产品*/),
						dataIndex : 'mtl'+language,
						key : 'mtl'+language,
						width : '11%',
						render(data,row,index){
							return (<div title={data}>{data}</div>)
						}
					},{
						title : i18n.t(100382/*产品规格*/),
						dataIndex : "basSpeci",
						key : "basSpeci",
						width : "10%",
						render(data,row,index){
							return <div>{data}</div>;
						}
					},{
						title : i18n.t(400062/*开票数量*/),
						dataIndex :"purQty",
						key :"purQty",
						width : "6%",
						ignore_equals: true,
						render(data,row,index){
							getFieldProps('dtls['+index.index+'].id', {
													    initialValue:row.billDtlId
							})
							let validate = (rule, value, callback) => {
								if((parseFloat(value)) <= visibil[row.billDtlId] && parseFloat(value) >= 0){
								   callback([]);
								} else callback([i18n.t(400102/*数量不能大于*/) + visibil[row.billDtlId]]);
							};
							return (<input placeholder=''
												 type="text" {...getFieldProps('dtls['+index.index+'].nums', {
														rules: [{required:true},validate],
													    initialValue:visibil[row.billDtlId]?visibil[row.billDtlId]:''
												})} 
												className={getFieldError('dtls['+index.index+'].nums')?'text-input error-border':'text-input'}
												style ={{width:'100%'}} 
							/>);
						}
					},{
						title : i18n.t(400035/*产品单位*/),
						dataIndex : "uom"+language,
						key : "uom"+language,
						width : "6%",
						render(data,row ,index){
							return data;
						}
					},{
						title : i18n.t(201043/*销售单价含税*/),
						dataIndex : 'salTaxPrc',
						key : "salTaxPrc",
						width : "10%",
						ignore_equals: true,
						render(data,row ,index){
							return <div>{data?(data+' '+(that.props.getOne["cny"+language] || "")):''}</div>;
						}},{
						title : i18n.t(400064/*开票金额小计*/),
						dataIndex : 'setTaxAgg',
						key : "setTaxAgg",
						width : "10%",
                        ignore_equals: true,
						render(data,row ,index){
							return <div>{getFieldValue('dtls['+index.index+'].nums')?
									parseFloat(getFieldValue('dtls['+index.index+'].nums'))*row.salTaxPrc+' '+that.props.getOne["cny"+language]:data+' '+that.props.getOne["cny"+language]}</div>
						}
					}]}
					data={this.state.invoiceList||[]}
					checkboxConfig={{show:false}}
					colorFilterConfig={{show : false,dataIndex:'colorType'}}
					followConfig={{show:false}}
				/>
			</div>
			</FormWrapper>);
	}
}
export default createForm()(NavConnect(PurchaseInvoiceDialog));