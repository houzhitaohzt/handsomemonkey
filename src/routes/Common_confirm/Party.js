import i18n from './../../lib/i18n';
import React,{PropTypes, Component} from 'react';
import {createForm,FormWrapper} from "../../components/Form";
import Dialog from '../../components/Dialog/Dialog';
import Select, { Option } from 'rc-select';
import Table from "../../components/Table";
import Page from "../../components/Page";

import ProductSelect from "../../components/FindGridSelect";
import ServiceTips from '../../components/ServiceTips'; // 提示
import {pageSize,sizeList,apiGet,apiPost,apiForm,API_FOODING_DS,API_FOODING_ERP,language} from '../../services/apiCall';


class ProviderParty extends Component{

	constructor(props){
		super(props);

		// init state 
		this.state = {
			currentPage:1, // 当前页
			totalPages: 1, // 总页数
			pageSize: pageSize, // 每页 多少条			
			data:[]
		};
	}

	componentDidMount(){
		
	}	
	
	static propTypes={
		//data: PropTypes.object,
	}

	static defaultProps = {

		columns_party:[{
			title : i18n.t(100354/*客户代码*/),
			dataIndex : 'code',
			key : "code",
			width : '20%',
			render(data,row,index){
				return (<div className="text-ellipsis" >{data}</div>);
			}
		},{
			title : i18n.t(100355/*客户名称*/),
			dataIndex : "localName",
			key : "localName",
			width : "45%",
			render(data,row,index){
				return (<div className="text-ellipsis" >{data}</div>);
			}
		},{
			title : i18n.t(100087/*国家*/),
			dataIndex : "country", 
			key : "country",
			width : "30%",
			render(data,row,index){
				return (<div className="text-ellipsis" >{data ? data['localName'] : ''}</div>);
			}
		}],

	}

	searchHandle = ()=>{
		const {form, onSaveAndClose} = this.props;
		let that = this;
		form.validateFields((errors, value) => {
			if(errors) return;
			that.getPage({platformMtlId:value['mtl']});
		})
	}

	onSaveAndClose = ()=>{
		let that = this;
		let {ident} = this.props;
		let select = this.refs.product.getSelectArr();

		if(!select.length) {
			ServiceTips({text:'至少选择一条数据！',type:'info'});	
			return;
		} 

		// 判断页面
		switch(ident){
			case 'client': // 客户
				var URL = '/customer/leadIn';
			break;
			case 'provider': // 供应商
				var URL = '/vendor/leadIn';
			break;			
			default:
		}

		apiForm(API_FOODING_DS,URL,{id: select.map(o=>{ return o['id']})},
			(response)=>{				
				that.onCancel();
				ServiceTips({text:response.message,type:'success'});
				that.props.getPage();
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});
	}

	onCancel = ()=>{
		this.props.onCancel();
	}

	getPage = (data={})=>{
		let that = this;
		let {ident} = this.props;

		// 判断页面
		switch(ident){
			case 'client': // 客户
				var forSaleOrPurchase = 1;
			break;
			case 'provider': // 供应商
				var forSaleOrPurchase = 0;
			break;			
			default:
		}

		apiGet(API_FOODING_DS,'/platformMaterial/getVendorsOrCustomers',Object.assign({pageSize: that.state.pageSize,currentPage: that.state.currentPage,forSaleOrPurchase:forSaleOrPurchase},data),
			(response)=>{		
				that.setState({ data: response.data['data'] || [] });
			},(errors)=>{
				ServiceTips({text:errors.message,type:'error'});
		});		
	}

	render(){

		let that = this;
		const {form,data} = this.props;
		const {getFieldProps,getFieldError} = this.props.form;
		return (<FormWrapper showFooter={true} onSaveAndClose={this.onSaveAndClose} onCancel={this.onCancel} >
					<div className="common-party">
						<div className="row">
							<div className={'col-md-4'}>
								<label className="col-md-2">{i18n.t(100379/*产品*/)}</label>
								<div className="col-md-9">
									<ProductSelect 
										ref ="productSelect"
										name = "mtl"
										form={this.props.form}
										width={'379%'}
										className={getFieldError("mtl")?"currency-btn select-from-currency text-input-nowidth error-border":'currency-btn select-from-currency text-input-nowidth'}
										titleClass={"col-md-12 col-lg-12"}
										url='/platformMaterial/search'
										search ='/platformMaterial/search'
									/>
								</div>
							</div>
							<div className="col-md-1 col-md-offset-1">
								<button type="button" onClick={this.searchHandle}>{i18n.t(100406/*查询*/)}</button>
							</div>
						</div>
						<div className="common-party-table">
							<Table
								ref = "product"
								columns={this.props.columns_party}
								data={this.state.data}
								checkboxConfig={{show:true}}
								prefixCls={"rc-confirm-table"}
								scroll={{x:false, y:210}}
							/>
						</div>
						<div className="common-party-page">
							<Page 
								currentPage={this.state.currentPage}
								totalPages={this.state.totalPages} 
								sizeList={sizeList}
								currentSize={this.state.pageSize}
								pageSizeChange={(num)=>{
									that.setState({ pageSize: Number.parseInt(num),currentPage:1 },()=>that.getPage());
								}} 
								backClick={(num)=>{
									that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());
								}} 
								nextClick={(num)=>{
									that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());										
								}}
								goChange={(num)=>{
									that.setState({ currentPage: Number.parseInt(num) },()=>that.getPage());																				
								}}								
							/>
						</div>
					</div>
			</FormWrapper>);
	}
}

ProviderParty = createForm()(ProviderParty);

export default ProviderParty;


