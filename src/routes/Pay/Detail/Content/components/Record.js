import i18n from './../../../../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../../../components/Form";
//引入弹层
import Dialog from '../../../../../components/Dialog/Dialog';
import Confirm from '../../../../../components/Dialog/Confirm';//删除弹层
//引入select插件
import Select, { Option } from 'rc-select';
//引入table
import Table from "../../../../../components/Table";
//引入分页
import Page from "../../../../../components/Page";
import {apiGet,apiPost,apiForm,API_FOODING_DS,language,pageSize,sizeList, API_FOODING_ERP,toDecimal} from '../../../../../services/apiCall';
import ServiceTips from '../../../../../components/ServiceTips'; // 提示
class Record extends Component{
	constructor(props){
		super(props)
		this.onCancel=this.onCancel.bind(this);
		this.state=this.initState();
		this.reveserClick=this.reveserClick.bind(this);
		var that = this;
	}
	reveserClick(e,Record){
		let tempString=i18n.t(300029/*您确定要撤销吗？*/);
		Confirm(tempString, {
		  done: () => {
			    apiForm(API_FOODING_ERP,'/payment/reverifi',{billId:Record.billDtlId},
			    	(response)=>{
			    		this.props.getOneCall();
			    		this.props.onCancel();
			    		 ServiceTips({text:response.message,type:'sucess'});
			    	},(error)=>{
			    		 ServiceTips({text:error.message,type:'error'});
			    	})
			},
			close:() => {
				console.log('no, close')
			}
		});
	}
	initState(){
		var that = this;
		return {
			columns_party:[{
			title : i18n.t(200827/*付款日期*/),
			dataIndex : 'billDate',
			key : "billDate",
			width : '10%',
			render(data,row,index){
				return new Date(data).Format('yyyy-MM-dd');
			}
		},{
			title : i18n.t(200600/*开户银行*/),
			dataIndex : "bank"+language,
			key : "bank"+language,
			width : "20%",
			render(data,row,index){
				return <div className={'text-ellipsis'}>{data}</div>;
			}
		},{
			title : i18n.t(100500/*银行账号*/),
			dataIndex : "account"+language,
			key : "account"+language,
			width : "20%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200614/*收汇方式*/),
			dataIndex : "payTrmTy"+language,
			key : "payTrmTy"+language,
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200615/*实付金额*/),
			dataIndex : "billAmt",
			key : "billAmt",
			width : "10%",
			render(data,row,index){
				return <div>{toDecimal(data)+' '+that.props.getOne["cny"+language]}</div>;
			}
		},{
			title : i18n.t(200828/*操作人*/),
			dataIndex : "createStaffName",
			key : "createStaffName",
			width : "10%",
			render(data,row,index){
				return data;
			}
		},{
			title : i18n.t(200098/*操作*/),
			dataIndex : "handle",
			key : "handle",
			width : "10%",
			render(data,row,index){
				return <div><i className='foddingicon fooding-reveser-cancal' title={i18n.t(500149/*撤销*/)} onClick={that.reveserClick.bind(this,data,row)}></i></div>
			}
		}]
		}
	}
	componentDidMount(){

	}

	onCancel(){
		const {onCancel} = this.props;
		if(onCancel){
			onCancel();
		}
	}
	render(){
		const {form,data} = this.props;
		const { getFieldProps, getFieldError } = this.props.form;
		const disabled = form.isFieldsValidating() || form.isSubmitting();
		const inputStar=(<span className={''}>*</span>);
		return (<FormWrapper showFooter={true}  onCancel={this.onCancel} showSaveClose={false}>
					<div className="common-party">
						<div className="common-party-table">
							<Table
								columns={this.state.columns_party}
								data={this.props.tableSources}
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

Record = createForm()(Record);

export default Record;
