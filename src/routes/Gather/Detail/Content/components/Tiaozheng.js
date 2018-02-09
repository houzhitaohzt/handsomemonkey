import i18n from './../../../../../lib/i18n';
import React, { Component } from 'react';
const {Table} = require("../../../../../components/Table");
import NavConnect from '../../../../../components/NavigateTabs/containers/AddContainer';
import {createForm,FormWrapper} from '../../../../../components/Form';
// ajax
import {apiGet,apiPost,apiForm,API_FOODING_ERP,language,pageSize,sizeList,toDecimal} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips';
export  class  ActivityDetail extends Component{
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.onTableClick = this.onTableClick.bind(this);
		this.onSaveAndClose = this.onSaveAndClose.bind(this); // 保存
		this.onCancel = this.onCancel.bind(this);
		let that = this;
		this.columns = [{
				title : i18n.t(100181/*款项类型*/),
				dataIndex : 'fundTy'+language,
				key : "fundTy"+language,
				width : '20%',
				render(data,row,index){
					return (<div title={data}>{data}</div>)
				}
			},{
				title : i18n.t(200611/*预计收款金额*/),
				dataIndex : "predictReceAmt",
				key : "predictReceAmt",
				width : "20%",
				render(data,row,index){
					return (<div>{data?toDecimal(data):''}</div>)
				}
			},{
				title : i18n.t(200624/*实际收款金额*/),
				dataIndex : 'receAmt',
				key : "receAmt",
				width : "20%",
				render(data,row ,index){
					return (<div>{data?toDecimal(data):''}</div>)
				}
			},{
				title : i18n.t(400115/*调整金额*/),
				dataIndex : 'adjustAmt',
				key : "adjustAmt",
				width : "30%",
				ignore_equals: true,
				render(data,row,index){
					return (<div>{data?toDecimal(data):''}</div>)
				}
			}];

		this.state = {
			inputValue:'',
			checked:0,
			paddingTop:0,
			scroll:0,
			scrollHeight:0,
			filter:null,
			selectArr:[],
			checkedRows:[],
			choised:false,
			zhubiao:{},
			info:[],
			MeunState:true
		}
	}
	handleChange(e){
	}
	// 保存
	onSaveAndClose(){
		let that = this;
		const {form, onSaveAndClose} = this.props;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_ERP,'/receipt/adjustAmt',value,
					(response)=>{							
						ServiceTips({text:response.message,type:'success'});
						that.props.form.resetFields(); // 清除表单
						that.props.onSaveAndClose(); // 关闭弹框
						this.props.getOne(); // 刷新常规
						 this.props.getShou() //刷新收款计划
                         this.props.getBank() // 刷新其他费用
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})
		
	}
	// 取消
	onCancel(){
		this.props.form.resetFields(); // 清除表单
		this.props.onSaveAndClose(); // 关闭弹框
	}
	onTableClick(value){
		if(this.state.checked == 0){
			this.setState({
				inputValue:value.business + '  '+ value.theme
			})
		}else if(this.state.checked == 1){
			this.setState({
				inputValue:value.business + '  '+ value.theme
			})
		}
	}
	handleResize(height){
		this.setState({
  			paddingTop:!this.state.paddingTop
  		});
  		let padding = 80;
		let sch=document.body.offsetHeight-height-padding;
		let scroll = sch-135;

		this.setState({scrollHeight:sch+'px',scroll:scroll});
	}
	componentDidMount(){
        this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
    };
	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize(0));
  	}
  	componentWillReceiveProps(nextProps){
  		this.handleResize(0);
		window.addEventListener('resize', this.handleResize(0));
  	}
	render(){
			let array = [];
			let {checkedData} = this.props;
			let info = this.props.info || {}
			let zhubiao = this.props.zhubiao;
			let content = <div></div>;
			let that = this;
			const mingxiarray = this.state.mingxiarray || [];
			let {getNFieldProps,getFieldProps,getFieldError,getFieldValue }= this.props.form;
			getFieldProps('billId', {
							            	validateFirst: true,
						                    initialValue:zhubiao?zhubiao.billId:''
			})
			for(var i= 0 ;i< this.props.shoukuanArray.length;i++){
				getFieldProps('planInfo['+i+'].billDtlId', {
							            	validateFirst: true,
						                    initialValue:this.props.shoukuanArray[i].billDtlId,
				})
				let obj = Object.assign({},this.props.shoukuanArray[i],{adjustAmt:<input 
					{...getFieldProps('planInfo['+i+'].adjustAmt',{
																validateFirst: true,
																rules: [{required:true}],
																initialValue:''})}
					/>});
				array.push(obj);
			}
			return (
			<div className="package-action-buttons">
					<FormWrapper showFooter={true} buttonLeft = {this.props.buttonLeft} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel}>
						<div className={'  girdlayout'}>
							  	<div className={'row'}>
									                <div className="form-group col-xs-3 col-md-3">
														<label className={'col-xs-4 col-md-4'}>{i18n.t(400115/*调整金额*/)}</label>
														<input disabled type="text"  {...getFieldProps('adjustAmt', {
														initialValue:zhubiao.adjustAmt  || ''
						                            })} className ={'col-md-8 col-lg-8 text-input-nowidth'}/>
															
													</div>
													

								</div>
						</div>
						<div>
							<div className='item-title'>
								<span className='title'>{i18n.t(200596/*收款计划*/)}</span>
							</div>
						</div>
						<Table
							columns={
								[{
								title : i18n.t(100181/*款项类型*/),
								dataIndex : 'fundTy'+language,
								key : "fundTy"+language,
								width : '20%',
								render(data,row,index){
									return (<div title={data}>{data}</div>)
								}
							},{
								title : i18n.t(200611/*预计收款金额*/),
								dataIndex : "predictReceAmt",
								key : "predictReceAmt",
								width : "20%",
								cny:that.props.zhubiao['cny'+language],
								render(data,row,index){
									return (<div>{data?toDecimal(data)+ ' ' + that.props.zhubiao['cny'+language]:''}</div>)
								}
							},{
								title : i18n.t(200624/*实际收款金额*/),
								dataIndex : 'receAmt',
								key : "receAmt",
								width : "20%",
								cny:that.props.zhubiao['cny'+language],
								render(data,row ,index){
									return (<div>{data?toDecimal(data)+ ' ' + that.props.zhubiao['cny'+language]:''}</div>)
								}
							},{
								title : i18n.t(400115/*调整金额*/),
								dataIndex : 'adjustAmt',
								key : "adjustAmt",
								width : "30%",
								ignore_equals: true,
								render(data,row,index){
									//return data;
									return (<div>{data?toDecimal(data):''}</div>)
								}
							}]
						}
							data={array}
							checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
							colorFilterConfig={{show : false,dataIndex:'colorType'}}
							followConfig={{show:false}}
							scroll={{x:true,y:this.state.scroll}}
							onRowDoubleClick={this.onRowDoubleClick}
						/>
					</FormWrapper>
			</div>
			);

	}

}

export default NavConnect(createForm()(ActivityDetail));

