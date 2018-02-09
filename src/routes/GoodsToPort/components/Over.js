import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../../components/Form";
import Dialog from '../../../components/Dialog/Dialog';
//引入select插件
import Select, { Option } from 'rc-select';
import Radio from "../../../components/Radio";
import Calendar from  '../../../components/Calendar/Calendar';
import Table from "../../../components/Table";//Table表格



// ajax
import {permissionsBtn,apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language,commonAjax,} from '../../../services/apiCall';
import ServiceTips from '../../../components/ServiceTips'; // 提示
import {I18n} from "../../../lib/i18n";



class GoodstoPortDialog extends Component{
	constructor(props){
		super(props)
		this.onSaveAndClose=this.onSaveAndClose.bind(this);
		this.onCancel=this.onCancel.bind(this);

		
		// this state  
		this.state = {
			data :[],
			getOneData:{},
		}

		this.columns = [{
			title : I18n.t(400054/*采购单号*/),
			dataIndex : 'no',
			key : "no",
			width : '9%',
			render(data,row,index){
				return (<div className="text-ellipsis">{row.mtl['no']}</div>);
			}
		},{
			title : I18n.t(400008/*销售单号*/),
			dataIndex : "sourceNo",
			key : "sourceNo",
			width : "9%",
			render(data,row,index){
				return (<div className="text-ellipsis">{row.mtl['sourceNo']}</div>);
			}
		},{ 
			title : I18n.t(400037/*采购员*/),
			dataIndex : "saleStaff"+language,
			key : "saleStaff"+language,
			width : "6%",
			render(data,row,index){
				return (<div className="text-ellipsis">{row.mtl['purStaff'+language]}</div>);
			}
		},{ 
			title : I18n.t(100312/*供应商*/),
			dataIndex : "vndBe"+language,
			key : "vndBe"+language,
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis">{row.mtl['vndBe'+language]}</div>);
			}
		},{
			title : I18n.t(100379/*产品*/),
			dataIndex : "mtl"+language,
			key : "mtl"+language,
			width : "10%",
			render(data,row,index){
				return (<div className="text-ellipsis">{row.mtl['mtl'+language]}</div>);
			}
		},{
			title : I18n.t(100319/*采购数量*/),
			dataIndex : "qty",
			key : "qty",
			width : "6%",
			render(data,row,index){
				return String(data)+ ' ' + row.mtl['uomLcName'];
			}
		},{
			title : I18n.t(500140/*已操作数量*/),
			dataIndex : "hasBeenQty",
			key : "hasBeenQty",
			width : "6%",
			render(data,row,index){
				return String(data)+ ' ' + row.mtl['uomLcName'];
			}
		},{
			title : I18n.t(200080/*类型*/),
			dataIndex : "orderTypeName",
			key : "orderTypeName",
			width : "5%",
			render(data,row,index){
				return (<div className="text-ellipsis">{row.mtl['orderTypeName']}</div>);
			}
		}];


	}


	componentDidMount(){
		this.getPage();
	}

	// 页面 刷新
	getPage = ()=>{
 
		let that = this;
		let {checkedData} = this.props;
		apiGet(API_FOODING_ERP,'/shipping/getGoodsInfo',{billId:checkedData['billId']},
			(response)=>{				
				that.setState({	
					data: response.data.outList || [], 
					getOneData: response['data']	
				});
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});	
	}

	// 保存
	onSaveAndClose(){

		let that = this;
		let {getOneData} = this.state;
		const {form, onSaveAndClose,currentPage} = this.props;
		form.validateFields((errors, value) => {
			if(errors){
			}else{
				apiPost(API_FOODING_ERP,'/shipping/receipted',getOneData,
					(response)=>{	
							ServiceTips({text:response.message,type:'success'});
							that.props.form.resetFields(); // 清除表单
							that.props.onCancel(); // 关闭弹框
							that.props.getPage(currentPage); // 刷新页面
					},(errors)=>{
						ServiceTips({text:errors.message,type:'error'});
				});
			}
		})		
	}

	// 取消
	onCancel(){
		this.props.form.resetFields(); // 清除表单
		this.props.onCancel(); // 关闭弹框
	}

	render(){
		const {form} = this.props;
		const {data,radioDefaut} = this.state;
		const { getFieldProps, getFieldError } = this.props.form;

		let dom = (<div className={'  girdlayout'} >
					<div className={'row'}>
						<Table
							columns={this.columns}
							data={data}
							scroll={{x:true, y:260}}
							checkboxConfig={{show:false,checkedAll:this.state.choised,checkedRows:this.state.checkedRows,position:'first'}}
						/>
					</div>
				</div>)
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
				{dom}
			</FormWrapper>);
	}
}

const CommonForm = createForm()(GoodstoPortDialog);

export default CommonForm;

