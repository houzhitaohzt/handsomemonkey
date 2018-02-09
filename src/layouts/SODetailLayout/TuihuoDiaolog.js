import i18n from './../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../components/Form";
//引入弹层
import Dialog from '../../components/Dialog/Dialog';
import Confirm from '../../components/Dialog/Confirm';//删除弹层
//引入select插件
import Select, {Option,ConstMiniSelect} from '../../components/Select';
//引入table
import Table from "../../components/Table";
import NavConnect from '../../components/NavigateTabs/containers/AddContainer';
//引入分页
import Page from "../../components/Page";
import Checkbox from '../../components/CheckBox';
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP} from '../../services/apiCall';
import ServiceTips from '../../components/ServiceTips'; // 提示
class Record extends Component{
	constructor(props){
		super(props)
		this.onCancel=this.onCancel.bind(this);
		var that = this;
		this.onSaveAndClose = this.onSaveAndClose.bind(this);
		this.state ={
			tableSources:[],
			vali:{}
		}
	}
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
			    value = Object.assign({},value,{billId:this.props.getOne.billId});
				apiPost(API_FOODING_ERP,'/saleorderreturn/back',value,
					(response)=>{
						ServiceTips({text:response.message,type:'success'});
						that.props.form.resetFields(); // 清除表单
						this.props.onCancel();
						let {navAddTab,navRemoveTab} =this.props;
						navAddTab({id:7,name:i18n.t(201055/*销售退货详情*/),component:i18n.t(201055/*销售退货详情*/),url:'/salelist/detail'});
						this.props.router.push({pathname:'/salelist/detail',query:{id:response.data}});
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})
	}
	componentDidMount(){
		apiGet(API_FOODING_ERP,'/saleorder/mtl/getList',{billId:this.props.getOne.billId},
			(response)=>{
				this.setState({
					tableSources:response.data
				});

		},(error)=>{

		});
		apiGet(API_FOODING_ERP,'/saleorderreturn/getReturnNum',
			{billId:this.props.getOne.billId},(response)=>{
					this.setState({
						vali:response.data
					});
			},(error)=>{

		});
	}
	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	render(){
		const {form,data} = this.props;
		const { getFieldProps, getFieldError,getFieldValue} = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		let that = this;
		return (<FormWrapper showFooter={true}  onCancel={this.onCancel} onSaveAndClose={this.onSaveAndClose}>
					<div className={'  girdlayout'}>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}><span>*</span>{i18n.t(400099/*退货原因*/)}</label>
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
                                     className ={'currency-btn select-from-currency col-md-9 col-lg-9'}
                                />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(100336/*备注*/)}</label>
								<input placeholder=''
									 type="text" {...getFieldProps('remark', {
										    initialValue:''
									})}
									className={'col-md-9 col-lg-9 text-input-nowidth'}
								/>
							</div>
						</div>
						<div className={'row'}>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(201047/*是否海外退货*/)}</label>
								 <Checkbox
											{...getFieldProps('needSeaOut',{
												initialValue:false
											})}
											checked={this.props.form.getFieldValue("needSeaOut")}
								 />
							</div>
							<div className="form-group col-md-6 col-lg-6">
								<label className={'col-md-3 col-lg-3'}>{i18n.t(201048/*是否物流*/)}</label>
								 <Checkbox
									        style={{lineHeight:'32px'}}
											{...getFieldProps('needLogistics',{
												initialValue:false
											})}
											checked={this.props.form.getFieldValue("needLogistics")}
								 />
							</div>
						</div>
					</div>
					<div className="common-party">
						<div className="common-party-table">
							<Table
								columns={[{
								title : i18n.t(100379/*产品*/),
								dataIndex : 'mtl'+language,
								key : "mtl"+language,
								width : '10%',
								render(data,row,index){
									return data;
								}
							},{
								title : i18n.t(100382/*产品规格*/),
								dataIndex : "basSpeci",
								key : "basSpeci",
								width : "10%",
								render(data,row,index){
									return <div className={'text-ellipsis'}>{data}</div>;
								}
							},{
								title : "已操作数",
								dataIndex : "packag",
								key : "packag",
								width : "10%",
								ignore_equals: true,
								render(data,row,index){
									return <div className={'text-ellipsis'}>{that.state.vali[row.billDtlId]}</div>;
								}
							},{
								title : i18n.t(200846/*销售数量*/),
								dataIndex : "salQty",
								key : "salQty",
								width : "10%",
								render(data,row,index){
									return data;
								}
							},{
								title : i18n.t(400101/*退货数量*/),
								dataIndex : "billAmt",
								key : "billAmt",
								width : "10%",
								ignore_equals: true,
								render(data,row,index){
									getFieldProps('dtls['+index.index+'].id', {
													    initialValue:row.billDtlId
									})
									let validate = (rule, value, callback) => {
										// if(value.trim() === '') return callback([]);
										console.log(that.state.vali[row.billDtlId]);
											if((parseFloat(value)) <= (row.salQty-that.state.vali[row.billDtlId]) && parseFloat(value) >= 0){
											   callback([]);
											} else callback([i18n.t(400102/*数量不能大于*/) + (row.salQty-that.state.vali[row.billDtlId])]);
									};
									return (<input placeholder=''
												 type="text" {...getFieldProps('dtls['+index.index+'].nums', {
														rules: [{required:true},validate],
													    initialValue:(row.salQty-that.state.vali[row.billDtlId])?(row.salQty-that.state.vali[row.billDtlId]):0
												})}
												className={getFieldError('dtls['+index.index+'].nums')?'text-input error-border':'text-input'}
												style ={{width:'100%'}}
											/>);
								}
							},{
								title : i18n.t(400035/*产品单位*/),
								dataIndex : "uom"+language,
								key : "uom"+language,
								width : "10%",
								render(data,row,index){
									return data;
								}
							},{
								title : i18n.t(200847/*含税单价*/),
								dataIndex : "salTaxPrc",
								key : "salTaxPrc",
								width : "10%",
								cny:that.props.getOne["cny"+language],
								render(data,row,index){
									return <div>{data?data+' '+that.props.getOne["cny"+language]:0+that.props.getOne["cny"+language]}</div>;
								}
							},{
								title : i18n.t(201052/*销售金额*/),
								dataIndex : "0",
								key : "0",
								width : "10%",
								ignore_equals: true,
								render(data,row,index){
									return <div>{(row.salTaxPrc*row.salQty)+' '+that.props.getOne["cny"+language]}</div>
								}
							},{
								title : i18n.t(201053/*退货额*/),
								dataIndex : "handle",
								key : "2",
								width : "10%",
								ignore_equals: true,
								render(data,row,index){
									return <div>{getFieldValue('dtls['+index.index+'].nums')?
									parseFloat(getFieldValue('dtls['+index.index+'].nums'))*row.salTaxPrc+' '+that.props.getOne["cny"+language]:0+' '+that.props.getOne["cny"+language]}</div>
								}
							}]}
								data={this.state.tableSources}
								checkboxConfig={{show:false}}
								colorFilterConfig={{show:false}}
								followConfig={{show:false}}
								prefixCls={"rc-confirm-table"}
								scroll={{x:true, y:300}}
							/>
						</div>
					</div>
			</FormWrapper>);
	}
}

Record = createForm()(NavConnect(Record));

export default Record;
