/*
	create by houzhitao
	采购发票
*/
import React, {Component, PropTypes} from "react";
import {createForm,FormWrapper} from "../../../../components/Form";
import Table from "../../../../components/Table";//Table表格
import Calendar from  '../../../../components/Calendar/Calendar';
import Select, {Option,ConstMiniSelect} from '../../../../components/Select';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,language,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import { I18n } from '../../../../lib/i18n';
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
			valueone:[] ,
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
				if(!this.state.invoiceList.length) return false;
				let dtls = value.dtls,stockoptoutCount = 0,stockoptoutF = [];
				let reg = new RegExp(/^\d+(\.\d+)?$/);
				//判断stockoptout 数组是不是有数据 
				let call = obj => {
					stockoptoutF.push(obj);
				}
				for(var i = 0; i < dtls.length; i++){
					if(!!dtls[i].nums && reg.test(Number(dtls[i].nums))){
						call(dtls[i])
					}
				}
				let valueone = Object.assign({},value,{billId:this.props.billId,dtls:stockoptoutF});
				apiPost(API_FOODING_ERP,"/purorder/invoice",valueone,response => {
					ServiceTips({text:response.message,type:"success"});
					onSaveAndClose(response.data);
				},error => ServiceTips({text:error.message,type:"error"}))
			}
		})
	}
	//初始化数据
	getTableInitData = (billId) => {
		if( !billId) return;
		//单据要求初始化
		apiGet(API_FOODING_ERP,'/purorder/getMtls',{billId:billId},response => {
			this.setState({invoiceList:response.data || []})
		},error => ServiceTips({text:error.message,type:'error'}))
	}
	componentDidMount(){
		let {billId,billType} = this.props;
		this.getTableInitData(billId);
		apiGet(API_FOODING_ERP,'/invoice/dtl/getCount',{billId:billId,billType:this.props.PurOrder.billType},
			(response)=>{
					this.setState({
						visibil:response.data||{}
					});
			},(error)=>{

		});
	}
	/*componetWillUnMount(){
		this.setState({commonList:[]});
	}*/
	// onChange = (num,billId,pre,name,e) => {
	// 	let reg = new RegExp(/^\d+(\.\d+)?$/);
	// 	if(reg.test(Number(e.target.value)) && Number(e.target.value) <= Number(num)){
	// 		let array = calculatePrice(this.state.invoiceList,billId,Number(e.target.value),Number(pre));
	// 		this.setState({invoiceList:array});
	// 	}else{
	// 		//验证不通过时，不知道怎么弄了，你看懂了就改一下，或者你直接改我代码也可以
	// 		return false;
	// 	}
	// }
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps,getFieldValue} = this.props.form;
		let {visibil} =this.state;
		let array = [];
		// for(var i= 0 ;i < this.state.invoiceList.length;i++){
		// 	getFieldProps('dtls['+i+'].id', {
		// 		initialValue: this.state.invoiceList[i].billId
		// 	})
		// 	let obj = Object.assign({},this.state.invoiceList[i],{purQty:<input type="text" style={{width:'100%'}} className="text-input-nowidth"
		// 		{...getFieldProps('dtls['+i+'].nums',{
		// 			validateFirst: true,
		// 			rules: [{required:true},validate],
		// 			onChange:this.onChange.bind(this,this.state.invoiceList[i].purQty,this.state.invoiceList[i].billId,this.state.invoiceList[i].purTaxPrc,'dtls['+i+'].nums'),
		// 			initialValue:this.state.invoiceList[i].purQty || ""})}
		// 		/>});
		// 	array.push(obj);
		// }
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
			<div className={'girdlayout scroll'} style={{height:"344px"}}>
				<div className={'row'}>
					<div className="form-group col-md-4 col-lg-4">
	                   <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400055/*纸质发票号*/)}</label>
						<input type='text' {...getFieldProps('paperNo', {
								validateFirst: true,
								rules: [{required:true}],
                                initialValue:''
                            })} className ={getFieldError('paperNo')?'col-md-8 col-lg-8 text-input-nowidth error-border':'col-md-8 col-lg-8 text-input-nowidth'}/>	                            
					</div>
					<div className="form-group col-md-4 col-lg-4">
	                   <label className={'col-md-4 col-lg-4'}>{I18n.t(400065/*开票日期*/)}</label>
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
					columns={ [{
						title : I18n.t(100379/*产品*/),
						dataIndex : 'mtl'+language,
						key : 'mtl'+language,
						width : '11%',
						render(data,row,index){
							return (<div title={data}>{data}</div>)
						}
					},{
						title : I18n.t(100382/*产品规格*/),
						dataIndex : "basSpeci",
						key : "basSpeci",
						width : "20%",
						render(data,row,index){
							return <div>{data}</div>;
						}
					},{
						title : I18n.t(100319/*采购数量*/),
						dataIndex :"purQty",
						key :"purQty",
						width : "6%",
						ignore_equals: true,
						render(data,row,index){
							getFieldProps('dtls['+index.index+'].id', {
													    initialValue:row.billId
							})
							let validate = (rule, value, callback) => {
								if((parseFloat(value)) <= visibil[row.billId] && parseFloat(value) >= 0){
								   callback([]);
								} else callback([I18n.t(400102/*数量不能大于*/) + visibil[row.billId]]);
							};
							return (<input placeholder=''
												 type="text" {...getFieldProps('dtls['+index.index+'].nums', {
														rules: [{required:true},validate],
													    initialValue:visibil[row.billId]?visibil[row.billId]:''
												})} 
												className={getFieldError('dtls['+index.index+'].nums')?'text-input error-border':'text-input'}
												style ={{width:'100%'}} 
							/>);
						}
					},{
						title : I18n.t(400035/*产品单位*/),
						dataIndex : "uom"+language,
						key : "uom"+language,
						width : "6%",
						render(data,row ,index){
							return data;
						}
					},{
						title : I18n.t(400063/*采购单价含税*/),
						dataIndex : 'purTaxPrc',
						key : "purTaxPrc",
						width : "6%",
						render(data,row ,index){
							return <div>{data?(toDecimal(data) +' '+(row["cnyEnName"] || "")):''}</div>;
						}},{
						title : I18n.t(400103/*采购金额小计*/),
						dataIndex : 'setTaxAgg',
						key : "setTaxAgg",
						ignore_equals: true,
						width : "10%",     
						render(data,row ,index){
							return <div>{getFieldValue('dtls['+index.index+'].nums')?
									parseFloat(getFieldValue('dtls['+index.index+'].nums'))*row.purTaxPrc+' '+(row["cny"+language]||""):data+' '+(row["cny"+language] || "")}</div>
						}
					}]}
					data={this.state.invoiceList||invoiceList}
					checkboxConfig={{show:false}}
					colorFilterConfig={{show : false,dataIndex:'colorType'}}
					followConfig={{show:false}}
				/>
			</div>
			</FormWrapper>);
	}
}
export default createForm()(PurchaseInvoiceDialog);