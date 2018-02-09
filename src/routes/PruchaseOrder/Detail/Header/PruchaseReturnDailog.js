/*
	create by houzhitao
	采购退货
*/
import React, {Component, PropTypes} from "react";
import {createForm,FormWrapper} from "../../../../components/Form";
import Table from "../../../../components/Table";//Table表格
import Select, {Option,ConstMiniSelect} from '../../../../components/Select';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,API_FOODING_DS,API_FOODING_ES,language,toDecimal} from '../../../../services/apiCall';
import ServiceTips from '../../../../components/ServiceTips';
import { I18n } from '../../../../lib/i18n';
class PruchaseReturnDailog extends Component{
	constructor(props){
		super(props)
		let that = this;
		this.state = {
			retrunList:[],
			returnQty:{}
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
				if(!this.state.retrunList.length) return false;
				let dtls = value.dtls,stockoptoutCount = 0,stockoptoutF = [];
				let reg = new RegExp(/^\d+(\.\d+)?$/);
				//判断stockoptout 数组是不是有数据 
				let call = obj => {
					stockoptoutF.push(obj);
				}
				for(var i = 0; i < dtls.length; i++){
					if(!!dtls[i].nums && reg.test(Number(dtls[i].nums)) && Number(dtls[i].nums) ){
						call(dtls[i])
					}
				}
				if(!stockoptoutF.length){
					ServiceTips({text:"退货数量不能全部为零！",type:'error'});
					return false;
				}
				let valueone = Object.assign({},value,{billId:this.props.billId,dtls:stockoptoutF});
				apiPost(API_FOODING_ERP,"/purorderreturn/back",valueone,response => {
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
			this.setState({retrunList:response.data || []})
		},error => ServiceTips({text:error.message,type:'error'}))
	}
	componentWillMount(){
		
	}
	componentDidMount(){
		let {billId,billType} = this.props;
		this.getTableInitData(billId);
	}
	componentWillReceiveProps(nextProps){
		if(this.props.billId !== nextProps.billId){
			this.getTableInitData(nextProps.billId,nextProps.billType);
		}
	}
	/*componetWillUnMount(){
		this.setState({commonList:[]});
	}*/
	render(){
		let that = this;
		const { getFieldProps, getFieldError, getNFieldProps } = this.props.form;
		// let array = [];
		// for(var i= 0 ;i < this.state.retrunList.length;i++){
		// 	getFieldProps('dtls['+i+'].id', {
		// 		initialValue: this.state.retrunList[i].billId
		// 	})
		// 	let obj = Object.assign({},this.state.retrunList[i],{returnCount:<input type="text" style={{width:'100%'}} className={getFieldError('dtls['+i+'].nums')?"text-input-nowidth error-border":"text-input-nowidth"}
		// 		{...getFieldProps('dtls['+i+'].nums',{
		// 			validateFirst: true,
		// 			rules: [{required:true}],
		// 			initialValue:""})}
		// 		/>});
		// 	array.push(obj);
		// }
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
			<div className={'girdlayout scroll'} style={{height:"344px"}}>
				<div className={'row'}>
					<div className="form-group col-md-4 col-lg-4">
	                   <label className={'col-md-4 col-lg-4'}><span>*</span>{I18n.t(400099/*退货原因*/)}</label>
                        <ConstMiniSelect form={this.props.form}
                             pbj={{
                                 apiType: apiPost, host: API_FOODING_DS, uri: '/object/getMiniList',
                                 params: {obj:'com.fooding.fc.enumeration.SalesReturnCause'}
                             }} fieldName="cause"
                             initValueOptions={[]}
                             optionValue={(da, di) => <Option key={di} objValue={{
                                 cause: da.id,
                                 s_label: da.name,
                             }}
                             >{da.name}</Option>} 
                             reles={true}
                             allowClear
                             className ={'currency-btn select-from-currency col-md-8 col-lg-8'}							
                        />                           
					</div>
					<div className="form-group col-md-4 col-lg-4">
	                   <label className={'col-md-4 col-lg-4'}>{I18n.t(100336/*备注*/)}</label>
						<input type='text' {...getFieldProps('remark', {
                                initialValue:''
                            })} className ={'col-md-8 col-lg-8 text-input-nowidth'}/>	                            
					</div>
				</div>	
				<Table
					columns={
						[{
							title :I18n.t(100379/*产品*/),
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
							width : "15%",
							render(data,row,index){
								return <div>{data}</div>;
							}
						},{
							title : I18n.t(100319/*采购数量*/),
							dataIndex :"purQty",
							key :"purQty",
							width : "6%",
							render(data,row,index){
								return (<div>{data}</div>)
							}
						},{
							title : I18n.t(400100/*已退货数量*/),
							dataIndex : "reQty",
							key : "reQty",
							width : "10%",
							render(data,row,index){
								let objReturnQty  = that.props.objReturnQty;
								return (<div>{objReturnQty[row.billId] || "0"}</div>);
							}
						},{
							title : I18n.t(400101/*退货数量*/),
							dataIndex : "returnCount",
							key : "returnCount",
							width : "8%",
							ignore_equals: true,
							render(data,row ,index){
								let objReturnQty  = that.props.objReturnQty;
								getFieldProps('dtls['+index.index+'].id', {
									initialValue: row.billId
								})
								let validate = (rule, value, callback) => {
									if((parseFloat(value)) <= (parseFloat(row.purQty) - parseFloat(objReturnQty[row.billId])) && parseFloat(value) >= 0){
									callback([]);
									} else callback([I18n.t(400102/*数量不能大于*/) + parseFloat(row.purQty)]);
								};
								return (<input 
									type= "text"
									{...getFieldProps('dtls['+index.index+'].nums',{
										validateFirst: true,
										rules: [{rules:true},validate],
										initialValue:"0"})}
										style={{width:'100%'}} className={getFieldError('dtls['+index.index+'].nums')?"text-input-nowidth error-border":"text-input-nowidth"}
								/>)
							}
						},{
							title :I18n.t(400035/*产品单位*/),
							dataIndex : "uom"+language,
							key : "uom"+language,
							width : "8%",
							render(data,row ,index){
								return data;
							}
						},{
							title : I18n.t(400063/*采购单价含税*/),
							dataIndex : 'purTaxPrc',
							key : "purTaxPrc",
							width : "10%",
							"text-align":"right",
							render(data,row ,index){
								return <div>{data?(toDecimal(data) +' '+ (row["cny"+language]||"")):''}</div>;
							}},{
							title : I18n.t(400103/*采购金额小计*/),
							dataIndex : 'setTaxAgg',
							key : "setTaxAgg",
							width : "10%",
							"text-align":"right",
							render(data,row ,index){
								return <div>{data?(data+' '+ (row["cny"+language]||"")):''}</div>;
							}
						}]
					}
					data={this.state.retrunList}
					checkboxConfig={{show:false}}
					colorFilterConfig={{show : false,dataIndex:'colorType'}}
					followConfig={{show:false}}
				/>
			</div>
			</FormWrapper>);
	}
}
export default createForm()(PruchaseReturnDailog);